import assert from 'node:assert/strict';
import {begin,configureLife,newLife} from '../../dist/course/sim.js';
import {encodeBirth} from '../../dist/course/birthcode.js';
import {SAVE_KEY,BACKUP_KEY} from '../../dist/course/save.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE||'http://127.0.0.1:4543';
const browser=await chromium.launch({headless:true,channel:process.env.LIFE_BROWSER_CHANNEL||'chrome'});
const original=begin(configureLife(newLife(29),{birthYear:1981,class:'middle_class',sex:'female'}));
const replacement=configureLife(newLife(31),{birthYear:1975,class:'working_class',sex:'male'});
const replacementCode=encodeBirth(replacement);
try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
 await context.addInitScript(({key,original})=>{
  if(localStorage.getItem(key)===null)localStorage.setItem(key,JSON.stringify(original));
 },{key:SAVE_KEY,original});
 const stale=await context.newPage(),writer=await context.newPage();
 const read=page=>page.evaluate(key=>localStorage.getItem(key),SAVE_KEY);
 await stale.goto(base+'/course/',{waitUntil:'domcontentloaded'});
 await stale.locator('#load-state').waitFor({state:'detached'});
 await writer.goto(base+'/intake/?birth='+replacementCode,{waitUntil:'domcontentloaded'});
 await writer.locator('#birth-card[open] #birth-begin').click();
 await writer.waitForURL('**/course/');
 await writer.locator('#load-state').waitFor({state:'detached'});
 const active=JSON.parse(await read(writer));
 assert.equal(encodeBirth(active),replacementCode);
 const archived=await writer.evaluate(()=>JSON.parse(localStorage.getItem('life-turning-points-v1')).find(entry=>entry.scene.startsWith('resume-')));
 assert.equal(encodeBirth(archived.state),encodeBirth(original));
 await stale.evaluate(()=>window.dispatchEvent(new Event('life-preferences')));
 await stale.locator('body>header>#save-status:visible').waitFor();
 assert.match(await stale.locator('#save-status').textContent(),/another tab/);
 assert.equal(encodeBirth(JSON.parse(await read(stale))),replacementCode);
 await writer.goto(base+'/course/?turning='+encodeURIComponent(archived.id),{waitUntil:'domcontentloaded'});
 await writer.locator('#load-state').waitFor({state:'detached'});
 assert.equal(encodeBirth(JSON.parse(await read(writer))),encodeBirth(original));
 await context.close();

 const corrupt=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
 await corrupt.addInitScript(({save,backup})=>{
  localStorage.setItem(save,'{bad original');
  const set=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
   if(key===backup)throw new DOMException('test quota','QuotaExceededError');
   return set.call(this,key,value);
  };
 },{save:SAVE_KEY,backup:BACKUP_KEY});
 await corrupt.goto(base+'/course/',{waitUntil:'domcontentloaded'});
 await corrupt.locator('#load-state').waitFor({state:'detached'});
 assert.equal(await read(corrupt),'{bad original');
 assert.equal(await corrupt.evaluate(key=>localStorage.getItem(key),BACKUP_KEY),null);
 await corrupt.locator('body>header>#save-status:visible').waitFor();
 assert.match(await corrupt.locator('#save-status').textContent(),/original save is still/);
 await corrupt.close();
}finally{await browser.close();}
