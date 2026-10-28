import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
const read=n=>JSON.parse(readFileSync('review/control-bench/'+n,'utf8'));
const {cases}=read('geometry.json');
assert.equal(cases.length,10);
for(const c of cases){
 assert.equal(c.w,c.requested.w,c.name+': actual requested width');assert.equal(c.h,c.requested.h,c.name+': actual requested height');
 assert.equal(c.pageW,c.w,c.name);assert.equal(c.pageH,c.h,c.name);
 assert.equal(c.actionCount,1,c.name);assert.ok(c.action.bottom<=c.h&&c.action.h>=32,c.name);
 if(c.w>=1280){
  assert.equal(c.world.w,c.w,c.name+': no reserved sidebar');assert.equal(c.reader,null,c.name+': default reader closed');
  assert.ok(c.bench.w<=(c.panels===4?1000:1260),c.name+': content-sized bench');
  assert.ok(c.bench.h<=c.world.h*.35+2,c.name+': controls retain world area');
  assert.ok(c.primary/c.secondary>=1.5,c.name+': task heading leads');
  assert.ok(c.action.x>=c.set.x&&c.action.right<=c.set.right+1,c.name+': action stays with allocation');
  assert.ok(Math.abs(c.action.y-c.gain.y)<60,c.name+': result and action together');
 }
}
const flow=read('drawer.json');
assert.ok(flow.open.reader&&flow.open.reader.bottom<=flow.open.bench.y-8,'drawer must not cover bench');
assert.equal(flow.closed.reader,null);assert.equal(flow.escape.reader,null);
assert.equal(flow.resized.selected[0],'World');assert.equal(flow.returned.selected[0],'World');
assert.ok(flow.lastFactVisible,'full World content reachable by scrolling');
const old=read('before-geometry.json');
assert.ok(old.reader&&old.reader.h>old.world.h*.9,'actual old reader stretched across the scene');
assert.ok(old.world.w<old.w&&old.primary/old.secondary<1.5,'actual prior composition fails space and hierarchy budgets');
for(const c of read('native.json')){assert.equal(c.pageW,c.w);assert.equal(c.pageH,c.h);assert.ok(c.action.bottom<=c.h);assert.ok(c.gain.bottom<=c.h-12,'enlarged native result visible');}
console.log('PASS: ten actual viewport/stage cases, hierarchy, action ownership, drawer lifecycle and old failure rejected.');
