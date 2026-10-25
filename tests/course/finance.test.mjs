import test from 'node:test';import assert from 'node:assert/strict';
import {openFinance,advanceFinance,setBudget,setHousing,setWorkplace,buy,moveReserve,netWorth,validFinance,validFinanceLocation,monthlyFlow} from '../../dist/course/finance.js';
import {newLife,configureLife,begin,live,validate} from '../../dist/course/sim.js';
import {resolveEncounter,encounterById} from '../../dist/course/encounters.js';
const settle=s=>s.story?.pending?resolveEncounter(s,encounterById(s.story.pending.id).options[0].id,.2):s;
const teen=()=>openFinance(settle(live(begin(configureLife(newLife(12),{upbringing:'middle'})))));
test('school allowance opens once and can never spend the household buffer',()=>{const s=teen();assert.equal(s.finance.receipts[0].income,1500);assert.equal(s.finance.available,1200);assert.equal(openFinance(s),s);const next=buy(s,'book');assert.equal(next.finance.available,1100);assert.equal(next.cash,s.cash);assert.deepEqual(next.attributes,s.attributes);assert.equal(next.skills.iq,s.skills.iq+1);assert.equal(buy(next,'book'),next);assert.ok(validFinance(next.finance,next.age));});
test('plans do not spend cash and reject impossible allocations',()=>{const s=teen(),next=setBudget(s,{save:30,fun:10,learn:20});assert.equal(netWorth(next.finance),netWorth(s.finance));assert.equal(setBudget(s,{save:90,fun:20,learn:0}),s);assert.equal(setBudget(s,{save:-1,fun:10,learn:10}),s);});
test('one financial period conserves money and excludes the opening monthly allowance',()=>{const s=teen(),nextRaw={...s,age:20,history:[...s.history,{...s.history.at(-1),from:15,age:20,earnings:0,pathway:'school'}]},next=advanceFinance(s,nextRaw),receipt=next.finance.receipts.at(-1);assert.equal(receipt.income,1500*59);assert.equal(netWorth(next.finance),netWorth(s.finance)+receipt.income-receipt.expense);assert.equal(advanceFinance(next,next).finance,next.finance);assert.ok(validFinance(next.finance,20));assert.equal(moveReserve(next,next.finance.reserve+1),next);const moved=moveReserve(next,100);assert.equal(netWorth(moved.finance),netWorth(next.finance));});
test('cheaper rent includes its higher travel cost and longer commute',()=>{const s={...teen(),age:25};const far=monthlyFlow({...s,finance:{...s.finance,housing:'far'}},{earnings:20000,pathway:'work'}),near=monthlyFlow({...s,finance:{...s.finance,housing:'near'}},{earnings:20000,pathway:'work'});assert.ok(far.essential<near.essential);assert.ok(far.commute>near.commute);});
test('unfunded or repeated purchases have no effect; missing legacy accounts are accepted',()=>{const s=teen(),poor={...s,finance:{...s.finance,available:0}};assert.equal(buy(poor,'class'),poor);assert.ok(validFinance(undefined,60));assert.equal(validFinance({...s.finance,available:NaN},15),false);assert.equal(validFinance({...s.finance,receipts:[...s.finance.receipts,s.finance.receipts[0]]},15),false);});

test('the opening school month and later working months use consistent costs',()=>{const s=teen(),next=advanceFinance({...s,pathway:'vocational'},{...s,age:20,history:[...s.history,{...s.history.at(-1),from:15,age:20,pathway:'vocational',earnings:0}]});const r=next.finance.receipts.at(-1);assert.equal(r.income,5000*59);assert.equal(r.essential,1200*59);assert.equal(netWorth(next.finance),netWorth(s.finance)+r.change);});
test('reserve moves update the snapshot and forged unpaid purchases are rejected',()=>{const s=teen(),raw={...s,age:20,history:[...s.history,{...s.history.at(-1),from:15,age:20,pathway:'school'}]},adult=advanceFinance(s,raw),moved=moveReserve(adult,100);assert.equal(moved.history.at(-1).finance.available,moved.finance.available);assert.equal(moved.history.at(-1).finance.reserve,moved.finance.reserve);assert.equal(validFinance({...s.finance,purchases:[{key:'class',age:15,cost:500,hours:4}]},15),false);});
test('replay keeps the previous personal ledger while opening no new account before fifteen',async()=>{const {replay}=await import('../../dist/course/sim.js');const s=buy(teen(),'class'),again=replay(s);assert.equal(again.finance,undefined);assert.deepEqual(again.previous.finance,s.finance);assert.equal(again.previous.finance.purchases[0].key,'class');assert.equal(again.age,0);});
test('earlier acquired skills affect later work pay without rewriting starting attributes',async()=>{const {grossMonthlyPay}=await import('../../dist/course/finance.js');const s={...teen(),age:25},trained={...s,skills:{...s.skills,iq:s.skills.iq+10,eq:s.skills.eq+5}};assert.ok(grossMonthlyPay(trained)>grossMonthlyPay(s));assert.deepEqual(trained.attributes,s.attributes);});
test('a student pays school meals and travel from the allowance instead of banking all of it',()=>{const s=teen(),flow=monthlyFlow(s,{pathway:'school'});assert.equal(flow.income,1500);assert.equal(flow.essential,1050);const next=advanceFinance(s,{...s,age:20,history:[...s.history,{...s.history.at(-1),from:15,age:20,pathway:'school',earnings:0}]});assert.ok(netWorth(next.finance)-netWorth(s.finance)<(1500-1050)*59);});
test('a pension follows working pay, so retirement money is not a flat line by construction',async()=>{const {grossMonthlyPay}=await import('../../dist/course/finance.js');const s={...teen(),age:65},driven={...s,effort:{...s.effort,drive:s.effort.drive+4}};assert.ok(grossMonthlyPay(driven)>grossMonthlyPay(s));assert.ok(grossMonthlyPay(s)>=3000);assert.equal(grossMonthlyPay(s),Math.max(3000,Math.round(grossMonthlyPay({...s,age:59})*.4)));});
test('workplace selection is gated, pure, and legacy-compatible; unknown districts are rejected',()=>{
 const young=teen();assert.equal(setWorkplace(young,'city'),young);const s={...young,age:25},city=setWorkplace(s,'city');
 assert.equal(city.finance.workplace,'city');assert.equal(netWorth(city.finance),netWorth(s.finance));assert.deepEqual(city.skills,s.skills);assert.deepEqual(city.history,s.history);
 assert.equal(setWorkplace(s,'unknown'),s);assert.equal(setWorkplace({...s,stage:'recap'},'city').finance,s.finance);
 assert.ok(validFinance(s.finance,s.age));assert.equal(validFinance({...s.finance,workplace:'unknown'},s.age),false);
 assert.equal(validFinanceLocation({housing:'near',workplace:'unknown'}),false);assert.equal(validFinanceLocation({housing:'unknown'}),false);
});
test('city work pay premium excludes allowance and pension and discloses the added commute cost',()=>{
 const base={...teen(),age:35},local=monthlyFlow(base,{pathway:'work',earnings:20000}),city=monthlyFlow(setWorkplace(base,'city'),{pathway:'work',earnings:20000});
 assert.equal(city.income,23000);assert.equal(city.essential-local.essential,1000);assert.equal(city.commute-local.commute,50);
 const student={...setWorkplace(base,'city'),age:22};assert.equal(monthlyFlow(student,{pathway:'college'}).income,1500);
 const pension={...setWorkplace(base,'city'),age:65};assert.equal(monthlyFlow(pension,{earnings:7000,pathway:'work'}).income,7000);
 const near=setHousing(setWorkplace(base,'city'),'near'),nearFlow=monthlyFlow(near,{earnings:20000,pathway:'work'});assert.equal(nearFlow.commute,20);assert.equal(nearFlow.essential,11000);
});
test('independently housed college students pay rent and transport without a city allowance premium',()=>{
 const base={...teen(),age:22},family=monthlyFlow(base,{pathway:'college'}),rented=monthlyFlow(setHousing(setWorkplace(base,'city'),'near'),{pathway:'college'});
 assert.equal(rented.income,family.income);assert.equal(rented.essential-family.essential,8000);assert.equal(rented.commute,80);
});
test('district period snapshots preserve money conservation and historical location',()=>{
 const s=setHousing(setWorkplace({...teen(),age:25},'city'),'far'),raw={...s,age:30,history:[...s.history,{...s.history.at(-1),from:25,age:30,pathway:'work',earnings:20000}]},next=advanceFinance(s,raw),receipt=next.finance.receipts.at(-1);
 assert.equal(netWorth(next.finance),netWorth(s.finance)+receipt.change);assert.equal(receipt.income,23000*60);assert.ok(validFinance(next.finance,30));
 assert.equal(next.history.at(-1).finance.workplace,'city');assert.equal(next.history.at(-1).finance.housing,'far');
 assert.equal(validFinance({...next.finance,receipts:next.finance.receipts.map((r,i,a)=>i===a.length-1?{...r,workplace:'moon'}:r)},30),false);
});
test('malformed receipt containers and null entries are rejected without crashing load',()=>{
 const s=teen();for(const receipts of [null,{},[null],[undefined],[{}]]){
  const finance={...s.finance,receipts};assert.doesNotThrow(()=>validFinance(finance,s.age));assert.equal(validFinance(finance,s.age),false);
  assert.doesNotThrow(()=>validate({...s,finance}));assert.equal(validate({...s,finance}),false);
 }
});
