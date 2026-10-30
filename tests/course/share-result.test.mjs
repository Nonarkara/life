import test from 'node:test';import assert from 'node:assert/strict';
import {dailyLife,dailyDateFor,birthURL,encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {configureLife,newLife,replay} from '../../dist/course/sim.js';
import {resultShare,deliverShare} from '../../dist/course/share-result.js';
import {phrases} from '../../dist/course/translations.js';
import {recordLife,readLives,LIVES_KEY} from '../../dist/course/lives.js';
const day='2026-10-30',now=new Date(day+'T12:00:00Z');
test('same seed with different starting conditions never impersonates the daily birth',()=>{
 const daily=dailyLife(day),other=configureLife(newLife(daily.seed),{...daily.intake,sex:daily.intake.sex==='male'?'female':'male'});
 assert.equal(dailyDateFor(daily,now),day);assert.equal(dailyDateFor(other,now),null);assert.equal(dailyDateFor({...other,dailyDay:day},now),null);
});
test('recorded date and exact birth link survive rollover and more than400days',()=>{
 const life={...dailyLife(day),dailyDay:day},later=new Date('2030-01-01T00:00:00Z'),url=new URL(birthURL(life,undefined,later));
 assert.equal(url.origin,'https://life.nonarkara.org');assert.equal(url.searchParams.get('day'),day);assert.equal(url.searchParams.get('birth'),encodeBirth(life));assert.deepEqual(decodeBirth(url.searchParams.get('birth')),dailyLife(day));
 assert.equal(dailyDateFor(replay(life),later),day);
 for(const bad of ['2026-02-30','garbage','2026-10-31'])assert.equal(dailyDateFor({...life,dailyDay:bad},now),null);
});
test('daily and ordinary results include real age, game-score qualifier and immutable URL in every language',()=>{
 const dictionary=new Map(phrases.map(row=>[row[0],row]));for(const daily of [true,false])for(let language=0;language<5;language++){
 const state={...(daily?dailyLife(day):configureLife(newLife(777),{})),age:65,...(daily?{dailyDay:day}:{})},payload=resultShare(state,{score:57,translate:s=>dictionary.get(s)?.[language]??s,now});
 assert.match(payload.text,/65/);assert.match(payload.text,/57\/100/);assert.ok(!/[{}]/.test(payload.text));assert.equal(new URL(payload.url).searchParams.get('birth'),encodeBirth(state));assert.ok(!payload.url.includes('birth=daily'));if(daily)assert.ok(payload.text.includes(day));
 }
});
test('native cancellation never copies; failures fall back once and failures remain copyable',async()=>{
 const payload={title:'Life2.0',text:'A life',url:'https://life.nonarkara.org/intake/?birth=x'},writes=[];
 assert.equal(await deliverShare(payload,{share:async()=>{},clipboard:{writeText:async v=>writes.push(v)}}),'shared');assert.equal(writes.length,0);
 assert.equal(await deliverShare(payload,{share:async()=>{throw {name:'AbortError'};},clipboard:{writeText:async v=>writes.push(v)}}),'cancelled');assert.equal(writes.length,0);
 assert.equal(await deliverShare(payload,{share:async()=>{throw Error('denied');},clipboard:{writeText:async v=>writes.push(v)}}),'copied');assert.deepEqual(writes,['A life '+payload.url]);
 assert.equal(await deliverShare(payload,{clipboard:{writeText:async()=>{throw Error('denied');}}}),'manual');assert.equal(await deliverShare(payload,{}),'manual');assert.equal(await deliverShare(null,{}),'unavailable');
});

test('pending native sharing exposes manual text while keeping one operation in flight; stalled clipboard is bounded',async()=>{
 const payload={text:'Result',url:'https://life.nonarkara.org'};let finish,waiting=0,copied=false,settled=false;
 const result=deliverShare(payload,{share:()=>new Promise(resolve=>{finish=resolve;}),clipboard:{writeText:()=>{copied=true;}}},{timeoutMs:5,onWaiting:()=>waiting++}).then(value=>{settled=true;return value;});
 await new Promise(resolve=>setTimeout(resolve,15));assert.equal(waiting,1);assert.equal(settled,false);assert.equal(copied,false);finish();assert.equal(await result,'shared');assert.equal(copied,false);
 assert.equal(await deliverShare(payload,{clipboard:{writeText:()=>new Promise(()=>{})}},{timeoutMs:5}),'manual');
});

test('another open native share never triggers clipboard as a fallback',async()=>{let copied=false;assert.equal(await deliverShare({text:'Life',url:'https://life.nonarkara.org'},{share:async()=>{throw {name:'InvalidStateError'};},clipboard:{writeText:()=>{copied=true;}}}),'manual');assert.equal(copied,false);});

test('an already archived daily result gains its verified date without losing words or duplicating',()=>{
 const state={...dailyLife(day),dailyDay:day,stage:'recap',age:65};let data=null;const storage={getItem:()=>data,setItem:(_,value)=>{data=value;}};recordLife(storage,state);const old=JSON.parse(data);delete old[0].dailyDay;old[0].words='A quiet life';data=JSON.stringify(old);recordLife(storage,state);const saved=readLives(storage);assert.equal(saved.length,1);assert.equal(saved[0].dailyDay,day);assert.equal(saved[0].words,'A quiet life');
});
