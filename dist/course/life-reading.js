// What a finished life says, read only from its own record and the game's own model.
// It states odds, counts and what was recorded. It never says one choice caused an outcome.
import {newLife,newLegacyLife,configureLife,begin,live,balanced,defaultProfile,rand,replay,validate} from './sim.js';
import {measuresOf} from './moral-ledger.js';
import {marketRecord} from './market-moments.js';
import {encodeBirth} from './birthcode.js';
import {createEconomy} from './economy.js';
import {newStory,encounterById,resolveEncounter} from './encounters.js';
import {pivotById,pendingPivots,openOptions,applyPivot} from './pivots.js';
import {netWorth,choiceAvailable} from './finance.js';
import {t} from './i18n.js';
import {CLASS_TIERS,CLASS_KEYS} from './backgrounds.js';

const FELLOWS=100,PER_CLASS=30;
const worth=r=>r.finance?netWorth(r.finance):r.cash;
const median=v=>[...v].sort((a,b)=>a-b)[Math.floor(v.length/2)];
// Another life: default effort at every station, every decision taken at random.
// ponytail: uniform random choices, not a model of how people decide; say so on screen.
function drift(start,upTo=80){
 let s=begin(start),guard=0;const pick=(list,tag)=>list[Math.floor(rand(s.seed,s.age,tag)*list.length)];
 while(s.stage==='review'&&s.age<upTo&&guard++<20){
  const n=live({...s,effort:balanced(),profile:defaultProfile()});if(n===s)break;s=n;if(s.stage!=='review')break;
  for(const p of pendingPivots(s)){const o=pick(openOptions(p,s),'fellow-'+p.id);if(o)s=applyPivot(s,p,o.id);}
  const scene=s.story?.pending&&encounterById(s.story.pending.id),open=scene?.options.filter(o=>choiceAvailable(s,o));
  if(open?.length)s=resolveEncounter(s,pick(open,'fellow-scene').id,rand(s.seed,s.age,'fellow-roll'));
 }
 return s;
}
const policy=state=>state.lifeEventPolicy?{lifeEventPolicy:{...state.lifeEventPolicy}}:{};
export const sameBirth=(state,k)=>{
 const base=state.intake?configureLife(newLife(state.seed),state.intake):state.birth.class?newLife(state.seed):newLegacyLife(state.seed),seed=Math.floor(rand(state.seed,k,'fellow')*2**31);
 return {...base,...policy(state),seed,story:newStory(seed),economy:createEconomy(seed)};
};
// ponytail: 160 short simulations, under 100 ms; memoised because render can run twice.
let memo={};
function others(state){
 const key=state.seed+':'+state.age+':'+Math.round(state.wellbeing);if(memo.key===key)return memo.value;
 const lives=Array.from({length:FELLOWS},(_,k)=>drift(sameBirth(state,k+1))),mine=state.history.at(-1);
 const alive=lives.filter(l=>!l.death||l.death.age>state.age).map(l=>l.history.find(r=>r.age===state.age)).filter(Boolean),reachedSame=alive.length;
 const share=f=>alive.length?Math.round(alive.filter(f).length/alive.length*100):0;
 const cls=state.birth.class;let classGap=null;
 if(CLASS_KEYS.includes(cls)){
  const other=['high_class'].includes(cls)?'low_class':'high_class',at=Math.min(state.age,60);
  const typical=c=>{const v=Array.from({length:PER_CLASS},(_,k)=>drift({...configureLife(newLife(state.seed+k*97+1),{...(state.intake??{}),class:c}),...policy(state)},at).history.find(r=>r.age===at)).filter(Boolean).map(worth);return v.length?median(v):null;};
  const a=typical(cls),b=typical(other);if(a!==null&&b!==null)classGap={at,cls,other,mine:a,theirs:b};
 }
 const measure=f=>{const v=f(state);return lives.filter(l=>f(l)<v).length;},last=l=>{const r=l.history.at(-1);return r?worth(r):0;};
 const value={rank:{money:measure(last),care:measure(l=>measuresOf(l).care),duty:measure(l=>measuresOf(l).duty)},reachedSame,alive:alive.length,richer:share(r=>worth(r)>worth(mine)),happier:share(r=>r.wellbeing>mine.wellbeing),classGap};
 memo={key,value};return value;
}
const num=o=>({cash:o.cash??0,health:o.health??0,wellbeing:o.wellbeing??0});
// The roads were lived before this row's scene was answered, so compare them without it.
const sceneShift=(state,age,k)=>(state.story?.seen??[]).filter(e=>e.age===age).reduce((n,e)=>n+(e.effects[k]??0),0);
// Every decision in the life with the options that were open beside it.
export function decisionsOf(state){
 const out=[],before=(row,k)=>row[k]-sceneShift(state,row.age,k);
 for(const e of state.story?.seen??[]){const scene=encounterById(e.id),chosen=scene?.options.find(o=>o.id===e.choice);if(chosen)out.push({age:e.age,said:e.outcome,chosen:num(chosen),others:scene.options.filter(o=>o!==chosen).map(o=>({label:o.label,...num(o)})),size:Math.abs(e.effects.cash)/4000+Math.abs(e.effects.health)+Math.abs(e.effects.wellbeing)});}
 for(const row of state.history)for(const p of row.pivots??[]){const pivot=pivotById(p.pivot),chosen=pivot?.options.find(o=>o.id===p.choice);if(chosen){const fx=p.effects??{},road=(row.alternatives??[]).filter(a=>a.pivot===p.pivot)[0];out.push({age:p.station,said:p.note,chosen:num(chosen.effects??{}),others:pivot.options.filter(o=>o!==chosen).map(o=>({label:o.label,...num(o.effects??{})})),size:Math.abs(fx.cash??0)/4000+Math.abs(fx.health??0)+Math.abs(fx.wellbeing??0)+1,road:road?{label:road.label,health:Math.round(road.health-before(row,'health')),wellbeing:Math.round(road.wellbeing-before(row,'wellbeing'))}:null});}}
 return out.sort((a,b)=>a.age-b.age);
}
// Which of the three the choice protected, against the options beside it.
function guarded(ds){
 const count={money:0,peace:0,body:0},best=(d,k)=>d.others.length&&d.others.every(o=>d.chosen[k]>=o[k])&&d.others.some(o=>d.chosen[k]>o[k]);
 for(const d of ds){if(best(d,'cash'))count.money++;if(best(d,'wellbeing'))count.peace++;if(best(d,'health'))count.body++;}
 return count;
}
// The same birth and the same luck, every recorded answer kept, one answer changed.
export function relive(state,pivotId,optionId,stop=false){
 let s=begin({...replay(state),attributes:state.attributes,previous:null,childhood:state.childhood});
 const byFrom=new Map(state.history.map(r=>[r.from??r.age,r])),seen=new Map((state.story?.seen??[]).map(e=>[e.id,e.choice])),said=new Map(state.history.flatMap(r=>r.pivots??[]).map(p=>[p.pivot,p.choice]));
 for(let guard=0;s.stage==='review'&&guard<20;guard++){
  for(const p of pendingPivots(s)){const open=openOptions(p,s),want=p.id===pivotId?optionId:said.get(p.id);const o=open.find(x=>x.id===want)??open[0];if(o)s=applyPivot(s,p,o.id);if(stop&&p.id===pivotId)return s;}
  if(s.story?.pending){const scene=encounterById(s.story.pending.id),open=scene.options.filter(o=>choiceAvailable(s,o)),o=open.find(x=>x.id===seen.get(scene.id))??open[0];s=resolveEncounter(s,o.id,rand(s.seed,s.age,'encounter-result'));if(s.stage!=='review')break;}
  const row=byFrom.get(s.age),n=live({...s,effort:row?.effort??s.effort,profile:row?.profile??s.profile});if(n===s)break;s=n;
 }
 return stop?null:s;
}
const memoriesOf=(life,real,from=0)=>{const known=new Set([...(real.story?.seen??[]).map(e=>e.outcome),...real.history.flatMap(r=>r.pivots??[]).map(p=>p.note)]);
 const all=[...(life.story?.seen??[]).map(e=>({age:e.age,text:e.outcome,size:Math.abs(e.effects.cash)/4000+Math.abs(e.effects.health)+Math.abs(e.effects.wellbeing)})),...life.history.flatMap(r=>r.pivots??[]).map(p=>({age:p.station,text:p.note,size:Math.abs(p.effects?.cash??0)/4000+Math.abs(p.effects?.health??0)+Math.abs(p.effects?.wellbeing??0)}))];
 return all.filter(m=>m.age>=from&&m.text&&!known.has(m.text)).sort((a,b)=>b.size-a.size).slice(0,2).sort((a,b)=>a.age-b.age);};
// The fork worth reliving: the road at twenty when there was one, else the answer that moved most.
export function otherRoads(state){
 const records=state.history.flatMap(r=>r.pivots??[]);if(!records.length)return null;
 const size=p=>Math.abs(p.effects?.cash??0)/4000+Math.abs(p.effects?.health??0)+Math.abs(p.effects?.wellbeing??0);
 const fork=records.find(p=>p.pivot==='three-roads')??[...records].sort((a,b)=>size(b)-size(a))[0],pivot=pivotById(fork.pivot);if(!pivot)return null;
 const ECHO={marry:'The press became three factories. Your name was on none of them.',stay:'You knew everyone in the district, and you went to all their funerals.',go:'You sent money home every month, and went back for the funerals.'};
 const chosen=pivot.options.find(o=>o.id===fork.choice),roads=pivot.options.filter(o=>o!==chosen&&!o.requires).slice(0,2).map(o=>{const life=relive(state,pivot.id,o.id),last=life.history.at(-1);const m=measuresOf(life),b=relive(state,pivot.id,o.id,true);return {canLive:!!b&&b.stage==='review'&&validate(JSON.parse(JSON.stringify(b))),id:o.id,pivot:pivot.id,care:m.care,duty:m.duty,label:o.label,age:life.death?.age??life.age,died:life.death?.cause??null,money:worth(last),wellbeing:Math.round(last.wellbeing),health:Math.round(last.health),memories:[...(fork.pivot==='three-roads'&&(life.death?.age??life.age)>=50&&ECHO[o.id]?[{age:50,text:ECHO[o.id]}]:[]),...memoriesOf(life,state,fork.station)].slice(0,3).sort((a,b)=>a.age-b.age)};});
 return roads.length?{age:fork.station,chosen:chosen.label,roads}:null;
}
function people(state){
 const f={...state.pivotFlags,...state.story.flags},names=state.story.people,row=[];
 if(f.friend!==undefined)row.push([names.friend,f.friend,null]);
 const since=f.married??f.committed??f.apart;if(typeof since==='number')row.push([names.partner,since,f.separated??null]);
 if(f.parent!==undefined&&f.childLost===undefined)row.push(['A child',f.parent,null]);
 return row;
}
// The odds as the sim rolled them. `chance` has no health term; the smoker multiplier is 1.3 on it.
export function deathFacts(d){
 const n=p=>Math.max(1,Math.round(1/p)),odds=n(d.odds),clear=n(d.chance);
 return {odds,clear,worn:odds<clear,clean:d.smoker?n(d.chance/1.3+d.odds-d.chance):null};
}
export function lifeReading(state){
 const rows=state.history.filter(r=>r.age>=15).map(r=>({age:r.age,money:worth(r),health:r.health,wellbeing:r.wellbeing}));
 if(!rows.length)return null;
 const pairs=rows.slice(1).map((r,i)=>[rows[i],r]),rose=k=>pairs.filter(([a,b])=>b[k]>a[k]).length;
 const fall=[...pairs].sort((x,y)=>(y[0].wellbeing-y[1].wellbeing)-(x[0].wellbeing-x[1].wellbeing))[0];
 const ds=decisionsOf(state),big=[...ds].sort((a,b)=>b.size-a.size).slice(0,3).sort((a,b)=>a.age-b.age);
 return {rows,chapters:pairs.length,moneyRose:rose('money'),wellRose:rose('wellbeing'),first:rows[0],last:rows.at(-1),
  fall:fall&&fall[0].wellbeing-fall[1].wellbeing>=5?{from:fall[0].age,to:fall[1].age}:null,
  decisions:ds.length,guarded:guarded(ds),turning:big,people:people(state),others:others(state),roads:otherRoads(state)};
}
// The life a friend lived from this same birth, carried in the link they sent.
export function themCode(state){const last=state.history.at(-1),{care,duty}=measuresOf(state),a=state.history.flatMap(r=>r.pivots??[]).map(p=>p.pivot+':'+p.choice).join(',');return [state.death?.age??state.age,Math.round(worth(last)),care,duty,a].join('.');}
export function parseThem(code){if(typeof code!=='string'||code.length>1500||!/^[0-9]+\.-?[0-9]+\.-?[0-9]+\.-?[0-9]+\.[a-z0-9:,-]*$/.test(code))return null;const [age,money,care,duty,list]=code.split('.');const nums=[age,money,care,duty].map(Number);if(!nums.every(Number.isSafeInteger)||nums[0]>120)return null;const answers=new Map(list?list.split(',').map(x=>x.split(':')).filter(([p,o])=>pivotById(p)?.options.some(x=>x.id===o)):[]);return {age:nums[0],money:nums[1],care:nums[2],duty:nums[3],answers};}
function compareBox(box,state){let them;try{const saved=JSON.parse(localStorage.getItem('life-them'));if(saved?.code!==encodeBirth(state))return;them=parseThem(saved.them);}catch{return;}if(!them)return;
 const me=measuresOf(state),mine=state.history.at(-1),age=state.death?.age??state.age,t2=el('table','reading-compare'),head=el('tr');for(const x of ['',t('You'),t('Them')])head.append(el('th',null,x));t2.append(head);
 for(const[k,a,b]of [['Lived to',age,them.age],['Money',money(worth(mine)),money(them.money)],['Care for those close to you',me.care,them.care],['Responsibility beyond them',me.duty,them.duty]]){const tr=el('tr');tr.append(el('td',null,t(k)),el('td',null,String(a)),el('td',null,String(b)));t2.append(tr);}
 box.append(el('p','reading-thesis',t('The person who sent you this life')),t2);
 const split=state.history.flatMap(r=>r.pivots??[]).find(p=>them.answers.has(p.pivot)&&them.answers.get(p.pivot)!==p.choice);
 if(split){const pv=pivotById(split.pivot),lab=id=>t(pv.options.find(o=>o.id===id).label);box.append(el('p',null,fill('At {n} your lives parted. They chose: {a}. You chose: {b}.',{n:split.station,a:lab(them.answers.get(split.pivot)),b:lab(split.choice)})));}else if(state.history.flatMap(r=>r.pivots??[]).some(p=>them.answers.has(p.pivot)))box.append(el('p',null,t('You answered every question the same way.')));
}
const money=n=>(n<0?'−':'')+'฿'+Math.abs(Math.round(n)).toLocaleString('en');
const fill=(key,v={})=>Object.entries(v).reduce((text,[k,x])=>text.replaceAll('{'+k+'}',x),t(key));
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
export function renderReading(root,state){
 const r=lifeReading(state);if(!r)return null;
 const box=el('section','life-reading');box.setAttribute('aria-label',t('What this life said'));
 const d=state.death;
 if(d?.odds){
  const {odds,clear,worn,clean}=deathFacts(d);
  box.append(el('p','reading-figure',fill('1 in {n}',{n:odds})));
  box.append(el('p',null,worn?fill('The game’s odds of dying in those five years. In good health they would have been 1 in {a}. Your health had come down to {b}.',{a:clear,b:Math.round(state.health)}):t('The game’s odds of dying in those five years, at your age and health. Most people live through odds like these. It came anyway.')));
  if(clean&&clean!==odds)box.append(el('p',null,fill('Without the smoking: 1 in {n}.',{n:clean})));
 }else if(!d||d.ordained){box.append(el('p','reading-figure',fill('{n} of 100',{n:r.others.reachedSame})));box.append(el('p',null,t('of the other lives from your birth got this far.')));}
 if(r.chapters>=2)box.append(el('p','reading-thesis',fill('Money rose in {a} of your {n} chapters. Wellbeing rose in {b}.',{a:r.moneyRose,n:r.chapters,b:r.wellRose})));
 if(r.chapters>=2){const track=el('dl','reading-track');for(const[label,a,b]of [['Personal net worth',money(r.first.money),money(r.last.money)],['Wellbeing',Math.round(r.first.wellbeing),Math.round(r.last.wellbeing)],['Physical health',Math.round(r.first.health),Math.round(r.last.health)]])track.append(el('dt',null,t(label)),el('dd',null,a+' → '+b));
 box.append(el('p','fine',fill('Age {a} → {b}',{a:r.first.age,b:r.last.age})),track);}
 {const mine=measuresOf(state),rk=r.others.rank;box.append(el('p','reading-thesis',t('Three ways to count this life')));const dl=el('dl','reading-track');const say=n=>fill('Higher than {n} of 100 lives from your birth',{n});for(const[k,n]of [['Money',rk.money],['Care for those close to you',rk.care],['Responsibility beyond them',rk.duty]])dl.append(el('dt',null,t(k)),el('dd',null,say(n)));box.append(dl);void mine;}
 const mk=marketRecord(state);if(mk.length){box.append(el('p','reading-thesis',t('With the numbers in front of you')));const ol=el('ol','reading-turns');const idx=n=>Math.round(n).toLocaleString('en');for(const m of mk){ol.append(el('li','reading-market',fill(m.bought?'{year}: index {a}. You put money in. Five years later: {b}.':'{year}: index {a}. You stayed out. Five years later: {b}.',{year:m.year,a:idx(m.at),b:idx(m.after)})));}box.append(ol);if(mk.length>=2)box.append(el('p',null,fill('You bought near a high {a} times and near a low {b} times.',{a:mk.filter(m=>m.bought&&m.high).length,b:mk.filter(m=>m.bought&&!m.high).length})));}
 if(r.decisions>=3)box.append(el('p',null,fill('Of {n} decisions, you guarded your money {a} times, your peace of mind {b}, your body {c}.',{n:r.decisions,a:r.guarded.money,b:r.guarded.peace,c:r.guarded.body})));
 if(r.turning.length){const ol=el('ol','reading-turns');for(const x of r.turning){const li=el('li');li.append(el('b',null,fill('Age {n}',{n:x.age})));const body=el('span',null,t(x.said));const other=x.road?.label??x.others[0]?.label;if(other)body.append(el('small',null,fill('Other road: {road}',{road:t(other)})));if(x.road&&(x.road.health||x.road.wellbeing))body.append(el('small',null,fill('Five years down it: health {a}, wellbeing {b}, against the road you took.',{a:(x.road.health>0?'+':'')+x.road.health,b:(x.road.wellbeing>0?'+':'')+x.road.wellbeing})));li.append(body);ol.append(li);}box.append(ol);}
 box.append(el('p',null,r.people.length?t('Named in this life: ')+r.people.map(([who,from,to])=>t(who)+' '+(to!=null?fill('({a}–{b})',{a:from,b:to}):fill('(from {n})',{n:from}))).join(' · '):t('The record names no friend and no partner.')));
 const o=r.others;
 box.append(el('p',null,(d?fill('A hundred other lives from this same birth, with ordinary effort and random decisions: {n} lived longer.',{n:o.reachedSame})+' ':'')+(o.alive?fill('Of those alive at {n}, {a}% had more money and {b}% were happier.',{n:state.age,a:o.richer,b:o.happier}):'')));
 if(o.classGap){const g=o.classGap;box.append(el('p',null,fill('Typical money at {n}, same effort and random decisions. {mine}: about {a}. {other}: about {b}.',{mine:t(CLASS_TIERS[g.cls].label),other:t(CLASS_TIERS[g.other].label),a:money(g.mine),b:money(g.theirs),n:g.at})));}
if(r.roads){const wrap=el('div','reading-roads');wrap.append(el('p','reading-thesis',fill('At {n} you chose: {label}. Same birth, same luck, and the other roads:',{n:r.roads.age,label:t(r.roads.chosen)})));for(const x of r.roads.roads){const item=el('div');item.append(el('b',null,t(x.label)));item.append(el('p',null,fill('You live to {n}. {money}. Wellbeing {w}. Health {h}.',{n:x.age,money:money(x.money),w:x.wellbeing,h:x.health})));{const me=measuresOf(state);item.append(el('p',null,fill('Care {c}. Responsibility {d}. Yours: {e} and {f}.',{c:x.care,d:x.duty,e:me.care,f:me.duty})));}for(const m of x.memories)item.append(el('small',null,fill('Age {n}',{n:m.age})+' · '+t(m.text)));if(x.canLive){const go=el('button','reading-branch',t('Live this road →'));go.type='button';go.onclick=()=>document.dispatchEvent(new CustomEvent('life-branch',{detail:relive(state,x.pivot,x.id,true)}));item.append(go);}wrap.append(item);}box.append(wrap);}
 compareBox(box,state);
 box.append(el('p','reading-question',r.fall?fill('Wellbeing fell furthest between {a} and {b}. Same birth, same world. What would you do with those years?',{a:r.fall.from,b:r.fall.to}):t('Same birth, same world. What would you do differently?')));
 box.append(el('p','fine',t('Game model, not a forecast. Odds and comparisons come from this game’s rules.')));
 root.append(box);return box;
}
export const READING_KEYS=['What this life said','1 in {n}','{n} of 100','of the other lives from your birth got this far.','The game’s odds of dying in those five years. In good health they would have been 1 in {a}. Your health had come down to {b}.','The game’s odds of dying in those five years, at your age and health. Most people live through odds like these. It came anyway.','Without the smoking: 1 in {n}.','Money rose in {a} of your {n} chapters. Wellbeing rose in {b}.','Age {a} → {b}','Of {n} decisions, you guarded your money {a} times, your peace of mind {b}, your body {c}.','Age {n}','Other road: {road}','Five years down it: health {a}, wellbeing {b}, against the road you took.','Named in this life: ','A child','({a}–{b})','(from {n})','The record names no friend and no partner.','A hundred other lives from this same birth, with ordinary effort and random decisions: {n} lived longer.','Of those alive at {n}, {a}% had more money and {b}% were happier.','Typical money at {n}, same effort and random decisions. {mine}: about {a}. {other}: about {b}.','Wellbeing fell furthest between {a} and {b}. Same birth, same world. What would you do with those years?','Same birth, same world. What would you do differently?','Game model, not a forecast. Odds and comparisons come from this game’s rules.','The numbers','At {n} you chose: {label}. Same birth, same luck, and the other roads:','You live to {n}. {money}. Wellbeing {w}. Health {h}.','See your life →','The press became three factories. Your name was on none of them.','You knew everyone in the district, and you went to all their funerals.','You sent money home every month, and went back for the funerals.'];
