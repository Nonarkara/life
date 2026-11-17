import {GDP_OBSERVATIONS} from './economy-data.js';
import {worldAt} from './world-series.js';
const paths=new Map();
const random=(seed,n,key)=>{let h=2166136261;for(const c of `${seed}/${n}/${key}`){h=Math.imul(h^c.charCodeAt(0),16777619);}return(h>>>0)/4294967296;};
// Version 3 is the real record: a life with a calendar birth year lives through Thailand's own years, so
// someone who remembers 1997 can act on it. `startYear` is then the birth year. Versions 1 and 2 are the
// shuffled scenario and stay as they are for lives saved before this, and for lives with no calendar.
// `like` carries the kind of world across a replay or a comparison life: same record, another seed.
export const createEconomy=(seed,activeFrom=0,like)=>like?.version===3?realEconomy(seed,like.startYear,activeFrom):Object.freeze({version:2,seed,startYear:2030,activeFrom});
export const realEconomy=(seed,birthYear,activeFrom=0)=>Object.freeze({version:3,seed,startYear:birthYear,activeFrom});
export const SET_OPENED=1975;
// Where the latest lived year stands: 'real' (on record), 'after' (a real-record life past the last recorded year,
// now on the game's own sampled years) or 'scenario' (a shuffled-scenario life).
export const recordAt=(world,age)=>world?.version!==3?'scenario':economyYears(world,age).at(-1)?.real?'real':'after';
export const validEconomy=(w,age=80)=>w===undefined||!!w&&Object.keys(w).length===4&&(w.version===1||w.version===2?w.startYear===2030:w.version===3&&Number.isInteger(w.startYear)&&w.startYear>=1900&&w.startYear<=2100)&&Number.isSafeInteger(w.seed)&&Number.isInteger(w.activeFrom)&&w.activeFrom>=0&&w.activeFrom<=age;
export const economyFor=state=>state.economy??createEconomy(state.seed,state.age);
// The real record, year by year. Growth and the wage it moves are that year's World Bank figure. The equity
// fund is the SET index: the change between two December closes, after that year's price rise, because pay
// and prices in this game do not rise with the years. Before the exchange opened there is no market, so the
// fund earns nothing and cannot be bought. A year with no record (after 2025) falls back to the scenario
// row for that age and says so with real:false. The bond fund stays authored tuning in every version.
function record(w){
 const key=w.seed+':3:'+w.startYear;if(paths.has(key))return paths.get(key);
 const rows=scenario({...w,version:2,startYear:2030}).map(base=>{
  const year=w.startYear+base.age,now=worldAt(year),before=worldAt(year-1);
  if(now?.growth==null)return Object.freeze({...base,year,real:false});
  const growth=now.growth,down=growth<0,wageFactor=down?Math.max(.75,1+growth/35):1+Math.min(growth,10)/200;
  const priced=now.set!=null&&before?.set!=null&&now.inflation!=null,equity=priced?now.set/before.set/(1+now.inflation/100)-1:year<=SET_OPENED?0:base.equity;
  return Object.freeze({...base,year,sourceYear:year,growth,wageFactor,equity,real:true,...(year<SET_OPENED?{noMarket:true}:{})});
 });
 if(paths.size>64)paths.clear();paths.set(key,Object.freeze(rows));return paths.get(key);
}
function scenario(w){
 if(w.version===3)return record(w);
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
