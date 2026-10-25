import {test} from 'node:test';import assert from 'node:assert/strict';
import {RESIDENCES,WORKPLACES,residenceAt,workplaceAt,roomFurniture} from '../../dist/course/locations.js';
import {routine,routineContext} from '../../dist/course/routines.js';
import {townGrowth,taskDesks} from '../../dist/course/layout.js';
import {setHousing,setWorkplace,advanceFinance,openFinance,validFinance,validFinanceLocation} from '../../dist/course/finance.js';
import {newLife,begin,live} from '../../dist/course/sim.js';
import {resolveEncounter,encounterById} from '../../dist/course/encounters.js';
import {revealedPlaces,CITY_BLOCKS} from '../../dist/course/district3d.js';
const state=(housing='far',workplace='city',age=35)=>({age,health:80,finance:{housing,workplace},history:[{age,pathway:'work',health:80,event:'Work continued.'}]});
test('legacy and childhood stay in family home; nearby rental follows current district',()=>{
 assert.equal(residenceAt({age:35}).id,'family');assert.equal(workplaceAt({age:35}).id,'local');
 assert.equal(residenceAt(state(),12).id,'family');assert.equal(residenceAt(state('near','city')).id,'nearCity');assert.equal(residenceAt(state('near','local')).id,'nearLocal');
 const s=state();s.history=[{age:20,finance:{housing:'near',workplace:'local'}},{age:25,finance:{housing:'near',workplace:'city'}}];
 assert.equal(residenceAt(s,20).id,'nearLocal');assert.equal(residenceAt(s,25).id,'nearCity');
});
test('independent city worker eats, travels, works and returns to their own home; parents do not move',()=>{
 const s=state(),c=routineContext(s),home=RESIDENCES.far.origin;
 for(const time of [4,54]){const r=routine('player',35,time,'art',c);assert.deepEqual([r.x,r.y],home);}
 const atWork=routine('player',35,26,'art',c);assert.deepEqual([atWork.x,atWork.y],WORKPLACES.city.destination);
 for(const actor of ['mother','father'])assert.deepEqual(routine(actor,35,4,'balance',c),routine(actor,35,4));
});
test('recovery and retirement use actual home origin; art stays inside the independent home',()=>{
 const s=state('near','city'),c=routineContext(s);c.recovering=true;
 assert.deepEqual([routine('player',35,26,'art',c).x,routine('player',35,26,'art',c).y],RESIDENCES.nearCity.origin);
 const retired=routineContext({...s,age:65,history:[{age:65,pathway:'work'}]});const evening=routine('player',65,54,'balance',retired);assert.deepEqual([evening.x,evening.y],RESIDENCES.nearCity.origin);
 c.recovering=false;c.pathway='independent';const artist=routine('player',35,26,'balance',c);assert.ok(artist.x>=25&&artist.x<=29&&artist.y>=10&&artist.y<=14);
});
test('every independent route clears all rooms, task desks and growing houses through a full day',()=>{
 const rooms=[...Object.values(RESIDENCES).flatMap(roomFurniture),...CITY_BLOCKS],desks=[...taskDesks,[26.9,6.15]].map(([x,y])=>({x:x-.04,y:y-.04,w:.83,d:.52}));
 for(const housing of ['family','far','near'])for(const workplace of ['local','city'])for(const age of [22,35,65])for(const pathway of ['school','college','vocational','work','independent'])for(let t=0;t<60;t+=.1){
  const s=state(housing,workplace,age);s.history[0].pathway=pathway;const r=routine('player',age,t,'balance',routineContext(s));
  for(const f of [...rooms,...desks])assert.ok(!(r.x+.08>f.x&&r.x-.08<f.x+f.w&&r.y+.08>f.y&&r.y-.08<f.y+f.d),`${housing}/${workplace}/${age}/${pathway}/${t} hits ${f.id??'desk'}`);
  for(const[from,x,y,w,d]of townGrowth)if(age>=from)assert.ok(!(r.x+.12>x&&r.x-.12<x+w&&r.y+.12>y&&r.y-.12<y+d));
 }
});
test('a move stays effective during the following animated period without leaking into the past',()=>{
 let s=live(begin(newLife(12)));if(s.story?.pending)s=resolveEncounter(s,encounterById(s.story.pending.id).options[0].id,.2);s=openFinance(s);
 s={...s,age:30,history:[...s.history,{...s.history.at(-1),age:30,pathway:'work',finance:{available:s.finance.available,reserve:0,debt:0,housing:'family',workplace:'local'}}]};
 const moved=setWorkplace(setHousing(s,'far'),'city'),raw={...moved,age:35,history:[...moved.history,{...moved.history.at(-1),age:35,from:30,pathway:'work',earnings:20000}]},next=advanceFinance(moved,raw),restored=JSON.parse(JSON.stringify(next));
 for(const game of [moved,next,restored]){
  assert.equal(residenceAt(game,30.1).id,'far');assert.equal(workplaceAt(game,30.1).id,'city');assert.equal(residenceAt(game,29).id,'family');assert.equal(workplaceAt(game,29).id,'local');
  assert.equal(revealedPlaces(game,29).homes.has('far'),false);assert.equal(revealedPlaces(game,29).city,false);assert.equal(revealedPlaces(game,30.1).city,true);
 }
 assert.ok(validFinance(restored.finance,35));assert.equal(restored.history.at(-1).finance.locationSince,30);
 assert.equal(validFinance({...restored.finance,locationSince:36},35),false);assert.equal(validFinanceLocation({locationSince:19},35),false);assert.equal(validFinanceLocation({locationSince:30.1},35),false);assert.equal(validFinanceLocation({locationSince:36},35),false);
 // A second change must preserve the earlier interval from its end snapshot.
 const second=setWorkplace(restored,'local');assert.equal(workplaceAt(second,32).id,'city');assert.equal(workplaceAt(second,35).id,'local');
});
test('legacy location has no assumed earlier move but gains an effective marker on the next period',()=>{
 const s={...state(),stage:'review',finance:{version:1,openedAt:15,available:0,reserve:0,debt:0,budget:{save:20,fun:10,learn:10},housing:'far',workplace:'city',receipts:[],purchases:[]},effort:{iq:2,craft:2},skills:{iq:0},wellbeing:50};
 assert.equal(residenceAt(s,34).id,'family');assert.equal(residenceAt(s,35).id,'far');assert.equal(revealedPlaces(s,34).city,false);
 const next=advanceFinance(s,{...s,age:40,history:[...s.history,{age:40,from:35,earnings:20000,pathway:'work'}]});
 assert.equal(next.finance.locationSince,35);assert.equal(residenceAt(next,35.1).id,'far');assert.equal(workplaceAt(next,35.1).id,'city');
});

test('committed period activity starts at from, while recovery waits for its actual completed event',()=>{const s={age:35,health:40,finance:{housing:'family'},history:[{age:30,from:25,pathway:'vocational',health:80,event:'Work'},{age:35,from:30,pathway:'work',health:40,event:'A health setback interrupts your plans.'}]};assert.equal(routineContext(s,29).pathway,'vocational');assert.equal(routineContext(s,30.1).pathway,'work');assert.equal(routineContext(s,30.1).recovering,false);assert.equal(routineContext(s,35).recovering,true);const draft={...s,age:30,pathway:'independent',history:s.history.slice(0,1)};assert.equal(routineContext(draft,30).pathway,'vocational');});
