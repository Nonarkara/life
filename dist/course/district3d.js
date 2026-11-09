import * as T from 'three';
import {illustratedMaterial} from './art-direction.js';
import {m} from './diorama-kit.js';
import {furnishHome} from './home3d.js';
import {RESIDENCES,residenceAt,workplaceAt,roomFurniture,locationSince} from './locations.js';
import {CITY_BLOCKS,revealedPlaces,floorAt,overlappingReaderWidth} from './district-layout.js';
export {CITY_BLOCKS,revealedPlaces,floorAt,overlappingReaderWidth} from './district-layout.js';

const S=m(3);
export function createDistricts({scene,box,round,chair,table,tree,registerBuilding,palette}){
 const wall=palette?.wall??'#e5d9b9',floor=palette?.floor??'#aa9472',ground=palette?.ground??'#899273',road=palette?.road??'#bcb7a5',leaf=palette?.leaf?.[0]??'#657d5d',acc=palette?.accent??'#55777c';
 const rooms=new Map(),city=new T.Group(),west=new T.Group(),east=new T.Group();scene.add(city,west,east);
 const urban=new T.Group();scene.add(urban);
 // Extra boards bolted to the model when a life moves beyond the first town.
 const board=(x,z,w,d,g)=>{box(x,z,-1.3,w,d,1.27,'#8d8a7e',g);box(x,z,-.033,w,d,.003,ground,g);};
 board(18.6,-.6,17.4,19.4,urban);board(18.6,6.6,17.4,3,east);board(-13.2,1.4,7.6,8,west);
 // Inhabited pavement joins the office, home and transport stop into one district.
 box(23.2,8.2,-.02,10.4,9.4,.012,'#a7a18b',urban);
 for(let x=23.5;x<32.5;x+=1.5)for(let z=1.4;z<7;z+=1.4)box(x,z,-.018,1.35,1.25,.008,(x+z)%2?'#b5ae98':'#aba38c',urban);
 box(22.8,1,-.02,1.4,5.4,.012,palette?.water??'#648688',urban);box(22.75,.95,-.01,1.5,.1,.08,'#9d947e',urban);box(22.75,6.3,-.01,1.5,.1,.08,'#9d947e',urban);
 for(const b of [...CITY_BLOCKS,{x:23.2,z:2.2,w:1.3,d:2.6,h:2.8},{x:30.6,z:2.4,w:1.6,d:2.8,h:3.1},{x:32.3,z:8.8,w:1.4,d:3.4,h:2.7}]){
  const H=b.h*S,bw=b.w;box(b.x,b.z,0,bw,b.d,H,wall,urban);box(b.x-.03,b.z-.03,H,bw+.06,b.d+.06,.06,'#a29f94',urban);
  for(let y=.5;y<H-.2;y+=S)box(b.x+.12,b.z+b.d+.004,y,bw-.24,.012,m(1.2),'#4d5e62',urban);
 }
 for(const [x,z]of [[24.2,1.6],[30.8,1.8],[32.8,6.2],[23.6,14.8]])tree(x,z,urban);
 // Stop faces the road; the seated waiting area stays outside the walking route.
 box(29.3,9.05,0,1.3,.28,.25,'#9a896d',urban);box(29.15,8.95,m(2.4),1.6,.6,.05,'#879181',urban);for(const x of [29.2,30.6])box(x,9.35,0,.04,.04,m(2.4),'#6f7d6b',urban);
 for(const x of [25.4,28.8]){box(x,15,0,.3,.3,.24,'#a68161',urban);round(x+.15,15.15,.46,.2,leaf,1,1,1,urban);}
 registerBuilding(urban);
 // Ground and road are contiguous with the existing neighbourhood, not islands.
 box(-13,7,-.02,7.4,1.8,.012,road,west);
 box(18.6,7.05,-.02,17.4,1.8,.012,road,east);box(31.5,7,-.02,1.1,8.4,.012,road,east);box(28.5,13.8,-.02,4,1,.012,road,east);
 for(const [group,start,end]of [[west,-13,-6],[east,18.6,35]])for(let x=start;x<end;x+=1.6)box(x,7.93,-.006,.7,.035,.005,'#e7e0cf',group);
 const plant=(x,z,group)=>{box(x-.11,z-.11,.16,.22,.22,.2,'#a2765c',group);round(x,z,.5,.17,leaf,1,1.25,1,group);};
 const streetlamp=(x,z,group)=>{box(x,z,0,.04,.04,S*1.4,'#6d7566',group);box(x-.12,z-.04,S*1.4,.26,.1,.03,'#dacaa7',group);};
 for(const [group,xs]of [[west,[-11,-7]],[east,[20,23,30,34]]])for(const x of xs){tree(x,6.7,group);streetlamp(x+.45,8.95,group);}
 const top=furnishHome.metrics.tableTop;
 for(const room of Object.values(RESIDENCES).filter(r=>r.id!=='family')){
  const group=new T.Group();scene.add(group);rooms.set(room.id,group);const [x,z]=room.base,WALL=m(2.75);
  box(x,z,0,4,3.6,.16,floor,group);for(let a=x;a<x+4;a+=.25)box(a,z,.16,.008,3.6,.002,'#8e7b5f',group);box(x,z+3.6,0,4,.6,.08,floor,group);
  box(x,z,.16,4,.08,WALL,wall,group);box(x,z,.16,.08,3.6,WALL,wall,group);
  box(x+1,z+.085,.16+m(1),1.5,.012,m(1.2),'#a9c4c4',group);
  const [bed,sofa,desk]=roomFurniture(room),F=.16;
  box(bed.x+.06,bed.y+.1,F,bed.w-.12,bed.d-.25,m(.3),'#7d6951',group);box(bed.x+.08,bed.y+.12,F+m(.3),bed.w-.16,bed.d-.29,m(.15),'#e4e0d0',group);box(bed.x+.1,bed.y+.65,F+m(.45),bed.w-.2,bed.d-.9,.018,acc,group);box(bed.x+.12,bed.y+.18,F+m(.45),bed.w-.24,.3,.05,'#efe9d9',group);
  // Sofa occupies the former crib footprint; the same route clearance applies.
  box(sofa.x+.1,sofa.y+.1,F,sofa.w-.2,sofa.d-.2,m(.42),'#8b9b89',group);box(sofa.x+.1,sofa.y+.1,F+m(.42),sofa.w-.2,.12,m(.4),'#788a77',group);
  box(desk.x+.02,desk.y+.04,F+top,desk.w-.04,desk.d-.08,.035,'#b09a78',group);for(const [a,e] of [[.04,.08],[desk.w-.09,.08],[.04,desk.d-.13],[desk.w-.09,desk.d-.13]])box(desk.x+a,desk.y+e,F,.04,.04,top,'#8c795e',group);box(desk.x+.1,desk.y+.2,F+top+.035,.2,.28,.012,'#e8e0ce',group);
  chair(...room.origin,0,.16,group);chair(x+3.35,z+1.95,Math.PI,.16,group);
  box(x+.15,z+.12,F,.5,.2,m(1.2),'#8c795e',group);for(let a=0;a<4;a++)box(x+.18+a*.1,z+.13,F+m(.7),.06,.14,.22,'#7d8b7a',group);
  plant(x+2.7,z+.35,group);registerBuilding(group);
 }
 // A sheltered city workplace: actual desk/chair coordinates match the routine.
 box(25,3,0,5,2.2,.1,'#a99b81',city);box(25,3,.1,5,.1,S*1.3,'#d7d2bd',city);box(25,3,.1,.1,2.2,S*1.3,'#c9c5ae',city);
 for(let x=25.4;x<29.6;x+=.8)box(x,3.1,.5,.55,.012,m(1.5),'#6f8b85',city);
 table(26.9,6.15,.75,city);const workChairGroup=new T.Group();city.add(workChairGroup);chair(27.3,5.8,0,0,workChairGroup);
 const laptop=new T.Group();city.add(laptop);box(27.06,6.2,top+.04,.3,.2,.02,'#536760',laptop);box(27.06,6.38,top+.05,.3,.02,.2,'#526a66',laptop);
 const workpieceGroup=new T.Group();city.add(workpieceGroup);box(27.08,6.24,top+.04,.3,.18,.08,'#bea37a',workpieceGroup);plant(29.4,4.7,city);
 registerBuilding(city);
 // A workstation roof owns its cutaway separately from walls/ground.
 // Seated heads can sit just outside a narrow ray at the roof's leading edge.
 const canopy=new T.Group();city.add(canopy);canopy.userData.cutawayBounds={x:25.9,z:5.05,w:2.8,d:1.8};
 box(25.9,5.05,S*.95,2.8,1.8,.08,'#92836c',canopy);for(const x of [25.9,28.65])box(x,6.7,0,.06,.06,S*.95,'#8b7e65',canopy);registerBuilding(canopy);
 // A small public garden gives the independent neighbourhood a usable edge.
 box(19.5,8.9,-.02,.65,1.7,.012,road,east);box(19,10.3,-.022,4,2.2,.012,'#7d9270',east);for(const x of [19.5,22])tree(x,12.7,east);
 return {rooms,city,canopy,urban,update(state,age){const revealed=revealedPlaces(state,age);for(const[id,group]of rooms)group.visible=revealed.homes.has(id);city.visible=revealed.city;urban.visible=revealed.city;west.visible=revealed.homes.has('far');east.visible=revealed.city||revealed.homes.has('nearLocal');const manual=state.history?.filter(r=>(r.from??r.age)<=age).at(-1)?.pathway==='vocational';workChairGroup.visible=!manual;laptop.visible=!manual;workpieceGroup.visible=manual;}};
}
