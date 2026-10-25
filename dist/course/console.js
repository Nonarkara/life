import {renderInvestments} from './investment-view.js';
import {roomRecord,recordedCommute} from './biography.js';
import {renderEconomy} from './economy-view.js';
import {PURCHASES,HOUSING,openFinance,setBudget,setHousing,setWorkplace,WORKPLACES,buy,monthlyFlow,netWorth,moveReserve} from './finance.js';
import {availablePathways} from './pathways.js';
import {buildCV} from './cv.js';
import {eventsFor} from './events.js';
const money=n=>'฿'+Math.round(n).toLocaleString('en');
export function initConsole({getState,change,isMoving=()=>false}){
 const main=document.querySelector('main'),stage=main.querySelector('.stage'),decision=main.querySelector('.decision'),resources=main.querySelector('.resources'),method=main.querySelector('.method');
 document.body.classList.add('console-mode');
 const reader=document.createElement('section');reader.className='console-reader';reader.setAttribute('aria-label','Life console');
 const nav=document.createElement('nav');nav.className='console-nav';nav.setAttribute('aria-label','Life sections');
 const panes={},buttons={};let active='plan',moneyView='budget';const investmentDraft={asset:'bond',amount:'1000',notice:''};
 const element=(tag,text,className)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;};
 for(const[key,label]of [['plan','Plan'],['money','Money'],['cv','CV'],['world','World'],['history','History']]){
  const b=element('button',label);b.type='button';b.setAttribute('aria-controls','console-'+key);b.onclick=()=>select(key);buttons[key]=b;nav.append(b);
  const p=element('section');p.id='console-'+key;p.className='console-panel';p.setAttribute('aria-label',label);panes[key]=p;
 }
 panes.plan.append(decision);panes.history.append(resources,method);reader.append(nav,...Object.values(panes));const actions=element('div',undefined,'console-actions');actions.append(reader.querySelector('#commit'));reader.append(actions);main.append(reader);
 const hud=element('dl',undefined,'life-hud'),wide=matchMedia('(min-width:721px)'),placeHud=()=>{const target=document.getElementById('condition-live');if(target)target.append(hud);else if(wide.matches)reader.insertBefore(hud,actions);else stage.append(hud);};placeHud();wide.addEventListener('change',placeHud);
 const header=document.querySelector('header');new ResizeObserver(()=>document.documentElement.style.setProperty('--life-header-height',header.getBoundingClientRect().height+'px')).observe(header);
 function select(key){active=key;actions.hidden=key!=='plan';if(key==='money'){moneyPane(getState());if(isMoving()||getState().stage!=='review'||getState().story?.pending)for(const control of panes.money.querySelectorAll('input,select,button:not([data-money-view])'))control.disabled=true;}if(key==='cv')cvPane(getState());if(key==='world')worldPane(getState());for(const[k,p]of Object.entries(panes)){p.hidden=k!==key;buttons[k].setAttribute('aria-pressed',String(k===key));}panes[key].scrollTop=0;}
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
  if(s.age>=20){const label=element('label','Housing and travel','housing-choice'),select=element('select');select.id='housing';select.setAttribute('aria-label','Housing and travel');select.disabled=s.stage!=='review';for(const[key,home]of Object.entries(HOUSING)){const o=element('option',home.label);o.value=key;select.append(o);}select.value=f.housing;select.onchange=()=>{change(setHousing(getState(),select.value));document.getElementById('housing')?.focus({preventScroll:true});};label.append(select);p.append(label);const home=HOUSING[f.housing];p.append(element('p','Rent '+money(flow.rent)+' + travel '+money(flow.transport)+' / month · '+flow.commute+' min / day','console-note'));}
  if(s.age>=20){const label=element('label','Work base','housing-choice'),select=element('select');select.id='workplace';select.setAttribute('aria-label','Work base');select.disabled=s.stage!=='review';for(const[key,place]of Object.entries(WORKPLACES)){const o=element('option',place.label);o.value=key;select.append(o);}select.value=f.workplace??'local';select.onchange=()=>{change(setWorkplace(getState(),select.value));document.getElementById('workplace')?.focus({preventScroll:true});};label.append(select);p.append(label,element('p','City work: 15% higher authored work pay. Living farther away adds travel costs and time. Allowances and pensions are unchanged.','console-note'));}
  const shop=element('div',undefined,'small-purchases');shop.append(element('h2','A little money, a little time'));
  for(const[key,item]of Object.entries(PURCHASES)){const b=element('button');b.type='button';b.append(element('span',item.label),element('small',money(item.cost)+' · '+item.hours+' h'));b.disabled=s.stage!=='review'||!!s.story?.pending||f.available<item.cost||f.purchases.some(q=>q.age===s.age&&q.key===key)||f.purchases.filter(q=>q.age===s.age).reduce((n,q)=>n+PURCHASES[q.key].hours,0)+item.hours>8;b.onclick=()=>change(buy(getState(),key));shop.append(b);}p.append(shop);
  p.append(element('p',s.story?.pending?'Resolve the current moment in Plan before spending.':'Each activity is available once at this review. Eight hours are available for these choices.','console-note'));
  const ledger=element('details');ledger.append(element('summary','Personal money ledger'));const list=element('ol');for(const r of f.receipts.slice(-8).reverse())list.append(element('li','Age '+r.age+' · '+{opening:'Family allowance',period:'Income and spending',purchase:'Purchase',encounter:'Life event',trade:'Trading fee',market:'Market change'}[r.kind]+' · '+(r.change>=0?'+':'')+money(r.change)));ledger.append(list);p.append(ledger);
  const lesson=element('details');lesson.append(element('summary','Saving and investing'),element('p','A cash reserve can meet a near-term expense. Investments can lose value, and fees reduce what you keep. Use Invest to hold a bond or equity fund; its value can fall.'));p.append(lesson);
 }
 function cvPane(s){
  const p=panes.cv;heading(p,'Your CV','Completed records, not plans. Studies do not automatically mean a degree.');const grid=element('div',undefined,'cv-grid'),entries=buildCV(s);
  for(const[kind,label]of [['education','Education'],['work','Work'],['projects','Projects'],['milestones','Milestones']]){const matching=entries.filter(e=>e.kind===kind);if(!matching.length)continue;const group=element('section');group.append(element('h2',label));const list=element('ul');for(const entry of matching){const li=element('li'),date=element('span',entry.from===entry.to?'Age '+entry.from:entry.from+'–'+entry.to),text=element('span',entry.label);li.append(date,text);list.append(li);}group.append(list);grid.append(group);}if(!entries.length)p.append(element('p','Nothing recorded yet.','console-note'));p.append(grid);
 }
 function worldPane(s){
  const p=panes.world;heading(p,'Around your life');
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
 function render(){const scroll=panes[active].scrollTop,s=getState();buttons.money.disabled=s.age<10;hud.replaceChildren();for(const[label,value]of [['Physical health',Math.round(s.health)+' / 100'],['Wellbeing',Math.round(s.wellbeing)+' / 100'],[s.finance?'Personal net worth':'Family savings',money(s.finance?netWorth(s.finance):s.cash)]])hud.append(element('dt',label),element('dd',value));select(active);panes[active].scrollTop=scroll;}
 return {render,select};
}
