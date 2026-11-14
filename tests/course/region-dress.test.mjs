import test from 'node:test';
import assert from 'node:assert/strict';
import {palette} from '../../dist/course/diorama-plan.js';
import {REGIONS} from '../../dist/course/regions.js';
// Review after review found every province the same town. Each region now dresses the shared board in
// its own walls, roofs, road and ground; this fails if two regions fall back to one dress.
test('each region of Thailand dresses its towns differently',()=>{
 const one=['chiang-mai','khon-kaen','chanthaburi','kanchanaburi','phuket','nakhon-pathom'];
 const looks=one.map(id=>{const p=palette(REGIONS[id].style,REGIONS[id],7);return [p.roofs[0].slice(0,4),p.road,p.ground].join();});
 assert.equal(new Set(looks).size,one.length,looks.join(' | '));
 assert.equal(palette('market',REGIONS['chiang-mai'],7).pickup,'#a8322a','Chiang Mai keeps its red songthaew');
});
