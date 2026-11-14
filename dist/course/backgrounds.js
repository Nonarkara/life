// Five Thai birth classes: the condition you are born into, not earned.
// Resources and obligations vary. Intrinsic abilities are drawn independently.
// Contextual pressures are offered as choices by the encounter engine.
export const CLASS_TIERS={
 high_class:{label:'High class',cash:500000,inheritance:8000000,privilege:'wealth',drama:'market',note:'A larger family buffer brings opportunities and requests for help.'},
 low_class:{label:'Low class',cash:2000,inheritance:0,privilege:'none',drama:'debt',note:'A small family buffer makes costs and access matter more.'},
 middle_class:{label:'Middle class',cash:100000,inheritance:200000,privilege:'stable',drama:'ambition',note:'Some family support, with limits on what it can cover.'},
 working_class:{label:'Working class',cash:20000,inheritance:50000,privilege:'labor',drama:'wage',note:'Wage income supports the household; time and rest still matter.'},
 bureaucratic_class:{label:'Bureaucratic class',cash:80000,inheritance:300000,privilege:'government',drama:'corruption',note:'A family with public-service connections and regular support.'},
};
export const CLASS_KEYS=Object.keys(CLASS_TIERS);
// How often each class is born. Authored game weights, not census: most Thai lives begin in farming,
// wage-earning or small-business households, few in mansions. Uniform odds made a third of all lives
// high class. Replace with a sourced table when research/thailand-cohort-data.md has one.
export const CLASS_WEIGHTS=Object.freeze({low_class:.35,working_class:.30,middle_class:.22,bureaucratic_class:.08,high_class:.05});
export const drawClass=(roll,keys=CLASS_KEYS)=>{const total=keys.reduce((n,k)=>n+(CLASS_WEIGHTS[k]??0),0);let at=roll*total;return keys.find(k=>(at-=CLASS_WEIGHTS[k]??0)<0)??keys.at(-1);};

// Compatibility for support/pay/school rules; never an intelligence score.
export function backgroundBand(s){return s.intake?.upbringing??({high_class:'comfortable',low_class:'constrained',working_class:'constrained',middle_class:'middle',bureaucratic_class:'middle'}[s.intake?.class??s.birth?.class]??'middle');}
