import {newLife,configureLife,begin,live,validate} from '../course/sim.js';
import {pendingPivots,openOptions,applyPivot} from '../course/pivots.js';
import {encounterById,offerEncounter,resolveEncounter} from '../course/encounters.js';
import {choiceAvailable} from '../course/finance.js';
// Real deterministic transitions, no save access or forged story/history flags.
export function thaiStudyLife(id){
 for(let seed=1;seed<=200;seed++){
  let s=begin(configureLife(newLife(seed),{class:'low_class'}));
  if(['th_buyer_bill','th_harvest_transport','th_dry_season'].includes(id)&&!['isan-village','nakhon-sawan'].includes(s.birth.region))continue;
  if(['th_spirit_offering','th_stray_cat','th_midnight_cart'].includes(id)&&s.birth.region!=='nakhon-sawan')continue;
  while(s.stage==='review'&&s.age<=(id==='th_unpaid_placement'?30:id==='th_midnight_cart'?50:40)){
   if(s.age>=20){
    if(s.story.pending?.id===id)return s;
    if(!s.story.pending){const offered=offerEncounter(s,.25,e=>e.id===id);if(offered!==s&&validate(offered))return offered;}
   }
   if(s.story.pending){const e=encounterById(s.story.pending.id),o=e.options.find(o=>choiceAvailable(s,o));s=resolveEncounter(s,o.id,.2);continue;}
   for(const p of pendingPivots(s))s=applyPivot(s,p,openOptions(p,s)[0].id);
   // School can become college; the work route is retained for the curfew and midnight cart.
   if(s.age===20&&id==='th_unpaid_placement')s={...s,pathway:'college'};
   if(s.age===20&&id==='th_curfew')s={...s,pathway:'work'};
   if(s.age===20&&id==='th_midnight_cart')s={...s,pathway:'work'};
   const offered=s.age>=20?offerEncounter(s,.25,e=>e.id===id):s;
   if(offered!==s&&validate(offered))return offered;
   s=live(s);
  }
 }
 throw new Error('No valid Thai encounter fixture: '+id);
}
