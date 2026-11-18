import test from 'node:test';
import assert from 'node:assert/strict';
import {playerSlotBirth,recordTaste,readTaste,dominantTaste,drawAdaptiveBirth} from '../../dist/course/taste-engine.js';
import {encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {begin,live,validate} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';

function playShort(life,strategy=0){
 let s=begin(life);
 for(let step=0;step<4&&s.stage==='review'&&s.age<30;step++){
  for(const p of pendingPivots(s)){
   const os=openOptions(p,s);
   s=applyPivot(s,p,os[strategy%os.length].id);
  }
  const ps=s.story?.pending;
  if(ps){
   const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));
   s=resolveEncounter(s,os[strategy%os.length].id,0.5);
  }
  s=live(s);
 }
 return s;
}

test('100 players get 100 distinct valid starting lives across eras, classes and regions, and can swap lives via birth codes',()=>{
 const seeds=new Set(),codes=new Set(),eras=new Set(),classes=new Set(),places=new Set();
 for(let slot=1;slot<=100;slot++){
  const life=playerSlotBirth(slot);
  assert.equal(validate(life),true,'slot '+slot+' valid');
  seeds.add(life.seed);
  eras.add(life.intake.birthYear);
  classes.add(life.intake.class);
  places.add(life.birth.place);
  const code=encodeBirth(life);
  assert.ok(code,'slot '+slot+' encodes');
  codes.add(code);
 }
 assert.equal(seeds.size,100,'all 100 player slots have distinct seeds');
 assert.equal(codes.size,100,'all 100 player slots have distinct shareable birth codes');
 assert.ok(eras.size>=7,'covers all historical cohorts');
 assert.equal(classes.size,5,'covers all 5 socioeconomic classes');
 assert.ok(places.size>=15,'covers at least 15 Thai birthplaces');

 // Player 1 and Player 42 swap lives and make different choices:
 const p1Birth=playerSlotBirth(1);
 const sharedCode=encodeBirth(p1Birth);
 const swapped=decodeBirth(sharedCode);
 assert.equal(swapped.seed,p1Birth.seed);
 assert.equal(swapped.birth.place,p1Birth.birth.place);
 const runA=playShort(p1Birth,0);
 const runB=playShort(swapped,1);
 assert.equal(validate(runA),true);
 assert.equal(validate(runB),true);
 assert.notDeepEqual(runA.pivots,runB.pivots,'swapped birth played differently diverges');
});

test('taste engine learns what a player explores and draws fresh unrepeated lives',()=>{
 const store=new Map();
 const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const l1={...playerSlotBirth(3),story:{seen:[{id:'b_bitcoin_2014',choice:'all'},{id:'b_drunk_keys',choice:'drive'}]},skills:{craft:4,drive:18,eq:6,iq:8,physique:6},stops:[]};
 recordTaste(storage,l1);
 const t1=readTaste(storage);
 assert.equal(t1.lives,1);
 assert.equal(dominantTaste(t1).key,'risk');

 const drawnSeeds=new Set(t1.seeds);
 for(let i=0;i<25;i++){
  const next=drawAdaptiveBirth(storage,()=>playerSlotBirth(i+10));
  assert.equal(validate(next),true);
  assert.equal(drawnSeeds.has(next.seed),false,'never repeats a learned seed');
  drawnSeeds.add(next.seed);
  recordTaste(storage,{...next,story:{seen:[{id:'r_singer_office_1',choice:'sing'}]},skills:{craft:20,drive:8,eq:8,iq:8,physique:6},stops:[{id:'sea_hua_hin',age:20}]});
 }
 assert.equal(readTaste(storage).lives,26);
});
