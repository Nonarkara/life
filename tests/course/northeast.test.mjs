import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync} from 'node:fs';
import {REGIONS,CLASS_REGIONS} from '../../dist/course/regions.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {townPlan} from '../../dist/course/diorama-plan.js';
import {createRegionScenery} from '../../dist/course/region3d.js';
// The Northeast's provinces come from research/provinces/northeast.json. Udon Thani and the Khon Kaen
// rice village were births before; every other province is one now, and no dated landmark appears early.
const NE=JSON.parse(readFileSync(new URL('../../research/provinces/northeast.json',import.meta.url)));
const isan=Object.keys(REGIONS).filter(id=>REGIONS[id].isan);
test('every province in the Northeast record is a birthplace, and its link opens there',()=>{
 assert.deepEqual([...isan,'udon-thani'].sort(),NE.map(p=>p.id).sort());
 for(const id of isan)for(const cls of REGIONS[id].class){
  assert.ok(NE.find(p=>p.id===id).households.some(h=>h.class===cls),id+' '+cls+' is in its record');
  assert.ok(CLASS_REGIONS[cls].includes(id));
  const life=begin(configureLife(newLife(11),{class:cls,sex:'female',birthYear:1981,region:id})),code=encodeBirth(life);
  assert.equal(life.birth.region,id);assert.equal(decodeBirth(code)?.birth.region,id,code);
 }
});
const board=(id,year)=>{const age=year-1975;let s,seed=7;do s=begin(configureLife(newLife(seed++),{class:REGIONS[id].class[0],sex:'male',birthYear:1975,region:id}));while(s.birth.moves);
 const groups=[],scene=new T.Scene();createRegionScenery({scene,registerBuilding:g=>groups.push(g)}).update(townPlan({...s,age},age));
 const verts=[];scene.traverse(o=>{const a=o.geometry?.attributes?.position;if(!a)return;o.updateWorldMatrix(true,false);const v=new T.Vector3();for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);verts.push([v.x,v.y,v.z]);}});
 return {boxes:groups.map(g=>new T.Box3().setFromObject(g)),verts};};
// Mutation-checked: moving any of these dates one year earlier fails this.
test('Chang Arena, Sala Keoku, the Friendship Bridge and Phra That Phanom keep their years',()=>{
 const arena=y=>board('buriram',y).boxes.some(b=>b.min.x>10&&b.min.x<10.3&&b.min.z>14.5&&b.max.z>18);
 assert.ok(!arena(2010));assert.ok(arena(2011));
 const keoku=y=>board('nong-khai',y).boxes.some(b=>b.min.x>14.9&&b.min.x<15.1&&b.max.y>2);
 assert.ok(!keoku(1977));assert.ok(keoku(1978));
 // The bridge's gate posts over the river at the end of the cross street.
 const bridge=y=>board('nong-khai',y).verts.some(([x,yy,z])=>x>7.1&&x<9.2&&z<-5&&yy>1.2);
 assert.ok(!bridge(1993));assert.ok(bridge(1994));
 // It fell on 11 August 1975 and the rebuilt chedi was finished on 23 March 1979.
 const phanom=y=>Math.max(...board('nakhon-phanom',y).boxes.filter(b=>b.min.x>15.2&&b.min.x<15.5&&b.min.z>3.4).map(b=>b.max.y));
 assert.ok(phanom(1975)>4);assert.ok(phanom(1976)<3);assert.ok(phanom(1978)<3);assert.ok(phanom(1979)>4);
});
