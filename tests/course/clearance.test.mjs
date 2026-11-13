import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createRegionScenery,FOOTPRINTS} from '../../dist/course/region3d.js';
import {LOTS} from '../../dist/course/housing-ladder.js';
import {townPlan} from '../../dist/course/diorama-plan.js';
import {REGIONS} from '../../dist/course/regions.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
// Reserve space before dressing it (after sloemo01/diorama, MIT, "action clearance"): every building a
// town draws stays off the roads, the neighbours' lots and the shared institutions' plots. The four
// defects the phase-2 review found by hand (malls on a road, a park on lots, a house on the market)
// are this one rule, so it is a test, not a reviewer's eye.
const CLASS={'samut-prakan':'working_class','nakhon-sawan':'low_class','khlong-toei':'low_class','isan-village':'low_class','bang-na':'middle_class','pak-phanang':'middle_class',sukhumvit:'high_class','hua-hin':'bureaucratic_class','udon-thani':'working_class','pathum-wan':'middle_class'};
// Half a unit of slack: shop awnings, eaves and roofs overhang the pavement on purpose.
const ROADS=[[-5.6,7.05,24.2,1.8],[7.2,-5.6,1.8,24.2]],INSTITUTIONS=['school','work','clinic','market'].map(k=>FOOTPRINTS[k]);
const hit=([x,z,w,d],[a,b,c,e],m=.5)=>x+m<a+c&&x+w-m>a&&z+m<b+e&&z+d-m>b;
export function clearanceFaults(region,[birthYear,age],seed=7){
 // A family that stays put, or the board would show where it moved, not this town.
 let s;do s=begin(configureLife(newLife(seed++),{class:CLASS[region],sex:'male',birthYear,region}));while(s.birth.moves);const plan=townPlan({...s,age},age),year=birthYear+age;
 const groups=[],scene=new T.Scene();createRegionScenery({scene,registerBuilding:g=>groups.push(g)}).update(plan);
 const faults=[];
 for(const g of groups){const b=new T.Box3().setFromObject(g);if(b.isEmpty())continue;const r=[b.min.x,b.min.z,b.max.x-b.min.x,b.max.z-b.min.z];
  // The institution's own building fills most of its plot; anything smaller sitting on a plot is a fault.
  const area=([x,z,w,d],[a,b,c,e])=>Math.max(0,Math.min(x+w,a+c)-Math.max(x,a))*Math.max(0,Math.min(z+d,b+e)-Math.max(z,b));
  const own=INSTITUTIONS.find(f=>area(r,f)>=.6*f[2]*f[3]&&r[2]*r[3]<=1.8*f[2]*f[3]);if(own)continue;
  for(const f of [...INSTITUTIONS,...LOTS,...ROADS])if(hit(r,f)){faults.push(plan.regionId+' '+year+' '+r.map(v=>v.toFixed(1)).join(',')+' on '+f.join(','));break;}}
 assert.equal(plan.regionId,region,'the board is the town under test');
 return faults;
}
test('no town builds on a road, a neighbour\'s lot or an institution\'s plot',()=>{
 const thai=Object.keys(REGIONS).filter(r=>REGIONS[r].country==='TH'),faults=[];
 for(const region of thai)for(const when of [[1955,10],[1970,20],[1981,29]])faults.push(...clearanceFaults(region,when));
 assert.deepEqual(faults,[]);
});
// Phase-5 review: Nakhon Sawan drew the Isan village's stilt houses and paddy. No two Thai towns
// may share most of their building footprints in the same year.
test('no two towns share most of their buildings',()=>{
 const foot=region=>{let s,seed=7;do s=begin(configureLife(newLife(seed++),{class:CLASS[region],sex:'male',birthYear:1975,region}));while(s.birth.moves);
  const groups=[],scene=new T.Scene();createRegionScenery({scene,registerBuilding:g=>groups.push(g)}).update(townPlan({...s,age:35},35));
  return new Set(groups.map(g=>new T.Box3().setFromObject(g)).filter(b=>!b.isEmpty()).map(b=>[b.min.x,b.min.z,b.max.x,b.max.z].map(v=>Math.round(v*2)).join()));};
 const thai=Object.keys(REGIONS).filter(r=>REGIONS[r].country==='TH'),all=Object.fromEntries(thai.map(r=>[r,foot(r)])),same=[];
 // Plots every town shares (school, clinic, market, workplace, wat) are the board, not the town.
 const common=[...all[thai[0]]].filter(k=>thai.every(r=>all[r].has(k))),sets=Object.fromEntries(thai.map(r=>[r,new Set([...all[r]].filter(k=>!common.includes(k)))]));
 for(const a of thai)for(const b of thai)if(a<b){const A=sets[a],B=sets[b],n=[...A].filter(k=>B.has(k)).length;if(n/Math.min(A.size,B.size)>.7)same.push(a+'~'+b+' '+n+'/'+Math.min(A.size,B.size));}
 assert.deepEqual(same,[]);
});
