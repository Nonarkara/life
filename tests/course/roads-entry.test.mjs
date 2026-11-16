// A player can walk onto the two roads on purpose: the building site at fifteen leads to the labourer's
// road at twenty, and a band put first at fifteen, then school, leads to the singer who became an office worker.
import test from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live,configureLife,rand,validate} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions,fits,pivotById} from '../../dist/course/pivots.js';
import {eligibleEncounters,encounterById,offerEncounter,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {routeOf} from '../../dist/course/life-routes.js';

// Plays to `until`, steering named questions, and reports every scene met with the age it was met at.
const play=(seed,cls,by,{want={},priority,until=25}={})=>{let s=begin(configureLife(newLife(seed),{class:cls,sex:seed%2?'male':'female',birthYear:by}));const met=[],answered=[];
 const settle=()=>{for(let n=0;n<12;n++){const list=pendingPivots(s);if(!list.length)break;const q=list[0],open=openOptions(q,s),o=open.find(x=>x.id===want[q.id])??open[Math.floor(rand(seed,s.age,'t'+q.id)*open.length)],next=applyPivot(s,q,o.id);if(next===s)break;s=next;answered.push(q.id+':'+o.id+'@'+s.age);}
  if(s.story?.pending){const e=encounterById(s.story.pending.id),open=e.options.filter(o=>choiceAvailable(s,o)),list=open.length?open:e.options;met.push([e.id,s.age,s.history.at(-1)?.pathway]);s=resolveEncounter(s,list[0].id,.5);}};
 settle();for(let g=0;g<30&&s.stage==='review'&&s.age<until;g++){if(s.age===15&&priority)s={...s,profile:{...s.profile,priority}};const next=live(s);if(next===s)break;s=next;settle();}return {s,met,answered};};
const seeds=(by,k)=>Array.from({length:60},(_,i)=>(i+1)*7919+by+k*104729);

test('the summer on the building site opens the labourer’s road at twenty, and never at fifteen',()=>{
 let went=0,opened=0;
 for(const [k,cls] of [[0,'low_class'],[1,'working_class']])for(const by of [1970,1975,1981])for(const seed of seeds(by,k)){
  const {s,met,answered}=play(seed,cls,by,{want:{'school-leave':'go'}});
  assert.ok(!met.some(([id,age])=>id==='r_border_pm_1'&&age<20),'offered at fifteen: '+seed);
  if(!answered.includes('school-leave:go@15'))continue;went++;
  const other=met.find(([id,age])=>/^r_.*_1$/.test(id)&&id!=='r_border_pm_1'&&age<=20);
  if(other)continue;// another calling had already begun: it stays
  assert.equal(routeOf({...s,age:20}),'border_pm','seed '+seed);if(met.some(([id,age])=>id==='r_border_pm_1'&&age===20))opened++;
 }
 assert.ok(went>=20,'the building site was offered in '+went+' lives');assert.ok(opened>=10,'and the road opened in '+opened);
});

test('a band put first at fifteen, then school, opens the singer’s road at twenty',()=>{
 let tried=0,opened=0,quiet=0;
 for(const [k,cls] of [[0,'working_class'],[1,'middle_class']])for(const by of [1970,1975,1981,1990])for(const seed of seeds(by,k)){
  const a=play(seed,cls,by,{priority:'band',want:{'school-apprentice':'school'}}),stayed=a.s.history.some(r=>r.from===15&&['school','college'].includes(r.pathway));
  const other=a.met.find(([id,age])=>/^r_.*_1$/.test(id)&&id!=='r_singer_office_1'&&age<=20);
  if(stayed&&!other){tried++;assert.equal(routeOf({...a.s,age:20}),'singer_office','seed '+seed);if(a.met.some(([id])=>id==='r_singer_office_1'))opened++;}
  // The same birth without the band: no such promise.
  const b=play(seed,cls,by,{priority:'sport',want:{'school-apprentice':'school'}});if(!b.met.some(([id])=>id==='r_singer_office_1'))quiet++;
  assert.equal(validate(JSON.parse(JSON.stringify(a.s))),true);
 }
 assert.ok(tried>=100,'lives that put the band first and stayed in school: '+tried);assert.ok(opened/tried>=.7,'the scene was met in '+opened+' of '+tried);
 assert.ok(quiet>=300,'without the band most of these births never meet it: '+quiet);
});

test('leaving for the building site blocks classroom and college offers at twenty',()=>{
 const {s}=play(1,'working_class',1981,{until:20});
 const review={...s,effort:{...s.effort,iq:1},
  story:{...s.story,pending:null,seen:[]}};
 const bully=e=>e.id==='bully';
 const student={...review,history:[...review.history.slice(0,-1),{...review.history.at(-1),pathway:'school'}]};
 const worker={...student,history:[...student.history.slice(0,-1),{...student.history.at(-1),pathway:'work'}],
  pivots:[...student.pivots,{station:15,pivot:'school-leave',choice:'go'}]};
 assert.ok(eligibleEncounters(worker).some(bully),'existing saves still resolve this scene');
 assert.equal(offerEncounter(worker,0,bully),worker);
 assert.equal(offerEncounter(student,0,bully).story.pending.id,'bully');
 const coast={...worker,cash:10000,birth:{...worker.birth,regionId:'pak-phanang',region:'pak-phanang'}};
 for(const id of ['three-roads','college-cost'])assert.equal(fits(pivotById(id),coast),false,id);
 const workedAsChild={...review,cash:10000,childhood:{choices:[{age:9,choice:'school_say'}]}};
 assert.equal(fits(pivotById('college-cost'),{...workedAsChild,history:worker.history}),false);
 assert.equal(fits(pivotById('college-cost'),{...workedAsChild,history:student.history}),fits(pivotById('college-cost'),{...review,cash:10000,history:student.history}));

});

test('a school decision requires a living child old enough for it',()=>{
 for(const [id,age,parent] of [['child-city',50,35],['gifted-child',40,23]]){
  const question=pivotById(id);
  const review={age,story:{flags:{}}};
  assert.equal(fits(question,review),false,id);
  assert.equal(fits(question,{...review,story:{flags:{parent:age-2}}}),false,id);
  assert.equal(fits(question,{...review,story:{flags:{parent}}}),true,id);
  assert.equal(fits(question,{...review,story:{flags:{parent,childLost:age-1}}}),false,id);
 }
});
