import test from 'node:test';
import assert from 'node:assert/strict';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {fortune,fortuneShape} from '../../dist/course/life-choices.js';
const on=(seed,cls,route,birthYear,age,skills)=>{const s=begin(configureLife(newLife(seed),{class:cls,sex:'female',birthYear}));return {...s,age,...(skills?{skills:{...s.skills,...skills}}:{}),story:{...s.story,flags:{...s.story?.flags,['r_'+route+'_1']:15}}};};
// Stage work: most stay small, a few break out. Without the break-out, every dancer ends on one salary line.
test('a few painters break out and most stay small',()=>{
 const f=Array.from({length:200},(_,i)=>fortune(on(i+1,'working_class','painter',1981,30)));
 assert.equal(fortuneShape(on(1,'working_class','painter',1981,30)),'star');
 const big=f.filter(x=>x>=2.5).length,small=f.filter(x=>x<1).length;
 assert.ok(big>=5&&big<=60,'break-outs '+big);assert.ok(small>=100,'small '+small);
});
test('practice on the stage raises the odds of breaking out',()=>{
 const n=sk=>Array.from({length:200},(_,i)=>fortune(on(i+1,'working_class','painter',1981,30,sk))).filter(x=>x>=2.5).length;
 assert.ok(n({craft:40,physique:40})>n({craft:0,physique:0}));
});
test('a civil servant climbs a ladder',()=>{
 const at=a=>fortune(on(9,'bureaucratic_class','kharatchakan',1981,a));
 assert.equal(fortuneShape(on(9,'bureaucratic_class','kharatchakan',1981,30)),'ladder');
 assert.ok(at(50)>at(25)*1.3);
});
test('two lives on no route still differ in fortune',()=>{
 const f=Array.from({length:50},(_,i)=>fortune({seed:i+1,age:40,skills:{}}));
 assert.ok(Math.max(...f)/Math.min(...f)>1.8);
});
import {careerFactor} from '../../dist/course/life-choices.js';
import {grossMonthlyPay} from '../../dist/course/finance.js';
import {fortuneTurn} from '../../dist/course/life-choices.js';
import {readFileSync,readdirSync} from 'node:fs';
test('pay carries the fortune, and no spike reaches the pension',()=>{
 const lives=Array.from({length:200},(_,i)=>on(i+1,'working_class','painter',1981,30));
 const hit=lives.find(s=>fortune(s)>=2.5);assert.ok(hit,'a break-out exists');
 assert.ok(careerFactor(hit)>=2.5,'careerFactor includes fortune');
 const t=on(7,'middle_class','trader',1970,40),pension=grossMonthlyPay({...t,age:65}),peak=Math.max(...lives.map(s=>grossMonthlyPay({...s,age:59})));
 assert.equal(fortuneShape(t),'trade');assert.ok(pension<=grossMonthlyPay({...t,age:59})*.41&&grossMonthlyPay({...hit,age:59})<grossMonthlyPay(hit),'spike gone by 59');assert.ok(peak<1e5);
 const rich=Array.from({length:300},(_,i)=>on(i+1,'middle_class','trader',1970,40)).find(x=>fortune(x)>=4);assert.ok(rich,'a trade fortune exists');
 assert.ok(fortune({...rich,age:59})<2,'trade fortune ends before the pension');
});
test('a break-out is told in the five years it starts',()=>{
 const lines=Array.from({length:200},(_,i)=>on(i+1,'working_class','painter',1981,20)).flatMap(s=>[25,30,35,40,45].map(a=>fortuneTurn({...s,age:a},a))).filter(Boolean);
 assert.ok(lines.includes('Your name started to sell tickets.'));assert.ok(lines.includes('The crowds moved on to someone younger.'));
});
test('every death cause and turn line the game can write is translated',()=>{
 const dir=new URL('../../dist/course/',import.meta.url),tr=readdirSync(dir).filter(f=>f.endsWith('.js')).map(f=>readFileSync(new URL(f,dir),'utf8')).join('\n'),src=readFileSync(new URL('../../dist/course/sim.js',import.meta.url),'utf8')+readFileSync(new URL('../../dist/course/life-choices.js',import.meta.url),'utf8');
 const lines=[...src.matchAll(/'((?:[A-Z][^']*?)(?:ended this life|reached zero|wore out your [a-z]+|caught up with your lungs|at home|sell tickets|someone younger|could spend it)\.)'/g)].map(m=>m[1]);
 assert.ok(lines.length>=12,'found '+lines.length);
 for(const l of lines)assert.ok(tr.split('\n').some(r=>r.startsWith(l+'|')&&r.split('|').length===5||r.includes("['"+l+"','")),'untranslated: '+l);
});
