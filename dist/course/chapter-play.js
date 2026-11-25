import {AXES} from './sim.js';
import {leftSchool,locksFor} from './pivots.js';
import {availablePathways} from './pathways.js';
import {encounterById} from './encounters.js';
import {PRIORITIES,prioritiesFor} from './priorities.js';

// Each decision spends the same ten points. A promise already made gets paid first.
export function effortFrom(main,second,locks={}){
 const e=Object.fromEntries(AXES.map(a=>[a.key,locks[a.key]??0]));let left=10-Object.values(e).reduce((n,v)=>n+v,0);
 const give=(k,n)=>{const g=Math.max(0,Math.min(left,n-(locks[k]??0)));e[k]+=g;left-=g;};
 if(main)give(main,5);if(second)give(second,3);
 const rest=AXES.map(a=>a.key).filter(k=>k!==main&&k!==second);for(let i=0;left>0;i=(i+1)%rest.length){e[rest[i]]+=1;left-=1;}
 return e;
}

const focuses={
 school:['iq','drive'], friends:['eq','craft'], play:['physique','eq'],
 exams:['iq','drive'], sport:['physique','drive'], band:['craft','eq'],
 career:['drive','iq'], love:['eq','physique'], adventure:['craft','physique'],
 family:['eq','drive'], balance:['physique','eq'],
 money:['drive','iq'], health:['physique','iq'], community:['eq','craft'],
 merit:['eq','physique'], legacy:['drive','craft']
};
const bands=[
 [15,['school','friends','play']],
 [20,['exams','sport','band']],
 [30,['career','love','adventure']],
 [45,['family','career','balance']],
 [60,['money','health','community']],
 [80,['health','merit','legacy']]
];

export function chapterPlans(state){
 const ids=bands.find(([until])=>state.age<until)?.[1]??[];
 const allowed=prioritiesFor(state.age);
 const locks=locksFor(state);
 return ids.filter(id=>allowed.includes(id)).map(id=>{
  const {label,aim,focus}=PRIORITIES[id];
  const effort=effortFrom(...focuses[id],locks);
  return {id,label,effort,profile:{...state.profile,priority:id,aim,focus}};
 });
}

// A story decision that committed these years to a path still owns that chapter.
export function chapterPathways(state){
 const routes=availablePathways(state.age,state);
 const pivot=state.pivots?.some(record=>record.station===state.age&&
  (record.pathway||record.pivot==='college-cost'));
 const encounter=state.story?.seen?.some(record=>record.age===state.age&&
  encounterById(record.id)?.options.some(option=>option.id===record.choice&&option.pathway));
 if(pivot||encounter){
  const current=routes.some(([id])=>id===state.pathway)?state.pathway:(state.age<20?'school':'work');
  return routes.filter(([id])=>id===current);
 }
 if(!leftSchool(state))return routes;
 return routes.filter(([id])=>id===state.pathway||!['school','college'].includes(id));
}

export function chapterReceipt(row){
 const result=row?.chapterResult;
 const keys=AXES.map(a=>a.key);
 return Number.isFinite(result?.health)&&Number.isFinite(result.wellbeing)&&
  (result.worth==null||Number.isFinite(result.worth))&&Array.isArray(result.gains)&&
  result.gains.every(pair=>Array.isArray(pair)&&keys.includes(pair[0])&&Number.isFinite(pair[1]))?result:null;
}
