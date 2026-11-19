// Procedural skeletal gait, spring physics, and parametric Thai ink-rig renderer.
// Analytic 2-bone IK gait and spring/pendulum primitives adapted from
// JDhruv14/line-art-animation (MIT License).
const f=n=>n.toFixed(1);

// Keep one upstream solver; the MIT notice is in line-art/LICENSE.
export {gait,GAIT_PRESETS} from './line-art/gait.js';

export function spring(stiffness=40,damping=6,x=0){
 return {x,v:0,step(target,dt){this.v+=(stiffness*(target-this.x)-damping*this.v)*dt;this.x+=this.v*dt;return this.x;},kick(v){this.v+=v;}};
}

export function pendulum(stiffness=10,damping=1.1,a=0){
 return {a,v:0,step(force,dt){this.v+=(-this.a*stiffness+force-this.v*damping)*dt;this.a+=this.v*dt;return this.a;},kick(v){this.v+=v;}};
}

// Open double-stroke limb geometry (two curved ink lines with paper between them).
export function openLimbPaths(joints,width=3.6){
 const [a,b,c]=joints.length===3?joints:[joints[0],[(joints[0][0]+joints[1][0])/2,(joints[0][1]+joints[1][1])/2],joints[1]];
 const perp=(p1,p2)=>{const dx=p2[0]-p1[0],dy=p2[1]-p1[1],len=Math.hypot(dx,dy)||1;return [-dy/len,dx/len];};
 const n1=perp(a,b),n2=perp(b,c),nm=[n1[0]+n2[0],n1[1]+n2[1]],ml=Math.hypot(nm[0],nm[1])||1;
 const n=[nm[0]/ml,nm[1]/ml],r=width/2;
 const L=[[a[0]+n1[0]*r,a[1]+n1[1]*r],[b[0]+n[0]*r,b[1]+n[1]*r],[c[0]+n2[0]*r,c[1]+n2[1]*r]];
 const R=[[a[0]-n1[0]*r,a[1]-n1[1]*r],[b[0]-n[0]*r,b[1]-n[1]*r],[c[0]-n2[0]*r,c[1]-n2[1]*r]];
 const fill=`M${f(L[0][0])} ${f(L[0][1])}Q${f(L[1][0])} ${f(L[1][1])} ${f(L[2][0])} ${f(L[2][1])}L${f(R[2][0])} ${f(R[2][1])}Q${f(R[1][0])} ${f(R[1][1])} ${f(R[0][0])} ${f(R[0][1])}Z`;
 const stroke=`M${f(L[0][0])} ${f(L[0][1])}Q${f(L[1][0])} ${f(L[1][1])} ${f(L[2][0])} ${f(L[2][1])}M${f(R[0][0])} ${f(R[0][1])}Q${f(R[1][0])} ${f(R[1][1])} ${f(R[2][0])} ${f(R[2][1])}`;
 return {fill,stroke};
}

// Parametric Thai figure rig in 95-unit ink space (feet on y=120, facing +x).
export function thaiRigSVG(pose,{age='adult',sex='female',accent='#a35439',paper='#f2e8d1',ink='#253e36',wave=0,bagSwing=0}={}){
 const scaleY=age==='child'?0.76:age==='elder'?0.92:1;
 const hip=[pose.hip[0],120-(120-pose.hip[1])*scaleY];
 const shoulder=[hip[0]+(age==='elder'?4:1.5),hip[1]-(age==='child'?21:27)];
 const head=[shoulder[0]+(age==='elder'?2:0.5),shoulder[1]-(age==='child'?9.5:10.5)];
 const headR=age==='child'?7.4:6.6;
 const leg=(ft)=>{
  const knee=[ft.knee[0],120-(120-ft.knee[1])*scaleY];
  const ankle=[ft.ankle[0],120-(120-ft.ankle[1])*scaleY];
  const {fill,stroke}=openLimbPaths([hip,knee,ankle],age==='child'?3.2:3.8);
  const shoe=`M${f(ankle[0]-2)} ${f(ankle[1]+1.4)}h7.5q1.8 0 1.4-2.2l-5.2-1.4Z`;
  return `<path d="${fill}" fill="${paper}"/><path d="${stroke}" fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${shoe}" fill="${ink}"/>`;
 };
 const backIdx=pose.front===0?1:0,frontIdx=pose.front;
 const swing=(pose.feet[frontIdx].ankle[0]-40)*0.45;
 const armBack=[shoulder[0]-swing*0.7,shoulder[1]+18];
 const armFront=wave>0.05?[shoulder[0]+10+Math.sin(wave*Math.PI*2)*3,shoulder[1]-11]:[shoulder[0]+swing*0.8,shoulder[1]+18];
 const {fill:afFill,stroke:afStroke}=openLimbPaths([shoulder,[(shoulder[0]+armFront[0])/2,(shoulder[1]+armFront[1])/2+2],armFront],age==='child'?2.8:3.3);
 const {fill:abFill,stroke:abStroke}=openLimbPaths([shoulder,[(shoulder[0]+armBack[0])/2,(shoulder[1]+armBack[1])/2+2],armBack],age==='child'?2.6:3.1);
 const torso=`M${f(shoulder[0]-5.5)} ${f(shoulder[1]+1)}Q${f(shoulder[0]+5.5)} ${f(shoulder[1]+1)} ${f(hip[0]+6.5)} ${f(hip[1]+4)}Q${f(hip[0])} ${f(hip[1]+6)} ${f(hip[0]-6.5)} ${f(hip[1]+4)}Z`;
 const hair=sex==='female'
  ?`<path d="M${f(head[0]-headR)} ${f(head[1]+1)}Q${f(head[0]-headR-2)} ${f(head[1]-headR-1)} ${f(head[0]+2)} ${f(head[1]-headR-1)}Q${f(head[0]+headR)} ${f(head[1]-headR)} ${f(head[0]+headR-1)} ${f(head[1]-1)}Q${f(head[0]-2)} ${f(head[1]-3)} ${f(head[0]-headR+1)} ${f(head[1]+5)}Z" fill="${ink}"/>`
  :`<path d="M${f(head[0]-headR)} ${f(head[1]-1)}Q${f(head[0])} ${f(head[1]-headR-2.5)} ${f(head[0]+headR)} ${f(head[1]-1)}Q${f(head[0])} ${f(head[1]-4.5)} ${f(head[0]-headR)} ${f(head[1]-1)}Z" fill="${ink}"/>`;
 const bag=age==='child'?`<path d="M${f(shoulder[0]-7+bagSwing)} ${f(shoulder[1]+4)}h6v10h-6Z" fill="#d99d73" stroke="${ink}" stroke-width="1.3"/>`:'';
 const cane=age==='elder'?`<path d="M${f(armFront[0])} ${f(armFront[1])}L${f(armFront[0]+6)} 120" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round"/>`:'';
 return `<g>${leg(pose.feet[backIdx])}<path d="${abFill}" fill="${paper}"/><path d="${abStroke}" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round"/>${bag}${leg(pose.feet[frontIdx])}<path d="${torso}" fill="${accent}" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="${f(head[0])}" cy="${f(head[1])}" r="${f(headR)}" fill="${paper}" stroke="${ink}" stroke-width="1.5"/>${hair}<circle cx="${f(head[0]+2.5)}" cy="${f(head[1]-0.5)}" r="0.9" fill="${ink}"/><path d="${afFill}" fill="${paper}"/><path d="${afStroke}" fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round"/>${cane}</g>`;
}


// Create once; update attributes, never innerHTML or one RAF per person.
export function createInkActor(profile){
 const ns='http://www.w3.org/2000/svg',root=document.createElementNS(ns,'g'),nodes={};root.dataset.person=profile.id;
 const make=(key,tag='path',parent=root)=>{const n=document.createElementNS(ns,tag);parent.append(n);nodes[key]=n;return n;};
 const set=(node,attrs)=>{for(const[k,v]of Object.entries(attrs)){const value=String(v);if(node.getAttribute(k)!==value)node.setAttribute(k,value);}};
 for(const side of ['back','front']){const group=make(side+'Leg','g');make(side+'LegFill','path',group);make(side+'LegInk','path',group);make(side+'Shoe','path',group);}
 const backArm=make('backArm'),bag=make('bag'),torso=make('torso'),bottom=make('bottom'),strap=make('strap'),backHair=make('backHair'),neck=make('neck'),head=make('head','circle'),hair=make('hair'),nose=make('nose'),eye=make('eye','circle'),otherEye=make('otherEye','circle'),mouth=make('mouth'),frontArm=make('frontArm'),hand=make('hand','circle');
 const ink='#253e36';for(const n of Object.values(nodes))set(n,{'stroke-linejoin':'round','stroke-linecap':'round'});
 let frame=null;
 function update(next){
  frame=next;const {pose,shape,age,turn,wave}=next,hip=pose.hip,shoulder=[hip[0]+1.5*(1-turn),hip[1]-shape.torso],H=[shoulder[0]+.5*(1-turn),shoulder[1]-12],R=shape.head;
  const front=pose.front,order=front===0?[1,0]:[0,1];
  for(const [i,side]of ['back','front'].entries()){
   const foot=pose.feet[order[i]],limb=openLimbPaths([hip,foot.knee,foot.ankle],(age<13?3.8:4.8)*profile.build);
   set(nodes[side+'LegFill'],{d:limb.fill,fill:age<13||profile.skirt?profile.skin:profile.bottom});
   set(nodes[side+'LegInk'],{d:limb.stroke,fill:'none',stroke:ink,'stroke-width':1.2});
   const sole=next.ground-next.ankleY,toe=next.toe;
   set(nodes[side+'Shoe'],{d:`M-2 -2L${f(toe-1)} -1.4Q${f(toe)} -.5 ${f(toe)} ${f(sole)}H-2Z`,transform:`translate(${foot.ankle.join(' ')}) rotate(${foot.pitch})`,fill:profile.shoes?ink:profile.skin,stroke:profile.shoes?'none':ink,'stroke-width':.7});
  }
  const sway=Math.sin(next.phase*Math.PI*2)*3*(1-turn),wide=(5.5+turn*2.5)*profile.build;
  const backHand=[shoulder[0]-4-sway,shoulder[1]+18],wrist=[shoulder[0]+5+sway+wave*(8+Math.sin(next.time*14)*2),shoulder[1]+18-wave*34];
  set(backArm,{d:openLimbPaths([[shoulder[0]-wide,shoulder[1]+3],[shoulder[0]-6,shoulder[1]+11],backHand],3).fill,fill:profile.skin,stroke:ink,'stroke-width':1.2});
  set(bag,{d:`M${f(shoulder[0]-10+next.bagSwing)} ${f(shoulder[1]+4)}h8v13h-8Z`,fill:profile.bag,stroke:ink,'stroke-width':1.2});
  set(torso,{d:`M${f(shoulder[0]-wide)} ${f(shoulder[1]+1)}Q${f(shoulder[0])} ${f(shoulder[1]-1)} ${f(shoulder[0]+wide)} ${f(shoulder[1]+1)}L${f(hip[0]+7)} ${f(hip[1]+5)}Q${f(hip[0])} ${f(hip[1]+7)} ${f(hip[0]-7)} ${f(hip[1]+5)}Z`,fill:profile.shirt,stroke:ink,'stroke-width':1.3});
  const hem=age<13?12:25;const shorts=profile.skirt?`M${f(hip[0]-7)} ${f(hip[1]+3)}h14l3 ${hem}h-20Z`:`M${f(hip[0]-7)} ${f(hip[1]+3)}h14l1 10h-7v-4h-2v4h-7Z`;
  set(bottom,{d:shorts,fill:profile.bottom,stroke:ink,'stroke-width':1.2,visibility:age<13||profile.skirt?'visible':'hidden'});
  set(strap,{d:`M${f(shoulder[0]-3)} ${f(shoulder[1]+3)}l-3 14`,fill:'none',stroke:profile.bag,'stroke-width':2});
  const trailing=profile.hairStyle==='long'||profile.hairStyle==='ponytail',bun=profile.hairStyle==='bun';
  set(backHair,{d:bun?`M${f(H[0]-R)} ${f(H[1])}a3 3 0 1 0 0 .1Z`:`M${f(H[0]-R+1)} ${f(H[1]-1)}l-3 16h7l-1-16Z`,fill:profile.hair,stroke:ink,'stroke-width':.8,visibility:trailing||bun?'visible':'hidden'});
  set(neck,{d:`M${f(H[0]-2)} ${f(H[1]+R-1)}h4v${f(shoulder[1]-H[1]-R+3)}h-4Z`,fill:profile.skin,stroke:ink,'stroke-width':.8});
  set(head,{cx:H[0],cy:H[1],r:R,fill:profile.skin,stroke:ink,'stroke-width':1.2});
  const bob=!['short','crop','side'].includes(profile.hairStyle);
  set(hair,{d:`M${f(H[0]-R)} ${f(H[1]+(bob?4:0))}Q${f(H[0]-R-2)} ${f(H[1]-R-2)} ${f(H[0]+1)} ${f(H[1]-R-1)}Q${f(H[0]+R)} ${f(H[1]-R)} ${f(H[0]+R)} ${f(H[1]-1)}L${f(H[0]+R-2)} ${f(H[1]-3)}Q${f(H[0]-2)} ${f(H[1]-7)} ${f(H[0]-R+2)} ${f(H[1]+(bob?6:0))}Z`,fill:profile.hair,stroke:ink,'stroke-width':.8});
  set(eye,{cx:H[0]+2.8,cy:H[1]-.6,r:.8,fill:ink});set(otherEye,{cx:H[0]-2.8,cy:H[1]-.6,r:.8,fill:ink,opacity:turn});
  set(nose,{d:`M${f(H[0]+(R-1)*(1-turn))} ${f(H[1]-1)}l${f(1.5*(1-turn))} 2h-1.5`,fill:'none',stroke:ink,'stroke-width':.8});
  set(mouth,{d:`M${f(H[0]+1-2*turn)} ${f(H[1]+3)}q2 1 4 0`,fill:'none',stroke:ink,'stroke-width':.8});
  set(frontArm,{d:openLimbPaths([[shoulder[0]+wide,shoulder[1]+3],[shoulder[0]+8+wave*4,shoulder[1]+10-wave*15],wrist],3.2).fill,fill:profile.skin,stroke:ink,'stroke-width':1.2});set(hand,{cx:wrist[0],cy:wrist[1],r:1.8,fill:profile.skin,stroke:ink,'stroke-width':1});
  set(root,{'data-action':next.action,'data-age':age});
 }
 return {root,update,get frame(){return frame;},nodes};
}
