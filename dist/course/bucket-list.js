// Discretionary days beyond school/work/care. Costs and effects are authored game rules.
// Money is reserved when booked; consequences enter the next recorded chapter.
import {personalFlow} from './finance.js';
const item=(label,cost,days,health,wellbeing,skills={},minAge=15,extra={})=>({label,cost,days,health,wellbeing,skills,minAge,...extra});
export const BUCKET_DAYS=30;
export const BUCKET_LIST={
 park:item('Walk in the park',0,1,1,1,{},6),
 library:item('Spend a day at the library',0,1,0,1,{iq:1},6),
 comics:item('Read comics with a friend',80,1,0,1,{eq:1},10),
 picnic:item('Go for a picnic',160,1,0,2,{},10),
 meal:item('Cook a meal for your family',400,1,0,2,{eq:1},15),
 coffee:item('Catch up with a friend',120,1,0,1,{eq:1},15),
 holiday:item('Take a short holiday',4800,4,2,4),
 weekend:item('Take a weekend away',1200,2,1,2),
 abroad:item('Visit another country',24000,7,0,5,{iq:1},18),
 puppy:item('Adopt a puppy',2400,2,0,3,{eq:1},18,{flag:'dog',once:true}),
 shelter:item('Volunteer at an animal shelter',0,2,0,1,{eq:2},16),
 hospital:item('Volunteer at a hospital',0,3,0,1,{eq:2},18),
 carehome:item('Volunteer at a care home',0,2,0,1,{eq:2},16),
 cleanup:item('Join a beach cleanup',0,2,1,1,{physique:1},12),
 garden:item('Help in a community garden',100,2,1,1,{physique:1},10),
 oldfriend:item('Visit an old friend',300,2,0,2,{eq:2}),
 parent:item('Spend time caring for a parent',0,3,0,1,{eq:2}),
 art:item('Take an art course',900,3,0,1,{craft:2},10),
 music:item('Learn a musical instrument',1000,3,0,1,{craft:2,eq:1},10),
 language:item('Take a language course',1200,4,0,0,{iq:2},12),
 coding:item('Build a small coding project',1600,4,0,0,{iq:2,craft:1}),
 sports:item('Join a sports club',500,3,1,1,{physique:2},10),
 firstaid:item('Take a first-aid class',600,2,0,0,{iq:1,eq:1}),
 film:item('Go to the cinema',200,1,0,2,{},10),
 hike:item('Go hiking with friends',400,2,2,1,{physique:1}),
 dance:item('Take a dance class',350,1,1,1,{physique:1,eq:1},12),
 support:item('Talk with a counsellor',900,2,0,3,{eq:1},16),
 rest:item('Keep a day free to rest',0,1,1,1,{},6),
 photos:item('Make a family photo album',0,1,0,1,{eq:1},6),
 cooking:item('Learn to cook something new',400,2,0,1,{craft:1},12)
};
export const CUSTOM_KINDS={rest:{health:1,wellbeing:1,skills:{}},learn:{health:0,wellbeing:0,skills:{iq:1}},connect:{health:0,wellbeing:1,skills:{eq:1}},help:{health:0,wellbeing:1,skills:{eq:1}},train:{health:1,wellbeing:0,skills:{physique:1}},make:{health:0,wellbeing:1,skills:{craft:1}}};
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const empty=()=>({custom:[],planned:[],done:[]});
export function bucketItem(state,key){return Object.hasOwn(BUCKET_LIST,key)?BUCKET_LIST[key]:state.bucket?.custom?.find(a=>a.key===key);}
export function addCustomBucket(state,{title,cost,days,kind}){
 if(state.stage==='recap'||!Object.hasOwn(CUSTOM_KINDS,kind)||typeof title!=='string'||!title.trim()||title.trim().length>80||!integer(cost)||cost>1000000||!integer(days)||days<1||days>BUCKET_DAYS)return state;
 const bucket=state.bucket??empty();if(bucket.custom.length>=30)return state;
 let n=1;while(bucket.custom.some(e=>e.key==='custom-'+n))n++;
 const key='custom-'+n,entry={key,label:title.trim(),cost,days,minAge:cost?15:6,...CUSTOM_KINDS[kind],kind};
 return {...state,bucket:{...bucket,custom:[...bucket.custom,entry]}};
}
export function bucketReason(state,key,year){
 const entry=bucketItem(state,key),all=[...(state.bucket?.planned??[]),...(state.bucket?.done??[])];
 if(state.stage==='recap')return 'This life has ended.';
 if(!entry||state.story?.pending)return 'Resolve the current moment first.';
 if(!integer(year)||year<Math.max(6,state.age)||year>(state.stage==='birth'?10:Math.min(80,state.age+5))||year<entry.minAge)return 'Not available at this age.';
 if(entry.cost>(state.finance?.available??0))return 'Not enough spendable money.';
 if(all.some(a=>a.key===key&&(entry.once||a.age===year)))return 'Already on this life’s list.';
 if(all.filter(a=>a.age===year).reduce((n,a)=>n+a.days,0)+entry.days>BUCKET_DAYS)return 'Not enough free days this year.';
 if(all.length>=300||state.finance?.receipts.length>=990)return 'This life’s activity record is full.';
 return null;
}
export function planBucket(state,key,year){
 if(bucketReason(state,key,year))return state;
 const entry=bucketItem(state,key),bucket=state.bucket??empty(),id='bucket:'+year+':'+key;
 let next=state.finance?personalFlow(state,id,0,entry.cost):state;
 if(state.finance){if(next===state)return state;next={...next,finance:{...next.finance,receipts:next.finance.receipts.map(r=>r.id===id?{...r,kind:'bucket'}:r)}};}
 const planned={id,key,age:year,paidAt:state.age,cost:entry.cost,days:entry.days,label:entry.label};
 const last=next.history.at(-1);
 return {...next,bucket:{...bucket,planned:[...bucket.planned,planned]},...(last?.age===state.age&&next.finance?{history:[...next.history.slice(0,-1),{...last,finance:{...(last.finance??{}),available:next.finance.available,reserve:next.finance.reserve,debt:next.finance.debt}}]}:{})};
}
// Chapter-scale diminishing returns prevent free custom labels from becoming infinite upgrades.
const benefitTotal=(state,records)=>{const total={health:0,wellbeing:0,skills:{}};for(const r of records){const e=bucketItem(state,r.key);if(!e)continue;total.health=Math.min(3,total.health+e.health);total.wellbeing=Math.min(6,total.wellbeing+e.wellbeing);for(const[k,v]of Object.entries(e.skills))total.skills[k]=Math.min(3,(total.skills[k]??0)+v);}return total;};
const benefitDelta=(a,b)=>({health:b.health-a.health,wellbeing:b.wellbeing-a.wellbeing,skills:Object.fromEntries([...new Set([...Object.keys(a.skills),...Object.keys(b.skills)])].map(k=>[k,(b.skills[k]??0)-(a.skills[k]??0)]))});
export function projectedBucketEffect(state,key){const records=[...(state.bucket?.done??[]),...(state.bucket?.planned??[])].filter(r=>r.paidAt===state.age),before=benefitTotal(state,records),after=benefitTotal(state,[...records,{key}]);return benefitDelta(before,after);}
export function bucketDue(state,through){
 const bucket=state.bucket,records=(bucket?.planned??[]).filter(a=>a.age<=through),effects={health:0,wellbeing:0,skills:{}};
 for(const cohort of new Set(records.map(r=>r.paidAt))){const prior=(bucket?.done??[]).filter(r=>r.paidAt===cohort),next=[...prior,...records.filter(r=>r.paidAt===cohort)],d=benefitDelta(benefitTotal(state,prior),benefitTotal(state,next));effects.health+=d.health;effects.wellbeing+=d.wellbeing;for(const[k,v]of Object.entries(d.skills))effects.skills[k]=(effects.skills[k]??0)+v;}
 return {...effects,records,events:records.map(r=>({type:'bucket',age:r.age,text:r.label,key:r.key})),...(bucket?{bucket:{...bucket,planned:bucket.planned.filter(a=>a.age>through),done:[...bucket.done,...records]}}:{})};
}
export function bucketFlags(state){return Object.fromEntries((state.bucket?.done??[]).flatMap(r=>{const e=Object.hasOwn(BUCKET_LIST,r.key)?BUCKET_LIST[r.key]:null;return e?.flag?[[e.flag,r.age]]:[];}));}
export function validBucket(state){
 const b=state.bucket;if(b===undefined)return true;
 if(!b||!Array.isArray(b.custom)||b.custom.length>30||!Array.isArray(b.planned)||!Array.isArray(b.done)||b.planned.length+b.done.length>300)return false;
 if(new Set(b.custom.map(e=>e?.key)).size!==b.custom.length)return false;
 if(!b.custom.every(e=>e&&typeof e.key==='string'&&!Object.hasOwn(BUCKET_LIST,e.key)&&/^custom-[1-9][0-9]*$/.test(e.key)&&e.flag===undefined&&e.once===undefined&&typeof e.label==='string'&&e.label.length<=80&&integer(e.cost)&&e.cost<=1000000&&integer(e.days)&&e.days>=1&&e.days<=30&&Object.hasOwn(CUSTOM_KINDS,e.kind)&&JSON.stringify(e.skills)===JSON.stringify(CUSTOM_KINDS[e.kind].skills)&&e.health===CUSTOM_KINDS[e.kind].health&&e.wellbeing===CUSTOM_KINDS[e.kind].wellbeing&&e.minAge===(e.cost?15:6)))return false;
 const all=[...b.planned,...b.done];if(Object.entries(BUCKET_LIST).some(([key,e])=>e.once&&all.filter(r=>r.key===key).length>1))return false;if(new Set(all.map(r=>r?.id)).size!==all.length)return false;
 if(!all.every(r=>{const e=r&&bucketItem(state,r.key);return e&&r.id==='bucket:'+r.age+':'+r.key&&integer(r.age)&&r.age>=e.minAge&&r.age<=80&&integer(r.paidAt)&&r.paidAt<=r.age&&r.cost===e.cost&&r.days===e.days&&r.label===e.label&&(!r.cost||state.finance?.receipts.some(p=>p.id===r.id&&p.age===r.paidAt&&p.kind==='bucket'&&p.expense===r.cost));}))return false;
 return b.done.every(r=>r.age<=state.age)&&b.planned.every(r=>r.age>=state.age&&r.age<=(state.stage==='birth'?10:state.age+5))&&[...new Set(all.map(r=>r.age))].every(age=>all.filter(r=>r.age===age).reduce((n,r)=>n+r.days,0)<=BUCKET_DAYS);
}
