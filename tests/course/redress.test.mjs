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
