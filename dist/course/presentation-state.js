import {routine,routineContext} from './routines.js';
// Home is a residence identity, not simply the name of a painted backdrop.
export function homeCast(state,age,time,goal,context=routineContext(state,age),player=routine('player',age,time,goal,context)){
 const present=[{id:'player',activity:player}];
 if(context.residence?.id!=='family')return present;
 for(const id of ['mother','father']){
  if(id==='mother'&&age>=70||id==='father'&&age>=55)continue;
  const activity=routine(id,age,time,goal,context);
  if(activity.moving||!['Breakfast at home','Resting at home'].includes(activity.action))continue;
  present.push({id,activity});
 }
 return present;
}
