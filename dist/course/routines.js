// A shared 60-second day: home, journey, activity, return, evening.
// Paths use the same world coordinates as the room and its furniture.
const HOME={mother:[5,6.25],father:[6.75,5.6],player:[5.5,5.9]};
const EXIT=[[6.75,6.6],[6.75,7.2],[8.5,7.2]];
const destinations={
 care:{path:[[5,6.25],[5.95,5.9]],action:'Caring for you',pose:'care'},
 stall:{path:[HOME.mother,[6.0,6.4],...EXIT,[8.5,9.8],[7.1,9.8]],action:'Tending the stall',pose:'work'},
 work:{path:[HOME.father,[6.75,6.6],[8.5,6.6],[10.6,6.6],[12.4,5.8]],action:'At work',pose:'work'},
 school:{path:[HOME.player,[6.0,6.4],...EXIT,[8.5,1.6],[10.5,1.6]],action:'At school',pose:'study'},
 play:{path:[HOME.player,[6,6.4],...EXIT,[8.5,9.8],[9.8,9.8]],action:'Playing outside',pose:'play'},
 sport:{path:[HOME.player,[6,6.4],...EXIT,[8.5,9.8],[10,10.5]],action:'Training',pose:'exercise'},
 art:{path:[HOME.player,[6,5.7],[6.8,5.5]],action:'Making art',pose:'draw'},
 garden:{path:[HOME.player,[6,6.4],...EXIT,[8.5,13.8],[4.7,13.8]],action:'In the garden',pose:'garden'},
 home:{path:[HOME.player,[5.9,6.3]],action:'Playing at home',pose:'play'}
};
function pathLength(path){return path.slice(1).reduce((n,p,i)=>n+Math.hypot(p[0]-path[i][0],p[1]-path[i][1]),0);}
export function samplePath(path,fraction){let distance=pathLength(path)*Math.max(0,Math.min(1,fraction));for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(distance<=length)return{x:a[0]+(b[0]-a[0])*distance/length,y:a[1]+(b[1]-a[1])*distance/length,dx:b[0]-a[0],dy:b[1]-a[1]};distance-=length;}const p=path.at(-1);return{x:p[0],y:p[1],dx:0,dy:0};}
export function dayPhase(time){const t=((time%60)+60)%60;return t<8?'Morning':t<20?'On the way':t<36?'Daytime':t<48?'Coming home':'Evening';}
export function routine(actor,age,time,goal='balance'){
 const t=((time%60)+60)%60;
 const key=actor==='mother'?(age<3?'care':'stall'):actor==='father'?'work':age<6?'home':age<18?'school':age>=60?'garden':goal==='sport'?'sport':goal==='art'?'art':'work';
 let route=destinations[key];
 // The adult player starts from their own place in the home, not the father's.
 if(actor==='player'&&key==='work')route={...route,path:[HOME.player,[6,6.4],[6.75,6.6],...route.path.slice(2,-1),[11.3,5.8]]};
 const origin=route.path[0],isHome=t<8||t>=48;
 if(isHome)return{x:origin[0],y:origin[1],dx:0,dy:0,moving:false,pose:t>=48?'rest':'eat',action:t>=48?'Resting at home':'Breakfast at home',phase:dayPhase(time)};
 if(t>=20&&t<36){const p=route.path.at(-1);return{x:p[0],y:p[1],dx:0,dy:0,moving:false,pose:route.pose,action:route.action,phase:dayPhase(time)};}
 const returning=t>=36,path=returning?[...route.path].reverse():route.path;const p=samplePath(path,(t-(returning?36:8))/12);return{...p,moving:true,pose:'walk',action:returning?'Walking home':'Walking to '+(key==='care'?'the cradle':key==='stall'?'the stall':key==='school'?'school':key==='sport'?'training':key==='art'?'the desk':key==='garden'?'the garden':key==='home'?'play at home':key==='play'?'play outside':'work'),phase:dayPhase(time)};
}
export function routineCaption(age,time,goal){const actor=age<3?'mother':'player';const r=routine(actor,age,time,goal);return `${r.phase} · ${age<3?'Mother: ':''}${r.action.toLowerCase()}.`;}
export function routeFixtures(){return Object.values(destinations).map(d=>d.path);}
