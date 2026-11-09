// A native form submit before the game module loads would discard the chosen year.
try {
  await import('./intake.js');
  document.getElementById('random-life').disabled = false;
  document.getElementById('see-town').disabled = false;
  document.querySelector('#intake-form button[type="submit"]').disabled = false;
} catch (error) {
  console.error('Life2.0 intake could not open', error);
  const status = document.getElementById('intake-error');
  status.textContent = 'Life2.0 could not open. ';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = 'Reload Life2.0';
  retry.onclick = () => location.reload();
  status.append(retry);
}
