import test from 'node:test';import assert from 'node:assert/strict';
import {decisionTempo} from '../../dist/course/decision-tempo.js';
import {newLife,begin} from '../../dist/course/sim.js';
import {applyPivot,pendingPivots,openOptions} from '../../dist/course/pivots.js';

test('incidents, unanswered questions and outcomes own the clock even at20x',()=>{
 for(const reason of ['incident','questions','outcome']){const t=decisionTempo({stage:'review',speed:20,[reason]:true});assert.equal(t.held,true);assert.equal(t.sceneSpeed,0);}
});
test('review is gentle; fast travel eases into the last year without changing the requested speed',()=>{
 assert.equal(decisionTempo({stage:'review',speed:20}).sceneSpeed,.5);
 assert.equal(decisionTempo({stage:'review',speed:20,moving:true,remaining:3}).yearSpeed,20);
 assert.equal(decisionTempo({stage:'review',speed:20,moving:true,remaining:.9}).yearSpeed,2);
 assert.equal(decisionTempo({stage:'birth',speed:3}).yearSpeed,3);
});
test('one decision cannot be charged twice, answered at another age, or chosen outside available options',()=>{
 const state=begin(newLife(31)),pivot=pendingPivots(state)[0],option=openOptions(pivot,state)[0];
 const next=applyPivot(state,pivot,option.id);assert.notEqual(next,state);
 assert.equal(applyPivot(next,pivot,option.id),next);
 const wrong={...state,age:15};assert.equal(applyPivot(wrong,pivot,option.id),wrong);
 assert.equal(applyPivot(state,pivot,'missing'),state);
});

import {stationAlternatives} from '../../dist/course/alternatives.js';
test('counterfactuals replace the answered record instead of being rejected as double charges',()=>{
 const s=begin(newLife(31)),p=pendingPivots(s)[0],o=openOptions(p,s)[0],answered=applyPivot(s,p,o.id);
 const roads=stationAlternatives(answered);assert.ok(roads.length>=2);
 assert.ok(new Set(roads.map(r=>[r.cash,r.health,r.wellbeing].join(':'))).size>=2,'alternative choices must not collapse to one undone state');
});

import {beatFor,MOMENT_CAPTIONS} from '../../dist/course/stage2d.js';
import {live} from '../../dist/course/sim.js';
test('a chosen work/study scene survives committing the period without claiming the child quit school',()=>{
 let s=begin(newLife(31));const p=pendingPivots(s)[0];s=applyPivot(s,p,'stall');const travelling=live(s);
 const activity={phase:'Daytime',pose:'study',action:'At school',moving:false};
 assert.equal(beatFor(travelling,10.5,activity),'grades-bad');
 assert.ok(!MOMENT_CAPTIONS['grades-bad'].includes('instead of continued study'));
});

import {pivotById} from '../../dist/course/pivots.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {undoAnswer} from '../../dist/course/alternatives.js';
test('an unaffordable house is not published as a road not taken after renting adds cash',()=>{
 let s=begin(newLife(12));
 while(s.stage==='review'){
  if(s.story?.pending)s=resolveEncounter(s,encounterById(s.story.pending.id).options.find(o=>choiceAvailable(s,o)).id,.2);
  for(const p of pendingPivots(s)){const options=openOptions(p,s);s=applyPivot(s,p,options[12%options.length].id);}
  if(s.age===45){const r=s.pivots.find(r=>r.pivot==='buy-house');assert.equal(r.choice,'rent');
   const before=undoAnswer(s,r),p=pivotById(r.pivot);
   assert.ok(openOptions(p,s).some(o=>o.id==='buy'));assert.ok(!openOptions(p,before).some(o=>o.id==='buy'));
   assert.ok(!stationAlternatives(s).some(r=>r.pivot==='buy-house'&&r.option==='buy'));return;
  }s=live(s);
 }assert.fail('seed must reach the house decision');
});
