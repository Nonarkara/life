import test from 'node:test';
import assert from 'node:assert/strict';
import {AXES,begin,configureLife,live,newLife,replay,validate,validPoints} from '../../dist/course/sim.js';
import {chapterPathways,chapterPlans} from '../../dist/course/chapter-play.js';
import {locksFor,pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {routeOf} from '../../dist/course/life-routes.js';
import {lifeArc} from "../../dist/course/life-verdict.js";
import {netWorth} from '../../dist/course/finance.js';
import {nextJourneyEvent} from '../../dist/course/journey.js';
import {chooseChild,acknowledgeChild,nextChildAge,pendingChildChoice} from '../../dist/course/childhood-choices.js';
import {replayComparison} from '../../dist/course/replay-compare.js';
import {translate} from '../../dist/course/i18n.js';

const birth=()=>configureLife(newLife(37),{birthYear:1981,class:'middle_class',sex:'female'});

test('three age-appropriate plans fit the ten-point budget and keep prior promises',()=>{
 const first=begin(birth());
 for(let age=10;age<80;age+=5){
  const state={...first,age,pivots:[{station:age,locks:{drive:4,eq:3}}]};
  const locks=locksFor(state),plans=chapterPlans(state);
  assert.equal(plans.length,3);
  for(const plan of plans){
   assert.ok(validPoints(plan.effort));
   for(const [key,value] of Object.entries(locks))assert.ok(plan.effort[key]>=value);
   assert.equal(plan.profile.priority,plan.id);
  }
 }
});

test('one changed dedication can open a different life route from the same birth',()=>{
 const childhood=begin(birth());
 const teen=live({...childhood,story:{...childhood.story,pending:null}});
 assert.equal(teen.age,15);
 const state={...teen,story:{...teen.story,pending:null}};
 const [exams,,band]=chapterPlans(state);
 const schoolLife=live({...state,...exams});
 const musicLife=live({...state,...band});
 assert.notDeepEqual(schoolLife.skills,musicLife.skills);
 assert.equal(routeOf(musicLife),'singer_office');
 assert.notEqual(routeOf(schoolLife),routeOf(musicLife));
 for(const next of [schoolLife,musicLife]){
  assert.ok(validate(JSON.parse(JSON.stringify(next))));
  const receipt=next.history.at(-1).chapterResult;
  for(const {key} of AXES)assert.equal(new Map(receipt.gains).get(key),next.skills[key]-state.skills[key]);
  assert.equal(receipt.worth,netWorth(next.finance)-netWorth(state.finance));
  assert.equal(receipt.health,Math.round(next.health)-Math.round(state.health));
  assert.equal(receipt.wellbeing,Math.round(next.wellbeing)-Math.round(state.wellbeing));
 }
});

test('chapter choices respect a closed school route and a tuition decision',()=>{
 const student={...begin(birth()),age:20,pathway:'vocational'};
 const routes=s=>chapterPathways(s).map(([id])=>id);
 assert.ok(routes(student).includes('college'));
 const left={...student,history:[{pathway:'vocational',pivots:[{station:15,pivot:'school-leave',choice:'go'}]}]};
 assert.deepEqual(routes(left),['vocational','independent','work']);
 const worked={...student,pathway:'work',pivots:[{station:20,pivot:'college-cost',choice:'work',pathway:'work'}]};
 assert.deepEqual(routes(worked),['work']);
 const studied={...student,pathway:'college',pivots:[{station:20,pivot:'college-cost',choice:'merit',pathway:'college'}]};
 assert.deepEqual(routes(studied),['college']);
});

test('step and watch share the same chronological event order across reload',()=>{
 const early={origin:'life',age:21,id:'illness'};
 const later={origin:'life',age:24,id:'accident'};
 const destination={history:[{age:25,events:[later,{origin:'planned',age:20,id:'trip'},early]}]};
 assert.equal(nextJourneyEvent(destination),early);
 const saved=JSON.parse(JSON.stringify({handled:['21:illness']}));
 assert.equal(nextJourneyEvent(destination,saved.handled),later);
 assert.equal(nextJourneyEvent(destination,['21:illness','24:accident']),null);
});

test('the new first choices and navigation carry all four translated packs',()=>{
 for(const lang of ['th','zh-CN','ja','ko']){
  for(const phrase of ['How will you spend the next five years?','Spend 10 effort points. Pick one.','Live to age 15 →','Next moment →','Return to the decision →']){
   assert.notEqual(translate(phrase,lang),phrase);
  }
 }
});

test('replaying the same childhood can open the scholarship question eleven years later',()=>{
 const start=configureLife(newLife(5),{class:'low_class',sex:'female',birthYear:1975});
 const chapter=(s,index,pathway)=>{
  const {effort,profile}=chapterPlans(s)[index];
  return live({...s,effort,profile,pathway,story:{...s.story,pending:null}});
 };
 function play(life,pick){
  let age=nextChildAge(life);
  while(age<10){
   const q=pendingChildChoice(life,age);
   life=acknowledgeChild(chooseChild(life,age,age===9?pick:q.options[0].id));
   age=nextChildAge(life);
  }
  return chapter(chapter(begin(life),1,'vocational'),2,'vocational');
 }
 const left=play(start,'school_say');
 const asked=play(replay(left),'school_ask_teacher');
 const offer=pendingPivots(asked).find(p=>p.id==='college-cost');
 assert.ok(offer);
 assert.ok(!pendingPivots(left).some(p=>p.id==='college-cost'));
 assert.ok(openOptions(offer,asked).some(o=>o.id==='merit'));
 const award=applyPivot(asked,offer,'merit');
 assert.equal(award.pathway,'college');
 assert.equal(award.pivotFlags.meritScholar,true);
 assert.ok(validate(award));
 const cmp=replayComparison(award);
 assert.deepEqual(cmp.split,{
  age:9,before:'Say your cousin should go',now:'Ask a teacher what other ways there are'
 });
});

test('opening the teenager’s own account cannot create a false twist in the ending',()=>{
 const life={history:[
  {age:10,health:90,wellbeing:70,cash:1000000},
  {age:15,health:90,wellbeing:70,cash:1000000,finance:{available:80,reserve:0,debt:0}}
 ]};
 assert.equal(lifeArc(life).twist,null);
});
