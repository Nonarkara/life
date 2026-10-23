import test from 'node:test';import assert from 'node:assert/strict';
import {newLife,configureLife,begin,live,replay,validate,rand} from '../../dist/course/sim.js';
import {ENCOUNTERS,encounterById,eligibleEncounters,offerEncounter,resolveEncounter} from '../../dist/course/encounters.js';
import {eventsFor} from '../../dist/course/events.js';
import {capacities,capacityHistory,comparison} from '../../dist/course/personality.js';
import {translate} from '../../dist/course/i18n.js';
const settle=(s,id,roll=.2)=>s.story?.pending?resolveEncounter(s,id??encounterById(s.story.pending.id).options[0].id,roll):s;
test('a pending encounter cannot be skipped, replayed or charged twice',()=>{
 const before=begin(configureLife(newLife(1))),pending=live(before);assert.equal(pending.story.pending.id,'friend');assert.equal(live(pending),pending);
 const resolved=settle(pending,'join');assert.equal(resolved.cash,pending.cash-300);assert.equal(resolved.history.length,pending.history.length);assert.deepEqual(resolved.attributes,before.attributes);assert.equal(resolved.story.flags.friend,15);assert.ok(validate(resolved));
 assert.equal(resolveEncounter(resolved,'join',.1),resolved);assert.equal(resolveEncounter(pending,'bogus',.1),pending);assert.equal(offerEncounter(resolved,.1),resolved);
});
test('follow-ups require the actual earlier commitment and enough elapsed years',()=>{
 let s=begin(newLife(1));s=settle(live(s),'home');assert.ok(!('friend' in s.story.flags));
 const at=a=>({...s,age:a});assert.ok(!eligibleEncounters(at(65)).some(e=>e.id==='friend_late'));assert.ok(!eligibleEncounters(at(35)).some(e=>e.id==='commitment'));
 let project=settle(live({...s,age:15}), 'start');assert.equal(project.story.flags.project,20);
 assert.ok(!eligibleEncounters({...project,age:25}).some(e=>e.id==='project_return'));
 assert.ok(eligibleEncounters({...project,age:35}).some(e=>e.id==='project_return'));
});
test('marriage is an adult mutual commitment and its marker is recorded only on that choice',()=>{
 assert.ok(!eligibleEncounters({...begin(newLife(1)),age:15}).some(e=>['love','commitment','parenthood'].includes(e.id)));
 let s=settle(live(begin(newLife(1))),'join');s=settle(live(s),'start');s=settle(live(s),'date');s=settle(live(s),'help');
 assert.equal(s.story.flags.dating,25);s=live(s);assert.equal(s.story.pending.id,'commitment');
 const married=settle(s,'marry'),together=settle(s,'together');assert.ok(eventsFor(married.history.at(-1)).some(e=>e.type==='married'));assert.ok(!eventsFor(together.history.at(-1)).some(e=>e.type==='married'));assert.ok(validate(married));
});
test('choice outcomes preserve unrelated markers and report actual clamped effects',()=>{
 const s=live({...begin(newLife(1)),age:25});assert.equal(s.story.pending.id,'flood_help');const next=settle({...s,wellbeing:99},'help');
 assert.ok(eventsFor(next.history.at(-1)).some(e=>e.type==='flood'));assert.ok(eventsFor(next.history.at(-1)).some(e=>e.type==='connection'));assert.equal(next.story.seen.at(-1).effects.wellbeing,1);
});
test('complete lives resolve contextual turns, conserve ledger changes and remain serializable',()=>{
 for(let seed=1;seed<=128;seed++){
  let s=begin(configureLife(newLife(seed)));let turns=0;
  while(s.stage==='review'){
   const before=s;s=live(s);assert.ok(++turns<=14);if(s.story.pending){const pending=s.story.pending;assert.ok(pending.candidates.includes(pending.id));const options=encounterById(pending.id).options;s=settle(s,options[seed%options.length].id,rand(seed,s.age,'test-outcome'));}
   assert.ok(validate(JSON.parse(JSON.stringify(s))),`seed ${seed} age ${s.age}`);const row=s.history.at(-1),choice=s.story.seen.find(e=>e.age===s.age);
   assert.equal(row.cash,before.cash+row.earnings-row.spending-row.setback+row.pathwayCash+(choice?.effects.cash??0));
  }
  assert.equal(s.story.pending,null);assert.equal(new Set(s.story.seen.map(e=>e.id)).size,s.story.seen.length);assert.deepEqual(capacityHistory(s).at(-1).reasoning,capacities(s).reasoning);
  const again=replay(s);assert.equal(again.story.seen.length,0);assert.deepEqual(again.intake,s.intake);assert.equal(again.seed,seed);
 }
});
test('forged pending eligibility, flags and malformed effects cannot load',()=>{
 const s=live(begin(newLife(1)));assert.ok(validate(s));
 assert.equal(validate({...s,story:{...s.story,pending:{id:'commitment',age:15,candidates:['commitment']}}}),false);
 assert.equal(validate({...s,story:{...s.story,flags:{married:15}}}),false);
 const resolved=settle(s);assert.equal(validate({...resolved,story:{...resolved.story,seen:resolved.story.seen.map(e=>({...e,effects:{...e.effects,skills:{iq:NaN}}}))}}),false);
 const {story,...legacy}=s;assert.ok(validate(legacy));
});
test('comparison paths resolve their own encounters and reach adult ages',()=>{
 let s=begin(configureLife(newLife(1)));while(s.age<40&&s.stage==='review')s=settle(live(s));const c=comparison(s);assert.ok(c.count>0);assert.ok(Number.isFinite(c.cash));
});
test('every encounter title, choice, prompt and outcome is translated',()=>{
 for(const language of ['th','zh-CN','ja','ko'])for(const e of ENCOUNTERS)for(const text of [e.title,e.prompt,...e.options.flatMap(o=>[o.label,o.outcome])])assert.notEqual(translate(text,language),text,`${language}: ${text}`);
});
import {storyText} from '../../dist/course/encounters.js';
test('named story memories stay translated inside joined history paragraphs',()=>{
 const story=newLife(1).story;
 const text='An ordinary five years. Small habits accumulate. '+storyText(encounterById('friend').options[0].outcome,story);
 for(const language of ['th','zh-CN','ja','ko'])assert.ok(!/[A-Za-z]{3}/.test(translate(text,language)),translate(text,language));
});
test('malformed history is rejected without throwing after a story choice',()=>{
 const s=settle(live(begin(newLife(1))));for(const history of [null,{},[null],[{}]]){assert.doesNotThrow(()=>validate({...s,history}));assert.equal(validate({...s,history}),false);}
});
