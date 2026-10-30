import {GDP_OBSERVATIONS} from './economy-data.js';
const paths=new Map();
const random=(seed,n,key)=>{let h=2166136261;for(const c of `${seed}/${n}/${key}`){h=Math.imul(h^c.charCodeAt(0),16777619);}return(h>>>0)/4294967296;};
export const createEconomy=(seed,activeFrom=0)=>Object.freeze({version:2,seed,startYear:2030,activeFrom});
export const validEconomy=(w,age=80)=>w===undefined||!!w&&Object.keys(w).length===4&&(w.version===1||w.version===2)&&Number.isSafeInteger(w.seed)&&w.startYear===2030&&Number.isInteger(w.activeFrom)&&w.activeFrom>=0&&w.activeFrom<=age;
export const economyFor=state=>state.economy??createEconomy(state.seed,state.age);
function scenario(w){
 const key=w.seed+':'+w.version;if(paths.has(key))return paths.get(key);
 const rows=[];let block=0,drag=0;
 while(rows.length<=80){
  let start=Math.floor(random(w.seed,block,'gdp-block-start')*GDP_OBSERVATIONS.length);
  while(start>0&&GDP_OBSERVATIONS[start].growth<0&&GDP_OBSERVATIONS[start-1].growth<0)start--;
  let end=Math.min(GDP_OBSERVATIONS.length,start+8+Math.floor(random(w.seed,block,'gdp-block-length')*8));
  while(end<GDP_OBSERVATIONS.length&&GDP_OBSERVATIONS[end-1].growth<0&&GDP_OBSERVATIONS[end].growth<0)end++;
  for(let i=start;i<end&&rows.length<=80;i++){
   const age=rows.length,{year:sourceYear,growth}=GDP_OBSERVATIONS[i],down=growth<0;
   // These response functions are authored game tuning, never historical returns.
   let equity=down?-.12-random(w.seed,age,'equity')*.23:-.08+random(w.seed,age,'equity')*.28;
   // Version 2 worlds: some crashes are followed by a lost decade, five years of flat-to-falling markets, so holding is a bet and not a quiz.
   if(w.version===2){if(down&&random(w.seed,age,'lost')<.35)drag=5;else if(!down&&drag>0){equity=-.07+random(w.seed,age,'equity')*.12;drag--;}}
   const bond=-.035+random(w.seed,age,'bond')*.10;
   const wageFactor=down?Math.max(.75,1+growth/35):1+Math.min(growth,10)/200;
   rows.push(Object.freeze({age,year:2030+age,sourceYear,growth,equity,bond,wageFactor}));
  }block++;
 }
 if(paths.size>64)paths.clear();paths.set(key,Object.freeze(rows));return paths.get(key);
}
export function economyYears(world,toAge){if(!validEconomy(world)||!world||!Number.isFinite(toAge))return [];return scenario(world).filter(r=>r.age>=world.activeFrom&&r.age<=Math.min(80,toAge));}
export function periodEconomy(world,from,to){const rows=economyYears(world,to).filter(r=>r.age>from);return {rows,meanWageFactor:rows.length?rows.reduce((s,r)=>s+r.wageFactor,0)/rows.length:1,contractions:rows.filter(r=>r.growth<0)};}
