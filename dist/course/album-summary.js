import {STOPS} from './journey-stops.js';
const places=new Set(Object.values(STOPS).map(s=>s.label));
// Group what actually happened; neither plans nor inferred accomplishments enter the view.
export function albumSummary(album){
 const activities=new Map(),periods=[],journeys=[];
 for(const e of album?.entries??[]){
  if(e.days!==undefined){const group=activities.get(e.label)??{label:e.label,count:0,days:0,cost:0,from:e.from,to:e.to};group.count++;group.days+=e.days;group.cost+=e.cost;group.from=Math.min(group.from,e.from);group.to=Math.max(group.to,e.to);activities.set(e.label,group);}
  else if(e.to>e.from)periods.push(e);
  else if(places.has(e.label))journeys.push(e);
 }
 return {activities:[...activities.values()].sort((a,b)=>b.days-a.days||a.from-b.from),periods,journeys,notes:album?.notes??[]};
}
