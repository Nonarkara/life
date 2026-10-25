import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createCharacter} from '../../dist/course/character3d.js';
import {obscuringBuildings} from '../../dist/course/scene3d.js';

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
