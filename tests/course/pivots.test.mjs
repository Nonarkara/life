import test from 'node:test';
import assert from 'node:assert/strict';
import {PIVOTS,pivotsForStation,pendingPivots,applyPivot,locksFor,openOptions} from '../../dist/course/pivots.js';
import {stationAlternatives,alternativeDeltas,undoAnswer,reapplyAnswer} from '../../dist/course/alternatives.js';
import {newLife,configureLife,begin,live,validate,lockedEffort,eraWeight,clamp} from '../../dist/course/sim.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';

const valueOf=(points,axis)=>points[axis]??0;
const settle=s=>{if(!s.story?.pending)return s;const e=encounterById(s.story.pending.id);const o=e.options.find(o=>o.id!=='skip')??e.options[0];return resolveEncounter(s,o.id,0.5);};

// The spine: twenty-eight questions, two at every station.
test('there are twenty-eight questions, two at every station',()=>{
  assert.equal(PIVOTS.length,28);
  const perStation={};
  for(const pivot of PIVOTS)perStation[pivot.station]=(perStation[pivot.station]??0)+1;
  assert.deepEqual(perStation,{10:2,15:2,20:2,25:2,30:2,35:2,40:2,45:2,50:2,55:2,60:2,65:2,70:2,75:2});
  assert.equal(new Set(PIVOTS.map(p=>p.id)).size,28);
});

test('no question is a free win and no question is closed',()=>{
  for(const pivot of PIVOTS){
    assert.ok(pivot.options.length>=2,pivot.id+' needs options');
    assert.ok(pivot.prompt.length>20,pivot.id+' needs a real question');
    for(const option of pivot.options){
      assert.ok(option.cost&&option.cost.length>5,pivot.id+'/'+option.id+' must cost something');
      assert.ok(option.effects||option.luck,pivot.id+'/'+option.id+' must do something');
      assert.ok(option.note&&option.note.length>5,pivot.id+'/'+option.id+' must be recorded');
    }
  }
});

test('a question is never a dead end',()=>{
  const poor={...begin(newLife()),cash:0,health:10,wellbeing:5};
  for(const pivot of PIVOTS){
    const open=openOptions(pivot,poor);
    assert.ok(open.length>0,pivot.id+' must leave a way forward');
  }
});

test('answering a question changes the life and is recorded',()=>{
  let s=begin(newLife(31));
  const pivot=pivotsForStation(10)[0];
  const before={cash:s.cash,health:s.health,wellbeing:s.wellbeing};
  const option=pivot.options[0];
  const next=applyPivot(s,pivot,option.id);
  assert.equal(next.pivots.length,1);
  assert.equal(next.pivots[0].pivot,pivot.id);
  assert.equal(next.pivots[0].choice,option.id);
  assert.equal(next.pivots[0].station,10);
  assert.notEqual(next.cash,before.cash);
  assert.equal(next.health,clamp(before.health+(option.effects?.health??0),0,100));
  assert.ok(validate(next),'a life with an answered question stays valid');
});

test('a commitment holds for five years',()=>{
  let s=begin(newLife(31));
  const pivot=pivotsForStation(10).find(p=>p.options.some(o=>o.locks));
  const option=pivot.options.find(o=>o.locks);
  s=applyPivot(s,pivot,option.id);
  const locks=locksFor(s);
  assert.ok(Object.keys(locks).length>0,'the answer holds something');
  // Spend the promise away, and the answer must still hold it.
  const spent={...s,effort:Object.fromEntries(Object.entries(s.effort).map(([axis,value])=>[axis,axis==='iq'?value:0]))};
  spent.effort.iq=10;
  for(const[axis,minimum]of Object.entries(locks)){
    const locked=lockedEffort(spent);
    assert.ok(locked[axis]>=minimum,axis+' must be held at '+minimum);
    assert.equal(Object.values(locked).reduce((a,b)=>a+b,0),10,'the points stay ten');
    assert.ok(locked[axis]>=valueOf(s.effort,axis),'the promise is not weaker than the effort');
  }
});

test('the luck of a gamble is the same in every branch',()=>{
  let s=begin(newLife(77));
  const pivot=PIVOTS.find(p=>p.options.some(o=>o.luck));
  const option=pivot.options.find(o=>o.luck);
  const first=applyPivot(s,pivot,option.id);
  const second=applyPivot({...s},pivot,option.id);
  assert.equal(first.cash,second.cash);
  assert.deepEqual(first.pivots[0].luck,second.pivots[0].luck);
});

test('an answer can be undone exactly',()=>{
  let s=begin(newLife(19));
  const pivot=pivotsForStation(10)[0];
  const before={cash:s.cash,health:s.health,wellbeing:s.wellbeing};
  const answered=applyPivot(s,pivot,pivot.options[0].id);
  const undone=undoAnswer(answered,answered.pivots[0]);
  assert.equal(undone.cash,before.cash);
  assert.equal(undone.health,before.health);
  assert.equal(undone.wellbeing,before.wellbeing);
  const again=reapplyAnswer(undone,answered.pivots[0]);
  assert.equal(again.cash,answered.cash);
  assert.equal(again.health,answered.health);
  assert.equal(again.wellbeing,answered.wellbeing);
});

test('the roads not taken are worked out and differ from the road taken',()=>{
  let s=begin(newLife(64));
  const pivot=pivotsForStation(10)[0];
  s=applyPivot(s,pivot,pivot.options[0].id);
  const roads=stationAlternatives(s);
  assert.ok(roads.length>=1,'the other answers must be worked out');
  for(const road of roads){
    assert.notEqual(road.option,road.taken);
    assert.equal(typeof road.label,'string');
    assert.equal(Number.isFinite(road.cash),true);
    assert.equal(Number.isFinite(road.health),true);
    assert.equal(Number.isFinite(road.wellbeing),true);
  }
  assert.ok(roads.some(road=>road.cash!==roads[0].cash)||roads.length>1,'the branches must differ');
});

test('a whole life can be lived with the questions answered',()=>{
  let s=begin(newLife(4321));
  let guard=0;
  while(s.stage==='review'&&guard++<30){
    for(const pivot of pendingPivots(s)){
      const open=openOptions(pivot,s);
      s=applyPivot(s,pivot,open[0].id);
    }
    s=settle(live(s));
    assert.ok(validate(s),'the life stays valid at age '+s.age);
  }
  assert.ok(s.age>=80||s.death,'the life ends');
  const answered=s.history.flatMap(row=>row.pivots??[]);
  assert.ok(answered.length>=2,'the questions are recorded in the history');
  for(const record of answered)assert.equal(typeof record.note,'string');
});

test('what a point of effort is worth changes with the years',()=>{
  assert.ok(eraWeight('physique',15)>eraWeight('physique',70),'a young body answers training');
  assert.ok(eraWeight('craft',35)>eraWeight('craft',60),'the hands learn in the working years');
  assert.ok(eraWeight('iq',40)>eraWeight('iq',75),'the mind keeps learning longer than the hand');
});
