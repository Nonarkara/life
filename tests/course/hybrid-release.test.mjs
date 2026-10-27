import test,{before} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {prepareStageArt,animeManifest} from '../../dist/course/anime-assets.js';
import {paintedCovers,castSheet,describePaintedScene,beatFor,drawStage2D,MOMENT_CAPTIONS} from '../../dist/course/stage2d.js';
import {preferences,translate} from '../../dist/course/i18n.js';
import {MARKET_COPY,experiencedFundLoss,referenceFundChange,marketFollowup,recordedFundLoss,refreshMarketPrompt} from '../../dist/course/market-evidence.js';
import {createEconomy} from '../../dist/course/economy.js';
import {MONEY_LESSONS} from '../../dist/course/money-lessons.js';
import {consequencesDue} from '../../dist/course/lessons.js';
const base=(age=17)=>({age,seed:7,intake:{sex:'female'},birth:{region:'samut-prakan',household:'parents'},profiles:[],history:[{age:15,from:10,pathway:'school'}],story:{seen:[],flags:{friend:15}}});
before(async()=>{globalThis.fetch=async()=>({ok:true,json:async()=>JSON.parse(readFileSync(new URL('../../dist/course/anime/manifest.json',import.meta.url)))});await prepareStageArt();});
test('hybrid defaults to continuous3D for ordinary life and retains a single truthful moment descriptor',()=>{
 assert.equal(preferences.stage,'hybrid');assert.equal(drawStage2D({},base(),17,1,'world'),false);
 const scene=describePaintedScene(base(),17,12);assert.equal(scene.beat,'bikes');assert.equal(scene.caption,MOMENT_CAPTIONS.bikes);assert.ok(scene.actors.every(a=>a.activity.pose==='ride'));assert.equal(scene.actors[1].flipX,true);
});
test('only the current scene needs coverage: missing elderly art does not erase a teenage scene, missing cycling does',()=>{
 const manifest=animeManifest(),elder=manifest.sprites.elder,ride=manifest.sprites['friend-b']['ride-b'];
 try{delete manifest.sprites.elder;assert.equal(paintedCovers(base(),17,12),true);delete manifest.sprites['friend-b']['ride-b'];assert.equal(paintedCovers(base(),17,12),false);}finally{manifest.sprites.elder=elder;manifest.sprites['friend-b']['ride-b']=ride;}
 const fatherHome={...base(20),birth:{region:'samut-prakan',household:'fathers'}};assert.equal(paintedCovers(fatherHome,20,1),false);assert.equal(paintedCovers(fatherHome,17,12),true,'absent parents are not invented in a public scene');
});
test('missing body, residence and age-specific pose retain3D instead of silently swapping people or homes',()=>{
 assert.equal(paintedCovers({...base(),intake:{sex:'male'}},17,12),false);
 const own={...base(35),finance:{housing:'near',workplace:'city',locationSince:30}};assert.equal(paintedCovers(own,35,1),false);
 assert.equal(paintedCovers(base(0),0,1),false);
 const elder={...base(65),history:[{age:65,event:'A health setback interrupts your plans.'}]};assert.equal(describePaintedScene(elder,65,54).beat,'bed');assert.equal(paintedCovers(elder,65,54),false,'no elderly lying pose exists');
});
test('a future setback or relationship cannot appear in earlier years',()=>{
 const state={...base(50),history:[{age:45,event:'Ordinary.'},{age:50,event:'A health setback interrupts your plans.'}]};
 assert.equal(beatFor(state,46,{phase:'Evening'}),null);assert.equal(beatFor(state,50,{phase:'Evening'}),'bed');
 assert.equal(describePaintedScene({...base(),story:{seen:[],flags:{married:25}}},17,1).actors.some(a=>a.id==='partner'),false);
});
test('scene loading requests assets together and keeps3D until all required pictures are decoded',()=>{
 const requested=[],images=[];globalThis.Image=class{complete=false;naturalWidth=0;constructor(){images.push(this);}set src(value){requested.push(value);}};
 assert.equal(drawStage2D({},base(),17,12,'world'),false);assert.ok(requested.length>=5,'plate and both actors frames requested together');for(const image of images){image.complete=true;image.naturalWidth=800;image.naturalHeight=600;}delete globalThis.Image;
});
test('market loss invitation requires currently held assets and an actual recorded portfolio loss',()=>{
 const loss={finance:{holdings:{bond:{value:100,basis:110},equity:{value:200,basis:300}}},history:[{economy:{marketChange:-50,contractions:[]}}]};
 assert.equal(experiencedFundLoss(loss),true);assert.equal(experiencedFundLoss({...loss,finance:undefined}),false);assert.equal(experiencedFundLoss({...loss,history:[{economy:{marketChange:10,contractions:[20]}}]}),false);
});
test('follow-ups branch on the same scenario path, including continued losses, and remain saved literal records',()=>{
 let rise,fall;for(let seed=0;seed<1000&&(!rise||!fall);seed++){const s={economy:createEconomy(seed),story:{seen:[{id:'m_crash',age:25,choice:'hold'}]}};const change=referenceFundChange(s,25,30);if(change>0)rise=s;if(change<0)fall=s;}
 assert.ok(rise&&fall);assert.equal(marketFollowup(rise,30),MARKET_COPY.rise);assert.equal(marketFollowup(fall,30),MARKET_COPY.fall);
 const sold={...fall,story:{seen:[{id:'m_crash',age:25,choice:'sell'}]}};assert.equal(marketFollowup(sold,30),MARKET_COPY.soldFall);
 const due=consequencesDue(fall,25,30).find(r=>r.lesson==='m_crash');assert.equal(due.text,MARKET_COPY.fall);assert.equal(due.cash,0);assert.equal(due.wellbeing,0);assert.equal(typeof JSON.parse(JSON.stringify(due)).text,'string');
 assert.equal(consequencesDue(fall,30,35).filter(r=>r.lesson==='m_crash').length,0);
});
test('inflation no longer fabricates a nominal cash withdrawal or an exemption by current address',()=>{
 const lesson=MONEY_LESSONS.find(l=>l.id==='m_funds'),bank=lesson.options.find(o=>o.id==='bank');assert.equal(bank.later[0].cash,undefined);assert.equal(bank.later[0].when,undefined);
});

test('past market exposure survives a sale and an obsolete unresolved prompt clears without changing records',()=>{
 const receipts=[{id:'buy',kind:'trade',asset:'equity',side:'buy',amount:100},{id:'loss',kind:'market',deltas:{equity:-20}},{id:'encounter:30:m_crash',kind:'encounter'},{id:'sell',kind:'trade',asset:'equity',side:'sell',amount:80}];
 const state={finance:{holdings:{},receipts},history:[{age:30,economy:{marketChange:-20}}],story:{seen:[{id:'m_crash',age:30,choice:'sell'}],flags:{panicSold:30},pending:{id:'m_crash'}}};
 assert.equal(recordedFundLoss(state,30),true);const refreshed=refreshMarketPrompt(state);assert.equal(refreshed.story.pending,null);assert.equal(refreshed.finance,state.finance);assert.equal(refreshed.story.seen,state.story.seen);
});
test('moment captions, market follow-ups and hybrid choice are translated in all five supported languages',()=>{
 for(const language of ['th','zh-CN','ja','ko'])for(const text of [...Object.values(MOMENT_CAPTIONS),...Object.values(MARKET_COPY),'Hybrid · world and moments'])assert.notEqual(translate(text,language),text,language+': '+text);
});

test('a paused3D-to-painted handoff measures the visible surface and finishes a scene cut without waiting for time',()=>{
 let whiteFrames=0;const context=new Proxy({fillStyle:'',fillRect(){if(this.fillStyle==='#f6efe0')whiteFrames++;}}, {get:(target,key)=>key in target?target[key]:()=>{}});
 const rect={left:0,top:0,right:800,bottom:600,width:800,height:600};
 const surface={clientWidth:800,clientHeight:600};
 const canvas={hidden:true,clientWidth:0,clientHeight:0,parentElement:{querySelector:()=>surface,getBoundingClientRect:()=>rect},getBoundingClientRect:()=>rect,getContext:()=>context,setAttribute(){}};
 globalThis.document={querySelector:()=>null,createElement:()=>({getContext:()=>context})};globalThis.matchMedia=()=>({matches:false});globalThis.devicePixelRatio=1;globalThis.Image=class{complete=true;naturalWidth=800;naturalHeight=600;};
 try{
  assert.equal(drawStage2D(canvas,base(),17,18,'world',{animating:false}),true);assert.equal(canvas.width,800);assert.equal(canvas.height,600);
  const love={...base(24),story:{seen:[{id:'love',age:24}],flags:{dating:24}}};
  assert.equal(drawStage2D(canvas,love,24,49,'world',{animating:false}),true);assert.equal(whiteFrames,0,'paused scene must never freeze on a transition flash');
 }finally{delete globalThis.document;delete globalThis.matchMedia;delete globalThis.devicePixelRatio;delete globalThis.Image;}
});
