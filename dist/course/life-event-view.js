import {CRISIS_SOURCE} from './crisis-chapter.js';
import {choiceSymbol} from './choice-symbols.js';
import {t,localise} from './i18n.js';
export function initLifeEventView({onContinue}){
 const root=document.createElement('section');root.id='year-event';root.hidden=true;document.body.append(root);
 return {root,hide(){root.hidden=true;},show(event,guardian){root.replaceChildren();root.hidden=false;root.classList.toggle('crisis-event',event.origin==='crisis');
 const heading=document.createElement('h2');heading.id='year-event-title';heading.textContent=event.title;
 const icon=choiceSymbol(['accident','illness','dengue'].includes(event.type)?'care':event.type==='fired'?'work':event.type==='loss'?'tree':'heart');heading.prepend(icon);
 const text=document.createElement('p');text.className='decision-context';text.textContent=event.text;
 if(event.origin==='crisis'){
  const history=document.createElement('p');
  history.className='decision-context';
  const source=document.createElement('a');source.href=CRISIS_SOURCE;source.target='_blank';source.rel='noopener';
  source.textContent='On 2 July 1997, Thailand floated the baht.';history.append(source);root.append(history);
 }
 const impact=document.createElement('p');impact.className='pivot-cost';const values=[];for(const[k,label]of [['health','Health'],['wellbeing','Mood'],['cash','Money']])if(event[k])values.push(t(label)+' '+(event[k]>0?'+':'')+event[k]);if(event.incomeMonths)values.push(t('{n} months without work income').replace('{n}',event.incomeMonths));impact.textContent=values.join(' · ');impact.hidden=!values.length;
 const next=document.createElement('button');next.type='button';next.id='year-event-continue';next.textContent='Continue →';next.onclick=onContinue;root.prepend(heading);root.append(text);
 if(guardian){const reply=document.createElement('p');reply.className='decision-context';reply.append(guardian+' · ',event.reply);root.append(reply);}
 root.append(impact,next);localise(root);return root;
 }};
}
