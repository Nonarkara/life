// Living it again: a life with a calendar birth year lives through Thailand's real economic record,
// so what a player remembers of those years can be acted on.
import test from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live,configureLife,replay,rand,validate} from '../../dist/course/sim.js';
import {createEconomy,realEconomy,validEconomy,economyYears,periodEconomy,SET_OPENED} from '../../dist/course/economy.js';
import {worldAt} from '../../dist/course/world-series.js';
import {SET_CLOSE} from '../../dist/course/market-moments.js';
import {trade,holdingsOf,marketClosed} from '../../dist/course/investments.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable,netWorth} from '../../dist/course/finance.js';
import {sameBirth} from '../../dist/course/life-reading.js';
import {unchosenLife} from '../../dist/course/baseline.js';
import {translate} from '../../dist/course/i18n.js';

const born=(by,seed=7919+by,cls='middle_class')=>begin(configureLife(newLife(seed),{class:cls,sex:'female',birthYear:by}));
const settle=s=>{for(let n=0;n<12;n++){const list=pendingPivots(s);if(!list.length)break;const q=list[0],open=openOptions(q,s),next=applyPivot(s,q,open[0].id);if(next===s)break;s=next;}
 if(s.story?.pending){const e=encounterById(s.story.pending.id),open=e.options.filter(o=>choiceAvailable(s,o)),list=open.length?open:e.options;s=resolveEncounter(s,list[0].id,.5);}return s;};
const to=(s,age)=>{s=settle(s);while(s.stage==='review'&&s.age<age){const n=live(s);if(n===s)break;s=settle(n);}return s;};

test('a life with a birth year lives in the real record; a life without one, and every older save, keeps the shuffled scenario',()=>{
 const s=born(1970);assert.deepEqual(s.economy,{version:3,seed:s.seed,startYear:1970,activeFrom:0});
 assert.equal(validEconomy(s.economy),true);assert.equal(validate(JSON.parse(JSON.stringify(s))),true);
 assert.deepEqual(newLife(5).economy,{version:2,seed:5,startYear:2030,activeFrom:0});assert.deepEqual(createEconomy(5),{version:2,seed:5,startYear:2030,activeFrom:0});
 assert.equal(validEconomy({version:2,seed:5,startYear:2030,activeFrom:0}),true);assert.equal(validEconomy({version:2,seed:5,startYear:1970,activeFrom:0}),false);
 assert.equal(validEconomy({version:3,seed:5,startYear:2030.5,activeFrom:0}),false);assert.equal(validEconomy({version:4,seed:5,startYear:1970,activeFrom:0}),false);
 // The scenario rows of an older life are exactly what they were.
 const old=economyYears(createEconomy(77),80);assert.ok(old.every(r=>r.real===undefined&&r.year===2030+r.age));
 // A replay, the unchosen life and the comparison lives stay in the same kind of world.
 const lived=to(s,25);assert.equal(replay(lived).economy.version,3);assert.equal(replay(lived).economy.startYear,1970);
 assert.equal(sameBirth(lived,3).economy.version,3);assert.equal(sameBirth(lived,3).economy.startYear,1970);
 const legacy={...lived,economy:createEconomy(lived.seed)};assert.equal(replay(legacy).economy.version,2);assert.equal(sameBirth(legacy,3).economy.version,2);
});

test('each year is that year: growth, wages and the SET index after prices, with no market before the exchange opened',()=>{
 const rows=economyYears(realEconomy(9,1970),80),at=y=>rows[y-1970];
 for(const y of [1976,1986,1989,1993,1997,1998,2008,2020]){const r=at(y),w=worldAt(y);
  assert.equal(r.year,y);assert.equal(r.real,true);assert.equal(r.growth,w.growth);assert.equal(r.sourceYear,y);
  assert.ok(Math.abs(r.equity-(SET_CLOSE[y]/SET_CLOSE[y-1]/(1+w.inflation/100)-1))<1e-12,'SET '+y);
  assert.equal(r.wageFactor,w.growth<0?Math.max(.75,1+w.growth/35):1+Math.min(w.growth,10)/200);}
 assert.ok(at(1989).equity>1,'1989 more than doubled');assert.ok(at(1997).equity<-.5,'1997 lost more than half');assert.ok(at(1998).wageFactor<.8,'1998 cut pay');
 for(const y of [1970,1972,1974]){assert.equal(at(y).equity,0);assert.equal(at(y).noMarket,true);}
 assert.equal(at(SET_OPENED).equity,0);assert.equal(at(SET_OPENED).noMarket,undefined,'the year it opened can be bought into');
 const after=at(2030);assert.equal(after.real,false,'2030 has no record and says so');assert.equal(after.year,2030);
 assert.equal(periodEconomy(realEconomy(9,1970),25,30).contractions.map(r=>r.year).join(),'1997,1998');
 // Two different seeds share the same history.
 assert.deepEqual(economyYears(realEconomy(1,1970),50).map(r=>[r.growth,r.equity]),economyYears(realEconomy(2,1970),50).map(r=>[r.growth,r.equity]));
});

test('the exchange cannot be bought before it opens, and can from 1975',()=>{
 let s=to(born(1949),20);assert.equal(s.age,20);assert.equal(marketClosed(s),true,'1969');
 s={...s,finance:{...s.finance,available:s.finance.available+100000,receipts:[...s.finance.receipts,{id:'t:gift',age:20,kind:'encounter',income:100000,expense:0,change:100000}]}};
 assert.equal(trade(s,'equity','buy',50000),s,'nothing to buy in 1969');assert.notEqual(trade(s,'bond','buy',50000),s,'the bond fund is open');
 const later=to(s,30);if(later.stage==='review'&&later.age===30){assert.equal(marketClosed(later),false,'1979');}
 const first=to(born(1955),20);assert.equal(marketClosed(first),false,'1975: the year it opened');
});

test('what a player remembers pays: money held in the index through 1985–1990 grows by the real change, and through 1995–2000 it is lost',()=>{
 const hold=(by,age)=>{for(let i=1;i<60;i++){let s=to(born(by,i*7919+by),age);if(s.stage!=='review'||s.age!==age||!s.finance)continue;
   s={...s,finance:{...s.finance,available:s.finance.available+1000000,receipts:[...s.finance.receipts,{id:'t:gift',age,kind:'encounter',income:1000000,expense:0,change:1000000}]}};
   const bought=trade(s,'equity','buy',900000);if(bought===s)continue;const next=live(bought);if(next===bought||!next.finance)continue;
   const rows=periodEconomy(bought.economy,age,age+5).rows,expected=rows.reduce((v,r)=>Math.round(v*(1+r.equity)),holdingsOf(bought.finance).equity.value);
   return {start:holdingsOf(bought.finance).equity.value,end:holdingsOf(next.finance).equity.value,expected,ok:validate(JSON.parse(JSON.stringify(next)))};}};
 const boom=hold(1955,30);assert.ok(boom,'a 1955 life reached thirty');assert.equal(boom.end,boom.expected);assert.ok(boom.end>boom.start*3,'1985–1990: '+boom.start+' → '+boom.end);assert.equal(boom.ok,true);
 const bust=hold(1970,25);assert.ok(bust);assert.equal(bust.end,bust.expected);assert.ok(bust.end<bust.start*.35,'1995–2000: '+bust.start+' → '+bust.end);
});

test('the panels say it is the real record, in every language',()=>{
 for(const lang of ['th','zh-CN','ja','ko'])for(const key of ['GDP growth · % per year · the real record','Thailand’s real record: GDP growth and the SET index, after prices. The bond fund is a game rule.','The stock exchange has not opened yet. It opens in 1975.','In this life the equity fund follows the real SET index, year by year, after prices. What you remember of those years is yours to use.'])assert.notEqual(translate(key,lang),key,lang+' · '+key);
});

import {recordAt} from '../../dist/course/economy.js';
import {autoInvest} from '../../dist/course/investments.js';
import {marketsDue} from '../../dist/course/market-moments.js';
import {readFileSync} from 'node:fs';

test('only a birth that will live recorded years is put in the record, and the record is tied to the birth year',()=>{
 assert.equal(configureLife(newLife(11),{birthYear:2026}).economy.version,2,'2026 has no recorded working year');
 assert.equal(configureLife(newLife(11),{}).economy.version,2,'no birth year, no calendar');
 for(const by of [1949,1955,1970,1975,1981,1990,1997,2000])assert.equal(configureLife(newLife(11),{birthYear:by}).economy.startYear,by);
 const s=born(1970);assert.equal(validate({...s,economy:{...s.economy,startYear:1985}}),false,'another year’s history');
 const {intake,...rest}=s;assert.equal(validate({...rest,intake:{...intake,birthYear:undefined},birth:{...s.birth,birthYear:undefined}}),false,'a record with no calendar');
 // The player is told which years are on record: 'real' while they are, 'after' once the record runs out.
 assert.equal(recordAt(realEconomy(1,2000),25),'real');assert.equal(recordAt(realEconomy(1,2000),26),'after');assert.equal(recordAt(realEconomy(1,1955),70),'real');assert.equal(recordAt(realEconomy(1,1955),71),'after');
 assert.equal(recordAt(createEconomy(1),40),'scenario');assert.equal(recordAt(undefined,40),'scenario');
 // After the record ends the years are the scenario's own, not zeros.
 const late=economyYears(realEconomy(9,2000),60).filter(r=>!r.real),like=economyYears(createEconomy(9),60);
 assert.ok(late.length>30);for(const r of late){assert.equal(r.equity,like[r.age].equity);assert.equal(r.growth,like[r.age].growth);assert.equal(r.bond,like[r.age].bond);}
 assert.deepEqual(economyYears(realEconomy(9,1970),50).map(r=>r.bond),like.slice(0,51).map(r=>r.bond),'the bond fund is the same game rule in both');
});

test('the comparison lives of an older save stay in its world, and the unchosen life keeps the record',()=>{
 const lived=to(born(1970),25),old={...lived,economy:createEconomy(lived.seed)};
 assert.equal(unchosenLife(lived,{upTo:25}).economy.version,3);assert.equal(unchosenLife(old,{upTo:25}).economy.version,2);
 const src=f=>readFileSync(new URL('../../dist/course/'+f,import.meta.url),'utf8');
 assert.ok(src('life-reading.js').includes('economy:createEconomy(state.seed+k*97+1,0,state.economy)'),'class comparison');
 assert.ok(src('personality.js').includes('economy:createEconomy(state.seed,0,state.economy)'),'personality comparison');
 assert.notEqual(replay(lived).economy,undefined);assert.equal(replay(lived).economy.seed,lived.economy.seed);
});

test('selling is never blocked, and the standing habit waits for the exchange without buying bonds alone',()=>{
 let s=to(born(1949),20);const gift=(x,n)=>({...x,finance:{...x.finance,available:x.finance.available+n,receipts:[...x.finance.receipts,{id:'t:gift'+x.finance.receipts.length,age:x.age,kind:'encounter',income:n,expense:0,change:n}]}});
 s=gift(s,400000);const bonds=trade(s,'bond','buy',50000);assert.notEqual(trade(bonds,'bond','sell',20000),bonds,'a sale before 1975 goes through');
 const habit=autoInvest({...s,story:{...s.story,flags:{...s.story.flags,invests:20}}});
 assert.deepEqual(holdingsOf(habit.finance),holdingsOf(s.finance),'nothing bought in 1969');
 const first=gift(to(born(1955),20),400000),on=autoInvest({...first,story:{...first.story,flags:{...first.story.flags,invests:20}}}),h=holdingsOf(on.finance);
 assert.ok(h.bond.value>0&&h.equity.value>0,'1975: both funds bought');
});

test('a stock-market question pays like the fund in a real-record life, and never stakes what the fund already holds',()=>{
 const due=marketsDue({set1993:20,set1993a:100000},25)[0];assert.equal(due.stake,100000);assert.equal(due.year,1993);
 let prices=1;for(let y=1994;y<=1998;y++)prices*=1+worldAt(y).inflation/100;
 const expected=Math.round(100000*(due.per100/100/prices-1));assert.ok(expected<due.gain,'after prices the same five years are worth less: '+expected+' against '+due.gain);
 const fund=economyYears(realEconomy(1,1970),28).filter(r=>r.year>=1994&&r.year<=1998).reduce((v,r)=>v*(1+r.equity),1);
 // per100 is a whole number of baht, so the two agree to within its rounding.
 assert.ok(Math.abs(fund-due.per100/100/prices)<.005,'the question and the fund agree on 1993–1998: '+fund+' against '+due.per100/100/prices);
 const sim=readFileSync(new URL('../../dist/course/sim.js',import.meta.url),'utf8'),piv=readFileSync(new URL('../../dist/course/pivots.js',import.meta.url),'utf8');
 assert.ok(sim.includes("gain=Math.round(m.stake*(m.per100/100/prices-1))"));assert.ok(piv.includes("state.economy?.version===3?state.finance?.holdings?.equity?.value??0:0"));
});

test('the screens say which record the player is in',()=>{
 const src=f=>readFileSync(new URL('../../dist/course/'+f,import.meta.url),'utf8'),inv=src('investment-view.js'),eco=src('economy-view.js');
 assert.ok(inv.includes("const shut=assetSelect.value==='equity'&&marketClosed(live);")&&inv.includes("buy.disabled=blocked||shut||"));
 assert.ok(inv.includes("recordAt(economyFor(live),live.age)")&&inv.includes("where!=='scenario'"));
 assert.ok(eco.includes("[recordAt(world,s.age)]")&&eco.includes("rows.every(r=>r.real)")&&eco.includes("last.noMarket?'Equity fund · no exchange yet'"));
 for(const lang of ['th','zh-CN','ja','ko'])for(const key of ['GDP growth · % per year · real to 2025, sampled after','Equity fund · no exchange yet','Annual record','There is no record after 2025. From here the funds follow the game’s own sampled years, and nobody knows them in advance.','There is no record after 2025. From here the years are sampled from the past, as a game rule.'])assert.notEqual(translate(key,lang),key,lang+' · '+key);
});
