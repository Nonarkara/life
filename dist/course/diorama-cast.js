// The people who are not family: who is about in this place and year, and what they are doing.
// Pure data. Every figure is on the road, at a stall or in a field, never inside a building.
import {lifeRandom} from './diorama-plan.js';
import {clearOfLots} from './housing-ladder.js';
const STATIONS={
 market:[['sell',-1,10,Math.PI],['sit',-3.6,9.2,0],['bow',2.35,6.92,Math.PI],['cook',.3,10,Math.PI]],
 slum:[['sell',-1,10,Math.PI],['squat',.9,6.3,1.5],['sit',-2.5,9.1,.4],['wash',.8,5.5,0]],
 village:[['farm',-3.6,5,0],['farm',-3.2,10.8,2],['farm',11,14.6,1],['bow',15.6,1.1,Math.PI],['sit',.6,6.6,.5],['squat',-1.1,9.25,1]],
 fringe:[['farm',0,5,0],['farm',-1,11,2],['farm',12,15,1],['sit',.6,6.6,.5]],
 condo:[['sell',-1,10,Math.PI],['phone',1.2,9.3,.6],['sit',-3.5,9.1,0]],
 coast:[['mend',1.2,10.5,Math.PI],['sell',-1.75,11,Math.PI],['squat',-.5,9.6,1.2],['sit',.9,6.3,.5]],
 villa:[['sweep',1,9,0],['phone',-4,8.95,.4]],
 tower:[['sit',.6,5.55,Math.PI],['sit',1.8,5.55,Math.PI],['phone',-2,6.5,.4]],
 tokyo:[['phone',.8,6.5,.4],['sit',-3,6.9,0]],
 newengland:[['phone',.4,6.9,0],['sweep',-2,6.8,0]],
 brick:[['sit',-1.8,6.55,Math.PI],['phone',.7,6.9,.3]]
};
// Lanes along the two roads, clear of the family's own routes along z=7.2 and x=8.5.
const LANES=[[-5,17.6,8.32],[-5,6.7,8.48],[9.4,17.6,8.18]];
export function crowdRoster(plan){
 const r=lifeRandom(plan.seed,'crowd'+plan.regionId),n=plan.crowd,year=plan.year,thai=!plan.abroad,rows=[];
 const stationDraw=lifeRandom(plan.seed,'stations'+plan.regionId);
 const stations=(STATIONS[plan.style]??STATIONS.market)
  .filter(s=>plan.abroad||clearOfLots(s[1],s[2]))
  .map(station=>({station,rank:stationDraw()}))
  .sort((a,b)=>a.rank-b.rank)
  .map(({station})=>station);
 const person=(extra)=>rows.push({salt:rows.length+1+plan.seed%97,sex:r()<.52?'female':'male',elder:r()<.16,scale:.94+r()*.1,...extra});
 // A monk's alms round, morning only, in Thai places.
 if(thai&&plan.style!=='villa'&&n>=2)person({role:'alms',sex:'male',elder:false,lane:0,phase:r()*20,robe:true});
 for(const s of stations.slice(0,Math.ceil(n*.6)))if(rows.length<n)person({role:'still',pose:s[0],x:s[1],z:s[2],facing:s[3],...(s[0]==='farm'?{hat:'ngob'}:{})});
 while(rows.length<n){
  const i=rows.length,kind=r();
  if(kind<.22&&(plan.marks.bicycle||plan.abroad))person({role:'walk',pose:'ride',lane:i%LANES.length,speed:1.25,phase:r()*40});
  else if(kind<.42&&thai&&year<1990)person({role:'walk',pose:'carry',lane:i%LANES.length,speed:.5,phase:r()*40});
  else if(kind<.55&&year>=1955)person({role:'walk',pose:'walk',lane:i%LANES.length,speed:.45,phase:r()*40,scale:.74,child:true});
  else person({role:'walk',pose:'walk',lane:i%LANES.length,speed:.5+r()*.2,phase:r()*40});
 }
 return rows;
}
// Young lives are lived among other young people: friends walking the road in twos and threes.
// Lanes only, so nobody stands inside a building or on the family's own routes.
export function youthRoster(plan,age){
 if(age<12||age>=30)return [];
 const r=lifeRandom(plan.seed,'youth'+Math.floor(age/5)),n=plan.style==='village'||plan.style==='fringe'?3:5,rows=[],sexes=['female','male','intersex'];
 let group=-1,lane=0,phase=0;
 for(let i=0;i<n;i++){
  if(i%3===0){group++;lane=(group+Math.floor(r()*3))%LANES.length;phase=r()*40;}
  rows.push({salt:800+i+plan.seed%97,youth:true,sex:sexes[Math.floor(r()*3)],elder:false,age:Math.max(12,Math.min(29,age+Math.round(r()*4)-2)),role:'walk',pose:'walk',lane,speed:.58,phase:phase+(i%3)*1.1,offset:(i%3)*.04});
 }
 return rows;
}
export function crowdActivity(row,time,plan){
 const t=((time%60)+60)%60;
 if(row.role==='alms'){if(t>9)return null;const [x0,x1,z]=LANES[row.lane],span=x1-x0,along=Math.min(span,t*1.1+row.phase%8);return {x:x0+along,y:z,dx:1,dy:0,distance:along,moving:true,pose:'walk'};}
 if(row.role==='still')return t>=52&&row.pose!=='sit'?null:{x:row.x,y:row.z,dx:0,dy:0,moving:false,pose:row.pose,facing:row.facing};
 if(t>=54)return null;
 const [left,right,lane]=LANES[row.lane];
 const radius=.07,straight=right-left-2*radius,turn=Math.PI*radius;
 const clock=(time+row.phase)*row.speed,lap=2*(straight+turn);
 const distance=((clock%lap)+lap)%lap;
 const z=lane+(row.offset??0);
 const activity={moving:true,pose:row.pose,distance:Math.abs(clock)};
 if(distance<straight)return {...activity,x:left+radius+distance,y:z,dx:1,dy:0};
 if(distance>=straight+turn&&distance<2*straight+turn){
  return {...activity,x:right-radius-(distance-straight-turn),y:z+2*radius,dx:-1,dy:0};
 }
 // Keep the turn inside the same lane footprint, with continuous position and heading.
 const turningRight=distance<straight+turn;
 const start=turningRight?straight:2*straight+turn;
 const angle=(turningRight?-Math.PI/2:Math.PI/2)+(distance-start)/radius;
 const center=turningRight?right-radius:left+radius;
 return {...activity,x:center+radius*Math.cos(angle),y:z+radius*(1+Math.sin(angle)),dx:-Math.sin(angle),dy:Math.cos(angle)};
}
