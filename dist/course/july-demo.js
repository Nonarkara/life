import {JULY_EPISODE} from './crisis-chapter.js';
import {enableLifeEvents} from './life-events.js';
import {applyPivot,pendingPivots} from './pivots.js';
import {begin,live} from './sim.js';
import {playerSlotBirth} from './taste-engine.js';

// Keep the episode's save, checkpoints and recovery separate from ordinary lives.
export function julyDemoStorage(storage){
 if(!storage)return null;
 const key=name=>JULY_EPISODE+':'+name;
 return {
  getItem:name=>storage.getItem(key(name)),
  setItem:(name,value)=>storage.setItem(key(name),value),
  removeItem:name=>storage.removeItem(key(name))
 };
}

export function julyDemoStart(){
 let state=begin(enableLifeEvents(playerSlotBirth(4)));
 // The authored childhood is processed by the same simulator as a full life.
 // Incidental encounters before the first playable scene pass unanswered.
 for(const [id,choice] of [['parent-language','learn'],['school-leave','stay']]){
  const pivot=pendingPivots(state).find(p=>p.id===id);
  if(pivot)state=applyPivot(state,pivot,choice);
  state=live(state);
  state={...state,story:{...state.story,pending:null}};
 }
 return {...state,episode:JULY_EPISODE,pathway:'work',effort:{physique:1,iq:3,eq:0,craft:2,drive:4}};
}
