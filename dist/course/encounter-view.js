import {assetsOf} from './life-persona.js';
import {choiceAvailable} from './finance.js';
import {choiceSymbol,choiceSymbolKey,questionCategoryBadge} from './choice-symbols.js';
import {t} from './i18n.js';
import {inWorldOrder} from './option-order.js';
import {SOURCE_MEANING,sourceLabel} from './era-scenarios.js';
export function encounterTerms(choice,formatMoney=n=>'\u0e3f'+n.toLocaleString('en')){
 const terms=[],amount=Math.abs(choice.cash??0),alreadyNamed=amount>0&&choice.label.includes('\u0e3f'+amount.toLocaleString('en'));
 if(!alreadyNamed&&choice.cash<0)terms.push('Cost: '+formatMoney(amount));
 if(!alreadyNamed&&choice.cash>0)terms.push('Income: '+formatMoney(amount));
 // A scenario option names its cost on a person, which money does not say.
 if(choice.namedCost)terms.push(choice.namedCost);
 if(choice.uncertain)terms.push('Sales uncertain');return terms;
}
// The real encounter buttons are shared with the no-save study route. Layout
// evidence should exercise the same cost, disabled state and action as the game.
export function renderEncounterChoices(root,state,scene,{onChoose,extra=()=>[],formatMoney=n=>'฿'+n.toLocaleString('en')}={}){
 root.replaceChildren();
 const badge=document.createElement('div');badge.className='question-badges';badge.append(questionCategoryBadge(scene.category==='family'?'relationships':scene.category));if(state.finance&&scene.options.some(o=>(o.cash??0)<0)){const wallet=document.createElement('span');wallet.className='decision-wallet';wallet.textContent=t('Cash + reserve: {value}').replace('{value}',formatMoney(state.finance.available+state.finance.reserve));badge.append(wallet);}
 root.append(badge);
 for(const choice of inWorldOrder(scene.options,state.seed,scene.id+state.age)){
  const button=document.createElement('button');button.type='button';button.className='encounter-choice';button.disabled=!choiceAvailable(state,choice);if(button.disabled)button.title=t('Not enough cash and reserve for this choice.');
  const label=document.createElement('span');label.textContent=choice.label;button.append(choiceSymbol(button.disabled?'unavailable':choiceSymbolKey(choice)),label);
  const terms=encounterTerms(choice,formatMoney);
  if(terms.length){const cost=document.createElement('small');for(const term of terms){const part=document.createElement('span');part.textContent=term;cost.append(part);}button.append(cost);}
  button.append(...extra(choice));button.onclick=()=>onChoose?.(choice);root.append(button);
 }
 if(scene.options.some(o=>!choiceAvailable(state,o))&&assetsOf(state).length){const b=document.createElement('button');b.type='button';b.className='encounter-sell';b.textContent=t('Sell something to pay for this');b.onclick=()=>{document.querySelector('.decision-set-aside')?.click();document.querySelector('.console-nav button[data-key="you"]')?.click();window.dispatchEvent(new Event('life-open-you'));};root.append(b);}
 if(scene.sourceKey){
  // A scenario written from a book: the disclosure says where it came from and
  // what the source key means, so a reader is never left thinking it is a record.
  const details=document.createElement('details');details.className='decision-source';
  const summary=document.createElement('summary');summary.textContent=t('Where this came from');
  const text=document.createElement('p');text.textContent=scene.lesson;
  const key=document.createElement('p');key.className='source-key';
  key.textContent=t('Source: {note} — {key} · {meaning}').replace('{note}',t(sourceLabel(scene.sourceNote))).replace('{key}',scene.sourceKey).replace('{meaning}',t(SOURCE_MEANING[scene.sourceKey]??''));
  details.append(summary,text,key);root.append(details);
 }else if(scene.source&&scene.lesson){const details=document.createElement('details');details.className='decision-source';const summary=document.createElement('summary');summary.textContent=t('Why this situation?');const text=document.createElement('p');text.textContent=scene.lesson;const link=document.createElement('a');link.href=scene.source;link.textContent=scene.sourceTitle??t('Research source');link.target='_blank';link.rel='noopener noreferrer';details.append(summary,text,link);root.append(details);}
}
