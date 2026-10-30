import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeBirth,decodeBirth,dailySeed,dailyLife,dailyLabel,dayOf} from '../../dist/course/birthcode.js';
import {newLife,configureLife} from '../../dist/course/sim.js';

test('every kind of birth survives the round trip exactly',()=>{
  let n=0;
  for(let seed=1;seed<=600;seed+=7)for(const options of [{},{sex:'male'},{upbringing:'constrained',country:'th'},{country:'us'},{country:'jp',sex:'female',upbringing:'middle'},{country:'sg'},{country:'gb',sex:'intersex'}]){
    const life=configureLife(newLife(seed),options),code=encodeBirth(life);
    assert.match(code,/^[0-9a-z]+-[fmi][cmx][tjsgu]-[0-9a]{5}$/);
    assert.deepEqual(decodeBirth(code),life,'the same birth comes back for '+code);n++;
  }
  assert.ok(n>50);
});

test('a mistyped, forged or impossible code is refused rather than starting some other life',()=>{
  const life=configureLife(newLife(12345),{}),code=encodeBirth(life);
  for(const bad of [null,'',' ','abc','12345','daily',code+'x',code.replace(/-[0-9a]{5}$/,'-99999'),code.replace(/-[0-9a]{5}$/,'-00000'),'0-fmt-22222','zzzzzzzz-fmt-22222','1-zzz-22222','1-fmt-2222','1-fmt-222222','<script>'])assert.equal(decodeBirth(bad),null,String(bad));
  // A code whose points do not add up to ten would be repaired by the game into a different life.
  assert.equal(decodeBirth('1-fmt-55555'),null);
  assert.equal(decodeBirth(code.toUpperCase())?.seed,12345,'links pasted in capitals still work');
});

test('the daily birth is the same for everyone on a day and differs between days',()=>{
  assert.equal(dailySeed('2026-10-30'),dailySeed('2026-10-30'));
  const seeds=new Set();for(let d=1;d<=30;d++)seeds.add(dailySeed('2026-11-'+String(d).padStart(2,'0')));
  assert.equal(seeds.size,30,'thirty days, thirty births');
  const life=dailyLife('2026-10-30');assert.equal(life.seed,dailySeed('2026-10-30'));
  assert.deepEqual(decodeBirth(encodeBirth(life)),life,'a daily birth can be shared as a link too');
});

test('an ending can tell that its life was a daily birth',()=>{
  const now=new Date('2026-10-30T09:00:00Z');
  assert.equal(dailyLabel(dailySeed('2026-10-30'),now),'2026-10-30');
  assert.equal(dailyLabel(dailySeed('2026-10-12'),now),'2026-10-12');
  assert.equal(dailyLabel(777,now),null);
  assert.match(dayOf(now),/^2026-10-30$/);
});
