import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createScore,initMusic} from '../../dist/course/music.js';

test('original score is bounded, deterministic, audible and has a silent loop seam',()=>{
 const a=createScore({sampleRate:8000}),b=createScore({sampleRate:8000});
 assert.deepEqual(a.data,b.data);assert.equal(a.data.length,32*8000);
 let peak=0;for(const v of a.data){assert.ok(Number.isFinite(v));peak=Math.max(peak,Math.abs(v));}
 assert.ok(peak>.03&&peak<.2);assert.equal(a.data[0],0);assert.equal(a.data.at(-1),0);
 assert.notDeepEqual(a.data,createScore({sampleRate:8000,mood:'difficult'}).data);
 assert.throws(()=>createScore({sampleRate:0}),RangeError);
});

function fixture(supported=true){
 const handlers=new Map(),store=new Map([['life-music-v1','on']]);let count=0,context;
 const button={setAttribute(){},addEventListener(k,v){handlers.set('button:'+k,v);},removeEventListener(k){handlers.delete('button:'+k);},remove(){}};
 const document={hidden:false,createElement:()=>button,querySelector:()=>({append(){}}),addEventListener(k,v){handlers.set(k,v);},removeEventListener(k){handlers.delete(k);}};
 class AudioContext{
  constructor(){count++;context=this;this.state='suspended';this.currentTime=0;this.destination={};}
  createGain(){return {gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){}},connect(){}};}
  createBuffer(){return {copyToChannel(){}};}createBufferSource(){return {connect(){},start(){},stop(){},disconnect(){}};}
  async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}
 }
 const controller=initMusic({document,window:supported?{AudioContext}:{},storage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)}});
 return {controller,document,button,store,handlers,get context(){return context;},get count(){return count;},click:()=>handlers.get('button:click')()};
}
test('saved preference never autoplays; gesture starts, mute persists and hidden page stays silent',async()=>{
 const f=fixture();assert.equal(f.count,0);assert.equal(f.controller.preferred,true);assert.equal(f.controller.playing,false);
 await f.click();assert.equal(f.count,1);assert.equal(f.controller.playing,true);assert.equal(f.button.textContent,'Mute');
 f.document.hidden=true;f.handlers.get('visibilitychange')();assert.equal(f.controller.playing,false);assert.equal(f.context.state,'suspended');assert.equal(f.store.get('life-music-v1'),'on');
 f.document.hidden=false;f.handlers.get('visibilitychange')();assert.equal(f.controller.playing,false);
 await f.click();await f.click();assert.equal(f.store.get('life-music-v1'),'off');assert.equal(f.context.state,'suspended');
 await f.controller.destroy();assert.equal(f.context.state,'closed');assert.equal(f.handlers.size,0);
});
test('unsupported audio leaves the game usable with an explicit unavailable control',()=>{
 const f=fixture(false);assert.equal(f.count,0);assert.equal(f.button.disabled,true);assert.equal(f.button.textContent,'Music unavailable');
});
