// Risk grouping describes the simulated cohort. The verdict reads the life itself.
import {netWorth} from './finance.js';
export const leaveWorld=s=>s.stage==='review'&&s.age>=20&&!s.story?.pending?{...s,stage:'recap',death:{age:s.age,cause:'You left the world for the temple.',ordained:true}}:s;
export function riskOf(s){
 const rows=s.history??[],worth=rows.filter(r=>r.finance).map(r=>netWorth(r.finance));let peak=0,fall=0;for(const w of worth){peak=Math.max(peak,w);if(peak>=100000)fall=Math.max(fall,(peak-w)/peak);}
 const profs=(s.profiles??[]).map(p=>p.profile),rough=(s.story?.seen??[]).filter(e=>(e.effects?.health??0)<0||(e.effects?.cash??0)<=-20000).length;
 return (profs.some(p=>p.smoke==='yes')?1:0)+(profs.some(p=>p.drink==='social')?1:0)+(rows.some(r=>r.finance?.debt>0)?2:0)+(fall>=.5?2:0)+(Math.min(100,...rows.map(r=>r.wellbeing))<35?1:0)+(Math.min(100,...rows.map(r=>r.health))<45?1:0)+Math.min(2,Math.floor(rough/2))+(s.death&&!s.death.ordained&&s.death.age<60?2:0)+(rows.some(r=>r.pathway==='independent')?1:0);
}
export const RISKY_FROM=4;
export const pathOf=s=>s.death?.ordained?'monk':riskOf(s)>=RISKY_FROM?'fun':'safe';

export function verdictTitle(s,t=x=>x){
 if(s.death?.ordained)return t('You left for the temple at {a}.').replace('{a}',s.age);
 const turn=lifeArc(s)?.twist;
 return turn?t('Your life turned at age {n}.').replace('{n}',turn.age):t('You lived to age {n}.').replace('{n}',s.age);
}
// A life told as a story: how far it climbed, the one thing that broke it, and whether it came back.
// Read only from the record. A twist is the worst single five years, in mood, health and money together.
// An answer given at a review is written into that review's row (resolveEncounter), so the scene that
// broke a row is one met at that review or in the years just before it, never at the review before,
// and only one that cost wellbeing. If none did, the years did it: name nothing.
export function lifeArc(s,titleOf=()=>null){
 const rows=(s.history??[]).filter(r=>r.age>=10);if(rows.length<2)return null;
 const worth=r=>r.finance?netWorth(r.finance):r.cash??0;
 const score=(r,withMoney)=>r.wellbeing+r.health*.5+(withMoney?Math.sign(worth(r))*Math.log10(1+Math.abs(worth(r)))*3:0);
 // The household purse and the teenager's first personal purse are different accounts.
 const difference=(a,b)=>{const comparable=!!a.finance===!!b.finance;return score(b,comparable)-score(a,comparable);};
 let twist=null,drop=0;for(let i=1;i<rows.length;i++){const d=difference(rows[i],rows[i-1]);if(d>drop&&d>=6){drop=d;twist=i;}}
 const last=rows.at(-1),seenAt=a=>(s.story?.seen??[]).filter(e=>e.age>a-5&&e.age<=a&&(e.effects?.wellbeing??0)<=-4).sort((x,y)=>x.effects.wellbeing-y.effects.wellbeing)[0],points=rows.map(r=>({age:r.age,v:r.wellbeing}));
 if(twist===null)return {points,twist:null,peak:[...rows].sort((a,b)=>b.wellbeing-a.wellbeing)[0].age,end:last.age,back:null};
 const before=rows[twist-1],low=rows[twist],after=rows.slice(twist+1),best=after.length?Math.max(...after.map(r=>difference(before,r))):null,hit=seenAt(low.age);
 return {points,peak:before.age,twist:{age:low.age,what:hit?titleOf(hit.id):null},end:last.age,back:best===null?null:best>=0};
}
