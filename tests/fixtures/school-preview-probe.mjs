// Follow the featured birth from landing through two real phone playthroughs.
import assert from 'node:assert/strict';
import {CHILD_CHOICES} from '../../dist/course/childhood-choices.js';
import {encodeBirth} from '../../dist/course/birthcode.js';
import {pendingPivots,openOptions} from '../../dist/course/pivots.js';
import {translate} from '../../dist/course/i18n.js';
import {validate} from '../../dist/course/sim.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE||'http://127.0.0.1:4219';
const language=process.env.SCHOOL_PREVIEW_LANGUAGE||'en';
const width=Number(process.env.SCHOOL_PREVIEW_WIDTH||390);
const height=Number(process.env.SCHOOL_PREVIEW_HEIGHT||844);
const t=message=>translate(message,language);
const browser=await chromium.launch({channel:'chrome',headless:true});
const child=CHILD_CHOICES.find(q=>q.age===9&&q.options.some(o=>o.id==='school_ask_teacher'));
const filePrefix=process.env.SCHOOL_PREVIEW_SHOTS;
try{
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce',serviceWorkers:'block'});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.setDefaultTimeout(20000);
 if(process.env.SCHOOL_PREVIEW_SIZE){
  await page.addInitScript(size=>{
   localStorage.setItem('life-preferences-v1',JSON.stringify({language:'en',size,motion:false,stage:'hybrid',palette:'auto',v:3}));
  },process.env.SCHOOL_PREVIEW_SIZE);
 }
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('life-course-v2')));
 const seen=page.locator('.decision-dialog[open]');
 const review=page.locator('.school-review');
 const next=page.locator('#year-event-continue:visible,#decision-continue:visible,#next-moment:visible').first();
 const shot=async label=>{if(filePrefix)await page.screenshot({path:filePrefix+'-'+label+'.png'});};
 await page.goto(base+'/?lang='+language,{waitUntil:'domcontentloaded'});
 const ordinary=page.locator('#overview .actions .begin');
 await page.waitForFunction(()=>document.querySelector('#overview .actions .begin')?.href.includes('next=1'));
 await ordinary.click();
 await page.locator('#birth-card[open] #birth-begin').waitFor();
 assert.equal(await read(),null);
 await page.goto(base+'/?featured=school&lang='+language,{waitUntil:'domcontentloaded'});
 const play=page.locator('#overview .actions .begin');
 await page.waitForFunction(()=>document.querySelector('#overview .actions .begin')?.href.includes('featured=school'));
 await play.click();
 const birth=page.locator('#birth-card[open]');
 await birth.waitFor();
 await birth.getByRole('heading',{name:t('Featured life · Born in 1975'),exact:true}).waitFor();
 assert.equal(await read(),null,'opening the birth card does not write a save');
 await shot('birth');
 await birth.locator('#birth-begin').click();
 await page.waitForURL(url=>url.pathname==='/course/'&&url.searchParams.get('lang')===language);

 async function openChoices(){
  const pager=seen.locator('.decision-pager:visible');
  if(await pager.count()&&(await pager.innerText()).includes('→'))await pager.click();
 }
 async function answer(id){
  await seen.locator('#child-title').waitFor();
  await openChoices();
  const option=child.options.find(o=>o.id===id);
  await seen.locator('.pivot-option').filter({hasText:t(option.label)}).click();
  await seen.locator('#child-continue').click();
 }

 async function reachReview(){
  const snapshots=[];
  for(let step=0;step<65;step++){
   const state=await read();
   if(process.env.VERBOSE)console.log(step,state.age,state.stage,await seen.count(),await next.count(),pendingPivots(state).map(p=>p.id));
   if(await review.isVisible()&&!(await seen.count()))return {state,snapshots};
   if(await next.count()){await next.click();continue;}
   if(await seen.count()){
    await openChoices();
    const pivot=await seen.locator('#pivot-title').count()?pendingPivots(state)[0]:null;
    if(pivot){
     const options=openOptions(pivot,state);
     const answer=options.find(o=>['merit','apprentice','out','stay'].includes(o.id))??options[0];
     snapshots.push(pivot.id);
     await seen.locator('.pivot-option:visible').filter({hasText:t(answer.label)}).first().click();
    }else await seen.locator('.encounter-choice:visible:enabled').first().click();
    continue;
   }
   const choices=page.locator('.chapter-choice:visible');
   if(!(await choices.count())){
    await page.locator('.decision-dialog[open],.school-review:visible,.chapter-choice:visible,#commit:visible:enabled,#next-moment:visible').first().waitFor();
    if(await seen.count()||await next.count()||await review.isVisible())continue;
    await page.locator('#commit:visible:enabled').click();
    continue;
   }
   const id={10:'friends',15:'band',20:'career'}[state.age];
   assert.ok(id,'waiting for a reachable age-25 review at '+state.age);
   const pathway=page.locator('#chapter-pathway:visible');
   if(state.age===15&&await pathway.count())await pathway.selectOption('vocational');
   await choices.filter({has:page.locator('strong')}).and(page.locator('[data-chapter-plan="'+id+'"]')).click();
   await page.locator('#commit:visible').click();
  }
  assert.fail('the age-25 review was not reached');
 }

 await seen.getByRole('heading',{name:t(child.title),exact:true}).waitFor();
 assert.equal(await seen.locator('.child-replay-memory').count(),0);
 assert.equal(await review.count(),0,'the first childhood does not reveal the adult result');
 await shot('child');
 await answer('school_say');
 const first=await reachReview();
 const firstCode=encodeBirth(first.state);
 assert.ok(validate(first.state));
 assert.ok(!first.snapshots.includes('college-cost'));
 assert.match(await review.innerText(),new RegExp(t('At twenty, this life had no college-funding choice.').slice(0,-1)));
 await shot('first');
 await review.locator('.school-replay').click();
 await seen.locator('.child-replay-memory').waitFor();
 await answer('school_ask_teacher');
 const replay=await reachReview();
 assert.ok(validate(replay.state));
 assert.equal(encodeBirth(replay.state),firstCode);
 assert.ok(replay.snapshots.includes('college-cost'));
 assert.equal(replay.state.history.at(-1).pathway,'college');
 assert.notEqual(first.state.history.at(-1).pathway,'college');
 assert.ok((await review.innerText()).includes(t('Say your cousin should go')));
 assert.ok((await review.innerText()).includes(t('Ask a teacher what other ways there are')));
 const record=await review.innerText();
 await shot('replay');
 await page.reload({waitUntil:'domcontentloaded'});
 await review.waitFor();
 assert.equal(await review.innerText(),record);
 const awaitSavedChoice=choice=>page.waitForFunction(choice=>
  JSON.parse(localStorage.getItem('life-course-v2'))?.childhood?.choices[0]?.choice===choice,choice);
 await review.getByRole('button',{name:t('Open the first run')}).click();
 await awaitSavedChoice('school_say');
 await review.waitFor();
 assert.equal((await read()).childhood.choices[0].choice,'school_say');
 await review.getByRole('button',{name:t('Open the replay')}).click();
 await awaitSavedChoice('school_ask_teacher');
 await review.waitFor();
 assert.equal((await read()).childhood.choices[0].choice,'school_ask_teacher');
 assert.equal(await review.innerText(),record);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({language,width,firstPath:first.state.history.at(-1).pathway,
  replayPath:replay.state.history.at(-1).pathway,firstLearning:first.state.history.at(-1).pathwayLearning,
  replayLearning:replay.state.history.at(-1).pathwayLearning,age:replay.state.age}));
}catch(error){
 const [page]=browser.contexts().flatMap(context=>context.pages());
 if(filePrefix&&page)await page.screenshot({path:filePrefix+'-failed.png'});
 throw error;
}finally{await browser.close();}
