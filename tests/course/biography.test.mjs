import test from 'node:test';import assert from 'node:assert/strict';
import {roomRecord,recordedCommute,commuteSchedule} from '../../dist/course/biography.js';
import {routine,routineContext} from '../../dist/course/routines.js';
const state={age:35,pathway:'work',finance:{housing:'far',workplace:'city',locationSince:30,purchases:[{age:25,key:'book'},{age:35,key:'comics'}]},history:[{age:25,from:20,pathway:'work',finance:{housing:'family',workplace:'local',locationSince:20}},{age:35,from:30,pathway:'work'}],story:{seen:[{id:'remember',age:55}]}};
test('one recognizable case follows the recorded move, without future possessions or remembrance',()=>{
 assert.equal(roomRecord(state,0).possessions.length,0);
 for(const age of [6,12,25,35]){const r=roomRecord(state,age);assert.equal(r.possessions.length,1);assert.equal(r.possessions[0].id,'school-case');assert.equal(r.possessions[0].home,age<30?'family':'far');assert.equal(r.remembered,false);}
 assert.equal(roomRecord(state,12).books,0);assert.equal(roomRecord(state,30).books,1);assert.equal(roomRecord(state,30).comics,0);assert.equal(roomRecord(state,35).comics,1);
 assert.equal(roomRecord(state,55).remembered,true);assert.equal(roomRecord(state,35).workspace,false);
 const before=JSON.stringify(state);roomRecord(state,12);assert.equal(JSON.stringify(state),before);
});
test('recorded city distance changes home time, not the past or the parents routine',()=>{
 assert.equal(recordedCommute(state,25,'work'),60);assert.equal(recordedCommute(state,35,'work'),130);assert.equal(recordedCommute(state,35,'independent'),null);
 const far=routineContext(state,35),near={...far,commute:20};
 assert.equal(routine('player',35,48,'balance',far).moving,true);assert.equal(routine('player',35,48,'balance',near).moving,false);
 assert.equal(routine('player',35,7,'balance',far).moving,true);assert.equal(routine('player',35,7,'balance',near).pose,'eat');
 assert.deepEqual(routine('mother',35,48,'balance',far),routine('mother',35,48,'balance',near));
 for(const commute of [20,60,80,110,130]){const c={...far,commute},s=commuteSchedule(commute);for(const time of [s.depart,20,36,s.home,60]){const a=routine('player',35,time-.00001,'balance',c),b=routine('player',35,time+.00001,'balance',c);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.001,commute+': '+time);}}
});

test('the carried case occupies no existing routine, and appears only after school age',async()=>{
 const {RESIDENCES}=await import('../../dist/course/locations.js');
 for(const home of Object.values(RESIDENCES))for(const pathway of ['work','vocational','independent','school'])for(let time=0;time<60;time+=.1){
  const c={residence:home,workplace:{id:'local',destination:[11.3,5.8],approach:[[10.3,7.2],[10.3,5.8]]},pathway,commute:60};
  const p=routine('player',35,time,'balance',c),[x,z]=home.base;
  assert.ok(!(p.x+.08>x+3.12&&p.x-.08<x+3.5&&p.y+.08>z+2.2&&p.y-.08<z+2.39),home.id+'/'+pathway+'/'+time);
 }
});
