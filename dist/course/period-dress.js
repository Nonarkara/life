// Period clothes for the rigged cast. The source models keep their faces; everything else is
// rebuilt on their own skeleton, so a 1973 student wears a white shirt and can still walk.
// All of it is one skinned mesh with vertex colours: one draw call per person.
import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {lightRamp} from './art-direction.js';
// Rings of {y,rx,rz,z}, low to high, skinned into one surface.
function loft(rings,seg=18,close=true,from=0,to=Math.PI*2){const p=[],idx=[];rings.forEach((r,j)=>{for(let i=0;i<=seg;i++){const a=from+(to-from)*i/seg;p.push(Math.sin(a)*r.rx+(r.x??0),r.y,Math.cos(a)*r.rz+(r.z??0));}});for(let j=0;j<rings.length-1;j++)for(let i=0;i<seg;i++){const a=j*(seg+1)+i,b=a+seg+1;idx.push(a,a+1,b,b,a+1,b+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return g;}
const UP=new T.Vector3(0,1,0);
const tones=new Map();
function makeSkin(model){if(tones.has(model.id))return tones.get(model.id);let tone='#e9c8ad';try{let mesh=null;model.align.traverse(o=>{if(o.isSkinnedMesh&&/face/i.test(o.name))mesh=o;});const pos=mesh.geometry.attributes.position,uv=mesh.geometry.attributes.uv,box=new T.Box3().setFromBufferAttribute(pos),mid=box.min.y+(box.max.y-box.min.y)*.4,img=mesh.material.map.image,c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);const seen=[];for(let i=0;i<pos.count;i++)if(Math.abs(pos.getY(i)-mid)<.03&&pos.getZ(i)>box.max.z-.05){const d=g.getImageData(Math.floor(uv.getX(i)*img.width),Math.floor(uv.getY(i)*img.height),1,1).data;if(d[3]>200&&d[0]>150&&d[0]>d[2])seen.push([d[0],d[1],d[2]]);}seen.sort((a,b)=>a[0]+a[1]+a[2]-b[0]-b[1]-b[2]);const m=seen[Math.floor(seen.length*.6)];if(m)tone=`rgb(${m[0]},${m[1]},${m[2]})`;}catch{}tones.set(model.id,tone);return tone;}
const distanceToSegment=(p,a,b)=>{const ab=b.clone().sub(a),t=Math.max(0,Math.min(1,p.clone().sub(a).dot(ab)/Math.max(ab.lengthSq(),1e-8)));return p.distanceTo(a.clone().addScaledVector(ab,t));};
const NEEDED=['hips','spine','chest','upperChest','neck','head','leftUpperArm','rightUpperArm','leftLowerArm','rightLowerArm','leftHand','rightHand','leftUpperLeg','rightUpperLeg','leftLowerLeg','rightLowerLeg','leftFoot','rightFoot','leftToes','rightToes'];
export function dressPeriod(actor,outfit,{elder=false,warm=[.93,.84,.76],matte=false,hair=null}={}){
 const model=actor.anime?.model?.();if(!model)return ()=>{};
 const {body}=actor.rig;
 const headBone=model.bones.head,headScale=headBone?.scale.x??1;if(headBone)headBone.scale.setScalar(1);
 actor.root.updateMatrixWorld(true);
 const V=k=>{const b=model.bones[k];return b?body.worldToLocal(b.getWorldPosition(new T.Vector3())):null;};
 const [hips,chest,neck,head]=[V('hips'),V('upperChest')??V('chest'),V('neck'),V('head')],[LS,RS,LE,RE,LW,RW]=['leftUpperArm','rightUpperArm','leftLowerArm','rightLowerArm','leftHand','rightHand'].map(V),[LH,RH,LK,RK,LA,RA,LT,RT]=['leftUpperLeg','rightUpperLeg','leftLowerLeg','rightLowerLeg','leftFoot','rightFoot','leftToes','rightToes'].map(V),spineP=V('spine')??hips.clone().lerp(chest,.4);
 if([hips,chest,neck,head,LS,RS,LE,RE,LW,RW,LH,RH,LK,RK,LA,RA].some(x=>!x)){if(headBone)headBone.scale.setScalar(headScale);return ()=>{};}
 // One skeleton of named bones only, posed as it stands now: the clothes bind to this pose.
 const ids=[],boneList=[];for(const key of NEEDED)if(model.bones[key]){ids[key]=boneList.length;boneList.push(model.bones[key]);}
 const tip=(k,to)=>[ids[k],V(k),to];
 const SEG={torso:[tip('hips',spineP),tip('spine',chest),...(ids.chest!==undefined?[tip('chest',chest)]:[]),...(ids.upperChest!==undefined?[tip('upperChest',neck)]:[]),tip('neck',head)].filter(s=>s[0]!==undefined&&s[1]),
  head:[tip('head',head.clone().add(new T.Vector3(0,.2,0)))]};
 SEG.lArm=[tip('leftUpperArm',LE),tip('leftLowerArm',LW),tip('leftHand',LW.clone().lerp(LE,-.45))];SEG.rArm=[tip('rightUpperArm',RE),tip('rightLowerArm',RW),tip('rightHand',RW.clone().lerp(RE,-.45))];
 SEG.lLeg=[tip('leftUpperLeg',LK),tip('leftLowerLeg',LA),tip('leftFoot',LT??LA.clone().add(new T.Vector3(0,0,.1)))];SEG.rLeg=[tip('rightUpperLeg',RK),tip('rightLowerLeg',RA),tip('rightFoot',RT??RA.clone().add(new T.Vector3(0,0,.1)))];
 SEG.lShoulder=[tip('leftUpperArm',LE),...SEG.torso.slice(-2)];SEG.rShoulder=[tip('rightUpperArm',RE),...SEG.torso.slice(-2)];SEG.lHip=[tip('hips',spineP),tip('leftUpperLeg',LK)];SEG.rHip=[tip('hips',spineP),tip('rightUpperLeg',RK)];
 SEG.waistUp=SEG.torso;
 const parts=[],colors=new Map(),col=c=>{if(!colors.has(c))colors.set(c,new T.Color(c));return colors.get(c);};
 const tmp=new T.Vector3();
 // Weight a vertex to its nearest bones, sharply, so a sleeve bends at the elbow and not along it.
 function weigh(g,segs,color,custom){
  const pos=g.attributes.position,skinI=new Float32Array(pos.count*4),skinW=new Float32Array(pos.count*4),c=new Float32Array(pos.count*3),hue=col(color);
  for(let v=0;v<pos.count;v++){
   tmp.fromBufferAttribute(pos,v);c[v*3]=hue.r;c[v*3+1]=hue.g;c[v*3+2]=hue.b;
   let row=custom?custom(tmp,segs):null;
   if(!row)row=segs.map(([id,a,b])=>[id,1/(Math.pow(distanceToSegment(tmp,a,b),2)+.0006)**2]).sort((x,y)=>y[1]-x[1]).slice(0,4);
   const total=row.reduce((n,[,w])=>n+w,0);row.forEach(([id,w],i)=>{skinI[v*4+i]=id;skinW[v*4+i]=w/total;});
  }
  g.setAttribute('skinIndex',new T.BufferAttribute(skinI,4));g.setAttribute('skinWeight',new T.BufferAttribute(skinW,4));g.setAttribute('color',new T.BufferAttribute(c,3));
  for(const name of Object.keys(g.attributes))if(!['position','normal','skinIndex','skinWeight','color'].includes(name))g.deleteAttribute(name);
  parts.push(g.index?g.toNonIndexed():g);
 }
 const place=(g,p,q,s)=>{const M=new T.Matrix4().compose(p,q??new T.Quaternion(),s??new T.Vector3(1,1,1));g.applyMatrix4(M);return g;};
 const tube=(a,b,ra,rb,color,segs,custom)=>{const d=b.clone().sub(a),g=new T.CylinderGeometry(rb,ra,d.length(),10,3,true);place(g,a.clone().addScaledVector(d,.5),new T.Quaternion().setFromUnitVectors(UP,d.clone().normalize()));weigh(g,segs,color,custom);};
 const ball=(p,sx,sy,sz,color,segs)=>{const g=new T.SphereGeometry(1,10,8);place(g,p,null,new T.Vector3(sx,sy,sz));weigh(g,segs,color);};
 const box=(w,h,dp,x,y,z,color,rot,segs=SEG.torso)=>{const g=new T.BoxGeometry(w,h,dp);if(rot)g.rotateZ(rot);g.translate(x,y,z);weigh(g,segs,color);};
 const lofted=(rings,color,segs,custom)=>weigh(loft(rings),segs,color,custom);
 const female=outfit.female,sh=Math.abs(LS.x-RS.x)/2,hipX=Math.abs(LH.x-RH.x)/2+.085,waistY=hips.y+.1,w={waistX:female?sh*.82:sh*.98,bust:female?.125:.115};
 const skinTone='#'+new T.Color(makeSkin(model)).multiply(new T.Color().setRGB(...warm,T.SRGBColorSpace)).getHexString(),top=outfit.top,bot=outfit.bottom,trim=outfit.trim,dark='#2b2622',fold='#'+new T.Color(outfit.top).multiplyScalar(.82).getHexString();
 const bulk=outfit.coat?.022:0;
 // Skin that shows, then the shirt over it.
 tube(chest,head.clone().lerp(neck,.25),.052,.046,skinTone,SEG.torso.slice(-2));
 const collarY=neck.y-.01,hem=outfit.coat?hips.y-.3:outfit.robe?LK.y-.1:outfit.tucked?waistY-.02:hips.y-.09;
 if(outfit.robe){lofted([{y:hem,rx:hipX+.045,rz:.15},{y:hips.y-.06,rx:hipX+.02,rz:.135},{y:waistY,rx:w.waistX+.03,rz:.122},{y:chest.y-.02,rx:sh+.02,rz:w.bust+.015},{y:collarY-.05,rx:sh+.005,rz:.095},{y:collarY,rx:.07,rz:.06}],top,[...SEG.torso,tip('leftUpperLeg',LK),tip('rightUpperLeg',RK)],(p,segs)=>p.y<hips.y-.05?[[segs[0][0],.6],[ids.leftUpperLeg,.2],[ids.rightUpperLeg,.2]]:null);box(.11,chest.y-hem,.01,RS.x*.25,(chest.y+hem)/2,w.bust+.018,fold,.35);}
 else lofted([{y:hem,rx:(outfit.tucked?w.waistX+.002:hipX-.012)+bulk,rz:(outfit.tucked?.096:.118)+bulk},{y:waistY,rx:w.waistX+.012+bulk,rz:.102+bulk},{y:(waistY+chest.y)/2,rx:sh*.98+bulk,rz:.11+bulk},{y:chest.y-.02,rx:sh+.012+bulk,rz:w.bust+bulk,z:female?.012:0},{y:collarY-.07,rx:sh+.012+bulk,rz:.092+bulk},{y:collarY-.015,rx:.1+bulk,rz:.078+bulk},{y:collarY,rx:.058,rz:.056}],top,[...SEG.torso,tip('leftUpperLeg',LK),tip('rightUpperLeg',RK)],(p,segs)=>p.y<hips.y-.07?[[segs[0][0],.7],[ids.leftUpperLeg,.15],[ids.rightUpperLeg,.15]]:null);
 if(outfit.stripes)for(let k=0;k<4;k++){const y=waistY+(chest.y-waistY)*(k+.5)/4;lofted([{y:y-.012,rx:sh*.99+.003,rz:.116},{y:y+.012,rx:sh*.99+.003,rz:.116}],outfit.stripes,SEG.torso);}
 for(const [S,E,W,arm,shoulder] of [[LS,LE,LW,SEG.lArm,SEG.lShoulder],[RS,RE,RW,SEG.rArm,SEG.rShoulder]]){
  ball(S.clone().add(new T.Vector3(S.x>0?-.02:.02,-.02,0)),.046+bulk,.05+bulk,.052+bulk,top,shoulder);
  {const dir=W.clone().sub(E).normalize(),p=W.clone().addScaledVector(dir,.055);ball(p.clone().addScaledVector(dir,-.012),.024,.042,.015,skinTone,arm);ball(p.clone().addScaledVector(dir,.03),.021,.03,.012,skinTone,arm);ball(p.clone().add(new T.Vector3(S.x>0?-.022:.022,.002,.008)),.008,.024,.008,skinTone,arm);}
  if(outfit.sleeve==='long'||outfit.coat||outfit.robe&&S===RS){tube(S,E,.05+bulk,.044+bulk,top,arm);tube(E,W,.044+bulk,.038+bulk,top,arm);}
  else{const cuff=S.clone().lerp(E,outfit.sleeve==='cap'?.42:.72);tube(S,cuff,.05,.05,top,arm);tube(cuff,E,.044,.038,skinTone,arm);tube(E,W,.038,.028,skinTone,arm);}
 }
 if(outfit.collar){for(const a of [-1,1])box(.075,.012,.05,a*.04,collarY-.028,.066,trim,a*.55);box(.014,chest.y-waistY-.02,.006,0,(chest.y+waistY)/2+.02,w.bust+.004,fold);}
 if(outfit.pocket)box(.075,.08,.004,sh*.42,chest.y-.05,w.bust+.002,fold);
 if(outfit.mohom){box(.016,chest.y-waistY-.02,.006,0,(chest.y+waistY)/2+.02,w.bust+.003,trim);lofted([{y:collarY-.012,rx:.066,rz:.064},{y:collarY+.012,rx:.06,rz:.058}],trim,SEG.torso);}
 if(outfit.blouseNeck)lofted([{y:collarY-.05,rx:.09,rz:.078,z:.004},{y:collarY-.03,rx:.082,rz:.072,z:.004}],trim,SEG.torso);
 if(outfit.apron){lofted([{y:hips.y-.28,rx:hipX+.015,rz:.14,z:.01},{y:waistY-.02,rx:w.waistX+.022,rz:.125,z:.01}].map(r=>r),outfit.apron,[...SEG.torso,tip('leftUpperLeg',LK),tip('rightUpperLeg',RK)],(p,segs)=>p.y<hips.y-.05?[[segs[0][0],.7],[ids.leftUpperLeg,.15],[ids.rightUpperLeg,.15]]:null);}
 // Below the waist.
 const ankleY=Math.min(LA.y,RA.y);
 if(outfit.robe){for(const [K,A] of [[LK,LA],[RK,RA]])tube(K.clone().add(new T.Vector3(0,.04,0)),A,.05,.032,skinTone,K===LK?SEG.lLeg:SEG.rLeg);}
 else if(outfit.skirt){const hemY=outfit.skirt==='sin'?ankleY+.09:LK.y-.06,bandY=hemY+.12,flare=outfit.skirt==='sin'?hipX-.024:hipX-.012,r=y=>({y,rx:flare,rz:.118});
  // A tube skirt rides the thighs a little and the hips mostly, so it never tears between the legs.
  const skirtSeg=[SEG.torso[0],tip('leftUpperLeg',LK),tip('rightUpperLeg',RK)],bySide=(p,segs)=>{const drop=Math.max(0,Math.min(1,(hips.y-p.y)/Math.max(.05,hips.y-hemY))),side=p.x>=0?(LH.x>=0?ids.leftUpperLeg:ids.rightUpperLeg):(LH.x>=0?ids.rightUpperLeg:ids.leftUpperLeg),other=side===ids.leftUpperLeg?ids.rightUpperLeg:ids.leftUpperLeg;return [[segs[0][0],1-drop*.62],[side,drop*.42],[other,drop*.2]];};
  lofted([{y:waistY-.03,rx:w.waistX+.014,rz:.108},{y:waistY-.005,rx:w.waistX+.014,rz:.108}],trim,SEG.torso);
  lofted([{y:hips.y-.04,rx:hipX-.01,rz:.122},{y:waistY-.02,rx:w.waistX+.01,rz:.105}],bot,SEG.torso);
  lofted([r(bandY),{y:(bandY+hips.y)/2,rx:flare,rz:.118},{y:hips.y-.04,rx:hipX-.01,rz:.122}],bot,skirtSeg,bySide);lofted([r(hemY),r(bandY)],outfit.band??bot,skirtSeg,bySide);
  if(outfit.skirt==='sin')for(const [K,A,leg] of [[LK,LA,SEG.lLeg],[RK,RA,SEG.rLeg]])tube(K.clone().lerp(A,.5),A,.044,.03,skinTone,leg);else for(const [K,A,leg] of [[LK,LA,SEG.lLeg],[RK,RA,SEG.rLeg]])tube(K.clone().add(new T.Vector3(0,.1,0)),A,.05,.032,skinTone,leg);
 }else{
  const waist=[...SEG.torso,tip('leftUpperLeg',LK),tip('rightUpperLeg',RK)];
  lofted(outfit.tucked?[{y:hips.y-.13,rx:hipX-.03,rz:.105},{y:hips.y-.02,rx:hipX-.012,rz:.118},{y:waistY-.03,rx:w.waistX+.014,rz:.108},{y:waistY+.012,rx:w.waistX+.016,rz:.11}]:[{y:hips.y-.13,rx:hipX-.03,rz:.105},{y:hips.y-.07,rx:hipX-.03,rz:.105}],bot,waist,(p,segs)=>p.y<hips.y-.06?[[segs[0][0],.72],[ids.leftUpperLeg,.14],[ids.rightUpperLeg,.14]]:null);if(outfit.tucked)lofted([{y:waistY-.006,rx:w.waistX+.02,rz:.114},{y:waistY+.018,rx:w.waistX+.02,rz:.114}],dark,SEG.torso);
  for(const [H,K,A,leg] of [[LH,LK,LA,SEG.lLeg],[RH,RK,RA,SEG.rLeg]]){const top2=H.clone().add(new T.Vector3(0,outfit.tucked?.05:-.03,0)),withHip=[SEG.torso[0],...leg];
   if(outfit.legs==='shorts'){const end=H.clone().lerp(K,.72);tube(top2,end,.078,.074,bot,withHip);tube(end,K,.052,.048,skinTone,leg);tube(K,A,.048,.03,skinTone,leg);}
   else{tube(top2,K,.078,.058,bot,withHip);ball(K,.058,.045,.058,bot,leg);tube(K,A.clone().add(new T.Vector3(0,.03,0)),.058,outfit.legs==='flare'?.095:.05,bot,leg);}}
 }
 if(outfit.scarf){for(let k=0;k<4;k++){const y=waistY-.06+k*.025;lofted([{y,rx:w.waistX+.03,rz:.125},{y:y+.025,rx:w.waistX+.03,rz:.123}],k%2?'#2f4f6b':'#b5482f',SEG.torso);}}
 if(outfit.neckScarf)lofted([{y:collarY-.03,rx:.09,rz:.09},{y:collarY+.03,rx:.075,rz:.075}],outfit.neckScarf,SEG.torso);
 // Feet.
 for(const [A,F,leg] of [[LA,LT,SEG.lLeg],[RA,RT,SEG.rLeg]]){const toe=F??A.clone().add(new T.Vector3(0,0,.1)),mid=A.clone().lerp(toe,.5);mid.y=.04;tube(A.clone().add(new T.Vector3(0,.05,0)),A.clone().setY(.04),.031,.036,skinTone,leg);
  if(outfit.feet==='shoes')ball(mid.clone().setY(.05),.05,.05,.125,dark,leg);
  else if(outfit.feet==='canvas')ball(mid.clone().setY(.05),.05,.05,.12,'#e8e2d2',leg);
  else{ball(mid.clone().setY(.03),.036,.026,.09,skinTone,leg);if(outfit.feet==='sandals'){const g=new T.BoxGeometry(.095,.016,.25);g.translate(mid.x,.009,mid.z);weigh(g,leg,dark);const st=new T.BoxGeometry(.09,.012,.024);st.translate(mid.x,.062,mid.z+.03);weigh(st,leg,dark);}}
 }
 // Hats and hair live on the head bone.
 let headBox=null;model.align.traverse(o=>{if(o.isSkinnedMesh&&/face/i.test(o.name)){const b=new T.Box3().setFromBufferAttribute(o.geometry.attributes.position);const c0=body.worldToLocal(o.localToWorld(b.min.clone())),c1=body.worldToLocal(o.localToWorld(b.max.clone()));headBox={min:new T.Vector3(Math.min(c0.x,c1.x),Math.min(c0.y,c1.y),Math.min(c0.z,c1.z)),max:new T.Vector3(Math.max(c0.x,c1.x),Math.max(c0.y,c1.y),Math.max(c0.z,c1.z))};}});
 if(hair&&headBox)buildHair(hair,headBox,{weigh,lofted,ball,box,SEG,neck,chest,ids,tip,hairColor:elder?(hair.grey??'#b4b2aa'):hair.color});
 if(outfit.hat&&headBox){const cx=(headBox.min.x+headBox.max.x)/2,cz=(headBox.min.z+headBox.max.z)/2,top=headBox.max.y,rx=(headBox.max.x-headBox.min.x)/2;if(outfit.hat==='ngob'){const g=new T.ConeGeometry(rx*2.5,.13,14,1,true);g.translate(cx,top+.015,cz);weigh(g,SEG.head,'#c8b078');}else if(outfit.hat==='cap'){ball(new T.Vector3(cx,top-.03,cz),rx*1.08,.075,rx*1.1,outfit.hatColor??'#3f5a70',SEG.head);box(rx*1.2,.012,.09,cx,top-.055,cz+rx*1.1,outfit.hatColor??'#3f5a70',0,SEG.head);}else if(outfit.hat==='knit')ball(new T.Vector3(cx,top-.025,cz),rx*1.14,.095,rx*1.16,outfit.hatColor??'#a5533f',SEG.head);}
 const geometry=mergeGeometries(parts,false);for(const p of parts)p.dispose();
 geometry.computeVertexNormals();
 const material=matte?new T.MeshLambertMaterial({vertexColors:true}):new T.MeshToonMaterial({vertexColors:true,gradientMap:lightRamp()});
 const mesh=new T.SkinnedMesh(geometry,material);mesh.frustumCulled=false;mesh.castShadow=!matte;mesh.receiveShadow=!matte;body.add(mesh);
 actor.root.updateMatrixWorld(true);
 const skeleton=new T.Skeleton(boneList);
 mesh.bind(skeleton,mesh.matrixWorld.clone());
 // The modern clothes go; hair darkens to the people of this place, and greys with age.
 const hidden=[],made=[material],swapped=[];
 model.align.traverse(o=>{if(!o.isSkinnedMesh)return;const prior=o.material;
  if(/body/i.test(o.name)){o.visible=false;hidden.push(o);return;}
  if(/hair/i.test(o.name)){if(hair){o.visible=false;hidden.push(o);return;}const hairMat=new T.MeshToonMaterial({map:elder?null:o.material.map,gradientMap:lightRamp(),alphaTest:elder?0:.35,side:T.DoubleSide,color:elder?'#b4b2aa':'#4a4744'});made.push(hairMat);o.material=hairMat;swapped.push([o,prior]);if(matte)o.castShadow=false;return;}
  const faceMat=new T.MeshToonMaterial({map:o.material.map,gradientMap:lightRamp(),alphaTest:.35,side:T.DoubleSide,color:new T.Color().setRGB(...warm,T.SRGBColorSpace)});// The source irises are red; people here have brown eyes.
  faceMat.onBeforeCompile=c=>{c.fragmentShader=c.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nif(diffuseColor.r>diffuseColor.g*3.4&&diffuseColor.r>diffuseColor.b*3.4)diffuseColor.rgb=vec3(.1,.055,.035)*(.5+diffuseColor.r);');};made.push(faceMat);o.material=faceMat;swapped.push([o,prior]);if(matte)o.castShadow=false;
 });
 if(headBone)headBone.scale.setScalar(headScale);
 return ()=>{body.remove(mesh);geometry.dispose();skeleton.dispose();for(const x of made)x.dispose();for(const o of hidden)o.visible=true;for(const [o,prior] of swapped)o.material=prior;};
}
// Hair is a cap over the skull plus whatever this person's style adds, all on the head bone.
function buildHair(hair,box,{weigh,lofted,ball,box:cube,SEG,neck,chest,ids,tip,hairColor}){
 const c=new T.Vector3((box.min.x+box.max.x)/2,(box.min.y+box.max.y)/2,(box.min.z+box.max.z)/2),rx=(box.max.x-box.min.x)/2*1.08,ry=(box.max.y-box.min.y)/2*1.04,rz=(box.max.z-box.min.z)/2*1.1;
 const style=hair.style,color=hairColor;
 // The hairline: low at the back, high over the face. a=0 is the front of the head.
 const seg=20,rings=11,P=[],I=[],lift=style==='crop'?.05:0,front=style==='fringe'?1.2:1.0,back=style==='crop'?1.85:2.2;
 for(let j=0;j<=rings;j++)for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2,edge=front+(back-front)*(1-Math.cos(a))/2,phi=edge*j/rings;P.push(c.x+Math.sin(a)*Math.sin(phi)*rx,c.y+lift+Math.cos(phi)*ry,c.z-.008+Math.cos(a)*Math.sin(phi)*rz);}
 for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){const p=j*(seg+1)+i,q=p+seg+1;I.push(p,q,p+1,q,q+1,p+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();weigh(g,SEG.head,color);
 const curtain=(y0,from,to,flare=1,segs=SEG.head,custom)=>{const r=(y,k=1)=>({y,rx:rx*1.03*k*flare,rz:rz*1.03*k*flare,z:-.008});const steps=[c.y+ry*.2,c.y-ry*.3,(c.y-ry*.3+y0)/2,y0];const gg=loftOpen(steps.map((y,i)=>r(y,i===3?1.02:1)),from,to);weigh(gg,segs,color,custom);};
 if(style==='bob')curtain(c.y-ry*1.05,Math.PI*.3,Math.PI*1.7,1.05);
 if(style==='long'){const low=chest.y-.1,w=[...SEG.head,...SEG.torso.slice(-2)];curtain(low,Math.PI*.42,Math.PI*1.58,1.02,w,(p,s)=>{const k=Math.max(0,Math.min(1,(neck.y-p.y)/.18));return [[ids.head,1-k],[s.at(-1)[0],k]];});}
 if(style==='ponytail'){const p=new T.Vector3(c.x,c.y+ry*.2,c.z-rz*1.05);ball(p,.04,.04,.04,color,SEG.head);ball(p.clone().add(new T.Vector3(0,-.13,-.025)),.036,.14,.036,color,SEG.head);}
 if(style==='bun')ball(new T.Vector3(c.x,c.y+ry*.55,c.z-rz*.98),.058,.055,.058,color,SEG.head);
 if(style==='topknot')ball(new T.Vector3(c.x,c.y+ry*1.08,c.z-.01),.05,.05,.05,color,SEG.head);
 if(style==='perm'){for(let i=0;i<14;i++){const a=i/14*Math.PI*2,y=c.y+ry*(.1+(i%3)*.26);if(Math.cos(a)>.62)continue;ball(new T.Vector3(c.x+Math.sin(a)*rx*.98,y,c.z+Math.cos(a)*rz*.98),.04,.04,.04,color,SEG.head);}ball(new T.Vector3(c.x,c.y+ry*.86,c.z-.01),rx*.9,ry*.42,rz*.9,color,SEG.head);}
 if(style==='side')cube(rx*1.3,.022,rz*.75,c.x+rx*.25,c.y+ry*.84,c.z+rz*.6,color,-.28,SEG.head);
 if(style==='fringe')curtain(c.y+ry*.34,-Math.PI*.3,Math.PI*.3,1.03);
 if(style==='bald'){}
}
function loftOpen(rings,from,to){return loft(rings,14,false,from,to);}
