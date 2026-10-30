import {test} from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live,validate} from '../../dist/course/sim.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {pendingPivots} from '../../dist/course/pivots.js';
// The flood and the parents' deaths belong to some worlds, not all, and their questions follow them.
test('plot points vary by world and their pivots are asked only where they happened',()=>{
 const seen={flood:0,father:0,mother:0};let n=0;
 for(let seed=1;seed<=60;seed++){
  let s=begin(newLife(seed));n++;const had={flood:false,father:false,mother:false};
  while(s.stage==='review'&&s.age<80){
   s=live(s);if(s.stage!=='review')break;
   const ps=s.story?.pending;
   const row=s.history.at(-1),ids=pendingPivots(s).map(p=>p.id);
   if(/Floodwater/.test(row.event)){had.flood=true;}else assert.ok(!ids.some(i=>i.startsWith('flood-')),'flood question without a flood, seed '+seed);
   if(/father dies/.test(row.event))had.father=true;else assert.ok(!ids.includes('father-tools'),'father question without a death, seed '+seed);
   if(/mother dies/.test(row.event))had.mother=true;else assert.ok(!ids.includes('empty-house'),'mother question without a death, seed '+seed);
   if(ps)s=resolveEncounter(s,encounterById(ps.id).options.find(o=>choiceAvailable(s,o)).id,.2);
  }
  for(const k of Object.keys(seen))if(had[k])seen[k]++;
 }
 for(const k of Object.keys(seen))assert.ok(seen[k]>0&&seen[k]<n,k+' should vary: '+seen[k]+'/'+n);
});
