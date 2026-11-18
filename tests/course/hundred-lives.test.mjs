import test from 'node:test';
import assert from 'node:assert/strict';
import {playerSlotBirth,recordTaste,readTaste,dominantTaste,drawAdaptiveBirth} from '../../dist/course/taste-engine.js';
import {encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {begin,live,validate} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';

function playShort(life,strategy=0){
 let s=begin(life);
 for(let step=0;step<4&&s.stage==='review'&&s.age<30;step++){
  for(const p of pendingPivots(s)){
   const os=openOptions(p,s);
   s=applyPivot(s,p,os[strategy%os.length].id);
  }
  const ps=s.story?.pending;
  if(ps){
   const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));
   s=resolveEncounter(s,os[strategy%os.length].id,0.5);
  }
  s=live(s);
 }
 return s;
}

test('100 players get 100 distinct valid starting lives across eras, classes and regions, and can swap lives via birth codes',()=>{
 const seeds=new Set(),codes=new Set(),eras=new Set(),classes=new Set(),places=new Set();
 for(let slot=1;slot<=100;slot++){
  const life=playerSlotBirth(slot);
  assert.equal(validate(life),true,'slot '+slot+' valid');
  seeds.add(life.seed);
  eras.add(life.intake.birthYear);
  classes.add(life.intake.class);
  places.add(life.birth.place);
  const code=encodeBirth(life);
  assert.ok(code,'slot '+slot+' encodes');
  codes.add(code);
 }
 assert.equal(seeds.size,100,'all 100 player slots have distinct seeds');
 assert.equal(codes.size,100,'all 100 player slots have distinct shareable birth codes');
 assert.ok(eras.size>=7,'covers all historical cohorts');
 assert.equal(classes.size,5,'covers all 5 socioeconomic classes');
 assert.ok(places.size>=15,'covers at least 15 Thai birthplaces');

 // Player 1 and Player 42 swap lives and make different choices:
 const p1Birth=playerSlotBirth(1);
 const sharedCode=encodeBirth(p1Birth);
 const swapped=decodeBirth(sharedCode);
 assert.equal(swapped.seed,p1Birth.seed);
 assert.equal(swapped.birth.place,p1Birth.birth.place);
 const runA=playShort(p1Birth,0);
 const runB=playShort(swapped,1);
 assert.equal(validate(runA),true);
 assert.equal(validate(runB),true);
 assert.notDeepEqual([runA.cash,runA.wellbeing,runA.health,runA.skills,runA.story.seen],[runB.cash,runB.wellbeing,runB.health,runB.skills,runB.story.seen],'swapped birth played differently diverges');
});

test('taste engine learns what a player explores and draws fresh unrepeated lives',()=>{
 const store=new Map();
 const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const l1={...playerSlotBirth(3),stage:'recap',story:{seen:[{id:'b_bitcoin_2014',choice:'all'},{id:'b_drunk_keys',choice:'drive'}]},skills:{craft:4,drive:18,eq:6,iq:8,physique:6},stops:[]};
 recordTaste(storage,l1);
 const t1=readTaste(storage);
 assert.equal(t1.lives,1);
 assert.equal(dominantTaste(t1).key,'risk');

 const drawnSeeds=new Set(t1.seeds);
 for(let i=0;i<25;i++){
  const next=drawAdaptiveBirth(storage,()=>playerSlotBirth(i+10));
  assert.equal(validate(next),true);
  assert.equal(drawnSeeds.has(next.seed),false,'never repeats a learned seed');
  drawnSeeds.add(next.seed);
  recordTaste(storage,{...next,stage:'recap',story:{seen:[{id:'r_singer_office_1',choice:'sing'}]},skills:{craft:20,drive:8,eq:8,iq:8,physique:6},stops:[{id:'sea_hua_hin',age:20}]});
 }
 assert.equal(readTaste(storage).lives,26);
});

test('reopening one ending leaves taste weights and the finished-life count unchanged',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 const life={...playerSlotBirth(3),stage:'recap',age:40,health:60,wellbeing:40,story:{seen:[{id:'b_bitcoin_2014',choice:'all'}]},skills:{craft:8,drive:8,eq:8}};
 recordTaste(storage,life);
 const once=readTaste(storage);
 recordTaste(storage,JSON.parse(JSON.stringify(life)));
 assert.deepEqual(readTaste(storage),once);
 recordTaste(storage,{...life,stage:'review'});
 assert.deepEqual(readTaste(storage),once,'an unfinished life is not a finished life');
});

test('a reroll is fresh even when no additional life has finished',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 recordTaste(storage,{...playerSlotBirth(3),stage:'recap'});
 let n=15;
 const fallback=()=>playerSlotBirth((n++%100)+1);
 const first=drawAdaptiveBirth(storage,fallback),second=drawAdaptiveBirth(storage,fallback);
 assert.notEqual(first.seed,second.seed);
 assert.equal(readTaste(storage).lives,1);
});

test('adaptive draws preserve explicitly requested starting conditions and survive damaged taste data',async()=>{
 const {drawBirth}=await import('../../dist/course/birth-draw.js');
 const store=new Map(),storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 recordTaste(storage,{...playerSlotBirth(3),stage:'recap'});
 const options={birthYear:1981,class:'middle_class',sex:'female',region:'pak-phanang',raised:'mothers'};
 const chosen=drawAdaptiveBirth(storage,()=>drawBirth(options));
 assert.equal(chosen.intake.birthYear,1981);
 assert.equal(chosen.intake.class,'middle_class');
 assert.equal(chosen.birth.region,'pak-phanang');
 assert.equal(chosen.birth.household,'mothers');
 store.set('life-taste-v1',JSON.stringify({lives:-9,weights:{risk:'Infinity'},seeds:'bad'}));
 assert.equal(readTaste(storage).lives,0);
 assert.equal(readTaste(storage).weights.risk,0);
});

test('almanac redraws count each completed ending once while merging discoveries',async()=>{
 const {recordAlmanac}=await import('../../dist/course/almanac.js');
 const store=new Map(),storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const end={...playerSlotBirth(8),stage:'recap'};
 const once=recordAlmanac(storage,end,{noteIds:['one']});
 const twice=recordAlmanac(storage,end,{noteIds:['two']});
 assert.equal(once.lives,1);assert.equal(twice.lives,1);
 assert.deepEqual(twice.notes,['one','two']);
 assert.equal(recordAlmanac(storage,{...end,wellbeing:end.wellbeing-5}).lives,2);
});

test('divorce is offered to an existing couple and changes household state without invalidating older saves',async()=>{
 const {newLife,configureLife,flagsOf}=await import('../../dist/course/sim.js');
 const {offerEncounter}=await import('../../dist/course/encounters.js');
 const {together}=await import('../../dist/course/life-choices.js');
 const settle=s=>{
  for(let n=0;n<12;n++){
   const q=pendingPivots(s)[0];if(!q)break;
   s=applyPivot(s,q,openOptions(q,s)[0].id);
  }
  if(s.story.pending){
   const e=encounterById(s.story.pending.id);
   const options=e.options.filter(o=>choiceAvailable(s,o));
   const wanted={love:'date',commitment:'marry',proposal_first:'ask',proposal_wedding:'marry'};
   s=resolveEncounter(s,(options.find(o=>o.id===wanted[e.id])??options[0]).id,.5);
  }
  return s;
 };
 let found=false;
 for(let seed=1;seed<200&&!found;seed++){
  let s=settle(begin(configureLife(newLife(seed),{class:'middle_class',birthYear:1970})));
  while(s.stage==='review'&&s.age<40){s=live(s);if(s.age<40)s=settle(s);}
  if(s.stage!=='review')continue;
  s={...s,story:{...s.story,pending:null}};
  const drawn=x=>offerEncounter(x,.5,e=>e.id==='b_divorce_papers');
  const single={...s,pivotFlags:{},story:{...s.story,flags:{},seen:[]}};
  assert.equal(drawn(single),single);
  if(!together(s))continue;
  const pending=drawn(s);if(pending===s)continue;
  assert.ok(validate(pending));
  const separated=resolveEncounter(pending,'peace',.5);
  assert.ok(validate(JSON.parse(JSON.stringify(separated))));
  assert.equal(together(separated),false);
  assert.equal(flagsOf(separated).separated,s.age);
  assert.equal(flagsOf({...separated,age:s.age-5}).separated,undefined,'past views do not inherit a future divorce');
  found=true;
 }
 assert.ok(found,'normally played married life reached the divorce');
});

test('legacy duplicate taste and almanac profiles reconcile down to recorded distinct lives on read',async()=>{
 const {readAlmanac}=await import('../../dist/course/almanac.js');
 const {recordLife}=await import('../../dist/course/lives.js');
 const store=new Map(),storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const l1={...playerSlotBirth(1),stage:'recap',age:40,health:70,wellbeing:60};
 const l2={...playerSlotBirth(2),stage:'recap',age:55,health:60,wellbeing:50};
 recordLife(storage,l1);
 recordLife(storage,l2);
 store.set('life-taste-v1',JSON.stringify({weights:{risk:48,craft:12,power:0,heart:0,wander:6},seeds:[l1.seed,l2.seed],routes:['border_pm'],eras:[1949,1955],regions:['khlong-toei','chiang-mai'],lives:12}));
 store.set('life-almanac-v1',JSON.stringify({routes:['border_pm'],stops:['sea_hua_hin'],notes:['b_bitcoin_2014'],bestScore:42,lives:12}));

 const taste=readTaste(storage);
 assert.equal(taste.lives,2);
 assert.equal(taste.weights.risk,8);
 assert.equal(taste.weights.craft,2);
 assert.equal(taste.endings.length,2);
 // Idempotent on subsequent read:
 assert.deepEqual(readTaste(storage),taste);

 const alm=readAlmanac(storage);
 assert.equal(alm.lives,2);
 assert.equal(alm.endings.length,2);
 assert.deepEqual(readAlmanac(storage),alm);
});

test('slots 1..16 resolve to individually sourced canonical Thai biographies with valid round-trip birth codes',async()=>{
 const {CANONICAL_LIVES,canonicalLifeForSlot}=await import('../../dist/course/canonical-lives.js');
 assert.equal(CANONICAL_LIVES.length,16);
 for(let slot=1;slot<=16;slot++){
  const canon=canonicalLifeForSlot(slot);
  assert.ok(canon,'canonical slot '+slot);
  assert.ok(canon.sourceLabel&&canon.sourceHref.startsWith('https://'),'slot '+slot+' has source');
  const life=playerSlotBirth(slot);
  assert.equal(validate(life),true,'canonical slot '+slot+' valid');
  assert.equal(life.canonical.title,canon.title);
  const code=encodeBirth(life);
  const decoded=decodeBirth(code);
  assert.equal(decoded.seed,life.seed,'canonical slot '+slot+' round-trips');
  assert.equal(decoded.birth.region,canon.region,'canonical slot '+slot+' keeps region');
 }
});

test('Tokaido 4-kind set bonus, 5-pillar Balance Meter, and Resilience title score cleanly',async()=>{
 const {scoreLife,useCategories}=await import('../../dist/course/life-collection.js');
 const cats={w1:'work',m1:'money',f1:'family',h1:'health',c1:'connection'};
 useCategories(id=>cats[id]??null);
 const base=playerSlotBirth(1);
 const s={
  ...base,
  wellbeing:65,
  stops:[{id:'s_huahin',age:20},{id:'h_inthanon',age:25},{id:'t_suthep',age:30},{id:'m_soi',age:35}],
  story:{seen:[{id:'w1',choice:'a'},{id:'m1',choice:'a'},{id:'f1',choice:'a'},{id:'h1',choice:'a'},{id:'c1',choice:'a'},{id:'d_illness',choice:'rest'},{id:'b_drunk_keys',choice:'walk'}]}
 };
 const r=scoreLife(s);
 assert.equal(r.setBonus,16,'Four distinct journey kinds score 1+3+5+7');
 assert.equal(r.balance.active,5,'all 5 CV pillars active');
 assert.equal(r.balance.bonus,4,'5-pillar balance awards +4');
 assert.ok(r.titles.includes('Across five themes'));
 assert.ok(r.titles.includes('The resilient'));
});
