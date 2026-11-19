// Procedural skeletal gait, spring physics, and parametric Thai ink-rig renderer.
// Analytic 2-bone IK gait and spring/pendulum primitives adapted from
// JDhruv14/line-art-animation (MIT License).
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const smooth=(e0,e1,x)=>{const t=clamp((x-e0)/(e1-e0),0,1);return t*t*(3-2*t);};
const minJerk=s=>s*s*s*(10-15*s+6*s*s);
const f=n=>n.toFixed(1);

export const GAIT_PRESETS=Object.freeze({
 walk:{period:1.0,duty:.62,stride:24,lift:3.4,heelOff:15,heelKick:0,thigh:23,shin:23,ankleY:118.4,ground:120,toe:4.2},
 shuffle:{period:.9,duty:.64,stride:18,lift:2.4,heelOff:12,heelKick:0,thigh:23,shin:23,ankleY:116.5,ground:120,toe:4.2},
 run:{period:.5,duty:.36,stride:16,lift:12,heelOff:10,heelKick:3.5,thigh:13,shin:13,ankleY:118,ground:120,toe:3}
});

function solveKnee(hip,ankle,l1,l2){
 const dx=ankle[0]-hip[0],dy=ankle[1]-hip[1];
 const d=Math.max(1e-3,Math.min(Math.hypot(dx,dy),l1+l2-0.01));
 const th=Math.atan2(dy,dx);
 const al=Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));
 const c1=[hip[0]+l1*Math.cos(th-al),hip[1]+l1*Math.sin(th-al)];
 const c2=[hip[0]+l1*Math.cos(th+al),hip[1]+l1*Math.sin(th+al)];
 return c1[0]>c2[0]?c1:c2;
}

export function gait(opts={}){
 const kind=opts.kind??'walk';
 const o={...GAIT_PRESETS[kind]??GAIT_PRESETS.walk,...opts,kind};
 const {period,duty,stride:S,lift,heelOff,heelKick,thigh,shin,ankleY,ground,toe}=o;
 const reach=(thigh+shin)*0.983;
 const restHip=ankleY-reach;
 const speed=S/(duty*period);

 function footAt(u){
  u=((u%1)+1)%1;
  if(u<duty){
   const x=40+S/2-(S*u)/duty;
   const peel=smooth(duty-0.14,duty,u);
   const th=(heelOff*peel*Math.PI)/180;
   const ankle=[x-toe*(1-Math.cos(th)),ankleY-toe*Math.sin(th)];
   return {ankle,pitch:heelOff*peel,stance:true};
  }
  const s=(u-duty)/(1-duty);
  const x=40-S/2+S*minJerk(s)-heelKick*Math.sin(Math.PI*s)*(1-s);
  const y=ankleY-lift*Math.sin(Math.PI*s);
  const pitch=heelOff*(1-smooth(0,0.45,s))-6*Math.sin(Math.PI*s);
  return {ankle:[x,y],pitch,stance:false};
 }

 return {
  ...o,speed,
  pose(phase,go=1){
   const g=clamp(go,0,1);
   const raw=[footAt(phase),footAt(phase+0.5)];
   const feet=raw.map((ft,i)=>{
    const restX=40+(i===0?3:-3);
    const ankle=[restX+(ft.ankle[0]-restX)*g,ankleY+(ft.ankle[1]-ankleY)*g];
    return {ankle,pitch:ft.pitch*g,stance:g<0.05?true:ft.stance};
   });
   const stanceY=feet.filter(ft=>ft.stance).map(ft=>{
    const dx=ft.ankle[0]-40;
    return ft.ankle[1]-Math.sqrt(Math.max(4,reach*reach-dx*dx));
   });
   const hipY=stanceY.length?Math.max(...stanceY):restHip-lift*0.25*g;
   const hip=[40,hipY];
   const solved=feet.map(ft=>({...ft,knee:solveKnee(hip,ft.ankle,thigh,shin)}));
   return {hip,feet:solved,front:solved[0].ankle[0]>=solved[1].ankle[0]?0:1,bob:hipY-restHip};
  }
 };
}

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
