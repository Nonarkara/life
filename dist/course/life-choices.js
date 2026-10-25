// Life-forking decisions. Pay factors, fit thresholds and odds are authored game
// tuning, not career, marriage or health statistics.
import {rand} from './sim.js';
export const MAJORS={
 medicine:{label:'Medicine',axes:['iq','eq'],pay:1.6,cost:30000},
 engineering:{label:'Engineering',axes:['iq','drive'],pay:1.4,cost:20000},
 computing:{label:'Computer science',axes:['iq','craft'],pay:1.45,cost:20000},
 law:{label:'Law',axes:['iq','eq'],pay:1.35,cost:20000},
 business:{label:'Business',axes:['drive','eq'],pay:1.3,cost:22000},
 nursing:{label:'Nursing',axes:['eq','physique'],pay:1.15,cost:15000},
 education:{label:'Education',axes:['eq','iq'],pay:1,cost:12000},
 architecture:{label:'Architecture',axes:['craft','iq'],pay:1.2,cost:25000},
 arts:{label:'Fine arts',axes:['craft','eq'],pay:.85,cost:18000},
 humanities:{label:'Humanities',axes:['iq','eq'],pay:.95,cost:12000},
 agriculture:{label:'Agriculture',axes:['physique','iq'],pay:1,cost:10000},
 sport:{label:'Sport science',axes:['physique','drive'],pay:1,cost:14000}
};
export const majorOf=state=>Object.hasOwn(MAJORS,state.major??'')?state.major:undefined;
// How well a field suits this person: practice and starting shape on its axes, 0..1.
export function majorFit(state,key){const m=MAJORS[key];if(!m)return 1;return Math.min(1,m.axes.reduce((n,a)=>n+(state.effort?.[a]??0)+(state.attributes?.[a]??0)*.5,0)/(m.axes.length*5));}
export const mismatched=state=>{const m=majorOf(state);return !!m&&majorFit(state,m)<.35&&state.story?.flags?.switched===undefined;};
// A partner's character is only partly visible when you commit. Better judgement (EQ)
// improves the odds; it never guarantees them.
export function partnerNature(state){
 const flags=state.story?.flags??{},since=flags.married??flags.committed??flags.apart;if(since===undefined)return null;
 const row=(state.history??[]).find(r=>r.age===since),eq=(row?.effort?.eq??2)+(state.attributes?.eq??2);
 const q=rand(state.seed,since,'partner-nature')+eq*.025;
 return q<.22?'difficult':q>.68?'kind':'ordinary';
}
export const together=state=>{const f=state.story?.flags??{};return (f.married??f.committed??f.apart)!==undefined&&f.separated===undefined;};
export const reconciled=state=>state.story?.flags?.counselled!==undefined&&rand(state.seed,state.story.flags.counselled,'counsel')<.5;
// Pay after the big decisions: field and fit, a changed job, graduate study, your own venture.
export function careerFactor(state){
 const f=state.story?.flags??{},m=majorOf(state);let k=1;
 if(m)k*=MAJORS[m].pay*(.85+.3*majorFit(state,m));
 if(f.changedJob!==undefined)k*=.85+rand(state.seed,f.changedJob,'job-change')*.5;
 if(f.graduate!==undefined&&state.age>=f.graduate+5)k*=1.25;
 return k;
}
// Your own venture swings: most periods cost money, some pay well.
export function ventureSwing(state,age){const f=state.story?.flags?.founder;if(f===undefined||age<=f)return 0;return rand(state.seed,age,'venture')<.3?60000:-15000;}
export const dogAt=(state,age)=>{const d=state.story?.flags?.dog;return d!==undefined&&age>=d&&age<d+13;};
