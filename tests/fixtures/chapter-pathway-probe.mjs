// The same birth and effort choice can study or work in the default planner.
import assert from 'node:assert/strict';
import {begin,configureLife,live,newLife,rand,validate} from '../../dist/course/sim.js';
import {applyPivot,openOptions,pendingPivots} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {translate} from '../../dist/course/i18n.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const KEY='life-course-v2';
const base=process.env.BASE||'http://127.0.0.1:4219';

function finishDecisions(state){
 for(let step=0;step<20;step++){
  const pivot=pendingPivots(state)[0];
  if(pivot){
   state=applyPivot(state,pivot,openOptions(pivot,state)[0].id);
   continue;
  }
  const scene=encounterById(state.story.pending?.id);
  if(!scene)return state;
  const choice=scene.options.find(option=>choiceAvailable(state,option));
  state=resolveEncounter(state,choice.id,rand(state.seed,state.age,'encounter-result'));
 }
 throw new Error('Unresolved setup decisions');
}
const birth=configureLife(newLife(21),{birthYear:1981,class:'middle_class',sex:'female'});
const atTen=finishDecisions(begin(birth));
const atFifteen=finishDecisions(live(atTen));
const fixture=finishDecisions(live(atFifteen));
assert.equal(fixture.age,20);
assert.ok(validate(fixture));

const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
const results={};
try{
 const opening=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'});
 const first=await opening.newPage();
 await first.goto(base+'/intake/',{waitUntil:'domcontentloaded'});
 await first.locator('#random-life:enabled').waitFor();
 await first.locator('#starting-conditions > summary').click();
 await first.locator('#birth-era').selectOption('1949');
 assert.match(await first.locator('#era-note').innerText(),/Thailand recovers after the war/);
 await first.locator('#random-life').click();
 await first.locator('#birth-card[open]').waitFor();
 const facts=await first.locator('#birth-facts').innerText();
 assert.match(facts,/Post-war & Canal Era/);
 assert.doesNotMatch(facts,/enter Bangkok|reach age 77/);
 await first.addInitScript(({atTen,KEY})=>localStorage.setItem(KEY,JSON.stringify(atTen)),{atTen,KEY});
 await first.goto(base+'/course/',{waitUntil:'domcontentloaded'});
 await first.locator('.top-world .tick-line').first().waitFor({state:'attached'});
 assert.equal(await first.locator('.top-world .gauge').count(),0);
 assert.equal(await first.locator('#chapter-pathway').count(),0);
 await opening.close();

 for(const [pathway,language,size] of [['college','en','standard'],['work','th','extra']]){
  const width=390,height=844;
  const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.setDefaultTimeout(12000);
  await page.addInitScript(({fixture,language,size,KEY})=>{
   if(!localStorage.getItem(KEY))localStorage.setItem(KEY,JSON.stringify(fixture));
   localStorage.setItem('life-preferences-v1',JSON.stringify({language,size,motion:false,stage:'hybrid',palette:'auto',v:3}));
  },{fixture,language,size,KEY});
  await page.goto(base+'/course/',{waitUntil:'domcontentloaded'});
  const snapshot=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
  const plan=page.locator('.chapter-choice[data-chapter-plan="career"]');
  const road=page.getByLabel(translate('Study or work',language),{exact:true});
  await road.waitFor();
  assert.ok(await page.locator('.top-world .gauge').count()>0,'the 20-year-old sees economic data');
  assert.deepEqual(await road.locator('option').evaluateAll(options=>options.map(option=>option.value)),
   ['vocational','independent','college','work']);
  await road.selectOption(pathway);
  await plan.click();
  assert.equal(await road.inputValue(),pathway);
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await road.inputValue(),pathway);
  const commit=page.locator('#commit');
  await page.waitForFunction(()=>{
   const button=document.getElementById('commit');
   const box=button.getBoundingClientRect();
   return box.height>=44&&box.bottom<=innerHeight&&button.contains(document.elementFromPoint(box.x+box.width/2,box.y+box.height/2));
  });
  assert.ok(await road.evaluate(select=>{
   const box=select.getBoundingClientRect();
   return box.height>=44&&box.top>=0&&box.bottom<=innerHeight&&
    document.elementFromPoint(box.x+box.width/2,box.y+box.height/2)===select;
  }),'the pathway is visible and tappable beside the next action');
  await commit.click();
  for(let step=0;step<20;step++){
   if((await snapshot()).age===25)break;
   await page.locator('#year-event-continue:visible,#next-moment:visible').first().click();
  }
  const played=await snapshot();
  assert.equal(played.age,25);
  assert.equal(played.history.at(-1).pathway,pathway);
  assert.ok(validate(played));
  assert.deepEqual(errors,[]);
  results[pathway]=played.history.at(-1);
  await context.close();
 }
}finally{await browser.close();}
assert.deepEqual(results.college.effort,results.work.effort);
assert.ok(results.college.pathwayLearning>results.work.pathwayLearning);
assert.ok(results.college.earnings<results.work.earnings);
