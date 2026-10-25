import {test} from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live,goals} from '../../dist/course/sim.js';
import {purpose,purposeRecord} from '../../dist/course/purpose.js';
import {resolveEncounter} from '../../dist/course/encounters.js';
test('purpose has no invented childhood or legacy score and planning changes cannot rewrite it',()=>{
 const initial=newLife(55);assert.equal(purpose(initial).index,null);
 const next=live({...begin(initial),profile:{...initial.profile,focus:'growth'}}),s=resolveEncounter(next,'together',.5),before=JSON.stringify(s);
 const actual=purpose(s);assert.equal(actual.eligible,1);assert.equal(actual.met,1);
 assert.deepEqual(purpose({...s,profile:{...s.profile,focus:'recognition'},effort:{physique:10,iq:0,eq:0,craft:0,drive:0}}),actual);
 assert.equal(JSON.stringify(s),before);
});
test('social purpose needs an actual eligible resolved record, never a pending invitation',()=>{
 const s=live({...begin(newLife(55)),profile:{...newLife(55).profile,focus:'connection'}}),row=s.history.at(-1);
 assert.equal(purposeRecord({...s,story:{seen:[]}},row),null);
 assert.equal(purposeRecord({...s,story:{pending:{age:row.age},seen:[{age:row.age,id:'friend',choice:'together'}]}},row),null);
 assert.equal(purposeRecord({...s,story:{seen:[{age:row.age,id:'friend',choice:'together'}]}},row).met,true);
 assert.equal(purposeRecord({...s,story:{seen:[{age:row.age,id:'friend',choice:'home'}]}},row).met,false);
});
test('growth includes athletic and emotional practice when those are the recorded life direction',()=>{
 const state={story:{seen:[]},history:[]};
 const mapping={sport:'physique',connection:'eq',art:'craft',security:'drive',balance:'iq'};
 assert.deepEqual(Object.keys(mapping).sort(),Object.keys(goals).sort());
 for(const [aim,key]of Object.entries(mapping)){
  const row={from:25,age:30,profile:{focus:'growth',aim},effort:{physique:0,iq:0,eq:0,craft:0,drive:0}};
  assert.equal(purposeRecord(state,row).met,false);row.effort[key]=2;
  assert.equal(purposeRecord(state,row).met,true);
 }
});
test('security recognizes actual debt repayment, without requiring savings or wealth',()=>{
 const row={from:20,age:25,profile:{focus:'security'},finance:{debt:0}},state={history:[{age:20,finance:{debt:1000}},row],finance:{receipts:[{kind:'period',age:25,income:5000,essential:4000,saved:0}]}};
 const result=purposeRecord(state,row);assert.equal(result.met,true);assert.equal(result.records[0].repaid,1000);
 state.finance.receipts[0].income=3000;assert.equal(purposeRecord(state,row),null);
});
