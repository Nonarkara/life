import assert from 'node:assert/strict';
import {crisisRecord} from '../../dist/course/crisis-chapter.js';
import {validate} from '../../dist/course/sim.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
const base=process.env.BASE||'http://127.0.0.1:48571';
try{
 for(const [slot,path] of [[4,'Take the finance job'],[13,'Stay where you are']]){
  const page=await browser.newPage({viewport:{width:Number(process.env.CRISIS_WIDTH||390),height:844},hasTouch:Number(process.env.CRISIS_WIDTH||390)<1024,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('life-course-v2')));
  await page.goto(base+'/intake/?player='+slot);
  await page.locator('#birth-card[open] #birth-begin').click();
  await page.locator('#arrival-choice:visible').click();
  const dialog=page.locator('.decision-dialog[open]');
  const plan=page.locator('.chapter-choice:visible');
  const recap=page.getByRole('heading',{name:'What happened to your promise?'});
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
    await page.getByRole('button',{name:'Return to the job offer →'}).click();
    rewound=true;
    continue;
   }
   const offer=dialog.getByText('A finance company offers nearly a third more pay for a job starting in 1996.',{exact:true});
   if(await offer.isVisible()){
    assert.match(await dialog.innerText(),slot===4?/฿1,800/:/฿900/);
    if(rewound){
     assert.match(await dialog.innerText(),/previous life.*baht floated/);
     assert.equal((await read()).age,20);
     break;
    }
    sawOffer=true;if(process.env.CRISIS_SHOTS)await page.screenshot({path:process.env.CRISIS_SHOTS+'-'+slot+'-offer.png'});
    await dialog.getByRole('button').filter({hasText:path}).click();continue;
   }
   if(await dialog.getByText('The envelope on the table',{exact:true}).isVisible()){
    sawPromise=true;
    await dialog.getByRole('button').filter({hasText:slot===4?'Put money in the envelope':'Take a regular shift at home'}).click();continue;
   }
   if(await dialog.getByText('The envelope in 1997',{exact:true}).isVisible()){
    sawCrisis=true;
    if(await page.evaluate(()=>matchMedia('(pointer: coarse)').matches))assert.ok(await dialog.locator('#year-event-continue').evaluate(button=>button.getBoundingClientRect().height>=44));
    assert.match(await dialog.innerText(),/2 July 1997/);
    assert.match(await dialog.innerText(),slot===4?/pay envelope is thinner/:/kept your old job/);
    if(process.env.CRISIS_SHOTS)await page.screenshot({path:process.env.CRISIS_SHOTS+'-'+slot+'-crisis.png'});
   }
   const next=page.locator('#year-event-continue:visible,#decision-continue:visible,#child-continue:visible,#next-moment:visible').first();
   if(await next.count()){await next.click();continue;}
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
