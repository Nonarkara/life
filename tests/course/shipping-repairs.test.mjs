import test from 'node:test';import assert from 'node:assert/strict';
import {newLife,configureLife,begin,live,projectedSkillGains,lockedEffort,transfer,AXES} from '../../dist/course/sim.js';
import {routine} from '../../dist/course/routines.js';
import {roleFor} from '../../dist/course/stage2d.js';
import * as T from 'three';import {createCharacter} from '../../dist/course/character3d.js';
import {translate} from '../../dist/course/i18n.js';

test('the period projection is pure and matches realized skill gains across ages, routes and budgets',()=>{
 for(const seed of [1,17,41,109])for(const age of [10,15,20,35,55,65,75])for(const pathway of ['school','college','vocational','independent','work']){
  let s=begin(configureLife(newLife(seed)));s={...s,age,pathway,skills:{physique:4,iq:10,eq:8,craft:9,drive:7},pivotFlags:age===20?{meritScholar:true}:{}};
  const original=JSON.stringify(s),estimate=projectedSkillGains(s),next=live(s);
  assert.equal(JSON.stringify(s),original,'preview must never mutate a saved life');
  for(const {key}of AXES)assert.equal(estimate.gains[key],next.skills[key]-s.skills[key],`${seed}/${age}/${pathway}/${key}`);
 }
});
test('pond travel swims inside water and walks on land on both entry and exit',()=>{
 let entries=0,exits=0;
 for(let time=8;time<48;time+=.05){const a=routine('player',5,time),inside=a.y>9.12&&a.y<10.23&&a.x>3.22&&a.x<5.38;if(inside){assert.equal(a.pose,'swim');if(time<20)entries++;if(time>=36)exits++;}else if(a.moving)assert.equal(a.pose,'walk');}
 assert.ok(entries>0&&exits>0);
});
test('painted mode cannot misrepresent swimming or falling with a crouching picture',()=>{
 assert.equal(roleFor('player',5,'swim',false,'street'),null);assert.equal(roleFor('player',3,'fall',false,'home'),null);
});
test('new forecast qualifications are translated in every supported language',()=>{
 for(const lang of ['th','zh-CN','ja','ko'])for(const copy of ['Predicted five-year skill gain','Gains beside each skill · next five years','How this projection works','Age multipliers','Authored scenario estimate, not a real-life prediction. Includes study budget and scheduled consequences; new choices can change it.'])assert.notEqual(translate(copy,lang),copy);
});

test('after-school cycling starts where the school activity ended',()=>{
 const before=routine('player',8,35.999),after=routine('player',8,36);
 assert.ok(Math.hypot(after.x-before.x,after.y-before.y)<.01);assert.equal(after.pose,'walk','leave the classroom on foot before mounting');
});

test('simultaneous commitments cannot steal effort from one another',()=>{
 const locks={iq:3,craft:3,physique:2},p={physique:2,iq:3,eq:1,craft:3,drive:1};
 const moved=transfer(p,'eq',1,locks);assert.equal(moved.iq,3);assert.equal(moved.craft,3);assert.equal(moved.physique,2);
 assert.equal(transfer(moved,'eq',1,locks),moved,'no unlocked donor remains');
 const s={age:10,effort:{...p,iq:2,eq:2},pivots:[{station:10,locks}]};const restored=lockedEffort(s);
 for(const [axis,min]of Object.entries(locks))assert.ok(restored[axis]>=min);assert.equal(Object.values(restored).reduce((a,b)=>a+b),10);
});

test('moving swimmer head and torso remain in the basin throughout entry and exit',()=>{
 const character=createCharacter();for(let time=8;time<48;time+=.05){const a=routine('player',5,time);if(a.pose!=='swim')continue;character.update(a,5,time,{scale:.655});character.root.updateMatrixWorld(true);
 for(const key of ['head','torso']){const p=character.anchors[key].getWorldPosition(new T.Vector3());assert.ok(p.x>=3.22&&p.x<=5.38&&p.z>=8.87&&p.z<=10.23,`${key} outside water at ${time}: ${p.toArray()}`);}}
});

test('school bike return mounts outside the classroom and dismounts before the home doorway',()=>{
 let rode=0;for(let time=36;time<48;time+=.05){const a=routine('player',8,time);if(a.pose!=='ride')continue;rode++;assert.ok(a.x<=8.51&&(a.x>=8.49||a.y>=7.19),'bicycle stays on the lane, away from desks and home interior');}assert.ok(rode>0);
});
