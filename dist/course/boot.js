// Never expose placeholder values as a loaded life.
// The page opens as soon as the game is ready; only the stage waits for its picture, so
// the player never watches a world flash in and change, and is never kept from the console
// while art decodes. 'life-first-frame' is sent by the world the first time it paints.
const stage=()=>{document.body.classList.remove('world-pending');};
document.body.classList.add('world-pending');
window.addEventListener('life-first-frame',stage,{once:true});
setTimeout(stage,8000);
try {
  await import('./game.bundle.js');
  document.body.classList.remove('loading');document.getElementById('load-state')?.remove();
} catch (error) {
  console.error('Life2.0 could not open', error);
  stage();
  const status=document.getElementById('load-state');
  status.textContent='Life2.0 could not open. Please reload to try again.';
  const retry=document.createElement('button');
  retry.type='button';retry.textContent='Reload Life2.0';retry.onclick=()=>location.reload();
  status.append(document.createElement('br'),retry);
}
