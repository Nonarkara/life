import {FOCUSES} from './motivations.js';
// Authored observational proxy, not Ikigai-9 or a psychological measurement.
export const PURPOSE_VERSION='chapter-follow-through-1';
const opportunities={
 connection:{ids:['friend','love','commitment','friend_care','child_school','friend_late','parenthood'],choices:['join','together','date','marry','visit','call','materials','walk','meet','letter','raise']},
 contribution:{ids:['flood_help','friend_care','mentor','child_school'],choices:['help','visit','call','teach','materials','walk']},
 recognition:{ids:['project_return','mentor'],choices:['show','teach']}
};
export function purposeRecord(state,row){
 const focus=row?.profile?.focus;
 if(row?.from===undefined||!Object.hasOwn(FOCUSES,focus)||state.story?.pending?.age===row.age)return null;
 const moments=(state.story?.seen??[]).filter(e=>e.age>row.from&&e.age<=row.age);
 const base={from:row.from,to:row.age,focus};
 if(opportunities[focus]){
  const rule=opportunities[focus],eligible=moments.filter(e=>rule.ids.includes(e.id));
  if(!eligible.length)return null;
  return {...base,met:eligible.some(e=>rule.choices.includes(e.choice)),reason:'A relevant choice was resolved.',records:eligible.map(e=>({age:e.age,id:e.id,choice:e.choice}))};
 }
 if(focus==='growth'){
  const axes={sport:['physique'],art:['craft'],security:['iq','drive'],connection:['eq'],balance:['physique','iq','eq','craft']}[row.profile.aim]??['iq','craft'];
  const practice=axes.reduce((n,key)=>n+row.effort[key]+(row.financeSkills?.[key]??0)+(row.storySkills?.[key]??0),0)+(axes.includes('iq')?(row.pathwayLearning??0):0);
  return {...base,met:practice>0,reason:practice>0?'Learning practice was recorded.':'No learning practice was recorded.',records:[{age:row.age,practice,axes}]};
 }
 if(focus==='variety'){
  const previous=state.history.filter(r=>r.age<=row.from).at(-1)?.pathway;
  const projects=moments.filter(e=>e.id==='project');
  if(!previous&&!projects.length)return null;
  const changed=!!(previous&&row.pathway&&previous!==row.pathway)||projects.some(e=>e.choice==='start');
  return {...base,met:changed,reason:changed?'A new route or project was recorded.':'No new route or project was recorded.',records:[{age:row.age,pathway:row.pathway,previous},...projects]};
 }
 const receipt=state.finance?.receipts.find(r=>r.kind==='period'&&r.age===row.age);
 if(!receipt||receipt.saved===undefined||receipt.income-receipt.essential<=0)return null;
 const previous=state.history.filter(r=>r.age<=row.from).at(-1)?.finance;
 const repaid=previous&&row.finance?Math.max(0,previous.debt-row.finance.debt):0,met=receipt.saved>0||repaid>0;
 return {...base,met,reason:met?'A reserve contribution or debt repayment was recorded.':'No reserve contribution or debt repayment was recorded.',records:[{age:row.age,saved:receipt.saved,repaid}]};
}
export function purpose(state){
 const records=state.history.map(row=>purposeRecord(state,row)).filter(Boolean),met=records.filter(r=>r.met).length;
 return {version:PURPOSE_VERSION,met,eligible:records.length,index:records.length?Math.round(100*met/records.length):null,records};
}
