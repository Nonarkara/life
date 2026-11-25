// Play ordinary shared births through the public entry and chapter controls.
import assert from 'node:assert/strict';
import {configureLife,newLife,validate} from '../../dist/course/sim.js';
import {encodeBirth} from '../../dist/course/birthcode.js';
import {SAVE_KEY} from '../../dist/course/save.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE||'http://127.0.0.1:4543';
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
const births=[
 [5,1975,'low_class','female'],
 [29,1981,'middle_class','female'],
 [31,1997,'working_class','male']
];

async function play([seed,birthYear,cls,sex],watch,toEnd=false){
 const code=encodeBirth(configureLife(newLife(seed),{birthYear,class:cls,sex}));
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
 try{
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);
  const dialog=page.locator('.decision-dialog[open]');
  const plan=page.locator('.chapter-choice:visible');
  const button=page.locator('#commit:visible:enabled');
  const next=page.locator('#year-event-continue:visible,#decision-continue:visible,#child-continue:visible').first();
  const options=dialog.locator('.pivot-option:visible:enabled,.encounter-choice:visible:enabled');
  await page.goto(base+'/intake/?birth='+code,{waitUntil:'domcontentloaded'});
  await page.locator('#birth-card[open] #birth-begin').click();
  await page.locator('#arrival-choice:visible').click();
  let review,watched=false,lastAge,target;
  for(let step=0;step<240;step++){
   const life=await read();
   if(life.stage==='recap'){
    assert.ok(toEnd&&review);
    await page.locator('.ending-verdict').waitFor();
    await page.locator('.replay-childhood').click();
    await dialog.locator('.child-replay-memory').waitFor();
    assert.equal(encodeBirth(await read()),code);
    break;
   }
   if(life.age===25&&!review){
    review=life.history.find(row=>row.age===25);
    assert.ok(review&&validate(life));
    if(!toEnd)break;
   }
   if(await next.count()){await next.click();continue;}
   if(await options.count()){await options.first().click();continue;}
   if(await plan.count()){
    target=life.age+5;
    await plan.first().click();
    if(watch){await page.locator('.chapter-watch:visible').filter({hasText:'Watch these years'}).click();watched=true;}
    else await button.click();
    continue;
   }
   if(!watch&&await page.locator('#next-moment:visible').count()){
    await page.locator('#next-moment').click();
    continue;
   }
   if(watch&&target>life.age&&await page.locator('#next-moment:visible').count()){
    // A reduced-motion Watch reaches the next event or the next review on its own.
    await page.waitForFunction(({key,age})=>JSON.parse(localStorage.getItem(key)).age>=age||
     !!document.querySelector('.decision-dialog[open]'),{key:SAVE_KEY,age:target});
    continue;
   }
   if(await button.count()){await button.click();continue;}
   await page.locator('.decision-dialog[open],.chapter-choice:visible,#next-moment:visible,#commit:visible:enabled,.ending-verdict').first().waitFor();
   lastAge=life.age;
  }
  assert.ok(review,'the ordinary life reached its age-25 record (last wait: '+lastAge+')');
  if(watch)assert.ok(watched);
  if(toEnd)assert.ok((await read()).previous?.age>=25,'ordinary life reached its ending and restarted');
  assert.deepEqual(errors,[]);
  return review;
 }finally{await context.close();}
}

try{
 const [first,...others]=births;
 const quick=await play(first,false,true);
 const watched=await play(first,true);
 for(const key of ['pathway','event','earnings','setback','finance','events','pivots']){
  assert.deepEqual(watched[key],quick[key],key+' agrees across Quick advance and Watch');
 }
 for(const birth of others)await play(birth,false);
}finally{await browser.close();}
