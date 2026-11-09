// What a person puts first for the next five years. The choices change with age.
// Effects are authored game tuning: pay is a share of earnings, mood and body are small nudges.
export const PRIORITIES={
 school:{label:'School',aim:'balance',focus:'growth',mood:-1},
 friends:{label:'Friends',aim:'connection',focus:'connection',mood:2},
 play:{label:'Playing outside',aim:'sport',focus:'variety',mood:1,body:2},
 help:{label:'Helping at home',aim:'security',focus:'contribution',care:1},
 exams:{label:'Exams',aim:'balance',focus:'growth',mood:-2},
 love:{label:'Love',aim:'connection',focus:'connection',mood:1},
 earn:{label:'Earning early',aim:'security',focus:'security',pay:.08,mood:-1},
 sport:{label:'A sport or a band',aim:'sport',focus:'recognition',mood:1,body:1},
 career:{label:'Career',aim:'security',focus:'recognition',pay:.08,mood:-1},
 money:{label:'Money',aim:'security',focus:'security',pay:.05,body:-1},
 study:{label:'New skills',aim:'balance',focus:'growth',pay:-.04},
 adventure:{label:'Leaving and seeing',aim:'art',focus:'variety',pay:-.05,mood:2},
 family:{label:'Family',aim:'connection',focus:'connection',pay:-.03,mood:1,care:1},
 home:{label:'A home of your own',aim:'security',focus:'security',mood:1},
 balance:{label:'Balance',aim:'balance',focus:'variety',pay:-.02,mood:2,body:1},
 children:{label:'Your children',aim:'connection',focus:'contribution',pay:-.03,care:1},
 parents:{label:'Your parents',aim:'connection',focus:'contribution',pay:-.04,mood:-1,care:1},
 health:{label:'Your health',aim:'balance',focus:'security',pay:-.02,body:3},
 community:{label:'Your community',aim:'connection',focus:'contribution',pay:-.02,mood:1,duty:1},
 grandchildren:{label:'Grandchildren',aim:'connection',focus:'connection',mood:2,care:1},
 merit:{label:'Temple and merit',aim:'balance',focus:'contribution',mood:2,duty:1},
 travel:{label:'Seeing places',aim:'art',focus:'variety',pay:-.03,mood:2},
 legacy:{label:'What you leave behind',aim:'security',focus:'contribution',duty:1}
};
const BANDS=[[10,15,['school','friends','play','help']],[15,20,['exams','friends','love','earn','sport']],[20,30,['career','money','love','study','adventure']],[30,45,['family','career','money','home','balance']],[45,60,['children','parents','money','health','community']],[60,200,['health','grandchildren','merit','travel','legacy']]];
export const prioritiesFor=age=>BANDS.find(([a,b])=>age>=a&&age<b)?.[2]??[];
export const priorityFx=id=>Object.hasOwn(PRIORITIES,id)?PRIORITIES[id]:null;
