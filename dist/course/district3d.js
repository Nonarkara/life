import * as T from 'three';
import {illustratedMaterial} from './art-direction.js';
import {RESIDENCES,residenceAt,workplaceAt,roomFurniture,locationSince} from './locations.js';
export const CITY_BLOCKS=[{x:23.5,z:9,w:1.2,d:3,h:2.6},{x:29.6,z:9,w:1.2,d:3,h:3},{x:24,z:15.6,w:3,d:1.4,h:2.5}];

export function revealedPlaces(state,age=state.age){
 const homes=new Set(['family']);let city=false;
 const records=(state.history??[]).filter(r=>r.finance&&locationSince(r.finance,r.age)>=20&&locationSince(r.finance,r.age)<=age).map(r=>({age:locationSince(r.finance,r.age),finance:r.finance}));
 if(age>=20&&state.finance&&locationSince(state.finance,state.age)<=age)records.push({age:locationSince(state.finance,state.age),finance:state.finance});
 for(const record of records){const home=residenceAt(record);homes.add(home.id);city||=workplaceAt(record).id==='city'||home.id==='nearCity';}
 return {homes,city};
}
export function floorAt(x,z){
 for(const room of Object.values(RESIDENCES)){const [bx,bz]=room.base;if(x>=bx&&x<=bx+4&&z>=bz&&z<=bz+4.2)return Math.max(0,Math.min(.16,(bz+4.2-z)/.6*.16));}
 return 0;
}
export function overlappingReaderWidth(canvasRect,readerRect){
 if(!readerRect||readerRect.bottom<=canvasRect.top||readerRect.top>=canvasRect.bottom)return 0;
 return Math.max(0,Math.min(canvasRect.right,readerRect.right)-Math.max(canvasRect.left,readerRect.left));
}

export function createDistricts({scene,box,round,chair,table,tree,label,registerBuilding}){
 const rooms=new Map(),city=new T.Group(),west=new T.Group(),east=new T.Group();scene.add(city,west,east);
 const urban=new T.Group();scene.add(urban);
 // Inhabited pavement joins the office, home and transport stop into one district.
 box(22.4,.8,-.028,13.6,18.2,.025,'#98957e',urban);
 box(23.2,8.2,-.02,10.4,9.4,.022,'#a7a18b',urban);
 // Tiled civic courtyard and canal edge around the city workplace eliminate bare ground.
 for(let x=23.5;x<32.5;x+=1.5)for(let z=1.4;z<7;z+=1.4)box(x,z,-.01,1.35,1.25,.012,(x+z)%2?'#b5ae98':'#aba38c',urban);
 box(22.8,1,-.015,1.4,5.4,.025,'#648688',urban);box(22.75,.95,.01,1.5,.12,.18,'#9d947e',urban);box(22.75,6.3,.01,1.5,.12,.18,'#9d947e',urban);
 for(const b of [...CITY_BLOCKS,{x:23.2,z:2.2,w:1.3,d:2.6,h:2.8},{x:30.6,z:2.4,w:1.6,d:2.8,h:3.1},{x:32.3,z:8.8,w:1.4,d:3.4,h:2.7}]){
  box(b.x,b.z,0,b.w,b.d,b.h,'#c8bda1',urban);box(b.x-.05,b.z-.05,b.h,b.w+.1,b.d+.1,.12,'#8d8b78',urban);
  box(b.x+.14,b.z+b.d+.02,.15,Math.max(.4,b.w-.28),.035,.95,'#637b72',urban);
  for(let y=1.4;y<b.h;y+=.85){box(b.x+.12,b.z+b.d+.02,y,b.w-.24,.035,.5,'#7c9189',urban);box(b.x-.08,b.z+b.d,y-.12,b.w+.16,.35,.07,'#9c927b',urban);box(b.x-.08,b.z+b.d+.3,y-.05,b.w+.16,.035,.25,'#7e806e',urban);}
 }
 for(const [x,z]of [[24.2,1.6],[30.8,1.8],[32.8,6.2],[23.6,14.8]])tree(x,z,urban);
 // Stop faces the road; the seated waiting area stays outside the walking route.
 box(29.3,9,.02,1.3,.45,.4,'#9a896d',urban);box(29.15,8.9,1.8,1.6,.8,.07,'#879181',urban);for(const x of [29.2,30.6])box(x,9.5,0,.05,.05,1.8,'#6f7d6b',urban);
 box(30.9,9.2,0,.04,.04,1.5,'#6f7d6b',urban);box(30.76,9.2,1.3,.32,.04,.24,'#d8cfb5',urban);
 for(const x of [25.4,28.8]){box(x,15,.02,.35,.35,.3,'#a68161',urban);round(x+.17,15.17,.55,.23,'#657d5d',1,1,1,urban);}
 for(const x of [30.1,30.65]){const wheel=new T.Mesh(new T.TorusGeometry(.2,.025,5,18),illustratedMaterial('#46574e'));wheel.position.set(x,.23,12.7);urban.add(wheel);}box(30.1,12.68,.35,.55,.035,.035,'#8c8068',urban);
 registerBuilding(urban);
 // Ground and road are contiguous with the existing neighbourhood, not islands.
 box(-11,2,-.015,7,7,.025,'#899273',west);box(-11,6.8,-.015,9,1.6,.025,'#899273',west);box(-11,7,.02,9,1.1,.02,'#bcb7a5',west);
 box(15,6.8,-.015,20,2.7,.025,'#899273',east);box(15,7,.02,20,1.1,.02,'#bcb7a5',east);box(31.2,7,-.015,1.8,8.4,.025,'#899273',east);box(31.5,7,.02,1.1,8.4,.02,'#bcb7a5',east);box(28.5,13.5,-.015,4.5,1.8,.025,'#899273',east);box(28.5,13.8,.02,4,1,.02,'#bcb7a5',east);
 for(const [group,start,end]of [[west,-11,-2],[east,15,35]])for(let x=start;x<end;x+=1.5)box(x,7.54,.05,.6,.04,.01,'#e7e0cf',group);
 function plant(x,z,group){box(x-.13,z-.13,.16,.26,.26,.25,'#a2765c',group);round(x,z,.6,.2,'#5a7357',1,1.25,1,group);}
 function streetlamp(x,z,group){box(x,z,0,.06,.06,2,'#6d7566',group);box(x-.12,z-.08,1.9,.3,.22,.12,'#dacaa7',group);}
 for(const [group,xs]of [[west,[-11,-4]],[east,[16,23,30,34]]])for(const x of xs){tree(x,8.7,group);streetlamp(x+.45,8.4,group);}
 for(const room of Object.values(RESIDENCES).filter(r=>r.id!=='family')){
  const group=new T.Group();scene.add(group);rooms.set(room.id,group);const [x,z]=room.base;
  box(x-.6,z-.6,-.015,5.2,5.2,.025,'#899273',group);
  box(x,z,0,4,3.6,.16,'#aa9472',group);for(let a=x;a<x+4;a+=.25)box(a,z,.162,.008,3.6,.004,'#8e7b5f',group);
  const ramp=new T.BufferGeometry();ramp.setAttribute('position',new T.Float32BufferAttribute([x,.16,z+3.6,x+4,.16,z+3.6,x+4,0,z+4.2,x,0,z+4.2],3));ramp.setIndex([0,2,1,0,3,2]);ramp.computeVertexNormals();const rampMesh=new T.Mesh(ramp,illustratedMaterial('#aa9472'));rampMesh.receiveShadow=true;group.add(rampMesh);
  box(x,z,.16,4,.1,2.2,'#e5d9b9',group);box(x,z,.16,.1,3.6,2.2,'#d7caab',group);
  box(x+1,z+.11,.85,1.6,.03,.95,'#829a92',group);box(x+1.78,z+.15,.85,.035,.02,.95,'#d4d0b9',group);
  for(const a of [.92,2.6])box(x+a,z+.18,.8,.12,.04,1.08,'#b9aa85',group);
  const [bed,sofa,desk]=roomFurniture(room);
  box(bed.x,bed.y,.16,bed.w,bed.d,.35,'#7d6951',group);box(bed.x+.04,bed.y+.04,.51,bed.w-.08,bed.d-.08,.13,'#dfdcc9',group);box(bed.x+.04,bed.y+.6,.65,bed.w-.08,bed.d-.65,.04,'#789083',group);box(bed.x+.14,bed.y+.1,.66,.8,.3,.1,'#eee7d6',group);
  // Sofa occupies the former crib footprint; the same route clearance applies.
  box(sofa.x,sofa.y,.16,sofa.w,sofa.d,.38,'#8b9b89',group);box(sofa.x,sofa.y,.54,sofa.w,.13,.4,'#788a77',group);
  box(desk.x,desk.y,.16,desk.w,desk.d,.65,'#8c795e',group);box(desk.x+.08,desk.y+.1,.82,.32,.24,.02,'#e8e0ce',group);
  chair(...room.origin,0,.16,group);chair(x+3.35,z+1.95,Math.PI,.16,group);
  box(x+.15,z+.18,.16,.55,.22,1.15,'#8c795e',group);for(let a=0;a<4;a++)box(x+.18+a*.1,z+.2,.75,.06,.16,.35,'#7d8b7a',group);
  plant(x+2.7,z+.35,group);label(x+1.8,z+4.5,.1,room.label,group);registerBuilding(group);
 }
 // A sheltered city workplace: actual desk/chair coordinates match the routine.
 box(24.4,2.4,-.015,6.2,4.6,.025,'#899273',city);
 box(25,3,0,5,2.2,.14,'#a99b81',city);box(25,3,.14,5,.12,2.4,'#d7d2bd',city);box(25,3,.14,.12,2.2,2.4,'#c9c5ae',city);
 for(let x=25.4;x<29.6;x+=.8){box(x,3.13,.8,.55,.025,.95,'#6f8b85',city);box(x+.25,3.16,.8,.025,.02,.95,'#d4d0bd',city);}
 box(25,3.05,2.55,5,1.2,.1,'#8f7764',city);label(28.8,5.5,.1,'City work district',city);
 table(26.9,6.15,.75,city);const workChair=chair(27.3,5.8,0,0,city);
 const laptop=new T.Group();city.add(laptop);box(27.06,6.2,.85,.34,.23,.025,'#536760',laptop);box(27.06,6.4,.87,.34,.025,.23,'#526a66',laptop);
 const workpiece=box(27.08,6.24,.85,.3,.18,.08,'#bea37a',city);plant(29.4,4.7,city);
 registerBuilding(city);
 // A workstation roof owns its cutaway separately from walls/ground/labels.
 // Seated heads can sit just outside a narrow ray at the roof's leading edge.
 const canopy=new T.Group();city.add(canopy);canopy.userData.cutawayBounds={x:25.9,z:5.05,w:2.8,d:1.8};
 box(25.9,5.05,2.35,2.8,1.8,.1,'#92836c',canopy);for(const x of [25.9,28.65])box(x,6.7,0,.06,.06,2.35,'#8b7e65',canopy);registerBuilding(canopy);
 // A small public garden gives the independent neighbourhood a usable edge.
 box(18.7,9.3,-.015,4.6,4,.025,'#899273',east);box(19.5,8,.02,.65,2.5,.02,'#bcb7a5',east);box(19,10,.02,4,2.5,.02,'#7d9270',east);box(19.1,11,.05,2.5,.4,.35,'#ac9a78',east);for(const x of [19.5,22])tree(x,12.7,east);
 return {rooms,city,canopy,urban,update(state,age){const revealed=revealedPlaces(state,age);for(const[id,group]of rooms)group.visible=revealed.homes.has(id);city.visible=revealed.city;urban.visible=revealed.city;west.visible=revealed.homes.has('far');east.visible=revealed.city||revealed.homes.has('nearLocal');const manual=state.history?.filter(r=>(r.from??r.age)<=age).at(-1)?.pathway==='vocational';workChair.visible=!manual;laptop.visible=!manual;workpiece.visible=manual;}};
}
