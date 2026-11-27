// Interactive Almanac & 16 Sourced Historical Lives compendium.
// Closed <details> by default so first-screen MSH chrome cost stays zero.
import {almanacSummary} from './almanac.js';
import {ROUTE_DATA} from './route-data.js';
import {STOPS} from './journey-stops.js';
import {CANONICAL_LIVES} from './canonical-lives.js';
import {t} from './i18n.js';

export function renderAlmanacDrawer(storage,{onIntake=false,className='almanac-drawer'}={}){
 const alm=almanacSummary(storage);
 const unlockedRoutes=new Set(alm.routes);
 const unlockedStops=new Set(alm.stops);
 const details=document.createElement('details');
 details.className=className;
 const summary=document.createElement('summary');
 summary.textContent=alm.lives>0
  ?t('Almanac: {r}/{tr} callings · {s}/{ts} road stops · {n} field notes')
    .replace('{r}',alm.routes.length).replace('{tr}',alm.totalRoutes)
    .replace('{s}',alm.stops.length).replace('{ts}',alm.totalStops)
    .replace('{n}',alm.notes.length)
  :t('Almanac & 16 historical Thai lives');
 details.append(summary);

 const wrap=document.createElement('div');
 wrap.className='almanac-body';

 // 1. Callings (26)
 const hRoutes=document.createElement('h3');
 hRoutes.textContent=t('Callings discovered ({a}/{b})').replace('{a}',alm.routes.length).replace('{b}',alm.totalRoutes);
 const ulRoutes=document.createElement('ul');
 ulRoutes.className='almanac-grid';
 for(const r of ROUTE_DATA){
  const li=document.createElement('li');
  const open=unlockedRoutes.has(r.route);
  li.className=open?'is-unlocked':'is-locked';
  const title=r.scenes?.[0]?.title;
  li.textContent=open&&title?'✓ '+t(title):'· · ·';
  if(!open)li.setAttribute('aria-label',t('Undiscovered'));
  ulRoutes.append(li);
 }
 wrap.append(hRoutes,ulRoutes);

 // 2. Road stops
 const hStops=document.createElement('h3');
 hStops.textContent=t('Road stops visited ({a}/{b})').replace('{a}',alm.stops.length).replace('{b}',alm.totalStops);
 const ulStops=document.createElement('ul');
 ulStops.className='almanac-grid';
 for(const [id,stop] of Object.entries(STOPS)){
  const li=document.createElement('li');
  const open=unlockedStops.has(id);
  li.className=open?'is-unlocked':'is-locked';
  li.textContent=open?'✓ '+t(stop.label):'· · ·';
  if(!open)li.setAttribute('aria-label',t('Undiscovered'));
  ulStops.append(li);
 }
 wrap.append(hStops,ulStops);

 // 3. 16 Sourced Historical Thai Lives
 const hCanon=document.createElement('h3');
 hCanon.textContent=t('16 sourced Thai lives (1949–2000)');
 const olCanon=document.createElement('ol');
 olCanon.className='almanac-canonical';
 for(const c of CANONICAL_LIVES){
  const li=document.createElement('li');
  const a=document.createElement('a');
  a.href=(onIntake?'?player=':'../intake/?player=')+c.slot;
  a.textContent=t(c.title);
  li.append(a);
  olCanon.append(li);
 }
 wrap.append(hCanon,olCanon);
 details.append(wrap);
 return details;
}
