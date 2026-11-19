import test from 'node:test';
import assert from 'node:assert/strict';
import {ROUTE_DATA} from '../../dist/course/route-data.js';
import {newLife,begin,live,configureLife,CLASS_KEYS} from '../../dist/course/sim.js';
import {COHORT_YEARS} from '../../dist/course/thai-history.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';

test('all 26 routes and all 113 authored route scenes are reachable across cohort-balanced lives',()=>{
 const eras=COHORT_YEARS.filter(y=>y<2026);
 const reached=new Set();
 for(let i=0;i<1100;i++){
  const birthYear=eras[i%eras.length];
  const cls=CLASS_KEYS[Math.floor(i/eras.length)%CLASS_KEYS.length];
  const sex=(i+Math.floor(i/eras.length))%2?'female':'male';
  const mode=(i+Math.floor(i/eras.length))%4; // 0: stage-1 continue then branch at stage-2, 1-2: full route, 3: early branch
  let s=begin(configureLife(newLife((i+1)*7919),{birthYear,class:cls,sex}));
  for(let step=0;step<18&&s.stage==='review';step++){
   for(const p of pendingPivots(s)){
    const os=openOptions(p,s);
    s=applyPivot(s,p,os[(i*7+step*3)%os.length].id);
   }
   if(s.story?.pending){
    const id=s.story.pending.id;
    reached.add(id);
    const e=encounterById(id);
    const os=e.options.filter(o=>choiceAvailable(s,o));
    const isStage2=id.endsWith('_2')||id==='r_singer_office_1';
    const wantAlt=(mode===0&&isStage2)||(mode===3);
    const cont=!wantAlt?os.find(o=>o.flag&&o.flag.startsWith('r_')):null;
    const alt=wantAlt?os.find(o=>!o.flag||!o.flag.startsWith('r_')||o.id==='sing'):null;
    const pick=cont??alt??os[(i+step)%os.length];
    s=resolveEncounter(s,pick.id,0.5);
   }
   s=live(s);
  }
 }
 const missing=ROUTE_DATA.flatMap(r=>r.scenes.filter(sc=>!reached.has(sc.id)).map(sc=>`${r.route}:${sc.id}`));
 assert.deepEqual(missing,[],'every authored route scene should be reachable');
});
