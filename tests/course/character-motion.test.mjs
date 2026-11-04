import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {createCharacter} from '../../dist/course/character3d.js';
import {animeAssetBase,createAnimePoseDriver,loadAnimeCast,attachAnime} from '../../dist/course/character-anime.js';

const activity={x:1,y:2,dx:0,dy:1,pose:'walk',moving:true,distance:1};
function pose(actor){
 const rows=[];actor.root.traverse(o=>rows.push(...o.position.toArray(),...o.quaternion.toArray(),...o.scale.toArray()));return rows;
}
function sourceRig(id){
 const b=readFileSync(`dist/course/anime/cast/visitor-${id}.glb`),json=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());
 const nodes=json.nodes.map(n=>{const o=new T.Bone();o.name=n.name??'';if(n.translation)o.position.fromArray(n.translation);if(n.rotation)o.quaternion.fromArray(n.rotation);if(n.scale)o.scale.fromArray(n.scale);return o;});
 json.nodes.forEach((n,i)=>{for(const child of n.children??[])nodes[i].add(nodes[child]);});
 const visual=new T.Group();for(const i of json.scenes[json.scene??0].nodes)visual.add(nodes[i]);
 const bones=Object.fromEntries(Object.entries(json.extras.humanBones).map(([key,i])=>[key,nodes[i]]));
 return {json,visual,bones};
}
// The former retargeter retained here as an independent numerical reference.
// The optimized driver must preserve the already-shipped pose for real skeletons.
function referenceDriver(bones,align,rig){
 const Q=()=>new T.Quaternion(),E=(x=0,y=0,z=0)=>Q().setFromEuler(new T.Euler(x,y,z,'XYZ'));
 const qa=Q().setFromEuler(align.rotation),qaInv=qa.clone().invert(),rest=new Map(),worldRest=new Map(),visual=align.children[0];
 const wr=b=>{if(worldRest.has(b))return worldRest.get(b);const p=b.parent&&b.parent!==align&&b.parent!==visual?wr(b.parent):Q();const w=p.clone().multiply(b.quaternion);worldRest.set(b,w);return w;};
 for(const b of Object.values(bones)){rest.set(b,b.quaternion.clone());wr(b);}
 const sideOf=arm=>arm.pivot.position.x>=0?1:-1;
 return ()=>{
  const posed=new Map(),place=(bone,d)=>{const w=qaInv.clone().multiply(d).multiply(qa).multiply(worldRest.get(bone));posed.set(bone,w);const parent=bone.parent,pw=posed.get(parent)??worldRest.get(parent)??Q();bone.quaternion.copy(pw.clone().invert().multiply(w));};
  for(const [b,q]of rest)b.quaternion.copy(q);
  for(let i=0;i<2;i++){
   const side=sideOf(rig.arms[i])>0?'left':'right',legSide=sideOf(rig.legs[i])>0?'left':'right';
   const lu=bones[legSide+'UpperLeg'],ll=bones[legSide+'LowerLeg'],ft=bones[legSide+'Foot'];
   if(lu&&ll){const u=E(rig.legs[i].pivot.rotation.x,0,rig.legs[i].pivot.rotation.z),l=E(rig.legs[i].bend.rotation.x).multiply(u);place(lu,u);place(ll,l);if(ft)place(ft,Q().identity());}
   const au=bones[side+'UpperArm'],al=bones[side+'LowerArm'],hd=bones[side+'Hand'],s=sideOf(rig.arms[i]);
   if(au&&al){const lower=E(0,0,-s*1.38),u=E(rig.arms[i].pivot.rotation.x,0,rig.arms[i].pivot.rotation.z).multiply(lower),l=E(rig.arms[i].bend.rotation.x).multiply(u);place(au,u);place(al,l);if(hd)place(hd,l);}
  }
  if(bones.head)place(bones.head,E(rig.head.rotation.x,rig.head.rotation.y,rig.head.rotation.z));
 };
}

test('repeated redraw at a paused instant preserves the partially settled pose',()=>{
 const actor=createCharacter();actor.update(activity,25,1);actor.update({...activity,pose:'study',moving:false},25,1.016);
 const before=pose(actor);for(let i=0;i<120;i++)actor.update({...activity,pose:'study',moving:false},25,1.016);
 assert.deepEqual(pose(actor),before);
 actor.update({...activity,pose:'study',moving:false},25,1.032);assert.notDeepEqual(pose(actor),before);
});

test('held clock still accepts a new chapter/activity and appearance',()=>{
 const actor=createCharacter();actor.update(activity,25,4);const before=pose(actor);
 actor.update({...activity,x:8,pose:'study',moving:false},25,4);assert.equal(actor.root.position.x,8);assert.notDeepEqual(pose(actor),before);
 actor.setLook({height:1.2,build:1.1});actor.update({...activity,x:8,pose:'study',moving:false},25,4);assert.equal(actor.root.scale.x,1.2);
});

test('preallocated anime retargeting preserves real A/B/C skeleton poses',()=>{
 for(const id of ['a','b','c']){
  const actor=createCharacter(),one=sourceRig(id),two=sourceRig(id),a=new T.Group(),b=new T.Group();a.rotation.y=b.rotation.y=id==='b'?0:Math.PI;a.add(one.visual);b.add(two.visual);
  const drive=createAnimePoseDriver(one.bones,a,actor.rig),reference=referenceDriver(two.bones,b,actor.rig);
  for(const [i,poseName]of ['walk','study','eat','ride','craft','swim','care','floor'].entries()){
   actor.update({...activity,pose:poseName,moving:poseName==='walk',distance:i*.3},25,i+.01);drive();reference();
   for(const key of Object.keys(one.bones))assert.ok(one.bones[key].quaternion.toArray().every((v,i)=>Math.abs(v-two.bones[key].quaternion.toArray()[i])<1e-10),`${id}/${poseName}/${key}`);
   const before=Object.values(one.bones).map(b=>b.quaternion.toArray());drive();assert.deepEqual(Object.values(one.bones).map(b=>b.quaternion.toArray()),before);
  }
 }
});

test('anime art resolves from course and bundled study routes to the same shipped assets',()=>{
 for(const route of ['/course/game.js','/course/game.bundle.js','/study/control-bench.js'])assert.equal(animeAssetBase(`https://life.nonarkara.org${route}`).href,'https://life.nonarkara.org/course/anime/cast/');
});

test('one failed model does not suppress the other figures; all-failed loads can retry',async()=>{
 const originalFetch=globalThis.fetch,parse=GLTFLoader.prototype.parseAsync,warn=console.warn,warnings=[];let failAll=true,requests=[];
 console.warn=(...args)=>warnings.push(args);globalThis.fetch=async url=>{const id=/visitor-([abc])/.exec(String(url))[1];requests.push(id);return {ok:!failAll&&id!=='b',status:503,arrayBuffer:async()=>id};};
 GLTFLoader.prototype.parseAsync=async id=>{const {json,visual}=sourceRig(id);return {scene:visual,parser:{json}};};
 try{
  assert.equal(await loadAnimeCast(),null);failAll=false;
  const cast=await loadAnimeCast();assert.deepEqual(Object.keys(cast),['a','c']);assert.equal(requests.length,6);assert.equal(warnings.length,4);
  const actor=createCharacter({sex:'female'});assert.equal(attachAnime(actor),true);actor.update(activity,25,2);assert.equal(actor.rig.bodyParts[0].visible,false);
  actor.setLook({sex:'intersex'});actor.update(activity,25,2);assert.equal(actor.rig.bodyParts[0].visible,true,'missing matching model retains the procedural body');
  actor.setLook({sex:'male',build:1.2});actor.update(activity,25,2);assert.equal(actor.rig.bodyParts[0].visible,false);
  actor.anime.detach();assert.equal(actor.rig.bodyParts[0].visible,true);assert.equal(actor.anime,null);
 }finally{globalThis.fetch=originalFetch;GLTFLoader.prototype.parseAsync=parse;console.warn=warn;}
});

test('ordinary adult walk has a bounded stride on the actual longer-legged cast',()=>{
 for(const id of ['a','b','c']){
  const actor=createCharacter(),source=sourceRig(id),align=new T.Group();align.rotation.y=id==='b'?0:Math.PI;align.add(source.visual);actor.rig.body.add(align);
  const bounds=source.json.meshes.flatMap(mesh=>mesh.primitives.map(p=>source.json.accessors[p.attributes.POSITION]));
  align.scale.setScalar(1.8/(Math.max(...bounds.map(b=>b.max[1]))-Math.min(...bounds.map(b=>b.min[1]))));
  const drive=createAnimePoseDriver(source.bones,align,actor.rig),left=new T.Vector3(),right=new T.Vector3();let maxSpan=0,minContact=Infinity,maxContact=-Infinity;
  for(let i=0;i<=80;i++){
   // Separate held study samples avoid smoothing hiding the worst stride angle.
   actor.update({...activity,distance:i/80*1.05},25,i+1);drive();actor.root.updateMatrixWorld(true);
   source.bones.leftFoot.getWorldPosition(left);source.bones.rightFoot.getWorldPosition(right);
   maxSpan=Math.max(maxSpan,Math.hypot(left.x-right.x,left.z-right.z));
   const contact=Math.min(left.y,right.y);minContact=Math.min(minContact,contact);maxContact=Math.max(maxContact,contact);
   assert.ok(Math.abs(actor.rig.legs[0].pivot.rotation.x-actor.rig.legs[1].pivot.rotation.x)<=.600001,`${id}: walk spread, not a lunge`);
   assert.ok(Math.abs(actor.rig.arms[0].pivot.rotation.x)<=.220001,`${id}: relaxed arm swing`);
  }
  assert.ok(maxSpan/1.8<.4,`${id}: foot spread ${maxSpan.toFixed(3)} should fit a normal authored walk`);
  assert.ok(maxContact-minContact<.06,`${id}: low-foot excursion ${(maxContact-minContact).toFixed(3)} should not bounce`);
 }
});
