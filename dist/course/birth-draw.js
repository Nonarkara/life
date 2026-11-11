// The fresh-birth draw is separate from shared, daily and exact-birth replays.
import {newLife,configureLife,validate,rand} from './sim.js';
import {birthFits} from './housing-ladder.js';

import {routeOf} from './life-routes.js';
import {COHORT_YEARS} from './thai-history.js';
// Every historical cohort the game has built, not only the first three: a random life can be born in 1955 or 1997.
const DRAW_YEARS=COHORT_YEARS.filter(y=>y<2026);

export function drawBirth(options={}, {previous=null, varied=false, random=Math.random}={}){
 const previousRoute=varied&&previous?routeOf(previous):null;
 const eras=DRAW_YEARS.filter(year=>year!==previous?.intake?.birthYear);
 const randomEra=options.birthYear==='historical'||(varied&&options.birthYear===undefined);
 for(let attempt=0;attempt<4000;attempt++){
  const seed=Math.floor(random()*2147483646)+1;
  const birthYear=randomEra?eras[Math.floor(rand(seed,0,'fresh-era')*eras.length)]:options.birthYear;
  const life=configureLife(newLife(seed),{...options,birthYear});
  if(!birthFits(life,options))continue;
  if(varied&&previous&&(seed===previous.seed||life.birth.home===previous.birth.home||life.birth.class===previous.birth.class))continue;
  if(previousRoute&&routeOf(life)===previousRoute)continue;
  if(validate(life))return life;
 }
 throw new Error('No birth matched the draw');
}
