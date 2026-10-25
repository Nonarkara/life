import {test} from 'node:test';import assert from 'node:assert/strict';
import {createCharacter} from '../../dist/course/character3d.js';
const transform=root=>{root.updateMatrixWorld(true);const out=[];root.traverse(o=>out.push([...o.matrixWorld.elements]));return out;};
test('redrawing the same pose and clock cannot change actor transforms',()=>{
 const actor=createCharacter(),a={x:3,y:4,dx:1,dy:0,distance:1.2,moving:true,pose:'walk'};
 actor.update(a,30,25);const one=transform(actor.root);actor.update(a,30,25);assert.deepEqual(transform(actor.root),one);
});
test('walk stride follows distance and child seating reaches the same supported seat height',()=>{
 const actor=createCharacter(),a={x:0,y:0,dx:1,dy:0,distance:1.2,moving:true,pose:'walk'};
 actor.update(a,30,3);const one=transform(actor.root);actor.update(a,30,45);assert.deepEqual(transform(actor.root),one);
 const seat={...a,moving:false,pose:'rest'};actor.update(seat,30,25,{scale:1});const adult=(actor.root.children[0].position.y+.84)*actor.root.scale.y;
 actor.update(seat,5,25,{scale:.6});const child=(actor.root.children[0].position.y+.84)*actor.root.scale.y;assert.ok(Math.abs(adult-child)<.001);
});
