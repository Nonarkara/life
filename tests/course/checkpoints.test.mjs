// Going back: every review of a life is kept exactly as it stood, and returning to one replays the same luck.
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {newLife,begin,live,configureLife,rand,validate} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter,setFamiliar,familiarIds} from '../../dist/course/encounters.js';
import {relive} from '../../dist/course/life-reading.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {keepPoint,forgetAfter,metFor,pointAges,goBack,timesBack,readPoints} from '../../dist/course/checkpoints.js';
import {translate} from '../../dist/course/i18n.js';

const box=(limit=Infinity)=>{const m=new Map();return {limit,getItem:k=>m.has(k)?m.get(k):null,setItem(k,v){if(v.length>this.limit)throw new Error('quota');m.set(k,v);},removeItem:k=>m.delete(k)};};
// One life, played by a rule: `pick` chooses among the open answers.
const settle=(s,pick)=>{for(let n=0;n<12;n++){const list=pendingPivots(s);if(!list.length)break;const q=list[0],open=openOptions(q,s),next=applyPivot(s,q,open[pick(open.length,'p'+q.id,s)].id);if(next===s)break;s=next;}
 if(s.story?.pending){const e=encounterById(s.story.pending.id),open=e.options.filter(o=>choiceAvailable(s,o)),list=open.length?open:e.options;s=resolveEncounter(s,list[pick(list.length,'e'+e.id,s)].id,.5);}return s;};
const first=()=>0,last=n=>n-1;
const play=(storage,start,pick,until=80)=>{let s=start;const arrivals=[];s=settle(s,pick);for(let g=0;g<30&&s.stage==='review'&&s.age<until;g++){const next=live(s);if(next===s)break;s=next;if(s.stage==='review'){keepPoint(storage,s);arrivals.push(s);}s=settle(s,pick);}return {s,arrivals};};
const born=(seed=7919+1970)=>begin(configureLife(newLife(seed),{class:'middle_class',sex:'female',birthYear:1970}));

test('every review is kept as it stood on arrival, and the kept life is a valid save',()=>{
 const st=box(),start=born();keepPoint(st,start,true);const {s,arrivals}=play(st,start,first);
 assert.ok(arrivals.length>=5,'a life of '+arrivals.length+' reviews');
 const p=readPoints(st,start.seed);assert.deepEqual(Object.keys(p.points).map(Number),[10,...arrivals.map(a=>a.age)]);
 for(const a of arrivals){const kept=p.points[a.age];assert.deepEqual(kept,JSON.parse(JSON.stringify(a)),'age '+a.age+' is the arrival, before any answer');assert.equal(validate(kept),true);}
 assert.deepEqual(pointAges(st,s),[...arrivals.map(a=>a.age).reverse(),10].filter(a=>a<s.age||s.stage==='recap'));
 assert.equal(pointAges(st,{...s,seed:s.seed+1}).length,0,'another birth has none of these');
});

test('going back returns that exact moment: the same answers replay the same life, a different answer a different one',()=>{
 const st=box(),start=born();keepPoint(st,start,true);const {s:end,arrivals}=play(st,start,first),age=arrivals[2].age;
 const point=goBack(st,end,age);assert.deepEqual(point,JSON.parse(JSON.stringify(arrivals[2])));
 assert.equal(timesBack(st,end),1);assert.deepEqual(pointAges(st,{...end,age:99}),arrivals.filter(a=>a.age<=age).map(a=>a.age).reverse().concat(10),'the years after it have not happened yet');
 const same=play(box(),point,first).s;assert.deepEqual(same.history.map(r=>[r.age,r.wellbeing,r.health]),end.history.map(r=>[r.age,r.wellbeing,r.health]),'same luck, same answers, same life');
 assert.equal(same.death?.age,end.death?.age);
 const other=play(box(),point,last).s;assert.notDeepEqual(other.history.map(r=>[r.age,r.wellbeing,r.health]),end.history.map(r=>[r.age,r.wellbeing,r.health]),'other answers, another life');
 // The row of the review itself takes the new answers; everything before it is as it was.
 const flat=x=>JSON.parse(JSON.stringify(x));assert.deepEqual(flat(other.history.filter(r=>r.age<age)),flat(end.history.filter(r=>r.age<age)),'and the years before it are untouched');
 assert.equal(validate(JSON.parse(JSON.stringify(other))),true);
});

test('going back is counted, refuses what it does not hold, and a new life starts a new record',()=>{
 const st=box(),start=born();keepPoint(st,start,true);const {s:end,arrivals}=play(st,start,first);
 assert.equal(goBack(st,end,12),null);assert.equal(goBack(st,{...end,seed:end.seed+1},arrivals[0].age),null);assert.equal(timesBack(st,end),0);
 goBack(st,end,arrivals[3].age);goBack(st,end,arrivals[1].age);assert.equal(timesBack(st,end),2);
 assert.equal(goBack(st,end,arrivals[3].age),null,'a later review was dropped by going further back');
 keepPoint(st,start,true);assert.equal(timesBack(st,start),0);assert.deepEqual(pointAges(st,{...start,age:99}),[10]);
 assert.equal(keepPoint(st,{...start,stage:'recap'}),false);assert.equal(keepPoint(null,start),false);assert.deepEqual(pointAges(null,start),[]);assert.equal(goBack(null,start,10),null);
 const broken={getItem:()=>'{not json',setItem(){}};assert.deepEqual(pointAges(broken,start),[]);
});

test('when the device runs out of room the earliest reviews go first, and the latest is never given up',()=>{
 const start=born(),dry=play(box(),start,first).arrivals,biggest=Math.max(...dry.map(a=>JSON.stringify(a).length)),st=box(Math.round(biggest*2.5));keepPoint(st,start,true);const {s,arrivals}=play(st,start,first);
 const ages=pointAges(st,{...s,age:99});assert.ok(ages.length>=1&&ages.length<arrivals.length+1,'some were dropped: '+ages);
 assert.equal(ages[0],arrivals.at(-1).age,'the latest review is kept');assert.ok(!ages.includes(10),'the earliest went first');
 // Room for less than one state: nothing is written, the call says so, and what was kept before stays.
 const tight=box();keepPoint(tight,start,true);keepPoint(tight,dry[0]);tight.limit=300;
 assert.equal(keepPoint(tight,dry[1]),false);assert.deepEqual(pointAges(tight,{...s,age:99}),[dry[0].age,10]);
 // A device that refuses every write: going back is refused, not half done, and the abandoned years are not offered as if kept.
 assert.equal(goBack(tight,s,10),null);assert.equal(timesBack(tight,s),0);assert.deepEqual(pointAges(tight,{...s,age:99}),[dry[0].age,10]);
});

test('a what-if that resumes at an answered review keeps that review as it arrived, and forgets what came after',()=>{
 const st=box(),start=born();keepPoint(st,start,true);const {s:end,arrivals}=play(st,start,first);
 const fork=end.history.flatMap(r=>(r.pivots??[]).map(p=>({...p,age:r.from}))).find(p=>p.age>=15&&arrivals.some(a=>a.age===p.age));assert.ok(fork,'this life answered a question at a review');
 const branch=relive(end,fork.pivot,fork.choice,true),arrival=JSON.parse(JSON.stringify(arrivals.find(a=>a.age===branch.age)));
 assert.equal(forgetAfter(st,branch),true);
 assert.deepEqual(readPoints(st,end.seed).points[branch.age],arrival,'the arrival at '+branch.age+' is still unanswered');
 assert.deepEqual(pointAges(st,{...end,age:99}),arrivals.filter(a=>a.age<=branch.age).map(a=>a.age).reverse().concat(10));
 assert.equal(goBack(st,end,branch.age,()=>false),null,'a state the game refuses is not played');assert.equal(timesBack(st,end),0,'and is not counted');
});

test('the scene memory a life began with is kept, so going back after a reload meets the same scenes',()=>{
 const pass=(met,start,storage)=>{setFamiliar(met);return play(storage,start,first);};
 const start={...born(31*7919+1981),novelty:true},st=box();setFamiliar(['flood_help','bully']);keepPoint(st,start,true,familiarIds());
 assert.deepEqual(metFor(st,start.seed),['flood_help','bully']);
 const one=pass(metFor(st,start.seed),start,st),scenes=x=>x.story.seen.map(e=>e.age+':'+e.id).join(' ');
 const point=goBack(st,one.s,one.arrivals[1].age);assert.deepEqual(metFor(st,start.seed),['flood_help','bully'],'going back keeps it');
 // After a reload the device remembers this life's own scenes too. Played with that memory the scenes can change; with the kept memory they do not.
 const same=pass(metFor(st,start.seed),point,box());assert.equal(scenes(same.s),scenes(one.s));
 let drift=0;for(let i=1;i<=40;i++){const b={...born(i*7919+1981),novelty:true},a=pass([],b,box()),again=pass(a.s.story.seen.map(e=>e.id),a.arrivals[1]??b,box());if(scenes(again.s)!==scenes(a.s))drift++;}
 assert.ok(drift>0,'without the kept memory some lives do drift, which is what this guards');setFamiliar([]);
 assert.equal(metFor(box(),1),null);
});

test('the ending offers the way back, in every language',()=>{
 const game=readFileSync(new URL('../../dist/course/game.js',import.meta.url),'utf8');
 for(const part of ["render();keepPoint(store,state,true,familiarIds());","render();keepPoint(store,state);focusChapter();","forgetAfter(store,state);","goBack(store,state,age,validate)","new CustomEvent('life-branch',{detail:{...point,previous}})","const met=metFor(store,state.seed,state);if(met)setFamiliar(met);"])assert.ok(game.includes(part),part);
 for(const lang of ['th','zh-CN','ja','ko'])for(const key of ['Go back to age {n} and choose again →','Go back to another age','That review is no longer kept on this device.','You went back once in this life.','You went back {n} times in this life.']){const said=translate(key,lang);assert.notEqual(said,key);if(key.includes('{n}'))assert.ok(said.includes('{n}'));}
});
