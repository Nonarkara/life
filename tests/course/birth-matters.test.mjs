import {test} from 'node:test';import assert from 'node:assert/strict';
import {choiceAvailable,netWorth} from '../../dist/course/finance.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {newLife,configureLife,begin,live,validate} from '../../dist/course/sim.js';
// The household you are born into changes what you can earn and what is left to you.
test('birth background estates stay coherent and every period remains valid',()=>{
 const estates={};
 for(const cls of ['low_class','middle_class','high_class']){
  estates[cls]=new Set();
  for(let seed=1;seed<=30;seed++){
   let s=begin(configureLife(newLife(seed),{class:cls}));
   while(s.age<80&&s.stage==='review'){s=live(s);if(s.story?.pending){const e=encounterById(s.story.pending.id);s=resolveEncounter(s,e.options.filter(o=>choiceAvailable(s,o))[0].id,.2);}assert.ok(validate(s),cls+' seed '+seed+' age '+s.age);}
   for(const r of s.history)for(const m of r.event?.match(/(nothing to inherit|modest inheritance|substantial inheritance|little to inherit|A little is left|A government pension|A family estate)/g)??[])estates[cls].add(m);
  }
 }
 // When an estate message appears, it must match the class.
 for(const m of estates.low_class)assert.ok(m==='nothing to inherit'||m==='A little is left, barely enough.',m);
 for(const m of estates.middle_class)assert.ok(m==='modest inheritance'||m==='A modest inheritance reaches you.',m);
 for(const m of estates.high_class)assert.ok(m==='substantial inheritance'||m==='A substantial inheritance reaches you.',m);
});
