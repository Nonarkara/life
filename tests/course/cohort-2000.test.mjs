import test from 'node:test';
import assert from 'node:assert/strict';
import {newLife,configureLife,validate} from '../../dist/course/sim.js';
import {encodeBirth,decodeBirth} from '../../dist/course/birthcode.js';
import {DEFAULT_COHORT_YEARS,calendarYearAt} from '../../dist/course/thai-history.js';
test('approved cohorts retain 2000 through save validation and shared birth codes',()=>{
 assert.deepEqual(DEFAULT_COHORT_YEARS,[1949,1981,2000]);
 for(const year of DEFAULT_COHORT_YEARS){const life=configureLife(newLife(100),{sex:'female',class:'working_class',birthYear:year});assert.ok(validate(life));const replay=decodeBirth(encodeBirth(life));assert.ok(replay);assert.equal(replay.intake.birthYear,year);assert.equal(calendarYearAt(replay,20),year+20);}
});
