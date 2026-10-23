import test from 'node:test';import assert from 'node:assert/strict';
import {rememberedMoments} from '../../dist/course/recap.js';
import {translate} from '../../dist/course/i18n.js';
test('remembered moments remove routine repetition, keep shocks and named outcomes once, and preserve the saved record',()=>{
 const outcome='You and Mali found time for each other. A friendship began.';
 const state={history:[{age:10,event:'Childhood.'},{age:15,event:'An ordinary five years. Small habits accumulate. '+outcome},{age:20,event:'You continued school. Family support helped with books and travel.'},{age:30,event:'Floodwater damages the family home. Repairs take money and time. An apprenticeship paid a little while you learned through work.'}],story:{seen:[{age:15,outcome}]}};
 const before=JSON.stringify(state),result=rememberedMoments(state);
 assert.deepEqual(result,[{age:15,text:outcome},{age:30,text:'Floodwater damages the family home. Repairs take money and time.'}]);assert.equal(JSON.stringify(state),before);
});
test('legacy histories retain exceptional events without inventing relationships',()=>{
 assert.deepEqual(rememberedMoments({history:[{age:40,event:'A work interruption reduces the household buffer.'}]}),[{age:40,text:'A work interruption reduces the household buffer.'}]);
 for(const language of ['th','zh-CN','ja','ko'])for(const label of ['Moments that stayed','Every five-year decision'])assert.notEqual(translate(label,language),label);
});
