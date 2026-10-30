import {LESSONS} from './lessons.js';
import {ikigai} from './ikigai.js';
import {t} from './i18n.js';
import {drawRouteMap,routeModel,routeText} from './routemap.js';
import {netWorth} from './finance.js';
import {preferences} from './i18n.js';
import {rememberedMoments} from './recap.js';
import {baselineComparison} from './baseline.js';
import {recordLife,rememberWords} from './lives.js';
import {birthURL} from './birthcode.js';
import {resultShare,deliverShare} from './share-result.js';
const NS='http://www.w3.org/2000/svg';let resizeObserver;
const baseMetrics=[['health','Physical health','#192e2c'],['wellbeing','Wellbeing','#a35d00'],['cash','Household buffer','#a32750']];
const money=n=>'฿'+Math.round(n).toLocaleString('en');
export function growthWindows(history){
 const periods=history.slice(1).map((row,i)=>({from:history[i].age,to:row.age,cash:row.cash-history[i].cash,health:row.health-history[i].health,wellbeing:row.wellbeing-history[i].wellbeing,rate:(row.cash-history[i].cash)/(row.age-history[i].age)})).filter(r=>Number.isFinite(r.rate));
 const fastest=periods.filter(r=>r.cash>0).sort((a,b)=>b.rate-a.rate||a.from-b.from)[0]??null;
 return {fastest,slowed:fastest?periods.find(r=>r.from===fastest.to&&r.rate<fastest.rate)??null:null};
}
export function renderEnding(root,state,{storage}={}){
 if(storage===undefined){try{storage=localStorage;}catch{storage=null;}}
 resizeObserver?.disconnect();const personal=!!state.finance,metric=baseMetrics.map(([key,label,color])=>[key,key==='cash'&&personal?'Personal net worth':label,color]);const rows=personal?state.history.map(row=>({...row,cash:row.finance?netWorth(row.finance):0})):state.history;if(!rows.length)return;
 // Where the life went leads the ending; the resource tracks follow it.
 const route=document.createElement('figure'),map=document.createElement('canvas'),model=routeModel(state);route.className='ending-route';map.setAttribute('role','img');map.setAttribute('aria-label',routeText(state));map.style.height=(model.lanes.length*(innerWidth<560?54:64)+84)+'px';route.append(map);root.append(route);new ResizeObserver(()=>drawRouteMap(map,state)).observe(map);
 // Ikigai: four readings and the overlap between them. Money alone cannot fill it.
 const reading=ikigai(state);if(reading){const box=document.createElement('section');box.className='ending-ikigai';box.setAttribute('aria-label','Ikigai');const head=document.createElement('h2');head.textContent='Ikigai '+reading.score+' / 100';box.append(head);const list=document.createElement('dl');for(const[key,label,hint]of [['love','What you love','effort toward your chosen direction, kept up and made into something'],['good','What you became good at','practice, not what you were born with'],['world','What the world got from you','help, care, teaching, raising others'],['paid','What sustained you','chapters where income covered costs; enough, not wealth']]){const dt=document.createElement('dt'),dd=document.createElement('dd'),bar=document.createElement('span'),small=document.createElement('small');dt.textContent=label;small.textContent=hint;bar.className='ikigai-bar';bar.style.setProperty('--v',(reading.parts[key]??0)+'%');dd.append(bar,document.createTextNode(reading.parts[key]===null?'—':String(reading.parts[key])));dt.append(small);list.append(dt,dd);}
 // Where the four readings meet: the overlaps were computed all along and never shown.
 {const dt=document.createElement('dt'),dd=document.createElement('dd'),small=document.createElement('small');dd.className='ikigai-overlaps';dt.textContent='Where they meet';small.textContent='each overlap is the weaker of its two readings';dt.append(small);[['passion','Passion'],['mission','Mission'],['vocation','Vocation'],['profession','Profession']].forEach(([k,l],i)=>{const w=document.createElement('span');w.textContent=l+' '+(reading.overlaps[k]??'—');dd.append(w);});list.append(dt,dd);}
 const note=document.createElement('p');note.className='fine';note.textContent='Overall is the geometric mean of the four, so one strong reading cannot carry the others. A game proxy, not a psychological test.';box.append(list,note);root.append(box);}
 // Lessons: what past choices cost later, and what each one was teaching.
 const returned=state.history.flatMap(r=>r.consequences??[]),taken=(state.story?.seen??[]).filter(e=>LESSONS.some(l=>l.id===e.id));
 const at60=state.history.find(r=>r.age===60&&r.finance),period=at60&&state.finance?.receipts.find(r=>r.kind==='period'&&r.age===60),monthly=period?Math.max(1,Math.round(period.essential/Math.max(1,period.months))):0;
 if(returned.length||taken.length||at60){const box=document.createElement('section');box.className='ending-lessons';box.setAttribute('aria-label','Lessons this life taught');
  if(at60&&monthly){const p=document.createElement('p');p.className='ending-runway';p.textContent='At 60 you could have lived '+Math.max(0,Math.floor(netWorth(at60.finance)/monthly))+' months without income.';box.append(p);}
  if(returned.length){const h=document.createElement('h2');h.textContent='What your choices cost later';const ol=document.createElement('ol');for(const c of returned){const li=document.createElement('li'),age=document.createElement('b'),text=document.createElement('span'),from=document.createElement('small');age.textContent='Age '+c.age;from.textContent=LESSONS.find(l=>l.id===c.lesson)?.title??'';text.append(from);text.append(document.createTextNode(c.text+(c.cash?' '+(c.cash>0?'+':'−')+money(Math.abs(c.cash)):'')));li.append(age,text);ol.append(li);}box.append(h,ol);}
  if(taken.length){const h=document.createElement('h2');h.textContent='Lessons this life taught';const ol=document.createElement('ol');ol.className='taught';for(const e of taken){const l=LESSONS.find(x=>x.id===e.id),li=document.createElement('li'),title=document.createElement('b'),chose=document.createElement('span'),lesson=document.createElement('p'),link=document.createElement('a');title.textContent=l.title;chose.textContent='You chose: '+l.options.find(o=>o.id===e.choice).label;lesson.textContent=l.lesson;link.href=l.source;link.target='_blank';link.rel='noopener';link.textContent='Read the essay';li.append(title,chose,lesson);if(l.source)li.append(link);ol.append(li);}box.append(h,ol);}
  root.append(box);}
 // A card to keep or send: where you went, what you were, one line in your own words.
 try{recordLife(storage,state,{ikigai:reading?.score});}catch{}
 // The way to hand this life on: the same birth, for someone else to live their own way.
 const link=birthURL(state);
 const share=document.createElement('section');share.className='ending-share';const lineLabel=document.createElement('label');lineLabel.textContent=t('One line for your life card');const words=document.createElement('input');words.type='text';words.maxLength=90;words.placeholder='In your own words';lineLabel.append(words);const save=document.createElement('button');save.type='button';save.className='quiet';save.textContent='Save your life card';const status=document.createElement('p');status.className='fine';status.setAttribute('role','status');status.hidden=true;const send=document.createElement('button');send.type='button';send.textContent='Send this birth to someone';send.className='primary';
 const manual=document.createElement('textarea');manual.readOnly=true;manual.hidden=true;manual.rows=3;manual.setAttribute('aria-label',t('Result text and birth link'));manual.style.width='100%';manual.style.font='inherit';
 send.textContent=t('Share this result');
 send.onclick=async()=>{send.disabled=true;manual.hidden=true;preview.hidden=false;status.hidden=false;status.textContent=t('Preparing share…');try{const payload=resultShare(state,{score:reading?.score,translate:t});const outcome=await deliverShare(payload,navigator,{onWaiting:()=>{status.textContent=t('Still waiting for sharing. You can copy the text below.');manual.value=payload.text+' '+payload.url;manual.hidden=false;preview.hidden=true;}});status.textContent=t({copied:'Copied. Paste it anywhere.',shared:'Share sheet completed.',cancelled:'Sharing cancelled.',unavailable:'This birth cannot be shared.',manual:'Sharing was unavailable. Select and copy the text below.'}[outcome]);if(outcome==='manual'){manual.value=payload.text+' '+payload.url;manual.hidden=false;preview.hidden=true;manual.focus();manual.select();}}finally{send.disabled=false;}};
 const preview=document.createElement('p');preview.className='fine';preview.textContent=resultShare(state,{score:reading?.score,translate:t})?.text??'';share.append(preview);
 share.append(lineLabel,save,...(link?[send]:[]),status,manual);root.insertBefore(share,route.nextSibling);
 save.onclick=async()=>{status.hidden=false;try{rememberWords(storage,state,words.value.trim());}catch{}const blob=await lifeCard(state,words.value.trim());const file=new File([blob],'life2-card.png',{type:'image/png'});// Phones get the share sheet; computers save the file directly.
 if(matchMedia('(pointer:coarse)').matches&&navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],title:'Life2.0',text:link?t('Same birth, your choices:')+' '+link:'life.nonarkara.org'});return;}catch{}}const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='life2-card.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);status.textContent='Saved as life2-card.png.';};
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
   for(const v of [...new Set([min,max])]){chart.append(svg('text',{x:left-8,y:y(v)+4,'text-anchor':'end',class:'ending-tick'},key==='cash'?new Intl.NumberFormat(preferences.language,{notation:'compact',maximumFractionDigits:1}).format(v):v));chart.append(svg('line',{x1:left,x2:width-right,y1:y(v),y2:y(v),stroke:'#b4b9a9','stroke-width':.7}));}
   if(min<0)chart.append(svg('line',{x1:left,x2:width-right,y1:y(0),y2:y(0),stroke:'#b4b9a9','stroke-dasharray':'3 3'}));
   chart.append(svg('line',{x1:x(selected),x2:x(selected),y1:top+4,y2:base,stroke:'#52635b','stroke-dasharray':'2 4'}));
   chart.append(svg('polyline',{points:rows.map(r=>`${x(r.age)},${y(r[key])}`).join(' '),fill:'none',stroke:color,'stroke-width':2.5}));
   for(const r of rows){const g=svg('g',{role:'button',tabindex:0,'aria-label':'Age '+r.age+': '+name+' '+(key==='cash'?money(r[key]):Math.round(r[key])+' / 100')});g.append(svg('circle',{cx:x(r.age),cy:y(r[key]),r:9,fill:'transparent'}),svg('circle',{cx:x(r.age),cy:y(r[key]),r:r.age===selected?4:2,fill:color}));const select=()=>{age.value=r.age;show();age.focus({preventScroll:true});};g.onclick=select;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}};chart.append(g);}
  });
  const step=end<=20?5:end<=40?10:20;for(const n of [...new Set([0,...Array.from({length:Math.floor(end/step)},(_,i)=>(i+1)*step),end])])chart.append(svg('text',{x:x(n),y:338,'text-anchor':'middle',class:'ending-tick'},n));
  chart.append(svg('text',{x:left,y:353,class:'ending-tick'},'Age'));
 }
 age.onchange=show;show();let lastWidth=chart.getBoundingClientRect().width;resizeObserver=new ResizeObserver(()=>{const width=chart.getBoundingClientRect().width;if(width!==lastWidth){lastWidth=width;draw(Number(age.value));}});resizeObserver.observe(chart);
 // The life you did not choose: the same world, with no decisions taken.
 const comparison=baselineComparison(state);
 if(comparison.rows.length){
  const box=document.createElement('section');box.className='ending-baseline';box.setAttribute('aria-label','Your life and the life you did not choose');
  const head=document.createElement('h2');head.textContent='Against the life you did not choose';
  box.append(head);
  const note=document.createElement('p');note.className='fine';note.textContent='Same birth, same world, same shocks. That other life spends every station in the default shape and takes no story decision. The difference is what your choices moved.';
  box.append(note);
  const table=document.createElement('table'),headRow=document.createElement('tr');
  for(const label of ['Age','Money · yours / unchosen','Health · yours / unchosen','Wellbeing · yours / unchosen']){const th=document.createElement('th');th.scope='col';th.textContent=label;headRow.append(th);}
  const head2=document.createElement('thead');head2.append(headRow);table.append(head2);
  const body=document.createElement('tbody');
  for(const row of comparison.rows){
   const tr=document.createElement('tr'),ageCell=document.createElement('th');ageCell.scope='row';ageCell.textContent=String(row.age);
   const cash=document.createElement('td'),health=document.createElement('td'),wellbeing=document.createElement('td');
   cash.textContent=money(row.cash)+' / '+money(row.unchosenCash);
   health.textContent=Math.round(row.health)+' / '+Math.round(row.unchosenHealth);
   wellbeing.textContent=Math.round(row.wellbeing)+' / '+Math.round(row.unchosenWellbeing);
   tr.append(ageCell,cash,health,wellbeing);body.append(tr);
  }
  table.append(body);box.append(table);
  const delta=comparison.delta;
  if(delta){const sign=n=>(n>=0?'+':'')+n;const line=document.createElement('p');line.className='ending-baseline-line';line.textContent='By '+comparison.rows.at(-1).age+', your choices moved money by '+sign(money(delta.cash).replace('฿',''))+' ฿, health by '+sign(Math.round(delta.health))+' and wellbeing by '+sign(Math.round(delta.wellbeing))+' against that other life.';box.append(line);}
  if(comparison.endedEarly){const line=document.createElement('p');line.className='fine';line.textContent='That other life ended early, so its later stations are missing.';box.append(line);}
  root.append(box);
 }
}

// The life card is drawn from the record alone: no invented praise, no score for a good life.
export async function lifeCard(state,words){
 const W=1200,H=630,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 g.fillStyle='#f4efe3';g.fillRect(0,0,W,H);g.fillStyle='#111614';g.fillRect(0,H-44,W,44);
 const map=document.createElement('canvas');map.width=W-96;map.height=300;drawRouteMap(map,state,{width:W-96,height:300});g.drawImage(map,48,170);
 g.fillStyle='#273d35';g.font='600 46px Jost, sans-serif';g.fillText('Life2.0',48,78);
 g.font='26px Jost, sans-serif';g.fillText(t('Born in')+' '+t(state.birth.place)+' · '+t('Age {n}').replace('{n}',state.age),48,124);
 const k=ikigai(state);g.font='600 22px Jost, sans-serif';const pillars=[[t('Physical health'),Math.round(state.health)],[t('Wellbeing'),Math.round(state.wellbeing)],['Ikigai',k?.score??'—']];pillars.forEach(([label,v],i)=>{g.fillText(label+' '+v,48+i*300,510);});
 if(words){g.font='italic 26px Jost, sans-serif';g.fillText('“'+words+'”',48,560);}
 g.fillStyle='#d9dcd2';g.font='16px JetBrains Mono, monospace';g.fillText('LIFE.NONARKARA.ORG',48,H-16);
 return new Promise(r=>c.toBlob(r,'image/png'));
}
