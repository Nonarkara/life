// This life beside the one before it, from the saved records only. It says where the two
// lives first parted and how they ended; it never claims that one choice caused the gap.
import {encounterById} from './encounters.js';
import {pivotById} from './pivots.js';
import {netWorth} from './finance.js';

const worth=(f,fallback)=>f?netWorth(f):fallback;
// Every recorded decision as {age, key, label}: encounter choices and station questions.
function decisions(life){
 const out=new Map();
 for(const e of life.story?.seen??[]){const o=encounterById(e.id)?.options.find(o=>o.id===e.choice);if(o)out.set(e.id,{age:e.age,label:o.label});}
 for(const r of life.history??[])for(const p of r.pivots??[]){const o=pivotById(p.pivot)?.options.find(o=>o.id===p.choice);if(o)out.set(p.pivot,{age:p.station,label:o.label});}
 return out;
}
export function replayComparison(state){
 const prev=state.previous;if(!prev||!prev.history)return null;
 const a=decisions(prev),b=decisions(state);
 let split=null;
 for(const [key,x] of a){const y=b.get(key);if(y&&y.label!==x.label&&(!split||x.age<split.age))split={age:x.age,before:x.label,now:y.label};}
 const at=(life,age)=>life.history.find(r=>r.age===age);
 const p50=at(prev,50),n50=at(state,50);
 return {
  split,
  rows:[
   ['Years lived',prev.age,state.age,'n'],
   ['Net worth',worth(prev.finance,prev.cash),worth(state.finance,state.cash),'baht'],
   ['Health',Math.round(prev.health),Math.round(state.health),'n'],
   ['Mood',Math.round(prev.wellbeing),Math.round(state.wellbeing),'n'],
   ...(p50&&n50?[['Net worth at 50',worth(p50.finance,p50.cash),worth(n50.finance,n50.cash),'baht']]:[])
  ]
 };
}
