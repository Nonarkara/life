import test from 'node:test';import assert from 'node:assert/strict';
import {THAI_ENCOUNTERS} from '../../dist/course/thai-encounters.js';
import {ENCOUNTERS,resolveEncounter} from '../../dist/course/encounters.js';
import {thaiStudyLife} from '../../dist/study/thai-life-state.js';
import {validate,live,replay} from '../../dist/course/sim.js';
import {netWorth,choiceAvailable,personalFlow} from '../../dist/course/finance.js';
import {consequencesDue} from '../../dist/course/lessons.js';
import {decisionPresentation,decisionTone,DECISION_TONES} from '../../dist/course/decision-tone.js';
import {PIVOTS} from '../../dist/course/pivots.js';
import {LIFE_EVENTS} from '../../dist/course/life-events.js';
import {contrastRatio} from '../../dist/course/palettes.js';
import {translate} from '../../dist/course/i18n.js';
import {roomRecord} from '../../dist/course/biography.js';

test('Thai choices resolve once through the real ledger and survive strict save validation',()=>{
 for(const e of THAI_ENCOUNTERS){assert.ok(ENCOUNTERS.includes(e));
  for(const o of e.options){const source=thaiStudyLife(e.id);
   // Explicit test funding exercises all payment branches; the untouched low-buffer
   // fixture below proves that actual unaffordable options remain unavailable.
   const before=personalFlow(source,'test:funding',3000,0);assert.ok(validate(before));assert.ok(choiceAvailable(before,o));
   const after=resolveEncounter(before,o.id,.2);assert.notEqual(after,before);assert.equal(after.story.seen.at(-1).choice,o.id);
   assert.equal(netWorth(after.finance)-netWorth(before.finance),o.cash??0,e.id+'/'+o.id);
   assert.equal(after.finance.debt,before.finance.debt,'family support never invents or clears personal debt');
   assert.equal(after.finance.receipts.reduce((n,r)=>n+r.change,0),netWorth(after.finance));
   assert.ok(validate(JSON.parse(JSON.stringify(after))),e.id+'/'+o.id);assert.equal(resolveEncounter(after,o.id,.2),after);
   assert.deepEqual(after.attributes,before.attributes);assert.deepEqual(replay(after).birth,before.birth);
  }
 }
});
test('a real constrained placement keeps the unaffordable route closed while paid local work remains possible',()=>{
 const s=thaiStudyLife('th_unpaid_placement'),e=THAI_ENCOUNTERS.find(e=>e.id==='th_unpaid_placement');
 assert.equal(choiceAvailable(s,e.options.find(o=>o.id==='placement')),false);assert.equal(resolveEncounter(s,'placement',.2),s);
 assert.ok(choiceAvailable(s,e.options.find(o=>o.id==='paid')));assert.equal(netWorth(resolveEncounter(s,'paid',.2).finance)-netWorth(s.finance),1200);
});
test('Thai origin and current place guard contextual stories, not a class label or a universal farmer stereotype',()=>{
 const s=thaiStudyLife('th_buyer_bill');
 for(const e of THAI_ENCOUNTERS.filter(e=>e.id!=='th_unpaid_placement'))assert.ok(e.eligible({...s,pathway:'work'}));
 for(const id of ['th_buyer_bill','th_harvest_transport','th_dry_season']){const e=THAI_ENCOUNTERS.find(e=>e.id===id);
  assert.equal(e.eligible({...s,birth:{...s.birth,region:'khlong-toei'}}),false);
  assert.equal(e.eligible({...s,finance:{...s.finance,region:'london',regionSince:20}}),false);
 }
 assert.equal(THAI_ENCOUNTERS.find(e=>e.id==='th_curfew').eligible({...s,pathway:'college'}),false);
});
test('placement learning returns in the real next period only for the chosen paid placement',()=>{
 const s=personalFlow(thaiStudyLife('th_unpaid_placement'),'test:funding',3000,0),paid=resolveEncounter(s,'placement',.2),local=resolveEncounter(s,'paid',.2);
 assert.equal(consequencesDue(paid,s.age,s.age+4).filter(c=>c.lesson==='th_unpaid_placement').length,0);
 assert.equal(consequencesDue(local,s.age,s.age+5).filter(c=>c.lesson==='th_unpaid_placement').length,0);
 const next=live(paid);assert.notEqual(next,paid);assert.ok(validate(next));
 const due=next.history.at(-1).consequences.filter(c=>c.lesson==='th_unpaid_placement');assert.equal(due.length,1);assert.equal(next.history.at(-1).consequenceSkills.craft,1);
 assert.equal(consequencesDue(next,next.age,next.age+5).filter(c=>c.lesson==='th_unpaid_placement').length,0);
});
test('buyer notes appear only after the actual conversation and travel with the recorded home',()=>{
 const before=thaiStudyLife('th_buyer_bill'),after=resolveEncounter(before,'read',.2);
 assert.equal(roomRecord(before).buyerNotes,false);assert.equal(roomRecord(after,after.age-1).buyerNotes,false);assert.equal(roomRecord(after).buyerNotes,true);
 const old=JSON.stringify(after);roomRecord(after,after.age-1);assert.equal(JSON.stringify(after),old);
});
test('every real question and annual event has a readable, explicit tone without a forced timer',()=>{
 for(const scenario of [...ENCOUNTERS,...PIVOTS]){
  const view=decisionPresentation({scenario});assert.ok(Object.hasOwn(DECISION_TONES,view.tone));
  for(const foreground of ['--ink','--muted','--amber','--accent-ink'])assert.ok(contrastRatio(view.tokens[foreground],view.tokens['--paper'])>=4.5,scenario.id+'/'+foreground);
  for(const lang of ['th','zh-CN','ja','ko'])assert.notEqual(translate(view.label,lang),view.label);
 }
 for(const [id,event]of Object.entries(LIFE_EVENTS))assert.ok(Object.hasOwn(DECISION_TONES,decisionTone({event:{...event,id}})));
 const urgent=decisionPresentation({scenario:THAI_ENCOUNTERS[0]}),quiet=decisionPresentation({scenario:THAI_ENCOUNTERS[2]});
 assert.equal(urgent.tone,'urgent');assert.equal(quiet.tone,'reflective');assert.notEqual(urgent.tokens['--paper'],quiet.tokens['--paper'],'the previous uniform question surface fails');
 assert.equal(decisionTone({event:{id:'asthma',type:'illness',health:-12}}),'urgent');
 assert.equal(decisionTone({scenario:{id:'after_hospital'}}),'reflective','recovery is not an ongoing emergency');
 assert.equal(decisionTone({scenario:THAI_ENCOUNTERS[0],result:true}),'pressured');
});
test('Thai research/cost/source and callback copy is available in all five languages',()=>{
 for(const e of THAI_ENCOUNTERS)for(const text of [e.title,e.prompt,e.lesson,e.sourceTitle,...e.options.flatMap(o=>[o.label,o.outcome,...o.later.map(c=>c.text)])])
  for(const lang of ['th','zh-CN','ja','ko'])assert.notEqual(translate(text,lang),text,lang+': '+text);
});

test('treatment asks about costs without promising years or rewarding declining with free money',async()=>{
 const {openOptions,applyPivot}=await import('../../dist/course/pivots.js');const p=PIVOTS.find(p=>p.id==='treatment');
 assert.doesNotMatch(p.prompt,/ten good years/);assert.doesNotMatch(p.options.find(o=>o.id==='family').cost,/children/);
 assert.equal(p.options.find(o=>o.id==='keep').effects.cash??0,0);
 const state={...thaiStudyLife('th_curfew'),age:65,cash:40000,health:40,story:{...thaiStudyLife('th_curfew').story,pending:null},pivots:[]};
 assert.deepEqual(openOptions(p,{...state,cash:0}).map(o=>o.id),['keep']);
 for(const [choice,cost]of [['pay',35000],['family',15000]]){const paid=applyPivot(state,p,choice);assert.equal(paid.cash,state.cash-cost);assert.equal(paid.finance,state.finance,'label names household account, not personal funds');assert.equal(applyPivot(paid,p,choice),paid);}
 assert.ok(openOptions(p,state).some(o=>o.id==='pay'),'being less healthy must not close the treatment option');
 const before=JSON.stringify(state.history),after=applyPivot(state,p,'keep');assert.equal(netWorth(after.finance),netWorth(state.finance));assert.equal(after.cash,state.cash);assert.equal(JSON.stringify(state.history),before,'past saved outcomes are untouched');
});

test('a cash amount already named in an action does not repeat on a second cost line',async()=>{
 const {encounterTerms}=await import('../../dist/course/encounter-view.js');
 for(const e of THAI_ENCOUNTERS)for(const o of e.options){if(!o.cash)continue;const amount='\u0e3f'+Math.abs(o.cash).toLocaleString('en'),rendered=[o.label,...encounterTerms(o)].join(' ');assert.equal(rendered.split(amount).length-1,1,e.id+'/'+o.id);}
 assert.deepEqual(encounterTerms({label:'Pay for travel',cash:-300}),['Cost: \u0e3f300']);
});

test('every visible question-category label has a complete native translation',async()=>{
 const {QUESTION_CATEGORIES}=await import('../../dist/course/choice-symbols.js');
 for(const category of Object.values(QUESTION_CATEGORIES))for(const lang of ['th','zh-CN','ja','ko'])assert.notEqual(translate(category.label,lang),category.label,lang+': '+category.label);
});

test('Thai easter eggs are non-urgent, seed-conditioned at adult ages, and free of script-mixing or fabricated sources',async()=>{
 const {CLASS_ENCOUNTERS}=await import('../../dist/course/class-encounters.js');
 const base=thaiStudyLife('th_buyer_bill');
 for(const id of ['th_spirit_offering','th_stray_cat','th_midnight_cart','th_mitr_cameo','th_first_love_regret','th_vhs_modem','th_midlife_frugality','th_bangkok_accounting','th_bank_merger']){
  const e=THAI_ENCOUNTERS.find(x=>x.id===id);
  assert.equal(e.urgent,false,id+' must not crowd out urgent class pressures');
  assert.doesNotMatch(e.source,/day-(44-spirit-house|60-stray-cat|90-midnight-cart)/,id+' must use a verified source');
  let hits=0;
  for(let seed=1;seed<=40;seed++)if(e.eligible({...base,seed,age:40,pathway:'work'}))hits++;
  assert.ok(hits>0&&hits<40,`${id} should be seed-conditioned (got ${hits}/40)`);
 }
 for(const id of ['th_bangkok_accounting','th_bank_merger'])assert.equal(decisionTone({scenario:THAI_ENCOUNTERS.find(x=>x.id===id)}),'pressured',id);
 for(const c of CLASS_ENCOUNTERS)assert.equal(decisionTone({scenario:c}),'pressured',c.id);
 assert.match(translate('The spirit house waiting','th'),/ศาลพระภูมิ/);
 for(const e of [...THAI_ENCOUNTERS,...CLASS_ENCOUNTERS]){
  for(const text of [e.title,e.prompt,e.lesson,e.sourceTitle,...e.options.flatMap(o=>[o.label,o.outcome])].filter(Boolean)){
   assert.doesNotMatch(translate(text,'ko'),/[\u3040-\u30ff]/,'Korean translation contains Japanese kana: '+text);
   assert.doesNotMatch(translate(text,'ja'),/[\uac00-\ud7af]/,'Japanese translation contains Korean Hangul: '+text);
   assert.doesNotMatch(translate(text,'th'),/ศาลผี/,'Thai translation uses unnatural phrase for spirit house: '+text);
  }
 }
});

test('1949–2026 historical cohorts and seven Thai eras survive birthcode roundtrip, validation and five-language translation',async()=>{
 const {COHORT_YEARS,HISTORICAL_COHORTS,THAI_ERAS,thaiEraForYear,thaiEraForState}=await import('../../dist/course/thai-history.js');
 const {newLife,configureLife,replay}=await import('../../dist/course/sim.js');
 const {encodeBirth,decodeBirth}=await import('../../dist/course/birthcode.js');
 for(const year of COHORT_YEARS){
  const life=configureLife(newLife(77),{sex:'female',class:'middle_class',birthYear:year});
  assert.equal(life.intake.birthYear,year);
  assert.equal(life.birth.birthYear,year);
  assert.ok(validate(life),'valid cohort life for '+year);
  const code=encodeBirth(life);
  assert.ok(code,'encodes cohort birthcode for '+year);
  assert.deepEqual(decodeBirth(code),life,'roundtrips cohort birthcode for '+year);
  assert.equal(replay(life).birth.birthYear,year,'replay preserves birthYear');
 }
 const mother1949=configureLife(newLife(77),{birthYear:1949});
 assert.equal(thaiEraForState(mother1949,0).era.id,'canal-cinema');
 assert.equal(thaiEraForState(mother1949,20).era.id,'development-roads');
 assert.equal(thaiEraForState(mother1949,48).era.id,'tom-yum-goong');
 assert.equal(thaiEraForState(mother1949,62).era.id,'flood-smartphones');
 assert.equal(thaiEraForState(mother1949,77).year,2026);
 assert.equal(thaiEraForState(mother1949,77).era.id,'modern-aging');
 const genY1981=configureLife(newLife(81),{birthYear:1981});
 assert.equal(thaiEraForState(genY1981,5).era.id,'pre-skytrain-soi');
 assert.equal(thaiEraForState(genY1981,14).era.id,'boom-modem');
 assert.equal(thaiEraForState(genY1981,16).era.id,'tom-yum-goong');
 assert.equal(thaiEraForState(genY1981,45).year,2026);
 for(const c of Object.values(HISTORICAL_COHORTS)){
  for(const text of [c.label,c.shortLabel,c.note]){
   for(const lang of ['th','zh-CN','ja','ko']){
    assert.notEqual(translate(text,lang),text,lang+': '+text);
    assert.doesNotMatch(translate(text,'ko'),/[\u3040-\u30ff]/);
    assert.doesNotMatch(translate(text,'ja'),/[\uac00-\ud7af]/);
   }
  }
 }
 for(const era of THAI_ERAS){
  assert.equal(thaiEraForYear(era.from).id,era.id);
  for(const text of [era.title,era.badge,era.transport,era.media,era.urban,era.summary,era.milestone]){
   for(const lang of ['th','zh-CN','ja','ko']){
    assert.notEqual(translate(text,lang),text,lang+': '+text);
    assert.doesNotMatch(translate(text,'ko'),/[\u3040-\u30ff]/);
    assert.doesNotMatch(translate(text,'ja'),/[\uac00-\ud7af]/);
   }
  }
 }
});
