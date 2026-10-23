// Choices and cash amounts are authored gameplay, not career forecasts.
export const PATHWAYS={
 school:{label:'Continue school',from:15,to:20},
 vocational:{label:'Train through an apprenticeship',from:15,to:60},
 independent:{label:'Try independent work',from:15,to:60},
 college:{label:'Attend college',from:20,to:25},
 work:{label:'Take a salaried job',from:20,to:60}
};
export function availablePathways(age){return Object.entries(PATHWAYS).filter(([,p])=>age>=p.from&&age<p.to);}
export function pathwayPeriod(state,roll){
 const routes=availablePathways(state.age);const route=routes.some(([key])=>key===state.pathway)?state.pathway:(state.age<20?'school':'work');
 if(state.age<15||state.age>=60)return {route,cash:0,learning:0,incomeFactor:1,description:''};
 const family=state.intake?.upbringing??'middle';
 const support=state.age<25?{constrained:2000,middle:6000,comfortable:12000}[family]:0;
 const choices={
 school:{cash:support-6000,learning:4,description:'You continued school. Family support helped with books and travel.'},
 college:{cash:support-18000,learning:10,description:'College brought study costs and more time to learn. A degree does not guarantee a job.'},
 vocational:{cash:4000+state.skills.physique*100+state.skills.craft*150,learning:5,description:'An apprenticeship paid a little while you learned through work.'},
 independent:roll<.2?{cash:24000,learning:3,description:'Your independent project found paying customers.'}:{cash:-5000,learning:3,description:'Independent work brought uneven income. The project cost more than it earned.'},
 work:{cash:0,learning:2,description:'Regular work supported the household. You learned on the job.'}
 };
 return {route,incomeFactor:{school:0,college:.3,vocational:.6,independent:.2,work:1}[route],...choices[route]};
}
