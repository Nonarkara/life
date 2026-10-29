import {choiceSymbol} from './choice-symbols.js';
import {localise,t} from './i18n.js';
export function initChildhoodView({onChoose,onContinue}){
 const root=document.createElement('section');root.id='child-choice';root.className='child-choice';root.hidden=true;document.body.append(root);
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const changes=effects=>[['health','Health'],['wellbeing','Mood'],['cash','Household buffer']].filter(([k])=>effects[k]).map(([k,label])=>t(label)+' '+(effects[k]>0?'+':'')+effects[k]).concat(Object.entries(effects.skills??{}).map(([k,v])=>t({iq:'IQ',eq:'EQ',craft:'Creativity',drive:'Drive',physique:'Physique'}[k])+' +'+v)).join(' · ');
 return {root,hide(){root.hidden=true;},show(question,result){
  root.replaceChildren();root.hidden=false;const heading=el('h2',result?.label??question.title);heading.id='child-title';root.append(heading);
  if(result){root.append(el('p',result.note,'decision-context'),el('p',changes(result.effects),'pivot-cost'));const next=el('button','Continue →');next.type='button';next.id='child-continue';next.onclick=onContinue;root.append(next);}
  else{root.append(el('p',question.context,'decision-context'));const options=el('div',undefined,'pivot-options');for(const o of question.options){const b=el('button',undefined,'pivot-option');b.type='button';b.append(choiceSymbol(o.symbol),el('span',o.label,'pivot-label'),el('small',changes(o.effects),'pivot-cost'));b.onclick=()=>onChoose(question,o);options.append(b);}root.append(options);}
  localise(root);return root;
 }};
}
