// Versioned authored life events; probabilities are game tuning, not population estimates.
const event=(type,title,text,health,wellbeing,cash,min,eligible=()=>true,extra={})=>({type,title,text,health,wellbeing,cash,min,eligible,...extra});
export const LIFE_EVENTS={
 accident:event('accident','A physical accident','A fall interrupts your plans. Recovery takes time and some money.',-8,-3,-1500,10),
 fever:event('illness','An unexpected illness','A fever keeps you in bed for several days. Other plans have to wait.',-5,-2,-600,6),
 fallout:event('friendship','A friendship breaks down','An argument with {friend} turns into distance. A familiar part of the week is gone.',0,-6,0,12,f=>f.friend!==undefined&&f.friendDied===undefined&&(f.friendLost===undefined||(f.friendRepaired??-1)>f.friendLost),{flag:'friendLost'}),
 reconcile:event('friendship','A friend reaches out','{friend} reaches out after a long silence. The conversation opens a way back.',0,4,0,15,f=>f.friendLost!==undefined&&f.friendDied===undefined&&(f.friendRepaired??-1)<f.friendLost,{flag:'friendRepaired'}),
 heartbreak:event('heartbreak','A relationship ends','You and {partner} separate. Familiar routines now have an empty place in them.',-1,-10,0,18,f=>f.dating!==undefined&&f.married===undefined&&f.committed===undefined&&(f.separated===undefined||f.separated<f.dating),{flag:'separated'}),
 layoff:event('fired','Your position is eliminated','The job ends. Two months pass without work income while you look for another opening.',0,-7,0,20,(f,s)=>s.age<60&&['work','vocational','independent'].includes(s.pathway??'work'),{incomeMonths:2,flag:'laidOff'}),
 friendloss:event('loss','Someone will be missed','News comes that {friend} has died. You find yourself remembering ordinary afternoons together.',0,-8,0,30,f=>f.friend!==undefined&&f.friendDied===undefined,{flag:'friendDied'}),
 connection:event('connection','An unexpected connection','You meet someone you want to know better. There are possibilities, but no promises yet.',0,2,0,18,f=>f.dating===undefined&&f.married===undefined&&f.committed===undefined),
 kindness:event('connection','Someone makes room for you','A person notices that you are struggling and makes time to help.',0,2,0,6),
 setback:event('project','A plan falls through','A project you counted on does not happen. You keep what you learned, but lose time and money.',0,-3,-900,18,(f,s)=>['work','independent','vocational'].includes(s.pathway??'work')),
 opportunity:event('commission','A small opening','Someone recommends your work. A short paid task brings some breathing room.',0,2,1500,18,(f,s)=>['work','independent','vocational'].includes(s.pathway??'work')),
 exhaustion:event('illness','You need a slower week','A relentless stretch leaves you exhausted. Rest takes the place of other plans.',-3,-5,0,20,(f,s)=>(s.effort?.drive??0)>=4&&s.age<60),
 asthma:event('illness','An asthma emergency','Breathing becomes frighteningly difficult. Your family gets you to hospital. The emergency passes, but recovery changes the week.',-12,-7,-1800,10,(f,s)=>s.seed%7===0,{flag:'asthmaEpisode'}),
 asthmaAgain:event('illness','It happens again','Another asthma attack interrupts an ordinary day. Knowing the condition did not make this your fault.',-10,-6,-1200,15,f=>f.asthmaEpisode!==undefined,{flag:'asthmaRecurrence'}),
 dengue:event('dengue','Dengue interrupts your life','A mosquito-borne infection sends you to hospital. Your plans stop while your family waits for news.',-12,-6,-1500,10,(f,s)=>!s.intake?.country||['TH','SG'].includes(s.intake.country),{flag:'dengueEpisode'}),
 dengueAgain:event('dengue','Dengue, a second time','You become ill with dengue again. The earlier illness did not guarantee protection from another infection.',-12,-7,-1800,15,f=>f.dengueEpisode!==undefined,{flag:'dengueRecurrence'}),
 river:event('accident','Pulled from the water','A fall into the river becomes an emergency. Someone reaches you in time. Afterwards, familiar water feels different.',-10,-7,-900,10,(f,s)=>!s.intake?.country||s.intake.country==='TH'),
 familyTB:event('illness','Illness reaches the household','Your father needs treatment for tuberculosis. Care, travel and missed work now belong to the family budget.',0,-6,-2200,10,(f,s)=>s.age<=30,{flag:'familyTreatment'})
};
export function enableLifeEvents(s){return s.lifeEventPolicy?s:{...s,lifeEventPolicy:{version:1,startAge:s.age}};}
export function lifeEventFlags(state){const flags={};for(const row of state?.history??[])for(const r of row.events??[]){const e=r.origin==='life'&&Object.hasOwn(LIFE_EVENTS,r.id)?LIFE_EVENTS[r.id]:null;if(e?.flag===r.flag&&e?.flag&&Number.isInteger(r.age))flags[e.flag]=r.age;}return flags;}
export function periodLifeEvents(state,from,to,flags,random){
 const result={records:[],health:0,wellbeing:0,cash:0,incomeMonths:0};if(!state.lifeEventPolicy)return result;
 const known={...flags};
 for(let age=from+1;age<=to;age++){
  if(age<=state.lifeEventPolicy.startAge||random(age,'life-arrival')>=.28)continue;
  // Draw before eligibility: a different relationship does not replace an external shock.
  const options=Object.entries(LIFE_EVENTS),[id,e]=options[Math.min(options.length-1,Math.floor(random(age,'life-kind')*options.length))];
  if(age<e.min||!e.eligible(known,state)||result.records.some(r=>r.id===id))continue;
  const text=e.text.replaceAll('{friend}',state.story?.people.friend??'your friend').replaceAll('{partner}',state.story?.people.partner??'your partner');
  const wellbeing=e.wellbeing<0?Math.round(e.wellbeing*Math.max(.65,1-(state.effort?.eq??0)*.03)):e.wellbeing;
  const r={origin:'life',id,type:e.type,age,title:e.title,text,health:e.health,wellbeing,cash:e.cash,incomeMonths:e.incomeMonths??0,...(e.flag?{flag:e.flag}:{})};
  result.records.push(r);result.health+=r.health;result.wellbeing+=r.wellbeing;result.cash+=r.cash;result.incomeMonths+=r.incomeMonths;if(e.flag)known[e.flag]=age;
 }
 return result;
}
export function validLifeEvents(s){
 if(s.lifeEventPolicy!==undefined&&(!s.lifeEventPolicy||s.lifeEventPolicy.version!==1||!Number.isInteger(s.lifeEventPolicy.startAge)||s.lifeEventPolicy.startAge<0||s.lifeEventPolicy.startAge>80))return false;
 if(!Array.isArray(s.history))return false;
 return s.history.every(row=>row&&(!row.events||Array.isArray(row.events))&&(row.events??[]).every(r=>{if(!r||typeof r!=='object')return false;if(r.origin!=='life')return true;const e=Object.hasOwn(LIFE_EVENTS,r.id)?LIFE_EVENTS[r.id]:null;return e&&r.type===e.type&&r.title===e.title&&r.flag===e.flag&&Number.isInteger(r.age)&&r.age>=e.min&&r.age>(row.from??0)&&r.age<=row.age&&typeof r.text==='string'&&r.health===e.health&&r.cash===e.cash&&r.wellbeing===(e.wellbeing<0?Math.round(e.wellbeing*Math.max(.65,1-(row.effort?.eq??0)*.03)):e.wellbeing)&&r.incomeMonths===(e.incomeMonths??0);}));
}
