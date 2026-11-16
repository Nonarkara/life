import {gait} from './line-art/gait.js';
import {region,regionAt} from './regions.js';

const walk=gait({stride:26});
const ns='http://www.w3.org/2000/svg';
export const DEPARTURE_WINDOW=.8;

// Route records travel with the save and are also present in the closing station.
export function bangkokDeparture(state,from,through){
 if(!state||!Number.isFinite(from)||!Number.isFinite(through))return null;
 const answers=[...(state.pivots??[]),...(state.history??[]).flatMap(row=>row.pivots??[])];
 return answers.find(({pivot,choice,moved})=>pivot==='three-roads'&&choice==='go'
  &&moved?.to==='bang-na'&&moved.since>from&&moved.since<=through
  &&regionAt(state,moved.since-.01)!=='bang-na'&&regionAt(state,moved.since)==='bang-na')?.moved??null;
}

export function createDeparture(stage){
 const scene=document.createElementNS(ns,'svg');
 scene.setAttribute('class','departure-scene');
 scene.setAttribute('aria-label','A traveller walks from a house and boards a bus.');
 scene.setAttribute('role','img');
 scene.setAttribute('aria-hidden','true');
 scene.setAttribute('preserveAspectRatio','xMidYMid meet');
 scene.setAttribute('viewBox','0 0 540 300');
 scene.innerHTML=`
 <path fill="#f4ebd7" d="M0 0H540V300H0Z"/>
 <g stroke="#968b75" stroke-width="1" fill="none">
   <path d="M0 62Q155 48 310 63T540 67M0 78Q160 63 310 78T540 82"/>
   <path d="M6 237H540M6 248H540M75 275h92m73 0h92m73 0h92"/>
   <path d="M20 231V54m-9 10h30m479 167V58m-17 13h29"/>
 </g>
 <circle cx="354" cy="74" r="19" fill="#d9a353" stroke="#795835"/>
 <g stroke="#2d4039" stroke-width="2" stroke-linejoin="round">
   <path d="M21 127 56 91h102l38 36Z" fill="#b57352"/>
   <path data-wall d="M28 128h159v103H28Z" fill="#d4cab1"/>
   <path data-boards d="M38 136h138m-138 10h138m-138 10h138m-138 10h138m-138 10h138m-138 10h138m-138 10h138m-138 10h138" stroke="#a19076" stroke-width="1"/>
   <path d="M93 161h34v63H93Z" fill="#526d60"/>
   <path d="M89 224h42v7H89Z" fill="#a68b66"/>
   <path d="M43 159h35v28H43Zm97 0h34v28h-34Z" fill="#76928a"/>
   <path d="M60 159v28m97-28v28"/>
   <path d="M66 231h108m-103 4h96" fill="none"/>
   <path d="M195 229v-85" fill="none"/>
   <path d="M181 131h28v26h-28Z" fill="#e0a64e"/>
   <path d="M186 139h18v10h-18m4 1v2m10-2v2" fill="none"/>
 </g>
 <g data-bus stroke="#243b36" stroke-width="2.3" stroke-linejoin="round">
   <path fill="#648a7f" d="M318 221v-55q0-14 14-14h123q15 0 21 13l13 28v28Z"/>
   <path fill="#eadfc5" d="M323 163h134l15 25H323Z"/>
   <path fill="#bcd0c0" d="M331 167h28v15h-28Zm36 0h26v15h-26Zm34 0h26v15h-26Zm34 0h20l9 15h-29Z"/>
   <path fill="none" d="M323 189h29v32m-15-32v32m17-23h127"/>
   <circle cx="346" cy="222" r="9" fill="#243b36"/><circle cx="467" cy="222" r="9" fill="#243b36"/>
   <circle cx="346" cy="222" r="3" fill="#eadfc5"/><circle cx="467" cy="222" r="3" fill="#eadfc5"/>
 </g>
 <g data-traveller stroke="#293d35" stroke-linecap="round" stroke-linejoin="round">
   <path data-leg stroke-width="6" fill="none"/><path data-leg stroke-width="6" fill="none"/>
   <path data-shoe stroke-width="4" fill="none"/><path data-shoe stroke-width="4" fill="none"/>
   <g data-upper>
    <path d="M32 72 29 51l9-15 13 3 4 34Z" fill="#b66f50" stroke-width="2"/>
    <path d="M36 41 35 57l12 12 8-5" fill="none" stroke-width="3"/>
    <path d="M44 36v-9" stroke-width="3"/>
    <path d="M36 31q-7-19 5-23 13-2 15 12l3 4-6 3q-1 10-17 4Z" fill="#bc8b63" stroke-width="2"/>
    <path d="M35 23q-7-11 1-16 14-6 19 7l-13-1-3 11Z" fill="#293d35"/>
    <path d="M49 72v-6q6-5 11 0v6m-15 0h19v16H45Z" fill="#a99059" stroke-width="2"/>
   </g>
 </g>`;
 stage.prepend(scene);
 const actor=scene.querySelector('[data-traveller]'),upper=scene.querySelector('[data-upper]'),bus=scene.querySelector('[data-bus]');
 const wall=scene.querySelector('[data-wall]'),boards=scene.querySelector('[data-boards]');
 let origin;
 const legs=actor.querySelectorAll('[data-leg]'),shoes=actor.querySelectorAll('[data-shoe]');
 return {
  draw(progress,still,originId){
   if(originId!==origin){
    origin=originId;
    const place=region(origin);
    wall.setAttribute('fill',place.look.wall);
    boards.style.display=['coast','slum','village','fringe'].includes(place.style)?'':'none';
   }
   scene.removeAttribute('aria-hidden');
   const p=still ? .63 : Math.max(0,Math.min(1,progress));
   const walking=p>=.08&&p<.73;
   const duration=4.8, seconds=Math.max(0,Math.min(.65,p-.08))*duration;
   const scale=.65, ground=231;
   const pose=walk.pose(seconds/walk.period,walking&&!still?1:0);
   const x=110+seconds*walk.speed*scale;
   // Step up through the rear door before the bus pulls away.
   actor.style.display=p>=.81?'none':'';
   const boarding=Math.max(0,Math.min(1,(p-.73)/.08));
   actor.setAttribute('transform',`translate(${x+boarding*10} ${ground-120*scale-boarding*21}) scale(${scale})`);
   upper.setAttribute('transform',`translate(0 ${pose.hip[1]-73})`);
   for(const [i,{ankle,knee,pitch}] of pose.feet.entries()){
    legs[i].setAttribute('d',`M${pose.hip} L${knee} L${ankle}`);
    shoes[i].setAttribute('d',`M${ankle} l${8*Math.cos(pitch*Math.PI/180)} ${8*Math.sin(pitch*Math.PI/180)}`);
   }
   bus.setAttribute('transform',`translate(${-107+Math.max(0,p-.85)*1500} 0)`);
   scene.setAttribute('viewBox',stage.clientWidth<600?'0 50 394 236':'0 0 540 300');
  },
  hide(){scene.setAttribute('aria-hidden','true');},
 };
}
