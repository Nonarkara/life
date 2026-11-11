import assert from 'node:assert/strict';
import {test} from 'node:test';
import {pendingChildChoice} from '../../dist/course/childhood-choices.js';
import {drawBirth} from '../../dist/course/birth-draw.js';
import {configureLife,newLife,replay} from '../../dist/course/sim.js';
import {decodeBirth,encodeBirth} from '../../dist/course/birthcode.js';

test('27 consecutive fresh lives change class, home and era every time',()=>{
 let previous=Array.from({length:50},(_,i)=>configureLife(newLife(i+1),{birthYear:1949}))
  .find(life=>life.birth.home==='a market-stall household');
 assert.ok(previous);
 let counter=previous.seed-1;
 const random=()=>counter++/2147483646;
 const openingQuestions=new Set();
 const homes=new Set([previous.birth.home]),eras=new Set([1949]),seeds=new Set([previous.seed]);
 for(let i=0;i<27;i++){
  const next=drawBirth({},{previous,varied:true,random});
  assert.notEqual(next.birth.home,previous.birth.home);
  assert.notEqual(next.birth.class,previous.birth.class);
  assert.notEqual(next.intake.birthYear,previous.intake.birthYear);
  assert.ok(!seeds.has(next.seed));
  const opening=pendingChildChoice(next,6);
  openingQuestions.add(opening.title);
  if(previous.birth.home==='a market-stall household')assert.ok(opening.options.every(option=>option.id!=='help'));
  assert.deepEqual(decodeBirth(encodeBirth(next)).birth,next.birth);
  assert.deepEqual(replay(next).birth,next.birth);
  homes.add(next.birth.home);eras.add(next.intake.birthYear);seeds.add(next.seed);
  previous=next;
 }
 assert.ok(homes.size>=4);
 assert.ok(openingQuestions.size>=2);
 assert.equal(eras.size,3);
});

test('explicit cohorts, classes and the timeless calendar stay available',()=>{
 assert.equal(drawBirth({birthYear:1981},{varied:true,random:()=>.4}).intake.birthYear,1981);
 assert.equal(drawBirth({birthYear:'random'},{varied:true,random:()=>.4}).intake.birthYear,undefined);
 assert.equal(drawBirth({birthYear:'historical',class:'high_class'},{random:()=>.4}).birth.class,'high_class');
});
