// Turns the year's real numbers into one plain sentence a person could act on.
import {worldAt,conditions} from './world-series.js';
import {t} from './i18n.js';
const fill=(k,v)=>Object.entries(v).reduce((s,[a,b])=>s.replaceAll('{'+a+'}',b),t(k));
export function climateLines(year){
 const w=worldAt(year),old=worldAt(year-5),c=conditions(year),out=[];if(!w)return out;
 if(c.cheapCredit)out.push(fill('Loans are cheap: {a}%, down from {b}% five years ago. A good time to borrow, if the plan is good.',{a:w.lending,b:old.lending}));
 if(c.dearCredit)out.push(fill('Loans are dear: {a}%, up from {b}% five years ago. Debt taken now is heavy.',{a:w.lending,b:old.lending}));
 if(c.inflation)out.push(fill('Prices rose {a}% this year. Cash under the mattress is shrinking.',{a:w.inflation}));
 if(c.slump)out.push(fill('The economy shrank {a}% this year. Safe jobs are worth more than usual.',{a:Math.abs(w.growth)}));
 if(c.boom)out.push(fill('The economy grew {a}% this year. Everyone thinks it will last.',{a:w.growth}));
 if(c.bahtFell)out.push(fill('The baht fell to {a} a dollar. Dollar debts just got bigger.',{a:w.baht}));
 if(!out.length&&w.lending!=null&&w.deposit!=null)out.push(fill('A bank pays {a}% on savings and charges {b}% on loans.',{a:w.deposit,b:w.lending}));
 return out;
}
