import {choiceAvailable} from './finance.js';
import {choiceSymbol,choiceSymbolKey,questionCategoryBadge} from './choice-symbols.js';
import {t} from './i18n.js';
import {inWorldOrder} from './option-order.js';
export function encounterTerms(choice,formatMoney=n=>'\u0e3f'+n.toLocaleString('en')){
 const terms=[],amount=Math.abs(choice.cash??0),alreadyNamed=amount>0&&choice.label.includes('\u0e3f'+amount.toLocaleString('en'));
 if(!alreadyNamed&&choice.cash<0)terms.push('Cost: '+formatMoney(amount));
 if(!alreadyNamed&&choice.cash>0)terms.push('Income: '+formatMoney(amount));
 if(choice.uncertain)terms.push('Sales uncertain');return terms;
}
// The real encounter buttons are shared with the no-save study route. Layout
// evidence should exercise the same cost, disabled state and action as the game.
export function renderEncounterChoices(root,state,scene,{onChoose,formatMoney=n=>'฿'+n.toLocaleString('en')}={}){
 root.replaceChildren();
 const badge=document.createElement('div');badge.className='question-badges';badge.append(questionCategoryBadge(scene.category==='family'?'relationships':scene.category));if(state.finance&&scene.options.some(o=>(o.cash??0)<0)){const wallet=document.createElement('span');wallet.className='decision-wallet';wallet.textContent=t('Cash + reserve: {value}').replace('{value}',formatMoney(state.finance.available+state.finance.reserve));badge.append(wallet);}
 root.append(badge);
 for(const choice of inWorldOrder(scene.options,state.seed,scene.id+state.age)){
  const button=document.createElement('button');button.type='button';button.className='encounter-choice';button.disabled=!choiceAvailable(state,choice);if(button.disabled)button.title=t('Not enough cash and reserve for this choice.');
  const label=document.createElement('span');label.textContent=choice.label;button.append(choiceSymbol(button.disabled?'unavailable':choiceSymbolKey(choice)),label);
  const terms=encounterTerms(choice,formatMoney);
  if(terms.length){const cost=document.createElement('small');for(const term of terms){const part=document.createElement('span');part.textContent=term;cost.append(part);}button.append(cost);}
  button.onclick=()=>onChoose?.(choice);root.append(button);
 }
 if(scene.source&&scene.lesson){const details=document.createElement('details');details.className='decision-source';const summary=document.createElement('summary');summary.textContent='Why this situation?';const text=document.createElement('p');text.textContent=scene.lesson;const link=document.createElement('a');link.href=scene.source;link.textContent=scene.sourceTitle??'Research source';link.target='_blank';link.rel='noopener noreferrer';details.append(summary,text,link);root.append(details);}
}
