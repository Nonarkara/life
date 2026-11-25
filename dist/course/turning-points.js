import {encodeBirth} from './birthcode.js';

// A small, device-only shelf of pre-answer snapshots independent of the active life.
const KEY='life-turning-points-v1';
const LIMIT=18;
const recovery=scene=>typeof scene==='string'&&scene.startsWith('resume-');
const reviewPoint=entry=>['featured-school','featured-school-replay'].includes(entry.scene);

export function readTurningPoints(storage){
 try{
  const entries=JSON.parse(storage?.getItem(KEY));
  return Array.isArray(entries)?entries.filter(e=>typeof e?.id==='string'&&typeof e.title==='string'&&
    typeof e.answer==='string'&&(e.state?.stage==='review'||recovery(e.scene))&&Number.isInteger(e.state?.age)&&
    typeof e.state.birth?.place==='string'&&Array.isArray(e.met)).slice(0,LIMIT):[];
 }catch{return [];}
}

export function keepTurningPoint(storage,state,{scene,title,answer,met}){
 if(!storage||!state||state.stage!=='review'&&!recovery(scene)||!scene||!title||!answer)return null;
 // Keep the first fork in this scene for a birth. Replaying it must not replace the original answer.
 const code=encodeBirth(state)??state.seed.toString(36);
 const legacy=[state.seed.toString(36),state.age,scene].join('.');
 const id=[code,state.age,scene].join('.');
 const earlier=readTurningPoints(storage);
 const existing=earlier.find(e=>e.id===id||e.id===legacy&&encodeBirth(e.state)===encodeBirth(state));
 if(existing)return existing.id;
 const entry={id,scene,title,answer,met:[...met],state:{...state,
  previous:scene==='featured-school-replay'||recovery(scene)?state.previous??null:null}};
 let sameBirth=0;
 const retained=earlier.filter(point=>reviewPoint(point)||(encodeBirth(point.state)??point.state.seed.toString(36))!==code||++sameBirth<5);
 const candidates=[entry,...retained];
 const entries=[...candidates.filter(reviewPoint),...candidates.filter(point=>!reviewPoint(point))].slice(0,LIMIT);
 while(entries.some(point=>point.id===id)){
  try{storage.setItem(KEY,JSON.stringify(entries));return id;}
  catch{entries.pop();}
 }
 return null;
}

export function keepDisplacedLife(storage,state,met=[]){
 // Name this snapshot by its contents so another save at the same age can coexist.
 const raw=JSON.stringify(state);
 let hash=2166136261;
 for(let i=0;i<raw.length;i++)hash=Math.imul(hash^raw.charCodeAt(i),16777619);
 return keepTurningPoint(storage,state,{scene:'resume-'+(hash>>>0).toString(36),
  title:'Continue your last life →',answer:'Age '+state.age,met});
}

export function loadTurningPoint(storage,id,valid){
 const entry=readTurningPoints(storage).find(e=>e.id===id);
 return entry&&valid(entry.state)?entry:null;
}

export function turningPointURL(id){
 return '/course/?turning='+encodeURIComponent(id);
}

export function turningPointScene(entry){
 if(typeof entry?.scene==='string')return entry.scene;
 const state=entry?.state;if(!Number.isInteger(state?.seed)||!Number.isInteger(state?.age))return null;
 const prefix=[encodeBirth(state),state.seed.toString(36)].filter(Boolean)
  .map(code=>code+'.'+state.age+'.').find(part=>entry.id?.startsWith(part));
 return prefix?entry.id.slice(prefix.length):null;
}
