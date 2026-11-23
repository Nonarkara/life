// Play a declined job, market and league decision through to the rendered review.
import assert from 'node:assert/strict';
import {begin,configureLife,live,newLife,rand,validate} from '../../dist/course/sim.js';
import {applyPivot,openOptions,pendingPivots} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {jobsDue} from '../../dist/course/job-moves.js';
import {marketsDue} from '../../dist/course/market-moments.js';
import {leaguesDue} from '../../dist/course/league-bets.js';
import {chapterPlans} from '../../dist/course/chapter-play.js';
import {translate} from '../../dist/course/i18n.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const KEY='life-course-v2',birthYear=1955;
const declines={job:'stay',market:'out',league:'stay'};
const prefixes={job:'job',market:'set',league:'lg'};
const fixtures=new Map();

function settleIncident(state){
 const scene=encounterById(state.story.pending?.id);
 if(!scene)return state;
 const option=scene.options.find(o=>choiceAvailable(state,o));
 return resolveEncounter(state,option.id,rand(state.seed,state.age,'encounter-result'));
}
function nextChapter(state){
 const waiting=pendingPivots(state);
 for(const p of waiting)state=applyPivot(state,p,p.job?'stay':p.league?'stay':p.market?'out':openOptions(p,state)[0].id);
 const plan=chapterPlans(state)[0];
 return plan?live({...state,effort:plan.effort,profile:plan.profile}):state;
}
function outcome(state,kind,year){
 const read=kind==='job'?age=>jobsDue(state.pivotFlags,age,1000,birthYear):
  kind==='market'?age=>marketsDue(state.pivotFlags,age,birthYear):
  age=>leaguesDue(state.pivotFlags,age);
 for(let from=state.age;from<80;from+=5){
  const result=read(from).find(o=>o.year===year);
  if(result)return {...result,age:from+5};
 }
 return null;
}
for(let seed=1;seed<=90&&fixtures.size<3;seed++){
 let state=begin(configureLife(newLife(seed*7919),{birthYear,class:'high_class',sex:'female'}));
 for(let turn=0;turn<14&&state.stage==='review';turn++){
  state=settleIncident(state);
  for(const kind of Object.keys(declines)){
   if(fixtures.has(kind))continue;
   const pending=pendingPivots(state);
   const p=pending[0];
   if(!p?.[kind])continue;
   const option=p.options.find(o=>o.id===declines[kind]);
   const refused=applyPivot(state,p,option.id),result=outcome(refused,kind,p[kind]);
   if(!result||!validate(state)||!validate(refused))continue;
   // Select a case with an arrival encounter that might displace the chapter record.
   let later=refused;
   while(later.stage==='review'&&later.age<result.age){
    const next=nextChapter(settleIncident(later));if(next.age<=later.age)break;later=next;
   }
   if(later.age===result.age&&later.stage==='review'&&later.story?.pending&&later.history.at(-1).event.includes(result.text)){
    assert.equal(result.gain,0);
    fixtures.set(kind,{state,p,option,result,flag:prefixes[kind]+p[kind]+'o'});
   }
  }
  const next=nextChapter(state);if(next.age<=state.age)break;state=next;
 }
}
assert.equal(fixtures.size,3,'find three recorded offer and arrival-encounter fixtures');

const browser=await chromium.launch({headless:true,channel:'chrome'});
const base=process.env.BASE||'http://127.0.0.1:4219';
try{
 for(const [kind,{state,p,option,result,flag}] of fixtures){
  for(const [language,width,height] of kind==='job'?[['en',390,844],['th',1440,900]]:[['en',390,844]]){
   const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block',reducedMotion:'reduce'});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.setDefaultTimeout(12000);
   await page.addInitScript(({state,language,KEY})=>{
    if(!localStorage.getItem(KEY))localStorage.setItem(KEY,JSON.stringify(state));
    localStorage.setItem('life-preferences-v1',JSON.stringify({language,size:'standard',motion:false,stage:'hybrid',palette:'auto',v:3}));
   },{state,language,KEY});
   await page.goto(base+'/course/',{waitUntil:'domcontentloaded'});
   const snapshot=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
   const dialog=page.locator('.decision-dialog[open]');
   const select=dialog.locator('.pivot-option',{hasText:translate(option.label,language)});
   await select.click();
   assert.equal((await snapshot()).pivotFlags[flag],state.age);
   let noDecisionImpact;
   for(let step=0;step<80;step++){
    const life=await snapshot();
    if(await dialog.count()){
     const next=dialog.locator('#year-event-continue:visible,#decision-continue:visible');
     if(await next.count()){await next.first().click();continue;}
     const pager=dialog.locator('.decision-pager:visible');
     if(await pager.count()&&(await pager.textContent()).includes('→'))await pager.click();
     await dialog.locator('.pivot-option:visible:enabled,.encounter-choice:visible:enabled').first().click();
     continue;
    }
    if(life.age>=result.age)break;
    if(await page.locator('#next-moment').isVisible()){await page.locator('#next-moment').click();continue;}
    await page.locator('.chapter-choice').first().click();
    const ready=await snapshot();
    if(ready.age+5===result.age){
     const expected=live(ready),control=live({...ready,pivotFlags:Object.fromEntries(Object.entries(ready.pivotFlags).filter(([k])=>k!==flag))});
     assert.ok(expected.history.at(-1).event.includes(result.text));
     noDecisionImpact=control.history.at(-1).setback;
     assert.equal(expected.history.at(-1).setback,noDecisionImpact);
    }
    await page.locator('#commit').click();
   }
   const arrived=await snapshot(),row=arrived.history.at(-1);
   assert.equal(arrived.age,result.age);
   assert.ok(row.event.includes(result.text),'the later review ledger records the declined offer');
   assert.equal(row.setback,noDecisionImpact,'the declined choice leaves the financial adjustment unchanged');
   assert.ok(arrived.history.slice(0,-1).every(r=>!r.event.includes(result.text)),'no earlier review knows the outcome');
   const latest=page.locator('.latest-event');
   await latest.locator('summary').click();
   const line=latest.locator('#last-event');
   await line.waitFor();
   const translated=translate(result.text,language);
   assert.ok((await line.innerText()).includes(translated),kind+' outcome survives the arrival encounter');
   await page.waitForFunction(({translated})=>{
    const line=document.getElementById('last-event'),text=line?.firstChild;
    if(!text)return false;
    const start=text.textContent.indexOf(translated);
    if(start<0)return false;
    const selection=document.createRange();
    selection.setStart(text,start);selection.setEnd(text,start+translated.length);
    const boxes=[...selection.getClientRects()];
    return boxes.length>0&&boxes.every(r=>r.top>=0&&r.bottom<=innerHeight&&
     line.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)));
   },{translated});
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('.latest-event summary').click();
   assert.ok((await page.locator('#last-event').innerText()).includes(translated));
   assert.deepEqual(errors,[]);
   console.log(JSON.stringify({kind,language,width,offer:p.id,age:result.age,line:translated,financialAdjustmentFromDecline:0,arrivalEncounter:arrived.story.seen.at(-1)?.age===arrived.age}));
   await context.close();
  }
 }
}finally{await browser.close();}
