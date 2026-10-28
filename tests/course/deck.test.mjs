import test from 'node:test';import assert from 'node:assert/strict';
import {deckFinance,deckHistory} from '../../dist/course/deck-model.js';
import {newLife,begin} from '../../dist/course/sim.js';
import {drawDeck} from '../../dist/course/life-deck.js';
import {translate} from '../../dist/course/i18n.js';
const state=()=>({...begin(newLife(17)),age:20,pathway:'work',finance:{available:10000,reserve:20000,debt:0,holdings:{equity:{value:900000,basis:900000}},housing:'family',budget:{save:20,fun:10,learn:10}},history:[{age:20,finance:{income:0,essential:12000}}]});
test('cash runway excludes fund holdings and uses current essentials, without mutating state',()=>{
 const s=state(),before=JSON.stringify(s),d=deckFinance(s);assert.equal(d.liquid,30000);assert.equal(d.runway,Math.floor(30000/d.essential));assert.equal(d.holdings,900000);assert.equal(JSON.stringify(s),before);
 assert.equal(deckFinance({...s,finance:{...s.finance,holdings:{}}}).runway,d.runway);
});
test('monthly plan balances and responds to budgets without labeling funds or residual as saved',()=>{
 const s=state(),d=deckFinance(s);assert.equal(d.income,d.essential+d.repayment+d.fun+d.learn+d.saved+d.lifestyle+d.unallocated);
 assert.equal(d.saved,Math.floor((d.income-d.essential)*.2));assert.ok(!d.items.some(([k])=>k==='In funds'));
 const next=deckFinance({...s,finance:{...s.finance,budget:{save:30,fun:5,learn:10}}});assert.ok(next.saved>d.saved);assert.ok(next.fun<d.fun);
});
test('debt and constrained student shortfall stay explicit; a zero-income historical record never hides the plan',()=>{
 const s=state(),debt=deckFinance({...s,finance:{...s.finance,debt:1000000}});assert.equal(debt.saved,0);assert.ok(debt.repayment>0);
 const student=deckFinance({...s,pathway:'college',intake:{upbringing:'constrained'},finance:{...s.finance,housing:'near'}});assert.ok(student.shortfall>0);assert.equal(student.saved,0);assert.ok(student.items.some(([k])=>k==='Monthly shortfall'));assert.ok(deckFinance(s));
});
test('elapsed chart keeps signed observations and absent records distinct',()=>{
 const d=deckHistory({age:15,history:[{age:0,health:0},{age:10,health:1},{age:40,health:99}]},'health');assert.equal(d.age,15);assert.deepEqual(d.records,[{age:0,value:0},{age:10,value:1}]);
 const debt=deckHistory({age:15,history:[{age:15,finance:{available:0,reserve:0,debt:5000}}]},'worth');assert.equal(debt.min,-5000);assert.equal(debt.records[0].value,-5000);assert.equal(debt.max,0);
});
class Node{constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.dataset={};this.style={};}append(...n){this.children.push(...n);}prepend(n){this.children.unshift(n);}replaceChildren(...n){this.children=n;}setAttribute(k,v){this.attrs[k]=String(v);}querySelector(){return null;}}
const all=n=>[n,...n.children.filter(c=>c instanceof Node).flatMap(all)];
test('actual deck renders zero unlit, negative wealth signed, six panels and one edit pair',()=>{
 const previous=globalThis.document;globalThis.document={getElementById:()=>null,querySelector:()=>null,createElement:t=>new Node(t),createElementNS:(_,t)=>new Node(t),activeElement:null};
 try{const root=new Node('div'),s={age:15,history:[{age:15,health:0,finance:{available:0,reserve:0,debt:5000}}]},args={channels:[{label:'Physique',value:'3',detail:'+2',detailLabel:'By age 20',can:()=>true,step:()=>{}}],aim:'balance',setAim(){},status:[],money:{bar:[],items:[]},ikigai:{score:50,parts:[]}};
 drawDeck(root,s,args);assert.equal(root.children.length,6);assert.equal(all(root).filter(n=>n.attrs.class==='on').length,0);assert.ok(!all(root).some(n=>n.tag==='span'&&n.textContent==='80'));
 const wealth=all(root).find(n=>n.dataset.deck==='Show Wealth');wealth.onclick();assert.ok(all(root).some(n=>n.attrs.class==='on negative'));assert.ok(all(root).find(n=>n.tag==='svg').attrs['aria-label'].includes('-5,000'));
 }finally{globalThis.document=previous;}
});
test('new deck qualifiers and dynamic edit names have all five-language copies',()=>{
 for(const lang of ['th','zh-CN','ja','ko'])for(const text of ['1 month','Monthly plan','Current plan · baht / month','Cash runway','Funds held','Cash left over','Monthly shortfall','Debt repayment','Recorded values','0–100 · eight display bands','Lower {axis}','Raise {axis}','Cash runway uses cash and reserve at current essential spending; funds excluded.'])assert.notEqual(translate(text,lang),text,lang+': '+text);
});
test('only reviewed male frames are published, and the allowlist is what the manifest holds',async()=>{
 const {readFileSync}=await import('node:fs');const manifest=JSON.parse(readFileSync(new URL('../../dist/course/anime/manifest.json',import.meta.url)));
 const reviewed=['stand-a','stand-b','walk-a','walk-b'];
 assert.deepEqual(Object.keys(manifest.sprites['player-m']).sort(),reviewed);
 const approval=JSON.parse(readFileSync(new URL('../../art/frame-approvals.json',import.meta.url)));assert.deepEqual(approval['player-m'].sort(),reviewed);
 for(const path of Object.values(manifest.sprites['player-m']))assert.ok(readFileSync(new URL('../../dist/course/anime/'+path,import.meta.url)).length>100);
});
test('cash-runway help accompanies its reading and does not appear on a childhood status panel',()=>{
 const previous=globalThis.document;globalThis.document={getElementById:()=>null,querySelector:()=>null,createElement:t=>new Node(t),createElementNS:(_,t)=>new Node(t),activeElement:null};
 try{
  const root=new Node('div'),s={age:10,history:[]},args={channels:[{label:'Physique',value:'2',detail:'+2',detailLabel:'By age 15',can:()=>true,step(){}}],aim:'balance',setAim(){},status:[['Health','90 / 100'],['Mood','65 / 100']]};
  drawDeck(root,s,args);assert.ok(!all(root).some(n=>n.attrs['aria-label']==='Cash runway'));
  drawDeck(root,s,{...args,status:[...args.status,['Cash runway','3 months']]});assert.ok(all(root).some(n=>n.attrs['aria-label']==='Cash runway'));
 }finally{globalThis.document=previous;}
});
