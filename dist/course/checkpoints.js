import {encodeBirth} from './birthcode.js';

// Going back. At every five-year review the whole life is kept as it stood on arrival, before any
// answer, so a player can return to that exact moment (same birth, same luck, same money) and choose
// again. One life's reviews are kept at a time, on this device only. ponytail: whole states in
// localStorage, about 0.3 MB for a first life and up to about 1.6 MB for a replayed birth (each state
// then carries the previous life); move to IndexedDB if a life ever outgrows the quota.
const KEY='life-checkpoints-v1';
const empty=(seed,met=null)=>({seed,backs:0,met,points:{}});
export function readPoints(storage,seed){
 try{const p=JSON.parse(storage.getItem(KEY));return p&&p.seed===seed&&p.points&&typeof p.points==='object'&&Number.isInteger(p.backs)?{...p,met:Array.isArray(p.met)?p.met:null}:empty(seed);}catch{return empty(seed);}
}
function pointsFor(storage,state){
 const record=readPoints(storage,state.seed);
 const first=Object.values(record.points)[0];
 if(first&&encodeBirth(first)!==encodeBirth(state))return empty(state.seed);
 return record;
}
// Out of room: the earliest reviews go first. The latest is never given up: if it cannot be written
// even alone, nothing is written and the record stays as it was.
const write=(storage,p)=>{
 const latest=Math.max(...Object.keys(p.points).map(Number));
 for(let tries=0;tries<20;tries++){try{storage.setItem(KEY,JSON.stringify(p));return true;}catch{const first=Object.keys(p.points).map(Number).filter(a=>a!==latest).sort((a,b)=>a-b)[0];if(first===undefined)return false;delete p.points[first];}}
 return false;
};
// A new life (`fresh`, the first review at ten) starts a new record and notes which scenes this device
// had already met, because that memory decides which ordinary scene is offered. Arriving at a review
// forgets any later ones: after going back, the years ahead have not happened yet.
export function keepPoint(storage,state,fresh=false,met=null){
 if(!storage||state?.stage!=='review'||!Number.isInteger(state.age))return false;
 const was=fresh?empty(state.seed,met?[...met]:null):pointsFor(storage,state);
 const points=Object.fromEntries(Object.entries(was.points).filter(([age])=>Number(age)<state.age));points[state.age]=state;
 return write(storage,{seed:state.seed,backs:was.backs,met:was.met,points});
}
// A what-if that resumes at a review already answered keeps that review's arrival as it was, and only
// forgets what came after.
export function forgetAfter(storage,state){
 if(!storage||!state)return false;const p=pointsFor(storage,state),ages=Object.keys(p.points).map(Number);
 if(!ages.some(a=>a>state.age))return true;if(!ages.some(a=>a<=state.age)){try{storage.removeItem?.(KEY);}catch{}return true;}
 return write(storage,{...p,points:Object.fromEntries(Object.entries(p.points).filter(([a])=>Number(a)<=state.age))});
}
// The scenes this device had met when this life began, or null if that was not recorded.
export const metFor=(storage,seed,state)=>storage?(state?pointsFor(storage,state):readPoints(storage,seed)).met:null;
// The reviews this life can go back to: earlier than now, newest first.
export function pointAges(storage,state){
 if(!storage||!state)return [];
 return Object.keys(pointsFor(storage,state).points).map(Number).filter(age=>age<state.age||state.stage==='recap'&&age<=state.age).sort((a,b)=>b-a);
}
// The kept life at that review, or null: not held, not this birth, refused by `valid`, or the record
// could not be updated (then the abandoned years would still be listed, so the move is refused).
export function goBack(storage,state,age,valid=()=>true){
 if(!storage||!state)return null;
 const p=pointsFor(storage,state),point=p.points[age];if(!point||point.seed!==state.seed||point.age!==age||point.stage!=='review'||!valid(point))return null;
 const points=Object.fromEntries(Object.entries(p.points).filter(([a])=>Number(a)<=age));
 return write(storage,{...p,backs:p.backs+1,points})?point:null;
}
export const timesBack=(storage,state)=>storage&&state?pointsFor(storage,state).backs:0;
