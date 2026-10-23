import {rememberedMoments} from './recap.js';
const NS='http://www.w3.org/2000/svg';let resizeObserver;
const metric=[['health','Physical health','#192e2c'],['wellbeing','Wellbeing','#a35d00'],['cash','Household buffer','#a32750']];
const money=n=>'฿'+Math.round(n).toLocaleString('en');
export function growthWindows(history){
 const periods=history.slice(1).map((row,i)=>({from:history[i].age,to:row.age,cash:row.cash-history[i].cash,health:row.health-history[i].health,wellbeing:row.wellbeing-history[i].wellbeing,rate:(row.cash-history[i].cash)/(row.age-history[i].age)})).filter(r=>Number.isFinite(r.rate));
 const fastest=periods.filter(r=>r.cash>0).sort((a,b)=>b.rate-a.rate||a.from-b.from)[0]??null;
 return {fastest,slowed:fastest?periods.find(r=>r.from===fastest.to&&r.rate<fastest.rate)??null:null};
}
export function renderEnding(root,state){
 resizeObserver?.disconnect();const rows=state.history;if(!rows.length)return;
 const frame=document.createElement('div');frame.className='ending-visual';
 const chart=document.createElementNS(NS,'svg');chart.classList.add('ending-chart');chart.setAttribute('role','group');chart.setAttribute('aria-label','Health, wellbeing and cash across age');
 const detail=document.createElement('section');detail.className='ending-reading';
 const label=document.createElement('label');label.htmlFor='ending-age';label.textContent='Look at age';
 const age=document.createElement('select');age.id='ending-age';for(const row of rows){const option=document.createElement('option');option.value=row.age;option.textContent=row.age;age.append(option);}age.value=state.age;
 const values=document.createElement('dl'),event=document.createElement('p');event.className='ending-event';const analysis=document.createElement('div');analysis.className='ending-analysis';
 const {fastest,slowed}=growthWindows(rows);
 const line=(text)=>{const p=document.createElement('p');p.textContent=text;analysis.append(p);};
 if(fastest){line('Cash grew fastest at ages '+fastest.from+'–'+fastest.to+'.');line('Physical health changed by about '+Number(fastest.health.toFixed(1))+' points in that period.');if(slowed)line('Cash growth slowed at ages '+slowed.from+'–'+slowed.to+'.');}
 else line('No positive cash-growth period was recorded.');
 const note=document.createElement('p');note.className='fine';note.textContent='Five-year snapshots. These changes are not proof of cause or a fitted S-curve.';
 detail.append(label,age,values,event,analysis,note);const figure=document.createElement('figure');figure.className='ending-plot';figure.append(chart);if(fastest){const caption=document.createElement('figcaption');caption.textContent='Shaded interval: fastest cash growth.';figure.append(caption);}frame.append(figure,detail);root.append(frame);
 const svg=(tag,attrs={},text)=>{const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;return el;};
 const show=()=>{
  const row=rows.find(r=>r.age===Number(age.value))??rows.at(-1);values.replaceChildren();for(const[key,name]of metric){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=name;dd.textContent=key==='cash'?money(row[key]):Math.round(row[key])+' / 100';values.append(dt,dd);}
  event.textContent=rememberedMoments(state).find(m=>m.age===row.age)?.text??(row.age<=10?'Before you choose.':'An ordinary five years. Small habits accumulate.');draw(row.age);
 };
 function draw(selected){
  chart.replaceChildren();const width=Math.max(300,Math.round(chart.getBoundingClientRect().width)),left=52,right=18,plot=width-left-right,end=Math.max(10,state.age),x=n=>left+n/end*plot;chart.setAttribute('viewBox',`0 0 ${width} 354`);
  metric.forEach(([key,name,color],i)=>{
   const top=24+i*102,base=top+68,all=[0,...rows.map(r=>r[key])],min=key==='cash'?Math.min(...all):0,max=key==='cash'?Math.max(...all):100,span=max-min||1,y=v=>base-(v-min)/span*52;
   if(fastest)chart.append(svg('rect',{x:x(fastest.from),y:top+4,width:x(fastest.to)-x(fastest.from),height:64,fill:'#a32750','fill-opacity':.07}));
   chart.append(svg('text',{x:left,y:top-6,class:'ending-metric',fill:color},name+(key==='cash'?' · ฿':'')));
   for(const v of [...new Set([min,max])]){chart.append(svg('text',{x:left-8,y:y(v)+4,'text-anchor':'end',class:'ending-tick'},key==='cash'?(Math.abs(v)>=1000?Math.round(v/1000)+'k':Math.round(v)):v));chart.append(svg('line',{x1:left,x2:width-right,y1:y(v),y2:y(v),stroke:'#b4b9a9','stroke-width':.7}));}
   if(min<0)chart.append(svg('line',{x1:left,x2:width-right,y1:y(0),y2:y(0),stroke:'#b4b9a9','stroke-dasharray':'3 3'}));
   chart.append(svg('line',{x1:x(selected),x2:x(selected),y1:top+4,y2:base,stroke:'#52635b','stroke-dasharray':'2 4'}));
   chart.append(svg('polyline',{points:rows.map(r=>`${x(r.age)},${y(r[key])}`).join(' '),fill:'none',stroke:color,'stroke-width':2.5}));
   for(const r of rows){const g=svg('g',{role:'button',tabindex:0,'aria-label':'Age '+r.age+': '+name+' '+(key==='cash'?money(r[key]):Math.round(r[key])+' / 100')});g.append(svg('circle',{cx:x(r.age),cy:y(r[key]),r:9,fill:'transparent'}),svg('circle',{cx:x(r.age),cy:y(r[key]),r:r.age===selected?4:2,fill:color}));const select=()=>{age.value=r.age;show();age.focus({preventScroll:true});};g.onclick=select;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}};chart.append(g);}
  });
  const step=end<=20?5:end<=40?10:20;for(const n of [...new Set([0,...Array.from({length:Math.floor(end/step)},(_,i)=>(i+1)*step),end])])chart.append(svg('text',{x:x(n),y:338,'text-anchor':'middle',class:'ending-tick'},n));
  chart.append(svg('text',{x:left,y:353,class:'ending-tick'},'Age'));
 }
 age.onchange=show;show();let lastWidth=chart.getBoundingClientRect().width;resizeObserver=new ResizeObserver(()=>{const width=chart.getBoundingClientRect().width;if(width!==lastWidth){lastWidth=width;draw(Number(age.value));}});resizeObserver.observe(chart);
}
