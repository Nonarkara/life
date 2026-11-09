// The Research tab: what the sources say happened, and how life felt, year by year.
// Loaded when opened, so the bank never weighs on the game's first paint.
import {t,preferences} from './i18n.js';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const ERAS=[['early','Before 1855',-Infinity,1854],['trade','1855 to 1931',1855,1931],['generals','1932 to 1957',1932,1957],['boom','1958 to 1996',1958,1996],['now','1997 onward',1997,Infinity]];
const KINDS=[['all','All'],['event','Events'],['moment','Turning points'],['life','Daily life']];
const kindOf=e=>e.kind==='texture'||e.kind==='situation'?'life':e.kind;
const eraFor=y=>ERAS.find(([,,a,b])=>y>=a&&y<=b)?.[0]??'boom';
const yr=y=>y<0?Math.abs(y).toLocaleString('en')+' BCE':String(y),when=e=>e.from===e.to?yr(e.from):yr(e.from)+'–'+yr(e.to);
// A life's own years come first; the search looks across everything.
export function renderResearch(root,getYear){
 let bank=null,era=null,kind='all',query='',lastLang=null,hint=null;
 root.classList.add('research');
 const head=el('div','research-head'),title=el('h2',undefined,'Research'),note=el('p','research-note','What seven books and a World Bank table say happened in Thailand. Novels are marked: they show how life felt, not what occurred.');
 const search=el('input','research-search');search.type='search';search.id='research-search';search.setAttribute('aria-label','Search the history');search.placeholder='Search';
 const eras=el('div','research-filter'),kinds=el('div','research-filter'),count=el('p','research-count'),list=el('ol','research-list');
 head.append(title,note,search,eras,kinds,count);root.append(head,list);
 const btn=(parent,label,on,fn)=>{const b=el('button','research-chip',label);b.type='button';b.setAttribute('aria-pressed',on?'true':'false');b.onclick=fn;parent.append(b);};
 function draw(){
  if(!bank)return;const q=query.trim().toLowerCase(),lang=preferences.language;
  eras.replaceChildren();kinds.replaceChildren();
  for(const[id,label]of ERAS)btn(eras,label,era===id,()=>{era=era===id?null:id;draw();});
  for(const[id,label]of KINDS)btn(kinds,label,kind===id,()=>{kind=id;draw();});
  const rows=bank.filter(e=>{const[,,a,b]=ERAS.find(x=>x[0]===era)??[,,-Infinity,Infinity];return (q||(e.to>=a&&e.from<=b))&&(kind==='all'||kindOf(e)===kind)&&(!q||[e.title,e.summary,e.th?.[0],e.th?.[1],e.place,e.who].some(v=>v?.toLowerCase().includes(q)));});
  count.textContent=t('{n} entries').replace('{n}',rows.length);
  list.replaceChildren(...rows.map(e=>{const li=el('li','research-item'),th=lang==='th'&&e.th,when_=el('span','research-when',when(e)),body=el('div');body.append(el('h3','research-title',th?e.th[0]:e.title),el('p','research-summary',th?e.th[1]:e.summary));const src=el('p','research-source',e.source.book+', p. '+e.source.page+(e.kind==='texture'?' · '+t('fiction'):''));body.append(src);li.append(when_,body);return li;}));
  lastLang=lang;
 }
 search.oninput=()=>{query=search.value;draw();};
 return {show(){if(!bank){list.replaceChildren(el('li','research-note','Loading…'));import('./thai-history-bank.js').then(m=>{bank=[...m.HISTORY_BANK].sort((a,b)=>a.from-b.from||a.to-b.to);const y=getYear();era=y===null?null:eraFor(y);draw();});return;}const y=getYear();if(y!==null&&hint===null){hint=y;}if(preferences.language!==lastLang)draw();}};
}
