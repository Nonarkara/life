import * as T from 'three';
import {createBatch,bake,m} from './diorama-kit.js';
import {lifeRandom} from './diorama-plan.js';
import {crowdRoster} from './diorama-cast.js';
import {LOTS,clearOfLots} from './housing-ladder.js';
// The town on the board. Institutions keep their positions in every life (school, work,
// market, clinic), so routes and seats never move; everything else is laid out here from the
// life's seed, its place and its year. Free-standing props are plain data so tests can prove
// none of them sits on anyone's daily path.
export const FOOTPRINTS={market:[-.5,-.5,2.5,2],school:[9,-1,3,2],work:[11,3,3,2],clinic:[1,11,2.3,2],f1:[2.9,-.5,2,2.8],f2:[4.9,-.5,2,2.8],f3:[-2,-2,1.8,1.5],city:[0,-3,1.9,1.6]};
// [kind, x, z, w, d, gate]. gate names a mark in eraMarks; `!name` means until that mark.
export const PROPS={
 market:[['spirit',2,6.3],['cart',-1.4,9.2,.9,.55],['samlor',.6,9.2,.9,.5,'samlor'],['tuktuk',.6,9.3,1,.6,'tuktuk'],['bananas',-.8,5.9],['motorbike',-2.8,9.3,.8,.3,'motorbike'],['winstand',13.5,9.0,.7,.3,'winTaxi']],
 slum:[['spirit',2,6.3],['cart',-1.4,9.2,.9,.55],['laundry',.4,5.0,1.8,.2],['drum',-.6,6.2,.3,.3]],
 village:[['spirit',2,6.3],['bananas',-.8,6],['bananas',5.8,10.6],['buffalo',-1.6,9.7,.95,.42],['jar',.8,6.2,.3,.3],['bicycle',.9,9.2,.8,.2,'bicycle'],['pickup',-3.9,9.2,1.3,.7,'pickup']],
 fringe:[['spirit',2,6.3],['bananas',-.8,6],['buffalo',-1.6,9.7,.95,.42],['samlor',.6,9.2,.9,.5,'samlor'],['pickup',-3.9,9.2,1.3,.7,'pickup']],
 condo:[['spirit',2,6.3],['cart',-1.4,9.2,.9,.55],['car',.3,9.3,1.5,.7,'pickup'],['motorbike',-2.8,9.3,.8,.3,'motorbike'],['winstand',13.5,9.0,.7,.3,'winTaxi'],['rider',-.5,5.9,.8,.3,'rider']],
 coast:[['spirit',2,6.3],['net',.4,9.4,1.6,.8],['cart',-2.2,10.2,.9,.55],['bananas',-.8,5.4],['pickup',-1.2,5.6,1.3,.7,'pickup'],['motorbike',.9,6.2,.8,.3,'motorbike']],
 beach:[['spirit',2,6.3],['cart',-1.4,9.2,.9,.55],['samlor',.6,9.2,.9,.5,'samlor'],['motorbike',-2.8,9.3,.8,.3,'motorbike'],['bananas',-.8,5.9]],
 villa:[['spirit',2,6.3],['car',13.6,9.4,1.5,.7,'pickup'],['rider',13.5,9.1,.8,.3,'rider']],
 tower:[['bench',.2,5.2,.9,.3],['bench',1.3,5.2,.9,.3]],
 tokyo:[['vending',.5,5.9,.4,.3],['vending',1,5.9,.4,.3],['pole',2.2,6.5,.1,.1],['pole',-1.8,6.6,.1,.1],['bicycle',-3.4,6.4,.8,.2]],
 newengland:[['hydrant',.4,6.6,.12,.12],['car',-1.9,9.2,1.5,.7],['car',13.6,9.4,1.5,.7]],
 brick:[['pillar',.4,6.6,.2,.2],['bench',-2.2,6.2,.9,.3]]
};
const has=(marks,gate)=>!gate||(gate[0]==='!'?!marks[gate.slice(1)]:marks[gate]);
const S=m(3);
const GLASS='#3e4e54',FRAME='#d9d4c6',DARK='#2c3436',WOOD='#6d5640',TIMBER='#8a6c4c',ZINC='#8d9290',TILE='#a15f49',WHITE='#ece7da',STEEL='#7a7f7e',RUBBER='#23282a',CONCRETE='#b9b6aa';
// Windows on the two faces the camera sees. `r` decides which rooms have someone home.
function windows(b,x,z,y,w,d,h,r,{rows=1,cols,pad=m(.5),win=m(1.1),side=true,glass=GLASS}={}){
 const per=S;
 for(let f=0;f<rows;f++){const yy=y+f*per+m(1);
  // Never more windows than the wall holds: an asked-for count beyond that put glass in the air.
  const n=cols===undefined?Math.max(1,Math.floor((w-pad)/(win+m(.8)))):Math.max(1,Math.min(cols,Math.floor((w+m(.8))/(win+m(.8)))));for(let i=0;i<n;i++){const xx=x+(w-(n*win+(n-1)*m(.8)))/2+i*(win+m(.8));b.box(xx,z+d,yy,win,.012,m(1.2),glass,r()<.62?1:0);}
  if(side){const k=Math.max(1,Math.floor((d-pad)/(win+m(1.2))));for(let i=0;i<k;i++){const zz=z+(d-(k*win+(k-1)*m(1.2)))/2+i*(win+m(1.2));b.box(x+w,zz,yy,.012,win,m(1.2),glass,r()<.5?1:0);}}
 }
}
const door=(b,x,z,y,c=DARK,w=m(.9))=>b.box(x,z,y,w,.015,m(2),c);
function tree(b,x,z,h,leaf,r){b.cylinder(x,z,0,.05,.035,h*.62,'#6a5a48',6);const n=3+Math.floor(r()*2);for(let i=0;i<n;i++){const a=r()*6.28,R=h*(.2+r()*.13),o=i?h*.16:0;b.ball(x+Math.cos(a)*o,h*(.68+r()*.14),z+Math.sin(a)*o,R,R*.85,R,leaf[Math.floor(r()*leaf.length)],6);}}
function palm(b,x,z,h,leaf,r){const lean=(r()-.5)*.4,tx=x+lean,tz=z+lean*.5;b.beam(x,0,z,tx,h,tz,.07,.07,'#7f6d55');for(let i=0;i<7;i++){const a=i/7*6.28+r()*.3,L=h*.42;b.beam(tx,h,tz,tx+Math.cos(a)*L*.55,h+.12,tz+Math.sin(a)*L*.55,.13,.015,leaf[0]);b.beam(tx+Math.cos(a)*L*.55,h+.12,tz+Math.sin(a)*L*.55,tx+Math.cos(a)*L,h-.22,tz+Math.sin(a)*L,.09,.015,leaf[leaf.length-1]);}}
function bare(b,x,z,h){b.cylinder(x,z,0,.06,.03,h*.7,'#5f5248',6);for(let i=0;i<6;i++){const a=i*1.1,y=h*(.5+i*.07);b.beam(x,y,z,x+Math.cos(a)*h*.26,y+h*.18,z+Math.sin(a)*h*.26,.03,.03,'#5f5248');}}
function bananas(b,x,z){b.cylinder(x,z,0,.04,.03,.7,'#7a8a52',6);for(let i=0;i<6;i++){const a=i*1.05;b.beam(x,.7,z,x+Math.cos(a)*.45,.9-.22*(i%2),z+Math.sin(a)*.45,.16,.012,i%2?'#5f9a4a':'#6fa553');}}
// --- buildings. Every one sits with its plan corner at x,z and fronts +z.
function woodShop(b,x,z,w,d,c,r,floors=2){b.box(x,z,0,w,d,S*floors,c);b.box(x+.05,z+d,.02,w-.1,.012,S*.82,'#4c5a58');for(let a=.13;a<w;a+=.2)b.box(x+a,z+d+.01,.02,.012,.012,S*.82,'#6d7a76');b.box(x-.03,z+d,S,w+.06,.3,.04,WOOD);for(let a=0;a<=w;a+=w/4)b.box(x+a-.012,z+d+.27,S,.024,.03,.32,WOOD);b.box(x-.03,z+d+.27,S+.32,w+.06,.03,.03,WOOD);windows(b,x,z,S-.02,w,d,S,r,{cols:Math.max(1,Math.round(w/.9)),side:false});b.gable(x,z,S*floors,w,d,m(1.2),ZINC,{along:'x',over:.14,gableColor:c});}
function concreteShop(b,x,z,w,d,c,r,floors,acc,marks){b.box(x,z,0,w,d,S*floors+.08,c);b.box(x+.04,z+d,.02,w-.08,.012,S*.8,'#55676a');for(let a=.09;a<w;a+=.11)b.box(x+a,z+d+.01,.02,.008,.012,S*.8,'#71808a');b.box(x-.02,z+d,S*.82,w+.04,.42,.04,acc);if(floors>1)windows(b,x,z,S,w,d,S,r,{rows:floors-1,cols:Math.max(1,Math.round(w/.85)),side:false});b.box(x-.02,z-.02,S*floors+.08,w+.04,d+.04,.05,'#a7a497');if(marks.aircon&&r()<.5)b.box(x+w*.6,z+d+.01,S*1.1,.34,.16,.22,'#d6d3c8');if(marks.aerial&&r()<.55)aerial(b,x+w*.3,z+d*.5,S*floors+.08);if(marks.dish&&r()<.3)b.ball(x+w*.7,S*floors+.26,z+d*.5,.13,.05,.13,'#d9d6cc',6);if(marks.solar&&r()<.25)b.box(x+.15,z+.15,S*floors+.14,w-.3,d*.4,.03,'#2c3a4c');}
function aerial(b,x,z,y){b.box(x,z,y,.022,.022,.75,STEEL);for(let i=0;i<4;i++)b.box(x-.14,z+.003,y+.42+i*.09,.3-i*.03,.015,.012,STEEL);}
function stilt(b,x,z,w,d,c,roof,r,marks,lift=m(2.1)){for(const [a,e] of [[.06,.06],[w-.13,.06],[.06,d-.13],[w-.13,d-.13],[w/2,d-.13],[w/2,.06]])b.box(x+a,z+e,0,.075,.075,lift,WOOD);b.box(x-.08,z-.08,lift,w+.16,d+.16,.05,WOOD);const H=m(2.3);b.box(x,z,lift+.05,w,d,H,c);for(let a=.2;a<w;a+=.26)b.box(x+a,z+d,lift+.05,.012,.008,H,'#5f4a34');b.box(x+w*.14,z+d,lift+.36,m(.9),.012,m(1.1),GLASS,r()<.5?1:0);b.box(x+w*.62,z+d,lift+.36,m(.9),.012,m(1.1),GLASS,r()<.5?1:0);b.gable(x,z,lift+.05+H,w,d,m(1.7),roof,{along:'x',over:.16,gableColor:c});b.beam(x+w*.38,lift,z+d+.08,x+w*.38,0,z+d+.75,.34,.03,WOOD);b.box(x+w+.1,z+d-.25,0,.26,.26,.3,'#7a5a42');if(marks.aerial&&r()<.6)b.box(x+w*.8,z+d/2,lift+H+.5,.022,.022,.9,STEEL);}
function shack(b,x,z,w,d,c,roof,r,lift=0){if(lift)for(const[a,e]of[[.05,.05],[w-.1,.05],[.05,d-.1],[w-.1,d-.1]])b.box(x+a,z+e,0,.05,.05,lift,WOOD);const H=m(2.2)+r()*.15;b.box(x,z,lift,w,d,H,c);if(r()<.6)b.box(x+w*.25,z+.002,lift+.1,w*.5,d-.004,H*.6,'#7d8a8c');b.beam(x-.06,lift+H+.14,z+d/2,x+w+.06,lift+H-.02,z+d/2,d+.26,.03,roof);door(b,x+w*.35,z+d,lift,'#4d4034',m(.8));b.box(x+w*.7,z+d,lift+.5,.22,.012,.22,GLASS,r()<.7?1:0);}
function slab(b,x,z,w,d,c,r,floors,acc){b.box(x,z,0,w,d,S*floors,c);for(let f=1;f<floors;f++)b.box(x-.03,z+d,f*S-.04,w+.06,.2,.05,'#c9c6ba');windows(b,x,z,0,w,d,S,r,{rows:floors,cols:Math.max(2,Math.round(w/.7)),side:true,win:m(1)});b.box(x,z+d+.005,0,w,.01,S*.25,acc);b.box(x-.03,z-.03,S*floors,w+.06,d+.06,.06,'#a29f94');}
function tower(b,x,z,w,d,c,r,floors,accent){const H=S*floors*.6;b.box(x,z,0,w,d,H,c);const step=m(3.3);for(let y=.5;y<H-.2;y+=step){b.box(x+.05,z+d,y,w-.1,.012,m(1.5),GLASS,r()<.55?1:0);b.box(x+w,z+.05,y,.012,d-.1,m(1.5),GLASS,r()<.45?1:0);}b.box(x-.1,z-.1,0,w+.2,d+.2,S*.9,CONCRETE);b.box(x+w*.2,z+d+.1,.18,w*.6,.012,m(2),GLASS,1);b.box(x-.02,z-.02,H,w+.04,d+.04,.1,accent);b.box(x+w*.3,z+d*.3,H+.1,w*.4,d*.4,.3,'#a7a497');}
function villa(b,x,z,w,d,c,roof,r,marks){b.box(x,z,0,w,d,S*1.9,c);b.box(x+w*.3,z+d,0,w*.4,.4,S*.05,CONCRETE);for(const a of [.32,.66])b.box(x+w*a,z+d+.32,0,.07,.07,S*.95,WHITE);b.box(x+w*.28,z+d,S*.95,w*.44,.45,.07,c);windows(b,x,z,0,w,d,S,r,{rows:2,cols:3,win:m(1.3)});door(b,x+w*.44,z+d,0,'#6a4f3a',m(1.1));b.hip(x,z,S*1.9,w,d,m(1.5),roof,.16);if(marks.aircon)b.box(x+w+.01,z+d*.5,.05,.18,.38,.3,'#d6d3c8');}
function compound(b,x,z,w,d,c){const t=.07,h=m(1.8);b.box(x,z,0,w,t,h,c);b.box(x,z,0,t,d,h,c);b.box(x+w-t,z,0,t,d,h,c);b.box(x,z+d-t,0,w*.36,t,h,c);b.box(x+w*.62,z+d-t,0,w*.38,t,h,c);b.box(x+w*.36,z+d-t*.6,0,w*.26,.03,h*.75,'#56605e');}
function hdb(b,x,z,w,d,c,r,floors,acc){for(let a=.15;a<w;a+=.9)b.box(x+a,z+d-.3,0,.14,.14,S*.95,CONCRETE);b.box(x,z,S*.95,w,d,S*(floors-.95),c);for(let f=1;f<floors;f++){b.box(x-.02,z+d,f*S,w+.04,.2,.14,'#f2eee2');windows(b,x,z,(f-.3)*S,w,d,S,r,{cols:Math.max(2,Math.round(w/.72)),side:false,win:m(1)});}b.box(x-.02,z+.1,0,.05,d-.2,S*floors,acc);b.box(x+w,z+.3,S,.01,d-.6,S*(floors-1)*.8,acc);b.box(x-.03,z-.03,S*floors,w+.06,d+.06,.05,'#a7a497');}
function tokyoHouse(b,x,z,w,d,c,roof,r){b.box(x,z,0,w,d,S*1.75,c);for(let y=.2;y<S*1.7;y+=.18)b.box(x-.002,z+d,y,w+.004,.004,.008,'#a8a396');windows(b,x,z,0,w,d,S,r,{rows:2,cols:Math.max(1,Math.round(w/1.1)),win:m(.9),glass:'#5a6a6e'});door(b,x+w*.65,z+d,0,'#7a6a58',m(.85));b.gable(x,z,S*1.75,w,d,m(1.1),roof,{along:'x',over:.13,gableColor:c});b.box(x-.08,z+d,S*.96,w+.16,.26,.05,roof);}
function tripleDecker(b,x,z,w,d,c,roof,r){b.box(x,z,0,w,d,S*2.9,c);for(let y=.25;y<S*2.9;y+=.16)b.box(x-.003,z+d,y,w+.006,.005,.01,'#f0ece2');for(let f=0;f<3;f++){b.box(x+.05,z+d,f*S,w-.1,.5,.05,'#f2eee4');for(const a of [.05,w/2,w-.11])b.box(x+a,z+d+.42,f*S,.05,.05,S,'#f2eee4');b.box(x+.05,z+d+.45,f*S+.3,w-.1,.03,.03,'#f2eee4');}windows(b,x,z,0,w,d,S,r,{rows:3,cols:2,win:m(.9),glass:'#47586a'});door(b,x+w*.42,z+d,0,'#7a2f2a');b.gable(x,z,S*2.9,w,d,m(1.6),roof,{along:'x',over:.12,gableColor:c});}
function terrace(b,x,z,w,d,c,roof,r){b.box(x,z,0,w,d,S*2,c);windows(b,x,z,0,w,d,S,r,{rows:2,cols:2,win:m(.95),side:false,glass:'#4a5a62'});b.box(x+w*.1,z+d,S-.04,w*.8,.012,.05,WHITE);door(b,x+w*.38,z+d,0,'#2f3a40');b.gable(x,z,S*2,w,d,m(1.5),roof,{along:'x',over:.05,gableColor:c});b.box(x+w-.2,z+d*.4,S*2+.2,.22,.3,.7,'#7a4434');}
// An ubosot, not a chapel: a steep roof in stepped tiers, a green-edged skirt, gold chofa at the ridge ends.
function wat(b,x,z,w,d,r){const H=S*1.1+.18,top=H+.28+m(3.1);b.box(x-.15,z-.15,0,w+.3,d+.3,.18,'#d8d3c5');b.box(x,z,.18,w,d,S*1.1,'#efe9da');for(let i=0;i<4;i++)b.box(x+.12+i*(w-.3)/3.2,z+d,.5,.14,.012,S*.6,'#3f4a48');b.gable(x-.3,z-.14,H-.2,w+.6,d+.28,m(1.5),'#3f7a5a',{along:'x',over:.06,gableColor:'#d9a74a'});b.gable(x-.06,z,H,w+.12,d,m(2.2),'#c8702f',{along:'x',over:.1,gableColor:'#d9a74a'});b.gable(x+w*.2,z+.03,H+.28,w*.6,d-.06,m(3.1),'#d58a3c',{along:'x',over:.04,gableColor:'#e2b450'});for(const [ex,dir] of [[x+w*.2,-1],[x+w*.8,1]])b.beam(ex,top-.03,z+d/2,ex+dir*.2,top+.3,z+d/2,.04,.04,'#d9a92e');}
// An Isan sim: a small ordination hall, whitewashed, under one steep plain roof.
function sim(b,x,z,w,d){b.box(x-.1,z-.1,0,w+.2,d+.2,.22,'#cfc8b6');b.box(x+.2,z+.1,.22,w-.4,d-.2,S*.9,'#efe9da');for(let i=0;i<3;i++)b.box(x+.45+i*(w-.9)/2.2,z+d-.1,.45,.12,.012,S*.5,'#3f4a48');b.gable(x+.05,z-.02,S*.9+.22,w-.1,d+.04,m(2.6),'#8a4a3a',{along:'x',over:.12,gableColor:'#efe9da'});}
// A Chinese shrine on the river: red walls, a green tiled roof, lanterns at the door.
function shrine(b,x,z,w,d){b.box(x-.1,z-.1,0,w+.2,d+.2,.16,'#cfc8b6');b.box(x,z,.16,w,d,S*.95,'#a5312a');b.box(x+w*.38,z+d,.16,w*.24,.012,S*.7,'#3a2a22');b.gable(x-.15,z-.12,S*.95+.16,w+.3,d+.24,m(1.3),'#3f7a5a',{along:'x',over:.1,gableColor:'#a5312a'});for(const a of [.2,.8])b.ball(x+w*a,S*.8,z+d+.12,.1,.13,.1,'#d9a92e',8);b.box(x+w*.3,z+d,S*.95+.1,w*.4,.02,.18,'#d9a92e');}
function chedi(b,x,z){b.box(x,z,0,1,1,.16,'#e4decd');b.box(x+.12,z+.12,.16,.76,.76,.2,'#efe9da');b.cylinder(x+.5,z+.5,.36,.34,.22,.42,'#efe9da',10);b.cylinder(x+.5,z+.5,.78,.22,.0,1.3,'#dcd5c2',10,false);}
function officeFront(b,x,z,w,d,c,r,floors,acc){b.box(x,z,0,w,d,S*floors,c);const step=S;for(let f=0;f<floors;f++){b.box(x+.12,z+d,.5+f*step,w-.24,.012,m(1.25),'#5a6e76',r()<.55?1:0);b.box(x+w,z+.12,.5+f*step,.012,d-.24,m(1.25),'#5a6e76',r()<.45?1:0);for(let a=.12+(w-.24)/4;a<w-.2;a+=(w-.24)/4)b.box(x+a,z+d+.002,.5+f*step,.03,.012,m(1.25),c);}b.box(x-.03,z+d,0,w+.06,.3,.05,acc);b.box(x-.03,z-.03,S*floors,w+.06,d+.06,.06,'#a29f94');}
function shed(b,x,z,w,d,roof,acc,r){for(const a of [0,w-.07])for(const e of [0,d-.07])b.box(x+a,z+e,0,.07,.07,S*1.05,STEEL);b.gable(x,z,S*1.05,w,d,m(.8),roof,{over:.2,along:'x'});for(let i=0;i<3;i++){const tx=x+.2+i*(w-.4)/2.6;b.box(tx,z+.25,0,.5,d-.5,.48,'#8a7458');for(let j=0;j<3;j++)b.ball(tx+.1+j*.16,.54,z+.5+(j%2)*.2,.07,.06,.07,[acc,'#c9a14a','#6f8f5a'][j],6);}}
function store(b,x,z,w,d,r){b.box(x,z,0,w,d,S*.95,'#eeeae0');b.box(x+.06,z+d,.04,w-.12,.012,S*.68,'#aab8ba',1);b.box(x-.03,z+d,S*.72,w+.06,.08,S*.2,'#e8e4d8');b.box(x-.03,z+d+.07,S*.72,w+.06,.012,.05,'#4f7a8a');b.box(x-.02,z-.02,S*.95,w+.04,d+.04,.05,'#a7a497');}
function schoolHall(b,x,z,w,d,c,roof,r,modern,acc){if(modern){b.box(x,z,0,w,d,S*1.9,c);windows(b,x,z,0,w,d,S,r,{rows:2,cols:Math.round(w/.7),win:m(1)});b.box(x-.03,z+d,S-.04,w+.06,.22,.05,acc);b.box(x-.03,z-.03,S*1.9,w+.06,d+.06,.06,'#a29f94');}else{for(let a=.05;a<w;a+=.6)b.box(x+a,z+d-.08,0,.07,.07,S*.96,WOOD);b.box(x,z,S*.96,w,d,S*.9,c);windows(b,x,z,S*.9,w,d,S,r,{cols:Math.round(w/.72),win:m(1),side:false});b.gable(x,z,S*1.86,w,d,m(1.3),roof,{along:'x',over:.16,gableColor:c});}}
function clinic(b,x,z,w,d,c,roof,r,modern){b.box(x,z,0,w,d,S*(modern?1.9:1),c);windows(b,x,z,0,w,d,S,r,{rows:modern?2:1,cols:Math.round(w/.72),win:m(1)});door(b,x+w*.44,z+d,0,'#7a8f8f',m(1.1));if(modern)b.box(x-.03,z-.03,S*1.9,w+.06,d+.06,.06,'#a29f94');else b.gable(x,z,S,w,d,m(1.2),roof,{along:'x',over:.14,gableColor:c});}
function viaduct(b,x0,x1,z){b.box(x0,z,S*3.1,x1-x0,.9,.16,'#c7c3b6');for(const e of [.02,.86])b.box(x0,z+e,S*3.1+.16,x1-x0,.03,.12,'#b0ac9f');for(let x=x0+1.2;x<x1;x+=4.2){b.box(x,z+.3,0,.3,.3,S*3.1,'#bdb9ac');b.box(x-.2,z+.05,S*3.1-.14,.7,.8,.14,'#bdb9ac');}}
function mast(b,x,z){const H=S*5.5;b.box(x,z,0,.09,.09,H,STEEL);for(let y=.4;y<H;y+=.55){b.beam(x-.12,y,z+.05,x+.2,y+.45,z+.05,.018,.018,STEEL);}for(const a of [-.2,.1,.32])b.box(x+a-.04,z+.045,H-.3,.08,.04,.42,'#d7d6cc');}
// --- free-standing things
// Samut Prakan's industrial estates: sheds with sawtooth roofs and one stack.
function factory(b,x,z,w,d,c,r){b.box(x,z,0,w,d,S*1.5,c);const n=Math.max(2,Math.round(w/1)),sw=w/n;for(let i=0;i<n;i++)b.gable(x+i*sw,z,S*1.5,sw,d,m(1.3),i%2?'#8d9290':'#9aa09c',{along:'z',over:.02});b.box(x+.25,z+d,.02,w*.28,.012,S*1.1,'#55676a');for(let a=w*.62;a<w-.2;a+=.36)b.box(x+a,z+d,S*.9,.24,.012,m(.9),GLASS,r()<.5?1:0);}
function stack(b,x,z,h){b.cylinder(x,z,0,.16,.12,h,'#b9b6aa',10);for(const y of [h*.6,h*.85])b.cylinder(x,z,y,.17,.17,.08,'#a15f49',10);}
function containers(b,x,z,cols,tiers,r){const C=['#a15f49','#2f6f9a','#c9a14a','#3f8a7a','#8d9290','#7a3f3a'];for(let i=0;i<cols;i++)for(let t=0;t<tiers;t++)if(t===0||r()<.7)b.box(x+i*.32,z,t*.3,.3,1.2,.29,C[Math.floor(r()*C.length)]);}
// A quay crane: two legs, a boom out over the water.
function crane(b,x,z){const H=S*4.2;for(const a of [0,1.1])for(const e of [0,.9])b.box(x+a,z+e,0,.09,.09,H,'#c9a14a');b.box(x-.05,z-.05,H,1.3,1.0,.18,'#c9a14a');b.box(x+.3,z-1.9,H+.18,.5,3.2,.12,'#c9a14a');b.box(x+.2,z+.2,H+.3,.7,.6,.4,'#ece7da');}
// A department-store podium: low, deep, banded glass, a sign along the top.
function mall(b,x,z,w,d,c,floors){const H=S*floors;b.box(x,z,0,w,d,H,c);for(let f=0;f<floors;f++)b.box(x+.1,z+d,.35+f*S,w-.2,.012,S*.42,GLASS,f%2);b.box(x-.04,z+d,H-.02,w+.08,.06,.22,WHITE);b.box(x+w*.3,z+d+.05,H+.02,w*.4,.04,.16,'#a15f49');b.box(x-.1,z+d,0,w+.2,.5,.06,CONCRETE);}
function vehicle(b,kind,x,z,w,d,acc,marks){
 if(kind==='samlor'){b.box(x+.1,z+.12,.3,w*.42,d-.24,.05,WOOD);b.box(x+.1,z+.1,.5,w*.42,d-.2,.05,'#7a3f3a');b.beam(x+.5,.3,z+d/2,x+w-.05,.62,z+d/2,.03,.03,RUBBER);b.gable(x+.08,z+.08,.92,w*.46,d-.16,.04,'#3f4a48',{over:.03});for(const a of [.2,.2])b.ball(x+a,.14,z+.06,.14,.14,.02,RUBBER,8);b.ball(x+.2,.14,z+d-.06,.14,.14,.02,RUBBER,8);b.ball(x+w-.08,.14,z+d/2,.14,.14,.02,RUBBER,8);return;}
 if(kind==='tuktuk'){b.box(x,z,.14,w,d,.26,'#2f6f62');b.box(x+.05,z+.03,.72,w-.1,d-.06,.04,'#d9c27a');for(const[a,e]of[[.05,.05],[w-.1,.05],[.05,d-.1],[w-.1,d-.1]])b.box(x+a,z+e,.4,.035,.035,.33,STEEL);for(const[a,e]of[[w-.1,d/2-.04],[.12,-.01],[.12,d-.08]])b.box(x+a,z+e,0,.12,.08,.14,RUBBER);return;}
 if(kind==='motorbike'||kind==='rider'){b.box(x+.15,z+.11,.22,w-.3,.08,.12,kind==='rider'?'#b5553c':'#3f4a50');b.box(x+.18,z+.1,.34,.3,.1,.05,RUBBER);b.ball(x+.12,.14,z+.15,.14,.14,.025,RUBBER,8);b.ball(x+w-.12,.14,z+.15,.14,.14,.025,RUBBER,8);b.beam(x+w-.15,.15,z+.15,x+w-.25,.52,z+.15,.03,.03,STEEL);if(kind==='rider')b.box(x+.05,z+.03,.38,.28,.24,.26,'#e4dfd2');return;}
 if(kind==='bicycle'){b.ball(x+.14,.14,z+.1,.14,.14,.012,RUBBER,8);b.ball(x+w-.14,.14,z+.1,.14,.14,.012,RUBBER,8);b.beam(x+.14,.14,z+.1,x+w*.5,.34,z+.1,.02,.02,'#5a6a6a');b.beam(x+w-.14,.14,z+.1,x+w*.55,.36,z+.1,.02,.02,'#5a6a6a');b.beam(x+w*.35,.38,z+.1,x+w*.7,.42,z+.1,.02,.02,'#5a6a6a');return;}
 if(kind==='pickup'||kind==='car'){const body=kind==='car'?acc:'#c4c0b0';b.box(x,z,.1,w,d,.22,body);b.box(x+(kind==='car'?.32:.55),z+.04,.32,w*(kind==='car'?.5:.33),d-.08,.2,kind==='car'?'#55686e':'#5a6e72');b.box(x+(kind==='car'?.36:.58),z+.05,.52,w*(kind==='car'?.42:.28),d-.1,.02,body);for(const a of [.12,w-.34])for(const e of [-.008,d-.012])b.box(x+a,z+e,0,.22,.02,.22,RUBBER);return;}
}
function prop([kind,x,z,w,d],b,plan,r){
 const leaf=plan.palette.leaf,acc=plan.palette.accent;
 if(kind==='spirit'){b.box(x,z,0,.06,.06,.82,'#e6dcc2');b.box(x-.14,z-.14,.82,.34,.34,.03,'#d9b24a');b.box(x-.07,z-.07,.85,.2,.2,.18,'#e9c46a');b.gable(x-.1,z-.1,1.03,.26,.26,.14,'#b0472f',{over:.04});b.box(x-.18,z+.2,0,.09,.09,.06,'#c8372d');return;}
 if(kind==='pole'){b.box(x,z,0,.07,.07,S*2.1,'#8a8880');b.box(x-.32,z,S*2.1-.14,.72,.04,.04,'#5a5a52');b.box(x-.08,z+.06,S*1.7,.2,.14,.22,'#8a8f88');return;}
 if(kind==='cart'){b.box(x,z,.32,w,d,.24,'#d9d2c0');b.box(x-.02,z-.02,.56,w+.04,d+.04,.03,'#8a7050');b.box(x+.02,z+d/2-.015,.1,.03,.03,.24,STEEL);b.ball(x+.14,.12,z-.015,.12,.12,.012,RUBBER,8);b.ball(x+.14,.12,z+d+.015,.12,.12,.012,RUBBER,8);b.box(x+w/2-.012,z+d/2-.012,.56,.024,.024,.75,'#6b5236');if(plan.marks.stools)b.cylinder(x+w/2,z+d/2,1.28,.62,.0,.2,acc,10,false);else b.gable(x-.1,z-.08,1.2,w+.2,d+.16,.2,'#8a7050',{over:.02});if(plan.marks.stools)for(const[a,e]of[[-.1,d+.3],[.4,d+.42],[.8,d+.26]])b.cylinder(x+a,z+e,0,.09,.075,.2,'#3f6f9a',8);return;}
 if(kind==='bananas')return bananas(b,x,z);
 if(['samlor','tuktuk','motorbike','rider','bicycle','pickup','car'].includes(kind))return vehicle(b,kind,x,z,w,d,acc,plan.marks);
 if(kind==='winstand'){for(const a of [0,w])b.box(x+a,z,0,.03,.03,.72,STEEL);b.box(x-.08,z-.1,.72,w+.16,.5,.03,'#c77d3a');b.box(x+.05,z+.05,.26,w-.1,.14,.03,WOOD);vehicle(b,'motorbike',x+.1,z+.5,.75,.28,acc,plan.marks);return;}
 if(kind==='laundry'){for(const a of [x,x+w])b.box(a,z,0,.035,.035,.92,WOOD);b.beam(x,.9,z+.018,x+w,.9,z+.018,.008,.008,DARK);[['#b5553c',.1],['#e6d9b8',.46],['#4f7a9a',.84],['#d8b25a',1.24]].forEach(([c,o])=>b.box(x+o,z,.55,.28,.012,.34,c));return;}
 if(kind==='drum'){b.cylinder(x+w/2,z+d/2,0,.15,.15,.34,'#4f7a8a',10);return;}
 if(kind==='jar'){b.ball(x+.15,.2,z+.15,.16,.2,.16,'#7a5a42',8);return;}
 if(kind==='buffalo'){b.box(x,z,.32,w*.72,d,.32,'#4a4440');b.box(x+w*.7,z+.07,.42,w*.24,d-.14,.22,'#3f3a36');b.beam(x+w*.8,.66,z+.1,x+w*.92,.72,z-.1,.03,.03,'#d8cfb8');b.beam(x+w*.8,.66,z+d-.1,x+w*.92,.72,z+d+.1,.03,.03,'#d8cfb8');for(const[a,e]of[[.05,.05],[w*.6,.05],[.05,d-.11],[w*.6,d-.11]])b.box(x+a,z+e,0,.07,.07,.34,'#3f3a36');return;}
 if(kind==='net'){for(let i=0;i<5;i++)b.box(x+i*w/4,z,0,.03,.03,.5,WOOD);b.beam(x,.5,z+.01,x+w,.5,z+.01,.015,.015,WOOD);for(let i=0;i<8;i++)b.beam(x+i*w/8,.5,z+.015,x+i*w/8+.05,.04,z+d*.6,.1,.006,'#9aa59a');return;}
 if(kind==='bench'){b.box(x,z,.27,w,d,.04,TIMBER);for(const a of [.06,w-.1])b.box(x+a,z+.05,0,.04,d-.1,.27,STEEL);return;}
 if(kind==='vending'){b.box(x,z,0,w,d,1.15,'#e8e6df');b.box(x+.04,z+d,.35,w-.08,.01,.68,'#5f8aa0',1);return;}
 if(kind==='hydrant'){b.cylinder(x+.06,z+.06,0,.06,.05,.42,'#b23a2e',8);return;}
 if(kind==='pillar'){b.cylinder(x+.1,z+.1,0,.11,.11,.92,'#b23a2e',10);b.ball(x+.1,.94,z+.1,.12,.09,.12,'#b23a2e',8);return;}
}
// Ground that is not available to building: roads, home, pond, field, stall, the garden path.
export const KEEP_CLEAR=[[2.5,2.6,4.8,4.7],[3,8.3,2.6,2.2],[8.8,8.8,4.4,3.6],[6,8.3,2.4,2],[-5.6,7,24.2,1.9],[7.1,-5.6,2,24],[4.2,12.9,4.5,1.6],[8.3,1.2,6.2,.8],[10,5.2,4.1,1.2],[13.4,5.2,.8,2],[14.2,-.9,3.9,2.8],...LOTS];
export const clearOfRoutes=(x,z,w,d)=>!KEEP_CLEAR.some(([a,b,c,e])=>x<a+c&&x+w>a&&z<b+e&&z+d>b);
export function createRegionScenery({scene,registerBuilding}){
 let root=null,built=[];
 function build(plan){
  root=new T.Group();scene.add(root);
  const {palette:P,marks,style,seed,year,flood}=plan,r=lifeRandom(seed,'layout'+style);
  const pick=l=>l[Math.floor(r()*l.length)],wall=()=>pick(P.walls),roof=()=>pick(P.roofs);
  // One batch per thing a cutaway may fade; loose ground things share one.
  const open=createBatch();
  const unit=(fn,bounds)=>{const g=new T.Group();root.add(g);const b=createBatch();fn(b);if(bounds){if(flood.mark)floodLine(b,bounds);open.box(bounds[0]-.03,bounds[1]-.03,-.02,bounds[2]+.06,bounds[3]+.06,.016,'#b4ae9e');}bake(b,g);registerBuilding(g);return g;};
  // The board reads best stepped: tall at the back, low on the camera's side.
  const cap=(x,z,f)=>Math.min(f,x>13.5||z>9?2:x<-2||z<-1?f:3);
  const floodLine=(b,[x,z,w,d])=>{b.box(x-.005,z+d,0,w+.01,.006,m(1),'#7d7a68');b.box(x+w,z-.005,0,.006,d+.01,m(1),'#7d7a68');};
  const row=(x0,x1,z,d,min,max,make)=>{for(let x=x0;x<x1-min*.6;){const w=Math.min(x1-x,min+r()*(max-min));if(clearOfRoutes(x,z,w,d))make(x,z,w,d);x+=w;}};
  const scatterTrees=(n,zones,h=[1.3,2.2],kind=tree)=>{for(let i=0;i<n;i++){const [a,b,c,e]=pick(zones),x=a+r()*c,z=b+r()*e;if(clearOfRoutes(x-.2,z-.2,.4,.4))kind(open,x,z,h[0]+r()*(h[1]-h[0]),P.leaf,r);}};
  const paddy=(x,z,w,d)=>{if(!clearOfRoutes(x,z,w,d))return;const c=year%2?'#7f9e86':'#8ea27a';open.box(x,z,-.02,w,d,.012,c);const n=Math.floor(w/.34),k=Math.floor(d/.34);for(let i=0;i<=n;i++)open.box(x+i*w/n-.005,z,-.012,.01,d,.018,'#a59a72');for(let j=0;j<=k;j++)open.box(x,z+j*d/k-.005,-.012,w,.01,.018,'#a59a72');for(let i=0;i<n;i++)for(let j=0;j<k;j+=1)open.box(x+(i+.5)*w/n-.015,z+(j+.5)*d/k-.015,-.01,.03,.03,.1,'#7fa05a');};
  const water=(x,z,w,d,rim='#a59a84')=>{open.box(x-.08,z-.08,-.03,w+.16,d+.16,.02,rim);open.box(x,z,-.02,w,d,.018,P.water);};
  const boat=(x,z,L,c)=>{open.box(x,z,-.02,L,.32,.14,c);open.box(x+.06,z+.05,.12,L-.12,.22,.02,'#d8c8a0');open.beam(x+L,.12,z+.16,x+L+.42,.04,z+.16,.03,.03,DARK);};
  const lamp=(x,z)=>{open.box(x,z,0,.04,.04,S*1.5,'#6d7566');open.box(x-.2,z-.02,S*1.5,.26,.08,.03,'#d9d4c6',1);};
  const institutions=(mod,w0=wall(),roofC=roof())=>{
   const [sx,sz,sw,sd]=FOOTPRINTS.school,[wx,wz,ww,wd]=FOOTPRINTS.work,[cx,cz,cw,cd]=FOOTPRINTS.clinic,[mx,mz,mw,md]=FOOTPRINTS.market;
   unit(b=>schoolHall(b,sx,sz,sw,sd,w0,roofC,r,mod,P.accent),[sx,sz,sw,sd]);
   // A village or fishing-town health station is one storey.
   unit(b=>clinic(b,cx,cz,cw,cd,WHITE,roofC,r,mod&&!['village','fringe','coast'].includes(style)),[cx,cz,cw,cd]);
   unit(b=>{if(style==='village'||style==='fringe')shed(b,wx,wz,ww,wd,roofC,P.accent,r);else if(plan.abroad||marks.tower)officeFront(b,wx,wz,ww,wd,w0,r,marks.highrise?7:3,P.accent);else if(!marks.concrete)woodShop(b,wx,wz,ww,wd,'#8f6f4c',r,2);else concreteShop(b,wx,wz,ww,wd,w0,r,mod?3:2,P.accent,marks);},[wx,wz,ww,wd]);
   unit(b=>{if(plan.abroad||marks.tower)store(b,mx,mz,mw,md,r);else shed(b,mx,mz,mw,md,roofC,P.accent,r);},[mx,mz,mw,md]);
  };
  const LAYOUT={
   market(){const early=!marks.concrete;
    // Udon Thani: a tight provincial shophouse row around the lake park of Nong Prajak.
    // Pathum Wan: Bangkok shophouse blocks; Siam Center opened in 1973, MBK in 1985, and
    // Chulalongkorn University's campus has been the district's green since 1917.
    const udon=plan.regionId==='udon-thani',pw=plan.regionId==='pathum-wan',W=udon?.72:1;
    institutions(!early);
    const make=f=>(x,z,w,d)=>unit(b=>f(b,x,z,w,d),[x,z,w,d]);
    const shop=(b,x,z,w,d)=>{const c=wall();if(early||r()<(year<1975?.4:.1))woodShop(b,x,z,w,d,pick(['#8f6f4c','#7f6243','#9a7c5a']),r,2);else concreteShop(b,x,z,w,d,c,r,cap(x,z,(pw?3:2)+Math.floor(r()*(year>=1990?3:2))),P.accent,marks);};
    const rw=(x0,x1,z,d,a,b)=>row(x0,x1,z,d,a*W,b*W,make(shop));
    rw(-5.2,2.4,4.7,2.2,1.1,1.8);rw(-5.2,-2.3,-.6,2.2,1.1,1.6);rw(2.9,6.9,-.5,2.8,1.9,2.1);
    if(pw){open.box(9.2,16.2,-.014,9,2,.01,'#7f9a68');for(const [x,z] of [[9.8,16.8],[10.4,17.7],[16.3,16.8],[17.4,17.6]])if(clearOfLots(x-.3,z-.3,.6,.6))tree(open,x,z,1.9+r()*.8,P.leaf,r);
     // A campus hall under a tiered Thai roof, set back on its lawn.
     unit(b=>{b.box(11.4,16.9,0,4,1.1,S*1.3,'#efe9da');for(let i=0;i<6;i++)b.box(11.6+i*.66,18,.3,.3,.012,S*.75,GLASS);b.gable(11.4,16.9,S*1.3,4,1.1,m(1.4),'#a15f49',{along:'x',over:.14,gableColor:'#efe9da'});b.gable(12.4,17.05,S*1.3+m(1.3),2,.8,m(1.1),'#a15f49',{along:'x',over:.1,gableColor:'#efe9da'});},[11.4,16.9,4,1.1]);}
    else rw(9.2,18.2,14.8,2.4,1.2,1.9);
    // Siam Center (1973) stands mid-board where every camera sees it; MBK (1985) fills the back row.
    if(pw&&year>=1973)unit(b=>mall(b,14.3,3.2,3.8,3.4,'#e8e4d8',2),[14.3,3.2,3.8,3.4]);
    else if(udon){water(14.4,2.3,3.7,4.4);for(const [x,z] of [[14.6,2.1],[18,2.4],[14.5,6.8],[16.4,6.9],[18,6.4]])tree(open,x,z,1.7+r()*.8,P.leaf,r);open.box(15.7,4.1,0,.9,.5,.12,'#ece7da');}else rw(14.2,18.2,4.4,2.4,1.1,1.6);rw(-5.2,.9,12.2,2.6,1.2,2);rw(.9,8.4,15,2.6,1.4,2.4);
    if(marks.store)unit(b=>store(b,13.8,9.2,2.4,1.8,r),[13.8,9.2,2.4,1.8]);else unit(b=>woodShop(b,13.8,9.2,2.2,1.8,pick(P.walls),r,1),[13.8,9.2,2.2,1.8]);
    if(marks.mast)mast(open,-5,-1.2);
    if(udon)rw(-5.2,18.2,-4.8,1.9,1.1,1.7);
    // Samut Prakan: industrial estates opened along the Sukhumvit and Bang Na roads from the late 1970s.
    else if(plan.regionId==='samut-prakan'&&year>=1978){for(const [x,w] of [[-5.2,3.6],[-1.2,3.8],[3.2,3.6],[9.3,4.2],[14.2,3.9]])if(clearOfRoutes(x,-5.2,w,2.3))unit(b=>factory(b,x,-5.2,w,2.3,pick(['#d6cfbb','#cfd0c8','#e0d8c4']),r),[x,-5.2,w,2.3]);stack(open,-1.4,-4.6,S*4.5);if(year>=1990)stack(open,13.7,-4.7,S*3.8);}
    else if(pw){const pod=(x,w,f)=>{if(clearOfRoutes(x,-5.2,w,2.6))unit(b=>mall(b,x,-5.2,w,2.6,'#e8e4d8',f),[x,-5.2,w,2.6]);};
     rw(-5.2,3.2,-4.8,1.9,1.3,2.4);rw(3.6,7,-4.8,1.9,1.3,2.4);if(year>=1985)pod(9.2,4.9,4);else rw(9.2,14.2,-4.8,1.9,1.3,2.4);rw(14.6,18.2,-4.8,1.9,1.3,2.4);
     if(marks.viaduct)viaduct(open,-5.5,18.5,-1.9);}
    else rw(-5.2,18.2,-4.8,1.9,1.3,2.4);
    scatterTrees(9,[[-5,9.2,8,1.8],[9.2,12.5,8,2],[14.3,-1,3,3],[1.2,10.5,3,.4]]);},
   beach(){const clear=(x,z,w,d)=>clearOfRoutes(x,z,w,d)&&!Object.values(FOOTPRINTS).some(([a,b,c,e])=>x<a+c&&x+w>a&&z<b+e&&z+d>b);
    // Hua Hin: the town runs down to a long sand beach; squid boats lie off it, and ponies
    // for hire walk the sand. Beach umbrellas and ponies are drawn from 1970, on the safe side.
    water(-5.5,-5.5,24,2.1,'#e2d3a8');open.box(-5.5,-3.3,-.018,24,2.3,.006,'#e2d3a8');
    for(const x of [-3.5,3,10.5,15.5])boat(x+r()*1.2,-5.1+r()*.8,1.5+r()*.4,pick([P.accent,'#2f6f9a','#c0563f','#3f8a7a']));
    institutions(marks.concrete,pick(P.walls),roof());
    if(year>=1970){for(let x=3.2;x<17.6;x+=1.1+r()*.5)if(r()<.75&&clear(x,-2.85,.5,.6)){open.box(x+.23,-2.6,0,.03,.03,m(2.1),'#d9d4c6');open.box(x,-2.83,m(2.1),.5,.5,.03,pick([P.accent,'#d8b25a','#2f6f9a','#ece7da']));open.box(x+.05,-2.42,0,.4,.16,.05,'#ece7da');}
     for(const x of [2.2,5.2])if(clear(x,-2.2,.7,.2))unit(b=>{b.box(x,-2.2,m(.9),.62,.18,m(.6),pick(['#8a6a4c','#d9d4c6','#5a4a3c']));for(const a of [.04,.52])for(const e of [.02,.12])b.box(x+a,-2.2+e,0,.05,.05,m(.95),'#5a4a3c');b.box(x+.6,-2.18,m(1.3),.16,.14,.18,'#5a4a3c');},[x,-2.2,.62,.18]);}
    for(const [x,z,w,d] of [[-5,-.9,2.2,1.7],[-4.9,9.4,2.1,1.7],[14.4,13.3,2.2,1.7],[10,13.2,2.2,1.7]])if(r()<.85&&clear(x,z,w,d))unit(b=>stilt(b,x,z,w,d,pick(['#c9b48e','#b79a72','#a98a62']),roof(),r,marks,m(.6)),[x,z,w,d]);
    const make=f=>(x,z,w,d)=>unit(b=>f(b,x,z,w,d),[x,z,w,d]);
    const shop=(b,x,z,w,d)=>{if(!marks.concrete||r()<.3)woodShop(b,x,z,w,d,pick(['#8f6f4c','#7f6243','#9a7c5a']),r,2);else concreteShop(b,x,z,w,d,wall(),r,cap(x,z,2+Math.floor(r()*2)),P.accent,marks);};
    row(-5.2,2.4,4.7,2.2,1.1,1.8,make(shop));row(14.2,18.2,4.4,2.4,1.1,1.6,make(shop));row(-2.4,.9,12.2,2.6,1.2,2,make(shop));row(.9,8.4,15,2.6,1.4,2.4,make(shop));
    // Condominium towers rose along the Hua Hin shore through the 2000s; one stands for them.
    if(year>=2005)for(const [x,z] of [[-4.9,1.1]])if(clear(x,z,1.9,1.4))unit(b=>tower(b,x,z,1.9,1.4,'#e4e0d6',r,8+Math.floor(r()*4),P.accent),[x,z,1.9,1.4]);
    if(marks.store)unit(b=>store(b,13.8,9.2,2.4,1.8,r),[13.8,9.2,2.4,1.8]);if(marks.mast)mast(open,-5.2,2.6);
    for(let i=0;i<9;i++){const x=-5.2+r()*23,z=-1.3+r()*.2;if(clear(x-.2,z-.2,.4,.4))palm(open,x,z,1.7+r(),P.leaf,r);}scatterTrees(8,[[-5,6.6,7,.4],[9,12.3,9,.5],[14,6.1,4,1]],[1.7,2.7],palm);},
   slum(){institutions(false,pick(P.walls),roof());
    // Khlong Toei grew around the Port of Bangkok (from 1951): a quay on the river, sheds,
    // and from the late 1970s container stacks and quay cranes.
    const port=()=>{water(-2.2,-5.5,20.6,.9);open.box(-2.2,-4.6,-.016,20.4,1.5,.008,'#b9b6aa');
     open.box(1.4,-5.45,-.02,4.6,.7,.34,'#3e4e54');open.box(1.7,-5.35,.32,1.1,.5,.42,'#ece7da');
     const quay=(x,w)=>clearOfRoutes(x,-4.4,w,1.2);
     if(year>=1978){for(const [x,c] of [[-1.9,4],[3.6,5],[9.4,8]])if(quay(x,c*.32))containers(open,x,-4.4,c,year>=1995?3:2,r);for(const x of [-.4,5.5])unit(b=>crane(b,x,-4.5),[x,-4.5,1.2,1]);}
     else for(const [x,w] of [[-1.9,3.6],[2.4,4.4],[10,3.8],[14.2,3.9]])if(quay(x,w))unit(b=>shed(b,x,-4.4,w,1.2,ZINC,P.accent,r),[x,-4.4,w,1.2]);};
    water(-5.4,-5.4,2,23.8);
    for(let z=-5;z<17;z+=1.35){const w=1+r()*.5;if(clearOfRoutes(-3.5,z,w,1.15)&&r()<.92)unit(b=>shack(b,-3.5,z,w,1.15,wall(),roof(),r,m(.9)),[-3.5,z,w,1.15]);}
    open.box(-3.72,-5.2,m(.75),.22,23,.03,WOOD);
    // A shack never stands on the clinic's or the school's plot.
    const free=(x,z,w,d)=>clearOfRoutes(x,z,w,d)&&!['school','work','clinic','market'].some(k=>{const [a,b,c,e]=FOOTPRINTS[k];return x<a+c&&x+w>a&&z<b+e&&z+d>b;});
    const dense=(x0,x1,z0,z1)=>{for(let z=z0;z<z1;){const d=.95+r()*.45;for(let x=x0;x<x1;){const w=.9+r()*.55;if(r()<.86&&free(x,z,w,d))unit(b=>shack(b,x,z,w,d,wall(),roof(),r),[x,z,w,d]);x+=w+.06+(r()<.2?.3:0);}z+=d+.34;}};
    dense(-2.3,2.2,3.3,6.9);dense(-2.3,.8,9.2,18);dense(14.3,18.2,-5.2,6.9);port();dense(9.2,18.2,12.6,18.2);dense(13.4,18.2,9,12.2);dense(1.2,8.2,14.6,18);
    if(marks.tower)for(const [x,z,w] of [[15,-3.7,2.6],[-2,14,2.4]])if(clearOfLots(x,z,w,1.9))unit(b=>tower(b,x,z,w,1.9,pick(['#cfd0c8','#dcd8cc']),r,12+Math.floor(r()*14),P.accent),[x,z,w,1.9]);
    scatterTrees(3,[[.2,10,.8,1],[6,11,2,1.6]],[1.2,1.8]);},
   village(){
    // Nakhon Sawan stands where the Ping and the Nan meet; an Isan village keeps its rice in a barn on posts.
    const river=plan.regionId==='nakhon-sawan',isan=plan.regionId==='isan-village';
    water(-5.4,-5.4,23.8,1.7);if(river)for(const x of [-4.6,2.4,12.8])boat(x+r()*.6,-5.15,1.4+r()*.4,pick(['#6d5640','#3f6f8a','#7a3f3a']));
    if(isan)for(const [x,z] of [[-3.5,6.1],[.2,2.2],[-4.2,12.4],[17.2,5.9],[12.6,-3.4]])if(clearOfRoutes(x,z,.8,.7))unit(b=>{for(const [a,e] of [[0,0],[.68,0],[0,.58],[.68,.58]])b.box(x+a,z+e,0,.07,.07,m(1.3),WOOD);b.box(x-.03,z-.03,m(1.3),.84,.74,m(1.6),'#9a7c5a');b.gable(x-.08,z-.08,m(2.9),.94,.84,m(.9),'#8b7c68',{along:'x',over:.08});},[x,z,.8,.7]);
    open.box(-5.4,-3.7,-.02,23.8,.08,.02,'#7a7f60');
    institutions(marks.concrete&&year>=1990,'#d8cda8',pick(P.roofs));
    for(const [x,z,w,d] of [[-5,3.1,3.1,3.7],[-5,9.3,3,3.6],[-1.7,12,2.5,2.4],[9.3,13,4.2,4],[14.2,-3.2,3.8,3.6],[14.2,9.2,3.9,3],[.9,14.7,3.4,3.3],[14,13.2,4,4.6]])if(r()<.85)paddy(x,z,w,d);
    const houses=[[-1.9,3.6,2,1.7],[-4.8,14,2.2,1.8],[5.4,14.8,2.3,1.8],[10.2,-4.1,2.4,1.9],[14.7,3.8,2.4,1.9],[5.9,10.8,1.8,1.6],[-2.9,-1.8,2,1.8],[1.2,-3,2.2,1.9]];
    for(const [x,z,w,d] of houses)if(r()<.8&&clearOfRoutes(x,z,w,d))unit(b=>stilt(b,x,z,w,d,wall(),roof(),r,marks),[x,z,w,d]);
    unit(b=>isan?sim(b,14.2,-.6,2.9,1.6):wat(b,14.2,-.6,2.9,1.6,r),[14.2,-.6,2.9,1.6]);
    if(r()<.7)unit(b=>chedi(b,16.9,1.6),[16.9,1.6,1,1]);
    if(marks.mast)mast(open,-4.8,-3.2);if(marks.store)unit(b=>store(b,-4.8,12.9,1.9,1.3,r),[-4.8,12.9,1.9,1.3]);
    scatterTrees(14,[[-5,2.7,7,.5],[8.9,12.4,9,.6],[-1,9,3.6,2],[14,7,4,1.6],[-5.2,17,23,1.2]],[1.4,2.6]);scatterTrees(5,[[-3,12,4,2],[12,-3,2,2],[6,12,2,1.5]],[1.8,2.6],palm);},
   // Nakhon Sawan: a provincial market town on the bank where the Ping and the Nan become the
   // Chao Phraya. Shophouse streets, a wide river with barges and a landing; rice lies beyond town.
   river(){const early=!marks.concrete;
    water(-5.4,-5.4,23.8,2.4);open.box(-5.4,-3.0,-.016,23.8,.32,.02,'#b9b6aa');
    for(const [x,L] of [[-4.4,3.2],[3.4,2.6],[12.4,3.4]])open.box(x+r()*.6,-5.1+r()*.4,-.02,L,.5,.2,'#5a4a3c');
    for(const x of [-.8,9.6])boat(x,-4.1,1.3,pick(['#6d5640','#3f6f8a','#7a3f3a']));
    for(const x of [1.2,10.2])if(clearOfRoutes(x,-3.1,1,.7)){open.box(x,-3.4,0,1,.9,.06,WOOD);open.box(x+.1,-3.3,.06,.8,.5,m(1.6),'#ece7da');}
    institutions(!early);
    const make=f=>(x,z,w,d)=>unit(b=>f(b,x,z,w,d),[x,z,w,d]);
    const shop=(b,x,z,w,d)=>{if(early||r()<.35)woodShop(b,x,z,w,d,pick(['#8f6f4c','#7f6243','#9a7c5a']),r,2);else concreteShop(b,x,z,w,d,wall(),r,cap(x,z,2+Math.floor(r()*2)),P.accent,marks);};
    const rw=(x0,x1,z,d)=>row(x0,x1,z,d,1.1,1.7,make(shop));
    rw(-5.2,2.4,4.7,2.2);rw(2.9,6.9,-.5,2.6);
    for(const x of [-4.6,-2.4])for(let i=0;i<4;i++)open.box(x,-3.0-i*.12,-.01-i*.03,1.2,.12,.04,'#cfc8b6');open.box(-5.2,-2.7,-.012,3.2,2.2,.008,'#b9b6aa');rw(-5.2,.9,12.2,2.6);rw(.9,8.4,15,2.6);rw(14.2,18.2,4.4,2.4);
    for(const [x,z,w,d] of [[9.3,13,4.2,4],[14.2,13.2,4,4.6]])paddy(x,z,w,d);
    if(marks.store)unit(b=>store(b,13.8,9.2,2.4,1.8,r),[13.8,9.2,2.4,1.8]);else unit(b=>woodShop(b,13.8,9.2,2.2,1.8,pick(P.walls),r,1),[13.8,9.2,2.2,1.8]);
    if(marks.mast)mast(open,-5,-1.2);
    scatterTrees(8,[[-5,9.2,8,1.8],[9.2,12.5,8,.4],[-5.2,-2.6,23,.3]],[1.6,2.6]);},
   fringe(){
    water(-5.4,-5.4,2.6,23.8);institutions(false,'#d8cda8',pick(P.roofs));
    for(const [x,z,w,d] of [[-2.4,3.2,4.4,3.6],[-2.4,9.3,3.2,4.2],[9.3,12.9,8.8,5],[14.2,-5,4,7.4],[1,14.6,6.8,3.4],[14.2,9,4,3.4]])paddy(x,z,w,d);
    for(const [x,z,w,d] of [[-2.8,-1.9,1.7,1.5],[6.9,-3.8,2,1.6],[.9,-3.6,2.1,1.6],[-1.6,13.8,1.9,1.6]])if(r()<.9&&clearOfRoutes(x,z,w,d))unit(b=>stilt(b,x,z,w,d,wall(),roof(),r,marks),[x,z,w,d]);
    if(marks.concrete)row(9.2,14,-4.6,2,1.2,1.5,(x,z,w,d)=>unit(b=>concreteShop(b,x,z,w,d,pick(['#d6cfbb','#e0d8c4']),r,2,P.accent,marks),[x,z,w,d]));
    scatterTrees(10,[[-2.4,2.7,4,.4],[9,12.3,9,.5],[14,2.6,4,1]],[1.4,2.4]);},
   condo(){const low=!marks.tower,mod=year>=1985;
    institutions(mod);
    const blocks=[[-5.2,3.4,3.6,3.3],[-1.2,3.4,3.3,3.2],[-5.2,-3.4,3.3,2.4],[14.3,-3.5,3.8,3],[14.3,1.2,3.8,4.9],[9.3,13,4.2,4.6],[14.3,13,3.8,4.6],[-5.2,9.2,4,4],[-1,13,3.6,4.4],[3.4,-5,4.8,3.6],[9.2,-5,4.6,3.4],[3,14.8,5,3]];
    for(const [x,z,w,d] of blocks){if(!clearOfRoutes(x,z,w,d))continue;const q=r();const tall=marks.tower&&q<(marks.highrise?.6:.3)&&x<3&&z<0&&(plan.regionId!=='bang-na'||year>=2005);if(tall)unit(b=>tower(b,x+.3,z+.3,Math.min(w,2.8)-.4,d-.6,wall(),r,14+Math.floor(r()*(marks.highrise?26:12)),P.accent),[x,z,w,d]);// Bang Na before 2005: housing-estate townhouse rows, not slabs.
    else if((low||q<.75)&&!(plan.regionId==='bang-na'&&year<2005))unit(b=>slab(b,x+.1,z+.1,w-.2,d-.2,wall(),r,cap(x,z,plan.regionId==='bang-na'&&year<2000?2+Math.floor(r()*3):(year<1985?3:4)+Math.floor(r()*(year<1985?2:5))),P.accent),[x,z,w,d]);else unit(b=>{for(let a=0;a<w-1.1;a+=1.3)concreteShop(b,x+a,z+d-1.9,1.3,1.9,wall(),r,3,P.accent,marks);},[x,z,w,d]);}
    if(marks.store)unit(b=>store(b,13.6,9.2,2.6,1.6,r),[13.6,9.2,2.6,1.6]);
    if(marks.viaduct)viaduct(open,-5.5,18.5,-1.9);
    if(marks.mast)mast(open,-5,-1.1);
    for(const x of [-4,0,10.8,15])lamp(x,6.94);
    scatterTrees(7,[[-5,8.9,6,.3],[13.4,12.4,4,.5],[.8,10.4,1.5,.5]],[1.2,1.8]);},
   coast(){
    open.box(-5.5,-5.5,-.018,4,24,.006,'#d8c79e');
    water(-5.5,-5.5,2.4,24,'#c9b98f');
    institutions(marks.concrete,pick(P.walls),roof());
    for(let i=0;i<8;i++){const z=-5+i*3,w=1.5+r()*.5;if(r()<.75&&clearOfRoutes(-3.2,z+.3,w,1.2))unit(b=>stilt(b,-3.2,z+.3,w,1.2,wall(),roof(),r,marks,m(1.5)),[-3.2,z+.3,w,1.2]);if(r()<.6){open.box(-5,z+1.2,m(.7),2.2,.24,.03,WOOD);for(let a=0;a<4;a++)open.box(-5+a*.72,z+1.26,-.02,.05,.05,m(.72),WOOD);}}
    for(let i=0;i<5;i++)boat(-5.3,-4+i*4.6+r(),1.6+r()*.4,pick([P.accent,'#2f6f9a','#c0563f','#3f8a7a']));
    for(const [x,z,w,d] of [[-.9,3.4,2,1.7],[14.3,-.5,2.3,1.9],[14.2,3.2,2.3,1.8],[14.3,9.3,2.4,1.9],[10,13,2.3,1.9],[13.4,13.2,2.5,1.9],[3,15,2.2,1.9],[-1,14,2.2,1.9],[1.9,-3.4,2.2,1.6],[9.3,-4.4,2.4,1.8]])if(r()<.82&&clearOfRoutes(x,z,w,d))unit(b=>{const c=wall(),ro=roof();b.box(x,z,0,w,d,S,c);windows(b,x,z,0,w,d,S,r,{cols:2,win:m(1)});door(b,x+w*.42,z+d,0,'#4f6a6a');b.gable(x,z,S,w,d,m(1.4),ro,{along:'x',over:.16,gableColor:c});if(marks.aerial&&r()<.5)aerial(b,x+w*.75,z+d*.5,S+.5);},[x,z,w,d]);
    if(marks.store)unit(b=>store(b,4.9,10.9,1.9,1.4,r),[4.9,10.9,1.9,1.4]);if(marks.mast)mast(open,-5.2,-5.2);
    scatterTrees(12,[[-1.4,2.8,4,.4],[-1.4,9,4,1.8],[9,12.4,9,.5],[14,6.1,4,.8],[9,17,9,1],[-5,17.4,9,.8]],[1.6,2.6],palm);},
   villa(){institutions(true,'#ece6d8',roof());
    const estates=[[-5.2,2.9,7.5,4.1],[-5.2,9.1,6,4.4],[9.3,12.6,4.5,5.4],[14.1,12.6,4.1,5.4],[14.2,-4.8,4,5],[14.2,.5,4,6.2],[-5.2,-4.9,3,3.7],[3,-5.2,4,3.8],[9.2,-5.2,4.6,3.6],[-.8,13.8,8.9,4.2]];
    for(const [x,z,w,d] of estates){if(!clearOfRoutes(x,z,w,d))continue;open.box(x+.05,z+.05,-.014,w-.1,d-.1,.01,'#7f9a68');unit(b=>compound(b,x,z,w,d,'#e6e0d0'),[x,z,w,.08]);const W=Math.min(w-1.4,3.4),D=Math.min(d-1.6,2.3),hx=x+.5+r()*(w-W-1),hz=z+.4;unit(b=>villa(b,hx,hz,W,D,wall(),roof(),r,marks),[hx,hz,W,D]);if(r()<.4&&d>4){const pw=Math.min(1.8,w-1.2),px=x+w-pw-.3,pz=z+d-1.5;open.box(px-.06,pz-.06,-.008,pw+.12,1.12,.008,'#e8e2d4');open.box(px,pz,-.003,pw,1,.004,'#6fb0c0');}tree(open,x+.5+r()*(w-1),z+d-.7,1.7+r()*.8,P.leaf,r);if(r()<.6)tree(open,x+w-.5,z+.5,2+r()*.6,P.leaf,r);}
    if(marks.tower)for(const [x,z] of [[12.4,-4.8],[-5,-1.1]])unit(b=>tower(b,x,z,1.6,1.6,'#d9d6cc',r,16+Math.floor(r()*20),P.accent),[x,z,1.6,1.6]);
    if(marks.viaduct)viaduct(open,-5.5,18.5,-1.9);
    if(marks.store)unit(b=>store(b,13.5,9.1,2.5,1.6,r),[13.5,9.1,2.5,1.6]);
    if(marks.mast)mast(open,-5.2,-2);
    for(const x of [-4,1,10.8,15.5])lamp(x,6.94);},
   tower(){institutions(true,'#e8e2d4',roof());
    const block=(x,z,w,d,f)=>{if(clearOfRoutes(x,z,w,d))unit(b=>hdb(b,x,z,w,d,wall(),r,f,pick(P.accents)),[x,z,w,d]);};
    block(-5.2,3.3,7.2,1.6,9+Math.floor(r()*4));block(14.2,-3.6,3.9,4.3,5);block(-5.2,-4.9,8,1.5,11);block(-5.2,10,5.6,1.6,4);block(9.3,13.4,8.8,1.7,2);block(3.2,15.2,5,1.6,3);block(14.2,2.3,3.9,1.5,3);
    unit(b=>{for(const a of [0,3.4])for(const e of [0,1.3])b.box(14.2+a,9.3+e,0,.1,.1,S*1.1,CONCRETE);b.gable(14.2,9.3,S*1.1,3.5,1.4,m(1),'#b4876a',{along:'x',over:.2});},[14.2,9.3,3.5,1.4]);
    scatterTrees(9,[[-5,6.2,7,.5],[-5,8.9,6,1],[9,12.4,9,.8],[14,5.2,4,1.5]],[1.8,2.8]);for(const x of [-4,2,10.8,15])lamp(x,6.94);},
   tokyo(){institutions(true,'#ddd8cc',roof());
    const house=(x,z,w,d)=>unit(b=>tokyoHouse(b,x,z,w,d,wall(),roof(),r),[x,z,w,d]);
    row(-5.2,2.3,5,1.9,1.1,1.5,house);row(-5.2,2.3,3,1.8,1.1,1.5,house);row(-5.2,-2.1,-1,1.8,1.1,1.4,house);row(-5.2,.9,9.2,1.7,1.1,1.5,house);row(-5.2,.9,11.2,1.7,1.1,1.5,house);row(9.2,18.2,12.7,1.7,1.1,1.6,house);row(9.2,18.2,14.7,1.7,1.1,1.6,house);row(14.2,18.2,4.8,1.9,1.1,1.5,house);row(14.2,18.2,1.8,1.9,1.1,1.5,house);row(14.2,18.2,-1.2,1.9,1.1,1.5,house);row(.9,8.2,15.2,1.8,1.1,1.5,house);row(.9,8.2,-4.2,1.8,1.1,1.5,house);
    open.box(-5.5,-5.5,0,24,1.3,.55,'#a8a496');for(const e of [.3,.85])open.box(-5.5,-5.5+e,.55,24,.05,.04,'#6d6f6c');
    for(let x=-4;x<18;x+=5.1){open.box(x,-4.1,0,.06,.06,S*1.9,'#8a8880');}
    scatterTrees(3,[[13.4,9,4,3]],[1.2,1.6]);},
   newengland(){institutions(false,'#d7dde0',P.roofs[0]);
    const home=(x,z,w,d)=>{if(clearOfRoutes(x,z,w,d))unit(b=>tripleDecker(b,x,z,w,d,wall(),P.roofs[0],r),[x,z,w,d+.5]);};
    home(-4.9,3.4,2.2,2.6);home(-2.1,3.4,2.2,2.6);home(14.5,-.4,2.3,2.7);home(14.5,3.5,2.3,2.7);home(-4.9,9.4,2.2,2.5);home(-1.9,12,2.2,2.5);home(9.6,13.2,2.3,2.7);home(13.6,13.2,2.3,2.7);home(3,14.8,2.2,2.5);home(9.4,-4.8,2.3,2.7);home(3.4,-4.8,2.3,2.7);
    scatterTrees(10,[[-5,6.2,7,.6],[-5,8.9,4,.3],[9,12.3,9,.6],[14,6.2,4,.6],[-5,14.5,3,3]],[1.8,2.8],(b,x,z,h)=>bare(b,x,z,h));},
   brick(){institutions(false,'#9a5a46',P.roofs[0]);
    const rowT=(x0,x1,z,d)=>row(x0,x1,z,d,1.05,1.05,(x,zz,w,dd)=>unit(b=>terrace(b,x,zz,w,dd,wall(),roof(),r),[x,zz,w,dd]));
    rowT(-5.2,2.4,4.5,2.3);rowT(-5.2,-2.3,-.9,2.3);rowT(-5.2,.9,9.2,2.1);rowT(9.2,18.2,12.7,2.1);rowT(9.2,18.2,15.6,2.1);rowT(14.2,18.2,4.5,2.3);rowT(14.2,18.2,.4,2.3);rowT(.9,8.2,15.2,2.2);rowT(-5.2,18.2,-4.8,2);
    unit(b=>{for(let a=0;a<3;a++){const x=13.6+a*1.5;b.box(x,9.3,0,1.45,2,S*1.1,pick(P.accents));b.box(x+.08,11.3,.08,1.28,.012,S*.75,'#aab8ba',1);b.box(x-.01,11.3,S*.84,1.47,.012,S*.2,WHITE);}},[13.6,9.3,4.5,2]);
    for(const [x,z] of [[-4,6.5],[.7,9.1],[10.5,12.3],[15,8.95]])tree(open,x,z,2.4+r()*.8,P.leaf,r);}
  };
  const layout=plan.regionId==='nakhon-sawan'?'river':style;
  (LAYOUT[layout]??LAYOUT.market)();
  if(!plan.abroad){
   // What every Thai neighbourhood has: a wat or a mosque, flags at the gate, bananas in every gap.
   const flag=(b,x,z,h=S*2.1)=>{b.box(x,z,0,.04,.04,h,'#d9d4c6');[['#a51931',0],['#f4f5f8',1],['#2d2a4a',2],['#f4f5f8',4],['#a51931',5]].forEach(([c,i])=>b.box(x+.04,z,h-.06*(i+1),.42,.01,i===2?.12:.06,c));};
   if(plan.faith==='muslim')unit(b=>{b.box(14.5,-.7,0,2.4,1.5,S*1.1,'#eae3cf');b.ball(15.7,S*1.1+.32,.05,.62,.55,.62,'#3f7a62',12);b.cylinder(17.2,-.5,0,.13,.08,S*2.4,'#eae3cf',8);b.ball(17.2,S*2.45,-.5,.15,.2,.15,'#3f7a62',8);for(let i=0;i<4;i++)b.box(14.75+i*.55,.8,.3,.32,.012,S*.6,'#3e4e54',1);b.box(15,.803,S*.8,1.4,.012,.12,'#c9a14a');},[14.5,-.7,3,1.5]);
   else if(layout==='river')unit(b=>shrine(b,14.5,-.6,2.4,1.4),[14.5,-.6,2.4,1.4]);
   else if(plan.regionId==='udon-thani')unit(b=>sim(b,14.3,-.7,2.9,1.6),[14.3,-.7,2.9,1.6]);
   else if(layout!=='village'){unit(b=>wat(b,14.3,-.7,2.9,1.6,r),[14.3,-.7,2.9,1.6]);unit(b=>chedi(b,17.15,-.1),[17.15,-.1,.8,.8]);}
   if(plan.faith!=='muslim'){open.box(14.95,1.05,0,.34,.28,.2,'#e4decd');open.ball(15.12,.34,1.19,.13,.15,.11,'#d9a92e',8);open.ball(15.12,.54,1.19,.07,.08,.07,'#d9a92e',8);open.cylinder(15.12,1.19,.61,.03,.0,.09,'#d9a92e',6,false);}
   flag(open,14.1,1.1);flag(open,8.95,1.25);flag(open,2.2,6.75,S*1.4);
   for(let i=0;i<14;i++){const x=-5+r()*23,z=-5+r()*22;if(clearOfRoutes(x-.3,z-.3,.6,.6)&&clearOfLots(x-.3,z-.3,.6,.6))bananas(open,x,z);}
  }
  for(const p of PROPS[layout==='river'?'market':style]??PROPS.market)if(has(marks,p[5])&&(plan.abroad||clearOfLots(p[1],p[2],p[3]??0,p[4]??0)))prop(p,open,plan,r);
  // Whoever sits in this town has something to sit on.
  for(const row of crowdRoster(plan))if(row.role==='still'&&row.pose==='sit'){open.box(row.x-.13,row.z-.13,.235,.26,.26,.03,marks.stools?P.accent:'#8a7050');for(const [a,e] of [[-.11,-.11],[.08,-.11],[-.11,.08],[.08,.08]])open.box(row.x+a,row.z+e,0,.03,.03,.235,'#6b5a45');}
  // Wires between the poles once a place has mains.
  if(marks.power&&['market','slum','condo','fringe','village'].includes(style)){const y=S*1.9;for(let k=0;k<2;k++){open.beam(-5.3,y-k*.06,6.72,2.2,y-k*.06,6.72,.01,.01,DARK);}for(const x of [-4.5,plan.abroad?1.6:1.85])open.box(x,6.68,0,.05,.05,y,'#8a8880');}
  bake(open,root);
 }
 function dispose(){if(!root)return;root.traverse(o=>{o.geometry?.dispose();o.material?.dispose?.();});scene.remove(root);root=null;}
 let key='';
 return {update(plan){if(plan.key===key)return false;key=plan.key;dispose();build(plan);return true;},dispose};
}
