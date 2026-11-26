// The public chronology is fixed. The employer, household figures and dialogue
// are authored fiction.
export const CRISIS_SOURCE='https://www.bot.or.th/en/our-roles/special-measures/Tom-Yum-Kung-lesson.html';
const REPLY='job-crisis-support';
const SUPPORT={107504:1800,107513:900};

export function crisisHousehold(s){
 return s.intake?.birthYear===1975&&s.birth?.region===(s.seed===107504?'yaowarat':'chonburi')
  ?SUPPORT[s.seed]:undefined;
}

export function crisisQuestions(s,answered,jobs){
 const amount=crisisHousehold(s);
 if(!amount||s.age!==20||s.journey&&!answered.has(REPLY))return null;
 if(!answered.has('job-1996-20'))return jobs.filter(job=>job.job===1996).map(job=>({
  ...job,prompt:'A finance company offers nearly a third more pay for a job starting in 1996.',options:job.options.map(option=>option.id==='move'?{...option,pathway:'work'}:option)
 }));
 if(answered.has(REPLY))return [];
 return [{
  id:REPLY,station:20,heading:'The envelope on the table',
  prompt:'Your family is counting on a contribution this month.',
  context:'Pay part of the household bills or promise to take a regular shift at home.',
  options:[
   ...(s.finance&&s.finance.available+s.finance.reserve>=amount?[{id:'pay',label:'Put money in the envelope',cost:'Paid at the chapter review.',effects:{},note:'You promised money for the household bills.'}]:[]),
   {id:'time',label:'Take a regular shift at home',cost:'Two effort points for family this chapter.',locks:{eq:2},effects:{},note:'You promised to take a regular shift at home.'}
  ]
 }];
}

export function crisisPeriod(s,pay){
 const amount=crisisHousehold(s);
 if(!amount||s.age!==20)return null;
 const offer=s.pivots?.find(p=>p.pivot==='job-1996-20');
 const support=s.pivots?.find(p=>p.pivot===REPLY);
 if(!offer||!support)return null;
 const moved=offer.choice==='move',paid=support.choice==='pay';
 const wageChange=moved?-Math.round(.15*pay*60):0;
 return {origin:'crisis',id:'crisis',type:'work',age:22,title:'The envelope in 1997',
  text:moved
   ?'At the finance office, the pay envelope is thinner. At home, the bills are still on the table.'
   :'You kept your old job. At home, the bills are still on the table.',
  reply:paid?'“Shall we open it together?”':'“I kept your place at the table.”',
  wageChange,householdPayment:paid?amount:0,offer:offer.choice,support:support.choice};
}

export function crisisRecord(s){
 return s.history?.at(-1)?.events?.find(event=>event.origin==='crisis');
}
