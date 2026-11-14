import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync} from 'node:fs';
import {REGIONS,CLASS_REGIONS} from '../../dist/course/regions.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {townPlan} from '../../dist/course/diorama-plan.js';
import {createRegionScenery} from '../../dist/course/region3d.js';
// The East's seven provinces come from research/provinces/east.json.
const EAST=JSON.parse(readFileSync(new URL('../../research/provinces/east.json',import.meta.url)));
const east=Object.keys(REGIONS).filter(id=>REGIONS[id].east);
test('every province in the East record is a birthplace, and its link opens there',()=>{
 assert.deepEqual(east.sort(),EAST.map(p=>p.id).sort());
 for(const id of east)for(const cls of REGIONS[id].class){
  assert.ok(EAST.find(p=>p.id===id).households.some(h=>h.class===cls),id+' '+cls+' is in its record');
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
// Mutation-checked: moving any of these one year earlier fails this.
test('the East\'s dated landmarks keep their years',()=>{
 const castle=b=>b.min.x>14.6&&b.min.x<14.8&&b.max.y>3;assert.ok(!at('chonburi',1980,castle));assert.ok(at('chonburi',1981,castle));
 const port=y=>board('chonburi',y).verts.some(([x,yy,z])=>x>-4.9&&x<-3.6&&z<-3&&yy>2.1);
 assert.ok(!port(1990));assert.ok(port(1991));
 const petro=b=>b.min.x>14.2&&b.min.x<14.5&&b.max.y>3.5;assert.ok(!at('rayong',1989,petro));assert.ok(at('rayong',1990,petro));
 const market=b=>b.min.x>14.3&&b.min.x<14.5&&b.min.z>2.4&&b.min.z<2.6;assert.ok(!at('sa-kaeo',1990,market));assert.ok(at('sa-kaeo',1991,market));
 const honda=b=>b.min.x>9.3&&b.min.x<9.5&&b.min.z>16&&b.max.x>17.9;assert.ok(!at('prachinburi',2015,honda));assert.ok(at('prachinburi',2016,honda));
 const ewaste=b=>b.min.x<-5.1&&b.min.z>-.8&&b.min.z<-.6&&b.max.z>1.4;assert.ok(!at('chachoengsao',2017,ewaste));assert.ok(at('chachoengsao',2018,ewaste));
});
