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
// --- the North. A Lanna viharn fronts the viewer: its ridge runs toward the street and the roof
// steps down in tiers toward the door, with a carved gilt gable on each tier.
function lannaWat(b,x,z,w,d,{white=false}={}){const wall=white?'#f4f6f6':'#efe9da',roofC=white?'#e9eef0':'#7d3b2b',gold=white?'#cfdde2':'#c99a3a',y=.2+S*.75;
 b.box(x-.15,z-.15,0,w+.3,d+.3,.2,white?'#e6eaea':'#d8d3c5');b.box(x+.1,z+.05,.2,w-.2,d-.1,S*.75,wall);b.box(x+w*.38,z+d-.04,.2,w*.24,.012,S*.6,'#3f4a48');
 b.gable(x-.22,z,y-.22,w+.44,d*.62,m(2.4),roofC,{along:'z',over:.1,gableColor:gold});
 b.gable(x-.1,z+d*.45,y-.34,w+.2,d*.55,m(1.9),roofC,{along:'z',over:.1,gableColor:gold});
 b.gable(x+w*.2,z+d*.1,y+m(1.6),w*.6,d*.42,m(1.8),roofC,{along:'z',over:.06,gableColor:gold});
 for(const a of [-.06,w+.06])b.beam(x+a,.22,z+d+.05,x+a,y-.3,z+d*.62,.05,.05,gold);if(white)for(const [a,e,h] of [[.5,.3,y+m(2.4)],[.5,.75,y-.34+m(1.9)],[.5,.31,y+m(3.4)]])b.cylinder(x+w*a,z+d*e,h,.06,0,.55,'#c4d4da',5,false);}
// A Lanna chedi: square terraces, a bell, rings and a long spire. `y` lets it stand on a hill.
function lannaChedi(b,x,z,k=1,c='#d4a63a',y=0){const s=v=>v*k;b.box(x-s(.5),z-s(.5),y,s(1),s(1),s(.18),c);b.box(x-s(.4),z-s(.4),y+s(.18),s(.8),s(.8),s(.2),c);b.box(x-s(.3),z-s(.3),y+s(.38),s(.6),s(.6),s(.2),c);b.cylinder(x,z,y+s(.58),s(.27),s(.22),s(.16),c,8);b.ball(x,y+s(.86),z,s(.24),s(.2),s(.24),c,8);for(let i=0;i<3;i++)b.cylinder(x,z,y+s(1.02+i*.09),s(.12-i*.025),s(.1-i*.025),s(.08),c,8);b.cylinder(x,z,y+s(1.29),s(.07),0,s(.62),c,8,false);}
// Wat Chedi Luang: a broad brick chedi in the walled city, its top lost to an earthquake.
function brickChedi(b,x,z){const c='#a8704f',c2='#9a6446';for(let i=0;i<4;i++)b.box(x+i*.22,z+i*.22,i*.62,2-i*.44,2-i*.44,.62,i%2?c2:c);for(const [a,e] of [[1,0],[0,1],[1,2],[2,1]])b.box(x+a-.18+(a===1?0:a?-.02:.02),z+e-.18+(e===1?0:e?-.02:.02),.62,.36,.36,.42,'#e4decd');b.cylinder(x+1,z+1,2.48,.4,.22,.55,c2,8);}
// Chedi Suwanna in Lamphun: a stepped brick pyramid with a niche on every terrace.
function pyramid(b,x,z){const c=['#a8704f','#b07a58'];for(let i=0;i<5;i++){const w=2.6-i*.46,o=(2.6-w)/2;b.box(x+o,z+o,i*.52,w,w,.52,c[i%2]);for(const a of [.3,.7])b.box(x+o+w*a-.06,z+o+w-.01,i*.52+.12,.12,.012,.28,'#5a3f30');}b.cylinder(x+1.3,z+1.3,2.6,.16,0,.7,'#d4a63a',8,false);}
// Wat Phumin in Nan: a cross-shaped ordination hall, four porches under crossing roofs.
function crossHall(b,x,z,s){const c='#efe9da',roof='#7d3b2b',g='#c99a3a',H=S*.9,a=s*.36,L=s*.28;b.box(x,z,0,s,s,.24,'#d8d3c5');b.box(x+L,z+.15,.24,a,s-.3,H,c);b.box(x+.15,z+L,.24,s-.3,a,H,c);b.gable(x+L-.06,z,.24+H,a+.12,s,m(2.3),roof,{along:'z',over:.08,gableColor:g});b.gable(x,z+L-.06,.24+H,s,a+.12,m(2.3),roof,{along:'x',over:.08,gableColor:g});b.cylinder(x+s/2,z+s/2,.24+H+m(2.3)-.04,.08,0,.5,g,6,false);}
// The open-sided viharn at Wat Phra That Lampang Luang: tall wooden columns under a three-tiered roof.
function openViharn(b,x,z,w,d){const roof='#6d5640',g='#c99a3a',H=S*.95;b.box(x,z,0,w,d,.24,'#d8d3c5');for(const a of [.1,w*.37,w*.63,w-.2])for(const e of [.1,d-.2])b.box(x+a,z+e,.24,.1,.1,H,'#5a3f30');b.box(x+w*.3,z+.25,.24,w*.4,.3,S*.5,'#d4a63a');b.gable(x-.15,z,.24+H-.15,w+.3,d*.62,m(1.6),roof,{along:'z',over:.1,gableColor:g});b.gable(x-.06,z+d*.45,.24+H-.25,w+.12,d*.55,m(1.3),roof,{along:'z',over:.1,gableColor:g});b.gable(x+w*.22,z+d*.08,.24+H+m(1.3),w*.56,d*.4,m(1.5),roof,{along:'z',over:.05,gableColor:g});}
// Lampang's ceramic works (more than 200 factories): long sheds, a round kiln and its chimney, pots in the yard.
function kilns(b,x,z,w){b.box(x,z,0,w,1.3,S*.9,'#d6cfbb');b.gable(x,z,S*.9,w,1.3,m(1),ZINC,{along:'x',over:.12});b.cylinder(x+w+.45,z+.6,0,.42,.36,.6,'#a8704f',10);b.cylinder(x+w+.45,z+.6,.6,.12,.1,S*2.6,'#a8704f',8);for(let i=0;i<6;i++)b.cylinder(x+.25+i*.32,z+1.55,0,.1,.13,.22,i%2?'#e8e2d4':'#5a7a8a',8);}
// Phae Mueang Phi: earth pillars, each a column of soft rock under a harder cap.
function pillars(b,x,z,r){b.box(x,z,-.025,3.6,2.1,.012,'#b8a07a');for(let i=0;i<11;i++){const px=x+.35+r()*2.9,pz=z+.3+r()*1.5,h=.6+r()*1.6,w=.14+r()*.14;b.cylinder(px,pz,0,w,w*.35,h,i%3?'#d9b98a':'#c9a679',6);}}
// The Ton Sak Yai teak: a broad trunk and a crown over everything round it.
function bigTeak(b,x,z){b.cylinder(x,z,0,.36,.24,3,'#5f4a38',8);for(const [a,e,y,R] of [[0,0,3.25,1.5],[.7,.3,3,.9],[-.7,-.2,3.05,.9],[.1,-.7,3.1,.85]])b.ball(x+a,y,z+e,R,R*.38,R,a?'#55734a':'#4f6c45',7);b.box(x+.7,z+.9,0,.36,.04,.4,'#d9d4c6');}
// Mountains behind the valley. They stand off the board on the table, as scenery behind a set:
// broad cones rising from the table top, the cross street running out between them. `crown` stands
// a hill chedi on the highest peak in view; `fall` runs a waterfall down one face onto the board.
function ridge(b,r,{high=false,low=false,mesa=false,crown,fall=false}={}){const T0=-1.3,peaks=[],[h0,h1]=high?[6.6,2.4]:low?[2.6,1.2]:[4.2,1.6];for(let x=-6;x<17.6;x+=2+r()*1.2){if(x>6&&x<10)continue;peaks.push([x,2.3+r()*.7,h0+r()*h1]);}
 const view=peaks.filter(p=>p[0]>10&&p[0]<16),top=view.reduce((a,p)=>p[2]>a[2]?p:a,view[0]??peaks[0]);
 for(const [x,R,h] of peaks)b.cylinder(x+1.1,-8.2,T0,R*1.1,0,h*1.15,'#5f7466',7,false);
 for(const p of peaks){const [x,R,h]=p,c=r()<.5?'#4f6b45':'#5a7550',z=-6.9;if(mesa&&p===top)b.cylinder(x,z,T0,R*1.15,R*.8,h*.72,'#6f6a52',7);else if(crown&&p===top){b.cylinder(x,z,T0,R,.45,h*.86,c,7);lannaChedi(b,x,z,.6,crown,T0+h*.86);}else b.cylinder(x,z,T0,R,0,h,c,7,false);}
 if(fall){const [x,R,h]=view.find(p=>p!==top)??top,z=-6.9,edge=z+R*(1+T0/h);b.beam(x,T0+h*.55,z+R*.45,x,.03,edge,.24,.08,'#e8eef0');b.box(x-.45,edge,-.02,.9,.45,.02,'#6a95a0');}}
// Crossed boards over the gable ends of a northern teak house: the kalae.
function kalae(b,x,y,z){for(const s of [-1,1])b.beam(x,y-.06,z-s*.16,x,y+.28,z+s*.14,.035,.035,'#5a3f30');}
// The Northeast. A that is the Lao lotus-bud chedi: a square body narrowing into a spire.
function that(b,x,z,k=1,c='#efe9da',gold='#d4a63a',y=0){const s=v=>v*k,cx=x+s(.5),cz=z+s(.5);b.box(x,z,y,s(1),s(1),s(.2),c);b.box(x+s(.1),z+s(.1),y+s(.2),s(.8),s(.8),s(.5),c);
 for(let i=0;i<6;i++){const w=s(.62*(1-i/7)**1.3);b.box(cx-w/2,cz-w/2,y+s(.7+i*.28),w,w,s(.28),i>3?gold:c);}b.cylinder(cx,cz,y+s(2.38),s(.05),0,s(.7),gold,6,false);}
// A Khmer prang: a stone cell on a platform, a porch to the front, a tower of stepped tiers.
function prang(b,x,z,k=1,c='#b8a283',c2='#a89070',y=0){const s=v=>v*k,cx=x+s(.5),cz=z+s(.5);b.box(x-s(.15),z-s(.15),y,s(1.3),s(1.3),s(.25),c2);b.box(x,z,y+s(.25),s(1),s(1),s(.75),c);b.box(x+s(.33),z+s(1),y+s(.25),s(.34),s(.25),s(.55),c);b.box(x+s(.4),z+s(1.24),y+s(.3),s(.2),s(.012),s(.4),'#3a3028');
 for(let i=0;i<5;i++){const w=s(.92-i*.15);b.box(cx-w/2,cz-w/2,y+s(1+i*.27),w,w,s(.27),i%2?c2:c);}b.ball(cx,y+s(2.45),cz,s(.14),s(.2),s(.14),c,8);}
// Phra That Yakhu: an octagonal brick chedi.
function octChedi(b,x,z){const c='#a8704f';b.cylinder(x,z,0,.62,.6,.3,c,8);b.cylinder(x,z,.3,.48,.42,.7,c,8);b.cylinder(x,z,1,.42,.2,.9,'#9a6446',8);b.cylinder(x,z,1.9,.12,0,.5,c,8,false);}
// Sandstone pillars weathered into mushrooms (Pa Hin Ngam, Sao Chaliang, Phu Pha Thoep).
function mushrooms(b,x,z,w,d,r,y=0){for(let i=0;i<7;i++){const px=x+.3+r()*(w-.6),pz=z+.3+r()*(d-.6),h=.5+r()*.9,R=.22+r()*.2;b.cylinder(px,pz,y,R*.55,R*.4,h,'#b89a72',6);b.cylinder(px,pz,y+h,R*1.2,R,.22,'#8a7a62',7);}}
function elephant(b,x,z){const g='#7d7670';for(const [a,e] of [[0,0],[.5,0],[0,.32],[.5,.32]])b.box(x+a,z+e,0,.14,.14,.42,g);b.box(x-.04,z-.04,.38,.72,.5,.38,g);b.box(x+.62,z+.06,.5,.3,.34,.32,g);b.beam(x+.9,.6,z+.23,x+1.02,.08,z+.23,.08,.08,g);for(const e of [-.06,.36])b.box(x+.66,z+e,.5,.12,.04,.3,'#6d6660');}
function cow(b,x,z){const c='#8a5a3a';for(const [a,e] of [[0,0],[.36,0],[0,.18],[.36,.18]])b.box(x+a,z+e,0,.06,.06,.22,c);b.box(x-.03,z-.03,.2,.5,.28,.2,c);b.box(x+.45,z+.04,.28,.16,.18,.14,'#6d4a30');}
// Silk on a loom under an open shed.
function loomShed(b,x,z){for(const a of [0,1.5])for(const e of [0,1])b.box(x+a,z+e,0,.07,.07,S*.8,WOOD);b.gable(x-.1,z-.1,S*.8,1.77,1.27,m(.8),ZINC,{along:'x',over:.1});b.box(x+.3,z+.3,.3,.9,.4,.04,WOOD);b.box(x+.35,z+.32,.34,.8,.36,.01,'#8a2f4a');b.box(x+.3,z+.3,.34,.04,.4,.5,WOOD);b.box(x+1.16,z+.3,.34,.04,.4,.5,WOOD);}
// Phra That Phanom being rebuilt: the stump of the old chedi in bamboo scaffold, 1976-1978.
function scaffold(b,x,z,k){b.box(x,z,0,k,k,.6,'#d8d3c5');b.box(x+k*.2,z+k*.2,.6,k*.6,k*.6,.5,'#cfc8b6');for(let a=-.1;a<=k+.1;a+=k/3)for(const e of [-.1,k+.1]){b.box(x+a,z+e,0,.03,.03,2.2,'#a08a5a');b.box(x+e,z+a,0,.03,.03,2.2,'#a08a5a');}for(const y of [.7,1.4,2.1])b.box(x-.1,z-.1,y,k+.2,k+.2,.02,'#a08a5a');}
// Sala Keoku: a seated figure under a seven-headed naga, and standing figures, in grey concrete.
function keoku(b,x,z){const c='#8f8c80',c2='#7a776c';b.box(x,z,0,1.6,1.2,.3,c2);b.box(x+.2,z+.25,.3,1.2,.8,.4,c);b.box(x+.45,z+.4,.7,.7,.5,.9,c);b.ball(x+.8,1.85,z+.65,.26,.3,.26,c,8);for(let i=0;i<7;i++){const a=(i-3)*.3,hx=x+.8+Math.sin(a)*.95,hy=1.7+Math.cos(a)*1.1;b.beam(x+.8,.8,z+.3,hx,hy,z+.35,.12,.1,c2);b.ball(hx,hy,z+.42,.13,.13,.16,c2,6);}
 for(const [a,h] of [[2.1,2.6],[2.8,1.9]]){b.box(x+a,z+.4,0,.36,.3,h,c);b.ball(x+a+.18,h+.16,z+.55,.17,.2,.17,c,6);}}
function stadium(b,x,z,w,d){b.box(x,z,0,w,d,.03,'#6f9a5a');for(const [a,e,W,D] of [[0,0,w,.6],[0,d-.6,w,.6],[0,.6,.6,d-1.2],[w-.6,.6,.6,d-1.2]]){b.box(x+a,z+e,0,W,D,.5,'#c9c6ba');b.box(x+a,z+e,.5,W,D,.08,'#a51931');}for(const [a,e] of [[0,0],[w,0],[0,d],[w,d]]){b.box(x+a-.05,z+e-.05,0,.1,.1,S*2.6,STEEL);b.box(x+a-.25,z+e-.05,S*2.6,.5,.08,.24,'#e8e4d8',1);}}
// The East. Chanthaburi's cathedral: a gothic nave with twin spires at its door.
function cathedral(b,x,z){const c='#ece6d8',roof='#5a6a72';b.box(x,z,0,1.8,2.6,S*1.3,c);b.gable(x,z,S*1.3,1.8,2.6,m(2.6),roof,{along:'z',over:.06,gableColor:c});for(let e=.4;e<2.4;e+=.5)for(const a of [-.005,1.8])b.box(x+a,z+e,.4,.012,.22,S*.8,'#5a7a9a',1);
 for(const a of [-.3,1.5]){b.box(x+a,z+2.4,0,.6,.6,S*2.7,c);b.cylinder(x+a+.3,z+2.7,S*2.7,.42,0,1.6,roof,4,false);b.box(x+a+.2,z+3.0,S*1.4,.2,.012,.5,'#5a7a9a',1);}b.box(x+.62,z+2.95,0,.56,.04,S*.9,'#5a4a3c');b.ball(x+.9,S*1.6,z+3.02,.18,.18,.03,'#c9a14a',8);}
// The Sanctuary of Truth: a castle of carved teak rising in tiers of roofs to a spire.
function teakCastle(b,x,z){const w='#8a5a34',d='#6d4527';b.box(x,z,0,3,3,.3,'#b9a07a');for(let i=0;i<4;i++){const s=2.6-i*.5,o=(3-s)/2,y=.3+i*.9;b.box(x+o,z+o,y,s,s,.6,i%2?d:w);b.hip(x+o-.14,z+o-.14,y+.6,s+.28,s+.28,.3,d,.16);}b.cylinder(x+1.5,z+1.5,3.9,.26,0,2.2,w,6,false);for(const [a,e] of [[.1,1.2],[2.5,1.2],[1.2,.1],[1.2,2.5]])b.cylinder(x+a+.2,z+e+.2,.3,.1,0,1.9,d,6,false);}
// Map Ta Phut: storage spheres, tanks, columns and a burning flare stack.
function petro(b,x,z){const g='#e4e2da',s='#c4c1b5';b.box(x-.1,z-.1,0,3.8,3.8,.06,'#9a9a90');for(const [a,e] of [[.6,.6],[1.9,.6]]){b.ball(x+a,.8,z+e,.6,.6,.6,g,10);for(const o of [-.3,.3])b.box(x+a+o,z+e,0,.05,.05,.4,STEEL);}for(const [a,e] of [[2.6,.6],[2.6,1.8]])b.cylinder(x+a,z+e,0,.5,.5,.55,s,12);for(const [a,h] of [[.7,2.6],[1.2,3.4],[1.7,2.2]])b.cylinder(x+a,z+1.9,0,.18,.18,h,g,8);b.box(x+.3,z+1.4,.6,2.8,.08,.08,STEEL);b.cylinder(x+3.3,z+3.2,0,.1,.07,4.4,'#a15f49',6);b.ball(x+3.3,4.65,z+3.2,.24,.4,.24,'#f08a2a',6);}
// Wat Si Maha Phot's Bodhi tree on its walled terrace.
function bodhi(b,x,z){b.box(x,z,0,3,3,.3,'#e4decd');b.box(x+.1,z+.1,.3,2.8,2.8,.14,'#d8d3c5');b.cylinder(x+1.5,z+1.5,.44,.4,.3,1.7,'#6d5a48',8);for(const [a,e,y,R] of [[1.5,1.5,2.5,1.6],[.8,1.2,2.2,1],[2.2,1.9,2.25,1],[1.4,2.3,2.4,.9]])b.ball(x+a,y,z+e,R,R*.55,R,a===1.5?'#4f7a45':'#5a8250',8);for(let i=0;i<8;i++)b.box(x+.3+i*.33,z+1.3,.44,.03,.4,.04,['#c9a14a','#a51931','#f4f5f8'][i%3]);}
// Rong Kluea market: rows of sheds by the border arch.
function borderMarket(b,x,z){for(let i=0;i<3;i++){b.box(x+.1,z+.15+i*1.25,0,3.4,.7,S*.75,'#d8d3c5');b.gable(x,z+i*1.25,S*.75,3.6,1,m(.8),i%2?'#4f7a8a':'#a15f49',{along:'x',over:.05});}}
// An island seen across the water from the set: a cone on the table in its own patch of sea.
function island(b,x,z,R,h,c,sand){b.cylinder(x,z,-1.3,R+1.6,R+1.6,.02,'#4f7f8c',20);b.cylinder(x,z,-1.28,R*1.08,R*1.08,.02,sand,14);b.cylinder(x,z,-1.28,R,R*.25,h,c,9);}
// The West. Erawan Falls: pools stepping down a forested hill, each spilling into the next.
function erawan(b,x,z){b.cylinder(x+1.7,z-.3,0,1.9,.6,3,'#4f6c45',9);for(let i=0;i<4;i++){const y=(3-i)*.45,e=z+i*.85;b.box(x,e,0,3.4,.95,y+.3,i%2?'#6f8a5a':'#5f7a50');b.box(x+.2,e+.1,y+.3,3,.7,.04,'#7ac0b8');if(i<3)b.box(x+1.1+i*.3,e+.8,y-.1,.8,.12,.42,'#e8eef0');}b.ball(x+.4,1.9,z+.3,.6,.7,.5,'#4f6c45',7);b.ball(x+3,1.7,z+.6,.55,.6,.5,'#55734a',7);}
// A tall waterfall over a cliff into its pool (Thi Lo Su).
function cliffFall(b,x,z){b.cylinder(x+1.8,z+.2,0,2,1.4,2.6,'#6d6458',9);b.cylinder(x+1.8,z+.2,2.6,1.45,.9,.6,'#4f6c45',9);for(const [a,w] of [[.9,.3],[1.4,.5],[2.1,.35],[2.6,.25]])b.beam(x+a,2.5,z+1.4,x+a,.05,z+2.2,w,.06,'#e8eef0');b.box(x+.3,z+2,-.01,3,1.2,.03,'#7ac0b8');for(const a of [.4,3.2])b.ball(x+a,.6,z+2.4,.45,.5,.4,'#4f6c45',7);}
// Phetchaburi's salt pans with heaps of salt, under a row of sugar palms.
function saltPans(b,x,z){for(let i=0;i<4;i++)for(let j=0;j<2;j++){b.box(x+i*.9,z+j*1.1,-.01,.86,1.06,.015,'#8a7a60');b.box(x+i*.9+.04,z+j*1.1+.04,0,.78,.98,.008,j?'#eef0ec':'#dfe6e4');}for(const a of [.3,.9,1.6,2.3,3])b.cylinder(x+a,z+2.55,0,.26,0,.5,'#f8f8f4',8,false);}
// The South. A southern bell chedi: a square base, a bell, a tall ringed spire with a gold tip.
function bellChedi(b,x,z,k=1,c='#efe9da',gold='#d4a63a'){const s=v=>v*k,cx=x+s(.5),cz=z+s(.5);b.box(x,z,0,s(1),s(1),s(.3),c);b.box(x+s(.1),z+s(.1),s(.3),s(.8),s(.8),s(.2),c);b.cylinder(cx,cz,s(.5),s(.42),s(.32),s(.2),c,12);b.ball(cx,s(.85),cz,s(.38),s(.36),s(.38),c,12);b.box(cx-s(.15),cz-s(.15),s(1.15),s(.3),s(.3),s(.18),c);for(let i=0;i<5;i++)b.cylinder(cx,cz,s(1.33+i*.16),s(.13-i*.018),s(.11-i*.018),s(.12),c,10);b.cylinder(cx,cz,s(2.13),s(.06),0,s(1.2),gold,8,false);}
// Wat Phra Borommathat Chaiya: a Srivijaya stupa of stepped brick tiers with small spires at each corner.
function srivijaya(b,x,z){const c='#9a7a5a',c2='#8a6a4c';b.box(x,z,0,2.4,2.4,.3,c2);b.box(x+.4,z+.4,.3,1.6,1.6,1,c);b.box(x+.25,z+1,.3,1.9,.4,.8,c);b.box(x+1,z+.25,.3,.4,1.9,.8,c);for(let i=0;i<3;i++){const w=1.2-i*.3,o=(2.4-w)/2;b.box(x+o,z+o,1.3+i*.4,w,w,.4,i%2?c2:c);for(const [a,e] of [[0,0],[w,0],[0,w],[w,w]])b.cylinder(x+o+a,z+o+e,1.7+i*.4,.08,0,.35,c,6,false);}b.cylinder(x+1.2,z+1.2,2.5,.15,0,.9,'#d4a63a',8,false);}
// The three central mosques of the deep south, each as its record describes it.
function mosque(b,x,z,kind){const w='#f2efe6',g='#3f7a62';
 if(kind==='pattani'){b.box(x,z,0,3.2,1.8,S*1.2,w);b.ball(x+1.6,S*1.2+.2,z+.9,.75,.8,.75,g,12);for(const [a,e] of [[.4,.3],[2.8,.3],[.4,1.5],[2.8,1.5]])b.ball(x+a,S*1.2+.12,z+e,.25,.28,.25,g,8);for(const a of [-.2,3.4]){b.cylinder(x+a,z+1.8,0,.14,.1,S*2.6,w,8);b.ball(x+a,S*2.6+.1,z+1.8,.14,.2,.14,g,8);}}
 else if(kind==='narathiwat'){b.box(x,z,0,2.4,2,S*1.9,w);for(let f=0;f<3;f++)b.box(x+.2,z+2,.3+f*S*.6,2,.012,S*.35,'#3e4e54',1);b.cylinder(x+1.2,z+1,S*1.9,.62,.62,.3,w,14);b.ball(x+1.2,S*1.9+.3,z+1,.62,.85,.62,'#3f7a62',14);b.cylinder(x+1.2,z+1,S*1.9+1.1,.03,0,.35,'#c9a14a',6,false);b.box(x+2.6,z+.4,0,.5,.5,S*3.2,w);b.ball(x+2.85,S*3.2+.1,z+.65,.25,.4,.25,'#3f7a62',8);}
 else{b.box(x,z,0,2.8,2,S*1.1,w);b.box(x+.9,z+.6,S*1.1,1,.8,S*.9,w);b.ball(x+1.4,S*2+.3,z+1,.55,.75,.55,'#dcdcd4',12);b.cylinder(x+1.4,z+1,S*2+1,.03,0,.35,'#c9a14a',6,false);for(let i=0;i<5;i++)b.box(x+.2+i*.5,z+2,.3,.3,.012,S*.6,'#3e4e54',1);}}
// A limestone tower: sheer grey sides, forest on top and hanging down one face.
function karst(b,x,z,h,R,y=0){b.cylinder(x,z,y,R,R*.7,h,'#8a8f80',7);b.cylinder(x,z,y+h,R*.75,R*.35,R*.5,'#5a7550',7);b.box(x-R*.3,z+R*.6,y+h*.3,R*.6,.05,h*.35,'#5a7550');}
// Central Thailand. A large Buddha image seated on its base, in the open or under a hall.
function seatedBuddha(b,x,z,c='#f2efe6',y=0,k=1){const s=v=>v*k;b.box(x,z,y,s(1.8),s(1.4),s(.3),'#d8d3c5');b.box(x+s(.1),z+s(.2),y+s(.3),s(1.6),s(1.1),s(.4),c);b.box(x+s(.45),z+s(.35),y+s(.7),s(.9),s(.7),s(1.1),c);for(const a of [.15,1.45])b.box(x+s(a),z+s(.7),y+s(.8),s(.2),s(.3),s(.6),c);b.ball(x+s(.9),y+s(2.15),z+s(.7),s(.36),s(.42),s(.34),c,10);b.cylinder(x+s(.9),z+s(.7),y+s(2.5),s(.12),0,s(.3),c,8,false);}
// A reclining Buddha under an open roof (Wat Phra Non Chaksi).
function recliner(b,x,z){const g='#d4a63a';b.box(x,z,0,3.6,1.6,.3,'#d8d3c5');b.box(x+.3,z+.4,.3,2.8,.7,.5,g);b.box(x+.5,z+.45,.8,2.2,.5,.3,g);b.box(x+2.85,z+.35,.3,.6,.8,.4,'#a5312a');b.ball(x+3.05,1.05,z+.75,.34,.38,.32,g,10);b.cylinder(x+3.05,z+.75,1.4,.1,0,.25,g,8,false);}
// Phra Prang Sam Yot: three linked Khmer towers.
function sanYot(b,x,z){for(let i=0;i<3;i++)prang(b,x+i*1.15,z,.95,'#a8704f','#e4decd');b.box(x+.9,z+.25,.25,.4,.5,.6,'#a8704f');b.box(x+2.05,z+.25,.25,.4,.5,.6,'#a8704f');}
// The Chao Phraya Dam at Chai Nat: a low barrage of piers and gates across the river.
function barrage(b,x,z,w){b.box(x,z,.3,w,.5,.12,'#c7c3b6');for(let a=0;a<w;a+=.6){b.box(x+a,z,-.02,.18,.5,.6,'#bdb9ac');b.box(x+a+.18,z+.15,.1,.42,.04,.3,'#5a6a72');}}
// Ruins of laterite: broken columns, a stump of chedi, a low wall (Kamphaeng Phet, Ayutthaya).
function ruins(b,x,z,r,c='#a8704f'){b.box(x,z,0,3.4,2.6,.15,'#b9a07a');for(let i=0;i<10;i++){const a=.3+(i%5)*.65,e=.4+Math.floor(i/5)*1.4;b.box(x+a,z+e,.15,.18,.18,.4+r()*.9,c);}b.cylinder(x+2.7,z+1.3,.15,.5,.3,1.2,c,8);b.box(x,z+2.5,.15,3.4,.1,.4,c);}
// The leaning chedi of Wat Paramaiyikawat: each tier a little further over than the last.
function leaningChedi(b,x,z){const c='#efe9da';b.box(x,z,0,1.6,1.6,.3,'#d8d3c5');for(let i=0;i<9;i++){const R=.7-i*.065,o=i*.13;b.cylinder(x+.8+o,z+.8,.3+i*.36,R,R-.05,.36,c,10);}b.cylinder(x+.8+1.17,z+.8,3.54,.06,0,.7,'#d4a63a',6,false);}
// A mondop: a square shrine under tier after tier of roofs rising to a spire (Wat Phra Phutthabat).
function mondop(b,x,z){b.box(x,z,0,2.6,2.6,.35,'#efe9da');b.box(x+.4,z+.4,.35,1.8,1.8,S*.9,'#d8c8a0');for(let i=0;i<5;i++){const w=2.2-i*.38,o=(2.6-w)/2;b.hip(x+o,z+o,.35+S*.9+i*.4,w,w,.36,i%2?'#d4a63a':'#3f7a5a',.1);}b.cylinder(x+1.3,z+1.3,.35+S*.9+2,.1,0,1.2,'#d4a63a',8,false);}
// A Sukhothai lotus-bud chedi among laterite pillars.
function lotusChedi(b,x,z){const c='#cfc7b4';b.box(x,z,0,1.6,1.6,.3,c);b.box(x+.2,z+.2,.3,1.2,1.2,.3,c);b.box(x+.4,z+.4,.6,.8,.8,1.2,c);b.ball(x+.8,2.15,z+.8,.36,.55,.36,c,10);b.cylinder(x+.8,z+.8,2.6,.06,0,.5,c,6,false);}
function vehicle(b,kind,x,z,w,d,acc,marks,pc){
 if(kind==='samlor'){b.box(x+.1,z+.12,.3,w*.42,d-.24,.05,WOOD);b.box(x+.1,z+.1,.5,w*.42,d-.2,.05,'#7a3f3a');b.beam(x+.5,.3,z+d/2,x+w-.05,.62,z+d/2,.03,.03,RUBBER);b.gable(x+.08,z+.08,.92,w*.46,d-.16,.04,'#3f4a48',{over:.03});for(const a of [.2,.2])b.ball(x+a,.14,z+.06,.14,.14,.02,RUBBER,8);b.ball(x+.2,.14,z+d-.06,.14,.14,.02,RUBBER,8);b.ball(x+w-.08,.14,z+d/2,.14,.14,.02,RUBBER,8);return;}
 if(kind==='tuktuk'){b.box(x,z,.14,w,d,.26,'#2f6f62');b.box(x+.05,z+.03,.72,w-.1,d-.06,.04,'#d9c27a');for(const[a,e]of[[.05,.05],[w-.1,.05],[.05,d-.1],[w-.1,d-.1]])b.box(x+a,z+e,.4,.035,.035,.33,STEEL);for(const[a,e]of[[w-.1,d/2-.04],[.12,-.01],[.12,d-.08]])b.box(x+a,z+e,0,.12,.08,.14,RUBBER);return;}
 if(kind==='motorbike'||kind==='rider'){b.box(x+.15,z+.11,.22,w-.3,.08,.12,kind==='rider'?'#b5553c':'#3f4a50');b.box(x+.18,z+.1,.34,.3,.1,.05,RUBBER);b.ball(x+.12,.14,z+.15,.14,.14,.025,RUBBER,8);b.ball(x+w-.12,.14,z+.15,.14,.14,.025,RUBBER,8);b.beam(x+w-.15,.15,z+.15,x+w-.25,.52,z+.15,.03,.03,STEEL);if(kind==='rider')b.box(x+.05,z+.03,.38,.28,.24,.26,'#e4dfd2');return;}
 if(kind==='bicycle'){b.ball(x+.14,.14,z+.1,.14,.14,.012,RUBBER,8);b.ball(x+w-.14,.14,z+.1,.14,.14,.012,RUBBER,8);b.beam(x+.14,.14,z+.1,x+w*.5,.34,z+.1,.02,.02,'#5a6a6a');b.beam(x+w-.14,.14,z+.1,x+w*.55,.36,z+.1,.02,.02,'#5a6a6a');b.beam(x+w*.35,.38,z+.1,x+w*.7,.42,z+.1,.02,.02,'#5a6a6a');return;}
 if(kind==='pickup'||kind==='car'){const body=kind==='car'?acc:pc??'#c4c0b0';
  // Chiang Mai's red songthaew: a pickup with a roof over two benches.
  if(kind==='pickup'&&pc==='#a8322a'){b.box(x+.05,z+.05,.62,w*.5,d-.1,.04,body);for(const e of [.06,d-.1])b.box(x+.08,z+e,.32,w*.45,.04,.3,body);}b.box(x,z,.1,w,d,.22,body);b.box(x+(kind==='car'?.32:.55),z+.04,.32,w*(kind==='car'?.5:.33),d-.08,.2,kind==='car'?'#55686e':'#5a6e72');b.box(x+(kind==='car'?.36:.58),z+.05,.52,w*(kind==='car'?.42:.28),d-.1,.02,body);for(const a of [.12,w-.34])for(const e of [-.008,d-.012])b.box(x+a,z+e,0,.22,.02,.22,RUBBER);return;}
}
function prop([kind,x,z,w,d],b,plan,r){
 const leaf=plan.palette.leaf,acc=plan.palette.accent;
 if(kind==='spirit'){b.box(x,z,0,.06,.06,.82,'#e6dcc2');b.box(x-.14,z-.14,.82,.34,.34,.03,'#d9b24a');b.box(x-.07,z-.07,.85,.2,.2,.18,'#e9c46a');b.gable(x-.1,z-.1,1.03,.26,.26,.14,'#b0472f',{over:.04});b.box(x-.18,z+.2,0,.09,.09,.06,'#c8372d');return;}
 if(kind==='pole'){b.box(x,z,0,.07,.07,S*2.1,'#8a8880');b.box(x-.32,z,S*2.1-.14,.72,.04,.04,'#5a5a52');b.box(x-.08,z+.06,S*1.7,.2,.14,.22,'#8a8f88');return;}
 if(kind==='cart'){b.box(x,z,.32,w,d,.24,'#d9d2c0');b.box(x-.02,z-.02,.56,w+.04,d+.04,.03,'#8a7050');b.box(x+.02,z+d/2-.015,.1,.03,.03,.24,STEEL);b.ball(x+.14,.12,z-.015,.12,.12,.012,RUBBER,8);b.ball(x+.14,.12,z+d+.015,.12,.12,.012,RUBBER,8);b.box(x+w/2-.012,z+d/2-.012,.56,.024,.024,.75,'#6b5236');if(plan.marks.stools)b.cylinder(x+w/2,z+d/2,1.28,.62,.0,.2,acc,10,false);else b.gable(x-.1,z-.08,1.2,w+.2,d+.16,.2,'#8a7050',{over:.02});if(plan.marks.stools)for(const[a,e]of[[-.1,d+.3],[.4,d+.42],[.8,d+.26]])b.cylinder(x+a,z+e,0,.09,.075,.2,'#3f6f9a',8);return;}
 if(kind==='bananas')return bananas(b,x,z);
 if(['samlor','tuktuk','motorbike','rider','bicycle','pickup','car'].includes(kind))return vehicle(b,kind,x,z,w,d,acc,plan.marks,plan.palette.pickup);
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
  const {palette:P,marks,style,seed,year,flood}=plan,r=lifeRandom(seed,'layout'+style+(plan.place.lanna||plan.place.isan||plan.place.east||plan.place.west||plan.place.south||plan.place.central?plan.regionId:''));
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
  const field=(x,z,w,d,kind)=>{if(kind==='paddy')return paddy(x,z,w,d);if(!clearOfRoutes(x,z,w,d))return;open.box(x,z,-.02,w,d,.012,'#7f8a5a');
   for(let a=.35;a<w-.2;a+=kind==='pineapple'||kind==='garlic'?.3:kind==='cane'?.4:.75)for(let e=.35;e<d-.2;e+=kind==='pineapple'||kind==='garlic'?.3:kind==='cane'?.4:.75){if(kind==='pineapple'||kind==='garlic'){open.cylinder(x+a,z+e,0,kind==='garlic'?.06:.09,0,kind==='garlic'?.14:.2,kind==='garlic'?'#9ab07a':'#6f8a5a',5,false);continue;}if(kind==='cane'){for(const o of [-.06,.06])open.cylinder(x+a+o,z+e,0,.025,.015,.8,'#8aa05a',4,false);continue;}if(kind==='coconut'){palm(open,x+a,z+e,1.4+((a*7+e*3)%1)*.6,['#6f9a4a','#5a8a3f'],()=>.5);continue;}if(kind==='rubber'){open.cylinder(x+a,z+e,0,.05,.04,1.1,'#7a6a58',5);open.ball(x+a,1.25,z+e,.32,.28,.32,'#4f6c45',6);continue;}const h=kind==='durian'?1.2:.8;open.cylinder(x+a,z+e,0,.04,.03,h*.5,'#5f4a38',5);open.ball(x+a,h*.72,z+e,h*.3,h*.26,h*.3,kind==='durian'?'#3f5a3a':'#4f6c45',6);}};
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
   // The North: a valley under a mountain ridge, a Lanna wat, and the one thing each province is
   // known for in its research record (research/provinces/north.json).
   lanna(){const id=plan.regionId,town=style==='market',early=!marks.concrete,river=['chiang-rai','nan','uttaradit'].includes(id);
    ridge(open,r,{high:id==='mae-hong-son',crown:{'chiang-mai':'#d4a63a',phrae:'#d4a63a'}[id],fall:id==='mae-hong-son'});
    if(river){water(-5.5,-2.6,1.1,9.6);water(-5.5,8.9,1.1,9.5);}
    institutions(town?!early:marks.concrete&&year>=1990,town?wall():'#d8cda8',pick(P.roofs));
    const make=f=>(x,z,w,d)=>unit(b=>f(b,x,z,w,d),[x,z,w,d]);
    const shop=(b,x,z,w,d)=>{if(early||r()<P.wood)woodShop(b,x,z,w,d,pick(['#6d5640','#7f6243','#5f4a38']),r,2);else concreteShop(b,x,z,w,d,wall(),r,cap(x,z,2+Math.floor(r()*2)),P.accent,marks);};
    const rw=(x0,x1,z,d)=>row(x0,x1,z,d,1.1,1.8,make(shop));
    if(town){rw(-5.2,2.4,4.7,2.2);rw(2.9,6.9,-.5,2.8);rw(-5.2,.9,12.2,2.6);rw(.9,8.4,15,2.6);rw(9.2,18.2,14.8,2.4);
     // Lampang's ceramic works are drawn from 1990, on the safe side of the record (no start year in it).
     if(id==='lampang'&&year>=1990)unit(b=>kilns(b,-5.2,-.9,2),[-5.2,-.9,3,1.9]);else rw(-5.2,-2.3,-.6,2.2);
     if(marks.store)unit(b=>store(b,13.8,9.2,2.4,1.8,r),[13.8,9.2,2.4,1.8]);else unit(b=>woodShop(b,13.8,9.2,2.2,1.8,'#6d5640',r,1),[13.8,9.2,2.2,1.8]);}
    else{const crop={lamphun:'longan',uttaradit:'durian','chiang-rai':'pineapple'}[id];
     [[-5,9.3,3,3.6],[9.3,13,4.2,3.2],[14.2,9.2,3.9,3],[14,13.2,4,3],[-1.7,12,2.5,2.4]].forEach(([x,z,w,d],i)=>{if(r()<.88)field(river&&x<-4?-4.2:x,z,river&&x<-4?w-.8:w,d,crop&&i!==2?crop:'paddy');});
     // Free plots on this board, found by search: off every road, lot, plot and field.
     for(const [x,z] of [[-4.3,-.1],[-4.3,2.3],[-4.3,4.6],[3.7,10.9],[1.2,13.4],[4.2,14.9],[1.2,15.9],[-4.3,16.4],[9.2,16.4],[12.2,16.4],[15.2,16.4]]){const X=Math.max(river?-4.2:-5.2,x+r()*.3),Z=z+r()*.3,w=1.8+r()*.5,d=1.5+r()*.3;if(r()<.82&&clearOfRoutes(X,Z,w,d))unit(b=>{stilt(b,X,Z,w,d,pick(['#6d5640','#7a5f45','#5f4a38']),pick(['#7d4a36','#6f5a48']),r,marks);const top=m(2.1)+.05+m(2.3)+m(1.7);kalae(b,X,top,Z+d/2);kalae(b,X+w,top,Z+d/2);},[X,Z,w,d]);}
     if(marks.store){const x=river?-4.35:-4.8;unit(b=>store(b,x,12.9,1.9,1.3,r),[x,12.9,1.9,1.3]);}}
    // The province's own landmark, in the plot the town camera aims at.
    const Z=[14.3,2.2,3.8,4.6];
    ({'chiang-mai'(){water(14.3,6.1,3.9,.5);water(17.7,2.3,.5,3.8);unit(b=>{b.box(14.4,5.4,0,3.2,.36,.62,'#a8704f');b.box(17.1,2.4,0,.36,3.2,.62,'#a8704f');b.box(16.9,5.2,0,.8,.8,.86,'#9a6446');for(let i=0;i<6;i++)b.box(14.5+i*.42,5.4,.62,.2,.36,.12,'#a8704f');},[14.4,2.4,3.3,3.6]);unit(b=>brickChedi(b,15.6,2.6),[15.6,2.6,2,2]);},
      'chiang-rai'(){if(year>=1997)unit(b=>lannaWat(b,15.1,2.4,2.2,3.2,{white:true}),[15.1,2.4,2.2,3.2]);else field(14.4,2.4,3.6,4.2,'pineapple');},
      lampang(){unit(b=>openViharn(b,14.4,3.4,2.1,3),[14.4,3.4,2.1,3]);unit(b=>lannaChedi(b,17.4,3,1.4,'#9a7a4a'),[16.7,2.3,1.4,1.4]);},
      lamphun(){unit(b=>pyramid(b,15,3),[15,3,2.6,2.6]);},
      'mae-hong-son'(){unit(b=>{b.cylinder(16.2,4.4,0,1.8,.45,2.2,'#5a7550',8);lannaChedi(b,16.2,4.4,.8,'#efe9da',2.2);},[14.4,2.6,3.6,3.6]);},
      nan(){unit(b=>crossHall(b,14.8,3,3.2),[14.8,3,3.2,3.2]);water(14.3,6.5,3.9,.4);},
      phayao(){water(14.4,2.3,3.7,4.4);boat(15.2,4.6,1.2,'#6d5640');for(const [x,z] of [[18.3,2.6],[18.3,5.6]])tree(open,x,z,1.6+r()*.7,P.leaf,r);},
      phrae(){unit(b=>pillars(b,14.4,2.6,r),[14.4,2.6,3.6,2.1]);},
      uttaradit(){unit(b=>bigTeak(b,16.2,4.4),[15,3.2,2.4,2.4]);}})[id]?.();
    scatterTrees(town?8:13,[[-5,2.7,7,.5],[8.9,12.4,9,.6],[-1,9,3.6,2],[14,7,4,1.6],[-5.2,17,23,1.2]],[1.4,2.4]);},
   // The Northeast: a flat plateau of rice, a sim and a Lao-style that, the Mekong or the Chi where
   // the record names them, and each province's own landmark (research/provinces/northeast.json).
   isan(){const id=plan.regionId,town=style==='market',early=!marks.concrete;
    const mekong=['bueng-kan','mukdahan','nakhon-phanom','nong-khai','amnat-charoen','ubon-ratchathani'].includes(id),chi=['khon-kaen','maha-sarakham','loei','yasothon'].includes(id),side=chi&&!town;
    const hills={chaiyaphum:{fall:true},loei:{mesa:true},'nakhon-ratchasima':{low:true},'nong-bua-lamphu':{low:true},'sakon-nakhon':{low:true},sisaket:{low:true},surin:{low:true},'amnat-charoen':{low:true},mukdahan:{low:true}}[id];
    if(hills)ridge(open,r,hills);
    // Phu Thok, the lonely mountain, stands apart behind Bueng Kan.
    if(id==='bueng-kan'){open.cylinder(12.6,-8.4,-1.3,2,1.6,5.4,'#8a7a62',8);open.cylinder(12.6,-8.4,4.1,1.75,1.1,.8,'#4f6b45',8);}
    if(mekong||id==='sakon-nakhon')water(-5.4,-5.4,23.8,2.4);else if(chi&&town)water(-5.4,-5.4,23.8,1.7);
    // Where the Mun meets the Mekong at Khong Chiam the two rivers run side by side in two colours.
    if(id==='ubon-ratchathani')open.box(-5.4,-5.4,-.014,23.8,1.1,.014,'#8a8462');
    if(id==='amnat-charoen')for(const [x,z] of [[-3.2,-4.6],[-1.6,-4.1],[11.6,-4.8],[14.8,-4.2],[16.6,-4.7]])open.ball(x,.05,z,.45+r()*.3,.32,.32,'#9a948a',6);
    // The Friendship Bridges carry the cross street over the Mekong to Laos, from the year each opened.
    const bridge={'nong-khai':1994,mukdahan:2006}[id];
    if(bridge&&year>=bridge){open.beam(8.1,0,-2.2,8.1,.34,-3,1.6,.06,'#c7c3b6');open.box(7.3,-5.6,.28,1.6,2.6,.12,'#c7c3b6');for(const e of [0,1.52])open.box(7.3+e,-5.6,.4,.08,2.6,.12,'#b0ac9f');open.box(7.85,-4.6,-.02,.5,.3,.3,'#bdb9ac');for(const e of [-.1,1.62])open.box(7.3+e-.04,-5.5,0,.12,.12,S*1.6,'#d9d4c6');open.box(7.2,-5.5,S*1.6,1.9,.12,.12,'#a51931');}
    else if(mekong)boat(7.4,-4.6,1.4,pick(['#6d5640','#3f6f8a']));
    if(side){water(-5.5,-2.6,1.1,9.6);water(-5.5,8.9,1.1,9.5);}
    institutions(town?!early:marks.concrete&&year>=1990,town?wall():'#d8cda8',pick(P.roofs));
    const make=f=>(x,z,w,d)=>unit(b=>f(b,x,z,w,d),[x,z,w,d]);
    const shop=(b,x,z,w,d)=>{if(early||r()<P.wood)woodShop(b,x,z,w,d,pick(['#8f6f4c','#7f6243','#9a7c5a']),r,2);else concreteShop(b,x,z,w,d,wall(),r,cap(x,z,2+Math.floor(r()*2)),P.accent,marks);};
    // Each town's rows start and run to their own depth, so no two Isan towns share a street.
    const rw=(x0,x1,z,d)=>row(x0+r()*.6,x1,z,d-r()*.5,1.1,1.8,make(shop));
    if(town){rw(-5.2,2.4,4.7,2.2);rw(2.9,6.9,-.5,2.8);rw(-5.2,.9,12.2,2.6);rw(.9,8.4,15,2.6);rw(-5.2,-2.3,-.6,2.2);
     // Chang Arena opened on 4 June 2011.
     if(id==='buriram'&&year>=2011)unit(b=>stadium(b,10.4,14.7,5.8,3.4),[10.15,14.65,6.3,3.5]);else rw(9.2,18.2,14.8,2.4);
     if(marks.store)unit(b=>store(b,13.8,9.2,2.4,1.8,r),[13.8,9.2,2.4,1.8]);else unit(b=>woodShop(b,13.8,9.2,2.2,1.8,'#8f6f4c',r,1),[13.8,9.2,2.2,1.8]);}
    else{const crop={'bueng-kan':'rubber',sisaket:'garlic',kalasin:'cane',chaiyaphum:'cane'}[id];
     [[-5,9.3,3,3.6],[9.3,13,4.2,3.2],[14.2,9.2,3.9,3],[14,13.2,4,3],[-1.7,12,2.5,2.4]].forEach(([x,z,w,d],i)=>{if(r()<.9)field(side&&x<-4?-4.2:x,z,side&&x<-4?w-.8:w,d,crop&&i%2?crop:'paddy');});
     for(const [x,z] of [[-4.3,-.1],[-4.3,2.3],[-4.3,4.6],[3.7,10.9],[1.2,13.4],[4.2,14.9],[1.2,15.9],[-4.3,16.4],[9.2,16.4],[12.2,16.4],[15.2,16.4]]){const X=Math.max(side?-4.2:-5.2,x+r()*.6),Z=z+r()*.3,w=1.8+r()*.5,d=1.5+r()*.3;if(r()<.82&&clearOfRoutes(X,Z,w,d))unit(b=>stilt(b,X,Z,w,d,pick(['#8f6f4c','#9a7c5a','#7f6243']),marks.concrete?ZINC:pick(['#7a6a55','#8b7c68']),r,marks),[X,Z,w,d]);}
     // A rice barn on posts beside the house.
     for(const [x,z] of [[.2,2.2],[11.6,-2.4]])if(clearOfRoutes(x,z,.8,.7))unit(b=>{for(const [a,e] of [[0,0],[.68,0],[0,.58],[.68,.58]])b.box(x+a,z+e,0,.07,.07,m(1.3),WOOD);b.box(x-.03,z-.03,m(1.3),.84,.74,m(1.6),'#9a7c5a');b.gable(x-.08,z-.08,m(2.9),.94,.84,m(.9),'#8b7c68',{along:'x',over:.08});},[x,z,.8,.7]);
     if(marks.store){const x=side?-4.35:-4.8;unit(b=>store(b,x,12.9,1.9,1.3,r),[x,12.9,1.9,1.3]);}}
    // The province's own landmark, in the plot the town camera aims at.
    ({'amnat-charoen'(){unit(b=>loomShed(b,14.6,2.6),[14.5,2.5,1.9,1.4]);for(let i=0;i<4;i++)open.box(16.6,2.6+i*.55,-.01,1.3,.42,.012,i%2?'#c9b07a':'#b8a06a');paddy(14.4,4.8,3.6,1.9);},
      'bueng-kan'(){for(const [x,z,k] of [[15.6,3,1.3],[16.4,4.6,1],[17.1,6,.7]])unit(b=>{b.ball(x,.35*k,z,1.3*k,.75*k,.55*k,'#7d776d',8);b.ball(x-1.15*k,.6*k,z,.25*k,.35*k,.3*k,'#7d776d',6);},[x-1.4*k,z-.55*k,2.7*k,1.1*k]);},
      buriram(){unit(b=>{b.cylinder(16.2,3.9,0,1.9,.8,1.3,'#7a8a58',9);prang(b,15.75,3.4,.9,'#b8a283','#a89070',1.3);},[14.3,2,3.8,3.8]);open.box(15.95,5.6,-.01,.5,1.2,.05,'#b8a283');for(let e=5.7;e<6.8;e+=.3)for(const a of [15.9,16.45])open.cylinder(a,e,0,.04,.04,.24,'#a89070',6);},
      chaiyaphum(){unit(b=>mushrooms(b,14.4,2.4,3.6,2.2,r),[14.4,2.4,3.6,2.2]);open.box(14.4,4.9,-.02,3.6,1.8,.012,'#7f8a5a');for(let a=.2;a<3.5;a+=.24)for(let e=.2;e<1.7;e+=.24)open.box(14.4+a,4.9+e,0,.06,.06,.14,r()<.5?'#c86a9a':'#a85a8a');},
      kalasin(){if(year>=1968){water(14.3,2.2,3.8,4.2);unit(b=>{b.box(14.1,6.4,0,4.2,.5,.45,'#c7c3b6');for(let x=15.2;x<17.4;x+=.5)b.box(x,6.85,0,.3,.06,.36,'#5a6a6e');},[14.1,6.4,4.2,.5]);if(year>=2006){open.box(14.1,4.3,.2,4.2,.3,.07,'#c7c3b6');for(let x=14.4;x<18;x+=.8)open.box(x,4.38,0,.12,.14,.2,'#bdb9ac');}}else paddy(14.4,2.4,3.6,4.2);},
      'khon-kaen'(){unit(b=>{b.box(15.1,3,0,2.2,2.2,.2,'#d8d3c5');that(b,15.5,3.4,1.4,'#d4a63a','#e2b450',.2);},[15.1,3,2.2,2.2]);},
      loei(){unit(b=>{b.box(15.2,3,0,1.9,1.9,.16,'#d8d3c5');that(b,15.45,3.25,1.4,'#f2efe6','#d4a63a',.16);},[15.2,3,1.9,1.9]);},
      'maha-sarakham'(){if(year>=1972)unit(b=>{const c='#a8704f';b.box(14.6,3.4,0,3.2,1.1,.1,'#b8a07a');for(const [a,e,w,d] of [[0,0,3.2,.14],[0,.96,3.2,.14],[0,0,.14,1.1],[3.06,0,.14,1.1]])b.box(14.6+a,3.4+e,.1,w,d,.24,c);for(const [a,e] of [[-.3,-.3],[3.3,-.3],[-.3,1.3],[3.3,1.3],[1.6,-.4],[1.6,1.4]])b.box(14.6+a,3.4+e,0,.14,.06,.36,'#9a8a70');},[14.3,3,3.8,1.8]);else unit(b=>b.ball(16.2,0,4,1.8,.3,.8,'#8a9a5a',8),[14.4,3.2,3.6,1.6]);water(14.3,5.6,3.8,1);},
      mukdahan(){unit(b=>{b.box(14.4,2.4,0,3.6,3.4,.22,'#b8a07a');mushrooms(b,14.4,2.4,3.6,3.4,r,.22);},[14.4,2.4,3.6,3.4]);},
      'nakhon-phanom'(){for(const [a,e,w,d] of [[0,0,3.8,.12],[0,4.4,3.8,.12],[0,0,.12,4.5],[3.68,0,.12,4.5]])open.box(14.3+a,2.2+e,0,w,d,.3,'#efe9da');if(year>=1976&&year<=1978)unit(b=>scaffold(b,15.4,3.6,1.6),[15.3,3.5,1.8,1.8]);else unit(b=>that(b,15.4,3.6,1.6,'#f2efe6','#d4a63a'),[15.4,3.6,1.6,1.6]);},
      'nakhon-ratchasima'(){unit(b=>{const c='#b8a283';for(const [a,e,w,d] of [[0,0,3.6,.26],[0,3.34,1.5,.26],[2.1,3.34,1.5,.26],[0,0,.26,3.6],[3.34,0,.26,3.6]])b.box(14.4+a,2.3+e,0,w,d,.55,c);b.box(15.85,5.5,0,.9,.4,.75,c);prang(b,15.45,3.35,1.5,'#c8b08a','#9a8264');},[14.3,2.2,3.8,3.8]);open.box(15.8,6.1,-.01,1,.6,.08,'#a89070');},
      'nong-bua-lamphu'(){unit(b=>{b.cylinder(16.2,4,0,1.9,1.1,2.2,'#9a9484',7);b.cylinder(16.2,4,2.2,1.1,.5,.5,'#4f6b45',7);b.box(15.6,5.45,0,1.2,.3,.9,'#2a2520');},[14.3,2.1,3.8,3.8]);for(let i=0;i<4;i++)open.box(15.9,5.8+i*.18,0,.6,.18,.12-i*.03,'#b9b6aa');},
      'nong-khai'(){if(year>=1978)unit(b=>keoku(b,15,3.4),[15,3.2,3.2,1.6]);else paddy(14.4,2.4,3.6,4.2);},
      'roi-et'(){water(14.3,3.3,3.8,1.9);for(const x of [14.8,16.6])boat(x,3.9+r()*.5,1.2,pick(['#6d5640','#3f6f8a']));open.box(17.6,3.1,0,.06,.06,.9,WOOD);open.beam(17.63,.9,3.13,16.9,.02,3.9,.04,.04,WOOD);paddy(14.3,2.2,3.8,.9);paddy(14.3,5.5,3.8,1.3);},
      'sakon-nakhon'(){unit(b=>{const c='#e8e2d0';b.box(14.8,2.4,0,2.6,1.8,.2,'#d8d3c5');for(let i=0;i<5;i++)b.box(15+i*.12,2.55+i*.1,.2+i*.42,2.2-i*.24,1.5-i*.2,.42,i>3?'#c99a3a':c);b.cylinder(16.1,3.3,2.3,.1,0,.8,'#c99a3a',6,false);},[14.8,2.4,2.6,1.8]);if(year>=1980){for(const [a,e] of [[0,0],[3.6,0],[0,1.4],[3.6,1.4]])open.box(14.4+a,5+e,0,.05,.05,.3,WOOD);for(const [x,z] of [[14.8,5.4],[15.8,5.7],[16.9,5.3],[17.3,6]])cow(open,x,z);}},
      sisaket(){unit(b=>{b.box(14.8,2.8,0,2.6,2.4,.14,'#9a8a70');prang(b,15.6,3.4,1.1,'#a8704f','#9a6446',.14);},[14.8,2.8,2.6,2.4]);field(14.4,5.5,3.6,1.3,'garlic');},
      surin(){water(14.3,2.2,3.8,.35);water(14.3,6.2,3.8,.35);unit(b=>{b.box(15,2.8,0,3,3,.3,'#a8704f');for(const [a,e] of [[.2,.2],[2.2,.2],[.2,2.2],[2.2,2.2]])prang(b,15+a,2.8+e,.55,'#a8704f','#9a6446',.3);prang(b,16.05,3.85,.9,'#b07a58','#9a6446',.3);},[14.8,2.6,3.4,3.4]);for(const x of [14.6,16.6])unit(b=>elephant(b,x,6.65),[x-.05,6.6,1.1,.5]);},
      'ubon-ratchathani'(){unit(b=>{for(let i=0;i<3;i++)b.box(14.3+i*.15,2.2+i*.35,0,3.8-i*.3,1.6-i*.35,2.8-i*.5,i%2?'#a88a62':'#b89a72');for(let i=0;i<12;i++)b.box(14.6+(i%6)*.55,3.81,.9+Math.floor(i/6)*.45,.32,.012,.22,'#a0402a');},[14.3,2.2,3.8,1.6]);unit(b=>mushrooms(b,14.4,4.4,3.6,2.2,r),[14.4,4.4,3.6,2.2]);},
      yasothon(){water(14.3,2.2,3.8,.4);water(14.3,6.4,3.8,.4);water(14.3,2.6,.4,3.8);water(17.7,2.6,.4,3.8);open.box(14.75,2.65,0,2.9,3.7,.35,'#8a7a5a');open.box(15,2.9,.35,2.4,3.2,.05,'#8a9a5a');for(const [x,z] of [[15.3,3.3],[16.9,3.4],[15.4,5.7],[17,5.6],[16.2,4.5]])tree(open,x,z,1.4+r()*.6,P.leaf,r);}})[id]?.();
    scatterTrees(town?8:13,[[-5,2.7,7,.5],[8.9,12.4,9,.6],[-1,9,3.6,2],[14,7,4,1.6],[-5.2,17,23,1.2]],[1.4,2.4]);},
   // The East: the industrial coast, the orchard provinces and the border market. The sea or the
   // river runs along the back where the record names it; each province's landmark sits in its plot.
   east(){const id=plan.regionId,town=style==='market',early=!marks.concrete;
    const sea=['samut-sakhon','samut-songkhram','chonburi','rayong','trat','phetchaburi','prachuap-khiri-khan','chumphon','krabi','nakhon-si-thammarat','narathiwat','pattani','phang-nga','phuket','satun','songkhla','trang','ranong'].includes(id),river=['chachoengsao','chanthaburi','kanchanaburi','ratchaburi','tak','surat-thani','phatthalung','ang-thong','chai-nat','kamphaeng-phet','lopburi','nakhon-nayok','nakhon-pathom','nonthaburi','pathum-thani','phichit','phitsanulok','ayutthaya','sing-buri','sukhothai','suphan-buri','uthai-thani','yaowarat'].includes(id);
    const hills={chachoengsao:{low:true},chonburi:{low:true},prachinburi:{},'sa-kaeo':{low:true},chanthaburi:{},kanchanaburi:{},phetchaburi:{},ratchaburi:{low:true},tak:{high:true},'nakhon-si-thammarat':{high:true},ranong:{},yala:{high:true},phatthalung:{low:true},songkhla:{low:true,crown:'#efe9da'},narathiwat:{low:true},chumphon:{low:true},trang:{low:true},'kamphaeng-phet':{low:true},'nakhon-nayok':{high:true},phetchabun:{high:true},saraburi:{low:true},sukhothai:{},'uthai-thani':{low:true},phitsanulok:{low:true}}[id];if(hills)ridge(open,r,hills);
    if(sea){water(-5.4,-5.4,23.8,2.3);open.box(-5.4,-3.1,-.016,23.8,.5,.014,'#ddd0a8');}else if(river)water(-5.4,-5.4,23.8,1.8);
    if(id==='rayong'){open.cylinder(3,-9.6,-1.3,4.4,4.4,.02,'#4f7f8c',20);for(const [x,z,a,c] of [[3,-9.6,2.6,.6],[3,-8.6,.6,2]])open.ball(x,-1.28,z,a,.9,c,'#5f7a52',10);}
    // Khao Sam Roi Yot: limestone peaks standing straight up from the shore.
    if(id==='prachuap-khiri-khan')for(const [x,h] of [[-3,3.4],[-.6,4.6],[1.6,3],[11.2,4],[13.4,5.2],[15.6,3.6]]){open.cylinder(x,-7.6,-1.3,1.1,.45,h,'#8a8f80',6);open.cylinder(x,-7.6,h-1.3,.45,.2,.4,'#5a7550',6);}
    // Offshore: Chumphon's low islands, Tarutao off Satun, Ko Libong off Trang, Krabi's and Phang Nga's limestone towers in the sea, Khao Sok's inland.
    if(id==='chumphon')for(const x of [1,12.6])island(open,x,-9.6,1.6,.9,'#5f7a52','#ddd0a8');
    if(id==='satun')island(open,11,-10.6,3,3.6,'#4f6b45','#ddd0a8');if(id==='trang')island(open,4,-10,3.2,1.2,'#5f7a52','#ddd0a8');
    if(id==='krabi'||id==='phang-nga'){open.cylinder(6,-9.6,-1.3,12,12,.02,'#3f8090',20);for(const [x,z,h,R] of [[-2.6,-8,3.6,.9],[.6,-9.4,4.6,1.1],[3,-7.8,2.6,.7],[11.4,-8.4,4.2,1],[14,-9.8,5,1.2],[16.2,-7.9,3,.8]])karst(open,x,z,h,R,-1.3);}
    if(id==='surat-thani')for(const [x,h] of [[-2,4.2],[.6,5.4],[11.6,4.8],[14,6],[16.4,4]])karst(open,x,-7.8,h,1,-1.3);
    if(id==='trat')island(open,9.6,-10.4,3.2,4.6,'#4f6b45','#ddd0a8');
    // Laem Chabang's container port, completed 1991; before it the shore had fishing boats.
    // The Tinsulanonda Bridge from Songkhla to Ko Yo opened in 1986.
    if(id==='songkhla'&&year>=1986){open.beam(8.1,0,-2.2,8.1,.34,-3,1.6,.06,'#c7c3b6');open.box(7.3,-5.6,.28,1.6,2.6,.12,'#c7c3b6');for(const e of [0,1.52])open.box(7.3+e,-5.6,.4,.08,2.6,.12,'#b0ac9f');for(const z of [-4.2,-5.2])open.box(7.85,z,-.02,.5,.3,.3,'#bdb9ac');}
    if(id==='chonburi'&&year>=1991){open.box(-5.4,-3.3,-.01,12.4,.7,.03,'#b9b6aa');open.box(-4.6,-5.25,-.02,5.2,.9,.32,'#3f4a58');containers(open,-4.4,-5.2,14,2,r);for(const x of [-4.8,-2.8,-.8]){for(const a of [0,.9])for(const e of [-3.2,-2.7])open.box(x+a,e,0,.08,.08,2.2,'#c9a14a');open.box(x-.05,-5.4,2.2,1.05,3,.14,'#c9a14a');open.box(x+.2,-3.1,2.34,.6,.5,.3,'#ece7da');}for(const x of [2.2,4.4])if(clearOfRoutes(x,-2.6,2.2,1.2)&&clearOfLots(x,-2.6,2.2,1.2))containers(open,x,-2.6,6,3,r);}
    // The Thai-Myanmar Friendship Bridge over the Moei at Mae Sot opened in 1997.
    if(id==='tak'&&year>=1997){open.beam(8.1,0,-2.2,8.1,.34,-3,1.6,.06,'#c7c3b6');open.box(7.3,-5.6,.28,1.6,2.6,.12,'#c7c3b6');for(const e of [0,1.52])open.box(7.3+e,-5.6,.4,.08,2.6,.12,'#b0ac9f');for(const e of [-.1,1.62])open.box(7.3+e-.04,-5.5,0,.12,.12,S*1.6,'#d9d4c6');open.box(7.2,-5.5,S*1.6,1.9,.12,.12,'#a51931');}
    if(sea&&!(id==='chonburi'&&year>=1991))for(const x of [-3.5,3,11,15.5])boat(x+r(),-5.1+r()*.8,1.5,pick([P.accent,'#2f6f9a','#c0563f']));
    if(river)for(const x of [-4,3.2,12.6])boat(x+r()*.6,-5.1,1.4,pick(['#6d5640','#3f6f8a']));
    institutions(town?!early:marks.concrete&&year>=1990,town?wall():'#d8cda8',pick(P.roofs));
    const make=f=>(x,z,w,d)=>unit(b=>f(b,x,z,w,d),[x,z,w,d]);
    // Phuket's and Songkhla's old towns are rows of narrow pastel Sino-Portuguese shophouses.
    const sino=['phuket','songkhla','yaowarat'].includes(id);
    const shop=(b,x,z,w,d)=>{if(sino)concreteShop(b,x,z,w,d,pick(['#e8b8a8','#a8d0c8','#e8d890','#c8b8e0','#f0c8a0']),r,2,'#ece6d8',marks);else if(early||r()<P.wood)woodShop(b,x,z,w,d,pick(['#8f6f4c','#7f6243','#9a7c5a']),r,2);else concreteShop(b,x,z,w,d,wall(),r,cap(x,z,(plan.place.east?3:2)+Math.floor(r()*2)),P.accent,marks);};
    // Each region builds its street to its own plot: narrow southern shophouses, broad eastern ones.
    const [w0,w1]=sino?[.9,1.3]:plan.place.south?[1,1.5]:plan.place.east?[1.5,2.3]:plan.place.west?[1.3,2]:[1.1,1.7];
    const rw=(x0,x1,z,d)=>row(x0+r()*.6,x1,z,d-r()*.5,w0,w1,make(shop));
    if(town){rw(-5.2,2.4,4.7,2.2);rw(2.9,6.9,-.5,2.8);rw(-5.2,.9,12.2,2.6);rw(.9,8.4,15,2.6);
     // Chachoengsao's e-waste recycling plants arrived after China's 2018 import ban.
     if(id==='chachoengsao'&&year>=2018)unit(b=>{factory(b,-5.2,-.7,2.6,1.6,'#c9c6ba',r);for(let i=0;i<4;i++)b.ball(-4.8+i*.6,.15,1.25,.3,.22,.25,['#6d7a76','#3f4a48','#8a7a6a','#5a6a72'][i],6);},[-5.2,-.7,2.6,2.3]);
     else if(id==='sa-kaeo'||id==='kanchanaburi')unit(b=>prang(b,-4.6,-.3,1,'#b8a283','#a89070'),[-4.8,-.5,1.4,1.6]);else rw(-5.2,-2.3,-.6,2.2);
     // Honda's Prachinburi plant opened in March 2016.
     if(id==='prachinburi'&&year>=2016)unit(b=>{factory(b,9.4,16.2,8.6,2.2,'#e8e4d8',r);b.box(9.4,18.4,0,8.6,.03,.6,'#a51931');},[9.4,16.2,8.6,2.25]);
     else if(id==='rayong'&&year>=1990)unit(b=>{factory(b,9.4,16.2,5,2.2,'#d9d6cc',r);stack(b,15.4,17.2,S*3.6);stack(b,16.6,17.4,S*3);},[9.4,16.2,7.4,2.2]);
     else rw(9.2,18.2,14.8,2.4);
     if(marks.store)unit(b=>store(b,13.8,9.2,2.4,1.8,r),[13.8,9.2,2.4,1.8]);else unit(b=>woodShop(b,13.8,9.2,2.2,1.8,'#8f6f4c',r,1),[13.8,9.2,2.2,1.8]);}
    else{[[-5,9.3,3,3.6],[9.3,13,4.2,3.2],[14.2,9.2,3.9,3],[14,13.2,4,3],[-1.7,12,2.5,2.4]].forEach(([x,z,w,d],i)=>{if(r()<.9)field(x,z,w,d,['prachuap-khiri-khan','narathiwat','pattani','samut-songkhram'].includes(id)?'coconut':plan.place.central?(id==='uthai-thani'&&i%2?'durian':'paddy'):['durian','rubber','longan'][i%3]);});
     for(const [x,z] of [[-4.3,-.1],[-4.3,2.3],[-4.3,4.6],[3.7,10.9],[1.2,13.4],[4.2,14.9],[1.2,15.9],[-4.3,16.4],[9.2,16.4],[12.2,16.4],[15.2,16.4]]){const X=Math.max(-5.2,x+r()*.6),Z=z+r()*.3,w=1.8+r()*.5,d=1.5+r()*.3;if(r()<.82&&clearOfRoutes(X,Z,w,d))unit(b=>stilt(b,X,Z,w,d,wall(),roof(),r,marks,m(1.2)),[X,Z,w,d]);}
     if(marks.store)unit(b=>store(b,-4.8,12.9,1.9,1.3,r),[-4.8,12.9,1.9,1.3]);}
    ({chachoengsao(){unit(b=>{b.box(14.2,2.5,0,4,3.2,.3,'#efe9da');wat(b,14.6,2.8,3.4,2.6,r);for(const [a,e] of [[-.2,-.2],[3.6,-.2],[-.2,2.9],[3.6,2.9]])b.cylinder(14.6+a+.2,2.8+e+.2,.3,.16,0,1.6,'#e2b450',6,false);},[14.2,2.5,4,3.2]);if(year>=1990)open.box(14.4,5.6,-.01,3.6,1,.02,'#b9b6aa');},
      chanthaburi(){unit(b=>cathedral(b,15.5,3),[15.2,3,2.4,3.3]);},
      chonburi(){if(year>=1981)unit(b=>teakCastle(b,14.7,2.8),[14.7,2.8,3,3]);else field(14.4,2.4,3.6,4.2,'pineapple');},
      prachinburi(){unit(b=>bodhi(b,14.8,2.6),[14.8,2.6,3,3]);},
      rayong(){if(year>=1990)unit(b=>petro(b,14.4,2.4),[14.4,2.4,3.6,3.6]);else field(14.4,2.4,3.6,4.2,'pineapple');},
      'sa-kaeo'(){if(year>=1991){unit(b=>borderMarket(b,14.4,2.5),[14.4,2.5,3.6,3.6]);for(const x of [14.4,17.6])open.box(x,6.4,0,.22,.22,S*2,'#e8e4d8');open.box(14.3,6.4,S*2,3.6,.22,.36,'#a51931');open.box(15.2,6.42,S*2+.36,1.8,.18,.3,'#e8e4d8');}else field(14.4,2.4,3.6,4.2,'paddy');},
      kanchanaburi(){unit(b=>erawan(b,14.4,2.4),[14.4,2.4,3.4,3.4]);},
      phetchaburi(){unit(b=>saltPans(b,14.4,2.4),[14.4,2.4,3.6,2.9]);for(const x of [14.6,15.7,16.8,17.8])palm(open,x,6.5,2.6,['#6f8a4a','#5f7a40'],()=>.5);},
      'prachuap-khiri-khan'(){field(14.3,2.3,3.8,1.9,'coconut');for(const x of [14.5,16.4])unit(b=>stilt(b,x,4.25,1.4,1.1,'#9a7c5a','#7a6a55',r,marks,m(1.2)),[x,4.25,1.4,1.1]);unit(b=>{store(b,14.6,5.5,1.9,1.2,r);for(let i=0;i<5;i++)b.cylinder(14.8+i*.36,6.95,0,.13,.15,.26,i%2?'#f2efe6':'#2a2a28',8);},[14.6,5.5,1.9,1.6]);},
      ratchaburi(){water(14.3,2.2,3.8,4.2);if(year>=1981)for(let i=0;i<8;i++){const x=14.4+(i%4)*.9,z=2.5+Math.floor(i/4)*1.9+r()*.6;open.box(x,z,-.01,.85,.26,.1,'#6d5640');for(let k=0;k<3;k++)open.ball(x+.2+k*.22,.16,z+.13,.09,.07,.09,['#d9a92e','#c0563f','#6f9a4a','#e8e2d4'][(i+k)%4],5);}else boat(15,3.8,1.4,'#6d5640');},
      tak(){unit(b=>cliffFall(b,14.4,2.4),[14.4,2.4,3.6,2.7]);},
      chumphon(){for(let i=0;i<12;i++)bananas(open,14.6+(i%4)*.95,2.6+Math.floor(i/4)*1.1);},
      krabi(){unit(b=>karst(b,16.8,5,3.8,1.2),[15.6,3.8,2.4,2.4]);for(const x of [14.4,16.6])boat(x,6.3,1.4,pick(['#c0563f','#2f6f9a']));},
      'nakhon-si-thammarat'(){unit(b=>{b.box(14.4,2.4,0,3.6,3.6,.2,'#e4decd');bellChedi(b,15.4,3.4,1.6);for(const [a,e] of [[.2,.2],[3,.2],[.2,3],[3,3],[1.6,.1],[.1,1.6],[3.1,1.6]])bellChedi(b,14.4+a,2.4+e,.35);},[14.4,2.4,3.6,3.6]);},
      narathiwat(){if(year>=1981)unit(b=>mosque(b,14.6,2.8,'narathiwat'),[14.6,2.8,3.1,2.2]);else field(14.4,2.4,3.6,4.2,'coconut');},
      pattani(){if(year>=1963){unit(b=>mosque(b,14.5,2.5,'pattani'),[14.3,2.5,3.6,1.9]);water(14.9,4.8,2.4,1.4);}else field(14.4,2.4,3.6,4.2,'coconut');},
      'phang-nga'(){water(14.3,2.2,3.8,4.6);for(const [x,z,h,R] of [[15.4,3.4,2.6,.8],[17.2,5.2,1.8,.6]])unit(b=>karst(b,x,z,h,R),[x-R,z-R,2*R,2*R]);for(let i=0;i<6;i++)open.ball(14.4+i*.6,.2,6.5,.3,.25,.25,'#3f5a3a',6);},
      phatthalung(){unit(b=>{b.cylinder(16.4,4.8,0,1.7,.75,2.6,'#6f7f55',8);b.box(16,5.85,1.5,.7,.6,.5,'#2a2520');bellChedi(b,16.2,4.6,.4,'#efe9da','#d4a63a');},[14.7,3.1,3.4,3.4]);},
      phuket(){unit(b=>{b.cylinder(16.2,4.2,0,1.9,1.1,1.4,'#6f8a5a',8);if(year>=2014){const c='#f2efe6';b.box(15.3,3.5,1.4,1.8,1.4,.3,'#d8d3c5');b.box(15.4,3.7,1.7,1.6,1.1,.4,c);b.box(15.75,3.85,2.1,.9,.7,1.1,c);for(const a of [15.45,16.75])b.box(a,4.2,2.2,.2,.3,.6,c);b.ball(16.2,3.55,4.2,.36,.42,.34,c,10);b.cylinder(16.2,4.2,3.9,.12,0,.3,c,8,false);}},[14.3,2.3,3.8,3.8]);},
      ranong(){water(14.3,4.6,3.8,2.2);open.box(15.6,3.8,.1,.6,2.6,.06,WOOD);for(const x of [14.4,16.6])boat(x,5.4+r()*.6,1.5,pick(['#2f6f9a','#c0563f','#3f8a7a']));unit(b=>store(b,14.4,2.4,2.4,1.3,r),[14.4,2.4,2.4,1.3]);},
      satun(){if(year>=1979)unit(b=>mosque(b,14.6,2.6,'satun'),[14.6,2.6,2.8,2.4]);else field(14.4,2.4,3.6,4.2,'coconut');},
      songkhla(){open.box(14.3,2.2,-.016,3.8,4.6,.014,'#ddd0a8');if(year>=1966)unit(b=>{for(const [a,e,R] of [[1.6,3.6,.5],[2.2,3.9,.35],[1.2,4.1,.3]])b.ball(14.3+a,R*.5,2.2+e,R,R*.7,R,'#6d6458',6);b.box(15.6,5.55,.35,.7,.5,.5,'#a07a3a');b.box(15.75,5.6,.85,.45,.4,.7,'#a07a3a');b.ball(15.97,1.8,5.8,.26,.3,.26,'#a07a3a',8);b.box(16.25,5.7,1.45,.08,.28,.28,'#e2b450');},[15.2,5.3,1.2,1.1]);},
      'surat-thani'(){unit(b=>srivijaya(b,15,2.8),[15,2.8,2.4,2.4]);},
      trang(){field(14.3,2.3,3.8,2.6,'rubber');for(let i=0;i<3;i++){const x=14.5+i*1.2;open.box(x,5.4,0,.05,.05,.8,WOOD);open.box(x+.9,5.4,0,.05,.05,.8,WOOD);for(let k=0;k<3;k++)open.box(x+.05,5.42,.25+k*.18,.85,.02,.14,'#e8e2c8');}},
      yala(){unit(b=>{for(let i=0;i<3;i++)b.box(14.3+i*.15,2.3+i*.35,0,3.8-i*.3,1.6-i*.35,2.6-i*.5,i%2?'#8a8f80':'#9a9e90');b.box(15.6,3.85,0,.8,.04,.7,'#2a2520');for(let i=0;i<8;i++)b.box(14.6+(i%4)*.7,3.91,1.1+Math.floor(i/4)*.4,.3,.012,.2,'#a0402a');b.box(14.4,2.4,2.6,3.6,1.4,.12,'#5a7550');},[14.3,2.3,3.8,1.6]);},
      'ang-thong'(){unit(b=>seatedBuddha(b,15.3,3,'#d4a63a',0,1.4),[15.3,3,2.6,2]);},
      // The Chao Phraya Dam, Thailand's first, was finished in 1957.
      'chai-nat'(){water(14.3,3.6,3.8,1.8);if(year>=1957)unit(b=>barrage(b,14.3,4.2,3.8),[14.3,4.2,3.8,.5]);paddy(14.4,2.3,3.6,1.1);},
      'kamphaeng-phet'(){unit(b=>ruins(b,14.5,2.6,r),[14.5,2.6,3.4,2.7]);},
      lopburi(){unit(b=>sanYot(b,14.7,3),[14.5,2.8,3.5,1.6]);for(let i=0;i<9;i++)open.ball(14.6+r()*3.3,.09,4.9+r()*1.5,.1,.09,.12,'#8a8478',5);},
      'nakhon-nayok'(){unit(b=>cliffFall(b,14.4,3.4),[14.4,3.4,3.6,2.7]);},
      'nakhon-pathom'(){unit(b=>{b.box(14.3,2.3,0,3.8,3.8,.25,'#e4decd');bellChedi(b,15.1,3.1,2.2,'#c8702f','#d4a63a');},[14.3,2.3,3.8,3.8]);},
      nonthaburi(){unit(b=>leaningChedi(b,15,3),[15,3,2.6,1.6]);},
      'pathum-thani'(){water(14.3,4.3,3.8,.6);paddy(14.3,2.3,3.8,1.8);paddy(15.8,5.1,2.3,1.6);for(const x of [14.4,16.2])unit(b=>stilt(b,x,3.2,1.5,1.1,'#9a7c5a',ZINC,r,marks,m(1.4)),[x,3.2,1.5,1.1]);},
      phetchabun(){unit(b=>{b.cylinder(16.2,4.2,0,1.9,.7,1.8,'#7f9a5a',9);},[14.3,2.3,3.8,3.8]);for(let a=0;a<6.28;a+=.5)for(const R of [1.2,1.6])open.ball(16.2+Math.cos(a)*R,1.8*(1-R/1.9)+.3,4.2+Math.sin(a)*R,.12,.1,.12,'#b9d08a',5);unit(b=>shed(b,14.4,5.9,1.4,.8,ZINC,'#b9d08a',r),[14.4,5.9,1.4,.8]);},
      phichit(){water(14.3,2.2,3.8,3.8);unit(b=>{for(const a of [0,3.4])for(const e of [0,.7])b.box(14.4+a,6.1+e,0,.06,.06,S*.6,WOOD);b.gable(14.3,6.05,S*.6,3.7,.85,m(.6),ZINC,{along:'x',over:.05});b.box(14.5,6.3,.05,3.3,.3,.1,'#a5312a');},[14.3,6.05,3.7,.85]);for(let i=0;i<14;i++)open.cylinder(14.5+r()*3.4,2.4+r()*4.2,0,.14,.14,.02,i%3?'#5a8a4a':'#e8a0b8',8);},
      phitsanulok(){water(14.3,2.2,3.8,4.6);for(const x of [14.5,16.4])unit(b=>{b.box(x,3,-.02,1.6,1.3,.16,'#6d5640');b.box(x+.1,3.1,.14,1.4,1.1,S*.8,'#9a7c5a');b.gable(x,3,.14+S*.8,1.6,1.3,m(1.1),ZINC,{along:'x',over:.1});},[x,3,1.6,1.3]);boat(15,5.4,1.6,'#6d5640');},
      ayutthaya(){unit(b=>{b.box(14.3,2.4,0,3.8,3.6,.2,'#b9a07a');prang(b,15.6,3.6,1.3,'#a8704f','#9a6446',.2);for(const [a,e] of [[.2,.3],[3,.3],[.2,2.8],[3,2.8]])prang(b,14.3+a,2.4+e,.5,'#a8704f','#9a6446',.2);},[14.3,2.4,3.8,3.6]);},
      'samut-sakhon'(){unit(b=>saltPans(b,14.4,2.4),[14.4,2.4,3.6,2.9]);},
      // The Maeklong line opened in 1904; its market stalls draw their awnings back for the train.
      'samut-songkhram'(){open.box(14.3,4.2,0,3.8,.7,.03,'#8a8478');for(const e of [.18,.52])open.box(14.3,4.2+e,.03,3.8,.04,.05,'#6d7566');for(let x=14.4;x<18;x+=.9)for(const e of [3.3,5.1])unit(b=>{b.box(x,e,0,.8,.8,.4,'#d8d3c5');b.box(x-.05,e+(e<4?.7:-.15),.7,.9,.3,.03,pick(['#c0563f','#2f6f9a','#d9a92e']));},[x,e,.8,.8]);},
      saraburi(){unit(b=>mondop(b,15,2.8),[15,2.8,2.6,2.6]);},
      'sing-buri'(){unit(b=>recliner(b,14.4,3.4),[14.3,3.3,3.8,1.8]);},
      sukhothai(){unit(b=>{lotusChedi(b,15.6,2.6);for(let i=0;i<8;i++)b.box(14.5+(i%4)*.95,5+Math.floor(i/4)*.8,0,.2,.2,1.2,'#a8704f');seatedBuddha(b,14.5,2.6,'#cfc7b4',0,.6);},[14.4,2.5,3.6,3.4]);},
      'suphan-buri'(){for(let i=0;i<3;i++){water(14.4+i*1.25,2.4,1.1,4.2);for(let k=0;k<10;k++)open.box(14.5+i*1.25+r()*.9,2.5+r()*4,0,.05,.05,.25,'#6f9a4a');}},
      'uthai-thani'(){unit(b=>{b.cylinder(16.2,4.2,0,1.9,.7,2.4,'#6f8a5a',9);b.box(15.8,3.8,2.4,.8,.8,.5,'#efe9da');b.hip(15.7,3.7,2.9,1,1,.4,'#c8702f',.1);},[14.3,2.3,3.8,3.8]);unit(b=>{for(const [x,z] of [[14.6,6.1],[15.6,6]])cow(b,x,z);},[14.5,5.9,1.8,.5]);unit(b=>{for(let i=0;i<4;i++)b.box(16.7+i*.4,5.8,0,.05,.05,.5,WOOD);b.box(16.7,5.8,.35,1.25,.04,.04,WOOD);cow(b,16.9,6.1);},[16.7,5.8,1.3,.6]);},
      yaowarat(){for(let i=0;i<4;i++){const x=14.5+i*.9;open.box(x,4.6,0,.7,.45,.5,'#d8d3c5');open.box(x-.05,4.55,.5,.8,.55,.03,'#a51931');}for(let i=0;i<4;i++)open.box(14.4+i*.95,2.5,S*1.6,.8,.06,.5,i%2?'#a51931':'#d9a92e');},
      trat(){water(14.3,4.4,3.8,2.4);for(const x of [14.5,16.3])unit(b=>stilt(b,x,4.6,1.6,1.3,'#9a7c5a',ZINC,r,marks,m(1.5)),[x,4.6,1.6,1.3]);boat(14.6,6.3,1.4,'#2f6f9a');field(14.4,2.3,3.6,1.8,'durian');}})[id]?.();
    scatterTrees(town?8:13,[[-5,2.7,7,.5],[8.9,12.4,9,.6],[-1,9,3.6,2],[14,7,4,1.6],[-5.2,17,23,1.2]],[1.4,2.4],sea?palm:tree);},
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
  const layout=plan.regionId==='nakhon-sawan'?'river':plan.place.lanna?'lanna':plan.place.isan?'isan':plan.place.east||plan.place.west||plan.place.south||plan.place.central?'east':style;
  (LAYOUT[layout]??LAYOUT.market)();
  if(!plan.abroad){
   // What every Thai neighbourhood has: a wat or a mosque, flags at the gate, bananas in every gap.
   const flag=(b,x,z,h=S*2.1)=>{b.box(x,z,0,.04,.04,h,'#d9d4c6');[['#a51931',0],['#f4f5f8',1],['#2d2a4a',2],['#f4f5f8',4],['#a51931',5]].forEach(([c,i])=>b.box(x+.04,z,h-.06*(i+1),.42,.01,i===2?.12:.06,c));};
   if(['chachoengsao','pattani','narathiwat','satun','nakhon-si-thammarat'].includes(plan.regionId));
   else if(plan.faith==='muslim')unit(b=>{b.box(14.5,-.7,0,2.4,1.5,S*1.1,'#eae3cf');b.ball(15.7,S*1.1+.32,.05,.62,.55,.62,'#3f7a62',12);b.cylinder(17.2,-.5,0,.13,.08,S*2.4,'#eae3cf',8);b.ball(17.2,S*2.45,-.5,.15,.2,.15,'#3f7a62',8);for(let i=0;i<4;i++)b.box(14.75+i*.55,.8,.3,.32,.012,S*.6,'#3e4e54',1);b.box(15,.803,S*.8,1.4,.012,.12,'#c9a14a');},[14.5,-.7,3,1.5]);
   else if(layout==='river')unit(b=>shrine(b,14.5,-.6,2.4,1.4),[14.5,-.6,2.4,1.4]);
   else if(layout==='lanna'){unit(b=>lannaChedi(b,15,-.35,1),[14.5,-.85,1,1]);if(!['nan','lampang'].includes(plan.regionId))unit(b=>lannaWat(b,15.7,-.9,1.9,2.6),[15.7,-.9,1.9,2.6]);}
   else if(layout==='isan'){unit(b=>plan.regionId==='kalasin'?octChedi(b,13.5,0):that(b,12.9,-.5,1.1),[12.9,-.6,1.2,1.2]);unit(b=>sim(b,15.5,-.75,2.6,1.6),[15.5,-.75,2.6,1.6]);}
   else if(plan.regionId==='udon-thani')unit(b=>sim(b,14.3,-.7,2.9,1.6),[14.3,-.7,2.9,1.6]);
   else if(layout!=='village'){unit(b=>wat(b,14.3,-.7,2.9,1.6,r),[14.3,-.7,2.9,1.6]);unit(b=>chedi(b,17.4,-.1),[17.4,-.1,.8,.8]);}
   // A spirit house on its post, as every Thai home and temple has.
   if(plan.faith!=='muslim'){open.box(15.06,1.1,0,.08,.08,.62,'#e4decd');open.box(14.94,.98,.62,.32,.32,.04,'#e4decd');open.box(14.98,1.02,.66,.24,.24,.2,'#e8c86a');open.gable(14.94,.98,.86,.32,.32,.16,'#a5312a',{along:'x',over:.03,gableColor:'#d9a92e'});}
   flag(open,14.1,1.1);flag(open,8.95,1.25);flag(open,2.2,6.75,S*1.4);
   for(let i=0;i<14;i++){const x=-5+r()*23,z=(['lanna','isan','east'].includes(layout)?-2.4:-5)+r()*22;if(clearOfRoutes(x-.3,z-.3,.6,.6)&&clearOfLots(x-.3,z-.3,.6,.6)&&!(x>12.6&&z<7.2)&&!Object.values(FOOTPRINTS).some(([a,b,c,e])=>x>a-.4&&x<a+c+.4&&z>b-.4&&z<b+e+.4))bananas(open,x,z);}
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
