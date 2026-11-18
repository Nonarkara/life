// The lives a player has lived, kept in this browser: the reason to come back is the next
// one. Each entry holds the birth code, so any past life can be lived again with different
// choices. Nothing here leaves the device.
import {encodeBirth,dailyDateFor} from './birthcode.js';
import {buildCV} from './cv.js';
import {STOPS} from './journey-stops.js';
export const LIVES_KEY='life-lives-v1',LIVES_MAX=40;
const valid=e=>!!e&&typeof e.id==='string'&&typeof e.code==='string'&&typeof e.place==='string'&&Number.isInteger(e.age)&&Number.isFinite(e.at)&&(e.ikigai===null||Number.isFinite(e.ikigai))&&typeof e.words==='string';
const age=n=>Number.isInteger(n)&&n>=0&&n<=80;
const text=(s,max)=>typeof s==='string'&&s.length<=max;
const validAlbum=a=>a?.version===1&&Array.isArray(a.entries)&&a.entries.length<=400&&a.entries.every(e=>e&&text(e.label,200)&&age(e.from)&&age(e.to)&&e.to>=e.from&&(e.days===undefined||Number.isInteger(e.days)&&e.days>=0&&e.days<=30)&&(e.cost===undefined||Number.isFinite(e.cost)&&e.cost>=0)&&(e.days===undefined)===(e.cost===undefined))&&Array.isArray(a.notes)&&a.notes.length<=50&&a.notes.every(n=>n&&age(n.age)&&text(n.title,300)&&text(n.text,4000));
export function readLives(storage){
 try{const list=JSON.parse(storage?.getItem(LIVES_KEY));return Array.isArray(list)?list.filter(valid).slice(0,LIVES_MAX).map(e=>{if(e.album===undefined||validAlbum(e.album))return e;const {album,...summary}=e;return summary;}):[];}catch{return [];}
}
// The same birth lived with different choices is a different life; the same ending shown twice is not.
export function legacyLifeId(state){
 let h=2166136261;const trail=(state.story?.seen??[]).map(e=>e.id+':'+e.choice).join(',')+'|'+state.age+'|'+Math.round(state.health)+'|'+Math.round(state.wellbeing);
 for(const c of trail){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}
 return state.seed.toString(36)+'.'+h.toString(36);
}
// Object-key order and volatile UI/storage fields must not change an ending's identity.
const stable=v=>JSON.stringify(v,(_,value)=>value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(k=>[k,value[k]])):value);
export function lifeId(state){
 const trail=stable({birth:encodeBirth(state),seed:state.seed,age:state.age,health:state.health,wellbeing:state.wellbeing,cash:state.cash,skills:state.skills,seen:state.story?.seen??[],pivots:state.pivots??[],history:state.history??[],profiles:state.profiles??[],stops:state.stops??[],activities:state.bucket?.done??[],goals:state.lifeGoals??[],finance:state.finance});
 let h=2166136261,k=5381;for(let i=0;i<trail.length;i++){const code=trail.charCodeAt(i);h=Math.imul(h^code,16777619)>>>0;k=(Math.imul(k,33)^code)>>>0;}
 return state.seed.toString(36)+'.v2.'+h.toString(36)+'.'+k.toString(36);
}
// Upgrade the one old summary whose source life is still available, without counting it twice.
export function reconcileEndingIds(ids,state){
 const old=legacyLifeId(state),id=lifeId(state);
 return ids.includes(old)?[...new Set(ids.map(key=>key===old?id:key))]:ids;
}
function completedAlbum(state,notes=[]){
 const entries=buildCV({...state,history:state.history??[]}).map(({label,from,to,days,cost})=>({label,from,to,...(days!==undefined?{days,cost}:{})}));
 for(const stop of state.stops??[])if(STOPS[stop.id])entries.push({label:STOPS[stop.id].label,from:stop.age,to:stop.age});
 return {version:1,entries:entries.sort((a,b)=>a.from-b.from||a.to-b.to).slice(0,400),notes:notes.map(({age,title,text})=>({age,title,text})).slice(0,50)};
}
export function recordLife(storage,state,{ikigai=null,now=Date.now(),notes=[]}={}){
 const code=state?.stage==='recap'?encodeBirth(state):null,lives=readLives(storage);
 if(!code)return lives;
 const id=lifeId(state),existing=lives.find(e=>e.id===id||e.id===legacyLifeId(state)&&e.code===code),day=dailyDateFor(state),album=completedAlbum(state,notes);
 if(!validAlbum(album))return lives;
 if(existing){
  const updated={...existing,id,...(day?{dailyDay:day}:{}),...(!existing.album?{album}:{})};
  if(stable(updated)===stable(existing))return lives;
  const next=lives.map(e=>e===existing?updated:e);
  try{storage.setItem(LIVES_KEY,JSON.stringify(next));return next;}catch{return lives;}
 }
 const next=[{id,seed:state.seed,code,...(day?{dailyDay:day}:{}),place:state.birth?.place??'',age:state.age,ended:!!state.death,ikigai:Number.isFinite(ikigai)?ikigai:null,at:now,words:'',album},...lives].slice(0,LIVES_MAX);
 try{storage.setItem(LIVES_KEY,JSON.stringify(next));}catch{return lives;}
 return next;
}
export function rememberWords(storage,state,words){
 const id=lifeId(state),lives=readLives(storage),entry=lives.find(e=>e.id===id);
 if(!entry||typeof words!=='string')return lives;
 entry.words=words.slice(0,90);
 try{storage.setItem(LIVES_KEY,JSON.stringify(lives));}catch{}
 return lives;
}
