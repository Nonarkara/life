import test from 'node:test';
import assert from 'node:assert/strict';
import {begin,configureLife,live,newLife,rand,validate} from '../../dist/course/sim.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {applyPivot,openOptions,pendingPivots} from '../../dist/course/pivots.js';
import {regionAt} from '../../dist/course/regions.js';

function reach(start,target,answers){
 let state=start;
 for(let period=0;period<16&&state.stage==='review';period++){
  if(state.story.pending?.id===target)return state;
  const scene=encounterById(state.story.pending?.id);
  if(scene){
   const choices=scene.options.filter(option=>choiceAvailable(state,option));
   const choice=answers[scene.id]??choices.at(-1)?.id;
   state=resolveEncounter(state,choice,rand(state.seed,state.age,'encounter-result'));
  }
  for(let i=0;i<8;i++){
   const question=pendingPivots(state)[0];
   if(!question)break;
   const choices=openOptions(question,state);
   state=applyPivot(state,question,choices.at(-1).id);
  }
  const next=live(state);
  if(next===state)break;
  state=next;
 }
 return null;
}

const cases=[
 {root:'r_singer_office_1', choices:['sing','college'], paths:['r_singer_office_tape','r_singer_office_2']},
 {root:'r_border_pm_2', choices:['leave','learn'], paths:['r_border_pm_bricks','r_border_pm_3'], answers:{r_border_pm_1:'serve'}},
 {root:'r_olympian_pm_2', choices:['coach','politics'], paths:['r_olympian_pm_coach','r_olympian_pm_3'], answers:{r_olympian_pm_1:'train'}}
];

for(const {root,choices,paths,answers={}} of cases)test(root+' changes the later question for the same birth',()=>{
 let matched=0;
 for(let i=1;i<=1800&&matched<3;i++){
  const seed=i*7919,initial=begin(configureLife(newLife(seed),{class:'working_class',sex:'female',birthYear:1970,region:'pak-phanang'}));
  const checkpoint=reach(initial,root,answers);
  if(!checkpoint)continue;
  const runs=choices.map((choice,index)=>{
   const state=resolveEncounter(structuredClone(checkpoint),choice,.5);
   if(state.story.pending)return null;
   if(choice==='politics')assert.equal(regionAt(state),'bang-na','taking office moves the life to Bangkok');
   if(choice==='coach')assert.equal(regionAt(state),regionAt(checkpoint),'coaching keeps the current base');
   const wrong=encounterById(paths[1-index]);
   assert.equal(wrong.eligible({...state,age:wrong.min}),false,'opposite path disallowed');
   return reach(state,paths[index],{});
  });
  if(!runs.every(Boolean))continue;
  for(const run of runs){
   assert.equal(run.seed,seed);
   assert.ok(validate(JSON.parse(JSON.stringify(run))),run.story.pending.id);
   const first=encounterById(run.story.pending.id).options.find(o=>choiceAvailable(run,o));
   assert.ok(first,run.story.pending.id);
   const answered=resolveEncounter(run,first.id,.5);
   assert.notEqual(answered,run);
   assert.ok(validate(JSON.parse(JSON.stringify(answered))),run.story.pending.id);
  }
  matched++;
 }
 assert.equal(matched,3,'three ordinary births reached both branches via real answers');
});
