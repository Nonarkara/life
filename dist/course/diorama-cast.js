// The people who are not family: who is about in this place and year, and what they are doing.
// Pure data. Every figure is on the road, at a stall or in a field, never inside a building.
import {lifeRandom} from './diorama-plan.js';
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
const LANES=[[-5,17.6,8.45],[-5,6.7,8.6],[9.4,17.6,8.3]];
export function crowdRoster(plan){
 const r=lifeRandom(plan.seed,'crowd'+plan.regionId),n=plan.crowd,year=plan.year,thai=!plan.abroad,rows=[];
 const stations=[...(STATIONS[plan.style]??STATIONS.market)];
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
export function crowdActivity(row,time,plan){
 const t=((time%60)+60)%60;
 if(row.role==='alms'){if(t>9)return null;const [x0,x1,z]=LANES[row.lane],span=x1-x0,along=Math.min(span,t*1.1+row.phase%8);return {x:x0+along,y:z,dx:1,dy:0,distance:t*.55,moving:true,pose:'walk'};}
 if(row.role==='still')return t>=52&&row.pose!=='sit'?null:{x:row.x,y:row.z,dx:0,dy:0,moving:false,pose:row.pose,facing:row.facing};
 if(t>=54)return null;
 const [x0,x1,z]=LANES[row.lane],span=x1-x0,clock=time*row.speed+row.phase*row.speed,d=((clock%(2*span))+2*span)%(2*span),out=d<span,x=out?x0+d:x1-(d-span);
 // The stride counts total distance walked, so it never runs backward on the return leg.
 return {x,y:z+(out?0:.14),dx:out?1:-1,dy:0,distance:Math.abs(clock),moving:true,pose:row.pose};
}
