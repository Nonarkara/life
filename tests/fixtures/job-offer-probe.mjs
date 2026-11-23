// A real-year job offer is readable and answerable in the browser, in English and Thai.
// BASE=http://127.0.0.1:4219 PLAYWRIGHT_MODULE=/abs/playwright/index.mjs node tests/fixtures/job-offer-probe.mjs
import assert from 'node:assert/strict';
import {newLife,configureLife,begin,live,validate} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {phrases} from '../../dist/course/translations.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
// Find a life whose current station holds a job offer, with every other question at that station answered.
let state,job;
for(let seed=1;seed<=200&&!job;seed++){let s=begin(configureLife(newLife(seed*7919),{birthYear:1955}));
 while(s.stage==='review'&&s.age<50&&!job){s=live(s);if(s.stage!=='review')break;
  const ps=s.story?.pending;if(ps){const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,os[0].id,.05);}
  for(const p of pendingPivots(s))if(!p.job){const os=openOptions(p,s);if(os.length)s=applyPivot(s,p,os[0].id);}
  const waiting=pendingPivots(s);if(waiting.length===1&&waiting[0].job&&!s.story?.pending){state=s;job=waiting[0];}
  else for(const p of waiting)if(p.job)s=applyPivot(s,p,'stay');}}
assert.ok(job,'no life met a job offer');assert.ok(validate(state));
const move=job.options.find(o=>o.id==='move'),th=r=>phrases.find(x=>x[0]===r)[1];
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{for(const lang of ['en','th']){
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(([saved,lang])=>{localStorage.setItem('life-course-v2',JSON.stringify(saved));localStorage.setItem('life-preferences-v1',JSON.stringify({language:lang,size:'standard',motion:false,stage:'hybrid',palette:'auto',v:3}));},[state,lang]);
 await page.goto((process.env.BASE||'http://127.0.0.1:4219')+'/course/',{waitUntil:'domcontentloaded'});
 const title=page.locator('#pivot-title');await title.waitFor({state:'visible',timeout:20000});
 const want=lang==='en'?job.prompt:th(job.prompt),label=lang==='en'?move.label:th(move.label);
 if(lang==='th'){assert.match(want,/[ก-๛]/);assert.match(label,/[ก-๛]/);}
 await page.waitForFunction(w=>document.querySelector('#pivot-title')?.innerText===w,want,{timeout:10000});
 assert.equal(await title.innerText(),want,lang+' title');
 const button=page.locator('.pivot-option',{hasText:label});assert.equal(await button.count(),1,lang+' move button');
 await button.click();
 await page.waitForFunction(([k,v])=>JSON.parse(localStorage.getItem('life-course-v2')).pivotFlags?.[k]===v,['job'+job.job,state.age],{timeout:10000});
 await page.waitForFunction(w=>document.querySelector('#pivot-title')?.innerText!==w,want,{timeout:10000});
 assert.deepEqual(errors,[]);console.log(JSON.stringify({lang,offer:job.id,age:state.age}));await page.close();}
}finally{await browser.close();}
