// This life beside the one before it, from the saved records only. It says where the two
// lives first parted and how they ended; it never claims that one choice caused the gap.
import {encounterById} from './encounters.js';
import {pivotById} from './pivots.js';
import {CHILD_CHOICES} from './childhood-choices.js';
import {PATHWAYS} from './pathways.js';
import {PRIORITIES} from './priorities.js';
import {netWorth} from './finance.js';

const worth=(f,fallback)=>f?netWorth(f):fallback;
// Every recorded decision as {age, key, label}: encounter choices and station questions.
function decisions(life){
 const out=new Map();
 for(const c of life.childhood?.choices??[]){
  const option=CHILD_CHOICES.find(q=>q.age===c.age&&q.options.some(o=>o.id===c.choice))?.options.find(o=>o.id===c.choice);
  if(option)out.set('child:'+c.age,{age:c.age,label:option.label});
 }
 for(const e of life.story?.seen??[]){const o=encounterById(e.id)?.options.find(o=>o.id===e.choice);if(o)out.set(e.id,{age:e.age,label:o.label});}
 for(const r of life.history??[]){
  for(const p of r.pivots??[]){
   const option=pivotById(p.pivot)?.options.find(o=>o.id===p.choice);
   if(option)out.set(p.pivot,{age:p.station,label:option.label});
  }
  if(!Number.isInteger(r.from))continue;
  const path=PATHWAYS[r.pathway]?.label,priority=PRIORITIES[r.profile?.priority]?.label;
  if(path)out.set('path:'+r.from,{age:r.from,label:path});
  if(priority)out.set('priority:'+r.from,{age:r.from,label:priority});
 }
 return out;
}
export function replayComparison(state){
 const prev=state.previous;if(!prev||!prev.history)return null;
 const a=decisions(prev),b=decisions(state);
 let split=null;
 for(const [key,x] of a){const y=b.get(key);if(y&&y.label!==x.label&&(!split||x.age<split.age))split={age:x.age,before:x.label,now:y.label};}
 const at=(life,age)=>life.history.find(r=>r.age===age);
 const p50=at(prev,50),n50=at(state,50);
 const roads=[...a].flatMap(([key,entry])=>{
  const now=b.get(key);
  return key.startsWith('path:')&&entry.age<30&&now&&entry.label!==now.label
   ?[{age:entry.age,before:entry.label,now:now.label}]:[];
 });
 return {
  split,earlyRoad:roads[0]??null,restartedAt:prev.restartedAt,
  rows:[
   ['Years lived',prev.age,state.age,'n'],
   ['Net worth',worth(prev.finance,prev.cash),worth(state.finance,state.cash),'baht'],
   ['Health',Math.round(prev.health),Math.round(state.health),'n'],
   ['Mood',Math.round(prev.wellbeing),Math.round(state.wellbeing),'n'],
   ...(p50&&n50?[['Net worth at 50',worth(p50.finance,p50.cash),worth(n50.finance,n50.cash),'baht']]:[])
  ]
 };
}
