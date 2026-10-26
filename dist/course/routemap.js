// The ending's map of where a life went: one line per place lived, the lived path
// in amber across ages, moves drawn as interchanges. Only recorded history is drawn.
import {regionAt,region,regionIdFor} from './regions.js';
import {eventsFor} from './events.js';
import {t,preferences} from './i18n.js';
const INK='#273d35',MUTED='#6d7a72',LINE='#c9c3b2',PAPER='#f4efe3',AMBER='#f59e0b';
const MARKS={loss:'Loss',connection:'Love',illness:'Illness',school:'School ends',retirement:'Work slows',project:'Project',flood:'Flood'};
export function routeModel(state){
 const end=Math.max(1,state.age),born=regionIdFor(state.birth),lanes=[],at=[];
 for(let a=0;a<=end;a++){const id=regionAt(state,a);if(!lanes.includes(id))lanes.push(id);at.push(id);}
 const moves=[];for(let a=1;a<=end;a++)if(at[a]!==at[a-1])moves.push({age:a,from:at[a-1],to:at[a],home:at[a]===born});
 const marks=[];const study=(state.history??[]).find(r=>r.pathway==='college');if(study)marks.push({age:study.from??study.age,label:'Study'});
 for(const row of state.history??[])for(const e of eventsFor(row))if(MARKS[e.type]&&!marks.some(m=>m.age===row.age&&m.label===MARKS[e.type]))marks.push({age:row.age,label:MARKS[e.type]});
 for(const m of moves)if(m.home)marks.push({age:m.age,label:'Back home'});
 if(state.birth?.childhood)marks.push({age:state.birth.childhood.from,label:'Grandparents'});
 const once=['Love','Project','Study'],seen=new Set(),byAge=new Map();
 for(const mk of marks.sort((a,b)=>a.age-b.age)){if(once.includes(mk.label)){if(seen.has(mk.label))continue;seen.add(mk.label);}if(!byAge.has(mk.age))byAge.set(mk.age,[]);byAge.get(mk.age).push(mk.label);}
 return {end,born,lanes,at,moves,marks:[...byAge].map(([age,labels])=>({age,labels}))};
}
export function routeText(state){const m=routeModel(state),spans=[];let from=0;for(let a=1;a<=m.end+1;a++)if(a>m.end||m.at[a]!==m.at[a-1]){spans.push(t(region(m.at[from]).place)+' '+from+'–'+(a>m.end?m.end:a));from=a;}return t('Where your life went')+': '+spans.join('; ')+'.';}
export function drawRouteMap(canvas,state,fixed){
 const dpr=fixed?1:Math.min(devicePixelRatio||1,2),w=fixed?.width??Math.max(280,canvas.clientWidth),h=fixed?.height??Math.max(200,canvas.clientHeight);
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle=PAPER;c.fillRect(0,0,w,h);
 const m=routeModel(state),phone=w<560,font=preferences.language==='th'?'Prompt':'Jost',size=phone?11:13;
 const left=phone?16:Math.min(220,w*.24),right=24,top=phone?40:48,bottom=34,plot=w-left-right;
 const x=a=>left+a/80*plot,laneGap=Math.min(phone?54:64,(h-top-bottom)/Math.max(1,m.lanes.length)),y=i=>top+laneGap*(i+.5);
 c.font=`${size}px ${font}`;c.textBaseline='middle';
 // Lines for every place lived; the lines blur, so the map reads like flight
 // paths rather than a ruled table. Names sit at the line's start.
 m.lanes.forEach((id,i)=>{c.strokeStyle='rgba(201,195,178,.5)';c.lineWidth=phone?8:11;c.lineCap='round';c.beginPath();c.moveTo(x(0),y(i));c.lineTo(x(80),y(i));c.stroke();c.strokeStyle=LINE;c.lineWidth=1;c.beginPath();c.moveTo(x(0),y(i));c.lineTo(x(80),y(i));c.stroke();});
 // Text is drawn last on a paper halo, so the path never cuts through a word.
 const halo=(text,tx,ty)=>{c.lineJoin='round';c.lineWidth=4;c.strokeStyle=PAPER;c.strokeText(text,tx,ty);c.fillText(text,tx,ty);};
 // Age axis: decades, plus the end of this life.
 c.font=`${size-1}px ${font}`;c.fillStyle=MUTED;c.textAlign='center';for(let a=0;a<=80;a+=10){c.fillText(String(a),x(a),h-bottom+18);c.fillRect(x(a)-.5,h-bottom+4,1,5);}
 // The lived path: level along a place's line, and at each move the path
 // curves out of one line and merges into the next, the way a flight path does.
 const lane=id=>m.lanes.indexOf(id),run=mv=>Math.min(4,Math.abs(lane(mv.to)-lane(mv.from))*laneGap/(plot/80));
 c.strokeStyle=AMBER;c.lineWidth=phone?5:6;c.lineJoin='round';c.lineCap='round';c.beginPath();c.moveTo(x(0),y(lane(m.at[0])));
 for(const mv of m.moves){
  const x0=x(Math.max(0,mv.age-run(mv))),y0=y(lane(mv.from)),x1=x(mv.age),y1=y(lane(mv.to));
  c.lineTo(x0,y0);
  c.bezierCurveTo(x0+(x1-x0)*.55,y0,x0+(x1-x0)*.45,y1,x1,y1);
 }
 c.lineTo(x(m.end),y(lane(m.at[m.end])));c.stroke();
 // Stations every five years on the path; interchanges where the place changed.
 for(let a=0;a<=m.end;a+=5){const py=y(lane(m.at[a]));c.fillStyle=PAPER;c.strokeStyle=INK;c.lineWidth=1.5;c.beginPath();c.arc(x(a),py,3,0,Math.PI*2);c.fill();c.stroke();}
 for(const mv of m.moves){const px=x(mv.age),py=y(lane(mv.to));c.fillStyle=PAPER;c.strokeStyle=INK;c.lineWidth=2.5;c.beginPath();c.arc(px,py,7,0,Math.PI*2);c.fill();c.stroke();}
 const ex=x(m.end),ey=y(lane(m.at[m.end]));c.fillStyle=INK;c.beginPath();c.arc(ex,ey,7,0,Math.PI*2);c.fill();c.fillStyle=PAPER;c.beginPath();c.arc(ex,ey,3,0,Math.PI*2);c.fill();
 const spans=[];m.lanes.forEach((id,i)=>{c.fillStyle=id===m.born?INK:MUTED;c.textAlign=phone?'left':'right';c.font=`${id===m.born?600:400} ${size}px ${font}`;halo(t(region(id).place),phone?left:left-12,phone?y(i)-15:y(i));spans[i]=phone?left+c.measureText(t(region(id).place)).width+8:0;});
 // Moments, alternating above and below the path so labels never sit on each other.
 c.font=`${size-1}px ${font}`;c.textAlign='center';let lastX=-1e9,flip=1;
 for(const mk of m.marks){const px=x(mk.age),py=y(lane(m.at[Math.min(m.end,mk.age)]));flip=px-lastX<46?-flip:1;const li=lane(m.at[Math.min(m.end,mk.age)]);if(flip<0&&px-30<spans[li])flip=1;lastX=px;const ly=py+flip*(phone?15:18);c.fillStyle=INK;c.fillRect(px-.5,Math.min(py,ly)+(flip>0?5:4),1,Math.abs(ly-py)-9);halo(mk.labels.map(t).join(' · '),px,ly+flip*4);}
 c.textAlign='left';c.font=`600 ${size}px ${font}`;c.fillStyle=INK;c.fillText(t('Where your life went'),left,16);
}
