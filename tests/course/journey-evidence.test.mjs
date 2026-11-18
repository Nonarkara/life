import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCV} from '../../dist/course/cv.js';
import {scoreLife} from '../../dist/course/life-collection.js';
import {newLife,begin} from '../../dist/course/sim.js';
import {planBucket,bucketDue} from '../../dist/course/bucket-list.js';

test('journey set scoring accumulates each addition and supports parallel sets',()=>{
 const base=newLife(12),ids=['s_huahin','h_inthanon','t_suthep','m_soi'];
 assert.deepEqual([0,1,2,3,4].map(n=>scoreLife({...base,stops:ids.slice(0,n).map((id,i)=>({id,age:20+i*5}))}).setBonus),[0,1,4,9,16]);
 assert.equal(scoreLife({...base,stops:[...ids,'s_samui','h_maehong'].map((id,i)=>({id,age:15+i*5}))}).setBonus,20);
});

test('CV never credits a refused proposal as partnership',()=>{
 const base={history:[],story:{seen:[{id:'commitment',choice:'decline',age:30}]}};
 assert.equal(buildCV(base).length,0);
 for(const choice of ['marry','together','apart'])assert.equal(buildCV({...base,story:{seen:[{id:'commitment',choice,age:30}]}}).length,1);
});

test('time and money become CV experience only after the activity happens',()=>{
 const initial=begin(newLife(12));
 const state={...initial,age:15,stage:'review',story:{...initial.story,pending:null}};
 const planned=planBucket(state,'library',17);
 assert.equal(planned.bucket.planned.length,1);
 assert.equal(buildCV(planned).filter(e=>e.kind==='experiences').length,0);
 const due=bucketDue(planned,20),done={...planned,bucket:due.bucket};
 const entries=buildCV(done).filter(e=>e.kind==='experiences');
 assert.equal(entries.length,1);
 assert.equal(entries[0].days,1);
 assert.equal(entries[0].cost,0);
 assert.equal(entries[0].from,17);
 assert.equal(due.skills.iq,1,'completed library day really adds knowledge');
 assert.equal(entries[0].evidence[0].id,planned.bucket.planned[0].id);
 assert.deepEqual(buildCV(JSON.parse(JSON.stringify(done))),buildCV(done),'receipt survives save reload');
 const before=JSON.stringify(done);buildCV(done);assert.equal(JSON.stringify(done),before,'reading does not mutate the life');
});
