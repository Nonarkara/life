// A small, device-only shelf of pre-answer snapshots independent of the active life.
const KEY='life-turning-points-v1';
const LIMIT=18;
const reviewPoint=entry=>['featured-school','featured-school-replay'].includes(entry.scene);

export function readTurningPoints(storage){
 try{
  const entries=JSON.parse(storage?.getItem(KEY));
  return Array.isArray(entries)?entries.filter(e=>typeof e?.id==='string'&&typeof e.title==='string'&&
    typeof e.answer==='string'&&e.state?.stage==='review'&&Number.isInteger(e.state.age)&&
    typeof e.state.birth?.place==='string'&&Array.isArray(e.met)).slice(0,LIMIT):[];
 }catch{return [];}
}

export function keepTurningPoint(storage,state,{scene,title,answer,met}){
 if(!storage||state?.stage!=='review'||!scene||!title||!answer)return null;
 // Keep the first fork in this scene for a birth. Replaying it must not replace the original answer.
 const id=[state.seed.toString(36),state.age,scene].join('.');
 const earlier=readTurningPoints(storage);
 if(earlier.some(e=>e.id===id))return id;
 const entry={id,scene,title,answer,met:[...met],state:{...state,
  previous:scene==='featured-school-replay'?state.previous??null:null}};
 let sameBirth=0;
 const retained=earlier.filter(point=>reviewPoint(point)||point.state.seed!==state.seed||++sameBirth<5);
 const candidates=[entry,...retained];
 const entries=[...candidates.filter(reviewPoint),...candidates.filter(point=>!reviewPoint(point))].slice(0,LIMIT);
 while(entries.length){
  try{storage.setItem(KEY,JSON.stringify(entries));return id;}
  catch{entries.pop();}
 }
 return null;
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
 const prefix=state.seed.toString(36)+'.'+state.age+'.';
 return entry.id?.startsWith(prefix)?entry.id.slice(prefix.length):null;
}
