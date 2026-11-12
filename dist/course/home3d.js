// The life's own room: same footprints every life, so routines and seats hold; what stands on
// them, and what the walls are made of, follow the place, the income and the year.
import {furniture} from './layout.js';
import {HOME,HOME_FACING,KITCHEN,RUG} from './routines.js';
import {m} from './diorama-kit.js';
import {kitchenFeeds} from './diorama-plan.js';
const FLOOR=.16,WALL=m(2.75);
const KINDS={
 stilt:{floor:'#8a6a48',lines:'#6d5236',wall:'#8f6f4c',wallLines:'#6f5438',roof:'#8b7c68',shape:'gable'},
 plank:{floor:'#94795a',lines:'#745b40',wall:'#9fb0ab',wallLines:'#7f928d',roof:'#a45b45',shape:'gable'},
 shack:{floor:'#8a7457',lines:'#6e5a42',wall:'#8e9ca0',wallLines:'#74838a',roof:'#7a8486',shape:'mono'},
 shophouse:{floor:'#b5aa94',lines:'#a49982',wall:'#e0d4b8',roof:'#a56a50',shape:'floors',floors:2},
 flat:{floor:'#c7bca6',lines:'#b3a891',wall:'#dcd8cc',roof:'#a7a497',shape:'floors',floors:3},
 condo:{floor:'#c2a883',lines:'#aa9069',wall:'#efebe0',roof:'#a7a497',shape:'floors',floors:7},
 villa:{floor:'#a98a62',lines:'#8f7350',wall:'#f1ece0',roof:'#5f6a6a',shape:'hip'},
 hdb:{floor:'#bcae96',lines:'#a89a80',wall:'#e8e2d4',roof:'#a7a497',shape:'floors',floors:5},
 tatami:{floor:'#b8b28a',lines:'#979069',wall:'#ddd8cc',roof:'#4f5a5e',shape:'gable'},
 triple:{floor:'#b59a78',lines:'#997e5d',wall:'#c9d2d6',roof:'#eef1f2',shape:'gable'},
 terrace:{floor:'#8f8e80',lines:'#7c7b6e',wall:'#d9cdb8',roof:'#4d5254',shape:'gable'},
 row:{floor:'#9a8a70',lines:'#74664e',wall:'#b8aa8e',roof:'#7a8486',shape:'mono'},
 bungalow:{floor:'#a98a62',lines:'#8f7350',wall:'#d9cdb4',roof:'#8b6a52',shape:'gable'},
 pavement:{floor:'#b4ae9e',lines:'#a8a292',wall:'#c9c4b4',roof:'#3f6f9a',shape:'sheet'}
};
export function furnishHome({root,batchOf,group,chair,plan}){
 const K=KINDS[plan.homeKind]??KINDS.shophouse,R=plan.room,b=batchOf(root),floor=plan.homeKind==='shophouse'||plan.homeKind==='flat'?K.floor:K.floor,wall=['stilt','plank','shack','row','bungalow','pavement'].includes(plan.homeKind)?K.wall:plan.palette.wall,acc=plan.palette.accent,poor=plan.homeKind==='pavement'||plan.homeKind==='shack',seatAt=(x,z,a,f,p)=>{if(!poor)return chair(x,z,a,f,p);b.cylinder(x,z,f,.09,.08,furnishHome.metrics.seat+.03,'#3f6f9a',8);};
 const bare=plan.homeKind==='pavement',wallH=bare?m(1.7):WALL;
 b.box(3,3,0,4,3.6,FLOOR,floor);
 if(!bare)for(let x=3;x<7;x+=plan.homeKind==='tatami'?1:.25)b.box(x,3,FLOOR,.008,3.6,.002,K.lines);
 if(plan.homeKind==='tatami')for(let z=3;z<6.6;z+=.9)b.box(3,z,FLOOR,4,.008,.002,K.lines);
 if(!plan.lift)b.box(3,6.6,0,4,.6,FLOOR*.5,floor);
 const wallBand=(x,z,w,d)=>{b.box(x,z,FLOOR,w,d,wallH,wall);if(bare)b.box(x-.02,z-.02,FLOOR+wallH,w+.04,d+.04,.05,'#a29f94');if(K.wallLines){if(w>d)for(let a=.18;a<w;a+=.2)b.box(x+a,z+d,FLOOR,.008,.003,WALL,K.wallLines);else for(let a=.18;a<d;a+=.2)b.box(x+w,z+a,FLOOR,.003,.008,WALL,K.wallLines);}};
 wallBand(3,3,4,.08);wallBand(3,3,.08,3.6);
 // Window in the back wall, with whatever hangs at it in this house.
 if(plan.homeKind!=='pavement')b.box(3.95,3.085,FLOOR+m(1),1.15,.012,m(1.2),plan.homeKind==='tatami'?'#e9e6da':'#a9c4c4',1);b.box(3.92,3.085,FLOOR+m(1)-.03,1.2,.02,.03,'#7d6951');if(plan.tier>=2||plan.abroad){b.box(3.8,3.1,FLOOR+m(.9),.14,.02,m(1.5),acc);b.box(5.08,3.1,FLOOR+m(.9),.14,.02,m(1.5),acc);}
 // Bed: a mat for the poorest early lives, a real frame otherwise.
 const bed=furniture[0],bx=bed.x+.06,bz=bed.y+.1,bw=bed.w-.12,bd=bed.d-.25;
 if(!R.bed||plan.homeKind==='tatami'){b.box(bx,bz,FLOOR,bw,bd,.035,plan.homeKind==='tatami'?'#e4e0d0':'#b9a77c');b.box(bx+.05,bz+.05,FLOOR+.035,bw-.1,bd*.32,.04,'#e8e2cf');b.box(bx+.05,bz+bd*.4,FLOOR+.035,bw-.1,bd*.5,.02,acc);if(plan.homeKind==='stilt'||plan.homeKind==='plank'){for(const [a,e] of [[0,0],[bw,0],[0,bd],[bw,bd]])b.box(bx+a,bz+e,FLOOR,.012,.012,m(1.5),'#d8d2c0');for(const [a,e,w,dd] of [[0,0,bw,.012],[0,bd,bw,.012],[0,0,.012,bd],[bw,0,.012,bd]])b.box(bx+a,bz+e,FLOOR+m(1.5),w,dd,.012,'#e6e0d0');}}
 else{const c=plan.tier>=3?'#5f4a38':'#7d6951',top=FLOOR+m(.45);b.box(bx,bz,FLOOR,bw,bd,m(.3),c);b.box(bx+.02,bz+.02,FLOOR+m(.3),bw-.04,bd-.04,m(.15),'#e4e0d0');b.box(bx+.05,bz+.08,top,bw-.1,bd*.22,.05,'#efe9d9');b.box(bx+.03,bz+bd*.36,top,bw-.06,bd*.62,.018,acc);b.box(bx,bz-.04,FLOOR,bw,.05,m(.85),c);}
 // Desk, always where the desk route ends; its lamp and machine change with the decade.
 const desk=furniture[2],deskTop=FLOOR+furnishHome.metrics.tableTop;b.box(desk.x+.02,desk.y+.04,deskTop,desk.w-.04,desk.d-.08,.035,bare?'#b89b6a':'#b09a78');if(bare)b.box(desk.x+.1,desk.y+.12,FLOOR,desk.w-.2,desk.d-.24,deskTop-FLOOR,'#a58a5e');else for(const [a,e] of [[.04,.08],[desk.w-.09,.08],[.04,desk.d-.13],[desk.w-.09,desk.d-.13]])b.box(desk.x+a,desk.y+e,FLOOR,.04,.04,deskTop-FLOOR,'#8c795e');
 b.box(desk.x+.1,desk.y+.2,deskTop+.035,.2,.28,.012,'#ece5d5');if(R.computer){b.box(desk.x+.34,desk.y+.3,deskTop+.035,.28,.2,.015,'#44504f');b.box(desk.x+.34,desk.y+.48,deskTop+.05,.28,.015,.2,'#3a4648');}else if(R.oilLamp)b.cylinder(desk.x+.5,desk.y+.3,deskTop+.035,.05,.03,.2,'#b5a16d',8);
 const seat=furniture[3];seatAt(seat.x+seat.w/2,seat.y+seat.d/2,Math.PI,FLOOR,root);
 for(const [name,[x,z]] of Object.entries(HOME))seatAt(x,z,HOME_FACING[name],FLOOR,root);
 // Dining table.
 const d=furniture[4],top=FLOOR+furnishHome.metrics.tableTop;b.box(d.x,d.y,top,d.w,d.d,.035,bare?'#b89b6a':plan.tier>=2?'#a58a66':'#94805f');if(bare)for(const x of [d.x+.04,d.x+d.w-.34])b.box(x,d.y+.06,FLOOR,.3,d.d-.12,top-FLOOR,'#a58a5e');else for(const x of [d.x,d.x+d.w-.04])for(const z of [d.y,d.y+d.d-.04])b.box(x,z,FLOOR,.04,.04,top-FLOOR,'#77684f');const plates=[[5.4,6.3],[6,6.3],[5.7,6.24],[5.55,6.47],[5.9,6.47]].map(([x,z])=>{const g=group();batchOf(g).ball(x,top+.05,z,.09,.018,.09,'#e7dfcc',8);return g;});
 // Kitchen corner beside the routine's cook spot.
 if(poor){b.cylinder(3.5,5.9,FLOOR,.14,.11,.14,'#4a4a48',10);b.ball(3.5,FLOOR+.2,5.9,.1,.07,.1,'#5a5f5a',8);}else{b.box(3.1,5.3,FLOOR,.42,1.2,m(.86),'#9a8566');b.box(3.08,5.28,FLOOR+m(.86),.46,1.24,.03,plan.year>=1975?'#c9c3b1':'#a08868');}
 if(poor){}else if(plan.year>=1970&&!R.oilLamp)b.box(3.14,5.62,FLOOR+m(.86)+.03,.34,.3,.03,'#3f4644');else b.cylinder(3.3,5.78,FLOOR+m(.86)+.03,.13,.11,.1,'#8f6a4a',10);
 if(!poor)b.ball(3.3,FLOOR+m(.86)+.14,5.76,.1,.07,.1,'#5a5f5a',8);
 // The room the word for family is built on: what stands here says who these people are.
 const fx=poor?3.5:3.3,fz=poor?5.9:5.76,fy=poor?FLOOR+.14:FLOOR+m(.86)+.05;
 b.ball(3.25,FLOOR+.2,6.55,.17,.2,.17,'#7a5a42',8);b.box(3.09,5.2,FLOOR+m(1.55),.14,1.3,.03,'#8c795e');for(let i=0;i<5;i++)b.ball(3.16,FLOOR+m(1.55)+.07,5.32+i*.24,.05,.04,.05,['#e7dfcc','#b5553c','#d8c7a4'][i%3],7);
 const gas=!poor&&plan.year>=1975&&plan.marks.concrete,fire=group();
 if(gas){b.cylinder(fx,fz,fy-.02,.12,.12,.02,'#2c3436',12);b.cylinder(fx,fz,fy,.05,.05,.02,'#6b7270',10);}
 // Each tongue of flame is its own small piece, so it can leap on its own.
 const tongues=Array.from({length:9},(_,i)=>{const a=i/9*Math.PI*2,g=group(fire);g.position.set(fx+Math.cos(a)*.085,fy+.015,fz+Math.sin(a)*.085);const t=batchOf(g);t.ball(0,.045,0,.022,.05,.022,gas?'#5aa8ff':'#ffae42',5);t.ball(0,.1,0,.016,.05,.016,'#ffb347',5);return g;});
 const wok=group();wok.position.set(fx,fy+.13,fz);{const w=batchOf(wok);w.ball(0,0,0,.17,.05,.17,'#2c2c2a',10);w.box(.14,-.012,.03,.2,.024,.024,'#3a3a38');for(let i=0;i<6;i++)w.ball(Math.cos(i*2)*.08,.05,Math.sin(i*2)*.08,.022,.015,.022,['#c8372d','#e0a020','#4f7a3a'][i%3],5);}
 const steam=group(),puffs=batchOf(steam);for(let i=0;i<3;i++)puffs.ball(fx+i*.03,fy+.34+i*.14,fz+(i%2)*.03,.05+i*.015,.05,.05,i?'#e6e3da':'#d9856a',6);
 // What the decade and the income have put in the room.
 const backShelf=FLOOR+m(.9);
 if(!bare)b.box(5.3,3.1,FLOOR,.62,.22,m(.7),'#8c795e');
 if(R.flatTv)b.box(5.32,3.14,backShelf-.02,.58,.02,.34,'#2c3436');else if(R.tv){b.box(5.42,3.12,backShelf-.04,.38,.28,.3,'#5f4a38');b.box(5.46,3.4,backShelf,.3,.008,.22,'#46555a');}else if(R.radio)b.box(5.46,3.14,backShelf-.04,.3,.14,.17,'#7a5a42');
 if(R.phone&&!R.flatTv)b.box(5.82,3.16,backShelf-.04,.13,.12,.06,'#d8d2c2');
 if(R.fridge)b.box(3.12,4.82,FLOOR,.4,.42,m(1.55),'#ded9cc');
 if(R.fan){b.box(6.67,4.95,FLOOR,.03,.03,m(1.15),'#71766f');b.ball(6.68,FLOOR+m(1.15),4.97,.11,.11,.02,'#9aa8a2',8);}
 if(R.aircon)b.box(4.4,3.09,FLOOR+m(2.3),.64,.1,.16,'#ece8dc');
 if(R.sewing){b.box(6.45,3.15,FLOOR,.42,.26,m(.66),'#6a5642');b.box(6.5,3.2,FLOOR+m(.66),.28,.12,.14,'#2f3436');}
 if(R.altar&&plan.faith==='muslim'){b.box(3.09,3.6,FLOOR+m(1.5),.012,.8,.34,'#1f4f3f');for(let i=0;i<5;i++)b.beam(3.08,FLOOR+m(1.5)+.1+(i%2)*.1,3.68+i*.13,3.08,FLOOR+m(1.5)+.2-(i%2)*.1,3.76+i*.13,.016,.016,'#d9b24a');}
 else if(R.altar){b.box(3.095,3.35,FLOOR+m(1.7),.14,.5,.03,'#a08868');b.ball(3.16,FLOOR+m(1.7)+.09,3.6,.05,.07,.04,'#c9a14a',7);b.ball(3.16,FLOOR+m(1.7)+.17,3.6,.025,.03,.025,'#c9a14a',6);b.cylinder(3.16,3.42,FLOOR+m(1.7)+.03,.02,.03,.08,'#d9d2c0',6);b.cylinder(3.16,3.78,FLOOR+m(1.7)+.03,.02,.03,.08,'#d9d2c0',6);}
 // A rug for lives that own one; bare boards otherwise. Plant in the corner.
 if(plan.tier>=1){b.box(RUG[0]-.42,RUG[1]-.4,FLOOR,.84,.76,.004,acc);b.box(RUG[0]-.36,RUG[1]-.34,FLOOR+.004,.72,.64,.002,'#d9cfb8');}
 if(bare){b.box(5.75,3.2,FLOOR+.24,1,.62,.2,'#a58a5e');b.ball(5.9,FLOOR+.13,3.82,.13,.13,.012,'#23282a',8);b.ball(6.6,FLOOR+.13,3.82,.13,.13,.012,'#23282a',8);for(let i=0;i<4;i++)b.ball(5.95+i*.2,FLOOR+.5,3.4+(i%2)*.2,.14,.1,.14,['#d9d2c0','#c9a14a','#7f8a78'][i%3],6);b.ball(4.05,FLOOR+.14,3.3,.22,.16,.18,'#7f8a78',7);b.ball(4.45,FLOOR+.13,3.28,.2,.14,.16,'#a08a68',7);}
 else{b.box(6.62,3.22,FLOOR,.22,.22,.2,'#a5533f');b.ball(6.73,FLOOR+.35,3.33,.17,.22,.17,'#4f7a4a',7);}
 if(plan.homeKind==='villa'&&!plan.abroad){b.box(2.55,2.6,-.015,.45,4.4,.01,'#7f9a68');b.box(2.5,2.6,0,.07,4.4,m(1.8),'#e6e0d0');b.box(2.5,2.6,0,4.5,.07,m(1.8),'#e6e0d0');}
 storeys(b,plan,wall);
 // Height marks and shelves come from inhabited3d; the kitchen stool stays out of every route.
 void KITCHEN;
 return {update(state,age,context,time,cooking=false){const feeds=kitchenFeeds(state,age);plates.forEach((p,i)=>{p.visible=i<feeds;});fire.visible=cooking;wok.visible=cooking||poor===false;steam.visible=cooking;if(!cooking)return;
  // Every few seconds the wok catches: the whole ring leaps, and the pan is tossed.
  const flare=Math.max(0,Math.sin(time*1.7))**8,toss=flare*.05;tongues.forEach((g,i)=>{g.scale.y=.7+Math.abs(Math.sin(time*(17+i*1.3)+i*2.1))*.75+flare*2.2;g.scale.x=g.scale.z=.85+Math.sin(time*23+i)*.2;});wok.position.y=fy+.13+toss;wok.rotation.z=Math.sin(time*5.5)*.05+toss;steam.position.y=(time*.35)%.14;}};
}
furnishHome.metrics={seat:.235,tableTop:m(.73)};
// The room is one floor of a building. Its back walls rise into the rest of it, cut open like a
// doll's house, so a condo child sees the tower they live in and a shophouse child the family above the shop.
// ponytail: storey counts are authored per kind, not drawn from any survey. They match the closed shell in buildHomeShell (KINDS floors; the villa's upper storey under its hip).
const ABOVE={shophouse:2,flat:3,condo:7,villa:1};
function storeys(b,plan,wall){
 const n=ABOVE[plan.homeKind]??0;if(!n||plan.abroad)return;
 const S=m(3),base=FLOOR+WALL,acc=plan.palette.accent,r=lifeR(plan.seed),condo=plan.homeKind==='condo'||plan.homeKind==='flat';
 for(let f=0;f<n;f++){const y=base+f*S;
  b.box(3,3,y,4,.08,S,wall);b.box(3,3,y,.08,3.6,S,wall);
  // The floor above, open to the street: a strip deep enough to hold someone else's life.
  b.box(3,3,y-.03,4,1.05,.06,'#c9c3b1');b.box(3,3,y-.03,1.05,3.6,.06,'#c9c3b1');
  for(const x of [3.4,4.6,5.8])b.box(x,3.085,y+m(1),.8,.012,m(1.2),'#a9c4c4',r()<.6?1:0);
  for(const z of [4.2,5.4])b.box(3.085,z,y+m(1),.012,.8,m(1.2),'#a9c4c4',r()<.6?1:0);
  if(condo){b.box(5.9+r()*.3,3.1,y+m(2.2),.5,.14,.18,'#ece8dc');if(r()<.6)for(let i=0;i<3;i++)b.box(3.3+i*.32,4,y+m(1.4),.22,.012,.3,['#b5553c','#e6d9b8','#4f7a9a'][i]);}
  else if(plan.homeKind==='shophouse'){b.box(3.2,3.2,y+.03,1.1,.6,m(.42),'#7d6951');b.box(3.25,3.25,y+.03+m(.42),1,.5,.03,'#e4e0d0');b.ball(6.5,y+.3,3.4,.2,.26,.2,'#4f7a4a',7);}
  else{for(let a=3.2;a<7;a+=.28)b.box(a,4.03,y+.03,.025,.025,.42,'#e6e0d0');b.box(3,4.03,y+.45,4,.03,.03,'#e6e0d0');}
  if(f>0||condo)b.box(3,4.03,y+.03,4,.02,.02,acc);
 }
 // A shophouse opens to the street: steel shutters folded back, a sign, the day's goods on the step.
 if(plan.homeKind==='shophouse'){for(const x of [3.02,5.9])for(let i=0;i<5;i++)b.box(x+i*.075,6.56,FLOOR,.06,.05,WALL,'#8d9290');b.box(3,6.54,FLOOR+WALL-m(.55),4,.05,m(.55),acc);b.box(3.3,6.53,FLOOR+WALL-m(.42),2.2,.012,m(.25),'#ece7da');
  for(let i=0;i<4;i++){const x=3.12+i*.32;b.box(x,6.66,0,.28,.3,.18,'#8a6c4c');for(let k=0;k<3;k++)b.ball(x+.06+k*.08,.22,6.81,.05,.045,.05,['#d9a92e','#b5553c','#6f8a3f','#e6d9b8'][(i+k)%4],6);}}
 const top=base+n*S;b.box(2.95,2.95,top,4.1,1.15,.08,'#a7a497');b.box(2.95,2.95,top,1.15,3.7,.08,'#a7a497');
}
const lifeR=seed=>{let h=(seed*2654435761)>>>0;return ()=>{h=(h+0x6d2b79f5)>>>0;let t=Math.imul(h^h>>>15,h|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};};
// Everything that closes the dollhouse when the player is out in the street.
export function buildHomeShell({group,batchOf,plan,register}){
 const K=KINDS[plan.homeKind]??KINDS.shophouse,g=group(),b=batchOf(g),wall=['stilt','plank','shack','row','bungalow'].includes(plan.homeKind)?K.wall:plan.palette.wall,H=FLOOR+WALL;
 // No house to close: a sheet tied to someone else's wall.
 if(K.shape==='sheet'){b.beam(5,H-.1,3.1,5,FLOOR+m(1.25),4.6,3.6,.02,plan.year>=1970?K.roof:'#8a8270');for(const x of [3.4,6.5])b.box(x,4.55,FLOOR,.03,.03,m(1.25),'#6b5236');register(g);return {group:g};}
 b.box(3,6.52,FLOOR,3.3,.08,WALL,wall);b.box(6.92,3,FLOOR,.08,3.6,WALL,wall);b.box(6.3,6.52,FLOOR+m(2.1),.7,.08,WALL-m(2.1),wall);
 for(const x of [3.5,5])b.box(x,6.6,FLOOR+m(1),.9,.012,m(1.2),'#3e4e54',1);for(const z of [3.6,5.1])b.box(7,z,FLOOR+m(1),.012,.9,m(1.2),'#3e4e54',1);
 if(K.shape==='gable')b.gable(3,3,H,4,3.6,m(1.5),K.roof,{over:.18,along:'x',gableColor:wall});
 else if(K.shape==='hip'){const up=plan.homeKind==='villa'&&!plan.abroad?m(3):0;if(up)b.box(3,3,H,4,3.6,up,wall);b.hip(3,3,H+up,4,3.6,m(1.6),K.roof,.2);}
 else if(K.shape==='mono')b.beam(2.85,H+.26,4.8,7.15,H-.02,4.8,3.95,.03,K.roof);
 else{const up=K.floors,h=m(3)*up;b.box(3,3,H,4,3.6,h,wall);for(let f=0;f<up;f++){for(const x of [3.3,4.5,5.7])b.box(x,6.6,H+f*m(3)+m(1),.8,.012,m(1.2),'#3e4e54',(x*(f+3)*7%1)<.6?1:0);b.box(2.97,6.6,H+f*m(3),4.06,.16,.04,'#c9c6ba');}b.box(2.97,2.97,H+h,4.06,3.66,.06,K.roof);}
 register(g);
 return {group:g};
}
