import {cpSync,mkdirSync,readdirSync,readFileSync,mkdtempSync,existsSync,renameSync,rmSync,statSync} from 'node:fs';
import assert from 'node:assert/strict';
import {versionReferences} from './asset-versions.mjs';
const output=mkdtempSync('.life-build-');
try {
const compare=(from,to)=>{
 for(const entry of readdirSync(from,{withFileTypes:true})){
  const source=from+'/'+entry.name,target=to+'/'+entry.name;
  if(entry.isDirectory()){cpSync(source,target,{recursive:true});compare(source,target);continue;}
  cpSync(source,target);assert.deepEqual(readFileSync(target),readFileSync(source));
 }
};
compare('dist/course',output);
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
await build({entryPoints:['dist/study/deck-edge.js'],bundle:true,minify:true,format:'esm',outfile:output+'/study/deck-edge.bundle.js'});
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
 let versioned=versionReferences(source,buildId);
 if(path.endsWith('.html'))versioned=versioned.replace(/<head>/i,`<head><meta name="life-build" content="${buildId}">`);
 writeFileSync(path,versioned);
}
writeFileSync(output+'/build.json',JSON.stringify({version:'2026.1',build:buildId})+'\n');
// Entry documents must be fetched again on navigation; versioned assets keep
// their normal cache policy. An already-open older document still needs reload.
writeFileSync(output+'/_headers',['/','/*.html','/course/','/start/','/intake/','/build.json']
 .map(path=>path+'\n  Cache-Control: no-store').join('\n\n')+'\n');
console.log('Versioned module graph: '+buildId);

// The painted stage names its art by path. Versioning those paths with the
// build keeps a new painting from being served out of an old cache.
const manifestPath=output+'/course/anime/manifest.json';
if(existsSync(manifestPath)){
 const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));
 const version=path=>path.includes('?')?path+'&v='+buildId:path+'?v='+buildId;
 for(const[key,path]of Object.entries(manifest.plates??{}))manifest.plates[key]=version(path);
 for(const[,frames]of Object.entries(manifest.sprites??{}))for(const[name,path]of Object.entries(frames))frames[name]=version(path);
 writeFileSync(manifestPath,JSON.stringify(manifest,null,1)+'\n');
 console.log('Stage art versioned with the build.');
}

// Promote only a complete build. The previous directory is our generated output.
const previous=output+'.previous';
if(existsSync('out'))renameSync('out',previous);
try {renameSync(output,'out');} catch(error){if(existsSync(previous))renameSync(previous,'out');throw error;}
if(existsSync(previous))rmSync(previous,{recursive:true});
console.log('Build ready in out.');
} catch(error){if(existsSync(output))rmSync(output,{recursive:true});throw error;}
