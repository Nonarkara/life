import * as T from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {clone} from 'three/examples/jsm/utils/SkeletonUtils.js';
import {makeVisitorMaterial} from './cast-wardrobe.js';
// The anime cast from Thailand Digital Valley: three rigged VRoid sample models,
// © pixiv Inc. / VRoid Project (commercial use and modification permitted; no
// endorsement implied; see anime/cast/CREDITS.txt). They only ever replace how the
// procedural figure *looks*: the figure still decides where it stands and which
// pose it holds, and this file copies those joint angles onto the model's bones.
const FILES={a:{glb:'visitor-a.glb',map:'a-original.webp',png:'a-original.png',turn:Math.PI},b:{glb:'visitor-b.glb',map:'b-original.webp',png:'b-original.png',turn:0},c:{glb:'visitor-c.glb',map:'c-original.webp',png:'c-original.png',turn:Math.PI}};
export const MODEL_FOR={female:'a',male:'c',intersex:'b'};
const HEIGHT=1.8,HANG=1.38;
export const animeAssetBase=moduleURL=>new URL('../course/anime/cast/',moduleURL);
const base=animeAssetBase(import.meta.url);
let cast=null,pending=null;
export function loadAnimeCast(){
 if(cast||typeof fetch==='undefined')return Promise.resolve(cast);
 if(!pending)pending=Promise.all(Object.entries(FILES).map(async([id,row])=>{
  try{
   const manager=new T.LoadingManager();
   manager.setURLModifier(url=>url.endsWith(row.png)?new URL(row.map,base).href:url);
   const response=await fetch(new URL(row.glb,base));
   if(!response.ok)throw new Error(`Model request failed (${response.status})`);
   const gltf=await new GLTFLoader(manager).parseAsync(await response.arrayBuffer(),base.href);
   const human=gltf.parser.json.extras?.humanBones,names={};
   for(const key in human)names[key]=gltf.parser.json.nodes[human[key]].name;
   for(const key of ['head','leftUpperArm','rightUpperArm','leftLowerArm','rightLowerArm','leftUpperLeg','rightUpperLeg','leftLowerLeg','rightLowerLeg'])if(!names[key])throw new Error(`Missing ${key} bone`);
   let map;gltf.scene.traverse(o=>{if(o.isMesh)for(const m of [].concat(o.material))if(m.map)map=m.map;});
   if(map){map.colorSpace=T.SRGBColorSpace;map.flipY=false;}
   return [id,{row,gltf,map,names}];
  }catch(error){console.warn(`Anime model ${id} unavailable; its drawn figures stay.`,error);return null;}
 })).then(list=>{const ready=list.filter(Boolean);cast=ready.length?Object.fromEntries(ready):null;return cast;}).finally(()=>{pending=null;});
 return pending;
}
// The driver owns reusable quaternions. No Euler, Quaternion or Map is created
// while posing a frame, including the seven simultaneously visible figures.
export function createAnimePoseDriver(bones,align,rig){
 const {head,legs,arms}=rig,qa=new T.Quaternion().setFromEuler(align.rotation),qaInv=qa.clone().invert();
 const rest=new Map(),worldRest=new Map(),posed=new Map(),identity=new T.Quaternion();
 const wr=b=>{if(!b||b===align)return identity;if(worldRest.has(b))return worldRest.get(b);const w=wr(b.parent).clone().multiply(b.quaternion);worldRest.set(b,w);return w;};
 for(const b of Object.values(bones)){rest.set(b,b.quaternion.clone());wr(b);}
 const entry=b=>{if(!b)return null;const e={bone:b,rest:wr(b),world:new T.Quaternion(),parent:null};posed.set(b,e);return e;};
 const sideOf=limb=>limb.pivot.position.x>=0?'left':'right';
 const limbs=legs.map((leg,i)=>{
  const legSide=sideOf(leg),armSide=sideOf(arms[i]);
  return {leg,arm:arms[i],sign:arms[i].pivot.position.x>=0?1:-1,
   lu:entry(bones[legSide+'UpperLeg']),ll:entry(bones[legSide+'LowerLeg']),ft:entry(bones[legSide+'Foot']),
   au:entry(bones[armSide+'UpperArm']),al:entry(bones[armSide+'LowerArm']),hd:entry(bones[armSide+'Hand'])};
 });
 const headEntry=entry(bones.head);
 for(const e of posed.values())e.parent=posed.get(e.bone.parent)?.world??wr(e.bone.parent);
 const euler=new T.Euler(0,0,0,'XYZ'),u=new T.Quaternion(),l=new T.Quaternion(),lower=new T.Quaternion(),inverseParent=new T.Quaternion();
 const rotation=(out,x=0,y=0,z=0)=>out.setFromEuler(euler.set(x,y,z));
 const place=(e,delta)=>{
  if(!e)return;
  e.world.copy(qaInv).multiply(delta).multiply(qa).multiply(e.rest);
  e.bone.quaternion.copy(inverseParent.copy(e.parent).invert().multiply(e.world));
 };
 return function drive(){
  for(const [b,q] of rest)b.quaternion.copy(q);
  for(const row of limbs){
   const {leg,arm,sign,lu,ll,ft,au,al,hd}=row;
   if(lu&&ll){rotation(u,leg.pivot.rotation.x,0,leg.pivot.rotation.z);rotation(l,leg.bend.rotation.x).multiply(u);place(lu,u);place(ll,l);place(ft,identity);}
   if(au&&al){
    // Source T-pose to the procedural hanging arm, then the existing pose.
    rotation(lower,0,0,-sign*HANG);rotation(u,arm.pivot.rotation.x,0,arm.pivot.rotation.z).multiply(lower);
    rotation(l,arm.bend.rotation.x).multiply(u);place(au,u);place(al,l);place(hd,l);
   }
  }
  rotation(u,head.rotation.x,head.rotation.y,head.rotation.z);place(headEntry,u);
 };
}
// Dress one procedural figure in the anime model. Returns false when the cast is not ready.
export function attachAnime(actor){
 if(!cast||actor.anime)return false;
 const {body,bodyParts,look}=actor.rig;
 let model=null,wardrobe={top:'#bd8334',bottom:'#303e4c',trim:'#ddd7c6',pattern:0,bottomPattern:0};
 function build(id){
  const source=cast[id],visual=clone(source.gltf.scene),align=new T.Group();align.rotation.y=source.row.turn;align.add(visual);
  const box=new T.Box3().setFromObject(align),scale=HEIGHT/(box.max.y-box.min.y);align.scale.setScalar(scale);align.position.y=-box.min.y*scale;
  const material=makeVisitorMaterial(source.map,wardrobe),skeletons=new Set();
  visual.traverse(o=>{if(o.isSkinnedMesh){o.material=material;o.frustumCulled=false;o.castShadow=true;o.receiveShadow=true;skeletons.add(o.skeleton);}});
  const bones={};for(const key in source.names){const b=visual.getObjectByName(source.names[key]);if(b)bones[key]=b;}
  const drive=createAnimePoseDriver(bones,align,actor.rig);
  body.add(align);
  return {id,align,material,bones,drive,scale,turned:Math.abs(source.row.turn)>1,dispose(){body.remove(align);material.dispose();for(const skeleton of skeletons)skeleton.dispose();}};
 }
 const originalUpdate=actor.update,originalLook=actor.setLook;
 function use(id){if(model?.id===id)return;model?.dispose();model=cast[id]?build(id):null;for(const p of bodyParts)p.visible=!model;}
 const pick=()=>look.model??MODEL_FOR[look.sex]??'c';
 function dress(){
  if(!model)return;const m=model.material.userData.visitorGarments;
  model.align.scale.x=model.align.scale.z=model.scale*(look.build??1);
  if(look.shirt)m.visitorTop.value.set(look.shirt);if(look.bottom)m.visitorBottom.value.set(look.bottom);
 }
 actor.setLook=(next={})=>{originalLook(next);if(next.shirt)wardrobe.top=next.shirt;if(next.bottom)wardrobe.bottom=next.bottom;if(model){use(pick());dress();}};
 const lean=new T.Quaternion(),xAxis=new T.Vector3(1,0,0);
 actor.update=(activity,age,time,options)=>{originalUpdate(activity,age,time,options);if(!model){use(pick());dress();}if(!model)return;model.drive();
  // Children have big heads; elders fold forward at the upper back. Both are after the walk.
  if(model.bones.head)model.bones.head.scale.setScalar(look.headScale??1);
  const stoop=look.stoop??0;if(stoop){lean.setFromAxisAngle(xAxis,stoop*(model.turned?-1:1));for(const k of ['spine','chest'])model.bones[k]?.quaternion.multiply(lean);}};
 // Detaching restores the procedural body; shared source geometry/maps stay cached.
 actor.anime={model:()=>model,shade(v){if(model)model.material.color.setScalar(v);},detach(){for(const p of bodyParts)p.visible=true;model?.dispose();model=null;actor.update=originalUpdate;actor.setLook=originalLook;actor.anime=null;}};
 return true;
}
