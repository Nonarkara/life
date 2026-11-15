// The year's real bank rates change what debt and savings do, and the plan says so before the years are lived.
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {newLife,begin,live,configureLife,rand,validate,CLASS_KEYS} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable,bankYears,netWorth,inThailand} from '../../dist/course/finance.js';
import {periodRate,realRate,worldAt,WORLD_LAST} from '../../dist/course/world-series.js';
import {moneyOutlook,outlookLine,yearFacts,seriesTo,linePath,renderYearPanel} from '../../dist/course/year-panel.js';
import {translate} from '../../dist/course/i18n.js';

test('a rate is counted after that year’s prices; a period adds the years on record and is null unless every year has a figure',()=>{
 assert.equal(realRate('deposit',1981),Math.round((worldAt(1981).deposit-worldAt(1981).inflation)*10)/10);assert.ok(realRate('deposit',1981)<1,'12.5% on savings while prices rose 12.7% paid nothing');
 assert.equal(realRate('lending',1970),null);assert.equal(realRate('lending',WORLD_LAST+1),null);
 const sum=[1985,1986,1987,1988,1989].reduce((n,y)=>n+realRate('lending',y),0);
 assert.ok(Math.abs(periodRate('lending',1985,1990)-sum/100)<1e-9);
 assert.equal(periodRate('deposit',2005,2010),0,'years when prices outran the bank add up to nothing, never to a loss');
 assert.equal(periodRate('lending',1960,1965),null,'no figure before 1976: never guessed');
 assert.equal(periodRate('lending',1974,1979),null,'three years of five on record are not scaled up to five');
 assert.equal(periodRate('deposit',1975,1980),null);
 assert.equal(periodRate('lending',WORLD_LAST,WORLD_LAST+5),null,'one known year does not stand for five');
 assert.equal(periodRate('deposit',WORLD_LAST+1,WORLD_LAST+6),null);
});

test('the same debt is far heavier in the 1980s than in the 2010s, and old rules hold where there is no record',()=>{
 const born=(y,more={})=>({intake:{birthYear:y},birth:{region:'samut-prakan'},...more}),flat={loan:.35,save:0,real:false},eighties=bankYears(born(1955),25,30),tens=bankYears(born(1990),25,30);
 assert.ok(eighties.loan>=.38&&eighties.real,'1980–84 lending after prices: '+eighties.loan);assert.ok(tens.loan<=.22&&tens.real,'2015–19 lending after prices: '+tens.loan);
 assert.ok(eighties.save>=.2&&tens.save<=.06,'savings paid then, and barely pay now');
 assert.ok(bankYears(born(1955),30,35).loan>.45,'1985–89: the dearest debt on record');
 assert.deepEqual(bankYears(born(1949),20,25),flat,'1969–73 has no figure');
 assert.deepEqual(bankYears(born(1949),25,30),flat,'1974–78 is only partly on record');
 assert.deepEqual(bankYears(born(2000),25,30),flat,'2025–29 has one year on record');
 assert.deepEqual(bankYears({birth:{region:'samut-prakan'}},30,35),flat,'a life with no calendar keeps the authored rule');
 // A Thai bank's rates are not charged to someone living in another country.
 for(const region of ['singapore','tokyo','boston','london'])assert.deepEqual(bankYears(born(1981,{finance:{region}}),25,30),flat,region);
 assert.equal(inThailand(born(1981,{finance:{region:'khon-kaen'}})),true);assert.equal(bankYears(born(1981,{finance:{region:'khon-kaen'}}),25,30).real,true);
});

const play=(seed,cls,birthYear)=>{let s=begin(configureLife(newLife(seed),{class:cls,sex:'female',birthYear}));const steps=[];
 const settle=()=>{for(let n=0;n<12;n++){const list=pendingPivots(s);if(!list.length)break;const q=list[0],open=openOptions(q,s),next=applyPivot(s,q,open[Math.floor(rand(seed,s.age,'y'+q.id)*open.length)].id);if(next===s)break;s=next;}
  if(s.story?.pending){const e=encounterById(s.story.pending.id),open=e.options.filter(o=>choiceAvailable(s,o)),list=open.length?open:e.options;s=resolveEncounter(s,list[Math.floor(rand(seed,s.age,'y'+e.id)*list.length)].id,.5);}};
 settle();for(let g=0;g<30&&s.stage==='review'&&s.age<80;g++){const before=s,next=live(s);if(next===s)break;steps.push([before,next]);s=next;settle();}return {s,steps};};
const lives=[];for(const cls of CLASS_KEYS)for(const by of [1955,1981,2000])for(let i=1;i<=12;i++)lives.push(play(i*7919+by+CLASS_KEYS.indexOf(cls)*104729,cls,by));

test('every lived stretch charges debt and pays savings at that stretch’s rate, and the books still balance',()=>{
 let charged=0,paid=0;
 for(const {s,steps} of lives){assert.equal(validate(JSON.parse(JSON.stringify(s))),true);
  for(const [before,after] of steps){const r=after.finance?.receipts.findLast(x=>x.kind==='period'&&x.age===after.age);if(!r||!before.finance)continue;
   const bank=bankYears(before,before.age,after.age);
   assert.equal(r.debtCost,Math.round(before.finance.debt*bank.loan));assert.equal(r.interest,Math.round(before.finance.reserve*bank.save));
   if(r.debtCost>0)charged++;if(r.interest>0)paid++;}
  if(s.finance)assert.equal(s.finance.receipts.reduce((n,r)=>n+r.change,0),netWorth(s.finance),'receipts add up to net worth');}
 assert.ok(charged>10&&paid>10,charged+' charged, '+paid+' paid');
 // Interest is added to what is set aside, on top of what the budget saves, and is not spent or turned into learning.
 const receipt=x=>x.finance.receipts.findLast(r=>r.kind==='period'&&r.age===x.age),steps=lives.flatMap(l=>l.steps).filter(([b,a])=>b.finance&&!a.death);
 {const [before,after]=steps.find(([b,a])=>receipt(a)?.interest>0&&b.finance.debt===0&&a.finance.debt===0),bare=live({...before,finance:{...before.finance,reserve:0}}),r=receipt(after),r0=receipt(bare);
  assert.equal(r.income-r0.income,r.interest);assert.equal(r.fun,r0.fun);assert.equal(r.learn,r0.learn);assert.equal(r.saved,r0.saved);
  assert.equal(after.finance.reserve-bare.finance.reserve,before.finance.reserve+r.interest);
  assert.deepEqual(after.skills,bare.skills,'interest buys no skill');}
 // Debt cost is money the person really pays: the same years with nothing owed cost exactly that much less.
 {const [before,after]=steps.find(([b,a])=>receipt(a)?.debtCost>0),clear=live({...before,finance:{...before.finance,debt:0}});
  assert.equal(receipt(after).essential-receipt(clear).essential,receipt(after).debtCost);}
});

test('the plan says exactly what the coming five years will charge or pay',()=>{
 let debt=0,save=0,flat=0;
 for(const {steps} of lives)for(const [before,after] of steps){if(!before.finance)continue;const r=after.finance.receipts.findLast(x=>x.kind==='period'&&x.age===after.age),o=moneyOutlook({...before,story:{...before.story,pending:null}});
  const real=bankYears(before,before.age,after.age).real;
  if(r.debtCost>0){debt++;assert.deepEqual(o,{kind:'debt',five:r.debtCost,real});if(!real)flat++;}
  else if(r.interest>0){save++;assert.deepEqual(o,{kind:'save',five:r.interest,real:true});}
  else assert.equal(o,null,'nothing owed and nothing earned: nothing to say');}
 assert.ok(debt>10&&save>10&&flat>0,debt+' '+save+' '+flat);
 const s={stage:'review',age:25,intake:{birthYear:1955},birth:{region:'samut-prakan'},finance:{debt:100000,reserve:0}};
 assert.equal(outlookLine({...s,age:30}),'Interest on your debt over these five years, after prices: ฿'+Math.round(100000*bankYears(s,30,35).loan).toLocaleString('en')+'.');
 assert.equal(outlookLine({...s,age:15}),'Interest on your debt over these five years, at a flat 35%: ฿35,000.','1970–74 has no record: the flat rule, and it says so');
 assert.equal(outlookLine(s),'Interest on your debt over these five years, after prices: ฿'+Math.round(100000*bankYears(s,25,30).loan).toLocaleString('en')+'.');
 assert.equal(outlookLine({...s,finance:{debt:0,reserve:20000}}),'Interest on what you set aside over these five years, after prices: ฿'+Math.round(20000*bankYears(s,25,30).save).toLocaleString('en')+'.');
 assert.equal(moneyOutlook({...s,stage:'recap'}),null);
 for(const lang of ['th','zh-CN','ja','ko']){for(const key of ['Interest on your debt over these five years, at a flat 35%: {y}.','Interest on your debt over these five years, after prices: {y}.','Interest on what you set aside over these five years, after prices: {y}.']){const said=translate(key,lang);assert.notEqual(said,key);assert.ok(said.includes('{y}'),lang+' keeps the figure');}
  for(const key of ['Savings','After prices','Loan and savings rates after prices, the last fifteen years'])assert.notEqual(translate(key,lang),key);}
});

test('the year panel shows only years that have happened, only in Thailand, and bridges no gap',()=>{
 const at=(by,age,more={})=>({intake:{birthYear:by},birth:{region:'samut-prakan'},age,...more}),f=yearFacts(at(1981,20));
 assert.equal(f.year,2001);assert.ok(f.loans.every(p=>p.year<=2001&&p.year>1985)&&f.loans.at(-1).year===2001);assert.equal(f.lending,realRate('lending',2001));
 assert.ok(typeof f.headline==='string'&&f.headline.length>0);
 assert.equal(yearFacts(at(1981,10)),null,'a child has no bank');
 assert.equal(yearFacts(at(2000,30)),null,'2030: no record, no panel');
 assert.equal(yearFacts({age:30}),null);
 assert.equal(yearFacts(at(1981,25,{finance:{region:'london'}})),null,'the Thai year is not shown to someone living in London');
 assert.equal(seriesTo('lending',1977).length,2);assert.deepEqual(yearFacts(at(1955,20)).loans,[],'two points are not a line');
 // 2002 and 2003 have no lending figure: the line stops and starts again.
 const rows=seriesTo('lending',2006);assert.ok(rows.some((r,i)=>i&&rows[i-1].year!==r.year-1),'the record has a gap here');
 const d=linePath(rows,r=>r.year,r=>r.v);assert.equal(d.split('M').length-1,2,'two strokes: '+d);
 assert.equal(linePath(seriesTo('lending',1995),r=>r.year,r=>r.v).split('M').length-1,1);
});

// A minimal stand-in for the browser, enough to see what the panel draws.
const node=tag=>({tag,className:'',textContent:'',hidden:false,attrs:{},children:[],append(...k){this.children.push(...k);},replaceChildren(...k){this.children=k;},setAttribute(k,v){this.attrs[k]=v;}});
const draw=s=>{globalThis.document={createElement:node,createElementNS:(_,tag)=>node(tag)};const root=node('aside');renderYearPanel(root,s);const all=[],walk=n=>{all.push(n);n.children.forEach(walk);};walk(root);return {root,all,text:all.map(n=>n.textContent).filter(Boolean),by:c=>all.filter(n=>n.className.split(' ').includes(c)||n.attrs.class===c)};};
const person=(by,age,finance,more={})=>({stage:'review',intake:{birthYear:by},birth:{region:'samut-prakan'},age,finance:{available:0,reserve:0,debt:0,...finance},...more});

test('the drawn panel: rates below zero are drawn below zero, the years are labelled at the edges, and nothing nominal is said',()=>{
 const p=draw(person(1997,25,{debt:100000}));// 2022: prices outran both rates
 assert.ok(realRate('deposit',2022)<0&&realRate('lending',2022)<0);
 const zero=Number(p.by('year-zero')[0].attrs.d.split(' ')[1]),lastY=d=>Number(d.trim().split(' ').at(-1));
 assert.ok(zero<43,'the zero line has risen off the floor: '+zero);
 assert.ok(lastY(p.by('year-loans')[0].attrs.d)>zero&&lastY(p.by('year-savings')[0].attrs.d)>zero,'2022 sits below the zero line');
 assert.deepEqual(p.by('year-span')[0].children.map(n=>n.textContent),['2007','2022'],'left edge is fifteen years back');
 assert.deepEqual(draw(person(1955,30,{debt:100000})).by('year-span')[0].children.map(n=>n.textContent),['1970','1985'],'the edge is 1970 even though the record starts in 1976');
 assert.ok(p.text.includes('Loans')&&p.text.some(x=>/^−\d/.test(x)),'the key prints the negative rate');
 const calm=draw(person(1990,20,{}));// 2010, nothing owed, nothing saved
 assert.equal(calm.by('year-line').length,0,'no sentence about bank rates the person has no stake in');assert.equal(calm.root.hidden,false);assert.equal(calm.by('year-rates').length,1);
 assert.ok(!calm.text.some(x=>/A bank pays|Loans are/.test(x)));
});

test('the drawn panel hides when it has nothing of its own to say, and abroad shows only the person’s own figure',()=>{
 assert.equal(draw(person(1955,20,{})).root.hidden,true,'1975: a headline alone is already in the top bar');
 assert.equal(draw(person(2000,30,{})).root.hidden,true,'2030: no record');
 assert.equal(draw(person(1981,25,{reserve:50000},{finance:{available:0,reserve:50000,debt:0,region:'london'}})).root.hidden,true,'a saver in London earns no Thai interest and sees no Thai year');
 const owing=draw(person(1981,25,{},{finance:{available:0,reserve:0,debt:200000,region:'london'}}));
 assert.deepEqual(owing.text,['Interest on your debt over these five years, at a flat 35%: ฿70,000.']);assert.equal(owing.by('year-rates').length,0);assert.equal(owing.by('year-head').length,0);
 const late=draw(person(2000,25,{debt:100000}));// 2025: the year is on record, the five years ahead are not
 assert.ok(late.text.includes('Interest on your debt over these five years, at a flat 35%: ฿35,000.'));
});
