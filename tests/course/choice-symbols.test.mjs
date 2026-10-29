import test from 'node:test';import assert from 'node:assert/strict';
import {PIVOTS} from '../../dist/course/pivots.js';
import {choiceSymbolKey,SYMBOL_PATHS,STATION_SYMBOLS} from '../../dist/course/choice-symbols.js';
test('each station alternative has a specific authored action drawing, independent of option filtering',()=>{
 for(const pivot of PIVOTS){assert.equal(STATION_SYMBOLS[pivot.id].length,pivot.options.length);for(const option of pivot.options){const key=choiceSymbolKey(option,{pivot});assert.ok(SYMBOL_PATHS[key]);}}
});
test('an unaffordable purchase cannot make the remaining rent option inherit a house symbol',()=>{
 const p=PIVOTS.find(p=>p.id==='buy-house');assert.equal(choiceSymbolKey(p.options.find(o=>o.id==='rent'),{pivot:p}),'money');
});
test('encounter symbols use recorded effects and do not infer outcomes from translated prose',()=>{
 assert.equal(choiceSymbolKey({label:'anything',skills:{iq:1}}),'book');assert.equal(choiceSymbolKey({cash:-300}),'money');assert.equal(choiceSymbolKey({effects:{health:2}}),'care');assert.equal(choiceSymbolKey({label:'continue'}),'split');
});

import {describePaintedScene} from '../../dist/course/stage2d.js';
import {newLife,begin} from '../../dist/course/sim.js';
test('wooden-home staging uses the clear front floor and a door-calibrated human height',()=>{
 const state=begin(newLife(31)),scene=describePaintedScene(state,15,0);
 assert.equal(scene.set,'home');assert.ok(scene.room);
 assert.ok(scene.stage.ground>.9,'feet must be below the painted tabletop and its legs');
 assert.ok(scene.stage.scale>.45&&scene.stage.scale<.7,'standing adult must relate to the room door, not toy scale');
});
test('homework body and portable desk keep human scale in the clear bedroom floor',()=>{
 const state=begin(newLife(31)),scene=describePaintedScene(state,17,49);
 assert.equal(scene.set,'bedroom');assert.ok(scene.room);assert.ok(scene.stage.scale>.45);assert.ok(scene.stage.ground>.9);
});
