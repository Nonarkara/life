import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync} from 'node:fs';
import {createRegionScenery} from '../../dist/course/region3d.js';
import {townPlan,lotLift} from '../../dist/course/diorama-plan.js';
import {setHomeLift,floorAt} from '../../dist/course/district-layout.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {furnishHome} from '../../dist/course/home3d.js';
import {createBatch} from '../../dist/course/diorama-kit.js';
// The overhaul's first law: where you are born must be visible. Every Thai birthplace builds its
// own scenery, and a village family lives up a stair, as rural Thai families did.
const BIRTHS={'samut-prakan':'working_class','nakhon-sawan':'low_class','khlong-toei':'low_class','isan-village':'low_class','bang-na':'middle_class','pak-phanang':'middle_class','sukhumvit':'high_class','hua-hin':'bureaucratic_class','udon-thani':'working_class','pathum-wan':'middle_class'};
// A family that stays put, so the board at ten is still the birthplace.
const planAt=(region,cls,age=10,seed=7)=>{let s;do s=begin(configureLife(newLife(seed++),{class:cls,sex:'male',birthYear:1981,region}));while(s.birth.moves);return townPlan({...s,age},age);};
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
// What the camera sees first is the home. Its building must differ by birthplace, not only its paint.
function homePrint(plan){const batches=new Map(),root=new T.Group(),batchOf=p=>{if(!batches.has(p))batches.set(p,createBatch());return batches.get(p);};
 furnishHome({root,batchOf,group:(p=root)=>{const g=new T.Group();p.add(g);return g;},chair(){},table(){},plan,register(){}});let n=0;for(const b of batches.values())n+=b.size;return n;}
test('the home itself is a different building in each town birthplace',()=>{
 const towns=[['samut-prakan','working_class'],['bang-na','middle_class'],['pak-phanang','middle_class'],['sukhumvit','high_class']].map(([r,c])=>[r,planAt(r,c)]);
 const prints=towns.map(([r,p])=>r+' '+p.homeKind+' '+homePrint(p));
 assert.equal(new Set(towns.map(([,p])=>homePrint(p))).size,4,prints.join(' | '));
 const tall=p=>homePrint(p);assert.ok(tall(planAt('bang-na','middle_class'))>tall(planAt('samut-prakan','working_class'))+40,'a condo home stands in a tower');
});
test('a closed town home is as tall as the open one, and its shutters leave the door clear',()=>{
 const src=readFileSync(new URL('../../dist/course/home3d.js',import.meta.url),'utf8');
 const above=Object.fromEntries([...src.match(/const ABOVE=\{([^}]*)\}/)[1].matchAll(/(\w+):(\d+)/g)].map(m=>[m[1],+m[2]]));
 for(const kind of ['shophouse','flat','condo']){const shell=+src.match(new RegExp(kind+":\\{[^}]*floors:(\\d+)"))[1];assert.equal(shell,above[kind],kind);}
 // The family door is the gap at x 6.3-6.92; no shutter slat may stand in it.
 const xs=src.match(/for\(const x of \[([\d.,]+)\]\)for\(let i=0;i<5;i\+\+\)b\.box\(x\+i\*\.075,6\.56/)[1].split(',').map(Number);
 for(const x of xs)assert.ok(x+4*.075+.06<=6.3||x>=6.92,'slats at '+x);
});

// The owner's three birthplaces: a beach-town bungalow, an Isan town shophouse row, a Pathum Wan shophouse.
test('Hua Hin, Udon Thani and Pathum Wan are births of their own, and old birth codes still open',async()=>{
 const {drawBirth}=await import('../../dist/course/birth-draw.js');const {encodeBirth,decodeBirth}=await import('../../dist/course/birthcode.js');const {defaultRegion}=await import('../../dist/course/sim.js');
 assert.equal(planAt('hua-hin','middle_class').homeKind,'bungalow');assert.equal(planAt('hua-hin','middle_class').style,'beach');
 assert.equal(planAt('udon-thani','working_class').homeKind,'row');assert.equal(planAt('pathum-wan','middle_class').homeKind,'shophouse');
 let k=0;const random=()=>(k=(k*16807+11)%2147483647)/2147483647,seen=new Set();
 for(let i=0;i<300;i++){const l=drawBirth({},{random}),code=encodeBirth(l);seen.add(l.birth.region);assert.equal(decodeBirth(code)?.birth.region,l.birth.region,code);
  if(l.birth.region===defaultRegion(l.seed,l.intake.class))assert.match(code,/-[0-9a]{5}$/,'a birth the seed already names carries no place letter');}
 for(const r of ['hua-hin','udon-thani','pathum-wan'])assert.ok(seen.has(r),r+' is drawn');
 // A code made before the new places existed opens in the same place it always did.
 for(let seed=1;seed<=60;seed++)for(const cls of ['middle_class','working_class','bureaucratic_class']){const l=configureLife(newLife(seed),{class:cls,sex:'female'});assert.equal(l.birth.region,defaultRegion(seed,cls));assert.ok(!['hua-hin','udon-thani','pathum-wan'].includes(l.birth.region));}
});
test('the unchosen life and same-birth fellows are born where you were',async()=>{
 const {unchosenLife}=await import('../../dist/course/baseline.js');const {sameBirth}=await import('../../dist/course/life-reading.js');const {defaultRegion}=await import('../../dist/course/sim.js');
 for(const [region,cls] of [['hua-hin','middle_class'],['udon-thani','working_class'],['pathum-wan','middle_class']]){
  let seed=1;while(defaultRegion(seed,cls)===region)seed++;
  const s=begin(configureLife(newLife(seed),{class:cls,sex:'female',birthYear:1981,region}));
  assert.equal(unchosenLife(s,{upTo:1}).birth.region,region);assert.equal(sameBirth(s,0).birth.region,region);
 }
});
// Phase 3: a family moves when work moves it, and the place it left stays on the route map.
test('a family moves for a posting, the suburbs or work, and the old place stays on the map',async()=>{
 const {regionAt,homeRegion}=await import('../../dist/course/regions.js');const {routeModel}=await import('../../dist/course/routemap.js');const {familyAt}=await import('../../dist/course/diorama-plan.js');
 const {validate}=await import('../../dist/course/sim.js');const {childhoodChapter}=await import('../../dist/course/childhood.js');const {encodeBirth,decodeBirth}=await import('../../dist/course/birthcode.js');
 const find=(cls,region,why)=>{for(let seed=1;seed<4000;seed++){const l=configureLife(newLife(seed),{class:cls,sex:'female',birthYear:1981,...(region?{region}:{})});if(l.birth.moves?.[0].why===why)return l;}};
 for(const [cls,region,why] of [['middle_class','pathum-wan','suburb'],['bureaucratic_class',undefined,'transfer'],['low_class','isan-village','work']]){
  const l=find(cls,region,why);assert.ok(l,why+' happens');const m=l.birth.moves[0],born=l.birth.region;
  assert.ok(m.age>=2&&m.age<=9&&m.region!==born);assert.equal(regionAt(l,m.age-1),born);assert.equal(regionAt(l,m.age),m.region);
  const s={...begin(l),age:20,history:[]};assert.equal(familyAt(s,20).awayFromParents,false,'the family lives where it moved');
  const route=routeModel({...l,age:12,history:[]});assert.ok(route.lanes.includes(born)&&route.lanes.includes(m.region),'both places stay on the route map');
  assert.ok(route.marks.some(k=>k.age===m.age&&k.labels.includes('Family moved')));
  assert.ok(childhoodChapter(l,m.age).decision.includes(REGIONS_PLACE(m.region)),'the move is told as a chapter');
  assert.equal(decodeBirth(encodeBirth(l))?.birth.moves?.[0].region,m.region,'a shared code moves the same way');
  assert.equal(homeRegion(l.birth,30),l.birth.moves.at(-1).region);
 }
 const l=find('bureaucratic_class',undefined,'transfer');assert.equal(validate({...l,birth:{...l.birth,moves:[{region:'nowhere',age:3,why:'transfer'}]}}),false);
 assert.equal(validate({...l,birth:{...l.birth,moves:[{region:'bang-na',age:14,why:'transfer'}]}}),false);
});
import {REGIONS} from '../../dist/course/regions.js';
const REGIONS_PLACE=id=>REGIONS[id].place;
test('a life saved before moves never gains one when it is replayed or compared',async()=>{
 const {replay}=await import('../../dist/course/sim.js');const {unchosenLife}=await import('../../dist/course/baseline.js');const {sameBirth}=await import('../../dist/course/life-reading.js');
 let seed=1,l;do l=configureLife(newLife(seed++),{class:'bureaucratic_class',sex:'female',birthYear:1981});while(!l.birth.moves);
 const {moves,...birth}=l.birth,old=begin({...l,birth});
 assert.equal(replay(old).birth.moves,undefined);assert.equal(unchosenLife(old,{upTo:1}).birth.moves,undefined);assert.equal(sameBirth(old,0).birth.moves,undefined);
 assert.deepEqual(replay(begin(l)).birth.moves,moves,'a life that moved replays the same move');
});
