import {validJourney} from './journey.js';
import {periodLifeEvents,lifeEventFlags,validLifeEvents} from './life-events.js';
import {validChildhood} from './childhood-choices.js';
import {bucketDue,bucketFlags,validBucket} from './bucket-list.js';
import {REGIONS,HOUSEHOLDS,COUNTRIES,CLASS_REGIONS,householdFor,household} from './regions.js';
import {ikigai} from './ikigai.js';
import {consequencesDue} from './lessons.js';
import {MAJORS,majorOf,majorFit,mismatched,partnerNature,together,reconciled,ventureSwing,dogAt} from './life-choices.js';
const CITY_BIRTHS=['khlong-toei','bang-na','sukhumvit'];
import {createEconomy,economyFor,validEconomy} from './economy.js';
import {validHoldings,autoInvest} from './investments.js';
import {FOCUSES} from './motivations.js';
import {advanceFinance,validFinance,validFinanceLocation,grossMonthlyPay} from './finance.js';
import {newStory,offerEncounter,validStory} from './encounters.js';
import {PATHWAYS,pathwayPeriod} from './pathways.js';
export const AXES=[{key:'physique',label:'Physique'},{key:'iq',label:'IQ · reasoning'},{key:'eq',label:'EQ · connection'},{key:'craft',label:'Creativity'},{key:'drive',label:'Drive'}];
// Six Thai birth classes: the condition you are born into, not earned.
// Each class carries starting cash, attribute tilt, privilege flag and a
// drama hook — the kind of tragedy that stalks this life and the choice
// that might have avoided it.
export const CLASS_TIERS={
 high_class:{label:'High class',cash:500000,attributes:{physique:2,iq:3,eq:1,craft:2,drive:2},privilege:'wealth',drama:'market',note:'Inherited wealth and family business connections. The market is yours — until it is not.'},
 low_class:{label:'Low class',cash:2000,attributes:{physique:4,iq:1,eq:2,craft:1,drive:2},privilege:'none',drama:'debt',note:'Nothing to eat, begging to survive. Every baht is a fight.'},
 middle_class:{label:'Middle class',cash:100000,attributes:{physique:2,iq:2,eq:2,craft:2,drive:2},privilege:'stable',drama:'ambition',note:'Comfortable but not rich, striving to do better than the last generation.'},
 working_class:{label:'Working class',cash:20000,attributes:{physique:3,iq:1,eq:2,craft:2,drive:2},privilege:'labor',drama:'wage',note:'Wages and labor, hand to mouth. The body pays first.'},
 bureaucratic_class:{label:'Bureaucratic class',cash:80000,attributes:{physique:1,iq:3,eq:3,craft:1,drive:2},privilege:'government',drama:'corruption',note:'Government post, stable pay, limited power. The system protects its own.'},
 royal_associated:{label:'Royal associated',cash:300000,attributes:{physique:2,iq:2,eq:4,craft:1,drive:1},privilege:'ml',drama:'scrutiny',note:'ML title and palace connections. Privilege with constant scrutiny.'}
};
export const CLASS_KEYS=Object.keys(CLASS_TIERS);
const hasMarket=f=>Array.isArray(f?.receipts)&&f.receipts.some(r=>r?.kind==='market');
export const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
export function rand(seed,age,domain){let h=2166136261;for(const c of `${seed}/${age}/${domain}`){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h+=h<<13;h^=h>>>7;h+=h<<3;h^=h>>>17;h+=h<<5;return(h>>>0)/4294967296;}
export const balanced=()=>Object.fromEntries(AXES.map(a=>[a.key,2]));
export const validPoints=p=>!!p&&Object.keys(p).length===5&&AXES.every(a=>Number.isInteger(p[a.key])&&p[a.key]>=0&&p[a.key]<=10)&&Object.values(p).reduce((a,b)=>a+b,0)===10;
export function transfer(p,key,delta,minima={}){
 if(!validPoints(p)||!AXES.some(a=>a.key===key)||![1,-1].includes(delta))return p;
 if(delta<0&&p[key]<=(minima[key]??0))return p;
 const other=AXES.map(a=>a.key).filter(k=>k!==key&&(delta<0||p[k]>(minima[k]??0))).sort((a,b)=>p[b]-p[a])[0];
 if(other===undefined||delta>0&&p[key]>=10)return p;
 return {...p,[key]:p[key]+delta,[other]:p[other]-delta};
}
export const defaultProfile=()=>({drink:'no',smoke:'no',religion:'explore',intimacy:'unsure',aim:'balance'});
// One view of what a life has decided: the encounters write the story's flags,
// the questions write their own, and the world reads them together.
export const flagsOf=state=>{const flags={};for(const source of [state?.story?.flags,state?.pivotFlags,bucketFlags(state),lifeEventFlags(state)])for(const[k,v]of Object.entries(source??{}))flags[k]=typeof v==='number'&&typeof flags[k]==='number'?Math.max(flags[k],v):v;return flags;};
// A commitment made at a question holds for the five years that follow: the
// axis cannot be spent below the number the answer promised.
export function lockedEffort(s){
 const locks={};for(const record of s.pivots??[])if(record.station===s.age)for(const[axis,value]of Object.entries(record.locks??{}))locks[axis]=Math.max(locks[axis]??0,value);
 if(!Object.keys(locks).length)return s.effort;
 let effort={...s.effort};
 for(const[axis,minimum]of Object.entries(locks)){
  const need=minimum-(effort[axis]??0);if(need<=0)continue;
  const donors=AXES.map(a=>a.key).filter(k=>k!==axis).sort((a,b)=>(effort[b]??0)-(effort[a]??0));
  let left=need;for(const donor of donors){const take=Math.min(left,Math.max(0,(effort[donor]??0)-(locks[donor]??0)));if(take<=0)continue;effort[donor]-=take;left-=take;if(left<=0)break;}
  effort[axis]+=need-left;
 }
 return validPoints(effort)?effort:s.effort;
}
// What a point of effort is worth changes with the years: a young body answers
// training, an old one does not, and a mind keeps learning longer than a hand.
export function eraWeight(axis,from){
 if(axis==='physique')return from<20?1.2:from<45?1:from<60?.6:.35;
 if(axis==='craft')return from<15?.6:from<55?1:.6;
 if(axis==='iq')return from<15?1:from<65?1:.7;
 if(axis==='eq')return from<15?.6:from<70?1:.8;
 return from<15?.5:from<55?1:.6;
}
export function newLife(seed=43127){const roll=rand(seed,0,'class');const cls=CLASS_KEYS[Math.floor(roll*CLASS_KEYS.length)];const t=CLASS_TIERS[cls];const birth=rand(seed,0,'household');const regionId=birth<.5?'nakhon-sawan':'samut-prakan';const place=REGIONS[regionId].place,home=REGIONS[regionId].home;return {version:2,seed,economy:createEconomy(seed),story:newStory(seed),stage:'birth',age:0,attributes:{...t.attributes},effort:{...t.attributes},profile:defaultProfile(),birth:{place,home,region:regionId,household:householdFor(rand(seed,0,'household-kind')),cash:t.cash,sensitivity:rand(seed,0,'sensitivity')>.5?'Sensitive to pressure':'Steady under pressure',body:rand(seed,0,'body')>.5?'Strong physical starting condition':'Ordinary physical starting condition',class:cls},cash:t.cash,health:rand(seed,0,'body')>.5?94:88,wellbeing:rand(seed,0,'sensitivity')>.5?62:68,skills:{physique:0,iq:0,eq:0,craft:0,drive:0},history:[],profiles:[],original:null,death:null,previous:null};}
export function begin(s){if(s.stage!=='birth'||!validPoints(s.attributes))return s;const due=bucketDue(s,10),origin=s.childhood?.origin??s,health=clamp(s.health+due.health,0,100),wellbeing=clamp(s.wellbeing+due.wellbeing,0,100),skills={...s.skills};for(const[k,v]of Object.entries(due.skills))skills[k]+=v;const start={age:0,health:origin.health,wellbeing:origin.wellbeing,cash:origin.cash,event:'Born into '+s.birth.home,effort:{...s.attributes},profile:defaultProfile()};return {...s,health,wellbeing,skills,...(due.bucket?{bucket:due.bucket}:{}),age:10,stage:'review',original:{...s.attributes},effort:{...s.attributes},history:[start,{...start,age:10,health,wellbeing,cash:s.cash,event:'Childhood: family, school and the world you inherited.'+(s.childhood?.choices.length?' '+s.childhood.choices.map(r=>r.note).join(' '):''),...(due.events.length?{events:due.events}:{})}]};}
export const goals={balance:'A life with room to breathe',sport:'Become an athlete',art:'Make a life through art',security:'Build financial security',connection:'Love and belong'};
export function sanitiseProfile(p,age){const q={...defaultProfile()};for(const [key,allowed]of Object.entries({drink:['no','social'],smoke:['no','yes'],religion:['explore','practice','none'],intimacy:['unsure','together','separate'],aim:Object.keys(goals)}))if(allowed.includes(p?.[key]))q[key]=p[key];if(p?.focus!==undefined)q.focus=Object.hasOwn(FOCUSES,p.focus)?p.focus:'none';if(age<20){q.drink='no';q.smoke='no';q.intimacy='unsure';}return q;}
function stepSkills(s){
 const from=s.age,age=from+5,e=lockedEffort(s),content=ikigai(s)?.score??50,growth=content<35?.75:1;
 const due=consequencesDue(s,from,age),bucket=bucketDue(s,age),pathway=pathwayPeriod(s,rand(s.seed,age,'independent-work'));
 const eraWeights=Object.fromEntries(AXES.map(a=>[a.key,eraWeight(a.key,from)]));
 const practice=Object.fromEntries(AXES.map(a=>[a.key,(bucket.skills[a.key]??0)+due.reduce((n,c)=>n+(c.skills[a.key]??0),0)+Math.round(e[a.key]*growth*eraWeights[a.key])+(a.key==='iq'?pathway.learning:0)]));
 return {e,content,growth,due,pathway,eraWeights,practice};
}
function advancePeriod(s){s={...s,economy:economyFor(s),effort:lockedEffort(s)};const from=s.age,age=from+5,p=sanitiseProfile(s.profile,from),{e,content,growth,due,pathway,eraWeights,practice}=stepSkills(s);const adult=from>=20,retired=from>=60;const shock=rand(s.seed,age,'event'),rare=rand(s.seed,age,'rare'),pay=adult?Math.max(6000,grossMonthlyPay({...s,age:from})):0;const lead=Object.entries(e).sort((a,b)=>b[1]-a[1]),spread=lead[0][1]-lead.at(-1)[1],ORDINARY={physique:'You kept your body in use.',iq:'You kept learning, and it showed in your work.',eq:'Friends and family took most of your attention.',craft:'You kept making things.',drive:'You pushed hard at work.'};let event=age===60?'Work slows. Your time becomes your own again.':spread>=2?'An ordinary five years. '+ORDINARY[lead[0][0]]:'An ordinary five years. Small habits accumulate.';let setback=0,healthShock=0;
// Not every world has the same plot: the flood and the parents' deaths happen in most lives, not all, decided once per world.
// What a family leaves depends on what it had.
const plot=(key,chance)=>rand(s.seed,0,'plot-'+key)<chance,estate=()=>{const cls=s.intake?.class??'middle_class',sum={high_class:1200000,low_class:0,middle_class:200000,working_class:50000,bureaucratic_class:300000,royal_associated:800000}[cls];setback-=sum;return {high_class:' A substantial inheritance reaches you.',low_class:' There is nothing to inherit.',middle_class:' A modest inheritance reaches you.',working_class:' A little is left, barely enough.',bureaucratic_class:' A government pension and a small house.',royal_associated:' A family estate and palace connections.'}[cls];},flood=age===30&&plot('flood',.7);
if(flood){setback=0;event='Floodwater damages the family home. Repairs take money and time.';}else if(age===55&&plot('father',.7)){event='Your '+household(s.birth).father.role+' dies. The family has to find a different rhythm.'+estate();}else if(age===70&&plot('mother',.55)){event='Your '+household(s.birth).mother.role+' dies. Familiar places carry different memories.'+estate();}else if(adult&&rare<.02){setback=Math.round(pay*6);healthShock+=8;event='An accident leaves you out of work for months. Recovery costs money and time.';}else if(adult&&rare<.04){setback=Math.round(pay*5);event='Someone you trusted takes your savings and disappears.';}else if(adult&&rare>.975){setback=-Math.round(pay*8);event='An unexpected windfall arrives, from a sale, a prize or a relative you barely knew.';}else if(adult&&shock<.15){setback=Math.max(12000,Math.round(pay*2));event='A work interruption reduces your personal funds.';}else if(adult&&shock>.84){setback=-Math.max(9000,Math.round(pay*1.5));event='An unexpected commission or extra work brings a little breathing room.';}
// Class drama: the tragedy that stalks each birth condition. A choice made
// earlier can steer you into it — or away from it. The "had I chosen
// differently" moment that makes you want to live again.
const cls=s.intake?.class??'middle_class',dramaRoll=adult?rand(s.seed,age,'drama-'+cls):0;
if(cls==='high_class'&&age>=25&&age<=65&&dramaRoll<.03){
 const wealthy=s.cash>200000;event=wealthy?'The bloody market: your family\u2019s wealth and five people around you — your father, your best child, an engineer, a parliament member — are killed in one night. You survive, but the wealth is gone and the house is empty.':'.';
 if(wealthy){setback=s.cash;healthShock+=15;s.story.flags=s.story.flags??{};s.story.flags.bloodyMarket=age;}
}if(cls==='low_class'&&age>=15&&age<=60&&dramaRoll<.04){
 event='Debt collectors come for what you do not have. The interest eats your wages, then your health.';setback=Math.round(pay*3);healthShock+=5;s.story.flags=s.story.flags??{};s.story.flags.debtCrisis=age;
}if(cls==='middle_class'&&age>=20&&age<=55&&dramaRoll<.025){
 event='Ambition outruns means: the business you borrowed for fails, and the debt is yours alone.';setback=Math.round(pay*5);healthShock+=3;
}if(cls==='working_class'&&age>=18&&age<=60&&dramaRoll<.03){
 event='A workplace accident takes your income for months. The employer owes nothing.';setback=Math.round(pay*4);healthShock+=6;
}if(cls==='bureaucratic_class'&&age>=25&&age<=65&&dramaRoll<.02){
 event='A corruption scandal names your office. The pay stops, the reputation does not.';setback=Math.round(pay*6);healthShock+=4;
}if(cls==='royal_associated'&&age>=20&&age<=70&&dramaRoll<.02){
 event='Scrutiny falls on your ML title. The palace withdraws, the whispers begin, and the privilege becomes a burden.';setback=Math.round(pay*3);healthShock+=3;
}
if(age>=40&&rand(s.seed,age,'illness')<.12){healthShock=12;event+=' A health setback interrupts your plans.';}
const moments=periodLifeEvents(s,from,age,flagsOf(s),(year,key)=>rand(s.seed,year,key));setback-=moments.cash;healthShock-=moments.health;if(moments.records.length)event+=' '+moments.records.map(r=>r.text).join(' ');
const earnings=grossMonthlyPay(s);
// Three pillars: body, mind and contentment. Contentment (Ikigai) acts on the other two:
// low contentment wears the body and slows the mind; purpose slows decline. Authored tuning.
const bucket=bucketDue(s,age);let bodyAdj=(content<35?-(35-content)*.12:content>70?(content-70)*.06:0)+bucket.health,moodAdj=(content-50)*.04+bucket.wellbeing+moments.wellbeing;
// The big forks keep acting after they are chosen.
const field=majorOf(s),fieldFit=field?majorFit(s,field):1;
const nature=together(s)?partnerNature(s):null,apart=flagsOf(s).apart!==undefined;
if(nature==='kind'){moodAdj+=apart?1:2;bodyAdj+=.5;}
if(nature==='difficult'&&!reconciled(s)){moodAdj-=apart?2:4;setback+=apart?2000:4000;}
const flags=flagsOf(s);if(flags.parent!==undefined&&flags.childLost===undefined&&from<flags.parent+20){setback+=6000;moodAdj+=1;}
if(dogAt(s,from)){setback+=2000;moodAdj+=1;}
if(adult&&mismatched(s)&&from<60)moodAdj-=2;
setback-=ventureSwing(s,age);
// Past choices return: on the timeline, in this period's costs, in body and mind.
for(const c of due){setback-=c.cash;bodyAdj+=c.health;moodAdj+=c.wellbeing;event+=' '+c.text;}
const spending=adult?(retired?11000:14000):0;const habits=adult?((p.smoke==='yes'?4000:0)+(p.drink==='social'?2500:0)):0;
if(pathway.route==='college'&&field){pathway.cash-=MAJORS[field].cost;pathway.description+=fieldFit<.35?' The field did not fit you yet; study was a struggle.':fieldFit>.7?' The work came naturally.':'';if(fieldFit<.35)moodAdj-=4;}event+=(pathway.description?' '+pathway.description:'');const cash=from>=15?s.cash-(flood?18000:0):Math.round(s.cash+Math.round(earnings*pathway.incomeFactor)-spending-habits-setback+pathway.cash);const aging=from<30?1:from<50?4:from<65?7:8;const health=clamp(s.health-aging+(from>=60?e.physique*.35:0)+e.physique*.5*eraWeight('physique',from)+s.attributes.physique*.15-(adult&&p.smoke==='yes'?6:0)-(adult&&p.drink==='social'?1.5:0)-healthShock+bodyAdj);
const match={balance:Math.min(...Object.values(e))*.7,sport:e.physique*.6,art:e.craft*.6,security:e.drive*.4+e.iq*.2,connection:e.eq*.6}[p.aim];const social=adult&&p.drink==='social'?(e.eq>0?1:-1):0;const wellbeing=clamp(s.wellbeing+match+e.eq*.35+s.attributes.eq*.1+social-3-(cash<0?(s.birth.sensitivity==='Sensitive to pressure'?6:4):0)-(healthShock?4:0)+moodAdj+(from>=60?(health-45)*.07-(s.wellbeing>80?3:0):0));
const hazard=(age<25?.003:age<45?.009:age<60?.025:age<75?.07:.15)*(1.25-content/200)*(adult&&p.smoke==='yes'?1.3:1);
const dramaDeath=s.story?.flags?.bloodyMarket&&age>=s.story.flags.bloodyMarket+.05&&age<=s.story.flags.bloodyMarket+10?0.08:s.story?.flags?.debtCrisis&&age>=15?0.03:0;
let deathCause=health<30?'A serious health event ended this life.':'An unexpected illness or accident ended this life.';
if(dramaDeath>0&&s.story?.flags?.bloodyMarket)deathCause='The bloody market took your family — you could not carry on alone.';
const deathRoll=rand(s.seed,age,'mortality'+Math.floor(health/10));
const death=deathRoll<hazard+Math.max(0,60-health)*.004+dramaDeath?{age,cause:deathCause}:null;
const skills=Object.fromEntries(AXES.map(a=>[a.key,s.skills[a.key]+practice[a.key]]));const row={age,from,health,wellbeing,cash,event,effort:{...e},eraWeights,...(s.pivots??[]).filter(record=>record.station===from).length?{pivots:(s.pivots??[]).filter(record=>record.station===from)}:{},...(s.pendingAlternatives??[]).length?{alternatives:s.pendingAlternatives}:{},...(growth<1?{growth}:{}),...(due.length?{consequences:due.map(({lesson,choice,age,text,cash,health,wellbeing})=>({lesson,choice,age,text,cash,health,wellbeing})),events:due.map(c=>({type:'consequence',lesson:c.lesson})),consequenceSkills:Object.fromEntries(AXES.map(a=>[a.key,due.reduce((n,c)=>n+(c.skills[a.key]??0),0)]))}:{}),profile:{...p},earnings:Math.round(earnings*pathway.incomeFactor),spending:spending+habits,habits,setback,pathway:pathway.route,pathwayCash:pathway.cash,pathwayLearning:pathway.learning};if(bucket.events.length||moments.records.length)row.events=[...(row.events??[]),...bucket.events,...moments.records];if(moments.incomeMonths)row.unemployedMonths=moments.incomeMonths;const next={...s,...(s.journey?{journey:undefined}:{}),...(bucket.bucket?{bucket:bucket.bucket}:{}),age,cash,health,wellbeing,skills,profile:p,pivots:(s.pivots??[]).filter(record=>record.station<from),pendingAlternatives:undefined,profiles:[...s.profiles,{age:from,effort:{...e},profile:{...p}}],history:[...s.history,row],death,stage:death||age===80?'recap':'review'};return advanceFinance(s,next);}
export function projectedSkillGains(s){
 const {growth,eraWeights,pathway,due,practice}=stepSkills(s);
 if(s.stage!=='review'||!validPoints(s.effort)||s.age>=80||s.finance?.receipts.length>993)return {gains:practice,practice,financeLearning:0,growth,eraWeights,pathway,due};
 const next=advancePeriod({...s,story:{...s.story,pending:null},pendingAlternatives:undefined});
 const financeLearning=next.history.at(-1)?.financeSkills?.iq??0;
 const gains=Object.fromEntries(AXES.map(a=>[a.key,next.skills[a.key]-s.skills[a.key]]));
 return {gains,practice,financeLearning,growth,eraWeights,pathway,due};
}
export function live(s){if(s.stage!=='review'||!validPoints(s.effort)||s.age>=80||s.story?.pending||s.finance?.receipts.length>993)return s;const next=advancePeriod(s);return offerEncounter(autoInvest(next),rand(s.seed,next.age,'encounter'));}
export function replay(s){return {...(s.dailyDay?{dailyDay:s.dailyDay}:{}),...(s.intake?configureLife(newLife(s.seed),s.intake):newLife(s.seed)),economy:createEconomy(s.economy?.seed??s.seed),...(s.lifeEventPolicy?{lifeEventPolicy:{version:1,startAge:0}}:{}),...(s.bucket?.custom.length?{bucket:{custom:structuredClone(s.bucket.custom),planned:[],done:[]}}:{}),previous:{economy:s.economy,age:s.age,cash:s.cash,health:s.health,wellbeing:s.wellbeing,history:s.history,death:s.death,story:s.story,finance:s.finance}};}
export function validate(s){
 const profile=p=>p&&Object.entries(sanitiseProfile(p,80)).every(([k,v])=>p[k]===v);
 const row=r=>r&&(r.unemployedMonths===undefined||Number.isInteger(r.unemployedMonths)&&r.unemployedMonths>=0&&r.unemployedMonths<=12)&&(r.economy===undefined||r.economy&&Number.isInteger(r.economy.from)&&r.economy.from>=0&&r.economy.to===r.age&&r.economy.from<r.age&&Number.isSafeInteger(r.economy.incomeAdjustment)&&Number.isSafeInteger(r.economy.marketChange)&&Array.isArray(r.economy.contractions)&&r.economy.contractions.every(a=>Number.isInteger(a)&&a>r.economy.from&&a<=r.age))&&(r.finance===undefined||r.finance&&validHoldings(r.finance.holdings)&&validFinanceLocation(r.finance,r.age)&&['available','reserve','debt'].every(k=>Number.isSafeInteger(r.finance[k])&&r.finance[k]>=0))&&(r.financeSkills===undefined||r.financeSkills&&Object.entries(r.financeSkills).every(([key,value])=>AXES.some(a=>a.key===key)&&Number.isInteger(value)&&value>=0))&&(r.storySkills===undefined||r.storySkills&&Object.entries(r.storySkills).every(([key,value])=>AXES.some(a=>a.key===key)&&Number.isFinite(value)))&&(r.pathway===undefined||Object.hasOwn(PATHWAYS,r.pathway))&&(r.pathwayLearning===undefined||Number.isFinite(r.pathwayLearning))&&Number.isInteger(r.age)&&r.age>=0&&r.age<=80&&['cash','health','wellbeing'].every(k=>Number.isFinite(r[k]))&&validPoints(r.effort)&&profile(r.profile)&&typeof r.event==='string'
 &&(r.pivots===undefined||Array.isArray(r.pivots)&&r.pivots.every(p=>p&&Number.isInteger(p.station)&&typeof p.pivot==='string'&&typeof p.choice==='string'&&typeof p.note==='string'))
 &&(r.alternatives===undefined||Array.isArray(r.alternatives)&&r.alternatives.every(a=>a&&typeof a.label==='string'&&Number.isFinite(a.cash)&&Number.isFinite(a.health)&&Number.isFinite(a.wellbeing)));
 const death=d=>d===null||d&&Number.isInteger(d.age)&&typeof d.cause==='string';
 return s?.version===2&&validJourney(s)&&validLifeEvents(s)&&validChildhood(s)&&validBucket(s)&&validEconomy(s.economy,s.age)&&(s.economy!==undefined||!hasMarket(s.finance))&&(s.economy===undefined||s.economy.seed===s.seed)&&(s.pathway===undefined||Object.hasOwn(PATHWAYS,s.pathway))&&(s.major===undefined||Object.hasOwn(MAJORS,s.major))&&(s.progressAge===undefined||Number.isFinite(s.progressAge)&&s.progressAge>=0&&s.progressAge<=80)&&Number.isInteger(s.seed)&&['birth','review','recap'].includes(s.stage)&&Number.isInteger(s.age)&&s.age>=0&&s.age<=80&&validPoints(s.attributes)&&validPoints(s.effort)&&profile(s.profile)&&['cash','health','wellbeing'].every(k=>Number.isFinite(s[k]))&&Array.isArray(s.history)&&s.history.length<=16&&s.history.every(row)&&
  (s.pivots===undefined||Array.isArray(s.pivots)&&s.pivots.every(p=>p&&Number.isInteger(p.station)&&typeof p.pivot==='string'&&typeof p.choice==='string'&&typeof p.note==='string'))
  &&(s.pivotFlags===undefined||s.pivotFlags&&typeof s.pivotFlags==='object'&&Object.values(s.pivotFlags).every(v=>typeof v==='boolean'||Number.isFinite(v)))&&Array.isArray(s.profiles)&&s.profiles.every(p=>p&&Number.isInteger(p.age)&&validPoints(p.effort)&&profile(p.profile))&&(s.intake===undefined||s.intake&&['female','male','intersex'].includes(s.intake.sex)&&CLASS_KEYS.includes(s.intake.class)&&validPoints(s.intake.attributes))&&s.birth&&['place','home','sensitivity','body','class'].every(k=>typeof s.birth[k]==='string')&&(s.birth.region===undefined||Object.hasOwn(REGIONS,s.birth.region))&&(s.birth.household===undefined||Object.hasOwn(HOUSEHOLDS,s.birth.household))&&(s.birth.childhood===undefined||s.birth.childhood&&Object.hasOwn(REGIONS,s.birth.childhood.region)&&Number.isInteger(s.birth.childhood.from)&&Number.isInteger(s.birth.childhood.to)&&s.birth.childhood.from>=0&&s.birth.childhood.from<s.birth.childhood.to&&s.birth.childhood.to<=18)&&AXES.every(a=>Number.isFinite(s.skills?.[a.key]))&&(s.original===null||validPoints(s.original))&&death(s.death)&&(s.previous===null||s.previous&&validEconomy(s.previous.economy,s.previous.age)&&(s.previous.economy!==undefined||!hasMarket(s.previous.finance))&&Number.isInteger(s.previous.age)&&['cash','health','wellbeing'].every(k=>Number.isFinite(s.previous[k]))&&Array.isArray(s.previous.history)&&s.previous.history.every(row)&&death(s.previous.death)&&validFinance(s.previous.finance,s.previous.age,s.previous.economy))&&validFinance(s.finance,s.age,s.economy)&&validStory(s.story,s.age,s);
}

// Intake presets are authored game starting conditions, not demographic estimates.
// Thailand only: every life begins in Thailand, in one of six birth classes.
// The class you are born into sets your starting cash, attribute tilt,
// privilege and the drama that stalks your life.
export function configureLife(s,options={}){
  const sexes=['female','male','intersex'],classes=CLASS_KEYS;
  const sex=sexes.includes(options.sex)?options.sex:sexes[Math.floor(rand(s.seed,0,'intake-sex')*sexes.length)];
  const cls=classes.includes(options.class)?options.class:classes[Math.floor(rand(s.seed,0,'intake-class')*classes.length)];
  const t=CLASS_TIERS[cls];
  const attributes=validPoints(options.attributes)?{...options.attributes}:Object.fromEntries(AXES.map(a=>[a.key,0]));
  if(!validPoints(options.attributes))for(let i=0;i<10;i++)attributes[AXES[Math.floor(rand(s.seed,i,'intake-point')*AXES.length)].key]++;
  const cash=t.cash;
  // Where you are born follows your class; place and household text agree with it.
  const classRegions=CLASS_REGIONS[cls]??['nakhon-sawan'];
  const regionId=options.region&&classRegions.includes(options.region)?options.region:classRegions[Math.floor(rand(s.seed,0,'intake-region')*classRegions.length)];
  const {place,home}=REGIONS[regionId];
  // Some city children grow up with grandparents in the provinces while parents work.
  const away=CITY_BIRTHS.includes(regionId)&&rand(s.seed,0,'grandparents')<(regionId==='sukhumvit'?.12:.3);
  const childhood=away?{region:rand(s.seed,0,'grandparents-place')<.6?'isan-village':'pak-phanang',from:3,to:9}:undefined;
  return {...s,attributes,effort:{...attributes},cash,intake:{sex,class:cls,country:'th',attributes:{...attributes}},birth:{...s.birth,place,home,region:regionId,...(childhood?{childhood}:{}),sex,class:cls,cash}};
}
