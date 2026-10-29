import React,{useEffect,useState} from 'react';
import {ChevronRight,ChevronDown,ArrowUp,ArrowDown} from 'lucide-react';
import {closeHistory} from '@tiptap/pm/history';
import {headings,sectionMove,moveSection} from './workspace-navigation.mjs';
export default function DocumentOutline({editor}){
 const [collapsed,setCollapsed]=useState([]),rows=headings(editor.state.doc);
 useEffect(()=>{const map=({transaction:tr})=>{if(!tr.docChanged)return;setCollapsed(previous=>tr.getMeta('atlasSectionMove')?[]:previous.map(pos=>tr.mapping.map(pos)).filter(pos=>headings(tr.doc).some(r=>r.pos===pos)));};editor.on('transaction',map);return()=>editor.off('transaction',map);},[editor]);
 let hiddenBelow=7;const visible=rows.filter(row=>{if(row.level>hiddenBelow)return false;hiddenBelow=collapsed.includes(row.pos)?row.level:7;return true;});
 const selected=rows.filter(r=>r.pos<editor.state.selection.from).at(-1)?.pos;
 const jump=pos=>{editor.chain().setTextSelection(pos+1).scrollIntoView().run();editor.view.focus();};
 const move=(row,direction)=>{const operation=sectionMove(editor.state.doc,row.pos,direction);if(!operation)return;editor.view.dispatch(moveSection(closeHistory(editor.state.tr),operation));jump(direction<0?operation.insert:operation.insert-(operation.to-operation.from));editor.view.dispatch(closeHistory(editor.state.tr));};
 return <nav className="document-outline" aria-label="Document outline"><strong>In this document</strong><p className="outline-hint">Move a section with its text and subsections. Undo restores the move.</p>{visible.length?visible.map(row=>{const children=rows.some((r,i)=>rows[i-1]?.pos===row.pos&&r.level>row.level);return <div key={row.pos} className="outline-row" style={{paddingInlineStart:(row.level-1)*12}}>
 {children?<button className="outline-fold" aria-label={(collapsed.includes(row.pos)?'Expand ':'Collapse ')+row.text} aria-expanded={!collapsed.includes(row.pos)} onClick={()=>setCollapsed(list=>list.includes(row.pos)?list.filter(p=>p!==row.pos):[...list,row.pos])}>{collapsed.includes(row.pos)?<ChevronRight size={13}/>:<ChevronDown size={13}/>}</button>:<span className="outline-fold-space"/>}
 <button className="outline-jump" aria-current={selected===row.pos?'location':undefined} title={row.gap?'Heading level skipped before this section':row.text} onMouseDown={e=>e.preventDefault()} onClick={()=>jump(row.pos)}>{row.text}{row.gap&&<span aria-label="Heading level skipped"> · !</span>}</button>
 <span className="outline-actions">{[-1,1].map(direction=><button key={direction} aria-label={'Move section '+row.text+(direction<0?' up':' down')} disabled={!sectionMove(editor.state.doc,row.pos,direction)} onMouseDown={e=>e.preventDefault()} onClick={()=>move(row,direction)}>{direction<0?<ArrowUp size={12}/>:<ArrowDown size={12}/>}</button>)}</span>
 </div>;}):<p>Add headings using Paragraph style to navigate your document.</p>}</nav>;
}

