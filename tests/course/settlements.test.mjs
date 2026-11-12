import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createRegionScenery} from '../../dist/course/region3d.js';
import {townPlan,lotLift} from '../../dist/course/diorama-plan.js';
import {setHomeLift,floorAt} from '../../dist/course/district-layout.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
// The overhaul's first law: where you are born must be visible. Every Thai birthplace builds its
// own scenery, and a village family lives up a stair, as rural Thai families did.
const BIRTHS={'samut-prakan':'working_class','nakhon-sawan':'low_class','khlong-toei':'low_class','isan-village':'low_class','bang-na':'middle_class','pak-phanang':'middle_class','sukhumvit':'high_class'};
const planAt=(region,cls,age=10,seed=7)=>{const s=begin(configureLife(newLife(seed),{class:cls,sex:'male',birthYear:1981,region}));return townPlan({...s,age},age);};
function fingerprint(plan){const scene=new T.Scene();createRegionScenery({scene,registerBuilding(){}}).update(plan);let n=0,sum=0;scene.traverse(o=>{const p=o.geometry?.attributes.position;if(!p)return;n+=p.count;for(let i=0;i<p.count;i+=7)sum+=p.getX(i)*3+p.getZ(i)*5+p.getY(i);});return n+':'+sum.toFixed(1);}
test('every Thai birthplace builds different scenery, Isan and Nakhon Sawan included',()=>{
 const prints=Object.entries(BIRTHS).map(([r,c])=>[r,fingerprint(planAt(r,c))]);
 assert.equal(new Set(prints.map(p=>p[1])).size,prints.length,JSON.stringify(prints));
});
test('a poor village or riverside home stands on posts and its people climb to the floor',()=>{
 for(const [r,c] of [['isan-village','low_class'],['nakhon-sawan','low_class'],['khlong-toei','low_class']]){const p=planAt(r,c);assert.ok(p.lift>0,r+' '+p.homeKind);}
 assert.equal(planAt('samut-prakan','working_class').lift,0);assert.equal(planAt('sukhumvit','high_class').lift,0);
 setHomeLift(.95);try{assert.equal(floorAt(5,4),.16+.95);assert.equal(floorAt(6.7,7.2),0);assert.ok(floorAt(6.7,6.9)>0&&floorAt(6.7,6.9)<1.11);}finally{setHomeLift(0);}
 assert.equal(floorAt(5,4),.16);
});
test('the neighbours on the class ladder build like their place',()=>{
 const village=planAt('isan-village','low_class'),town=planAt('samut-prakan','working_class');
 // A neighbour on your rung lives in a house like yours: raised exactly when your own would be.
 for(const rung of [1,2])assert.ok(lotLift(village,rung)>0);for(const rung of [0,3,4,5])assert.equal(lotLift(village,rung),0);
 for(const [r,c,rung] of [['isan-village','low_class',1],['isan-village','working_class',2],['khlong-toei','low_class',1],['samut-prakan','working_class',2]])assert.equal(lotLift(planAt(r,c),rung)>0,planAt(r,c).lift>0,r+' rung '+rung);
 for(const rung of [0,1,2,3,4,5])assert.equal(lotLift(town,rung),0);
});
