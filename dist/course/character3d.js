import * as T from 'three';
import {illustratedMaterial} from './art-direction.js';
// All poses are presentation only. One simulation clock supplies time.
// Bodies differ by sex, build, height, skin, hair and clothing; every option is
// built once and shown or recoloured by setLook, so a look change costs nothing.
export const HAIR_STYLES=['short','crop','side','long','bob','bun','ponytail'];
export function createCharacter({shirt='#bd914d',skin='#b88b69',hair='#323b34',height=1,sex='male',hairStyle,build=1,bottom='#364744',skirt}={}){
 const root=new T.Group(),body=new T.Group();root.add(body);
 const material=color=>illustratedMaterial(color,{character:true});
 const cloth=material(shirt),flesh=material(skin),trousers=material(bottom),shoe=material('#253733'),hairMat=material(hair),paper=material('#efe6d3'),skirtMat=material(bottom);
 const mesh=(g,m,parent,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const sphere=(r,m,parent,x,y,z,sx=1,sy=1,sz=1)=>{const o=mesh(new T.SphereGeometry(r,22,16),m,parent,x,y,z);o.scale.set(sx,sy,sz);return o;};
 const torso=sphere(.26,cloth,body,0,1.09,0,.88,1.08,.52);
 const hips=sphere(.2,trousers,body,0,.86,0,1,.55,.62);
 mesh(new T.CylinderGeometry(.06,.07,.1,12),flesh,body,0,1.41,0);
 const head=new T.Group();head.position.set(0,1.57,0);body.add(head);
 sphere(.15,flesh,head,0,0,0,.88,1.08,.86);
 for(const x of [-.132,.132])sphere(.025,flesh,head,x,-.005,0,.55,1,.75);
 sphere(.025,flesh,head,0,-.005,.128,.7,1,1);
 for(const x of [-.05,.05])sphere(.009,shoe,head,x,.012,.12,1,.7,.5);
 const brows=[-.052,.052].map(x=>mesh(new T.BoxGeometry(.038,.007,.006),hairMat,head,x,.045,.124));
 const lips=mesh(new T.BoxGeometry(.045,.008,.006),material('#8a4a42'),head,0,-.07,.122);
 // Hair styles share one material; each is a small group shown by name.
 const hairCap=sphere(.151,hairMat,head,0,.065,-.015,.9,.68,.87);
 const styles={};const style=name=>{const g=new T.Group();head.add(g);styles[name]=g;return g;};
 style('short');style('crop');
 sphere(.06,hairMat,style('side'),.06,.13,.04,1.4,.5,1);
 {const g=style('long');mesh(new T.BoxGeometry(.27,.36,.06),hairMat,g,0,-.12,-.115);for(const x of [-.125,.125])mesh(new T.BoxGeometry(.04,.26,.13),hairMat,g,x,-.06,-.03);}
 {const g=style('bob');for(const x of [-.13,.13])mesh(new T.BoxGeometry(.045,.17,.2),hairMat,g,x,-.02,-.015);mesh(new T.BoxGeometry(.27,.17,.05),hairMat,g,0,-.02,-.12);}
 sphere(.075,hairMat,style('bun'),0,.11,-.14);
 {const g=style('ponytail');sphere(.05,hairMat,g,0,.06,-.16);sphere(.045,hairMat,g,0,-.1,-.18,.8,2.2,.8);}
 function limb(x,y,length,lowerLength,m){
  const pivot=new T.Group();pivot.position.set(x,y,0);body.add(pivot);
  mesh(new T.CylinderGeometry(.058,.048,length,12),m,pivot,0,-length/2,0);
  const bend=new T.Group();bend.position.y=-length;pivot.add(bend);
  mesh(new T.CylinderGeometry(.048,.038,lowerLength,12),m,bend,0,-lowerLength/2,0);
  return {pivot,bend,length:lowerLength};
 }
 const legs=[limb(-.1,.84,.39,.39,trousers),limb(.1,.84,.39,.39,trousers)];
 for(const leg of legs){mesh(new T.BoxGeometry(.115,.065,.21),shoe,leg.bend,0,-.39,.05);mesh(new T.BoxGeometry(.12,.018,.215),material('#66736a'),leg.bend,0,-.421,.05);}
 // A skirt or pha sin hangs from the hips; seated, it folds forward over the lap.
 const skirtGroup=new T.Group();skirtGroup.position.set(0,.9,0);body.add(skirtGroup);
 const skirtMesh=mesh(new T.CylinderGeometry(.19,.27,.5,18,1,true),skirtMat,skirtGroup,0,-.25,0);skirtMesh.material.side=T.DoubleSide;
 // Cold places add a coat hem, a scarf and a knit hat over whatever is worn.
 const coatGroup=new T.Group();coatGroup.position.set(0,1.02,0);body.add(coatGroup);const coatMesh=mesh(new T.CylinderGeometry(.24,.3,.62,18,1,true),cloth,coatGroup,0,-.31,0);coatMesh.material=cloth;
 const scarfMat=material('#a5533f'),scarf=mesh(new T.TorusGeometry(.085,.035,8,18),scarfMat,body,0,1.36,0);scarf.rotation.x=Math.PI/2;
 const hat=sphere(.158,scarfMat,head,0,.08,-.01,.95,.62,.92);
 // A small collar clarifies the neck/torso joint at the closer camera scale.
 mesh(new T.BoxGeometry(.13,.025,.055),paper,body,0,1.345,.105);
 const arms=[limb(-.24,1.29,.28,.26,cloth),limb(.24,1.29,.28,.26,cloth)];
 for(const arm of arms){arm.bend.children[0].material=flesh;sphere(.049,flesh,arm.bend,0,-.27,0);}
 const book=new T.Group();body.add(book);book.position.set(0,1.02,.34);
 mesh(new T.BoxGeometry(.3,.025,.2),material('#8e4e43'),book);mesh(new T.BoxGeometry(.28,.012,.185),paper,book,0,.02,0);
 const cup=mesh(new T.CylinderGeometry(.045,.035,.09,16),paper,body,.22,1.06,.28);
 const tool=mesh(new T.BoxGeometry(.035,.24,.035),material('#927451'),arms[1].bend,0,-.26,.055);
 const hammerHead=mesh(new T.BoxGeometry(.13,.055,.055),material('#727b70'),tool,0,.1,0);
 const can=new T.Group();body.add(can);can.position.set(.3,.77,.2);
 mesh(new T.CylinderGeometry(.09,.08,.16,16),material('#6f897b'),can);
 const spout=mesh(new T.CylinderGeometry(.018,.024,.2,8),material('#6f897b'),can,-.13,.01,.04);spout.rotation.z=1.1;
 const ball=mesh(new T.SphereGeometry(.13,20,14),paper,root,.35,.13,.4);
 const ballStripe=mesh(new T.TorusGeometry(.131,.012,6,24),shoe,ball);ballStripe.rotation.x=.7;
 const look={sex,hair,hairStyle:hairStyle??(sex==='female'?'long':'short'),build,height,skirt:skirt??false};
 // Shoulders, hips and stature carry sex and build; intersex sits between.
 function setLook(next={}){
  Object.assign(look,Object.fromEntries(Object.entries(next).filter(([,v])=>v!==undefined)));
  if(next.shirt)cloth.color.set(next.shirt);if(next.skin)flesh.color.set(next.skin);if(next.bottom){trousers.color.set(next.bottom);skirtMat.color.set(next.bottom);}
  if(next.hair&&!look.greyed)hairMat.color.set(next.hair);
  const shoulder=look.sex==='female'?.76:look.sex==='male'?1:.86,hip=look.sex==='female'?1.18:look.sex==='male'?.9:1.04;
  torso.scale.set(shoulder*look.build,1.08,.52*(look.sex==='female'?1.06:1));hips.scale.set(hip*look.build,.55,.62);
  for(const arm of arms)arm.pivot.position.x=Math.sign(arm.pivot.position.x)*.27*shoulder*look.build;
  for(const [name,g]of Object.entries(styles))g.visible=name===look.hairStyle;
  hairCap.scale.set(look.hairStyle==='crop'?.88:.9,look.hairStyle==='crop'?.55:.68,.87);
  for(const b of brows)b.scale.y=look.sex==='male'?1.6:1;lips.visible=look.sex!=='male';
  skirtGroup.visible=!!look.skirt&&!look.coat;coatGroup.visible=!!look.coat;scarf.visible=!!look.scarf;hat.visible=!!look.coat;if(next.scarfColor)scarfMat.color.set(next.scarfColor);
  torso.scale.x*=look.coat?1.12:look.sweater?1.05:1;
 }
 setLook();
 let previousTime=null;
 function update(activity,age,time,{elder=false,scale=1}={}){
  const dt=previousTime===null?0:time-previousTime,blend=dt>0&&dt<1?1-Math.exp(-dt*8):1;previousTime=time;
  const oldFacing=body.rotation.y,oldHeight=body.position.y,oldJoints=[...legs,...arms].map(l=>[l.pivot.rotation.x,l.bend.rotation.x]);
  const a=activity,walking=a.moving,cycle=(a.distance??time*.7)*Math.PI*2/(.65*scale),step=Math.sin(cycle),pose=a.pose;
  root.position.set(a.x,0,a.y);root.scale.setScalar(look.height*scale);
  const target=walking?Math.atan2(a.dx,a.dy):pose==='care'?-2.3:a.facing??0;
  body.rotation.y=target;
  body.position.y=walking?Math.abs(Math.sin(cycle))*.025:0;body.rotation.z=walking?step*.018:0;body.rotation.x=0;
  head.rotation.set(0,0,0);torso.rotation.set(0,0,0);
  for(const limb of [...legs,...arms]){limb.pivot.rotation.set(0,0,0);limb.bend.rotation.set(0,0,0);}
  for(let i=0;i<2;i++){const sign=i===0?1:-1;legs[i].pivot.rotation.x=walking?step*.5*sign:0;legs[i].bend.rotation.x=walking?Math.max(0,-Math.cos(cycle)*sign)*.65:0;arms[i].pivot.rotation.x=walking?-step*.36*sign:0;arms[i].pivot.rotation.z=sign*.08;}
  book.visible=['study','draw','rest'].includes(pose);cup.visible=pose==='eat';cup.position.set(.22,1.06,.28);tool.visible=['draw','craft'].includes(pose);hammerHead.visible=pose==='craft';can.visible=pose==='garden';ball.visible=['play','exercise'].includes(pose);
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
  if(pose==='crawl'){body.rotation.x=1.25;body.position.y=-.02;head.rotation.x=-1;for(let i=0;i<2;i++){const sign=i===0?1:-1,s=Math.sin(cycle)*sign;arms[i].pivot.rotation.x=-1.25+s*.3;arms[i].bend.rotation.x=0;legs[i].pivot.rotation.x=-.35-s*.3;legs[i].bend.rotation.x=1.55;}}
  if(pose==='toddle'){for(let i=0;i<2;i++){const sign=i===0?1:-1;arms[i].pivot.rotation.z=sign*.55;arms[i].pivot.rotation.x=-.4;legs[i].pivot.rotation.x=Math.sin(cycle*1.6)*.32*sign;legs[i].bend.rotation.x=0;}body.rotation.z=Math.sin(cycle*1.6)*.07;}
  if(pose==='cook'){for(const arm of arms){arm.pivot.rotation.x=-.95;arm.bend.rotation.x=-.45;}arms[1].pivot.rotation.z=-.2+Math.sin(time*4)*.15;head.rotation.x=.32;cup.visible=true;cup.position.set(-.05,1.02,.42);}
  if(pose==='floor'){body.position.y=-.72;for(const leg of legs){leg.pivot.rotation.x=-1.5;leg.bend.rotation.x=.15;}for(const arm of arms){arm.pivot.rotation.x=-.55;arm.bend.rotation.x=-.6;}head.rotation.x=.25;book.visible=age>=6;ball.visible=age<6;if(ball.visible)ball.position.set(.05,.13,.55);}
  // Held activity poses settle into place; turning takes the shortest arc.
  body.rotation.y=oldFacing+Math.atan2(Math.sin(body.rotation.y-oldFacing),Math.cos(body.rotation.y-oldFacing))*blend;
  body.position.y=oldHeight+(body.position.y-oldHeight)*blend;
  [...legs,...arms].forEach((l,i)=>{l.pivot.rotation.x=oldJoints[i][0]+(l.pivot.rotation.x-oldJoints[i][0])*blend;l.bend.rotation.x=oldJoints[i][1]+(l.bend.rotation.x-oldJoints[i][1])*blend;});
  coatGroup.rotation.x=legs[0].pivot.rotation.x<-1?-1.1:0;skirtGroup.rotation.x=legs[0].pivot.rotation.x<-1?-1.25:0;skirtGroup.scale.y=legs[0].pivot.rotation.x<-1?.62:1;
  if(elder){body.rotation.x+=.06;if(!look.greyed){look.greyed=true;hairMat.color.set('#b4b6ae');}}else if(look.greyed){look.greyed=false;hairMat.color.set(look.hair);}
 }
 return {root,update,setLook,anchors:{head,torso}};
}
