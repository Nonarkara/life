import {test} from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live} from '../../dist/course/sim.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
// Variety guard (REBUILD-STRATEGY.md step 0). Ceilings are a ratchet: lower them as the deck grows, never raise them.
const N=120,MAX_SHARE=.75,MIN_DISTINCT=.95;
test('lives are asked different questions, and no scene is in nearly every life',()=>{
 const seqs=new Set(),count={};
 for(let seed=1;seed<=N;seed++){
  let s=begin(newLife(seed*7919)),q=[];
  while(s.stage==='review'&&s.age<80){
   s=live(s);if(s.stage!=='review')break;
   for(const p of pendingPivots(s)){q.push(p.id);const o=openOptions(p,s)[0];if(o)s=applyPivot(s,p,o.id);}
   const ps=s.story?.pending;if(ps){q.push(ps.id);s=resolveEncounter(s,encounterById(ps.id).options.find(o=>choiceAvailable(s,o)).id,.2);}
  }
  seqs.add(q.join('>'));for(const id of new Set(q))count[id]=(count[id]??0)+1;
 }
 assert.ok(seqs.size>=N*MIN_DISTINCT,'distinct question sequences '+seqs.size+'/'+N);
 const worst=Object.entries(count).sort((a,b)=>b[1]-a[1])[0];
 assert.ok(worst[1]<=N*MAX_SHARE,worst[0]+' is in '+worst[1]+'/'+N+' lives');
});
import {ENCOUNTERS} from '../../dist/course/encounters.js';
test('every encounter opens with an option that costs nothing',()=>{for(const e of ENCOUNTERS){const o=e.options[0];assert.ok(!(o.cash<0)&&!o.requires,e.id);}});
import {MOMENT_TEXTS} from '../../dist/course/moments.js';
import {phrases} from '../../dist/course/translations.js';
test('every chapter moment has its own row in all four languages',()=>{const rows=new Map(phrases.map(r=>[r[0],r]));for(const m of MOMENT_TEXTS){const r=rows.get(m);assert.ok(r&&r.length===5&&r.slice(1).every(v=>v&&v!==m),m);}});

import {configureLife,validate} from '../../dist/course/sim.js';
test('a 1949 life meets its history, and each life meets a different one',()=>{
 const seqs=new Set(),count={};let history=0,total=0;
 for(let seed=1;seed<=N;seed++){
  let s=begin(configureLife(newLife(seed*104729),{birthYear:1949})),q=[];
  while(s.stage==='review'&&s.age<80){
   s=live(s);if(s.stage!=='review')break;
   for(const p of pendingPivots(s)){q.push(p.id);const os=openOptions(p,s),o=os[seed%os.length];if(o)s=applyPivot(s,p,o.id);}
   const ps=s.story?.pending;if(ps){q.push(ps.id);const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,os[seed%os.length].id,.2);}
  }
  seqs.add(q.join('>'));for(const id of new Set(q))count[id]=(count[id]??0)+1;total+=1;history+=q.filter(id=>id.startsWith('h_')).length;
 }
 assert.ok(seqs.size>=N*MIN_DISTINCT,'distinct '+seqs.size);
 assert.ok(history/total>=5,'history scenes per life '+history/total);
 for(const id of ['m_kits','m_funds'])assert.equal(count[id]??0,0,id+' before its time');
 const worst=Object.entries(count).sort((a,b)=>b[1]-a[1])[0];assert.ok(worst[1]<=N*.9,worst[0]+' is in '+worst[1]+'/'+N);
});

test('every 1949 life can be saved and reopened after every answer',()=>{
 const ok=s=>validate(JSON.parse(JSON.stringify(s)));
 for(let seed=1;seed<=60;seed++){let s=begin(configureLife(newLife(seed*7919),{birthYear:1949}));
  while(s.stage==='review'&&s.age<80){s=live(s);assert.ok(ok(s),'after live '+s.age);if(s.stage!=='review')break;
   for(const p of pendingPivots(s)){const os=openOptions(p,s),o=os[seed%os.length];if(o)s=applyPivot(s,p,o.id);assert.ok(ok(s),p.id+'/'+o?.id);}
   const ps=s.story?.pending;if(ps){const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o)),c=os[seed%os.length];s=resolveEncounter(s,c.id,(seed%10)/100);assert.ok(ok(s),ps.id+'/'+c.id);}
  }}
});
