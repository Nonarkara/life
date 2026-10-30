import {lifeCard} from './life-card.js';
import {cardPreparation} from './card-preparation.js';
import {deliverCard,canShareCard} from './share-result.js';
import {birthURL} from './birthcode.js';
import {rememberWords,readLives,lifeId} from './lives.js';
import {t,localise} from './i18n.js';
export function lifeCardView(state,storage){
 const root=document.createElement('details');root.className='life-card-tools';
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=t(text);return n;};
 const summary=el('summary','Life card'),label=el('label','One line for your life card'),words=el('input');words.type='text';words.maxLength=90;words.placeholder=t('In your own words');words.value=readLives(storage).find(e=>e.id===lifeId(state))?.words??'';label.append(words);
 const preview=el('img');preview.alt=t('Your life card preview');preview.hidden=true;
 const actions=el('div'),download=el('button','Download card'),share=el('button','Share card'),retry=el('button','Try again'),status=el('p');actions.className='life-card-actions';status.className='fine';status.setAttribute('role','status');
 for(const b of [download,share,retry])b.type='button';download.disabled=true;share.hidden=true;retry.hidden=true;let timer,previewURL=null,sharing=false,disposed=false;
 const preparation=cardPreparation(async caption=>{await Promise.race([document.fonts?.ready??Promise.resolve(),new Promise(resolve=>setTimeout(resolve,1500))]);const blob=await lifeCard(state,caption);if(!blob)throw Error('No image');return new File([blob],'life2-card.png',{type:'image/png'});},render);
 function render(current){
  if(disposed)return;
  download.disabled=current.status!=='ready';share.hidden=!canShareCard(current.file,navigator);share.disabled=sharing||current.status!=='ready';retry.hidden=current.status!=='failed';
  if(previewURL){URL.revokeObjectURL(previewURL);previewURL=null;}preview.hidden=current.status!=='ready';
  if(current.status==='ready'){previewURL=URL.createObjectURL(current.file);preview.src=previewURL;status.textContent='';status.hidden=true;}
  else{status.hidden=false;status.textContent=t(current.status==='failed'?'The image could not be prepared. Try again.':'Preparing card…');}
 }
 const prepare=()=>{if(disposed)return;clearTimeout(timer);preparation.prepare(words.value.trim());};
 root.addEventListener('toggle',()=>{if(root.open)prepare();else{clearTimeout(timer);preparation.invalidate();if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;}});
 words.oninput=()=>{rememberWords(storage,state,words.value.trim());preparation.invalidate();clearTimeout(timer);timer=setTimeout(prepare,200);};retry.onclick=prepare;
 download.onclick=()=>{const file=preparation.state.file;if(!file)return;rememberWords(storage,state,words.value.trim());const url=URL.createObjectURL(file),a=el('a');a.href=url;a.download='life2-card.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);status.hidden=false;status.textContent=t('Card download started.');};
 share.onclick=async()=>{const file=preparation.state.file;if(!file||sharing)return;sharing=true;share.disabled=true;download.disabled=true;words.disabled=true;status.hidden=false;status.textContent=t('Preparing share…');
  try{const outcome=await deliverCard({files:[file],title:'Life2.0',text:birthURL(state)??'https://life.nonarkara.org'},navigator,{onWaiting:()=>{status.textContent=t('Still waiting for sharing. Cancel in the share sheet to return.');}});status.textContent=t({shared:'Passed to your device’s sharing system.',cancelled:'Sharing cancelled.',busy:'Finish the open share first.',unavailable:'Image sharing is unavailable. You can download the card.',failed:'The image could not be shared. You can download the card.'}[outcome]);if(outcome==='shared')rememberWords(storage,state,words.value.trim());}
  finally{sharing=false;share.disabled=false;download.disabled=preparation.state.status!=='ready';words.disabled=false;}
 };
 actions.append(download,share,retry);root.append(summary,label,preview,actions,status);localise(root);return {root,destroy(){disposed=true;clearTimeout(timer);preparation.invalidate();if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;}};
}
