const fs = require('node:fs');
const {preparePublication,htmlNotes,nativeEndnotes}=require('./publication.cjs');
const path = require('node:path');
const sanitize = require('sanitize-html');
const katex = require('katex');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, ImageRun, ExternalHyperlink, FootnoteReferenceRun, Footer, PageNumber, PageBreak, AlignmentType } = require('docx');
const Turndown = require('turndown');
const ID = /^[a-zA-Z0-9_-]{1,100}$/;
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 100 * 1024 * 1024;
const xml = s => String(s).replace(/[<>&"']/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;' }[c]));
const safeHtml = html => sanitize(String(html), {
  allowedTags: sanitize.defaults.allowedTags.concat(['img','h1','h2','span','del','input']),
  allowedAttributes: { '*':['class','dir','id','data-comment-id','data-note-id','data-note-kind','data-note-text','data-note-number','data-word-note-id','data-citation-id','data-citation-ids','data-citation-locator','data-citation-style','data-bibliography-id','data-bibliography-style'], a:['href'], img:['src','alt','width','height'], input:['type','checked','disabled'], div:['data-math','class'], ul:['data-type'], li:['data-type','data-checked'] },
  allowedSchemes: ['http','https','mailto','folio'],
  allowedSchemesByTag: { img:['folio-file','data'] },
  allowProtocolRelative: false
});
let parserPromise;
async function parse(html) {
  parserPromise ||= import('htmlparser2');
  const { parseDocument } = await parserPromise;
  return parseDocument(safeHtml(html), { decodeEntities:true });
}
const textOf = n => n.type === 'text' ? n.data : (n.children || []).map(textOf).join('');
function serialize(n) {
  if(n.type === 'text') return xml(n.data);
  if(n.type === 'root') return (n.children || []).map(serialize).join('');
  if(n.type !== 'tag') return '';
  const attrs=Object.entries(n.attribs || {}).map(([k,v]) => ` ${k}="${xml(v)}"`).join('');
  if(['img','br','hr','input'].includes(n.name)) return `<${n.name}${attrs}>`;
  return `<${n.name}${attrs}>${(n.children || []).map(serialize).join('')}</${n.name}>`;
}
function sniffImage(bytes) {
  if(bytes.length >= 24 && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return {kind:'png',mime:'image/png',width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
  if(bytes.length >= 10 && /^GIF8[79]a/.test(bytes.subarray(0,6).toString('ascii'))) return {kind:'gif',mime:'image/gif',width:bytes.readUInt16LE(6),height:bytes.readUInt16LE(8)};
  if(bytes.length >= 12 && bytes[0]===0xff && bytes[1]===0xd8) {
    let i=2;
    while(i+8<bytes.length) {
      if(bytes[i]!==0xff) { i++; continue; }
      const marker=bytes[i+1];
      if(marker===0xd9 || marker===0xda) break;
      if(marker===0x00 || marker===0xd8 || marker===0x01 || (marker>=0xd0 && marker<=0xd7)) { i+=2; continue; }
      const length=bytes.readUInt16BE(i+2);
      if(length<2 || i+2+length>bytes.length) break;
      if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) return {kind:'jpg',mime:'image/jpeg',width:bytes.readUInt16BE(i+7),height:bytes.readUInt16BE(i+5)};
      i+=length+2;
    }
    return {kind:'jpg',mime:'image/jpeg',width:480,height:320};
  }
  if(bytes.length>=12 && bytes.subarray(0,4).toString()==='RIFF' && bytes.subarray(8,12).toString()==='WEBP') return {kind:'webp',mime:'image/webp',width:480,height:320};
  throw new Error('An image is not a supported PNG, JPEG, GIF or WebP file.');
}
async function prepare(html, {resolveAttachment, renderMath=false}={}) {
  const root=await parse(html); let total=0;
  const images=new Map();
  function walk(node) {
    if(node.type==='tag' && node.name==='img') {
      const src=node.attribs.src||'';
      let bytes;
      if(src.startsWith('folio-file:')) {
        let u; try { u=new URL(src); } catch { throw new Error('An image link is malformed.'); }
        const id=u.hostname;
        if(!ID.test(id) || u.username || u.password || u.port || (u.pathname!=='/file' && u.pathname!=='' && u.pathname!=='/')) throw new Error('An image link is not a known library attachment.');
        const attachment=resolveAttachment?.(id);
        if(!attachment) throw new Error('An image attachment is missing. Restore it before exporting this document.');
        bytes=Buffer.from(attachment.bytes || attachment);
      } else {
        const m=/^data:image\/(?:png|jpe?g|gif|webp);base64,([A-Za-z0-9+/=\s]+)$/i.exec(src);
        if(!m) throw new Error('Export supports embedded images and local library images only.');
        if(m[1].length > MAX_IMAGE_BYTES * 1.4) throw new Error('An image exceeds the 20 MB export limit.');
        bytes=Buffer.from(m[1],'base64');
      }
      total+=bytes.length;
      if(bytes.length>MAX_IMAGE_BYTES || total>MAX_TOTAL_IMAGE_BYTES) throw new Error('Image export limit exceeded: 20 MB per image, 100 MB per document.');
      const info=sniffImage(bytes);
      const uri=`data:${info.mime};base64,${bytes.toString('base64')}`;
      node.attribs.src=uri; images.set(node,{...info,bytes});
    }
    if(node.type==='tag' && node.name==='a' && !/^(https?:|mailto:|#)/i.test(node.attribs.href||'')) delete node.attribs.href;
    if(node.type==='tag' && node.name==='div' && Object.hasOwn(node.attribs,'data-math')) {
      const latex=node.attribs['data-math'];
      if(latex.length>20000) throw new Error('An equation exceeds the 20,000 character export limit.');
      if(renderMath) node.mathHTML=katex.renderToString(latex,{throwOnError:false,displayMode:true,trust:false,maxExpand:1000,output:'htmlAndMathml'});
    }
    for(const child of node.children || []) walk(child);
  }
  walk(root);
  function output(node) {
    if(node.mathHTML) return `<div class="math-block">${node.mathHTML}</div>`;
    if(node.type==='text') return xml(node.data);
    if(node.type==='root') return (node.children||[]).map(output).join('');
    if(node.type!=='tag') return '';
    const attrs=Object.entries(node.attribs||{}).map(([k,v])=>` ${k}="${xml(v)}"`).join('');
    if(['img','br','hr','input'].includes(node.name)) return `<${node.name}${attrs}>`;
    return `<${node.name}${attrs}>${(node.children||[]).map(output).join('')}</${node.name}>`;
  }
  return {root,images,html:output(root)};
}
let mathCSS;
function katexCSS() {
  if(mathCSS) return mathCSS;
  const folder=path.dirname(require.resolve('katex'));
  const css=fs.readFileSync(path.join(folder,'katex.min.css'),'utf8');
  mathCSS=css.replace(/src:([^;}]+)/g,(whole,src)=>{
    const m=/url\(fonts\/([a-zA-Z0-9_-]+\.woff2)\)/.exec(src);
    if(!m) return whole;
    const bytes=fs.readFileSync(path.join(folder,'fonts',m[1]));
    return `src:url(data:font/woff2;base64,${bytes.toString('base64')}) format("woff2")`;
  });
  return mathCSS;
}
async function portableDocument(doc, options={}) {
  const publication=await preparePublication(doc),preset=publication.preset;const prepared=await prepare(await htmlNotes(publication),{...options,renderMath:true});
  const math=prepared.html.includes('class="math-block"')?katexCSS():'';
  return `<!doctype html><html><head><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'"><title>${xml(doc.title)}</title><style>${math}\n@page{size:${preset.pageSize};margin:${preset.margin}mm}body{max-width:760px;margin:40px auto;font:${preset.fontSize}pt/${preset.lineHeight} "${preset.font}";color:#202020;padding:0 15px}h1{font-size:30px}h2,h3{break-after:avoid}img{max-width:100%;height:auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid #aaa;padding:7px}blockquote{border-left:3px solid #999;padding-left:16px}pre{white-space:pre-wrap;overflow-wrap:anywhere}.math-block{overflow-wrap:anywhere;margin:1em 0}@media print{body{font-size:${preset.fontSize}pt;margin:0;padding:0;max-width:none}}.atlas-cover{min-height:85vh;display:flex;flex-direction:column;justify-content:center;text-align:center;break-after:page}.note-ref{vertical-align:super;font-size:.75em}.atlas-notes{border-top:1px solid #aaa;margin-top:25px;font-size:.9em}.atlas-notes li{margin:.5em 0}${preset.pageBreaks?'.atlas-chapter{break-before:page}.atlas-chapter:first-of-type{break-before:auto}':''}</style></head><body dir="${doc.direction==='rtl'?'rtl':'auto'}">${preset.titlePage?'<section class="atlas-cover"><h1>'+xml(doc.title)+'</h1><p>'+xml(preset.subtitle)+'</p><p>'+xml(preset.author)+'</p></section>':'<h1>'+xml(doc.title)+'</h1>'}${prepared.html}</body></html>`;
}
async function markdownDocument(doc, options={}) {
  const publication=await preparePublication(doc);const prepared=await prepare(await htmlNotes(publication),options);
  const td=new Turndown({headingStyle:'atx',codeBlockStyle:'fenced'});
  td.use(require('turndown-plugin-gfm').gfm);
  td.addRule('folio-equation',{filter:node=>node.nodeName==='DIV' && node.hasAttribute('data-math'),replacement:(_,node)=>'\n\n$$\n'+node.getAttribute('data-math')+'\n$$\n\n'});
  return '# '+doc.title+'\n\n'+td.turndown(prepared.html);
}
function imageRun(node, info) {
  if(info.kind==='webp') return new TextRun({text:`[Image: ${node.attribs.alt||'WebP image'} — use HTML/PDF export for this format]`,italics:true});
  let width=Math.min(560,Number(node.attribs.width)||info.width||480);
  let height=width*(info.height||320)/Math.max(1,info.width||480);
  if(height>720) { width*=720/height; height=720; }
  return new ImageRun({type:info.kind,data:info.bytes,transformation:{width:Math.max(1,Math.round(width)),height:Math.max(1,Math.round(height))},altText:{title:node.attribs.alt||'Image',description:node.attribs.alt||'Image',name:'Folio image'}});
}
function wordBlocks(nodes, images, level=0, layout={}) {
  const output=[]; let loose=[];
  function inline(node, marks={}) {
    if(node.type==='text') return [new TextRun({text:node.data,...marks})];
    if(node.type!=='tag') return [];
    if(node.attribs?.['data-word-note-id'])return [new FootnoteReferenceRun(Number(node.attribs['data-word-note-id']))];
    if(node.name==='br') return [new TextRun({break:1})];
    if(node.name==='img') return images.has(node)?[imageRun(node,images.get(node))]:[new TextRun('[Image unavailable]')];
    if(node.name==='input') return [];
    const inherited={...marks};
    if(['strong','b'].includes(node.name)) inherited.bold=true;
    if(['em','i'].includes(node.name)) inherited.italics=true;
    if(['del','s','strike'].includes(node.name)) inherited.strike=true;
    if(node.name==='u') inherited.underline={};
    if(node.name==='code') inherited.font='Consolas';
    if(node.name==='mark') inherited.highlight='yellow';
    const children=(node.children||[]).flatMap(n=>inline(n,inherited));
    if(node.name==='a' && /^(https?:|mailto:)/i.test(node.attribs.href||'')) return [new ExternalHyperlink({link:node.attribs.href,children})];
    return children;
  }
  const paragraph=(node, extra={})=>new Paragraph({children:(node.children||[]).flatMap(n=>inline(n)),spacing:{after:150,line:Math.round((layout.lineHeight||1.65)*240)},bidirectional:node.attribs.dir==='rtl'||(node.attribs.dir!=='ltr'&&layout.direction==='rtl'),pageBreakBefore:!!layout.pageBreaks&&String(node.attribs.class||'').includes('atlas-chapter-title')&&!String(node.attribs.class||'').includes('atlas-first-chapter'),...extra});
  const flush=()=>{if(loose.some(n=>n.type!=='text'||n.data.trim())) output.push(new Paragraph({children:loose.flatMap(n=>inline(n)),spacing:{after:150}}));loose=[];};
  for(const node of nodes||[]) {
    if(node.type!=='tag') { loose.push(node); continue; }
    const name=node.name;
    if(!['p','h1','h2','h3','h4','h5','h6','div','blockquote','ul','ol','table','pre','hr'].includes(name)) {loose.push(node);continue;}
    flush();
    if(name==='div' && Object.hasOwn(node.attribs,'data-math')) output.push(new Paragraph({children:[new TextRun({text:node.attribs['data-math'],font:'Cambria Math'})],spacing:{before:160,after:160}}));
    else if(/^h[1-6]$/.test(name)) output.push(paragraph(node,{heading:HeadingLevel['HEADING_'+name[1]]}));
    else if(name==='p') output.push(paragraph(node));
    else if(name==='pre') output.push(new Paragraph({children:textOf(node).split('\n').flatMap((line,i)=>[...(i?[new TextRun({break:1})]:[]),new TextRun({text:line,font:'Consolas'})]),spacing:{after:150}}));
    else if(name==='hr') output.push(new Paragraph({text:'________________________________',spacing:{after:150}}));
    else if(name==='ul'||name==='ol') {
      let index=0;
      for(const item of (node.children||[]).filter(n=>n.type==='tag'&&n.name==='li')) {
        index++;
        const prefix=node.attribs['data-type']==='taskList'?(item.attribs['data-checked']==='true'?'☑ ':'☐ '):name==='ol'?`${index}. `:'• ';
        const inner=(item.children||[]).filter(n=>!(n.type==='tag'&&['ul','ol','input'].includes(n.name)));
        // Prefix is placed in its own run without discarding nested text marks.
        const pieces=[];
        for(const child of inner) pieces.push(...(child.type==='tag'&&['p','div'].includes(child.name)?(child.children||[]).flatMap(n=>inline(n)):inline(child)));
        output.push(new Paragraph({children:[new TextRun(prefix),...pieces],indent:{left:Math.min(level,8)*300},spacing:{after:100}}));
        for(const child of item.children||[]) if(child.type==='tag'&&['ul','ol'].includes(child.name)) output.push(...wordBlocks([child],images,level+1,layout));
      }
    } else if(name==='table') {
      const rows=[];
      function collectRows(parent){for(const child of parent.children||[]){if(child.type==='tag'&&child.name==='tr')rows.push(child);else if(child.type==='tag'&&['thead','tbody','tfoot'].includes(child.name))collectRows(child);}}
      collectRows(node);
      if(rows.length) output.push(new Table({rows:rows.map(row=>new TableRow({children:(row.children||[]).filter(cell=>cell.type==='tag'&&['td','th'].includes(cell.name)).map(cell=>new TableCell({children:wordBlocks(cell.children,images,level,layout),columnSpan:Math.max(1,Math.min(30,Number(cell.attribs.colspan)||1))}))}))}));
    } else output.push(...wordBlocks(node.children,images,level,node.attribs.dir?{...layout,direction:node.attribs.dir}:layout));
  }
  flush();
  return output.length?output:[new Paragraph('')];
}
async function wordDocument(doc, options={}) {
  const publication=await preparePublication(doc),preset=publication.preset,prepared=await prepare(publication.html,options),sizes={A4:{width:11906,height:16838},A5:{width:8391,height:11906},Letter:{width:12240,height:15840}},margin=Math.round(preset.margin/25.4*1440),footnotes=Object.fromEntries(publication.notes.map(n=>[n.wordId,{children:[new Paragraph({text:n.text})]}]));
  const footer=preset.pageNumbers?new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({children:[PageNumber.CURRENT]})]})]}):undefined;
  const children=[new Paragraph({text:doc.title,heading:HeadingLevel.TITLE})];if(preset.titlePage){if(preset.subtitle)children.push(new Paragraph(preset.subtitle));if(preset.author)children.push(new Paragraph(preset.author));children.push(new Paragraph({children:[new PageBreak()]}));}children.push(...wordBlocks(prepared.root.children,prepared.images,0,{...preset,direction:doc.direction||'auto'}));
  const bytes=await Packer.toBuffer(new Document({title:doc.title,creator:'Atlas Studio',description:'Local writing export.',footnotes,styles:{default:{document:{run:{font:preset.font,size:preset.fontSize*2},paragraph:{spacing:{line:Math.round(preset.lineHeight*240)}}}}},sections:[{properties:{page:{size:sizes[preset.pageSize],margin:{top:margin,bottom:margin,left:margin,right:margin}}},footers:footer?{default:footer}:undefined,children}]}));return nativeEndnotes(bytes,publication.notes);
}
module.exports={safeHtml,xml,portableDocument,markdownDocument,wordDocument,prepare,sniffImage,MAX_IMAGE_BYTES,MAX_TOTAL_IMAGE_BYTES};
