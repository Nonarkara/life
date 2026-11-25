// Build and restart preview first. BASE=https://life.nonarkara.org LANGUAGE=th PLAYWRIGHT_MODULE=/path/playwright/index.mjs node tests/fixtures/notebook-design-probe.mjs
// Covers visual task budgets and real history, fresh, active, and restored-decision flows.
import assert from 'node:assert/strict';
import {newLife,begin,live,configureLife,validate} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {planBucket} from '../../dist/course/bucket-list.js';
import {dealtStops,setStop} from '../../dist/course/life-collection.js';
import {encodeBirth} from '../../dist/course/birthcode.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
let demoTurn=null,edgeTurn=null;
let ended=begin(configureLife(newLife(5426),{class:'middle_class',sex:'female',birthYear:1981}));
for(let i=0;i<90&&ended.stage!=='recap';i++){
 if(!edgeTurn&&ended.age>=15&&ended.story?.pending&&pendingPivots(ended)[0]){const q=pendingPivots(ended)[0],o=openOptions(q,ended)[0];edgeTurn={id:[ended.seed.toString(36),ended.age,q.id].join('.'),scene:q.id,title:q.heading??q.prompt,answer:o.label,met:[],state:structuredClone({...ended,previous:null})};}
 if(ended.story?.pending){const e=encounterById(ended.story.pending.id);ended=resolveEncounter(ended,e.options.find(o=>choiceAvailable(ended,o)).id,.5);continue;}
 for(let j=0;j<12;j++){const pivot=pendingPivots(ended)[0];if(!pivot)break;const option=openOptions(pivot,ended)[0];if(!demoTurn&&ended.age>=15)demoTurn={id:'notebook-real-fork',scene:pivot.id,title:pivot.heading??pivot.prompt,answer:option.label,met:[],state:structuredClone({...ended,previous:null})};ended=applyPivot(ended,pivot,option.id);}
 if(ended.story?.pending){const e=encounterById(ended.story.pending.id);ended=resolveEncounter(ended,e.options.find(o=>choiceAvailable(ended,o)).id,.5);continue;}
 if(ended.age>=15){ended=planBucket(ended,'library',ended.age+1);ended=setStop(ended,dealtStops(ended)[0]);}
 ended=live(ended);
}
assert(validate(ended));assert.equal(ended.stage,'recap');
const fresh=configureLife(newLife(333),{class:'working_class',sex:'male',birthYear:1981});assert(validate(fresh));

const base=process.env.BASE||'http://127.0.0.1:4305',language=process.env.LANGUAGE||'en';
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
try{
 for(const [scenario,width,enlarged] of [['history',390,false],['history',1024,false],['history',1440,false],['history',390,true],['fresh',390,false],['active',390,false],['edge',390,false],['historyactive',390,false]]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'reduce',serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({ended,fresh,language,demoTurn,edgeTurn,scenario,enlarged})=>{if(scenario==='history'||scenario==='edge'||scenario==='historyactive'){if(!localStorage.getItem('life-course-v2'))localStorage.setItem('life-course-v2',JSON.stringify(ended));localStorage.setItem('life-turning-points-v1',JSON.stringify([scenario==='edge'?edgeTurn:demoTurn]));}if(scenario==='active')localStorage.setItem('life-course-v2',JSON.stringify(fresh));localStorage.setItem('life-preferences-v1',JSON.stringify({language,size:enlarged?'extra':'standard',motion:true}));},{ended,fresh,language,demoTurn,edgeTurn,scenario,enlarged});
  if(scenario==='history'||scenario==='edge'||scenario==='historyactive'){await page.goto(base+'/course/',{waitUntil:'domcontentloaded'});await page.locator('.score-total').waitFor({timeout:45000});
   await page.evaluate(({fresh,scenario})=>{const entries=JSON.parse(localStorage.getItem('life-lives-v1'));const summary=entries[0];for(let i=0;i<6;i++){const old={...summary,id:'notebook-old-'+i};delete old.album;entries.push(old);}localStorage.setItem('life-lives-v1',JSON.stringify(entries));if(scenario==='historyactive')localStorage.setItem('life-course-v2',JSON.stringify(fresh));},{fresh,scenario});
  }
  await page.goto(base+'/intake/',{waitUntil:'domcontentloaded'});await page.locator('#random-life:not([disabled])').waitFor();
  const cssErrors=await page.evaluate(async()=>{const href=document.querySelector('link[href*="intake-notebook.css"]').href,text=await(await fetch(href)).text();return [...text.matchAll(/(?:[;{])([\w-]+):([^;{}]+)/g)].filter(([,property,value])=>!property.startsWith('--')&&!CSS.supports(property,value.trim())).map(([,property,value])=>property+':'+value.trim());});assert.deepEqual(cssErrors,[],'notebook stylesheet uses recognized CSS declarations');
  const metric=await page.evaluate(()=>{const box=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,font:getComputedStyle(e).fontSize,background:getComputedStyle(e).backgroundColor};};return {overflow:document.documentElement.scrollWidth>innerWidth,draw:box('#random-life'),life:box('.remembered-identity h2'),fork:box('.fork-again'),editorOpen:document.querySelector('#starting-conditions').open,fullOpen:!!document.querySelector('.recent-life .life-album[open]'),groups:document.querySelectorAll('.remembered-collection p').length,continue:box('#continue-life'),bodyFont:getComputedStyle(document.body).fontSize,bodyHeight:document.body.scrollHeight};});
  assert.equal(metric.overflow,false);assert.equal(metric.editorOpen,false);
  await page.screenshot({path:`/tmp/notebook-review-${language}-${scenario}-${width}${enlarged?'-extra':''}.png`});
  if(scenario==='history'||scenario==='historyactive'){
   assert.equal(metric.fullOpen,false);assert.ok(metric.groups<=3);if(!enlarged)assert.ok(metric.fork.bottom<=844||width>390,'phone replay must precede the ledger');if(enlarged)assert.ok(parseFloat(metric.bodyFont)>=20.9,'Extra Large must actually enlarge type');assert.ok((await page.locator('.remembered-era').innerText()).includes('1981'));
   const href=await page.locator('.fork-again').getAttribute('href');assert.match(href,/turning=notebook-real-fork/);assert.equal(await page.locator('.remembered-fork h3').innerText(),language==='en'?demoTurn.title:await page.locator('.remembered-fork h3').innerText());
   assert.equal(await page.locator('.notebook-locator .birth-province').count(),1);
   const storage=await page.evaluate(()=>({active:localStorage.getItem('life-course-v2'),archive:localStorage.getItem('life-lives-v1'),taste:localStorage.getItem('life-taste-v1')}));
   await page.locator('.recent-life .life-album summary').click();assert.ok((await page.locator('.recent-life .life-album').innerText()).includes(language==='th'?'ห้องสมุด':'library'));await page.locator('.recent-life .life-album summary').click();
   await page.locator('#lives-summary').click();assert.equal(await page.locator('#lives-list > li').count(),6);const old=page.locator('#lives-list > li').last().locator('.life-album');await old.locator('summary').click();assert.match(await old.innerText(),language==='th'?/ไม่มีอัลบั้ม/:/no saved album/);
   assert.deepEqual(await page.evaluate(()=>({active:localStorage.getItem('life-course-v2'),archive:localStorage.getItem('life-lives-v1'),taste:localStorage.getItem('life-taste-v1')})),storage);
   if(width===390&&!enlarged){await page.locator('.fork-again').click();await page.locator('#pivot-title').waitFor();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('life-course-v2')).age),demoTurn.state.age);}
  }
  if(scenario==='fresh'){
   await page.locator('#random-life').click();await page.locator('#birth-card[open]').waitFor();await page.locator('#birth-edit').click();assert.equal(await page.locator('#starting-conditions').getAttribute('open'),'');assert.equal(await page.evaluate(()=>document.activeElement.id),'birth-era');
  }
  if(scenario==='edge'){
   assert(edgeTurn?.state.story.pending);await page.locator('.fork-again').click();await page.locator('#pivot-title').waitFor();
   const loaded=await page.evaluate(()=>JSON.parse(localStorage.getItem('life-course-v2')));assert.equal(loaded.story.pending.id,edgeTurn.state.story.pending.id,'foregrounding pivot must not erase pending incident');assert.equal(pendingPivots(loaded)[0].id,edgeTurn.scene);
  }
  if(scenario==='active'){
   assert.ok(await page.locator('#continue-life').isVisible());assert.ok(['transparent','rgba(0, 0, 0, 0)'].includes(metric.continue.background),'continuation stays a quiet link rather than a second amber action');const prior=await page.evaluate(()=>localStorage.getItem('life-course-v2'));await page.locator('#random-life').click();await page.locator('#birth-card[open]').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('life-course-v2')),prior,'drawing must not replace active session before Begin');
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({scenario,width,enlarged,language,errors,...metric}));await page.close();
 }
}finally{await browser.close();}
