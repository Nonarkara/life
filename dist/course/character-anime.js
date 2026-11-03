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
const base=new URL('./anime/cast/',import.meta.url);
let cast=null,pending=null;
export function loadAnimeCast(){
 if(cast||typeof fetch==='undefined')return Promise.resolve(cast);
 if(!pending)pending=Promise.all(Object.entries(FILES).map(async([id,row])=>{
  const manager=new T.LoadingManager();
  manager.setURLModifier(url=>url.endsWith(row.png)?new URL(row.map,base).href:url);
  const bytes=await (await fetch(new URL(row.glb,base))).arrayBuffer();
  const gltf=await new GLTFLoader(manager).parseAsync(bytes,base.href);
  const human=gltf.parser.json.extras?.humanBones,names={};
  for(const key in human)names[key]=gltf.parser.json.nodes[human[key]].name;
  let map;gltf.scene.traverse(o=>{if(o.isMesh)for(const m of [].concat(o.material))if(m.map)map=m.map;});
  if(map){map.colorSpace=T.SRGBColorSpace;map.flipY=false;}
  return [id,{row,gltf,map,names}];
 })).then(list=>{cast=Object.fromEntries(list);return cast;}).catch(error=>{console.warn('Anime cast unavailable; the drawn figures stay.',error);return null;});
 return pending;
}
const Q=()=>new T.Quaternion(),E=(x=0,y=0,z=0)=>Q().setFromEuler(new T.Euler(x,y,z,'XYZ'));
// Dress one procedural figure in the anime model. Returns false when the cast is not ready.
export function attachAnime(actor){
 if(!cast||actor.anime)return false;
 const {body,head,legs,arms,bodyParts,look}=actor.rig;
 let model=null,wardrobe={top:'#bd8334',bottom:'#303e4c',trim:'#ddd7c6',pattern:0,bottomPattern:0};
 const sideOf=arm=>arm.pivot.position.x>=0?1:-1;
 function build(id){
  const source=cast[id],visual=clone(source.gltf.scene),align=new T.Group();align.rotation.y=source.row.turn;align.add(visual);
  const box=new T.Box3().setFromObject(align),scale=HEIGHT/(box.max.y-box.min.y);align.scale.setScalar(scale);align.position.y=-box.min.y*scale;
  const material=makeVisitorMaterial(source.map,wardrobe);
  visual.traverse(o=>{if(o.isSkinnedMesh){o.material=material;o.frustumCulled=false;}});
  const bones={};for(const key in source.names){const b=visual.getObjectByName(source.names[key]);if(b)bones[key]=b;}
  const qa=Q().setFromEuler(align.rotation),qaInv=qa.clone().invert(),rest=new Map(),worldRest=new Map();
  const wr=b=>{if(worldRest.has(b))return worldRest.get(b);const p=b.parent&&b.parent!==align&&b.parent!==visual?wr(b.parent):Q();const w=p.clone().multiply(b.quaternion);worldRest.set(b,w);return w;};
  for(const b of Object.values(bones)){rest.set(b,b.quaternion.clone());wr(b);}
  body.add(align);
  return {id,align,material,bones,qa,qaInv,rest,worldRest};
 }
 const toAlign=(m,d)=>m.qaInv.clone().multiply(d).multiply(m.qa);
 function drive(m){
  const {bones:B,rest,worldRest}=m,posed=new Map();
  const place=(bone,d)=>{ // d: world delta in the figure's frame
   const w=toAlign(m,d).multiply(worldRest.get(bone));posed.set(bone,w);
   const parent=bone.parent,pw=posed.get(parent)??worldRest.get(parent)??Q();
   bone.quaternion.copy(pw.clone().invert().multiply(w));
  };
  for(const [b,q] of rest)b.quaternion.copy(q);
  for(let i=0;i<2;i++){
   const side=sideOf(arms[i])>0?'left':'right',legSide=sideOf(legs[i])>0?'left':'right';
   const lu=B[legSide+'UpperLeg'],ll=B[legSide+'LowerLeg'],ft=B[legSide+'Foot'];
   if(lu&&ll){const u=E(legs[i].pivot.rotation.x,0,legs[i].pivot.rotation.z),l=E(legs[i].bend.rotation.x).multiply(u);place(lu,u);place(ll,l);if(ft)place(ft,Q().identity());}
   const au=B[side+'UpperArm'],al=B[side+'LowerArm'],hd=B[side+'Hand'],s=sideOf(arms[i]);
   if(au&&al){
    // The model stands in a T; the figure's arms hang. Lower first, then swing.
    const lower=E(0,0,-s*HANG),u=E(arms[i].pivot.rotation.x,0,arms[i].pivot.rotation.z).multiply(lower),l=E(arms[i].bend.rotation.x).multiply(u);
    place(au,u);place(al,l);if(hd)place(hd,l);
   }
  }
  if(B.head)place(B.head,E(head.rotation.x,head.rotation.y,head.rotation.z));
 }
 const originalUpdate=actor.update,originalLook=actor.setLook;
 function use(id){if(model?.id===id)return;if(model){body.remove(model.align);model.material.dispose();}model=build(id);for(const p of bodyParts)p.visible=false;}
 const pick=()=>MODEL_FOR[look.sex]??'c';
 function dress(){
  if(!model)return;const m=model.material.userData.visitorGarments;
  if(look.shirt)m.visitorTop.value.set(look.shirt);if(look.bottom)m.visitorBottom.value.set(look.bottom);
 }
 actor.setLook=(next={})=>{originalLook(next);if(next.shirt)wardrobe.top=next.shirt;if(next.bottom)wardrobe.bottom=next.bottom;if(model){use(pick());dress();}};
 actor.update=(...args)=>{originalUpdate(...args);if(!model){use(pick());dress();}drive(model);};
 // Procedural body parts come back for a frame-perfect fallback if the rig ever throws.
 actor.anime={shade(v){if(model)model.material.color.setScalar(v);},detach(){for(const p of bodyParts)p.visible=true;if(model)body.remove(model.align);actor.update=originalUpdate;actor.setLook=originalLook;actor.anime=null;}};
 return true;
}
