// A shared 60-second day: home, journey, activity, return, evening.
// Paths use the same world coordinates as the room and its furniture.
export const HOME={mother:[5,6.25],father:[6.4,6.25],player:[5.7,5.8]};
export const HOME_FACING={mother:Math.PI/2,father:-Math.PI/2,player:0};
const EXIT=[[6.75,6.8],[6.75,7.2],[8.5,7.2]];
const destinations={
 care:{path:[HOME.mother,[5,5.75],[5.95,5.75],[5.95,5.9]],action:'Caring for you',pose:'care'},
 stall:{path:[HOME.mother,[5,6.8],...EXIT,[8.5,9.8],[7.1,9.8]],action:'Tending the stall',pose:'trade'},
 work:{path:[HOME.father,[6.4,6.8],...EXIT,[13.8,7.2],[13.8,5.8],[12.4,5.8]],action:'At work',pose:'work'},
 school:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,1.6],[10.5,1.6]],action:'At school',pose:'study'},
 play:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,9.8],[9.8,9.8]],action:'Playing outside',pose:'play'},
 sport:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,9.8],[10,10.5]],action:'Training',pose:'exercise'},
 art:{path:[HOME.player,[6,5.7],[6.8,5.5]],action:'Making art',pose:'draw'},
 garden:{path:[HOME.player,[6.5,5.8],...EXIT,[8.5,13.8],[4.7,13.8]],action:'In the garden',pose:'garden'},
 home:{path:[HOME.player,[5.2,5.7]],action:'Playing at home',pose:'play'}
};
function pathLength(path){return path.slice(1).reduce((n,p,i)=>n+Math.hypot(p[0]-path[i][0],p[1]-path[i][1]),0);}
export function samplePath(path,fraction){const traveled=pathLength(path)*Math.max(0,Math.min(1,fraction));let distance=traveled;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(distance<=length)return{x:a[0]+(b[0]-a[0])*distance/length,y:a[1]+(b[1]-a[1])*distance/length,dx:b[0]-a[0],dy:b[1]-a[1],distance:traveled};distance-=length;}const p=path.at(-1);return{x:p[0],y:p[1],dx:0,dy:0,distance:traveled};}
export function dayPhase(time){const t=((time%60)+60)%60;return t<8?'Morning':t<20?'On the way':t<36?'Daytime':t<48?'Coming home':'Evening';}
export function routine(actor,age,time,goal='balance',context={}){
 const t=((time%60)+60)%60;
 if(actor==='player'&&age>=20&&context.recovering)return {x:HOME.player[0],y:HOME.player[1],dx:0,dy:0,moving:false,facing:HOME_FACING.player,pose:t<8?'eat':t>=48?'rest':'recover',action:'Recovering at home',phase:dayPhase(time)};
 let key=actor==='mother'?(age<3?'care':'stall'):actor==='father'?'work':age<6?'home':age<18?'school':age>=60?'garden':goal==='sport'?'sport':goal==='art'?'art':'work';
 if(actor==='player'){
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
 const origin=route.path[0],isHome=t<8||t>=48;
 if(isHome)return{x:origin[0],y:origin[1],dx:0,dy:0,moving:false,facing:HOME_FACING[actor],pose:t>=48?'rest':'eat',action:t>=48?'Resting at home':'Breakfast at home',phase:dayPhase(time)};
 if(t>=20&&t<36){const p=route.path.at(-1);return{x:p[0],y:p[1],dx:0,dy:0,moving:false,pose:route.pose,action:route.action,phase:dayPhase(time)};}
 const returning=t>=36,path=returning?[...route.path].reverse():route.path;const p=samplePath(path,(t-(returning?36:8))/12);return{...p,moving:true,pose:'walk',action:returning?'Walking home':'Walking to '+(key==='care'?'the cradle':key==='stall'?'the stall':key==='school'?'school':key==='sport'?'training':key==='art'?'the desk':key==='garden'?'the garden':key==='home'?'play at home':key==='play'?'play outside':'work'),phase:dayPhase(time)};
}
export function routineCaption(age,time,goal,context){const actor=age<3?'mother':'player';const r=routine(actor,age,time,goal,context);return `${r.phase} · ${age<3?'Mother: ':''}${r.action.toLowerCase()}.`;}
export function routeFixtures(){return Object.values(destinations).map(d=>d.path);}

export function routineContext(state){return {pathway:state.history.at(-1)?.pathway??state.pathway,recovering:state.health<60&&/health setback/.test(state.history.at(-1)?.event??'')};}
