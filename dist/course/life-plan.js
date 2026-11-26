import {schoolReview} from './school-preview.js';
// The next five years, decided left to right. One card per decision, nothing bleeding off a
// card; each choice moves you to the next card, and the far right card lives the years.
import {formatForeknowledge,foreknowledgeForChapter} from './replay-echoes.js';
import {AXES} from './sim.js';
import {chapterPathways,chapterPlans,chapterReceipt,effortFrom} from './chapter-play.js';
export {effortFrom} from './chapter-play.js';
import {locksFor} from './pivots.js';
import {MAJORS} from './life-choices.js';
import {setBudget,monthlyFlow} from './finance.js';
import {RUNGS,TOP,rungAt,birthRung,setRung,canAfford,ladderOpen} from './housing-ladder.js';
import {leaveWorld} from './life-verdict.js';
import {GOLD_PCTS,setGoldPct,goldPrice} from './gold.js';
import {GOALS,STOPS,dealtGoals,canChooseGoals,setGoals,dealtStops,canStop,setStop} from './life-collection.js';
import {PRIORITIES,prioritiesFor} from './priorities.js';
import {climateLines} from './world-voice.js';
import {birthYearOf} from './thai-history.js';
import {t} from './i18n.js';
import {lifeWarning} from './period-ledger.js';
import {renderYearPanel,outlookLine} from './year-panel.js';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const BUDGETS=[['thrift','Save hard',{save:35,fun:5,learn:5}],['even','Keep it even',{save:20,fun:10,learn:10}],['enjoy','Enjoy it',{save:10,fun:25,learn:5}],['grow','Spend on learning',{save:15,fun:5,learn:25}]];
const signed=n=>n>0?'+'+n:n<0?'−'+Math.abs(n):'±0';
const axisName=a=>a.key==='iq'?'IQ':a.key==='eq'?'EQ':a.label;
export function initLifePlan({mount,getState,apply,commit,commitHome,canRewind,rewind,onChosen=()=>{},canWatch,watch,replaySchoolReview,otherSchoolReview}){
 const root=el('section','life-plan');root.id='life-plan';root.setAttribute('aria-label','The next five years');root.hidden=true;mount.prepend(root);
 const steps=el('div','plan-steps');steps.setAttribute('role','group');steps.setAttribute('aria-label',t('The next five years'));const strip=el('div','plan-strip');const foot=el('div','plan-foot');const world=el('aside','plan-world');world.setAttribute('aria-label',t('The year around you'));const quick=el('section','chapter-play'),switcher=el('button','chapter-switch'),watchButton=el('button','chapter-watch','Watch these years');
 switcher.type=watchButton.type='button';
 watchButton.onclick=watch;
 const tools=el('div','chapter-tools'),memory=el('details','chapter-memory'),summary=el('summary',undefined,'Remembered events');
 const cue=el('p','replay-foreknowledge');cue.id='replay-foreknowledge';
 memory.append(summary,cue);tools.append(memory);
 memory.addEventListener('toggle',()=>{
  if(memory.open&&!tools.hidden)memory.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
 });
 root.append(quick,steps,strip,foot,tools,world);
 let local={},stationKey='',shown=-1;
 const go=i=>{const card=strip.children[i];if(!card)return;strip.scrollTo({left:card.offsetLeft-strip.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};
 const after=i=>requestAnimationFrame(()=>{if(strip.scrollWidth>strip.clientWidth+4)go(i+1);});
 function card(title){const c=el('section','plan-card');c.append(el('h3','plan-title',title));return c;}
 function option(label,on,fn,note){const b=el('button','plan-option');b.type='button';b.setAttribute('aria-pressed',on?'true':'false');b.append(el('span','plan-label',label));if(note)b.append(el('span','plan-note',note));b.onclick=()=>{if(!b.dataset.door&&local.door){local.door=false;}fn();};return b;}
 function readEffort(s){
  const ranked=AXES.map(a=>[a.key,s.effort[a.key]]).sort((a,b)=>b[1]-a[1]);
  local.main=ranked[0][1]>2?ranked[0][0]:undefined;
  local.second=ranked[1][1]>2&&ranked[1][1]<ranked[0][1]?ranked[1][0]:undefined;
 }
 switcher.onclick=()=>{
  local.advanced=!local.advanced;
  draw();
 };
 function draw(){
  const s=getState(),key=s.seed+':'+s.age;
  if(key!==stationKey){stationKey=key;local={};readEffort(s);strip.scrollLeft=0;memory.open=false;}
  const advanced=!!local.advanced,blocked=!canWatch(),chosen=s.chapterChoiceAge===s.age;
  root.classList.toggle('chapter-advanced',advanced);
  quick.hidden=advanced||blocked;
  switcher.hidden=blocked;
  const remembered=blocked?null:foreknowledgeForChapter(s);
  tools.hidden=!remembered;
  cue.textContent=formatForeknowledge(remembered,t);
  switcher.textContent=t(advanced?'Back to chapter choices':'Adjust the plan');
  switcher.setAttribute('aria-expanded',String(advanced));
  steps.hidden=strip.hidden=blocked||!advanced;
  const selected=document.activeElement?.dataset.chapterPlan;
  const pathwayFocused=document.activeElement?.id==='chapter-pathway';
  const routes=chapterPathways(s);
  const pathway=routes.some(([key])=>key===s.pathway)?s.pathway:(s.age<20?'school':'work');
  const heading=el('h2','chapter-heading',t('Your next five years'));
  heading.id='chapter-heading';
  heading.tabIndex=-1;
  const held=Object.values(locksFor(s)).reduce((sum,n)=>sum+n,0);
  const cost=el('p','chapter-cost',held?t('Pick one.')+' '+t('Earlier promises already use {n} of your 10 points.').replace('{n}',held):t('Spend 10 effort points. Pick one.'));
  const choices=el('div','chapter-choices');
  for(const plan of chapterPlans(s)){
   const active=chosen&&s.profile.priority===plan.id&&AXES.every(a=>s.effort[a.key]===plan.effort[a.key]);
   const points=AXES.filter(a=>plan.effort[a.key]).sort((a,b)=>plan.effort[b.key]-plan.effort[a.key]);
   const option=el('button','chapter-choice');
   option.type='button';
   option.dataset.chapterPlan=plan.id;
   option.setAttribute('aria-pressed',String(active));
   option.title=AXES.map(a=>t(axisName(a))+' '+plan.effort[a.key]).join(' · ');
   option.append(el('strong',undefined,t(plan.label)),el('small',undefined,points.slice(0,2).map(a=>t(axisName(a))+' '+plan.effort[a.key]).join(' · ')));
   option.onclick=()=>{
    readEffort(plan);
    apply({...getState(),effort:plan.effort,profile:plan.profile,chapterChoiceAge:s.age});
    onChosen();
   };
   choices.append(option);
  }
  const row=s.history.at(-1),last=chapterReceipt(row);
  const lastPriority=PRIORITIES[row?.profile?.priority]?.label;
  const receipt=last?el('p','chapter-receipt',[
   lastPriority?t('Last chapter')+' · '+t(lastPriority):t('Last chapter'), ...last.gains.slice(0,2).map(([key,gain])=>t(axisName(AXES.find(a=>a.key===key)))+' '+signed(gain)),
   t('Health')+' '+signed(last.health), t('Wellbeing')+' '+signed(last.wellbeing),
   ...(last.worth==null?[]:[t('Net worth')+' '+signed(last.worth).replace(/(\d+)/,n=>'฿'+Number(n).toLocaleString('en'))])
  ].join(' · ')):null;
  const previous=s.previous?.history?.find(r=>r.age===s.age&&r.from===row?.from);
  const before=chapterReceipt(previous);
  if(receipt&&before&&s.previous.restartedAt!==undefined){
   receipt.textContent+= ' · '+t('Before the replay')+' · '+t('Health')+' '+signed(before.health)+' · '+t('Wellbeing')+' '+signed(before.wellbeing);
  }
  quick.replaceChildren(heading,cost,choices);
  const school=quick.hidden?null:schoolReview(s,t);
  if(school){
   const review=el('section','school-review');
   const title=el('h2',undefined,t('What changed by twenty-five?'));
   title.tabIndex=-1;
   const action=el('button','chapter-watch school-replay',t('Replay this childhood →'));
   action.type='button';action.onclick=replaySchoolReview;
   review.append(title,el('p',undefined,[school.choice,school.outcome||school.offer].join(' ')));
   const path=school.road||school.path;
   if(school.split)review.append(el('p',undefined,school.split));
   if(path||school.earnings)review.append(el('p',undefined,[path,school.earnings].filter(Boolean).join(' · ')));
   const actions=el('div','school-review-actions');actions.append(action);
   if(otherSchoolReview?.()){
    const other=el('button','chapter-watch',t(s.previous?'Open the first run':'Open the replay'));
    other.type='button';other.onclick=()=>otherSchoolReview(true);actions.append(other);
   }
   review.append(actions);quick.prepend(review);
  }
  if(!quick.hidden&&routes.length>1){
   const row=el('div','chapter-pathway');
   const label=el('label',undefined,t('Study or work'));
   label.htmlFor='chapter-pathway';
   const select=el('select');
   select.id='chapter-pathway';
   for(const [key,route] of routes){
    const option=el('option',undefined,t(key==='vocational'?'Paid apprenticeship':route.label));
    option.value=key;
    select.append(option);
   }
   select.value=pathway;
   select.onchange=()=>{
    apply({...getState(),pathway:select.value});
    onChosen();
   };
   row.append(label,select);
   quick.append(row);
   if(pathwayFocused)select.focus({preventScroll:true});
  }
  if(selected&&!quick.hidden)quick.querySelector('[data-chapter-plan="'+selected+'"]')?.focus({preventScroll:true});
  watchButton.hidden=blocked||(!chosen&&!advanced);
  commit.disabled=!blocked&&!chosen&&!advanced;
  if(!blocked)commit.textContent=t('Live to age {n} →').replace('{n}',s.age+5);

  const cards=[],locks=locksFor(s),year=birthYearOf(s);
  const climate=year!==null&&s.age>=15?climateLines(year+s.age)[0]:null;
  // Focus
  {const c=card('Work on'),pick=local.main;let i=cards.length;for(const a of AXES){const tag=a.key===local.main?'Main':a.key===local.second?'Second':locks[a.key]!==undefined?'Held':'';c.append(option(axisName(a),a.key===local.main||a.key===local.second,()=>{const was={...local};if(local.main===a.key){local.main=local.second;local.second=undefined;}else if(local.second===a.key)local.second=undefined;else if(!local.main)local.main=a.key;else local.second=a.key;apply({...getState(),effort:effortFrom(local.main,local.second,locks)});onChosen();if(!was.second&&local.second)after(i);},[s.effort[a.key]+'/10',tag].filter(Boolean).join(' · ')));}void pick;cards.push(c);}
  // Priority
  {const list=prioritiesFor(s.age);if(list.length){const c=card('Put first'),i=cards.length;for(const id of list)c.append(option(PRIORITIES[id].label,s.profile.priority===id,()=>{const fx=PRIORITIES[id];apply({...getState(),profile:{...getState().profile,priority:id,aim:fx.aim,focus:fx.focus}});onChosen();after(i);}));cards.push(c);}}
  // Road
  {if(routes.length>1||routes.length===1&&pathway==='college'){const c=card('Study or work'),i=cards.length,cur=pathway;if(routes.length>1)for(const[k,r]of routes)c.append(option(r.label,k===cur,()=>{apply({...getState(),pathway:k});onChosen();if(k!=='college')after(i);}));if(cur==='college'){const label=el('label','plan-field','Field of study');const sel=el('select');sel.id='plan-major';const none=el('option',undefined,'Undecided');none.value='';sel.append(none);for(const[k,m]of Object.entries(MAJORS)){const o=el('option',undefined,m.label);o.value=k;sel.append(o);}sel.value=s.major??'';sel.onchange=()=>{apply({...getState(),major:sel.value||undefined});};label.append(sel);c.append(label);}cards.push(c);}}
  // What you are secretly after: dealt three, keep two.
  if(canChooseGoals(s)){const c=card('What you are secretly after'),now=s.lifeGoals??[];for(const id of dealtGoals(s.seed))c.append(option(t(GOALS[id].label),now.includes(id),()=>{const cur=getState().lifeGoals??[],next=cur.includes(id)?cur.filter(x=>x!==id):[...cur,id].slice(-2);apply(setGoals(getState(),next));onChosen();},t('{n} pts').replace('{n}',String(GOALS[id].pts))));c.append(el('p','plan-key',t('Keep two. Nobody sees them until the end.')));cards.push(c);}
  // One stop on the road, if the budget leaves room for it.
  if(s.age>=15){const c=card('A stop on the road'),here=(s.stops??[]).find(x=>x.age===s.age)?.id,ok=canStop(s);if(ok)for(const id of dealtStops(s))c.append(option(t(STOPS[id].label),here===id,()=>{apply(setStop(getState(),id));onChosen();}));else c.append(el('p','plan-key',t('Nothing left over for the road. Spend more on fun to stop.')));if((s.lifeGoals??[]).length)c.append(el('p','plan-key',t('Chasing: {goals}').replace('{goals}',s.lifeGoals.map(id=>t(GOALS[id]?.label??id)).join(' · '))));c.append(el('p','plan-key',t('{n} stops taken · unspent cash evaporates at death').replace('{n}',(s.stops??[]).length)));cards.push(c);}
  // Money
  if(s.finance&&s.age>=15){const c=card('Your money'),i=cards.length,b=s.finance.budget;for(const[,label,v]of BUDGETS)c.append(option(label,b&&b.save===v.save&&b.fun===v.fun&&b.learn===v.learn,()=>{apply(setBudget(getState(),v));onChosen();after(i);},`${v.save} / ${v.fun} / ${v.learn}`));c.append(el('p','plan-key','Save / fun / learn, % of income'));{const out=outlookLine(s,t);if(out)c.append(el('p','plan-key plan-outlook',out));}
   const scurve=s.age<25?'S-curve · Growth: time + labor builds skills and your first buffer.':s.age<50?'S-curve · Climb: time + labor = money — invest, bet, or turn cash into experiences.':s.age<65?'S-curve · Maturity: compound what you built and take the stops you put off.':'S-curve · Legacy: leave for loved ones or turn cash into experiences before the end.';
   c.append(el('p','plan-key',t(scurve)));
   if(s.age>=20){const pct=s.finance.goldPct??0,g=el('div','plan-row');g.append(el('span','plan-row-label',t('Gold')));const seg=el('div','plan-seg');for(const v of GOLD_PCTS){const b=el('button','plan-seg-btn',v+'%');b.type='button';b.setAttribute('aria-pressed',pct===v?'true':'false');b.onclick=()=>{apply(setGoldPct(getState(),v));onChosen();};seg.append(b);}g.append(seg);c.append(g);if(pct){const y=(birthYearOf(s)??1981)+s.age,income=monthlyFlow(s,s.history?.at(-1)).income,baht=Math.round(income*60*pct/100);c.append(el('p','plan-key',t('Next 5 years: ฿{a} into gold, at ฿{p} a baht-weight today').replace('{a}',baht.toLocaleString('en')).replace('{p}',goldPrice(y).toLocaleString('en'))));}}
   const bill=s.finance.receipts.findLast(r=>r.kind==='period'&&r.age===s.age);
   if(bill)c.append(el('p','plan-key',t('Earned {x}, spent {y}.')
    .replace('{x}','฿'+bill.income.toLocaleString('en'))
    .replace('{y}','฿'+bill.expense.toLocaleString('en'))));
   cards.push(c);}
  // Habits
  if(s.age>=15){const c=card('How you live');const set=(k,v)=>{local.door=false;apply({...getState(),profile:{...getState().profile,[k]:v}});onChosen();};const row=(label,k,opts)=>{const g=el('div','plan-row');g.append(el('span','plan-row-label',label));const r=el('div','plan-seg');for(const[v,tx]of opts){const b=el('button','plan-seg-btn',tx);b.type='button';b.setAttribute('aria-pressed',s.profile[k]===v?'true':'false');b.onclick=()=>set(k,v);r.append(b);}g.append(r);c.append(g);};row('Temple','religion',[['practice','Go'],['explore','Sometimes'],['none','No']]);if(s.age>=20){row('Smoke','smoke',[['no','No'],['yes','Yes']]);row('Drink','drink',[['no','No'],['social','Yes']]);
    // The door in the set. It ends the life you were playing, so it takes two taps.
    const door=option(local.door?t('Yes. Leave everything.'):t('Leave the world for the temple'),!!local.door,()=>{if(!local.door){local.door=true;draw();return;}apply(leaveWorld(getState()));},local.door?t('You cannot come back from this.'):undefined);door.dataset.door='1';c.append(door);}cards.push(c);}
  // Home: a step up, stay, or a step down. Only the home the family lives in moves on the ladder.
  if(ladderOpen(s)){const c=card('Where you live'),i=cards.length,was=rungAt(s,s.age-.5),now=s.finance.rung??birthRung(s),income=monthlyFlow(s,s.history?.at(-1)).income;for(const[to,verb]of [[was+1,'Move up: '],[was,'Stay: '],[was-1,'Move down: ']]){if(to<0||to>TOP)continue;const can=to<=was||canAfford(to,income),b=option(t(verb)+t(RUNGS[to].label),to===now,()=>{apply(setRung(getState(),to));onChosen();after(i);},can?'฿'+RUNGS[to].rent.toLocaleString('en')+t(' a month'):t('Rent is too high for this income'));b.disabled=!can;c.append(b);}cards.push(c);}
  renderYearPanel(world,s,t);
  if(blocked)world.hidden=true;
  {const warn=lifeWarning(s,t);if(warn&&cards[0])cards[0].append(el('p','plan-key plan-warning',warn));}
  const restoreSwitchFocus=document.activeElement===switcher;
  foot.replaceChildren(commit,watchButton,switcher,...(receipt&&!advanced&&!blocked?[receipt]:[]));
  if(restoreSwitchFocus&&!blocked)switcher.focus({preventScroll:true});
  const latestAge=row?.from;
  if(advanced&&!blocked&&canRewind(latestAge)){
   const goBack=el('button','chapter-watch chapter-rewind',t('Replay from age {n} →').replace('{n}',latestAge));
   goBack.type='button';
   goBack.onclick=()=>rewind(latestAge);
   foot.append(goBack);
  }commit.hidden=false;
  const controls='button,select';
  const activeCard=strip.children[shown],focused=document.activeElement;
  const focusIndex=activeCard?.contains(focused)?Array.from(activeCard.querySelectorAll(controls)).indexOf(focused):-1;
  const left=strip.scrollLeft;if(shown>=0&&strip.children[shown])measure.unobserve(strip.children[shown]);strip.replaceChildren(...cards);strip.scrollLeft=left;
  steps.replaceChildren(...cards.map((c,i)=>{const b=el('button','plan-step',c.firstChild.textContent);b.type='button';b.onclick=()=>go(i);return b;}));
  shown=-1;if(advanced&&!blocked)mark();else fit(-1);
  if(focusIndex>=0)strip.children[shown]?.querySelectorAll(controls)[focusIndex]?.focus({preventScroll:true});
 }
 const measure=new ResizeObserver(()=>fit(shown));
 measure.observe(steps);measure.observe(foot);measure.observe(quick);measure.observe(tools);
 function mark(){
  const first=strip.children[0];
  if(!first)return;
  if(strip.hidden)return;
  const i=Math.min(strip.children.length-1,Math.round(strip.scrollLeft/(first.offsetWidth+8)));
  if(i===shown)return;
  const old=strip.children[shown],moveFocus=old?.contains(document.activeElement);
  if(old)measure.unobserve(old);
  [...steps.children].forEach((button,n)=>{
   button.setAttribute('aria-current',n===i?'step':'false');
   strip.children[n].inert=n!==i;
  });
  shown=i;
  measure.observe(strip.children[i]);
  const active=steps.children[i];
  steps.scrollLeft=active.offsetLeft-steps.offsetLeft-16;
  if(moveFocus)active.focus({preventScroll:true});
  fit(i);
 }
 // On a phone the panel is as tall as the card on show. The rest belongs to the world.
 function fit(i){
  const body=document.body,v=body.dataset.consoleView;
  if(body.classList.contains('decision-open'))return;
  if(root.hidden||(v&&v!=='plan')){strip.style.height='';body.style.removeProperty('--rpg-height');return;}
  const c=strip.children[i],dock=root.closest('.rpg-dock');if(!dock)return;
  if(innerWidth>=1280){strip.style.height=c?c.offsetHeight+'px':'';body.style.removeProperty('--rpg-height');return;}
  const panel=!quick.hidden?quick:!strip.hidden?strip:foot;
  const top=panel.getBoundingClientRect().top-dock.getBoundingClientRect().top;
  const tail=tools.offsetHeight+(panel===foot?0:foot.offsetHeight)+(c?0:6)+20;
  const content=c?c.offsetHeight:panel.offsetHeight;
  const portraitPhone=matchMedia('(max-width: 480px) and (orientation: portrait)').matches;
  const h=Math.min(Math.round(innerHeight*(portraitPhone ? .45 : .53)),Math.ceil(top+content+tail));
  strip.style.height=c?Math.max(44,h-top-tail)+'px':'';
  body.style.setProperty('--rpg-height',h+'px');
 }
 addEventListener('resize',()=>fit(shown));new MutationObserver(()=>fit(shown)).observe(document.body,{attributes:true,attributeFilter:['data-console-view']});
 strip.addEventListener('scroll',()=>requestAnimationFrame(mark),{passive:true});
 return {focus(){(quick.hidden?switcher:quick.querySelector('h2'))?.focus({preventScroll:true});},draw(){root.hidden=false;document.body.classList.add('has-plan');draw();},hide(){if(root.hidden)return;root.hidden=true;document.body.classList.remove('has-plan');commitHome.append(commit);fit(shown);}};
}
