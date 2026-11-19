// Presentation only. A single caller-owned clock can seek this without advancing Life.
import {gait} from './line-art/gait.js';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),ease=n=>{const t=clamp(n);return t*t*(3-2*t);};
export function inkIdentity({seed=31415,sex='female',look={}}={}){
 const tones=['#b98c6b','#a87657','#d0a17e'];
 return Object.freeze({id:'ink-'+seed+'-'+sex,sex,skin:look.skin??tones[Math.abs(seed)%tones.length],hair:look.hair??'#293b33',shirt:look.shirt??'#eee8d8',bottom:look.bottom??'#486779',bag:'#956748',hairStyle:look.hairStyle??(sex==='male'?'short':'bob'),skirt:look.skirt??sex==='female',build:look.build??1,height:look.height??1,shoes:look.feet!=='bare'});
}
export function inkProportions(age){return age<13?{thigh:18,shin:18,torso:22,head:8,period:.85,stride:17}:{thigh:23,shin:23,torso:27,head:7,period:1,stride:24};}
export function createInkSequence({age=10,profile=inkIdentity()}={}){
 const shape=inkProportions(age),walk=gait({...shape,kind:'walk'}),ramp=.4,walkEnd=3*walk.period+ramp,turnEnd=walkEnd+.65,waveEnd=turnEnd+1.5,duration=waveEnd+.25;
 function sample(seconds){
  const t=clamp(Number.isFinite(seconds)?seconds:0,0,duration),w=Math.min(t,walkEnd);
  // Integrate matching gait and travel speeds, including acceleration and stopping.
  const clock=w<ramp?w*w/(2*ramp):w<=walkEnd-ramp?w-ramp/2:(()=>{const u=(w-walkEnd+ramp)/ramp;return walkEnd-1.5*ramp+ramp*(u-u*u/2);})();
  const phase=clock/walk.period,velocity=w<ramp?w/ramp:w<walkEnd-ramp?1:clamp((walkEnd-w)/ramp),turn=ease((t-walkEnd)/.65),waveT=clamp((t-turnEnd)/1.5),wave=Math.sin(Math.PI*waveT)**2;
  return {time:t,age,profile,shape,pose:walk.pose(phase),phase,x:walk.speed*clock,turn,wave,bagSwing:Math.sin(phase*Math.PI*2-.7)*velocity,action:t<walkEnd?'walk':t<turnEnd?'turn':t<waveEnd?'wave':'finished',ground:walk.ground,toe:walk.toe,ankleY:walk.ankleY};
 }
 return {duration,walkEnd,turnEnd,waveEnd,profile,age,sample};
}
// The rendered sole uses this same local toe, rotated about the solved ankle.
export function inkToe(frame,index){const foot=frame.pose.feet[index],a=foot.pitch*Math.PI/180,x=frame.toe,y=frame.ground-frame.ankleY;return [frame.x+foot.ankle[0]+x*Math.cos(a)-y*Math.sin(a),foot.ankle[1]+x*Math.sin(a)+y*Math.cos(a)];}
