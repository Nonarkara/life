// Build, restart preview, then run with BASE and PLAYWRIGHT_MODULE.
// This proves only the flat-stage trial and the unused walk motif's clock API.
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE||'http://127.0.0.1:4319',language=process.env.LANGUAGE||'en';
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
try{
 for(const [width,enlarged] of (process.env.WIDTH?[[Number(process.env.WIDTH),false]]:[[390,false],[1024,false],[1440,false],[390,true]])){
  const page=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'no-preference',serviceWorkers:'block'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({language,enlarged})=>localStorage.setItem('life-preferences-v1',JSON.stringify({language,size:enlarged?'extra':'standard',motion:false})),{language,enlarged});
  await page.goto(base+'/course/ink-study.html',{waitUntil:'domcontentloaded'});await page.locator('#ink-yard[data-ready=true]').waitFor();
  if(language==='th')assert.equal(await page.locator('#study-reset').innerText(),'เล่นซ้ำ');
  const geometry=await page.evaluate(()=>{
   const api=inkStudy,root=api.actor.root,original=[root,...root.querySelectorAll('*')],person=root.dataset.person;
   let churn=0;const observer=new MutationObserver(records=>{churn+=records.filter(r=>r.type==='childList').length;});observer.observe(root,{childList:true,subtree:true});
   const result=[];
   for(const age of [10,35]){
    api.setAge(age);let previous=null,maxDrift=0,maxPenetration=-Infinity,heelSamples=0;
    for(let i=0;i<=500;i++){
     api.seek(api.sequence.duration*i/500);const frame=api.frame,order=frame.pose.front===0?[1,0]:[0,1],floorPath=document.querySelector('#ink-yard>g:last-child path'),floor=floorPath.getPointAtLength(0).matrixTransform(floorPath.getScreenCTM()),toes=[];
     for(let role=0;role<2;role++){
      const index=order[role],shoe=api.actor.nodes[role?'frontShoe':'backShoe'],d=shoe.getAttribute('d'),numbers=d.slice(d.indexOf('Q')+1,d.indexOf('H')).match(/-?(?:\d*\.)?\d+/g).map(Number),matrix=shoe.getScreenCTM();
      const toe=new DOMPoint(numbers[2],numbers[3]).matrixTransform(matrix);toes[index]=toe;
      // Sample the actual rendered filled outline, not only the solver's ankle.
      const length=shoe.getTotalLength();for(let n=0;n<=32;n++){const point=shoe.getPointAtLength(length*n/32).matrixTransform(matrix);maxPenetration=Math.max(maxPenetration,point.y-floor.y);}
      const foot=frame.pose.feet[index];if(foot.stance){if(foot.pitch>5)heelSamples++;if(previous?.frame.pose.feet[index].stance)maxDrift=Math.max(maxDrift,Math.abs(toe.x-previous.toes[index].x));}
     }
     previous={frame,toes};
    }
    result.push({age,maxDrift,maxPenetration,heelSamples,identity:root.dataset.person});
   }
   api.setAge(10);api.seek(1.2);const first=root.outerHTML;api.seek(4);api.seek(.2);api.seek(1.2);const deterministic=first===root.outerHTML;
   const retained=original.every(n=>n.isConnected&&n===original.find(x=>x===n))&&original.length===1+root.querySelectorAll('*').length;
   observer.takeRecords().forEach(r=>{if(r.type==='childList')churn++;});observer.disconnect();
   return {result,deterministic,retained,churn,person,nodes:original.length};
  });
  assert.equal(geometry.deterministic,true);assert.equal(geometry.retained,true);assert.equal(geometry.churn,0);
  for(const r of geometry.result){assert.equal(r.identity,geometry.person);assert.ok(r.heelSamples>5);assert.ok(r.maxDrift<.03,'rendered stance toe is planted');assert.ok(r.maxPenetration<.15,'no rendered swing or stance sole enters the floor');}
  await page.evaluate(()=>inkStudy.seek(inkStudy.sequence.turnEnd+.75));await page.screenshot({path:'/tmp/ink-study-'+language+'-'+width+(enlarged?'-extra':'')+'-wave.png'});
  await page.locator('#study-age').selectOption('35');await page.evaluate(()=>inkStudy.seek(1.7));await page.screenshot({path:'/tmp/ink-study-'+language+'-'+width+(enlarged?'-extra':'')+'-adult.png'});
  const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,bodyFont:getComputedStyle(document.body).fontSize,age:document.querySelector('#study-age').getBoundingClientRect().height,play:document.querySelector('#study-play').getBoundingClientRect().height,nav:[...document.querySelectorAll('header a')].map(a=>a.getBoundingClientRect().height)}));
  if(width>=1024){await page.locator('#study-compare').uncheck();const single=await page.locator('#study-play').boundingBox();assert.ok(single.y+single.height<=900,'single-view scene must not push playback below the first screen');await page.screenshot({path:'/tmp/ink-study-'+language+'-'+width+'-single.png'});await page.locator('#study-compare').check();}
  assert.equal(layout.overflow,false);assert.ok(layout.age>=44&&layout.play>=44&&layout.nav.every(n=>n>=44));if(enlarged)assert.ok(parseFloat(layout.bodyFont)>=22);
  if(width===390&&!enlarged){
   // Controller ownership: no autoplay, pause/seek/age/hide stop; natural ending stops scheduling.
   assert.equal(await page.evaluate(()=>inkStudy.playing),false);
   await page.locator('#study-play').click();await page.waitForTimeout(250);await page.locator('#study-play').click();
   const paused=await page.evaluate(()=>({time:inkStudy.time,markup:inkStudy.actor.root.outerHTML}));await page.waitForTimeout(220);assert.deepEqual(await page.evaluate(()=>({time:inkStudy.time,markup:inkStudy.actor.root.outerHTML})),paused);
   await page.locator('#study-play').click();await page.evaluate(()=>inkStudy.seek(1));assert.equal(await page.evaluate(()=>inkStudy.playing),false);
   await page.locator('#study-play').click();await page.locator('#study-age').selectOption('10');assert.equal(await page.evaluate(()=>inkStudy.playing),false);
   await page.locator('#study-play').click();await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));assert.equal(await page.evaluate(()=>inkStudy.playing),false);
   await page.evaluate(()=>inkStudy.seek(inkStudy.sequence.duration-.15));await page.locator('#study-play').click();await page.waitForTimeout(450);assert.equal(await page.evaluate(()=>inkStudy.playing),false);
   const done=await page.evaluate(()=>inkStudy.actor.root.outerHTML);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>inkStudy.actor.root.outerHTML),done);
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('#study-play').disabled);assert.equal(await page.locator('#study-play').isDisabled(),true);await page.evaluate(()=>inkStudy.seek(1.5));assert.equal(await page.evaluate(()=>inkStudy.time),1.5);
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({width,enlarged,language,errors,layout,geometry}));await page.close();
 }
}finally{await browser.close();}
