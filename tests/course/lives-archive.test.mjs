import test from 'node:test';
import assert from 'node:assert/strict';
import {readLives,recordLife,rememberWords,lifeId,LIVES_KEY,LIVES_MAX} from '../../dist/course/lives.js';
import {decodeBirth} from '../../dist/course/birthcode.js';
import {newLife,configureLife,begin,live} from '../../dist/course/sim.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';

const store=(initial)=>{const data=initial===undefined?{}:{[LIVES_KEY]:initial};return {data,getItem:k=>k in data?data[k]:null,setItem:(k,v)=>{data[k]=String(v);}};};
const lifeTo=(seed,pick)=>{let s=begin(configureLife(newLife(seed),{}));while(s.stage==='review'){s=live(s);if(s.story?.pending){const e=encounterById(s.story.pending.id);s=resolveEncounter(s,e.options[Math.min(pick,e.options.length-1)].id,.5);}}return s;};

test('a finished life is kept once, with a code that replays the same birth',()=>{
  const ended=lifeTo(31,0),s=store();
  assert.equal(ended.stage,'recap');
  const first=recordLife(s,ended,{ikigai:61,now:1000});
  assert.equal(first.length,1);assert.equal(first[0].ikigai,61);assert.equal(first[0].place,ended.birth.place);
  assert.equal(recordLife(s,ended,{ikigai:61,now:2000}).length,1,'showing the same ending twice records it once');
  assert.deepEqual(decodeBirth(first[0].code),configureLife(newLife(31),{}),'the saved code opens the same birth');
});

test('the same birth lived with other choices is another life',()=>{
  const s=store(),a=lifeTo(31,0),b=lifeTo(31,1);
  assert.notEqual(lifeId(a),lifeId(b),'different choices, different life');
  recordLife(s,a,{now:1});recordLife(s,b,{now:2});
  assert.equal(readLives(s).length,2);assert.equal(readLives(s)[0].seed,readLives(s)[1].seed);
});

test('an unfinished life is never recorded, and the archive is bounded',()=>{
  const s=store();assert.equal(recordLife(s,begin(configureLife(newLife(5),{}))).length,0);
  for(let n=1;n<=LIVES_MAX+8;n++)recordLife(s,{...lifeTo(31,0),seed:n+100,story:{seen:[{id:'x',choice:String(n)}]}},{now:n});
  assert.equal(readLives(s).length,LIVES_MAX);assert.equal(readLives(s)[0].at,LIVES_MAX+8,'newest first');
});

test('the one line a player writes is kept with its life, capped at the card length',()=>{
  const s=store(),ended=lifeTo(31,0);recordLife(s,ended);
  assert.equal(rememberWords(s,ended,'x'.repeat(200))[0].words.length,90);
  assert.equal(readLives(s)[0].words.length,90);
});

test('a damaged archive reads as empty instead of breaking the page',()=>{
  for(const raw of ['{bad','null','{"a":1}','[1,2]','[{"id":1}]'])assert.deepEqual(readLives(store(raw)),[],raw);
  assert.deepEqual(readLives(null),[]);
  assert.doesNotThrow(()=>recordLife({getItem:()=>{throw new Error('x');},setItem:()=>{throw new Error('full');}},lifeTo(31,0)));
});
