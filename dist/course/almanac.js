// Cross-life discovery journal stored locally in the browser: tracks which
// callings, Tokaido road stops, and real-world field notes a player has unlocked.
import {lifeId,readLives} from './lives.js';
import {ROUTE_DATA} from './route-data.js';

export const ALMANAC_KEY='life-almanac-v1',TOTAL_STOPS=18;

export function readAlmanac(storage){
 try{
  const raw=JSON.parse(storage?.getItem(ALMANAC_KEY));
  if(!raw||typeof raw!=='object')return {routes:[],stops:[],notes:[],endings:[],bestScore:0,lives:0};
  const routes=Array.isArray(raw.routes)?raw.routes.filter(x=>typeof x==='string'):[];
  const stops=Array.isArray(raw.stops)?raw.stops.filter(x=>typeof x==='string'):[];
  const notes=Array.isArray(raw.notes)?raw.notes.filter(x=>typeof x==='string'):[];
  let endings=Array.isArray(raw.endings)?raw.endings.filter(x=>typeof x==='string').slice(-1000):[];
  const bestScore=Number.isFinite(raw.bestScore)?raw.bestScore:0;
  let lives=Number.isInteger(raw.lives)&&raw.lives>=0?raw.lives:0;
  if(!Array.isArray(raw.endings)&&lives>0){
   const recorded=readLives(storage);
   if(recorded.length>0){
    endings=[...new Set(recorded.map(e=>e.id))].slice(-1000);
    lives=Math.min(lives,endings.length);
   }else if(routes.length>0){
    lives=Math.min(lives,Math.max(1,routes.length));
   }
   try{storage?.setItem(ALMANAC_KEY,JSON.stringify({routes,stops,notes,endings,bestScore,lives}));}catch{}
  }
  return {routes,stops,notes,endings,bestScore,lives};
 }catch{return {routes:[],stops:[],notes:[],endings:[],bestScore:0,lives:0};}
}

export function recordAlmanac(storage,state,{routeId=null,score=0,noteIds=[]}={}){
 const cur=readAlmanac(storage);
 const id=state?.stage==='recap'?lifeId(state):null;
 const counted=id&&!cur.endings.includes(id);
 const routes=new Set(cur.routes);
 if(routeId)routes.add(routeId);
 // Also record any route whose scenes were played in this life.
 const seenIds=new Set((state?.story?.seen??[]).map(e=>e.id));
 for(const r of ROUTE_DATA){
  if(r.scenes.some(sc=>seenIds.has(sc.id)))routes.add(r.route);
 }
 const stops=new Set(cur.stops);
 for(const st of (state?.stops??[]))if(st?.id)stops.add(st.id);
 const notes=new Set(cur.notes);
 for(const id of noteIds)if(typeof id==='string')notes.add(id);
 const next={
  routes:[...routes],
  stops:[...stops],
  notes:[...notes],
  bestScore:Math.max(cur.bestScore,Number.isFinite(score)?score:0),
  endings:counted?[...cur.endings,id].slice(-1000):cur.endings,
  lives:cur.lives+(counted?1:0)
 };
 try{storage?.setItem(ALMANAC_KEY,JSON.stringify(next));}catch{}
 return {...next,totalRoutes:ROUTE_DATA.length,totalStops:TOTAL_STOPS};
}

export function almanacSummary(storage){
 const cur=readAlmanac(storage);
 return {...cur,totalRoutes:ROUTE_DATA.length,totalStops:TOTAL_STOPS};
}
