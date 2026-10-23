import {cpSync,mkdirSync,readdirSync,readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
mkdirSync('out',{recursive:true});
for(const file of readdirSync('dist/course')){cpSync('dist/course/'+file,'out/'+file);assert.deepEqual(readFileSync('out/'+file),readFileSync('dist/course/'+file));}
console.log('Course output matches authored source.');

// Keep gameplay and the manual at stable sibling routes.
mkdirSync('out/course',{recursive:true});mkdirSync('out/start',{recursive:true});
cpSync('dist/course','out/course',{recursive:true});cpSync('dist/start','out/start',{recursive:true});
for(const file of readdirSync('dist/start'))cpSync('dist/start/'+file,'out/'+file);

mkdirSync('out/legacy',{recursive:true});
for(const entry of readdirSync('dist',{withFileTypes:true}))if(entry.isFile())cpSync('dist/'+entry.name,'out/legacy/'+entry.name);

mkdirSync('out/intake',{recursive:true});cpSync('dist/intake','out/intake',{recursive:true});

const {build}=await import('esbuild');
await build({entryPoints:['dist/course/game.js'],bundle:true,format:'esm',outfile:'out/course/game.bundle.js'});

// A build owns one module graph. Old preview caches must not mix its files.
const {createHash}=await import('node:crypto');
const {writeFileSync}=await import('node:fs');
function files(root){return readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(root+'/'+e.name):[root+'/'+e.name]).sort();}
const buildId=createHash('sha256').update(files('dist').map(p=>readFileSync(p)).reduce((a,b)=>Buffer.concat([a,b]),Buffer.alloc(0))).digest('hex').slice(0,12);
for(const path of files('out').filter(p=>/\.(html|js)$/.test(p))){
 const source=readFileSync(path,'utf8');
 const versioned=source.replace(/(['"])((?:\.{1,2}\/)?[\w\/-]+\.(?:js|css))\1/g,(_,quote,url)=>quote+url+'?v='+buildId+quote);
 writeFileSync(path,versioned);
}
writeFileSync('out/build.json',JSON.stringify({version:'2026.1',build:buildId})+'\n');
console.log('Versioned module graph: '+buildId);
