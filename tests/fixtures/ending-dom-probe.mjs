// The ending, as the tree it actually writes.
//
// The dictionary tests prove the sentences can be translated; this probe reads
// the DOM the player reads: the two stacks of the recap, the numbers, the
// labels on the chart, and the machine names that must never reach the page.
//
// Two laws are enforced here.
// One: the recap is two independent stacks. A long column beside a short one
//     leaves a hole of empty screen beside the reader — the left half of the
//     recap stood empty for a full screen. The stacks must end together.
// Two: the ending is written in the reader's language, all the way down,
//     including the metric names and the aria-labels on the chart.
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
import {newLife,begin,live,configureLife,validate} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {planBucket} from '../../dist/course/bucket-list.js';
import {dealtStops,setStop} from '../../dist/course/life-collection.js';

let s=begin(configureLife(newLife(5426),{class:'middle_class',sex:'female',birthYear:1960}));
for(let i=0;i<90&&s.stage!=='recap';i++){
 for(let j=0;j<12;j++){const q=pendingPivots(s)[0];if(!q)break;s=applyPivot(s,q,openOptions(q,s)[0].id);}
 if(s.story?.pending){const e=encounterById(s.story.pending.id);s=resolveEncounter(s,e.options.find(o=>choiceAvailable(s,o)).id,.5);continue;}
 if(s.age>=15){s=planBucket(s,'library',s.age+1);s=setStop(s,dealtStops(s)[0]);}
 s=live(s);
}
assert.equal(validate(s),true);
assert.equal(s.stage,'recap');

const base=process.env.BASE||'http://127.0.0.1:4543';
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
const METRICS=['Physical health','Wellbeing'];
const MONEY=['Household buffer','Personal net worth'];
const THAI_METRICS=['สุขภาพร่างกาย','ความเป็นอยู่ที่ดี'];
const THAI_MONEY=['เงินสำรองครอบครัว','ทรัพย์สินสุทธิส่วนตัว'];
for(const [width,language] of [[1024,'en'],[1440,'en'],[390,'en'],[1024,'th']]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({s,language})=>{
  localStorage.setItem('life-course-v2',JSON.stringify(s));
  localStorage.setItem('life-preferences-v1',JSON.stringify({language,size:'standard',motion:false}));
 },{s,language});
 await page.goto(base+'/course/',{waitUntil:'domcontentloaded'});
 await page.locator('.ending-verdict').waitFor();
 await page.waitForTimeout(400);

 const shape=await page.evaluate(()=>{
  const recap=document.getElementById('recap');
  const lead=recap.querySelector(':scope > .recap-column--lead');
  const data=recap.querySelector(':scope > .recap-column--data');
  const box=el=>{const b=el.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)};};
  return {
   recap:box(recap),
   lead:lead?box(lead):null,data:data?box(data):null,
   verdictInLead:!!lead?.querySelector(':scope > .ending-verdict'),
   routeInLead:!!lead?.querySelector(':scope > .ending-route'),
   routeInBand:!!recap.querySelector(':scope > .ending-route'),
   scoreInData:!!data?.querySelector(':scope > .ending-score'),
   shareInData:!!data?.querySelector(':scope > .ending-share'),
   // The collection is a wide grid of what you found: it is a band, not a ribbon in a narrow column.
   almanacInBand:!!recap.querySelector(':scope > .almanac-drawer'),
   almanacInScore:!!recap.querySelector('.ending-score .almanac-drawer'),
   // The full record — the numbers, the chart, the life you did not choose — stays full width.
   numbersInBand:!!recap.querySelector(':scope > .full-life-record.ending-numbers'),
   numbersInColumn:!!recap.querySelector('.recap-column .full-life-record'),
  };
 });
 assert.ok(shape.lead&&shape.data,`${width}: the recap is not two stacks`);
 assert.ok(shape.verdictInLead,`${width}: the verdict left the left stack`);
 assert.ok(shape.routeInLead||shape.routeInBand,`${width}: the route map left the recap`);
 assert.ok(shape.scoreInData,`${width}: the score left the right stack`);
 assert.ok(shape.shareInData,`${width}: the share left the right stack`);
 assert.ok(shape.almanacInBand&&!shape.almanacInScore,`${width}: the collection is still inside the score`);
 assert.ok(shape.numbersInBand&&!shape.numbersInColumn,`${width}: the full record is inside a column`);

 if(width>=960){
  // The law: no half-empty column. The two stacks must end together — never more
  // than a hand's width apart, and never a quarter shorter than the taller one.
  const gap=Math.abs(shape.lead.h-shape.data.h),taller=Math.max(shape.lead.h,shape.data.h);
  assert.ok(gap<=160&&gap<=taller*0.25,`${width}: the two stacks differ by ${gap}px — one side of the recap is empty`);
  assert.ok(shape.lead.y===shape.data.y,`${width}: the stacks do not start together`);
  assert.ok(shape.lead.x<shape.data.x,`${width}: the stacks are not side by side`);
 }else{
  // One column on a phone: the life is read, then the map, then the numbers.
  assert.ok(shape.data.y>=shape.lead.y+shape.lead.h-1,`${width}: the stacks overlap`);
 }

 const ending=await page.evaluate(()=>{
  const text=el=>el?.textContent?.trim()??'';
  const walker=document.createTreeWalker(document.getElementById('recap'),NodeFilter.SHOW_TEXT);
  const names=[];let node;
  while(node=walker.nextNode()){const t=node.textContent.trim();if(t&&/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(t))names.push(t);}
  return {
   beats:[...document.querySelectorAll('.ending-verdict .arc-beats dt')].map(text),
   did:document.querySelectorAll('.ending-verdict .verdict-did li').length,
   routeLabel:document.querySelector('.ending-route canvas')?.getAttribute('aria-label')??'',
   metricNames:[...document.querySelectorAll('.ending-reading dl dt')].map(text),
   chartLabel:document.querySelector('.ending-chart')?.getAttribute('aria-label')??'',
   pointLabels:[...document.querySelectorAll('.ending-chart g[role=button]')].map(g=>g.getAttribute('aria-label')??''),
   ticks:[...document.querySelectorAll('.ending-chart text')].map(text),
   total:text(document.querySelector('.ending-score .score-total')),
   goals:[...document.querySelectorAll('.ending-score .score-goals li')].map(text),
   names,
  };
 });
 assert.deepEqual(ending.names,[],`${width}: a machine name reached the page`);
 assert.deepEqual(ending.beats,language==='th'?['ขึ้น','จุดหักเห','จบ']:['Rise','Twist','End'],`${width}: the verdict beats are wrong`);
 assert.ok(ending.did>=1,`${width}: the verdict lists none of the life`);
 assert.ok(ending.routeLabel.length>0,`${width}: the route map has no name`);
 assert.deepEqual(ending.metricNames.slice(0,2),language==='th'?THAI_METRICS:METRICS,`${width}: the metric names are wrong`);
 assert.ok((language==='th'?THAI_MONEY:MONEY).includes(ending.metricNames[2]),`${width}: the money metric is wrong — ${ending.metricNames[2]}`);
 assert.ok(ending.chartLabel.length>0,`${width}: the chart has no name`);
 assert.ok(ending.pointLabels.length>0,`${width}: the chart has no points`);
 for(const label of ending.pointLabels){
  assert.match(label,language==='th'?/^อายุ \d+: .+ \S+$/:/^Age \d+: .+ \S+$/,`${width}: a chart point is unnamed — ${label}`);
 }
 assert.ok(ending.ticks.includes(language==='th'?'อายุ':'Age'),`${width}: the chart has no age axis`);
 assert.ok(/^\d+$/.test(ending.total),`${width}: the score total is not a number — ${ending.total}`);
 for(const goal of ending.goals)assert.match(goal,/^[✓✗] /,`${width}: a goal is not marked — ${goal}`);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({width,language,stacks:{lead:shape.lead.h,data:shape.data.h},total:ending.total,metrics:ending.metricNames}));
 await page.close();
}
await browser.close();
