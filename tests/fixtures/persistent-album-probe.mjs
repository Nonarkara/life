// Build and restart preview first. BASE=https://life.nonarkara.org LANGUAGE=th PLAYWRIGHT_MODULE=/path/playwright/index.mjs node tests/fixtures/persistent-album-probe.mjs
import assert from 'node:assert/strict';
import {newLife,begin,live,configureLife,validate} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {planBucket} from '../../dist/course/bucket-list.js';
import {dealtStops,setStop} from '../../dist/course/life-collection.js';
import {encodeBirth} from '../../dist/course/birthcode.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
let ended=begin(configureLife(newLife(5426),{class:'middle_class',sex:'female',birthYear:1960}));
for(let i=0;i<90&&ended.stage!=='recap';i++){
 for(let j=0;j<12;j++){const pivot=pendingPivots(ended)[0];if(!pivot)break;ended=applyPivot(ended,pivot,openOptions(pivot,ended)[0].id);}
 if(ended.story?.pending){const e=encounterById(ended.story.pending.id);ended=resolveEncounter(ended,e.options.find(o=>choiceAvailable(ended,o)).id,.5);continue;}
 if(ended.age>=15){ended=planBucket(ended,'library',ended.age+1);ended=setStop(ended,dealtStops(ended)[0]);}
 ended=live(ended);
}
assert(validate(ended));assert.equal(ended.stage,'recap');
const fresh=configureLife(newLife(333),{class:'working_class',sex:'male',birthYear:1981});assert(validate(fresh));
const language=process.env.LANGUAGE||'en',base=process.env.BASE||'http://127.0.0.1:4299';
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
try{
 for(const [width,enlarged] of (process.env.WIDTH?[[Number(process.env.WIDTH),false]]:[[390,false],[1024,false],[1440,false],[390,true]])){
  const page=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'reduce',serviceWorkers:'block'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({ended,language,enlarged})=>{if(!localStorage.getItem('life-course-v2'))localStorage.setItem('life-course-v2',JSON.stringify(ended));localStorage.setItem('life-preferences-v1',JSON.stringify({language,size:enlarged?'extra':'standard',motion:true}));},{ended,language,enlarged});
  await page.goto(base+'/course/',{waitUntil:'domcontentloaded'});await page.locator('.score-total').waitFor();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('life-lives-v1')));
  assert.equal(saved.length,1);assert.ok(saved[0].album.entries.length>0);assert.ok(saved[0].album.notes.length>0);
  assert.equal(saved[0].code,encodeBirth(ended));
  // Overwrite only the active session, just as starting the next life does. Keep an old summary without an invented album.
  await page.evaluate(({fresh,summary})=>{localStorage.setItem('life-course-v2',JSON.stringify(fresh));const entries=JSON.parse(localStorage.getItem('life-lives-v1'));for(let i=0;i<6;i++){const old={...summary,id:'older-summary-'+i,words:'A remembered life '+i};delete old.album;entries.push(old);}localStorage.setItem('life-lives-v1',JSON.stringify(entries));},{fresh,summary:saved[0]});
  const before=await page.evaluate(()=>({active:localStorage.getItem('life-course-v2'),archive:localStorage.getItem('life-lives-v1'),taste:localStorage.getItem('life-taste-v1'),almanac:localStorage.getItem('life-almanac-v1')}));
  await page.goto(base+'/intake/',{waitUntil:'domcontentloaded'});
  await page.locator('#lives-summary').waitFor({state:'visible'});await page.locator('#lives-summary').click();
  if(language==='th')assert.match(await page.locator('#collection-summary').innerText(),/สมุดบันทึกชีวิต/);
  const rows=page.locator('#lives-list > li');assert.equal(await rows.count(),6,'six earlier lives plus the visible latest life remain reachable');
  const album=page.locator('#recent-life .life-album'),summary=album.locator('summary');await summary.focus();await page.keyboard.press('Enter');
  assert.equal(await album.getAttribute('open'),'');
  const albumText=await album.innerText();assert.ok(albumText.includes(language==='th'?'ห้องสมุด':'Spend a day at the library'));
  assert.ok(albumText.includes(language==='th'?'ใช้เงิน':'Spent:'),albumText);assert.ok(!albumText.includes('NaN'));
  assert.ok(await album.locator('h3').isVisible(),'actual field notes kept');
  const replay=new URL(await page.locator('#recent-life .fork-again').getAttribute('href'),page.url());assert.equal(replay.searchParams.get('birth'),encodeBirth(ended));
  const oldAlbum=rows.nth(5).locator('.life-album');await oldAlbum.locator('summary').click();assert.match(await oldAlbum.innerText(),language==='th'?/ไม่มีอัลบั้ม/:/no saved album/);
  await summary.scrollIntoViewIfNeeded();await page.screenshot({path:`/tmp/persistent-album-${language}-${width}${enlarged?'-extra':''}.png`});
  const after=await page.evaluate(()=>({active:localStorage.getItem('life-course-v2'),archive:localStorage.getItem('life-lives-v1'),taste:localStorage.getItem('life-taste-v1'),almanac:localStorage.getItem('life-almanac-v1')}));assert.deepEqual(after,before,'reading old albums never replaces the active life or mints rewards');
  const metrics=await page.evaluate(()=>{const album=document.querySelector('#recent-life .life-album'),form=document.querySelector('#intake-form');return {overflow:document.documentElement.scrollWidth>innerWidth,summaryHeight:album.querySelector('summary').getBoundingClientRect().height,uncontained:album.lastElementChild.getBoundingClientRect().bottom>form.getBoundingClientRect().bottom+1};});assert.equal(metrics.overflow,false);assert.equal(metrics.uncontained,false,'expanded chronology remains inside the natural page');assert.ok(metrics.summaryHeight>=44&&metrics.summaryHeight<=64);
  if(width>=721){
   await page.locator('#starting-conditions > summary').click();
   for(const selector of ['#birth-era','.starting-shape button[type=submit]']){
    const control=page.locator(selector);await control.scrollIntoViewIfNeeded();
    const inside=await control.evaluate(el=>{const r=el.getBoundingClientRect(),p=el.closest('.panel').getBoundingClientRect();return r.top>=p.top-1&&r.bottom<=p.bottom+1;});assert.ok(inside,'condition and Begin controls stay reachable while album is open');
   }
   await page.screenshot({path:`/tmp/persistent-album-${language}-${width}-actions.png`});
  }
  await page.locator('[data-settings]').click();await page.locator('#setting-size').selectOption(enlarged?'large':'extra');await page.locator('#settings-dialog button[type=submit]').click();assert.equal(await page.locator('#recent-life .life-album').getAttribute('open'),'','preference rerender keeps the album open');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({width,enlarged,language,records:7,entries:saved[0].album.entries.length,notes:saved[0].album.notes.length,errors,...metrics}));
  await page.reload({waitUntil:'domcontentloaded'});assert.equal(await page.locator('#lives-list > li').count(),6);assert.equal(await page.evaluate(()=>localStorage.getItem('life-course-v2')),before.active);
  await page.close();
 }
}finally{await browser.close();}
