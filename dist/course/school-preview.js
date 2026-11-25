import {CHILD_CHOICES} from './childhood-choices.js';
import {PATHWAYS} from './pathways.js';
import {replayComparison} from './replay-compare.js';
import {configureLife,newLife} from './sim.js';

const START={class:'low_class',sex:'female',birthYear:1975};
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

export function schoolReview(state,t){
 if(!isSchoolPreviewLife(state)||state.age!==25)return null;
 const option=choices.find(o=>o.id===state.childhood.choices.find(c=>c.age===9)?.choice);
 const row=state.history.find(r=>r.from===20&&r.age===25);
 if(!option||!row)return null;
 const college=row.pivots?.some(record=>record.pivot==='college-cost');
 const path=PATHWAYS[row.pathway];
 const comparison=replayComparison(state),split=comparison?.split,road=comparison?.earlyRoad;
 return {
  choice:t('At nine, you chose “{choice}”.').replace('{choice}',t(option.label)),
  offer:t(college?'At twenty, you faced a choice about paying for college.':'At twenty, this life had no college-funding choice.'),
  path:path?t('From twenty to twenty-five: {path}').replace('{path}',t(path.label)):'',
  earnings:Number.isFinite(row.earnings)?t('Work earnings: {cash}.')
   .replace('{cash}','฿'+row.earnings.toLocaleString('en')):'',
  split:split?.age===9?t('Before, at nine, you chose “{choice}”.').replace('{choice}',t(split.before)):'',
  road:road?t('At age {n} your study or work changed from {a} to {b}.').replace('{n}',road.age)
   .replace('{a}',t(road.before)).replace('{b}',t(road.now)):''
 };
}
