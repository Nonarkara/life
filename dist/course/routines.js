// A shared 60-second day: home, journey, activity, return, evening.
// Paths use the same world coordinates as the room and its furniture.
import {RESIDENCES,WORKPLACES,locationContext} from './locations.js';
import {recordedCommute,commuteSchedule} from './biography.js';
export const HOME={mother:[5,6.25],father:[6.4,6.25],player:[5.7,5.8]};
export const HOME_FACING={mother:Math.PI/2,father:-Math.PI/2,player:0};
const EXIT=[[6.75,6.8],[6.75,7.2],[8.5,7.2]];
const destinations={
 care:{path:[HOME.mother,[5,5.75],[5.95,5.75],[5.95,5.9]],action:'Caring for you',pose:'care'},
 floorCare:{path:[HOME.mother,[4.75,6.15]],action:'Playing with you on the rug',pose:'floor'},
 stall:{path:[HOME.mother,[5,6.8],...EXIT,[8.5,9.8],[7.1,9.8]],action:'Tending the stall',pose:'trade'},
 work:{path:[HOME.father,[6.4,6.8],...EXIT,[13.8,7.2],[13.8,5.8],[12.4,5.8]],action:'At work',pose:'work'},
 school:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,1.6],[10.5,1.6]],action:'At school',pose:'study'},
 play:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,9.8],[9.8,9.8]],action:'Playing outside',pose:'play'},
 sport:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,9.8],[10,10.5]],action:'Training',pose:'exercise'},
 swim:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,9.8],[9.6,10.2]],action:'Learning to swim',pose:'swim'},
 bike:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,8.2],[11.2,8.2]],action:'Learning to ride a bike',pose:'ride'},
 fall:{path:[HOME.player,[5.2,5.7]],action:'Learning to fall and get back up',pose:'fall'},
 art:{path:[HOME.player,[6,5.7],[6.8,5.5]],action:'Making art',pose:'draw'},
 garden:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,13.8],[4.7,13.8]],action:'In the garden',pose:'garden'},
 home:{path:[HOME.player,[5.2,5.7]],action:'Playing at home',pose:'play'}
};
function pathLength(path){return path.slice(1).reduce((n,p,i)=>n+Math.hypot(p[0]-path[i][0],p[1]-path[i][1]),0);}
export function samplePath(path,fraction){const traveled=pathLength(path)*Math.max(0,Math.min(1,fraction));let distance=traveled;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(distance<=length)return{x:a[0]+(b[0]-a[0])*distance/length,y:a[1]+(b[1]-a[1])*distance/length,dx:b[0]-a[0],dy:b[1]-a[1],distance:traveled,progress:Math.max(0,Math.min(1,fraction))};distance-=length;}const p=path.at(-1);return{x:p[0],y:p[1],dx:0,dy:0,distance:traveled,progress:Math.max(0,Math.min(1,fraction))};}
export function dayPhase(time){const t=((time%60)+60)%60;return t<8?'Morning':t<20?'On the way':t<36?'Daytime':t<48?'Coming home':'Evening';}
// The rug and kitchen corner are clear of every piece of room furniture.
export const RUG=[4.4,6],KITCHEN=[3.75,6.1];
function infant(age,t,time){
 // From one the child crawls around the rug; from two they toddle to a parent and back.
 if(age<2){const a=t*.35;return {x:RUG[0]+Math.cos(a)*.25,y:RUG[1]+Math.sin(a)*.22,dx:-Math.sin(a),dy:Math.cos(a),distance:t*.12,moving:true,pose:'crawl',action:'Crawling on the rug',phase:dayPhase(time)};}
 const f=(1-Math.cos(t*.2))/2,p=samplePath([RUG,[3.95,5.7]],f),back=Math.sin(t*.2)<0;
 return {...p,dx:back?-p.dx:p.dx,dy:back?-p.dy:p.dy,distance:t*.25,moving:true,pose:'toddle',action:'Taking first steps',phase:dayPhase(time)};
}
function evening(actor,age,t,start,origin,family){
 const spot=!family?null:actor==='mother'?{at:KITCHEN,pose:'cook',facing:-Math.PI/2,action:'Cooking dinner'}:actor==='player'&&(age<6||age>=18)?{at:RUG,pose:'floor',facing:0,action:age<6?'Playing on the rug':'Reading on the rug'}:null;
 const still={x:origin[0],y:origin[1],dx:0,dy:0,moving:false,facing:HOME_FACING[actor]};
 if(t>=start+5.2||start>52)return {...still,pose:'rest',action:'Resting at home',phase:dayPhase(t)};
 if(!spot)return {...still,pose:'study',action:actor==='player'&&age<18?'Doing homework':'Reading by the lamp',phase:dayPhase(t)};
 const out=t<start+.8,back=t>=start+4.4;
 if(out||back){const p=samplePath(out?[origin,spot.at]:[spot.at,origin],(t-(out?start:start+4.4))/.8);return {...p,moving:true,pose:'walk',action:spot.action,phase:dayPhase(t)};}
 return {x:spot.at[0],y:spot.at[1],dx:0,dy:0,moving:false,facing:spot.facing,pose:spot.pose,action:spot.action,phase:dayPhase(t)};
}
export function routine(actor,age,time,goal='balance',context={}){
 const t=((time%60)+60)%60;
 if(actor==='player'&&age<3)return infant(age,t,time);
 const home=actor==='player'&&age>=20?(context.residence??RESIDENCES.family):RESIDENCES.family;
 const originHome=actor==='player'?home.origin:HOME[actor];
 if(actor==='player'&&age>=20&&context.recovering)return {x:originHome[0],y:originHome[1],dx:0,dy:0,moving:false,facing:HOME_FACING.player,pose:t<8?'eat':t>=48?'rest':'recover',action:'Recovering at home',phase:dayPhase(time)};
 let key=actor==='mother'?(age<1?'care':age<3?'floorCare':'stall'):actor==='father'?'work':age<6?'home':age<18?'school':age>=60?'garden':goal==='sport'?'sport':goal==='art'?'art':'work';
 if(actor==='player'){
  if(age>=3&&age<4)key='fall';
  else if(age>=5&&age<6)key='swim';
  else if(age>=8&&age<9&&t>=36&&t<48)key='bike';
  if(age>=15&&age<60){
   if(context.pathway==='college'&&age<=25||context.pathway==='school'&&age<=20)key='school';
   else if(context.pathway==='work')key='work';
   else if(context.pathway==='vocational')key='work';
   else if(context.pathway==='independent')key='art';
  }
  if(age>=20&&context.recovering)key='home';
 }
 let route=destinations[key];
 if(actor==='player'&&key==='work'&&context.pathway==='vocational')route={...route,pose:'craft',action:'Learning a trade'};
 if(actor==='player'&&key==='art'&&context.pathway==='independent')route={...route,action:'Working independently'};
 if(actor==='player'&&key==='school'&&age>=20&&context.pathway==='college')route={...route,action:'At college'};
 if(actor==='player'&&context.recovering&&age>=20)route={...route,pose:'recover',action:'Recovering at home'};
 // The adult player starts from their own place in the home, not the father's.
 if(actor==='player'&&key==='work')route={...route,path:[HOME.player,[6.5,5.8],...EXIT,[10.3,7.2],[10.3,5.8],[11.3,5.8]]};
 if(actor==='player'&&age>=20){
  if(key==='work'){const work=context.workplace??WORKPLACES.local;route={...route,path:[home.origin,...home.pathToRoad,...work.approach,work.destination]};}
  else if(home.id!=='family'){
   if(key==='art'||key==='home'){const dx=home.base[0]-3,dy=home.base[1]-3;route={...route,path:route.path.map(([x,y])=>[x+dx,y+dy])};}
   else route={...route,path:[home.origin,...home.pathToRoad,[8.5,7.2],...route.path.slice(5)]};
  }
 }
 const schedule=actor==='player'&&age>=20&&key==='work'?commuteSchedule(context.commute):commuteSchedule(null);
 const origin=route.path[0],isHome=t<schedule.depart||t>=schedule.home;
 if(t>=schedule.home)return evening(actor,age,t,schedule.home,origin,actor!=='player'||age<20||home.id==='family');
 if(isHome)return{x:origin[0],y:origin[1],dx:0,dy:0,moving:false,facing:HOME_FACING[actor],pose:'eat',action:'Breakfast at home',phase:dayPhase(time)};
 if(t>=20&&t<36){const p=route.path.at(-1);return{x:p[0],y:p[1],dx:0,dy:0,moving:false,pose:route.pose,action:route.action,phase:dayPhase(time)};}
 if(key==='bike'&&t>=36&&t<48){const p=samplePath([...route.path].reverse(),(t-schedule.leave)/schedule.duration);return{...p,moving:true,pose:'ride',phase:'Coming home',action:'Learning to ride a bike'};}
 const returning=t>=36,path=returning?[...route.path].reverse():route.path;const p=samplePath(path,(t-(returning?schedule.leave:schedule.depart))/schedule.duration);return{...p,moving:true,pose:'walk',phase:returning?'Coming home':'On the way',action:returning?'Walking home':'Walking to '+(key==='care'?'the cradle':key==='stall'?'the stall':key==='school'?'school':key==='sport'?'training':key==='swim'?'the water':key==='bike'?'the lane':key==='art'?'the desk':key==='garden'?'the garden':key==='home'||key==='fall'?'play at home':key==='play'?'play outside':'work')};
}
export function routineCaption(age,time,goal,context){const actor=age<3?'mother':'player';const r=routine(actor,age,time,goal,context);return `${r.phase} · ${age<3?'Mother: ':''}${r.action.toLowerCase()}.`;}
export function routeFixtures(){return Object.values(destinations).map(d=>d.path);}

export function routineContext(state,age=state.age){const completed=state.history?.filter(row=>row.age<=age).at(-1),activity=state.history?.filter(row=>(row.from??row.age)<=age).at(-1);return {...locationContext(state,age),commute:recordedCommute(state,age,activity?.pathway??(age===state.age?state.pathway:undefined)),pathway:activity?.pathway??(age===state.age?state.pathway:undefined),recovering:(completed?.health??100)<60&&/health setback/.test(completed?.event??'')};}
