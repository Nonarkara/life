import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync} from 'node:fs';
import {REGIONS,CLASS_REGIONS} from '../../dist/course/regions.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {townPlan} from '../../dist/course/diorama-plan.js';
import {createRegionScenery} from '../../dist/course/region3d.js';
// The West's five provinces come from research/provinces/west.json.
const WEST=JSON.parse(readFileSync(new URL('../../research/provinces/west.json',import.meta.url)));
const west=Object.keys(REGIONS).filter(id=>REGIONS[id].west);
test('every province in the West record is a birthplace, and its link opens there',()=>{
 assert.deepEqual(west.sort(),WEST.map(p=>p.id).sort());
 for(const id of west)for(const cls of REGIONS[id].class){
  assert.ok(WEST.find(p=>p.id===id).households.some(h=>h.class===cls),id+' '+cls+' is in its record');
  assert.ok(CLASS_REGIONS[cls].includes(id));
  const life=begin(configureLife(newLife(11),{class:cls,sex:'female',birthYear:1981,region:id})),code=encodeBirth(life);
  assert.equal(life.birth.region,id);assert.equal(decodeBirth(code)?.birth.region,id,code);
 }
});
const board=(id,year)=>{const age=year-1975;let s,seed=7;do s=begin(configureLife(newLife(seed++),{class:REGIONS[id].class[0],sex:'male',birthYear:1975,region:id}));while(s.birth.moves);
 const groups=[],scene=new T.Scene();createRegionScenery({scene,registerBuilding:g=>groups.push(g)}).update(townPlan({...s,age},age));
 const verts=[];scene.traverse(o=>{const a=o.geometry?.attributes?.position;if(!a)return;o.updateWorldMatrix(true,false);const v=new T.Vector3();for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);verts.push([v.x,v.y,v.z]);}});
 return {boxes:groups.map(g=>new T.Box3().setFromObject(g)),verts};};
const at=(id,y,f)=>board(id,y).boxes.some(f);
// Mutation-checked: moving either date one year earlier fails this.
test('the floating market and the Friendship Bridge keep their years',()=>{
 const market=y=>board('ratchaburi',y).verts.some(([x,yy,z])=>x>14.3&&x<18.2&&z>2.4&&z<6.6&&yy>.2&&yy<.3);
 assert.ok(!market(1980));assert.ok(market(1981));
 const bridge=y=>board('tak',y).verts.some(([x,yy,z])=>x>7.1&&x<9.2&&z<-5&&yy>1.2);
 assert.ok(!bridge(1996));assert.ok(bridge(1997));
});
