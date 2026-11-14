import {goldStep} from './gold.js';
import {birthYearOf} from './thai-history.js';
import {validJourney} from './journey.js';
import {periodLifeEvents,lifeEventFlags,validLifeEvents} from './life-events.js';
import {validChildhood} from './childhood-choices.js';
import {bucketDue,bucketFlags,validBucket} from './bucket-list.js';
import {REGIONS,HOUSEHOLDS,COUNTRIES,BAND_REGIONS,CLASS_REGIONS,LEGACY_CLASS_REGIONS,validMoves,householdFor,household} from './regions.js';
import {ikigai} from './ikigai.js';
import {consequencesDue} from './lessons.js';
import {marketsDue} from './market-moments.js';
import {PRIORITIES,priorityFx,prioritiesFor} from './priorities.js';
import {routeOf} from './life-routes.js';
import {fortuneShape,fortuneTurn,MAJORS,majorOf,majorFit,mismatched,partnerNature,together,reconciled,ventureSwing,dogAt} from './life-choices.js';
const CITY_BIRTHS=['khlong-toei','bang-na','sukhumvit','pathum-wan','yaowarat'];
import {createEconomy,economyFor,validEconomy} from './economy.js';
import {validHoldings,autoInvest} from './investments.js';
import {FOCUSES} from './motivations.js';
import {advanceFinance,validFinance,validFinanceLocation,grossMonthlyPay} from './finance.js';
import {newStory,offerEncounter,validStory,encounterById} from './encounters.js';
import {momentFor} from './moments.js';
import {PATHWAYS,pathwayPeriod} from './pathways.js';
export const AXES=[{key:'physique',label:'Physique'},{key:'iq',label:'IQ · reasoning'},{key:'eq',label:'EQ · connection'},{key:'craft',label:'Creativity'},{key:'drive',label:'Drive'}];
import {CLASS_TIERS,CLASS_KEYS,drawClass} from './backgrounds.js';
export {CLASS_TIERS,CLASS_KEYS} from './backgrounds.js';
import {COHORT_YEARS,validCohortYear} from './thai-history.js';
export {COHORT_YEARS,validCohortYear} from './thai-history.js';
import {eraAnnualEvents} from './era-events.js';
const hasMarket=f=>Array.isArray(f?.receipts)&&f.receipts.some(r=>r?.kind==='market');
export const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
export {rand} from './rand.js';
import {rand} from './rand.js';
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
// A theft takes a real share of what was saved, 40 to 80 per cent, and never less than five months' pay.
export const theftLoss=(s,pay,age)=>{const saved=Math.max(0,(s.finance?.available??0)+(s.finance?.reserve??0));return Math.max(Math.round(pay*5),Math.round(saved*(.4+rand(s.seed,age,'theft')*.4)));};
export function newLegacyLife(seed=43127){const birth=rand(seed,0,'household');return {version:2,seed,economy:createEconomy(seed),story:newStory(seed),stage:'birth',age:0,attributes:balanced(),effort:balanced(),profile:defaultProfile(),birth:{place:birth<.5?'Nakhon Sawan':'Samut Prakan',home:birth<.5?'a farming household':'a market-stall household',region:birth<.5?'nakhon-sawan':'samut-prakan',household:householdFor(rand(seed,0,'household-kind')),cash:birth<.5?18000:42000,sensitivity:rand(seed,0,'sensitivity')>.5?'Sensitive to pressure':'Steady under pressure',body:rand(seed,0,'body')>.5?'Strong physical starting condition':'Ordinary physical starting condition'},cash:birth<.5?18000:42000,health:rand(seed,0,'body')>.5?94:88,wellbeing:rand(seed,0,'sensitivity')>.5?62:68,skills:{physique:0,iq:0,eq:0,craft:0,drive:0},history:[],profiles:[],original:null,death:null,previous:null};}
export function newLife(seed=43127){const roll=rand(seed,0,'class');const cls=drawClass(roll);const t=CLASS_TIERS[cls];const choices=LEGACY_CLASS_REGIONS[cls];const regionId=choices[Math.floor(rand(seed,0,'intake-region')*choices.length)];const place=REGIONS[regionId].place,home=REGIONS[regionId].home;return {version:2,seed,economy:createEconomy(seed),story:newStory(seed),stage:'birth',age:0,attributes:balanced(),effort:balanced(),profile:defaultProfile(),birth:{place,home,region:regionId,household:householdFor(rand(seed,0,'household-kind')),cash:t.cash,sensitivity:rand(seed,0,'sensitivity')>.5?'Sensitive to pressure':'Steady under pressure',body:rand(seed,0,'body')>.5?'Strong physical starting condition':'Ordinary physical starting condition',class:cls},cash:t.cash,health:rand(seed,0,'body')>.5?94:88,wellbeing:rand(seed,0,'sensitivity')>.5?62:68,skills:{physique:0,iq:0,eq:0,craft:0,drive:0},history:[],profiles:[],original:null,death:null,previous:null};}
export function begin(s){if(s.stage!=='birth'||!validPoints(s.attributes))return s;const due=bucketDue(s,10),origin=s.childhood?.origin??s,health=clamp(s.health+due.health,0,100),wellbeing=clamp(s.wellbeing+due.wellbeing,0,100),skills={...s.skills};for(const[k,v]of Object.entries(due.skills))skills[k]+=v;const start={age:0,health:origin.health,wellbeing:origin.wellbeing,cash:origin.cash,event:'Born into '+s.birth.home,effort:{...s.attributes},profile:defaultProfile()};return offerEncounter({...s,health,wellbeing,skills,...(due.bucket?{bucket:due.bucket}:{}),age:10,stage:'review',original:{...s.attributes},effort:{...s.attributes},history:[start,{...start,age:10,health,wellbeing,cash:s.cash,event:'Childhood: family, school and the world you inherited.'+(s.childhood?.choices.length?' '+s.childhood.choices.map(r=>r.note).join(' '):''),...(due.events.length?{events:due.events}:{})}]},rand(s.seed,10,'encounter'));}
export const goals={balance:'A life with room to breathe',sport:'Become an athlete',art:'Make a life through art',security:'Build financial security',connection:'Love and belong'};
export function sanitiseProfile(p,age){const q={...defaultProfile()};for(const [key,allowed]of Object.entries({drink:['no','social'],smoke:['no','yes'],religion:['explore','practice','none'],intimacy:['unsure','together','separate'],aim:Object.keys(goals)}))if(allowed.includes(p?.[key]))q[key]=p[key];if(p?.focus!==undefined)q.focus=Object.hasOwn(FOCUSES,p.focus)?p.focus:'none';if(Object.hasOwn(PRIORITIES,p?.priority))q.priority=p.priority;if(age<20){q.drink='no';q.smoke='no';q.intimacy='unsure';}return q;}
function stepSkills(s){
 const from=s.age,age=from+5,e=lockedEffort(s),content=ikigai(s)?.score??50,growth=content<35?.75:1;
 const due=consequencesDue(s,from,age),bucket=bucketDue(s,age),pathway=pathwayPeriod(s,rand(s.seed,age,'independent-work'));
 const eraWeights=Object.fromEntries(AXES.map(a=>[a.key,eraWeight(a.key,from)]));
 const practice=Object.fromEntries(AXES.map(a=>[a.key,(bucket.skills[a.key]??0)+due.reduce((n,c)=>n+(c.skills[a.key]??0),0)+Math.round(e[a.key]*growth*eraWeights[a.key])+(a.key==='iq'?pathway.learning:0)]));
 return {e,content,growth,due,pathway,eraWeights,practice};
}
function advancePeriod(s){s={...s,economy:economyFor(s),effort:lockedEffort(s)};const from=s.age,age=from+5,p=sanitiseProfile(s.profile,from),{e,content,growth,due,pathway,eraWeights,practice}=stepSkills(s);const adult=from>=20,retired=from>=60;const shock=rand(s.seed,age,'event'),rare=rand(s.seed,age,'rare'),pay=adult?Math.max(6000,grossMonthlyPay({...s,age:from})):0;const lead=Object.entries(e).sort((a,b)=>b[1]-a[1]),spread=lead[0][1]-lead.at(-1)[1],ORDINARY={physique:'You kept your body in use.',iq:'You kept learning, and it showed in your work.',eq:'Friends and family took most of your attention.',craft:'You kept making things.',drive:'You pushed hard at work.'};let event=age===60?'Work slows. Your time becomes your own again.':spread>=2?momentFor(s,age)+' '+ORDINARY[lead[0][0]]:momentFor(s,age)+' Small habits accumulate.';let setback=0,healthShock=0;
// Not every world has the same plot: the flood and the parents' deaths happen in most lives, not all, decided once per world.
// What a family leaves depends on what it had.
const plot=(key,chance)=>rand(s.seed,0,'plot-'+key)<chance,estate=()=>{const cls=s.intake?.class??s.birth?.class,band=s.intake?.upbringing??'middle',sum=cls?CLASS_TIERS[cls]?.inheritance:({constrained:30000,middle:200000,comfortable:1200000}[band]);setback-=sum;return sum===0?' There is nothing to inherit.':sum>=800000?' A substantial inheritance reaches you.':sum>=200000?' A modest inheritance reaches you.':' There is little to inherit.';},flood=age===30&&plot('flood',.7);
if(flood){setback=0;event='Floodwater damages the family home. Repairs take money and time.';}else if(age===55&&plot('father',.7)){event='Your '+household(s.birth).father.role+' dies. The family has to find a different rhythm.'+estate();}else if(age===70&&plot('mother',.55)){event='Your '+household(s.birth).mother.role+' dies. Familiar places carry different memories.'+estate();}else if(adult&&rare<.02){setback=Math.round(pay*6);healthShock+=8;event='An accident leaves you out of work for months. Recovery costs money and time.';}else if(adult&&rare<.04){setback=theftLoss(s,pay,age);event='Someone you trusted takes your savings and disappears.';}else if(adult&&rare>.975){setback=-Math.round(pay*8);event='An unexpected windfall arrives, from a sale, a prize or a relative you barely knew.';}else if(adult&&shock<.15){setback=Math.max(12000,Math.round(pay*2));event='A work interruption reduces your personal funds.';}else if(adult&&shock>.84){setback=-Math.max(9000,Math.round(pay*1.5));event='An unexpected commission or extra work brings a little breathing room.';}
// Background pressures use recorded encounters, never untracked story flags.
if(age>=40&&rand(s.seed,age,'illness')<.12){healthShock+=12;event+=' A health setback interrupts your plans.';}
const moments=periodLifeEvents(s,from,age,flagsOf(s),(year,key)=>rand(s.seed,year,key));setback-=moments.cash;healthShock-=moments.health;if(moments.records.length)event+=' '+moments.records.map(r=>r.text).join(' ');
{const turn=fortuneTurn(s,from);if(turn)event+=' '+turn;}
const era=eraAnnualEvents(s,from,age,(year,key)=>rand(s.seed,year,'era'));setback-=era.cash;healthShock-=era.health;if(era.records.length)event+=' '+era.records.map(r=>r.text).join(' ');
const earnings=grossMonthlyPay(s);
// Three pillars: body, mind and contentment. Contentment (Ikigai) acts on the other two:
// low contentment wears the body and slows the mind; purpose slows decline. Authored tuning.
const bucket=bucketDue(s,age);let bodyAdj=(content<35?-(35-content)*.12:content>70?(content-70)*.06:0)+bucket.health,moodAdj=(content-50)*.04+bucket.wellbeing+moments.wellbeing+era.wellbeing;
// The big forks keep acting after they are chosen.
const field=majorOf(s),fieldFit=field?majorFit(s,field):1;
const nature=together(s)?partnerNature(s):null,apart=flagsOf(s).apart!==undefined;
if(nature==='kind'){moodAdj+=apart?1:2;bodyAdj+=.5;}
if(nature==='difficult'&&!reconciled(s)){moodAdj-=apart?2:4;setback+=apart?2000:4000;}
const flags=flagsOf(s);if(flags.parent!==undefined&&flags.childLost===undefined&&from<flags.parent+20){setback+=6000;moodAdj+=1;}
if(dogAt(s,from)){setback+=2000;moodAdj+=1;}
if(adult&&mismatched(s)&&from<60)moodAdj-=2;
setback-=ventureSwing(s,age);
// The road taken at twenty keeps paying, and keeps costing.
if(s.pivotFlags?.oilPress!==undefined){setback-=from<40?200000:from<65?2000000:800000;moodAdj-=1;}
if(s.pivotFlags?.keptShop!==undefined&&from<60){setback-=40000;moodAdj+=1;}
{const fx=prioritiesFor(from).includes(s.profile?.priority)?priorityFx(s.profile.priority):null;if(fx&&adult&&!retired&&fx.pay)setback-=Math.round(fx.pay*earnings*60);if(fx?.mood)moodAdj+=fx.mood;if(fx?.body)bodyAdj+=fx.body;}
if(s.pivotFlags?.emigrated!==undefined&&from>=30){setback-=from<65?1000000:200000;moodAdj-=1;}
// Past choices return: on the timeline, in this period's costs, in body and mind.
for(const m of marketsDue(s.pivotFlags,from)){setback-=m.gain;event+=' '+m.text;}
for(const c of due){setback-=c.cash;bodyAdj+=c.health;moodAdj+=c.wellbeing;event+=' '+c.text;}
const spending=adult?(retired?11000:14000):0;const habits=adult?((p.smoke==='yes'?4000:0)+(p.drink==='social'?2500:0)):0;
if(pathway.route==='college'&&field){pathway.cash-=MAJORS[field].cost;pathway.description+=fieldFit<.35?' The field did not fit you yet; study was a struggle.':fieldFit>.7?' The work came naturally.':'';if(fieldFit<.35)moodAdj-=4;}event+=(pathway.description?' '+pathway.description:'');const cash=from>=15?s.cash-(flood?18000:0):Math.round(s.cash+Math.round(earnings*pathway.incomeFactor)-spending-habits-setback+pathway.cash);const aging=from<30?1:from<50?4:from<65?7:8;const health=clamp(s.health-aging+(from>=60?e.physique*.35:0)+e.physique*.5*eraWeight('physique',from)+s.attributes.physique*.15-(adult&&p.smoke==='yes'?6:0)-(adult&&p.drink==='social'?1.5:0)-healthShock+bodyAdj);
const match={balance:Math.min(...Object.values(e))*.7,sport:e.physique*.6,art:e.craft*.6,security:e.drive*.4+e.iq*.2,connection:e.eq*.6}[p.aim];const social=adult&&p.drink==='social'?(e.eq>0?1:-1):0;const wellbeing=clamp(s.wellbeing+match+e.eq*.35+s.attributes.eq*.1+social-1.5-(cash<0?(s.birth.sensitivity==='Sensitive to pressure'?6:4):0)-(healthShock?4:0)+moodAdj+(from>=60?(health-45)*.07-(s.wellbeing>80?3:0):0));
const hazard=(age<25?.003:age<45?.009:age<60?.025:age<75?.07:.15)*(1.25-content/200)*(adult&&p.smoke==='yes'?1.3:1);
// The death a life gets follows the life it led: habits, work and age, not one line for everyone.
const shape=fortuneShape(s),deathCause=age>=75&&health>=50?'You died in your sleep, at home.':adult&&p.smoke==='yes'&&age>=45?'Smoking caught up with your lungs.':adult&&p.drink==='social'&&age>=40&&health<50?'Years of drinking wore out your liver.':shape==='labour'&&!['novice','taxi','win_motorsai'].includes(routeOf(s))&&age>=20&&age<60&&rand(s.seed,age,'work-accident')<.5?'An accident at work ended this life.':(age<40||['taxi','win_motorsai'].includes(routeOf(s))&&age<60)&&rand(s.seed,age,'road')<.6?'A road accident ended this life.':age>=50&&health<50?['A heart attack ended this life.','A stroke ended this life.','Cancer ended this life.','Diabetes wore out your kidneys.','A serious health event ended this life.'][Math.floor(rand(s.seed,age,'old-cause')*5)]:health<30?'A serious health event ended this life.':'An unexpected illness or accident ended this life.';
const deathRoll=rand(s.seed,age,'mortality'+Math.floor(health/10));
const deathOdds=hazard+Math.max(0,60-health)*.004;// Zero is the end, but you get a warning first: two bad stretches running, not one.
// Durkheim's finding, as a rule: people with someone to answer to, or somewhere to belong, get through it.
const ties={...s.pivotFlags,...s.story?.flags},anchored=(ties.married!==undefined||ties.committed!==undefined||ties.parent!==undefined||ties.friend!==undefined||p.religion==='practice')&&ties.separated===undefined;
const lastRow=s.history?.at(-1),broke=s.finance&&age>=20&&s.finance.debt>=250000&&s.finance.available+s.finance.reserve<=0&&(lastRow?.finance?.debt??0)>0&&(lastRow?.finance?.available??1)+(lastRow?.finance?.reserve??0)<=0;const zero=s.intake?.class&&age>=15?(health<=0?'Your body reached zero.':wellbeing<=0&&(lastRow?.wellbeing??100)<=2&&!anchored?'Your mind reached zero.':broke?'Your money reached zero, and then went below it.':null):null;const death=zero?{age,cause:zero,zero:true}:deathRoll<deathOdds?{age,cause:deathCause,odds:Math.min(1,deathOdds),chance:Math.min(1,hazard),smoker:adult&&p.smoke==='yes'}:null;
const skills=Object.fromEntries(AXES.map(a=>[a.key,s.skills[a.key]+practice[a.key]]));const row={age,from,health,wellbeing,cash,event,effort:{...e},eraWeights,...(s.pivots??[]).filter(record=>record.station===from).length?{pivots:(s.pivots??[]).filter(record=>record.station===from)}:{},...(s.pendingAlternatives??[]).length?{alternatives:s.pendingAlternatives}:{},...(growth<1?{growth}:{}),...(due.length?{consequences:due.map(({lesson,choice,age,text,cash,health,wellbeing})=>({lesson,choice,age,text,cash,health,wellbeing})),events:due.map(c=>({type:'consequence',lesson:c.lesson})),consequenceSkills:Object.fromEntries(AXES.map(a=>[a.key,due.reduce((n,c)=>n+(c.skills[a.key]??0),0)]))}:{}),profile:{...p},earnings:Math.round(earnings*pathway.incomeFactor),spending:spending+habits,habits,setback,pathway:pathway.route,pathwayCash:pathway.cash,pathwayLearning:pathway.learning};if(bucket.events.length||moments.records.length||era.records.length)row.events=[...(row.events??[]),...bucket.events,...moments.records,...era.records];if(moments.incomeMonths)row.unemployedMonths=moments.incomeMonths;const next={...s,story:{...s.story,eraFired:era.fired},...(s.journey?{journey:undefined}:{}),...(bucket.bucket?{bucket:bucket.bucket}:{}),age,cash,health,wellbeing,skills,profile:p,pivots:(s.pivots??[]).filter(record=>record.station<from),pendingAlternatives:undefined,profiles:[...s.profiles,{age:from,effort:{...e},profile:{...p}}],history:[...s.history,row],death,stage:death||age===80?'recap':'review'};return advanceFinance(s,next);}
export function projectedSkillGains(s){
 const {growth,eraWeights,pathway,due,practice}=stepSkills(s);
 if(s.stage!=='review'||!validPoints(s.effort)||s.age>=80||s.finance?.receipts.length>993)return {gains:practice,practice,financeLearning:0,growth,eraWeights,pathway,due};
 const next=advancePeriod({...s,story:{...s.story,pending:null},pendingAlternatives:undefined});
 const financeLearning=next.history.at(-1)?.financeSkills?.iq??0;
 const gains=Object.fromEntries(AXES.map(a=>[a.key,next.skills[a.key]-s.skills[a.key]]));
 return {gains,practice,financeLearning,growth,eraWeights,pathway,due};
}
// A question put to a ten-year-old never holds up the years: left unanswered, it passes.
const passChildQuestion=s=>s?.story?.pending&&encounterById(s.story.pending.id)?.child?{...s,story:{...s.story,pending:null}}:s;
export function live(s0){const s=passChildQuestion(s0);if(s.stage!=='review'||!validPoints(s.effort)||s.age>=80||s.story?.pending||s.finance?.receipts.length>993)return s;const next=advancePeriod(s);return offerEncounter(goldStep(autoInvest(next),(birthYearOf(next)??1981)+next.age),rand(s.seed,next.age,'encounter'));}
export function replay(s){return {...(s.dailyDay?{dailyDay:s.dailyDay}:{}),...(s.intake?configureLife(s.intake.class?newLife(s.seed):newLegacyLife(s.seed),{...s.intake,region:s.birth.region,moves:s.birth.moves??null}):s.birth.class?newLife(s.seed):newLegacyLife(s.seed)),economy:createEconomy(s.economy?.seed??s.seed),...(s.lifeEventPolicy?{lifeEventPolicy:{version:1,startAge:0}}:{}),...(s.bucket?.custom.length?{bucket:{custom:structuredClone(s.bucket.custom),planned:[],done:[]}}:{}),previous:{economy:s.economy,age:s.age,cash:s.cash,health:s.health,wellbeing:s.wellbeing,history:s.history,death:s.death,story:s.story,finance:s.finance}};}
export function validate(s){
 const profile=p=>p&&Object.entries(sanitiseProfile(p,80)).every(([k,v])=>p[k]===v);
 const row=r=>r&&(r.unemployedMonths===undefined||Number.isInteger(r.unemployedMonths)&&r.unemployedMonths>=0&&r.unemployedMonths<=12)&&(r.economy===undefined||r.economy&&Number.isInteger(r.economy.from)&&r.economy.from>=0&&r.economy.to===r.age&&r.economy.from<r.age&&Number.isSafeInteger(r.economy.incomeAdjustment)&&Number.isSafeInteger(r.economy.marketChange)&&Array.isArray(r.economy.contractions)&&r.economy.contractions.every(a=>Number.isInteger(a)&&a>r.economy.from&&a<=r.age))&&(r.finance===undefined||r.finance&&validHoldings(r.finance.holdings)&&validFinanceLocation(r.finance,r.age)&&['available','reserve','debt'].every(k=>Number.isSafeInteger(r.finance[k])&&r.finance[k]>=0))&&(r.financeSkills===undefined||r.financeSkills&&Object.entries(r.financeSkills).every(([key,value])=>AXES.some(a=>a.key===key)&&Number.isInteger(value)&&value>=0))&&(r.storySkills===undefined||r.storySkills&&Object.entries(r.storySkills).every(([key,value])=>AXES.some(a=>a.key===key)&&Number.isFinite(value)))&&(r.pathway===undefined||Object.hasOwn(PATHWAYS,r.pathway))&&(r.pathwayLearning===undefined||Number.isFinite(r.pathwayLearning))&&Number.isInteger(r.age)&&r.age>=0&&r.age<=80&&['cash','health','wellbeing'].every(k=>Number.isFinite(r[k]))&&validPoints(r.effort)&&profile(r.profile)&&typeof r.event==='string'
 &&(r.pivots===undefined||Array.isArray(r.pivots)&&r.pivots.every(p=>p&&Number.isInteger(p.station)&&typeof p.pivot==='string'&&typeof p.choice==='string'&&typeof p.note==='string'))
 &&(r.alternatives===undefined||Array.isArray(r.alternatives)&&r.alternatives.every(a=>a&&typeof a.label==='string'&&Number.isFinite(a.cash)&&Number.isFinite(a.health)&&Number.isFinite(a.wellbeing)));
 const death=d=>d===null||d&&Number.isInteger(d.age)&&typeof d.cause==='string';
 return s?.version===2&&validJourney(s)&&validLifeEvents(s)&&validChildhood(s)&&validBucket(s)&&validEconomy(s.economy,s.age)&&(s.economy!==undefined||!hasMarket(s.finance))&&(s.economy===undefined||s.economy.seed===s.seed)&&(s.pathway===undefined||Object.hasOwn(PATHWAYS,s.pathway))&&(s.major===undefined||Object.hasOwn(MAJORS,s.major))&&(s.progressAge===undefined||Number.isFinite(s.progressAge)&&s.progressAge>=0&&s.progressAge<=80)&&Number.isInteger(s.seed)&&['birth','review','recap'].includes(s.stage)&&Number.isInteger(s.age)&&s.age>=0&&s.age<=80&&validPoints(s.attributes)&&validPoints(s.effort)&&profile(s.profile)&&['cash','health','wellbeing'].every(k=>Number.isFinite(s[k]))&&Array.isArray(s.history)&&s.history.length<=16&&s.history.every(row)&&
  (s.pivots===undefined||Array.isArray(s.pivots)&&s.pivots.every(p=>p&&Number.isInteger(p.station)&&typeof p.pivot==='string'&&typeof p.choice==='string'&&typeof p.note==='string'))
  &&(s.pivotFlags===undefined||s.pivotFlags&&typeof s.pivotFlags==='object'&&Object.values(s.pivotFlags).every(v=>typeof v==='boolean'||Number.isFinite(v)))&&Array.isArray(s.profiles)&&s.profiles.every(p=>p&&Number.isInteger(p.age)&&validPoints(p.effort)&&profile(p.profile))&&(s.intake===undefined||s.intake&&['female','male','intersex'].includes(s.intake.sex)&&(CLASS_KEYS.includes(s.intake.class)||s.intake.class===undefined&&['constrained','middle','comfortable'].includes(s.intake.upbringing)&&(s.intake.country===undefined||Object.hasOwn(COUNTRIES,s.intake.country)))&&validCohortYear(s.intake.birthYear)&&validPoints(s.intake.attributes))&&s.birth&&['place','home','sensitivity','body'].every(k=>typeof s.birth[k]==='string')&&(s.birth.class===undefined||CLASS_KEYS.includes(s.birth.class))&&(s.intake?.class===undefined||s.intake.class===s.birth.class)&&validCohortYear(s.birth.birthYear)&&validMoves(s.birth.moves)&&(!s.birth.moves||!s.birth.childhood&&s.birth.moves.every(m=>m.region!==s.birth.region))&&(s.intake?.birthYear===undefined||s.intake.birthYear===s.birth.birthYear)&&(s.birth.region===undefined||Object.hasOwn(REGIONS,s.birth.region))&&(s.birth.household===undefined||Object.hasOwn(HOUSEHOLDS,s.birth.household))&&(s.birth.childhood===undefined||s.birth.childhood&&Object.hasOwn(REGIONS,s.birth.childhood.region)&&Number.isInteger(s.birth.childhood.from)&&Number.isInteger(s.birth.childhood.to)&&s.birth.childhood.from>=0&&s.birth.childhood.from<s.birth.childhood.to&&s.birth.childhood.to<=18)&&AXES.every(a=>Number.isFinite(s.skills?.[a.key]))&&(s.original===null||validPoints(s.original))&&death(s.death)&&(s.previous===null||s.previous&&validEconomy(s.previous.economy,s.previous.age)&&(s.previous.economy!==undefined||!hasMarket(s.previous.finance))&&Number.isInteger(s.previous.age)&&['cash','health','wellbeing'].every(k=>Number.isFinite(s.previous[k]))&&Array.isArray(s.previous.history)&&s.previous.history.every(row)&&death(s.previous.death)&&validFinance(s.previous.finance,s.previous.age,s.previous.economy))&&validFinance(s.finance,s.age,s.economy)&&validStory(s.story,s.age,s);
}

// Intake presets are authored game starting conditions, not demographic estimates.
// New births use six Thai backgrounds. Legacy births keep their original identity.
// Birth is not a three-way lottery: about one in a hundred.
const drawSex=r=>r<.495?'female':r<.99?'male':'intersex';
export function configureLife(s,options={}){
 if(options.legacy||options.upbringing!==undefined||options.country&&options.country!=='th')return configureLegacyLife(newLegacyLife(s.seed),options);
  const sexes=['female','male','intersex'],classes=CLASS_KEYS;
  const sex=sexes.includes(options.sex)?options.sex:drawSex(rand(s.seed,0,'intake-sex'));
  const cls=classes.includes(options.class)?options.class:drawClass(rand(s.seed,0,'intake-class'),classes);
  const rawYear=options.birthYear!==undefined&&options.birthYear!==''&&options.birthYear!=='random'?Number(options.birthYear):undefined;
  const birthYear=COHORT_YEARS.includes(rawYear)?rawYear:undefined;
  const t=CLASS_TIERS[cls];
  const attributes=validPoints(options.attributes)?{...options.attributes}:Object.fromEntries(AXES.map(a=>[a.key,0]));
  if(!validPoints(options.attributes))for(let i=0;i<10;i++)attributes[AXES[Math.floor(rand(s.seed,i,'intake-point')*AXES.length)].key]++;
  const cash=t.cash;
  // Where you are born follows your class; place and household text agree with it.
  const regionId=options.region&&(CLASS_REGIONS[cls]??[]).includes(options.region)?options.region:defaultRegion(s.seed,cls);
  const {place,home}=REGIONS[regionId];
  // Some city children grow up with grandparents in the provinces while parents work.
  const away=CITY_BIRTHS.includes(regionId)&&rand(s.seed,0,'grandparents')<(regionId==='sukhumvit'?.12:.3);
  const childhood=away?{region:rand(s.seed,0,'grandparents-place')<.6?'isan-village':'pak-phanang',from:3,to:9}:undefined;
  // A rebuild (replay, the unchosen life) passes the saved record, so a life saved before moves never gains one.
  const moves=childhood?undefined:Object.hasOwn(options,'moves')?options.moves??undefined:familyMoves(s.seed,cls,regionId);
  return {...s,attributes,effort:{...attributes},cash,intake:{sex,class:cls,country:'th',...(birthYear?{birthYear}:{}),attributes:{...attributes}},birth:{...s.birth,place,home,region:regionId,...(childhood?{childhood}:{}),...(moves?{moves}:{}),...(birthYear?{birthYear}:{}),sex,class:cls,cash}};
}

// A family moves when work moves it: a civil servant is posted to another province, a city
// family moves out to the suburbs, a farming family goes where the work is. Odds are authored game
// tuning, not migration statistics. Moves happen before ten, so a childhood carries them.
const SUBURBS=['bang-na','samut-prakan'],POSTINGS=['udon-thani','hua-hin','pak-phanang','samut-prakan','bang-na'],CITY_WORK=['khlong-toei','samut-prakan'];
export function familyMoves(seed,cls,regionId){
 const r=k=>rand(seed,0,'move-'+k),city=['pathum-wan','khlong-toei','sukhumvit'].includes(regionId),farm=['isan-village','nakhon-sawan'].includes(regionId);
 const [why,p,list]=cls==='bureaucratic_class'?['transfer',.5,POSTINGS]:city&&(cls==='middle_class'||cls==='working_class')?['suburb',regionId==='pathum-wan'?.45:.3,SUBURBS]:farm&&(cls==='low_class'||cls==='working_class')?['work',.2,CITY_WORK]:[null,0,[]];
 if(!why||r('roll')>=p)return undefined;
 const from=(l,k,not)=>{const c=l.filter(x=>!not.includes(x));return c[Math.floor(r(k)*c.length)];};
 const moves=[{region:from(list,'where1',[regionId]),age:2+Math.floor(r('age1')*5),why}];
 // A posting rarely lasts: about half of civil-service families move again.
 if(why==='transfer'&&r('again')<.5)moves.push({region:from(POSTINGS,'where2',[regionId,moves[0].region]),age:moves[0].age+2+Math.floor(r('age2')*2),why});
 return moves;
}

// The place a seed and class resolve to when nothing names one: what every existing birth code means.
export function defaultRegion(seed,cls){const list=LEGACY_CLASS_REGIONS[cls]??['nakhon-sawan'];return list[Math.floor(rand(seed,0,'intake-region')*list.length)];}

// Exact historical intake algorithm: old saved/share identities remain stable.
function configureLegacyLife(s,options={}){
 const sexes=['female','male','intersex'],bands=['constrained','middle','comfortable'];
 const sex=sexes.includes(options.sex)?options.sex:drawSex(rand(s.seed,0,'intake-sex'));
 const upbringing=bands.includes(options.upbringing)?options.upbringing:bands[Math.floor(rand(s.seed,0,'intake-band')*bands.length)];
 const attributes=validPoints(options.attributes)?{...options.attributes}:Object.fromEntries(AXES.map(a=>[a.key,0]));
 if(!validPoints(options.attributes))for(let i=0;i<10;i++)attributes[AXES[Math.floor(rand(s.seed,i,'intake-point')*AXES.length)].key]++;
 const cash={constrained:8000,middle:30000,comfortable:90000}[upbringing];
 // Where you are born follows the upbringing band; place and household text agree with it.
 const country=Object.hasOwn(COUNTRIES,options.country)?options.country:options.region?'th':rand(s.seed,0,'country')<.75?'th':['jp','sg','gb','us'][Math.floor(rand(s.seed,0,'country-pick')*4)];
 const choices=BAND_REGIONS[upbringing],regionId=COUNTRIES[country]??(choices.includes(options.region)?options.region:choices[Math.floor(rand(s.seed,0,'region')*choices.length)]),{place,home}=REGIONS[regionId];
 // Some city children grow up with grandparents in the provinces while parents work.
 const away=CITY_BIRTHS.includes(regionId)&&rand(s.seed,0,'grandparents')<(regionId==='sukhumvit'?.12:.3);
 const childhood=away?{region:rand(s.seed,0,'grandparents-place')<.6?'isan-village':'pak-phanang',from:3,to:9}:undefined;
 return {...s,attributes,effort:{...attributes},cash,intake:{sex,upbringing,country,attributes:{...attributes}},birth:{...s.birth,place,home,region:regionId,...(childhood?{childhood}:{}),sex,upbringing,cash}};
}
