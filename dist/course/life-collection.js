// What a life collects, and how the end re-reads it. Mechanics inspired by two board games:
// CV (Filip Miluński, Piotr Socha): secret goals, cards stacking in columns.
// Tokaido (Antoine Bauza): stops on the road, one dish once, titles at the end.
// Pure: everything but the two chosen lists is read from the record.
import {rand} from './rand.js';
import {netWorth} from './finance.js';
import {rungAt} from './housing-ladder.js';
import {kitchenFeeds} from './diorama-plan.js';
const F=s=>({...s.pivotFlags,...s.story?.flags}),seen=s=>s.story?.seen??[],stops=s=>s.stops??[],worth=s=>s.finance?netWorth(s.finance):s.cash??0;
const stopOf=(s,kind)=>stops(s).filter(x=>STOPS[x.id]?.kind===kind);
const profiles=s=>(s.profiles??[]).map(p=>p.profile);
export const GOALS={
 land:{label:'Own a house with a yard',pts:8,test:s=>rungAt(s)>=4},
 clean:{label:'Owe nobody, ever',pts:7,test:s=>!(s.history??[]).some(r=>r.finance?.debt>0)},
 rich:{label:'Die with three million baht',pts:9,test:s=>worth(s)>=3000000},
 table:{label:'Feed five at one table',pts:8,test:s=>Array.from({length:(s.age??0)+1},(_,a)=>kitchenFeeds(s,a)).some(n=>n>=5)},
 old:{label:'Reach seventy-five',pts:6,test:s=>(s.death?.age??s.age)>=75},
 body:{label:'Stay strong past sixty',pts:7,test:s=>(s.age>=60)&&(s.history??[]).filter(r=>r.age>=60).every(r=>r.health>=60)},
 merit:{label:'Never leave the temple',pts:6,test:s=>profiles(s).length>1&&profiles(s).every(p=>p.religion==='practice')},
 honest:{label:'Never do the thing you cannot tell',pts:8,test:s=>!['lied','sentMessage','ran','g_secret'].some(k=>F(s)[k]!==undefined)},
 giver:{label:'Be owed by people who never say so',pts:8,test:s=>F(s).g_gave!==undefined||stopOf(s,'give').length>=3},
 wander:{label:'See the sea, the hills and the holy places',pts:9,test:s=>['sea','hills','holy'].every(k=>stopOf(s,k).length>=1)},
 table_tour:{label:'Eat your way across the country',pts:7,test:s=>stopOf(s,'meal').length>=4},
 survive:{label:'Come back from the worst of it',pts:9,test:s=>{const r=(s.history??[]).filter(x=>x.age>=15);let low=null;for(let i=1;i<r.length;i++)if(r[i-1].wellbeing-r[i].wellbeing>=20)low=i;return low!==null&&r.slice(low+1).some(x=>x.wellbeing>=r[low-1].wellbeing);}}
};
export const STOPS={
 s_huahin:{kind:'sea',label:'The sea at Hua Hin'},s_samui:{kind:'sea',label:'The sea at Ko Samui'},s_krabi:{kind:'sea',label:'The cliffs at Krabi'},
 h_inthanon:{kind:'hills',label:'The cold at Doi Inthanon'},h_maehong:{kind:'hills',label:'The mist at Mae Hong Son'},h_khaoyai:{kind:'hills',label:'The forest at Khao Yai'},
 t_suthep:{kind:'holy',label:'The steps at Doi Suthep'},t_phanom:{kind:'holy',label:'The chedi at That Phanom'},t_mahathat:{kind:'holy',label:'The chedi at Nakhon Si Thammarat'},
 m_soi:{kind:'meal',label:'Khao soi in Chiang Mai'},m_somtam:{kind:'meal',label:'Som tam by the road in Isan'},m_taipla:{kind:'meal',label:'Gaeng tai pla in the south'},m_boat:{kind:'meal',label:'Boat noodles in Ayutthaya'},m_mango:{kind:'meal',label:'Mango and sticky rice at the market'},m_hoi:{kind:'meal',label:'Oyster omelette on Yaowarat'},
 r_ranong:{kind:'rest',label:'The hot springs at Ranong'},r_sankam:{kind:'rest',label:'The hot springs at San Kamphaeng'},
 g_alms:{kind:'give',label:'Give at dawn to the alms bowl'},g_school:{kind:'give',label:'Pay a stranger’s school fees'},g_temple:{kind:'give',label:'Give to rebuild a village temple'}
};
const shuffle=(list,seed,salt)=>[...list].map((x,i)=>[rand(seed,i,salt+x),x]).sort((a,b)=>a[0]-b[0]).map(p=>p[1]);
export const dealtGoals=seed=>shuffle(Object.keys(GOALS),seed,'goal').slice(0,3);
export const canChooseGoals=s=>s.stage==='review'&&s.age>=15&&s.age<20;
export function setGoals(s,ids){if(!canChooseGoals(s)||!Array.isArray(ids)||ids.length>2||!ids.every(i=>dealtGoals(s.seed).includes(i)))return s;return {...s,lifeGoals:ids};}
export const dealtStops=s=>shuffle(Object.keys(STOPS).filter(id=>!stops(s).some(x=>x.id===id&&x.age!==s.age)),s.seed+s.age,'stop').slice(0,3);
export const canStop=s=>s.stage==='review'&&s.age>=15&&(s.finance?.budget?.fun??10)>=10;
export function setStop(s,id){if(!canStop(s)||(id!==null&&!dealtStops(s).includes(id)))return s;const rest=stops(s).filter(x=>x.age!==s.age);return {...s,stops:id===null||stops(s).some(x=>x.age===s.age&&x.id===id)?rest:[...rest,{age:s.age,id}]};}
const COLUMNS=['work','money','family','health','connection'],STEP=[0,1,3,6,10,15,21,28,36];
// Stacking pays: the sixth card in one column is worth far more than the first.
export function scoreLife(s){
 const counts=Object.fromEntries(COLUMNS.map(c=>[c,0]));for(const e of seen(s)){const cat=categoryOf(e.id);if(cat in counts)counts[cat]++;}
 const cards=COLUMNS.reduce((n,c)=>n+STEP[Math.min(STEP.length-1,counts[c])],0),goal=id=>({id,label:GOALS[id].label,pts:GOALS[id].pts,met:!!GOALS[id].test(s)}),mine=(s.lifeGoals??[]).filter(id=>GOALS[id]).map(goal),passed=dealtGoals(s.seed).filter(id=>!(s.lifeGoals??[]).includes(id)).map(goal);
 const n=k=>stopOf(s,k).length,road=['sea','hills','holy'].reduce((a,k)=>a+[0,1,3,6][Math.min(3,n(k))],0)+n('meal')*3+n('rest')*2+n('give')*2;
 const titles=[['The gourmet',n('meal')>=3],['The pilgrim',n('holy')>=2],['The bather',n('rest')>=2],['The giver',n('give')>=2],['The traveller',n('sea')+n('hills')>=4],['The one with stories',seen(s).length>=14]].filter(([,on])=>on).map(([t])=>t);
 const goalPts=mine.filter(g=>g.met).reduce((a,g)=>a+g.pts,0);
 return {counts,cards,road,goals:mine,passed,titles,total:cards+road+goalPts+titles.length*3,missed:passed.filter(g=>g.met).reduce((a,g)=>a+g.pts,0)};
}
let categoryOf=()=>null;export const useCategories=fn=>{categoryOf=fn;};
