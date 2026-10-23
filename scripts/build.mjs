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
