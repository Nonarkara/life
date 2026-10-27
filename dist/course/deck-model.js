// Presentation only: authored monthly plan, not a historical return or forecast.
import {monthlyFlow,netWorth} from './finance.js';
import {availablePathways} from './pathways.js';
import {holdingsValue} from './investments.js';
export const deckBaht=n=>'฿'+Math.round(n).toLocaleString('en');
export function deckFinance(state){
 if(!state.finance||state.age<15)return null;
 const f=state.finance,routes=availablePathways(state.age),pathway=routes.some(([id])=>id===state.pathway)?state.pathway:state.age<20?'school':'work';
 const flow=monthlyFlow(state,{pathway}),income=flow.income,essential=flow.essential;
 const surplus=Math.max(0,income-essential),repayment=Math.min(f.debt??0,surplus),free=surplus-repayment;
 const fun=Math.floor(free*f.budget.fun/100),learn=Math.floor(free*f.budget.learn/100),saved=Math.floor(free*f.budget.save/100);
 const remainder=free-fun-learn-saved,lifestyle=Math.floor(remainder*.85),unallocated=remainder-lifestyle,shortfall=Math.max(0,essential-income);
 const liquid=f.available+f.reserve,runway=essential>0?Math.floor(liquid/essential):null;
 const items=[['Income',income],['Essentials',essential],...(repayment?[['Debt repayment',repayment]]:[]),['Lifestyle',lifestyle],['Fun and learning',fun+learn],['Set aside',saved],['Cash left over',unallocated],...(shortfall?[['Monthly shortfall',shortfall]]:[])];
 return {flow,income,essential,repayment,fun,learn,saved,lifestyle,unallocated,shortfall,liquid,runway,worth:netWorth(f),holdings:holdingsValue(f),debt:f.debt??0,
  items:items.map(([label,value])=>[label,deckBaht(value)]),bar:[['Essentials',essential],['Debt repayment',repayment],['Lifestyle',lifestyle],['Fun and learning',fun+learn],['Set aside',saved,true],['Cash left over',unallocated]]};
}
export function deckHistory(state,metric){
 const value=r=>metric==='worth'?r.finance?(r.finance.available??0)+(r.finance.reserve??0)-(r.finance.debt??0)+Object.values(r.finance.holdings??{}).reduce((n,h)=>n+(h.value??0),0):null:r[metric];
 const records=(state.history??[]).filter(r=>r.age<=state.age&&Number.isFinite(value(r))).map(r=>({age:r.age,value:value(r)}));
 const min=metric==='worth'?Math.min(0,...records.map(r=>r.value)):0,max=metric==='worth'?Math.max(0,...records.map(r=>r.value)):100;
 return {records,min,max,span:max-min||1,age:Math.max(5,state.age)};
}
