import {THAI_PROVINCES} from './thailand-birth-map.js';
import {region,regionIdFor} from './regions.js';

const WHOLE=[-10,-9,224,310];
const normalized=value=>value.toLowerCase().replace(/[^a-z]/g,'');
const aliases={bangkok:'bangkokmetropolis',ayutthaya:'phranakhonsiayutthaya',buengkan:'bungkan',lamphun:'lamphun',phukettown:'phuket'};

export function birthProvince(state){
 const place=region(regionIdFor(state.birth));
 if(place.country!=='TH')return null;
 const key=normalized(place.place.split(',').at(-1).trim());
 return THAI_PROVINCES.find(([name])=>[key,aliases[key]].includes(normalized(name)))??null;
}

export function createBirthMap(holder,state){
 const province=birthProvince(state);
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('aria-hidden','true');
 svg.setAttribute('fill-rule','evenodd');
 svg.innerHTML=`<defs><pattern id="birth-wombs" width="8" height="8" patternUnits="userSpaceOnUse">
 <rect width="8" height="8" fill="#c98b56"/><path d="M4 1.4c-2.5 0-3 2.4-1.7 3.8.9 1 2.7 1 3.2-.3C6.1 3.7 5.6 2 4 1.4Z" fill="none" stroke="#5d4130" stroke-width=".55"/>
 </pattern></defs>${THAI_PROVINCES.map(row=>`<path d="${row[1]}" fill="${row===province?'url(#birth-wombs)':'#839687'}" stroke="#293d35" stroke-width=".55"/>`).join('')}`;
 holder.replaceChildren(svg);
 return (progress,reduced)=>{
  let frame=WHOLE;
  if(province){
   const [x,y,right,bottom]=province[2],height=Math.max(68,bottom-y+36),width=Math.max(height*.72,right-x+36);
   const close=[(x+right-width)/2,(y+bottom-height)/2,width,height];
   const eased=reduced?1:Math.max(0,Math.min(1,progress))**2;
   frame=WHOLE.map((value,i)=>value+(close[i]-value)*eased);
  }
  svg.setAttribute('viewBox',frame.join(' '));
 };
}
