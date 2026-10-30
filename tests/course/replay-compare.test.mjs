import {test} from 'node:test';import assert from 'node:assert/strict';
import {choiceAvailable} from '../../dist/course/finance.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {newLife,configureLife,begin,live,replay} from '../../dist/course/sim.js';
import {replayComparison} from '../../dist/course/replay-compare.js';
const play=(s,pick)=>{while(s.age<80&&s.stage==='review'){s=live(s);if(s.story?.pending){const o=encounterById(s.story.pending.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,o[Math.min(pick,o.length-1)].id,.2);}}return s;};
test('a replay compares to the last life and names where they first parted',()=>{
 assert.equal(replayComparison(begin(newLife(4))),null);
 const first=play(begin(configureLife(newLife(4),{})),0),second=play({...begin(replay(first)),previous:replay(first).previous},1),cmp=replayComparison(second);
 assert.ok(cmp&&cmp.rows.length>=4);assert.equal(cmp.rows[0][1],first.age);assert.equal(cmp.rows[0][2],second.age);
 assert.ok(cmp.split&&cmp.split.before!==cmp.split.now&&Number.isInteger(cmp.split.age));
 const same=replayComparison(play({...begin(replay(first)),previous:replay(first).previous},0));assert.equal(same.split,null);
});
