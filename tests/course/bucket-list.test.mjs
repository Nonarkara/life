import test from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live,validate,flagsOf} from '../../dist/course/sim.js';
import {BUCKET_LIST,planBucket,addCustomBucket,bucketReason,bucketDue} from '../../dist/course/bucket-list.js';
import {openFinance,netWorth} from '../../dist/course/finance.js';
const teen=()=>openFinance({...begin(newLife(31)),age:15});
test('booking reserves actual money once and yields one matching ledger receipt',()=>{
 const s=teen(),next=planBucket(s,'coffee',17);assert.notEqual(next,s);assert.equal(netWorth(next.finance),netWorth(s.finance)-120);assert.equal(next.finance.receipts.filter(r=>r.kind==='bucket').length,1);assert.equal(planBucket(next,'coffee',17),next);assert.ok(validate(next));assert.ok(validate(JSON.parse(JSON.stringify(next))));
});
test('unfunded and over-time plans are rejected without partial changes',()=>{
 let s=teen();assert.equal(planBucket(s,'abroad',17),s);assert.equal(planBucket(s,'coffee',14),s);
 for(const key of ['park','library','rest','photos','comics','picnic','garden','art','music','language','sports','dance']){const n=planBucket(s,key,17);if(n!==s)s=n;}
 const spent=s.bucket.planned.reduce((n,r)=>n+r.days,0);assert.ok(spent<=30);assert.ok(s.finance.available>=0);assert.ok(validate(s));
});
test('custom fixed-purpose rules reject inherited keys and forged capabilities',()=>{
 const s=newLife(31);assert.equal(addCustomBucket(s,{title:'Bad kind',cost:0,days:1,kind:'constructor'}),s);assert.equal(planBucket(s,'constructor',6),s);
 const own=addCustomBucket(s,{title:'Make time',cost:0,days:2,kind:'rest'});assert.ok(validate(own));const forged=structuredClone(own);forged.bucket.custom[0].flag='married';assert.equal(validate(forged),false);
 const duplicate=structuredClone(own);duplicate.bucket.custom.push({...duplicate.bucket.custom[0]});assert.equal(validate(duplicate),false);
 const reserved=structuredClone(own);reserved.bucket.custom[0].key='park';assert.equal(validate(reserved),false);
});
test('free childhood plans alter real learning at the first recorded chapter',()=>{
 const before=newLife(31),planned=planBucket(before,'library',6),next=begin(planned);assert.ok(validate(next));assert.equal(next.skills.iq,before.skills.iq+1);assert.equal(next.bucket.planned.length,0);assert.equal(next.bucket.done.length,1);assert.deepEqual(flagsOf(next),{});
});
test('future activity is applied only in its due chapter and changes the projection',()=>{
 const s=teen(),planned=planBucket(s,'coffee',18);assert.equal(bucketDue(planned,17).records.length,0);const next=live(planned);assert.equal(next.bucket.done.length,1);assert.equal(next.bucket.planned.length,0);assert.ok(next.skills.eq>live(s).skills.eq);assert.ok(validate(next));
});
