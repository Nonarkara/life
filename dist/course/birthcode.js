// A birth is a seed and the conditions it resolved to. This turns that into a short, link-safe
// code and back, so a birth can be sent to someone else: same family, same place, same luck,
// different choices. Decoding rebuilds the life and accepts it only if it re-encodes to the
// same code, so a hand-edited or mistyped code cannot start a different life than the link says.
import {newLife,configureLife,validate,AXES,newLegacyLife,defaultRegion} from './sim.js';
// A place letter is added only when the birthplace is not the one the seed resolves to, so every older code still opens.
const PLACE={'samut-prakan':'s','nakhon-sawan':'n','khlong-toei':'k','isan-village':'i','bang-na':'b','pak-phanang':'p',sukhumvit:'v','hua-hin':'h','udon-thani':'u','pathum-wan':'w'};
const SEX={female:'f',male:'m',intersex:'i'},CLASS={high_class:'h',low_class:'l',middle_class:'m',working_class:'w',bureaucratic_class:'b'};
const COHORT={1949:'49',1955:'55',1970:'70',1975:'75',1981:'81',1997:'97',1990:'90',2000:'00',2026:'26'};
const BAND={constrained:'c',middle:'m',comfortable:'x'},COUNTRY={th:'t',jp:'j',sg:'s',gb:'g',us:'u'};
const invert=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[v,k]));
const PLACE_BY=invert(PLACE),SEX_BY=invert(SEX),CLASS_BY=invert(CLASS),COHORT_BY=Object.fromEntries(Object.entries(COHORT).map(([k,v])=>[v,Number(k)])),DIGITS='0123456789a';
export function encodeBirth(life){
 const i=life?.intake;
 if(i?.class===undefined&&BAND[i?.upbringing]&&COUNTRY[i?.country]&&SEX[i?.sex])return life.seed.toString(36)+'-'+SEX[i.sex]+BAND[i.upbringing]+COUNTRY[i.country]+'-'+AXES.map(a=>DIGITS[i.attributes?.[a.key]]).join('');
 if(!i||!Number.isInteger(life.seed)||!SEX[i.sex]||!CLASS[i.class])return null;
 const points=AXES.map(a=>DIGITS[i.attributes?.[a.key]]).join('');
 const cohort=i.birthYear!==undefined?COHORT[i.birthYear]:'';
 if(i.birthYear!==undefined&&!cohort)return null;
 const where=life.birth?.region,place=where&&where!==defaultRegion(life.seed,i.class)?PLACE[where]:'';
 if(place===undefined)return null;
 return life.seed.toString(36)+'-'+SEX[i.sex]+CLASS[i.class]+cohort+'-'+points+(place?'-'+place:'');
}
export function decodeBirth(code){
 const legacy=/^([0-9a-z]{1,7})-([fmi])([cmx])([tjsgu])-([0-9a]{5})$/.exec(String(code??'').trim().toLowerCase());
 if(legacy){const seed=parseInt(legacy[1],36);if(seed<1||seed>2147483646)return null;const attributes=Object.fromEntries(AXES.map((a,k)=>[a.key,DIGITS.indexOf(legacy[5][k])]));const life=configureLife(newLegacyLife(seed),{sex:SEX_BY[legacy[2]],upbringing:invert(BAND)[legacy[3]],country:invert(COUNTRY)[legacy[4]],attributes});return validate(life)&&encodeBirth(life)===legacy[0]?life:null;}
 const m=/^([0-9a-z]{1,7})-([fmi])([hlmwbr])(49|55|70|75|81|90|97|00|26)?-([0-9a]{5})(?:-([a-z]))?$/.exec(String(code??'').trim().toLowerCase());
 if(!m)return null;
 const seed=parseInt(m[1],36);if(!Number.isInteger(seed)||seed<1||seed>2147483646)return null;
 const attributes=Object.fromEntries(AXES.map((a,k)=>[a.key,DIGITS.indexOf(m[5][k])]));
 const birthYear=m[4]?COHORT_BY[m[4]]:undefined;
 let life;try{if(m[6]&&!PLACE_BY[m[6]])return null;life=configureLife(newLife(seed),{sex:SEX_BY[m[2]],class:m[3]==='r'?'high_class':CLASS_BY[m[3]],...(birthYear?{birthYear}:{}),...(m[6]?{region:PLACE_BY[m[6]]}:{}),attributes});}catch{return null;}
 // Old links may carry a retired class letter; they open as high class.
 return validate(life)&&encodeBirth(life)===m[0].replace(/^([0-9a-z]+-[fmi])r/,'$1h')?life:null;
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

export function validDay(day){
 if(typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day))return false;
 const date=new Date(day+'T00:00:00Z');return Number.isFinite(date.getTime())&&dayOf(date)===day;
}
// A seed alone is insufficient: body, background and starting points must match too.
export function dailyDateFor(life,now=new Date()){
 const code=encodeBirth(life);if(!code)return null;
 const day=life.dailyDay!==undefined?life.dailyDay:dailyLabel(life.seed,now);
 return validDay(day)&&encodeBirth(life.intake?.class===undefined?configureLife(newLegacyLife(dailySeed(day)),{legacy:true}):dailyLife(day))===code?day:null;
}
export function birthURL(life,origin='https://life.nonarkara.org',now=new Date()){
 const code=encodeBirth(life);if(!code)return null;
 const url=new URL('/intake/',origin);url.searchParams.set('birth',code);
 const day=dailyDateFor(life,now);if(day)url.searchParams.set('day',day);
 return url.href;
}
