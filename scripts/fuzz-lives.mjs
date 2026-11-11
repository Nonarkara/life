// Plays every class x sex x cohort many times by the game's own rules and reports what broke:
// thrown errors, invalid saves, lives that never end, dated scenes met in the wrong year, routes nobody can finish.
// The run is fully seeded, so a gate here cannot flake: if it passes once it passes until the code changes.
// Cells with no route are reported, not failed: the 2026 cohort has none on purpose (SCENARIOS.md rule 11).
// Run: node scripts/fuzz-lives.mjs [seeds per cell]   (exit 1 on any hard failure)
import {newLife,begin,live,configureLife,rand,validate,COHORT_YEARS} from '../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../dist/course/encounters.js';
import {choiceAvailable} from '../dist/course/finance.js';
import {routeOf} from '../dist/course/life-routes.js';
import {ROUTE_DATA} from '../dist/course/route-data.js';
import {CLASS_KEYS} from '../dist/course/sim.js';
const N=Number(process.argv[2]??40),SEXES=['female','male'];
const errors=[],wrongYear=[],cells=new Map(),stageSeen=new Map(),routeLives=new Map();
const sceneOf=new Map(ROUTE_DATA.flatMap(r=>r.scenes.map(sc=>[sc.id,{r,sc}])));
let lives=0,unfinished=0,invalid=0;
for(const cls of CLASS_KEYS)for(const sex of SEXES)for(const birthYear of COHORT_YEARS){
 const key=cls+'/'+sex+'/'+birthYear,sets=new Set(),routes=new Set();
 for(let i=1;i<=N;i++){
  // The seed must differ per class x sex x cohort cell, or all six class/sex cells of a
  // cohort replay the identical random stream and "5400 lives" are only 540 lives six times.
  const cell=CLASS_KEYS.indexOf(cls)*2+SEXES.indexOf(sex);
  const seed=i*7919+birthYear+104729*cell;lives++;let s;const met=[];
  try{
   s=begin(configureLife(newLife(seed),{class:cls,sex,birthYear}));
   const settle=()=>{for(let n=0;n<12;n++){const list=pendingPivots(s);if(!list.length)break;const q=list[0],open=openOptions(q,s),o=open[Math.floor(rand(seed,s.age,'fz'+q.id)*open.length)],next=applyPivot(s,q,o.id);if(next===s)break;s=next;met.push(q.id+':'+o.id);}
    if(s.story?.pending){const e=encounterById(s.story.pending.id),open=e.options.filter(o=>choiceAvailable(s,o)),list=open.length?open:e.options,o=list[Math.floor(rand(seed,s.age,'fz'+e.id)*list.length)];
     const hit=sceneOf.get(e.id);if(hit){stageSeen.set(e.id,(stageSeen.get(e.id)??0)+1);const era=hit.sc.era;if(era&&!(birthYear+s.age+4>=era[0]&&birthYear+s.age<=era[1]))wrongYear.push(e.id+' at '+(birthYear+s.age));}
     s=resolveEncounter(s,o.id,rand(s.seed,s.age,'encounter-result'));met.push(e.id+':'+o.id);}};
   settle();
   for(let g=0;g<30&&s.stage==='review'&&s.age<80;g++){const next=live(s);if(next===s)break;s=next;settle();}
   if(s.stage==='review'&&s.age<80)unfinished++;
   if(!validate(s))invalid++;
   const r=routeOf(s);if(r){routes.add(r);routeLives.set(r,(routeLives.get(r)??0)+1);}
   sets.add(met.join(' '));
  }catch(e){errors.push(key+' seed '+seed+' age '+(s?.age)+': '+e.message);}
 }
 cells.set(key,{distinct:sets.size,routes:[...routes]});
}
const noRoute=[...cells].filter(([,c])=>!c.routes.length).map(([k])=>k),same=[...cells].filter(([,c])=>c.distinct<N).map(([k,c])=>k+' '+c.distinct+'/'+N);
const dead=ROUTE_DATA.flatMap(r=>r.scenes.filter(sc=>!stageSeen.get(sc.id)).map(sc=>sc.id));
if(process.argv[3])console.log(ROUTE_DATA.map(r=>r.route+" "+r.scenes.map(sc=>stageSeen.get(sc.id)??0).join(">")).join("\n"));
console.log(JSON.stringify({lives,errors:errors.length,invalid,unfinished,wrongYear:wrongYear.length,cellsWithoutRoute:noRoute,cellsWithRepeatLives:same,routeScenesNeverMet:dead,routeLives:Object.fromEntries(routeLives)},null,1));
for(const e of errors.slice(0,10))console.log('ERROR',e);for(const w of [...new Set(wrongYear)].slice(0,10))console.log('WRONG YEAR',w);
// A scene nobody meets is authored content the player can never reach; a cell whose lives all
// repeat is the variety law broken. Both are deterministic here, so both are hard failures.
for(const d of dead)console.log('NEVER MET',d);for(const s of same)console.log('REPEAT LIFE',s);
if(errors.length||invalid||unfinished||wrongYear.length||dead.length||same.length)process.exit(1);
