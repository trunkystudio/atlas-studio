export const sameLocation=(a,b)=>!!a&&!!b&&['document','project','view','source','page'].every(k=>a[k]===b[k]);
export function visit(history,location){
 if(sameLocation(history.entries[history.index],location))return history;
 const entries=[...history.entries.slice(0,history.index+1),location].slice(-100);
 return {entries,index:entries.length-1};
}
export function travel(history,direction,valid=()=>true){
 if(![-1,1].includes(direction))return history;
 for(let index=history.index+direction;index>=0&&index<history.entries.length;index+=direction){if(valid(history.entries[index]))return {...history,index};}
 return history;
}
export function headings(document){const rows=[];let previous=0;document.descendants((node,pos)=>{if(node.type.name==='heading'){const level=node.attrs.level;rows.push({pos,level,text:node.textContent||'Untitled heading',gap:level>previous+1});previous=level;}});return rows;}
export function backupHealth(data,now=Date.now()){
 const available=data.backups.filter(b=>b.available&&Number.isFinite(new Date(b.time).getTime())).sort((a,b)=>new Date(b.time)-new Date(a.time));
 const latest=available[0];return {latest,stale:!!latest&&now-new Date(latest.time).getTime()>7*86400000,missing:data.missing.length};
}
// Sections include text and subsections until the next equal/higher-rank heading.
export function sectionMove(document,pos,direction){
 if(![-1,1].includes(direction))return null;
 const rows=headings(document).filter(r=>document.resolve(r.pos).depth===0),index=rows.findIndex(r=>r.pos===pos),row=rows[index];
 if(!row)return null;
 const end=rows.slice(index+1).find(r=>r.level<=row.level)?.pos??document.content.size;
 if(direction===-1){let previous;for(let i=index-1;i>=0;i--){if(rows[i].level<=row.level){previous=rows[i];break;}}return previous?.level===row.level?{from:pos,to:end,insert:previous.pos}:null;}
 const next=rows.find(r=>r.pos===end);if(next?.level!==row.level)return null;
 const after=rows.slice(rows.indexOf(next)+1).find(r=>r.level<=row.level)?.pos??document.content.size;
 return {from:pos,to:end,insert:after};
}
export function moveSection(transaction,move){
 if(!move)return transaction;
 const content=transaction.doc.slice(move.from,move.to).content,destination=move.insert>move.from?move.insert-(move.to-move.from):move.insert;
 return transaction.delete(move.from,move.to).insert(destination,content).setMeta('atlasSectionMove',true);
}

