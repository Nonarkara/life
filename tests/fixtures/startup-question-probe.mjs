// Run against a freshly built, restarted preview or the live site.
// BASE=https://life.nonarkara.org PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node tests/fixtures/startup-question-probe.mjs
import assert from 'node:assert/strict';
import {begin,newLife,configureLife,validate} from '../../dist/course/sim.js';
import {pendingPivots} from '../../dist/course/pivots.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const initial=begin(configureLife(newLife(1),{class:'working_class',birthYear:1981,sex:'female'}));
const state={...initial,story:{...initial.story,pending:null}};
assert.ok(validate(state));
const expected=pendingPivots(state)[0];
assert.ok(expected);
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(saved=>{
  if(!localStorage.getItem('life-course-v2'))localStorage.setItem('life-course-v2',JSON.stringify(saved));
 },state);
 const start=Date.now();
 await page.goto((process.env.BASE||'http://127.0.0.1:4219')+'/course/',{waitUntil:'domcontentloaded'});
 await page.locator('#pivot-title').waitFor({state:'visible',timeout:15000});
 assert.equal(await page.locator('#pivot-title').innerText(),expected.heading??expected.prompt);
 assert.ok(await page.locator('.pivot-option:visible').count()>0);
 assert.ok(Date.now()-start<30000,'the first question must exist before the old module delay');
 const year=await page.locator('#age').innerText();
 assert.match(year,/1991/,'the birth year is available from the first rendered review');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('life-course-v2')).age),10);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({question:expected.id,year,readyInMs:Date.now()-start,errors}));
}finally{await browser.close();}
