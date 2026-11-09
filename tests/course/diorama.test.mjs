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
 assert.equal(townPlan(life(7,'low_class','khlong-toei',1960,15),15).homeKind,'shack');
 assert.equal(townPlan(life(7,'low_class','isan-village',1949,8),8).homeKind,'stilt');
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

import {ladderOpen,birthFits,RUNGS,LOTS,TOP,othersOf,birthRung,rungAt,setRung,lotCast,lotActivity,tourStop,clearOfLots} from '../../dist/course/housing-ladder.js';
import {monthlyFlow,openFinance,setRegion,setHousing} from '../../dist/course/finance.js';
import {HOME} from '../../dist/course/routines.js';
test('every town holds all six homes: yours and five open lots, none on a path or atop another',()=>{
 for(let r=0;r<=TOP;r++){const o=othersOf(r);assert.equal(o.length,LOTS.length);assert.deepEqual([...o.map(x=>x.rung),r].sort(),[0,1,2,3,4,5]);}
 assert.equal(RUNGS.length,6);
 LOTS.forEach((a,i)=>{assert.ok(a[0]>=-5.6&&a[0]+a[2]<=18.6&&a[1]+a[3]<=18.6,'on the board');assert.ok(a[0]+a[2]<=17||a[1]>=7.2,'clear of the local studio');LOTS.forEach((b,j)=>{if(i!==j)assert.ok(a[0]+a[2]<=b[0]||b[0]+b[2]<=a[0]||a[1]+a[3]<=b[1]||b[1]+b[3]<=a[1]);});});
 for(const [x,z] of Object.values(HOME))assert.ok(clearOfLots(x,z));
});
test('class sets the first home; moves are one step, cost rent, and can be taken back',()=>{
 assert.equal(birthRung(life(3,'middle_class','samut-prakan',1981,0)),3);assert.equal(birthRung(life(3,'high_class','samut-prakan',1981,0)),5);
 const low=[...Array(400).keys()].map(s=>birthRung({seed:s+1,intake:{class:'low_class'}}));assert.ok(low.includes(0)&&low.includes(1));assert.ok(low.every(r=>r<=1));
 const s=openFinance(life(3,'middle_class','samut-prakan',1981,25));assert.equal(setRung(s,5),s,'no jumping two steps');
 const up=setRung(s,4);assert.notEqual(up,s);assert.equal(rungAt(up),4);assert.ok(monthlyFlow(up).rent>monthlyFlow(s).rent,'a bigger home costs more');
 assert.equal(rungAt(setRung(up,3)),3,'changing your mind before living the years');const down=setRung(s,2);assert.ok(monthlyFlow(down).rent<monthlyFlow(s).rent);
});
test('the neighbours age with you, stay inside their lots, and the poorest do not get to retire',()=>{
 for(const age of [8,15,30,50,66])for(const row of lotCast(3,7,age))for(let t=0;t<60;t+=.7){const a=lotActivity(row,age,t,1990);if(!a)continue;const [X,Z,W,D]=row.lot;assert.ok(a.x>=X&&a.x<=X+W&&a.y>=Z&&a.y<=Z+D+.5,JSON.stringify([row,a]));}
 const young=(r,age,t)=>lotActivity(lotCast(0,7,age).concat(lotCast(5,7,age)).find(x=>x.who==='young'&&x.rung===r),age,t,1990);
 assert.equal(young(4,12,20),null,'a child of the yard is at school by day');assert.equal(young(0,0,0)===undefined,false);
 assert.equal(lotCast(3,7,12).find(x=>x.who==='young'&&x.rung===0).dressAge>=18,true,'no uniform on the pavement');
 assert.equal(young(1,14,20).pose,'wash','at fourteen the squat already works');assert.equal(young(1,70,20),null,'and dies earlier');
 const seen=new Set();for(let t=0;t<56;t+=8)seen.add(tourStop(3,t).kind+(tourStop(3,t).rung??''));assert.equal(seen.size,7,'the walk shows the town and all six homes');
});

test('the form gets what it asked for, and the move card only shows where a move means something',()=>{
 const seedOf=rung=>[...Array(200).keys()].map(n=>n+1).find(n=>birthRung({seed:n,intake:{class:'low_class'}})===rung);
 const of=n=>({seed:n,intake:{class:'low_class'},birth:{household:'parents'}});
 assert.equal(birthFits(of(seedOf(0)),{class:'low_class'}),false,'asked for the squat, drew the pavement: draw again');
 assert.equal(birthFits(of(seedOf(0)),{class:'low_class',street:true}),true);assert.equal(birthFits(of(seedOf(1)),{class:'low_class'}),true);
 assert.equal(birthFits(of(seedOf(1)),{class:'low_class',raised:'grandmother'}),false);
 const s=openFinance(life(3,'middle_class','samut-prakan',1981,25));assert.equal(ladderOpen(s),true);
 assert.equal(ladderOpen(setRegion(s,'sukhumvit')),false,'rent is not charged after moving away, so no card');assert.equal(ladderOpen(setHousing(s,'near')),false);
});
import {kitchenFeeds} from '../../dist/course/diorama-plan.js';
test('the kitchen feeds whoever is left: the table has one plate per person at home',()=>{
 const s=life(3,'middle_class','samut-prakan',1981,20);assert.equal(kitchenFeeds(s,10),3);assert.equal(kitchenFeeds(s,79),1,'at the end you eat alone');
 const flags=(a)=>({...s,pivotFlags:{married:a,parent:a+2}});assert.equal(kitchenFeeds(flags(25),30),5,'a child and a partner join the table');
});
