import test from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live,validate,flagsOf} from '../../dist/course/sim.js';
import {chooseChild,childReceipt,acknowledgeChild,CHILD_CHOICES,childYearSeconds,nextChildAge,pendingChildChoice,skipChildIntro} from '../../dist/course/childhood-choices.js';
import {LIFE_EVENTS,periodLifeEvents,enableLifeEvents} from '../../dist/course/life-events.js';
import {decisionTempo} from '../../dist/course/decision-tempo.js';
import {figureHeightPx} from '../../dist/course/stage2d.js';
import {BUCKET_LIST,addCustomBucket,planBucket,projectedBucketEffect} from '../../dist/course/bucket-list.js';
import {phrases} from '../../dist/course/translations.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable,monthlyFlow} from '../../dist/course/finance.js';
const settle=s=>s.story?.pending?resolveEncounter(s,encounterById(s.story.pending.id).options.find(o=>choiceAvailable(s,o)).id,.2):s;
test('the default first five years take50seconds; skipping leads to a real age-six choice',()=>{
 assert.equal([0,1,2,3,4].reduce((n,a)=>n+childYearSeconds(a),0),50);const s=skipChildIntro(newLife(31));assert.equal(nextChildAge(s),6);assert.equal(pendingChildChoice(s,6).age,6);assert.equal(decisionTempo({stage:'birth',childhood:true,speed:20}).held,true);
});
test('childhood answers apply once and keep the newborn record distinct from later learning',()=>{
 let s=newLife(31),origin=s.cash;for(const q of CHILD_CHOICES){const before=s;s=chooseChild(s,q.age,q.options[0].id);assert.notEqual(s,before);assert.equal(chooseChild(s,q.age,q.options[0].id),s);assert.ok(validate(s));}
 const grown=begin(s);assert.ok(validate(grown));assert.equal(grown.history[0].cash,origin);assert.equal(grown.childhood.choices.length,4);assert.ok(grown.skills.iq>0);
});
test('all painted poses receive one2x correction, including seated figures; calibrated rooms do not get4x',()=>{
 assert.equal(figureHeightPx(1000,.3,400,'player',17),600);assert.equal(figureHeightPx(1000,.6,400,'player',17,true),600);assert.equal(figureHeightPx(1000,.3,200,'player',17),300);
});
test('external events are drawn before relationship eligibility and never invented before activation',()=>{
 const s={...begin(newLife(31)),age:20,pathway:'work'},random=(age,key)=>age===21?0:.99;
 const a=periodLifeEvents(enableLifeEvents(s),20,25,{},random),b=periodLifeEvents(enableLifeEvents(s),20,25,{friend:15,dating:20},random);assert.deepEqual(a,b);assert.equal(a.records[0].id,'accident');assert.equal(a.records[0].age,21);
 assert.equal(periodLifeEvents({...s,lifeEventPolicy:{version:1,startAge:25}},20,25,{},random).records.length,0);
});
test('job loss removes two months of actual work income in the ledger',()=>{
 for(let seed=1;seed<500;seed++){
  let s=begin(newLife(seed));s=settle(live(s));s=settle(live(s));if(s.stage!=='review')continue;s={...s,pathway:'work'};
  const next=live(enableLifeEvents(s));if(next.age!==25)continue;const events=(next.history.at(-1).events??[]).filter(e=>e.origin==='life');if(events.length!==1||events[0].id!=='layoff')continue;
  const old=live(s),period=f=>f.receipts.find(r=>r.kind==='period'&&r.age===25);assert.equal(period(old.finance).income-period(next.finance).income,monthlyFlow(s,{pathway:'work'}).income*2);assert.ok(validate(next));return;
 }assert.fail('need a deterministic layoff fixture');
});
test('year events hold a moving chapter and a saved cursor preserves paid plans without copying the whole future',()=>{
 const t=decisionTempo({stage:'review',moving:true,activity:true,speed:20});assert.equal(t.held,true);assert.equal(t.sceneSpeed,0);
 let s=settle(live(begin(newLife(31))));s=planBucket(s,'coffee',17);const saved={...s,journey:{from:15,progress:17,handled:['16:fever']}};assert.ok(validate(saved));assert.ok(validate(live(saved)));assert.equal(live(saved).bucket.done.length,1);assert.equal(live(saved).journey,undefined);
});
test('custom activity names cannot unlock hidden relationship flags or infinite learning',()=>{
 let s=newLife(31);for(let i=0;i<8;i++){s=addCustomBucket(s,{title:'A book '+i,cost:0,days:1,kind:'learn'});s=planBucket(s,'custom-'+(i+1),6);}
 assert.equal(projectedBucketEffect(s,'library').skills.iq,0);const grown=begin(s);assert.equal(grown.skills.iq,3);assert.deepEqual(flagsOf(grown),{});assert.ok(validate(grown));
});
test('all authored new activity, event and childhood copy has four native translations',()=>{
 const dictionary=new Map(phrases.map(r=>[r[0],r]));const texts=[...Object.values(BUCKET_LIST).map(e=>e.label),...Object.values(LIFE_EVENTS).flatMap(e=>[e.title,e.text]),...CHILD_CHOICES.flatMap(q=>[q.title,q.context,...q.options.flatMap(o=>[o.label,o.note])])];
 for(const text of texts){const row=dictionary.get(text);assert.ok(row,text);assert.equal(row.length,5);assert.ok(row.slice(1).every(v=>typeof v==='string'&&v.trim()&&v!==text),text);}
});

test('accepted sparse custom IDs cannot create duplicate keys on the next activity',()=>{
 let s=addCustomBucket(newLife(31),{title:'First',cost:0,days:1,kind:'rest'});s.bucket.custom[0].key='custom-2';assert.ok(validate(s));s=addCustomBucket(s,{title:'Next',cost:0,days:1,kind:'rest'});assert.equal(new Set(s.bucket.custom.map(e=>e.key)).size,2);assert.ok(validate(s));
});

test('a childhood result survives reload until it is acknowledged',()=>{let s=chooseChild(newLife(31),6,'school');s=JSON.parse(JSON.stringify(s));assert.ok(validate(s));assert.equal(childReceipt(s).label,CHILD_CHOICES[0].options[0].label);assert.equal(childReceipt(acknowledgeChild(s)),null);});

test('medical emergencies are external to effort and recurrence requires a recorded first episode',()=>{
 const s={...begin(newLife(35)),age:20},index=id=>Object.keys(LIFE_EVENTS).indexOf(id)/Object.keys(LIFE_EVENTS).length+.00001;
 const run=(id,flags={},effort=s.effort)=>periodLifeEvents(enableLifeEvents({...s,effort}),20,25,flags,(age,key)=>key==='life-arrival'?(age===21?0:1):index(id));
 assert.equal(run('asthma').records[0].health,-12);assert.equal(run('asthma',{}, {...s.effort,eq:10}).records[0].health,-12);
 assert.equal(run('dengueAgain').records.length,0);assert.equal(run('dengueAgain',{dengueEpisode:15}).records[0].id,'dengueAgain');
 assert.equal(run('asthmaAgain').records.length,0);assert.equal(run('asthmaAgain',{asthmaEpisode:15}).records[0].id,'asthmaAgain');
});
