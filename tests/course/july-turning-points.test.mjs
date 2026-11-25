import test from 'node:test';
import assert from 'node:assert/strict';
import {keepTurningPoint,readTurningPoints,loadTurningPoint} from '../../dist/course/turning-points.js';
import {begin,configureLife,live,newLife,validate} from '../../dist/course/sim.js';
import {encounterById,offerEncounter,resolveEncounter,storyContext} from '../../dist/course/encounters.js';
import {familyGuardians} from '../../dist/course/family-record.js';
import {HOUSEHOLDS,REGIONS} from '../../dist/course/regions.js';
import {birthProvince} from '../../dist/course/birth-opening.js';
import {choiceAvailable} from '../../dist/course/finance.js';

function storage(){
 const values=new Map();
 return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
}
const birth=seed=>begin(configureLife(newLife(seed),{birthYear:1981,class:'working_class',sex:'female'}));
function settle(state){
 const scene=encounterById(state.story.pending?.id);
 return scene?resolveEncounter(state,scene.options.find(o=>choiceAvailable(state,o)).id,.5):state;
}
function atAge(state,age){
 while(state.stage==='review'&&state.age<age)state=live(settle(state));
 return state;
}
const seek=(state,id)=>offerEncounter({...state,story:{...state.story,pending:null}},.3,e=>e.id===id);

test('archived points restore a valid exact review after a new birth and preserve the original answer',()=>{
 const box=storage(),first=live(birth(5)),second=live(birth(6)),scene=first.story.pending.id;
 const record={scene,title:'A named decision',answer:'First answer',met:['friend']};
 const id=keepTurningPoint(box,first,record);
 const secondId=keepTurningPoint(box,second,{...record,scene:second.story.pending.id});
 assert.notEqual(secondId,id);
 assert.equal(keepTurningPoint(box,first,{...record,answer:'Other answer'}),id);
 assert.equal(readTurningPoints(box).length,2);
 const point=loadTurningPoint(box,id,validate);
 assert.ok(point,'must pass save validation after JSON serialization');
 assert.deepEqual(point.state.story.pending,first.story.pending);
 assert.equal(point.answer,'First answer');
 assert.deepEqual(point.met,['friend']);
 for(let i=0;i<10;i++)keepTurningPoint(box,second,{...record,scene:'fork'+i});
 assert.ok(loadTurningPoint(box,id,validate),'a single other birth cannot crowd out the original');
});

test('a new point dropped under quota cannot return a successful ID',()=>{
 let persisted=null;
 const box={getItem:()=>persisted,setItem:(_,value)=>{
  if(JSON.parse(value).length>1)throw new Error('quota');
  persisted=value;
 }};
 const state=birth(5),record={title:'Decision',answer:'Answer',met:[]};
 const original=keepTurningPoint(box,state,{...record,scene:'featured-school'});
 assert.equal(keepTurningPoint(box,state,{...record,scene:'ordinary'}),null);
 assert.deepEqual(readTurningPoints(box).map(point=>point.id),[original]);
});

test('two conditions of the same seed keep distinct points and the old link stays valid',()=>{
 const box=storage(),a=birth(5);
 const b=begin(configureLife(newLife(5),{birthYear:1975,class:'low_class',sex:'female'}));
 const record={scene:'school',title:'Decision',answer:'Answer',met:[]};
 box.setItem('life-turning-points-v1',JSON.stringify([{...record,id:'5.10.school',state:a}]));
 const id=keepTurningPoint(box,b,record);
 assert.notEqual(id,'5.10.school');
 assert.equal(keepTurningPoint(box,a,record),'5.10.school');
 assert.equal(loadTurningPoint(box,id,validate).state.intake.birthYear,1975);
});

test('all household roles agree with the birth record and all Thai births have sourced province geometry',()=>{
 for(const [id,composition] of Object.entries(HOUSEHOLDS)){
  const people=familyGuardians({seed:6,birth:{household:id,class:'working_class'}});
  assert.deepEqual(people.map(p=>p.role),[composition.father.role,composition.mother.role]);
  assert.notEqual(people[0].name,people[1].name);
 }
 for(const [id,region] of Object.entries(REGIONS))if(region.country==='TH'){
  assert.match(birthProvince({birth:{region:id}})?.[1]??'',/^M/,id);
 }
});

test('the guardian returns by name only on the care branch',()=>{
 let contender;
 for(let seed=1;seed<500&&!contender;seed++){
  const state=seek(live(birth(seed)),'family_exam');
  if(state.story.pending?.id==='family_exam')contender=state;
 }
 assert.ok(contender);
 const name=storyContext(contender,'family_exam').people.friend;
 assert.ok(familyGuardians(contender).some(p=>p.name===name));
 const care=resolveEncounter(contender,'home',.5),exam=resolveEncounter(contender,'exam',.5);
 assert.ok(care.story.seen.at(-1).outcome.includes(name));
 assert.equal(care.pathway,'vocational');
 assert.ok(validate(care)&&validate(exam));
 const nextCare=seek(live(care),'family_exam_return'),nextExam=seek(live(exam),'family_exam_return');
 assert.equal(nextCare.story.pending?.id,'family_exam_return');
 assert.equal(nextExam.story.pending,null);
 assert.equal(storyContext(nextCare,'family_exam_return').people.friend,name);
 assert.ok(validate(nextCare));
});

test('an early parenting story and a later care decision follow the recorded answers',()=>{
 let chosen;
 for(let seed=1;seed<500&&!chosen;seed++){
  const scene=seek(live(birth(seed)),'teen_boundaries');
  if(scene.story.pending?.id!=='teen_boundaries')continue;
  const yes=resolveEncounter(scene,'yes',.5),wait=resolveEncounter(scene,'wait',.5);
  const parents=seek(live(yes),'teen_parenthood');
  if(parents.story.pending?.id!=='teen_parenthood')continue;
  assert.equal(seek(live(wait),'teen_parenthood').story.pending,null);
  const deferred=resolveEncounter(parents,'away',.5);
  assert.ok(validate(deferred));
  chosen=seek(live(deferred),'care_returns');
 }
 assert.equal(chosen?.story.pending?.id,'care_returns');
 assert.ok(validate(chosen));
});

test('a partner can say yes or no and the same saved proposal gives the same answer',()=>{
 const results=new Set();
 for(let seed=1;seed<500&&results.size<2;seed++){
  const dating=seek(atAge(birth(seed),25),'love');
  const together=resolveEncounter(dating,'date',.5);
  if(together===dating)continue;
  const scene=seek(atAge(together,30),'proposal_first');
  if(scene.story.pending?.id!=='proposal_first')continue;
  const asked=resolveEncounter(scene,'ask',.1);
  const reopened=resolveEncounter(JSON.parse(JSON.stringify(scene)),'ask',.99);
  assert.equal(JSON.stringify(asked),JSON.stringify(reopened));
  assert.ok(validate(asked));
  const accepted=asked.story.flags.committed===scene.age;
  results.add(accepted);
  const next=seek(atAge(asked,35),'proposal_wedding');
  if(next.stage==='review')assert.equal(next.story.pending?.id==='proposal_wedding',accepted);
 }
 assert.equal(results.size,2);
});
