// The ending's one claim: unless you left for the temple, the life was either fun and insanely
// risky, or safe and never told you why you were born. Read only from what the life recorded.
import {netWorth} from './finance.js';
export const leaveWorld=s=>s.stage==='review'&&s.age>=20&&!s.story?.pending?{...s,stage:'recap',death:{age:s.age,cause:'You left the world for the temple.',ordained:true}}:s;
export function riskOf(s){
 const rows=s.history??[],worth=rows.filter(r=>r.finance).map(r=>netWorth(r.finance));let peak=0,fall=0;for(const w of worth){peak=Math.max(peak,w);if(peak>=100000)fall=Math.max(fall,(peak-w)/peak);}
 const profs=(s.profiles??[]).map(p=>p.profile),rough=(s.story?.seen??[]).filter(e=>(e.effects?.health??0)<0||(e.effects?.cash??0)<=-20000).length;
 return (profs.some(p=>p.smoke==='yes')?1:0)+(profs.some(p=>p.drink==='social')?1:0)+(rows.some(r=>r.finance?.debt>0)?2:0)+(fall>=.5?2:0)+(Math.min(100,...rows.map(r=>r.wellbeing))<35?1:0)+(Math.min(100,...rows.map(r=>r.health))<45?1:0)+Math.min(2,Math.floor(rough/2))+(s.death&&!s.death.ordained&&s.death.age<60?2:0)+(rows.some(r=>r.pathway==='independent')?1:0);
}
export const RISKY_FROM=4;
export const pathOf=s=>s.death?.ordained?'monk':riskOf(s)>=RISKY_FROM?'fun':'safe';
