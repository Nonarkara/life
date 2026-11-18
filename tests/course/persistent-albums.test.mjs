import test from 'node:test';
import assert from 'node:assert/strict';
import {newLife,configureLife,begin} from '../../dist/course/sim.js';
import {readLives,recordLife,lifeId,legacyLifeId,LIVES_KEY,rememberWords} from '../../dist/course/lives.js';
import {recordTaste,readTaste,TASTE_KEY} from '../../dist/course/taste-engine.js';
import {recordAlmanac,readAlmanac,ALMANAC_KEY,TOTAL_STOPS} from '../../dist/course/almanac.js';
import {STOPS} from '../../dist/course/life-collection.js';
import {encodeBirth} from '../../dist/course/birthcode.js';
const store=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
const ending=()=>({...begin(configureLife(newLife(734),{class:'middle_class',birthYear:1960})),age:60,stage:'recap',history:[{from:20,age:25,pathway:'work'}],bucket:{custom:[],planned:[{id:'future',key:'art',age:65,label:'Take an art course',days:3,cost:900}],done:[{id:'bucket:21:library',key:'library',age:21,label:'Spend a day at the library',days:1,cost:0}]},stops:[{id:'s_huahin',age:25}]});

test('completed receipts and notes survive active-save replacement and archive reload',()=>{
 const s=store(),life=ending(),notes=[{id:'source',age:25,title:'A lesson',text:'An authored explanation.'}];
 const archived=recordLife(s,life,{notes,now:123});
 assert.equal(archived[0].album.entries.length,3);
 assert.deepEqual(archived[0].album.notes,[{age:25,title:'A lesson',text:'An authored explanation.'}]);
 assert.ok(!archived[0].album.entries.some(e=>e.label==='Take an art course'));
 s.setItem('life-course-v2',JSON.stringify(newLife(923)));
 const loaded=readLives(s);assert.deepEqual(loaded,archived);
 recordLife(s,life,{notes,now:999});assert.equal(readLives(s).length,1);assert.equal(readLives(s)[0].at,123);
 rememberWords(s,life,'The day at the library.');assert.equal(readLives(s)[0].words,'The day at the library.');
});

test('equal final metrics no longer collapse different choices or collected experiences',()=>{
 const life=ending(),variants=[
  {...life,stops:[{id:'h_inthanon',age:25}]},
  {...life,pivots:[{station:15,pivot:'school-apprentice',choice:'both'}]},
  {...life,bucket:{...life.bucket,done:[]}},
  {...life,history:[{from:20,age:25,pathway:'college'}]},
  {...life,lifeGoals:['wander']}
 ];
 const s=store();recordLife(s,life);
 for(const variant of variants){assert.equal(legacyLifeId(variant),legacyLifeId(life));assert.notEqual(lifeId(variant),lifeId(life));recordLife(s,variant);}
 assert.equal(readLives(s).length,6);
 const reordered=Object.fromEntries(Object.entries(life).reverse());assert.equal(lifeId(reordered),lifeId(life));
 assert.equal(lifeId(JSON.parse(JSON.stringify(life))),lifeId(life));
 const glyph=label=>({...life,bucket:{...life.bucket,done:[{...life.bucket.done[0],label}]}});assert.notEqual(lifeId(glyph('😄')),lifeId(glyph('😅')),'all UTF-16 units of custom labels affect identity');
 assert.equal(lifeId({...life,progressAge:59,previous:newLife(5)}),lifeId(life),'presentation and replay state excluded');
});

test('upgrading an old ending preserves its words, date, taste weights and counts once',()=>{
 const s=store(),life=ending(),old=legacyLifeId(life),code=encodeBirth(life);
 s.setItem(LIVES_KEY,JSON.stringify([{id:old,seed:life.seed,code,place:life.birth.place,age:60,at:123,ikigai:61,words:'Keep this line'}]));
 s.setItem(TASTE_KEY,JSON.stringify({weights:{risk:4,craft:3,power:0,heart:2,wander:1},seeds:[life.seed],routes:[],eras:[1960],regions:[],endings:[old],lives:1}));
 s.setItem(ALMANAC_KEY,JSON.stringify({routes:[],stops:[],notes:[],bestScore:40,endings:[old],lives:1}));
 const before=readTaste(s).weights;
 recordLife(s,life);recordTaste(s,life);recordAlmanac(s,life);
 const entry=readLives(s)[0];assert.equal(entry.id,lifeId(life));assert.equal(entry.words,'Keep this line');assert.equal(entry.at,123);assert.equal(entry.ikigai,61);assert.ok(entry.album);
 assert.deepEqual(readTaste(s).weights,before);assert.equal(readTaste(s).lives,1);assert.equal(readAlmanac(s).lives,1);
 recordLife(s,life);recordTaste(s,life);recordAlmanac(s,life);assert.equal(readLives(s).length,1);assert.equal(readTaste(s).lives,1);
 const different={...life,stops:[{id:'h_inthanon',age:25}]};recordLife(s,different);recordTaste(s,different);recordAlmanac(s,different);
 assert.equal(readLives(s).length,2);assert.equal(readTaste(s).lives,2);assert.equal(readAlmanac(s).lives,2);
});

test('older summaries survive damaged optional album data without invented backfill',()=>{
 const s=store();recordLife(s,ending());const list=readLives(s);list[0].album={version:1,entries:[{label:'bad',from:21,to:21,days:1}],notes:[]};s.setItem(LIVES_KEY,JSON.stringify(list));
 const loaded=readLives(s);assert.equal(loaded.length,1);assert.equal(loaded[0].album,undefined);assert.equal(loaded[0].code,list[0].code);
});

test('a failed write returns persisted summaries and does not claim a new saved album',()=>{
 const s=store();recordLife(s,ending());const before=readLives(s);
 const failing={getItem:s.getItem,setItem:()=>{throw new Error('quota');}};
 assert.deepEqual(recordLife(failing,{...ending(),stops:[]}),before);
 assert.deepEqual(readLives(s),before);
});

test('unfinished lives add no discoveries and the road-stop denominator follows the registry',()=>{
 const s=store(),life={...ending(),stage:'review'};
 recordLife(s,life);recordAlmanac(s,life,{routeId:'boxer',noteIds:['fake']});recordTaste(s,life);
 assert.equal(readLives(s).length,0);assert.equal(readAlmanac(s).stops.length,0);assert.equal(readTaste(s).lives,0);
 assert.equal(TOTAL_STOPS,Object.keys(STOPS).length);
});
