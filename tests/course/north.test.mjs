import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync} from 'node:fs';
import {REGIONS,CLASS_REGIONS} from '../../dist/course/regions.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {townPlan} from '../../dist/course/diorama-plan.js';
import {createRegionScenery} from '../../dist/course/region3d.js';
// The North's nine provinces come from research/provinces/north.json: every one is a birthplace of
// the classes its record names, a shared link opens in it, and a dated landmark never appears early.
const NORTH=JSON.parse(readFileSync(new URL('../../research/provinces/north.json',import.meta.url)));
const north=Object.keys(REGIONS).filter(id=>REGIONS[id].lanna);
test('every province in the North record is a birthplace, and its link opens there',()=>{
 assert.deepEqual(north.sort(),NORTH.map(p=>p.id).sort());
 for(const id of north)for(const cls of REGIONS[id].class){
  assert.ok(NORTH.find(p=>p.id===id).households.some(h=>h.class===cls),id+' '+cls+' is in its record');
  assert.ok(CLASS_REGIONS[cls].includes(id));
  const life=begin(configureLife(newLife(11),{class:cls,sex:'female',birthYear:1981,region:id})),code=encodeBirth(life);
  assert.equal(life.birth.region,id);assert.equal(decodeBirth(code)?.birth.region,id,code);
 }
});
// Mutation-checked: drawing Wat Rong Khun or the kilns one year early fails this.
test('Wat Rong Khun stands from 1997 and Lampang\'s kilns from 1990, never before',()=>{
 const tallest=(id,year)=>{const age=year-1975;let s,seed=7;do s=begin(configureLife(newLife(seed++),{class:REGIONS[id].class[0],sex:'male',birthYear:1975,region:id}));while(s.birth.moves);
  const groups=[],scene=new T.Scene();createRegionScenery({scene,registerBuilding:g=>groups.push(g)}).update(townPlan({...s,age},age));
  return groups.map(g=>new T.Box3().setFromObject(g));};
 const white=(id,y)=>tallest(id,y).some(b=>b.min.x>14.5&&b.min.x<15.2&&b.min.z>2&&b.min.z<2.5&&b.max.y>1.5);
 assert.ok(!white('chiang-rai',1996));assert.ok(white('chiang-rai',1997));
 const kiln=(y)=>tallest('lampang',y).some(b=>b.min.x<-5.1&&b.min.z<-.85&&b.max.x>-2.4&&b.max.x<-2.2);
 assert.ok(!kiln(1989));assert.ok(kiln(1990));
});
