// One bar instead of two: who and when, the transport, the real economy of this year, its news.
import {WORLD_YEARS,worldAt} from './world-series.js';
import {HEADLINES} from './world-headlines.js';
import {climateLines} from './world-voice.js';
import {t} from './i18n.js';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const GAUGES=[['lending','Loans','%',v=>v.toFixed(1)],['inflation','Prices','%',v=>(v>0?'+':'')+v.toFixed(1)],['growth','GDP','%',v=>(v>0?'+':'')+v.toFixed(1)],['set','SET','',v=>Math.round(v).toLocaleString('en')],['baht','฿/$','',v=>v.toFixed(1)]];
function spark(key,year){const ys=WORLD_YEARS.filter(y=>y<=year&&y>year-16&&worldAt(y)?.[key]!=null),vals=ys.map(y=>worldAt(y)[key]);if(vals.length<3)return null;const lo=Math.min(...vals),hi=Math.max(...vals),NS='http://www.w3.org/2000/svg',s=document.createElementNS(NS,'svg'),p=document.createElementNS(NS,'polyline');s.setAttribute('viewBox','0 0 48 14');s.setAttribute('class','gauge-spark');s.setAttribute('aria-hidden','true');p.setAttribute('points',vals.map((v,i)=>`${(i/(vals.length-1)*46+1).toFixed(1)},${(13-(hi===lo?.5:(v-lo)/(hi-lo))*12).toFixed(1)}`).join(' '));p.setAttribute('fill','none');p.setAttribute('stroke','currentColor');p.setAttribute('stroke-width','1.4');p.setAttribute('vector-effect','non-scaling-stroke');s.append(p);return s;}
export function initTopConsole({openWorld}){
 const header=document.querySelector('body>header'),head=document.querySelector('.world-head'),brand=header.querySelector('a'),tools=header.querySelector('div'),who=head.firstElementChild,transport=document.getElementById('transport');
 const bar=el('div','top-console'),main=el('div','top-main'),world=el('button','top-world');world.type='button';world.setAttribute('aria-label','The year around you');const gauges=el('span','top-gauges'),news=el('span','top-news');world.append(gauges,news);world.onclick=openWorld;
 who.classList.add('top-who');main.append(who,transport);bar.append(brand,main,world,tools);header.append(bar);head.hidden=true;document.body.classList.add('has-top-console');
 const setHeight=()=>document.documentElement.style.setProperty('--life-header-height',header.offsetHeight+'px');new ResizeObserver(setHeight).observe(header);setHeight();
 let last=null;
 return {update(year){const key=year===null?'none':year+'|'+document.documentElement.lang;if(key===last)return;last=key;const w=year===null?null:worldAt(year);world.hidden=!w;if(!w)return;gauges.replaceChildren(...GAUGES.filter(([k])=>w[k]!=null).map(([k,label,unit,f])=>{const g=el('span','gauge');g.append(el('span','gauge-label',t(label)),el('b','gauge-value',f(w[k])+unit));const sp=spark(k,year);if(sp)g.append(sp);return g;}));const lines=[...(HEADLINES[year]??[]).map(x=>t(x)),...climateLines(year)];news.textContent=lines[0]??'';news.title=lines.join(' · ');}};
}
