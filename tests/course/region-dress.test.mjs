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
import {townPlan} from '../../dist/course/diorama-plan.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
// Isan, the East and the South lay their towns out mirrored; the North, the West, Central and Bangkok do not.
test('Isan, the East and the South mirror the board, and no other region does',()=>{
 const mirror=id=>{let s,seed=7;do s=begin(configureLife(newLife(seed++),{class:REGIONS[id].class[0],sex:'male',birthYear:1975,region:id}));while(s.birth.moves);return townPlan({...s,age:20},20).mirror;};
 for(const id of ['khon-kaen','udon-thani','chanthaburi','phuket'])assert.equal(mirror(id),true,id);
 for(const id of ['chiang-mai','kanchanaburi','nakhon-pathom','pathum-wan','khlong-toei'])assert.equal(mirror(id),false,id);
});
