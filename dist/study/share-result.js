import {MOVE_TARGETS} from '../course/regions.js';
// Real deterministic life transitions, isolated from player saves and the lives archive.
import {dailyLife} from '../course/birthcode.js';
import {begin,live,configureLife,newLife,validate} from '../course/sim.js';
import {choiceAvailable,setRegion,setHousing} from '../course/finance.js';
import {encounterById,resolveEncounter} from '../course/encounters.js';
import {pendingPivots,openOptions,applyPivot} from '../course/pivots.js';
import {renderEnding} from '../course/ending.js';
import {initSettings,localise} from '../course/i18n.js';
const root=document.querySelector('#result'),pick=document.querySelector('#sample');
function finish(mode){let state=begin(mode==='daily'?{...dailyLife('2026-10-30'),dailyDay:'2026-10-30'}:configureLife(newLife(777),{}));
 for(let i=0;i<200&&state.stage!=='recap';i++){
  if(state.story?.pending){const e=encounterById(state.story.pending.id);state=resolveEncounter(state,e.options.find(o=>choiceAvailable(state,o)).id,.2);continue;}
  const q=pendingPivots(state)[0];if(q){state=applyPivot(state,q,openOptions(q,state)[0].id);continue;}
  if(mode==='travel'&&state.age>=20){state=setHousing(setRegion(state,MOVE_TARGETS[(state.age-20)/5%MOVE_TARGETS.length]),'far');}
  const next=live(state);if(next===state)throw Error('Fixture cannot advance');state=next;
 }if(!validate(state))throw Error('Invalid fixture');if(state.stage!=='recap')throw Error('Fixture did not finish');return state;}
function render(){root.replaceChildren();renderEnding(root,finish(pick.value),{storage:null});localise(root);}
pick.onchange=render;window.addEventListener('life-preferences',render);initSettings();render();
