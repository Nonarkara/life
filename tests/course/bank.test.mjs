import {test} from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live,configureLife,validate} from '../../dist/course/sim.js';
import {ENCOUNTERS,encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {BANK_ENCOUNTERS as BANK} from '../../dist/course/bank-encounters.js';
import {WORLD_HEADLINES,headlinesFor} from '../../dist/course/world-headlines.js';
import {conditions} from '../../dist/course/world-series.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {MORAL} from '../../dist/course/moral-ledger.js';
import {SCENARIO_PALETTES} from '../../dist/course/palette-scenes.js';
import {phrases} from '../../dist/course/translations.js';
import {translate} from '../../dist/course/i18n.js';
import {regionAt} from '../../dist/course/regions.js';

const LANGS=['th','zh-CN','ja','ko'];
const textsOf=e=>[e.title,e.prompt,...e.options.flatMap(o=>[o.label,o.outcome,o.deathCause,...(o.later??[]).map(l=>l.text)])].filter(Boolean);
const COHORTS=[1949,1970,1981,1990,2000];
const LIVES=40,CLASSES=['low_class','working_class','middle_class','bureaucratic_class','high_class','royal_associated'],SEXES=['female','male'];
// Walks a complete life, recording each offered scene with the station it fell on.
function walk(seed,opts,pick=(os,n)=>os[n%os.length],onStep=()=>{}){
 let s=begin(configureLife(newLife(seed),opts)),opened=false;const met=[];
 while(s.stage==='review'&&s.age<80){
  if(opened)s=live(s);opened=true;if(s.stage!=='review')break;onStep(s,'live');
  for(const p of pendingPivots(s)){const os=openOptions(p,s);s=applyPivot(s,p,pick(os,seed).id);onStep(s,p.id);}
  const ps=s.story?.pending;if(ps){if(encounterById(ps.id).bank)met.push({id:ps.id,age:s.age,year:s.intake.birthYear+s.age,region:regionAt(s,s.age-1)});const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,pick(os,seed).id,(seed%10)/100);onStep(s,ps.id);}
 }
 return {met,s};
}
const everyLife=(fn)=>{for(const birthYear of COHORTS)for(let i=1;i<=LIVES;i++)fn(i*7919+birthYear,{birthYear,class:CLASSES[i%CLASSES.length],sex:SEXES[i%2]},birthYear);};

test('the bank holds at least seventy scenes, twelve of them reading the real economy, all registered',()=>{
 assert.ok(BANK.length>=70,'scenes '+BANK.length);
 assert.ok(BANK.filter(e=>e.macro).length>=12,'macro scenes');
 assert.equal(new Set(BANK.map(e=>e.id)).size,BANK.length);
 for(const e of BANK){assert.ok(ENCOUNTERS.includes(e),e.id);assert.ok(SCENARIO_PALETTES[e.id],e.id);assert.ok(e.options.length>=2,e.id);assert.ok(e.options.every(o=>o.outcome.length>10),e.id);}
 assert.ok(BANK.flatMap(e=>e.options).filter(o=>o.later?.length).length>=30,'later consequences');
 const moral=Object.keys(MORAL).filter(k=>BANK.some(e=>k.startsWith(e.id+'/')));assert.ok(moral.length>=30);for(const k of moral)for(const v of MORAL[k])assert.ok(Number.isInteger(v)&&v>=-2&&v<=2,k);
});

test('every visible string translates into all four languages, including headlines',()=>{
 const rows=new Map(phrases.map(r=>[r[0],r]));
 for(const text of [...BANK.flatMap(textsOf),...Object.values(WORLD_HEADLINES).flat()]){const r=rows.get(text);assert.ok(r&&r.length===5,text);for(let i=1;i<5;i++){assert.ok(r[i]&&r[i]!==text,text);}for(const l of LANGS)assert.notEqual(translate(text,l),text,l+': '+text);}
});

test('nothing in the bank or the headlines touches the monarchy',()=>{
 const en=/\b(king|queen|prince|princess|royal|palace|majesty|rama\s+[ivx]+|bhumibol|sirikit|vajiralongkorn|chulalongkorn|ratchadamnoen|ratchada|vibhavadi|sanam luang)\b/i,th=/ในหลวง|พระราช|พระบาท|พระมหา|สมเด็จ|ราชินี|เจ้าฟ้า|พระเจ้าอยู่หัว|ราชดำเนิน|สนามหลวง/;
 const rows=new Map(phrases.map(r=>[r[0],r]));
 for(const text of [...BANK.flatMap(textsOf),...Object.values(WORLD_HEADLINES).flat()]){assert.doesNotMatch(text,en,text);assert.doesNotMatch(rows.get(text)[1],th,text);assert.doesNotMatch(rows.get(text)[2],/国王|王后|王室|皇室|陛下/,text);assert.doesNotMatch(rows.get(text)[3],/国王|王妃|王室|陛下/,text);assert.doesNotMatch(rows.get(text)[4],/국왕|왕비|왕실/,text);}
});

test('headlines cover every year from 1949 to 2025 with one to three lines',()=>{
 for(let y=1949;y<=2025;y++){const h=headlinesFor(y);assert.ok(h.length>=1&&h.length<=3,String(y));for(const t of h)assert.ok(t.length<100,t);}
 assert.deepEqual(headlinesFor(1948),[]);
});

test('the bank spreads across ages, regions, classes, sexes and decades, and no scene dominates',()=>{
 const ages=new Set(),regions=new Set(),decades=new Set(),count={},classes=new Set(),sexes=new Set();let lives=0;
 everyLife((seed,opts)=>{lives++;const {met}=walk(seed,opts);for(const m of new Set(met.map(x=>x.id)))count[m]=(count[m]??0)+1;for(const m of met){ages.add(m.age);regions.add(m.region);decades.add(Math.floor(m.year/10)*10);classes.add(opts.class);sexes.add(opts.sex);}});
 for(const a of [10,15,20,25,30,35,40,45,50,55,60,65,70,75])assert.ok(ages.has(a),'age '+a);
 for(const r of ['samut-prakan','nakhon-sawan','khlong-toei','isan-village','bang-na','pak-phanang','sukhumvit'])assert.ok(regions.has(r),'region '+r);
 for(const d of [1950,1960,1970,1980,1990,2000,2010,2020])assert.ok(decades.has(d),'decade '+d);
 for(const c of CLASSES)assert.ok(classes.has(c),c);
 for(const x of SEXES)assert.ok(sexes.has(x),x);
 const worst=Object.entries(count).sort((a,b)=>b[1]-a[1])[0];assert.ok(worst[1]<=lives*.35,worst[0]+' is in '+worst[1]+'/'+lives+' lives');
 assert.ok(Object.keys(count).length>=BANK.length*.75,'scenes reached '+Object.keys(count).length+'/'+BANK.length);
});

test('a scene tied to the real economy appears only in years the data says so',()=>{
 let seen=0;everyLife((seed,opts)=>{for(const m of walk(seed,opts).met){const e=encounterById(m.id);if(!e.macro)continue;seen++;assert.ok([0,1,2,3,4].some(k=>conditions(m.year+k)[e.macro]),m.id+' in '+m.year);}});
 assert.ok(seen>=40,'macro scenes offered '+seen);
 const flood=encounterById('b_cheap_leap');const fake=(birthYear,age)=>({intake:{birthYear,class:'middle_class'},birth:{birthYear,region:'bang-na'},age,seed:1,history:[{age,pathway:'work'}],story:{flags:{}}});
 assert.equal(flood.eligible(fake(1949,20)),false,'no cheap credit in 1969 to 1973');assert.equal(flood.eligible(fake(1949,35)),true,'cheap credit in 1986 to 1988');
});

test('later consequences of a macro gamble follow what the economy really did',()=>{
 const e=encounterById('b_cheap_leap').options.find(o=>o.id==='leap'),life=age=>({intake:{birthYear:1949},birth:{birthYear:1949},story:{seen:[{id:'b_cheap_leap',age}]}});
 const [bad,good]=e.later;assert.equal(bad.when(life(45)),true,'a 1994 venture meets 1997');assert.equal(good.when(life(45)),false);assert.equal(bad.when(life(35)),false,'a 1984 venture is clear for ten years');assert.equal(good.when(life(35)),true);
});

test('a scene opened at a station stays valid after every pivot and answer, in every cohort',()=>{
 everyLife((seed,opts)=>{walk(seed,opts,(os,n)=>os[(n>>3)%os.length],(s,at)=>assert.ok(validate(JSON.parse(JSON.stringify(s))),'seed '+seed+' after '+at));});
});

test('a question put to a ten-year-old never holds the years up, and nobody under fifteen meets anyone else\'s scene',()=>{
 let opened=0;for(let i=1;i<=60;i++){const s=begin(configureLife(newLife(i*7919),{birthYear:1949}));if(s.story.pending){opened++;assert.equal(encounterById(s.story.pending.id).child,true);assert.equal(live(s).age,15);}}
 assert.ok(opened>=30,'age-ten scenes '+opened);
 const later=BANK.filter(e=>!e.child);assert.ok(later.every(e=>e.min>=15));
 const adult=['b_bar_cousin','b_sister_money','b_german_husband'];for(const id of adult)assert.ok(encounterById(id).min>=20,id);
});
