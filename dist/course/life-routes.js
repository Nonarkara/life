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
export const ROUTE_ENCOUNTERS=ROUTE_DATA.flatMap(r=>r.scenes.map(({stage,years,...scene})=>({...scene,priority:-1,eligible:s=>{if(routeOf(s)!==r.route||!inYears(s,years))return false;if(stage===1)return true;const prev=flags(s)['r_'+r.route+'_'+(stage-1)];return typeof prev==='number'&&prev<s.age;}})));
export const BLOG_ENCOUNTERS=BLOG_SCENES.map(({years,...scene})=>({...scene,bank:true,eligible:s=>!!s.intake?.class&&inStation(s,years)&&rand(s.seed,s.age,scene.id)<.4}));
