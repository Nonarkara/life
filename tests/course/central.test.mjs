import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync} from 'node:fs';
import {REGIONS,CLASS_REGIONS} from '../../dist/course/regions.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {townPlan} from '../../dist/course/diorama-plan.js';
import {createRegionScenery} from '../../dist/course/region3d.js';
// Central Thailand from research/provinces/central.json. Nakhon Sawan and Samut Prakan were births
// already and Bangkok is its districts; Yaowarat comes from the Bangkok record's Chinatown household.
const C=JSON.parse(readFileSync(new URL('../../research/provinces/central.json',import.meta.url)));
const central=Object.keys(REGIONS).filter(id=>REGIONS[id].central);
const recordOf=id=>id==='yaowarat'?C.find(p=>p.id==='bangkok'):C.find(p=>p.id===id);
test('every province in the Central record is a birthplace, and its link opens there',()=>{
 assert.deepEqual(central.sort(),[...C.map(p=>p.id).filter(id=>!['bangkok','nakhon-sawan','samut-prakan'].includes(id)),'yaowarat'].sort());
 for(const id of central)for(const cls of REGIONS[id].class){
  assert.ok(recordOf(id).households.some(h=>h.class===cls),id+' '+cls+' is in its record');
  assert.ok(CLASS_REGIONS[cls].includes(id));
  const life=begin(configureLife(newLife(11),{class:cls,sex:'female',birthYear:1981,region:id})),code=encodeBirth(life);
  assert.equal(life.birth.region,id);assert.equal(decodeBirth(code)?.birth.region,id,code);
 }
});
// Mutation-checked: drawing the Chao Phraya Dam in 1956 fails this.
test('the Chao Phraya Dam stands from 1957, never before',()=>{
 const dam=year=>{const by=1955,age=year-by;let s,seed=7;do s=begin(configureLife(newLife(seed++),{class:'low_class',sex:'male',birthYear:by,region:'chai-nat'}));while(s.birth.moves);
  const groups=[],scene=new T.Scene();createRegionScenery({scene,registerBuilding:g=>groups.push(g)}).update(townPlan({...s,age},age));
  return groups.map(g=>new T.Box3().setFromObject(g)).some(b=>b.min.x>14.1&&b.min.x<14.4&&b.min.z>4.1&&b.min.z<4.3);};
 assert.ok(!dam(1956));assert.ok(dam(1957));
});
