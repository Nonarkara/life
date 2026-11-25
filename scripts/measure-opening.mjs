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

function trackTransfer(cdp,origin){
 const requests=new Map();
 const resources=[];
 cdp.on('Network.requestWillBeSent',({requestId,request,redirectResponse})=>{
  if(redirectResponse)requests.delete(requestId);
  const url=new URL(request.url);
  if(url.origin===origin)requests.set(requestId,url.pathname);
 });
 cdp.on('Network.loadingFinished',({requestId,encodedDataLength})=>{
  const name=requests.get(requestId);
  if(name)resources.push({name,bytes:encodedDataLength});
  requests.delete(requestId);
 });
 cdp.on('Network.loadingFailed',({requestId})=>requests.delete(requestId));
 return ()=>{
  const finished=resources.splice(0);
  return {
   transfer:finished.reduce((sum,entry)=>sum+entry.bytes,0),
   scriptTransfer:finished.filter(entry=>entry.name.endsWith('.js')).reduce((sum,entry)=>sum+entry.bytes,0),
   packs:finished.filter(entry=>entry.name.startsWith('/language/'))
  };
 };
}
const longTasks=page=>page.evaluate(()=>window.lifeOpeningLongTasks);

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
   const takeTransfer=trackTransfer(cdp,base.origin);
   await cdp.send('Network.enable');
   await cdp.send('Network.emulateNetworkConditions',profile);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:2});
   for(const cache of ['cold','warm']){
    takeTransfer();
    const target=new URL('/',base);
    target.searchParams.set('lang',language);
    if(mode==='featured')target.searchParams.set('featured','school');
    const now=Date.now();
    await page.goto(target.href,{waitUntil:'domcontentloaded'});
    const play=page.locator('#overview .actions .begin');
    await page.waitForFunction(({mode,language})=>{
     const link=document.querySelector('#overview .actions .begin');
     if(!link)return false;
     const target=new URL(link.href);
     return target.searchParams.get('lang')===language
      &&(mode==='featured'?target.searchParams.get('featured')==='school':target.searchParams.get('next')==='1');
    },{mode,language});
    const landingTasks=await longTasks(page);
    await play.click();
    await page.waitForURL(url=>url.pathname==='/intake/');
    const confirm=page.locator('#birth-card[open] #birth-begin');
    await confirm.waitFor();
    const cardMs=Date.now()-now,cardTasks=await longTasks(page);
    await confirm.click();
    if(mode==='ordinary')await page.locator('#arrival-choice:visible').click();
    const options=page.locator('.decision-dialog[open] .pivot-option:visible');
    await options.first().waitFor();
    const firstChoiceMs=Date.now()-now;
    // The game stays playable while a pack is late. Measure translated controls
    // separately so a fallback prompt never counts as a completed Thai opening.
    if(language==='th')await options.filter({hasText:/[\u0e00-\u0e7f]/u}).first().waitFor();
    const translatedChoiceMs=Date.now()-now,choiceTasks=await longTasks(page);
    const row={cardMs,firstChoiceMs,translatedChoiceMs,...takeTransfer(),
     longTasks:landingTasks+cardTasks+choiceTasks};
    runs[cache].push(row);
    console.log(JSON.stringify({mode,language,cache,run:run+1,...row}));
    await page.goto('about:blank');
    await cdp.send('Storage.clearDataForOrigin',{origin:base.origin,storageTypes:'local_storage'});
   }
   await context.close();
  }
  for(const cache of ['cold','warm']){
   const values=runs[cache];
   const summary=Object.fromEntries(['cardMs','firstChoiceMs','translatedChoiceMs','transfer','scriptTransfer','longTasks'].map(metric=>
    [metric,{median:percentile(values.map(row=>row[metric]),.5),p75:percentile(values.map(row=>row[metric]),.75)}]));
   console.log(JSON.stringify({mode,language,cache,summary,samples:count}));
  }
 }
}finally{await browser.close();}
