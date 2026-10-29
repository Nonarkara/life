// One native reading surface; move the real controls, never clone their state.
export function initDecisionStage({onDismiss}){
 const dialog=document.createElement('dialog');dialog.className='decision-dialog';
 const close=document.createElement('button');close.type='button';close.className='decision-set-aside';close.textContent='Return to life';
 const content=document.createElement('div');dialog.append(close,content);document.body.append(dialog);
 const homes=new WeakMap();let activeKey=null;
 function restore(){for(const node of [...content.children])homes.get(node)?.after(node);}
 function hide(){restore();if(dialog.open)dialog.close();document.body.classList.remove('decision-open');activeKey=null;}
 const dismiss=()=>{const key=activeKey;hide();onDismiss(key);};
 close.onclick=dismiss;dialog.addEventListener('cancel',event=>{event.preventDefault();dismiss();});
 return {hide,show(nodes,{key,label}){
  for(const node of [...content.children])if(!nodes.includes(node))homes.get(node)?.after(node);
  for(const node of nodes){if(!homes.has(node)){const anchor=document.createComment('decision home');node.before(anchor);homes.set(node,anchor);}if(node.parentElement!==content)content.append(node);}
  dialog.setAttribute('aria-labelledby',label);document.body.classList.add('decision-open');
  if(!dialog.open)dialog.showModal();
  if(key!==activeKey){dialog.scrollTop=0;const heading=document.getElementById(label);heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});}activeKey=key;
 }};
}
