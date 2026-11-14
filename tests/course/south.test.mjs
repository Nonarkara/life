import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync} from 'node:fs';
import {REGIONS,CLASS_REGIONS} from '../../dist/course/regions.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {townPlan} from '../../dist/course/diorama-plan.js';
import {createRegionScenery} from '../../dist/course/region3d.js';
// The South's fourteen provinces come from research/provinces/south.json.
const SOUTH=JSON.parse(readFileSync(new URL('../../research/provinces/south.json',import.meta.url)));
const south=Object.keys(REGIONS).filter(id=>REGIONS[id].south);
test('every province in the South record is a birthplace, and its link opens there',()=>{
 assert.deepEqual(south.sort(),SOUTH.map(p=>p.id).sort());
 for(const id of south)for(const cls of REGIONS[id].class){
  assert.ok(SOUTH.find(p=>p.id===id).households.some(h=>h.class===cls),id+' '+cls+' is in its record');
  assert.ok(CLASS_REGIONS[cls].includes(id));
  const life=begin(configureLife(newLife(11),{class:cls,sex:'female',birthYear:1981,region:id})),code=encodeBirth(life);
  assert.equal(life.birth.region,id);assert.equal(decodeBirth(code)?.birth.region,id,code);
 }
});
const board=(id,year,by=1975)=>{const age=year-by;let s,seed=7;do s=begin(configureLife(newLife(seed++),{class:REGIONS[id].class[0],sex:'male',birthYear:by,region:id}));while(s.birth.moves);
 const groups=[],scene=new T.Scene();createRegionScenery({scene,registerBuilding:g=>groups.push(g)}).update(townPlan({...s,age},age));
 const verts=[];scene.traverse(o=>{const a=o.geometry?.attributes?.position;if(!a)return;o.updateWorldMatrix(true,false);const v=new T.Vector3();for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);verts.push([v.x,v.y,v.z]);}});
 return {boxes:groups.map(g=>new T.Box3().setFromObject(g)),verts};};
const at=(id,y,f)=>board(id,y).boxes.some(f);
// Mutation-checked: moving any of these one year earlier fails this.
test('the South\'s dated landmarks keep their years',()=>{
 const at=(id,y,f,by)=>board(id,y,by).boxes.some(f),tall=(x0,x1,h)=>b=>b.min.x>x0&&b.min.x<x1&&b.max.y>h;
 assert.ok(!at('pattani',1962,tall(14,14.4,2),1955));assert.ok(at('pattani',1963,tall(14,14.4,2),1955));
 const mermaid=b=>b.min.x>15.1&&b.min.x<15.3&&b.min.z>5.2;assert.ok(!at('songkhla',1965,mermaid,1955));assert.ok(at('songkhla',1966,mermaid,1955));
 assert.ok(!at('satun',1978,tall(14.5,14.7,2)));assert.ok(at('satun',1979,tall(14.5,14.7,2)));
 assert.ok(!at('narathiwat',1980,tall(14.5,14.7,2)));assert.ok(at('narathiwat',1981,tall(14.5,14.7,2)));
 const buddha=y=>Math.max(...board('phuket',y).boxes.filter(b=>b.min.x>14.2&&b.min.x<14.4).map(b=>b.max.y));assert.ok(buddha(2013)<2);assert.ok(buddha(2014)>2.5);
 const bridge=y=>board('songkhla',y).verts.some(([x,yy,z])=>x>7.1&&x<9.2&&z<-5.3&&yy>.3&&yy<.6);assert.ok(!bridge(1985));assert.ok(bridge(1986));
});
