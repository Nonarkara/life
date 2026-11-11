// Branches: one calling per life, each step opened only by the answer before it.
import {rand} from './rand.js';
import {birthYearOf} from './thai-history.js';
import {ROUTE_DATA,BLOG_SCENES} from './route-data.js';
const flags=s=>({...s.pivotFlags,...s.story?.flags});
const inYears=(s,y)=>{if(!y)return true;const b=birthYearOf(s);return b!==null&&b+s.age>=y[0]&&b+s.age<=y[1];};
// A station is five years long, so a dated blog scene needs only to fall somewhere inside it.
const inStation=(s,y)=>{if(!y)return true;const b=birthYearOf(s);return b!==null&&b+s.age+4>=y[0]&&b+s.age<=y[1];};
export function routeOf(s){
 const cls=s.intake?.class,sex=s.intake?.sex,y=birthYearOf(s);if(!cls||y===null)return null;
 const open=ROUTE_DATA.filter(r=>(!r.fit?.classes||r.fit.classes.includes(cls))&&(!r.fit?.sex||r.fit.sex===sex)&&(!r.fit?.years||(y>=r.fit.years[0]&&y<=r.fit.years[1])));
 // The oldest cohorts live through the most history, so fewer of them are pulled onto a route.
 if(!open.length||rand(s.seed,0,'route-any')>(y<1960?.45:.85))return null;return open[Math.floor(rand(s.seed,0,'route-pick')*open.length)].route;
}
// `era` dates a scene to a real event: it opens only in a station that contains those years.
// A life born too early or too late for the event steps over that scene instead of losing the route.
const missed=(s,sc)=>{if(!sc?.era)return false;for(let a=Math.max(s.age,Math.ceil(sc.min/5)*5);a<=sc.max;a+=5)if(inStation({...s,age:a},sc.era))return false;return true;};
const reached=(s,r,n)=>{if(n<1)return -1;const f=flags(s)['r_'+r.route+'_'+n];return typeof f==='number'?f:missed(s,r.scenes.find(x=>x.stage===n))?reached(s,r,n-1):null;};
// A study commitment can open the scholarship story independently of the birth lottery.
function earnedScholarship(s,r){
 const year=birthYearOf(s);
 if(year===null||year<r.fit.years[0]||year>r.fit.years[1]||!r.fit.classes.includes(s.intake?.class))return false;
 const pivots=[...(s.pivots??[]),...(s.history??[]).flatMap(row=>row.pivots??[])];
 return pivots.some(p=>p.station===15&&p.pivot==='school-apprentice'&&p.choice==='school')||
  (s.history??[]).some(row=>row.age<=s.age&&row.from>=20&&row.pathway==='college');
}
const ROUTE_CHOICES={
 r_scholarship_kid_1:{study:{pathway:'school'},believe:{pathway:'vocational'}},
 r_scholarship_kid_2:{bond:{moveTo:'london',pathway:'college'},free:{moveTo:'boston',pathway:'college'}},
 r_scholarship_kid_4:{go:{moveTo:'bang-na',pathway:'work'},stay:{pathway:'work'}},
 r_abroad_1:{go:{moveTo:'singapore',pathway:'work'}},
 r_abroad_2:{marry:{moveTo:'home',pathway:'vocational'}},
 r_abroad_4:{mixer:{moveTo:'home',pathway:'independent'},stay:{moveTo:'home'},again:{moveTo:'home'}},
};
export const ROUTE_ENCOUNTERS=ROUTE_DATA.flatMap(r=>r.scenes.map(({stage,years,era,...scene})=>({
 ...scene,priority:-1,
 options:scene.options.map(option=>({...option,...ROUTE_CHOICES[scene.id]?.[option.id]})),
 eligible:s=>{
  if(!inYears(s,years)||!inStation(s,era))return false;
  if(r.route==='scholarship_kid'&&stage===2&&s.age===25&&earnedScholarship(s,r))return true;
  const startedScholarship=r.route==='scholarship_kid'&&stage>2&&typeof flags(s).r_scholarship_kid_2==='number'&&flags(s).r_scholarship_kid_2<s.age;
  if(!startedScholarship&&routeOf(s)!==r.route)return false;
  const prev=reached(s,r,stage-1);return prev!==null&&prev<s.age;
 }
})));
export const BLOG_ENCOUNTERS=BLOG_SCENES.map(({years,...scene})=>({...scene,bank:true,eligible:s=>!!s.intake?.class&&inStation(s,years)&&rand(s.seed,s.age,scene.id)<.4}));
