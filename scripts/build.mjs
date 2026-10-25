import {cpSync,mkdirSync,readdirSync,readFileSync,mkdtempSync,existsSync,renameSync,rmSync} from 'node:fs';
import assert from 'node:assert/strict';
import {versionReferences} from './asset-versions.mjs';
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

mkdirSync(output+'/study',{recursive:true});cpSync('dist/study',output+'/study',{recursive:true});
const {build}=await import('esbuild');
await build({entryPoints:['dist/course/scene-study.js'],bundle:true,minify:true,format:'esm',outfile:output+'/study/scene-study.bundle.js'});
await build({entryPoints:['dist/course/game.js'],bundle:true,minify:true,format:'esm',outfile:output+'/course/game.bundle.js'});

// A build owns one module graph. Old preview caches must not mix its files.
const {createHash}=await import('node:crypto');
const {writeFileSync}=await import('node:fs');
function files(root){return readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(root+'/'+e.name):[root+'/'+e.name]).sort();}
const buildHash=createHash('sha256');
for(const path of ['scripts/build.mjs','scripts/asset-versions.mjs'])buildHash.update(path).update('\0').update(readFileSync(path)).update('\0');
for(const path of files(output))buildHash.update(path.slice(output.length+1)).update('\0').update(readFileSync(path)).update('\0');
const buildId=buildHash.digest('hex').slice(0,12);
for(const path of files(output).filter(p=>/\.(html|js)$/.test(p))){
 const source=readFileSync(path,'utf8');
 const versioned=versionReferences(source,buildId);
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
