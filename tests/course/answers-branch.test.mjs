import test from 'node:test';
import assert from 'node:assert/strict';
import {newLife,begin,live,configureLife,replay,COHORT_YEARS} from '../../dist/course/sim.js';
import {drawBirth} from '../../dist/course/birth-draw.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {routeOf} from '../../dist/course/life-routes.js';
import {encodeBirth} from '../../dist/course/birthcode.js';
import {chapterPlans} from '../../dist/course/chapter-play.js';
import {childSpine,chooseChild,pendingChildChoice} from '../../dist/course/childhood-choices.js';
const play=(birth,pick)=>{let s=birth;const seen=[];
 const settle=()=>{for(let k=0;k<12;k++){const l=pendingPivots(s);if(!l.length)break;const q=l[0],op=openOptions(q,s),n=applyPivot(s,q,op[pick(op.length)].id);if(n===s)break;s=n;seen.push(q.id);}
  if(s.story?.pending){const e=encounterById(s.story.pending.id),op=e.options.filter(o=>choiceAvailable(s,o)),L=op.length?op:e.options;seen.push(e.id);s=resolveEncounter(s,L[pick(L.length)].id,.5);}};
 settle();for(let g=0;g<30&&s.stage==='review'&&s.age<80;g++){const n=live(s);if(n===s)break;s=n;settle();}return {s,seen};};
test('the same birth answered differently becomes a different life',()=>{
 let r=11;const R=()=>(r=(r*16807)%2147483647)/2147483647;let total=0,moved=0;const N=40;
 for(let i=0;i<N;i++){const b=begin(drawBirth({},{varied:true,random:R})),A=play(b,()=>0),B=play(b,n=>n-1);
  const a=new Set(A.seen),c=new Set(B.seen);total+=[...a].filter(x=>c.has(x)).length/new Set([...a,...c]).size;
  if([A,B].some(x=>x.s.finance?.region&&x.s.finance.region!==x.s.birth.region))moved++;}
 assert.ok(total/N<.62,'same birth, opposite answers share '+Math.round(total/N*100)+'% of their scenes');
 assert.ok(moved>=N/5,'only '+moved+' of '+N+' lives ever left home');
});
test('an answer at fifteen opens a calling the birth lottery did not give',()=>{
 let opened=0;for(let i=1;i<=60;i++){const s=begin(configureLife(newLife(i*97),{class:'middle_class',sex:'male',birthYear:1970}));
  const at15={...s,age:20,stage:'review',history:[...s.history,{age:15,pivots:[{station:15,pivot:'school-fall-climb',choice:'rise'}]}]};
  if(routeOf(at15)==='cadet')opened++;}
 assert.ok(opened>=50,'the officer academy opened for '+opened+' of 60');
});
test('a random life can be born in every historical era',()=>{
 let r=5;const R=()=>(r=(r*16807)%2147483647)/2147483647;const years=new Set();
 for(let i=0;i<200;i++)years.add(drawBirth({},{varied:true,random:R}).intake.birthYear);
 assert.deepEqual([...years].sort(),COHORT_YEARS.filter(y=>y<2026));
});

test('one childhood answer changes the education and cost of a replayed ordinary life',()=>{
 const birth=configureLife(newLife(5),{birthYear:1975,class:'low_class',sex:'female'});
 function toAge25(state,answer){
  for(const age of childSpine(state)){
   const question=pendingChildChoice(state,age);
   state=chooseChild(state,age,age===9?answer:question.options[0].id);
  }
  state=begin(state);
  for(const age of [10,15,20]){
   assert.equal(state.age,age);
   for(let decision=0;decision<30;decision++){
    if(state.story?.pending){
     const scene=encounterById(state.story.pending.id);
     state=resolveEncounter(state,scene.options.find(option=>choiceAvailable(state,option)).id,.5);
     continue;
    }
    const pivot=pendingPivots(state)[0];
    if(!pivot)break;
    const options=openOptions(pivot,state);
    state=applyPivot(state,pivot,(options.find(option=>option.id==='merit')??options[0]).id);
   }
   const plan=chapterPlans(state)[0];
   state=live({...state,effort:plan.effort,profile:plan.profile,pathway:age===15?'vocational':state.pathway});
  }
  assert.equal(state.age,25);
  return state;
 }
 const first=toAge25(birth,'school_say');
 const same=toAge25(replay(first),'school_say');
 const changed=toAge25(replay(first),'school_ask_teacher');
 assert.equal(encodeBirth(changed),encodeBirth(first));
 assert.deepEqual(same.history,first.history);
 assert.equal(first.history.at(-1).pathway,'vocational');
 assert.equal(changed.history.at(-1).pathway,'college');
 assert.ok(changed.history.at(-1).pivots.some(record=>record.pivot==='college-cost'&&record.choice==='merit'));
 assert.ok(!first.history.at(-1).pivots.some(record=>record.pivot==='college-cost'));
 assert.ok(changed.cash<first.cash);
});
