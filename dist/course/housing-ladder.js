// Six ways of living in one Thai town, from no house to a walled villa. You are born on one rung
// and can move a step at a time; the other five stay open to view on their own lots, so you always
// see who is above and below you. Authored game rules, not census data. Pure data, no three.js.
import {rand} from './rand.js';
import {recordedFinance,residenceAt} from './locations.js';
import {currentRegion} from './finance.js';
import {region,regionIdFor,homeRegion} from './regions.js';
export const RUNGS=[
 {id:'pavement',label:'No house · the pavement',rent:0,cls:'low_class',ends:58},
 {id:'squat',label:'A squat · land that is not yours',rent:400,cls:'low_class',ends:64},
 {id:'row',label:'A rented room in a row',rent:1500,cls:'working_class',ends:70},
 {id:'shophouse',label:'A shophouse',rent:3500,cls:'middle_class',ends:74},
 {id:'bungalow',label:'A house with a yard',rent:6000,cls:'bureaucratic_class',ends:76},
 {id:'villa',label:'A walled villa',rent:20000,cls:'high_class',ends:78}
];
export const TOP=RUNGS.length-1;
const CLASS_RUNG={low_class:1,working_class:2,middle_class:3,bureaucratic_class:4,high_class:5};
// One low-class birth in four has no house at all. Read from the seed, so saves and links need no new field.
export function birthRung(state){const cls=state.intake?.class??state.birth?.class,r=CLASS_RUNG[cls]??2;return r===1&&rand(state.seed,0,'dwelling')<.25?0:r;}
export const rungAt=(state,age=state.age)=>recordedFinance(state,age)?.rung??birthRung(state);
export const validRung=r=>r===undefined||Number.isInteger(r)&&r>=0&&r<=TOP;
// What this home costs per month against the one you were born in. Staying costs nothing new.
export function rungRent(state,baseRent){const r=state.finance?.rung;return r===undefined?0:Math.max(-baseRent,RUNGS[r].rent-RUNGS[birthRung(state)].rent);}
export function setRung(state,to){
 const f=state.finance;if(!f||state.stage!=='review'||state.story?.pending||state.age<20||!validRung(to)||to===undefined)return state;
 const before=rungAt(state,state.age-.5);if(Math.abs(to-before)>1||to===(f.rung??birthRung(state)))return state;
 return {...state,finance:{...f,rung:to,locationSince:state.age}};
}
// The ladder moves the family home only: not a studio elsewhere, and not after leaving the birthplace.
export const ladderOpen=s=>!!s.finance&&s.age>=20&&residenceAt(s).id==='family'&&currentRegion(s)===homeRegion(s.birth,s.age)&&region(currentRegion(s)).country==='TH';
// Does this life match what was asked for on the form? Random class takes whatever the draw gives.
export const birthFits=(life,{street,raised,class:cls})=>(!raised||life.birth.household===raised)&&(street?birthRung(life)===0:cls==='low_class'?birthRung(life)===1:true);
// A landlord wants to see the rent is under 40% of what comes in.
export const canAfford=(rung,income)=>RUNGS[rung].rent<=income*.4;
// Five lots, nearest first. [x, z, width, depth]. Each opens toward the camera (+x, +z).
export const LOTS=[[-1.9,3.1,3.6,3.4],[-3,9.1,3.6,3.4],[9.3,12.7,3.6,3.4],[-2.7,12.9,3.6,3.4],[14.3,12.7,3.6,3.4]];
export const LOT_FLOOR=.08;
export const clearOfLots=(x,z,w=0,d=0)=>!LOTS.some(([a,b,c,e])=>x<a+c&&x+w>a&&z<b+e&&z+d>b);
// Everyone but you, top rung first: move up one and you and that neighbour have traded houses.
export const othersOf=rung=>RUNGS.map((_,i)=>TOP-i).filter(r=>r!==rung).map((r,i)=>({rung:r,lot:LOTS[i]}));
// [pose, x, z, facing] inside a lot, for morning, day and evening. Sitters get a stool from the builder.
const SIT_L=['sit',1.1,2,1.57],SIT_R=['study',2.5,2,-1.57],COOK=['cook',.75,1.9,-1.57];
const ADULTS=[
 [['cook',1.1,1.5,.6],['sell',1.9,2.9,0],['mend',1.2,1.7,.6]],
 [['cook',1.2,2.2,-1],['wash',2.6,2.7,.6],['squat',1.2,2.2,.6]],
 [COOK,['mend',2.6,2.7,.6],SIT_L],
 [COOK,['sell',1.9,2.95,0],SIT_L],
 [SIT_L,['garden',2.9,2.9,.4],SIT_L],
 [SIT_L,['garden',2.9,2.9,.4],SIT_L]
];
const MAID=[COOK,['sweep',2.5,1.5,.6],COOK];
const phaseOf=t=>t<8?0:t<40?1:2,EDGES=[8,40,68];
// Who a person your own age has become, by the home they were born in.
export function youngPose(rung,age,year){
 const phone=year>=2005?'phone':'sit';
 if(age<6)return ['floor',2.2,2.4,.6];
 if(age<18)return rung>=2||(rung===1&&age<12)?'school':rung===1?['wash',2.2,2.5,.6]:['sell',2.5,2.95,0];
 if(age>=60&&rung>=2)return SIT_R;
 return [['sell',2.5,2.95,0],['wash',2.2,2.5,.6],['mend',2.2,2.6,.6],['sell',2.5,2.95,0],[phone==='phone'?'phone':'garden',2.3,2.7,.5],[phone==='phone'?'phone':'garden',2.3,2.7,.5]][rung];
}
// Cast for the five open lots. Every house has an adult and someone your age; the villa also has a maid.
export function lotCast(rung,seed,age){
 const rows=[];let salt=0;
 for(const {rung:r,lot} of othersOf(rung)){
  const sex=k=>rand(seed,r,'lot-sex'+k)<.5?'female':'male',cls=RUNGS[r].cls;
  rows.push({who:'adult',rung:r,lot,cls,sex:sex('a'),age:age+28,salt:salt++});
  if(r===TOP)rows.push({who:'maid',rung:r,lot,cls:'low_class',sex:'female',age:Math.min(55,30+age*.2),salt:salt++});
  rows.push({who:'young',rung:r,lot,cls,sex:sex('y'),age,dressAge:r<2&&age>=6?Math.max(18,age):age,salt:salt++});
 }
 return rows;
}
export const lotAdultGone=(row,age)=>row.who==='adult'&&row.age>=RUNGS[row.rung].ends;
export const youngGone=(row,age)=>row.who==='young'&&age>=RUNGS[row.rung].ends;
const stationOf=(row,age,year,phase)=>{
 if(row.who==='young'){const p=youngPose(row.rung,age,year);if(p!=='school')return p;return phase===1?null:SIT_R;}
 const p=(row.who==='maid'?MAID:ADULTS[row.rung])[phase];return year<2005&&p[0]==='phone'?SIT_L:p;
};
// Where this person is now, in world units. Crossing the room takes a moment; nobody jumps.
export function lotActivity(row,age,time,year){
 if(lotAdultGone(row,age)||youngGone(row,age))return null;
 const t=((time%60)+60)%60,phase=phaseOf(t),[X,Z,W,D]=row.lot,now=stationOf(row,age,year,phase),prev=stationOf(row,age,year,(phase+2)%3),since=phase===0?t:t-EDGES[phase-1],door=[W/2,D+.5],from=prev??door,to=now??door,world=p=>({x:X+p[1],y:Z+p[2],facing:p[3]??0});
 const P=now?world(now):null;
 if(since<1.4&&from!==to&&(from[1]!==to[1]||from[2]!==to[2])){const a=prev?[prev[1],prev[2]]:door,b=now?[now[1],now[2]]:door,k=since/1.4,dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;return {x:X+a[0]+dx*k,y:Z+a[1]+dy*k,dx:dx/L,dy:dy/L,distance:since*.7,moving:true,pose:'walk'};}
 if(!P)return null;
 return {x:P.x,y:P.y,dx:0,dy:0,distance:0,moving:false,facing:P.facing,pose:now[0]};
}
const DOING={sell:'selling at the kerb',wash:'washing other people’s clothes',mend:'piecework on the floor',floor:'playing on the floor',study:'at a desk',phone:'on the phone',garden:'watering the garden',sit:'at the table'};
export function lotCaption(rung,age,year,time){
 const t=((time%60)+60)%60,row={who:'young',rung};if(youngGone(row,age))return {home:RUNGS[rung].label,doing:'Someone your age died here'};
 const p=youngPose(rung,age,year);return {home:RUNGS[rung].label,doing:p==='school'?(phaseOf(t)===1?'Someone your age: at school':'Someone your age: homework'):'Someone your age: '+DOING[p[0]]};
}
// While you decide, the camera walks the ladder: the whole town, then each home, top rung first.
const STOP=8;
export function tourStop(rung,time){
 const stops=[{kind:'town',x:6.4,z:6.6},...RUNGS.map((_,i)=>TOP-i).map(r=>{if(r===rung)return {kind:'home',rung:r,x:5.2,z:5.2};const {lot}=othersOf(rung).find(o=>o.rung===r);return {kind:'lot',rung:r,x:lot[0]+lot[2]/2,z:lot[1]+lot[3]/2};})];
 return stops[Math.floor((Math.max(0,time)/STOP)%stops.length)];
}
