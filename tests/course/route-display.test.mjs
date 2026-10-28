import test from 'node:test';
import assert from 'node:assert/strict';
import {newLife,begin} from '../../dist/course/sim.js';
import {drawRouteMap,routeModel} from '../../dist/course/routemap.js';
test('route display ends at the recorded age, including a non-decade endpoint',()=>{
 for(const age of [10,55,80]){
  const labels=[],state={...begin(newLife(17)),age};
  const c=new Proxy({fillText:text=>labels.push(text),measureText:text=>({width:text.length*6})},{get:(o,k)=>k in o?o[k]:()=>{}});
  const canvas={width:0,height:0,getContext:()=>c};const before=JSON.stringify(routeModel(state));
  drawRouteMap(canvas,state,{width:600,height:164});
  const ticks=labels.filter(s=>/^\d+$/.test(s)).map(Number);
  assert.equal(Math.max(...ticks),age);assert.ok(ticks.includes(age));
  assert.equal(JSON.stringify(routeModel(state)),before,'drawing must preserve places, moves and marks');
 }
});
test('compact route view retains a sharp backing resolution without changing logical dimensions',()=>{
 const c=new Proxy({measureText:text=>({width:text.length*6})},{get:(o,k)=>k in o?o[k]:()=>{}}),canvas={width:0,height:0,getContext:()=>c};
 drawRouteMap(canvas,begin(newLife(17)),{width:600,height:164,dpr:2});
 assert.equal(canvas.width,1200);assert.equal(canvas.height,328);
});
