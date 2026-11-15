// What the last five years did, in the life's own numbers, and whether one more stretch like
// it ends the life. Read from the record; nothing here is estimated.
import {anchoredOf,brokeNow} from './sim.js';
import {netWorth} from './finance.js';
const baht=n=>(n<0?'−':'')+'฿'+Math.abs(Math.round(n)).toLocaleString('en');
export function periodFacts(before,after){
 const row=after?.history?.at(-1);if(!row||!before||after.age<=before.age)return null;
 const r=after.finance?.receipts?.findLast(x=>x.kind==='period'&&x.age===row.age);
 return {income:r?.income??null,expense:r?.expense??null,debt:after.finance?.debt??0,
  // At fifteen the money shown stops being the household's and becomes the person's own.
  own:!before.finance&&after.finance?netWorth(after.finance):null,
  wellbeing:[Math.round(before.wellbeing),Math.round(after.wellbeing)],health:[Math.round(before.health),Math.round(after.health)]};
}
export function periodLine(before,after,t=x=>x){
 // A stretch that ends the life is told by the ending, not given away as it starts.
 const f=after?.death?null:periodFacts(before,after);if(!f)return null;
 const move=(key,pair)=>pair[0]===pair[1]?null:t(key).replace('{x}',pair[0]).replace('{y}',pair[1]);
 return [f.income===null?null:t('Earned {x}, spent {y}.').replace('{x}',baht(f.income)).replace('{y}',baht(f.expense)),
  f.debt>0?t('Debt is now {x}.').replace('{x}',baht(f.debt)):null,
  f.own===null?null:t('From fifteen the money shown is your own: {x}.').replace('{x}',baht(f.own)),move('Wellbeing {x} → {y}.',f.wellbeing),move('Health {x} → {y}.',f.health)].filter(Boolean).join(' ')||null;
}
// The same two rules sim.js ends a life by, said one review early. Both can be true at once.
export function lifeWarning(s,t=x=>x){
 if(s.stage!=='review'||!s.intake?.class)return null;
 return [s.age>=10&&(s.history?.at(-1)?.wellbeing??100)<=2&&!anchoredOf(s)?t('Your wellbeing is almost at zero. Five more years like this can end this life.'):null,
  s.age>=15&&brokeNow(s.finance)?t('You owe {x} and have nothing set aside. If that is still true in five years, this life ends.').replace('{x}',baht(s.finance.debt)):null].filter(Boolean).join(' ')||null;
}
