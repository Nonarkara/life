// Personal accounts use whole game baht; prices/effects are authored, not estimates.
import {WORKPLACES} from './locations.js';
import {REGIONS,MOVE_TARGETS,regionIdFor} from './regions.js';
import {careerFactor} from './life-choices.js';
import {holdingsValue,validHoldings,markHoldings,validInvestmentLedger} from './investments.js';
import {periodEconomy} from './economy.js';
export {WORKPLACES};
export const CITY_TRAVEL={expense:1000,minutes:50};
export const validFinanceLocation=(f,age=80)=>f===undefined||!!f&&(f.housing===undefined||Object.hasOwn(HOUSING,f.housing))&&(f.workplace===undefined||Object.hasOwn(WORKPLACES,f.workplace))&&(f.locationSince===undefined||Number.isInteger(f.locationSince)&&f.locationSince>=20&&f.locationSince<=age)&&(f.region===undefined||Object.hasOwn(REGIONS,f.region))&&(f.regionSince===undefined||Number.isInteger(f.regionSince)&&f.regionSince>=20&&f.regionSince<=age);
export const DEFAULT_BUDGET={save:20,fun:10,learn:10};
export const HOUSING={family:{label:'Family home',rent:1500,transport:1500,minutes:60},far:{label:'Lower rent · longer commute',rent:3500,transport:1500,minutes:80},near:{label:'Higher rent · shorter commute',rent:6500,transport:500,minutes:20}};
export const PURCHASES={snack:{label:'Enjoy a snack',cost:40,hours:0,wellbeing:1,skills:{}},book:{label:'Read a book',cost:100,hours:2,wellbeing:0,skills:{iq:1}},comics:{label:'Comics and a conversation',cost:80,hours:2,wellbeing:1,skills:{eq:1}},class:{label:'Attend a short class',cost:500,hours:4,wellbeing:0,skills:{craft:2}},sport:{label:'Play sport with friends',cost:100,hours:2,wellbeing:1,skills:{physique:1}}};
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const cap=n=>Math.max(0,Math.min(100,n));
export const netWorth=f=>f?f.available+f.reserve+holdingsValue(f)-f.debt:0;
export const validBudget=p=>p&&Object.keys(p).length===3&&['save','fun','learn'].every(k=>integer(p[k])&&p[k]<=100)&&p.save+p.fun+p.learn<=100;
export function allowance(state){return {constrained:400,middle:1500,comfortable:5000}[state.intake?.upbringing??'middle'];}
export function openFinance(state){
 if(state.finance||state.age<15||state.stage==='recap')return state;
 const studying=state.age<20&&(!state.pathway||state.pathway==='school')||state.pathway==='college'&&state.age<25;
 const amount=studying?allowance(state):0;
 const finance={version:1,openedAt:state.age,available:amount,reserve:0,debt:0,budget:{...DEFAULT_BUDGET},housing:'family',receipts:[{id:'opening:'+state.age,age:state.age,kind:'opening',income:amount,expense:0,change:amount}],purchases:[]};
 const last=state.history?.at(-1);return {...state,finance,...(last&&last.age===state.age?{history:[...state.history.slice(0,-1),{...last,finance:{available:amount,reserve:0,debt:0,income:amount}}]}:{})};
}
export function setBudget(state,budget){return state.finance&&state.stage==='review'&&!state.story?.pending&&validBudget(budget)?{...state,finance:{...state.finance,budget:{...budget}}}:state;}
export function setHousing(state,housing){return state.finance&&state.stage==='review'&&!state.story?.pending&&state.age>=20&&Object.hasOwn(HOUSING,housing)&&housing!==state.finance.housing?{...state,finance:{...state.finance,housing,locationSince:state.age}}:state;}
export function setWorkplace(state,workplace){return state.finance&&state.stage==='review'&&!state.story?.pending&&state.age>=20&&Object.hasOwn(WORKPLACES,workplace)&&workplace!==(state.finance.workplace??'local')?{...state,finance:{...state.finance,workplace,locationSince:state.age}}:state;}
// Moving is recorded with an effective age, like housing and work; the region sets pay and living costs.
export const currentRegion=state=>state.finance?.region??regionIdFor(state.birth);
export function setRegion(state,id){return state.finance&&state.stage==='review'&&!state.story?.pending&&state.age>=20&&MOVE_TARGETS.includes(id)&&id!==currentRegion(state)?{...state,finance:{...state.finance,region:id,regionSince:state.age}}:state;}
export function monthlyFlow(state,row){
 const studying=state.age<20&&row?.pathway==='school'||row?.pathway==='college'&&state.age<25;
 const baseIncome=studying?allowance(state):state.age<20?(row?.pathway==='vocational'?5000:2500):Math.max(0,Math.round(row?.earnings??grossMonthlyPay(state)*(state.age>=60?1:({school:0,college:0,vocational:.6,independent:.2,work:1}[row?.pathway]??1))));
 const away=currentRegion(state)!==regionIdFor(state.birth),home=HOUSING[away&&(state.finance?.housing??'family')==='family'?'far':state.finance?.housing??'family'];
 const workplace=state.finance?.workplace??'local',housing=away&&(state.finance?.housing??'family')==='family'?'far':state.finance?.housing??'family';
 const cityTravel=workplace==='city'&&housing!=='near'&&state.age>=20&&!studying&&state.age<60;
 const place=REGIONS[currentRegion(state)],adultCosts=!studying&&state.age>=20;
 const income=Math.round(baseIncome*(!studying&&state.age>=20&&state.age<60?(WORKPLACES[workplace]?.payFactor??1)*place.pay:1));
 const studentHome=studying&&state.age>=20&&housing!=='family',studentCity=studentHome&&housing==='near'&&workplace==='city';
 const k=adultCosts?place.cost:1;
 return {income,rent:Math.round((studying&&housing==='family'?0:home.rent)*k),transport:Math.round((studying&&housing==='family'?0:home.transport+((cityTravel||studentCity)?CITY_TRAVEL.expense:0))*k),essential:Math.round((studying?Math.round(allowance(state)*.7)+(studentHome?home.rent+home.transport+(studentCity?CITY_TRAVEL.expense:0):0):state.age<20?1200:9000+home.rent+home.transport+(cityTravel?CITY_TRAVEL.expense:0))*k),commute:studying?(studentHome?(studentCity?80:home.minutes):30):home.minutes+(cityTravel?CITY_TRAVEL.minutes:0),source:studying?'Family allowance':state.age>=60?'Retirement income':'Work income'};
}
export function advanceFinance(before,next){
 if(next.age<=before.age)return next;
 if(before.age<15)return next.age===15?openFinance(next):next;
 const source=openFinance(before);let f=source.finance;if(!f)return next;const marked=before.economy?markHoldings(f,before.economy,before.age,next.age):f;if(!marked)return before;f=marked;
 const id='period:'+before.age+'-'+next.age;if(f.receipts.some(r=>r.id===id))return next;
 const row=next.history.at(-1),flow=monthlyFlow(source,row),months=(next.age-before.age)*12;
 const opening=f.receipts.find(r=>r.kind==='opening'&&r.age===before.age)?.income??0;
 // Opening support already covered one month under family care. A changed route starts next month.
 const remainingMonths=months-(opening>0?1:0),adjustment=row.pathwayCash??0,shock=row.setback??0,habits=row.habits??0;
 const economic=before.economy?periodEconomy(before.economy,before.age,next.age):{rows:[],contractions:[],meanWageFactor:1};
 const incomeAdjustment=flow.source==='Work income'?Math.round(flow.income*remainingMonths*(economic.meanWageFactor-1)):0;
 const income=flow.income*remainingMonths+incomeAdjustment+Math.max(0,adjustment)+Math.max(0,-shock),essential=flow.essential*remainingMonths+Math.max(0,-adjustment)+Math.max(0,shock)+habits;
 let available=f.available,reserve=f.reserve,debt=f.debt,free=income-essential;
 if(free<0){let need=-free;const wallet=Math.min(available,need);available-=wallet;need-=wallet;const buffer=Math.min(reserve,need);reserve-=buffer;need-=buffer;debt+=need;free=0;}
 else{const repaid=Math.min(debt,free);debt-=repaid;free-=repaid;}
 const fun=Math.floor(free*f.budget.fun/100),learn=Math.floor(free*f.budget.learn/100),saved=Math.floor(free*f.budget.save/100);
 // The spendable remainder pays for everyday living; a small part is left over. What you
 // choose to save is what builds a runway (authored tuning, not a household survey).
 const remainder=free-fun-learn-saved,lifestyle=Math.floor(remainder*.85);
 reserve+=saved;available+=remainder-lifestyle;
 const focus=(before.effort.iq+before.effort.craft)/10,travel=Math.max(.4,1-flow.commute/240);
 const learning=Math.min(6,Math.floor(learn/3000*focus*travel));
 const delta=Math.min(2,fun/Math.max(1,months)/500)-(debt>0?2:0);
 const wellbeing=cap(next.wellbeing+delta),skills={...next.skills,iq:next.skills.iq+learning};
 const since=f.locationSince??(before.age>=20?before.age:undefined),locationRecord=since===undefined?{}:{locationSince:since};
 if(f.region)Object.assign(locationRecord,{region:f.region,regionSince:f.regionSince??20});
 const finance={...f,...locationRecord,available,reserve,debt,receipts:[...f.receipts,{id,age:next.age,kind:'period',months,income,essential,fun,learn,lifestyle,saved,expense:essential+fun+learn+lifestyle,change:income-essential-fun-learn-lifestyle,source:flow.source,incomeAdjustment,housing:f.housing,workplace:f.workplace??'local',...locationRecord}]};
 const snapshot={available,reserve,debt,income,essential,fun,learn,lifestyle,months,source:flow.source,incomeAdjustment,housing:f.housing,workplace:f.workplace??'local',...locationRecord};
 if(![available,reserve,debt,income,essential].every(integer)||!Number.isSafeInteger(netWorth(finance)))return before;
 return {...next,finance,wellbeing,skills,history:[...next.history.slice(0,-1),{...row,wellbeing,finance:{...snapshot,...(f.holdings?{holdings:structuredClone(f.holdings),realizedGain:f.realizedGain??0}:{})},...(before.economy?{economy:{from:before.age,to:next.age,incomeAdjustment,contractions:economic.contractions.map(r=>r.age),marketChange:f.receipts.filter(r=>r.kind==='market'&&r.age>before.age&&r.age<=next.age).reduce((n,r)=>n+r.change,0)}}:{}),financeSkills:{iq:learning}}]};
}
export function buy(state,key){
 const item=PURCHASES[key],f=state.finance;if(!item||!f||state.stage!=='review'||state.story?.pending||f.available<item.cost)return state;
 if(f.purchases.some(p=>p.age===state.age&&p.key===key))return state;
 const hours=f.purchases.filter(p=>p.age===state.age).reduce((n,p)=>n+PURCHASES[p.key].hours,0);if(hours+item.hours>8)return state;
 const purchase={key,age:state.age,cost:item.cost,hours:item.hours},finance={...f,available:f.available-item.cost,purchases:[...f.purchases,purchase],receipts:[...f.receipts,{id:'purchase:'+state.age+':'+key,age:state.age,kind:'purchase',income:0,expense:item.cost,change:-item.cost}]};
 const skills={...state.skills};for(const[k,value]of Object.entries(item.skills))skills[k]+=value;
 const wellbeing=cap(state.wellbeing+item.wellbeing),row=state.history.at(-1),financeSkills={...row.financeSkills};for(const[k,value]of Object.entries(item.skills))financeSkills[k]=(financeSkills[k]??0)+value;
 return {...state,finance,skills,wellbeing,history:[...state.history.slice(0,-1),{...row,wellbeing,finance:{...(row.finance??{}),available:finance.available,reserve:finance.reserve,debt:finance.debt},financeSkills}]};
}
export function moveReserve(state,amount){
 const f=state.finance;if(!f||state.stage!=='review'||state.story?.pending||!integer(amount)||amount===0||amount>f.reserve)return state;
 const finance={...f,available:f.available+amount,reserve:f.reserve-amount},last=state.history.at(-1);return {...state,finance,history:[...state.history.slice(0,-1),{...last,finance:{...(last.finance??{}),available:finance.available,reserve:finance.reserve,debt:finance.debt}}]};
}
export function validFinance(f,age,world){
 if(f===undefined)return true;
 if(!f||!validHoldings(f.holdings)||!Number.isSafeInteger(netWorth(f))||!validInvestmentLedger(f,age,world)||!validFinanceLocation(f,age)||!Array.isArray(f.receipts)||f.receipts.some(r=>!r||!validFinanceLocation(r,r.age)))return false;
 return !!f&&f.version===1&&integer(f.openedAt)&&f.openedAt>=15&&f.openedAt<=age&&['available','reserve','debt'].every(k=>integer(f[k]))&&validBudget(f.budget)&&Object.hasOwn(HOUSING,f.housing)&&Array.isArray(f.receipts)&&f.receipts.length<=1000&&f.receipts.every(r=>r&&typeof r.id==='string'&&integer(r.age)&&r.age>=f.openedAt&&r.age<=age&&['opening','period','purchase','encounter','trade','market'].includes(r.kind)&&integer(r.income)&&integer(r.expense)&&Number.isSafeInteger(r.change)&&r.change===r.income-r.expense)&&new Set(f.receipts.map(r=>r.id)).size===f.receipts.length&&Array.isArray(f.purchases)&&f.purchases.length<=100&&f.purchases.every(p=>p&&Object.hasOwn(PURCHASES,p.key)&&integer(p.age)&&p.age>=f.openedAt&&p.age<=age&&p.cost===PURCHASES[p.key].cost&&p.hours===PURCHASES[p.key].hours)&&new Set(f.purchases.map(p=>p.age+':'+p.key)).size===f.purchases.length&&f.receipts.reduce((sum,r)=>sum+r.change,0)===netWorth(f)&&f.receipts.filter(r=>r.kind==='purchase').length===f.purchases.length&&f.purchases.every(p=>f.receipts.some(r=>r.id==='purchase:'+p.age+':'+p.key&&r.age===p.age&&r.kind==='purchase'&&r.income===0&&r.expense===p.cost&&r.change===-p.cost))&&[...new Set(f.purchases.map(p=>p.age))].every(age=>f.purchases.filter(p=>p.age===age).reduce((sum,p)=>sum+p.hours,0)<=8);
}
export function grossMonthlyPay(s){const e=s.effort;return s.age<20?0:s.age>=60?Math.max(3000,Math.round(grossMonthlyPay({...s,age:59})*.4)):careerFactor(s)*(12000+e.drive*2000+e.iq*1100+s.attributes.iq*500+e.craft*1000+e.physique*900+Math.min(6000,(s.skills.iq*70+s.skills.craft*60+s.skills.eq*45+s.skills.physique*50)));}
export function choiceAvailable(state,choice){return !state.finance||Math.max(0,-(choice.cash??0))<=state.finance.available+state.finance.reserve;}
export function personalFlow(state,id,income,expense){
 const f=state.finance;if(!f||!integer(income)||!integer(expense)||expense>f.available+f.reserve||f.receipts.some(r=>r.id===id))return state;
 const wallet=Math.min(f.available,expense),finance={...f,available:f.available-wallet+income,reserve:f.reserve-(expense-wallet),receipts:[...f.receipts,{id,age:state.age,kind:'encounter',income,expense,change:income-expense}]};return {...state,finance};
}
