import test from 'node:test';import assert from 'node:assert/strict';
import {homeCast} from '../../dist/course/presentation-state.js';
import {showPaintedCanvas} from '../../dist/course/scene3d.js';
import {autoInvest,holdingsOf,tradeFee} from '../../dist/course/investments.js';
import {netWorth,validFinance} from '../../dist/course/finance.js';
import {createEconomy} from '../../dist/course/economy.js';

test('moved-out home casting follows effective residence without moving the parents or rewriting childhood',()=>{
 const s={age:35,finance:{housing:'near',workplace:'city',locationSince:30},history:[{age:25,from:20,pathway:'work',finance:{housing:'family',workplace:'local',locationSince:20}},{age:35,from:30,pathway:'work'}]};
 const ids=age=>homeCast(s,age,1,'balance').map(p=>p.id);
 assert.deepEqual(ids(25),['player','mother','father']);assert.deepEqual(ids(35),['player']);assert.deepEqual(ids(12),['player','mother','father']);
 assert.deepEqual(homeCast({...s,finance:{housing:'family',workplace:'local',locationSince:30}},35,26,'balance').map(p=>p.id),['player']);
});
test('painted visibility handoff reveals original canvas without demanding DOM or WebGL creation',()=>{
 const canvas={hidden:true};showPaintedCanvas(canvas);assert.equal(canvas.hidden,false);showPaintedCanvas(canvas);assert.equal(canvas.hidden,false);
});
test('reserve-only automatic investing funds both holdings within the budget including fees',()=>{
 for(const reserve of [399,400,402,1000,10000]){
 const finance={version:1,openedAt:15,available:0,reserve,debt:0,housing:'family',budget:{save:20,fun:10,learn:10},receipts:[{id:'opening:15',age:15,kind:'opening',income:reserve,expense:0,change:reserve}],purchases:[]};
 const s={age:20,stage:'review',economy:createEconomy(3),finance,history:[{age:20,finance:{available:0,reserve,debt:0}}],story:{flags:{invests:15},pending:null}};
 const next=autoInvest(s),h=holdingsOf(next.finance);assert.equal(h.bond.value,h.equity.value);
 if(reserve>=402){assert.ok(h.bond.value>=200);assert.equal(next.finance.receipts.filter(r=>r.kind==='trade').length,2);assert.equal(netWorth(next.finance),reserve-2*tradeFee(h.bond.value));}
 else assert.equal(next,s);
 assert.ok(next.finance.available>=0);assert.ok(validFinance(next.finance,20));
 }
});

test('a finite painted journey never reveals a gap or needs an unmatched repeated edge',async()=>{
 const {travelFrame}=await import('../../dist/course/painted-camera.js');
 const {samplePath}=await import('../../dist/course/routines.js');assert.equal(samplePath([[0,0],[3,4]],.5).progress,.5);
 for(const [width,height] of [[390,250],[1024,500],[1440,560]])for(const returning of [false,true])for(let p=0;p<=1;p+=.01){
  const r=travelFrame(width,height,1760,982,p,returning);
  assert.ok(r.x<=1e-8&&r.x+r.drawWidth>=width-1e-8);assert.ok(r.y<=1e-8&&r.y+r.drawHeight>=height-1e-8);
 }
 const a=travelFrame(390,400,1760,982,1),b=travelFrame(390,400,1760,982,0,true);assert.deepEqual(a,b);
});
