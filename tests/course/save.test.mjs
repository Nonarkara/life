import test from 'node:test';
import assert from 'node:assert/strict';
import {readSave,saveSession,SAVE_KEY,BACKUP_KEY} from '../../dist/course/save.js';
import {newLife,begin,validate} from '../../dist/course/sim.js';

const store=(initial={},{failGet=false,failSet=false}={})=>{const data={...initial};return {data,getItem:k=>{if(failGet)throw new Error('blocked');return k in data?data[k]:null;},setItem:(k,v)=>{if(failSet)throw new Error('full');data[k]=String(v);}};};

test('a valid save is returned and nothing is backed up',()=>{
  const life=begin(newLife(5)),s=store({[SAVE_KEY]:JSON.stringify(life)}),got=readSave(s,validate);
  assert.equal(got.life.seed,5);assert.equal(got.storage,true);assert.equal(got.unreadable,false);assert.ok(!(BACKUP_KEY in s.data));
});
test('no save is a normal first visit, not a failure',()=>{
  const got=readSave(store(),validate);assert.equal(got.life,null);assert.equal(got.storage,true);assert.equal(got.unreadable,false);
});
test('a corrupted, mis-shaped or out-of-range save is kept aside, never lost',()=>{
  const life=begin(newLife(5));
  for(const raw of ['{not json','{"a":1}',JSON.stringify({...life,age:999}),'null','[]']){
    const s=store({[SAVE_KEY]:raw}),got=readSave(s,validate);
    assert.equal(got.life,null,raw);assert.equal(got.unreadable,true,raw);assert.equal(s.data[BACKUP_KEY],raw,'the unreadable save is copied before a new life overwrites it: '+raw);
  }
});
test('a browser that blocks storage is reported, and does not throw',()=>{
  assert.equal(readSave(store({},{failGet:true}),validate).storage,false);
  assert.equal(readSave(null,validate).storage,false);
  const full=readSave(store({[SAVE_KEY]:'{bad'},{failSet:true}),validate);
  assert.equal(full.unreadable,true,'a full disk cannot stop the game from starting');
});


test('a failed corrupt backup blocks autosave and replacement',()=>{
 const box=store({[SAVE_KEY]:'{bad'},{failSet:true});
 const session=saveSession(box,validate),life=begin(newLife(11));
 assert.equal(session.initial.backedUp,false);
 assert.equal(session.write(life),'unreadable');
 assert.equal(session.write(life,()=>true),'unreadable');
 assert.equal(box.data[SAVE_KEY],'{bad');
});

test('replacement requires preserving the active life and stale writers cannot overwrite it',()=>{
 const old=begin(newLife(5)),next=begin(newLife(11)),box=store({[SAVE_KEY]:JSON.stringify(old)});
 const tab=saveSession(box,validate),stale=saveSession(box,validate);
 assert.equal(tab.write(next,()=>false),'archive');
 assert.deepEqual(JSON.parse(box.data[SAVE_KEY]),old);
 assert.equal(tab.write(next,archived=>archived.seed===old.seed),'saved');
 assert.equal(stale.write(old),'changed');
 assert.equal(JSON.parse(box.data[SAVE_KEY]).seed,next.seed);
 assert.equal(tab.write(next,()=>{throw new Error('already written');}),'saved');
});
