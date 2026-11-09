import {decisionPresentation} from './decision-tone.js';
import {t} from './i18n.js';
// One native reading surface; move the real controls, never clone their state.
export function initDecisionStage({onDismiss}){
 const dialog=document.createElement('dialog');dialog.className='decision-dialog';
 const close=document.createElement('button');close.type='button';close.className='decision-set-aside';close.textContent='Return to life';
 const head=document.createElement('div');head.className='decision-head';const cue=document.createElement('p');cue.className='decision-cue';head.append(cue,close);
 const content=document.createElement('div');content.className='decision-content';
 const pager=document.createElement('button');pager.type='button';pager.className='decision-pager';dialog.append(head,content,pager);
 const page=()=>{pager.textContent=t(dialog.dataset.readingStage==='choices'?'Read the situation':'See choices →');};
 pager.onclick=()=>{dialog.dataset.readingStage=dialog.dataset.readingStage==='choices'?'context':'choices';content.scrollTop=0;page();if(dialog.dataset.readingStage==='choices')content.querySelector('button:not(:disabled)')?.focus();};
 const reading=document.createElement('div'),actions=document.createElement('div');reading.className='decision-reading';actions.className='decision-actions';document.body.append(dialog);
 const homes=new WeakMap();let activeKey=null,shown=[];
 function restore(){for(const node of shown)if(node.isConnected&&dialog.contains(node))homes.get(node)?.after(node);shown=[];}
 // On phones and tablets the panel is exactly as tall as what it says. The rest belongs to the world.
 const fit=()=>{if(innerWidth>1279||!dialog.open)return;dialog.style.height='auto';dialog.style.maxHeight='none';const h=Math.ceil(dialog.getBoundingClientRect().height);dialog.style.height='';dialog.style.maxHeight='';document.body.style.setProperty('--rpg-height',Math.min(h,Math.round(innerHeight*.62))+'px');};
 function hide(){restore();if(dialog.open)dialog.close();document.body.classList.remove('decision-open');document.body.style.removeProperty?.('--rpg-height');activeKey=null;}
 const dismiss=()=>{const key=activeKey;hide();onDismiss(key);};
 close.onclick=dismiss;dialog.addEventListener('cancel',event=>{event.preventDefault();dismiss();});
 return {hide,show(nodes,{key,label,...context}){
  if(key!==activeKey)dialog.dataset.readingStage='context';dialog.dataset.hasChoices=String(!context.result&&(nodes.some(n=>n.id==='encounter'||n.id==='questions'||n.id==='child-choice')));page();
  const presentation=decisionPresentation(context);dialog.dataset.tone=presentation.tone;dialog.dataset.chord=String(presentation.plate);cue.textContent=t(presentation.label);
  for(const [name,value]of Object.entries(presentation.tokens))dialog.style.setProperty(name,value);
  restore();
  const action=nodes.find(n=>n.id==='encounter'||n.id==='choice-result');
  content.classList.toggle('has-actions',!!action);content.replaceChildren(...(action?[reading,actions]:[]));
  for(const node of nodes){if(!homes.has(node)){const anchor=document.createComment('decision home');node.before(anchor);homes.set(node,anchor);}(action?(node===action?actions:reading):content).append(node);}shown=[...nodes];
  dialog.setAttribute('aria-labelledby',label);document.body.classList.add('decision-open');
  if(!dialog.open)dialog.showModal();
  if(key!==activeKey){dialog.scrollTop=0;const heading=document.getElementById(label);heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});}activeKey=key;globalThis.requestAnimationFrame?.(fit);
 }};
}
