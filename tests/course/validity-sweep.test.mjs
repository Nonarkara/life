import {test} from 'node:test';import assert from 'node:assert/strict';
import {choiceAvailable} from '../../dist/course/finance.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {newLife,configureLife,begin,live,validate} from '../../dist/course/sim.js';
// A life that recovers after an encounter must stay a valid save: eligibility is judged
// on the numbers the player saw, not on where they ended up (seeds 7 and 17 failed once).
test('lives stay valid at every step under three choice strategies',()=>{
 for(const seed of [7,17,23])for(const mode of [0,1,2]){
  const settle=s=>{if(!s.story?.pending)return s;const o=encounterById(s.story.pending.id).options.filter(o=>choiceAvailable(s,o));return resolveEncounter(s,o[mode===0?0:(s.age/5+seed+mode)%o.length|0].id,.2);};
  let s=begin(configureLife(newLife(seed)));
  while(s.age<80&&s.stage==='review'){s=settle(live(settle(s)));assert.ok(validate(s),`seed ${seed} mode ${mode} age ${s.age}`);}
 }
});
