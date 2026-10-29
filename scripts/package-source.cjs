const fs=require('node:fs'),path=require('node:path'),Zip=require('jszip');
const version=require('../package.json').version,series=version.split('.').slice(0,2).join('.');
const root=path.resolve(__dirname,'..'),out=path.resolve(process.argv[2]||path.join(root,'../../outputs/Atlas-Studio-'+series));fs.mkdirSync(out,{recursive:true});const zip=new Zip();
function include(relative,destination=relative){const absolute=path.join(root,relative);if(!fs.existsSync(absolute))return;if(fs.statSync(absolute).isDirectory()){for(const name of fs.readdirSync(absolute)){if(name.startsWith('.'))continue;include(path.join(relative,name),path.join(destination,name));}}else zip.file('Atlas-Studio-'+series+'/'+destination.replaceAll('\\','/'),fs.createReadStream(absolute));}
for(const folder of ['src','electron','build','scripts','native/speech-pack'])include(folder);
include('.github');
for(const file of ['.gitignore','CONTRIBUTING.md','SUPPORT.md','package.json','package-lock.json','README.md','LICENSE.txt','index.html','vite.config.js','audit-catalog.cjs','native/jfk.wav'])include(file);
for(const file of fs.readdirSync(path.join(root,'tests')).filter(n=>n.endsWith('.test.cjs')||/^studio-.*\.cjs$/.test(n)))include('tests/'+file);
include('node_modules/citeproc','vendor/citeproc');
const file=path.join(out,'Atlas-Studio-Source-'+version+'.zip');
zip.generateNodeStream({type:'nodebuffer',streamFiles:true,compression:'DEFLATE',compressionOptions:{level:9}}).pipe(fs.createWriteStream(file)).on('finish',()=>console.log(JSON.stringify({file,bytes:fs.statSync(file).size}))).on('error',e=>{console.error(e);process.exitCode=1;});
