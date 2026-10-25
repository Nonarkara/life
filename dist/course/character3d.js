import * as T from 'three';
import {illustratedMaterial} from './art-direction.js';
// All poses are presentation only. One simulation clock supplies time.
export function createCharacter({shirt='#bd914d',skin='#b88b69',hair='#323b34',height=1}={}){
 const root=new T.Group(),body=new T.Group();root.add(body);
 const material=color=>illustratedMaterial(color,{character:true});
 const cloth=material(shirt),flesh=material(skin),trousers=material('#364744'),shoe=material('#253733'),hairMat=material(hair),paper=material('#efe6d3');
 const mesh=(g,m,parent,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const sphere=(r,m,parent,x,y,z,sx=1,sy=1,sz=1)=>{const o=mesh(new T.SphereGeometry(r,12,10),m,parent,x,y,z);o.scale.set(sx,sy,sz);return o;};
 const torso=sphere(.26,cloth,body,0,1.09,0,.88,1.08,.52);
 mesh(new T.CylinderGeometry(.06,.07,.1,8),flesh,body,0,1.41,0);
 const head=new T.Group();head.position.set(0,1.57,0);body.add(head);
 sphere(.15,flesh,head,0,0,0,.88,1.08,.86);
 for(const x of [-.132,.132])sphere(.025,flesh,head,x,-.005,0,.55,1,.75);
 const hairCap=sphere(.151,hairMat,head,0,.065,-.015,.9,.68,.87);
 sphere(.025,flesh,head,0,-.005,.128,.7,1,1);
 for(const x of [-.05,.05])sphere(.009,shoe,head,x,.012,.12,1,.7,.5);
 function limb(x,y,length,lowerLength,m){
  const pivot=new T.Group();pivot.position.set(x,y,0);body.add(pivot);
  mesh(new T.CylinderGeometry(.058,.048,length,8),m,pivot,0,-length/2,0);
  const bend=new T.Group();bend.position.y=-length;pivot.add(bend);
  mesh(new T.CylinderGeometry(.048,.038,lowerLength,8),m,bend,0,-lowerLength/2,0);
  return {pivot,bend,length:lowerLength};
 }
 const legs=[limb(-.1,.84,.39,.39,trousers),limb(.1,.84,.39,.39,trousers)];
 for(const leg of legs){mesh(new T.BoxGeometry(.115,.065,.21),shoe,leg.bend,0,-.39,.05);mesh(new T.BoxGeometry(.12,.018,.215),material('#66736a'),leg.bend,0,-.421,.05);}
 // A small collar clarifies the neck/torso joint at the closer camera scale.
 mesh(new T.BoxGeometry(.13,.025,.055),paper,body,0,1.345,.105);
 const arms=[limb(-.24,1.29,.28,.26,cloth),limb(.24,1.29,.28,.26,cloth)];
 for(const arm of arms){arm.bend.children[0].material=flesh;sphere(.049,flesh,arm.bend,0,-.27,0);}
 const book=new T.Group();body.add(book);book.position.set(0,1.02,.34);
 mesh(new T.BoxGeometry(.3,.025,.2),material('#8e4e43'),book);mesh(new T.BoxGeometry(.28,.012,.185),paper,book,0,.02,0);
 const cup=mesh(new T.CylinderGeometry(.045,.035,.09,12),paper,body,.22,1.06,.28);
 const tool=mesh(new T.BoxGeometry(.035,.24,.035),material('#927451'),arms[1].bend,0,-.26,.055);
 const hammerHead=mesh(new T.BoxGeometry(.13,.055,.055),material('#727b70'),tool,0,.1,0);
 const can=new T.Group();body.add(can);can.position.set(.3,.77,.2);
 mesh(new T.CylinderGeometry(.09,.08,.16,12),material('#6f897b'),can);
 const spout=mesh(new T.CylinderGeometry(.018,.024,.2,8),material('#6f897b'),can,-.13,.01,.04);spout.rotation.z=1.1;
 const ball=mesh(new T.SphereGeometry(.13,14,10),paper,root,.35,.13,.4);
 const ballStripe=mesh(new T.TorusGeometry(.131,.012,4,16),shoe,ball);ballStripe.rotation.x=.7;
 
 let previousTime=null;
 function update(activity,age,time,{elder=false,scale=1}={}){
  const dt=previousTime===null?0:time-previousTime,blend=dt>0&&dt<1?1-Math.exp(-dt*8):1;previousTime=time;
  const oldFacing=body.rotation.y,oldHeight=body.position.y,oldJoints=[...legs,...arms].map(l=>[l.pivot.rotation.x,l.bend.rotation.x]);
  const a=activity,walking=a.moving,cycle=(a.distance??time*.7)*Math.PI*2/(.65*scale),step=Math.sin(cycle),pose=a.pose;
  root.position.set(a.x,0,a.y);root.scale.setScalar(height*scale);
  const target=walking?Math.atan2(a.dx,a.dy):pose==='care'?-2.3:a.facing??0;
  body.rotation.y=target;
  body.position.y=walking?Math.abs(Math.sin(cycle))*.025:0;body.rotation.z=walking?step*.018:0;body.rotation.x=0;
  head.rotation.set(0,0,0);torso.rotation.set(0,0,0);
  for(const limb of [...legs,...arms]){limb.pivot.rotation.set(0,0,0);limb.bend.rotation.set(0,0,0);}
  for(let i=0;i<2;i++){const sign=i===0?1:-1;legs[i].pivot.rotation.x=walking?step*.5*sign:0;legs[i].bend.rotation.x=walking?Math.max(0,-Math.cos(cycle)*sign)*.65:0;arms[i].pivot.rotation.x=walking?-step*.36*sign:0;arms[i].pivot.rotation.z=sign*.08;}
  book.visible=['study','draw','rest'].includes(pose);cup.visible=pose==='eat';tool.visible=['draw','craft'].includes(pose);hammerHead.visible=pose==='craft';can.visible=pose==='garden';ball.visible=['play','exercise'].includes(pose);
  if(['rest','eat','study','work','recover'].includes(pose)&&!walking){
   body.position.y=-.32+(scale<.9?.52*(1/scale-1):0);for(const leg of legs){leg.pivot.rotation.x=-1.45;leg.bend.rotation.x=1.45;}
   for(const arm of arms){arm.pivot.rotation.x=-.65;arm.bend.rotation.x=-.7;}
   head.rotation.x=pose==='rest'?.16:.22;
  }
  if(pose==='eat'){cup.position.y=1.18;for(const arm of arms){arm.pivot.rotation.x=-.9;arm.bend.rotation.x=-.8;}}
  if(pose==='work'){arms[0].bend.rotation.x=-.7+Math.sin(time*7)*.12;arms[1].bend.rotation.x=-.7+Math.cos(time*6)*.12;}
  if(pose==='study'){head.rotation.x=.28;arms[1].bend.rotation.x=-.8+Math.sin(time*2)*.1;}
  if(pose==='draw'){arms[1].pivot.rotation.x=-.8+Math.sin(time*3)*.1;}
  if(pose==='craft'){arms[1].pivot.rotation.x=-.7+Math.sin(time*3)*.35;arms[1].bend.rotation.x=-.5;}
  if(pose==='trade'){for(const arm of arms){arm.pivot.rotation.x=-.6;arm.bend.rotation.x=-.4;}head.rotation.y=.1;}
  if(pose==='care'){for(const arm of arms){arm.pivot.rotation.x=-.8;arm.bend.rotation.x=-.6;}head.rotation.x=.3;}
  if(pose==='garden'){body.rotation.x=.13;arms[1].pivot.rotation.x=-.4;can.rotation.z=.25+Math.sin(time)*.08;}
  if(ball.visible){ball.position.set(.3+Math.sin(time*2)*.18,.14+Math.abs(Math.sin(time*2))*.12,.45);legs[1].pivot.rotation.x=Math.sin(time*2)*.3;arms[0].pivot.rotation.z=.2;}
  // Held activity poses settle into place; turning takes the shortest arc.
  body.rotation.y=oldFacing+Math.atan2(Math.sin(body.rotation.y-oldFacing),Math.cos(body.rotation.y-oldFacing))*blend;
  body.position.y=oldHeight+(body.position.y-oldHeight)*blend;
  [...legs,...arms].forEach((l,i)=>{l.pivot.rotation.x=oldJoints[i][0]+(l.pivot.rotation.x-oldJoints[i][0])*blend;l.bend.rotation.x=oldJoints[i][1]+(l.bend.rotation.x-oldJoints[i][1])*blend;});
  if(elder){body.rotation.x+=.06;hairCap.material.color.set('#a4aaa2');}else hairCap.material.color.set(hair);
 }
 return {root,update,anchors:{head,torso}};
}
