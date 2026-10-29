const fs=require('node:fs'),path=require('node:path');
const notices=[];
for(const name of fs.readdirSync('node_modules')){
 if(name.startsWith('.'))continue;
 const folders=name.startsWith('@')?fs.readdirSync(path.join('node_modules',name)).map(n=>name+'/'+n):[name];
 for(const n of folders){const p=path.join('node_modules',n),json=path.join(p,'package.json');if(!fs.existsSync(json))continue;let info;try{info=JSON.parse(fs.readFileSync(json,'utf8'));}catch{continue;}
 const docs=fs.readdirSync(p).filter(f=>/^(license|copying|notice)(\.|$)/i.test(f)&&fs.statSync(path.join(p,f)).isFile());
 notices.push('\n\n=== '+n+' '+info.version+' ('+info.license+') ===\n'+docs.map(f=>fs.readFileSync(path.join(p,f),'utf8')).join('\n'));}
}
notices.unshift(`Atlas Studio ${require('../package.json').version} third-party notices

Atlas application code: MIT, copyright 2026 Trunky Studio.
Brand artwork: supplied by the user.

citeproc-js: copyright 2009-2019 Frank Bennett; distributed under CPAL-1.0.
Unmodified source: https://github.com/Juris-M/citeproc-js (npm citeproc 2.4.63).
The complete citeproc source is also included in the delivered source archive under vendor/citeproc.
Complete CPAL-1.0 text and upstream notice are in build/licenses. No citeproc code modifications.

CSL styles/locales: Citation Style Language contributors; CC BY-SA 3.0.
Original author/rights notices remain in each XML/CSL file in build/csl.
Sources: https://github.com/citation-style-language/styles and /locales.

whisper.cpp 1.9.5: MIT, ggml contributors. OpenAI Whisper model: MIT, copyright 2022 OpenAI.
The unmodified runtime and Small multilingual Q5 model are in resources/speech.
Pinned origins and checksums: build/RESOURCE-SOURCES.json. No network inference.

Tesseract.js / core / tessdata: Apache-2.0; upstream notices retained below and in build/licenses.
OCR data origins: https://github.com/naptha/tessdata (4.0.0, English/French/Arabic).
Electron Hunspell dictionaries are from the official Electron 45.1.0 release archive.
Each dictionary's license notices are retained in dist/dictionaries/COPYING* and LICENSE.
Bundled Electron also retains its own LICENSE and LICENSES.chromium.html beside the executable.
`);
fs.writeFileSync('build/THIRD-PARTY-LICENSES.txt',notices.join(''));
