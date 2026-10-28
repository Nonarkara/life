import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const {cases}=read('review/preview-freshness/geometry.json');
for(const c of cases){
 assert.equal(c.main.x,0,c.name+': no invented side margin');
 assert.equal(c.main.w,c.w,c.name+': working surface fills viewport');
 assert.equal(c.pageW,c.w,c.name+': no horizontal page bleed');
 assert.equal(c.pageH,c.h,c.name+': no vertical page bleed');
 assert.equal(c.actionCount,1,c.name+': one real action');
 assert.ok(c.action.bottom<=c.h&&c.action.h>=32,c.name+': action visible');
 if(c.w>=1280){
  assert.equal(c.world.x,0);assert.ok(c.world.w>=c.w*.7,c.name+': world earns dominant area');
  assert.equal(c.deck.bottom,c.h,c.name+': instrument reaches bottom');
  assert.ok(c.gain.bottom<=c.plan.bottom,c.name+': edit and result together');
 }
}
// Retained actual public failure, prior to the definite-width fix.
const old=read('review/minimax-final/public-sparse-before.json');
assert.ok(old.main.x>0&&old.main.w<old.w,'old shrinkwrap must fail the same geometry');
console.log('PASS: exact working viewport,desktop,tablet,phone; old shrinkwrap rejected.');
