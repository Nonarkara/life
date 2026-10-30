import {test} from 'node:test';import assert from 'node:assert/strict';
import {greyHair,greyLevel} from '../../dist/course/aging.js';
// A 40x100 figure: a thick dark crown, a pale face with two thin dark eyes, dark shoes at the bottom.
const figure=()=>{const w=40,h=100,p=new Uint8ClampedArray(w*h*4);
 const set=(x,y,r,g,b)=>{const i=(y*w+x)*4;p[i]=r;p[i+1]=g;p[i+2]=b;p[i+3]=255;};
 for(let y=0;y<h;y++)for(let x=8;x<32;x++)set(x,y,200,170,140);
 for(let y=0;y<10;y++)for(let x=8;x<32;x++)set(x,y,25,25,28);
 for(let x=14;x<17;x++)set(x,14,20,20,20);for(let x=24;x<27;x++)set(x,14,20,20,20);
 for(let y=94;y<100;y++)for(let x=8;x<32;x++)set(x,y,30,30,30);
 return {p,w,h};};
test('hair greys from forty; eyes and shoes stay as drawn',()=>{
 assert.deepEqual([35,39,40,46,52,58,70].map(greyLevel),[0,0,1,2,3,4,4]);
 const {p,w,h}=figure();assert.equal(greyHair(p,w,h,0),0);
 const young=figure();greyHair(young.p,w,h,4);
 const px=(f,x,y)=>f.p[(y*w+x)*4];
 assert.ok(px(young,20,4)>100,'crown is grey');assert.ok(px(young,15,14)<40,'eye untouched');assert.ok(px(young,20,96)<40,'shoes untouched');
 const mid=figure();greyHair(mid.p,w,h,1);assert.ok(px(mid,20,4)>px(figure(),20,4)&&px(mid,20,4)<px(young,20,4),'greying grows with age');
});
