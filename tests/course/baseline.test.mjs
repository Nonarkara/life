import test from 'node:test';
import assert from 'node:assert/strict';
import {unchosenLife,baselineComparison} from '../../dist/course/baseline.js';
import {newLife,begin,live,balanced,defaultProfile,configureLife} from '../../dist/course/sim.js';

// The life you did not choose must be the same world with no decisions in it.
test('the unchosen life starts from the same birth',()=>{
  const seed=43127;
  const life=newLife(seed),started=begin(life);
  const other=unchosenLife({...started,seed});
  assert.equal(other.seed,seed);
  assert.equal(other.age>=10,true);
  assert.equal(other.birth.place,started.birth.place);
  assert.equal(other.birth.home,started.birth.home);
  assert.equal(other.birth.household,started.birth.household);
});

test('the unchosen life spends every station in the default shape',()=>{
  const started=begin(newLife(90210));
  const other=unchosenLife({...started,seed:90210});
  assert.ok(other.history.length>0);
  for(const row of other.history){
    if(row.age<15)continue;
    assert.deepEqual(row.effort,balanced(),'age '+row.age+' was not the default shape');
    assert.equal(row.profile.aim,'balance');
  }
});

test('the unchosen life advances in the same five-year stations',()=>{
  const started=begin(newLife(7711));
  const other=unchosenLife({...started,seed:7711});
  const ages=other.history.filter(row=>row.age>=10).map(row=>row.age);
  assert.deepEqual(ages,ages.slice().sort((a,b)=>a-b));
  for(let i=1;i<ages.length;i++)assert.equal(ages[i]-ages[i-1],5);
});

test('the comparison lines up station by station',()=>{
  const started=begin(newLife(4242));
  let life={...started,seed:4242};
  life=live({...life,effort:balanced(),profile:defaultProfile()});
  life=live({...life,effort:balanced(),profile:defaultProfile()});
  const comparison=baselineComparison(life);
  assert.ok(comparison.rows.length>=2);
  for(const row of comparison.rows){
    assert.equal(typeof row.cash,'number');
    assert.equal(typeof row.unchosenCash,'number');
    assert.equal(row.age>=10,true);
  }
  const last=comparison.rows.at(-1);
  assert.equal(comparison.delta.cash,last.cash-last.unchosenCash);
  assert.equal(comparison.delta.health,last.health-last.unchosenHealth);
  assert.equal(comparison.delta.wellbeing,last.wellbeing-last.unchosenWellbeing);
});

test('a chosen life is not the same as the unchosen one',()=>{
  const seed=555;
  const started=begin(newLife(seed));
  let life={...started,seed};
  life=live({...life,effort:{physique:10,iq:0,eq:0,craft:0,drive:0},profile:defaultProfile()});
  const comparison=baselineComparison(life);
  const last=comparison.rows.at(-1);
  assert.notEqual(last.health,last.unchosenHealth);
});

test('the comparison survives an intake life',()=>{
  const started=configureLife(newLife(2024),{sex:'female',upbringing:'constrained'});
  const begun=begin(started);
  const comparison=baselineComparison(begun);
  assert.equal(comparison.rows.length>0,true);
  assert.equal(comparison.rows[0].age,10);
});
