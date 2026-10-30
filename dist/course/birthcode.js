// A birth is a seed and the conditions it resolved to. This turns that into a short, link-safe
// code and back, so a birth can be sent to someone else: same family, same place, same luck,
// different choices. Decoding rebuilds the life and accepts it only if it re-encodes to the
// same code, so a hand-edited or mistyped code cannot start a different life than the link says.
import {newLife,configureLife,validate,AXES} from './sim.js';
const SEX={female:'f',male:'m',intersex:'i'},BAND={constrained:'c',middle:'m',comfortable:'x'},COUNTRY={th:'t',jp:'j',sg:'s',gb:'g',us:'u'};
const invert=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[v,k]));
const SEX_BY=invert(SEX),BAND_BY=invert(BAND),COUNTRY_BY=invert(COUNTRY),DIGITS='0123456789a';
export function encodeBirth(life){
 const i=life?.intake;
 if(!i||!Number.isInteger(life.seed)||!SEX[i.sex]||!BAND[i.upbringing]||!COUNTRY[i.country])return null;
 const points=AXES.map(a=>DIGITS[i.attributes?.[a.key]]).join('');
 return life.seed.toString(36)+'-'+SEX[i.sex]+BAND[i.upbringing]+COUNTRY[i.country]+'-'+points;
}
export function decodeBirth(code){
 const m=/^([0-9a-z]{1,7})-([fmi])([cmx])([tjsgu])-([0-9a]{5})$/.exec(String(code??'').trim().toLowerCase());
 if(!m)return null;
 const seed=parseInt(m[1],36);if(!Number.isInteger(seed)||seed<1||seed>2147483646)return null;
 const attributes=Object.fromEntries(AXES.map((a,k)=>[a.key,DIGITS.indexOf(m[5][k])]));
 let life;try{life=configureLife(newLife(seed),{sex:SEX_BY[m[2]],upbringing:BAND_BY[m[3]],country:COUNTRY_BY[m[4]],attributes});}catch{return null;}
 return validate(life)&&encodeBirth(life)===m[0]?life:null;
}
// One birth for everyone each day. UTC, so the day changes at one moment everywhere.
export const dayOf=(date=new Date())=>date.toISOString().slice(0,10);
export function dailySeed(day){
 let h=2166136261;for(const c of 'life2-daily-'+day){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}
 return h%2147483646+1;
}
export const dailyLife=(day=dayOf())=>configureLife(newLife(dailySeed(day)),{});
// Which recent day a seed was the daily birth for, or null: lets an ending say "today's life".
export function dailyLabel(seed,now=new Date()){
 for(let back=0;back<400;back++){const day=dayOf(new Date(now.getTime()-back*86400000));if(dailySeed(day)===seed)return day;}
 return null;
}
