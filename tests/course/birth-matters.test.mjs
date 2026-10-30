import {test} from 'node:test';import assert from 'node:assert/strict';
import {choiceAvailable,netWorth} from '../../dist/course/finance.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {newLife,configureLife,begin,live,validate} from '../../dist/course/sim.js';
// The household you are born into changes what you can earn and what is left to you.
test('upbringing separates net worth at fifty and an estate follows the household',()=>{
 const mean={},estates={};
 for(const band of ['constrained','middle','comfortable']){
  let total=0,n=0;estates[band]=new Set();
  for(let seed=1;seed<=30;seed++){
   let s=begin(configureLife(newLife(seed),{upbringing:band,country:'th'}));
   while(s.age<80&&s.stage==='review'){s=live(s);if(s.story?.pending){const e=encounterById(s.story.pending.id);s=resolveEncounter(s,e.options.filter(o=>choiceAvailable(s,o))[0].id,.2);}
    if(s.age===50&&s.finance){total+=netWorth(s.finance);n++;}}
   assert.ok(validate(s),band+seed);
   for(const r of s.history)for(const m of r.event?.match(/(little to inherit|modest inheritance|substantial inheritance)/g)??[])estates[band].add(m);
  }
  mean[band]=total/n;
 }
 assert.ok(mean.constrained<mean.middle&&mean.middle<mean.comfortable,JSON.stringify(mean));
 assert.deepEqual([...estates.constrained],['little to inherit']);assert.deepEqual([...estates.comfortable],['substantial inheritance']);
});
