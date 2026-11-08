import test from 'node:test';import assert from 'node:assert/strict';
import {newLife,newLegacyLife,begin,live,configureLife} from '../../dist/course/sim.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {lifeReading,decisionsOf,deathFacts,sameBirth,otherRoads,relive,READING_KEYS} from '../../dist/course/life-reading.js';
import {phrases} from '../../dist/course/translations.js';
const play=seed=>{let s=begin(newLife(seed*7919));while(s.stage==='review'&&s.age<80){s=live(s);if(s.stage!=='review')break;for(const p of pendingPivots(s)){const os=openOptions(p,s),o=os[seed%os.length];if(o)s=applyPivot(s,p,o.id);}const ps=s.story?.pending;if(ps){const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,os[seed%os.length].id,.2);}}return s;};
test('the reading only counts what the record holds',()=>{
 for(let seed=1;seed<=12;seed++){
  const s=play(seed),r=lifeReading(s);if(!r)continue;
  const recorded=s.story.seen.length+s.history.flatMap(h=>h.pivots??[]).length;
  assert.equal(r.decisions,recorded);assert.ok(r.moneyRose<=r.chapters&&r.wellRose<=r.chapters);
  for(const k of ['money','peace','body'])assert.ok(r.guarded[k]<=r.decisions);
  assert.ok(r.turning.length<=3);const said=decisionsOf(s).map(d=>d.said);for(const x of r.turning)assert.ok(said.includes(x.said));
  const o=r.others;assert.ok(o.reachedSame>=0&&o.reachedSame<=100&&o.alive<=100&&o.richer<=100&&o.happier<=100);
  if(s.death){assert.ok(s.death.chance<=s.death.odds&&s.death.odds<=1&&s.death.odds>0);}
 }
});
test('nobody is named who was not in the life',()=>{
 const s=play(3),clean={...s,pivotFlags:{},story:{...s.story,flags:{}}};assert.deepEqual(lifeReading(clean).people,[]);
 const friend={...clean,story:{...clean.story,flags:{friend:15}}};assert.deepEqual(lifeReading(friend).people,[[s.story.people.friend,15,null]]);
});
test('every line of the reading exists in all four languages with its blanks intact',()=>{
 const rows=new Map(phrases.map(r=>[r[0],r])),blanks=s=>(s.match(/\{\w+\}/g)??[]).sort().join();
 for(const k of READING_KEYS){const r=rows.get(k);assert.ok(r&&r.length===5,k);for(const v of r.slice(1))assert.equal(blanks(v),blanks(k),k+' / '+v);}
});
test('the stated odds follow the rolled formula',()=>{
 assert.deepEqual(deathFacts({odds:.2,chance:.05,smoker:false}),{odds:5,clear:20,worn:true,clean:null});
 assert.equal(deathFacts({odds:.05,chance:.05}).worn,false);
 assert.equal(deathFacts({odds:.13,chance:.13,smoker:true}).clean,10);
});
test('other lives share the birth, including lives without a class',()=>{
 const legacy=newLegacyLife(4242),other=sameBirth(legacy,3);assert.deepEqual(other.birth,legacy.birth);assert.notEqual(other.seed,legacy.seed);
 const classed=newLife(4242);assert.deepEqual(sameBirth(classed,3).birth,classed.birth);
});
test('nobody counted alive at your age died by then',()=>{
 for(const seed of [3,8,34]){const r=lifeReading(play(seed)).others;assert.equal(r.alive,r.reachedSame);}
});
test('the other road is the same birth with one answer changed',()=>{
 for(const seed of [3,5,7,9]){const s=play(seed),r=otherRoads(s);if(!r)continue;assert.ok(r.roads.length>=1&&r.roads.length<=2);for(const x of r.roads){assert.ok(Number.isFinite(x.money));assert.ok(x.memories.every(m=>m.age>=r.age));assert.ok(x.age<=80);}}
 const s=play(3),life=relive(s,'__none__','__none__');assert.deepEqual(life.birth,s.birth);assert.equal(life.seed,s.seed);
});
