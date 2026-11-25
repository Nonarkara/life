import test from 'node:test';
import assert from 'node:assert/strict';
const root='../../dist/course/';
const {playerSlotBirth}=await import(root+'taste-engine.js');
const {begin,live,validate}=await import(root+'sim.js');
const {pendingPivots,applyPivot,openOptions}=await import(root+'pivots.js');
const {encounterById,resolveEncounter}=await import(root+'encounters.js');
const {choiceAvailable}=await import(root+'finance.js');
const {crisisRecord}=await import(root+'crisis-chapter.js');
const {nextJourneyEvent}=await import(root+'journey.js');
test('both crisis households keep the same historical date and settle each branch once',()=>{
for(const slot of [4,13])for(const [job,support] of [['move','pay'],['stay','time']]){
 let state=begin(playerSlotBirth(slot));
 while(state.age<30&&state.stage==='review'){
  for(let i=0;i<24;i++){
   if(state.story?.pending){const scene=encounterById(state.story.pending.id);state=resolveEncounter(state,scene.options.find(o=>choiceAvailable(state,o)).id,.5);continue;}
   const p=pendingPivots(state)[0];if(!p)break;
   const choice=p.job===1996?job:p.id==='job-crisis-support'?support:openOptions(p,state)[0].id;
   const next=applyPivot(state,p,choice);assert.notEqual(next,state,slot+' '+p.id+' '+choice);state=next;
  }
  const next=live(state);assert.ok(next.age>state.age);state=next;assert.ok(validate(state));
  if(state.age===25){
   const r=crisisRecord(state);assert.equal(r.offer,job);assert.equal(r.support,support);
   assert.equal(r.age,22);assert.equal(r.householdPayment,job==='move'?(slot===4?1800:900):0);
   assert.equal(r.wageChange<0,job==='move');
   const e=nextJourneyEvent(state,(state.history.at(-1).events??[]).filter(e=>e.origin==='life').map(e=>e.age+':'+e.id));
   assert.equal(e.id,'crisis');
  }
 }
 assert.equal(state.age,30);
 assert.ok(!state.history.at(-1).event.includes('The move cost you.'),'the legacy adjustment does not settle again');assert.equal(state.history.flatMap(r=>r.events??[]).filter(e=>e.origin==='crisis').length,1);
}
});
