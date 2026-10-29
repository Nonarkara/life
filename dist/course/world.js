import {drawRouteMap} from './routemap.js';
import {drawScene3D,showPaintedCanvas} from './scene3d.js';
import {drawStage2D,stageCaption,paintedCovers,paintedDay,stageArtFailed} from './stage2d.js';
import {animeManifest} from './anime-assets.js';
import {t,preferences} from './i18n.js';
import {lifeMoodAt,MOOD_CHORDS} from './events.js';
import {canvasWorld} from './palettes.js';
import {AXES} from './sim.js';
import {furniture,townGrowth} from './layout.js';
import {routine,routineContext} from './routines.js';
import {RESIDENCES,roomFurniture} from './locations.js';
import {revealedPlaces,floorAt,CITY_BLOCKS} from './district3d.js';
const C={land:'#7d9764',grass:'#9caf73',sand:'#c7b582',water:'#507e82',waterLight:'#7dabad',road:'#c8bba1',edge:'#a59375',wall:'#eed7aa',shade:'#c4aa80',roof:'#a15f49',roofLight:'#bb7b57',wood:'#6b5740',ink:'#273d35',leaf:'#476b48',lightleaf:'#668651',paper:'#eee2bc',amber:'#f59e0b'};
const canvasBuffer=document.createElement('canvas');canvasBuffer.width=560;canvasBuffer.height=340;
// The first time the world is on screen, by any route (painted, 3D or the flat canvas),
// the loading placeholder may go. Holding a surface while art decodes does not count.
let firstPaint=false;
export function drawWorld(canvas,state,age,time,mode='world',view={}){
 const result=paintWorld(canvas,state,age,time,mode,view);
 if(!firstPaint&&!result?.held){firstPaint=true;window.dispatchEvent(new Event('life-first-frame'));}
 return result;
}
function paintWorld(canvas,state,age,time,mode='world',view={}){
 // Hybrid keeps ordinary routines in3D and paints supported recorded moments.
 // Explicit world preferences remain available; drawing never changes the life.
 if(preferences.stage!=='isometric'){
  if(drawStage2D(canvas,state,age,time,mode,view)){showPaintedCanvas(canvas);return {caption:stageCaption(canvas)};}
  // The painting may cover this scene but has not finished decoding. Holding
  // the surface is better than showing a different world for a moment.
  if(mode==='world'){
   // Until the art manifest is in, nothing says whether this life is painted: hold the surface
   // rather than flash the 3D world and then change it. If the art cannot be fetched, go on in 3D.
   if(!animeManifest()&&!stageArtFailed()){canvas.hidden=false;return {held:true};}
   if(preferences.stage==='painted'?paintedDay(state,age):paintedCovers(state,age,time)){canvas.hidden=false;return {held:true};}
  }
}
 if(drawScene3D(canvas,state,age,time,mode,view))return;
const context=routineContext(state,age),revealed=revealedPlaces(state,age);
const labels=[];
Object.assign(C,canvasWorld()??MOOD_CHORDS[lifeMoodAt(state,age)]);const portrait=state.stage==='birth'&&canvas.clientWidth<721;const bw=portrait?240:560,bh=portrait?Math.round(240*canvas.clientHeight/canvas.clientWidth):mode==='world'&&document.body.classList.contains('console-mode')?Math.max(180,Math.round(560*canvas.clientHeight/Math.max(1,canvas.clientWidth))):340;if(canvasBuffer.width!==bw||canvasBuffer.height!==bh){canvasBuffer.width=bw;canvasBuffer.height=bh;}const c=canvasBuffer.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#243f38';c.fillRect(0,0,bw,bh);
if(mode==='course'){drawRouteMap(canvas,state);return;}
const zoom=(age<10?6-age*.42:age<20?1.8-(age-10)*.01:Math.max(1.25,1.7-(age-20)*.011))*(portrait?.7:1);const focus=routine('player',age,time,state.profiles.at(-1)?.profile.aim??'balance',context),follow=age<6?0:.7;const center=[(focus.x-focus.y)*15*follow,75*(1-follow)+(focus.x+focus.y)*7.5*follow];
c.save();c.translate(bw/2,portrait?bh*.56:document.body.classList.contains('console-mode')&&state.stage!=='birth'?bh*.56:age<3?215:190);c.scale(zoom,zoom);c.translate(-center[0],-center[1]);
const p=(x,y,z=0)=>[(x-y)*15,(x+y)*7.5-z*15];
function poly(v,col){c.beginPath();v.forEach((a,i)=>i?c.lineTo(...p(...a)):c.moveTo(...p(...a)));c.closePath();c.fillStyle=col;c.fill();}
function box(x,y,z,w,d,h,top=C.paper,side=C.shade,front=C.wall){poly([[x,y,z],[x,y+d,z],[x,y+d,z+h],[x,y,z+h]],side);poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],front);poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],top);}
function line(a,b,col,w=.4){c.beginPath();c.moveTo(...p(...a));c.lineTo(...p(...b));c.strokeStyle=col;c.lineWidth=w;c.stroke();}
// Place names are drawn on the final canvas at a fixed screen size, above everything.
function label(x,y,text){const m=c.getTransform().transformPoint(new DOMPoint(...p(x,y,.1)));labels.push([m.x,m.y,t(text)]);}
function tree(x,y){box(x,y,0,.15,.15,1.2,C.wood,C.wood,C.wood);box(x-.45,y-.45,1,1,1,.65,C.lightleaf,C.leaf,C.leaf);box(x-.25,y-.25,1.65,.6,.6,.35,C.lightleaf,C.leaf,C.leaf);}
function building(x,y,w,d,h,name){box(x,y,0,w,d,h);poly([[x-.15,y-.15,h],[x+w+.15,y-.15,h],[x+w+.15,y+d/2,h+.5],[x-.15,y+d/2,h+.5]],C.roofLight);poly([[x-.15,y+d/2,h+.5],[x+w+.15,y+d/2,h+.5],[x+w+.15,y+d+.15,h],[x-.15,y+d+.15,h]],C.roof);poly([[x+w+.01,y,h],[x+w+.01,y+d/2,h+.5],[x+w+.01,y+d,h]],C.wall);for(let a=x+.3;a<x+w-.3;a+=.6){poly([[a,y+d+.01,.5],[a+.3,y+d+.01,.5],[a+.3,y+d+.01,1],[a,y+d+.01,1]],'#526b61');}box(x+w*.45,y+d,.02,.5,.12,.9,C.wood,C.wood,C.wood);if(age>=10)label(x+w/2,y+d+.6,name);}
// Persistent land, coast and water exist before the camera can see them.
poly([[-16,-6,0],[40,-6,0],[40,24,0],[-16,24,0]],C.water);for(let x=-8;x<22;x+=1.1)for(let y=-5;y<20;y+=1.8)line([x,y,.01],[x+.35,y,.01],C.waterLight,.22);
poly([[-3,-3,.01],[15,-3,.01],[17,1,.01],[16,15,.01],[3,17,.01],[-4,10,.01]],C.sand);
poly([[-2.5,-2.5,.02],[14.5,-2.5,.02],[16.5,1,.02],[15.5,14.5,.02],[3,16.5,.02],[-3.5,9.5,.02]],C.land);
for(let x=-2;x<16;x+=.6)for(let y=-2;y<15;y+=.8){if((Math.round(x*10)+Math.round(y*10))%3===0)line([x,y,.03],[x+.13,y+.06,.03],C.grass,.22);}
// Street axes, shared continuous ground plane and paths.
poly([[-2,7,.04],[15,7,.04],[15,8.1,.04],[-2,8.1,.04]],C.road);poly([[7.2,-2,.04],[8.2,-2,.04],[8.2,15,.04],[7.2,15,.04]],C.road);
for(let x=-1;x<15;x+=1.5)line([x,7.55,.05],[x+.6,7.55,.05],C.paper,.14);
if(revealed.homes.has('far')){box(-11,2,.01,7,7,.02,C.land);box(-11,6.8,.01,9,1.6,.02,C.land);box(-11,7,.04,9,1.1,.02,C.road);}
if(revealed.city||revealed.homes.has('nearLocal')){box(15,6.8,.01,20,2.7,.02,C.land);box(15,7,.04,20,1.1,.02,C.road);if(revealed.city){box(31.2,7,.01,1.8,8.4,.02,C.land);box(31.5,7,.04,1.1,8.4,.02,C.road);box(28.5,13.8,.04,4,1,.02,C.road);}}
// Flood is an environmental event, never a scene reset.
if(state.history.some(r=>r.age===30)&&age>=30&&age<36)poly([[1,6.8,.07],[10,6.8,.07],[10,8.4,.07],[1,8.4,.07]],'#719a97');
// Farm plots and football pitch are districts, not floating props.
for(let i=0;i<4;i++){poly([[-1+i*.6,1,.04],[-.65+i*.6,1,.04],[-.65+i*.6,4,.04],[-1+i*.6,4,.04]],'#b5a05f');for(let y=1.2;y<4;y+=.3)box(-1+i*.6,y,.05,.25,.15,.18,C.grass,C.leaf,C.leaf);}
// Neighbourhood canal pond and football pitch
poly([[3.1,8.75,.03],[5.5,8.75,.03],[5.5,10.35,.03],[3.1,10.35,.03]],C.edge);
poly([[3.22,8.87,.04],[5.38,8.87,.04],[5.38,10.23,.04],[3.22,10.23,.04]],C.water);
poly([[4.02,8.35,.05],[4.58,8.35,.05],[4.58,9.1,.05],[4.02,9.1,.05]],C.wood);
poly([[9,9,.04],[13,9,.04],[13,12,.04],[9,12,.04]],'#65875a');for(const pair of [[[9,9,.06],[13,9,.06]],[[13,9,.06],[13,12,.06]],[[13,12,.06],[9,12,.06]],[[9,12,.06],[9,9,.06]],[[11,9,.06],[11,12,.06]]])line(...pair,C.paper,.15);
// Home is a cutaway, so walls never disappear arbitrarily with camera time.
box(3,3,0,4,4,.2,'#ad9064');for(let x=3;x<7;x+=.35)line([x,3,.21],[x,7,.21],'#92764f',.12);box(3,3,.2,4,.12,1.8,C.wall,C.shade,C.wall);box(3,3,.2,.12,4,1.8,C.wall,C.shade,C.shade);
poly([[4,3.13,.8],[5.6,3.13,.8],[5.6,3.13,1.6],[4,3.13,1.6]],'#78958b');line([4.8,3.14,.8],[4.8,3.14,1.6],C.wood,.12);
const objects=[];const add=(depth,fn)=>objects.push({depth,fn});
for(const id of revealed.homes){if(id==='family')continue;const room=RESIDENCES[id],[x,y]=room.base;add(x+y+8,()=>{
 box(x-.6,y-.6,.01,5.2,5.2,.02,C.land);box(x,y,0,4,3.6,.2,C.wood);poly([[x,y+3.6,.2],[x+4,y+3.6,.2],[x+4,y+4.2,0],[x,y+4.2,0]],C.wood);box(x,y,.2,4,.1,2,C.wall);box(x,y,.2,.1,3.6,2,C.wall);box(x+1,y+.12,.9,1.6,.04,.9,'#78918a');
 const [bed,sofa,desk]=roomFurniture(room);box(bed.x,bed.y,.2,bed.w,bed.d,.4,C.wood);box(bed.x+.04,bed.y+.04,.6,bed.w-.08,bed.d-.08,.12,C.paper);box(bed.x+.04,bed.y+.6,.73,bed.w-.08,bed.d-.65,.04,'#769282');box(sofa.x,sofa.y,.2,sofa.w,sofa.d,.4,'#8b9b89');box(sofa.x,sofa.y,.6,sofa.w,.13,.4,'#788a77');box(desk.x,desk.y,.2,desk.w,desk.d,.65,C.wood);box(desk.x+.08,desk.y+.1,.86,.32,.24,.02,C.paper);
 box(room.origin[0]-.2,room.origin[1]-.2,.2,.4,.4,.45,C.wood);box(x+.15,y+.18,.2,.5,.22,1.15,C.wood);tree(x+2.7,y+.35);if(age>=20)label(x+1.8,y+4.5,room.label);
});}
if(revealed.city){box(23.2,8.2,.005,10.4,9.4,.02,'#a7a18b');for(const b of CITY_BLOCKS)add(b.x+b.z+b.w+b.d,()=>{box(b.x,b.z,0,b.w,b.d,b.h,'#8d8b78',C.shade,C.wall);box(b.x-.05,b.z-.05,b.h,b.w+.1,b.d+.1,.12,'#8d8b78');});}
if(revealed.city)add(36,()=>{box(24.4,2.4,.01,6.2,4.6,.02,C.land);building(25,3,5,2.2,2.4,'City work district');box(26.86,6.11,.78,.83,.52,.06,C.wood);box(27.1,5.6,0,.4,.4,.5,C.wood);if(context.pathway==='vocational')box(27.08,6.24,.85,.3,.18,.08,'#bea37a');else{box(27.06,6.2,.85,.34,.23,.025,'#536760');box(27.06,6.4,.87,.34,.025,.23,'#526a66');}tree(30,8.7);});

add(12.8,()=>{const f=furniture.find(f=>f.id==='dining');box(f.x,f.y,.2,f.w,f.d,.75,C.wood);});
add(7.4,()=>{const f=furniture[0];box(f.x,f.y,.2,f.w,f.d,.4,C.wood);box(3.3,3.5,.6,1.15,1.7,.12,C.paper);box(3.3,4,.73,1.15,1.2,.04,'#6a8a75');box(3.45,3.6,.73,.8,.3,.04,C.paper);});
// Cradle stays in the same place through infancy and childhood.
add(10,()=>{const f=furniture[1];box(f.x,f.y,.2,f.w,f.d,.45,C.wood);box(4.68,4.68,.65,.94,.74,.04,C.paper);if(age<1){box(4.85,4.9,.7,.6,.35,.1,C.amber,C.amber,C.amber);box(5.45,4.9,.7,.22,.35,.1,'#d3ad85','#d3ad85','#d3ad85');const eye=p(5.55,5.1,.81);c.fillStyle=C.ink;c.fillRect(eye[0],eye[1],.5,.5);}for(let x=4.6;x<5.8;x+=.2)box(x,5.45,.65,.025,.025,.3,C.wood);box(4.6,5.45,.95,1.1,.03,.03,C.wood);});
add(10,()=>{const f=furniture[2],seat=furniture[3];box(f.x,f.y,.2,f.w,f.d,.7,C.wood);box(6.1,3.7,.91,.4,.3,.02,C.paper);box(seat.x,seat.y,.2,seat.w,seat.d,.35,C.wood);});
add(6,()=>tree(1,4));add(16,()=>tree(9,6));add(6,()=>tree(4,1));add(20,()=>tree(5,15));add(26,()=>tree(14,12));
add(6,()=>building(-.5,-.5,2.5,2,1.4,'MARKET'));add(12,()=>building(9,-1,3,2,1.8,'SCHOOL'));add(18,()=>building(11,3,3,2,2,'WORK'));add(22,()=>building(1,11,2.3,2,1.6,'CLINIC'));
add(3,()=>{building(-2,-2,1.8,1.5,1.4,'');building(0,-3,1.9,1.6,1.7,'CITY');});
// The town keeps building while you live in it; each house stays once it appears.
for(const[from,x,y,w,d,h]of townGrowth)if(age>=from)add(x+y+w+d,()=>building(x,y,w,d,h,''));
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
function ground(x,y){return floorAt(x,y)*1.25;}
const goal=state.profiles.at(-1)?.profile.aim??'balance';
const mom=routine('mother',age,time,goal,context),dad=routine('father',age,time,goal,context);
if(age<70)add(mom.x+mom.y,()=>person(mom.x,mom.y,'#708a79',ground(mom.x,mom.y),1,mom));
if(age<55)add(dad.x+dad.y,()=>person(dad.x,dad.y,'#9a7a56',ground(dad.x,dad.y),1,dad));
if(age>=1){const child=routine('player',age,time,goal,context);add(child.x+child.y,()=>{const floor=ground(child.x,child.y),q=p(child.x,child.y,floor+.01);c.strokeStyle=C.amber;c.lineWidth=.5;c.beginPath();c.ellipse(q[0],q[1],5,2,0,0,Math.PI*2);c.stroke();person(child.x,child.y,C.amber,floor,age<10?.65:age>=65?.95:1,child);});}
if(age>=6){add(15,()=>person(8.4,6.4,'#c1ac76',0,.7));add(16,()=>person(9.2,6.4,'#7b8c9b',0,.7));}
if(age>=10){add(18,()=>{person(12.9,6.3,'#a8ac8e',0);});add(8,()=>{person(8.4,0,'#9b8979',0);});}
objects.sort((a,b)=>a.depth-b.depth);objects.forEach(o=>o.fn());
// Passing traffic has its own lane and remains independent of the player.
if(age>=5){const busX=-1+(time*.12%14);box(busX,7.25,.05,1.2,.55,.6,'#9caa93','#697d6d','#8f9b80');box(busX+.15,7.26,.65,.8,.5,.05,C.paper);}
c.restore();finish();
function finish(){const out=canvas.getContext('2d');out.imageSmoothingEnabled=false;if(canvas.width!==bw*2||canvas.height!==bh*2){canvas.width=bw*2;canvas.height=bh*2;}out.imageSmoothingEnabled=false;out.clearRect(0,0,bw*2,bh*2);out.drawImage(canvasBuffer,0,0,bw*2,bh*2);if(!labels.length)return;const k=canvas.width/Math.max(1,canvas.clientWidth),size=11*k,pad=3*k;out.font='600 '+size+'px '+worldFont();out.textAlign='center';out.textBaseline='middle';for(const[x,y,text]of labels){const w=out.measureText(text).width,cx=Math.min(Math.max(x*2,w/2+pad),bw*2-w/2-pad);if(y*2<0||y*2>bh*2)continue;out.fillStyle=C.paper;out.fillRect(cx-w/2-pad,y*2-size/2-pad,w+pad*2,size+pad*2);out.fillStyle=C.ink;out.fillText(text,cx,y*2);}}
}
function drawCourse(c,s,compact=false){
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
 for(let i=0;i<pts.length;i++){const[x,y]=pts[i];c.fillStyle=i*5<=s.age?C.amber:C.paper;c.fillRect(x-2,y-2,4,4);c.fillStyle='#142c2b';c.font='600 '+(compact?18:8)+'px '+worldFont();c.textAlign='center';if(!compact||i%4===0)c.fillText(String(i*5),x,y+(compact?24:i%2===0?18:-12));}
 for(const[x,y]of actual){c.fillStyle=C.amber;c.fillRect(x-3,y-3,6,6);}
 // The course key and explanation live in readable HTML beneath the canvas.

}

function worldFont(){return preferences.language==='th'?'Prompt':preferences.language==='zh-CN'?'Noto Sans SC':preferences.language==='ja'?'Noto Sans JP':preferences.language==='ko'?'Noto Sans KR':'Jost';}
