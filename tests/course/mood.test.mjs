import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lifeMoodAt} from '../../dist/course/events.js';
test('world mood cannot leak a future setback during an animated chapter',()=>{
 const state={history:[{age:25,health:90,wellbeing:60,cash:20000},{age:30,health:90,wellbeing:60,cash:20000},{age:35,health:30,wellbeing:20,cash:0}]};
 assert.equal(lifeMoodAt(state,30.5),'steady');assert.equal(lifeMoodAt(state,35),'difficult');
});
