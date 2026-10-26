import {initSettings,applyPreferences,preferences} from '../course/i18n.js';
import {symbolMarkup} from '../course/event-graphics.js';
for(const el of document.querySelectorAll('[data-symbol]'))el.insertAdjacentHTML('afterbegin',symbolMarkup(el.dataset.symbol));
initSettings();
// One sheet at a time, like turning a pamphlet over: nothing scrolls, and a deep link opens its sheet.
const sheets=[...document.querySelectorAll('.sheet')],menu=[...document.querySelectorAll('.menu [data-sheet]')];
function show(id,push=true){
 // Older links point at sheets that are now parts of a spread.
 id={session:'how',care:'conditions',research:'record',credits:'record'}[id]??id;
 if(!sheets.some(s=>s.id===id))id='overview';
 for(const s of sheets)s.hidden=s.id!==id;
 for(const b of menu)b.setAttribute('aria-pressed',String(b.dataset.sheet===id));
 if(push)history.replaceState(null,'',id==='overview'?location.pathname:'#'+id);
 menu.find(b=>b.dataset.sheet===id)?.scrollIntoView({block:'nearest',inline:'nearest'});
}
for(const b of document.querySelectorAll('[data-sheet]'))b.addEventListener('click',()=>show(b.dataset.sheet));
addEventListener('hashchange',()=>show(location.hash.slice(1),false));
show(location.hash.slice(1),false);
// The language choice is on the first screen, one tap away.
const langs=[...document.querySelectorAll('[data-lang]')],mark=()=>{for(const b of langs)b.setAttribute('aria-pressed',String(b.dataset.lang===preferences.language));};
for(const b of langs)b.addEventListener('click',()=>{applyPreferences({language:b.dataset.lang});mark();});
addEventListener('life-preferences',mark);mark();
