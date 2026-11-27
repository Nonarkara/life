import assert from 'node:assert/strict';
import {crisisRecord} from '../../dist/course/crisis-chapter.js';
import {translate} from '../../dist/course/i18n.js';
import {validate} from '../../dist/course/sim.js';
import {playerSlotBirth} from '../../dist/course/taste-engine.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
const base=process.env.BASE||'http://127.0.0.1:48571';
const sizes=process.env.JULY_WIDTH?[[Number(process.env.JULY_WIDTH),process.env.JULY_LANGUAGE||'en',process.env.JULY_SIZE||'standard']]:[[390,'th','extra'],[1024,'en','standard'],[1440,'en','standard']];
const ordinary=JSON.stringify(playerSlotBirth(13));
const checkpoints='{"seed":107513,"backs":0,"points":{}}';
try{
 for(const [width,language,size] of sizes){
  const t=text=>translate(text,language);
  const context=await browser.newContext({
   viewport:{width,height:width===1440?900:844},hasTouch:width<=390,reducedMotion:'reduce',
   permissions:['clipboard-read','clipboard-write']
  });
  const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('july-1997:life-course-v2')));
  page.setDefaultTimeout(10_000);
  await page.addInitScript(({ordinary,checkpoints,language,size})=>{
   if(location.origin==='null')return;
   localStorage.setItem('life-preferences-v1',JSON.stringify({language,size,motion:true}));
   if(localStorage.getItem('life-course-v2')===null)localStorage.setItem('life-course-v2',ordinary);
   if(localStorage.getItem('life-checkpoints-v1')===null)localStorage.setItem('life-checkpoints-v1',checkpoints);
  },{ordinary,checkpoints,language,size});

  const shot=async name=>{if(process.env.JULY_SHOTS)await page.screenshot({path:process.env.JULY_SHOTS+'/'+width+'-'+name+'.png',animations:'disabled'});};
  const tap=async button=>{
   await button.waitFor();
   const box=await button.boundingBox();
   assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=(width===1440?901:845),
    'control fits on screen: '+await button.textContent()+' '+JSON.stringify(box));
   if(width<=390)assert.ok(box.height>=44&&box.width>=44,'phone action has a 44px target');
   await button.click({trial:true});
   await button.click();
  };

  await page.goto(base+'/course/july-1997.html?lang='+language);
  const launch=page.getByRole('link',{name:t('Play the Yaowarat episode →')});
  await launch.waitFor();
  assert.ok((await launch.boundingBox()).y<400,'play comes before the short stories');
  await shot('entry');
  await launch.focus();
  await page.keyboard.press('Enter');
  const dialog=page.locator('.decision-dialog[open]');
  const offer=dialog.getByRole('heading',{name:t('A finance company offers nearly a third more pay for a job starting in 1996.')});
  await offer.waitFor();
  assert.equal(await page.locator('html').getAttribute('lang'),language);
  assert.equal(await offer.evaluate(el=>el===document.activeElement),true);
  assert.ok((await dialog.innerText()).includes(t('Yaowarat, 1995')));
  await page.waitForFunction(()=>!!localStorage.getItem('july-1997:life-course-v2'));
  const start=await read();
  assert.ok(validate(start));
  assert.equal(start.age,20);
  assert.equal(start.seed,107504);
  assert.equal(start.birth.region,'yaowarat');

  const choose=async label=>{
   const pager=dialog.locator('.decision-pager:visible');
   if(await pager.count()&&await dialog.getAttribute('data-reading-stage')==='context')await tap(pager);
   await tap(dialog.locator('.pivot-option').filter({hasText:t(label)}));
  };
  for(const [index,offerLabel,promiseLabel,job,support] of [
   [0,'Take the finance job','Put money in the envelope','move','pay'],
   [1,'Stay where you are','Take a regular shift at home','stay','time']
  ]){
   await offer.waitFor();
   assert.equal((await dialog.innerText()).includes(t('In your previous life, the baht floated on 2 July 1997.')),index===1);
   await shot(index?'replay':'offer');
   await choose(offerLabel);
   const promise=dialog.getByRole('heading',{name:t('The envelope on the table')});
   await promise.waitFor();
   if(index===0)await page.reload({waitUntil:'domcontentloaded'});
   await promise.waitFor();
   await shot('promise-'+index);
   await choose(promiseLabel);
   await tap(page.getByRole('button',{name:t('Live through the chapter →')}));
   const event=dialog.getByRole('heading',{name:t('The envelope in 1997')});
   await event.waitFor();
   assert.ok(await dialog.getByRole('link',{name:t('On 2 July 1997, Thailand floated the baht.')}).isVisible());
   if(index===0)await page.reload({waitUntil:'domcontentloaded'});
   await event.waitFor();
   await shot('crisis-'+index);
   await tap(dialog.locator('#year-event-continue'));

   const review=page.getByRole('heading',{name:t(index?'Two lives in Yaowarat':'What happened to your promise?')});
   try{await review.waitFor();}
   catch(error){
    await shot('failure');
    console.error({errors,stage:(await read())?.stage,age:(await read())?.age,
     page:await page.locator('body').innerText().then(text=>text.slice(0,2000))});
    throw error;
   }
   assert.equal(await review.evaluate(el=>el===document.activeElement),true);
   const saved=await read();
   assert.ok(validate(saved));
   assert.equal(saved.age,25);
   assert.equal(saved.finance.receipts.filter(r=>r.id==='period:20-25').length,1);
   const record=crisisRecord(saved);
   assert.equal(record.offer,job);
   assert.equal(record.support,support);
   assert.equal(record.householdPayment,index===0?1800:0);
   assert.equal(saved.history.at(-1).effort.eq,index===0?0:2);
   assert.equal(record.wagePremium>0,index===0);
   await page.reload({waitUntil:'domcontentloaded'});
   await review.waitFor();
   assert.deepEqual(await read(),saved);
   await shot(index?'comparison':'review');
   if(index===0)await tap(page.getByRole('button',{name:t('Return to the job offer →')}));
  }

  const comparison=page.locator('.july-comparison');
  assert.equal(await comparison.locator('tbody tr').count(),3);
  for(const phrase of ['First run','New job','Old job','2 effort points']){
   assert.ok((await comparison.innerText()).includes(t(phrase)));
  }
  await tap(page.getByRole('button',{name:t('Copy episode link')}));
  const link=await page.evaluate(()=>navigator.clipboard.readText());
  const url=new URL(link);
  assert.equal(url.searchParams.get('episode'),'july-1997');
  assert.equal(url.searchParams.get('lang'),language);
  assert.equal(url.searchParams.size,2);
  assert.deepEqual(await page.evaluate(()=>[
   localStorage.getItem('life-course-v2'),localStorage.getItem('life-checkpoints-v1'),localStorage.getItem('life-scenes-met-v1')
  ]),[ordinary,checkpoints,null]);

  const clean=await browser.newPage({viewport:{width,height:844}});
  await clean.goto(link);
  await clean.getByRole('heading',{name:t('A finance company offers nearly a third more pay for a job starting in 1996.')}).waitFor();
  assert.equal(await clean.evaluate(()=>localStorage.getItem('life-course-v2')),null);
  assert.equal(await clean.getByText(t('In your previous life, the baht floated on 2 July 1997.'),{exact:true}).count(),0);
  await clean.close();
  assert.deepEqual(errors,[]);
  await context.close();
  console.log('Completed both branches and shared the episode at '+width+'px · '+language+' · '+size);
 }
}finally{await browser.close();}
