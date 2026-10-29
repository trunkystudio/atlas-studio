export const uid=()=>crypto.randomUUID();
export const wordCount=s=>(String(s||'').trim().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)||[]).length;
export const plain=html=>{const d=new DOMParser().parseFromString(html,'text/html');for(const el of d.body.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,tr,blockquote,br,hr'))el.append(d.createTextNode('\n'));return (d.body.textContent||'').replace(/\n{3,}/g,'\n\n').trim();};
export const stamp=()=>new Date().toISOString();
export function createDoc(projectId,type='article',title='Untitled',html='<p></p>'){return {id:uid(),projectId,type,title,html,text:plain(html),tags:[],status:'draft',date:'',createdAt:stamp(),updatedAt:stamp(),pinned:false};}
export function linkIds(doc,docs){
 const ids=new Set();
 for(const m of doc.text.matchAll(/\[\[([^\]]+)\]\]/g)){const matches=docs.filter(d=>!d.deleted&&d.type!=='folder'&&d.title.trim().toLowerCase()===m[1].trim().toLowerCase());const local=matches.filter(d=>d.projectId===doc.projectId);const candidates=local.length?local:matches;if(candidates.length===1)ids.add(candidates[0].id);}
 for(const m of doc.html.matchAll(/folio:\/\/note\/([a-zA-Z0-9_-]+)/g))if(docs.some(d=>!d.deleted&&d.type!=='folder'&&d.id===m[1]))ids.add(m[1]);
 return [...ids];
}
export function citation(ref,style='apa') {const author=ref.author||'Anonymous';if(style==='mla')return `${author}. “${ref.title}.” ${ref.publisher||''}${ref.year?', '+ref.year:''}.`;return `${author} (${ref.year||'n.d.'}). ${ref.title}.${ref.publisher?' '+ref.publisher+'.':''}${ref.doi?' https://doi.org/'+ref.doi:ref.url?' '+ref.url:''}`;}
export {templates} from './writing-templates.mjs';
