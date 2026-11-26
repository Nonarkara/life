import assert from 'node:assert/strict';
import {begin,configureLife,live,newLife} from '../../dist/course/sim.js';
import {applyPivot,openOptions,pendingPivots} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';

function fixture(seed,age,birth){
 const initial=newLife(seed);
 let state=begin(birth?configureLife(initial,birth):initial);
 for(let step=0;step<120&&state.stage==='review';step++){
  const pivot=pendingPivots(state)[0];
  if(pivot){
   const option=openOptions(pivot,state)[0];
   if(option){state=applyPivot(state,pivot,option.id);continue;}
  }
  const encounter=encounterById(state.story.pending?.id);
  if(encounter){
   const option=encounter.options.find(o=>choiceAvailable(state,o));
   state=resolveEncounter(state,option.id,.2);
   continue;
  }
  if(state.age===age)return state;
  state=live(state);
 }
 assert.equal(state.stage,'recap');
 return state;
}

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:process.env.LIFE_BROWSER_CHANNEL||'chrome',headless:true});
const base=process.env.BASE||'http://127.0.0.1:48581';
const review=fixture(11*7919,15,{class:'working_class',region:'samut-prakan',birthYear:1981,moves:null});
assert.equal(review.age,15);
async function open(state,width,height,size='normal'){
 const page=await browser.newPage({viewport:{width,height},hasTouch:width<600,reducedMotion:'reduce'});
 const errors=[];
 let releasePack;
 if(width===390&&size==='normal'&&state.stage==='review'){
  const ready=new Promise(resolve=>{releasePack=resolve;});
  await page.route(/\/language\/th-[a-f0-9]+\.js$/,async route=>{await ready;await route.continue();});
 }
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(({state,size})=>{
  localStorage.setItem('life-course-v2',JSON.stringify(state));
  localStorage.setItem('life-preferences-v1',JSON.stringify({language:'th',size,motion:false}));
 },{state,size});
 await page.goto(base+'/course/',{waitUntil:'domcontentloaded'});
 return {page,errors,releasePack};
}
try{
 for(const [width,height,size] of [[390,844,'normal'],[390,844,'extra'],[1024,768,'normal'],[1440,900,'normal']]){
  const {page,errors,releasePack}=await open(review,width,height,size);
  const choices=page.locator('.chapter-choice');
  const advance=page.locator('#commit');
  const adjust=page.locator('.chapter-switch');
  await choices.first().waitFor();
  if(releasePack){
   assert.match(await page.locator('.chapter-cost').textContent(),/^Pick one\./);
   releasePack();
  }
  await page.waitForFunction(()=>document.querySelector('.chapter-cost')?.textContent.includes('เลือกหนึ่งอย่าง'));
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await choices.count(),3);
  assert.ok(await advance.isDisabled());
  const metrics=await page.evaluate(()=>{
   const world=document.querySelector('.stage canvas:not([hidden])').getBoundingClientRect();
   const advance=document.querySelector('#commit').getBoundingClientRect();
   const panel=document.querySelector('#console-plan').getBoundingClientRect();
   const adjust=document.querySelector('.chapter-switch').getBoundingClientRect();
   const choices=[...document.querySelectorAll('.chapter-choice')].map(e=>e.getBoundingClientRect().height);
   const metrics=[...document.querySelectorAll('.chapter-choice small')].map(el=>el.getBoundingClientRect().left);
   return {world:world.height,advanceBottom:advance.bottom,panelBottom:panel.bottom,adjustCenter:(adjust.top+adjust.bottom)/2,advanceCenter:(advance.top+advance.bottom)/2,choices,metrics};
  });
  assert.ok(metrics.advanceBottom<=Math.min(metrics.panelBottom,height)+1,JSON.stringify(metrics));
  assert.ok(Math.abs(metrics.advanceCenter-metrics.adjustCenter)<2, JSON.stringify(metrics));
  assert.ok(metrics.world>height*(width===390?(size==='extra'?.45:.43):.52),JSON.stringify(metrics));
  assert.ok(metrics.choices.every(h=>h>=44),JSON.stringify(metrics));
  if(width===1440)assert.match(await page.locator('.year-head').textContent(),/1996/);
  if(process.env.LIFE_DOCK_SHOTS)await page.screenshot({path:`${process.env.LIFE_DOCK_SHOTS}/dated-review-${width}-${size}.png`});
  if(width===390){
   assert.ok(Math.max(...metrics.metrics)-Math.min(...metrics.metrics)<2,JSON.stringify(metrics));
   if(size==='normal')assert.ok(metrics.choices.every(h=>h<=48),JSON.stringify(metrics));
  }
  await choices.first().click();
  assert.equal(await choices.first().getAttribute('aria-pressed'),'true');
  assert.ok(await advance.isEnabled());
  if(width===390){
   const panel=page.locator('#console-plan');
   const advanceBox=await advance.boundingBox(),panelBox=await panel.boundingBox();
   assert.ok(advanceBox.y+advanceBox.height<=panelBox.y+panelBox.height+1);
   if(process.env.LIFE_DOCK_SHOTS)await page.screenshot({path:`${process.env.LIFE_DOCK_SHOTS}/selected-390-${size}.png`});
  }
  await adjust.focus();
  await page.keyboard.press('Space');
  assert.equal(await adjust.getAttribute('aria-expanded'),'true');
  assert.ok(await adjust.evaluate(el=>document.activeElement===el));
  await page.keyboard.press('Space');
  assert.equal(await adjust.getAttribute('aria-expanded'),'false');
  assert.ok(await advance.isEnabled());
  if(width===390){
   const year=page.locator('.top-world');
   assert.ok(await year.isHidden());
   await page.locator('.top-more').click();
   assert.ok(await year.isVisible());
   await page.locator('.top-more').click();
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  assert.deepEqual(errors,[]);
  await page.close();
 }
 const {page,errors}=await open(fixture(3*7919,99),1024,768);
 const route=page.locator('.ending-route');
 const verdict=page.locator('.ending-verdict');
 await route.waitFor();
 const routeBox=await route.boundingBox(),verdictBox=await verdict.boundingBox();
 assert.ok(routeBox.width>=420,`the route was only ${routeBox.width}px wide`);
 assert.ok(Math.abs(routeBox.y-verdictBox.y)<2);
 assert.ok(await route.evaluate(el=>el.nextElementSibling?.classList.contains('ending-score')));
 assert.match(await route.locator('canvas').getAttribute('aria-label'),/75/);
 assert.ok(await page.locator('#commit').isHidden());
 assert.equal(await page.locator('.ending-score a.ending-rewind').getAttribute('href'),'../intake/?next=1');
 if(process.env.LIFE_DOCK_SHOTS)await page.screenshot({path:`${process.env.LIFE_DOCK_SHOTS}/recap-1024.png`});
 await page.locator('.ending-score details summary').click();
 assert.ok(await page.locator('.ending-score details').evaluate(el=>el.open));
 assert.deepEqual(errors,[]);
 await page.close();
}finally{
 await browser.close();
}
