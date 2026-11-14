import {backgroundBand} from './backgrounds.js';
import {fortuneShape,fortuneTurn,starOn} from './life-choices.js';
import {routeOf} from './life-routes.js';
import {birthYearOf} from './thai-history.js';
import {rand} from './rand.js';
// Five years of work or school, told in the words of this life: its calling, or its household's means.
// Two lives no longer close every chapter with the same sentence.
export const WORK_LINES={
 star:['You played wherever they would book you, and took day work between.','Most nights the room was half empty. You went on anyway.'],
 starHigh:['The bookings came to you now, not the other way round.'],
 ladder:['Another grade, another desk, the same building.','The salary rose a little each year, as the scale said it would.'],
 trade:['Some months the stock sold out, and some months it sat.','You counted the takings every night and paid the suppliers first.'],
 labour:['The same work, the same hours, the same pay most months.','Your body did the work and told you about it at night.'],
 constrained:['You took the shifts nobody wanted, and the money still ran out before the month did.','Work paid the rent and little else.'],
 // Callings whose work is not a salary, a stage or a stall get their own words.
 painter:['Commissions paid the rent. The rest went on materials.','You made what sold, and kept back what mattered.'],
 writer:['Commissions paid the rent. The rest went on materials.','You made what sold, and kept back what mattered.'],
 novice:['Alms at dawn, chanting at dusk, and the work of the temple between.'],
 rice_debt:['Planting, the long wait, the harvest, and the debt.','The rice went to the mill, and most of the money to the lender.'],
 dancer:['Rehearsal in the morning, classes in the afternoon, a state stage some evenings.'],
 middle:['Work was steady. You had opinions about your manager.','You changed desks twice and companies once.'],
 comfortable:['The family name opened doors. The work behind them was still yours.','Meetings, lunches, and a car to the office.']
};
export const SCHOOL_LINES={
 constrained:['You stayed in school while friends went to work. The family paid for it somewhere else.','You did your homework under a single bulb.'],
 middle:['School, tuition in the evening, school again.','You continued school. Family support helped with books and travel.'],
 comfortable:['School, extra tutors, and a summer abroad.','Your school had a swimming pool and a waiting list.'],
 // Before mass air travel a rich child's summer stayed at home.
 comfortableEarly:['School, extra tutors, and long holidays by the sea.','Your school had a swimming pool and a waiting list.']
};
const pick=(list,state,key)=>list[Math.floor(rand(state.seed,state.age,key)*list.length)];
function workLine(state){
 // The turn of a fortune tells these five years itself; a stock line beside it would contradict it.
 if(fortuneTurn(state,state.age))return '';
 const shape=fortuneShape(state),route=shape==='plain'?null:routeOf(state);
 if(route&&WORK_LINES[route])return pick(WORK_LINES[route],state,'work-line');
 if(shape==='star')return pick(starOn(state)?WORK_LINES.starHigh:WORK_LINES.star,state,'work-line');
 return pick(WORK_LINES[shape]??WORK_LINES[backgroundBand(state)]??WORK_LINES.middle,state,'work-line');
}
function schoolLine(state,family){const early=family==='comfortable'&&(birthYearOf(state)??2000)<1970;return pick(SCHOOL_LINES[early?'comfortableEarly':family]??SCHOOL_LINES.middle,state,'school-line');}
// Choices and cash amounts are authored gameplay, not career forecasts.
export const PATHWAYS={
 school:{label:'Continue school',from:15,to:20},
 vocational:{label:'Train through an apprenticeship',from:15,to:60},
 independent:{label:'Try independent work',from:15,to:60},
 college:{label:'Attend college',from:20,to:25},
 work:{label:'Take a salaried job',from:20,to:60}
};
export function scholarshipStudy(state,age=state?.age){
 const award=state?.story?.flags?.r_scholarship_kid_2;
 return Number.isInteger(award)&&age>=award&&age<award+5;
}
export function availablePathways(age,state){return Object.entries(PATHWAYS).filter(([key,p])=>age>=p.from&&(age<p.to||key==='college'&&scholarshipStudy(state,age)));}
export function pathwayPeriod(state,roll){
 const routes=availablePathways(state.age,state);const route=routes.some(([key])=>key===state.pathway)?state.pathway:(state.age<20?'school':'work');
 if(state.age<15||state.age>=60)return {route,cash:0,learning:0,incomeFactor:1,description:''};
 const family=backgroundBand(state);
 const support=state.age<25?{constrained:1000,middle:6000,comfortable:24000}[family]:0;
 const merit=state.pivotFlags?.meritScholar?12000:0;
 const craftBonus=Math.min(16000,(state.skills?.craft??0)*450+(state.skills?.drive??0)*350);
 const choices={
 school:{cash:support-6000,learning:4,description:schoolLine(state,family)},
 college:{cash:support+merit-(scholarshipStudy(state)?0:18000),learning:10+(state.pivotFlags?.meritScholar?2:0),description:'College brought study costs and more time to learn. A degree does not guarantee a job.'},
 vocational:{cash:4000+state.skills.physique*100+state.skills.craft*150,learning:5,description:'An apprenticeship paid a little while you learned through work.'},
 independent:roll<.2+Math.min(.35,((state.skills?.craft??0)+(state.skills?.drive??0))*.012)?{cash:24000+craftBonus,learning:3,description:'Your independent project found paying customers.'}:{cash:-5000,learning:3,description:'Independent work brought uneven income. The project cost more than it earned.'},
 work:{cash:0,learning:2,description:workLine(state)}
 };
 return {route,incomeFactor:{school:0,college:.3,vocational:.6,independent:.2,work:1}[route],...choices[route]};
}
