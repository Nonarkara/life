import test from 'node:test';
import assert from 'node:assert/strict';
import {setFor,roleFor,ROLES,SETS,sheetFor,BEATS,beatFor} from '../../dist/course/stage2d.js';

// The stage is a drawing of what the routine already decided. These tests hold
// that line: the set follows the activity, and the drawing follows the pose.
test('a journey is its own drawing',()=>{
  assert.equal(setFor('Walking to school',true),'travel');
  assert.equal(setFor('Walking home',true),'travel');
});

test('each activity has its own painted place',()=>{
  assert.equal(setFor('At school',false),'school');
  assert.equal(setFor('At college',false),'school');
  assert.equal(setFor('At work',false),'work');
  assert.equal(setFor('Learning a trade',false),'shop');
  assert.equal(setFor('Tending the stall',false),'stall');
  assert.equal(setFor('Training',false),'court');
  assert.equal(setFor('Playing outside',false),'street');
  assert.equal(setFor('Making art',false),'home');
  assert.equal(setFor('Reading on the rug',false),'bedroom');
  assert.equal(setFor('Playing at home',false),'home');
  assert.equal(setFor('Breakfast at home',false),'home');
  assert.equal(setFor('Recovering at home',false),'bedroom');
  assert.equal(setFor('Reading by the lamp',false),'bedroom');
  assert.equal(setFor('Cooking dinner',false),'home');
});

test('a person is drawn by the age they are',()=>{
  assert.equal(sheetFor('player',8),'child');
  assert.equal(sheetFor('player',30),'player');
  assert.equal(sheetFor('player',70),'elder');
  assert.equal(sheetFor('mother',40),'mother');
  assert.equal(sheetFor('father',45),'father');
});

test('a moment of play becomes a drawing that exists',()=>{
  const cases=[['walk','player',30],['stand','player',30],['sit','player',30],['desk','player',30],
    ['paint','player',30],['kneel','player',30],['crouch','player',30],['walk','child',8],
    ['sit','child',8],['crouch','child',8],['walk','elder',70],['sit','elder',70],['kneel','elder',70],
    ['stand','mother',40],['cook','mother',40],['crouch','mother',40],['basket','mother',40],
    ['stand','father',45],['tool','father',45],['sit','father',45],['walk','father',45]];
  for(const[role,actor,age]of cases){
    const sheet=ROLES[sheetFor(actor,age)]?.[role];
    assert.ok(sheet,`${actor} at ${age} has no drawing for ${role}`);
    assert.ok(sheet[0].length&&sheet[1].length,`${actor} ${role} needs two drawings`);
  }
});

test('the pose decides the drawing, and motion always wins',()=>{
  assert.equal(roleFor('player',30,'study',false,'home'),'sit');
  assert.equal(roleFor('player',30,'study',false,'school'),'desk');
  assert.equal(roleFor('player',30,'eat',false,'home'),'stand');
  assert.equal(roleFor('player',30,'draw',false,'home'),'paint');
  assert.equal(roleFor('player',30,'garden',false,'garden'),'kneel');
  assert.equal(roleFor('player',30,'care',false,'home'),'crouch');
  assert.equal(roleFor('player',30,'study',true,'school'),'walk');
  assert.equal(roleFor('mother',40,'cook',false,'home'),'cook');
  assert.equal(roleFor('mother',40,'care',false,'home'),'crouch');
  assert.equal(roleFor('father',45,'work',false,'work'),'sit');
  assert.equal(roleFor('father',45,'work',false,'home'),'tool');
});

test('every set has a painted place and a floor to stand on',()=>{
  for(const[name,set]of Object.entries(SETS)){
    assert.ok(set.plate,'set '+name+' has no plate');
    assert.ok(set.ground>0&&set.ground<1,'set '+name+' has no ground line');
    assert.ok(set.scale>0&&set.scale<1,'set '+name+' has no figure scale');
    assert.ok(set.span[1]>set.span[0],'set '+name+' has no usable span');
  }
});

// A beat is a lived moment. It may only be drawn when the life records it,
// and the drawing it needs must exist.
const life=(over={})=>({story:{seen:[],flags:{}},pivots:[],history:[],...over});
const atSchool={action:'At school',moving:false,phase:'Daytime'};
const onTheWay={action:'Walking to school',moving:true,phase:'On the way'};
const evening={action:'Reading on the rug',moving:false,phase:'Evening'};

test('every beat names a plate, a floor and people who can be drawn',()=>{
  for(const[name,beat]of Object.entries(BEATS)){
    assert.ok(beat.plate,'beat '+name+' has no plate');
    assert.ok(beat.ground>0&&beat.ground<1,'beat '+name+' has no ground line');
    assert.ok(beat.actors.length,'beat '+name+' has nobody in it');
    for(const actor of beat.actors){
      const age=actor.anchor?30:16;
      const role=roleFor(actor.id,age,actor.pose,actor.pose==='ride',name);
      const sheet=ROLES[sheetFor(actor.id,age)]?.[role];
      assert.ok(sheet,`beat ${name} has no drawing for ${actor.id}/${actor.pose}`);
    }
  }
});

test('a life with no moments has no beats',()=>{
  assert.equal(beatFor(life(),16,atSchool),null);
  assert.equal(beatFor(life(),16,onTheWay),null);
  assert.equal(beatFor(life(),16,evening),null);
});

test('the fight is drawn only in the year it happened',()=>{
  const state=life({story:{seen:[],flags:{foughtBack:17}}});
  assert.equal(beatFor(state,17,onTheWay),'fight');
  assert.equal(beatFor(state,16,onTheWay),null);
  assert.equal(beatFor(state,19,onTheWay),null);
});

test('the bully is met in the corridor, and the report card in the classroom',()=>{
  const state=life({story:{seen:[{id:'bully',age:16}],flags:{}}});
  assert.equal(beatFor(state,16,atSchool),'bully');
  assert.equal(beatFor(state,16,onTheWay),null);
});

test('the questions decide whether the report card is good or bad',()=>{
  const studied=life({pivots:[{station:15,pivot:'school-apprentice',choice:'school'}]});
  const worked=life({pivots:[{station:15,pivot:'school-apprentice',choice:'apprentice'}]});
  assert.equal(beatFor(studied,16,atSchool),'grades');
  assert.equal(beatFor(worked,16,atSchool),'grades-bad');
  assert.equal(beatFor(studied,25,atSchool),null);
});

test('love is an evening, and the bicycles belong to the teenage years',()=>{
  const loved=life({story:{seen:[{id:'love',age:24}],flags:{dating:24}}});
  assert.equal(beatFor(loved,24,evening),'love');
  assert.equal(beatFor(loved,24,atSchool),null);
  const friends=life({story:{seen:[],flags:{friend:16}}});
  assert.equal(beatFor(friends,17,onTheWay),'bikes');
  assert.equal(beatFor(friends,30,onTheWay),null);
});

test('a body that is being repaired lies down in the evening',()=>{
  const hurt=life({history:[{event:'A health setback interrupted the year.'}]});
  assert.equal(beatFor(hurt,50,evening),'bed');
  assert.equal(beatFor(hurt,50,atSchool),null);
});

// A life is drawn as itself or not at all: the painted stage stands aside for any
// body, household or home the art does not have, and the 3D world draws that life.
test('the painted stage only draws lives its art covers',async()=>{
  const {castSheet,paintedCovers}=await import('../../dist/course/stage2d.js');
  const {prepareStageArt}=await import('../../dist/course/anime-assets.js');
  const {readFileSync}=await import('node:fs');
  const manifest=JSON.parse(readFileSync(new URL('../../dist/course/anime/manifest.json',import.meta.url)));
  globalThis.fetch=async()=>({ok:true,json:async()=>manifest});await prepareStageArt();
  const life=(sex,household,region)=>({age:20,intake:{sex},birth:{household,region},finance:undefined,history:[]});
  assert.equal(castSheet(life('male'),'player','player-bike'),'player-m-bike');
  assert.equal(castSheet(life('male'),'player','child-b'),'child-m-b');
  assert.equal(castSheet(life('female'),'player','elder'),'elder');
  assert.equal(castSheet(life('female','mothers'),'father','father'),'mother-b');
  assert.equal(castSheet(life('female','grandfather'),'mother','mother'),'grandmother');
  const has=sheet=>!!manifest.sprites[sheet];
  assert.equal(paintedCovers(life('female','parents','samut-prakan')),true,'the life the art was drawn for');
  assert.equal(paintedCovers({...life('female','parents','samut-prakan'),age:2}),false,'a baby is not drawn as a schoolgirl');
  assert.equal(paintedCovers(life('male','parents','samut-prakan')),has('player-m')&&has('child-m')&&has('elder-m'),'a man is drawn as a man or not at all');
  assert.equal(paintedCovers(life('female','fathers','samut-prakan')),has('father-b'));
  assert.equal(paintedCovers(life('female','parents','sukhumvit')),!!manifest.plates['home-day@villa'],'a walled villa is not drawn as a wooden house');
  assert.equal(paintedCovers(life('female','parents','tokyo')),!!manifest.plates['street-day@tokyo']);
});
