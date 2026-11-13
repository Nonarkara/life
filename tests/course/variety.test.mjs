import {test} from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live,rand} from '../../dist/course/sim.js';
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
 // 2026-11-13: 3.50 before family moves; 3.48 with moves; 3.44 once the temple-boy and city-fork pivots follow the family's
 // new home (a moved family no longer gets the provincial pivots). Re-based on those measurements, not loosened further.
 assert.ok(history/total>=3.4,'history scenes per life '+history/total); // lives can now end early at zero, and a route takes some stations
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
 // A family that went to the city for work dresses for the city; the farmer test samples families that stayed.
 const farmer=[...Array(60).keys()].map(i=>life((i+1)*7919,{sex:'male',class:'low_class',region:'isan-village'},30)).filter(s=>!s.birth.moves).map(s=>outfitFor(s,'player','male',30,1979));
 assert.ok(farmer.length>=40,'enough farm families stay');
 assert.ok(farmer.every(o=>o.mohom&&o.scarf),'farmer wears mo hom');
 const lives=(opt,age)=>[...Array(40).keys()].map(i=>life((i+1)*7919,opt,age));
 assert.ok(lives({sex:'male',class:'low_class',region:'isan-village'},60).some(s=>outfitFor(s,'player','male',60,2009).mohom),'farmers still wear mo hom after 1995');
 assert.ok(lives({sex:'female',class:'middle_class',region:'bang-na'},60).every(s=>outfitFor(s,'player','female',60,2009).skirt!=='sin'),'no pha sin by default in 2009 Bangkok');
 assert.ok(lives({sex:'female',class:'low_class',region:'isan-village'},30).filter(s=>!s.birth.moves).every(s=>outfitFor(s,'player','female',30,1979).skirt==='sin'),'pha sin in the 1979 village');
 assert.ok(lives({sex:'female',class:'working_class',region:'khlong-toei'},20).every(s=>outfitFor(s,'player','female',20,1969).skirt!=='sin'),'young city women wore blouse and skirt');
 assert.ok(lives({sex:'male',class:'middle_class',region:'bang-na'},30).every(s=>outfitFor(s,'n1','male',30,1979).feet==='shoes'),'a city clerk wears shoes');
});

import {HISTORY_BANK} from '../../dist/course/thai-history-bank.js';
test('the history bank cites a page for every entry, marks novels as fiction, and names no royal person',()=>{
 const royal=/\b(king|queen|prince|princess|royal|monarch\w*|throne|crown|palace|reign\w*|chulalongkorn|mongkut|bhumibol|rama\s?[ivx0-9]+)\b/i;
 assert.ok(HISTORY_BANK.length>1000);assert.equal(new Set(HISTORY_BANK.map(e=>e.id)).size,HISTORY_BANK.length);
 for(const e of HISTORY_BANK){assert.ok(Number.isInteger(e.source.page),e.id);assert.ok(Number.isInteger(e.from)&&e.from<=e.to,e.id);assert.ok(!royal.test(e.title+' '+e.summary+' '+(e.seed??'')),e.id);if(/fiction/.test(e.source.book))assert.equal(e.kind,'texture',e.id);}
});

import {readSave} from '../../dist/course/save.js';
import {CLASS_KEYS,CLASS_WEIGHTS} from '../../dist/course/backgrounds.js';
import {decodeBirth,encodeBirth} from '../../dist/course/birthcode.js';
import {readFileSync} from 'node:fs';
test('the royal-associated birth is gone, and earlier lives and links still open',()=>{
 assert.equal(CLASS_KEYS.includes('royal_associated'),false);assert.equal(Object.hasOwn(CLASS_WEIGHTS,'royal_associated'),false);
 assert.ok(Math.abs(Object.values(CLASS_WEIGHTS).reduce((a,b)=>a+b,0)-1)<1e-9,'weights sum to one');
 assert.ok(!/royal/i.test(readFileSync('dist/intake/index.html','utf8')));
 const life=begin(configureLife(newLife(7919),{birthYear:1949,class:'high_class'}));
 const old=JSON.parse(JSON.stringify(life));old.intake.class='royal_associated';if(old.birth.class)old.birth.class='royal_associated';
 const store={getItem:()=>JSON.stringify(old),setItem(){}},read=readSave(store,validate);assert.ok(read.life,'old save opens');assert.equal(read.life.intake.class,'high_class');
 const code=encodeBirth(configureLife(newLife(7919),{birthYear:1949,class:'high_class'})),oldCode=code.replace(/^([0-9a-z]+-[fmi])h/,'$1r');assert.notEqual(code,oldCode);assert.equal(decodeBirth(oldCode)?.intake.class,'high_class');
});

import {youthsAround,youthsInOwnClothes} from '../../dist/course/moment-plan.js';
test('young lives are surrounded by young people, in the clothes of their year',()=>{
 assert.equal(youthsAround(17,'soi'),6);assert.equal(youthsAround(45,'soi'),0);assert.equal(youthsAround(20,'table'),0);assert.equal(youthsAround(8,'soi'),0);
 assert.equal(youthsInOwnClothes(1973),false);assert.equal(youthsInOwnClothes(2005),true);
});

import {DIRECTOR_ENCOUNTERS,SAD_ENCOUNTERS,directorSchedule} from '../../dist/course/life-tragedies.js';
import {leaveWorld,pathOf,riskOf,RISKY_FROM} from '../../dist/course/life-verdict.js';
import {POPULATION} from '../../dist/course/population.js';
test('the Director gives each life its own few blows, and every blow can be met for free',()=>{
 const seen=new Set();for(let n=1;n<=300;n++){const sch=directorSchedule(n*31,'middle_class'),ids=Object.values(sch);assert.ok(ids.length<=3&&new Set(ids).size===ids.length);seen.add(ids.slice().sort().join());}
 assert.ok(seen.size>150,'lives get different bad luck: '+seen.size);
 for(const e of [...DIRECTOR_ENCOUNTERS,...SAD_ENCOUNTERS]){assert.ok(e.rehearse,e.id);assert.ok(e.options.some(o=>!(o.cash<0)),e.id);assert.ok(!(e.options[0].cash<0),e.id);}
 for(const e of SAD_ENCOUNTERS)assert.match(e.rehearse,/\(.+, \d{4}\)$/,e.id+' names its source');
});
test('the door: leaving for the temple ends the life, saves, and is the only third verdict',()=>{
 const born=begin(configureLife(newLife(7919),{birthYear:1949,class:'middle_class'})),s={...born,story:{...born.story,pending:null},age:30};
 assert.equal(validate(born),true);assert.equal(leaveWorld({...s,age:15}).stage,'review','not before twenty');
 const left=leaveWorld(s);assert.equal(left.stage,'recap');assert.equal(pathOf(left),'monk');
 const worn={history:[{health:30,wellbeing:20,finance:{available:0,reserve:0,debt:9,holdings:[]}}],profiles:[{profile:{smoke:'yes',drink:'social'}}],death:{age:40}};assert.ok(riskOf(worn)>=RISKY_FROM);assert.equal(pathOf(worn),'fun');
 assert.equal(pathOf({history:[{health:90,wellbeing:80}],profiles:[{profile:{smoke:'no',drink:'no'}}]}),'safe');
});
test('the pretend lives are labelled data: shares add up and all three roads were walked',()=>{
 assert.ok(POPULATION.n>=1000);for(const [id,o] of Object.entries(POPULATION.scenes)){const sum=Object.values(o).reduce((a,r)=>a+r[0],0);assert.ok(Math.abs(sum-100)<=Object.keys(o).length,id+' '+sum);}
 for(const k of ['monk','fun','safe'])assert.ok(POPULATION.paths[k].share>0,k);
});

import {lifeArc} from '../../dist/course/life-verdict.js';
// Law 2: no two lives alike. Plays a mixed crowd and measures what players actually feel.
test('law 2: a crowd of lives never repeats, and no fixed spine runs through them',()=>{
 const n=180,lives=[];
 for(let i=1;i<=n;i++){const seed=i*104729+7;let s=begin(configureLife(newLife(seed),{birthYear:[1949,1955,1970,1981,1990,2000][i%6]})),q=[];
  const pick=(l,id)=>l[Math.floor(rand(seed,s.age,id)*l.length)];
  const ans=()=>{for(const p of pendingPivots(s)){q.push(p.id);s=applyPivot(s,p,pick(openOptions(p,s),p.id).id);}const ps=s.story?.pending;if(ps){q.push(ps.id);s=resolveEncounter(s,pick(encounterById(ps.id).options.filter(o=>choiceAvailable(s,o)),ps.id).id,.3);}};
  ans();while(s.stage==='review'&&s.age<80){const m=live(s);if(m===s)break;s=m;ans();}lives.push(q);}
 assert.equal(new Set(lives.map(q=>q.join('>'))).size,n,'every life is its own');
 const sets=lives.map(q=>new Set(q));let t=0,c=0;for(let a=0;a<n;a++)for(let b=a+1;b<Math.min(n,a+30);b++){let k=0;for(const x of sets[a])if(sets[b].has(x))k++;t+=k/(sets[a].size+sets[b].size-k);c++;}
 assert.ok(t/c<.15,'mean overlap '+t/c);
 const count={};for(const q of sets)for(const x of q)count[x]=(count[x]??0)+1;const worst=Object.entries(count).sort((a,b)=>b[1]-a[1])[0];assert.ok(worst[1]/n<=.6,worst.join(' '));
});
test('law 1: a life has a shape: an early knock, the twist in the middle, a reckoning near the end',()=>{
 for(let seed=1;seed<=200;seed++){for(const age of Object.keys(directorSchedule(seed*17,'working_class')).map(Number))assert.ok(age>=20&&age<=70);}
 const middle=[...Array(200).keys()].filter(i=>Object.keys(directorSchedule((i+1)*17,'working_class')).some(a=>a>=35&&a<=55)).length;assert.ok(middle>=190,'a twist in the middle '+middle);
 const row=(age,wellbeing,health=80)=>({age,wellbeing,health,cash:0});
 const arc=lifeArc({history:[row(10,70),row(15,80),row(20,85),row(25,30),row(30,40)],story:{seen:[{id:'x',age:24,effects:{wellbeing:-20}}]}},()=>'The blow');
 assert.equal(arc.twist.age,25);assert.equal(arc.twist.what,'The blow');assert.equal(arc.peak,20);assert.equal(arc.back,false);
});

import {dealtGoals,setGoals,dealtStops,setStop,scoreLife,STOPS} from '../../dist/course/life-collection.js';
test('collecting: goals dealt per life, stops never repeat a dish, and the end re-reads the record',()=>{
 const born=begin(configureLife(newLife(7919),{birthYear:1981,class:'middle_class'}));let s={...born,story:{...born.story,pending:null},age:15};
 const deal=dealtGoals(s.seed);assert.equal(deal.length,3);assert.equal(new Set([dealtGoals(1).join(),dealtGoals(2).join(),dealtGoals(3).join(),dealtGoals(4).join()]).size>1,true);
 s=setGoals(s,deal.slice(0,2));assert.deepEqual(s.lifeGoals,deal.slice(0,2));assert.equal(setGoals(s,deal),s,'only two');
 const first=dealtStops(s)[0];s=setStop(s,first);assert.equal(s.stops.length,1);assert.equal(validate(JSON.parse(JSON.stringify(s))),true);
 const next={...s,age:20};assert.ok(!dealtStops(next).includes(first),'one dish once');
 const lived=live({...s});assert.deepEqual(lived.lifeGoals,s.lifeGoals,'choices survive the years');assert.deepEqual(lived.stops,s.stops);
 const r=scoreLife(s);assert.equal(r.goals.length,2);assert.equal(r.passed.length,1);assert.ok(Number.isFinite(r.total));assert.ok(Object.keys(STOPS).length>=20);
});

import {amuletOf,balanceOf,holdingsOfLife,mortgageLeft,personaName,setPersonaName} from '../../dist/course/life-persona.js';
import {buy,openFinance as openF,monthlyFlow as flowOf} from '../../dist/course/finance.js';
test('the card: inequality from day one, and a house is an asset with a debt on it',()=>{
 const make=c=>{const b=begin(configureLife(newLife(77),{birthYear:1981,class:c}));return {...b,story:{...b.story,pending:null}};};
 assert.ok(amuletOf(make('high_class')).value>=amuletOf(make('low_class')).value*1000);
 let s=openF({...make('middle_class'),age:25});assert.equal(setPersonaName(s,'  <Noi>  ').personaName,'Noi');assert.ok(personaName(s).length>0);
 s={...s,finance:{...s.finance,available:400000}};assert.equal(buy({...s,age:15},'house').finance.purchases.length,0,'not before twenty');
 const base=flowOf(s).rent,h=buy(s,'house');assert.equal(holdingsOfLife(h).home,'owned');assert.ok(flowOf(h).rent>base,'the mortgage is paid monthly');
 const b=balanceOf(h);assert.equal(b.mortgage,1200000);assert.equal(b.worth,100000+1500000-1200000);assert.equal(buy(h,'house'),h,'one house');assert.equal(mortgageLeft(h,45),0);assert.ok(h.finance.receipts.some(r=>r.id.startsWith('purchase:')));
});

import {goldPrice,setGoldPct} from '../../dist/course/gold.js';
import {PURCHASES} from '../../dist/course/finance.js';
test('gold: priced from world gold and the baht, bought from income, and the save stays valid',()=>{
 assert.ok(goldPrice(1980)>4000&&goldPrice(1980)<9000,'1980');assert.ok(goldPrice(2020)>22000&&goldPrice(2020)<32000,'2020');assert.ok(goldPrice(1997)>goldPrice(1995)*.8);
 let s=begin(configureLife(newLife(5550),{birthYear:1981,class:'middle_class'}));const settle=()=>{for(const p of pendingPivots(s))s=applyPivot(s,p,openOptions(p,s)[0].id);const ps=s.story?.pending;if(ps){s=resolveEncounter(s,encounterById(ps.id).options.find(o=>choiceAvailable(s,o)).id,.3);}};settle();
 while(s.stage==='review'&&s.age<40){if(s.age>=20)s=setGoldPct(s,20);const m=live(s);if(m===s)break;s=m;settle();}
 assert.equal(validate(JSON.parse(JSON.stringify(s))),true);if(s.stage==='review')assert.ok(s.finance.goldWeight>0,'gold was bought');assert.ok(PURCHASES.house.minAge===20);
});

import {assetsOf,sellAsset} from '../../dist/course/life-persona.js';
test('what you own has a price over time, and can be sold at a loss when life demands',()=>{
 const b=begin(configureLife(newLife(77),{birthYear:1981,class:'middle_class'}));let s=openF({...b,story:{...b.story,pending:null},age:25});s={...s,finance:{...s.finance,available:300000}};
 s=buy(s,'car');assert.equal(assetsOf(s).some(a=>a.key==='car'),true);const later={...s,age:35},car=assetsOf(later).find(a=>a.key==='car');assert.ok(car.value<280000&&car.points.length>=2,'cars lose value');
 const sold=sellAsset(later,'car');assert.equal(sold.finance.available-later.finance.available,car.value);assert.equal(assetsOf(sold).some(a=>a.key==='car'),false);assert.equal(sellAsset(sold,'car'),sold);
 const am=sellAsset(later,'amulet');assert.equal(assetsOf(am).some(a=>a.key==='amulet'),false,'even your father’s amulet can go');assert.ok(am.wellbeing<later.wellbeing);
});

test('the same school-day clock takes different families to their recorded kind of work',async()=>{
 const {routine,routineContext}=await import('../../dist/course/routines.js');
 const actions=['samut-prakan','nakhon-sawan','pak-phanang'].map(region=>{
  const state={birth:{region},age:8};
  return routine('mother',8,26,'balance',routineContext(state)).action;
 });
 assert.deepEqual(actions,['Tending the stall','In the garden','At work']);
});

test('fresh births expose different playable openings through age twenty',async()=>{
 const {drawBirth}=await import('../../dist/course/birth-draw.js');
 const {pendingChildChoice,chooseChild}=await import('../../dist/course/childhood-choices.js');
 const openings=new Set(),scenes=new Set(),ordinaryBesideDirected=new Set();let contested=0,ordinaryWins=0;
 let previous;
 for(let seed=1;seed<=400;seed++){
  let draw=0,s=drawBirth({},{previous,varied:true,random:()=>rand(seed,++draw,'opening')});
  previous=s;
  const path=[];
  for(let age=6;age<=9;age++){
   const question=pendingChildChoice(s,age);
   path.push(question.title);
   s=chooseChild(s,age,question.options[0].id);
  }
  s=begin(s);
  while(s.age<=20&&s.stage==='review'){
   for(const q of pendingPivots(s)){path.push(q.id);s=applyPivot(s,q,openOptions(q,s)[0].id);}
   const pending=s.story.pending;
   if(pending){
    const scene=encounterById(pending.id),candidates=pending.candidates.map(encounterById);
    path.push(scene.id);scenes.add(scene.id);
    if(candidates.some(e=>e.director)&&candidates.every(e=>(e.priority??2)===2)){contested++;if(!scene.director){ordinaryWins++;ordinaryBesideDirected.add(scene.id);}}
    s=resolveEncounter(s,scene.options[0].id,.5);
   }
   const next=live(s);assert.notEqual(next,s,'the opening can advance');s=next;
  }
  openings.add(path.join('|'));
 }
 assert.ok(openings.size>=395,openings.size+' distinct openings');
 assert.ok(scenes.size>=90,scenes.size+' offered incidents, up from 86');
 // Measured as a share: callings chosen by answers now take more stations, so fewer stations are contested at all.
 // 2026-11-12: 13 of 25 before answers chose callings and all eight eras were drawn, 6 of 18 after (small sample).
 // The guard is that the pool is never locked: ordinary scenes keep winning a real share.
 assert.ok(contested>=10&&ordinaryWins/contested>=.25,'ordinary scenes won '+ordinaryWins+' of '+contested+' stations beside a directed one');
 assert.ok(ordinaryBesideDirected.size>=5,'distinct ordinary winners '+ordinaryBesideDirected.size);
});
