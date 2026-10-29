const norm=s=>String(s||'').trim().toLocaleLowerCase().replace(/\s+/g,' ');
const signature=d=>norm(d.title)+'|'+String(d.text||'').trim().replace(/\s+/g,' ')+'|'+String(d.html||'').replace(/>\s+</g,'><').trim()+'|'+d.type;
function planImport(state,incoming,mode='skip'){
 const projectMap=new Map(),projects=[];for(const p of incoming.projects){const existing=mode==='skip'&&state.projects.find(x=>norm(x.name)===norm(p.name));projectMap.set(p.id,existing?.id||p.id);if(!existing)projects.push(p);}
 const duplicates=new Map(),docs=[];for(const d of incoming.docs){const projectId=projectMap.get(d.projectId);const found=mode==='skip'&&state.docs.find(x=>!x.deleted&&x.projectId===projectId&&signature(x)===signature(d));if(found)duplicates.set(d.id,found.id);else docs.push({...d,projectId,order:state.docs.length+docs.length});}
 for(const d of docs)if(d.parentId)d.parentId=duplicates.get(d.parentId)||d.parentId;
 const events=incoming.events.map(e=>({...e,projectId:projectMap.get(e.projectId)})).filter(e=>mode!=='skip'||!state.events.some(x=>!x.deleted&&x.projectId===e.projectId&&norm(x.title)===norm(e.title)&&x.date===e.date&&norm(x.description)===norm(e.description)));
 const kept=new Set(docs.map(d=>d.id)),graphPositions=Object.fromEntries(Object.entries(incoming.graphPositions||{}).filter(([id])=>kept.has(id)));
 return {projects,docs,events,graphPositions,skipped:duplicates.size,focusProjectId:projectMap.get(incoming.projects[0]?.id)};
}
module.exports={planImport};
