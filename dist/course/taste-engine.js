// Adaptive taste & 100-player life-exchange engine:
// 1. Learns what themes a player gravitates toward (risk, craft, power, heart, wander)
//    across lives and tunes fresh birth draws toward unexplored eras/callings that fit.
// 2. Provides a deterministic 100-player roster (Player #1 .. #100) so 100 players can
//    each live a distinct Thai life and then swap numbers or birth codes to play each other's lives.
import {newLife,configureLife,validate,CLASS_KEYS} from './sim.js';
import {CLASS_REGIONS} from './regions.js';
import {COHORT_YEARS} from './thai-history.js';
import {routeOf} from './life-routes.js';
import {lifeId,readLives,reconcileEndingIds} from './lives.js';
import {canonicalLifeForSlot} from './canonical-lives.js';

export const TASTE_KEY='life-taste-v1';
const ERAS=COHORT_YEARS.filter(y=>y<2026);
const SEXES=['female','male'];
const list=(value,check,limit=200)=>Array.isArray(value)?[...new Set(value.filter(check))].slice(-limit):[];
const natural=value=>Number.isSafeInteger(value)&&value>=0?value:0;
const empty=()=>({weights:{risk:0,craft:0,power:0,heart:0,wander:0},seeds:[],routes:[],eras:[],regions:[],endings:[],lives:0});

export function readTaste(storage){
 try{
  const raw=JSON.parse(storage?.getItem(TASTE_KEY));
  if(!raw||typeof raw!=='object')return empty();
  const w=raw.weights??{};
  let weights={
   risk:Number.isFinite(w.risk)?Math.max(0,w.risk):0,
   craft:Number.isFinite(w.craft)?Math.max(0,w.craft):0,
   power:Number.isFinite(w.power)?Math.max(0,w.power):0,
   heart:Number.isFinite(w.heart)?Math.max(0,w.heart):0,
   wander:Number.isFinite(w.wander)?Math.max(0,w.wander):0
  };
  const seeds=list(raw.seeds,Number.isSafeInteger);
  const routes=Array.isArray(raw.routes)?raw.routes.filter(x=>typeof x==='string'):[];
  const eras=list(raw.eras,Number.isInteger);
  const regions=list(raw.regions,x=>typeof x==='string');
  let endings=list(raw.endings,x=>typeof x==='string',1000);
  let lives=natural(raw.lives);
  // Reconcile pre-deduplication profiles once: scale down inflated weights and
  // cap lives to distinct recorded endings/seeds so legacy reload inflation clears.
  if(!Array.isArray(raw.endings)&&lives>0){
   const recorded=readLives(storage);
   if(recorded.length>0)endings=[...new Set(recorded.map(e=>e.id))].slice(-1000);
   const cap=recorded.length>0?Math.max(recorded.length,seeds.length):seeds.length;
   if(cap>0&&lives>cap){
    const scale=cap/lives;
    weights=Object.fromEntries(Object.entries(weights).map(([k,v])=>[k,Math.round(v*scale)]));
    lives=cap;
   }
   try{storage?.setItem(TASTE_KEY,JSON.stringify({weights,seeds,routes,eras,regions,endings,lives}));}catch{}
  }
  return {weights,seeds,routes,eras,regions,endings,lives};
 }catch{return empty();}
}

export function recordTaste(storage,state){
 const cur=readTaste(storage);
 if(state?.stage!=='recap')return cur;
 const endings=reconcileEndingIds(cur.endings,state);
 if(endings!==cur.endings){cur.endings=endings;try{storage?.setItem(TASTE_KEY,JSON.stringify(cur));}catch{}}
 const id=lifeId(state);
 if(cur.endings.includes(id))return cur;
 const w={...cur.weights};
 const seen=state.story?.seen??[];
 for(const e of seen){
  if(['all','drive','fight','seize','flip','buy','borrow'].includes(e.choice))w.risk+=2;
  if(['passion','sing','art','club','page','train'].includes(e.choice))w.craft+=2;
  if(['politics','chair','found','sell','learn','top'].includes(e.choice))w.power+=2;
  if(['peace','care','water','give','home','family','ring'].includes(e.choice))w.heart+=2;
 }
 w.craft+=Math.round((state.skills?.craft??0)/8);
 w.power+=Math.round((state.skills?.drive??0)/8);
 w.heart+=Math.round((state.skills?.eq??0)/8);
 w.wander+=((state.stops??[]).length*2)+((state.bucket?.done??[]).length);
 if((state.finance?.goldPct??0)>=10)w.risk+=1;

 const seeds=[...new Set([...cur.seeds,state.seed])].slice(-200);
 const r=routeOf(state);
 const routes=r?[...new Set([...cur.routes,r])]:cur.routes;
 const by=state.intake?.birthYear;
 const eras=Number.isInteger(by)?[...new Set([...cur.eras,by])]:cur.eras;
 const regions=[...new Set([...cur.regions,state.birth?.region].filter(Boolean))];
 const next={weights:w,seeds,routes,eras,regions,endings:[...cur.endings,id].slice(-1000),lives:cur.lives+1};
 try{storage?.setItem(TASTE_KEY,JSON.stringify(next));}catch{}
 return next;
}

export function dominantTaste(taste){
 const entries=Object.entries(taste?.weights??{});
 if(!entries.length||entries.every(([,v])=>v<=0))return {key:'explorer',label:'Balanced explorer'};
 entries.sort((a,b)=>b[1]-a[1]);
 const top=entries[0][0];
 const labels={
  risk:'High-stakes risk & timing',
  craft:'Craft, music & invention',
  power:'Ambition, politics & leadership',
  heart:'Family, care & connection',
  wander:'Road stops & bucket-list collector'
 };
 return {key:top,label:labels[top]??'Balanced explorer'};
}

// Deterministic 100-player table: slots 1..16 map to individually sourced canonical
// Thai starting lives; slots 17..100 cover unique (era, class, region, sex, seed) combos
// so 100 players each get a genuinely different life and can swap slot numbers (#1..#100).
export function playerSlotBirth(slot){
 const slotNum=Math.max(1,Math.min(100,Math.floor(Number(slot)||1)));
 const canonical=canonicalLifeForSlot(slotNum);
 if(canonical){
  const life=configureLife(newLife(canonical.seed),{birthYear:canonical.birthYear,class:canonical.class,region:canonical.region,sex:canonical.sex,attributes:canonical.attributes});
  if(validate(life))return {...life,playerSlot:slotNum,canonical:{title:canonical.title,summary:canonical.summary,sourceLabel:canonical.sourceLabel,sourceHref:canonical.sourceHref}};
 }
 const n=slotNum-1;
 const birthYear=ERAS[n%ERAS.length];
 const cls=CLASS_KEYS[(Math.floor(n/ERAS.length)+n)%CLASS_KEYS.length];
 const regions=CLASS_REGIONS[cls]??['bangkok'];
 const region=regions[(n*3+Math.floor(n/5))%regions.length];
 const sex=SEXES[n%2];
 const seed=100003+n*7919+birthYear*17;
 const life=configureLife(newLife(seed),{birthYear,class:cls,region,sex});
 return validate(life)?{...life,playerSlot:slotNum}:configureLife(newLife(seed+1),{birthYear,class:cls,sex});
}

// Use the ordinary birth draw so era, place, class and household selections keep
// their existing meaning. Rank a small pool by discovered interests and novelty.
export function drawAdaptiveBirth(storage,fallbackDraw){
 const taste=readTaste(storage);
 if(!taste.lives)return fallbackDraw();
 const dom=dominantTaste(taste).key;
 const preferredClasses={
  risk:['working_class','middle_class','high_class'],
  craft:['working_class','middle_class'],
  power:['low_class','working_class','bureaucratic_class'],
  heart:['low_class','working_class','middle_class'],
  wander:['middle_class','bureaucratic_class','high_class']
 }[dom]??CLASS_KEYS;
 let best=null,bestScore=-Infinity;
 for(let i=0;i<24;i++){
  const life=fallbackDraw();
  if(!validate(life)||taste.seeds.includes(life.seed))continue;
  const route=routeOf(life);
  const score=(!taste.eras.includes(life.intake?.birthYear)?4:0)+
   (!taste.regions.includes(life.birth?.region)?3:0)+
   (route&&!taste.routes.includes(route)?2:0)+
   (preferredClasses.includes(life.intake?.class)?1:0);
  if(score>bestScore){best=life;bestScore=score;}
 }
 if(!best)best=fallbackDraw();
 // Reserve the draw independently of the finished-life count. A reroll or a
 // reload before the next ending must not deal the same recorded seed again.
 try{storage?.setItem(TASTE_KEY,JSON.stringify({...taste,seeds:[...new Set([...taste.seeds,best.seed])].slice(-200)}));}catch{}
 return {...best,novelty:true};
}
