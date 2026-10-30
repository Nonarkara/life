// The lives a player has lived, kept in this browser: the reason to come back is the next
// one. Each entry holds the birth code, so any past life can be lived again with different
// choices. Nothing here leaves the device.
import {encodeBirth} from './birthcode.js';
export const LIVES_KEY='life-lives-v1',LIVES_MAX=40;
const valid=e=>!!e&&typeof e.id==='string'&&typeof e.code==='string'&&typeof e.place==='string'&&Number.isInteger(e.age)&&Number.isFinite(e.at)&&(e.ikigai===null||Number.isFinite(e.ikigai))&&typeof e.words==='string';
export function readLives(storage){
 try{const list=JSON.parse(storage?.getItem(LIVES_KEY));return Array.isArray(list)?list.filter(valid).slice(0,LIVES_MAX):[];}catch{return [];}
}
// The same birth lived with different choices is a different life; the same ending shown twice is not.
export function lifeId(state){
 let h=2166136261;const trail=(state.story?.seen??[]).map(e=>e.id+':'+e.choice).join(',')+'|'+state.age+'|'+Math.round(state.health)+'|'+Math.round(state.wellbeing);
 for(const c of trail){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}
 return state.seed.toString(36)+'.'+h.toString(36);
}
export function recordLife(storage,state,{ikigai=null,now=Date.now()}={}){
 const code=state?.stage==='recap'?encodeBirth(state):null,lives=readLives(storage);
 if(!code)return lives;
 const id=lifeId(state);if(lives.some(e=>e.id===id))return lives;
 const next=[{id,seed:state.seed,code,place:state.birth?.place??'',age:state.age,ended:!!state.death,ikigai:Number.isFinite(ikigai)?ikigai:null,at:now,words:''},...lives].slice(0,LIVES_MAX);
 try{storage.setItem(LIVES_KEY,JSON.stringify(next));}catch{}
 return next;
}
export function rememberWords(storage,state,words){
 const id=lifeId(state),lives=readLives(storage),entry=lives.find(e=>e.id===id);
 if(!entry||typeof words!=='string')return lives;
 entry.words=words.slice(0,90);
 try{storage.setItem(LIVES_KEY,JSON.stringify(lives));}catch{}
 return lives;
}
