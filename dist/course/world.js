import {t,preferences} from './i18n.js';
import {lifeMood,MOOD_CHORDS} from './events.js';
import {AXES} from './sim.js';
import {furniture} from './layout.js';
import {routine} from './routines.js';
const C={land:'#7d9764',grass:'#9caf73',sand:'#c7b582',water:'#507e82',waterLight:'#7dabad',road:'#c8bba1',edge:'#a59375',wall:'#eed7aa',shade:'#c4aa80',roof:'#a15f49',roofLight:'#bb7b57',wood:'#6b5740',ink:'#273d35',leaf:'#476b48',lightleaf:'#668651',paper:'#eee2bc',amber:'#f59e0b'};
const canvasBuffer=document.createElement('canvas');canvasBuffer.width=560;canvasBuffer.height=340;
export function drawWorld(canvas,state,age,time,mode='world'){
Object.assign(C,MOOD_CHORDS[lifeMood(state)]);const portrait=state.stage==='birth'&&canvas.clientWidth<721;const bw=portrait?240:560,bh=portrait?Math.round(240*canvas.clientHeight/canvas.clientWidth):340;if(canvasBuffer.width!==bw||canvasBuffer.height!==bh){canvasBuffer.width=bw;canvasBuffer.height=bh;}const c=canvasBuffer.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#243f38';c.fillRect(0,0,bw,bh);
if(mode==='course'){drawCourse(c,state);finish();return;}
const zoom=(age<10?6-age*.42:age<20?1.8-(age-10)*.01:1.7)*(portrait?.7:1);const focus=routine('player',age,time,state.profiles.at(-1)?.profile.aim??'balance'),follow=age<6?0:.7;const center=[(focus.x-focus.y)*15*follow,75*(1-follow)+(focus.x+focus.y)*7.5*follow];
c.save();c.translate(bw/2,portrait?bh*.56:age<3?215:190);c.scale(zoom,zoom);c.translate(-center[0],-center[1]);
const p=(x,y,z=0)=>[(x-y)*15,(x+y)*7.5-z*15];
function poly(v,col){c.beginPath();v.forEach((a,i)=>i?c.lineTo(...p(...a)):c.moveTo(...p(...a)));c.closePath();c.fillStyle=col;c.fill();}
function box(x,y,z,w,d,h,top=C.paper,side=C.shade,front=C.wall){poly([[x,y,z],[x,y+d,z],[x,y+d,z+h],[x,y,z+h]],side);poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],front);poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],top);}
function line(a,b,col,w=.4){c.beginPath();c.moveTo(...p(...a));c.lineTo(...p(...b));c.strokeStyle=col;c.lineWidth=w;c.stroke();}
function label(x,y,text){const q=p(x,y,.1);c.font='5px '+worldFont();c.textAlign='center';c.fillStyle=C.ink;c.fillText(t(text),...q);}
function tree(x,y){box(x,y,0,.15,.15,1.2,C.wood,C.wood,C.wood);box(x-.45,y-.45,1,1,1,.65,C.lightleaf,C.leaf,C.leaf);box(x-.25,y-.25,1.65,.6,.6,.35,C.lightleaf,C.leaf,C.leaf);}
function building(x,y,w,d,h,name){box(x,y,0,w,d,h);box(x-.15,y-.15,h,w+.3,d+.3,.2,C.roofLight,C.roof,C.roof);for(let a=x+.3;a<x+w-.3;a+=.6){poly([[a,y+d+.01,.5],[a+.3,y+d+.01,.5],[a+.3,y+d+.01,1],[a,y+d+.01,1]],'#526b61');}box(x+w*.45,y+d,.02,.5,.12,.9,C.wood,C.wood,C.wood);if(age>=10)label(x+w/2,y+d+.6,name);}
// Persistent land, coast and water exist before the camera can see them.
poly([[-9,-6,0],[21,-6,0],[21,19,0],[-9,19,0]],C.water);for(let x=-8;x<22;x+=1.1)for(let y=-5;y<20;y+=1.8)line([x,y,.01],[x+.35,y,.01],C.waterLight,.22);
poly([[-3,-3,.01],[15,-3,.01],[17,1,.01],[16,15,.01],[3,17,.01],[-4,10,.01]],C.sand);
poly([[-2.5,-2.5,.02],[14.5,-2.5,.02],[16.5,1,.02],[15.5,14.5,.02],[3,16.5,.02],[-3.5,9.5,.02]],C.land);
for(let x=-2;x<16;x+=.6)for(let y=-2;y<15;y+=.8){if((Math.round(x*10)+Math.round(y*10))%3===0)line([x,y,.03],[x+.13,y+.06,.03],C.grass,.22);}
// Street axes, shared continuous ground plane and paths.
poly([[-2,7,.04],[15,7,.04],[15,8.1,.04],[-2,8.1,.04]],C.road);poly([[7.2,-2,.04],[8.2,-2,.04],[8.2,15,.04],[7.2,15,.04]],C.road);
for(let x=-1;x<15;x+=1.5)line([x,7.55,.05],[x+.6,7.55,.05],C.paper,.14);
// Flood is an environmental event, never a scene reset.
if(state.history.some(r=>r.age===30)&&age>=30&&age<36)poly([[1,6.8,.07],[10,6.8,.07],[10,8.4,.07],[1,8.4,.07]],'#719a97');
// Farm plots and football pitch are districts, not floating props.
for(let i=0;i<4;i++){poly([[-1+i*.6,1,.04],[-.65+i*.6,1,.04],[-.65+i*.6,4,.04],[-1+i*.6,4,.04]],'#b5a05f');for(let y=1.2;y<4;y+=.3)box(-1+i*.6,y,.05,.25,.15,.18,C.grass,C.leaf,C.leaf);}
poly([[9,9,.04],[13,9,.04],[13,12,.04],[9,12,.04]],'#65875a');for(const pair of [[[9,9,.06],[13,9,.06]],[[13,9,.06],[13,12,.06]],[[13,12,.06],[9,12,.06]],[[9,12,.06],[9,9,.06]],[[11,9,.06],[11,12,.06]]])line(...pair,C.paper,.15);
// Home is a cutaway, so walls never disappear arbitrarily with camera time.
box(3,3,0,4,4,.2,'#ad9064');for(let x=3;x<7;x+=.35)line([x,3,.21],[x,7,.21],'#92764f',.12);box(3,3,.2,4,.12,1.8,C.wall,C.shade,C.wall);box(3,3,.2,.12,4,1.8,C.wall,C.shade,C.shade);
poly([[4,3.13,.8],[5.6,3.13,.8],[5.6,3.13,1.6],[4,3.13,1.6]],'#78958b');line([4.8,3.14,.8],[4.8,3.14,1.6],C.wood,.12);
const objects=[];const add=(depth,fn)=>objects.push({depth,fn});
add(7.4,()=>{const f=furniture[0];box(f.x,f.y,.2,f.w,f.d,.4,C.wood);box(3.3,3.5,.6,1.15,1.7,.12,C.paper);box(3.3,4,.73,1.15,1.2,.04,'#6a8a75');box(3.45,3.6,.73,.8,.3,.04,C.paper);});
// Cradle stays in the same place through infancy and childhood.
add(10,()=>{const f=furniture[1];box(f.x,f.y,.2,f.w,f.d,.45,C.wood);box(4.68,4.68,.65,.94,.74,.04,C.paper);if(age<1){box(4.85,4.9,.7,.6,.35,.1,C.amber,C.amber,C.amber);box(5.45,4.9,.7,.22,.35,.1,'#d3ad85','#d3ad85','#d3ad85');const eye=p(5.55,5.1,.81);c.fillStyle=C.ink;c.fillRect(eye[0],eye[1],.5,.5);}for(let x=4.6;x<5.8;x+=.2)box(x,5.45,.65,.025,.025,.3,C.wood);box(4.6,5.45,.95,1.1,.03,.03,C.wood);});
add(10,()=>{const f=furniture[2],seat=furniture[3];box(f.x,f.y,.2,f.w,f.d,.7,C.wood);box(6.1,3.7,.91,.4,.3,.02,C.paper);box(seat.x,seat.y,.2,seat.w,seat.d,.35,C.wood);});
add(6,()=>tree(1,4));add(16,()=>tree(9,6));add(6,()=>tree(4,1));add(20,()=>tree(5,15));add(26,()=>tree(14,12));
add(6,()=>building(-.5,-.5,2.5,2,1.4,'MARKET'));add(12,()=>building(9,-1,3,2,1.8,'SCHOOL'));add(18,()=>building(11,3,3,2,2,'WORK'));add(22,()=>building(1,11,2.3,2,1.6,'CLINIC'));
add(3,()=>{building(-2,-2,1.3,1.3,2.6,'');building(0,-3,1.5,1.3,3.2,'CITY');});
add(13,()=>{box(6.4,8.5,0,1.6,.8,.7,C.wood);box(6.25,8.35,1.65,1.9,1.1,.12,C.roofLight,C.roof,C.roof);for(const x of [6.4,7.9])box(x,8.5,.7,.05,.05,.95,C.wood);box(6.7,8.7,.7,.4,.35,.12,'#81765c');});
function person(x,y,shirt,floor=.2,size=1,activity=null){
 const q=p(x,y,floor),moving=activity?.moving,pose=activity?.pose??'stand';
 const seated=['rest','eat'].includes(pose),wave=moving?Math.sin(time*7)*2.3:Math.sin(time*2)*.3;
 c.save();c.translate(...q);c.scale(size,size);
 function limb(points,color,width){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
 const hip=seated?-4:-8,shoulder=seated?-11:-16,head=seated?-17:-22;
 if(seated){limb([[-2,hip],[-5,-1],[2,-1]],C.ink,2.1);limb([[2,hip],[5,-1],[-2,0]],C.ink,2.1);}
 else{limb([[-2,hip],[-2-wave*.45,-4],[-2+wave,0]],C.ink,2);limb([[2,hip],[2+wave*.45,-4],[2-wave,0]],C.ink,2);}
 c.fillStyle=shirt;c.beginPath();c.moveTo(-3.4,shoulder);c.lineTo(3.4,shoulder);c.lineTo(3,hip);c.lineTo(-3,hip);c.closePath();c.fill();
 const busy=['care','work','draw','study','garden','eat'].includes(pose),reach=busy?2+Math.sin(time*3)*1.3:wave;
 limb([[-3,shoulder+1],[-4,shoulder+5],[-3+reach,shoulder+7]],'#c5a075',1.5);
 limb([[3,shoulder+1],[4,shoulder+5],[3-reach,shoulder+7]],'#c5a075',1.5);
 c.fillStyle='#c5a075';c.beginPath();c.ellipse(0,head+2,3,3.6,0,0,Math.PI*2);c.fill();
 c.fillStyle=age>60&&shirt===C.amber?'#a2aaa0':'#304034';c.fillRect(-3,head-2,6,2.5);c.fillRect(-3.5,head,1.5,3);
 c.fillStyle=C.ink;if(pose==='rest'||time%4<.12)c.fillRect(.4,head+2,1.4,.4);else c.fillRect(.8,head+1.5,.7,.8);
 if(pose==='eat'){c.fillStyle=C.paper;c.fillRect(0,shoulder+6,3,1.5);}if(pose==='draw'){limb([[2,shoulder+5],[5,shoulder+3]],C.wood,.5);}if(pose==='study'){c.fillStyle=C.paper;c.fillRect(-3,shoulder+6,6,2);}
 if(pose==='exercise'){limb([[-3,shoulder+1],[-5,shoulder-2-Math.sin(time*4)*2]],'#c5a075',1.5);}
 c.restore();
}
function ground(x,y){if(x<3||x>7||y<3||y>7.2)return 0;return y>6.6?Math.max(0,(7.2-y)/.6*.2):.2;}
const goal=state.profiles.at(-1)?.profile.aim??'balance';
const mom=routine('mother',age,time,goal),dad=routine('father',age,time,goal);
if(age<70)add(mom.x+mom.y,()=>person(mom.x,mom.y,'#708a79',ground(mom.x,mom.y),1,mom));
if(age<55)add(dad.x+dad.y,()=>person(dad.x,dad.y,'#9a7a56',ground(dad.x,dad.y),1,dad));
if(age>=1){const child=routine('player',age,time,goal);add(child.x+child.y,()=>{const floor=ground(child.x,child.y),q=p(child.x,child.y,floor+.01);c.strokeStyle=C.amber;c.lineWidth=.5;c.beginPath();c.ellipse(q[0],q[1],5,2,0,0,Math.PI*2);c.stroke();person(child.x,child.y,C.amber,floor,age<10?.65:age>=65?.95:1,child);});}
if(age>=6){add(15,()=>person(8.4,6.4,'#c1ac76',0,.7));add(16,()=>person(9.2,6.4,'#7b8c9b',0,.7));}
if(age>=10){add(18,()=>{person(11.4,5.7,'#a8ac8e',0);});add(8,()=>{person(8.4,0,'#9b8979',0);});}
objects.sort((a,b)=>a.depth-b.depth);objects.forEach(o=>o.fn());
// Passing traffic has its own lane and remains independent of the player.
if(age>=5){const busX=-1+(time*.12%14);box(busX,7.25,.05,1.2,.55,.6,'#9caa93','#697d6d','#8f9b80');box(busX+.15,7.26,.65,.8,.5,.05,C.paper);}
c.restore();finish();
function finish(){const out=canvas.getContext('2d');out.imageSmoothingEnabled=false;if(canvas.width!==bw*2||canvas.height!==bh*2){canvas.width=bw*2;canvas.height=bh*2;}out.imageSmoothingEnabled=false;out.clearRect(0,0,bw*2,bh*2);out.drawImage(canvasBuffer,0,0,bw*2,bh*2);}
}
function drawCourse(c,s){
 c.fillStyle=C.water;c.fillRect(0,0,560,340);for(let x=0;x<560;x+=19)for(let y=50;y<300;y+=13){c.fillStyle=C.waterLight;c.fillRect(x+(y%7),y,5,1);}
 const pts=Array.from({length:17},(_,i)=>{const t=i/16;return[55+t*450,275-t*190]});
 c.fillStyle=C.sand;c.beginPath();c.moveTo(20,278);c.lineTo(505,47);c.lineTo(548,88);c.lineTo(65,315);c.closePath();c.fill();
 c.fillStyle=C.land;c.beginPath();c.moveTo(28,275);c.lineTo(504,55);c.lineTo(538,88);c.lineTo(65,307);c.closePath();c.fill();
 // Each five-year station is a tiny piece of land on the course.
 for(let i=0;i<pts.length;i++){const[x,y]=pts[i];c.fillStyle=i%3===0?'#9eac72':'#7f965f';c.beginPath();c.moveTo(x-18,y);c.lineTo(x,y-9);c.lineTo(x+18,y);c.lineTo(x,y+9);c.closePath();c.fill();
 const side=i%2===0?-1:1,ox=x+side*8,oy=y-side*22;
 if(i%4===0){c.fillStyle=C.shade;c.fillRect(ox-7,oy-4,14,12);c.fillStyle=C.wall;c.fillRect(ox-6,oy-4,12,9);c.fillStyle=C.roof;c.beginPath();c.moveTo(ox-9,oy-4);c.lineTo(ox,oy-12);c.lineTo(ox+9,oy-4);c.closePath();c.fill();c.fillStyle=C.ink;c.fillRect(ox-1,oy,3,5);}
 else if(i%4===1){for(let j=0;j<3;j++){c.fillStyle=C.wood;c.fillRect(ox+j*4-4,oy,1,5);c.fillStyle=C.leaf;c.fillRect(ox+j*4-6,oy-4,5,5);}}
 else if(i%4===2){c.fillStyle='#b4a474';c.fillRect(ox-6,oy-5,13,10);for(let j=0;j<3;j++){c.fillStyle=C.grass;c.fillRect(ox-5+j*4,oy-4,2,8);}}
 else{c.fillStyle=C.paper;c.fillRect(ox-7,oy-5,14,8);c.fillStyle=C.roof;c.fillRect(ox-8,oy-7,16,3);c.fillStyle=C.ink;for(let j=0;j<3;j++)c.fillRect(ox-5+j*4,oy-3,2,2);}}
 c.strokeStyle='#eee2bc';c.lineWidth=2;c.setLineDash([4,4]);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();c.setLineDash([]);
 const actual=s.history.map(r=>{const base=pts[Math.round(r.age/5)],diff=AXES.reduce((n,a)=>n+Math.abs(r.effort[a.key]-(s.original?.[a.key]??2)),0);return[base[0],base[1]+diff*1.5+(r.setback>0?10:0)];});
 c.strokeStyle=C.amber;c.lineWidth=3;c.beginPath();actual.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();
 for(let i=0;i<pts.length;i++){const[x,y]=pts[i];c.fillStyle=i*5<=s.age?C.amber:C.paper;c.fillRect(x-2,y-2,4,4);c.fillStyle='#142c2b';c.font='600 8px '+worldFont();c.textAlign='center';c.fillText(String(i*5),x,y+(i%2===0?18:-12));}
 for(const[x,y]of actual){c.fillStyle=C.amber;c.fillRect(x-3,y-3,6,6);}
 c.fillStyle='#193f3c';c.fillRect(0,0,560,47);c.fillRect(0,304,560,36);c.fillStyle=C.paper;c.font='600 12px '+worldFont();c.textAlign='left';c.fillText(t('THE COURSE OF A LIFE'),16,20);c.font='8px '+worldFont();c.fillText(t('Amber: lived path     Dashed: age stations still ahead'),16,36);c.fillText(t('Detours record changed priorities and disruptive events.'),16,319);if(s.death)c.fillText(t('Life ended at '+s.age+'. The remaining years were never promised.'),16,332);
}

function worldFont(){return preferences.language==='th'?'Prompt':preferences.language==='zh-CN'?'Noto Sans SC':preferences.language==='ja'?'Noto Sans JP':preferences.language==='ko'?'Noto Sans KR':'Jost';}
