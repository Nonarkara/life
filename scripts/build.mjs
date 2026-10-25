import {cpSync,mkdirSync,readdirSync,readFileSync,mkdtempSync,existsSync,renameSync,rmSync} from 'node:fs';
import assert from 'node:assert/strict';
const output=mkdtempSync('.life-build-');
try {
for(const file of readdirSync('dist/course')){cpSync('dist/course/'+file,output+'/'+file);assert.deepEqual(readFileSync(output+'/'+file),readFileSync('dist/course/'+file));}
console.log('Course output matches authored source.');

// Keep gameplay and the manual at stable sibling routes.
mkdirSync(output+'/course',{recursive:true});mkdirSync(output+'/start',{recursive:true});
cpSync('dist/course',output+'/course',{recursive:true});cpSync('dist/start',output+'/start',{recursive:true});
for(const file of readdirSync('dist/start'))cpSync('dist/start/'+file,output+'/'+file);

mkdirSync(output+'/legacy',{recursive:true});
for(const entry of readdirSync('dist',{withFileTypes:true}))if(entry.isFile())cpSync('dist/'+entry.name,output+'/legacy/'+entry.name);

mkdirSync(output+'/intake',{recursive:true});cpSync('dist/intake',output+'/intake',{recursive:true});

const {build}=await import('esbuild');
await build({entryPoints:['dist/course/game.js'],bundle:true,minify:true,format:'esm',outfile:output+'/course/game.bundle.js'});

// A build owns one module graph. Old preview caches must not mix its files.
const {createHash}=await import('node:crypto');
const {writeFileSync}=await import('node:fs');
function files(root){return readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(root+'/'+e.name):[root+'/'+e.name]).sort();}
const buildId=createHash('sha256').update(files('dist').map(p=>readFileSync(p)).reduce((a,b)=>Buffer.concat([a,b]),Buffer.alloc(0))).digest('hex').slice(0,12);
for(const path of files(output).filter(p=>/\.(html|js)$/.test(p))){
 const source=readFileSync(path,'utf8');
 const versioned=source.replace(/(['"])((?:\.{1,2}\/)?[\w\/-]+\.(?:js|css))\1/g,(_,quote,url)=>quote+url+'?v='+buildId+quote);
 writeFileSync(path,versioned);
}
writeFileSync(output+'/build.json',JSON.stringify({version:'2026.1',build:buildId})+'\n');
console.log('Versioned module graph: '+buildId);

// Promote only a complete build. The previous directory is our generated output.
const previous=output+'.previous';
if(existsSync('out'))renameSync('out',previous);
try {renameSync(output,'out');} catch(error){if(existsSync(previous))renameSync(previous,'out');throw error;}
if(existsSync(previous))rmSync(previous,{recursive:true});
console.log('Build ready in out.');
} catch(error){if(existsSync(output))rmSync(output,{recursive:true});throw error;}
