// The next five years, decided left to right. One card per decision, nothing bleeding off a
// card; each choice moves you to the next card, and the far right card lives the years.
import {AXES,transfer} from './sim.js';
import {locksFor} from './pivots.js';
import {availablePathways} from './pathways.js';
import {MAJORS} from './life-choices.js';
import {setBudget} from './finance.js';
import {PRIORITIES,prioritiesFor} from './priorities.js';
import {climateLines} from './world-voice.js';
import {birthYearOf} from './thai-history.js';
import {t} from './i18n.js';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const BUDGETS=[['thrift','Save hard',{save:35,fun:5,learn:5}],['even','Keep it even',{save:20,fun:10,learn:10}],['enjoy','Enjoy it',{save:10,fun:25,learn:5}],['grow','Spend on learning',{save:15,fun:5,learn:25}]];
const axisName=a=>a.key==='iq'?'IQ':a.key==='eq'?'EQ':a.label;
// Ten points: the main focus gets five, the second three, and the rest spread. Held points stay held.
export function effortFrom(main,second,locks={}){
 const e=Object.fromEntries(AXES.map(a=>[a.key,locks[a.key]??0]));let left=10-Object.values(e).reduce((n,v)=>n+v,0);
 const give=(k,n)=>{const g=Math.max(0,Math.min(left,n-(locks[k]??0)));e[k]+=g;left-=g;};
 if(main)give(main,5);if(second)give(second,3);
 const rest=AXES.map(a=>a.key).filter(k=>k!==main&&k!==second);for(let i=0;left>0;i=(i+1)%rest.length){e[rest[i]]+=1;left-=1;}
 return e;
}
export function initLifePlan({mount,getState,apply,commit,commitHome,onChosen=()=>{}}){
 const root=el('section','life-plan');root.id='life-plan';root.setAttribute('aria-label','The next five years');root.hidden=true;mount.prepend(root);
 const steps=el('div','plan-steps');steps.setAttribute('role','group');const strip=el('div','plan-strip');root.append(steps,strip);
 let local={},stationKey='',scrollTo=null;
 const go=i=>{const card=strip.children[i];if(!card)return;scrollTo=i;strip.scrollTo({left:card.offsetLeft-strip.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};
 const after=i=>requestAnimationFrame(()=>{if(strip.scrollWidth>strip.clientWidth+4)go(i+1);});
 function card(title){const c=el('section','plan-card');c.append(el('h3','plan-title',title));return c;}
 function option(label,on,fn,note){const b=el('button','plan-option');b.type='button';b.setAttribute('aria-pressed',on?'true':'false');b.append(el('span','plan-label',label));if(note)b.append(el('span','plan-note',note));b.onclick=fn;return b;}
 function draw(){
  const s=getState(),key=s.seed+':'+s.age;if(key!==stationKey){stationKey=key;local={};const ranked=AXES.map(a=>[a.key,s.effort[a.key]]).sort((a,b)=>b[1]-a[1]);if(ranked[0][1]>2)local.main=ranked[0][0];if(ranked[1][1]>2&&ranked[1][1]<ranked[0][1])local.second=ranked[1][0];}
  const cards=[],locks=locksFor(s);
  // Focus
  {const c=card('Work on'),pick=local.main;let i=cards.length;for(const a of AXES){const tag=a.key===local.main?'Main':a.key===local.second?'Second':locks[a.key]!==undefined?'Held':'';c.append(option(axisName(a),a.key===local.main||a.key===local.second,()=>{const was={...local};if(local.main===a.key){local.main=local.second;local.second=undefined;}else if(local.second===a.key)local.second=undefined;else if(!local.main)local.main=a.key;else local.second=a.key;apply({...getState(),effort:effortFrom(local.main,local.second,locks)});onChosen();if(!was.second&&local.second)after(i);},tag));}void pick;cards.push(c);}
  // Priority
  {const list=prioritiesFor(s.age);if(list.length){const c=card('Put first'),i=cards.length;for(const id of list)c.append(option(PRIORITIES[id].label,s.profile.priority===id,()=>{const fx=PRIORITIES[id];apply({...getState(),profile:{...getState().profile,priority:id,aim:fx.aim,focus:fx.focus}});onChosen();after(i);}));cards.push(c);}}
  // Road
  {const routes=availablePathways(s.age);if(routes.length>1){const c=card('Study or work'),i=cards.length,cur=routes.some(([k])=>k===s.pathway)?s.pathway:(s.age<20?'school':'work');for(const[k,r]of routes)c.append(option(r.label,k===cur,()=>{apply({...getState(),pathway:k});onChosen();if(k!=='college')after(i);}));if(cur==='college'){const label=el('label','plan-field','Field of study');const sel=el('select');sel.id='plan-major';const none=el('option',undefined,'Undecided');none.value='';sel.append(none);for(const[k,m]of Object.entries(MAJORS)){const o=el('option',undefined,m.label);o.value=k;sel.append(o);}sel.value=s.major??'';sel.onchange=()=>{apply({...getState(),major:sel.value||undefined});};label.append(sel);c.append(label);}cards.push(c);}}
  // Money
  if(s.finance&&s.age>=15){const c=card('Your money'),i=cards.length,b=s.finance.budget;for(const[,label,v]of BUDGETS)c.append(option(label,b&&b.save===v.save&&b.fun===v.fun&&b.learn===v.learn,()=>{apply(setBudget(getState(),v));onChosen();after(i);},`${v.save} / ${v.fun} / ${v.learn}`));c.append(el('p','plan-key','Save / fun / learn, % of income'));cards.push(c);}
  // Habits
  if(s.age>=15){const c=card('How you live');const set=(k,v)=>{apply({...getState(),profile:{...getState().profile,[k]:v}});onChosen();};const row=(label,k,opts)=>{const g=el('div','plan-row');g.append(el('span','plan-row-label',label));const r=el('div','plan-seg');for(const[v,tx]of opts){const b=el('button','plan-seg-btn',tx);b.type='button';b.setAttribute('aria-pressed',s.profile[k]===v?'true':'false');b.onclick=()=>set(k,v);r.append(b);}g.append(r);c.append(g);};row('Temple','religion',[['practice','Go'],['explore','Sometimes'],['none','No']]);if(s.age>=20){row('Smoke','smoke',[['no','No'],['yes','Yes']]);row('Drink','drink',[['no','No'],['social','Yes']]);}cards.push(c);}
  // Live
  {const c=card('The next five years');c.classList.add('plan-live');const year=birthYearOf(s);const lines=year===null||s.age<15?[]:climateLines(year+s.age);if(lines.length)c.append(el('p','plan-signal',lines[0]));else c.append(el('p','plan-signal',t('Ages {a} to {b}').replace('{a}',s.age).replace('{b}',s.age+5)));c.append(commit);commit.hidden=false;cards.push(c);}
  const left=strip.scrollLeft;strip.replaceChildren(...cards);strip.scrollLeft=left;
  steps.replaceChildren(...cards.map((c,i)=>{const b=el('button','plan-step',c.firstChild.textContent);b.type='button';b.onclick=()=>go(i);return b;}));
  mark();
 }
 function mark(){const w=strip.clientWidth||1,i=Math.round(strip.scrollLeft/(strip.children[0]?.offsetWidth+8||w));[...steps.children].forEach((b,n)=>b.setAttribute('aria-current',n===i?'step':'false'));}
 strip.addEventListener('scroll',()=>requestAnimationFrame(mark),{passive:true});
 return {draw(){root.hidden=false;document.body.classList.add('has-plan');draw();},hide(){if(root.hidden)return;root.hidden=true;document.body.classList.remove('has-plan');commitHome.append(commit);}};
}
