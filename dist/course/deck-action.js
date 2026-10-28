let restoreActionFocus=false;
// Keep the one real action alive when the instrument subtree is rebuilt.
export function releaseDeckAction(root){
 const action=document.getElementById('commit'),fallback=document.querySelector('.console-actions');
 if(action&&fallback&&root.contains(action)){restoreActionFocus=document.activeElement===action;fallback.append(action);}
}
export function placeDeckAction(){
 const action=document.getElementById('commit'),fallback=document.querySelector('.console-actions');
 if(!action||!fallback)return;
 const deck=document.getElementById('life-deck'),slot=document.getElementById('deck-action-slot'),priorities=document.getElementById('priorities'),status=document.getElementById('save-status');
 const integrated=matchMedia('(min-width:1280px)').matches&&document.body.classList.contains('is-review')&&deck&&!deck.hidden&&priorities&&!priorities.hidden&&!action.hidden&&status?.hidden;
 if(slot&&deck?.lastElementChild&&slot.parentElement!==deck.lastElementChild)deck.lastElementChild.append(slot);
 const target=integrated&&slot?slot:fallback;
 const focused=restoreActionFocus||document.activeElement===action;
 if(action.parentElement!==target)target.append(action);
 document.body.classList.toggle('deck-action-integrated',target===slot);
 if(focused&&!action.hidden)action.focus({preventScroll:true});restoreActionFocus=false;
}
