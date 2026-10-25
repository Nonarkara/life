import {residenceAt,recordedFinance,workplaceAt} from './locations.js';
import {monthlyFlow} from './finance.js';
// Presentation reads elapsed records only. No new inventory or outcomes are saved.
export function roomRecord(state,age=state.age){
 const home=residenceAt(state,age),seen=(state.story?.seen??[]).filter(e=>e.age<=age);
 const purchases=(state.finance?.purchases??[]).filter(p=>p.age<=age);
 const activity=(state.history??[]).filter(r=>(r.from??r.age)<=age).at(-1);
 return {home,stage:age<6?'infancy':age<20?'school':'adult',
  possessions:age>=6?[{id:'school-case',acquiredAt:6,home:home.id}]:[],
  books:purchases.filter(p=>p.key==='book').length,comics:purchases.filter(p=>p.key==='comics').length,
  workspace:age>=20&&activity?.pathway==='independent',
  remembered:seen.some(e=>e.id==='remember'||e.id==='remember_mother'),
  recovering:seen.some(e=>e.id==='health_rest'&&e.age===Math.floor(age)),
  moved:home.id!=='family',workplace:workplaceAt(state,age)};
}
export function recordedCommute(state,age,pathway){
 if(age<20||age>=60||!['work','vocational'].includes(pathway))return null;
 const finance=recordedFinance(state,age);if(!finance)return null;
 return monthlyFlow({...state,age,finance},{pathway,earnings:0}).commute;
}
// A symbolic60-second day, not accelerated real clock time. Longer real-model
// commutes take more of both ends of the day; work retains its existing16units.
export function commuteSchedule(minutes){
 const duration=minutes===null||minutes===undefined?12:Math.max(7,Math.min(18,7+minutes/12));
 return {depart:20-duration,arrive:20,leave:36,home:36+duration,duration};
}
