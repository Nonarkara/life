import {moveReserve} from './finance.js';
import {economyFor,periodEconomy,economyYears} from './economy.js';
export const ASSETS={bond:{label:'Bond fund'},equity:{label:'Equity fund'}};
const integer=n=>Number.isSafeInteger(n)&&n>=0;
export const holdingsOf=f=>f?.holdings??{bond:{value:0,basis:0},equity:{value:0,basis:0}};
export const holdingsValue=f=>Object.values(holdingsOf(f)).reduce((s,h)=>s+h.value,0);
export const validHoldings=h=>h===undefined||!!h&&Object.keys(h).length===2&&Object.keys(ASSETS).every(k=>h[k]&&Object.keys(h[k]).length===2&&integer(h[k].value)&&integer(h[k].basis));
export const tradeFee=amount=>integer(amount)&&amount>0?Math.max(1,Math.round(amount*.005)):0;
export function trade(state,asset,side,amount){
 const f=state.finance;if(!f||!validHoldings(f.holdings)||!integer(f.available)||!Array.isArray(f.receipts)||state.stage!=='review'||state.age<15||state.story?.pending||!Object.hasOwn(ASSETS,asset)||!['buy','sell'].includes(side)||!integer(amount)||amount===0||f.receipts.length>=900)return state;
 const fee=tradeFee(amount),holdings=structuredClone(holdingsOf(f)),position=holdings[asset];
 let available=f.available,basis=0,realizedGain=f.realizedGain??0;
 if(side==='buy'){
  if(!Number.isSafeInteger(amount+fee)||amount+fee>available||!Number.isSafeInteger(position.value+amount)||!Number.isSafeInteger(position.basis+amount+fee))return state;
  available-=amount+fee;position.value+=amount;position.basis+=amount+fee;
 }else{
  if(amount>position.value||amount<=fee)return state;
  basis=amount===position.value?position.basis:Math.round(position.basis*(amount/position.value));
  if(!Number.isSafeInteger(available+amount-fee)||!Number.isSafeInteger(realizedGain+amount-fee-basis))return state;
  available+=amount-fee;position.value-=amount;position.basis-=basis;realizedGain+=amount-fee-basis;
 }
 const receipt={id:`trade:${state.age}:${f.receipts.length}`,age:state.age,kind:'trade',asset,side,amount,fee,releasedBasis:basis,realizedGain:side==='sell'?amount-fee-basis:0,income:0,expense:fee,change:-fee};
 if(!Number.isSafeInteger(available+f.reserve+holdingsValue({holdings})-f.debt))return state;
 const finance={...f,available,holdings,realizedGain,receipts:[...f.receipts,receipt]},last=state.history.at(-1);
 return {...state,economy:economyFor(state),finance,history:last?[...state.history.slice(0,-1),{...last,finance:{...last.finance,available,reserve:f.reserve,debt:f.debt,holdings:structuredClone(holdings),realizedGain}}]:state.history};
}
export function markHoldings(finance,world,from,to){
 let f=finance;if(!f||!f.holdings||holdingsValue(f)===0)return f;
 if(!validInvestmentLedger(f,to,world))return null;
 for(const year of periodEconomy(world,from,to).rows){
  const id=`market:${year.age}`;if(f.receipts.some(r=>r.id===id))continue;
  if((f.receipts.at(-1)?.age??-1)>=year.age)return null;
  if(f.receipts.length>=999)return null;
  const holdings=structuredClone(holdingsOf(f));let change=0;const deltas={};
  for(const asset of Object.keys(ASSETS)){const before=holdings[asset].value,next=Math.round(before*(1+year[asset]));if(!integer(next))return null;holdings[asset].value=next;deltas[asset]=next-before;change+=deltas[asset];}
  if(!Number.isSafeInteger(change))return null;
  f={...f,holdings,receipts:[...f.receipts,{id,age:year.age,kind:'market',income:Math.max(0,change),expense:Math.max(0,-change),change,deltas,sourceYear:year.sourceYear}]};
 }return f;
}
export function validInvestmentLedger(f,age,world){
 if(!Array.isArray(f.receipts)||!validHoldings(f.holdings)||(f.realizedGain!==undefined&&!Number.isSafeInteger(f.realizedGain)))return false;
 const positions=holdingsOf(null),seen=new Set(),years=world?new Map(economyYears(world,age).map(r=>[r.age,r])):null;let realized=0,lastAge=-1,nonMarketAt=-1;
 for(const [index,r]of f.receipts.entries()){
  if(!r||!Number.isInteger(r.age)||r.age<lastAge||r.age>age||seen.has(r.id))return false;seen.add(r.id);lastAge=r.age;
  if(r.kind!=='market')nonMarketAt=r.age;
  if(r?.kind==='trade'){
   if(r.id!==`trade:${r.age}:${index}`||!Object.hasOwn(ASSETS,r.asset)||!['buy','sell'].includes(r.side)||!integer(r.amount)||r.amount===0||r.fee!==tradeFee(r.amount)||r.change!==-r.fee||r.age<15||r.age>age)return false;
   const p=positions[r.asset];
   if(r.side==='buy'){if(r.releasedBasis!==0||r.realizedGain!==0)return false;p.value+=r.amount;p.basis+=r.amount+r.fee;}
   else{if(r.amount>p.value||r.amount<=r.fee)return false;const basis=r.amount===p.value?p.basis:Math.round(p.basis*r.amount/p.value),gain=r.amount-r.fee-basis;if(r.releasedBasis!==basis||r.realizedGain!==gain)return false;p.value-=r.amount;p.basis-=basis;realized+=gain;}
  }else if(r?.kind==='market'){
   if(r.id!==`market:${r.age}`||nonMarketAt===r.age||!r.deltas||Object.keys(r.deltas).length!==2||!Number.isInteger(r.sourceYear)||r.sourceYear<1961||r.sourceYear>2025||r.change!==r.deltas.bond+r.deltas.equity)return false;
   if(positions.bond.value+positions.equity.value===0)return false;
   const year=years?.get(r.age);if(years&&(!year||year.sourceYear!==r.sourceYear))return false;
   for(const asset of Object.keys(ASSETS)){const delta=r.deltas[asset],p=positions[asset];if(!Number.isSafeInteger(delta)||!integer(p.value+delta)||p.value===0&&delta!==0||year&&Math.round(p.value*(1+year[asset]))-p.value!==delta)return false;p.value+=delta;}
  }
 }
 return Object.keys(ASSETS).every(k=>integer(positions[k].value)&&integer(positions[k].basis)&&positions[k].value===holdingsOf(f)[k].value&&positions[k].basis===holdingsOf(f)[k].basis)&&realized===(f.realizedGain??0);
}
// Selling everything: funds become cash in the wallet, and any debt is repaid from it.
export function sellAll(state){
 let s=state;for(const asset of Object.keys(ASSETS)){const v=holdingsOf(s.finance)[asset].value;if(v>tradeFee(v))s=trade(s,asset,'sell',v);}
 const f=s.finance;if(!f?.debt||!f.available)return s;
 const repaid=Math.min(f.debt,f.available),finance={...f,available:f.available-repaid,debt:f.debt-repaid},last=s.history.at(-1);
 return {...s,finance,history:[...s.history.slice(0,-1),{...last,finance:{...last.finance,available:finance.available,debt:finance.debt}}]};
}
// Choosing to invest is a standing habit: each period until 60 the savings, plus a quarter
// of the wallet, go into funds split between bonds and shares. Markets then compound it.
// ponytail: at 60, or when debt appears, everything is sold to cash; a gradual drawdown would keep growth after 60.
export function autoInvest(state){
 const f=state.finance,flags=state.story?.flags??{};if(!f||state.stage!=='review'||flags.invests===undefined)return state;
 if(state.age>=60||f.debt>0||flags.panicSold!==undefined)return holdingsValue(f)>0||f.debt>0&&f.available>0?sellAll(state):state;
 const budget=Math.floor(f.reserve+f.available/4);
 // Both fees belong inside the authorized budget. A reserve-only wallet must
 // not silently end up holding bonds alone after the first purchase spends fees.
 let low=0,high=Math.floor(budget/2);
 while(low<high){const mid=Math.ceil((low+high)/2);if(2*(mid+tradeFee(mid))<=budget)low=mid;else high=mid-1;}
 const amount=low;if(amount<200||f.receipts.length>898)return state;
 const s=f.reserve?moveReserve(state,f.reserve):state;
 return trade(trade(s,'bond','buy',amount),'equity','buy',amount);
}
