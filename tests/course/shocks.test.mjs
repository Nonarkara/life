import {test} from 'node:test';import assert from 'node:assert/strict';
import {choiceAvailable} from '../../dist/course/finance.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {newLife,begin,live,validate} from '../../dist/course/sim.js';
const effortFor=lean=>{const e={physique:0,iq:0,eq:0,craft:0,drive:0};e[lean]=6;let left=4;for(const k of Object.keys(e)){if(k!==lean&&left>0){e[k]=2;left-=2;}}return e;};
// Ordinary years say something specific, rare turns exist, and setbacks scale with what you earn.
test('periods vary in what they say and rare turns appear across worlds',()=>{
 const counts={ordinary:new Set(),accident:0,fraud:0,windfall:0,interruption:[]};
 for(let seed=1;seed<=120;seed++){
  let s=begin(newLife(seed));
  const lean=['physique','iq','eq','craft','drive'][seed%5];
  while(s.age<80&&s.stage==='review'){s={...s,effort:effortFor(lean)};s=live(s);if(s.story?.pending){const o=encounterById(s.story.pending.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,o[0].id,.2);}
   const r=s.history.at(-1),t=r.event??'';
   if(/An ordinary five years\./.test(t))counts.ordinary.add(t.match(/An ordinary five years\. ([^.]*\.)/)?.[1]);
   if(/An accident leaves/.test(t))counts.accident++;if(/takes your savings/.test(t))counts.fraud++;if(/windfall/.test(t))counts.windfall++;
   if(/work interruption/.test(t))counts.interruption.push([r.earnings??0,r.setback??0]);}
  assert.ok(validate(s),'seed '+seed);
 }
 assert.ok(counts.ordinary.size>=4,[...counts.ordinary].join('|'));
 assert.ok(counts.accident>0&&counts.fraud>0&&counts.windfall>0,JSON.stringify(counts));
 const hi=counts.interruption.filter(([e])=>e>0).sort((a,b)=>b[0]-a[0]),top=hi.slice(0,5),low=hi.slice(-5);
 assert.ok(Math.max(...top.map(x=>x[1]))>Math.max(...low.map(x=>x[1])),'higher earners lose more in an interruption');
});
