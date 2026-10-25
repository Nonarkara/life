import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {runInNewContext} from 'node:vm';
test('font service latency cannot become a blocking stylesheet import again',()=>{
 for(const path of ['dist/course/course.css','dist/course/settings.css'])assert.doesNotMatch(readFileSync(path,'utf8'),/@import\s+(?:url\()?['"]https?:/);
 const links=[];const document={createElement:()=>({dataset:{},addEventListener(name,fn){this[name]=fn;}}),head:{append(link){links.push(link);}}};
 runInNewContext(readFileSync('dist/course/fonts.js','utf8'),{document});
 assert.equal(links.length,2);for(const link of links){assert.equal(link.media,'print');assert.match(link.href,/^https:\/\/fonts.googleapis.com\//);link.load();assert.equal(link.media,'all');}
});
