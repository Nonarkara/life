// Build first; restart the preview server after every build.
// BASE=https://life.nonarkara.org PLAYWRIGHT_MODULE=/absolute/path/playwright/index.mjs node tests/fixtures/journey-evidence-probe.mjs
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
import {newLife,begin,live,configureLife,validate} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {planBucket} from '../../dist/course/bucket-list.js';
import {dealtStops,setStop} from '../../dist/course/life-collection.js';
import {buildCV} from '../../dist/course/cv.js';
let s=begin(configureLife(newLife(5426),{class:'middle_class',sex:'female',birthYear:1960}));
for(let i=0;i<90&&s.stage!=='recap';i++){
 for(let j=0;j<12;j++){const q=pendingPivots(s)[0];if(!q)break;s=applyPivot(s,q,openOptions(q,s)[0].id);}
 if(s.story?.pending){const e=encounterById(s.story.pending.id);s=resolveEncounter(s,e.options.find(o=>choiceAvailable(s,o)).id,.5);continue;}
 if(s.age>=15){s=planBucket(s,'library',s.age+1);s=setStop(s,dealtStops(s)[0]);}
 s=live(s);
}
assert.equal(validate(s),true);assert.equal(s.stage,'recap');
const cv=buildCV(s);assert.ok(cv.some(e=>e.kind==='experiences'));
const declined=buildCV({...s,story:{seen:[{id:'commitment',choice:'decline',age:30}]}});assert.ok(!declined.some(e=>e.id==='event:commitment'));
const planned=buildCV({...s,bucket:{custom:[],done:[],planned:[{key:'library',label:'Spend a day at the library',age:70,days:1,cost:0,id:'planned'}]}});assert.ok(!planned.some(e=>e.kind==='experiences'));
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
const language=process.env.LANGUAGE||'en';
for(const [width,enlarged] of [[390,false],[1024,false],[1440,false],[390,true]]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({s,enlarged,language})=>{localStorage.setItem('life-course-v2',JSON.stringify(s));localStorage.setItem('life-preferences-v1',JSON.stringify({language,size:enlarged?'extra':'standard',motion:true}));},{s,enlarged,language});await page.goto((process.env.BASE||'http://127.0.0.1:4287')+'/course/',{waitUntil:'domcontentloaded'});
 const summary=page.getByText(language==='th'?'สิ่งที่เก็บไว้จากชีวิตนี้':'What you kept from this life',{exact:true});await summary.waitFor({state:'visible'});await summary.scrollIntoViewIfNeeded();await summary.click();
 await page.screenshot({path:`/tmp/journey-review-${width}${enlarged?'-enlarged':''}.png`});
 const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,album:document.querySelector('.ending-score details').innerText,breakdown:document.querySelector('.score-breakdown').innerText,total:Number(document.querySelector('.score-total').innerText)}));
 assert.equal(metrics.overflow,false);assert.ok(metrics.album.includes(language==='th'?'ห้องสมุด':'Spend a day at the library'));assert.equal([...metrics.breakdown.matchAll(/\+(\d+)/g)].reduce((n,m)=>n+Number(m[1]),0),metrics.total);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({width,enlarged,language,errors,overflow:metrics.overflow,total:metrics.total,breakdown:metrics.breakdown}));await page.close();
}
await browser.close();
