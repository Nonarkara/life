import {test} from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live} from '../../dist/course/sim.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
// Variety guard (REBUILD-STRATEGY.md step 0). Ceilings are a ratchet: lower them as the deck grows, never raise them.
const N=120,MAX_SHARE=.75,MIN_DISTINCT=.95;
test('lives are asked different questions, and no scene is in nearly every life',()=>{
 const seqs=new Set(),count={};
 for(let seed=1;seed<=N;seed++){
  let s=begin(newLife(seed*7919)),q=[];
  while(s.stage==='review'&&s.age<80){
   s=live(s);if(s.stage!=='review')break;
   for(const p of pendingPivots(s)){q.push(p.id);const o=openOptions(p,s)[0];if(o)s=applyPivot(s,p,o.id);}
   const ps=s.story?.pending;if(ps){q.push(ps.id);s=resolveEncounter(s,encounterById(ps.id).options.find(o=>choiceAvailable(s,o)).id,.2);}
  }
  seqs.add(q.join('>'));for(const id of new Set(q))count[id]=(count[id]??0)+1;
 }
 assert.ok(seqs.size>=N*MIN_DISTINCT,'distinct question sequences '+seqs.size+'/'+N);
 const worst=Object.entries(count).sort((a,b)=>b[1]-a[1])[0];
 assert.ok(worst[1]<=N*MAX_SHARE,worst[0]+' is in '+worst[1]+'/'+N+' lives');
});
import {ENCOUNTERS} from '../../dist/course/encounters.js';
test('every encounter opens with an option that costs nothing',()=>{for(const e of ENCOUNTERS){const o=e.options[0];assert.ok(!(o.cash<0)&&!o.requires,e.id);}});
import {MOMENT_TEXTS} from '../../dist/course/moments.js';
import {phrases} from '../../dist/course/translations.js';
test('every chapter moment has its own row in all four languages',()=>{const rows=new Map(phrases.map(r=>[r[0],r]));for(const m of MOMENT_TEXTS){const r=rows.get(m);assert.ok(r&&r.length===5&&r.slice(1).every(v=>v&&v!==m),m);}});

import {configureLife,validate} from '../../dist/course/sim.js';
test('a 1949 life meets its history, and each life meets a different one',()=>{
 const seqs=new Set(),count={};let history=0,total=0;
 for(let seed=1;seed<=N;seed++){
  let s=begin(configureLife(newLife(seed*104729),{birthYear:1949})),q=[];
  while(s.stage==='review'&&s.age<80){
   s=live(s);if(s.stage!=='review')break;
   for(const p of pendingPivots(s)){q.push(p.id);const os=openOptions(p,s),o=os[seed%os.length];if(o)s=applyPivot(s,p,o.id);}
   const ps=s.story?.pending;if(ps){q.push(ps.id);const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,os[seed%os.length].id,.2);}
  }
  seqs.add(q.join('>'));for(const id of new Set(q))count[id]=(count[id]??0)+1;total+=1;history+=q.filter(id=>id.startsWith('h_')).length;
 }
 assert.ok(seqs.size>=N*MIN_DISTINCT,'distinct '+seqs.size);
 assert.ok(history/total>=5,'history scenes per life '+history/total);
 for(const id of ['m_kits','m_funds'])assert.equal(count[id]??0,0,id+' before its time');
 const worst=Object.entries(count).sort((a,b)=>b[1]-a[1])[0];assert.ok(worst[1]<=N*.9,worst[0]+' is in '+worst[1]+'/'+N);
});

test('every 1949 life can be saved and reopened after every answer',()=>{
 const ok=s=>validate(JSON.parse(JSON.stringify(s)));
 for(let seed=1;seed<=60;seed++){let s=begin(configureLife(newLife(seed*7919),{birthYear:1949}));
  while(s.stage==='review'&&s.age<80){s=live(s);assert.ok(ok(s),'after live '+s.age);if(s.stage!=='review')break;
   for(const p of pendingPivots(s)){const os=openOptions(p,s),o=os[seed%os.length];if(o)s=applyPivot(s,p,o.id);assert.ok(ok(s),p.id+'/'+o?.id);}
   const ps=s.story?.pending;if(ps){const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o)),c=os[seed%os.length];s=resolveEncounter(s,c.id,(seed%10)/100);assert.ok(ok(s),ps.id+'/'+c.id);}
  }}
});

// The recording's three promises: a fork changes the room, the chart ends at the year you are in, the answer is scored.
import {SET_CLOSE,MARKET_PIVOTS,marketsDue} from '../../dist/course/market-moments.js';
import {MORAL} from '../../dist/course/moral-ledger.js';
import {parseThem} from '../../dist/course/life-reading.js';
import {PIVOTS as ALL} from '../../dist/course/pivots.js';
test('every scored answer exists, and hard-fear answers are never scored as cowardice',()=>{
 const ids=new Set([...ENCOUNTERS.flatMap(e=>e.options.map(o=>e.id+'/'+o.id)),...ALL.flatMap(p=>p.options.map(o=>p.id+'/'+o.id))]);
 for(const k of Object.keys(MORAL))assert.ok(ids.has(k),k);
 assert.deepEqual(MORAL['h_rice_at_night/tell']??[0,0],[0,0]);
});
test('market payoff is exactly the real index ratio, and pays once',()=>{
 assert.equal(marketsDue({set1993:40,set1993a:100000},40).length,0);const due=marketsDue({set1993:40,set1993a:100000},45);assert.equal(due.length,1);assert.equal(due[0].gain,Math.round(100000*(Math.round(100*SET_CLOSE[1998]/SET_CLOSE[1993])-100)/100));assert.ok(due[0].gain<0);assert.equal(marketsDue({set1993:40},50).length,0);
 assert.equal(new Set(MARKET_PIVOTS.map(p=>p.id)).size,MARKET_PIVOTS.length);
});
test('a friend link is parsed strictly: junk is refused and unknown answers are dropped',()=>{
 assert.equal(parseThem('<script>'),null);assert.equal(parseThem('999.1.1.1.'),null);
 const ok=parseThem('62.1000.2.-1.three-roads:go,nonsense:x');assert.equal(ok.age,62);assert.equal(ok.answers.get('three-roads'),'go');assert.equal(ok.answers.has('nonsense'),false);
});

test('emigrating never breaks the save, whatever was pending at that station',()=>{
 let went=0;for(let by=1935;by<=1985;by+=5)for(let seed=1;seed<=40;seed++){let s=begin(configureLife(newLife(seed*7919+by),{birthYear:by}));
  while(s.stage==='review'&&s.age<45){s=live(s);if(s.stage!=='review')break;
   for(const p of pendingPivots(s)){const os=openOptions(p,s),o=p.id==='go-abroad'?os.find(x=>x.id==='go'):os.find(x=>x.pathway==='college')??os[0];s=applyPivot(s,p,o.id);if(p.id==='go-abroad'){went++;assert.ok(validate(JSON.parse(JSON.stringify(s))),'after going, born '+by+' seed '+seed);}}
   const ps=s.story?.pending;if(ps){const e=encounterById(ps.id),o=e.options.find(o=>choiceAvailable(s,o));s=resolveEncounter(s,o.id,.2);assert.ok(validate(JSON.parse(JSON.stringify(s))),ps.id);}
  }}
 assert.ok(went>=10,'emigrated lives '+went);
});

import {bigMoment,momentPlan,MOMENT_SETS} from '../../dist/course/moment-plan.js';
test('big moments open a place that differs by life and respects its year',()=>{
 for(const id of Object.keys(MOMENT_SETS))assert.ok(ENCOUNTERS.some(e=>e.id===id)||ALL.some(p=>p.id===id),id+' is not a real moment');
 assert.equal(bigMoment('m_crash'),false);assert.equal(bigMoment(undefined),false);
 const place=(seed,age)=>({...begin(configureLife(newLife(seed),{birthYear:1949})),age});
 const seen=new Set();for(let seed=1;seed<=40;seed++)seen.add(JSON.stringify(momentPlan(place(seed*7919,24),'h_1973_leaflet')));
 assert.ok(seen.size>=35,'distinct places '+seen.size);
 const old=momentPlan(place(7919,7),'h_film_van');assert.equal(old.cars,0);assert.equal(old.skyline,false);assert.ok(old.rows.every(r=>r.storeys===2));
 const late=momentPlan(place(7919,60),'h_2010_table');assert.equal(late.skyline,true);
});

import {outfitFor} from '../../dist/course/moment-plan.js';
test('clothes belong to their year and their person',()=>{
 const life=(seed,opt,age)=>({...begin(configureLife(newLife(seed),{birthYear:1949,...opt})),age});
 for(let seed=1;seed<=30;seed++){
  const kid=outfitFor(life(seed*7919,{sex:'female'},15),'player','female',15,1964);assert.equal(kid.top,'#f4f0e4');assert.equal(kid.skirt,'knee');
  for(const year of [1950,1965,1985,2000,2015])assert.notEqual(outfitFor(life(seed*7919,{sex:'male'},30),'player','male',30,year).legs,'flare');
 }
 const farmer=[...Array(60).keys()].map(i=>life((i+1)*7919,{sex:'male',class:'low_class',region:'isan-village'},30)).map(s=>outfitFor(s,'player','male',30,1979));
 assert.ok(farmer.every(o=>o.mohom&&o.scarf),'farmer wears mo hom');
 const lives=(opt,age)=>[...Array(40).keys()].map(i=>life((i+1)*7919,opt,age));
 assert.ok(lives({sex:'male',class:'low_class',region:'isan-village'},60).some(s=>outfitFor(s,'player','male',60,2009).mohom),'farmers still wear mo hom after 1995');
 assert.ok(lives({sex:'female',class:'middle_class',region:'bang-na'},60).every(s=>outfitFor(s,'player','female',60,2009).skirt!=='sin'),'no pha sin by default in 2009 Bangkok');
 assert.ok(lives({sex:'female',class:'low_class',region:'isan-village'},30).every(s=>outfitFor(s,'player','female',30,1979).skirt==='sin'),'pha sin in the 1979 village');
 assert.ok(lives({sex:'female',class:'working_class',region:'khlong-toei'},20).every(s=>outfitFor(s,'player','female',20,1969).skirt!=='sin'),'young city women wore blouse and skirt');
 assert.ok(lives({sex:'male',class:'middle_class',region:'bang-na'},30).every(s=>outfitFor(s,'n1','male',30,1979).feet==='shoes'),'a city clerk wears shoes');
});

import {HISTORY_BANK} from '../../dist/course/thai-history-bank.js';
test('the history bank cites a page for every entry, marks novels as fiction, and names no royal person',()=>{
 const royal=/\b(king|queen|prince|princess|royal|monarch\w*|throne|crown|palace|reign\w*|chulalongkorn|mongkut|bhumibol|rama\s?[ivx0-9]+)\b/i;
 assert.ok(HISTORY_BANK.length>1000);assert.equal(new Set(HISTORY_BANK.map(e=>e.id)).size,HISTORY_BANK.length);
 for(const e of HISTORY_BANK){assert.ok(Number.isInteger(e.source.page),e.id);assert.ok(Number.isInteger(e.from)&&e.from<=e.to,e.id);assert.ok(!royal.test(e.title+' '+e.summary+' '+(e.seed??'')),e.id);if(/fiction/.test(e.source.book))assert.equal(e.kind,'texture',e.id);}
});
