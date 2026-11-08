import test from 'node:test';
import assert from 'node:assert/strict';
import {begin, configureLife, live, newLife, projectedSkillGains, validate} from '../../dist/course/sim.js';

test('each featured birth year can preview and complete its first five-year review', () => {
  for (const year of [1949, 1981, 2000]) {
    const life = begin(configureLife(newLife(7), {birthYear:year}));
    assert.equal(life.age, 10);
    assert.doesNotThrow(() => projectedSkillGains(life), String(year));
    const next = live(life);
    assert.equal(next.age, 15);
    assert.ok(validate(next), String(year));
    const records = next.history.at(-1).events.filter(event => event.origin === 'era');
    assert.ok(records.length, String(year));
    for (const event of records) {
      assert.equal(event.year, year + event.age);
      assert.ok(event.text.trim());
    }
  }
});

test('the first household task fits the birth record and rejects another household’s task', async () => {
  const {pendingChildChoice, chooseChild} = await import('../../dist/course/childhood-choices.js');
  const original = configureLife(newLife(7), {birthYear:1949});
  for (const [home, task] of [['a rice-farming household','farm'],['a market-stall household','help'],['a home near the city','chores']]) {
    const life = {...original,birth:{...original.birth,home}};
    assert.deepEqual(pendingChildChoice(life,6).options.map(option => option.id), ['school',task,'ask']);
    assert.equal(chooseChild(life,6,task==='help'?'farm':'help'),life);
    assert.ok(validate(chooseChild(life,6,task)));
  }
});

test('stall dilemmas require an actual stall even within the same birth class', async () => {
  const {fits, pivotById} = await import('../../dist/course/pivots.js');
  const life = configureLife(newLife(7), {class:'working_class',birthYear:1949});
  for (const id of ['child-roof','child-sponsor','stall-paper','stall-takeover']) {
    const question = pivotById(id);
    assert.equal(fits(question,{...life,birth:{...life.birth,home:'a market-stall household'}}),true);
    assert.equal(fits(question,{...life,birth:{...life.birth,home:'a rice-farming household'}}),false);
  }
});

test('an answered tuition decision cannot open another free question at the same review', async () => {
  const {applyPivot, pendingPivots, pivotById} = await import('../../dist/course/pivots.js');
  const birth = configureLife(newLife(7), {class:'working_class',birthYear:1949});
  const state = {...begin(birth),age:20,cash:12000,birth:{...birth.birth,home:'a market-stall household'}};
  const resolved = applyPivot(state,pivotById('college-cost'),'work');
  assert.ok(resolved.cash>=18000);
  assert.deepEqual(pendingPivots(resolved),[]);
});
