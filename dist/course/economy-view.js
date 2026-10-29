import {GDP_OBSERVATIONS} from './economy-data.js';
import {economyFor,economyYears,periodEconomy} from './economy.js';
export const ECONOMY_COPY=[
 'Shared economy','Sampled GDP growth · % per year','Scenario years {from}–{to}',
 'The economy unfolds as you live. Future years are hidden.',
 'Historical GDP samples; fictional calendar. Wage effects and fund returns are game rules, not predictions.',
 'This saved life joins the economy at age {n}. Earlier records stay unchanged.',
 'Latest completed chapter','Work income effect: {value}','Held investments changed: {value}',
 'Annual scenario record','Age','Historical sample','GDP growth','Bond fund return','Equity fund return',
 'Contraction years: {n}','A historical parallel','About this economy',
 'In 1997, short-term foreign borrowing, long investments and currency exposure made Thailand vulnerable. A cash cushion and manageable obligations create options, but do not guarantee protection.',
 'A GDP contraction is not the same as a banking crisis. This scenario samples recorded growth and keeps contraction spells together; it does not schedule a crisis every few years.',
 'Growth observations: Thailand, World Bank, 1961–2025. The 1997–98 contraction is one spell. Fund returns are separately authored; GDP is not a stock-market return.',
 'Your investments are valued only after you own them. Cash can pay an unexpected bill without selling a fund. Losses, fees, missed income and starting conditions still matter.',
 'World Bank · GDP growth','Bank of Thailand · 1997 crisis','SEC · Asset allocation',
 'The sampler favors some years and crisis starts. Its crisis frequency is not the frequency measured in Thailand.',
 'Economic record begins at age {n}.','Historical GDP · game fund returns',
 'In 2009, the global recession hit Thai exports. Stronger bank starting positions helped the financial system, but did not protect every household.',
 'In 2020, the pandemic disrupted tourism, exports and work. Financial cushions gave some people options; they did not replace lost jobs or public support.',
 'IMF · 2009 assessment','World Bank · 2020 shock',
 'Source: {n} annual observations; {count} contraction spells. This does not establish a cycle.'
];
export function historicalParallel(rows){const worst=rows.filter(r=>r.growth<0).sort((a,b)=>a.growth-b.growth)[0];if(!worst)return null;const year=worst.sourceYear;if(year===1997||year===1998)return {text:ECONOMY_COPY[18],label:'Bank of Thailand · 1997 crisis',href:'https://www.bot.or.th/en/our-roles/special-measures/Tom-Yum-Kung-lesson.html'};if(year===2009)return {text:ECONOMY_COPY[28],label:'IMF · 2009 assessment',href:'https://www.elibrary.imf.org/view/journals/002/2009/261/article-A004-en.xml'};if(year===2020)return {text:ECONOMY_COPY[29],label:'World Bank · 2020 shock',href:'https://www.worldbank.org/en/country/thailand/publication/thailand-economic-monitor-june-2020-thailand-in-the-time-of-covid-19'};return null;}
const NS='http://www.w3.org/2000/svg',money=n=>(n<0?'−':'+')+'฿'+Math.abs(Math.round(n)).toLocaleString('en');
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const svg=(tag,attrs,text)=>{const node=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))node.setAttribute(k,v);if(text!==undefined)node.textContent=text;return node;};
// The chart of the years: one line, one zero, contraction years marked.
function growthChart(rows){
 const figure=el('figure'),caption=el('figcaption','Sampled GDP growth · % per year'),chart=document.createElementNS(NS,'svg');
 chart.classList.add('economy-chart');chart.setAttribute('viewBox','0 0 300 112');chart.setAttribute('role','img');chart.setAttribute('aria-label','Sampled GDP growth · % per year');
 const first=rows[0].age,last=rows.at(-1).age,min=Math.min(0,...rows.map(r=>r.growth)),max=Math.max(0,...rows.map(r=>r.growth)),span=max-min||1,x=a=>34+(a-first)/(last-first)*250,y=v=>86-(v-min)/span*58;
 chart.append(svg('line',{x1:34,x2:284,y1:y(0),y2:y(0),stroke:'#b4b9a9'}));
 // The zero line is the reference the metres are measured from, so it is always
 // labelled. A bound that would print on top of another number is left out.
 const marks=[0,...[min,max].filter(n=>n!==0&&Math.abs(y(n)-y(0))>11)];
 for(const n of new Set(marks))chart.append(svg('text',{x:29,y:y(n)+4,'text-anchor':'end'},n.toFixed(1)));
 chart.append(svg('polyline',{points:rows.map(r=>x(r.age)+','+y(r.growth)).join(' '),fill:'none',stroke:'#526b60','stroke-width':2}));
 for(const row of rows)chart.append(svg('circle',{cx:x(row.age),cy:y(row.growth),r:row.growth<0?3.2:1.7,fill:row.growth<0?'#a32750':'#526b60'}));
 for(const n of [...new Set([first,Math.round((first+last)/2),last])])chart.append(svg('text',{x:x(n),y:104,'text-anchor':'middle'},n));
 chart.append(svg('text',{x:29,y:104,'text-anchor':'end'},'Age'));figure.append(caption,chart);return figure;
}
// The band that always shows the year around you: the chart, three full-width
// meters measured from a centre line, and what the year did to this life.
export function renderWorldNow(root,s){
 root.replaceChildren();
 const world=economyFor(s),rows=economyYears(world,s.age),last=rows.at(-1);
 const head=el('div',undefined,'world-now-head');
 head.append(el('h2','The year around you'));
 head.append(el('p',last?`Scenario year ${last.year} · age ${last.age}`:'The economy unfolds as you live. Future years are hidden.','world-now-note'));
 root.append(head);
 if(!last)return;
 if(rows.length>1)root.append(growthChart(rows));
 const metrics=[['GDP growth',last.growth],['Bond fund return',last.bond*100],['Equity fund return',last.equity*100]];
 const scale=Math.max(5,...metrics.map(m=>Math.abs(m[1])));
 const meters=el('div',undefined,'world-meters');
 for(const[label,value]of metrics){
  const row=el('div',undefined,'world-meter');
  const line=el('div',undefined,'world-meter-line');
  line.append(el('span',label),el('b',(value>=0?'+':'−')+Math.abs(value).toFixed(1)+' %'));
  const track=el('span',undefined,'world-meter-track'),fill=el('i',undefined,value<0?'negative':'');
  fill.style.width=(Math.abs(value)/scale*50)+'%';
  if(value<0)fill.style.right='50%';else fill.style.left='50%';
  track.append(fill);row.append(line,track);meters.append(row);
 }
 root.append(meters,el('p','Each bar runs from the centre line; the widest bar on this scale is ±'+scale.toFixed(0)+' %.','world-now-note'));
 const chapter=s.history.at(-1)?.economy;
 if(chapter){const group=el('section',undefined,'economy-exposure');group.append(el('h3','Latest completed chapter'),el('p','Totals for ages '+chapter.from+'–'+chapter.to,'world-now-note'),el('p','Work income effect: '+money(chapter.incomeAdjustment)),el('p','Your holdings changed: '+money(chapter.marketChange)),el('p','Contraction years in that chapter: '+chapter.contractions.length));root.append(group);}
}
export function renderEconomy(root,s){
 const world=economyFor(s),rows=economyYears(world,s.age),section=el('section',undefined,'economy-view');section.setAttribute('aria-label','Shared economy');
 section.append(el('h2','Shared economy'));
 if(!s.economy||world.activeFrom>0)section.append(el('p','Economic record begins at age '+world.activeFrom+'.','console-note'));
 if(rows.length<2)section.append(el('p','The economy unfolds as you live. Future years are hidden.','console-note'));
 section.append(el('p','Historical GDP · game fund returns','console-note'));
 const details=el('details');details.append(el('summary','Annual scenario record'));const list=el('ol',undefined,'economy-years');
 for(const r of rows.slice().reverse()){
  const item=el('li'),head=el('strong','Age '+r.age),facts=el('dl');head.append(el('small','Historical sample'+': '+r.sourceYear));item.append(head);
  for(const[key,value]of [['GDP growth',r.growth],['Bond fund return',r.bond*100],['Equity fund return',r.equity*100]])facts.append(el('dt',key),el('dd',(value>=0?'+':'')+value.toFixed(1)+'%'));
  item.append(facts);list.append(item);
 }details.append(list);section.append(details);
 const last=s.history.at(-1);const recent=last?.from!==undefined?periodEconomy(world,last.from,last.age).contractions:[];
 const parallel=historicalParallel(recent.length?recent:rows);if(parallel){const fact=el('details');fact.open=recent.length>0;fact.append(el('summary','A historical parallel'),el('p',parallel.text));const a=el('a',parallel.label);a.href=parallel.href;a.target='_blank';a.rel='noopener';fact.append(a);section.append(fact);}
 const method=el('details');method.append(el('summary','About this economy'));const spells=GDP_OBSERVATIONS.filter((r,i)=>r.growth<0&&(i===0||GDP_OBSERVATIONS[i-1].growth>=0)).length;method.append(el('p','Source: '+GDP_OBSERVATIONS.length+' annual observations; '+spells+' contraction spells. This does not establish a cycle.'));if(world.activeFrom>0)method.append(el('p','This saved life joins the economy at age '+world.activeFrom+'. Earlier records stay unchanged.'));for(const text of [...ECONOMY_COPY.slice(19,22),ECONOMY_COPY[25],ECONOMY_COPY[4]])method.append(el('p',text));
 method.append(el('p','Lesson reference funds start half in each scenario fund and are held without fees or new contributions. They describe a price path, not your personal return.'));
 for(const[text,url]of [['World Bank · GDP growth','https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG?locations=TH'],['SEC · Asset allocation','https://www.investor.gov/introduction-investing/getting-started/asset-allocation']]){const a=el('a',text);a.href=url;a.target='_blank';a.rel='noopener';method.append(a);}section.append(method);root.append(section);
}
