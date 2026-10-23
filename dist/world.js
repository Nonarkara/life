// One world coordinate system. All solids project from the same ground plane.
const C={ground:'#c4c8b4',edge:'#a5ad98',wall:'#ded4bc',side:'#b7aa90',wood:'#796a53',dark:'#343f39',leaf:'#7d8970',leafLight:'#a5af91',cloth:'#e8e0cc',amber:'#f59e0b',road:'#737b72'};
export const WORLD={home:{x:2,y:2,w:5,d:4},stall:{x:8,y:3,w:2,d:1.6},street:{x:0,y:7,w:13,d:2},tree:{x:10.8,y:5.5},family:[{id:'mother',x:5.5,y:4.7},{id:'father',x:3,y:4.8},{id:'child',x:4.5,y:4.8}]};
export function renderWorld(canvas,state,close=false){const ctx=canvas.getContext('2d');const W=1000,H=540;ctx.clearRect(0,0,W,H);ctx.fillStyle='#dcded3';ctx.fillRect(0,0,W,H);const scale=close?1.25:1;const p=(x,y,z=0)=>[500+(x-y)*35*scale,75+(x+y)*17.5*scale-z*40*scale];
function poly(points,color,stroke){ctx.beginPath();points.forEach((a,i)=>{const q=p(...a);i?ctx.lineTo(...q):ctx.moveTo(...q)});ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}}
function box(x,y,z,w,d,h,top=C.cloth,left=C.side,right=C.wood){poly([[x,y,z],[x,y+d,z],[x,y+d,z+h],[x,y,z+h]],left);poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],right);poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],top)}
function line(a,b,col,width=1){ctx.beginPath();ctx.moveTo(...p(...a));ctx.lineTo(...p(...b));ctx.strokeStyle=col;ctx.lineWidth=width;ctx.stroke()}
function person(x,y,shirt,child=false,floor=.25){const q=p(x,y,floor),u=scale*(child?.8:1);ctx.fillStyle='#465044';ctx.fillRect(q[0]-7*u,q[1]-9*u,5*u,10*u);ctx.fillRect(q[0]+2*u,q[1]-9*u,5*u,10*u);ctx.fillStyle=shirt;ctx.fillRect(q[0]-10*u,q[1]-29*u,20*u,21*u);ctx.fillStyle='#c6a47e';ctx.fillRect(q[0]-8*u,q[1]-43*u,16*u,15*u);ctx.fillStyle='#39413a';ctx.fillRect(q[0]-8*u,q[1]-46*u,16*u,6*u);ctx.fillRect(q[0]-9*u,q[1]-41*u,3*u,9*u);ctx.fillStyle=C.dark;ctx.fillRect(q[0]+3*u,q[1]-36*u,2*u,2*u)}
// Foundation and street, with continuous curbs rather than disconnected tiles.
box(0,0,-.3,13,10,.3,C.ground,C.edge,C.edge);box(0,7,0,13,2,.02,C.road,C.road,C.road);for(let x=.5;x<13;x+=2)poly([[x,7.95,.04],[x+1,7.95,.04],[x+1,8.03,.04],[x,8.03,.04]],'#d4d5c7');box(0,6.6,0,13,.4,.14,'#d3d1be');box(0,9,0,13,.35,.14,'#d3d1be');
tree(.9,3.2);
// House is a deliberately cutaway room. Rear walls share floor edges.
box(2,2,0,5,4,.25,'#b5a17e');for(let x=2;x<7;x+=.5)line([x,2,.26],[x,6,.26],'#97886f');box(2,2,.25,5,.14,2.6,C.wall,C.side,C.wall);box(2,2,.25,.14,4,2.6,C.wall,C.side,C.side);
// Window in back wall, inset frame, shutter slats.
poly([[3.1,2.15,1.3],[4.9,2.15,1.3],[4.9,2.15,2.3],[3.1,2.15,2.3]],'#687d73');line([4,2.16,1.3],[4,2.16,2.3],C.wood,3);line([3.1,2.16,1.8],[4.9,2.16,1.8],C.wood,3);
// Bed, pillow, blanket, crib. All feet meet room floor.
box(2.5,2.7,.25,1.3,2,.45,C.wood);box(2.5,2.7,.7,1.3,2,.2,C.cloth);box(2.5,3.3,.91,1.3,1.4,.04,'#8a9781');box(2.65,2.8,.91,1,.45,.08,'#f0e9d8');
box(4.5,2.7,.25,1.4,.8,.55,C.wood);box(4.6,2.8,.8,1.2,.6,.06,C.cloth);if(state.chapter===0)box(4.95,2.95,.87,.45,.3,.1,'#c7ad86');for(let x=4.5;x<=5.9;x+=.28)box(x,3.45,.8,.04,.04,.45,C.wood);box(4.5,3.45,1.2,1.4,.05,.05,C.wood);
// Domestic objects give the room a readable scale and purpose.
box(2.25,5.2,.25,.65,.55,.65,C.wood);box(2.3,5.25,.9,.5,.4,.06,C.cloth);
box(6.4,2.25,.25,.5,.4,1.5,'#9d9f8d');box(6.42,2.67,.9,.46,.03,.03,C.dark);
// A woven mat rests on the floor in the open center of the room.
poly([[4.1,4,.27],[5.6,4,.27],[5.6,5.5,.27],[4.1,5.5,.27]],'#c1ad87');
for(let y=4.1;y<5.5;y+=.2)line([4.1,y,.28],[5.6,y,.28],'#a79573');
// Study desk with notebook that grows as study time accumulates.
box(6,2.9,.25,.12,.9,.8,C.wood);box(6.75,2.9,.25,.12,.9,.8,C.wood);box(5.9,2.8,1.05,1.1,1.1,.1,C.wood);box(6.05,3,1.15,.5,.45,.04+state.learning*.004,C.cloth);box(6.15,4,.25,.6,.6,.45,C.wood);
// Steps and path join the street, no front wall hides the entry.
box(5.3,6,0,1.3,.5,.14,C.side);poly([[5.3,6.5,.02],[6.6,6.5,.02],[6.6,6.6,.02],[5.3,6.6,.02]],C.cloth);
// Food stall: counter, supports and canopy aligned to its footprint.
box(8,3,0,2,1.6,.95,C.wood);for(const x of [8,9.9])for(const y of [3,4.5])box(x,y,0,.08,.08,2.3,C.wood);box(7.8,2.8,2.3,2.4,2,.1,C.cloth);for(let x=8;x<10;x+=.4)poly([[x,4.81,2.3],[x+.2,4.81,2.3],[x+.2,4.81,1.95],[x,4.81,1.95]],'#b6a57f');box(8.1,3.2,.95,.6,.7,.2,'#6e7870');for(let x=9;x<9.8;x+=.3)box(x,3.4,.95,.2,.3,.1,'#c9b387');if(state.week===2)box(8,3,.96,2,1.6,.05,'#899485');
// Stall name on the canopy front, sized to the stall rather than the screen.
const sign=p(8.9,4.85,2.1);ctx.fillStyle=C.dark;ctx.font='600 11px Jost';ctx.textAlign='center';ctx.fillText('FAMILY KITCHEN',sign[0],sign[1]);
// Two stools and a dining table stay clear of the walking path.
box(10.3,3.2,0,.12,.12,.65,C.wood);box(10,3,.65,.9,.9,.08,C.cloth);box(10.7,4.1,0,.45,.45,.38,C.wood);
// Rear garden trees, fixed geometry; no random per-frame foliage.
function tree(x,y){box(x,y,0,.2,.2,1.5,C.wood);box(x-.65,y-.65,1.45,1.5,1.5,.8,C.leafLight,C.leaf,C.leaf);box(x-.4,y-.4,2.25,1,1,.5,C.leafLight,C.leaf,C.leaf)}tree(10.8,5.5);
// Household and player, placed in walkable free space.
person(5.5,4.7,'#697c71');person(4.1,5.3,'#b2a083');if(state.chapter>0){const working=state.chapter===2&&state.plan.stall>=state.plan.study&&state.plan.stall>=state.plan.friends;person(working?8.8:5.1,working?5.2:5.5,C.amber,true,working?.03:.25)}if(state.bonds>0){person(7.2,6.3,'#9d9e87',true,.03);person(8,6.4,'#8b7b66',true,.03)}
// Bicycle lives beside the street, never floating across the room.
for(const x of [2.1,3]){const q=p(x,6.3,.24);ctx.strokeStyle=C.dark;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(q[0],q[1],10*scale,13*scale,0,0,Math.PI*2);ctx.stroke()}line([2.1,6.3,.24],[2.55,6.3,.7],C.wood,3);line([2.55,6.3,.7],[3,6.3,.24],C.wood,3);line([2.1,6.3,.24],[3,6.3,.24],C.wood,2);
// A discrete amber ground marker tells the player where their agency lives.
if(state.chapter>0){const working=state.chapter===2&&state.plan.stall>=state.plan.study&&state.plan.stall>=state.plan.friends;const q=p(working?8.8:5.1,working?5.2:5.5,working?.02:.26);ctx.strokeStyle=C.amber;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(q[0],q[1]+2,18*scale,8*scale,0,0,Math.PI*2);ctx.stroke()}
}
