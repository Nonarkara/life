import {test} from 'node:test';import assert from 'node:assert/strict';import {routine,dayPhase} from '../../dist/course/routines.js';import {blocked,taskDesks} from '../../dist/course/layout.js';
test('every actor has travel, activity and rest rather than a continuous loop',()=>{for(const actor of ['mother','father','player']){assert.equal(routine(actor,12,4).pose,'eat');assert.equal(routine(actor,12,12).moving,true);assert.equal(routine(actor,12,26).moving,false);assert.equal(routine(actor,12,40).moving,true);assert.equal(routine(actor,12,54).pose,'rest');}});
test('player routine changes with age and chosen adult vocation',()=>{assert.equal(routine('player',3,26).pose,'fall');assert.equal(routine('player',4,26).action,'Playing at home');assert.equal(routine('player',5,26).pose,'swim');assert.equal(routine('player',8,40).pose,'ride');assert.equal(routine('player',12,26).action,'At school');assert.equal(routine('player',30,26,'sport').action,'Training');assert.equal(routine('player',30,26,'art').action,'Making art');assert.equal(routine('player',65,26).action,'In the garden');assert.equal(routine('mother',0,26).action,'Caring for you');});
test('all routine trajectories clear room furniture across complete day',()=>{for(const age of [0,4,12,30,65])for(const goal of ['balance','sport','art'])for(const actor of ['mother','father','player'])for(let t=0;t<60;t+=.05){const p=routine(actor,age,t,goal);assert.ok(!blocked([p.x,p.y]),`${actor} age${age} ${goal} at${t.toFixed(2)}: ${p.x},${p.y}`);}});
test('journeys are continuous at phase boundaries and day wrap',()=>{for(const actor of ['mother','father','player'])for(const t of [8,20,36,48,60]){const a=routine(actor,30,t-.0001),b=routine(actor,30,t+.0001);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.01);}});
test('phase describes shared morning, day and evening',()=>{assert.equal(dayPhase(1),'Morning');assert.equal(dayPhase(25),'Daytime');assert.equal(dayPhase(55),'Evening');});
test('preschool journeys never describe adult work',()=>{assert.match(routine('player',4,12).action,/home/);assert.doesNotMatch(routine('player',4,12).action,/work/);});
test('adult player and father have distinct daytime work positions',()=>{const a=routine('father',35,25),b=routine('player',35,25);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>.6);});
test('houses the town adds later never stand on anyone\'s daily path',async()=>{const {townGrowth}=await import('../../dist/course/layout.js');for(const age of [25,35,45,55,65,75])for(const goal of ['balance','sport','art'])for(const actor of ['mother','father','player'])for(let t=0;t<60;t+=.05){const p=routine(actor,age,t,goal);for(const[from,x,y,w,d]of townGrowth)if(age>=from)assert.ok(!(p.x+.2>x&&p.x-.2<x+w&&p.y+.2>y&&p.y-.2<y+d),`${actor} age${age} ${goal} walks through the house at ${x},${y}`);}});
test('committed education and work routes override generic age routines',()=>{
 assert.equal(routine('player',20,26,'balance',{pathway:'school'}).action,'At school');
 assert.equal(routine('player',16,26,'balance',{pathway:'vocational'}).pose,'craft');
 assert.equal(routine('player',22,26,'balance',{pathway:'college'}).action,'At college');
 assert.equal(routine('player',32,26,'balance',{pathway:'independent'}).action,'Working independently');
 assert.equal(routine('player',45,26,'balance',{recovering:true}).pose,'recover');
});
test('task desks and waiting neighbors do not intersect actual work journeys',()=>{
 const desks=taskDesks.map(([x,y])=>({x:x-.04,y:y-.04,w:.83,d:.52}));
 for(const actor of ['mother','father','player'])for(const pathway of ['school','college','vocational','work','independent'])for(let t=0;t<60;t+=.05){
  const r=routine(actor,22,t,'balance',{pathway});
  for(const d of desks)assert.ok(!(r.x+.08>d.x&&r.x-.08<d.x+d.w&&r.y+.08>d.y&&r.y-.08<d.y+d.d),`${actor}/${pathway} desk at${t}`);
  if(actor==='player')assert.ok(Math.hypot(r.x-12.9,r.y-6.3)>.3);
 }
});

test('a committed salaried route does not pretend to be a sport or art career',()=>{for(const goal of ['sport','art'])assert.equal(routine('player',35,26,goal,{pathway:'work'}).action,'At work');});
