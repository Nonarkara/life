// Life-forking decisions. Pay factors, fit thresholds and odds are authored game
// tuning, not career, marriage or health statistics.
import {rand,flagsOf} from './sim.js';
import {routeOf} from './life-routes.js';
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
 forestry:{label:'Forestry',axes:['physique','iq'],pay:.95,cost:10000},
 sport:{label:'Sport science',axes:['physique','drive'],pay:1,cost:14000}
};
export const majorOf=state=>Object.hasOwn(MAJORS,state.major??'')?state.major:undefined;
// How well a field suits this person: practice and starting shape on its axes, 0..1.
export function majorFit(state,key){const m=MAJORS[key];if(!m)return 1;return Math.min(1,m.axes.reduce((n,a)=>n+(state.effort?.[a]??0)+(state.attributes?.[a]??0)*.5,0)/(m.axes.length*5));}
export const mismatched=state=>{const m=majorOf(state);return !!m&&majorFit(state,m)<.35&&state.story?.flags?.switched===undefined;};
// A partner's character is only partly visible when you commit. Better judgement (EQ)
// improves the odds; it never guarantees them.
export function partnerNature(state){
 const flags=flagsOf(state),since=flags.married??flags.committed??flags.apart;if(since===undefined)return null;
 const row=(state.history??[]).find(r=>r.age===since),eq=(row?.effort?.eq??2)+(state.attributes?.eq??2);
 const q=rand(state.seed,since,'partner-nature')+eq*.025;
 return q<.22?'difficult':q>.68?'kind':'ordinary';
}
export const together=state=>{const f=flagsOf(state);return (f.married??f.committed??f.apart)!==undefined&&f.separated===undefined;};
export const reconciled=state=>{const f=flagsOf(state);return f.counselled!==undefined&&rand(state.seed,f.counselled,'counsel')<.5;};
// Pay after the big decisions: field and fit, a changed job, graduate study, your own venture.
export function careerFactor(state){
 const f=flagsOf(state),m=majorOf(state);let k=1;
 if(m)k*=MAJORS[m].pay*(.85+.3*majorFit(state,m));
 if(f.meritScholar)k*=1.08;
 if(f.keptTrade||f.ranStall||f.stallOwner)k*=1.08;
 if(f.partnered!==undefined&&state.age>=f.partnered+5)k*=1.15;
 if(f.changedJob!==undefined)k*=.85+rand(state.seed,f.changedJob,'job-change')*.5;
 if(f.graduate!==undefined&&state.age>=f.graduate+5)k*=1.25;
 return k*fortune(state);
}
// A way of life has its own shape of fortune, so two lives of one class end far apart.
// Stage work: most stay small, a few break out for a decade, then fall back. Service climbs a ladder.
// Trade swings. Labour stays flat. Practice on the route's axes raises the odds; nothing guarantees them.
// Authored tuning, not wage statistics.
const SHAPE={luk_thung:'star',boxer:'star',actor:'star',painter:'star',writer:'star',
 kharatchakan:'ladder',cadet:'ladder',scholar:'ladder',scholarship_kid:'ladder',dancer:'ladder',
 trader:'trade',tycoon:'trade',
 taxi:'labour',win_motorsai:'labour',rice_debt:'labour',no_buffer:'labour',isan_daughter:'labour',novice:'labour',abroad:'labour'};
const AXIS={star:['craft','physique'],ladder:['iq','drive'],trade:['drive','eq'],labour:['physique','drive']};
// A calling counts once its second step is on the record: turning the first offer down keeps an ordinary life.
export const fortuneShape=state=>{const r=routeOf(state);return r&&typeof flagsOf(state)['r_'+r+'_2']==='number'?SHAPE[r]??'plain':'plain';};
// The turn a life takes is told in the five years it starts, so the player sees it, not just a bigger number.
export function fortuneTurn(state,from){
 const shape=fortuneShape(state);
 if(shape==='star'&&rand(state.seed,0,'fortune-break')<.1+prep(state,shape)){const start=starStart(state);return from===start?'Your name started to sell tickets.':from===start+10?'The crowds moved on to someone younger.':null;}
 if(shape==='trade'&&from===30&&bigTrade(state))return 'A deal came good, and then another, and then the money came faster than you could spend it.';
 return null;
}
const prep=(state,shape)=>Math.min(.25,(AXIS[shape]??['iq','eq']).reduce((n,a)=>n+(state.skills?.[a]??0),0)*.004);
const starStart=state=>25+Math.floor(rand(state.seed,0,'fortune-when')*3)*5;
const bigTrade=state=>rand(state.seed,0,'fortune-big')<.08+prep(state,'trade')*.6;
// Whether a stage break-out is running at this age, so the words never contradict the numbers.
export const starOn=state=>fortuneShape(state)==='star'&&rand(state.seed,0,'fortune-break')<.1+prep(state,'star')&&state.age>=starStart(state)&&state.age<starStart(state)+10;
export function fortune(state){
 if(state.age<20)return 1;
 const shape=fortuneShape(state),pr=prep(state,shape);
 const luck=Math.exp((rand(state.seed,0,'fortune-luck')-.5)*.9),yrs=state.age-20;
 // A spike never reaches the pension: the last working years pay the ordinary rate.
 if(state.age>=55)return luck*(shape==='ladder'?1.8:shape==='labour'?.9:1);
 if(shape==='star'){const hit=rand(state.seed,0,'fortune-break')<.1+pr,start=starStart(state);
  return luck*(hit&&state.age>=start&&state.age<start+10?3+rand(state.seed,0,'fortune-size')*4:hit&&state.age>=start+10?1.3:.85);}
 if(shape==='ladder')return luck*Math.min(1.8,1+yrs*(.02+pr*.06));
 if(shape==='trade'){const big=bigTrade(state);return luck*(big&&yrs>=10?4+rand(state.seed,0,'fortune-size')*6:.6+rand(state.seed,Math.floor(state.age/5),'fortune-swing')*1.6);}
 if(shape==='labour')return luck*.9;
 return luck*(1+Math.min(.4,yrs*.01));
}
// Your own venture swings: most periods cost money, some pay well; preparation shifts the odds.
export function ventureSwing(state,age){const f=flagsOf(state).founder;if(f===undefined||age<=f)return 0;const prep=Math.min(.28,((state.skills?.drive??0)+(state.skills?.craft??0)+(state.skills?.iq??0))*.008);return rand(state.seed,age,'venture')<.3+prep?60000+Math.round(prep*50000):-15000;}
export const dogAt=(state,age)=>{const f=flagsOf(state);const d=f.dog;const died=f.dogDied;return d!==undefined&&age>=d&&age<(died??d+13);};
