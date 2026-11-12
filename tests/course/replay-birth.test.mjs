import assert from 'node:assert/strict';
import {test} from 'node:test';
import {newLife,configureLife,replay,validate} from '../../dist/course/sim.js';
import {drawBirth} from '../../dist/course/birth-draw.js';

// "Live this birth again" must be the same birth. A save from before the birth-class
// system carries an upbringing and a region instead of a class, and the region is the
// only record of which house was drawn — without it the replay lands in another house.
test('replaying a life repeats the same birth, for a class life and a legacy one',()=>{
 const classed=drawBirth({},{varied:true});
 assert.deepEqual(replay(classed).birth,classed.birth);

 const legacy=configureLife(newLife(11),{legacy:true,region:'bang-na'});
 assert.equal(legacy.intake.class,undefined);
 assert.equal(legacy.birth.region,'bang-na');
 assert.ok(validate(legacy));
 assert.deepEqual(replay(legacy).birth,legacy.birth);
});

test('no seed and no region moves a player to another house when they live their birth again',()=>{
 const regions=['bang-na','nakhon-sawan','samut-prakan','nonthaburi','chiang-mai'];
 let checked=0;
 for(let seed=1;seed<=40;seed++)for(const region of regions){
  const life=configureLife(newLife(seed),{legacy:true,region});
  if(!life?.birth?.home)continue;
  checked++;
  const again=replay(life);
  assert.equal(again.birth.home,life.birth.home,`seed ${seed} in ${region} moved house`);
  assert.equal(again.birth.region,life.birth.region,`seed ${seed} in ${region} moved region`);
  assert.equal(again.birth.place,life.birth.place);
  assert.equal(again.birth.household,life.birth.household);
 }
 assert.ok(checked>=150,`only ${checked} lives checked`);
});
