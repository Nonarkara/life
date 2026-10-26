// The roads not taken.
//
// When a question is answered, the life is copied, the answer is undone, and
// the other answers are lived instead. The seed is the same in every branch,
// so the luck is shared and the comparison is fair: the only difference
// between two roads is the choice.
import {live,clamp} from './sim.js';
import {applyPivot,pivotById,openOptions} from './pivots.js';

const clone=state=>JSON.parse(JSON.stringify(state));

// Undo one answer exactly: the snapshot taken before it was given.
export function undoAnswer(state,record){
  const before=record.before??{};
  return{
    ...state,
    cash:before.cash??state.cash,
    health:before.health??state.health,
    wellbeing:before.wellbeing??state.wellbeing,
    skills:{...(before.skills??state.skills)},
    story:{...state.story,flags:{...(before.flags??state.story?.flags)}},
    pivotFlags:{...(before.pivotFlags??state.pivotFlags??{})},
    pathway:before.pathway??state.pathway,
  };
}

// Put an answer back, for the answers that were given after this one.
export function reapplyAnswer(state,record){
  const effects=record.effects??{},skills=record.skills??{},flags=record.flags??{};
  const next={
    ...state,
    cash:state.cash+(effects.cash??0),
    health:clamp(state.health+(effects.health??0),0,100),
    wellbeing:clamp(state.wellbeing+(effects.wellbeing??0),0,100),
    skills:{...state.skills},
    story:{...state.story,flags:{...state.story?.flags}},
    pivotFlags:{...(state.pivotFlags??{})},
  };
  for(const[axis,gain]of Object.entries(skills))next.skills[axis]=(next.skills[axis]??0)+gain;
  for(const[key,value]of Object.entries(flags))next.pivotFlags[key]=value;
  if(record.pathway)next.pathway=record.pathway;
  return next;
}

// Every other answer at this station, lived to the end of the five years.
export function stationAlternatives(state){
  const answered=(state.pivots??[]).filter(record=>record.station===state.age);
  const roads=[];
  answered.forEach((record,index)=>{
    const pivot=pivotById(record.pivot);
    if(!pivot)return;
    for(const option of openOptions(pivot,state)){
      if(option.id===record.choice)continue;
      let variant=undoAnswer(clone(state),record);
      // The answers given after this one at this station still stand.
      for(const later of answered.slice(index+1))variant=reapplyAnswer(variant,later);
      const chosen=applyPivot(variant,pivot,option.id);
      const lived=live(chosen);
      const row=lived.history.at(-1);
      if(!row)continue;
      roads.push({
        station:state.age,pivot:pivot.id,question:pivot.prompt,taken:record.choice,
        option:option.id,label:option.label,cost:option.cost??'',
        cash:row.cash,health:row.health,wellbeing:row.wellbeing,event:row.event,
      });
    }
  });
  return roads;
}

// The same, read as a difference against the road that was taken.
export function alternativeDeltas(state){
  const rows=state.history.flatMap(row=>(row.alternatives??[]).map(road=>{
    const taken=row;
    return{...road,cashDelta:road.cash-taken.cash,healthDelta:road.health-taken.health,wellbeingDelta:road.wellbeing-taken.wellbeing,takenCash:taken.cash,takenHealth:taken.health,takenWellbeing:taken.wellbeing};
  }));
  return rows;
}
