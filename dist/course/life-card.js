import {t} from './i18n.js';
import {ikigai} from './ikigai.js';
import {birthURL} from './birthcode.js';
import {drawRouteMap,routeModel} from './routemap.js';
import {netWorth} from './finance.js';
export function cardSeries(state){
 const rows=(state.history??[]).filter(r=>Number.isFinite(r.age)&&r.age<=state.age).sort((a,b)=>a.age-b.age),personal=!!state.finance;
 return [{label:'Physical health',value:state.health,color:'#192e2c',points:rows.filter(r=>Number.isFinite(r.health)).map(r=>({age:r.age,value:r.health})),min:0,max:100},
 {label:'Wellbeing',value:state.wellbeing,color:'#a35d00',points:rows.filter(r=>Number.isFinite(r.wellbeing)).map(r=>({age:r.age,value:r.wellbeing})),min:0,max:100},
 {label:personal?'Personal net worth':'Household buffer',value:personal?netWorth(state.finance):state.cash,color:'#a32750',money:true,points:rows.filter(r=>personal?!!r.finance:Number.isFinite(r.cash)).map(r=>({age:r.age,value:personal?netWorth(r.finance):r.cash}))}];
}
// Actual record only. More places earn height; a sparse timeline does not.
export async function lifeCard(state,words){
 const extra=Math.max(0,routeModel(state).lanes.length-2)*24,W=1200,H=630+extra,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),font=getComputedStyle(document.body).fontFamily;
 g.fillStyle='#f4efe3';g.fillRect(0,0,W,H);g.fillStyle='#111614';g.fillRect(0,H-44,W,44);
 g.fillStyle='#273d35';g.font='600 46px '+font;g.fillText('Life2.0',48,72);
 const score=ikigai(state)?.score;g.textAlign='right';g.font='600 28px '+font;g.fillText('Ikigai '+(score??'—')+' / 100',W-48,72);g.textAlign='left';
 g.font='26px '+font;g.fillText(t('Born in')+' '+t(state.birth.place)+' · '+t('Age {n}').replace('{n}',state.age),48,114,W-96);
 if(words){let size=24;const text='“'+words+'”';g.font='italic '+size+'px '+font;while(wrapCardText(text,s=>g.measureText(s).width,W-96).length>2&&size>14){size--;g.font='italic '+size+'px '+font;}wrapCardText(text,s=>g.measureText(s).width,W-96).forEach((line,i)=>g.fillText(line,48,148+i*27));}
 const map=document.createElement('canvas');drawRouteMap(map,state,{width:W-96,height:120+extra});g.drawImage(map,48,180);
 const compact=n=>new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(n);
 cardSeries(state).forEach((series,i)=>{
  const left=48+i*376,width=340;g.fillStyle='#273d35';g.font='600 20px '+font;g.fillText(t(series.label),left,342+extra,width);g.font='600 29px '+font;g.fillText(series.money?'฿'+compact(series.value):Math.round(series.value)+' / 100',left,380+extra,width);
  if(!series.points.length){g.font='18px '+font;g.fillText(t('No recorded history'),left,440+extra,width);return;}
  if(series.points.length===1){g.fillStyle=series.color;g.beginPath();g.arc(left+6,436+extra,4,0,Math.PI*2);g.fill();g.font='18px '+font;g.fillText(t('Age {n}').replace('{n}',series.points[0].age),left+20,442+extra,width-20);return;}
  const low=series.min??Math.min(0,...series.points.map(p=>p.value)),high=series.max??Math.max(1,...series.points.map(p=>p.value)),start=series.points[0].age,end=series.points.at(-1).age,x=age=>left+28+(age-start)/Math.max(1,end-start)*(width-36),y=value=>486+extra-(value-low)/Math.max(1,high-low)*84;
  g.strokeStyle='#b4b9a9';g.lineWidth=1;g.beginPath();g.moveTo(left+28,y(0));g.lineTo(left+width-8,y(0));g.stroke();g.fillStyle='#52635b';g.font='13px '+font;g.fillText(compact(high),left,406+extra);g.fillText(compact(low),left,490+extra);
  g.strokeStyle=series.color;g.fillStyle=series.color;g.lineWidth=3;g.beginPath();series.points.forEach((p,index)=>index?g.lineTo(x(p.age),y(p.value)):g.moveTo(x(p.age),y(p.value)));g.stroke();for(const p of series.points){g.beginPath();g.arc(x(p.age),y(p.value),3,0,Math.PI*2);g.fill();}
  g.fillStyle='#52635b';g.font='14px '+font;g.fillText(t('Age {n}').replace('{n}',start),left+28,512+extra);g.textAlign='right';g.fillText(t('Age {n}').replace('{n}',end),left+width-8,512+extra);g.textAlign='left';
 });
 g.fillStyle='#52635b';g.font='17px '+font;g.fillText(t('Game values · not predictions'),48,554+extra);
 g.fillStyle='#d9dcd2';g.font='16px '+font;g.fillText(birthURL(state)??'https://life.nonarkara.org',48,H-16,W-96);
 return new Promise(resolve=>c.toBlob(resolve,'image/png'));
}
// Break complete graphemes, including Thai/CJK and emoji, without dropping text.
export function wrapCardText(text,measure,width){const parts=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text)].map(p=>p.segment):Array.from(text),lines=[];let line='';for(const part of parts){if(line&&measure(line+part)>width){lines.push(line);line='';}line+=part;}if(line)lines.push(line);return lines;}
