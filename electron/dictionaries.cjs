const fs=require('node:fs'),path=require('node:path');
// Seed Chromium's local cache before the first Session is constructed. Never
// overwrite an existing dictionary or the user's personal dictionary.
function seedDictionaries(app){
 const source=path.join(__dirname,'../dist/dictionaries'),target=path.join(app.getPath('userData'),'Dictionaries');
 fs.mkdirSync(target,{recursive:true});
 for(const name of fs.readdirSync(source).filter(n=>n.endsWith('.bdic'))){const destination=path.join(target,name);if(!fs.existsSync(destination))fs.copyFileSync(path.join(source,name),destination,fs.constants.COPYFILE_EXCL);}
}
module.exports={seedDictionaries};
