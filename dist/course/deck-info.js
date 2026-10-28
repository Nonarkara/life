// Full explanations use a reading dialog, rather than stretching every instrument.
export function deckInfo(label,paragraphs){
 const button=document.createElement('button');button.type='button';button.className='deck-info';button.textContent='?';button.setAttribute('aria-label',label);button.title=label;
 button.onclick=()=>{
  const dialog=document.createElement('dialog');dialog.className='deck-info-dialog';
  const form=document.createElement('form');form.method='dialog';
  const heading=document.createElement('h2');heading.id='deck-info-title';heading.textContent=label;dialog.setAttribute('aria-labelledby',heading.id);
  const close=document.createElement('button');close.type='submit';close.textContent='Close';const header=document.createElement('div');header.className='settings-head';header.append(heading,close);form.append(header);
  for(const text of paragraphs){const p=document.createElement('p');p.textContent=text;form.append(p);}
  dialog.append(form);document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();if(button.isConnected)button.focus();},{once:true});dialog.showModal();
 };
 return button;
}
