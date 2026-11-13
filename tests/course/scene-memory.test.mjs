import test from 'node:test';
import assert from 'node:assert/strict';
import {newLife,configureLife,begin,live} from '../../dist/course/sim.js';
import {eligibleEncounters,offerEncounter,setFamiliar,encounterById} from '../../dist/course/encounters.js';
// Phase 4: a device remembers the scenes it has met, so the next life prefers ones it has not.
function station(){for(let seed=1;seed<400;seed++){let s=begin(configureLife(newLife(seed),{birthYear:1970,class:'middle_class',sex:'female'}));
 while(s.stage==='review'&&s.age<40){const free={...s,story:{...s.story,pending:null}};const pool=eligibleEncounters(free),ordinary=pool.filter(e=>(e.priority??2)===2&&!e.urgent&&!e.arcBeat);
  if(pool.every(e=>(e.priority??2)===2&&!e.urgent&&!e.arcBeat)&&ordinary.length>=4&&new Set(ordinary.map(e=>e.category)).size>=2)return {s:{...free,novelty:true},ordinary};if(s.story?.pending)s={...s,story:{...s.story,pending:null,seen:[...s.story.seen,{id:s.story.pending.id,age:s.age,choice:encounterById(s.story.pending.id).options[0].id,outcome:'',effects:{cash:0,health:0,wellbeing:0,skills:{}}}]}};const n=live(s);if(n===s)break;s=n;}}}
test('an ordinary scene met in an earlier life steps aside for one not met yet',()=>{
 const {s,ordinary}=station(),lastKind=encounterById(s.story.seen.at(-1)?.id)?.category,novel=ordinary.find(e=>e.category!==lastKind);
 try{setFamiliar(ordinary.filter(e=>e!==novel).map(e=>e.id));
  for(const roll of [.01,.2,.5,.8,.99])assert.equal(offerEncounter(s,roll).story.pending.id,novel.id);
  // The daily life is the same for everyone, whatever this device has met.
  // A replay, a shared code or the daily life (no novelty mark) is not steered by this device's memory.
  const plain={...s,novelty:undefined};setFamiliar([]);const before=[.01,.5,.99].map(r=>offerEncounter(plain,r).story.pending.id);
  setFamiliar(ordinary.filter(e=>e!==novel).map(e=>e.id));assert.deepEqual([.01,.5,.99].map(r=>offerEncounter(plain,r).story.pending.id),before);
  // An unmet scene of the same kind as the last one does not push out met scenes of another kind.
  if(lastKind){const same=ordinary.filter(e=>e.category===lastKind);if(same.length){setFamiliar(ordinary.filter(e=>!same.includes(e)).map(e=>e.id));const picks=new Set([.01,.2,.5,.8,.99].map(r=>offerEncounter(s,r).story.pending.id));assert.ok([...picks].some(id=>encounterById(id).category!==lastKind)||ordinary.every(e=>e.category===lastKind));}}
  // When every scene has been met, the bank still offers one.
  setFamiliar(ordinary.map(e=>e.id));assert.ok(offerEncounter(s,.5).story.pending);
 }finally{setFamiliar([]);}
});
test('the cousin\'s shirt is a childhood scene, so it can be met at ten',()=>{assert.equal(encounterById('w2_uniform').child,true);});
test('a freshly drawn life carries the novelty mark; a replay does not',async()=>{
 const {drawBirth}=await import('../../dist/course/birth-draw.js');const {replay}=await import('../../dist/course/sim.js');
 const l=drawBirth({birthYear:'historical'},{random:()=>.37});assert.equal(l.novelty,true);assert.equal(replay(begin(l)).novelty,undefined);
});
