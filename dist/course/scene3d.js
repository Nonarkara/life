import {scenes} from './scene-registry.js';
export {showPaintedCanvas} from './scene-registry.js';
import * as T from 'three';
import {createInhabitedRooms} from './inhabited3d.js';
import {createCharacter} from './character3d.js';
import {loadAnimeCast,attachAnime} from './character-anime.js';
import {dressPeriod} from './period-dress.js';
import {outfitFor,hairFor,neighbourOutfit,monkRobe} from './moment-plan.js';
import {routine,routineContext,samplePath,HOME,HOME_FACING} from './routines.js';
import {furniture,townGrowth,taskDesks} from './layout.js';
import {lifeMoodAt,MOOD_CHORDS} from './events.js';
import {createDistricts,floorAt,overlappingReaderWidth} from './district3d.js';
import {createRegionScenery} from './region3d.js';
import {regionAt,region,regionIdFor,household,appearance,childhoodAway} from './regions.js';
import {dogAt} from './life-choices.js';
import {rand} from './sim.js';
import {currentPalette} from './palettes.js';
import {createBatch,bake,m,METRE,nightGlow} from './diorama-kit.js';
import {townPlan,familyAt,lifeRandom} from './diorama-plan.js';
import {crowdRoster,crowdActivity} from './diorama-cast.js';
import {furnishHome,buildHomeShell} from './home3d.js';
// A long lens on a model on a table. The figures are real-metre people in a world where one
// unit is 1.55 m, so a door is taller than whoever walks through it.
const FIGURE=1.65/1.8*METRE;
const FOV=9,VIEW=new T.Vector3(.62,.86,.86).normalize();

// A renderer change must hide the old surface without allocating a new GPU scene.
export function cameraSpan(age,phone=false){return age<1?3.5+age*2:phone?Math.min(9,5+age*.12):age<10?5.5+age*.3:age<20?8.5+(age-10)*.13:9.8+Math.min(40,age-20)*.03;}
export function applyCutaway(base,faded){
 const material=base.material,transparent=faded||base.transparent,depthWrite=faded?false:base.depthWrite;
 const changed=material.transparent!==transparent||material.depthWrite!==depthWrite;
 material.opacity=base.opacity*(faded?.14:1);material.transparent=transparent;material.depthWrite=depthWrite;
 // THREE's OPAQUE shader define depends on transparent at compilation time.
 if(changed)material.needsUpdate=true;
}
export function drawScene3D(original,state,age,time,mode,view={}){
 let entry=scenes.get(original);
 if(entry===false)return false;
 if(!entry){
  try{entry=createScene(original);scenes.set(original,entry);}
  catch(error){scenes.set(original,false);console.warn('3D unavailable; using the retained Canvas scene.',error);return false;}
 }
 if(mode!=='world'){entry.canvas.hidden=true;original.hidden=false;return false;}
 original.hidden=true;entry.canvas.hidden=false;
 try{entry.update(state,age,time,view);return true;}catch(error){entry.canvas.hidden=true;original.hidden=false;scenes.set(original,false);entry.dispose();console.warn('3D interrupted; using the retained Canvas scene.',error);return false;}
}
// The controlled sky, as a table of hours. t is the 60-second day.
const HOURS=[
 {t:0, sky:'#b39d91',sun:'#ffd2ac',i:1.6,hs:'#e6e0dc',hg:'#9a9088',h:1.25,el:.2,lit:.2},
 {t:7, sky:'#bcb29d',sun:'#ffe8cc',i:2.4,hs:'#f0ece0',hg:'#9a9688',h:1.25,el:.55,lit:0},
 {t:24,sky:'#c5c7c2',sun:'#fffaf2',i:2.7,hs:'#f6f6f2',hg:'#aaa89c',h:1.45,el:1.15,lit:0},
 {t:40,sky:'#bf9d76',sun:'#ffc98e',i:2.5,hs:'#ece0c8',hg:'#948670',h:1.1,el:.42,lit:.05},
 {t:47,sky:'#8c7d92',sun:'#ff9a6e',i:1.3,hs:'#b3a4b8',hg:'#5f5660',h:.62,el:.14,lit:.75},
 {t:51,sky:'#2b3442',sun:'#a9b6cc',i:.75,hs:'#808a9c',hg:'#3a3f4a',h:.62,el:.9,lit:1},
 {t:57.5,sky:'#2b3442',sun:'#a9b6cc',i:.75,hs:'#808a9c',hg:'#3a3f4a',h:.62,el:.9,lit:1},
 {t:60,sky:'#b39d91',sun:'#ffd2ac',i:1.6,hs:'#e6e0dc',hg:'#9a9088',h:1.25,el:.2,lit:.2}
];
const ca=new T.Color(),cb=new T.Color();
function hourAt(t,out){
 let i=0;while(i<HOURS.length-2&&t>=HOURS[i+1].t)i++;
 const a=HOURS[i],b=HOURS[i+1],k=Math.min(1,Math.max(0,(t-a.t)/(b.t-a.t)));
 for(const c of ['sky','sun','hs','hg'])out[c].copy(ca.set(a[c])).lerp(cb.set(b[c]),k);
 for(const n of ['i','h','el','lit'])out[n]=a[n]+(b[n]-a[n])*k;
 return out;
}
function createScene(original){
 const canvas=document.createElement('canvas');canvas.className='world-renderer';canvas.setAttribute('role','img');original.before(canvas);
 let renderer;
 try{renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance',stencil:false});}catch(error){canvas.remove();throw error;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.NeutralToneMapping;renderer.toneMappingExposure=1;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 const scene=new T.Scene();try{scene.background=new T.Color('#d6ccb5');
 const camera=new T.PerspectiveCamera(FOV,1,4,260);
 const hemi=new T.HemisphereLight('#f4e9c6','#6a8c91',1);scene.add(hemi);
 const sun=new T.DirectionalLight('#fff2d1',2.5);sun.castShadow=true;sun.shadow.bias=-.0006;sun.shadow.normalBias=.03;sun.shadow.intensity=.72;sun.shadow.radius=4;scene.add(sun,sun.target);
 const coarse=matchMedia?.('(pointer: coarse)')?.matches;sun.shadow.mapSize.set(coarse?1536:2048,coarse?1536:2048);
 Object.assign(sun.shadow.camera,{left:-27,right:27,top:27,bottom:-27,near:1,far:150});
 // The table the model stands on: only the shadow is drawn, over the sky colour.
 const table=new T.Mesh(new T.PlaneGeometry(400,400),new T.ShadowMaterial({opacity:.28}));table.rotation.x=-Math.PI/2;table.position.y=-1.3;table.receiveShadow=true;scene.add(table);
 const glow=new T.PointLight('#ffc98a',0,m(9),1.5);scene.add(glow);
 // --- the world, rebuilt only when the plan's key changes
 let world=null,appliedKey='';const buildings=[];
 const scenery=createRegionScenery({scene,registerBuilding:register});
 function register(group){group.userData.building=true;group.userData.pendingBuilding=true;buildings.push({group,surfaces:null});}
 function surfacesOf(entry){if(entry.surfaces)return entry.surfaces;const list=[];entry.group.traverse(o=>{if(o.material)list.push({material:o.material,opacity:o.material.opacity,transparent:o.material.transparent,depthWrite:o.material.depthWrite});});entry.surfaces=list;return list;}
 function buildWorld(plan){
  disposeWorld();
  buildings.length=0;
  const root=new T.Group();scene.add(root);
  const batches=new Map(),group=(parent=root)=>{const g=new T.Group();parent.add(g);return g;};
  const batchOf=p=>{if(!batches.has(p))batches.set(p,createBatch());return batches.get(p);};
  // The older builders (rooms, districts) call box/round with a parent group: each parent bakes once.
  const box=(x,z,y,w,d,h,color,parent=root)=>{batchOf(parent).box(x,z,y,w,d,h,color);return null;};
  const round=(x,z,y,r,color,sx=1,sy=1,sz=1,parent=root)=>{batchOf(parent).ball(x,y,z,r*sx,r*sy,r*sz,color,7);return null;};
  const leafy=plan.palette.leaf;const treeR=lifeRandom(plan.seed,'wing-trees');
  const tree=(x,z,parent=root)=>{const b=batchOf(parent);b.cylinder(x,z,0,.05,.035,1.05,'#6a5a48',6);for(let i=0;i<3;i++)b.ball(x+(i?Math.cos(i*2)*.26:0),1.35+treeR()*.3,z+(i?Math.sin(i*2)*.26:0),.42,.36,.42,leafy[i%leafy.length],6);};
  const {seat,tableTop}=furnishHome.metrics;
  // Seats face the way the sitter faces; only the four quarter-turns occur.
  const chair=(x,z,angle=0,floor=0,parent=root)=>{const b=batchOf(parent),s=m(.42),w=s/2,c='#7d6a52';for(const dx of [-w+.02,w-.05])for(const dz of [-w+.02,w-.05])b.box(x+dx,z+dz,floor,.03,.03,seat,c);b.box(x-w,z-w,floor+seat,s,s,.03,'#9f9377');const q=Math.round(((angle%(Math.PI*2))+Math.PI*2)/(Math.PI/2))%4;if(q===0)b.box(x-w,z-w,floor+seat,s,.03,m(.42),c);else if(q===2)b.box(x-w,z+w-.03,floor+seat,s,.03,m(.42),c);else if(q===1)b.box(x-w,z-w,floor+seat,.03,s,m(.42),c);else b.box(x+w-.03,z-w,floor+seat,.03,s,m(.42),c);return {visibleKey:0,position:{x,y:floor,z}};};
  const table=(x,z,w=.75,parent=root)=>{const b=batchOf(parent);for(const dx of [0,w-.04])for(const dz of [0,.4])b.box(x+dx,z+dz,0,.04,.04,tableTop,'#77684f');b.box(x-.04,z-.04,tableTop,w+.08,.52,.04,'#a99773');};
  plinth(root,batchOf,plan);
  const rooms=createInhabitedRooms({scene:root,box,round});
  const districts=createDistricts({scene:root,box,round,chair,table,tree,label(){},registerBuilding:register,palette:plan.palette});
  const home=furnishHome({root,batchOf,group,box,round,chair,table,plan,register});
  const shell=buildHomeShell({root,batchOf,group,plan,register});
  const road=batchOf(root);
  // Lit desks and work corners the routines already use.
  const manual=group(),office=group(),desks=plan.farm?[taskDesks[0]]:taskDesks;for(const [x,z] of desks)table(x,z,.75,root);if(plan.farm){const p2=batchOf(root);p2.box(10.4,5.25,-.022,3.9,1.55,.012,'#8ea27a');for(let x=10.5;x<14.2;x+=.3)for(let z=5.35;z<6.75;z+=.3)p2.box(x,z,-.012,.03,.03,.1,'#7fa05a');}
  chair(10.5,1.6,0,0,root);chair(11.3,5.8,0,0,office);if(!plan.farm)chair(12.4,5.8,0,0,root);batchOf(office).box(11.06,6.2,tableTop+.04,.3,.2,.02,'#536760');batchOf(office).box(11.06,6.37,tableTop+.05,.3,.02,.2,'#526a66');batchOf(manual).box(11.08,6.24,tableTop+.04,.3,.18,.08,'#bea37a');
  for(const[x,z]of [[10.3,2]])batchOf(root).box(x,z,tableTop+.04,.3,.2,.012,'#ece5d5');
  // Stall: the mother's post on the south side of the lane.
  const stall=group(),st=batchOf(stall),acc=plan.palette.accent;st.box(6.4,9,0,1.5,.55,.5,'#9d8965');st.box(6.38,8.98,.5,1.54,.59,.03,'#8a7458');for(const x of [6.42,7.82])st.box(x,9.02,.53,.04,.04,.82,'#6b5236');st.gable(6.3,8.85,1.35,1.7,.85,.14,acc,{over:.04,along:'x'});for(let i=0;i<5;i++)st.ball(6.62+i*.26,.57,9.28,.08,.07,.08,['#c9a14a','#b5553c','#7f8f5a'][i%3],6);
  // Pond and pier, in every town, because swimming lessons happen there.
  const pond=batchOf(root);pond.box(3.1,8.87,-.024,2.4,1.5,.02,'#a59a84');pond.box(3.2,8.97,-.02,2.2,1.3,.018,plan.palette.water);pond.box(4.02,8.5,.02,.56,.62,.03,'#8a7050');for(let z=8.54;z<9.08;z+=.12)pond.box(4.04,z,.05,.52,.012,.004,'#6b5236');for(const x of [4.05,4.5])pond.box(x,9.05,-.02,.05,.05,.1,'#6b5236');
  // A pitch is usable ground; its markings sit on the plane the players stand on.
  road.box(9,9,-.022,4,3,.012,plan.climate==='cold'?'#e8edee':'#7f9a6e');for(const [x,z,w,d] of [[9,9,4,.025],[9,12,4,.025],[9,9,.025,3],[13,9,.025,3],[11,9,.025,3]])road.box(x,z,-.008,w,d,.006,'#e6e4d6');for(const x of [9,13]){road.box(x,10,0,.03,.03,m(1.5),'#e6dfcc');road.box(x,11,0,.03,.03,m(1.5),'#e6dfcc');road.box(x,10,m(1.5),.03,1,.03,'#e6dfcc');}
  // Garden plots at the end of the old-age route, and a small kitchen garden by the fields.
  const farm=group(),f=batchOf(farm);for(let i=0;i<4;i++){f.box(-1+i*.6,1,-.02,.35,3,.016,'#927b58');for(let z=1.2;z<4;z+=.4)f.ball(-.85+i*.6,.08,z,.1,.08,.1,'#718559',6);}
  const garden=batchOf(root);for(let i=0;i<4;i++)garden.box(3.4+i*.72,13.25,-.018,.6,.42,.012,'#927b58');for(let i=0;i<9;i++)garden.ball(3.55+i*.3,.09,13.45,.09,.08,.09,'#6f8a55',6);
  // Town growth the older game promised: houses that appear with the life's age.
  const growth=[];for(const [from,x,z,w,d,h] of townGrowth){const g=group();const b=batchOf(g),c=plan.palette.walls[growth.length%plan.palette.walls.length];b.box(x,z,0,w,d,Math.max(h,m(3)),c);b.box(x+w*.4,z+d,0,m(.9),.012,m(2),'#3f4a48');b.gable(x,z,Math.max(h,m(3)),w,d,m(1.2),plan.palette.roofs[0],{over:.12,along:'x',gableColor:c});register(g);growth.push([from,g]);}
  // Animated or age-gated objects keep their own parents.
  const bits=dollhouseBits({batchOf,group});
  drawBus(bits.busBatch,plan);
  const flood=new T.Mesh(new T.PlaneGeometry(9.4,1.8),new T.MeshLambertMaterial({color:'#809e98',transparent:true,opacity:.62}));flood.rotation.x=-Math.PI/2;flood.position.set(5.5,.03,7.95);flood.visible=false;root.add(flood);
  for(const [parent,batch] of batches){if(batch.size)bake(batch,parent);}
  root.traverse(o=>{if(o.isMesh)o.updateMatrix();});
  world={root,plan,rooms,districts,home,shell,stall,farm,growth,manual,office,flood,...bits};
  renderer.shadowMap.needsUpdate=true;
 }
 function plinth(root,batchOf,plan){
  const b=batchOf(root),P=plan.palette,snow=plan.climate==='cold',ground=snow?'#e9eef0':P.ground,edge='#8d8a7e',top=-.03;
  const board=(x,z,w,d)=>{b.box(x,z,-1.3,w,d,1.27,edge);b.box(x,z,top-.003,w,d,.003,ground);b.box(x-.015,z+d,-.2,w+.03,.012,.04,'#c9c6b8');b.box(x+w,z-.015,-.2,.012,d+.03,.04,'#c9c6b8');};
  board(-5.6,-5.6,24.2,24.2);
  const R=P.road,asphalt=plan.year>=1965&&!['village','fringe'].includes(plan.style),line='#e7e0cf',curb=['market','condo','villa','tower','tokyo','newengland','brick'].includes(plan.style)&&plan.year>=1960;
  b.box(-5.6,7.05,-.02,24.2,1.8,.012,R);b.box(7.2,-5.6,-.018,1.8,24.2,.012,R);
  if(curb)for(const [x,z,w,d] of [[-5.6,6.97,12.8,.08],[9,6.97,9.6,.08],[-5.6,8.85,12.8,.08],[9,8.85,9.6,.08],[7.12,-5.6,.08,12.6],[9,-5.6,.08,12.6],[7.12,8.9,.08,9.7],[9,8.9,.08,9.7]])b.box(x,z,-.02,w,d,.04,'#bdb9aa');
  if(asphalt)for(let x=-5;x<18;x+=1.6)if(x<7||x>9)b.box(x,7.93,-.006,.7,.035,.005,line);
 }
 function dollhouseBits({batchOf,group}){
  const cradle=group(),infant=group(),toys=group(),dog=group(),bus=group();
  const c=batchOf(cradle),crib=furniture[1];c.box(crib.x+.1,crib.y+.1,.16,crib.w-.2,crib.d-.2,.2,'#8a7458');c.box(crib.x+.13,crib.y+.13,.36,crib.w-.26,crib.d-.26,.05,'#e4decd');for(let x=crib.x+.1;x<=crib.x+crib.w-.1;x+=.16)c.box(x,crib.y+crib.d-.1,.36,.02,.02,.22,'#8a7458');
  const n=batchOf(infant);n.ball(5.12,.44,5.04,.19,.09,.13,'#e5d2a4',7);n.ball(5.42,.46,5.03,.1,.1,.1,'#bb936f',7);
  const t=batchOf(toys);t.box(4.55,6.12,.165,.07,.07,.07,'#c0563f');t.box(4.62,6.02,.165,.07,.07,.07,'#d8b25a');t.box(4.59,6.07,.235,.07,.07,.07,'#3f6f8a');
  dog.position.set(2.75,0,5.2);const d=batchOf(dog);d.box(-.14,-.06,.12,.28,.12,.13,'#a26a3c');d.ball(.18,.27,0,.075,.07,.07,'#945c30',6);d.box(.21,-.03,.28,.08,.06,.03,'#693e1e');for(const [x,z] of [[-.12,-.05],[.09,-.05],[-.12,.03],[.09,.03]])d.box(x,z,0,.04,.04,.13,'#784420');
  return {cradle,infant,toys,dog,bus,busBatch:batchOf(bus)};
 }
 function disposeWorld(){if(!world)return;world.root.traverse(o=>{o.geometry?.dispose();o.material?.dispose?.();});scene.remove(world.root);world=null;}
 // Weather: snow where the place is cold, rain in the flood years.
 const flakes=new Float32Array(600*3);for(let i=0;i<600;i++){flakes[i*3]=Math.random()*24-12;flakes[i*3+1]=Math.random()*9;flakes[i*3+2]=Math.random()*24-12;}
 const snowGeo=new T.BufferGeometry();snowGeo.setAttribute('position',new T.BufferAttribute(flakes,3));
 const snow=new T.Points(snowGeo,new T.PointsMaterial({color:'#ffffff',size:2.4,sizeAttenuation:false,transparent:true,opacity:.85,depthWrite:false}));snow.visible=false;snow.frustumCulled=false;scene.add(snow);
 const drops=new Float32Array(400*6),dropY=new Float32Array(400);for(let i=0;i<400;i++){const x=Math.random()*24-12,z=Math.random()*24-12;dropY[i]=Math.random()*9;drops.set([x,dropY[i],z,x+.04,dropY[i]-.38,z+.04],i*6);}
 const rainGeo=new T.BufferGeometry();rainGeo.setAttribute('position',new T.BufferAttribute(drops,3));
 const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:'#c9d8dc',transparent:true,opacity:.45,depthWrite:false}));rain.visible=false;rain.frustumCulled=false;scene.add(rain);
 // Figures throw a drawn shadow, not a real one: a moving crowd must not re-render the shadow map.
 const shadowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),a=g.createRadialGradient(32,32,2,32,32,31);a.addColorStop(0,'rgba(0,0,0,.62)');a.addColorStop(.5,'rgba(0,0,0,.34)');a.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=a;g.fillRect(0,0,64,64);return new T.CanvasTexture(c);})();
 const MAX_SHADOWS=24,quad=new T.PlaneGeometry(1,1);quad.rotateX(-Math.PI/2);
 const decals=new T.InstancedMesh(quad,new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,color:'#202428',toneMapped:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),MAX_SHADOWS);decals.frustumCulled=false;decals.count=0;scene.add(decals);
 // --- the cast
 const actors={mother:createCharacter({shirt:'#718979',sex:'female',plain:true}),father:createCharacter({shirt:'#87735c',plain:true}),player:createCharacter({shirt:'#bd914d',plain:true}),partner:createCharacter({shirt:'#8a7a6a',plain:true}),kid:createCharacter({shirt:'#b5553c',plain:true})};
 for(const actor of Object.values(actors)){scene.add(actor.root);actor.root.visible=false;}
 const crowd=Array.from({length:7},()=>{const a=createCharacter({shirt:'#93957b',plain:true});scene.add(a.root);a.root.visible=false;return a;});
 let gone=false,castReady=false;
 loadAnimeCast().then(c=>{if(!c||gone)return;castReady=true;for(const a of [...Object.values(actors),...crowd])try{attachAnime(a);}catch(error){console.warn('Anime figure skipped.',error);a.anime?.detach();}lastLooks='';});
 const STAND={x:0,y:0,dx:0,dy:0,moving:false,pose:'stand',facing:0,distance:0};
 function dressActor(actor,key,sex,state,age,year,{elder=false,place,headScale=1,stoop=0,monk=false}={}){
  if(!actor.anime)return;
  const hair=monk?{style:'bald',color:'#26211c'}:hairFor(state,key,sex,age,elder),outfit=monk?monkRobe:key.startsWith('crowd')?neighbourOutfit(state,key,sex,year,place):outfitFor(state,key,sex,age,year,{place}),stamp=JSON.stringify([outfit,hair,elder,headScale,stoop]);
  if(actor.dressStamp===stamp&&actor.undress)return;
  actor.rig.look.headScale=1;actor.rig.look.stoop=0;
  // Clothes bind to a standing figure, wherever this one happens to be in its stride.
  actor.update(STAND,age,1e7,{world:FIGURE,scale:1});actor.undress?.();
  actor.undress=dressPeriod(actor,outfit,{elder,matte:true,hair});actor.dressStamp=stamp;
  actor.rig.look.headScale=headScale;actor.rig.look.stoop=stoop;
 }
 function applyLooks(state,age,here,born,plan,family,time){
  const hh=household(state.birth),seed=state.seed,withGrandparents=childhoodAway(state.birth,age),year=plan.year;
  const parentAge=n=>age+26+rand(seed,0,n+'-gap')*6;
  for(const name of ['mother','father']){const mem=withGrandparents?{sex:name==='mother'?'female':'male',elder:true}:hh[name],from=withGrandparents?here:born,elder=!!mem.elder||parentAge(name)>=60,look=appearance(rand,seed,(withGrandparents?'grand-':'')+name,from,{sex:mem.sex,elder});actors[name].setLook(look);dressActor(actors[name],(withGrandparents?'grand-':'')+name,mem.sex,state,Math.min(90,parentAge(name)),year,{elder,place:plan.place,stoop:elder?.12:0});}
  const sex=state.intake?.sex??['female','male','intersex'][Math.floor(rand(seed,0,'intake-sex')*3)];
  actors.player.setLook(appearance(rand,seed,'player',born,{sex}));dressActor(actors.player,'player',sex,state,age,year,{elder:age>=60,place:plan.place,headScale:headFor(age),stoop:age>=68?.15:age>=60?.08:0});
  if(family.partner){const ps=rand(seed,0,'partner-sex')<.92?(sex==='female'?'male':'female'):sex;actors.partner.setLook(appearance(rand,seed,'partner',here,{sex:ps}));dressActor(actors.partner,'partner',ps,state,age,year,{elder:age>=62,place:plan.place,stoop:age>=68?.12:0});}
  if(family.child){const ks=rand(seed,0,'kid-sex')<.5?'female':'male';actors.kid.setLook(appearance(rand,seed,'kid',here,{sex:ks}));dressActor(actors.kid,'kid',ks,state,Math.max(1,family.childAge),year,{place:plan.place,headScale:headFor(family.childAge)});}
  roster=crowdRoster(plan);
  roster.forEach((row,i)=>{const a=crowd[i];a.setLook(appearance(rand,seed+row.salt,'crowd'+row.salt,here,{sex:row.sex,elder:row.elder}));dressActor(a,'crowd'+row.salt,row.sex,state,row.child?10:30,year,{elder:row.elder,place:plan.place,stoop:row.elder?.12:0,monk:row.robe,headScale:row.child?1.2:1});});
 }
 let roster=[];
 let lost=false;canvas.addEventListener('webglcontextlost',()=>{lost=true;});
 const hour={sky:new T.Color(),sun:new T.Color(),hs:new T.Color(),hg:new T.Color(),i:1,h:1,el:1,lit:0};
 const focus3=new T.Vector3(),eye=new T.Vector3(),ray=new T.Raycaster(),mood=new T.Color(),shadowM=new T.Matrix4(),shadowScale=new T.Vector3(),sunDir=new T.Vector3();
 let lastCut='',width=0,height=0,lastLooks='',lastTime=null,shadowStep=null,camReady=false,camSpan=0,lastSignature='',cutTick=0,hidden=new Set();
 const cam={x:5.3,z:5.3,span:8};
 function update(state,age,time,{homeFrame=false}={}){
  if(lost)throw new Error('Graphics context lost');
  const w=canvas.clientWidth,h=canvas.clientHeight;if(w<2||h<2)return;
  if(w!==width||h!==height){width=w;height=h;const dpr=devicePixelRatio||1;renderer.setPixelRatio(Math.min(dpr,2,Math.sqrt(2.6e6/(w*h))));renderer.setSize(w,h,false);camera.aspect=w/h;lastSignature='';}
  const plan=townPlan(state,age),here=plan.regionId,born=regionIdFor(state.birth),family=familyAt(state,age);
  if(!world||appliedKey!==plan.key){appliedKey=plan.key;buildWorld(plan);scenery.update(plan);lastLooks='';camReady=false;shadowStep=null;}
  const looks=[appliedKey,state.seed,state.birth?.household,state.intake?.sex,Math.floor(age/5),family.partner,family.child,castReady].join('/');
  if(looks!==lastLooks){lastLooks=looks;applyLooks(state,age,here,born,plan,family,time);}
  canvas.setAttribute('aria-label',original.getAttribute('aria-label')??'Your growing world');
  const context=routineContext(state,age),goal=state.profiles.at(-1)?.profile.aim??'balance',t=((time%60)+60)%60;
  const activity=routine('player',age,time,goal,context),focus=homeFrame?{...activity,x:context.residence.origin[0],y:context.residence.origin[1],moving:false,pose:'eat'}:activity;
  // Cast placement ----------------------------------------------------------------
  const P=plan,manualWork=context.pathway==='vocational'&&age>=15&&age<60;
  let shadowCount=0;
  const place=(a,act,opts,y)=>{a.root.visible=true;a.update(act,age,time,{...opts,world:FIGURE});const px=act.x,pz=act.y,fy=y??floorAt(px,pz);a.root.position.y=fy;if(shadowCount<MAX_SHADOWS){const sca=opts.scale??1,len=Math.min(2.2,.6/Math.max(.28,Math.tan(hour.el)))*sca+.25,sx=sunDir.x,sz=sunDir.z,L=Math.hypot(sx,sz)||1;shadowM.makeRotationY(Math.atan2(-sz,sx));shadowM.scale(shadowScale.set(len*1.3,1,.36*sca));shadowM.setPosition(px-sx/L*len*.5,fy+.012,pz-sz/L*len*.5);decals.setMatrixAt(shadowCount++,shadowM);}};
  const walkEnv=name=>routine(name,age,time,goal,context);
  const parentsHere=here===born||childhoodAway(state.birth,age);
  for(const name of ['mother','father']){const a=actors[name];if(!(parentsHere&&family[name])){a.root.visible=false;continue;}place(a,relabel(walkEnv(name),P,name),{elder:age+28>=60||!!household(state.birth)[name]?.elder||childhoodAway(state.birth,age),scale:1});}
  if(age>=1)place(actors.player,relabel(activity,P,'player'),{elder:age>=60,scale:statureOf(age)});else actors.player.root.visible=false;
  // A partner shares the player's evenings at home; by day they are out.
  if(family.partner&&(t<8||t>=46)){const o=context.residence.origin;place(actors.partner,{x:o[0]+.62,y:o[1]+.32,dx:0,dy:0,moving:false,facing:-Math.PI/2,pose:t<8?'eat':'rest'},{elder:age>=62,scale:.98});}else actors.partner.root.visible=false;
  if(family.child){const o=context.residence.origin,a=(t*.3);place(actors.kid,{x:o[0]-.9+Math.cos(a)*.3,y:o[1]+.35+Math.sin(a)*.25,dx:-Math.sin(a),dy:Math.cos(a),distance:t*.2,moving:family.childAge>=1,pose:family.childAge<2?'crawl':family.childAge<4?'toddle':'walk'},{scale:statureOf(family.childAge)});}else actors.kid.root.visible=false;
  crowd.forEach((a,i)=>{const row=roster[i];if(!row){a.root.visible=false;return;}const act=crowdActivity(row,time,P);if(!act){a.root.visible=false;return;}place(a,act,{elder:row.elder,scale:row.scale??1});});
  world.stall.visible=true;
  // Town objects -------------------------------------------------------------------
  world.rooms.update(state,age);world.districts.update(state,age);world.home.update(state,age,context,time);
  world.manual.visible=manualWork;world.office.visible=!manualWork&&!P.farm;world.cradle.visible=age<6;world.infant.visible=age<1;world.toys.visible=age>=1&&age<8;world.dog.visible=dogAt(state,age);world.farm.visible=P.farm||P.style==='market';
  for(const [from,g] of world.growth)g.visible=age>=from&&P.style==='market';
  const inside=focus.x>=2.9&&focus.x<=7.1&&focus.y>=2.9&&focus.y<=7.2&&!(context.residence.id!=='family');
  world.shell.group.visible=!inside&&age>=5;
  world.flood.visible=P.flood.water;world.bus.visible=age>=5;if(world.bus.visible){world.bus.position.x=((-6+time*.42)%25+25)%25-6;world.bus.position.z=7.55;}
  if(world.dog.visible&&shadowCount<MAX_SHADOWS){shadowM.identity().scale(new T.Vector3(.5,1,.26)).setPosition(2.75,.012,5.2);decals.setMatrixAt(shadowCount++,shadowM);}
  if(world.bus.visible&&shadowCount<MAX_SHADOWS){shadowM.identity().scale(new T.Vector3(2.6,1,1.05)).setPosition(world.bus.position.x+1,.012,world.bus.position.z+.35);decals.setMatrixAt(shadowCount++,shadowM);}
  decals.count=shadowCount;decals.instanceMatrix.needsUpdate=true;
  // Light --------------------------------------------------------------------------
  hourAt(t,hour);
  const palette=currentPalette(),moodName=palette?.name??lifeMoodAt(state,age),chord=palette?.world??MOOD_CHORDS[moodName],hard=palette?.mood==='difficult'||moodName==='difficult';
  scene.background.copy(hour.sky);if(chord?.sky)scene.background.lerp(mood.set(chord.sky),.14);
  sun.color.copy(hour.sun);sun.intensity=hour.i*(hard?.74:1);hemi.color.copy(hour.hs);hemi.groundColor.copy(hour.hg);hemi.intensity=hour.h*(hard?.84:1);
  const phase=Math.min(1,t/48),night=t>=48,az=night?1.9:phase*Math.PI;
  sunDir.set(Math.cos(az)*Math.cos(hour.el),Math.sin(hour.el),.62*Math.sin(az)*Math.cos(hour.el)+.28).normalize();
  // A step of the sun is the only thing that needs a new shadow map; a paused day costs nothing.
  const step=Math.floor(t*2);if(step!==shadowStep){shadowStep=step;const cx=clampZone(focus.x),cz=5.5;sun.target.position.set(cx,0,cz);sun.position.copy(sun.target.position).addScaledVector(sunDir,70);sun.updateMatrixWorld();sun.target.updateMatrixWorld();renderer.shadowMap.needsUpdate=true;}
  nightGlow.value=hour.lit*.85;glow.intensity=hour.lit*4.2;glow.position.set(context.residence.base[0]+1.4,1.3,context.residence.base[1]+2);
  // Weather is the place's, drawn around wherever the life is.
  snow.visible=plan.climate==='cold';rain.visible=world.flood.visible&&!snow.visible;
  if(snow.visible){snow.position.set(focus.x,0,focus.y);const p=snowGeo.attributes.position.array;for(let i=0;i<600;i++){p[i*3+1]=(9+((i*0.37)%9)-(time*.55+i*.013)%9)%9;p[i*3]=((i*7.31)%24)-12+Math.sin(time*.6+i)*.15;}snowGeo.attributes.position.needsUpdate=true;}
  if(rain.visible){rain.position.set(focus.x,0,focus.y);const p=rainGeo.attributes.position.array;for(let i=0;i<400;i++){const y=(dropY[i]-time*9%9+9)%9;p[i*6+1]=y;p[i*6+4]=y-.38;}rainGeo.attributes.position.needsUpdate=true;}
  // Camera ------------------------------------------------------------------------
  const phone=w<=720,tall=w/h<1.15;
  const still=!focus.moving&&age>=3;
  // Small children stay in the room; a person walking gets the town.
  let span=age<1?(phone?4.6:5.6):age<5?(phone?5.4:6.6):still?(phone?5.6:7.4):(phone?7.8:10.5);
  if(!phone&&w/h>1.6&&age>=5)span*=1.08;
  const dt=lastTime===null?1:Math.max(0,Math.min(1,time-lastTime));lastTime=time;
  const follow=age<5?{x:5.2,y:5.2}:focus;
  const ease=camReady?1-Math.exp(-dt*2.6):1;camReady=true;
  cam.x+=(follow.x-cam.x)*ease;cam.z+=(follow.y-cam.z)*ease;cam.span+=(span-cam.span)*ease;
  const dock=!phone&&!document.body.classList.contains('birth-stage')&&!document.body.classList.contains('recap-stage')?overlappingReaderWidth(canvas.getBoundingClientRect(),(()=>{const reader=document.querySelector('.console-reader');return reader&&!reader.hidden&&getComputedStyle(reader).visibility!=='hidden'?reader.getBoundingClientRect():null;})()):0;
  focus3.set(cam.x,.45,cam.z);
  const fit=tall?1.05:1,dist=(cam.span*fit/2)/Math.tan(T.MathUtils.degToRad(FOV/2));
  eye.copy(focus3).addScaledVector(VIEW,dist);camera.position.copy(eye);camera.near=Math.max(1,dist-40);camera.far=dist+60;camera.lookAt(focus3);
  if(dock)camera.setViewOffset(w,h,dock/2,0,w,h);else camera.clearViewOffset();camera.updateProjectionMatrix();
  // Cutaways keep the protagonist readable through foreground buildings.
  scene.updateMatrixWorld();camera.updateMatrixWorld(true);
  if(age>=1&&(cutTick++%4===0||!hidden.size)){hidden=obscuringBuildings(camera,Object.values(actors.player.anchors),buildings.map(b=>b.group),ray);}
  const cutKey=[...hidden].map(g=>buildings.findIndex(b=>b.group===g)).sort().join();if(cutKey!==lastCut){lastCut=cutKey;renderer.shadowMap.needsUpdate=true;}
  // A building in the way is lifted off the board; its slab stays.
  for(const entry of buildings)for(const base of surfacesOf(entry)){const off=age>=1&&hidden.has(entry.group);base.material.visible=!off;}
  // Nothing moved: keep the last picture, spend nothing.
  const signature=[w,h,time,age,plan.key,moodName,dock,cam.x.toFixed(3),cam.z.toFixed(3),cam.span.toFixed(3),hidden.size,family.partner].join('|');
  if(signature===lastSignature&&!renderer.shadowMap.needsUpdate)return;lastSignature=signature;
  renderer.render(scene,camera);
 }
 return {canvas,update,memory:()=>({...renderer.info.memory,frame:renderer.info.render.frame,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,programs:renderer.info.programs?.length}),dispose(){gone=true;disposeWorld();scenery.dispose();for(const a of [...Object.values(actors),...crowd]){a.undress?.();a.anime?.detach();}disposeScene(scene,renderer,canvas);}};
 }catch(error){disposeScene(scene,renderer,canvas);throw error;}
}
function drawBus(b,plan){
 const {marks,year,palette,abroad,place}=plan,body=palette.accent,rubber='#23282a',steel='#7a7f7e',style=place.style;
 const wheels=len=>{for(const a of [.3,len-.55])for(const e of [.02,.86])b.box(a,e,0,.25,.02,.25,rubber);};
 if(abroad&&style==='brick'){b.box(0,.02,.1,2.8,.86,1.6,'#b23a2e');for(const y of [.72,1.25])b.box(.15,.88,y,2.5,.012,.26,'#2f3a40');wheels(2.8);return;}
 if(abroad){b.box(0,.02,.12,2.6,.86,.9,'#e2ded2');b.box(.15,.88,.52,2.3,.012,.32,'#47586a');wheels(2.6);return;}
 if(!marks.pickup&&!marks.concrete){b.box(0,.14,.18,1.5,.62,.4,'#7a5a42');b.gable(.05,.14,.66,1.4,.62,.12,'#7a6e5f',{over:.04,along:'x'});wheels(1.5);return;}
 // A covered pickup-bus, the provincial workhorse; a blue-and-cream city bus in later Bangkok.
 const len=2.2,c=year<1990?'#3f6f8a':body;b.box(0,.04,.14,len,.84,.3,c);b.box(1.55,.08,.44,.6,.76,.26,'#5a6e72');b.box(1.52,.04,.7,.66,.84,.04,c);for(const a of [.05,.6,1.2])for(const e of [.06,.82])b.box(a,e,.44,.04,.04,.42,steel);b.box(-.02,.02,.86,1.32,.88,.04,c);wheels(len);
}
const headFor=age=>age<3?1.42:age<7?1.3:age<12?1.18:age<16?1.08:1;
function clampZone(x){return x<-3?-6:x>20?24:6;}
// Children are not small adults: this is stature as a share of an adult's.
export const statureOf=age=>age<1?.42:age>=18?1:Math.min(1,.5+age*.03-Math.max(0,age-12)*.002+(age>=12?.03:0));
// What a routine calls 'work' depends on where and when the work is.
function relabel(a,plan,name){
 if(a.moving)return a;
 if(a.pose==='work'&&plan.farm)return {...a,pose:name==='father'?'farm':'mend'};
 if(a.pose==='work'&&plan.style==='market'&&plan.year<1985)return {...a,pose:'sell'};
 if(a.pose==='trade')return {...a,pose:'sell'};
 return a;
}
function disposeScene(scene,renderer,canvas){
 const geometries=new Set(),materials=new Set(),textures=new Set();
 scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const material of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){materials.add(material);for(const value of Object.values(material))if(value?.isTexture)textures.add(value);}});
 for(const value of textures)value.dispose();for(const value of materials)value.dispose();for(const value of geometries)value.dispose();renderer.dispose();canvas.remove();
}
export function obscuringBuildings(camera,anchors,groups,ray=new T.Raycaster()){
 const hidden=new Set();
 for(const anchor of anchors){
  const aim=anchor.getWorldPosition(new T.Vector3()),screen=aim.clone().project(camera);
  for(const group of groups){const b=group.userData.cutawayBounds;if(!b)continue;let visible=true;for(let node=group;node;node=node.parent)visible&&=node.visible;if(visible&&aim.x>=b.x&&aim.x<=b.x+b.w&&aim.z>=b.z&&aim.z<=b.z+b.d)hidden.add(group);}
  ray.setFromCamera(screen,camera);ray.far=ray.ray.origin.distanceTo(aim)-.1;
  for(const hit of ray.intersectObjects(groups,true)){
   let node=hit.object,building=null,visible=true;
   while(node){visible&&=node.visible;if(!building&&node.userData.building)building=node;node=node.parent;}
   if(visible&&building)hidden.add(building);
  }
 }
 return hidden;
}
