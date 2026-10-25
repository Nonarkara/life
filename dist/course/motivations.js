import {netWorth} from './finance.js';
// A player-chosen coaching lens, not a personality test or a hidden stat.
export const FOCUSES={
 security:'Security and stability',variety:'Variety and discovery',recognition:'Recognition',
 connection:'Love and connection',growth:'Learning and growth',contribution:'Contribution'
};
export const FOCUS_HINTS={
 security:'Build room for setbacks; watch your cash and obligations.',
 variety:'Try a different route or begin something unfamiliar.',
 recognition:'Put work into the world; recognition is not guaranteed.',
 connection:'Make time for people and notice whether support is mutual.',
 growth:'Give learning and practice time as well as money.',
 contribution:'Make room to help or teach without promising a reward.'
};
export function focusEvidence(state,row=state.history.at(-1)){
 const focus=row?.profile?.focus;if(!Object.hasOwn(FOCUSES,focus)||row.from===undefined)return null;
 const moments=(state.story?.seen??[]).filter(e=>e.age>row.from&&e.age<=row.age);
 const count=(ids,choices)=>moments.filter(e=>ids.includes(e.id)&&choices.includes(e.choice)).length;
 let text,value;
 if(focus==='security'){
  const previous=state.history.filter(r=>r.age<=row.from).at(-1)?.finance;
  if(!previous||!row.finance)return {focus,from:row.from,to:row.age,text:'No comparable personal-money record for this period.'};
  value=netWorth(row.finance)-netWorth(previous);
  text='Personal net worth changed by {value}.';value='฿'+Math.round(value).toLocaleString('en');
 }else if(focus==='variety'){
  const previous=state.history.filter(r=>r.age<=row.from).at(-1)?.pathway;
  value=(previous&&row.pathway&&previous!==row.pathway?1:0)+count(['project'],['start']);text='New routes or projects recorded: {value}.';
 }else if(focus==='recognition'){
  value=count(['project_return','mentor'],['show','teach']);text='Public work or mentoring moments: {value}.';
 }else if(focus==='connection'){
  value=count(['friend','love','commitment','friend_care','child_school','friend_late','parenthood'],['join','together','date','marry','visit','call','materials','walk','meet','letter','raise']);text='Shared moments recorded: {value}.';
 }else if(focus==='growth'){
  value=row.effort.iq+(row.pathwayLearning??0)+(row.financeSkills?.iq??0)+(row.storySkills?.iq??0);text='Reasoning practice gained: {value} game points.';
 }else{
  value=count(['flood_help','friend_care','mentor','child_school'],['help','visit','call','teach','materials','walk']);text='Helping or teaching moments: {value}.';
 }
 return {focus,from:row.from,to:row.age,text:text.replace('{value}',value)};
}
