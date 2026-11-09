// Period clothes for the rigged cast. The source models keep their faces and hair;
// everything else is rebuilt on their own skeleton, so a 1973 student wears a white shirt.
import * as T from 'three';
import {lightRamp} from './art-direction.js';
const toon=c=>new T.MeshToonMaterial({color:c,gradientMap:lightRamp()});
const plaid=()=>{const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');g.fillStyle='#b5482f';g.fillRect(0,0,32,32);g.fillStyle='#2f4f6b';g.fillRect(0,0,12,32);g.fillRect(0,0,32,12);g.fillStyle='#e6dcc0';g.fillRect(12,0,3,32);g.fillRect(0,12,32,3);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(4,1);t.colorSpace=T.SRGBColorSpace;return t;};
// Rings of {y,rx,rz,z}, low to high, skinned into one closed surface.
function loft(rings,seg=18){const p=[],idx=[],uv=[];rings.forEach((r,j)=>{for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2;p.push(Math.sin(a)*r.rx,r.y,Math.cos(a)*r.rz+(r.z??0));uv.push(i/seg,j/(rings.length-1));}});for(let j=0;j<rings.length-1;j++)for(let i=0;i<seg;i++){const a=j*(seg+1)+i,b=a+seg+1;idx.push(a,a+1,b,b,a+1,b+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
const UP=new T.Vector3(0,1,0);
const tones=new Map();
function makeSkin(model){if(tones.has(model.id))return tones.get(model.id);let tone='#e9c8ad';try{let mesh=null;model.align.traverse(o=>{if(o.isSkinnedMesh&&/face/i.test(o.name))mesh=o;});const pos=mesh.geometry.attributes.position,uv=mesh.geometry.attributes.uv,box=new T.Box3().setFromBufferAttribute(pos),mid=box.min.y+(box.max.y-box.min.y)*.4,img=mesh.material.map.image,c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);const seen=[];for(let i=0;i<pos.count;i++)if(Math.abs(pos.getY(i)-mid)<.03&&pos.getZ(i)>box.max.z-.05){const d=g.getImageData(Math.floor(uv.getX(i)*img.width),Math.floor(uv.getY(i)*img.height),1,1).data;if(d[3]>200&&d[0]>150&&d[0]>d[2])seen.push([d[0],d[1],d[2]]);}seen.sort((a,b)=>a[0]+a[1]+a[2]-b[0]-b[1]-b[2]);const m=seen[Math.floor(seen.length*.6)];if(m)tone=`rgb(${m[0]},${m[1]},${m[2]})`;}catch{}tones.set(model.id,tone);return tone;}
export function dressPeriod(actor,outfit,{elder=false,warm=[.93,.84,.76]}={}){
 const model=actor.anime?.model?.();if(!model)return ()=>{};
 const {body}=actor.rig,V=k=>{const b=model.bones[k];return b?body.worldToLocal(b.getWorldPosition(new T.Vector3())):null;},group=new T.Group(),made=[],m=c=>{const x=toon(c);made.push(x);return x;};
 actor.root.updateMatrixWorld(true);
 const skinTone=new T.Color(makeSkin(model)).multiply(new T.Color().setRGB(...warm,T.SRGBColorSpace)),skin=toon(skinTone);made.push(skin);
 const add=(g,mt)=>{const o=new T.Mesh(g,mt);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;};
 const tube=(a,b,ra,rb,mt)=>{const d=b.clone().sub(a),g=new T.CylinderGeometry(rb,ra,d.length(),12,1,true),o=add(g,mt);o.position.copy(a).addScaledVector(d,.5);o.quaternion.setFromUnitVectors(UP,d.clone().normalize());return o;};
 const ball=(p,sx,sy,sz,mt)=>{const o=add(new T.SphereGeometry(1,12,10),mt);o.position.copy(p);o.scale.set(sx,sy,sz);return o;};
 const box=(w,h,d,x,y,z,mt,rot)=>{const o=add(new T.BoxGeometry(w,h,d),mt);o.position.set(x,y,z);if(rot)o.rotation.z=rot;return o;};
 const [hips,chest,neck,head]=[V('hips'),V('upperChest')??V('chest'),V('neck'),V('head')],[LS,RS,LE,RE,LW,RW]=['leftUpperArm','rightUpperArm','leftLowerArm','rightLowerArm','leftHand','rightHand'].map(V),[LH,RH,LK,RK,LA,RA,LT,RT]=['leftUpperLeg','rightUpperLeg','leftLowerLeg','rightLowerLeg','leftFoot','rightFoot','leftToes','rightToes'].map(V);
 if([hips,chest,neck,head,LS,RS,LE,RE,LW,RW,LH,RH,LK,RK,LA,RA].some(x=>!x))return ()=>{};
 const female=outfit.female,sh=Math.abs(LS.x-RS.x)/2,hipX=Math.abs(LH.x-RH.x)/2+.085,waistY=hips.y+.1,w={chest:female?.112:.112,waistX:female?sh*.82:sh*.98,bust:female?.125:.115};
 const top=m(outfit.top),bot=m(outfit.bottom),trim=m(outfit.trim),dark=m('#2b2622'),fold=toon(new T.Color(outfit.top).multiplyScalar(.82));made.push(fold);
 // Skin that shows, then the shirt over it.
 tube(chest,head.clone().lerp(neck,.25),.052,.046,skin);
 const collarY=neck.y-.01,hem=outfit.tucked?waistY-.02:hips.y-.09;
 add(loft([{y:hem,rx:outfit.tucked?w.waistX+.002:hipX-.012,rz:outfit.tucked?.096:.118},{y:waistY,rx:w.waistX+.012,rz:.102},{y:(waistY+chest.y)/2,rx:sh*.98,rz:.11},{y:chest.y-.02,rx:sh+.012,rz:w.bust,z:female?.012:0},{y:collarY-.07,rx:sh+.012,rz:.092},{y:collarY-.015,rx:.1,rz:.078},{y:collarY,rx:.058,rz:.056}]),top);
 for(const [S,E,W] of [[LS,LE,LW],[RS,RE,RW]]){
  ball(S.clone().add(new T.Vector3(S.x>0?-.02:.02,-.02,0)),.046,.05,.052,top);
  {const dir=W.clone().sub(E).normalize(),p=W.clone().addScaledVector(dir,.055);ball(p.clone().addScaledVector(dir,-.012),.024,.042,.015,skin);ball(p.clone().addScaledVector(dir,.03),.021,.03,.012,skin);ball(p.clone().add(new T.Vector3(S.x>0?-.022:.022,.002,.008)),.008,.024,.008,skin);}
  if(outfit.sleeve==='long'){tube(S,E,.05,.044,top);tube(E,W,.044,.038,top);}
  else{const cuff=S.clone().lerp(E,outfit.sleeve==='cap'?.42:.72);tube(S,cuff,.05,.05,top);tube(cuff,E,.044,.038,skin);tube(E,W,.038,.028,skin);}
 }
 if(outfit.collar){for(const a of [-1,1])box(.075,.012,.05,a*.04,collarY-.028,.066,trim,a*.55);box(.014,chest.y-waistY-.02,.006,0,(chest.y+waistY)/2+.02,w.bust+.004,fold);}
 if(outfit.pocket)box(.075,.08,.004,sh*.42,chest.y-.05,w.bust+.002,fold);
 if(outfit.mohom){box(.016,chest.y-waistY-.02,.006,0,(chest.y+waistY)/2+.02,w.bust+.003,trim);add(loft([{y:collarY-.012,rx:.066,rz:.064},{y:collarY+.012,rx:.06,rz:.058}]),trim);}
 if(outfit.blouseNeck)add(loft([{y:collarY-.05,rx:.09,rz:.078,z:.004},{y:collarY-.03,rx:.082,rz:.072,z:.004}]),trim);
 // Below the waist.
 const ankleY=Math.min(LA.y,RA.y);
 if(outfit.skirt){const hemY=outfit.skirt==='sin'?ankleY+.09:LK.y-.06,bandY=hemY+.12,flare=outfit.skirt==='sin'?hipX-.024:hipX-.012,r=y=>({y,rx:flare,rz:.118});
  add(loft([{y:waistY-.03,rx:w.waistX+.014,rz:.108},{y:waistY-.005,rx:w.waistX+.014,rz:.108}]),trim);
  add(loft([{y:hips.y-.04,rx:hipX-.01,rz:.122},{y:waistY-.02,rx:w.waistX+.01,rz:.105}]),bot);
  add(loft([r(bandY),{y:hips.y-.04,rx:hipX-.01,rz:.122}]),bot);add(loft([r(hemY),r(bandY)]),outfit.band?m(outfit.band):bot);
  if(outfit.skirt==='sin')for(const [K,A,F] of [[LK,LA,LT],[RK,RA,RT]])tube(K.clone().lerp(A,.5),A,.044,.03,skin);else for(const [K,A] of [[LK,LA],[RK,RA]]){tube(K.clone().add(new T.Vector3(0,.1,0)),A,.05,.032,skin);}
 }else{
  add(loft(outfit.tucked?[{y:hips.y-.13,rx:hipX-.03,rz:.105},{y:hips.y-.02,rx:hipX-.012,rz:.118},{y:waistY-.03,rx:w.waistX+.014,rz:.108},{y:waistY+.012,rx:w.waistX+.016,rz:.11}]:[{y:hips.y-.13,rx:hipX-.03,rz:.105},{y:hips.y-.07,rx:hipX-.03,rz:.105}]),bot);if(outfit.tucked)add(loft([{y:waistY-.006,rx:w.waistX+.02,rz:.114},{y:waistY+.018,rx:w.waistX+.02,rz:.114}]),dark);
  for(const [H,K,A] of [[LH,LK,LA],[RH,RK,RA]]){const top2=H.clone().add(new T.Vector3(0,.05,0));
   if(outfit.legs==='shorts'){const end=H.clone().lerp(K,.72);tube(top2,end,.078,.074,bot);tube(end,K,.052,.048,skin);tube(K,A,.048,.03,skin);}
   else{tube(top2,K,.078,.058,bot);ball(K,.058,.045,.058,bot);tube(K,A.clone().add(new T.Vector3(0,.03,0)),.058,outfit.legs==='flare'?.095:.05,bot);}}
 }
 if(outfit.scarf){const t=plaid(),mt=new T.MeshToonMaterial({map:t,gradientMap:lightRamp()});made.push(mt);add(loft([{y:waistY-.06,rx:w.waistX+.03,rz:.125},{y:waistY+.04,rx:w.waistX+.03,rz:.122}]),mt);}
 // Feet.
 for(const [A,F] of [[LA,LT],[RA,RT]]){const toe=F??A.clone().add(new T.Vector3(0,0,.1)),mid=A.clone().lerp(toe,.5);mid.y=.04;tube(A.clone().add(new T.Vector3(0,.05,0)),A.clone().setY(.04),.031,.036,skin);
  if(outfit.feet==='shoes')ball(mid.clone().setY(.05),.05,.05,.125,dark);
  else if(outfit.feet==='canvas'){ball(mid.clone().setY(.05),.05,.05,.12,m('#e8e2d2'));}
  else{ball(mid.clone().setY(.03),.036,.026,.09,skin);if(outfit.feet==='sandals'){const s=add(new T.BoxGeometry(.095,.016,.25),dark);s.position.copy(mid).setY(.009);const st=add(new T.BoxGeometry(.09,.012,.024),dark);st.position.copy(mid).setY(.062);st.position.z+=.03;}}
 }
 body.add(group);
 // The modern clothes go; hair darkens to the people of this place, and greys with age.
 const hidden=[];model.align.traverse(o=>{if(!o.isSkinnedMesh)return;if(/body/i.test(o.name)){o.visible=false;hidden.push(o);}else if(/hair/i.test(o.name)){const hairMat=new T.MeshToonMaterial({map:elder?null:o.material.map,gradientMap:lightRamp(),alphaTest:elder?0:.35,side:T.DoubleSide,color:elder?'#b4b2aa':'#4a4744'});made.push(hairMat);o.material=hairMat;}else{const faceMat=new T.MeshToonMaterial({map:o.material.map,gradientMap:lightRamp(),alphaTest:.35,side:T.DoubleSide,color:new T.Color().setRGB(...warm,T.SRGBColorSpace)});// The source irises are red; people here have brown eyes.
faceMat.onBeforeCompile=c=>{c.fragmentShader=c.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nif(diffuseColor.r>diffuseColor.g*3.4&&diffuseColor.r>diffuseColor.b*3.4)diffuseColor.rgb=vec3(.1,.055,.035)*(.5+diffuseColor.r);');};made.push(faceMat);o.material=faceMat;}});
 return ()=>{body.remove(group);group.traverse(o=>o.geometry?.dispose());for(const x of made){x.map&&x.map.isCanvasTexture&&x.map.dispose();x.dispose();}};
}
