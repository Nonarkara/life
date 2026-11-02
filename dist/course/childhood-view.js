import {choiceSymbol} from './choice-symbols.js';
import {CHILD_CHOICES} from './childhood-choices.js';
import {localise,t} from './i18n.js';
export function initChildhoodView({onChoose,onContinue,getState}){
 const root=document.createElement('section');root.id='child-choice';root.className='child-choice';root.hidden=true;document.body.append(root);
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const changes=effects=>[['health','Health'],['wellbeing','Mood'],['cash','Household buffer']].filter(([k])=>effects[k]).map(([k,label])=>t(label)+' '+(effects[k]>0?'+':'')+effects[k]).concat(Object.entries(effects.skills??{}).map(([k,v])=>t({iq:'IQ',eq:'EQ',craft:'Creativity',drive:'Drive',physique:'Physique'}[k])+' +'+v)).join(' · ');
 // Supporting records are available on demand. They do not enlarge the
 // current choice merely because a wider screen has spare space.
 function snapshot(state){
  const panel=el('details',undefined,'child-snapshot');
  panel.append(el('summary',t('Your life so far'),'snapshot-head'));
  const stats=el('div',undefined,'snapshot-stats');
  stats.append(el('div',Math.round(state.health)+'/100','snapshot-stat'),el('small',t('Health')));
  stats.append(el('div',Math.round(state.wellbeing)+'/100','snapshot-stat'),el('small',t('Mood')));
  stats.append(el('div','฿'+state.cash.toLocaleString('en'),'snapshot-stat'),el('small',t('Household buffer')));
  panel.append(stats);
  const skills=el('div',undefined,'snapshot-skills');
  skills.append(el('h4',t('Skills'),'snapshot-sub'));
  for(const[key,label]of[['iq','IQ'],['eq','EQ'],['craft','Creativity'],['drive','Drive'],['physique','Physique']]){
   const row=el('div',undefined,'snapshot-skill-row');
   row.append(el('span',label),el('output',state.skills[key]));
   skills.append(row);
  }
  panel.append(skills);
  const choices=state.childhood?.choices??[];
  if(choices.length){
   const prev=el('div',undefined,'snapshot-choices');
   prev.append(el('h4',t('Choices made'),'snapshot-sub'));
   for(const c of choices){
    const q=CHILD_CHOICES.find(q=>q.age===c.age);
    const o=q?.options.find(o=>o.id===c.choice);
    if(o){
     const item=el('div',undefined,'snapshot-choice');
     item.append(el('span',c.age+' · '+o.label));
     prev.append(item);
    }
   }
   panel.append(prev);
  }
  return panel;
 }
 return {root,hide(){root.hidden=true;},show(question,result){
  const state=getState?.();
  root.replaceChildren();root.hidden=false;root.className='child-choice'+(result?' child-result':'');
  const heading=el('h2',result?.label??question.title);heading.id='child-title';root.append(heading);
  const body=el('div',undefined,'child-body');
  const left=el('div',undefined,'child-left');
  if(result){left.append(el('p',result.note,'decision-context'),el('p',changes(result.effects),'pivot-cost'));const next=el('button','Continue →');next.type='button';next.id='child-continue';next.onclick=onContinue;left.append(next);}
  else{left.append(el('p',question.context,'decision-context'));const options=el('div',undefined,'pivot-options');for(const o of question.options){const b=el('button',undefined,'pivot-option');b.type='button';b.append(choiceSymbol(o.symbol),el('span',o.label,'pivot-label'),el('small',changes(o.effects),'pivot-cost'));b.onclick=()=>onChoose(question,o);options.append(b);}left.append(options);}
  body.append(left);
  if(state&&!result)body.append(snapshot(state));
  root.append(body);
  localise(root);return root;
 }};
}
