import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../review/phone-composition/',import.meta.url);
const {cases}=JSON.parse(fs.readFileSync(new URL('geometry.json',root)));
const failures=c=>{
 const bad=[];
 if(c.pageW!==c.w||c.pageH!==c.h)bad.push('page overflow');
 if(c.actionParent!=='deck-action-slot')bad.push('detached action');
 if(c.action.bottom>c.h||c.forecast.bottom>c.h)bad.push('decision off first view');
 if(c.w<1280){
  if(c.canvas.height<=c.reader.height)bad.push('scene subordinate to reader');
  if(c.stepper.width>150)bad.push('stretched stepper');
  if(c.footer.height>0)bad.push('permanent action footer');
 }
 return bad;
};
assert.equal(cases.length,14);
for(const c of cases){
 const [w,h]={phone:[390,844],tablet:[1024,768],compact:[1280,720],desktop:[1440,900]}[c.size];
 assert.equal(c.w,w);assert.equal(c.h,h);
 assert.deepEqual(failures(c),[],`${c.lang}/${c.life}/${c.size}`);
}
const before=JSON.parse(fs.readFileSync(new URL('before.json',root)));
assert.deepEqual(failures(before).sort(),['detached action','permanent action footer','scene subordinate to reader','stretched stepper'].sort());
console.log('PASS: 14 actual viewport/stage/native cases; rejected original fails four task-geometry checks.');
