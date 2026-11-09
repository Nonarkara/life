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

export const VERDICT_TITLE={monk:'You left for the temple at {a}.',fun:'You had the fun life, and it was insanely risky.',safe:'You had the safe life.'};
export const verdictTitle=(s,t=x=>x)=>t(VERDICT_TITLE[pathOf(s)]).replace('{a}',s.death?.age??s.age);
// A life told as a story: how far it climbed, the one thing that broke it, and whether it came back.
// Read only from the record. A twist is the worst single five years, in mood, health and money together.
export function lifeArc(s,titleOf=()=>null){
 const rows=(s.history??[]).filter(r=>r.age>=10);if(rows.length<2)return null;
 const worth=r=>r.finance?netWorth(r.finance):r.cash??0,score=r=>r.wellbeing+r.health*.5+Math.sign(worth(r))*Math.log10(1+Math.abs(worth(r)))*3;
 let twist=null,drop=0;for(let i=1;i<rows.length;i++){const d=score(rows[i-1])-score(rows[i]);if(d>drop&&d>=6){drop=d;twist=i;}}
 const last=rows.at(-1),seenAt=a=>(s.story?.seen??[]).filter(e=>e.age>=a-5&&e.age<=a).sort((x,y)=>(y.effects?.wellbeing??0)<(x.effects?.wellbeing??0)?1:-1)[0],points=rows.map(r=>({age:r.age,v:r.wellbeing}));
 if(twist===null)return {points,twist:null,peak:[...rows].sort((a,b)=>b.wellbeing-a.wellbeing)[0].age,end:last.age,back:null};
 const before=rows[twist-1],low=rows[twist],after=rows.slice(twist+1),best=after.length?Math.max(...after.map(score)):null,hit=seenAt(low.age);
 return {points,peak:before.age,twist:{age:low.age,what:hit?titleOf(hit.id):null},end:last.age,back:best===null?null:best>=score(before)};
}
