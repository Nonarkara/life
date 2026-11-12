// Shared layout facts; no GPU or renderer dependency.
import {RESIDENCES,residenceAt,workplaceAt,locationSince} from './locations.js';
export const CITY_BLOCKS=[{x:23.5,z:9,w:1.2,d:3,h:2.6},{x:29.6,z:9,w:1.2,d:3,h:3},{x:24,z:15.6,w:3,d:1.4,h:2.5}];

export function revealedPlaces(state,age=state.age){
 const homes=new Set(['family']);let city=false;
 const records=(state.history??[]).filter(r=>r.finance&&locationSince(r.finance,r.age)>=20&&locationSince(r.finance,r.age)<=age).map(r=>({age:locationSince(r.finance,r.age),finance:r.finance}));
 if(age>=20&&state.finance&&locationSince(state.finance,state.age)<=age)records.push({age:locationSince(state.finance,state.age),finance:state.finance});
 for(const record of records){const home=residenceAt(record);homes.add(home.id);city||=workplaceAt(record).id==='city'||home.id==='nearCity';}
 return {homes,city};
}
// The family house may stand on posts; the doorstep ramp then becomes the stair.
let homeLift=0;export const setHomeLift=h=>{homeLift=h;};
export function floorAt(x,z){
 for(const room of Object.values(RESIDENCES)){const [bx,bz]=room.base,top=.16+(room.id==='family'?homeLift:0);if(x>=bx&&x<=bx+4&&z>=bz&&z<=bz+4.2)return Math.max(0,Math.min(top,(bz+4.2-z)/.6*top));}
 return 0;
}
export function overlappingReaderWidth(canvasRect,readerRect){
 if(!readerRect||readerRect.bottom<=canvasRect.top||readerRect.top>=canvasRect.bottom)return 0;
 return Math.max(0,Math.min(canvasRect.right,readerRect.right)-Math.max(canvasRect.left,readerRect.left));
}

