// Life 1.0: the life you would have had by not choosing.
//
// The same birth, the same world, the same shocks. Every five-year station is
// spent in the default shape, and no story decision is taken. That path is not
// a prediction and not a "normal" life — it is the counterfactual that lets a
// player see what their own choices moved, in numbers, at every station.
import {newLife,configureLife,begin,live,balanced,defaultProfile} from './sim.js';
import {createEconomy} from './economy.js';
import {newStory} from './encounters.js';

// The unchosen life, carried as far as the player's life has been carried.
export function unchosenLife(state,{upTo=state.age}={}){
  let life=state.intake?configureLife(newLife(state.seed),state.intake):newLife(state.seed);
  life={...life,...(state.lifeEventPolicy?{lifeEventPolicy:{...state.lifeEventPolicy}}:{}),economy:createEconomy(state.economy?.seed??state.seed),story:newStory(state.seed)};
  life=begin(life);
  let guard=0;
  while(life.stage==='review'&&life.age<upTo&&guard++<20){
    // The default shape at every station, and no story decision taken.
    life={...life,effort:balanced(),profile:defaultProfile(),story:{...life.story,pending:null}};
    const before=life;
    life=live(life);
    if(life===before)break;
  }
  return life;
}

// Both trajectories, station by station, in the units the game already uses.
export function baselineComparison(state){
  const life=unchosenLife(state);
  const rows=state.history.filter(row=>row.age>=10).map(row=>{
    const other=life.history.find(r=>r.age===row.age);
    if(!other)return null;
    return {age:row.age,cash:row.cash,unchosenCash:other.cash,health:row.health,unchosenHealth:other.health,wellbeing:row.wellbeing,unchosenWellbeing:other.wellbeing};
  }).filter(Boolean);
  const last=rows.at(-1);
  return {
    rows,
    reached:life.age,
    endedEarly:life.stage==='recap'&&life.age<state.age,
    death:life.death,
    delta:last?{cash:last.cash-last.unchosenCash,health:last.health-last.unchosenHealth,wellbeing:last.wellbeing-last.unchosenWellbeing}:null,
  };
}
