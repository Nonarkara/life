import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createStudio,hop,GLIDE_MS} from '../../dist/course/studio3d.js';
// The studio glide: a hop across Bangkok is shorter than a trip up-country, which is shorter than going
// overseas; a glide ends where the new set is, and staying put never glides.
test('distance on the studio floor grows with how far a life goes',()=>{
 assert.ok(hop('khlong-toei','sukhumvit')<hop('sukhumvit','udon-thani'));
 assert.ok(hop('sukhumvit','udon-thani')<hop('pak-phanang','london'));
});
test('a glide starts at the old set and lands on the new one',()=>{
 const studio=createStudio(new T.Scene());
 assert.equal(studio.leave('hua-hin','hua-hin'),false);
 assert.equal(studio.leave('hua-hin','udon-thani'),true);
 const start=performance.now(),first=studio.step(start);
 assert.ok(Math.hypot(first.dx,first.dz)>hop('hua-hin','udon-thani')*.99);
 assert.equal(studio.step(start+GLIDE_MS+1),null);assert.equal(studio.travelling,false);
});
