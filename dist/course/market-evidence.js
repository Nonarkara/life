import {periodEconomy} from './economy.js';
export function experiencedFundLoss(state){
 const row=state.history?.at(-1);
 return Object.values(state.finance?.holdings??{}).some(h=>h.value>0)&&Number.isSafeInteger(row?.economy?.marketChange)&&row.economy.marketChange<0;
}
// A reference basket, not the player's actual return: half in each existing
// scenario fund at the start, held without fees or further contributions.
export function referenceFundChange(state,from,to){
 if(!state.economy||state.economy.activeFrom>from)return null;
 const rows=periodEconomy(state.economy,from,to).rows;if(rows.length!==to-from)return null;
 const growth=asset=>rows.reduce((value,row)=>value*(1+row[asset]),1);
 return (growth('bond')+growth('equity'))/2-1;
}
export const MARKET_COPY={
 rise:'Over the next five years, the scenario reference funds rose. Your own holdings, trades and fees determine what you kept.',
 fall:'Over the next five years, the scenario reference funds fell. Holding through this period did not guarantee recovery.',
 flat:'Over the next five years, the scenario reference funds ended close to where they began. Your own holdings, trades and fees still mattered.',
 absent:'No comparable fund-price record is available for this interval.',
 soldRise:'After you sold, the scenario reference funds rose over the next five years. Cash kept liquidity, while you no longer had that market exposure.',
 soldFall:'After you sold, the scenario reference funds fell over the next five years. Selling limited further market exposure; the sale and fees remain in your ledger.',
 soldFlat:'After you sold, the scenario reference funds ended close to where they began. Cash kept liquidity; the sale and fees remain in your ledger.'
};
export function marketFollowup(state,to){
 const decision=state.story?.seen?.find(e=>e.id==='m_crash');if(!decision)return MARKET_COPY.absent;
 const change=referenceFundChange(state,decision.age,to);if(change===null)return MARKET_COPY.absent;
 const direction=change>1e-8?'Rise':change< -1e-8?'Fall':'Flat';
 return MARKET_COPY[decision.choice==='sell'?'sold'+direction:direction.toLowerCase()];
}

// Reconstruct exposure immediately before the recorded choice, even if the
// choice itself sold everything. Ledger validity is checked by finance.js.
export function recordedFundLoss(state,age){
 const row=state.history?.find(r=>r.age===age),receipts=state.finance?.receipts??[];
 const end=receipts.findIndex(r=>r.id===`encounter:${age}:m_crash`);if(end<0||!(row?.economy?.marketChange<0))return false;
 const held={bond:0,equity:0};
 for(const r of receipts.slice(0,end)){
  if(r.kind==='trade'&&Object.hasOwn(held,r.asset))held[r.asset]+=r.side==='buy'?r.amount:-r.amount;
  if(r.kind==='market')for(const asset of Object.keys(held))held[asset]+=r.deltas?.[asset]??0;
 }
 return held.bond+held.equity>0;
}
export const legacyMarketPrompt=state=>state.story?.flags?.invests!==undefined&&(state.history?.at(-1)?.economy?.contractions?.length??0)>0;
export function refreshMarketPrompt(state){
 if(state.story?.pending?.id!=='m_crash'||experiencedFundLoss(state))return state;
 return {...state,story:{...state.story,pending:null}};
}
