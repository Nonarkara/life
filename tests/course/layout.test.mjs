import {test} from 'node:test';import assert from 'node:assert/strict';import {routes,walk,blocked} from '../../dist/course/layout.js';
test('both complete parent walks clear all room furniture and stay on floor',()=>{for(const r of Object.values(routes))for(let i=0;i<1000;i++){const p=walk(i/100,r);assert.ok(!blocked(p),JSON.stringify(p)+' intersects furniture');assert.ok(p.every(v=>v-.12>=3&&v+.12<=7));}});
test('guard detects original father route through desk',()=>{const old={x:6.2,y:4,w:.45,d:.35};assert.ok(Array.from({length:100},(_,i)=>walk(i/100,old)).some(p=>blocked(p)));});
