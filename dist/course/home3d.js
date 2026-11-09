// The life's own room: same footprints every life, so routines and seats hold; what stands on
// them, and what the walls are made of, follow the place, the income and the year.
import {furniture} from './layout.js';
import {HOME,HOME_FACING,KITCHEN,RUG} from './routines.js';
import {m} from './diorama-kit.js';
const FLOOR=.16,WALL=m(2.75);
const KINDS={
 stilt:{floor:'#8a6a48',lines:'#6d5236',wall:'#8f6f4c',wallLines:'#6f5438',roof:'#8b7c68',shape:'gable'},
 plank:{floor:'#94795a',lines:'#745b40',wall:'#9fb0ab',wallLines:'#7f928d',roof:'#a45b45',shape:'gable'},
 shack:{floor:'#8a7457',lines:'#6e5a42',wall:'#8e9ca0',wallLines:'#74838a',roof:'#7a8486',shape:'mono'},
 shophouse:{floor:'#b5aa94',lines:'#a49982',wall:'#e0d4b8',roof:'#a56a50',shape:'floors',floors:1},
 flat:{floor:'#c7bca6',lines:'#b3a891',wall:'#dcd8cc',roof:'#a7a497',shape:'floors',floors:3},
 condo:{floor:'#c2a883',lines:'#aa9069',wall:'#efebe0',roof:'#a7a497',shape:'floors',floors:6},
 villa:{floor:'#a98a62',lines:'#8f7350',wall:'#f1ece0',roof:'#5f6a6a',shape:'hip'},
 hdb:{floor:'#bcae96',lines:'#a89a80',wall:'#e8e2d4',roof:'#a7a497',shape:'floors',floors:5},
 tatami:{floor:'#b8b28a',lines:'#979069',wall:'#ddd8cc',roof:'#4f5a5e',shape:'gable'},
 triple:{floor:'#b59a78',lines:'#997e5d',wall:'#c9d2d6',roof:'#eef1f2',shape:'gable'},
 terrace:{floor:'#8f8e80',lines:'#7c7b6e',wall:'#d9cdb8',roof:'#4d5254',shape:'gable'}
};
export function furnishHome({root,batchOf,group,chair,plan}){
 const K=KINDS[plan.homeKind]??KINDS.shophouse,R=plan.room,b=batchOf(root),floor=plan.homeKind==='shophouse'||plan.homeKind==='flat'?K.floor:K.floor,wall=['stilt','plank','shack'].includes(plan.homeKind)?K.wall:plan.palette.wall,acc=plan.palette.accent;
 b.box(3,3,0,4,3.6,FLOOR,floor);
 for(let x=3;x<7;x+=plan.homeKind==='tatami'?1:.25)b.box(x,3,FLOOR,.008,3.6,.002,K.lines);
 if(plan.homeKind==='tatami')for(let z=3;z<6.6;z+=.9)b.box(3,z,FLOOR,4,.008,.002,K.lines);
 b.box(3,6.6,0,4,.6,FLOOR*.5,floor);
 const wallBand=(x,z,w,d)=>{b.box(x,z,FLOOR,w,d,WALL,wall);if(K.wallLines){if(w>d)for(let a=.18;a<w;a+=.2)b.box(x+a,z+d,FLOOR,.008,.003,WALL,K.wallLines);else for(let a=.18;a<d;a+=.2)b.box(x+w,z+a,FLOOR,.003,.008,WALL,K.wallLines);}};
 wallBand(3,3,4,.08);wallBand(3,3,.08,3.6);
 // Window in the back wall, with whatever hangs at it in this house.
 b.box(3.95,3.085,FLOOR+m(1),1.15,.012,m(1.2),plan.homeKind==='tatami'?'#e9e6da':'#a9c4c4',1);b.box(3.92,3.085,FLOOR+m(1)-.03,1.2,.02,.03,'#7d6951');if(plan.tier>=2||plan.abroad){b.box(3.8,3.1,FLOOR+m(.9),.14,.02,m(1.5),acc);b.box(5.08,3.1,FLOOR+m(.9),.14,.02,m(1.5),acc);}
 // Bed: a mat for the poorest early lives, a real frame otherwise.
 const bed=furniture[0],bx=bed.x+.06,bz=bed.y+.1,bw=bed.w-.12,bd=bed.d-.25;
 if(!R.bed||plan.homeKind==='tatami'){b.box(bx,bz,FLOOR,bw,bd,.035,plan.homeKind==='tatami'?'#e4e0d0':'#b9a77c');b.box(bx+.05,bz+.05,FLOOR+.035,bw-.1,bd*.32,.04,'#e8e2cf');b.box(bx+.05,bz+bd*.4,FLOOR+.035,bw-.1,bd*.5,.02,acc);if(plan.homeKind==='stilt'||plan.homeKind==='plank'){for(const [a,e] of [[0,0],[bw,0],[0,bd],[bw,bd]])b.box(bx+a,bz+e,FLOOR,.012,.012,m(1.5),'#d8d2c0');for(const [a,e,w,dd] of [[0,0,bw,.012],[0,bd,bw,.012],[0,0,.012,bd],[bw,0,.012,bd]])b.box(bx+a,bz+e,FLOOR+m(1.5),w,dd,.012,'#e6e0d0');}}
 else{const c=plan.tier>=3?'#5f4a38':'#7d6951',top=FLOOR+m(.45);b.box(bx,bz,FLOOR,bw,bd,m(.3),c);b.box(bx+.02,bz+.02,FLOOR+m(.3),bw-.04,bd-.04,m(.15),'#e4e0d0');b.box(bx+.05,bz+.08,top,bw-.1,bd*.22,.05,'#efe9d9');b.box(bx+.03,bz+bd*.36,top,bw-.06,bd*.62,.018,acc);b.box(bx,bz-.04,FLOOR,bw,.05,m(.85),c);}
 // Desk, always where the desk route ends; its lamp and machine change with the decade.
 const desk=furniture[2],deskTop=FLOOR+furnishHome.metrics.tableTop;b.box(desk.x+.02,desk.y+.04,deskTop,desk.w-.04,desk.d-.08,.035,'#b09a78');for(const [a,e] of [[.04,.08],[desk.w-.09,.08],[.04,desk.d-.13],[desk.w-.09,desk.d-.13]])b.box(desk.x+a,desk.y+e,FLOOR,.04,.04,deskTop-FLOOR,'#8c795e');
 b.box(desk.x+.1,desk.y+.2,deskTop+.035,.2,.28,.012,'#ece5d5');if(R.computer){b.box(desk.x+.34,desk.y+.3,deskTop+.035,.28,.2,.015,'#44504f');b.box(desk.x+.34,desk.y+.48,deskTop+.05,.28,.015,.2,'#3a4648');}else if(R.oilLamp)b.cylinder(desk.x+.5,desk.y+.3,deskTop+.035,.05,.03,.2,'#b5a16d',8);
 const seat=furniture[3];chair(seat.x+seat.w/2,seat.y+seat.d/2,Math.PI,FLOOR,root);
 for(const [name,[x,z]] of Object.entries(HOME))chair(x,z,HOME_FACING[name],FLOOR,root);
 // Dining table.
 const d=furniture[4],top=FLOOR+furnishHome.metrics.tableTop;b.box(d.x,d.y,top,d.w,d.d,.035,plan.tier>=2?'#a58a66':'#94805f');for(const x of [d.x,d.x+d.w-.04])for(const z of [d.y,d.y+d.d-.04])b.box(x,z,FLOOR,.04,.04,top-FLOOR,'#77684f');for(const [x,z] of [[5.4,6.3],[5.75,6.25],[6,6.3]])b.ball(x,top+.05,z,.09,.018,.09,'#e7dfcc',8);
 // Kitchen corner beside the routine's cook spot.
 b.box(3.1,5.3,FLOOR,.42,1.2,m(.86),'#9a8566');b.box(3.08,5.28,FLOOR+m(.86),.46,1.24,.03,plan.year>=1975?'#c9c3b1':'#a08868');
 if(plan.year>=1970&&!R.oilLamp)b.box(3.14,5.62,FLOOR+m(.86)+.03,.34,.3,.03,'#3f4644');else b.cylinder(3.3,5.78,FLOOR+m(.86)+.03,.13,.11,.1,'#8f6a4a',10);
 b.ball(3.3,FLOOR+m(.86)+.14,5.76,.1,.07,.1,'#5a5f5a',8);
 // What the decade and the income have put in the room.
 const backShelf=FLOOR+m(.9);
 b.box(5.3,3.1,FLOOR,.62,.22,m(.7),'#8c795e');
 if(R.flatTv)b.box(5.32,3.14,backShelf-.02,.58,.02,.34,'#2c3436');else if(R.tv){b.box(5.42,3.12,backShelf-.04,.38,.28,.3,'#5f4a38');b.box(5.46,3.4,backShelf,.3,.008,.22,'#46555a');}else if(R.radio)b.box(5.46,3.14,backShelf-.04,.3,.14,.17,'#7a5a42');
 if(R.phone&&!R.flatTv)b.box(5.82,3.16,backShelf-.04,.13,.12,.06,'#d8d2c2');
 if(R.fridge)b.box(3.12,4.82,FLOOR,.4,.42,m(1.55),'#ded9cc');
 if(R.fan){b.box(6.67,4.95,FLOOR,.03,.03,m(1.15),'#71766f');b.ball(6.68,FLOOR+m(1.15),4.97,.11,.11,.02,'#9aa8a2',8);}
 if(R.aircon)b.box(4.4,3.09,FLOOR+m(2.3),.64,.1,.16,'#ece8dc');
 if(R.sewing){b.box(6.45,3.15,FLOOR,.42,.26,m(.66),'#6a5642');b.box(6.5,3.2,FLOOR+m(.66),.28,.12,.14,'#2f3436');}
 if(R.altar){b.box(3.095,3.35,FLOOR+m(1.7),.14,.5,.03,'#a08868');b.cylinder(3.16,3.5,FLOOR+m(1.7)+.03,.03,.04,.1,'#c9a14a',6);b.cylinder(3.16,3.72,FLOOR+m(1.7)+.03,.03,.04,.1,'#c9a14a',6);}
 // A rug for lives that own one; bare boards otherwise. Plant in the corner.
 if(plan.tier>=1){b.box(RUG[0]-.42,RUG[1]-.4,FLOOR,.84,.76,.004,acc);b.box(RUG[0]-.36,RUG[1]-.34,FLOOR+.004,.72,.64,.002,'#d9cfb8');}
 b.box(6.62,3.22,FLOOR,.22,.22,.2,'#a5533f');b.ball(6.73,FLOOR+.35,3.33,.17,.22,.17,'#4f7a4a',7);
 // Height marks and shelves come from inhabited3d; the kitchen stool stays out of every route.
 void KITCHEN;
 return {update(){}};
}
furnishHome.metrics={seat:.235,tableTop:m(.73)};
// Everything that closes the dollhouse when the player is out in the street.
export function buildHomeShell({group,batchOf,plan,register}){
 const K=KINDS[plan.homeKind]??KINDS.shophouse,g=group(),b=batchOf(g),wall=['stilt','plank','shack'].includes(plan.homeKind)?K.wall:plan.palette.wall,H=FLOOR+WALL;
 b.box(3,6.52,FLOOR,3.3,.08,WALL,wall);b.box(6.92,3,FLOOR,.08,3.6,WALL,wall);b.box(6.3,6.52,FLOOR+m(2.1),.7,.08,WALL-m(2.1),wall);
 for(const x of [3.5,5])b.box(x,6.6,FLOOR+m(1),.9,.012,m(1.2),'#3e4e54',1);for(const z of [3.6,5.1])b.box(7,z,FLOOR+m(1),.012,.9,m(1.2),'#3e4e54',1);
 if(K.shape==='gable')b.gable(3,3,H,4,3.6,m(1.5),K.roof,{over:.18,along:'x',gableColor:wall});
 else if(K.shape==='hip')b.hip(3,3,H,4,3.6,m(1.6),K.roof,.2);
 else if(K.shape==='mono')b.beam(2.85,H+.26,4.8,7.15,H-.02,4.8,3.95,.03,K.roof);
 else{const up=K.floors,h=m(3)*up;b.box(3,3,H,4,3.6,h,wall);for(let f=0;f<up;f++){for(const x of [3.3,4.5,5.7])b.box(x,6.6,H+f*m(3)+m(1),.8,.012,m(1.2),'#3e4e54',(x*(f+3)*7%1)<.6?1:0);b.box(2.97,6.6,H+f*m(3),4.06,.16,.04,'#c9c6ba');}b.box(2.97,2.97,H+h,4.06,3.66,.06,K.roof);}
 register(g);
 return {group:g};
}
