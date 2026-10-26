import {choiceAvailable} from '../../dist/course/finance.js';
import {test} from 'node:test';import assert from 'node:assert/strict';
import {LESSONS,consequencesDue} from '../../dist/course/lessons.js';
import {ENCOUNTERS,encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {newLife,configureLife,begin,live,validate} from '../../dist/course/sim.js';
import {eventsFor} from '../../dist/course/events.js';
// Like a player, take the first option this life can afford.
const settle=s=>s.story?.pending?resolveEncounter(s,encounterById(s.story.pending.id).options.find(o=>choiceAvailable(s,o)).id,.2):s;
const to=(s,age)=>{while(s.age<age&&s.stage==='review')s=settle(live(settle(s)));return settle(s);};
test('every blog lesson is a playable decision with a source, a free first option and its own id',()=>{assert.ok(LESSONS.length>=23);for(const l of LESSONS){assert.ok(ENCOUNTERS.includes(l));if(!l.id.startsWith('m_'))assert.match(l.source,/^https:\/\/nonharvard\.wordpress\.com\//);assert.ok(l.lesson.length>20);assert.ok((l.options[0].cash??0)>=0,l.id);assert.ok(l.id.startsWith('m_')?l.min>=15&&l.max<=75:l.min>=18&&l.max<=70,l.id);for(const o of l.options)for(const c of o.later)assert.ok((c.after>=5||c.at>l.max)&&c.text,l.id+'/'+o.id);}assert.equal(new Set(ENCOUNTERS.map(e=>e.id)).size,ENCOUNTERS.length);});
test('the gravest choices stop time',()=>{for(const id of ['l_pension','l_funeral','l_early_family','l_borrow','l_bond','l_phd','l_boss','l_bottom'])assert.equal(LESSONS.find(l=>l.id===id).stop,true,id);});
test('a past choice returns once, in the period it falls due, on the timeline and in the costs',()=>{
 let s=live(to(begin(configureLife(newLife(21),{upbringing:'middle'})),20));assert.ok(!s.story.seen.some(e=>e.id==='l_less'));
 s={...s,story:{...s.story,pending:{id:'l_less',age:25,candidates:['l_less']}}};s=resolveEncounter(s,'upgrade',.2);assert.equal(s.story.seen.at(-1).id,'l_less');assert.ok(validate(s));
 assert.equal(consequencesDue(s,25,34).length,0);assert.equal(consequencesDue(s,30,35).length,1);assert.equal(consequencesDue(s,35,40).length,0);
 const next=to(s,35);const row=next.history.find(r=>r.age===35);assert.ok(row.consequences?.some(c=>c.lesson==='l_less'));assert.match(row.event,/Fixed costs locked in/);assert.ok(eventsFor(row).some(e=>e.type==='consequence'));
 const receipt=next.finance.receipts.find(r=>r.kind==='period'&&r.age===35);assert.ok(receipt.essential>=70000,'the consequence shows on the balance sheet');assert.ok(validate(JSON.parse(JSON.stringify(next))));
});
test('conditions decide which consequence happens: a trip saved for comes too late if the parent has died',()=>{const l=LESSONS.find(x=>x.id==='l_parent_trip'),later=l.options.find(o=>o.id==='later').later;for(const seed of [1,2,3,4,5,6])assert.equal(later.filter(c=>c.when({seed})).length,1);assert.match(later.find(c=>c.when({seed:3})).text,/never happened/);assert.match(later.find(c=>c.when({seed:1})).text,/took your parent/);});
test('complete lives with lessons stay valid and every returned consequence is recorded once',()=>{for(let seed=1;seed<=40;seed++){let s=to(begin(configureLife(newLife(seed))),80);assert.ok(validate(JSON.parse(JSON.stringify(s))),'seed '+seed);const all=s.history.flatMap(r=>r.consequences??[]);assert.equal(new Set(all.map(c=>c.lesson+c.choice+c.age+c.text)).size,all.length);}});
test('investing early is real: funds bought every period compound, and the ledger still balances',async()=>{
 const {netWorth}=await import('../../dist/course/finance.js');let invest=0,spend=0;
 for(const seed of [3,7,11,19,23,29]){for(const choice of ['invest','spend']){
  let s=live(begin(configureLife(newLife(seed))));if(s.story.pending?.id!=='m_runway')continue;s=resolveEncounter(s,choice,.2);s=to(s,60);
  assert.ok(validate(JSON.parse(JSON.stringify(s))),seed+choice);const w=netWorth(s.history.find(r=>r.age===60).finance);
  if(choice==='invest'){invest+=w;assert.ok(s.finance.receipts.some(r=>r.kind==='trade'&&r.side==='buy'),'funds were bought');}else{spend+=w;assert.ok(s.story.flags.invests!==undefined||!s.finance.receipts.some(r=>r.kind==='trade'),'nothing bought unasked');}}}
 assert.ok(invest>spend*1.3,'early investing should clearly beat spending by 60: '+invest+' vs '+spend);
});
test('review guards: moves stay valid, retirees with funds are not in debt, selling sells, and consequences at 30 reach the ledger',async()=>{
 const {setRegion,netWorth}=await import('../../dist/course/finance.js');const {holdingsValue}=await import('../../dist/course/investments.js');
 const pick=(s,pref)=>{if(!s.story?.pending)return s;const e=encounterById(s.story.pending.id),o=e.options.find(o=>o.id===pref[e.id]&&choiceAvailable(s,o))??e.options.find(o=>choiceAvailable(s,o));return resolveEncounter(s,o.id,.2);};
 for(const seed of [2,4,6,9,14]){const pref={m_runway:'invest',m_crash:'sell'};let s=pick(begin(configureLife(newLife(seed))),pref);
  while(s.stage==='review'&&s.age<80){s=pick(live(pick(s,pref)),pref);if(s.age===25&&s.stage==='review'&&!s.story.pending)s=setRegion(s,'samut-prakan');}
  assert.ok(validate(JSON.parse(JSON.stringify(s))),'valid after a move, seed '+seed);
  for(const r of s.history.filter(r=>r.age>60&&r.finance))assert.ok(!(r.finance.debt>0&&holdingsValue(r.finance)>0),'no debt while holding funds, seed '+seed);
  const crash=s.story.seen.find(e=>e.id==='m_crash');if(crash)assert.ok(s.finance.receipts.some(r=>r.kind==='trade'&&r.side==='sell'&&r.age===crash.age),'sold at the crash, seed '+seed);}
 const {advanceFinance}=await import('../../dist/course/finance.js');const at25=to(begin(configureLife(newLife(3))),25);
 const period=extra=>{const row={...at25.history.at(-1),from:25,age:30,setback:extra};return advanceFinance(at25,{...at25,age:30,history:[...at25.history,row]}).finance.receipts.at(-1).essential;};
 assert.equal(period(50000)-period(0),50000,'consequence cash at 30 reaches the ledger');
});
