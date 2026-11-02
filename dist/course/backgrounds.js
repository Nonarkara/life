// Six Thai birth classes: the condition you are born into, not earned.
// Resources and obligations vary. Intrinsic abilities are drawn independently.
// Contextual pressures are offered as choices by the encounter engine.
export const CLASS_TIERS={
 high_class:{label:'High class',cash:500000,inheritance:1200000,privilege:'wealth',drama:'market',note:'A larger family buffer brings opportunities and requests for help.'},
 low_class:{label:'Low class',cash:2000,inheritance:0,privilege:'none',drama:'debt',note:'A small family buffer makes costs and access matter more.'},
 middle_class:{label:'Middle class',cash:100000,inheritance:200000,privilege:'stable',drama:'ambition',note:'Some family support, with limits on what it can cover.'},
 working_class:{label:'Working class',cash:20000,inheritance:50000,privilege:'labor',drama:'wage',note:'Wage income supports the household; time and rest still matter.'},
 bureaucratic_class:{label:'Bureaucratic class',cash:80000,inheritance:300000,privilege:'government',drama:'corruption',note:'A family with public-service connections and regular support.'},
 royal_associated:{label:'Royal associated',cash:300000,inheritance:800000,privilege:'ml',drama:'scrutiny',note:'Family connections bring support and social expectations.'}
};
export const CLASS_KEYS=Object.keys(CLASS_TIERS);

// Compatibility for support/pay/school rules; never an intelligence score.
export function backgroundBand(s){return s.intake?.upbringing??({high_class:'comfortable',royal_associated:'comfortable',low_class:'constrained',working_class:'constrained',middle_class:'middle',bureaucratic_class:'middle'}[s.intake?.class??s.birth?.class]??'middle');}
