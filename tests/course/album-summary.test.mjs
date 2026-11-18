import test from 'node:test';
import assert from 'node:assert/strict';
import {albumSummary} from '../../dist/course/album-summary.js';
import {matchingTurn} from '../../dist/course/life-notebook.js';
import {configureLife,newLife} from '../../dist/course/sim.js';
import {encodeBirth} from '../../dist/course/birthcode.js';

test('a collected activity appears once with exact days, cash and date range',()=>{
 const album={version:1,entries:[
  {label:'School education',from:10,to:20},
  {label:'Spend a day at the library',from:16,to:16,days:1,cost:0},
  {label:'Spend a day at the library',from:21,to:21,days:1,cost:0},
  {label:'Take an art course',from:25,to:25,days:3,cost:900},
  {label:'Take an art course',from:30,to:30,days:3,cost:900},
  {label:'The sea at Hua Hin',from:35,to:35},
  {label:'Marriage',from:30,to:30}
 ],notes:[{age:35,title:'A field note',text:'Only from this life.'}]};
 const before=JSON.stringify(album),r=albumSummary(album);
 assert.deepEqual(r.activities.find(e=>e.label==='Take an art course'),{label:'Take an art course',count:2,days:6,cost:1800,from:25,to:30});
 assert.equal(r.activities.find(e=>e.label==='Spend a day at the library').count,2);
 assert.equal(r.periods.length,1);assert.equal(r.journeys.length,1);assert.equal(r.notes.length,1);
 assert.equal(JSON.stringify(album),before,'summary does not alter retained receipts');
});

test('a replay fork must belong to this exact birth, not only its seed',()=>{
 const a=configureLife(newLife(123),{class:'middle_class',sex:'female',birthYear:1981});
 const b=configureLife(newLife(123),{class:'working_class',sex:'male',birthYear:1949});
 const pointA={id:'a',state:a},pointB={id:'b',state:b};
 assert.notEqual(encodeBirth(a),encodeBirth(b));
 assert.equal(matchingTurn({code:encodeBirth(a),age:80},[pointB,pointA]),pointA);
 assert.equal(matchingTurn({code:encodeBirth(a),age:80},[pointB]),null);
 assert.equal(matchingTurn({code:encodeBirth(a),age:20},[{...pointA,state:{...a,age:30}}]),null,'do not place a later run’s future fork inside this earlier-ended life');
});

test('missing albums produce no invented mementos or field notes',()=>{
 assert.deepEqual(albumSummary(undefined),{activities:[],periods:[],journeys:[],notes:[]});
});

test('bookmarks retain their decision id and recover it from older stored keys',async()=>{
 const {keepTurningPoint,readTurningPoints,turningPointScene}=await import('../../dist/course/turning-points.js');
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 const state={...configureLife(newLife(123),{class:'middle_class',birthYear:1981}),stage:'review',age:15};
 keepTurningPoint(storage,state,{scene:'school-apprentice',title:'School or work?',answer:'Continue school',met:[]});
 const point=readTurningPoints(storage)[0];assert.equal(point.scene,'school-apprentice');assert.equal(turningPointScene(point),'school-apprentice');
 const old={...point};delete old.scene;assert.equal(turningPointScene(old),'school-apprentice');
 assert.equal(turningPointScene(null),null);assert.equal(turningPointScene({...old,id:'unrelated'}),null);
});
