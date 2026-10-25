// Authoritative metaphorical districts. Coordinates are world x/z, not real distance.
import {furniture} from './layout.js';
const room=(id,label,district,base,origin,road)=>({id,label,district,base,origin,width:4,depth:4,exit:[[base[0]+3.75,base[1]+3.8],[base[0]+3.75,base[1]+4.2]],pathToRoad:[[origin[0]+.8,origin[1]],[base[0]+3.75,base[1]+3.8],[base[0]+3.75,base[1]+4.2],...road]});
export const RESIDENCES={
 family:room('family','Family home','local',[3,3],[5.7,5.8],[[8.5,7.2]]),
 far:room('far','Your rental home','outer',[-10,3],[-7.3,5.8],[]),
 nearLocal:room('nearLocal','Your local studio','local',[17,3],[19.7,5.8],[]),
 nearCity:room('nearCity','Your city studio','city',[25,10],[27.7,12.8],[[32,14.2],[32,7.2]])
};
export const WORKPLACES={
 local:{id:'local',label:'Local work district',destination:[11.3,5.8],approach:[[10.3,7.2],[10.3,5.8]],payFactor:1},
 city:{id:'city',label:'City work district',destination:[27.3,5.8],approach:[[26.3,7.2],[26.3,5.8]],payFactor:1.15}
};
export const DISTRICTS={outer:{label:'Outer neighbourhood',center:[-8,5]},local:{label:'Local neighbourhood',center:[9,5]},city:{label:'City district',center:[27,8]}};
export function roomFurniture(room){return furniture.map(f=>({...f,x:f.x+room.base[0]-3,y:f.y+room.base[1]-3}));}
export const locationSince=(finance,fallbackAge)=>finance?.locationSince??fallbackAge;
export function recordedFinance(state,age){
 // A period's end snapshot can describe a move made at its start. Its explicit
 // effective age, not the end-of-period review age, governs historical rendering.
 const records=(state.history??[]).filter(row=>row.finance).map(row=>({finance:row.finance,since:locationSince(row.finance,row.age)}));
 if(state.finance)records.push({finance:state.finance,since:locationSince(state.finance,state.age)});
 return records.filter(row=>row.since<=age).sort((a,b)=>a.since-b.since).at(-1)?.finance;
}
export function workplaceAt(state,age=state.age){const id=age<20?'local':recordedFinance(state,age)?.workplace??'local';return WORKPLACES[id]??WORKPLACES.local;}
export function residenceAt(state,age=state.age){
 const housing=age<20?'family':recordedFinance(state,age)?.housing??'family';
 return housing==='far'?RESIDENCES.far:housing==='near'?(workplaceAt(state,age).id==='city'?RESIDENCES.nearCity:RESIDENCES.nearLocal):RESIDENCES.family;
}
export function locationContext(state,age=state.age){return {residence:residenceAt(state,age),workplace:workplaceAt(state,age)};}
export function sceneLocationLabel(state,age=state.age){const {residence,workplace}=locationContext(state,age);return {home:residence.label,work:workplace.label};}
