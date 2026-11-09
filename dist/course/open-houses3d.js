// The five homes that are not yours, built open like a doll's house: a back wall, a left wall,
// and nothing between the rooms and whoever is watching.
import {m} from './diorama-kit.js';
import {othersOf,LOT_FLOOR,RUNGS} from './housing-ladder.js';
const F=LOT_FLOOR,WALL=m(2.75),S=m(3),TABLE=m(.73);
const stool=(b,x,z,c='#3f6f9a')=>b.cylinder(x,z,F,.09,.08,.235,c,8);
const seat=(b,x,z,c)=>{b.box(x-.14,z-.14,F+.2,.28,.28,.035,c);for(const [a,e] of [[-.13,-.13],[.1,-.13],[-.13,.1],[.1,.1]])b.box(x+a,z+e,F,.03,.03,.2,'#6b5a45');};
function table(b,X,Z,top,leg){b.box(X+1.35,Z+1.75,F+TABLE,1,.5,.035,top);for(const x of [1.37,2.31])for(const z of [1.77,2.21])b.box(X+x,Z+z,F,.04,.04,TABLE,leg);}
function room(b,X,Z,W,D,floor,wall,h=WALL){b.box(X,Z,0,W,D,F,floor);b.box(X,Z,F,W,.07,h,wall);b.box(X,Z,F,.07,D,h,wall);}
// What an income of this size has put in the room, at this year.
function goods(b,X,Z,R,y=F){
 if(R.flatTv)b.box(X+2.2,Z+.09,y+m(1),.7,.02,.4,'#2c3436');else if(R.tv){b.box(X+2.1,Z+.1,y,.7,.3,m(.65),'#7a6248');b.box(X+2.25,Z+.14,y+m(.65),.4,.28,.3,'#5f4a38');}else if(R.radio){b.box(X+2.1,Z+.1,y,.7,.3,m(.65),'#7a6248');b.box(X+2.3,Z+.14,y+m(.65),.3,.14,.17,'#7a5a42');}
 if(R.fan){b.box(X+3.25,Z+.5,y,.03,.03,m(1.15),'#71766f');b.ball(X+3.26,y+m(1.15),Z+.52,.11,.11,.02,'#9aa8a2',8);}
 if(R.fridge)b.box(X+.1,Z+.5,y,.42,.42,m(1.55),'#ded9cc');
 if(R.aircon)b.box(X+1,Z+.08,y+m(2.3),.64,.1,.16,'#ece8dc');
 if(R.computer){b.box(X+.1,Z+1.05,y+TABLE,.3,.5,.015,'#44504f');}
}
const BUILD={
 // Someone else's wall, a sheet tied to it, cardboard, and what can be pushed away in the morning.
 pavement(b,[X,Z,W,D],p){const sheet=p.year>=1970?'#3f6f9a':'#8a8270',bare='#b4ae9e';b.box(X,Z,0,W,D,F,bare);b.box(X,Z,F,W,.1,m(2),'#c9c4b4');b.box(X,Z,F+m(2)-.06,W,.14,.06,'#a29f94');
  b.beam(X+.25,F+m(1.95),Z+.1,X+.25,F+m(1.2),Z+1.05,1.9,.02,sheet);for(const x of [.06,2.1])b.box(X+x+.1,Z+1,F,.03,.03,m(1.2),'#6b5236');
  b.box(X+.3,Z+1.2,F,1.5,1.2,.012,'#b89b6a');b.box(X+.55,Z+1.5,F+.012,.9,.5,.015,'#8f7a5c');
  b.cylinder(X+1.1,Z+1.02,F,.13,.11,.1,'#4a4a48',10);b.ball(X+.5,F+.14,Z+.5,.22,.16,.18,'#7f8a78',7);b.ball(X+.9,F+.13,Z+.45,.2,.14,.16,'#a08a68',7);
  b.box(X+2.6,Z+.35,F+.24,.75,1.2,.2,'#a58a5e');b.ball(X+2.72,F+.13,Z+.38,.13,.13,.012,'#23282a',8);b.ball(X+2.72,F+.13,Z+1.52,.13,.13,.012,'#23282a',8);for(let i=0;i<4;i++)b.ball(X+2.75+i*.16,F+.5,Z+.6+(i%2)*.4,.14,.1,.14,['#d9d2c0','#c9a14a','#7f8a78'][i%3],6);},
 // Sheet metal and ply on planks over ground someone else owns.
 squat(b,[X,Z,W,D],p,R){const zinc='#8d9290',ply='#a58a62';room(b,X,Z,W,D,'#8a7457',zinc,m(2.2));for(let a=.2;a<W;a+=.28)b.box(X+a,Z+.072,F,.012,.006,m(2.2),'#74838a');b.box(X+1.1,Z+.074,F+.25,1,.006,m(1.3),ply);b.box(X+.074,Z+1.2,F+.2,.006,1.1,m(1.2),ply);
  b.beam(X+W/2,F+m(2.2)+.1,Z+.02,X+W/2,F+m(2.2)-.06,Z+.62,W+.2,.025,'#7a8486');
  b.box(X+.35,Z+.8,F,1.25,.85,.03,'#b9a77c');b.box(X+.4,Z+.85,F+.03,1.15,.3,.03,'#e8e2cf');b.cylinder(X+1.2,Z+2.05,F,.13,.11,.12,'#4a4a48',10);b.cylinder(X+3.2,Z+.4,F,.15,.15,.36,'#4f7a8a',10);b.ball(X+2.6,F+.12,Z+2.9,.28,.1,.2,'#d9d2c0',7);
  for(const a of [0,2.7])b.box(X+.3+a,Z+3.2,F,.03,.03,.95,'#6b5236');b.beam(X+.3,F+.92,Z+3.21,X+3,F+.92,Z+3.21,.01,.01,'#2c3436');[['#b5553c',.2],['#e6d9b8',.9],['#4f7a9a',1.7]].forEach(([c,o])=>b.box(X+.3+o,Z+3.2,F+.5,.3,.012,.38,c));goods(b,X,Z,R);},
 // One room, one fan, thin wall through to the next family.
 row(b,[X,Z,W,D],p,R){const w=p.marks.concrete?'#b8aa8e':'#8f6f4c',f=p.marks.concrete?'#9a8a70':'#8a6a48';room(b,X,Z,W,D,f,w);for(let a=.25;a<W;a+=.25)b.box(X+a,Z,F,.008,D,.002,'#74664e');b.box(X+1.1,Z+.075,F+m(1),.9,.012,m(1.1),'#a9c4c4',1);
  b.box(X+.35,Z+.5,F,1.25,.9,R.bed?m(.32):.04,R.bed?'#7d6951':'#b9a77c');b.box(X+.4,Z+.55,F+(R.bed?m(.32):.04),1.15,.28,.04,'#e8e2cf');table(b,X,Z,'#94805f','#77684f');stool(b,X+1.1,Z+2,'#8a7050');stool(b,X+2.5,Z+2,'#8a7050');b.box(X+.1,Z+1.9,F,.42,1,m(.8),'#8a7458');goods(b,X,Z,R);},
 // Shop at the front, family behind it, a bed up the stairs.
 shophouse(b,[X,Z,W,D],p,R){const w=p.palette.wall;room(b,X,Z,W,D,'#b5aa94',w);for(let a=.3;a<W;a+=.3)b.box(X+a,Z,F,.008,D,.002,'#a49982');
  b.box(X,Z,F+S,W,1.4,.06,'#a58a62');b.box(X+.4,Z+.2,F+S+.06,1.25,.85,m(.42),'#7d6951');b.box(X+.45,Z+.25,F+S+.06+m(.42),1.15,.75,.03,'#e4e0d0');for(let i=0;i<5;i++)b.box(X+W-.65,Z+.1+i*.2,F+i*(S/5),.55,.2,.03,'#8a7050');
  table(b,X,Z,'#a58a66','#77684f');seat(b,X+1.1,Z+2,'#9f9377');seat(b,X+2.5,Z+2,'#9f9377');b.box(X+.1,Z+1.9,F,.42,1,m(.86),'#9a8566');b.box(X+.7,Z+3,F,2.2,.34,m(.8),'#9d8965');for(let i=0;i<7;i++)b.ball(X+.85+i*.3,F+m(.8)+.08,Z+3.15,.08,.07,.08,['#c9a14a','#b5553c','#7f8f5a'][i%3],6);goods(b,X,Z,R);},
 // Raised off the ground, swept yard, a salary that arrives.
 bungalow(b,[X,Z,W,D],p,R){const w='#d9cdb4';b.box(X-.05,Z-.05,-.015,W+.1,D+.1,.01,'#7f9a68');room(b,X,Z,W,D-.5,'#a98a62',w);for(let a=.25;a<W;a+=.25)b.box(X+a,Z,F,.008,D-.5,.002,'#8f7350');for(const a of [.9,2.2])b.box(X+a,Z+.075,F+m(1),.9,.012,m(1.2),'#a9c4c4',1);
  b.box(X+.35,Z+.45,F,1.3,.9,m(.42),'#6a5442');b.box(X+.4,Z+.5,F+m(.42),1.2,.8,.04,'#e4e0d0');table(b,X,Z,'#a58a66','#6a5442');seat(b,X+1.1,Z+2,'#9f9377');seat(b,X+2.5,Z+2,'#9f9377');b.box(X+.1,Z+1.7,F,.42,1,m(.86),'#9a8566');b.ball(X+3.2,1,Z+3.1,.34,.42,.34,p.palette.leaf[0],7);b.box(X+3.15,Z+3.05,0,.05,.05,.7,'#6a5a48');goods(b,X,Z,R);},
 // Two storeys, stone underfoot, a wall to keep the street on the street, someone paid to sweep.
 villa(b,[X,Z,W,D],p,R){const w='#f1ece0';b.box(X-.05,Z-.05,-.015,W+.1,D+.1,.01,'#7f9a68');b.box(X,Z,0,W,D-.5,F,'#d8d2c2');b.box(X,Z,F,W,.07,S*1.9,w);b.box(X,Z,F,.07,D-.5,S*1.9,w);for(const a of [.5,1.7])b.box(X+a,Z+.075,F+m(.9),.9,.012,m(1.5),'#a9c4c4',1);
  b.box(X,Z,F+S,W,1.5,.07,'#a98a62');b.box(X+.5,Z+.2,F+S+.07,1.4,1,m(.42),'#5f4a38');b.box(X+.55,Z+.25,F+S+.07+m(.42),1.3,.9,.05,'#efe9d9');for(let a=0;a<W;a+=.28)b.box(X+a,Z+1.48,F+S+.07,.025,.025,.42,'#e6e0d0');b.box(X,Z+1.48,F+S+.49,W,.03,.03,'#e6e0d0');
  table(b,X,Z,'#5f4a38','#4a3a2c');seat(b,X+1.1,Z+2,'#b09a78');seat(b,X+2.5,Z+2,'#b09a78');b.box(X+.1,Z+1.75,F,.42,1,m(.86),'#c9c3b1');b.ball(X+1.85,F+S-.28,Z+2.05,.17,.16,.17,'#e8d9a8',8);
  b.box(X+W+.1,Z-.1,0,.07,D+.15,m(1.8),'#e6e0d0');if(p.year>=1960){const c=p.palette.accent;b.box(X+1.6,Z+D-.45,.1,1.5,.42,.22,c);b.box(X+1.9,Z+D-.42,.32,.8,.36,.2,'#55686e');for(const a of [1.75,2.8])for(const e of [-.45,-.03])b.box(X+a,Z+D+e,0,.22,.02,.22,'#23282a');}goods(b,X,Z,R);}
};
export function buildOpenHouses(batch,plan,roomFor){
 if(plan.abroad)return;
 for(const {rung,lot} of othersOf(plan.rung))BUILD[RUNGS[rung].id](batch,lot,plan,roomFor(rung));
}
