const {app,BrowserWindow,ipcMain,dialog,shell,protocol,net,Menu}=require('electron');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {randomUUID}=require('node:crypto');
const {LibraryStore,validate,cleanName,atomicWrite,ID}=require('./store.cjs');
const JSZip=require('jszip');
const {runJob}=require('./jobs.cjs');
const {planImport}=require('./import-plan.cjs');
const previews=new Map();
const {safeHtml,xml,portableDocument,markdownDocument,wordDocument,MAX_IMAGE_BYTES}=require('./export.cjs');
protocol.registerSchemesAsPrivileged([{scheme:'atlas-resource',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true,stream:true}},{scheme:'folio-file',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true,stream:true}}]);
if(process.env.FOLIO_DATA_DIR)app.setPath('userData',path.resolve(process.env.FOLIO_DATA_DIR));
else app.setPath('userData',path.join(app.getPath('appData'),'Folio Studio'));
require('./dictionaries.cjs').seedDictionaries(app);
let proRuntime;
let win,store,allowClose=false,closePending=false,uiReady=false;
const external=url=>{try{const u=new URL(url);if(['https:','http:','mailto:'].includes(u.protocol))shell.openExternal(url);}catch{}};
function chooseStore(){
  const conf=path.join(app.getPath('userData'),'workspace.json');let folder=path.join(app.getPath('userData'),'Library');
  if(fs.existsSync(conf)){const p=JSON.parse(fs.readFileSync(conf,'utf8'));if(typeof p.folder==='string')folder=p.folder;}
  store=new LibraryStore(folder);store.load();
}
function sendLoad(){return {state:store.state,folder:store.folder,recovery:store.recovery,version:app.getVersion()};}
function register(name,fn){ipcMain.handle('folio:'+name,async(event,...args)=>{if(event.sender!==win.webContents)throw new Error('Unknown caller.');return fn(...args);});}
async function exportDocument(doc,format,json){
  if(!doc || typeof doc.title!=='string' || typeof doc.html!=='string')throw new Error('Invalid document.');
  const exts={md:'md',txt:'txt',html:'html',pdf:'pdf',docx:'docx',epub:'epub'};
  if(!exts[format])throw new Error('Unsupported export.');
  const result=await dialog.showSaveDialog(win,{title:'Export document',defaultPath:cleanName(doc.title)+'.'+exts[format],filters:[{name:format.toUpperCase(),extensions:[exts[format]]}]});
  if(result.canceled)return null;
  if(doc.html.length>50000000)throw new Error('This export exceeds the 50 MB text limit. Export individual documents instead.');
  const exportOptions={resolveAttachment:id=>{const a=store.state.attachments.find(a=>a.id===id);if(!a)return null;const p=store.attachmentPath(id);if(!fs.existsSync(p))throw new Error('An image attachment is missing. Restore it before exporting.');if(fs.statSync(p).size>MAX_IMAGE_BYTES)throw new Error('An image exceeds the 20 MB export limit.');return {bytes:fs.readFileSync(p)};}};
  let output;
  if(format==='txt')output=await require('./publication.cjs').plainPublication(doc);
  if(format==='md')output=await runJob('export',{doc,format,folder:store.folder,attachments:store.state.attachments});
  if(format==='html')output=await runJob('export',{doc,format,folder:store.folder,attachments:store.state.attachments});
  if(format==='docx')output=Buffer.from(await runJob('export',{doc,format,folder:store.folder,attachments:store.state.attachments}));
  if(format==='pdf'){
    const html=await runJob('export',{doc,format:'html',folder:store.folder,attachments:store.state.attachments});
    const print=new BrowserWindow({show:false,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,backgroundThrottling:false}});
    try{
      await print.loadURL('data:text/html;charset=utf-8,'+encodeURIComponent(html));
      await print.webContents.executeJavaScript('Promise.all([document.fonts.ready, ...Array.from(document.images, image => image.decode().catch(() => {}))]).then(() => true)');
      const preset=require('./publication.cjs').layout(doc.exportPreset);output=await print.webContents.printToPDF({printBackground:true,pageSize:preset.pageSize,preferCSSPageSize:true,displayHeaderFooter:preset.pageNumbers,headerTemplate:'<span></span>',footerTemplate:'<div style="width:100%;text-align:center;font-size:9px;color:#555"><span class="pageNumber"></span></div>'});
    }finally{print.destroy();}
  }
  if(format==='epub'){
    const publication=await require('./publication.cjs').preparePublication(doc),preset=publication.preset,ebookText=await require('./publication.cjs').plainPublication(doc);const zip=new JSZip(),uid=randomUUID();zip.file('mimetype','application/epub+zip',{compression:'STORE'});
    zip.file('META-INF/container.xml','<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
    zip.file('OEBPS/content.opf',`<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">urn:uuid:${uid}</dc:identifier><dc:title>${xml(doc.title)}</dc:title><dc:language>${xml(publication.language)}</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z/,'Z')}</meta></metadata><manifest><item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/></manifest><spine><itemref idref="chapter"/></spine></package>`);
    zip.file('OEBPS/nav.xhtml',`<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><ol><li><a href="chapter.xhtml">${xml(doc.title)}</a></li></ol></nav></body></html>`);
    // XHTML-safe text paragraphs keep the ebook portable without external files or scripts.
    zip.file('OEBPS/chapter.xhtml',`<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${xml(doc.title)}</title><style>body{font-family:${preset.font};font-size:${preset.fontSize}pt;line-height:${preset.lineHeight}}</style></head><body><h1>${xml(doc.title)}</h1>${String(ebookText).split(/\n+/).map(p=>'<p>'+xml(p)+'</p>').join('')}</body></html>`);output=await zip.generateAsync({type:'nodebuffer'});
  }
  atomicWrite(result.filePath,output);return result.filePath;
}
function handlers(){
 register('exportGuide',async()=>{const result=await dialog.showSaveDialog(win,{title:'Save printable Atlas guide',defaultPath:'Atlas-Studio-User-Guide.html',filters:[{name:'Offline HTML guide',extensions:['html']}]});if(result.canceled)return null;atomicWrite(result.filePath,fs.readFileSync(path.join(__dirname,'../build/docs/Atlas-Studio-User-Guide.html')));return result.filePath;});
 register('finishClose',ok=>{closePending=false;if(ok){allowClose=true;setImmediate(()=>win.close());}return true;});
 register('windowAction',(action)=>{if(action==='minimize')win.minimize();if(action==='maximize')win.isMaximized()?win.unmaximize():win.maximize();if(action==='close')win.close();return {maximized:win.isMaximized()};});
 register('onboard',mode=>{if(!['blank','tutorial','continue'].includes(mode))throw new Error('Unknown welcome choice.');const previous=store.state;const fresh=previous.settings.initialSetup===true&&previous.settings.onboardingVersion!==2;let next=structuredClone(previous),focusId=null,projectId=null;
 if(mode!=='continue'){const template=require('./store.cjs').seed(),pid=randomUUID();const project={id:pid,name:mode==='tutorial'?'Atlas Studio tutorial':'Untitled project',color:'#9293ff',goal:750,deadline:''};const docs=mode==='tutorial'?template.docs.map((d,i)=>({...d,id:randomUUID(),projectId:pid,order:i,importedFrom:'Tutorial',html:d.html.replaceAll('Folio Studio','Atlas Studio').replaceAll('Folio saves','Atlas Studio saves'),text:d.text.replaceAll('Folio Studio','Atlas Studio')})):[];if(fresh)next={...next,projects:[project],docs,refs:[],attachments:[],events:[],graphPositions:{},activity:{}};else{next.projects.push(project);next.docs.push(...docs);}focusId=docs[0]?.id||null;projectId=pid;}
 next.settings={...next.settings,initialSetup:false,onboardingVersion:2,tourStep:mode==='tutorial'?0:-1};store.save(next);if(fresh)store.dailyBackup(true);return {...sendLoad(),focusId,focusProjectId:projectId};});
 register('previewAtlas',async()=>{const r=await dialog.showOpenDialog(win,{title:'Preview Atlas library import',filters:[{name:'Atlas library',extensions:['json','db']}]});if(r.canceled)return null;const incoming=await runJob('atlas',{path:r.filePaths[0]});const token=randomUUID();previews.clear();previews.set(token,{incoming,folder:store.folder});const plan=planImport(store.state,incoming);return {token,projects:incoming.projects.map(p=>p.name),documents:incoming.docs.length,events:incoming.events.length,duplicates:plan.skipped};});
 register('commitAtlas',({token,mode})=>{const pending=previews.get(token);if(!pending||pending.folder!==store.folder)throw new Error('The preview expired. Preview the import again.');if(!['skip','copy'].includes(mode))throw new Error('Choose how to handle duplicates.');const plan=planImport(store.state,pending.incoming,mode);const safety=path.join(store.folder,'before-atlas-import-'+Date.now()+'.json');atomicWrite(safety,JSON.stringify(store.state));const next={...store.state,projects:[...store.state.projects,...plan.projects],docs:[...store.state.docs,...plan.docs],events:[...store.state.events,...plan.events],graphPositions:{...store.state.graphPositions,...plan.graphPositions}};store.save(next);for(const d of plan.docs){const records=pending.incoming.revisions[d.id];if(records?.length)atomicWrite(path.join(store.folder,'history',d.id+'.json'),JSON.stringify(records));}previews.delete(token);return {...sendLoad(),focusProjectId:plan.focusProjectId,focusId:plan.docs[0]?.id||null,imported:plan.docs.length,skipped:plan.skipped};});

 register('importAtlas',async()=>{const r=await dialog.showOpenDialog(win,{title:'Import an Atlas library as new projects',defaultPath:path.join(app.getPath('appData'),'TrunkyAtlasDesktop'),filters:[{name:'Atlas backup or SQLite library',extensions:['json','db']}]});if(r.canceled)return null;const {readAtlas,convertAtlas}=require('./atlas-import.cjs');const result=await convertAtlas(readAtlas(r.filePaths[0]));const safety=path.join(store.folder,'before-atlas-import-'+Date.now()+'.json');atomicWrite(safety,JSON.stringify(store.state));for(const [id,history]of Object.entries(result.revisions))if(history.length)atomicWrite(path.join(store.folder,'history',id+'.json'),JSON.stringify(history));delete result.revisions;return {...result,safetyBackup:safety};});
 register('load',()=>{uiReady=true;return sendLoad();});
 register('save',s=>store.save(s));
 register('history',id=>store.history(id));
 register('checkpoint',id=>{const d=store.state.docs.find(d=>d.id===id);if(!d)throw new Error('Document not found.');store.snapshot(d);return store.history(id);});
 register('openFolder',()=>shell.openPath(store.folder));
 register('exportDocument',exportDocument);
 register('pickLibrary',async()=>{const choice=await dialog.showOpenDialog(win,{title:'Choose a folder for your Atlas Studio library',properties:['openDirectory','createDirectory']});if(choice.canceled)return null;const next=new LibraryStore(choice.filePaths[0]);next.load();atomicWrite(path.join(app.getPath('userData'),'workspace.json'),JSON.stringify({folder:next.folder}));store=next;return sendLoad();});
 register('importDocuments',async()=>{
   const r=await dialog.showOpenDialog(win,{title:'Import writing',properties:['openFile','multiSelections'],filters:[{name:'Writing',extensions:['md','markdown','txt','html','htm','docx']}]});if(r.canceled)return [];
   const out=[];for(const file of r.filePaths){if(fs.statSync(file).size>20000000)throw new Error('Import files must be smaller than 20 MB.');const ext=path.extname(file).toLowerCase();let html;
     if(ext==='.docx')html=(await require('mammoth').convertToHtml({path:file})).value;
     else {const t=fs.readFileSync(file,'utf8');html=['.md','.markdown'].includes(ext)?(await import('marked')).marked.parse(t):ext==='.txt'?'<p>'+xml(t).replace(/\n/g,'<br>')+'</p>':t;}
     out.push({title:path.basename(file,path.extname(file)),html:safeHtml(html)});
   }return out;
 });
 register('attach',async()=>{
   const r=await dialog.showOpenDialog(win,{title:'Add local research files',properties:['openFile','multiSelections'],filters:[{name:'PDF, images and text',extensions:['pdf','png','jpg','jpeg','webp','gif','txt','md','csv']}]});if(r.canceled)return [];
   const out=[];for(const f of r.filePaths){const ext=path.extname(f).toLowerCase();if(!['.pdf','.png','.jpg','.jpeg','.webp','.gif','.txt','.md','.csv'].includes(ext))throw new Error('Unsupported research file.');if(fs.statSync(f).size>150000000)throw new Error('Each file must be smaller than 150 MB.');const id=randomUUID();fs.copyFileSync(f,path.join(store.folder,'attachments',id),fs.constants.COPYFILE_EXCL);out.push({id,file:id,name:path.basename(f),size:fs.statSync(f).size,kind:ext.slice(1),createdAt:new Date().toISOString(),notes:''});}return out;
 });
 register('openAttachment',id=>{const a=store.state.attachments.find(a=>a.id===id);if(!a)throw new Error('File not found.');shell.showItemInFolder(store.attachmentPath(id));});
 register('backup',async()=>{
   const r=await dialog.showSaveDialog(win,{title:'Back up complete library',defaultPath:'Atlas-Studio-backup-'+new Date().toISOString().slice(0,10)+'.folio',filters:[{name:'Atlas Studio library',extensions:['folio']}]});if(r.canceled)return null;
   const bytes=Buffer.from(await runJob('backup',{state:store.state,folder:store.folder}));atomicWrite(r.filePath,bytes);const recordFile=path.join(store.folder,'backup-records.json');let records=[];try{records=JSON.parse(fs.readFileSync(recordFile,'utf8'));}catch{}records.unshift({path:r.filePath,name:path.basename(r.filePath),time:new Date().toISOString(),size:bytes.length,sha256:require('crypto').createHash('sha256').update(bytes).digest('hex')});atomicWrite(recordFile,JSON.stringify(records.slice(0,30)));return r.filePath;
 });
 register('restore',async()=>{const r=await dialog.showOpenDialog(win,{title:'Restore a backup copy',filters:[{name:'Atlas backup',extensions:['folio']}]});if(r.canceled)return null;await proRuntime.restoreArchive(r.filePaths[0]);return sendLoad();});
 register('importReferences',async()=>{const r=await dialog.showOpenDialog(win,{title:'Import CSL-JSON bibliography',filters:[{name:'CSL JSON (Zotero export)',extensions:['json']}]});if(r.canceled)return [];if(fs.statSync(r.filePaths[0]).size>20000000)throw new Error('Bibliography is too large.');const data=JSON.parse(fs.readFileSync(r.filePaths[0],'utf8'));if(!Array.isArray(data))throw new Error('Choose an array of CSL-JSON references.');return data.map(x=>({id:randomUUID(),csl:x,title:String(x.title||'Untitled'),author:(x.author||[]).map(a=>a.literal||[a.given,a.family].filter(Boolean).join(' ')).join(', '),year:String(x.issued?.['date-parts']?.[0]?.[0]||''),publisher:String(x.publisher||x['container-title']||''),url:String(x.URL||''),doi:String(x.DOI||''),type:String(x.type||'book')}));});
}
function createWindow(){
 win=new BrowserWindow({width:1520,height:980,minWidth:1100,minHeight:720,show:!process.env.FOLIO_TEST_MODE,frame:false,autoHideMenuBar:true,title:'Atlas Studio',backgroundColor:'#0c0e14',icon:path.join(__dirname,'../build/icon.ico'),webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,backgroundThrottling:!process.env.FOLIO_TEST_MODE,spellcheck:store.state.settings.spellcheck!==false}});
 win.webContents.session.setSpellCheckerDictionaryDownloadURL('atlas-resource://bundle/dictionaries/');
 win.webContents.setWindowOpenHandler(({url})=>{external(url);return {action:'deny'};});
 win.on('close',event=>{if(!allowClose&&uiReady&&!win.webContents.isCrashed()){event.preventDefault();if(!closePending){closePending=true;win.webContents.send('studio:before-close');}}});
 win.webContents.on('render-process-gone',()=>{uiReady=false;});
 win.webContents.on('will-navigate',(e,url)=>{if(url!==win.webContents.getURL()){e.preventDefault();external(url);}});
 // No application network calls, remote content, analytics, accounts or update service.
 win.webContents.session.webRequest.onBeforeRequest({urls:['http://*/*','https://*/*','ws://*/*','wss://*/*']},(_,done)=>done({cancel:true}));
 win.webContents.session.setPermissionRequestHandler((sender,permission,cb,details)=>cb(sender===win.webContents&&permission==='media'&&(details.mediaTypes||[]).length>0&&details.mediaTypes.every(type=>type==='audio')));
 win.webContents.session.setPermissionCheckHandler((sender,permission,origin,details)=>sender===win.webContents&&permission==='media'&&details.mediaType==='audio');
 Menu.setApplicationMenu(null);
 win.webContents.on('context-menu',(_,p)=>{const items=[];if(p.misspelledWord){for(const suggestion of p.dictionarySuggestions.slice(0,5))items.push({label:suggestion,click:()=>win.webContents.replaceMisspelling(suggestion)});items.push({label:'Add to personal dictionary',click:()=>win.webContents.session.addWordToSpellCheckerDictionary(p.misspelledWord)},{type:'separator'});}items.push({role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'});Menu.buildFromTemplate(items).popup({window:win});});
 win.loadFile(path.join(__dirname,'../dist/index.html'));
}
const lock=app.requestSingleInstanceLock();if(!lock)app.quit();else{
 app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus();}});
 app.whenReady().then(()=>{try{chooseStore();protocol.handle('atlas-resource',async request=>{try{const u=new URL(request.url),root=path.resolve(__dirname,'../dist'),file=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(!file.startsWith(root+path.sep))return new Response('Unavailable',{status:403});const response=await net.fetch(pathToFileURL(file).href),headers=new Headers(response.headers),ext=path.extname(file);headers.set('Access-Control-Allow-Origin','*');headers.set('Content-Type',ext==='.js'?'application/javascript':ext==='.wasm'?'application/wasm':'application/octet-stream');return new Response(response.body,{status:response.status,headers});}catch{return new Response('Unavailable',{status:404});}});protocol.handle('folio-file',async request=>{try{const u=new URL(request.url);const id=u.hostname;const a=store.state.attachments.find(a=>a.id===id);if(!a)return new Response('Missing file',{status:404});const response=await net.fetch(pathToFileURL(store.attachmentPath(id)).href);const mime={pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',txt:'text/plain',md:'text/plain',csv:'text/plain'}[a.kind]||'application/octet-stream';const headers=new Headers(response.headers);headers.set('Content-Type',mime);headers.set('Access-Control-Allow-Origin','*');headers.set('Content-Security-Policy',"default-src 'none'");return new Response(response.body,{status:response.status,headers});}catch{return new Response('File unavailable',{status:404});}});handlers();createWindow();proRuntime=require('./studio-pro.cjs').install({app,win,register,getStore:()=>store,setStore:next=>{store=next;},sendLoad});}catch(e){dialog.showErrorBox('Atlas Studio could not open your library',e.message);app.quit();}});
 app.on('window-all-closed',()=>app.quit());
}

