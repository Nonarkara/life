import {drawRouteMap,routeModel,routeText} from './routemap.js';
import {t} from './i18n.js';
// A route is reference reading, rather than a full-screen sparse canvas.
export function openRouteView(state,{trigger,onClose=()=>{}}={}){
 const dialog=document.createElement('dialog');dialog.className='deck-info-dialog';dialog.style.width=`min(92vw,${state.age<=20?28:42}rem)`;
 const form=document.createElement('form');form.method='dialog';const head=document.createElement('div');head.className='settings-head';
 const title=document.createElement('h2');title.id='route-title';title.textContent=t('Life course');dialog.setAttribute('aria-labelledby',title.id);
 const close=document.createElement('button');close.type='submit';close.textContent=t('Close');head.append(title,close);
 const canvas=document.createElement('canvas'),model=routeModel(state);canvas.style.width='100%';canvas.style.display='block';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',routeText(state));
 const legend=document.createElement('p');legend.textContent=t('Amber: the life you lived · one line per place · rings mark a move.');form.append(head,canvas,legend);dialog.append(form);document.body.append(dialog);
 dialog.addEventListener('close',()=>{dialog.remove();onClose();if(trigger?.isConnected)trigger.focus({preventScroll:true});},{once:true});dialog.showModal();const width=canvas.clientWidth,height=(width<560?74:82)+model.lanes.length*(width<560?54:64);canvas.style.height=height+'px';requestAnimationFrame(()=>drawRouteMap(canvas,state,{width,height,dpr:Math.min(window.devicePixelRatio||1,2)}));
 return dialog;
}
