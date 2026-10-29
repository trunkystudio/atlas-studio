const test=require('node:test');
const assert=require('node:assert/strict');
const JSZip=require('jszip');
const {safeHtml,portableDocument,markdownDocument,wordDocument,prepare,MAX_IMAGE_BYTES}=require('../electron/export.cjs');
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7T8AAAAASUVORK5CYII=','base64');
const attachmentOptions={resolveAttachment:id=>id==='image-1'?{bytes:png}:null};
const sample={title:'Portable writing',html:'<h2>A heading</h2><p>Some <strong>bold</strong> and <em>italic</em> text.</p><ul><li><p>First</p></li><li><p>Second</p></li></ul><table><tbody><tr><th><p>Column</p></th></tr><tr><td><p>Cell</p></td></tr></tbody></table><div data-math="E = mc^2">E = mc^2</div><p><img src="folio-file://image-1/file" alt="A tiny image"></p>',text:'A heading\nSome bold and italic text.\nFirst\nSecond\nColumn\nCell\nE = mc^2'};

test('portable HTML includes equation rendering, embedded fonts and known image bytes without library dependencies',async()=>{
 const html=await portableDocument(sample,attachmentOptions);
 assert.match(html,/<h2>A heading<\/h2>/);
 assert.match(html,/class="katex"/);
 assert.match(html,/data:font\/woff2;base64,/);
 assert.match(html,/data:image\/png;base64,/);
 assert.doesNotMatch(html,/folio-file:|url\(fonts\//);
 assert.match(html,/font-src data:/);
 assert.match(html,/script-src|default-src 'none'/);
});

test('saved HTML alone produces Word headings, marks, lists, tables, visible equations and image media',async()=>{
 const zip=await JSZip.loadAsync(await wordDocument(sample,attachmentOptions));
 const document=await zip.file('word/document.xml').async('string');
 assert.match(document,/A heading/);
 assert.match(document,/Heading2/);
 assert.match(document,/<w:b\/>/);
 assert.match(document,/<w:i\/>/);
 assert.match(document,/First/);
 assert.match(document,/Second/);
 assert.match(document,/<w:tbl>/);
 assert.match(document,/Cell/);
 assert.match(document,/E = mc\^2/);
 assert.match(document,/<w:drawing>/);
 const media=Object.keys(zip.files).filter(f=>f.startsWith('word/media/')&&!zip.files[f].dir);
 assert.equal(media.length,1);
 assert.deepEqual(await zip.file(media[0]).async('nodebuffer'),png);
});

test('Markdown retains LaTeX blocks, formatting and portable image data',async()=>{
 const markdown=await markdownDocument(sample,attachmentOptions);
 assert.match(markdown,/## A heading/);
 assert.match(markdown,/\*\*bold\*\*/);
 assert.ok(markdown.includes('$$\nE = mc^2\n$$'));
 assert.match(markdown,/!\[A tiny image\]\(data:image\/png;base64,/);
 assert.doesNotMatch(markdown,/folio-file:/);
});

test('unknown library attachments and arbitrary file image sources fail without reading paths',async()=>{
 const calls=[];const options={resolveAttachment:id=>{calls.push(id);return null;}};
 await assert.rejects(()=>portableDocument({title:'Missing',html:'<img src="folio-file://missing/file">'},options),/missing/i);
 assert.deepEqual(calls,['missing']);calls.length=0;
 for(const src of ['file:///C:/secret.png','https://example.com/image.png','folio-file://image-1/../../outside','data:image/svg+xml;base64,PHN2Zy8+']) {
   await assert.rejects(()=>portableDocument({title:'Unsafe',html:`<img src="${src}">`},options));
 }
 assert.deepEqual(calls,[]);
});

test('export sanitization removes scripts, event handlers, frames and executable hyperlinks',async()=>{
 const input='<script>alert(1)</script><iframe src="https://example.com"></iframe><p onclick="evil()">Safe <a href="javascript:evil()">link</a></p><div data-math="x^2">x^2</div>';
 const html=await portableDocument({title:'<bad title>',html:input});
 assert.doesNotMatch(html,/<script|<iframe|onclick=|javascript:/i);
 assert.match(html,/&lt;bad title&gt;/);
 assert.match(html,/class="katex"/);
 assert.match(safeHtml('<a href="folio://note/safe">Note</a>'),/folio:\/\/note\/safe/);
 assert.doesNotMatch(await portableDocument({title:'Links',html:'<a href="folio://note/safe">Note</a>'}),/href="folio:/);
});

test('equation and image export limits fail explicitly instead of dropping content',async()=>{
 await assert.rejects(()=>prepare(`<div data-math="${'x'.repeat(20001)}">math</div>`),/20,000/);
 const huge=Buffer.alloc(MAX_IMAGE_BYTES+1);png.copy(huge);
 await assert.rejects(()=>prepare('<img src="folio-file://image-1/file">',{resolveAttachment:()=>({bytes:huge})}),/limit/i);
});

test('Word exports preserve external hyperlinks without retaining internal custom schemes',async()=>{
 const zip=await JSZip.loadAsync(await wordDocument({title:'Links',html:'<p><a href="https://example.com/paper">A source</a> and <a href="folio://note/abc">An idea</a></p>'}));
 const rels=await zip.file('word/_rels/document.xml.rels').async('string');
 assert.match(rels,/https:\/\/example.com\/paper/);
 assert.doesNotMatch(rels,/folio:/);
 const document=await zip.file('word/document.xml').async('string');
 assert.match(document,/An idea/);
});
