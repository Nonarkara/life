import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newLife,configureLife,begin,live,replay,validate,projectedSkillGains,CLASS_KEYS} from '../../dist/course/sim.js';
import {decodeBirth,encodeBirth,birthURL,dailyDateFor} from '../../dist/course/birthcode.js';
import {CLASS_ENCOUNTERS} from '../../dist/course/class-encounters.js';
import {eligibleEncounters,offerEncounter,resolveEncounter,encounterById} from '../../dist/course/encounters.js';
import {allowance,netWorth,choiceAvailable} from '../../dist/course/finance.js';
import {backgroundBand} from '../../dist/course/backgrounds.js';
for(let i=0;i<3;i++)test('historical source birth/save/replay identity survives class release '+i,()=>{
 const fixture=JSON.parse(fs.readFileSync(new URL('../fixtures/class-audit/legacy-'+i+'.json',import.meta.url)));
 assert.ok(validate(fixture.state));assert.deepEqual(decodeBirth(fixture.code),fixture.birth);assert.deepEqual(replay(fixture.state).birth,fixture.birth.birth);assert.equal(encodeBirth(fixture.state),fixture.code);
 assert.equal(new URL(birthURL(fixture.state)).searchParams.get('birth'),fixture.code);
 if(i===0){assert.equal(dailyDateFor({...fixture.state,dailyDay:'2026-10-30'}),'2026-10-30');assert.equal(new URL(birthURL({...fixture.state,dailyDay:'2026-10-30'})).searchParams.get('day'),'2026-10-30');}
});
test('background changes resources and support, not the seeded intrinsic attributes',()=>{
 const births=CLASS_KEYS.map(cls=>configureLife(newLife(12),{class:cls}));
 for(const b of births){assert.deepEqual(b.attributes,births[0].attributes);assert.ok(validate(b));assert.deepEqual(decodeBirth(encodeBirth(b)),b);}
 assert.ok(allowance(births[0])>allowance(births[1]));assert.equal(backgroundBand(births[3]),'constrained');
});
test('class forecasts and a real low-resource age15 remain pure and serializable',()=>{
 for(const cls of CLASS_KEYS)for(const seed of [12,92,109]){const s=begin(configureLife(newLife(seed),{class:cls})),before=JSON.stringify(s);projectedSkillGains(s);const next=live(s);assert.equal(JSON.stringify(s),before);assert.ok(validate(next),cls+seed);assert.equal(next.story.flags.debtCrisis,undefined);assert.equal(next.story.flags.bloodyMarket,undefined);assert.ok(!next.history.at(-1).event.includes('killed in one night'));}
});
test('background encounters require actual context, pause time and charge once through the personal ledger',()=>{
 for(const e of CLASS_ENCOUNTERS){
  const cls=CLASS_KEYS.find(c=>e.eligible({intake:{class:c},finance:{debt:1},pathway:'work'}));assert.ok(cls);
  let s=begin(configureLife(newLife(e.id==='class_debt'?1:31),{class:cls}));
  while(s.age<25&&s.stage==='review'){if(s.story.pending){const p=encounterById(s.story.pending.id);s=resolveEncounter(s,p.options.find(o=>choiceAvailable(s,o)).id,.2);}if(e.id==='class_debt'&&s.age===20)s={...s,pathway:'college',major:'medicine'};s=live(s);}
  assert.equal(s.age,25);s={...s,pathway:'work',story:{...s.story,pending:null}};
  assert.ok(validate(s));assert.ok(eligibleEncounters(s).some(c=>c.id===e.id),e.id+JSON.stringify({stage:s.stage,debt:s.finance.debt,seen:s.story.seen.map(e=>[e.id,e.age])}));
  const pending=offerEncounter(s,.2,c=>c.id===e.id);assert.equal(pending.story.pending.id,e.id);assert.equal(live(pending),pending);
  const choice=e.options.find(o=>choiceAvailable(pending,o)),before=JSON.stringify(pending),after=resolveEncounter(pending,choice.id,.2);
  assert.equal(JSON.stringify(pending),before);assert.ok(validate(after));assert.equal(netWorth(after.finance)-netWorth(pending.finance),choice.cash??0);assert.equal(resolveEncounter(after,choice.id,.2),after);assert.equal(after.story.seen.at(-1).id,e.id);
 }
 const debt=CLASS_ENCOUNTERS.find(e=>e.id==='class_debt');assert.equal(debt.eligible({intake:{class:'low_class'},finance:{debt:0}}),true,'class_debt fires on low_class regardless of literal debt');
 const overtime=CLASS_ENCOUNTERS.find(e=>e.id==='class_overtime');assert.equal(overtime.eligible({intake:{class:'working_class'},pathway:'college'}),false);
});
test('legacy later-life inheritance retains its original background amounts',()=>{
 for(const [upbringing,expected] of [['constrained',30000],['comfortable',1200000]]){
  let checked=0;
  for(let seed=1;seed<=60&&checked<2;seed++){
   let s=begin(configureLife(newLife(seed),{upbringing,country:'th'}));
   const settle=state=>state.story?.pending?resolveEncounter(state,encounterById(state.story.pending.id).options.find(o=>choiceAvailable(state,o)).id,.2):state;
   while(s.age<50&&s.stage==='review')s=settle(live(settle(s)));
   if(s.age!==50||s.stage!=='review')continue;
   s=settle(s);const next=live(s),row=next.history.at(-1);
   if(!row.event.includes(' dies.'))continue;
   assert.equal(row.setback,-expected,upbringing+' seed '+seed);assert.ok(validate(next));checked++;
  }
  assert.equal(checked,2,'two actual surviving legacy paths must reach inheritance');
 }
});
