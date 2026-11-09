// Which moments open in 3D, and what that place looks like in this life.
// Pure data, no three.js, so the game can decide without loading the renderer.
import {rand} from './sim.js';
import {birthYearOf} from './thai-history.js';
import {region,regionAt} from './regions.js';
const AT={temple:'h_film_van temple-boy',soi:'h_transistor h_1976_names girl-school',airfield:'h_airbase go-abroad',avenue:'h_1973_leaflet h_1973_truck h_1976_campus h_1992',village:'h_rice_at_night h_1980_return h_saudi h_garment h_road',gate:'h_1997_closed',water:'h_2011_flood flood_help flood-repair flood-move',table:'h_1973_radio h_1996_boom h_2010_table h_2020_glass gifted-child empty-house take-in',fork:'three-roads'};
export const MOMENT_SETS=Object.fromEntries(Object.entries(AT).flatMap(([set,ids])=>ids.split(' ').map(id=>[id,set])));
export const bigMoment=id=>typeof id==='string'&&Object.hasOwn(MOMENT_SETS,id);
const AT_NIGHT=new Set(['h_film_van','h_rice_at_night','h_1992','h_1973_radio','h_2020_glass']);
const NOW=2026;
export function momentPlan(state,id){
 const by=birthYearOf(state),year=by===null?NOW:by+state.age,r=k=>rand(state.seed,state.age,'moment:'+id+':'+k),place=region(regionAt(state,state.age)),pick=(k,list)=>list[Math.floor(r(k)*list.length)];
 // A storey is 3.2 m and a person is 1.7 m in every set: scale comes from the world, not the camera.
 const rows=Array.from({length:6},(_,i)=>({width:4+r('w'+i)*1.6,storeys:year<1960?2:year<1985?2+Math.floor(r('s'+i)*2):2+Math.floor(r('s'+i)*4),wall:pick('wall'+i,['#d9c9a6','#c9b58c','#b8bca9','#d6b48f','#a9b7ab','#e0d3b8']),awning:pick('awn'+i,['#bd5038','#55777c','#c98a3c','#6f7f55','#8a5a48'])}));
 return {set:MOMENT_SETS[id],year,night:AT_NIGHT.has(id),side:r('side')<.5?-1:1,rows,trees:3+Math.floor(r('trees')*6),crowd:40+Math.floor(r('crowd')*50),cars:year>=1958?Math.floor(r('cars')*(year>=1990?5:3)):0,poles:year>=1955,skyline:year>=1985,tower:year>=1985?12+Math.floor(r('tower')*(year>=2005?34:16)):0,camera:(r('camera')-.5)*2.4,sky:pick('sky',['#a9c3bd','#c6bfa0','#b6c7c4','#d2b596']),ground:place?.look?.ground??'#849573',water:place?.look?.water??'#5b7f80',wall:place?.look?.wall??'#e5d9b9',floor:place?.look?.floor??'#a08560',roof:pick('roof',['#a15f49','#8a4d3c','#6d7468','#b9764f'])};
}
