import {Fragment,Slice} from '@tiptap/pm/model';
import {closeHistory} from '@tiptap/pm/history';
const formatting=new Set(['bold','italic','underline','strike','highlight','code']);
export function pasteTextTransaction(state,text,mode){
 if(!['plain','match'].includes(mode)||typeof text!=='string'||!text.length)return null;
 const value=text.replace(/\r\n?/g,'\n');
 const tr=closeHistory(state.tr);
 if(state.selection.$from.parent.type.spec.code)return tr.insertText(value).setMeta('uiEvent','paste');
 const marks=mode==='match'?(state.storedMarks||state.selection.$from.marks()).filter(mark=>formatting.has(mark.type.name)):[];
 const paragraphs=value.split('\n').map(line=>state.schema.nodes.paragraph.create(null,line?state.schema.text(line,marks):null));
 return tr.replaceSelection(new Slice(Fragment.fromArray(paragraphs),1,1)).setMeta('uiEvent','paste').scrollIntoView();
}
