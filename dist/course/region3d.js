import * as T from 'three';
// Regional scenery on the shared footprints. Institutions keep their positions in
// every region (school, work, market, clinic), so routes and seats never move;
// only what stands on them changes. Free-standing props are plain data so tests
// can prove none of them sits on anyone's daily path.
export const FOOTPRINTS={market:[-.5,-.5,2.5,2],school:[9,-1,3,2],work:[11,3,3,2],clinic:[1,11,2.3,2],f1:[2.9,-.5,2,2.8],f2:[4.9,-.5,2,2.8],f3:[-2,-2,1.8,1.5],city:[0,-3,1.9,1.6]};
const LABELS={market:'MARKET',school:'SCHOOL',work:'WORK',clinic:'CLINIC',city:'CITY'};
// [kind, x, z, w, d] in world units; kinds are drawn by the style's prop builder.
export const PROPS={
 market:[],
 slum:[['canal',-4.5,-3,1.6,20],['shack',-2.6,3.2,1.2,1.6],['shack',-2.6,5.2,1.2,1.4],['shack',13.4,-2.4,1.4,1.2],['laundry',.4,5,1.8,.2],['shack',14.2,12.6,1.2,1.4]],
 village:[['paddy',-1.2,.9,2.7,3.3],['paddy',13.6,-2.6,1.6,2],['buffalo',-2.6,5.2,.9,.45],['palm',-2.4,7],['palm',14.6,13],['wat',13.9,12.3,1.4,1.6]],
 condo:[['tower',-2.8,2.4,1.6,2.2],['tower',13.5,-2.6,1.6,1.8],['car',.3,5.1,.9,.45],['car',.3,6,.9,.45],['rail',-4,-1.6,22,.5]],
 coast:[['sea',-6,-4,2.6,22],['boat',-5.4,2,1.6,.45],['boat',-5.2,6,1.4,.4],['palm',-2.4,4.6],['palm',-2.3,7.2],['palm',14.4,13.2],['jetty',-3.6,3.6,1.4,.4]],
 villa:[['wall',-3,9.2,.12,6.6],['pool',.2,4.7,2,1.5],['car',13.5,-2.4,.95,.48],['hedge',13.4,12.2,1.6,.4],['palm',-2.4,4.8]],
 tower:[['tower',-2.8,2.3,1.7,2.4],['tower',13.4,-2.7,1.8,1.9],['canopy',.2,4.8,2,1.6],['rail',-4,-1.6,22,.5]],
 tokyo:[['vending',.5,5.2,.35,.3],['vending',.95,5.2,.35,.3],['pole',2.2,5.1],['pole',-1.8,6.8],['pole',13.8,12.6],['rail',-4,-1.6,22,.5]],
 newengland:[['bare',-2.5,4.6],['bare',-2.4,7],['bare',14.4,13],['snowbank',.2,5.2,2,.5],['car',13.5,-2.4,.95,.48]],
 brick:[['terrace',-2.9,2.2,1.4,3.4],['terrace',13.4,-2.7,1.8,1.9],['redbus',.2,5.4,1.6,.5],['tree',14.3,12.8]]
};
export function createRegionScenery({scene,box,round,tree,label,registerBuilding}){
 const groups=new Map();
 function gable(x,z,w,d,h,color,parent,pitch=.55){const g=new T.BufferGeometry(),p=[x-.12,h,z-.12,x+w+.12,h,z-.12,x+w+.12,h+pitch,z+d/2,x-.12,h+pitch,z+d/2,x-.12,h,z+d+.12,x+w+.12,h,z+d+.12];g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex([0,2,1,0,3,2,3,5,2,3,4,5,0,4,3,1,2,5]);g.computeVertexNormals();const m=new T.Mesh(g,new T.MeshLambertMaterial({color,side:T.DoubleSide}));m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function windows(x,z,w,d,from,to,step,color,parent){for(let y=from;y<to;y+=step)for(let a=x+.2;a<x+w-.25;a+=.42)box(a,z+d+.01,y,.24,.02,step*.5,color,parent);}
 function wrap(name,parent,fn){const g=new T.Group();parent.add(g);fn(g);registerBuilding(g);if(LABELS[name])label(...labelAt(name),LABELS[name],g);return g;}
 const labelAt=name=>{const [x,z,w,d]=FOOTPRINTS[name];return [x+w*.85,z+d+.3,.12];};
 // Each style answers: what stands on an institution footprint, and how props look.
 const STYLES={
  slum(name,[x,z,w,d],g){const h=name==='school'||name==='clinic'?1.7:1.1+((x*7+z*3)%5+5)%5*.12;box(x,z,0,w,d,h,['#8e9ca0','#9a8f7c','#7f8f86','#a39a86'][Math.abs(Math.round(x+z))%4],g);const roof=box(x-.1,z-.1,h,w+.2,d+.2,.05,'#7d8a8c',g);roof.rotation.x=.08;if(name!=='school'&&name!=='clinic'){box(x+.2,z+.2,h+.05,w*.55,d*.5,.7,'#9aa6a3',g);box(x+.15,z+.15,h+.75,w*.6,d*.55,.04,'#6f7b7c',g);}windows(x,z,w,d,.5,h-.2,.6,'#4f5f60',g);box(x+w*.45,z+d+.01,0,.4,.03,.9,'#5f4f3f',g);},
  village(name,[x,z,w,d],g){const lift=name==='school'||name==='clinic'?0:.6;if(lift)for(const[a,b]of [[x+.1,z+.1],[x+w-.15,z+.1],[x+.1,z+d-.15],[x+w-.15,z+d-.15]])box(a,b,0,.08,.08,lift,'#6b5236',g);box(x,z,lift,w,d,1.1,name==='school'?'#e8e0c8':'#a5825a',g);gable(x,z,w,d,lift+1.1,name==='school'?'#a24b38':'#7a6a55',g,.7);windows(x,z,w,d,lift+.4,lift+1,.6,'#3f3428',g);},
  condo(name,[x,z,w,d],g){const h=name==='market'?1.4:name==='school'?2:name==='clinic'?2.2:3.2+((Math.round(x*3+z))%3)*.8;box(x,z,0,w,d,h,name==='market'?'#e3ded2':'#d9d6cc',g);windows(x,z,w,d,.5,h-.2,.45,'#7f949a',g);for(let y=.9;y<h;y+=.9)box(x-.03,z+d,y,w+.06,.08,.05,'#bdb8ab',g);if(name==='market'){box(x,z+d,1.05,w,.35,.06,'#3f8a5a',g);box(x+.1,z+d+.02,1.12,w-.2,.02,.2,'#e6e0cf',g);}},
  coast(name,[x,z,w,d],g){box(x,z,0,w,d,1.4,['#9fb7b5','#b7a98a','#8fb0a0','#c2b48a'][Math.abs(Math.round(x*2+z))%4],g);gable(x,z,w,d,1.4,'#a45b45',g);windows(x,z,w,d,.5,1.2,.6,'#3f5f60',g);box(x+w*.45,z+d+.01,0,.4,.03,.95,'#4f6a6a',g);},
  villa(name,[x,z,w,d],g){const h=name==='market'?1.4:2.1;box(x,z,0,w,d,h,'#f1ece0',g);box(x-.1,z-.1,h,w+.2,d+.2,.08,'#5f6a6a',g);box(x+.15,z+.15,h+.08,w-.3,d-.3,.6,'#ece6d8',g);box(x+.1,z+.1,h+.68,w-.2,d-.2,.06,'#5f6a6a',g);windows(x,z,w,d,.5,h,.7,'#6f8a92',g);},
  tower(name,[x,z,w,d],g){const h=name==='market'?1.2:name==='school'?2.2:3.6+((Math.round(x+z*2))%3)*.9;box(x,z,0,w,d,h,'#e8e2d4',g);for(let y=.6;y<h;y+=.55)box(x-.02,z+d,y,w+.04,.05,.12,['#c77d5a','#6f9a8a','#d8b25a'][Math.abs(Math.round(x))%3],g);windows(x,z,w,d,.7,h-.2,.55,'#6f8a92',g);if(name==='market'){box(x-.2,z-.2,1.2,w+.4,d+.4,.06,'#8a9a98',g);}},
  tokyo(name,[x,z,w,d],g){const h=name==='school'?2.2:name==='clinic'?1.9:1.6+((Math.round(x*5+z))%3)*.4;box(x,z,0,w,d,h,['#ddd8cc','#c9c4b8','#e5e1d6'][Math.abs(Math.round(x+z))%3],g);gable(x,z,w,d,h,'#4f5a5e',g,.35);windows(x,z,w,d,.5,h-.1,.55,'#5f6f72',g);if(name==='market'){box(x,z+d,0,w,.05,1,'#f0efe8',g);box(x,z+d+.02,1,w,.03,.18,'#2f7f5f',g);}},
  newengland(name,[x,z,w,d],g){const h=name==='school'?2.3:name==='market'?1.3:1.8;box(x,z,0,w,d,h,['#d7dde0','#9fb2bf','#c9b8a0','#e8e4da'][Math.abs(Math.round(x+z*2))%4],g);for(let y=.3;y<h;y+=.22)box(x-.005,z+d,y,w+.01,.015,.015,'#b8bfc2',g);gable(x,z,w,d,h,'#f4f6f7',g,.85);for(let a=x+.25;a<x+w-.3;a+=.55){box(a,z+d+.01,.55,.28,.02,.42,'#f7f5ef',g);box(a+.04,z+d+.02,.59,.2,.02,.34,'#4f6470',g);}box(x+w*.45,z+d+.01,0,.38,.03,.95,'#7a2f2a',g);},
  brick(name,[x,z,w,d],g){const h=name==='school'?2.3:1.9;box(x,z,0,w,d,h,'#9a5a46',g);gable(x,z,w,d,h,'#4d5254',g,.6);box(x+w*.75,z+d*.4,h+.2,.18,.18,.6,'#7a4434',g);for(let a=x+.25;a<x+w-.3;a+=.55){box(a,z+d+.01,.55,.3,.02,.45,'#f2efe6',g);box(a+.04,z+d+.02,.6,.22,.02,.35,'#5a6a72',g);box(a,z+d+.01,1.25,.3,.02,.45,'#f2efe6',g);box(a+.04,z+d+.02,1.3,.22,.02,.35,'#5a6a72',g);}}
 };
 function prop([kind,x,z,w,d],g){
  if(kind==='canal'||kind==='sea'){box(x,z,-.2,w,d,.2,kind==='sea'?'#3f7f8a':'#4f6d68',g);return;}
  if(kind==='shack'){box(x,z,0,w,d,1,'#8a9690',g);const r=box(x-.08,z-.08,1,w+.16,d+.16,.04,'#77837f',g);r.rotation.z=.06;box(x+w*.4,z+d+.01,0,.35,.02,.8,'#5f4f3f',g);return;}
  if(kind==='laundry'){for(const a of [x,x+w])box(a,z,0,.04,.04,1.3,'#6b5a45',g);box(x,z,1.25,w,.01,.01,'#3c3c3c',g);[['#c0563f',.1],['#e6d9b8',.5],['#4f7a9a',.9],['#d8b25a',1.3]].forEach(([c,o])=>box(x+o,z,.85,.3,.02,.38,c,g));return;}
  if(kind==='paddy'){box(x,z,.005,w,d,.02,'#7f9e86',g);for(let a=x+.15;a<x+w;a+=.25)for(let b=z+.15;b<z+d;b+=.25)box(a,b,.02,.04,.04,.18,'#7fa85a',g);return;}
  if(kind==='buffalo'){box(x,z,.35,w,d,.4,'#4a4440',g);box(x+w,z+.08,.5,.28,.3,.28,'#4a4440',g);for(const[a,b]of [[x+.05,z+.05],[x+w-.12,z+.05],[x+.05,z+d-.12],[x+w-.12,z+d-.12]])box(a,b,0,.07,.07,.36,'#3a3430',g);return;}
  if(kind==='palm'){const trunk=new T.Mesh(new T.CylinderGeometry(.05,.08,1.9,10),new T.MeshLambertMaterial({color:'#8a7456'}));trunk.position.set(x,.95,z);trunk.rotation.z=.08;trunk.castShadow=true;g.add(trunk);for(let i=0;i<6;i++){const f=box(-.05,0,0,.9,.18,.03,'#5f8a4f',g);f.position.set(x+Math.cos(i)*.38,1.85,z+Math.sin(i)*.38);f.rotation.set(0,-i,-.4);}return;}
  if(kind==='wat'){box(x,z,0,w,d,.9,'#efe7d2',g);gable(x,z,w,d,.9,'#b0472f',g,.6);gable(x+.2,z+.25,w-.4,d-.5,1.35,'#d6a03a',g,.45);return;}
  if(kind==='tower'||kind==='terrace'){const h=kind==='tower'?4.2:2.2;box(x,z,0,w,d,h,kind==='tower'?'#d9d6cc':'#8f5240',g);windows(x,z,w,d,.5,h-.2,.5,kind==='tower'?'#7f949a':'#5a6a72',g);if(kind==='terrace')gable(x,z,w,d,h,'#4d5254',g);return;}
  if(kind==='car'){box(x,z,.12,w,d,.28,'#c9c5b8',g);box(x+.2,z+.03,.4,w*.55,d-.06,.2,'#5f6f72',g);return;}
  if(kind==='redbus'){box(x,z,.1,w,d,1.1,'#b23a2e',g);for(let a=x+.1;a<x+w-.15;a+=.3){box(a,z+d+.005,.55,.22,.01,.2,'#2f3a40',g);box(a,z+d+.005,.9,.22,.01,.15,'#2f3a40',g);}return;}
  if(kind==='rail'){box(x,z,1.9,w,d,.18,'#c9c4b8',g);for(let a=x+1;a<x+w;a+=3)box(a,z+.15,0,.2,.2,1.9,'#a9a496',g);return;}
  if(kind==='boat'){box(x,z,-.05,w,d,.18,'#2f6f9a',g);box(x+.1,z+.05,.12,w-.2,d-.1,.04,'#d8c8a0',g);return;}
  if(kind==='jetty'){box(x,z,.05,w,d,.04,'#8a7050',g);return;}
  if(kind==='wall'){box(x,z,0,w,d,.9,'#ece6d8',g);return;}
  if(kind==='pool'){box(x,z,.005,w,d,.03,'#6fb0c0',g);box(x-.08,z-.08,0,w+.16,d+.16,.01,'#ece6d8',g);return;}
  if(kind==='hedge'){box(x,z,0,w,d,.55,'#4f7a4a',g);return;}
  if(kind==='canopy'){for(const[a,b]of [[x,z],[x+w-.06,z],[x,z+d-.06],[x+w-.06,z+d-.06]])box(a,b,0,.06,.06,1.3,'#8a9a98',g);box(x-.1,z-.1,1.3,w+.2,d+.2,.06,'#c77d5a',g);return;}
  if(kind==='vending'){box(x,z,0,w,d,.9,'#e8e6df',g);box(x+.04,z+d,.4,w-.08,.01,.4,'#5f8aa0',g);return;}
  if(kind==='pole'){box(x,z,0,.07,.07,2.6,'#7a7a72',g);box(x-.4,z,2.4,.9,.04,.04,'#5a5a52',g);return;}
  if(kind==='tree'){tree(x,z,g);return;}
  if(kind==='bare'){const trunk=new T.Mesh(new T.CylinderGeometry(.04,.08,1.5,8),new T.MeshLambertMaterial({color:'#5f5248'}));trunk.position.set(x,.75,z);g.add(trunk);for(let i=0;i<5;i++){const b=box(0,0,0,.03,.6,.03,'#5f5248',g);b.position.set(x+Math.cos(i*1.3)*.18,1.3+i*.06,z+Math.sin(i*1.3)*.18);b.rotation.set(Math.sin(i)*.7,0,Math.cos(i)*.7);}return;}
  if(kind==='snowbank'){box(x,z,0,w,d,.18,'#f4f6f7',g);}
 }
 function build(style){
  const root=new T.Group();scene.add(root);
  for(const [name,f]of Object.entries(FOOTPRINTS))wrap(name,root,g=>STYLES[style](name,f,g));
  const props=new T.Group();root.add(props);for(const p of PROPS[style])prop(p,props);
  return root;
 }
 // Lazily build a style the first time a life reaches it.
 return {update(style){for(const g of groups.values())g.visible=false;if(style==='market')return;if(!groups.has(style))groups.set(style,build(style));groups.get(style).visible=true;}};
}
