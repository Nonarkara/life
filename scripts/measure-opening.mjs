// Measure the path a player takes, including navigation and confirmation.
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=new URL(process.env.BASE||'http://127.0.0.1:4543');
const count=Number(process.env.LIFE_SAMPLES||7);
const languages=(process.env.LIFE_LANGUAGES||'en,th').split(',');
const modes=(process.env.LIFE_OPENINGS||'ordinary,featured').split(',');
const profile={offline:false,latency:40,downloadThroughput:1e6,uploadThroughput:250000};
assert.ok(Number.isInteger(count)&&count>0);
const build=await fetch(new URL('/build.json',base)).then(res=>res.json());
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
const percentile=(values,p)=>[...values].sort((a,b)=>a-b)[Math.ceil(values.length*p)-1];

async function marks(page){
 return page.evaluate(()=>{
  const entries=performance.getEntriesByType('navigation').concat(performance.getEntriesByType('resource'));
  const same=entries.filter(entry=>new URL(entry.name).origin===location.origin);
  return {url:location.pathname,transfer:same.reduce((sum,entry)=>sum+entry.transferSize,0),
   scripts:same.filter(entry=>new URL(entry.name).pathname.endsWith('.js')).reduce((sum,entry)=>sum+entry.transferSize,0),
   packs:same.filter(entry=>new URL(entry.name).pathname.startsWith('/language/')).map(entry=>({
    name:new URL(entry.name).pathname,bytes:entry.transferSize})),
   longTasks:window.lifeOpeningLongTasks};
 });
}

try{
 console.log(JSON.stringify({build:build.build,browser:browser.version(),viewport:[390,844],profile,cpu:2}));
 for(const mode of modes)for(const language of languages){
  const runs={cold:[],warm:[]};
  for(let run=0;run<count;run++){
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
   await context.addInitScript(()=>{
    window.lifeOpeningLongTasks=0;
    if(PerformanceObserver.supportedEntryTypes.includes('longtask')){
     new PerformanceObserver(list=>{window.lifeOpeningLongTasks+=list.getEntries().length;})
      .observe({type:'longtask',buffered:true});
    }
   });
   const page=await context.newPage(),cdp=await context.newCDPSession(page);
   await cdp.send('Network.enable');
   await cdp.send('Network.emulateNetworkConditions',profile);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:2});
   for(const cache of ['cold','warm']){
    const target=new URL('/',base);
    target.searchParams.set('lang',language);
    if(mode==='featured')target.searchParams.set('featured','school');
    const now=Date.now();
    await page.goto(target.href,{waitUntil:'domcontentloaded'});
    const play=page.locator('#overview .actions .begin');
    if(mode==='featured')await page.waitForFunction(()=>document.querySelector('#overview .actions .begin').href.includes('featured=school'));
    const landing=await marks(page);
    await play.click();
    await page.waitForURL(url=>url.pathname==='/intake/');
    if(!await page.locator('#birth-card[open]').count()&&!new URL(page.url()).searchParams.has('next')&&mode==='ordinary'){
     await page.locator('#random-life').click();
    }
    const confirm=page.locator('#birth-card[open] #birth-begin');
    await confirm.waitFor();
    const cardMs=Date.now()-now,card=await marks(page);
    await confirm.click();
    if(mode==='ordinary')await page.locator('#arrival-choice:visible').click();
    await page.locator('.decision-dialog[open] .pivot-option:visible').first().waitFor();
    const firstChoiceMs=Date.now()-now,choice=await marks(page);
    const row={cardMs,firstChoiceMs,transfer:landing.transfer+card.transfer+choice.transfer,
     scriptTransfer:landing.scripts+card.scripts+choice.scripts,
     longTasks:landing.longTasks+card.longTasks+choice.longTasks,packs:[...landing.packs,...card.packs,...choice.packs]};
    runs[cache].push(row);
    console.log(JSON.stringify({mode,language,cache,run:run+1,...row}));
    await page.goto('about:blank');
    await cdp.send('Storage.clearDataForOrigin',{origin:base.origin,storageTypes:'local_storage'});
   }
   await context.close();
  }
  for(const cache of ['cold','warm']){
   const values=runs[cache];
   const summary=Object.fromEntries(['cardMs','firstChoiceMs','transfer','scriptTransfer','longTasks'].map(metric=>
    [metric,{median:percentile(values.map(row=>row[metric]),.5),p75:percentile(values.map(row=>row[metric]),.75)}]));
   console.log(JSON.stringify({mode,language,cache,summary,samples:count}));
  }
 }
}finally{await browser.close();}
