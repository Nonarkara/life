// Prove that the actual scene keeps drawing while steady controls stay quiet.
import assert from 'node:assert/strict';
import {begin,configureLife,live,newLife,rand} from '../../dist/course/sim.js';
import {applyPivot,openOptions,pendingPivots} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';

function adultReview(){
 let life=begin(configureLife(newLife(21),{birthYear:1981,class:'middle_class',sex:'female'}));
 for(let step=0;step<40;step++){
  const pivot=pendingPivots(life)[0];
  if(pivot){life=applyPivot(life,pivot,openOptions(pivot,life)[0].id);continue;}
  const scene=encounterById(life.story.pending?.id);
  if(scene){
   const choice=scene.options.find(option=>choiceAvailable(life,option));
   life=resolveEncounter(life,choice.id,rand(life.seed,life.age,'encounter-result'));
   continue;
  }
  if(life.age===20)return life;
  life=live(life);
 }
 assert.fail('the adult review fixture never settled');
}

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE||'http://127.0.0.1:4219';
const browser=await chromium.launch({channel:process.env.LIFE_BROWSER_CHANNEL||'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(life=>{
  localStorage.setItem('life-course-v2',JSON.stringify(life));
  localStorage.setItem('life-preferences-v1',JSON.stringify({language:'th',motion:false}));
  let frameTime,paintedAt;
  const schedule=window.requestAnimationFrame;
  window.requestAnimationFrame=callback=>schedule(time=>{frameTime=time;callback(time);});
  window.worldFrames=0;
  function painted(){
   if(frameTime===paintedAt)return;
   paintedAt=frameTime;
   window.worldFrames++;
  }
  const clear=WebGL2RenderingContext.prototype.clear;
  WebGL2RenderingContext.prototype.clear=function(...args){
   if(this.canvas.classList.contains('world-renderer'))painted();
   return clear.apply(this,args);
  };
  const draw=CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage=function(...args){
   if(this.canvas.id==='world')painted();
   return draw.apply(this,args);
  };
 },adultReview());
 await page.goto(base+'/course/',{waitUntil:'domcontentloaded'});
 await page.locator('#load-state').waitFor({state:'detached'});
 await page.waitForFunction(()=>/อายุ 20/.test(document.querySelector('#age').textContent));
 await page.locator('.transport-play:enabled').click();
 await page.waitForFunction(()=>window.worldFrames>=3);
 const motion=await page.evaluate(async()=>{
  const clock=document.querySelector('#age-track'),current=clock.getAttribute('aria-valuenow');
  const start=window.worldFrames;
  let changes=0;
  const observer=new MutationObserver(records=>{changes+=records.length;});
  observer.observe(clock,{attributes:true,subtree:true});
  // The time deadline is a guard against a broken renderer. The sample itself
  // ends at a paint count, so slower CI hosts do not get a free pass.
  const deadline=performance.now()+8_000;
  await new Promise(resolve=>{
   const check=()=>window.worldFrames>=start+12||performance.now()>=deadline?resolve():requestAnimationFrame(check);
   requestAnimationFrame(check);
  });
  observer.disconnect();
  return {frames:window.worldFrames-start,changes,current,age:clock.getAttribute('aria-valuenow')};
 });
 assert.ok(motion.frames>=12,'the world kept painting during review');
 assert.equal(motion.age,motion.current,'review motion does not advance the calendar');
 assert.ok(motion.changes<=2,'unchanged age track stays quiet while the world draws: '+JSON.stringify(motion));
 await page.locator('.transport-pause:enabled').click();
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const before=await page.evaluate(()=>window.worldFrames);
 await page.evaluate(()=>new Promise(resolve=>{let count=0;const frame=()=>++count===15?resolve():requestAnimationFrame(frame);requestAnimationFrame(frame);}));
 assert.equal(await page.evaluate(()=>window.worldFrames),before,'pause leaves the world still');
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
