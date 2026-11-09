import test from 'node:test';
import assert from 'node:assert/strict';
import {eraMarks,townPlan,familyAt,crowdSize,lifeRandom} from '../../dist/course/diorama-plan.js';
import {crowdRoster,crowdActivity} from '../../dist/course/diorama-cast.js';
import {clearOfRoutes,PROPS} from '../../dist/course/region3d.js';
import {routeFixtures} from '../../dist/course/routines.js';
import {newLife,configureLife,begin} from '../../dist/course/sim.js';

const life=(seed,cls,region,birthYear,age)=>({...begin(configureLife(newLife(seed),{class:cls,region,birthYear})),age});

test('a marker never appears before its object existed in that place',()=>{
 const m=(r,y)=>eraMarks(r,y,1);
 assert.equal(m('sukhumvit',1998).viaduct,false);assert.equal(m('sukhumvit',1999).viaduct,true,'BTS opened 5 December 1999');
 assert.equal(m('bang-na',2010).viaduct,false,'Bang Na waited for the 2011 extension');assert.equal(m('bang-na',2011).viaduct,true);
 assert.equal(m('khlong-toei',2020).viaduct,false,'the line never ran through the port');
 assert.equal(m('bang-na',1988).store,false);assert.equal(m('bang-na',1989).store,true,'first store: Patpong, June 1989');
 assert.equal(m('sukhumvit',1985).winTaxi,false);assert.equal(m('sukhumvit',1986).winTaxi,true);
 assert.equal(m('sukhumvit',1993).mast,false,'GSM 1994');
 assert.equal(m('sukhumvit',1959).samlor,true);assert.equal(m('sukhumvit',1960).samlor,false,'pedal samlors left Bangkok');assert.equal(m('nakhon-sawan',1970).samlor,true,'and lasted upcountry');
 assert.equal(m('samut-prakan',1964).aerial,false,'regional television begins 1962; a town follows');assert.equal(m('sukhumvit',1958).aerial,true);
 assert.equal(m('bang-na',1987).tower,false);assert.equal(m('isan-village',2026).tower,false);
 for(const r of ['tokyo','london','boston','singapore'])assert.equal(m(r,2000).viaduct||m(r,2000).samlor||m(r,2000).store,false,r+' carries no Thai markers');
});
test('electric light reaches each village in its own year, inside the historical span',()=>{
 const years=new Set();
 for(let seed=1;seed<40;seed++){let y=1960;while(!eraMarks('isan-village',y,seed).power&&y<2000)y++;years.add(y);assert.ok(y>=1978&&y<=1986,`seed ${seed}: ${y}`);}
 assert.ok(years.size>3,'villages differ');
});
test('two lives in one place differ, and a life keeps its town as the years pass',()=>{
 const a=townPlan(life(11,'middle_class','bang-na',1981,30),30),b=townPlan(life(12,'middle_class','bang-na',1981,30),30);
 assert.notDeepEqual(a.palette.walls,b.palette.walls);
 const early=townPlan(life(11,'middle_class','bang-na',1981,12),12),again=townPlan(life(11,'middle_class','bang-na',1981,12),12);
 assert.deepEqual(early.palette,again.palette);assert.equal(early.key,again.key);
 assert.notEqual(early.key,a.key,'the model is rebuilt as the years pass');
});
test('an early Bang Na is rice and canal, and home follows class',()=>{
 assert.equal(townPlan(life(5,'middle_class','bang-na',1949,10),10).style,'fringe');
 assert.equal(townPlan(life(5,'middle_class','bang-na',1981,20),20).style,'condo');
 assert.equal(townPlan(life(5,'low_class','khlong-toei',1960,15),15).homeKind,'shack');
 assert.equal(townPlan(life(5,'low_class','isan-village',1949,8),8).homeKind,'stilt');
 assert.equal(townPlan(life(5,'high_class','sukhumvit',1990,30),30).homeKind,'villa');
});
test('building lots keep off every daily route',()=>{
 for(const path of routeFixtures())for(let i=1;i<path.length;i++){
  const [a,b]=[path[i-1],path[i]];
  for(let t=0;t<=1;t+=.05){const x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;if(x>=-5.6&&x<=18.6&&z>=-5.6&&z<=18.6)assert.equal(clearOfRoutes(x-.1,z-.1,.2,.2),false,`route point ${x},${z} is buildable`);}
 }
 for(const props of Object.values(PROPS))for(const [kind,x,z,w=.3,d=.3] of props)assert.ok(x>-5.6&&x+w<18.6&&z>-5.6&&z+d<18.6,kind);
});
test('more people in later years, fewer in early ones',()=>{
 assert.ok(crowdSize('market',2020)>crowdSize('market',1955));
 assert.ok(crowdSize('slum',1990)>=crowdSize('village',1990));
 for(const style of Object.keys(PROPS))assert.ok(crowdSize(style,2026)<=7);
});
test('a street figure faces where it walks and its stride only runs forward',()=>{
 const plan=townPlan(life(3,'middle_class','samut-prakan',1981,30),30),rows=crowdRoster(plan).filter(r=>r.role==='walk'&&r.pose==='walk');
 assert.ok(rows.length);
 for(const row of rows){let last=null,lastX=null,lastD=0;for(let t=.1;t<50;t+=.25){const a=crowdActivity(row,t,plan);if(!a)continue;if(last!==null){assert.ok(a.distance>=last,'distance never decreases');if(a.dx===lastD&&a.x!==lastX)assert.equal(Math.sign(a.dx),Math.sign(a.x-lastX),'faces its travel');}last=a.distance;lastX=a.x;lastD=a.dx;}}
});
test('family is on the board only while the record says so',()=>{
 const s=life(4,'middle_class','bang-na',1981,40);
 assert.equal(familyAt(s,10).father,true);
 const dead={...s,history:[{age:30,event:'Your father dies. The family has to find a different rhythm.'}]};
 if(s.birth.household==='parents'){assert.equal(familyAt(dead,29).father,true);assert.equal(familyAt(dead,31).father,false);}
 const wed={...s,pivotFlags:{...s.pivotFlags,married:25,separated:35,parent:27}};
 assert.equal(familyAt(wed,24).partner,false);assert.equal(familyAt(wed,30).partner,true);assert.equal(familyAt(wed,36).partner,false);
 assert.equal(familyAt(wed,26).child,false);assert.equal(familyAt(wed,30).childAge,3);
});
test('seeded randomness is stable',()=>{const a=lifeRandom(5,'x'),b=lifeRandom(5,'x'),c=lifeRandom(6,'x');assert.equal(a(),b());assert.notEqual(lifeRandom(5,'x')(),c());});

import {youthRoster} from '../../dist/course/diorama-cast.js';
test('young lives walk among young people, and older lives do not',()=>{
 const plan=townPlan(life(3,'middle_class','samut-prakan',1981,20),20);
 assert.equal(youthRoster(plan,8).length,0);assert.equal(youthRoster(plan,45).length,0);
 const rows=youthRoster(plan,20);assert.ok(rows.length>=3&&rows.length<=5);assert.ok(rows.length+7<=12,'fits the figure pool');
 for(const row of rows){assert.ok(row.age>=12&&row.age<30);assert.equal(row.role,'walk');const a=crowdActivity(row,10,plan);assert.ok(a&&a.moving);}
});
