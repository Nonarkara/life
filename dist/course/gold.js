// Gold by the baht-weight, as Thai families hold it. Price is world gold (annual average, US$/oz,
// public LBMA figures rounded and interpolated between the years below) at that year's baht rate,
// for the Thai standard 96.5% baht-weight. After 2024 it holds flat: the game does not forecast.
import {worldAt} from './world-series.js';
const USD=[[1949,35],[1970,36],[1975,161],[1980,612],[1985,317],[1990,383],[1995,384],[2000,279],[2005,444],[2010,1225],[2012,1669],[2015,1160],[2020,1770],[2024,2386]];
const usd=y=>{if(y<=USD[0][0])return USD[0][1];if(y>=USD.at(-1)[0])return USD.at(-1)[1];const i=USD.findIndex(p=>p[0]>y),[a,va]=USD[i-1],[b,vb]=USD[i];return va+(vb-va)*(y-a)/(b-a);};
const rate=y=>worldAt(Math.min(y,2025))?.baht??20.8;
export const goldPrice=year=>Math.round(usd(year)*.473*rate(year));
export const GOLD_PCTS=[0,10,20,30];
export const goldValue=(f,year)=>Math.round((f?.goldWeight??0)*goldPrice(year));
export const setGoldPct=(s,p)=>s.finance&&s.age>=20&&s.stage==='review'&&GOLD_PCTS.includes(p)?{...s,finance:{...s.finance,goldPct:p}}:s;
export function goldStep(state,year){
 const f=state.finance,pct=f?.goldPct??0,row=state.history?.at(-1)?.finance;if(!pct||!row||state.stage!=='review')return state;
 const spend=Math.min(f.available,Math.round((row.income??0)*(row.months??60)*pct/100));if(spend<=0)return state;
 const mid=goldPrice(year-2),id='gold:'+state.age;
 return {...state,finance:{...f,available:f.available-spend,goldWeight:(f.goldWeight??0)+spend/mid,receipts:[...f.receipts,{id,age:state.age,kind:'bucket',income:0,expense:spend,change:-spend}]}};
}
