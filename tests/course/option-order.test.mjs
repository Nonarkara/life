import {test} from 'node:test';import assert from 'node:assert/strict';
import {inWorldOrder} from '../../dist/course/option-order.js';
test('each world shows its own stable order and never loses an option',()=>{
 const list=['a','b','c','d'],firsts=new Set();
 for(let seed=1;seed<=40;seed++){const o=inWorldOrder(list,seed,'q20');assert.deepEqual([...o].sort(),list);assert.deepEqual(o,inWorldOrder(list,seed,'q20'));firsts.add(o[0]);}
 assert.equal(firsts.size,4,'every option leads in some world');
 assert.deepEqual(list,['a','b','c','d']);
});
