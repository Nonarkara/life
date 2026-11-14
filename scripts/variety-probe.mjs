// Measures how different lives turn out, not just whether their choice strings differ.
// Run: node scripts/variety-probe.mjs [lives]
import {newLife,begin,live,configureLife,rand,COHORT_YEARS,CLASS_KEYS,AXES} from '../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../dist/course/encounters.js';
import {choiceAvailable} from '../dist/course/finance.js';
import {routeOf} from '../dist/course/life-routes.js';
import {pathOf} from '../dist/course/life-verdict.js';
const N=Number(process.argv[2]??600),count=(m,k)=>m.set(k,(m.get(k)??0)+1);
const cause=new Map(),path=new Map(),route=new Map(),deathAge=new Map(),wealth=new Map(),scenes=new Map(),climb=new Map();
const sets=[],nets=new Map();let metTotal=0;
const effortOf=seed=>{const p=Object.fromEntries(AXES.map(a=>[a.key,0]));for(let i=0;i<10;i++){const k=AXES[Math.floor(rand(seed,i,'eff')*5)].key;p[k]++;}return p;};
for(let i=1;i<=N;i++){
 const seed=i*7919+31,cls=CLASS_KEYS[i%CLASS_KEYS.length],birthYear=COHORT_YEARS[Math.floor(rand(seed,0,'cy')*(COHORT_YEARS.length-1))];
 let s=begin(configureLife(newLife(seed),{class:cls,sex:i%2?'female':'male',birthYear}));const met=new Set();
 const settle=()=>{for(let n=0;n<12;n++){const list=pendingPivots(s);if(!list.length)break;const q=list[0],open=openOptions(q,s),o=open[Math.floor(rand(seed,s.age,'fz'+q.id)*open.length)],next=applyPivot(s,q,o.id);if(next===s)break;s=next;}
  if(s.story?.pending){const e=encounterById(s.story.pending.id),open=e.options.filter(o=>choiceAvailable(s,o)),list=open.length?open:e.options,o=list[Math.floor(rand(seed,s.age,'fz'+e.id)*list.length)];met.add(e.id);s=resolveEncounter(s,o.id,rand(s.seed,s.age,'encounter-result'));}};
 settle();
 for(let g=0;g<30&&s.stage==='review'&&s.age<80;g++){s={...s,effort:effortOf(seed*31+g)};const next=live(s);if(next===s)break;s=next;settle();}
 count(cause,(s.death?.cause??'alive at '+s.age).slice(0,70));count(path,pathOf(s));count(route,routeOf(s)??'none');
 count(deathAge,s.death?Math.floor(s.death.age/10)*10:'80+');
 const net=(s.finance?.available??s.cash??0)+(s.finance?.reserve??0)-(s.finance?.debt??0);
 count(wealth,net<0?'debt':net<1e5?'<100k':net<1e6?'<1M':net<1e7?'<10M':'10M+');
 (nets.get(cls)??nets.set(cls,[]).get(cls)).push(net);
 count(climb,cls+'→'+(net<0?'debt':net<1e5?'<100k':net<1e6?'<1M':net<1e7?'<10M':'10M+'));
 for(const id of met)count(scenes,id);metTotal+=met.size;sets.push(met);
}
let j=0,pairs=0;for(let a=0;a<sets.length;a+=7)for(let b=a+1;b<sets.length;b+=13){const A=sets[a],B=sets[b];let I=0;for(const x of A)if(B.has(x))I++;const U=A.size+B.size-I;if(U){j+=I/U;pairs++;}}
const top=(m,n=12)=>[...m].sort((a,b)=>b[1]-a[1]).slice(0,n).map(([k,v])=>`${v}\t${k}`).join('\n');
console.log('LIVES',N,'scenes/life',(metTotal/N).toFixed(1),'distinct scenes',scenes.size,'mean overlap (jaccard)',(j/pairs).toFixed(2));
console.log('\nCAUSE\n'+top(cause));console.log('\nPATH\n'+top(path));console.log('\nDEATH DECADE\n'+top(deathAge));
console.log('\nNET WORTH\n'+top(wealth));for(const [c,v] of nets){v.sort((a,b)=>a-b);const q=f=>Math.round(v[Math.floor(f*(v.length-1))]/1000)+'k';console.log('NET',c,'p10',q(.1),'p50',q(.5),'p90',q(.9));}
console.log('\nCLASS→WEALTH\n'+top(climb,30));console.log('\nROUTE\n'+top(route,15));console.log('\nMOST COMMON SCENES\n'+top(scenes,15));
