// Board coordinates. These are authored game spaces, with one walkable level each.
import {furniture,taskDesks} from './layout.js';

const houseBounds=[3,3,4,3.6];
const classroomBounds=[9,1.08,3,1.88];
export const HOME_ENTRY=[6.75,6.6];
export const SCHOOL_SEAT=[10.5,1.6];
export const SCHOOL_APPROACH=[[8.5,3.16],[9.55,3.16],[9.55,2.96],[9.55,1.6],SCHOOL_SEAT];

export const INTERIORS={
 home:{label:'Shophouse',bounds:houseBounds,door:HOME_ENTRY,opening:[6.3,7],
  path:[[6.75,7.2],HOME_ENTRY,[6.5,5.8],[5.7,5.8]],
  zones:[{label:'Family table',bounds:[5.08,5.7,1.55,.9]},{label:'Study corner',bounds:[5.95,3.48,.8,1.72]}],
  furniture:furniture.map(({x,y,w,d})=>[x,y,w,d])},
 school:{label:'Classroom',bounds:classroomBounds,door:SCHOOL_APPROACH[2],opening:[9.2,9.91],
  path:SCHOOL_APPROACH.slice(1),
  zones:[{label:'Classroom aisle',bounds:[9.23,1.24,.63,1.65]},{label:'School desk',bounds:[10.12,1.43,.8,.98]}],
  furniture:[[...taskDesks[0],.75,.42],[11.13,1.95,.68,.42]]}
};
export function inInterior([x,z,w,d],px,pz){
 return px>=x&&px<=x+w&&pz>=z&&pz<=z+d;
}
export function wallEdges({bounds:[x,z,w,d],opening:[left,right]}){
 return [[x,z,w,.08],[x,z,.08,d],[x+w-.08,z,.08,d],[x,z+d-.08,left-x,.08],[right,z+d-.08,x+w-right,.08]].filter(([, ,width])=>width>.001);
}
