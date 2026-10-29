export const sameLocation=(a,b)=>!!a&&!!b&&['document','project','view','source','page'].every(k=>a[k]===b[k]);
export function visit(history,location){
 if(sameLocation(history.entries[history.index],location))return history;
 const entries=[...history.entries.slice(0,history.index+1),location].slice(-100);
 return {entries,index:entries.length-1};
}
export function travel(history,direction,valid=()=>true){
 for(let index=history.index+direction;index>=0&&index<history.entries.length;index+=direction){if(valid(history.entries[index]))return {...history,index};}
 return history;
}
export function headings(document){const rows=[];let previous=0;document.descendants((node,pos)=>{if(node.type.name==='heading'){const level=node.attrs.level;rows.push({pos,level,text:node.textContent||'Untitled heading',gap:level>previous+1});previous=level;}});return rows;}
export function backupHealth(data,now=Date.now()){
 const available=data.backups.filter(b=>b.available&&Number.isFinite(new Date(b.time).getTime())).sort((a,b)=>new Date(b.time)-new Date(a.time));
 const latest=available[0];return {latest,stale:!!latest&&now-new Date(latest.time).getTime()>7*86400000,missing:data.missing.length};
}
