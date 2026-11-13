import {homeRegion} from '../course/regions.js';
import {newLife,configureLife,begin,live,validate} from '../course/sim.js';
import {pendingPivots,openOptions,applyPivot} from '../course/pivots.js';
import {encounterById,offerEncounter,resolveEncounter} from '../course/encounters.js';
import {choiceAvailable} from '../course/finance.js';
// Real deterministic transitions, no save access or forged story/history flags.
export function thaiStudyLife(id){
 for(let seed=1;seed<=200;seed++){
  let s=begin(configureLife(newLife(seed),{class:'low_class'}));
  if(['th_buyer_bill','th_harvest_transport','th_dry_season'].includes(id)&&!['isan-village','nakhon-sawan'].includes(homeRegion(s.birth,s.age)))continue;
  if(['th_spirit_offering','th_stray_cat','th_midnight_cart','th_mitr_cameo','th_first_love_regret','th_vhs_modem','th_midlife_frugality','th_bangkok_accounting','th_bank_merger'].includes(id)&&s.birth.region!=='nakhon-sawan')continue;
  while(s.stage==='review'&&s.age<=(id==='th_unpaid_placement'?30:['th_midnight_cart','th_first_love_regret','th_bank_merger','th_midlife_frugality','th_bangkok_accounting','th_mitr_cameo','th_vhs_modem','th_spirit_offering','th_stray_cat'].includes(id)?55:40)){
   if(s.age>=20){
    if(s.story.pending?.id===id)return s;
    const baseState=s.story.pending?{...s,story:{...s.story,pending:null}}:s;
    const offered=offerEncounter(baseState,.25,e=>e.id===id);
    if(offered!==baseState&&validate(offered))return offered;
   }
   if(s.story.pending){const e=encounterById(s.story.pending.id),o=e.options.find(o=>choiceAvailable(s,o));s=resolveEncounter(s,o.id,.2);continue;}
   for(const p of pendingPivots(s))s=applyPivot(s,p,openOptions(p,s)[0].id);
   // School can become college; the work route is retained for the curfew and midnight cart.
   if(s.age===20&&['th_unpaid_placement','th_bangkok_accounting'].includes(id))s={...s,pathway:'college'};
   if(s.age===20&&['th_curfew','th_midnight_cart','th_bank_merger'].includes(id))s={...s,pathway:'work'};
   const offered=s.age>=20?offerEncounter(s,.25,e=>e.id===id):s;
   if(offered!==s&&validate(offered))return offered;
   s=live(s);
  }
 }
 throw new Error('No valid Thai encounter fixture: '+id);
}
