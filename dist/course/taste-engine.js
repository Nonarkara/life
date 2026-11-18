// Adaptive taste & 100-player life-exchange engine:
// 1. Learns what themes a player gravitates toward (risk, craft, power, heart, wander)
//    across lives and tunes fresh birth draws toward unexplored eras/callings that fit.
// 2. Provides a deterministic 100-player roster (Player #1 .. #100) so 100 players can
//    each live a distinct Thai life and then swap numbers or birth codes to play each other's lives.
import {newLife,configureLife,validate,CLASS_KEYS} from './sim.js';
import {CLASS_REGIONS} from './regions.js';
import {COHORT_YEARS} from './thai-history.js';
import {routeOf} from './life-routes.js';
import {rand} from './rand.js';

export const TASTE_KEY='life-taste-v1';
const ERAS=COHORT_YEARS.filter(y=>y<2026);
const SEXES=['female','male'];

export function readTaste(storage){
 try{
  const raw=JSON.parse(storage?.getItem(TASTE_KEY));
  if(!raw||typeof raw!=='object')return {weights:{risk:0,craft:0,power:0,heart:0,wander:0},seeds:[],routes:[],eras:[],lives:0};
  const w=raw.weights??{};
  return {
   weights:{
    risk:Number(w.risk)||0,
    craft:Number(w.craft)||0,
    power:Number(w.power)||0,
    heart:Number(w.heart)||0,
    wander:Number(w.wander)||0
   },
   seeds:Array.isArray(raw.seeds)?raw.seeds.filter(Number.isInteger).slice(-200):[],
   routes:Array.isArray(raw.routes)?raw.routes.filter(x=>typeof x==='string'):[],
   eras:Array.isArray(raw.eras)?raw.eras.filter(Number.isInteger):[],
   lives:Number.isInteger(raw.lives)?raw.lives:0
  };
 }catch{return {weights:{risk:0,craft:0,power:0,heart:0,wander:0},seeds:[],routes:[],eras:[],lives:0};}
}

export function recordTaste(storage,state){
 const cur=readTaste(storage);
 if(!state)return cur;
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
 const next={weights:w,seeds,routes,eras,lives:cur.lives+1};
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

// Deterministic 100-player table: slot 1..100 maps to a unique (era, class, region, sex, seed)
// so 100 players each get a genuinely different starting life and can swap slot numbers (#1..#100).
export function playerSlotBirth(slot){
 const n=Math.max(1,Math.min(100,Math.floor(Number(slot)||1)))-1;
 const birthYear=ERAS[n%ERAS.length];
 const cls=CLASS_KEYS[(Math.floor(n/ERAS.length)+n)%CLASS_KEYS.length];
 const regions=CLASS_REGIONS[cls]??['bangkok'];
 const region=regions[(n*3+Math.floor(n/5))%regions.length];
 const sex=SEXES[n%2];
 const seed=100003+n*7919+birthYear*17;
 const life=configureLife(newLife(seed),{birthYear,class:cls,region,sex});
 return validate(life)?{...life,playerSlot:n+1}:configureLife(newLife(seed+1),{birthYear,class:cls,sex});
}

// Adaptive next birth: avoids already-played seeds, eras, and routes while leaning toward
// classes/eras that open callings matching the player's learned taste.
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
 const unseenEras=ERAS.filter(y=>!taste.eras.includes(y));
 const poolEras=unseenEras.length?unseenEras:ERAS;
 const birthYear=poolEras[(taste.lives*3)%poolEras.length];
 const cls=preferredClasses[taste.lives%preferredClasses.length];
 const regions=CLASS_REGIONS[cls]??['bangkok'];
 const region=regions[(taste.lives*5)%regions.length];
 for(let i=0;i<60;i++){
  const seed=200009+(taste.lives*9973)+(i*7919);
  if(taste.seeds.includes(seed))continue;
  const life=configureLife(newLife(seed),{birthYear,class:cls,region,sex:SEXES[(taste.lives+i)%2]});
  const r=routeOf(life);
  if(r&&taste.routes.includes(r)&&i<40)continue;
  if(validate(life))return {...life,novelty:true};
 }
 return fallbackDraw();
}
