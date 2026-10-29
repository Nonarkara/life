import {initBucketView} from './bucket-view.js';
import {placeDeckAction} from './deck-action.js';
import {renderInvestments} from './investment-view.js';
import {roomRecord,recordedCommute} from './biography.js';
import {renderEconomy,renderWorldNow} from './economy-view.js';
import {REGIONS,MOVE_TARGETS} from './regions.js';
import {PURCHASES,HOUSING,openFinance,setBudget,setHousing,setWorkplace,setRegion,currentRegion,WORKPLACES,buy,monthlyFlow,netWorth,moveReserve} from './finance.js';
import {availablePathways} from './pathways.js';
import {buildCV} from './cv.js';
import {eventsFor} from './events.js';
import {baselineComparison} from './baseline.js';
import {alternativeDeltas} from './alternatives.js';
const money=n=>'฿'+Math.round(n).toLocaleString('en');
const ORDER=[['plan','Plan'],['you','You'],['bucket','Bucket list'],['money','Money'],['cv','CV'],['world','World'],['history','History']];
export function initConsole({getState,change,isMoving=()=>false,getAge=()=>getState().age}){
 const bucketUI=initBucketView({getState,getAge,change});
 const main=document.querySelector('main'),stage=main.querySelector('.stage'),decision=main.querySelector('.decision'),resources=main.querySelector('.resources'),method=main.querySelector('.method');
 document.body.classList.add('console-mode');
 // A wide screen is a dashboard: your life on the left, the year around you on
 // the right. A narrow screen is a strip of consoles you swipe through.
 const wide=matchMedia('(min-width:1280px)');
 const element=(tag,text,className)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;};

 // The player console: the life you are living and the decisions you make.
 const player=element('section');player.className='player-console';player.setAttribute('aria-label','Your life');
 const plan=element('section');plan.id='console-plan';plan.className='console-panel console-card';plan.setAttribute('aria-label','Plan');
 // The action button is read before the decision panel is moved: a node that
 // is not yet attached to the document cannot be found by id.
 const commit=document.getElementById('commit'),saveStatus=document.getElementById('save-status');
 plan.append(decision);

 // The reader: the year around you, and the records this life keeps.
 const reader=element('section');reader.className='console-reader';reader.setAttribute('aria-label','Life console');
 const worldNow=element('section');worldNow.className='world-now';worldNow.setAttribute('aria-label','The year around you');
 const nav=element('nav');nav.className='console-nav';nav.setAttribute('aria-label','Life sections');
 const cards=element('div',undefined,'console-cards');
 const panes={},buttons={};let active='plan',moneyView='budget';const investmentDraft={asset:'bond',amount:'1000',notice:''};
 for(const[key,label]of ORDER){
  const b=element('button',label);b.type='button';b.setAttribute('aria-controls','console-'+key);b.onclick=()=>{select(key);if(wide.matches&&key!=='plan')closeReader.focus({preventScroll:true});};buttons[key]=b;nav.append(b);
  const p=key==='plan'?plan:element('section');p.id='console-'+key;p.className='console-panel console-card';p.setAttribute('aria-label',label);panes[key]=p;
 }
 panes.history.append(resources,method);const comparison=element('section',undefined,'baseline-compare');comparison.setAttribute('aria-label','Your life and the life you did not choose');panes.history.append(comparison);
 const actions=element('div',undefined,'console-actions');
 actions.append(saveStatus,commit);
 cards.append(...Object.values(panes).filter(p=>p.id!=='console-plan'));
 reader.append(worldNow,nav,cards);
 player.append(plan,actions);
 const dock=element('section',undefined,'rpg-dock');dock.setAttribute('aria-label','Life console');dock.append(reader,player);const childhood=document.getElementById('childhood-memory');if(childhood)dock.prepend(childhood);main.append(dock);
 const closeReader=element('button','Close','reader-close');closeReader.type='button';
 closeReader.onclick=()=>{const previous=buttons[active];select('plan');previous?.focus({preventScroll:true});};
 reader.prepend(closeReader);
 new ResizeObserver(()=>main.style.setProperty('--bench-height',player.getBoundingClientRect().height+'px')).observe(player);
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&wide.matches&&!reader.hidden&&!document.querySelector('dialog[open]')){event.preventDefault();closeReader.click();}});

 // Where each piece lives depends on the width: a dashboard splits the screen,
 // a narrow screen puts every console in one strip you swipe sideways.
 function place(){
  const previousFocus=document.activeElement;
  const actionFocused=document.activeElement===commit;
  if(wide.matches){player.prepend(nav);player.append(plan,actions);reader.insertBefore(worldNow,cards);}
  else{reader.insertBefore(nav,cards);cards.prepend(plan);panes.world.prepend(worldNow);}
  closeReader.hidden=!wide.matches;
  document.body.classList.toggle('dashboard',wide.matches);
  select(active);if(actionFocused&&!commit.hidden)commit.focus({preventScroll:true});
  else if(nav.contains(previousFocus)||previousFocus===closeReader)(previousFocus===closeReader&&!wide.matches?buttons[active]:previousFocus).focus({preventScroll:true});
 }
 place();wide.addEventListener('change',place);

 function select(key,{align=true,reset=true}={}){
  const opened=active!==key;active=key;document.body.dataset.consoleView=key;document.body.classList.toggle('plan-active',key==='plan');
  if(key==='bucket'){bucketUI.render(panes.bucket);if(opened)window.dispatchEvent(new Event('life-bucket-open'));}
  if(key==='money'){moneyPane(getState());if(isMoving()||getState().stage!=='review'||getState().story?.pending)for(const control of panes.money.querySelectorAll('input,select,button:not([data-money-view])'))control.disabled=true;}
  if(key==='cv')cvPane(getState());
  if(key==='world')worldPane(getState());
  // The Plan console is permanent on a wide screen; every console is a card in
  // one swipeable strip on a narrow one.
  for(const[k,p]of Object.entries(panes)){p.hidden=k!=='plan'&&(wide.matches?k!==key:false);buttons[k].setAttribute('aria-pressed',String(k===key));}
  // On wide screens the reader opens only for the selected record.
  // Returning to Plan releases its space to the world.
  reader.hidden=wide.matches&&key==='plan';worldNow.hidden=wide.matches&&key!=='plan'&&key!=='world';
  document.body.classList.toggle('reader-open',wide.matches&&key!=='plan');
  reader.setAttribute('aria-label',ORDER.find(([k])=>k===key)?.[1]??'Life console');
  if(!wide.matches&&align){const target=panes[key];cards.scrollTo({left:cards.scrollLeft+target.getBoundingClientRect().left-cards.getBoundingClientRect().left,behavior:'instant'});}
  if(reset){panes[key].scrollTop=0;if(wide.matches)reader.scrollTop=0;}placeDeckAction();
 }
 // A swipe changes the selected console too; labels must describe the visible card.
 let scrollFrame=0;
 cards.addEventListener('scroll',()=>{if(wide.matches||scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{
  scrollFrame=0;const edge=cards.getBoundingClientRect().left;
  const nearest=Object.entries(panes).filter(([,pane])=>!pane.hidden).sort((a,b)=>Math.abs(a[1].getBoundingClientRect().left-edge)-Math.abs(b[1].getBoundingClientRect().left-edge))[0]?.[0];
  if(nearest&&nearest!==active)select(nearest,{align:false,reset:false});
 });});
 const heading=(pane,title,note)=>{pane.replaceChildren(element('h1',title));if(note)pane.append(element('p',note,'console-note'));};
 function moneyPane(s){
  const p=panes.money;heading(p,'Your money',moneyView==='budget'?'Personal money and the household buffer are separate.':undefined);
  if(!s.finance){p.append(element('p',s.age<15?'Your family handles money for now. A personal allowance opens at 15.':'This life has no personal account record. Start another path to make these choices.'));return;}
  const f=s.finance,summary=element('dl',undefined,'money-summary'),accounts=[['Spendable',f.available],['Cash reserve',f.reserve],['Debt',f.debt]];
  for(const[label,value]of (moneyView==='invest'?accounts.slice(0,1):accounts))summary.append(element('dt',label),element('dd',money(value)));p.append(summary);
  let extraAccounts=null;if(moneyView==='invest'){extraAccounts=element('details');extraAccounts.append(element('summary','Reserve and debt'));const more=element('dl',undefined,'money-summary');for(const[label,value]of accounts.slice(1))more.append(element('dt',label),element('dd',money(value)));extraAccounts.append(more);p.append(extraAccounts);}
  if(f.reserve>0&&s.stage==='review'){const transfer=element('details',undefined,'reserve-transfer'),summary=element('summary','Move cash from reserve'),controls=element('div'),label=element('label','Amount · ฿'),amount=element('input');amount.id='reserve-amount';label.htmlFor=amount.id;amount.type='number';amount.min='1';amount.max=f.reserve;amount.value=Math.min(100,f.reserve);amount.setAttribute('aria-label','Amount from reserve');const move=element('button','Move to spendable');move.type='button';move.onclick=()=>change(moveReserve(getState(),Number(amount.value)));controls.append(label,amount,move);transfer.append(summary,controls);(extraAccounts??p).append(transfer);}
  const locked=isMoving()||s.stage!=='review'||!!s.story?.pending;
  const views=element('nav',undefined,'money-views');views.setAttribute('aria-label','Money sections');
  for(const[key,label]of [['budget','Budget'],['invest','Invest']]){const b=element('button',label);b.type='button';b.dataset.moneyView=key;b.setAttribute('aria-pressed',String(moneyView===key));b.onclick=()=>{moneyView=key;select('money');document.querySelector('[data-money-view='+key+']')?.focus({preventScroll:true});};views.append(b);}p.append(views);
  if(isMoving())p.append(element('p','Money controls reopen at your next review.','console-note'));
  if(moneyView==='invest'){renderInvestments(p,s,{getState,change,draft:investmentDraft,locked});return;}
  const routes=availablePathways(s.age),route=routes.some(([key])=>key===s.pathway)?s.pathway:routes[0]?.[0]??'work',flow=monthlyFlow(s,{pathway:route});
  p.append(element('p',flow.source+' · '+money(flow.income)+' / month','console-note'));
  const tip=element('details',undefined,'money-tip');tip.open=s.age===15;tip.append(element('summary','A small money lesson'),element('p','Saving keeps options open. Enjoyment, books and classes also use money and time. There is no perfect allocation.'));p.append(tip);
  const policy=element('fieldset',undefined,'budget-policy');policy.append(element('legend','After essentials, split your next income'));
  const feedback=element('p','','budget-feedback');feedback.setAttribute('aria-live','polite');
  for(const[key,label]of [['save','Cash reserve'],['fun','Enjoyment'],['learn','Books and learning']]){const row=element('label',undefined,'budget-row');row.append(element('span',label));const input=element('input');input.type='number';input.min='0';input.max='100';input.step='1';input.value=f.budget[key];input.id='budget-'+key;input.disabled=s.stage!=='review';input.onchange=()=>{const budget={...getState().finance.budget,[key]:Number(input.value)},next=setBudget(getState(),budget);if(next===getState()){feedback.textContent='Allocations must fit within 100%.';return;}change(next);document.getElementById(input.id)?.focus({preventScroll:true});};row.append(input,element('span','%'));policy.append(row);}
  policy.append(element('p','Spendable remainder: '+(100-f.budget.save-f.budget.fun-f.budget.learn)+'%','console-note'),feedback);p.append(policy);
  if(s.age>=20){const label=element('label','Where you live','housing-choice'),select=element('select'),here=currentRegion(s);select.id='region';select.setAttribute('aria-label','Where you live');select.disabled=s.stage!=='review';for(const key of [...new Set([here,...MOVE_TARGETS])]){const o=element('option',REGIONS[key].place);o.value=key;select.append(o);}select.value=here;select.onchange=()=>{change(setRegion(getState(),select.value));document.getElementById('region')?.focus({preventScroll:true});};label.append(select);const r=REGIONS[here];p.append(label,element('p','Pay ×'+r.pay+' · living costs ×'+r.cost+' here. Authored game tuning, not wage or price data.','console-note'));}
  if(s.age>=20){const label=element('label','Housing and travel','housing-choice'),select=element('select');select.id='housing';select.setAttribute('aria-label','Housing and travel');select.disabled=s.stage!=='review';for(const[key,home]of Object.entries(HOUSING)){const o=element('option',home.label);o.value=key;select.append(o);}select.value=f.housing;select.onchange=()=>{change(setHousing(getState(),select.value));document.getElementById('housing')?.focus({preventScroll:true});};label.append(select);p.append(label);const home=HOUSING[f.housing];p.append(element('p','Rent '+money(flow.rent)+' + travel '+money(flow.transport)+' / month · '+flow.commute+' min / day','console-note'));}
  if(s.age>=20){const label=element('label','Work base','housing-choice'),select=element('select');select.id='workplace';select.setAttribute('aria-label','Work base');select.disabled=s.stage!=='review';for(const[key,place]of Object.entries(WORKPLACES)){const o=element('option',place.label);o.value=key;select.append(o);}select.value=f.workplace??'local';select.onchange=()=>{change(setWorkplace(getState(),select.value));document.getElementById('workplace')?.focus({preventScroll:true});};label.append(select);p.append(label,element('p','City work: 15% higher authored work pay. Living farther away adds travel costs and time. Allowances and pensions are unchanged.','console-note'));}
  const shop=element('div',undefined,'small-purchases');shop.append(element('h2','A little money, a little time'));
  for(const[key,item]of Object.entries(PURCHASES)){const b=element('button');b.type='button';b.append(element('span',item.label),element('small',money(item.cost)+' · '+item.hours+' h'));b.disabled=s.stage!=='review'||!!s.story?.pending||f.available<item.cost||f.purchases.some(q=>q.age===s.age&&q.key===key)||f.purchases.filter(q=>q.age===s.age).reduce((n,q)=>n+PURCHASES[q.key].hours,0)+item.hours>8;b.onclick=()=>change(buy(getState(),key));shop.append(b);}p.append(shop);
  p.append(element('p',s.story?.pending?'Resolve the current moment in Plan before spending.':'Each activity is available once at this review. Eight hours are available for these choices.','console-note'));
  const ledger=element('details');ledger.append(element('summary','Personal money ledger'));const list=element('ol');for(const r of f.receipts.slice(-8).reverse())list.append(element('li','Age '+r.age+' · '+{opening:'Family allowance',period:'Income and spending',purchase:'Purchase',bucket:'Bucket list',encounter:'Life event',trade:'Trading fee',market:'Market change'}[r.kind]+' · '+(r.change>=0?'+':'')+money(r.change)));ledger.append(list);p.append(ledger);
  const lesson=element('details');lesson.append(element('summary','Saving and investing'),element('p','A cash reserve can meet a near-term expense. Investments can lose value, and fees reduce what you keep. Use Invest to hold a bond or equity fund; its value can fall.'));p.append(lesson);
 }
 function cvPane(s){
  const p=panes.cv;heading(p,'Your CV','Completed records, not plans. Studies do not automatically mean a degree.');const grid=element('div',undefined,'cv-grid'),entries=buildCV(s);
  for(const[kind,label]of [['education','Education'],['work','Work'],['projects','Projects'],['milestones','Milestones']]){const matching=entries.filter(e=>e.kind===kind);if(!matching.length)continue;const group=element('section');group.append(element('h2',label));const list=element('ul');for(const entry of matching){const li=element('li'),date=element('span',entry.from===entry.to?'Age '+entry.from:entry.from+'–'+entry.to),text=element('span',entry.label);li.append(date,text);list.append(li);}group.append(list);grid.append(group);}if(!entries.length)p.append(element('p','Nothing recorded yet.','console-note'));p.append(grid);
 }
 // The counterfactual: the same life with no decisions taken. The difference
 // between the two lines is what this player's choices moved.
 function baselinePane(s){
  const p=comparison;p.replaceChildren();
  p.append(element('h2','Your life and the life you did not choose'));
  if(s.age<15||s.history.filter(row=>row.age>=10).length<2){p.append(element('p','From 15, this life is measured against the one you did not choose.','console-note'));return;}
  const {rows,delta,endedEarly}=baselineComparison(s);
  if(!rows.length){p.append(element('p','No comparison is available yet.','console-note'));return;}
  p.append(element('p','Same birth, same world, same shocks. The other life spends every station in the default shape and takes no story decision, so the difference you see below is yours.','console-note'));
  const table=element('table'),head=element('thead'),headRow=element('tr');
  for(const label of ['Age','Money · yours / unchosen','Health · yours / unchosen','Wellbeing · yours / unchosen']){const th=element('th',undefined);th.scope='col';th.textContent=label;headRow.append(th);}
  head.append(headRow);table.append(head);
  const body=element('tbody');
  for(const row of rows){
   const tr=element('tr'),age=element('th');age.scope='row';age.textContent=String(row.age);
   const cash=element('td'),health=element('td'),wellbeing=element('td');
   cash.textContent=money(row.cash)+' / '+money(row.unchosenCash);
   health.textContent=Math.round(row.health)+' / '+Math.round(row.unchosenHealth);
   wellbeing.textContent=Math.round(row.wellbeing)+' / '+Math.round(row.unchosenWellbeing);
   tr.append(age,cash,health,wellbeing);body.append(tr);
  }
  table.append(body);p.append(table);
  if(delta){const sign=n=>(n>=0?'+':'')+n;p.append(element('p','At '+rows.at(-1).age+', your choices moved money by '+sign(money(delta.cash).replace('฿',''))+' ฿, health by '+sign(Math.round(delta.health))+' and wellbeing by '+sign(Math.round(delta.wellbeing))+' against that other life.','console-note'));}
  if(endedEarly)p.append(element('p','That other life ended early, so its later stations are missing.','console-note'));
  // The roads not taken: the other answer to a question, lived to the end of
  // those five years with the same luck and the same world.
  const roads=alternativeDeltas(s);
  if(roads.length){
   p.append(element('h3','The roads you did not take'));
   p.append(element('p','At every question, each other answer was lived to the end of those five years. Same seed, same world, same luck: the only difference is the answer.','console-note'));
   const list=element('ul','road-list');
   for(const road of roads){
    const item=element('li');
    const head=element('p','road-head');head.textContent='Age '+road.station+': '+road.label;
    const detail=element('p','fine');const sign=n=>(n>=0?'+':'')+n;
    detail.textContent='instead of '+road.taken+' — money '+sign(money(road.cashDelta).replace('฿',''))+' ฿, health '+sign(Math.round(road.healthDelta))+', wellbeing '+sign(Math.round(road.wellbeingDelta))+' by age '+(road.station+5)+'.';
    item.append(head,detail);list.append(item);
   }
   p.append(list);
  }
 }
 function worldPane(s){
  const p=panes.world;
  // The year band is the head of this console on a narrow screen, so it stays
  // where it is when the console is rebuilt.
  const keep=p.querySelector('.world-now');
  p.replaceChildren(...(keep?[keep]:[]),element('h1','Around your life'));
  renderEconomy(p,s);
  const room=roomRecord(s),record=element('details');record.append(element('summary','What the room remembers'));
  if(room.possessions.length)record.append(element('p','The red school case stays with you when you move.'));
  record.append(element('p',room.home.label));
  const commute=recordedCommute(s,s.age,s.history?.at(-1)?.pathway);if(commute!==null)record.append(element('p','Commute: {value} min / day. Longer journeys leave less time at home.'.replace('{value}',commute)));
  if(room.remembered)record.append(element('p','A small remembrance follows a recorded loss.'));
  record.append(element('p','Fictional soi-inspired architecture; possessions reflect recorded choices, not a surveyed household.','console-note'));p.append(record);
  p.append(element('h2','Society'),element('p','Born into '+s.birth.home+' · '+s.birth.place));
  p.append(element('h2','Environment'));const flood=s.history.find(r=>eventsFor(r).some(e=>e.type==='flood'));p.append(element('p',flood?'Floodwater damages the family home. Repairs take money and time.':'No environmental event recorded yet.'));
 }
 function render(){const scroll=wide.matches?reader.scrollTop:panes[active].scrollTop,s=getState();
  // One review surface first: a tab appears only once it has something of this life to show.
  const end=s.stage==='recap',opens={bucket:6,money:15,cv:20,world:0,history:15};for(const[k,age]of Object.entries(opens))buttons[k].hidden=!end&&(k==='bucket'?getAge():s.age)<age;if(buttons[active]?.hidden)active='plan';
  baselinePane(s);renderWorldNow(worldNow,s);select(active);if(wide.matches)reader.scrollTop=scroll;else panes[active].scrollTop=scroll;}
 return {render,select};
}
