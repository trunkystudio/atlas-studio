const fs=require('node:fs');
const {randomUUID}=require('node:crypto');
const sanitize=require('sanitize-html');
const STATUS={idea:'idea',draft:'draft',review:'revising',done:'ready',revising:'revising',ready:'ready'};
function readAtlas(filename){
 if(fs.statSync(filename).size>150000000)throw new Error('Atlas imports are limited to 150 MB.');
 if(/\.json$/i.test(filename))return JSON.parse(fs.readFileSync(filename,'utf8'));
 const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync(filename,{readOnly:true});
 try{db.exec('BEGIN');const tables=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r=>r.name));let data;
 if(tables.has('library')){const row=db.prepare('SELECT payload FROM library WHERE id=1').get();if(!row)throw new Error('Atlas library is empty.');data=JSON.parse(typeof row.payload==='string'?row.payload:Buffer.from(row.payload).toString('utf8'));}
 else if(tables.has('metadata')&&tables.has('objects')){const row=db.prepare("SELECT value FROM metadata WHERE key='root'").get();if(!row)throw new Error('Atlas library is empty.');const meta=JSON.parse(row.value);data={...meta.other};for(const kind of ['projects','documents','cards','events'])data[kind]=db.prepare('SELECT payload FROM objects WHERE kind=? ORDER BY ordinal,id').all(kind).map(r=>JSON.parse(r.payload));}
 else throw new Error('This database is not a recognized Atlas library.');db.exec('COMMIT');return data;
 }finally{db.close();}
}
async function convertAtlas(data){
 if(!data||data.version!==1||!Array.isArray(data.projects)||!data.projects.length||!Array.isArray(data.documents)||!Array.isArray(data.cards)||!Array.isArray(data.events))throw new Error('Choose an Atlas version 1 JSON backup or an Atlas database.');
 if(data.projects.length>10000||data.documents.length+data.cards.length+data.events.length>50000)throw new Error('Atlas library has too many items.');
 const {marked}=await import('marked');const {parseDocument,DomUtils}=await import('htmlparser2');const now=new Date().toISOString(),projectMap=new Map(),noteMap=new Map();
 for(const p of data.projects){if(!p||typeof p.id!=='string'||typeof p.name!=='string'||projectMap.has(p.id))throw new Error('Atlas has invalid or duplicate projects.');projectMap.set(p.id,randomUUID());}
 const projects=data.projects.map(p=>({id:projectMap.get(p.id),name:p.name,color:'#9293ff',goal:Math.max(0,Number(p.goal)||10000),deadline:'',description:String(p.description||''),importedFrom:'Atlas'}));
 const docs=[];const graphPositions={};const revisions={};
 for(const [index,n]of [...data.documents,...data.cards].entries()){
   if(!n||typeof n.id!=='string'||noteMap.has(n.id)||typeof n.title!=='string'||typeof n.body!=='string'||!projectMap.has(n.projectId)||n.body.length>15000000)throw new Error('Atlas contains an invalid note or project reference.');
   const id=randomUUID();noteMap.set(n.id,id);const type=index<data.documents.length?'article':'card';const html=sanitize(marked.parse(n.body),{allowedTags:sanitize.defaults.allowedTags.concat(['img']),allowedAttributes:{a:['href'],img:['alt']},allowedSchemes:['http','https','mailto']});
   const text=DomUtils.textContent(parseDocument(html.replace(/<\/(?:p|div|h[1-6]|li)>/g,'\n'))).trim();
   docs.push({id,projectId:projectMap.get(n.projectId),title:n.title,html,text,type,category:String(n.category||''),tags:Array.isArray(n.tags)?n.tags.filter(t=>typeof t==='string'):[],status:STATUS[n.status]||'idea',date:'',order:Number.isFinite(n.order)?n.order:index,createdAt:date(n.createdAt,now),updatedAt:date(n.updatedAt,now),importedFrom:'Atlas'});
   if(Number.isFinite(n.x)&&Number.isFinite(n.y))graphPositions[id]={x:n.x,y:n.y};
   if(Array.isArray(n.revisions))revisions[id]=n.revisions.slice(-60).reverse().filter(r=>typeof r.body==='string').map(r=>({id:randomUUID(),savedAt:date(r.at,now),title:String(r.title||n.title),html:sanitize(marked.parse(r.body)),text:r.body}));
 }
 const events=data.events.map(e=>{if(!e||typeof e.title!=='string'||!projectMap.has(e.projectId)||!/^\d{4}-\d{2}-\d{2}$/.test(e.date))throw new Error('Atlas contains an invalid timeline event.');return {id:randomUUID(),projectId:projectMap.get(e.projectId),title:e.title,date:e.date,description:String(e.description||''),lane:String(e.lane||'Story'),createdAt:date(e.createdAt,now)};});
 return {projects,docs,events,graphPositions,revisions,counts:{projects:projects.length,documents:docs.length,events:events.length}};
}
function date(value,fallback){const n=new Date(value);return Number.isFinite(n.getTime())?n.toISOString():fallback;}
module.exports={readAtlas,convertAtlas};
