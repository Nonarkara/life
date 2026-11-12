import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {redress} from '../../dist/course/aging.js';
// The shipped player sheets all wear the same mustard shirt; a life must wear its own colours.
const px=(...rgb)=>Uint8ClampedArray.from([...rgb,255]);
test('the painted mustard shirt and olive trousers take the life\'s colours, skin and shoes stay',()=>{
 const shirt=px(214,160,62),pants=px(110,112,70),skin=px(230,190,160),shoe=px(235,232,220),hair=px(30,28,26);
 for(const p of [shirt,pants,skin,shoe,hair])redress(p,'#3f5a7a','#2f3a4c');
 assert.ok(shirt[2]>shirt[0],'shirt now blue: '+shirt);
 assert.ok(pants[2]>pants[0],'trousers now navy: '+pants);
 assert.deepEqual([...skin],[230,190,160,255]);assert.deepEqual([...shoe],[235,232,220,255]);assert.deepEqual([...hair],[30,28,26,255]);
});
test('every painted player sprite goes through the redress',()=>{
 const src=readFileSync(new URL('../../dist/course/stage2d.js',import.meta.url),'utf8');
 assert.match(src,/redressedImage\(agedImage\(raw,age\),dress\.top,dress\.bottom\)/);
});
// Falsifiers, measured on the shipped sheets: the painter's lit shade inside a band misses the
// band's hue/saturation window and used to survive as a gold fleck; the second edge pass used to
// drag a prop beside the sleeve in with it. Synthetic pixels only — no art decoding.
const sheet=(...cols)=>{const p=new Uint8ClampedArray(cols.length*4);cols.forEach((c,i)=>p.set(c,i*4));return p;};
const rgb=(p,i)=>[p[i*4],p[i*4+1],p[i*4+2]];
const clear=Uint8ClampedArray.from([0,0,0,0]);
test('the lit shade on the shirt takes the colour, the skin, prop and pale wood beside it do not',()=>{
 // 3x3, shirt in the middle: highlight above, skin left, green prop right, wood below.
 const row=sheet(clear,px(214,175,100),clear, px(230,190,160),px(214,160,62),px(150,161,97), clear,px(190,165,125),clear);
 redress(row,'#3f5a7a','#2f3a4c',3);
 assert.ok(rgb(row,1)[2]>rgb(row,1)[0],'shirt highlight repainted blue: '+rgb(row,1));
 assert.deepEqual(rgb(row,5),[150,161,97],'the green prop beside the sleeve keeps its colour');
 assert.deepEqual(rgb(row,3),[230,190,160],'the skin beside the sleeve keeps its colour');
 assert.deepEqual(rgb(row,7),[190,165,125],'the pale wood keeps its colour (the blue ceiling holds)');
 assert.ok(rgb(row,4)[2]>rgb(row,4)[0],'the shirt band itself repainted: '+rgb(row,4));
});
test('the lit shade on the trousers takes the colour too',()=>{
 const row=sheet(px(110,112,70),px(165,170,115));
 redress(row,'#3f5a7a','#2f3a4c',2);
 assert.ok(rgb(row,1)[2]>rgb(row,1)[0],'trouser highlight repainted navy: '+rgb(row,1));
 assert.ok(rgb(row,0)[2]>rgb(row,0)[0],'the trouser band itself repainted: '+rgb(row,0));
});
