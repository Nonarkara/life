import {test} from 'node:test';import assert from 'node:assert/strict';
import {createEconomy,economyFor,economyYears,periodEconomy,validEconomy} from '../../dist/course/economy.js';
import {trade,tradeFee,holdingsValue,markHoldings} from '../../dist/course/investments.js';
import {validFinance,netWorth,advanceFinance,buy} from '../../dist/course/finance.js';
import {newLife,replay,validate,begin,live} from '../../dist/course/sim.js';
import {resolveEncounter,encounterById} from '../../dist/course/encounters.js';
const funded=()=>({...newLife(12),age:20,stage:'review',history:[],finance:{version:1,openedAt:20,available:10000,reserve:0,debt:0,budget:{save:20,fun:10,learn:10},housing:'family',receipts:[{id:'opening:20',age:20,kind:'opening',income:10000,expense:0,change:10000}],purchases:[]}});
test('same world is choice-independent, elapsed-only and contraction clusters never split at block boundaries',()=>{
 for(let seed=0;seed<40;seed++){
  const w=createEconomy(seed),rows=economyYears(w,80);assert.equal(rows.length,81);assert.deepEqual(rows,economyYears(createEconomy(seed),80));
  for(let i=1;i<rows.length;i++)if(rows[i].sourceYear===1998)assert.equal(rows[i-1].sourceYear,1997);
  for(let i=0;i<rows.length-1;i++)if(rows[i].sourceYear===1997)assert.equal(rows[i+1].sourceYear,1998);
  assert.equal(economyYears(w,20).at(-1).age,20);
 }
 assert.equal(validEconomy({...createEconomy(1),activeFrom:21},20),false);assert.notDeepEqual(economyYears(createEconomy(1),80),economyYears(createEconomy(2),80));
});
test('trades hold actual assets, conserve net worth except fees, and release proportional basis',()=>{
 let s=funded(),b=trade(s,'equity','buy',2000);assert.equal(holdingsValue(b.finance),2000);assert.equal(netWorth(b.finance),10000-tradeFee(2000));assert.equal(b.finance.holdings.equity.basis,2010);assert.ok(validFinance(b.finance,20));
 const half=trade(b,'equity','sell',1000);assert.equal(half.finance.holdings.equity.basis,1005);assert.equal(half.finance.realizedGain,-10);assert.equal(netWorth(half.finance),netWorth(b.finance)-5);assert.ok(validFinance(half.finance,20));
 assert.equal(trade(b,'equity','buy',100000),b);assert.equal(trade(b,'bond','sell',1),b);const pending={...b,story:{pending:{}}};assert.equal(trade(pending,'bond','buy',100),pending);
 assert.equal(validFinance({...b.finance,holdings:{...b.finance.holdings,equity:{value:2500,basis:2010}}},20),false);
});
test('annual valuation needs held assets, records crisis and recovery once, never sells to cover liquidity',()=>{
 const w=createEconomy(12),s=trade(funded(),'equity','buy',9000),marked=markHoldings(s.finance,w,20,40),cash=s.finance.available;
 assert.equal(marked.available,cash);assert.equal(marked.holdings.equity.basis,9045);assert.equal(markHoldings(marked,w,20,40).receipts.length,marked.receipts.length);
 assert.equal(netWorth(marked),netWorth(s.finance)+marked.receipts.filter(r=>r.kind==='market').reduce((n,r)=>n+r.change,0));assert.ok(validFinance(marked,40));
 const empty=funded().finance;assert.equal(markHoldings(empty,w,20,40),empty);
 const rows=economyYears(w,80);assert.ok(rows.some(r=>r.growth<0));assert.ok(rows.some(r=>r.equity>0));
});
test('legacy activation starts now and replay restores the same schedule without retroactive history',()=>{
 const legacy=funded();delete legacy.economy;const preview=economyFor(legacy);assert.equal(legacy.economy,undefined);assert.equal(preview.activeFrom,20);
 const traded=trade(legacy,'bond','buy',100);assert.equal(traded.economy.activeFrom,20);assert.deepEqual(periodEconomy(traded.economy,0,19).rows,[]);
 const again=replay(traded);assert.equal(again.economy.activeFrom,0);assert.equal(again.previous.economy.activeFrom,20);assert.deepEqual(economyYears(again.economy,80).filter(r=>r.age>=20),economyYears(traded.economy,80));
 assert.equal(validate(newLife(12)),true);
});
test('dense lives can shop and trade repeatedly through retirement without exhausting the chapter ledger',()=>{
 let completed=0,maxReceipts=0;
 for(let seed=0;seed<12;seed++){
  let s=begin(newLife(seed));
  while(s.stage==='review'){
   if(s.story?.pending)s=resolveEncounter(s,encounterById(s.story.pending.id).options[0].id,.2);
   if(s.finance){
    for(const item of ['snack','book','comics','class','sport'])s=buy(s,item);
    for(let n=0;n<12;n++){s=trade(s,'equity','buy',100);if(s.finance.holdings?.equity.value>=100)s=trade(s,'equity','sell',100);}
    assert.ok(validFinance(s.finance,s.age));maxReceipts=Math.max(maxReceipts,s.finance.receipts.length);
   }
   const next=live(s);assert.ok(next.age>s.age,'chapter cannot freeze from ordinary dense play');s=next;
  }
  assert.ok(validate(s));if(s.age===80)completed++;
 }
 assert.ok(completed>0);assert.ok(maxReceipts>200);
});
test('empty fund accounts never create a market event and legacy chapter activation leaves its past intact',()=>{
 const s=funded();s.finance.holdings={bond:{value:0,basis:0},equity:{value:0,basis:0}};
 assert.equal(markHoldings(s.finance,s.economy,20,25),s.finance);
 let legacy=begin(newLife(12));delete legacy.economy;const history=structuredClone(legacy.history),next=live(legacy);assert.equal(next.economy.activeFrom,10);assert.deepEqual(next.history.slice(0,2),history);
});
test('market identity, chronology and world-derived changes cannot be forged or replayed under a renamed identity',()=>{
 const s=trade(funded(),'equity','buy',2000),marked=markHoldings(s.finance,s.economy,20,25);
 assert.ok(validFinance(marked,25,s.economy));
 const rename=structuredClone(marked);rename.receipts.find(r=>r.kind==='market').id='renamed';assert.equal(validFinance(rename,25,s.economy),false);assert.equal(markHoldings(rename,s.economy,20,25),null);
 const futureBuy=structuredClone(marked);futureBuy.receipts[1].age=24;assert.equal(validFinance(futureBuy,25,s.economy),false);
 const falseSource=structuredClone(marked);falseSource.receipts.find(r=>r.kind==='market').sourceYear=1961;assert.equal(validFinance(falseSource,25,s.economy),false);
 // Internally balanced fake gain must still fail against the world's exact return.
 const gain=structuredClone(marked),r=gain.receipts.find(r=>r.kind==='market');r.deltas.equity++;r.change++;r.income=Math.max(0,r.change);r.expense=Math.max(0,-r.change);gain.holdings.equity.value++;assert.equal(validFinance(gain,25,s.economy),false);
});
