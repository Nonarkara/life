import test from 'node:test';import assert from 'node:assert/strict';
import {createSceneReel} from '../../dist/start/scene-reel.js';
test('the cover preview does not autoplay, ends once, and stops queued motion on interruption',()=>{
 const jobs=new Map(),drawn=[];let id=0;
 const reel=createSceneReel({count:4,draw:n=>drawn.push(n),schedule:fn=>{jobs.set(++id,fn);return id;},cancel:key=>jobs.delete(key)});
 assert.equal(jobs.size,0);reel.play();assert.equal(jobs.size,1);reel.play();assert.equal(jobs.size,1);
 const queued=jobs.values().next().value;reel.stop();queued();assert.deepEqual(drawn,[]);assert.equal(jobs.size,0);
 reel.play();while(jobs.size){const [key,fn]=jobs.entries().next().value;jobs.delete(key);fn();}
 assert.deepEqual(drawn,[1,2,3]);assert.equal(reel.status().running,false);assert.equal(jobs.size,0);
 reel.step();assert.equal(reel.status().index,0);assert.equal(jobs.size,0,'manual reduced-motion steps never start a timer');
});
