// Branches: one calling per life, each step opened only by the answer before it.
import {rand} from './rand.js';
import {birthYearOf} from './thai-history.js';
import {ROUTE_DATA,BLOG_SCENES} from './route-data.js';
const flags=s=>({...s.pivotFlags,...s.story?.flags});
const inYears=(s,y)=>{if(!y)return true;if(Array.isArray(y[0]))return y.some(r=>inYears(s,r));const b=birthYearOf(s);return b!==null&&b+s.age>=y[0]&&b+s.age<=y[1];};
// A station is five years long, so a dated blog scene needs only to fall somewhere inside it.
const inStation=(s,y)=>{if(!y)return true;if(Array.isArray(y[0]))return y.some(r=>inStation(s,r));const b=birthYearOf(s);return b!==null&&b+s.age+4>=y[0]&&b+s.age<=y[1];};
// Doors: the answers that open a calling. An answer given before the calling's first scene beats the birth
// lottery, so a different answer at ten or fifteen sends the same birth down a different life.
// A calling whose first scene is offered later than its data says (encounters.js OFFER): its doors stay open until then.
const OPENS_AT={border_pm:20};
export const DOORS={
 trader:[['child-roof','stall']],
 scholarship_kid:[['child-roof','scholarship'],['village-buffalo','ask'],['coast-boat','school']],
 boxer:[['child-water-bike','dive']],
 painter:[['child-water-bike','mend']],
 no_buffer:[['child-sponsor','refuse']],
 student:[['school-apprentice','school']],scholar:[['school-apprentice','school']],
 kharatchakan:[['school-apprentice','school'],['girl-school','teacher']],
 abroad:[['school-leave','go']],actor:[['school-leave','go']],
 taxi:[['school-apprentice','apprentice']],
 win_motorsai:[['school-apprentice','apprentice'],['school-fall-climb','rest-work']],
 rice_debt:[['temple-boy','stay']],
 cadet:[['school-fall-climb','rise'],['school-apprentice','both']],
 tycoon:[['school-leave','send'],['school-apprentice','both']],
 far_scholar:[['school-apprentice','school'],['school-fall-climb','retrain']],
 border_pm:[['parent-language','learn'],['school-apprentice','apprentice'],['school-leave','go']],
 singer_office:[['school-apprentice','school'],['college-cost','merit'],['college-cost','loan'],['college-cost','half']]
};
const answers=s=>[...(s.history??[]).flatMap(row=>row.pivots??[]),...(s.pivots??[])];
const fits=(r,cls,sex,y)=>(!r.fit?.classes||r.fit.classes.includes(cls))&&(!r.fit?.sex||r.fit.sex===sex)&&(!r.fit?.years||(y>=r.fit.years[0]&&y<=r.fit.years[1]));
export function routeOf(s){
 const cls=s.intake?.class,sex=s.intake?.sex,y=birthYearOf(s);if(!cls||y===null)return null;
 const open=ROUTE_DATA.filter(r=>fits(r,cls,sex,y));if(!open.length)return null;
 // A calling that has begun stays: its first scene is on the record.
 const begun=open.find(r=>typeof flags(s)['r_'+r.route+'_1']==='number'||s.story?.pending?.id==='r_'+r.route+'_1'||(s.story?.seen??[]).some(e=>e.id==='r_'+r.route+'_1'));if(begun)return begun.route;
 // The latest answer that opens a door, given at an earlier station and before that calling's first scene, decides.
 // An answer at this station waits for the next one: the scene here was chosen when the station opened.
 // The oldest cohorts keep their history: an answer opens a calling for fewer of them, as the lottery does.
 const given=y<1960&&rand(s.seed,0,'door-any')>.45?[]:answers(s);
 // What a fifteen-year-old put first: the one who chose a band and then stayed in school is the singer who
 // became an office worker. Both are the player's own recorded choices, so this road needs no dealt question.
 const band=(s.profiles??[]).some(p=>p.age===15&&p.profile?.priority==='band');
 if(band&&s.age>=20&&open.some(r=>r.route==='singer_office')&&(s.history??[]).some(r=>r.from===15&&['school','college'].includes(r.pathway)))return 'singer_office';
 for(let i=given.length-1;i>=0;i--){const a=given[i],doors=open.filter(r=>(DOORS[r.route]??[]).some(([q,c])=>q===a.pivot&&c===a.choice)&&a.station<s.age&&a.station<(OPENS_AT[r.route]??Math.min(...r.scenes.map(x=>x.min))));
  if(band&&doors.some(r=>r.route==='singer_office'))return 'singer_office';
  // The summer on the building site is where the labourer's road begins, for a birth it is open to.
  if(a.pivot==='school-leave'&&a.choice==='go'&&doors.some(r=>r.route==='border_pm'))return 'border_pm';
  if(doors.length)return doors[Math.floor(rand(s.seed,a.station,'door-'+a.pivot)*doors.length)].route;}
 // No door yet: the birth lottery. The oldest cohorts live through the most history, so fewer of them are pulled onto a route.
 if(rand(s.seed,0,'route-any')>(y<1960?.45:.85))return null;
 const lottery=open.filter(r=>!(DOORS[r.route]??[]).length||rand(s.seed,0,'lot-'+r.route)<.5);
 return lottery.length?lottery[Math.floor(rand(s.seed,0,'route-pick')*lottery.length)].route:null;
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
 r_far_scholar_1:{club:{pathway:'college'},bus:{pathway:'college'}},
 r_far_scholar_2:{ma:{moveTo:'boston',pathway:'college'},uk:{moveTo:'london',pathway:'college'}},
 r_far_scholar_3:{asia:{moveTo:'singapore',pathway:'work'},europe:{moveTo:'london',pathway:'work'},home:{moveTo:'home',pathway:'work'}},
 r_far_scholar_4:{build:{moveTo:'home',pathway:'independent'},leave:{moveTo:'london',pathway:'work'}},
 r_tycoon_2:{sell:{pathway:'independent'}},
};
export const ROUTE_ENCOUNTERS=ROUTE_DATA.flatMap(r=>r.scenes.map(({stage,years,era,...scene})=>({
 ...scene,priority:-1,
 options:scene.options.map(option=>({...option,...ROUTE_CHOICES[scene.id]?.[option.id]})),
 eligible:s=>{
  if(!inYears(s,years)||!inStation(s,era))return false;
  // The earned scholarship does not cut into a calling that has already begun.
  if(r.route==='scholarship_kid'&&stage===2&&s.age===25&&earnedScholarship(s,r)&&!Object.keys(flags(s)).some(k=>/^r_.+_1$/.test(k)&&k!=='r_scholarship_kid_1'))return true;
  const startedScholarship=r.route==='scholarship_kid'&&stage>2&&typeof flags(s).r_scholarship_kid_2==='number'&&flags(s).r_scholarship_kid_2<s.age;
  if(!startedScholarship&&routeOf(s)!==r.route)return false;
  const prev=reached(s,r,stage-1);return prev!==null&&prev<s.age;
 }
})));
// These scenes come from one writer's life: a degree, an office, years abroad. Each now reaches only the
// lives that share its ground, so a farm child is not handed a thesis, a client or a flight home.
const NEEDS={
 abroad:'n1_grandparent n3_message n2_twelve_hours n2_island_farm n2_window_smoke',
 rich:'n1_tech',
 college:'n1_expert n1_project n1_quotes n1_scholarship n1_grading n1_panel n1_topic n1_eldercare n2_false_word n2_fast_track n2_unpaid_hall n2_gets_to_point n2_tenure n3_recorder n3_letters n3_stage n3_goodenough n1_walkout n1_dream n1_checkup n3_facade n3_redpen n2_lost_pen n2_busy_year',
 office:'n1_poll n2_first_trip n2_no_children n2_fast_walker n1_no_time n3_sevenkilo n1_flight n1_envelope n2_bad_boss n2_off_record n2_twentyfour n3_sideline n3_slips n3_deadline n3_promoted n3_whisper n3_oldmessage n1_last_post n1_wfh n3_homedesk n2_ribbon'};
const NEED=Object.fromEntries(Object.entries(NEEDS).flatMap(([k,ids])=>ids.split(' ').map(id=>[id,k])));
const answered=s=>[...(s.pivots??[]),...(s.history??[]).flatMap(r=>r.pivots??[])];
// Only facts that cannot change later count: a saved life is re-checked against its own record.
const begun=(s,...routes)=>routes.some(r=>typeof flags(s)['r_'+r+'_1']==='number');
const studied=s=>(s.history??[]).some(r=>r.pathway==='college')||typeof flags(s).r_scholarship_kid_2==='number'||begun(s,'far_scholar');
const travelled=s=>s.intake?.class==='high_class'||answered(s).some(p=>p.pivot==='year-abroad'&&p.choice!=='stay')||typeof flags(s).r_far_scholar_2==='number'||typeof flags(s).r_scholarship_kid_2==='number';
export const blogFits=(s,id)=>({rich:x=>x.intake?.class==='high_class',abroad:travelled,college:studied,office:x=>studied(x)||['middle_class','bureaucratic_class','high_class'].includes(x.intake?.class)}[NEED[id]]??(()=>true))(s);
export const BLOG_ENCOUNTERS=BLOG_SCENES.map(({years,...scene})=>({...scene,bank:true,eligible:s=>!!s.intake?.class&&inStation(s,years)&&rand(s.seed,s.age,scene.id)<.4&&blogFits(s,scene.id)}));
