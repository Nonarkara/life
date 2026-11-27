import assert from 'node:assert/strict';
import {test} from 'node:test';
import {crisisRecord} from '../../dist/course/crisis-chapter.js';
import {julyDemoStart} from '../../dist/course/july-demo.js';
import {applyPivot,pendingPivots} from '../../dist/course/pivots.js';
import {live,validate} from '../../dist/course/sim.js';

test('July episode applies its renewed household promise and its fictional wage changes once',()=>{
 const start=julyDemoStart();
 assert.ok(validate(start));
 assert.equal(start.age,20);
 assert.deepEqual(pendingPivots(start).map(q=>q.id),['job-1996-20']);

 const branches={};
 for(const job of ['move','stay'])for(const promise of ['pay','time']){
  const offered=applyPivot(start,pendingPivots(start)[0],job);
  const ready=applyPivot(offered,pendingPivots(offered)[0],promise);
  assert.deepEqual(pendingPivots(ready),[]);
  const end=live(ready);
  const record=crisisRecord(end);
  assert.ok(validate(end));
  assert.equal(end.age,25);
  assert.equal(end.story.pending,null);
  assert.deepEqual(pendingPivots(end),[]);
  assert.equal(end.finance.receipts.filter(r=>r.id==='period:20-25').length,1);
  assert.equal(record.householdPayment,promise==='pay'?1800:0);
  assert.equal(record.age,22);
  assert.equal(end.history.at(-1).effort.eq,promise==='pay'?0:2);
  branches[job+promise]=end.history.at(-1);
 }
 for(const promise of ['pay','time']){
  const move=branches['move'+promise],stay=branches['stay'+promise];
  const record=move.events.find(event=>event.origin==='crisis');
  assert.ok(record.wagePremium>0&&record.wageChange<0);
  assert.equal(move.setback-stay.setback,-record.wagePremium-record.wageChange);
 }
});
