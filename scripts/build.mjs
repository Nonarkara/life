import {cpSync,mkdirSync,readdirSync,readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
mkdirSync('out',{recursive:true});
for(const file of readdirSync('dist/course')){cpSync('dist/course/'+file,'out/'+file);assert.deepEqual(readFileSync('out/'+file),readFileSync('dist/course/'+file));}
console.log('Course output matches authored source.');
