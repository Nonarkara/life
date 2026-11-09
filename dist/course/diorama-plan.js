// What the model on the table shows for this life at this age. Pure data, no three.js.
// Every date below was checked against a source before use; where sources disagree the
// later, safer year is used, because an object appearing a little late is not a lie and
// an object appearing early is.
import {region,regionAt,household,childhoodAway} from './regions.js';
import {birthYearOf} from './thai-history.js';
import {rand,flagsOf} from './sim.js';
import {placeOf} from './stage2d.js';
import {routineContext} from './routines.js';
import {recordedFinance} from './locations.js';
import {netWorth} from './finance.js';
import {rungAt,clearOfLots} from './housing-ladder.js';
export {clearOfLots};

const BANGKOK=new Set(['khlong-toei','bang-na','sukhumvit']);
const RURAL=new Set(['nakhon-sawan','isan-village','pak-phanang']);
// BTS Sukhumvit line: Mo Chit to On Nut opened 5 December 1999; On Nut to Bearing, the
// stretch through Bang Na, 12 August 2011. It never ran through Khlong Toei's port slums.
const VIADUCT={sukhumvit:1999,'bang-na':2011};
export function lifeYear(state,age=state.age){const by=birthYearOf(state);return Math.floor((by??1981)+age);}
export function eraMarks(regionId,year,seed=1){
 const place=region(regionId),abroad=place.country!=='TH',bkk=BANGKOK.has(regionId),rural=RURAL.has(regionId),tier=bkk?0:rural?2:1;
 // Three gates per mark: Bangkok, provincial town, village.
 const at=(a,b,c)=>!abroad&&year>=[a,b,c][tier];
 // Rural electrification ran from about a quarter of villages in the late 1970s to most by the
 // late 1980s, so each village gets its own year inside that span.
 const lit=!abroad&&year>=(rural?1978+Math.floor(rand(seed,0,'power')*9):1955);
 return {
  // Television began in Bangkok on 24 June 1955; regional stations opened from 1962 at
  // Khon Kaen. A village needs mains before it needs an aerial.
  aerial:at(1957,1965,1995)||(!abroad&&lit&&year>=1985),
  power:lit,lamp:!abroad&&!lit,
  // Pedal samlors were pushed out of Bangkok in the 1960s and lasted in the provinces.
  samlor:!abroad&&(bkk?year<1960:year<1995),
  tuktuk:at(1965,1970,9999),bicycle:!abroad&&year<2010,
  motorbike:at(1965,1968,1975),pickup:at(1970,1970,1975),
  concrete:at(1955,1965,1990),
  aircon:at(1985,1990,2005),
  // First convenience store: Patpong Road, 1 June 1989.
  store:at(1989,1996,2008),
  // Stand counts are reported from 1986 at Soi Ngam Duphli; 37,500 riders by 1994.
  winTaxi:at(1986,1997,9999),
  tower:bkk&&year>=1988,highrise:bkk&&year>=1995,
  viaduct:Object.hasOwn(VIADUCT,regionId)&&year>=VIADUCT[regionId],
  // GSM arrived in 1994; a mast stands where people now expect a signal.
  mast:at(1994,1997,2003),dish:at(1996,1998,2004),stools:at(1975,1978,1985),
  rider:at(2018,2020,9999),solar:!abroad&&year>=2016,ev:year>=2022,
  // Abroad: what those places had when a Thai life could reach them.
  smartphone:year>=2010
 };
}
// A small seeded generator: the town keeps its shape as the years pass.
export function lifeRandom(seed,salt){let h=(seed*2654435761+[...String(salt)].reduce((n,c)=>Math.imul(n^c.charCodeAt(0),16777619),2166136261))>>>0;return ()=>{h=(h+0x6d2b79f5)>>>0;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
const hsl=(hex,dh=0,ds=0,dl=0)=>{const n=parseInt(hex.slice(1),16);let r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255;const M=Math.max(r,g,b),L=Math.min(r,g,b);let h=0,s=0,l=(M+L)/2;if(M!==L){const d=M-L;s=l>.5?d/(2-M-L):d/(M+L);h=M===r?(g-b)/d+(g<b?6:0):M===g?(b-r)/d+2:(r-g)/d+4;h/=6;}h=((h+dh)%1+1)%1;s=Math.max(0,Math.min(1,s+ds));l=Math.max(0,Math.min(1,l+dl));const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t%1+1)%1;return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p;},hex2=v=>Math.round(v*255).toString(16).padStart(2,'0');return '#'+hex2(f(h+1/3))+hex2(f(h))+hex2(f(h-1/3));};
const STYLE_SET={
 market:{walls:['#e4d8bd','#d8c8a6','#cfd2bd','#e6d2b4'],roofs:['#a56a50','#8a8676','#b07a58'],accent:['#55777c','#b5553c','#7f8f5a'],road:'#c6bea9',leaf:['#55734f','#66825a']},
 slum:{walls:['#8e9a98','#a09380','#7f8b82','#a88f72','#6f7f86'],roofs:['#7a8486','#8f8a7c','#6d7576','#a0755a'],accent:['#b5553c','#c9a14a','#4f7a8a'],road:'#9f9a8a',leaf:['#55704f','#5f7c58']},
 village:{walls:['#8f6f4c','#7f6243','#9a7c5a','#a78a66'],roofs:['#8b7c68','#a29078','#7a6e5f'],accent:['#7a3f3a','#3f5a50','#2f3d5c'],road:'#c7ab82',leaf:['#55794a','#6a8a4f','#4c6c47']},
 fringe:{walls:['#8f6f4c','#a78a66','#d6c7a6'],roofs:['#8b7c68','#a56a50'],accent:['#7a3f3a','#3f5a50'],road:'#c7ab82',leaf:['#55794a','#6a8a4f']},
 condo:{walls:['#dcd8cc','#cfd0c8','#e4dfd2','#c4c8c4'],roofs:['#8f948f','#a29f94'],accent:['#3f6f8a','#b5553c','#6f8f7a'],road:'#a8a79c',leaf:['#527050','#5f8058']},
 coast:{walls:['#9fb7b5','#c2b48a','#8fb0a0','#d4c7a6','#b78f72'],roofs:['#a45b45','#8f7a64','#6f8a88'],accent:['#2f6f9a','#c0563f','#d8b25a'],road:'#d2c4a0',leaf:['#4e7a58','#5f8d5f']},
 villa:{walls:['#f1ece0','#ebe6da','#e9e2d0'],roofs:['#5f6a6a','#7a5f50','#6a7470'],accent:['#2f4a5a','#8a6a4a'],road:'#b4b1a4',leaf:['#46704a','#527a4f','#3f6848']},
 tower:{walls:['#e8e2d4','#ddd6c6','#e4ded0'],roofs:['#8a9a98','#b4876a'],accent:['#c77d5a','#6f9a8a','#d8b25a','#5f7a9a'],road:'#a9a89e',leaf:['#4a7c52','#5a8a5a']},
 tokyo:{walls:['#ddd8cc','#c9c4b8','#e5e1d6','#b9b3a6'],roofs:['#4f5a5e','#5c5a58','#3f4a50'],accent:['#2f7f5f','#8a4a3a'],road:'#9c9c94',leaf:['#50704f','#5f7c58']},
 newengland:{walls:['#d7dde0','#9fb2bf','#c9b8a0','#e8e4da','#a8b89f'],roofs:['#eef1f2','#e4e8ea'],accent:['#7a2f2a','#2f4a5a'],road:'#c8ccce',leaf:['#6a5f55']},
 brick:{walls:['#9a5a46','#8c5040','#a56a52','#7f4a3c'],roofs:['#4d5254','#5a5c5c'],accent:['#2f3a40','#3f5f7a','#8a2f2a'],road:'#8f9090',leaf:['#55704f','#62805a']}
};
export function palette(style,place,seed){
 const set=STYLE_SET[style]??STYLE_SET.market,r=lifeRandom(seed,'palette'),shift=(r()-.5)*.045,tone=(r()-.5)*.05,pick=l=>l[Math.floor(r()*l.length)],rot=Math.floor(r()*set.walls.length);
 const walls=[...set.walls.slice(rot),...set.walls.slice(0,rot)].slice(0,3).map(c=>hsl(c,shift,-.05,tone));
 return {walls,roofs:set.roofs.map(c=>hsl(c,shift*.7,0,(r()-.5)*.05)),accent:hsl(pick(set.accent),0,-.12,.02),accents:set.accent,road:hsl(set.road,shift,0,tone*.5),leaf:set.leaf.map(c=>hsl(c,shift,0,(r()-.5)*.04)),ground:hsl(place.look.ground,shift,-.1,.05+tone*.4),water:place.look.water,floor:hsl(place.look.floor,shift,0,tone),wall:hsl(place.look.wall,shift,0,tone)};
}
const RUNG_TIER=[0,0,1,2,2,3];
export function townStyle(base,year,where){
 if(where.inCity&&where.place)return where.place==='condo'||where.place==='villa'?where.place:'slum';
 if(where.inCity)return 'slum';
 return base==='condo'&&year<1975?'fringe':base;
}
// Thai homes follow the rung you live on; the region still decides what a modest house looks like.
export function homeKindFor(style,where,rung){
 if(where.place==='villa')return 'villa';if(where.place==='condo')return 'condo';
 if(rung!==undefined){if(rung===0)return 'pavement';if(rung===4)return 'bungalow';if(rung===5)return 'villa';if(rung===1&&style==='market')return 'shack';if(rung===2&&style==='market')return 'row';if(rung===3&&style==='slum')return 'shophouse';}
 return {slum:'shack',village:'stilt',fringe:'stilt',coast:'plank',market:'shophouse',condo:'flat',villa:'villa',tower:'hdb',tokyo:'tatami',newengland:'triple',brick:'terrace'}[style]??'shophouse';
}
// Things a room holds at this year and this income. Income shifts the year a thing arrives.
export function roomHas(year,tier,marks,abroad,r){
 const by=(rich,mid,poor)=>year>=[poor,mid,mid,rich][tier];
 const mains=marks.power||abroad;
 return {
  radio:by(1950,1958,1965),tv:mains&&by(1960,1972,1985),flatTv:mains&&by(2008,2011,2016),fan:mains&&by(1955,1965,1980),fridge:mains&&by(1962,1975,1995),
  aircon:mains&&(marks.aircon||abroad)&&by(1985,1995,2015),computer:mains&&by(1995,2000,2012),phone:mains&&by(1960,1982,1998),sewing:year<2000&&r<.45,
  bed:tier>=1||year>=1985,altar:!abroad,oilLamp:!mains
 };
}
export function parentGone(state,age,name){
 const role=household(state.birth)[name]?.role;if(!role)return false;
 const row=(state.history??[]).find(r=>r.age<=age&&new RegExp('Your '+role+' dies').test(r.event??''));
 return !!row||age>=(name==='mother'?78:72);
}
export function familyAt(state,age){
 const flags=flagsOf(state),since=k=>typeof flags[k]==='number'&&flags[k]<=age,together=(since('married')||since('committed'))&&!since('separated'),hasChild=since('parent')&&!since('childLost'),childAge=hasChild?age-flags.parent:-1,place=regionAt(state,age),born=regionAt(state,0);
 return {mother:!parentGone(state,age,'mother'),father:!parentGone(state,age,'father'),partner:together,child:hasChild&&childAge<24,childAge,awayFromParents:age>=20&&place!==born&&!childhoodAway(state.birth,age)};
}
export function floodAt(state,age){
 for(const row of state.history??[])if(row.age<=age&&/flood/i.test(row.event??''))return {since:row.age,water:age-row.age<1,mark:age-row.age<12};
 const seen=(state.story?.seen??[]).find(e=>e.age<=age&&/flood/i.test(String(e.id)));
 return seen?{since:seen.age,water:age-seen.age<1,mark:age-seen.age<12}:{since:null,water:false,mark:false};
}
// Fewer people in the early years, more as the country fills up.
export function crowdSize(style,year){const base=Math.round((year-1945)/13),adj={village:-1,fringe:-1,slum:1,market:1,condo:1,tower:1,tokyo:1,villa:-1,coast:0,newengland:-1,brick:1}[style]??0;return Math.max(1,Math.min(7,base+adj));}
export function townPlan(state,age){
 const seed=state.seed,regionId=regionAt(state,age),place=region(regionId),year=lifeYear(state,age),context=routineContext(state,age),where=placeOf(state,age,context,place.style),style=townStyle(place.style,year,where),abroad=place.country!=='TH',marks=eraMarks(regionId,year,seed),rung=rungAt(state,age),homeKind=homeKindFor(style,where,abroad?undefined:rung);
 const finance=recordedFinance(state,age),worth=finance?netWorth(finance):0,tier=Math.max(RUNG_TIER[rung],worth>=3500000?3:worth>=800000?2:0),found=roomHas(year,tier,marks,abroad,rand(seed,0,'sewing')),room=homeKind==='pavement'?{...found,tv:false,flatTv:false,fan:false,fridge:false,aircon:false,computer:false,phone:false,sewing:false,bed:false,oilLamp:true,altar:false}:found,flood=floodAt(state,age);
 // The model is rebuilt in steps: a mark appearing, or a five-year growth stage.
 const growth=Math.floor(year/5)*5,bits=Object.entries(marks).filter(([,v])=>v).map(([k])=>k).join(','),things=Object.entries(room).filter(([,v])=>v).map(([k])=>k).join(',');
 return {key:[seed,regionId,style,homeKind,tier,rung,growth,bits,things,flood.mark].join('|'),seed,regionId,place,style,year,growth,abroad,marks,homeKind,rung,tier,room,flood,climate:place.climate,palette:palette(style,place,seed),crowd:crowdSize(style,year),keptShop:flagsOf(state).keptShop!==undefined,farm:style==='village'||style==='fringe'||style==='coast'};
}
