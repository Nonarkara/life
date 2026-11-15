// The year, where the plan is made: what the bank charges and pays this year, drawn against the
// fifteen years before it, the day's headline, and one sentence on what those rates will do to this
// person's own money. Real World Bank figures (world-series.js); a year without them shows no panel.
import {worldAt,realRate,WORLD_YEARS} from './world-series.js';
import {headlinesFor} from './world-headlines.js';
import {birthYearOf} from './thai-history.js';
import {bankYears,inThailand} from './finance.js';
const baht=n=>'฿'+Math.round(n).toLocaleString('en'),pct=v=>(v<0?'−':'')+Math.abs(v)+'%';
// What the coming five years will charge or pay on the balance as it stands: the same rule, the same
// rounding and the same balances finance.js uses when the years are lived, so the figure is exact.
export function moneyOutlook(s){
 const f=s.finance;if(!f||s.stage!=='review'||s.age>=80)return null;const bank=bankYears(s,s.age,s.age+5);
 const cost=Math.round(f.debt*bank.loan),earn=Math.round(f.reserve*bank.save);
 if(cost>0)return {kind:'debt',five:cost,real:bank.real};
 if(earn>0)return {kind:'save',five:earn,real:true};
 return null;
}
export function outlookLine(s,t=x=>x){
 const o=moneyOutlook(s);if(!o)return null;
 return t(o.kind==='save'?'Interest on what you set aside over these five years, after prices: {y}.':o.real?'Interest on your debt over these five years, after prices: {y}.':'Interest on your debt over these five years, at a flat 35%: {y}.').replace('{y}',baht(o.five));
}
// Up to sixteen years of one rate, after prices, ending this year; never a year that has not happened yet.
export const seriesTo=(key,year)=>WORLD_YEARS.filter(y=>y<=year&&y>year-16&&realRate(key,y)!==null).map(y=>({year:y,v:realRate(key,y)}));
// The Thai year is shown to a person living in Thailand. Abroad, the headline and the rates are not theirs.
export function yearFacts(s){
 const by=birthYearOf(s),year=by===null?null:by+s.age,w=year===null?null:worldAt(year);if(!w||s.age<15||!inThailand(s))return null;
 const loans=seriesTo('lending',year),savings=seriesTo('deposit',year);
 return {year,headline:headlinesFor(year)[0]??null,lending:realRate('lending',year),deposit:realRate('deposit',year),loans:loans.length>=3?loans:[],savings:savings.length>=3?savings:[]};
}
// A line is drawn only between neighbouring years: a year with no figure leaves a gap, not a bridge.
export const linePath=(rows,x,y)=>rows.map((r,i)=>(i&&rows[i-1].year===r.year-1?'L':'M')+x(r).toFixed(1)+' '+y(r).toFixed(1)).join(' ');
export function renderYearPanel(root,s,t=x=>x){
 const f=yearFacts(s),line=outlookLine(s,t),chart=!!f&&(f.loans.length>0||f.savings.length>0),el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 // A headline alone is already in the top bar: the panel needs a sentence or a chart to earn the space.
 root.replaceChildren();root.hidden=!line&&!chart;if(root.hidden)return;
 if(chart){
  const NS='http://www.w3.org/2000/svg',fig=el('figure','year-rates'),plot=el('div','year-plot'),svg=document.createElementNS(NS,'svg'),all=[...f.loans,...f.savings],hi=Math.max(1,...all.map(p=>p.v)),lo=Math.min(0,...all.map(p=>p.v)),y0=f.year-15,Y=v=>43-(v-lo)/(hi-lo)*41;
  svg.setAttribute('viewBox','0 0 150 44');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('role','img');svg.setAttribute('aria-label',t('Loan and savings rates after prices, the last fifteen years'));
  // The zero line sits where zero is: a rate below it lost to prices that year.
  {const z=document.createElementNS(NS,'path');z.setAttribute('class','year-zero');z.setAttribute('d','M0 '+Y(0).toFixed(1)+' L150 '+Y(0).toFixed(1));z.setAttribute('fill','none');z.setAttribute('vector-effect','non-scaling-stroke');svg.append(z);}
  for(const [rows,cls] of [[f.loans,'year-loans'],[f.savings,'year-savings']]){if(!rows.length)continue;const p=document.createElementNS(NS,'path');p.setAttribute('class',cls);p.setAttribute('d',linePath(rows,r=>(r.year-y0)/15*148+1,r=>Y(r.v)));p.setAttribute('fill','none');p.setAttribute('vector-effect','non-scaling-stroke');svg.append(p);}
  const span=el('div','year-span');span.append(el('span',undefined,String(y0)),el('span',undefined,String(f.year)));plot.append(svg,span);
  const key=el('figcaption','year-key');key.append(el('span','year-note',t('After prices')));
  if(f.lending!=null&&f.loans.length){const k=el('span','year-k year-k-loans');k.append(el('span',undefined,t('Loans')),el('b',undefined,pct(f.lending)));key.append(k);}
  if(f.deposit!=null&&f.savings.length){const k=el('span','year-k year-k-savings');k.append(el('span',undefined,t('Savings')),el('b',undefined,pct(f.deposit)));key.append(k);}
  fig.append(plot,key);root.append(fig);
 }
 const text=el('div','year-text');
 if(f)text.append(el('p','year-head',[String(f.year),f.headline?t(f.headline):null].filter(Boolean).join(' · ')));
 if(line)text.append(el('p','year-line',line));
 root.append(text);
}
