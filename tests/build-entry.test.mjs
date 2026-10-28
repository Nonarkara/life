import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('built entry documents identify one build and avoid retained HTML caches',()=>{
 const build=JSON.parse(readFileSync('out/build.json','utf8')).build;
 const headers=readFileSync('out/_headers','utf8');
 for(const path of ['/','/*.html','/course/','/start/','/intake/','/build.json'])
  assert.ok(headers.includes(path+'\n  Cache-Control: no-store'),path);
 for(const path of ['out/index.html','out/course/index.html','out/start/index.html','out/intake/index.html']){
  const html=readFileSync(path,'utf8');
  assert.ok(html.includes(`<meta name="life-build" content="${build}">`),path);
  const refs=[...html.matchAll(/(?:href|src)="([^"\s]+\.(?:css|js)(?:\?[^"\s]*)?)"/g)].map(m=>m[1]);
  assert.ok(refs.length,path+' has asset references');
  for(const ref of refs.filter(url=>!url.startsWith('http')))
   assert.ok(ref.endsWith('?v='+build),ref);
 }
});
