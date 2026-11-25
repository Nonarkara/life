import {CHILD_CHOICES} from './childhood-choices.js';
import {replayComparison} from './replay-compare.js';
import {configureLife,newLife} from './sim.js';

const START={class:'low_class',sex:'female',birthYear:1975};
const PATH_NAMES={school:'School education',college:'College studies',vocational:'Paid apprenticeship',
 independent:'Independent work',work:'Salaried work'};
const choices=CHILD_CHOICES.find(q=>q.age===9&&q.options.some(o=>o.id==='school_ask_teacher')).options;
export const schoolPreviewParam='featured=school';

export function isSchoolPreview(params){
 return params.get('featured')==='school';
}

export function schoolPreviewBirth(){
 return openAtNine(configureLife(newLife(5),START));
}

export function openAtNine(state){
 return {...state,progressAge:9,childhood:{
  origin:{cash:state.cash,health:state.health,wellbeing:state.wellbeing},
  startsAt:9,choices:[]
 }};
}

export function isSchoolPreviewLife(state){
 return state?.seed===5&&state.childhood?.startsAt===9&&
  Object.entries(START).every(([key,value])=>state.intake?.[key]===value);
}

export function schoolOutcomeRow(state){
 if(!isSchoolPreviewLife(state)||state.stage!=='review'||state.age!==25)return;
 return state.history.find(row=>row.from===20&&row.age===25);
}

export function schoolReview(state,t){
 const row=schoolOutcomeRow(state);
 const option=choices.find(o=>o.id===state.childhood?.choices.find(c=>c.age===9)?.choice);
 if(!option||!row)return null;
 const funding=row.pivots?.find(record=>record.pivot==='college-cost');
 const cash=funding?.effects?.cash;
 const path=PATH_NAMES[row.pathway];
 const previous=state.previous?.history.find(r=>r.from===20&&r.age===25);
 const before=PATH_NAMES[previous?.pathway];
 const split=replayComparison(state)?.split;
 return {
  choice:t('At nine, you chose “{choice}”.').replace('{choice}',t(option.label)),
  offer:t(funding?'At twenty, you faced a choice about paying for college.':'At twenty, this life had no college-funding choice.'),
  outcome:[funding?.note?t(funding.note):'',Number.isFinite(cash)&&cash!==0?
   t('Household buffer change: {cash}.').replace('{cash}',(cash<0?'−':'+')+'฿'+Math.abs(cash).toLocaleString('en')):'']
   .filter(Boolean).join(' '),
  path:path?t('From twenty to twenty-five: {path}').replace('{path}',t(path)):'',
  earnings:Number.isFinite(row.earnings)?t('Work earnings: {cash}.')
   .replace('{cash}','฿'+row.earnings.toLocaleString('en')):'',
  split:split?.age===9?t('Before, at nine, you chose “{choice}”.').replace('{choice}',t(split.before)):'',
  road:before&&path&&before!==path?t('At twenty: {before} → {now}.')
   .replace('{before}',t(before)).replace('{now}',t(path)):''
 };
}
