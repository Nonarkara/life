// Full explanations use a reading dialog, rather than stretching every instrument.
// paragraphs may be strings, or [title, paragraphs] sections gathered into one dialog.
export function deckInfo(label,paragraphs,{text='?',cls='deck-info'}={}){
 const button=document.createElement('button');button.type='button';button.className=cls;button.textContent=text;button.dataset.sections=paragraphs.filter(Array.isArray).map(s=>s[0]).join('|');button.setAttribute('aria-label',label);button.title=label;
 button.onclick=()=>{
  const dialog=document.createElement('dialog');dialog.className='deck-info-dialog';
  const form=document.createElement('form');form.method='dialog';
  const heading=document.createElement('h2');heading.id='deck-info-title';heading.textContent=label;dialog.setAttribute('aria-labelledby',heading.id);
  const close=document.createElement('button');close.type='submit';close.textContent='Close';const header=document.createElement('div');header.className='settings-head';header.append(heading,close);form.append(header);
  for(const item of paragraphs){if(Array.isArray(item)){const h=document.createElement('h3');h.textContent=item[0];form.append(h);for(const t of item[1].filter(Boolean)){const p=document.createElement('p');p.textContent=t;form.append(p);}}else{const p=document.createElement('p');p.textContent=item;form.append(p);}}
  dialog.append(form);document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();if(button.isConnected)button.focus();},{once:true});dialog.showModal();
 };
 return button;
}
