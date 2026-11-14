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

// The age-9 freeze (the owner's stuck "Before light" screen): the seed picks one of three
// questions per age, but the place variant reshaped whichever question it got and kept only
// the variant's option ids. A drama question carries none of them, so ages 7-9 could render
// a decision with no buttons while time stayed paused. These walks play every class, home
// and cohort through ages 6-9 and fail on any question without a clickable option.
import {pendingChildChoice,chooseChild,nextChildAge,validChildhood,CHILD_CHOICES} from '../../dist/course/childhood-choices.js';
import {CLASS_KEYS} from '../../dist/course/backgrounds.js';
import {REGIONS} from '../../dist/course/regions.js';
import {COHORT_YEARS} from '../../dist/course/thai-history.js';
import {rand} from '../../dist/course/rand.js';
test('every childhood question from age 6 to 9 keeps at least one clickable option',()=>{
 const homes=[...new Set(Object.values(REGIONS).map(r=>r.home))],age9Titles=new Set();let walks=0;
 for(const cls of CLASS_KEYS)for(const home of homes)for(const birthYear of COHORT_YEARS)for(let seed=1;seed<=20;seed++){
  let state=configureLife(newLife(seed),{class:cls,birthYear});
  state={...state,birth:{...state.birth,home}};
  for(let age=nextChildAge(state);age<10;age=nextChildAge(state)){
   const q=pendingChildChoice(state,age),where=`${cls}/${home}/${birthYear}/seed${seed}/age${age}`;
   assert.ok(q,`${where}: no pending question`);
   assert.ok(q.title&&q.context,`${where}: empty title or context`);
   assert.ok(q.options.length>0,`${where}: "${q.title}" rendered with no options — the dialog would freeze with nothing to click`);
   for(const o of q.options)assert.ok(o.id&&o.label&&o.note,`${where}: option missing id/label/note`);
   if(age===9)age9Titles.add(q.title);
   const next=chooseChild(state,age,q.options[0].id);
   assert.notEqual(next,state,`${where}: clicking "${q.options[0].label}" did nothing`);
   assert.ok(validChildhood(next),`${where}: the recorded choice fails to validate on reload`);
   state=next;
  }
  assert.equal(nextChildAge(state),10,`${cls}/${birthYear}/seed${seed}: childhood never finished`);
  walks++;
 }
 assert.ok(walks>=5000,`only ${walks} walks completed`);
 assert.ok(age9Titles.size>=3,`age 9 variety collapsed to ${age9Titles.size} title(s): ${[...age9Titles].join(' | ')}`);
});
test('the seed picks the question; a place variant reshapes only the question it belongs to',()=>{
 const same=CHILD_CHOICES.filter(q=>q.age===9);
 assert.equal(same.length,3,'age 9 should offer one base question and two dramas');
 for(let seed=1;seed<=40;seed++){
  // A home outside every place variant keeps ages 6-8 stable so the walk always reaches 9.
  let state=configureLife(newLife(seed),{class:'working_class',birthYear:1949});
  state={...state,birth:{...state.birth,home:'a household in an apartment block'}};
  for(let age=nextChildAge(state);age<9;age=nextChildAge(state)){
   const q=pendingChildChoice(state,age);
   assert.ok(q&&q.options.length>0,`seed ${seed}/age ${age}: "${q?.title}" has no options on the way to 9`);
   state=chooseChild(state,age,q.options[0].id);
  }
  const q=pendingChildChoice(state,9),idx=Math.floor(rand(seed,9,'child-variant')*same.length);
  const expected=idx===0?(seed%2===0?'Before light':same[0].title):same[idx].title;
  assert.equal(q.title,expected,`seed ${seed}: the seed picked index ${idx} but the screen showed "${q.title}"`);
  assert.ok(q.options.length>0,`seed ${seed}: "${q.title}" has no options`);
 }
});

// A question written for a poorer house never reaches a richer one.
test('the one-more-year-of-school question reaches only poorer households',()=>{
 for(let seed=1;seed<=60;seed++)for(const cls of ['middle_class','bureaucratic_class','high_class']){
  let state=configureLife(newLife(seed),{class:cls,birthYear:1949});state={...state,birth:{...state.birth,home:'a household in an apartment block'}};
  for(let age=nextChildAge(state);age<9;age=nextChildAge(state)){const q=pendingChildChoice(state,age);state=chooseChild(state,age,q.options[0].id);}
  assert.notEqual(pendingChildChoice(state,9)?.title,'Only one of you can go on',cls+' seed '+seed);
 }
});
