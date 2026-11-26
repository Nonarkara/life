import assert from 'node:assert/strict';
import {crisisRecord} from '../../dist/course/crisis-chapter.js';
import {validate} from '../../dist/course/sim.js';
import {translate} from '../../dist/course/i18n.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
const base=process.env.BASE||'http://127.0.0.1:48571';
const language=process.env.CRISIS_LANGUAGE||'en',size=process.env.CRISIS_SIZE||'standard',t=text=>translate(text,language);
try{
 for(const [slot,path] of [[4,'Take the finance job'],[13,'Stay where you are']]){
  const page=await browser.newPage({viewport:{width:Number(process.env.CRISIS_WIDTH||390),height:844},hasTouch:Number(process.env.CRISIS_WIDTH||390)<1024,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('life-course-v2')));
  await page.addInitScript(({language,size})=>localStorage.setItem('life-preferences-v1',JSON.stringify({language,size,motion:false})),{language,size});
  await page.goto(base+'/intake/?player='+slot+'&lang='+language);
  await page.locator('#birth-card[open] #birth-begin').click();
  await page.locator('#arrival-choice:visible').click();
  const dialog=page.locator('.decision-dialog[open]');
  const plan=page.locator('.chapter-choice:visible');
  const readChoices=async()=>{
   const pager=dialog.locator('.decision-pager:visible');
   if(await pager.count()&&await dialog.getAttribute('data-reading-stage')==='context'){
    if(await page.evaluate(()=>matchMedia('(pointer: coarse)').matches))assert.ok((await pager.boundingBox()).height>=44);
    await pager.click();
   }
  };
  const recap=page.getByRole('heading',{name:t('What happened to your promise?')});
  let sawOffer=false,sawPromise=false,sawCrisis=false,rewound=false;
  for(let step=0;step<125;step++){
   if(await recap.isVisible()){
    assert.ok(sawOffer&&sawPromise&&sawCrisis);
    const saved=await read(),record=crisisRecord(saved);
    assert.ok(validate(saved));
    assert.equal(record.offer,slot===4?'move':'stay');
    assert.equal(record.householdPayment,slot===4?1800:0);
    assert.equal(saved.finance.receipts.filter(r=>r.id==='period:20-25').length,1);
    await page.reload({waitUntil:'domcontentloaded'});await recap.waitFor();
    const restored=await read();
    assert.deepEqual(crisisRecord(restored),record);
    assert.equal(restored.finance.receipts.filter(r=>r.id==='period:20-25').length,1);
    if(process.env.CRISIS_SHOTS)await page.screenshot({path:process.env.CRISIS_SHOTS+'-'+slot+'-review.png'});
    await page.getByRole('button',{name:t('Return to the job offer →')}).click();
    rewound=true;
    continue;
   }
   const offer=dialog.getByText(t('A finance company offers nearly a third more pay for a job starting in 1996.'),{exact:true});
   if(await offer.isVisible()){
    assert.match(await dialog.innerText(),slot===4?/฿1,800/:/฿900/);
    if(rewound){
     assert.ok((await dialog.innerText()).includes(t('In your previous life, the baht floated on 2 July 1997.')));
     assert.equal((await read()).age,20);
     break;
    }
    sawOffer=true;if(process.env.CRISIS_SHOTS)await page.screenshot({path:process.env.CRISIS_SHOTS+'-'+slot+'-offer.png'});
    await readChoices();
    await dialog.getByRole('button').filter({hasText:t(path)}).click();continue;
   }
   if(await dialog.getByText(t('The envelope on the table'),{exact:true}).isVisible()){
    sawPromise=true;
    await readChoices();
    if(await page.evaluate(()=>matchMedia('(pointer: coarse) and (orientation: portrait)').matches)){
     await page.waitForFunction(()=>[...document.querySelectorAll('.decision-dialog[open] .pivot-option')].every(button=>{
      const r=button.getBoundingClientRect();
      return r.height>=44&&r.bottom<=innerHeight&&button.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
     }));
    }
    if(process.env.CRISIS_SHOTS)await page.screenshot({path:process.env.CRISIS_SHOTS+'-'+slot+'-promise.png'});
    await dialog.getByRole('button').filter({hasText:t(slot===4?'Put money in the envelope':'Take a regular shift at home')}).click();continue;
   }
   if(await dialog.getByText(t('The envelope in 1997'),{exact:true}).isVisible()){
    sawCrisis=true;
    if(await page.evaluate(()=>matchMedia('(pointer: coarse)').matches))assert.ok(await dialog.locator('#year-event-continue').evaluate(button=>button.getBoundingClientRect().height>=44));
    assert.ok(await dialog.getByRole('link',{name:t('On 2 July 1997, Thailand floated the baht.')}).isVisible());
    assert.doesNotMatch(await dialog.innerText(),/By year-end|สิ้นปี/);
    assert.ok(await page.locator('.top-world').isHidden());
    const story=slot===4?'At the finance office, the pay envelope is thinner. At home, the bills are still on the table.':'You kept your old job. At home, the bills are still on the table.';
    assert.ok((await dialog.innerText()).includes(t(story)));
    if(process.env.CRISIS_SHOTS)await page.screenshot({path:process.env.CRISIS_SHOTS+'-'+slot+'-crisis.png'});
   }
   const next=page.locator('#year-event-continue:visible,#decision-continue:visible,#child-continue:visible,#next-moment:visible').first();
   if(await next.count()){await next.click();continue;}
   await readChoices();
   const options=dialog.locator('.pivot-option:visible:enabled,.encounter-choice:visible:enabled');
   if(await options.count()){await options.first().click();continue;}
   if(await plan.count()){
    await plan.first().click();
    await page.locator('#commit:visible:enabled').click();continue;
   }
   await page.locator('.decision-dialog[open],.chapter-choice:visible,#next-moment:visible,.ending-verdict').first().waitFor();
  }
  assert.ok(rewound,'the review offered a return to the job offer');
  assert.deepEqual(errors,[]);
  console.log('Played and rewound '+slot+' '+path);
  await page.close();
 }
}finally{await browser.close();}
