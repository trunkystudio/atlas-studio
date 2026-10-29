import React from 'react';
import {headings} from './workspace-navigation.mjs';
export default function DocumentOutline({editor}){
 const rows=headings(editor.state.doc);
 return <nav className="document-outline" aria-label="Document outline"><strong>In this document</strong>{rows.length?rows.map(row=><button type="button" key={row.pos} style={{paddingInlineStart:12+(row.level-1)*14}} title={row.gap?'Heading level skipped before this section':row.text} onMouseDown={e=>e.preventDefault()} onClick={()=>{editor.chain().setTextSelection(row.pos+1).scrollIntoView().run();editor.view.focus();}}>{row.text}{row.gap&&<span aria-label="Heading level skipped"> · !</span>}</button>):<p>Add headings using Paragraph style to navigate your document.</p>}</nav>;
}


