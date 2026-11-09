// The zoom. Ordinary days stay painted; a moment that changes the life opens here,
// at eye level, in metres, with the rigged cast facing the camera so both eyes read.
import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {createCharacter} from './character3d.js';
import {loadAnimeCast,attachAnime} from './character-anime.js';
import {lightRamp} from './art-direction.js';
import {appearance,regionAt,regionIdFor} from './regions.js';
import {rand} from './sim.js';
import {preferences} from './i18n.js';
import {momentPlan} from './moment-plan.js';
let stage=null,dead=false,token=0;
const toon=new Map(),mat=c=>{if(!toon.has(c))toon.set(c,new T.MeshToonMaterial({color:c,gradientMap:lightRamp()}));return toon.get(c);};
const unit=new T.BoxGeometry(1,1,1);
function kit(root){
 // Every box sits on its base at y.
 const box=(w,h,d,x,y,z,c,shadow=true)=>{const m=new T.Mesh(unit,mat(c));m.scale.set(w,h,d);m.position.set(x,y+h/2,z);m.castShadow=shadow;m.receiveShadow=true;root.add(m);return m;};
 const glow=(w,h,x,y,z,c)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:c}));m.position.set(x,y+h/2,z);root.add(m);return m;};
 const tree=(x,z,h=5)=>{box(.28,h,.28,x,0,z,'#6b5740');for(let i=0;i<5;i++){const a=i*1.26;const f=box(2.6,.09,.5,x+Math.cos(a)*1.2,h-.2-(i%2)*.25,z+Math.sin(a)*1.2,'#476b48');f.rotation.y=-a;}};
 const pole=(x,z)=>{box(.18,8,.18,x,0,z,'#7a7a70');box(1.6,.08,.08,x,7.4,z,'#7a7a70');};
 const car=(x,z,c)=>{box(1.7,.6,4,x,.3,z,c);box(1.5,.55,2,x,.9,z-.2,'#384a4e');for(const a of [-.85,.85])for(const b of [-1.3,1.3])box(.2,.56,.56,x+a,0,z+b,'#23282a');};
 return {box,glow,tree,pole,car};
}
// Hundreds of bodies as two draw calls. Nobody in a crowd is close enough to need a face.
const part=(g,x,y,z)=>{g.translate(x,y,z);return g;},cyl=(a,b,h,x,y,z)=>part(new T.CylinderGeometry(a,b,h,8),x,y,z);
// A person's outline in one mesh per colour: shirt, trousers, skin, hair. Heights in metres.
const FIGURE={shirt:mergeGeometries([cyl(.2,.16,.58,0,1.14,0),cyl(.045,.04,.56,-.24,1.14,0),cyl(.045,.04,.56,.24,1.14,0)]),legs:mergeGeometries([cyl(.08,.06,.84,-.09,.42,0),cyl(.08,.06,.84,.09,.42,0)]),skin:mergeGeometries([part(new T.SphereGeometry(.105,10,8),0,1.59,0),cyl(.045,.045,.1,0,1.46,0),part(new T.SphereGeometry(.04,6,5),-.24,.84,0),part(new T.SphereGeometry(.04,6,5),.24,.84,0)]),hair:part(new T.SphereGeometry(.116,10,8),0,1.62,-.02)};
function crowd(root,n,fn,seed){
 const flat=new T.MeshToonMaterial({gradientMap:lightRamp()}),make=(g,m)=>{const x=new T.InstancedMesh(g,m,n);x.castShadow=true;root.add(x);return x;},shirt=make(FIGURE.shirt,flat),legs=make(FIGURE.legs,mat('#3b3f3f')),skin=make(FIGURE.skin,mat('#b88b69')),hair=make(FIGURE.hair,mat('#1f1d1a')),o=new T.Object3D(),col=new T.Color(),shirts=['#d9c9a6','#e5dfcc','#c9b58c','#a8b6ac','#bd914d','#8a9a8c','#c7a07a'];
 for(let i=0;i<n;i++){const [x,z]=fn(i),h=.93+rand(seed,i,'crowd-h')*.13;o.position.set(x,0,z);o.rotation.y=(rand(seed,i,'crowd-r')-.5)*.5;o.scale.setScalar(h);o.updateMatrix();for(const m of [shirt,legs,skin,hair])m.setMatrixAt(i,o.matrix);col.set(shirts[Math.floor(rand(seed,i,'crowd-c')*shirts.length)]);shirt.setColorAt(i,col);}
}
function row(k,p,x,face){let z=8;for(const s of [...p.rows,...p.rows,...p.rows]){const h=s.storeys*3.2;k.box(6,h,s.width,x+face*3,0,z-s.width/2,s.wall);k.box(.08,2.5,s.width-.6,x-face*.02,0,z-s.width/2,'#55696a',false);k.box(1.5,.1,s.width-.2,x-face*.7,2.8,z-s.width/2,s.awning);for(let f=1;f<s.storeys;f++)for(const a of [-1,1])k.box(.06,1.5,1,x-face*.03,f*3.2+.8,z-s.width/2+a*s.width*.24,p.night?'#f0c777':'#46595a',false);z-=s.width+.05;}}
const SETS={
 soi(k,p){const w=5.5;row(k,p,-w,-1);row(k,p,w,1);k.box(14,.02,110,0,0,-40,'#a59f8f',false);k.box(14,9,6,0,0,-88,p.rows[2].wall);if(p.poles)for(const z of [5,-8,-21])k.pole(p.side*(w-.7),z);for(let i=0;i<p.cars;i++)k.car(p.side*-3.6,-4-i*7,['#8a4d3c','#d9d2bd','#46595a'][i%3]);if(p.skyline)k.box(14,p.tower*3.2,14,p.side*9,0,-46,'#9aa6a2');},
 village(k,p){const x=p.side*4.6,hz=-12;for(const a of [-2.4,2.4])for(const b of [-2,2])k.box(.24,2.5,.24,x+a,0,hz+b,'#6b5740');k.box(6.4,.2,5.4,x,2.5,hz,'#7c5f42');k.box(5.6,2.5,4.6,x,2.7,hz,'#8a6c4a');const left=k.box(4.2,.14,5.6,x-1.5,6.05,hz,p.roof),right=k.box(4.2,.14,5.6,x+1.5,6.05,hz,p.roof);left.rotation.z=.6;right.rotation.z=-.6;for(let i=0;i<6;i++)for(let j=0;j<4;j++)k.box(11,.06,8.6,-p.side*(9+i*0)+(-p.side)*j*12,0,-4-i*10,i%2?p.water:'#8fa062',false);for(let i=0;i<p.trees;i++)k.tree(-p.side*(4.2+i*1.3),-14-i*5,5+i*.5);k.box(5,.03,60,0,0,-16,'#b5a789',false);if(p.poles&&p.year>=1975)for(const z of [2,-14,-30])k.pole(-p.side*3.4,z);},
 temple(k,p){k.box(26,4.6,.5,0,0,-13,'#e8e0cc');const scr=k.glow(9,3.2,0,1,-12.7,'#f7efd5');scr.userData.flicker=true;for(let i=0;i<3;i++)k.box(16-i*4,.5,6-i*1.2,p.side*11,6+i*1.5,-16,i%2?'#c98a3c':'#bd5038');k.box(20,6,5,p.side*11,0,-16,'#ded3b8');if(p.year>=1958){k.box(2.1,1.8,5,-p.side*9,.5,-7,'#c8c2ae');for(const a of [-1.8,1.8])k.box(.2,.6,.6,-p.side*9+a/2,0,-7+a,'#23282a');}crowd(k.root,Math.min(p.crowd,60),i=>[-10+(i%15)*1.4+(i*.37)%.4,-10+Math.floor(i/15)*1.3+1.2],p.year);},
 avenue(k,p){k.box(34,.02,90,0,0,-30,'#9b968a',false);{const c=p.rows[0].wall;k.box(44,9,5,0,0,-56,c);for(let i=0;i<10;i++)k.box(1.1,7.5,.6,-18+i*4,0,-53,'#efe7d2');k.box(46,1,6,0,9,-56,p.roof);for(const a of [-1,1])for(let i=0;i<3;i++)k.tree(a*(7+i*1.5),-16-i*9,6);}for(const a of [-1,1])for(let i=0;i<4;i++){const h=(p.rows[i].storeys+1)*3.2,z=-8-i*19;k.box(9,h,16,a*22,0,z,p.rows[i].wall);for(let f=0;f<Math.floor(h/3.2)-1;f++)for(let w=-2;w<=2;w++)k.box(.06,1.5,1.6,a*17.45,f*3.2+1.2,z+w*3,p.night?'#f0c777':'#46595a',false);k.tree(a*14.5,z+6,6);}for(let i=0;i<7;i++){const x=-13+i*4.3;k.box(.1,4,.1,x,0,-11,'#6b5740');k.box(1.8,1.1,.04,x+.95,2.8,-11,p.rows[i%6].awning);}for(let i=0;i<Math.min(p.cars,2);i++)k.box(2.4,2.6,7,-p.side*(7+i*5),0,-27,'#5f6b55');crowd(k.root,p.crowd*2,i=>[-14+(i%22)*1.32+(i*.41)%.7,-6-Math.floor(i/22)*1.45],p.year+1);},
 gate(k,p){k.box(40,3.4,.4,0,0,-9,'#b8bca9');for(let i=0;i<9;i++)k.box(.12,3,.12,-3.6+i*.9,0,-8.7,'#55696a');k.box(7.4,.14,.14,0,2.95,-8.7,'#55696a');k.box(.9,1.2,.03,.3,1,-8.6,'#f0ead8',false);k.box(26,8,16,p.side*6,0,-20,'#a9a999');for(let i=0;i<4;i++){const c=k.box(1.2,9,1.2,-p.side*(6+i*3.6),4,-22,'#8a8a7c');c.visible=i<2;}crowd(k.root,Math.min(p.crowd,36),i=>[-8+(i%12)*1.5+(i*.53)%.9,-5.8-Math.floor(i/12)*1.1],p.year);},
 airfield(k,p){k.box(50,.03,14,0,0,-20,'#8f8b7f',false);for(let i=0;i<25;i++)k.box(.08,2.3,.08,-24+i*2,0,-7,'#6f7a72');k.box(50,.05,.05,0,2.25,-7,'#6f7a72');const hull=new T.Mesh(new T.CylinderGeometry(1.5,1.5,24,16),mat('#c8c8bc'));hull.rotation.z=Math.PI/2;hull.position.set(-p.side*2,2.6,-20);hull.castShadow=true;k.root.add(hull);k.box(5,.25,25,-p.side*2,2.2,-20,'#b5b5a8');k.box(.2,4,3,-p.side*2+p.side*11,3.4,-20,'#b5b5a8');k.box(16,7,12,p.side*19,0,-30,'#9aa49b');for(let i=0;i<Math.min(p.trees,5);i++)k.tree(-22+i*3,-3.5,5);},
 water(k,p){k.box(120,.4,120,0,0,-20,p.water,false);row(k,p,-6.5,-1);row(k,p,6.5,1);k.box(4.6,.55,60,0,0,-18,'#7c5f42');for(let i=0;i<22;i++)k.box(4.7,.03,.06,0,.55,8-i*2.4,'#5f4a34',false);k.box(1.1,.34,3.6,p.side*3.6,.4,-3,'#6b5740');for(let i=0;i<p.trees;i++)k.tree(p.side*-(4+i*.9),-20-i*3,4.2);},
 table(k,p){k.box(40,.1,30,0,0,8,p.floor,false);k.box(2.4,1.8,.25,-1.6*p.side,1,-6.35,'#7c5f42');for(let i=0;i<3;i++)k.box(2.2,.04,.22,-1.6*p.side,1.3+i*.45,-6.2,'#c9b58c',false);k.box(9,3.2,.15,0,0,-6.5,p.wall);k.box(.15,3.2,8,-4.5*p.side,0,-2.5,p.wall);k.box(1.4,1.3,.05,1.4*p.side,1.1,-6.4,p.night?'#25323a':'#cfe0dd',false);k.box(2.2,.09,1.1,0,.72,-1.2,'#7c5f42');for(const a of [-1,1])for(const b of [-.45,.45])k.box(.08,.72,.08,a,0,-1.2+b,'#5f4a34');k.box(.34,.42,.34,.55,.81,-1.2,'#c98a3c');k.box(.22,.02,.3,-.5,.81,-1.1,'#efe7d2',false);},
 fork(k,p){const road='#b5a789',arm=(a,len)=>{const r=k.box(2.6,.03,len,Math.sin(a)*len/2,0,-Math.cos(a)*len/2,road,false);r.rotation.y=-a;};k.box(2.6,.03,16,0,0,8,road,false);arm(0,80);arm(.3,44);arm(-.3,44);
  const hx=-p.side*9.5;k.box(4.6,2.8,3.8,hx,.9,-30,'#8a6c4a');for(const a of [-1.8,1.8])k.box(.2,.9,.2,hx+a,0,-30,'#6b5740');k.box(6,.22,5.2,hx,3.7,-30,p.roof);
  const bx=p.side*10;k.box(10,5.5,7,bx,0,-34,'#e6dcc6');k.box(12,.3,9,bx,5.5,-34,p.roof);k.box(1,14,1,bx+p.side*5.5,0,-37,'#8a8a7c');
  const tall=p.year<1980?5:p.year<1995?12:24;for(let i=0;i<5;i++)k.box(4.4,tall*(.6+((i*.37)%.5)),4.4,-9+i*4.4,0,-84-(i%2)*4,i%2?'#9aa6a2':'#a9b1ad');
  for(let i=0;i<p.trees;i++){const a=i%2?1:-1;k.tree(a*(3.4+i*.8),-10-i*3.2,4.2+i*.3);}for(const[a,w]of [[-1,'#8fa062'],[1,p.water]])k.box(14,.05,10,a*9,0,-4,w,false);}
};
function dress(state,key,sex,age){const cls=state.intake?.class??state.birth?.class,rich=['high_class','royal_associated'].includes(cls),list=rich?['#efe9d8','#cfd8cf','#b9c6cf']:['#e6dcc4','#c9d2c2','#d8c7a4','#c7b8a2','#b9c6bf'];return {shirt:list[Math.floor(rand(state.seed,age>=40?1:0,key+'shirt')*list.length)],bottom:rich?'#384450':['#425546','#66535e','#78664e'][Math.floor(rand(state.seed,0,key+'bot')*3)]};}
function cast(group,state,plan,set){
 const age=state.age,here=regionAt(state,age),born=regionIdFor(state.birth),sex=state.intake?.sex??state.birth?.sex??'female',at=(key,s,x,z,elder=false)=>{const clothes=dress(state,key,s,age),a=createCharacter({...appearance(rand,state.seed,key,key==='player'?born:here,{sex:s,elder}),...clothes});attachAnime(a);a.setLook(clothes);group.add(a.root);return {a,x,z,elder};};
 const list=[at('player',sex,0,0,age>=60)];
 if(set==='table'){list[0].x=-1.1;list[0].z=.1;list.push(at('n0',sex==='male'?'female':'male',1.1,.1,age>=55));}
 else if(set!=='fork'&&set!=='airfield')list.push(at('n1',sex==='male'?'female':'male',innerWidth>720?-1.5:plan.side*1.5,-1.2));
 return list;
}
function build(state,plan){
 const root=new T.Group(),k={...kit(root),root},scene=new T.Scene(),bg=plan.night?'#1d2733':plan.sky;scene.background=new T.Color(bg);scene.fog=new T.Fog(bg,plan.night?14:26,plan.night?70:150);scene.add(root);
 const ground=new T.Mesh(new T.PlaneGeometry(240,240),mat(plan.set==='airfield'?'#8a8f6c':plan.ground));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;root.add(ground);
 scene.add(new T.HemisphereLight(plan.night?'#8799b0':'#f4e9c6','#6a6256',plan.night?1:1.5));const sun=new T.DirectionalLight(plan.night?'#a9b9d6':'#fff0d2',plan.night?1:2.6);sun.position.set(-14*plan.side,26,16);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);Object.assign(sun.shadow.camera,{left:-26,right:26,top:26,bottom:-26,far:90});sun.shadow.bias=-.0006;scene.add(sun);
 if(plan.night){const lamp=new T.PointLight('#ffcf8a',22,18);lamp.position.set(plan.side*1.4,3,2.2);scene.add(lamp);}
 SETS[plan.set](k,plan);
 const people=cast(root,state,plan,plan.set);
 return {scene,root,people,lift:plan.set==='water'?.55:0,flicker:root.children.filter(c=>c.userData.flicker)};
}
// Skinned cast meshes are detached before this runs; everything left belongs to this moment.
function disposeBuilt(built){const keepG=new Set([unit,...Object.values(FIGURE)]),keepM=new Set(toon.values());built.scene.traverse(o=>{if(o.isLight)o.shadow?.dispose?.();if(o.isInstancedMesh)o.dispose();if(o.geometry&&!keepG.has(o.geometry))o.geometry.dispose();for(const m of [].concat(o.material??[]))if(!keepM.has(m))m.dispose();});}
const ease=t=>1-Math.pow(1-t,3);
function ensureRenderer(world){if(stage?.renderer)return true;const canvas=document.createElement('canvas');canvas.className='moment-renderer';canvas.setAttribute('aria-hidden','true');world.after(canvas);try{const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.type=T.PCFShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));canvas.addEventListener('webglcontextlost',()=>{dead=true;closeMoment();canvas.remove();});stage={renderer,canvas,camera:new T.PerspectiveCamera(34,1,.1,320),w:0,h:0};return true;}catch{canvas.remove();dead=true;return false;}}
export async function openMoment(world,state,id){
 if(dead)return;if(!ensureRenderer(world))return;
 const plan=momentPlan(state,id),key=JSON.stringify(plan)+id+state.seed+state.age;if(stage.key===key&&stage.built){stage.state=state;return;}
 const mine=++token;const ready=await loadAnimeCast();if(mine!==token||dead||!ready)return;
 // A bad set costs that one moment. The painted scene stays and the next moment still opens.
 closeBuilt();try{Object.assign(stage,{key,id,world,plan,built:build(state,plan),started:performance.now(),last:0,state,still:matchMedia('(prefers-reduced-motion: reduce)').matches||preferences.motion===true,shadows:3});stage.canvas.hidden=false;place();requestAnimationFrame(()=>{if(stage?.key===key&&stage.built)stage.canvas.classList.add('on');});stage.raf=requestAnimationFrame(frame);}catch(error){console.warn('This close-up is unavailable; the painted scene stays.',error);closeBuilt();stage.canvas.hidden=true;}
}
// Measured with the painted canvas's push-in switched off (body.moment-open), so the rects are true.
function place(){const {canvas,renderer,camera}=stage,world=stage.world.offsetWidth?stage.world:stage.world.parentElement.querySelector('.world-renderer:not([hidden])')??stage.world,box=world.getBoundingClientRect(),parent=canvas.offsetParent?.getBoundingClientRect()??{left:0,top:0},w=Math.round(box.width),h=Math.round(box.height),l=Math.round(box.left-parent.left),t=Math.round(box.top-parent.top);if(!w||!h)return;if(l!==stage.l||t!==stage.t){stage.l=l;stage.t=t;canvas.style.left=l+'px';canvas.style.top=t+'px';}if(w!==stage.w||h!==stage.h){stage.w=w;stage.h=h;canvas.style.width=w+'px';canvas.style.height=h+'px';renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}}
function frame(now){
 if(!stage?.built)return;stage.raf=requestAnimationFrame(frame);
 const elapsed=(now-stage.started)/1000,t=stage.still?1:Math.min(1,elapsed/2.4);
 // After the arrival it only breathes, so a phone is not held at full frame rate on a page people read.
 if(t>=1&&now-stage.last<90)return;if(now-stage.last<30)return;stage.last=now;
 place();const {camera,renderer,built,plan}=stage,e=ease(t),tall=camera.aspect<.9,dist=plan.set==='table'?(tall?7.2:5.2):(tall?7:5.6);
 const y=1.5+(19-1.5)*(1-e),z=dist+(34-dist)*(1-e),x=plan.camera+(plan.side*9-plan.camera)*(1-e);camera.position.set(x,y,z);camera.lookAt(0,1.22,-.2);
 const shift=!tall&&document.querySelector('.decision-dialog')?.open?Math.min(.22,(document.querySelector('.decision-dialog').getBoundingClientRect().width/innerWidth)*.5):0;if(shift)camera.setViewOffset(1000,1000,shift*1000,0,1000,1000);else camera.clearViewOffset();
 const clock=now/1000;for(const {a,x:px,z:pz,elder} of built.people){a.update({x:px,y:pz,dx:0,dy:0,pose:'stand',moving:false,facing:Math.atan2(camera.position.x-px,camera.position.z-pz),distance:0},stage.state.age,clock,{elder,scale:Math.min(1,.48+stage.state.age*.035)});}
 for(const {a} of built.people)a.root.position.y=built.lift;
 for(const f of built.flicker)f.material.color.setScalar(.82+Math.sin(clock*23)*.05+Math.sin(clock*7)*.08);
 if(stage.shadows>0){stage.shadows--;renderer.shadowMap.needsUpdate=true;}
 renderer.render(built.scene,camera);
}
function closeBuilt(){if(!stage?.built)return;cancelAnimationFrame(stage.raf);for(const {a} of stage.built.people)a.anime?.detach();disposeBuilt(stage.built);stage.built=null;stage.id=null;stage.key=null;}
export const momentMemory=()=>stage?.renderer.info.memory??null;
export function closeMoment(){token++;if(!stage)return;stage.canvas.classList.remove('on');closeBuilt();setTimeout(()=>{if(stage&&!stage.built)stage.canvas.hidden=true;},500);}
