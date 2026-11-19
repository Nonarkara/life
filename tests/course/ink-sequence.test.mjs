import test from 'node:test';
import assert from 'node:assert/strict';
import {createInkSequence,inkIdentity,inkToe} from '../../dist/course/ink-sequence.js';

test('rendered sole contact stays planted through acceleration, heel lift and stopping at both ages',()=>{
 for(const age of [10,35]){
  const seq=createInkSequence({age});let previous=null,heelSamples=0;
  for(let i=0;i<=3000;i++){
   const frame=seq.sample(seq.duration*i/3000),toes=[inkToe(frame,0),inkToe(frame,1)];
   assert.ok(Number.isFinite(frame.x));assert.ok(frame.x>=0);
   for(let k=0;k<2;k++){
    assert.ok(toes[k][1]<=120+1e-9,'swing toe never penetrates the floor');
    if(previous)assert.ok(Math.hypot(toes[k][0]-previous.toes[k][0],toes[k][1]-previous.toes[k][1])<1,'no jump at stance/swing boundary');
    if(frame.pose.feet[k].stance){
     assert.ok(Math.abs(toes[k][1]-120)<1e-9,'actual rotating toe stays on floor');
     if(frame.pose.feet[k].pitch>5)heelSamples++;
     if(previous?.frame.pose.feet[k].stance)assert.ok(Math.abs(toes[k][0]-previous.toes[k][0])<1e-9,'world-space contact does not slide');
    }
   }
   if(previous){assert.ok(frame.x>=previous.frame.x,'never wraps or teleports back');assert.ok(frame.x-previous.frame.x<.3,'continuous travel');}
   previous={frame,toes};
  }
  assert.ok(heelSamples>20,'the test actually reaches heel-off');
  assert.deepEqual(seq.sample(seq.duration+10),seq.sample(seq.duration),'one-shot ends without restarting');
 }
});

test('identity is explicit and stable across ages, actions and backwards seeks',()=>{
 const profile=inkIdentity({seed:20,sex:'female',look:{skin:'#b98c6b',hairStyle:'bun',shirt:'#fff',bottom:'#345'}});
 for(const age of [10,35]){const seq=createInkSequence({age,profile});for(const time of [0,1,4,2,100,0])assert.equal(seq.sample(time).profile,profile);assert.deepEqual(seq.sample(1),seq.sample(1));assert.equal(seq.sample(100).action,'finished');}
 assert.equal(profile.sex,'female','even seed must not turn recorded female into male');
 assert.equal(profile.hairStyle,'bun');assert.equal(profile.skin,'#b98c6b');assert.ok(Object.isFrozen(profile));
});
