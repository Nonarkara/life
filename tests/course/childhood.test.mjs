import {netWorth} from '../../dist/course/finance.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {childhoodChapter} from '../../dist/course/childhood.js';
import {newLife,configureLife,live} from '../../dist/course/sim.js';
test('childhood memories explain means without granting agency or changing saved resources',()=>{
 const state=configureLife(newLife(5),{class:'low_class'}),before=structuredClone(state);
 assert.match(childhoodChapter(state,0).title,/mother/);
 assert.match(childhoodChapter(state,2).title,/fall/);
 assert.match(childhoodChapter(state,5).title,/swim/);
 assert.match(childhoodChapter(state,6).decision,/public school/);
 assert.match(childhoodChapter(state,8).title,/bicycle/);
 assert.match(childhoodChapter(state,9).title,/imagine/);
 assert.equal(live(state),state);assert.deepEqual(state,before);
});
test('family means change available schooling but never promise intelligence or success',()=>{
 const low=childhoodChapter(configureLife(newLife(1),{class:'low_class'}),6);
 const high=childhoodChapter(configureLife(newLife(1),{class:'high_class'}),6);
 assert.ok(low.income<high.income);assert.notEqual(low.decision,high.decision);
});
import {availablePathways,pathwayPeriod} from '../../dist/course/pathways.js';
import {begin} from '../../dist/course/sim.js';
test('education routes unlock by age; independent work has upside and downside without guaranteed wealth',()=>{
 assert.equal(availablePathways(10).length,0);assert.ok(!availablePathways(15).some(([k])=>k==='college'));assert.ok(availablePathways(20).some(([k])=>k==='college'));
 const state={...begin(newLife(1)),age:20,pathway:'independent'};
 assert.ok(pathwayPeriod(state,.1).cash>0);assert.ok(pathwayPeriod(state,.8).cash<0);
 const college=live({...state,pathway:'college'}),work=live({...state,pathway:'work'});
 assert.ok(netWorth(college.finance)<netWorth(work.finance));assert.equal(college.cash,work.cash);assert.ok(college.skills.iq>work.skills.iq);
 assert.equal(college.history.at(-1).pathway,'college');
});
import {validate} from '../../dist/course/sim.js';
test('unknown route in a saved history is rejected before recap',()=>{
 const state=live(begin(newLife(1)));
 assert.equal(validate({...state,history:state.history.map((row,i)=>i===0?{...row,pathway:'bogus'}:row)}),false);
});

test('the annual reading follows a recorded child choice rather than inventing a different activity',async()=>{
 const {CHILD_CHOICES}=await import('../../dist/course/childhood-choices.js');
 const state=configureLife(newLife(1),{class:'low_class'});
 for(const q of CHILD_CHOICES)for(const o of q.options){const recorded={...state,childhood:{choices:[{age:q.age,choice:o.id}]}};const raw=JSON.stringify(recorded),chapter=childhoodChapter(recorded,q.age);
  assert.equal(chapter.title,o.label);assert.equal(chapter.decision,o.note);assert.equal(JSON.stringify(recorded),raw);
  assert.equal(childhoodChapter(recorded,q.age-1).title,childhoodChapter(state,q.age-1).title,'a future answer cannot overwrite an earlier year');
 }
});
