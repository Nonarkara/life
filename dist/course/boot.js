// Never expose placeholder values as a loaded life.
try {
  await import('./game.bundle.js');
  document.body.classList.remove('loading');
  document.getElementById('load-state').remove();
} catch (error) {
  console.error('Life could not open', error);
  const status=document.getElementById('load-state');
  status.textContent='Life could not open. Please reload to try again.';
  const retry=document.createElement('button');
  retry.type='button';retry.textContent='Reload Life';retry.onclick=()=>location.reload();
  status.append(document.createElement('br'),retry);
}
