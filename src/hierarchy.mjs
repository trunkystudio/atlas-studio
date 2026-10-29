import {ordered} from './atlas-model.mjs';

export const isWriting=d=>d.type!=='folder';
export function descendants(docs,id){const ids=new Set([id]);let changed=true;while(changed){changed=false;for(const d of docs)if(d.parentId&&ids.has(d.parentId)&&!ids.has(d.id)){ids.add(d.id);changed=true;}}return ids;}
export function parentChoices(docs,id,projectId){const blocked=descendants(docs,id);return ordered(docs.filter(d=>!d.deleted&&d.projectId===projectId&&d.type!=='card'&&!blocked.has(d.id)));}
export function moveInto(docs,id,parentId){const item=docs.find(d=>d.id===id);if(!item)throw Error('This item is unavailable.');if(parentId&&!parentChoices(docs,id,item.projectId).some(d=>d.id===parentId))throw Error('Choose a parent in this project outside the item’s own contents.');const order=Math.max(-1,...docs.filter(d=>d.projectId===item.projectId&&(d.parentId||'')===(parentId||'')).map(d=>d.order||0))+1;return docs.map(d=>d.id===id?{...d,parentId:parentId||'',order}:d);}
export function manuscriptItems(docs,root){const ids=root?descendants(docs,root):null;return ordered(docs.filter(d=>!d.deleted&&(!ids||ids.has(d.id)))).filter(d=>d.type!=='card'&&d.type!=='folder');}
export function trashBranch(docs,id){const ids=descendants(docs,id);return docs.map(d=>ids.has(d.id)&&!d.deleted?{...d,deleted:true,trashRoot:id}:d);}
export function restoreBranch(docs,id){const item=docs.find(d=>d.id===id),ids=new Set([id]);for(const d of docs)if(d.trashRoot===id)ids.add(d.id);let parent=item?.parentId;while(parent){ids.add(parent);parent=docs.find(d=>d.id===parent)?.parentId;}return docs.map(d=>ids.has(d.id)?{...d,deleted:false,trashRoot:undefined}:d);}
