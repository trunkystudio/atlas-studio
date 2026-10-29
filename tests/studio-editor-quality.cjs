const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {_electron}=require('playwright-core'),{seed}=require('../electron/store.cjs');
(async()=>{
 const root=path.resolve(__dirname,'..'),data=path.join(root,'qa-editor-quality',String(Date.now()));
 fs.mkdirSync(path.join(data,'Library'),{recursive:true});
 const state=seed(),base=state.docs[0];state.docs=[{...base,id:'paste-test',title:'Paste test',html:'<p><strong>Original</strong></p>',text:'Original'}];
 state.settings={...state.settings,onboardingVersion:2,initialSetup:false,lastDoc:'paste-test',lastProject:base.projectId,lastView:'writing'};
 fs.writeFileSync(path.join(data,'Library/library.json'),JSON.stringify(state));
 let app;try{
  const env={...process.env,FOLIO_DATA_DIR:data,FOLIO_TEST_MODE:'1'};delete env.ELECTRON_RUN_AS_NODE;
  app=await _electron.launch({args:[root],env,timeout:45000});const page=await app.firstWindow(),errors=[];
  page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
  await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].showInactive());
  await(await page.context().newCDPSession(page)).send('Emulation.setFocusEmulationEnabled',{enabled:true});
  const editor=page.locator('.tiptap');await editor.waitFor();assert(await page.getByRole('button',{name:'Undo',exact:true}).isDisabled());
  async function mode(value){await page.getByLabel('Atlas Studio menu').click();await page.getByRole('menuitem',{name:'Preferences',exact:true}).click();await page.getByLabel('Default paste behavior').selectOption(value);await page.getByLabel('Close dialog',{exact:true}).click();}
  async function paste(text,html){await editor.evaluate((el,{text,html})=>{const data=new DataTransfer();data.setData('text/plain',text);if(html)data.setData('text/html',html);el.dispatchEvent(new ClipboardEvent('paste',{clipboardData:data,bubbles:true,cancelable:true}));},{text,html});}
  await mode('plain');await editor.press('Control+End');await paste('PLAIN\n\n<tag> & text','<p><strong>RICH</strong></p>');
  assert((await editor.innerText()).includes('<tag> & text'));assert(!(await editor.locator('strong').innerText()).includes('PLAIN'));
  await page.getByRole('button',{name:'Undo',exact:true}).click();assert.equal(await editor.innerText(),'Original');
  await mode('match');await editor.press('Control+End');await editor.press('ArrowLeft');await paste('MATCH','<em>ignored</em>');
  assert((await editor.locator('strong').innerText()).includes('MATCH'));await page.getByRole('button',{name:'Undo',exact:true}).click();
  await mode('keep');await editor.press('Control+End');await paste('RICH','<p><span data-comment-id="old-comment"><em>RICH</em></span><script>window.pasteAttack=1</script></p>');
  assert.equal(await editor.locator('em').innerText(),'RICH');assert.equal(await editor.locator('[data-comment-id]').count(),0);assert.equal(await page.evaluate(()=>window.pasteAttack),undefined);
  await page.getByRole('button',{name:'Undo',exact:true}).click();assert.equal(await editor.innerText(),'Original');
  await editor.press('Control+End');await editor.evaluate(el=>el.dispatchEvent(new KeyboardEvent('keydown',{key:'v',code:'KeyV',ctrlKey:true,shiftKey:true,bubbles:true,cancelable:true})));await paste('OVERRIDE','<p><em>OVERRIDE</em></p>');assert(!(await editor.locator('strong').innerText()).includes('OVERRIDE'));assert.equal(await editor.locator('em').count(),0);await page.getByRole('button',{name:'Undo',exact:true}).click();
  await page.getByLabel('Paragraph style',{exact:true}).selectOption('h6');await page.getByLabel('Paragraph style',{exact:true}).selectOption('h6');assert.equal(await editor.locator('h6').innerText(),'Original');
  await page.keyboard.press('Control+s');await page.waitForFunction(()=>document.querySelector('.save-status')?.textContent.includes('Saved locally'),null,{polling:50,timeout:15000});
  const saved=JSON.parse(fs.readFileSync(path.join(data,'Library/library.json'),'utf8'));assert.equal(saved.settings.pasteMode,'keep');assert(saved.docs[0].html.includes('<h6>'));
  assert.deepEqual(errors,[]);console.log('PASS live paste preference changes, plain/match/rich paste, safe HTML, Undo, heading 6 and saved preferences');
 }finally{await app?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
