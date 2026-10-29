const fs = require('node:fs');
const path = require('node:path');
const { randomUUID,createHash } = require('node:crypto');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const ID = /^[a-zA-Z0-9_-]{1,100}$/;
const cleanName = s => {let n=String(s || 'Untitled').replace(/[<>:"/\\|?*\x00-\x1f]/g, '-').slice(0,120).trim().replace(/[. ]+$/,'') || 'Untitled';return /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(n)?'_'+n:n;};
const words = s => (String(s || '').trim().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || []).length;
const today = () => { const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
function doc(title, html, type='article') {return {id:randomUUID(),projectId:'welcome',title,html,text:html.replace(/<[^>]*>/g,' '),type,tags:[],status:'draft',date:'',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};}
function seed() {return {schema:1,projects:[{id:'welcome',name:'My writing desk',color:'#c5714c',goal:500,deadline:''}],docs:[
  doc('A little room to think','<h2>Welcome to your writing desk.</h2><p>This is Folio Studio, a private space for your ideas, research, and longer writing. Everything stays on this computer.</p><p>Start a project, collect a few cards, and let the connections appear. There are no accounts, no subscriptions, and no AI writing tools.</p><h2>Make yourself at home</h2><ul><li>Write fiction, fan fiction, poetry, articles, essays, research or work documents. Use optional templates, or start blank.</li><li>Use <strong>[[double brackets]]</strong> to link to another note by title.</li><li>Add hierarchical tags such as <strong>research/books</strong>.</li><li>Use the view menu to open Connections, Timeline, or Knowledge cards to see your work differently.</li></ul><h2>Your words, always yours</h2><p>Folio saves automatically. Revision history keeps checkpoints, and the Atlas Studio menu makes complete backups, including files. Markdown, Word, PDF, HTML, and EPUB exports are available from the top bar.</p><p>See [[The first small step]] when you are ready to begin.</p>'),
  {...doc('The first small step','<p>A good project begins with one clear question.</p><p>What do you want to understand, explain, or create? Write a sentence, then make a card for each supporting idea.</p><p>Related: [[A little room to think]] and [[Keep a commonplace book]].</p>','card'),tags:['practice'],status:'ready'},
  {...doc('Keep a commonplace book','<p>Collect observations, useful quotations, and questions. A small card can hold one idea without deciding where it belongs yet.</p><blockquote><p>Give each thought a place, then give it a connection.</p></blockquote><p>Link related cards with [[The first small step]].</p>','card'),tags:['research/notes'],status:'ready'},
  {...doc('Outline your next chapter','<h2>The question</h2><p>What will this chapter help the reader understand?</p><h2>The evidence</h2><p>Add references from the Research view. Import a PDF or create a bibliography entry, then insert citations into your writing.</p><h2>The shape</h2><ol><li>Open with a clear observation.</li><li>Develop the idea with evidence.</li><li>Leave the reader with a useful next step.</li></ol>'),tags:['writing'],date:today()}
],refs:[],attachments:[],events:[],graphPositions:{},settings:{...seedSettings()},activity:{}};}
function validate(data) {
  if(!data || data.schema!==1 || !Array.isArray(data.projects) || !Array.isArray(data.docs)) throw new Error('This is not a supported Folio library.');
  if(data.docs.length>50000 || data.projects.length>10000) throw new Error('Library item limit exceeded.');
  const seen=new Set();
  if(data.events!==undefined&&!Array.isArray(data.events))throw new Error('Invalid timeline events.');
  for(const item of [...data.projects,...data.docs,...(data.refs||[]),...(data.attachments||[]),...(data.events||[])]) {
    if(!item || !ID.test(item.id) || seen.has(item.id)) throw new Error('Library contains an invalid or duplicate identifier.');
    seen.add(item.id);
  }
  const projects=new Set(data.projects.map(p=>p.id));
  const byId=new Map(data.docs.map(d=>[d.id,d]));
  for(const d of data.docs) {
    if(!projects.has(d.projectId)) throw new Error('A document has no valid project.');
    if(typeof d.title!=='string' || typeof d.html!=='string' || d.html.length>15000000 || typeof d.text!=='string') throw new Error('A document is malformed or too large.');
    if(!Array.isArray(d.tags) || d.tags.some(t=>typeof t!=='string')) throw new Error('Document tags must be text.');
    const seen=new Set([d.id]);let parent=d.parentId;let depth=0;while(parent){const p=byId.get(parent);if(!p||p.projectId!==d.projectId||p.type==='card')throw new Error('A manuscript section has an invalid parent.');if(seen.has(parent)||++depth>32)throw new Error('Manuscript hierarchy contains a cycle or is too deep.');seen.add(parent);parent=p.parentId;}
  }
  for(const a of data.attachments||[]) if(!ID.test(a.file || '') || typeof a.name!=='string') throw new Error('Invalid attachment metadata.');
  for(const e of data.events||[])if(!projects.has(e.projectId)||typeof e.title!=='string'||typeof e.description!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.date))throw new Error('Invalid timeline event.');
  const positions=data.graphPositions||{};if(typeof positions!=='object'||Array.isArray(positions))throw new Error('Invalid graph positions.');for(const [id,p]of Object.entries(positions))if(!ID.test(id)||!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||Math.abs(p.x)>100000||Math.abs(p.y)>100000)throw new Error('Invalid graph position.');
  for(const key of ['projectTemplates','documentTemplates','bulkHistory','citationStyles'])if(data[key]!==undefined&&(!Array.isArray(data[key])||data[key].length>1000))throw new Error('Invalid '+key+' collection.');
  for(const style of data.citationStyles||[])if(!ID.test(style.id)||style.file!==style.id+'.csl'||typeof style.name!=='string')throw new Error('Invalid citation style metadata.');
  for(const d of data.docs){if(d.comments!==undefined&&(!Array.isArray(d.comments)||d.comments.length>5000||d.comments.some(c=>!ID.test(c.id)||typeof c.text!=='string'||c.text.length>100000)))throw new Error('Invalid document comments.');if(d.properties!==undefined&&(!Array.isArray(d.properties)||d.properties.length>100||d.properties.some(f=>!ID.test(f.id)||typeof f.name!=='string'||f.name.length>200)))throw new Error('Invalid document properties.');}
  const settings={...seedSettings(),...data.settings};if(data.settings?.atlasThemeVersion!==1){settings.theme='dark';settings.atlasThemeVersion=1;}
  return {...data,docs:data.docs.map((d,i)=>({...d,order:Number.isFinite(d.order)?d.order:i})),refs:data.refs||[],attachments:data.attachments||[],events:data.events||[],graphPositions:positions,activity:data.activity||{},settings};
}
function seedSettings(){return {theme:'dark',atlasThemeVersion:1,font:'serif',fontSize:18,spellcheck:true,dailyGoal:750,onboardingVersion:0,sidebarWidth:268,detailsWidth:270,detailsOpen:false,reducedMotion:false,tourStep:-1};}
function atomicWrite(filename,data) {
  const tmp=`${filename}.${randomUUID()}.tmp`;
  const fd=fs.openSync(tmp,'wx');
  try {fs.writeFileSync(fd,data);fs.fsyncSync(fd);} finally {fs.closeSync(fd);}
  try {fs.renameSync(tmp,filename);} catch(e) {fs.rmSync(tmp,{force:true});throw e;}
}
class LibraryStore {
  constructor(folder) {this.folder=folder;fs.mkdirSync(folder,{recursive:true});fs.mkdirSync(path.join(folder,'attachments'),{recursive:true});fs.mkdirSync(path.join(folder,'history'),{recursive:true});this.file=path.join(folder,'library.json');this.state=null;this.recovery=null;this.diskHash=null;}
  load(){
    if(!fs.existsSync(this.file)){this.state=validate(seed());this.state.settings.initialSetup=true;atomicWrite(this.file,JSON.stringify(this.state));this.diskHash=digest(fs.readFileSync(this.file));this.dailyBackup();return this.state;}
    try {const raw=JSON.parse(fs.readFileSync(this.file,'utf8'));if(raw.settings?.atlasThemeVersion!==1){const before=this.file+'.pre-atlas-1.1.backup';if(!fs.existsSync(before))fs.copyFileSync(this.file,before);}this.state=validate(raw);}catch(e){
      const backup=this.file+'.bak';
      if(!fs.existsSync(backup)) throw new Error('Your library could not be read. The original files have been preserved in '+this.folder+'. Move the damaged library.json aside, reopen Atlas Studio, then use Atlas Studio menu > Restore a backup copy to restore a .folio backup. '+e.message);
      this.state=validate(JSON.parse(fs.readFileSync(backup,'utf8')));
      fs.copyFileSync(this.file,this.file+'.recovery-'+Date.now());
      atomicWrite(this.file,JSON.stringify(this.state));this.recovery='Recovered the last valid automatic backup. The damaged file was preserved.';
    }this.diskHash=digest(fs.readFileSync(this.file));this.dailyBackup();return this.state;
  }
  dailyBackup(force=false){const dir=path.join(this.folder,'daily-backups');fs.mkdirSync(dir,{recursive:true});const dest=path.join(dir,today()+'.json');if(force||!fs.existsSync(dest))atomicWrite(dest,JSON.stringify(this.state));}
  save(input){
    const next=validate(structuredClone(input));
    const old=this.state || this.load();if(this.diskHash!==digest(fs.readFileSync(this.file)))throw new Error('Save conflict: the library changed outside Atlas Studio. Your unsaved work is still in this window. Export it before reopening the library.');this.dailyBackup();
    next.activity={...old.activity};
    const before=new Map(old.docs.map(d=>[d.id,d]));
    let added=0;
    for(const d of next.docs){
      const prior=before.get(d.id);
      if(prior && (prior.html!==d.html || prior.title!==d.title)) {
        this.snapshot(prior,false);d.updatedAt=new Date().toISOString();
        added+=Math.max(0,words(d.text)-words(prior.text));
      }else if(!prior&&!d.importedFrom) added+=words(d.text);
    }
    if(added) next.activity[today()]=(next.activity[today()]||0)+added;
    // Preserve the previous successfully parsed state rather than a potentially damaged file.
    atomicWrite(this.file+'.bak',JSON.stringify(old));
    atomicWrite(this.file,JSON.stringify(next));
    this.diskHash=digest(fs.readFileSync(this.file));this.state=next;return {savedAt:new Date().toISOString(),activity:next.activity};
  }
  history(id){if(!ID.test(id))throw new Error('Invalid document.');const p=path.join(this.folder,'history',id+'.json');return fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):[];}
  snapshot(d,force=true){const list=this.history(d.id);if(!force && list.length && Date.now()-new Date(list[0].savedAt).getTime()<120000)return;list.unshift({id:randomUUID(),savedAt:new Date().toISOString(),title:d.title,html:d.html,text:d.text,comments:structuredClone(d.comments||[]),properties:structuredClone(d.properties||[]),layout:d.layout,direction:d.direction});atomicWrite(path.join(this.folder,'history',d.id+'.json'),JSON.stringify(list.slice(0,60)));}
  attachmentPath(id){const a=this.state.attachments.find(a=>a.id===id);if(!a || !ID.test(a.file))throw new Error('Unknown attachment.');return path.join(this.folder,'attachments',a.file);}
}
module.exports={LibraryStore,validate,seed,words,cleanName,atomicWrite,ID};
