import assert from 'node:assert/strict';
import {test} from 'node:test';
import {begin,configureLife,live,newLife,validate} from '../../dist/course/sim.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {routeOf} from '../../dist/course/life-routes.js';
import {regionAt} from '../../dist/course/regions.js';
import {townPlan} from '../../dist/course/diorama-plan.js';
import {routeModel} from '../../dist/course/routemap.js';

const settle=s=>s.story.pending?resolveEncounter(s,encounterById(s.story.pending.id).options[0].id,.5):s;
test('choosing college can earn a scholarship and different answers move the actual world',()=>{
 const births=Array.from({length:30},(_,i)=>configureLife(newLife(i+1),{class:'middle_class',birthYear:1981,region:'bang-na'}));
 const birth=births.find(s=>!routeOf(s));
 assert.ok(birth);
 let station=settle(begin(birth));
 while(station.age<20)station=settle(live(station));
 const career=live({...station,pathway:'work'});
 const scholar=live({...station,pathway:'college'});
 assert.equal(scholar.story.pending?.id,'r_scholarship_kid_2');
 assert.notEqual(career.story.pending?.id,scholar.story.pending?.id);
 const bonded=resolveEncounter(scholar,'bond',.5),free=resolveEncounter(scholar,'free',.5);
 for(const [life,destination,style] of [[bonded,'london','brick'],[free,'boston','newengland']]){
  assert.ok(validate(JSON.parse(JSON.stringify(life))));
  assert.equal(regionAt(life,24),'bang-na');
  assert.equal(regionAt(life,25),destination);
  assert.equal(routeModel(life).at[25],destination);
  assert.equal(townPlan(life,25).style,style);
  const next=live(life);
  assert.equal(next.story.pending?.id,'r_scholarship_kid_3');
  assert.equal(next.history.at(-1).pathway,'college');
 }
 let s=settle(live(free));
 while(s.age<45&&s.stage==='review'&&s.story.pending?.id!=='r_scholarship_kid_4')s=live(settle(s));
 assert.equal(s.story.pending?.id,'r_scholarship_kid_4');
 const returned=resolveEncounter(s,'go',.5);
 assert.ok(validate(returned));
 assert.equal(regionAt(returned,s.age),'bang-na');
 assert.equal(regionAt(returned,s.age-1),'boston');
});
