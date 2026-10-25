import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createCharacter} from '../../dist/course/character3d.js';
import {obscuringBuildings,cameraSpan,applyCutaway} from '../../dist/course/scene3d.js';
import {createDistricts,revealedPlaces,floorAt,overlappingReaderWidth} from '../../dist/course/district3d.js';
import {RESIDENCES} from '../../dist/course/locations.js';

test('orthographic cutaways find an off-centre child behind a building and ignore hidden growth',()=>{
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-10,10,10,-10,.1,100);
 camera.position.set(12,18,12);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);
 const child=createCharacter();child.update({x:-4,y:3,moving:false,pose:'study'},6,25,{scale:.6});scene.add(child.root);scene.updateMatrixWorld(true);
 const head=child.anchors.head.getWorldPosition(new T.Vector3());
 const group=new T.Group();group.userData.building=true;scene.add(group);
 const wall=new T.Mesh(new T.BoxGeometry(.5,.5,.5),new T.MeshBasicMaterial());
 wall.position.copy(head).addScaledVector(camera.getWorldDirection(new T.Vector3()),-4);group.add(wall);scene.updateMatrixWorld(true);
 assert.ok(obscuringBuildings(camera,[child.anchors.head],[group]).has(group));
 // The former perspective-style ray misses this genuine orthographic occluder.
 const wrong=new T.Raycaster(camera.position,head.clone().sub(camera.position).normalize(),0,camera.position.distanceTo(head));
 assert.equal(wrong.intersectObject(group,true).length,0);
 group.visible=false;assert.equal(obscuringBuildings(camera,[child.anchors.head],[group]).size,0);
 wall.geometry.dispose();wall.material.dispose();
});
test('camera reserves only actual canvas-reader overlap, never an adjacent column',()=>{
 const canvas={left:0,right:900,top:50,bottom:650};
 assert.equal(overlappingReaderWidth(canvas,{left:900,right:1260,top:50,bottom:650}),0);
 assert.equal(overlappingReaderWidth(canvas,{left:640,right:1000,top:50,bottom:650}),260);
 assert.equal(overlappingReaderWidth(canvas,{left:0,right:900,top:650,bottom:900}),0);
});
test('cutaway invalidates the opaque shader exactly on entering and leaving transparency',()=>{
 const material=new T.MeshStandardMaterial(),base={material,opacity:1,transparent:false,depthWrite:true},initial=material.version;
 applyCutaway(base,false);assert.equal(material.version,initial);
 applyCutaway(base,true);assert.equal(material.version,initial+1);assert.equal(material.transparent,true);assert.equal(material.depthWrite,false);assert.equal(material.opacity,.14);
 applyCutaway(base,true);assert.equal(material.version,initial+1);
 applyCutaway(base,false);assert.equal(material.version,initial+2);assert.equal(material.transparent,false);assert.equal(material.depthWrite,true);assert.equal(material.opacity,1);
 applyCutaway(base,false);assert.equal(material.version,initial+2);material.dispose();
});
test('adult camera preserves a legible human scale and joins school/adult spans continuously',()=>{
 assert.equal(cameraSpan(10),8.5);assert.equal(cameraSpan(20),9.8);assert.equal(cameraSpan(60),11);
 for(const age of [10,20])assert.ok(Math.abs(cameraSpan(age-.0001)-cameraSpan(age+.0001))<.0001);
 const span=cameraSpan(35),camera=new T.OrthographicCamera(-span,span,span/2,-span/2,.1,100);camera.position.set(12,18,12);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);const feet=new T.Vector3(0,0,0).project(camera),head=new T.Vector3(0,1.72,0).project(camera),projectedHeight=Math.abs(head.y-feet.y)*560/2;assert.ok(projectedHeight>=60&&projectedHeight<=70);assert.equal(cameraSpan(35,true),5);assert.equal(cameraSpan(0),3.5);
});
test('all home origins have supported floor and their ramps meet the street continuously',()=>{
 for(const room of Object.values(RESIDENCES)){const[x,z]=room.origin;assert.equal(floorAt(x,z),.16);assert.ok(Math.abs(floorAt(room.base[0]+3.75,room.base[1]+4.2))<1e-12);assert.ok(Math.abs(floorAt(room.base[0]+3.75,room.base[1]+3.9)-.08)<1e-10);}
 assert.equal(floorAt(27.3,5.8),0);
});
test('district revelation follows recorded/current adult residence and never invents childhood housing',()=>{
 const s={age:35,finance:{housing:'near',workplace:'city'},history:[{age:25,finance:{housing:'far',workplace:'local'}}]};
 assert.deepEqual([...revealedPlaces(s,12).homes],['family']);assert.equal(revealedPlaces(s,12).city,false);
 const r=revealedPlaces(s);assert.ok(r.homes.has('far'));assert.ok(r.homes.has('nearCity'));assert.equal(r.city,true);
});
test('independent room groups contain supported chairs and show only earned places',()=>{
 const scene=new T.Scene(),chairs=[];
 const box=(x,z,y,w,d,h,color,parent=scene)=>{const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshBasicMaterial({color}));mesh.position.set(x+w/2,y+h/2,z+d/2);parent.add(mesh);return mesh;};
 const chair=(x,z,angle=0,floor=0,parent=scene)=>{const g=new T.Group();g.position.set(x,floor,z);parent.add(g);chairs.push(g);return g;};
 const districts=createDistricts({scene,box,round:()=>{},chair,table:()=>{},tree:()=>{},label:()=>{},registerBuilding:g=>{g.userData.building=true;}});
 districts.update({age:35,finance:{housing:'far',workplace:'city'},history:[]},35);
 assert.equal(districts.rooms.get('far').visible,true);assert.equal(districts.rooms.get('nearLocal').visible,false);assert.equal(districts.city.visible,true);
 for(const r of Object.values(RESIDENCES).filter(r=>r.id!=='family'))assert.ok(chairs.some(c=>c.position.x===r.origin[0]&&c.position.z===r.origin[1]&&c.position.y===.16));
 scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
});
test('actual city canopy cuts away above seated work at portrait-tablet camera and stays solid away from actor',()=>{
 const scene=new T.Scene(),groups=[];
 const box=(x,z,y,w,d,h,color,parent=scene)=>{const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color}));mesh.position.set(x+w/2,y+h/2,z+d/2);parent.add(mesh);return mesh;};
 const districts=createDistricts({scene,box,round(){},chair(){return new T.Group();},table(){},tree(){},label(){},registerBuilding(g){g.userData.building=true;groups.push(g);}});
 districts.update({age:35,finance:{housing:'near',workplace:'city'},history:[]},35);
 const actor=createCharacter();scene.add(actor.root);actor.update({x:27.3,y:5.8,moving:false,pose:'work'},35,26);
 const span=cameraSpan(35),camera=new T.OrthographicCamera(-span*820/816/2,span*820/816/2,span/2,-span/2,.1,100);camera.position.set(39.3,18.4,17.8);camera.lookAt(27.3,.4,5.8);scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 assert.ok(groups.includes(districts.canopy));assert.ok(obscuringBuildings(camera,Object.values(actor.anchors),groups).has(districts.canopy));
 actor.update({x:0,y:0,moving:false,pose:'rest'},35,26);scene.updateMatrixWorld(true);assert.equal(obscuringBuildings(camera,Object.values(actor.anchors),groups).has(districts.canopy),false);
 districts.city.visible=false;actor.update({x:27.3,y:5.8,moving:false,pose:'work'},35,26);scene.updateMatrixWorld(true);assert.equal(obscuringBuildings(camera,Object.values(actor.anchors),groups).has(districts.canopy),false);
 scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
});

test('illustrated figures settle turns without changing the authoritative walking position',()=>{
 const actor=createCharacter(),body=actor.root.children[0];
 actor.update({x:2,y:3,moving:true,pose:'walk',dx:1,dy:0,distance:0},35,0);
 assert.equal(body.rotation.y,Math.PI/2);
 actor.update({x:2.1,y:3,moving:true,pose:'walk',dx:0,dy:1,distance:.1},35,.05);
 assert.ok(body.rotation.y>0&&body.rotation.y<Math.PI/2);assert.equal(actor.root.position.x,2.1);assert.equal(actor.root.position.z,3);
 actor.update({x:2.1,y:3,moving:false,pose:'rest',facing:0},35,100);
 assert.equal(body.rotation.y,0);actor.root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
});
