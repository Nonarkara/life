import {rand} from './rand.js';
import {createInkActor,gait,thaiRigSVG} from './ink-gait.js';
import {createInkSequence,inkIdentity} from './ink-sequence.js';
const animatedInk=new Set();
export function updateChoiceIllustrations(seconds,playing){
 for(const item of animatedInk){if(!item.svg.isConnected){animatedInk.delete(item);continue;}if(playing&&item.last!==null)item.time=Math.min(item.sequence.duration,item.time+Math.max(0,Math.min(.1,seconds-item.last)));item.last=seconds;if(playing){item.draw(item.sequence.sample(item.time));if(item.time>=item.sequence.duration)animatedInk.delete(item);}}
}


const PAPER='#f2e8d1',INK='#253e36',CLAY='#a35439';
const art={
 ring:(continued)=>`
   <path d="M43 65 97 29h137l66 36-54 44H100Z" fill="#c3c7aa"/>
   <path d="M43 65v9l57 45h146l54-45v-9M100 109v10m146-10v10"/>
   <path d="M43 66V33m54-4V9m137 20V9m66 56V33"/>
   <path d="m43 35 54-24h137l66 24m-257 10 54-24h137l66 24m-257 10 54-24h137l66 24"/>
   ${continued?'<path d="M141 79q0-14 17-15 10 0 11 9l-3 16h-20ZM179 82q0-14 16-15 10 0 11 9l-4 16h-20Z" fill="'+CLAY+'"/>':'<path d="M139 77h51l-5 12h-41Zm9 12-3 11m35-11 4 11m-25-24q8-12 18 0" fill="'+PAPER+'"/>'}`,
 wall:(signed)=>`
   <path d="M48 42 110 17h157v74l-62 25H48Z" fill="#d99d73"/>
   <path d="M48 42h157l62-25m-62 25v74M48 61h157l62-25M48 80h157l62-25M48 99h157l62-25M80 42v19m56-19v19m38-19v19M66 61v19m54-19v19m50-19v19M83 80v19m56-19v19m38-19v19m-106 0v17m54-17v17m45-17v17"/>
   <path d="m122 23 22 20-23 13 15 17-18 16 10 23" stroke="#6e392e" stroke-width="3"/>
   ${signed?'<path d="m221 67 63-13 14 47-63 13Z" fill="'+PAPER+'"/><path d="m239 96 10-15-3 15 10-9 4 5 20-4" stroke="'+CLAY+'"/>':'<path d="M218 89l54-20 4 9-55 20Zm3 9v15m53-34v16" fill="'+CLAY+'"/>'}`,
 tape:(sold)=>`
   <path d="M71 38Q71 30 80 30h158q9 0 9 9v59q0 9-9 9H80q-9 0-9-9Z" fill="${sold?'#d99d73':'#a6b39e'}"/>
   <path d="M91 44h135v40H91Zm23 49h89l9 14H105Z" fill="${PAPER}"/>
   <circle cx="121" cy="63" r="11"/><circle cx="199" cy="63" r="11"/><path d="M132 60h56v6h-56m-11-14v22m78-22v22"/>
   ${sold?'<path d="M72 78H54l-16 9 16 9h18" fill="'+CLAY+'"/><path d="M263 37v38m8-34v31m6-31v31m7-35v38m7-31v24"/>':'<path d="M247 75q27-15 48 0t31 0m-79 11q27-15 48 0t31 0" stroke="'+CLAY+'"/>'}`,
 walk:()=>`<path d="M24 108h292M64 108V56h62v52M60 56l35-20 35 20M86 108V82h18v26M238 108V42m0 0 24 6-24 8" fill="none"/>`
};
const outcomeAccent={fight:true,sign:true,sell:true};

// The illustration is a projection of the saved answer. Reloading or replaying
// that answer uses the same lines, without requesting assets or saving a movie.
export function choiceIllustration(motif,seed,answer,animate,{sex='female',look={}}={}){
 if(!Object.hasOwn(art,motif))return null;
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 340 130');
 svg.setAttribute('aria-hidden','true');
 svg.setAttribute('class',animate?'choice-illustration draw-ink':'choice-illustration');
 const lines=Array.from({length:9},(_,i)=>{
  const x=11+rand(seed,i,answer.id)*290,y=109+rand(seed,i,'paper')*15;
  return `M${x.toFixed(1)} ${y.toFixed(1)}h${7+i}`;
 }).join(' ');
 svg.innerHTML=`<rect width="340" height="130" fill="${PAPER}"/><path d="${lines}" stroke="#b8a88b"/><g fill="none" stroke="${INK}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${art[motif](outcomeAccent[answer.choice]===true)}</g>`;
 if(motif==='walk'){
  const years=Number.isFinite(answer?.age)?answer.age:25;
  // Elders keep their existing cane snapshot until prop contact is separately solved.
  if(years>=60){const held=document.createElementNS(svg.namespaceURI,'g');held.setAttribute('transform','translate(110 10) scale(.82)');held.innerHTML=thaiRigSVG(gait({kind:'shuffle'}).pose(0),{age:'elder',sex,paper:PAPER,ink:INK,accent:look.shirt??CLAY});svg.append(held);return svg;}
  const profile=inkIdentity({seed,sex,look}),sequence=createInkSequence({age:years,profile}),actor=createInkActor(profile),scale=.82*profile.height;
  const draw=frame=>{actor.root.setAttribute('transform',`translate(${90+frame.x*scale-40*scale} ${108-frame.ground*scale}) scale(${scale})`);actor.update(frame);};
  draw(sequence.sample(0));svg.append(actor.root);
  const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(animate&&!reduced)animatedInk.add({svg,sequence,draw,last:null,time:0});
 }

 return svg;
}
