import fs from 'node:fs';import assert from 'node:assert/strict';
const read=name=>JSON.parse(fs.readFileSync(new URL(name,import.meta.url),'utf8'));
const widthOK=r=>assert.ok(r.pageWidth<= (r.width??r.w)+1,'horizontal overflow');
const rows=read('geometry.json');assert.ok(rows.length>=4);for(const w of [390,1024,1440])assert.ok(rows.some(r=>r.width===w));
for(const r of rows){widthOK(r);assert.ok(r.share.left>=0&&r.share.right<=r.width+1,'share clipping');assert.ok(r.share.height<=300,'unearned share expansion');assert.ok(r.share.bottom<=r.height+1,'share action below tested first screen');}
assert.throws(()=>widthOK(read('before-geometry.json')),'the old535px phone layout must fail this same width gate');
const gap=r=>r.shareTop-r.routeBottom,before=read('before-share-depth.json'),after=read('after-share-depth.json');assert.ok(gap(before)>32);assert.ok(gap(after)<=32,'result/action separated by unrelated reading');
console.log('Four measured cases pass; old width and action-placement regressions fail.');
