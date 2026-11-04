import {initSettings,applyPreferences,preferences,t} from '../course/i18n.js';
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
// Return hook: a life left mid-way is waiting where it stopped.
try{const saved=JSON.parse(localStorage.getItem('life-course-v2')),el=document.getElementById('last-life');if(saved&&saved.stage!=='recap'&&saved.birth?.place&&Number.isInteger(saved.age)&&el){const paint=()=>{el.textContent=t('Your last life is waiting: age {n}, {place} →').replace('{n}',saved.age).replace('{place}',t(saved.birth.place));};paint();el.hidden=false;addEventListener('life-preferences',paint);}}catch{}
// The cover reel: a whole life in hard cuts, one painted plate per stretch of years.
// Reduced motion keeps the first frame and the span, 0 to 80, still.
{const img=document.getElementById('reel-img'),age=document.getElementById('reel-age'),tick=document.getElementById('reel-tick');
 const frames=[[0,'home-day'],[6,'garden'],[12,'school'],[20,'street-day'],[30,'work'],[42,'stall'],[58,'abroad'],[80,'hospital']];
 if(img&&age&&tick){
  const url=n=>new URL('../course/anime/plates/'+n+'.webp',location.href).href;
  const cut=i=>{const [years,name]=frames[i];img.src=url(name);age.textContent=years;tick.style.setProperty('--p',years/80*100+'%');};
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){age.textContent='0→80';}
  else{frames.forEach(([,n])=>{new Image().src=url(n);});let i=0;const step=()=>{i=(i+1)%frames.length;cut(i);setTimeout(step,i===frames.length-1?2600:1500);};setTimeout(step,1500);}
 }}
