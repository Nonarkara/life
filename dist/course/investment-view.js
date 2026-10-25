import {ASSETS,holdingsOf,holdingsValue,trade,tradeFee} from './investments.js';
export const INVESTMENT_COPY=[
 'Investments','Fund','Value','Cost basis','Unrealized: {value}','Realized after fees: {value}',
 'No investments yet. Buying a fund moves spendable cash into a holding; it does not create wealth.',
 'Fund value to trade · ฿','Buy','Sell','Fee: {value} per trade.','Buy needs {cost}; sell returns {proceeds}.',
 'Enter a positive whole-baht amount.','Resolve the current moment before trading.',
 'Money controls reopen at your next review.','Not enough cash to buy, or holdings to sell this amount.',
 'Trading is closed for this life.','Bought {value}; fee {fee}.','Sold {value}; realized result {gain}.',
 'Trade could not be completed. Check the amount and available funds.','What these funds mean',
 'Cost basis includes buy fees. Value minus cost basis is an unrealized gain or loss. Selling releases part of that basis.',
 'These are fictional fund accounts. Annual returns are authored scenarios, not historical fund performance or a forecast.',
 'Both funds can lose value. Each trade costs 0.5%, rounded to whole game baht with a ฿1 minimum. Purchases use cash; trading creates no new debt.',
 'Cash pays bills immediately. Investments are sold only when you choose; a portfolio can rise while your cash runs out.',
 'Trade record','Bought','Sold','Market change','Cash share of assets'
];
const money=n=>(n<0?'−':'')+'฿'+Math.abs(Math.round(n)).toLocaleString('en');
export function renderInvestments(root,s,{getState,change,draft,locked=false}){
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
 const f=s.finance,holdings=holdingsOf(f),section=el('section',undefined,'investments');section.setAttribute('aria-label','Investments');
 if(holdingsValue(f)>0){const cash=f.available+f.reserve,total=cash+holdingsValue(f),share=Math.round(100*cash/total),readout=el('div',undefined,'liquidity-readout'),label=el('div'),bar=el('div',undefined,'liquidity-bar'),fill=el('i');label.append(el('span','Cash share of assets'),el('strong',share+'%'));bar.setAttribute('role','img');bar.setAttribute('aria-label','Cash share of assets'+': '+share+'%');fill.style.width=share+'%';bar.append(fill);readout.append(label,bar);section.append(readout);}
 const table=el('table',undefined,'investment-table'),head=el('thead'),hr=el('tr');
 for(const title of ['Fund','Value','Cost basis']){const th=el('th',title);th.scope='col';hr.append(th);}head.append(hr);table.append(head);
 const body=el('tbody');for(const [key,asset]of Object.entries(ASSETS)){
  const row=el('tr'),name=el('th',asset.label);name.scope='row';name.className='fund-'+key;
  name.append(el('small','Unrealized: '+money(holdings[key].value-holdings[key].basis)));
  row.append(name,el('td',money(holdings[key].value)),el('td',money(holdings[key].basis)));body.append(row);
 }table.append(body);section.append(table);
 if(!holdingsValue(f))section.append(el('p','No investments yet. Buying a fund moves spendable cash into a holding; it does not create wealth.','console-note'));
 section.append(el('p','Realized after fees: '+money(f.realizedGain??0),'console-note'));
 const form=el('div',undefined,'investment-order'),assetLabel=el('label','Fund'),assetSelect=el('select');assetSelect.id='investment-asset';assetLabel.htmlFor=assetSelect.id;
 for(const[key,asset]of Object.entries(ASSETS)){const o=el('option',asset.label);o.value=key;assetSelect.append(o);}assetSelect.value=draft.asset;
 const amountLabel=el('label','Fund value to trade · ฿'),amount=el('input');amount.id='investment-amount';amountLabel.htmlFor=amount.id;amount.type='number';amount.min='1';amount.step='1';amount.inputMode='numeric';amount.value=draft.amount;
 const actions=el('div',undefined,'investment-actions'),buy=el('button','Buy'),sell=el('button','Sell');buy.type=sell.type='button';buy.id='investment-buy';sell.id='investment-sell';actions.append(buy,sell);
 const preview=el('p',undefined,'console-note'),feeLine=el('p',undefined,'console-note'),feedback=el('p',draft.notice??'','investment-feedback');feedback.setAttribute('role','status');
 function previewOrder(){
  const n=Number(amount.value),valid=Number.isSafeInteger(n)&&n>0,fee=tradeFee(n),live=getState(),account=live.finance,position=holdingsOf(account)[assetSelect.value];
  const blocked=locked||live.stage!=='review'||!!live.story?.pending||live.age<15||account.receipts.length>=900;
  buy.disabled=blocked||!valid||n+fee>account.available;sell.disabled=blocked||!valid||n>position.value||n<=fee;
  assetSelect.disabled=amount.disabled=blocked;
  feeLine.textContent=valid?'Fee: '+money(fee)+' per trade.':'';
  preview.textContent=!valid?'Enter a positive whole-baht amount.':live.story?.pending?'Resolve the current moment before trading.':locked?'':live.stage!=='review'?'Trading is closed for this life.':buy.disabled&&sell.disabled?'Not enough cash to buy, or holdings to sell this amount.':'Buy needs '+money(n+fee)+'; sell returns '+money(Math.max(0,n-fee))+'.';
 }
 amount.oninput=()=>{draft.amount=amount.value;previewOrder();};assetSelect.onchange=()=>{draft.asset=assetSelect.value;previewOrder();};
 for(const[button,side]of [[buy,'buy'],[sell,'sell']])button.onclick=()=>{
  const old=getState(),next=trade(old,assetSelect.value,side,Number(amount.value));
  if(next===old){feedback.textContent='Trade could not be completed. Check the amount and available funds.';return;}
  const r=next.finance.receipts.at(-1);draft.notice=side==='buy'?'Bought '+money(r.amount)+'; fee '+money(r.fee)+'.':'Sold '+money(r.amount)+'; realized result '+money(r.realizedGain)+'.';
  change(next);document.getElementById('investment-'+side)?.focus({preventScroll:true});
 };
 form.append(assetLabel,assetSelect,amountLabel,amount,actions,feeLine,preview,feedback);section.append(form);
 const lesson=el('details');lesson.append(el('summary','What these funds mean'));
 for(const text of INVESTMENT_COPY.slice(21,25))lesson.append(el('p',text));section.append(lesson);
 const records=f.receipts.filter(r=>r.kind==='trade'||r.kind==='market');if(records.length){
  const record=el('details'),list=el('ol',undefined,'investment-records');record.append(el('summary','Trade record'));
  for(const r of records.slice(-8).reverse()){
   const item=el('li');item.append(el('span','Age '+r.age));
   item.append(el('span',r.kind==='market'?'Market change':r.side==='buy'?'Bought':'Sold'));
   if(r.asset)item.append(el('span',ASSETS[r.asset].label));item.append(el('strong',money(r.kind==='market'?r.change:r.amount)));list.append(item);
  }record.append(list);section.append(record);
 }
 root.append(section);previewOrder();
}
