import * as T from 'three';
import {illustratedMaterial,tint} from './art-direction.js';
import {shopfront,createInhabitedRooms} from './inhabited3d.js';
import {createCharacter} from './character3d.js';
import {routine,routineContext,samplePath,HOME,HOME_FACING} from './routines.js';
import {furniture,townGrowth,taskDesks} from './layout.js';
import {lifeMoodAt,MOOD_CHORDS} from './events.js';
import {t} from './i18n.js';
import {createDistricts,floorAt,overlappingReaderWidth} from './district3d.js';
import {createRegionScenery} from './region3d.js';
import {regionAt,region,regionIdFor,household,appearance,childhoodAway} from './regions.js';
import {dogAt} from './life-choices.js';
import {rand} from './sim.js';
import {createPost} from './render-post.js';
import {currentPalette} from './palettes.js';
// The surfaces that carry the frame: sky, sea, land, sand, road, water and
// foliage. The buildings keep their own painted colours.
const TOWN_WIDTH=22;
const SCENE_ROLES={sky:['#6f8783'],ground:['#5b7f80'],sand:['#b5a789'],land:['#849573','#7d9764'],road:['#bcb7a5','#c8bba1'],waterLight:['#7dabad','#a0bdba'],grass:['#9caf73','#718559','#76896a'],leaf:['#526c50','#476b48'],water:['#4e7d82']};
const scenes=new WeakMap();
// A renderer change must hide the old surface without allocating a new GPU scene.
export function showPaintedCanvas(original){
 const entry=scenes.get(original);if(entry&&entry!==false)entry.canvas.hidden=true;
 original.hidden=false;
}
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
function createScene(original){
 const canvas=document.createElement('canvas');canvas.className='world-renderer';canvas.setAttribute('role','img');original.before(canvas);
 let renderer;
 try{renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});}catch(error){canvas.remove();throw error;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.NeutralToneMapping;renderer.toneMappingExposure=1;
 const scene=new T.Scene();try{scene.background=new T.Color('#6f8783');
 const camera=new T.OrthographicCamera(-8,8,8,-8,.1,100);
 const hemi=new T.HemisphereLight('#f4e9c6','#6a8c91',1.4);scene.add(hemi);
 const sun=new T.DirectionalLight('#fff2d1',2.5);sun.position.set(-7,17,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun.target);sun.shadow.camera.left=-20;sun.shadow.camera.right=20;sun.shadow.camera.top=20;sun.shadow.camera.bottom=-20;sun.shadow.bias=-.0005;sun.shadow.intensity=.6;sun.shadow.normalBias=.035;scene.add(sun);
 const materials=new Map(),geometries=new Map(),labels=[],growth=[],buildings=[];
 let appliedWorld=null;
 // Repaint the surfaces the palette owns when the mood or the chapter moves.
 const repaint=world=>{
  if(!world||world===appliedWorld)return;appliedWorld=world;
  for(const[role,hexes]of Object.entries(SCENE_ROLES)){
   const next=world[role];if(!next)continue;
   for(const hex of hexes){const material=materials.get(hex);if(material?.color)material.color.set(next);}
  }
  if(world.sky&&scene.background?.isColor)scene.background.set(world.sky);
 };
 const mat=color=>{if(!materials.has(color))materials.set(color,illustratedMaterial(color));return materials.get(color);};
 const boxGeo=new T.BoxGeometry(1,1,1);
 function box(x,z,y,w,d,h,color,parent=scene){const mesh=new T.Mesh(boxGeo,mat(color));mesh.position.set(x+w/2,y+h/2,z+d/2);mesh.scale.set(w,h,d);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function round(x,z,y,r,color,sx=1,sy=1,sz=1,parent=scene){const key='sphere'+r;if(!geometries.has(key))geometries.set(key,new T.SphereGeometry(r,20,14));const mesh=new T.Mesh(geometries.get(key),mat(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function label(x,z,y,text,parent=scene){const surface=document.createElement('canvas');surface.width=256;surface.height=64;const sprite=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(surface),depthTest:false,transparent:true}));sprite.position.set(x,y,z);sprite.renderOrder=10;parent.add(sprite);labels.push({sprite,surface,text,last:''});}
 function terrain(points,y,color){const shape=new T.Shape();points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const mesh=new T.Mesh(new T.ShapeGeometry(shape),mat(color));mesh.rotation.x=-Math.PI/2;mesh.position.y=y;mesh.receiveShadow=true;scene.add(mesh);return mesh;}
 box(-30,-30,-.25,70,70,.1,'#5b7f80');
 terrain([[-3,-3],[15,-3],[17,1],[16,15],[3,17],[-4,10]],-.04,'#b5a789');
 const land=terrain([[-2.5,-2.5],[14.5,-2.5],[16.5,1],[15.5,14.5],[3,16.5],[-3.5,9.5]],0,'#849573');
 box(-2,7,.015,17,1.1,.02,'#bcb7a5');box(7.2,-2,.016,1,17,.02,'#bcb7a5');
 for(let x=-1;x<15;x+=1.5)box(x,7.53,.042,.6,.04,.005,'#e7e0cf');
 // Neighbourhood swimming pond: stone coping, water basin and wooden access pier.
 box(3.1,8.75,.015,2.4,1.6,.02,'#a5987e');
 box(3.22,8.87,.01,2.16,1.36,.035,'#5b7f80');
 box(3.5,9.25,.046,1.5,.03,.004,'#7dabad');box(3.6,9.75,.046,1.3,.03,.004,'#7dabad');
 box(4.02,8.35,.035,.56,.75,.045,'#8a7050');
 for(let z=8.4;z<9.08;z+=.14)box(4.04,z,.082,.52,.02,.005,'#6b5236');
 for(const x of [4.05,4.5])box(x,9.05,0,.05,.05,.26,'#6b5236');
 // A field is usable ground; its markings sit on the same plane as the actors.
 box(9,9,.025,4,3,.015,'#76896a');
 for(const [x,z,w,d]of [[9,9,4,.025],[9,12,4,.025],[9,9,.025,3],[13,9,.025,3],[11,9,.025,3]])box(x,z,.05,w,d,.005,'#dedec7');
 for(const x of [9,13]){box(x,10,.05,.035,.035,.65,'#e6dfcc');box(x,11,.05,.035,.035,.65,'#e6dfcc');box(x,10,.7,.035,1,.035,'#e6dfcc');}
 const farm=new T.Group();scene.add(farm);for(let i=0;i<4;i++){box(-1+i*.6,1,.02,.35,3,.02,'#927b58',farm);for(let z=1.2;z<4;z+=.4)round(-.85+i*.6,z,.13,.1,'#718559',1,.8,1,farm);}
 function tree(x,z,parent=scene){
  const trunk=new T.Mesh(new T.CylinderGeometry(.055,.1,1.1,8),mat('#77644b'));trunk.position.set(x,.55,z);trunk.castShadow=true;parent.add(trunk);
  for(const [dx,dz,dy,r]of [[0,0,1.35,.48],[-.3,.15,1.25,.35],[.28,.1,1.45,.34],[0,-.2,1.65,.3]])round(x+dx,z+dz,dy,r,'#526c50',1,1.1,1,parent);
 }
 const summerTrees=new T.Group();scene.add(summerTrees);[[1,4],[9,6],[4,1],[5,15],[14,12],[2,10],[14,2]].forEach(([x,z])=>tree(x,z,summerTrees));
 // Weather: snow where the place is cold, rain in the flood years. Points and lines, one draw each.
 const flakes=new Float32Array(900*3);for(let i=0;i<900;i++){flakes[i*3]=Math.random()*24-12;flakes[i*3+1]=Math.random()*9;flakes[i*3+2]=Math.random()*24-12;}
 const snowGeo=new T.BufferGeometry();snowGeo.setAttribute('position',new T.BufferAttribute(flakes,3));
 const snow=new T.Points(snowGeo,new T.PointsMaterial({color:'#ffffff',size:4,sizeAttenuation:false,transparent:true,opacity:.85,depthWrite:false}));snow.visible=false;scene.add(snow);
 const drops=new Float32Array(500*6),dropY=new Float32Array(500);for(let i=0;i<500;i++){const x=Math.random()*24-12,z=Math.random()*24-12;dropY[i]=Math.random()*9;drops.set([x,dropY[i],z,x+.04,dropY[i]-.38,z+.04],i*6);}
 const rainGeo=new T.BufferGeometry();rainGeo.setAttribute('position',new T.BufferAttribute(drops,3));
 const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:'#c9d8dc',transparent:true,opacity:.45,depthWrite:false}));rain.visible=false;scene.add(rain);
 function roof(x,z,w,d,h,parent){
  const positions=[x-.18,h,z-.18,x+w+.18,h,z-.18,x+w+.18,h+.65,z+d/2,x-.18,h+.65,z+d/2,x-.18,h,z+d+.18,x+w+.18,h,z+d+.18];
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex([0,2,1,0,3,2,3,5,2,3,4,5,0,4,3,1,2,5]);geometry.computeVertexNormals();
  const mesh=new T.Mesh(geometry,mat('#99634f'));mesh.material.side=T.DoubleSide;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);
  for(let i=.18;i<w;i+=.3){const a=new T.Vector3(x+i,h+.008,z-.18),b=new T.Vector3(x+i,h+.658,z+d/2),c=new T.Vector3(x+i,h+.008,z+d+.18);const g=new T.BufferGeometry().setFromPoints([a,b,c]);parent.add(new T.Line(g,new T.LineBasicMaterial({color:'#805541',transparent:true,opacity:.35})));}
 }
 function building(x,z,w,d,h,name,parent=scene){
  const group=new T.Group();parent.add(group);parent=group;group.userData.building=true;
  box(x,z,0,w,d,.12,'#a19478',parent);if(!name||name==='MARKET')shopfront({box},x,z,w,d,h,parent);else{box(x,z,.12,w,d,h,'#dbcfad',parent);roof(x,z,w,d,h+.12,parent);}
  for(let a=x+.3;a<x+w-.3;a+=.65){box(a,z+d+.012,.65,.32,.018,.58,'#6c7d77',parent);box(a+.145,z+d+.035,.65,.025,.015,.58,'#b9b69e',parent);}
  box(x+w*.46,z+d+.01,.12,.42,.04,1,'#695945',parent);box(x+w*.45,z+d+.07,.015,.5,.35,.1,'#b3a68a',parent);
  if(name)label(x+w*.85,z+d+.3,.12,name,group);
  const surfaces=[];group.traverse(o=>{if(o.material){const roof=o.material===materials.get('#99634f');o.material=o.material.clone();o.material.userData.roof=roof;surfaces.push({material:o.material,opacity:o.material.opacity,transparent:o.material.transparent,depthWrite:o.material.depthWrite});}});buildings.push({group,surfaces});
 }
 const town=new T.Group();scene.add(town);
 building(-.5,-.5,2.5,2,1.8,'MARKET',town);building(9,-1,3,2,2.2,'SCHOOL',town);building(11,3,3,2,2.4,'WORK',town);building(1,11,2.3,2,1.9,'CLINIC',town);
 building(2.9,-.5,2,2.8,2.4,'',town);building(4.9,-.5,2,2.8,2.2,'',town);
 building(-2,-2,1.8,1.5,2.4,'',town);building(0,-3,1.9,1.6,2.7,'CITY',town);
 for(const [from,x,z,w,d,h]of townGrowth){const group=new T.Group();town.add(group);building(x,z,w,d,h,'',group);growth.push([from,group]);}
 box(2.6,2.75,.015,4.6,4.2,.025,'#b2ac97');
 // The existing home remains an intentional cutaway, with visible supported furniture.
 const homeFloor=box(3,3,0,4,3.6,.16,'#a58d69');for(let x=3;x<7;x+=.25)box(x,3,.163,.009,3.6,.003,'#8d7858');
 const rampGeometry=new T.BufferGeometry();rampGeometry.setAttribute('position',new T.Float32BufferAttribute([3,.16,6.6,7,.16,6.6,7,0,7.2,3,0,7.2],3));rampGeometry.setIndex([0,2,1,0,3,2]);rampGeometry.computeVertexNormals();const ramp=new T.Mesh(rampGeometry,mat('#a58d69'));ramp.receiveShadow=true;scene.add(ramp);
 const homeWalls=[box(3,3,.16,4,.1,2.25,'#e5d9b9'),box(3,3,.16,.1,4,2.25,'#d7caab')];for(const m of [homeFloor,...homeWalls])m.material=m.material.clone();
 box(4,3.11,.8,1.6,.025,.95,'#78918a');box(4.76,3.14,.8,.035,.02,.95,'#c9c5ae');
 const bed=furniture[0];box(bed.x,bed.y,.16,bed.w,bed.d,.35,'#7d6951');box(bed.x+.04,bed.y+.04,.51,bed.w-.08,bed.d-.08,.12,'#dfdcc9');box(bed.x+.04,bed.y+.6,.64,bed.w-.08,bed.d-.65,.035,'#769282');box(bed.x+.15,bed.y+.1,.65,.8,.34,.1,'#eee7d6');
 box(bed.x,bed.y,.16,bed.w,.07,.72,'#7d6951');box(bed.x,bed.y+bed.d-.06,.16,bed.w,.06,.45,'#7d6951');
 for(const x of [bed.x+.15,bed.x+.55,bed.x+.95])box(x,bed.y+.63,.679,.012,bed.d-.72,.004,'#a8b5a0');
 // Narrow shelves and curtains live against the wall, outside every route.
 box(3.13,3.2,.16,.15,.38,1.1,'#8c795e');for(let i=0;i<4;i++)box(3.15,3.23+i*.07,.8,.12,.045,.3,i%2?'#9a8063':'#7b9186');
 for(const x of [3.87,5.62])box(x,3.14,.78,.13,.055,1.04,'#d1bfa1');box(3.85,3.13,1.83,1.92,.04,.045,'#7d6951');
 const cradleGroup=new T.Group();scene.add(cradleGroup);const crib=furniture[1];box(crib.x,crib.y,.16,crib.w,crib.d,.4,'#8a7458',cradleGroup);box(crib.x+.04,crib.y+.04,.56,crib.w-.08,crib.d-.08,.07,'#e4decd',cradleGroup);
 for(let x=crib.x;x<=crib.x+crib.w;x+=.18)box(x,crib.y+crib.d,.56,.025,.025,.37,'#8a7458',cradleGroup);box(crib.x,crib.y+crib.d,.93,crib.w,.025,.025,'#8a7458',cradleGroup);
 const infant=new T.Group();scene.add(infant);round(5.12,5.04,.7,.19,'#e5d2a4',1.8,.65,.85,infant);round(5.48,5.03,.74,.135,'#bb936f',1,.85,1,infant);
 for(const z of [4.99,5.07])round(5.535,z,.827,.012,'#39473e',.8,1,.7,infant);
 const desk=furniture[2];for(const dx of [.03,desk.w-.08])for(const dz of [.03,desk.d-.08])box(desk.x+dx,desk.y+dz,.16,.05,.05,.65,'#8c795e');box(desk.x,desk.y,.81,desk.w,desk.d,.055,'#c4b496');box(desk.x+.1,desk.y+.2,.87,.3,.36,.012,'#ece5d5');box(desk.x+.45,desk.y+.3,.875,.025,.3,.018,'#8e5e46');
 function chair(x,z,angle=0,floor=0,parent=scene){const group=new T.Group();group.position.set(x,floor,z);group.rotation.y=angle;parent.add(group);for(const dx of [-.18,.13])for(const dz of [-.15,.13])box(dx,dz,.02,.045,.04,.47,'#816c52',group);box(-.2,-.2,.49,.4,.4,.06,'#9f9377',group);box(-.2,-.2,.5,.4,.04,.43,'#9f9377',group);return group;}
 for(const[name,[x,z]]of Object.entries(HOME))chair(x,z,HOME_FACING[name],.16);
 const deskSeat=furniture[3];chair(deskSeat.x+deskSeat.w/2,deskSeat.y+deskSeat.d/2,Math.PI,.16);
 chair(10.5,1.6);const workChair=chair(11.3,5.8);chair(12.4,5.8);
 function table(x,z,w=.75,parent=scene){for(const dx of [0,w-.04])for(const dz of [0,.4])box(x+dx,z+dz,0,.04,.04,.78,'#77684f',parent);box(x-.04,z-.04,.78,w+.08,.52,.06,'#a99773',parent);}
 for(const[x,z]of taskDesks)table(x,z);const dinner=new T.Group();dinner.position.y=.16;scene.add(dinner);box(5.2,6.1,.78,1,.55,.06,'#a99773',dinner);for(const x of [5.2,6.15])for(const z of [6.1,6.6])box(x,z,0,.045,.045,.78,'#77684f',dinner);for(const[x,z]of [[5.4,6.3],[5.75,6.25],[6,6.3]])round(x,z,1.015,.11,'#e7dfcc',1,.08,1);box(10.3,2,.85,.32,.2,.015,'#ece5d5');box(12.2,6.2,.85,.3,.22,.02,'#e5ddc9');
 // A lived-in home: kitchen corner, rug, lamp, plant and toys, placed clear of every route.
 box(3.1,5.62,.16,.4,.95,.82,'#9a8566');box(3.08,5.6,.98,.44,.99,.05,'#d9d0bc');round(3.3,5.9,1.08,.11,'#5a5f5a',1,.7,1);box(3.15,6.25,1.03,.3,.2,.03,'#b5713f');
 for(const [x,z,c]of [[3.95,5.6,'#a5533f'],[4.12,5.6,'#d6b26a'],[4.29,5.6,'#a5533f'],[4.46,5.6,'#3f6f6a'],[4.63,5.6,'#a5533f']])box(x,z,.164,.17,.8,.004,c);
 box(3.9,5.55,.16,1,.9,.003,'#c99a5a');
 const lamp=new T.Group();scene.add(lamp);box(3.18,4.98,.16,.06,.06,1.25,'#5f5545',lamp);const shade=new T.Mesh(new T.CylinderGeometry(.11,.17,.2,20,1,true),new T.MeshLambertMaterial({color:'#f0d9a8',emissive:'#f5c46a',emissiveIntensity:0,side:T.DoubleSide}));shade.position.set(3.21,1.45,5.01);lamp.add(shade);
 const glow=new T.PointLight('#ffc070',0,6,1.6);glow.position.set(3.6,1.6,5.2);scene.add(glow);
 round(6.75,3.35,.38,.18,'#4f7a4a',1,1.4,1);box(6.62,3.22,.16,.26,.26,.22,'#a5533f');
 const toys=new T.Group();scene.add(toys);box(4.55,6.12,.165,.09,.09,.09,'#c0563f',toys);box(4.62,6.02,.165,.09,.09,.09,'#d8b25a',toys);box(4.59,6.07,.255,.09,.09,.09,'#3f6f8a',toys);
 const dogGroup=new T.Group();dogGroup.position.set(2.7,0,5.2);scene.add(dogGroup);box(-.12,-.08,.05,.24,.16,.18,'#a26a3c',dogGroup);round(.14,0,.22,.1,'#945c30',1,1,1.1,dogGroup);box(.1,-.1,.28,.04,.05,.08,'#693e1e',dogGroup);box(.1,.05,.28,.04,.05,.08,'#693e1e',dogGroup);box(-.18,-.03,.14,.08,.05,.1,'#825026',dogGroup);for(const [dx,dz]of [[-.08,-.06],[.06,-.06],[-.08,.06],[.06,.06]])box(dx,dz,.01,.06,.06,.1,'#784420',dogGroup);
 // A laptop and bench distinguish salaried work from school and craft.
 const laptop=new T.Group();scene.add(laptop);box(11.06,6.2,.85,.34,.23,.025,'#536760',laptop);const screen=box(11.06,6.4,.86,.34,.025,.23,'#526a66',laptop);screen.rotation.x=-.15;
 const workpiece=box(11.08,6.24,.85,.3,.18,.08,'#bea37a');
 function registerBuilding(group){group.userData.building=true;const surfaces=[];group.traverse(o=>{if(o.material){const color=o.material.color?.getHexString();o.material=o.material.clone();o.material.userData.ground=color==='899273';o.material.userData.roof=color==='8d8b78';surfaces.push({material:o.material,opacity:o.material.opacity,transparent:o.material.transparent,depthWrite:o.material.depthWrite});}});buildings.push({group,surfaces});}
 const inhabited=createInhabitedRooms({scene,box,round});
 const scenery=createRegionScenery({scene,box,round,tree,label,registerBuilding});
 const districts=createDistricts({scene,box,round,chair,table,tree,label,registerBuilding});
 // The artist carries a sketchbook; the exit aisle stays clear.
 const stall=new T.Group();scene.add(stall);box(6.4,8.5,0,1.6,.8,.78,'#9d8965',stall);box(6.2,8.3,1.65,2,1.2,.08,'#ab7658',stall);for(const x of [6.4,7.9])box(x,8.5,.78,.045,.045,.85,'#77684f',stall);for(let i=0;i<4;i++)round(6.65+i*.28,8.8,.85,.09,'#b5a16d',1,1,1,stall);registerBuilding(stall);
 const flood=box(1,6.8,.065,9,1.6,.025,'#809e98');flood.material=new T.MeshStandardMaterial({color:'#809e98',transparent:true,opacity:.55,roughness:.4});
 const actors={mother:createCharacter({shirt:'#718979',sex:'female'}),father:createCharacter({shirt:'#87735c'}),player:createCharacter({shirt:'#bd914d'})};for(const actor of Object.values(actors))scene.add(actor.root);
 const neighbors=[[8.4,6.4,'#93957b'],[9.2,6.4,'#788c98'],[12.9,6.3,'#9a8e72'],[8.4,0,'#8f7a69']].map(([x,z,shirt])=>{const a=createCharacter({shirt});scene.add(a.root);return {a,x,z};});
 // Clothing follows region, sex, age and role; colours are authored, never data.
 const WARDROBE={market:['#718979','#87735c','#a0674e','#5f7a8a','#b08a4a'],slum:['#5f7a8a','#a0674e','#7a7468','#b85a45','#c9a14a'],village:['#6f5a8a','#8a5a3c','#4f6a5a','#b07a3a','#3f5a7a'],condo:['#4f6a7a','#e3ddd0','#8a8f86','#a05a4a','#2f4a5a'],coast:['#3f7f9a','#d8c8a0','#c0563f','#5f8a6a','#e6d9b8'],villa:['#f2efe6','#2f3f5a','#8a9aa0','#b89a6a','#5a3a3a'],tower:['#e8e2d4','#5f7a8a','#c77d5a','#2f4a5a','#9aa08a'],tokyo:['#2f3a40','#e8e6df','#5f6f72','#8a7a6a','#3f5a7a'],brick:['#2f3a40','#8a2f2a','#c8b89a','#3f5f7a','#5f6a4a']};
 const WINTER=['#2f3a40','#5a3a3a','#3f5a7a','#6a5a4a','#4f5f4a','#8a2f2a'];
 function dress(key,state,regionId,sex,age,role){
  const style=region(regionId).style,list=WARDROBE[style]??WARDROBE.market,r=d=>rand(state.seed,0,key+d),climate=region(regionId).climate;
  // In a cold place everyone over three is in a coat and scarf; a cool one means sweaters.
  if(climate==='cold'&&age>=3)return {shirt:WINTER[Math.floor(r('c')*WINTER.length)],bottom:'#2f3a40',skirt:false,coat:true,scarf:true,hat:true,sweater:false,scarfColor:['#a5533f','#d8b25a','#3f6f8a','#e6e0cf'][Math.floor(r('sc')*4)]};
  // A cool city (London, Tokyo) means a coat and a scarf outdoors; only the cold one adds a hat.
  if(climate==='cool'&&age>=3)return {shirt:WINTER[Math.floor(r('c')*WINTER.length)],bottom:'#2f3a40',skirt:false,coat:true,scarf:true,hat:false,sweater:false,scarfColor:['#a5533f','#d8b25a','#3f6f8a','#e6e0cf'][Math.floor(r('sc')*4)]};
  const layers={coat:false,scarf:false,sweater:false};
  // Thai school uniform: white shirt, navy shorts or skirt.
  if(role==='player'&&age>=6&&age<18&&region(regionId).country==='TH')return {shirt:'#efeee8',bottom:'#2f3d5c',skirt:sex==='female',...layers};
  const bottom=['#364744','#2f3a40','#5a4a3a','#3f4f5f'][Math.floor(r('b')*4)];
  return {shirt:list[Math.floor(r('s')*list.length)],bottom:sex==='female'&&r('k')<.72?list[Math.floor(r('k2')*list.length)]:bottom,skirt:sex==='female'&&r('k')<.72,...layers};
 }
 function applyLooks(state,age,here,born){
  const hh=household(state.birth),seed=state.seed;
  const withGrandparents=childhoodAway(state.birth,age);
  for(const name of ['mother','father']){const m=withGrandparents?{sex:name==='mother'?'female':'male',elder:true}:hh[name],from=withGrandparents?here:born,look=appearance(rand,seed,(withGrandparents?'grand-':'')+name,from,{sex:m.sex,elder:!!m.elder});actors[name].setLook({...look,...dress(name,state,from,m.sex,age,name)});}
  const sex=state.intake?.sex??['female','male','intersex'][Math.floor(rand(seed,0,'intake-sex')*3)],self=appearance(rand,seed,'player',born,{sex});
  actors.player.setLook({...self,...dress('player',state,here,sex,age,'player')});
  neighbors.forEach(({a},i)=>{const ns=rand(seed,i,'neighbour-sex')<.5?'female':'male',look=appearance(rand,seed+i*7919,'n'+i,here,{sex:ns,elder:i===3&&age>=40});a.setLook({...look,...dress('n'+i,state,here,ns,30,'neighbour')});});
 }
 const bus=new T.Group();scene.add(bus);box(0,0,.2,1.2,.55,.6,'#849488',bus);box(.15,.03,.78,.8,.49,.05,'#dddcca',bus);for(const x of [.2,1])for(const z of [0,.55]){const tire=new T.Mesh(new T.CylinderGeometry(.14,.14,.06,12),mat('#34443b'));tire.rotation.x=Math.PI/2;tire.position.set(x,.2,z);bus.add(tire);}
 let lost=false;canvas.addEventListener('webglcontextlost',()=>{lost=true;});
 const post=createPost(renderer,scene,camera);
 const target=new T.Vector3(),ray=new T.Raycaster();let width=0,height=0,lastMood='',lastRegion='',lastLooks='';
 function update(state,age,time,{homeFrame=false}={}){
  repaint(currentPalette()?.world);
  if(lost)throw new Error('Graphics context lost');
  const w=canvas.clientWidth,h=canvas.clientHeight;if(w<2||h<2)return;
  if(w!==width||h!==height){width=w;height=h;const dpr=devicePixelRatio||1;renderer.setPixelRatio(Math.min(dpr,2,Math.sqrt(4.2e6/(w*h))));renderer.setSize(w,h,false);post.setSize(w,h,renderer.getPixelRatio());}
  // One region per age: scenery, home materials and ground follow it.
  const here=regionAt(state,age),place=region(here),born=regionIdFor(state.birth);
  if(here!==lastRegion){lastRegion=here;lastMood='';town.visible=place.style==='market';summerTrees.visible=place.climate!=='cold';farm.visible=['market','village','coast'].includes(place.style);scenery.update(place.style);homeFloor.material.color.set(place.look.floor);homeWalls[0].material.color.set(place.look.wall);homeWalls[1].material.color.set(place.look.wall).multiplyScalar(.92);}
  const looks=[here,state.seed,state.birth?.household,state.intake?.sex,age<6?0:age<18?1:age<60?2:3].join('/');
  if(looks!==lastLooks){lastLooks=looks;applyLooks(state,age,here,born);}
  canvas.setAttribute('aria-label',original.getAttribute('aria-label')??'Your growing world');
  const context=routineContext(state,age),goal=state.profiles.at(-1)?.profile.aim??'balance';
  const activity=routine('player',age,time,goal,context),focus=homeFrame?{...activity,x:context.residence.origin[0],y:context.residence.origin[1],moving:false,pose:'eat'}:activity;
  // The camera widens with age; its target stays grounded in the character's activity.
  const phone=w<=720;
  // The town is about twenty-two units across. A frame wider than that would
  // show empty ground on both sides, so the view is capped and the camera moves
  // in: the picture is filled with the town, not with the land around it.
  const base=cameraSpan(age,phone)*(age>=10&&!focus.moving&&['eat','rest','draw','recover','work','craft','study','garden'].includes(focus.pose)?.82:1);
  const span=base*Math.min(1,TOWN_WIDTH/(base*w/h));
  const dock=!phone&&!document.body.classList.contains('birth-stage')&&!document.body.classList.contains('recap-stage')?overlappingReaderWidth(canvas.getBoundingClientRect(),document.querySelector('.console-reader')?.getBoundingClientRect()):0;
  // Shift the projection, not the actor: their activity stays in the uncovered play area.
  const shift=span*dock/(2*h);
  camera.left=-span*w/h/2+shift;camera.right=span*w/h/2+shift;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();
  const follow=age<5?0:1;target.set(5.3+(focus.x-5.3)*follow,.4,5.3+(focus.y-5.3)*follow);camera.position.copy(target).add(new T.Vector3(12,18,12));camera.lookAt(target);
  // The sun travels with the view so shadows exist wherever the life goes.
  sun.position.copy(target).add(new T.Vector3(-12.3,16.6,3.7));sun.target.position.copy(target);
  for(const [name,actor]of Object.entries(actors)){
   const a=routine(name,age,time,goal,context);
   // Parents live where the family lives; they appear only while you do too.
   actor.root.visible=name==='player'?age>=1:(here===born||childhoodAway(state.birth,age))&&(name==='mother'?age<70:age<55);
   actor.update(a,age,time,{elder:name==='player'?age>=60:age>=30||!!household(state.birth)[name]?.elder||childhoodAway(state.birth,age),scale:name==='player'?Math.min(1,.48+age*.035):1});actor.root.position.y=floorAt(a.x,a.y);
  }
  for(const [i,{a,x,z}]of neighbors.entries()){
   const phase=(time+i*27)%120,walking=phase>=8&&phase<50||phase>=68&&phase<110;
   const progress=phase<8?0:phase<50?(phase-8)/42:phase<68?1:phase<110?1-(phase-68)/42:0;
   const path=[[-1,8.35-i*.15],[8.55+i*.18,8.35-i*.15],[8.55+i*.18,12.8]];
   const pos=i<2?samplePath(path,progress):{x,y:z,dx:0,dy:0};if(phase>=68){pos.dx*=-1;pos.dy*=-1;}
   a.update({...pos,pose:i<2&&walking?'walk':'stand',moving:i<2&&walking},age,time,{elder:age>=60,scale:age<15?.65:1});
  }
  districts.update(state,age);inhabited.update(state,age);
  const manual=context.pathway==='vocational'&&age>=15&&age<60;workChair.visible=!manual;laptop.visible=!manual;workpiece.visible=manual;infant.visible=age<1;cradleGroup.visible=age<6;bus.visible=age>=5;bus.position.set(-1+time*.12%14,0,7.25);for(const[from,group]of growth)group.visible=age>=from;
  flood.visible=state.history.some(r=>r.age===30&&/Floodwater/i.test(r.event??''))&&age>=30&&age<36;
  const mood=lifeMoodAt(state,age);if(mood!==lastMood){lastMood=mood;const chord=MOOD_CHORDS[mood];land.material.color.set(place.look.ground).lerp(new T.Color(chord.land),.35);materials.get('#899273')?.color.copy(land.material.color).lerp(new T.Color('#899273'),.25);materials.get('#526c50')?.color.set(chord.leaf);materials.get('#5b7f80')?.color.set(place.look.water).lerp(new T.Color(chord.water),.3);scene.background.set(chord.waterLight).lerp(new T.Color(chord.water),.6);for(const b of buildings)for(const {material}of b.surfaces){if(material.userData.roof)material.color.set(chord.roof).lerp(new T.Color('#766350'),.45);if(material.userData.ground)material.color.copy(land.material.color).lerp(new T.Color('#899273'),.25);}
   // Mood and region colours still pass through the world's Wada chord.
   for(const c of [land.material.color,materials.get('#526c50')?.color,materials.get('#5b7f80')?.color,scene.background])if(c)tint(c,.28);
   // Snow stays white whatever the mood; the mood shows in the sky and the water instead.
   if(place.climate==='cold'){land.material.color.set('#e6ecec');materials.get('#899273')?.color.set('#e6ecec');}for(const b of buildings)for(const {material}of b.surfaces)if(material.userData.roof)tint(material.color,.3);}
  // The sun crosses the sky through the day: low and warm in the morning, high and white at noon, gold by evening.
  const evening=time%60>=48,phase=time%60/60,sunUp=Math.max(.15,Math.sin(Math.min(1,phase/.8)*Math.PI));
  sun.position.copy(target).add(new T.Vector3(-14*Math.cos(phase*Math.PI),4+13*sunUp,6*Math.sin(phase*Math.PI)-2));
  sun.intensity=evening?1.1:1.4+sunUp*1.3;hemi.intensity=evening?.75:1.05+sunUp*.4;sun.color.set(evening?'#ffcf9a':'#ffc98f').lerp(evening?sun.color:new T.Color('#fff4df'),evening?0:sunUp);post.setNight(evening);
  // Weather is the place's, drawn around wherever the life is.
  snow.visible=place.climate==='cold';rain.visible=flood.visible&&!snow.visible;
  if(snow.visible){snow.position.set(target.x,0,target.z);const p=snowGeo.attributes.position.array;for(let i=0;i<900;i++){p[i*3+1]=(9+((i*0.37)%9)-(time*.55+i*.013)%9)%9;p[i*3]=((i*7.31)%24)-12+Math.sin(time*.6+i)*.15;}snowGeo.attributes.position.needsUpdate=true;}
  if(rain.visible){rain.position.set(target.x,0,target.z);const p=rainGeo.attributes.position.array;for(let i=0;i<500;i++){const y=(dropY[i]-time*9%9+9)%9;p[i*6+1]=y;p[i*6+4]=y-.38;}rainGeo.attributes.position.needsUpdate=true;}
  glow.intensity=evening?2.6:0;shade.material.emissiveIntensity=evening?.9:0;toys.visible=age>=1&&age<8;dogGroup.visible=dogAt(state,age);
  // Architectural cutaways keep the protagonist readable through foreground buildings.
  scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
  const hidden=age>=1?obscuringBuildings(camera,Object.values(actors.player.anchors),buildings.map(b=>b.group),ray):new Set();
  for(const {group,surfaces}of buildings)for(const base of surfaces)applyCutaway(base,hidden.has(group));
  for(const entry of labels){const text=t(entry.text);if(text!==entry.last){entry.last=text;const c=entry.surface.getContext('2d');c.clearRect(0,0,256,64);c.font='600 28px Jost, Prompt, sans-serif';const tw=Math.min(240,c.measureText(text).width+22);c.fillStyle='#eee6d2';c.fillRect((256-tw)/2,10,tw,42);c.fillStyle='#273d35';c.textAlign='center';c.fillText(text,128,40);entry.sprite.material.map.needsUpdate=true;}entry.sprite.scale.set(span*1.6/height*64,span*1.6/height*16,1);entry.sprite.visible=age>=10&&(!phone||Math.hypot(entry.sprite.position.x-focus.x,entry.sprite.position.z-focus.y)<2.8);}
  post.render();
 }
 const refreshFonts=()=>{for(const entry of labels)entry.last='';};window.addEventListener('life-fonts-loaded',refreshFonts);
 return {canvas,update,dispose(){window.removeEventListener('life-fonts-loaded',refreshFonts);post.dispose();disposeScene(scene,renderer,canvas);}};
 }catch(error){disposeScene(scene,renderer,canvas);throw error;}
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
