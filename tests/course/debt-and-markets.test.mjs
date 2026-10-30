import {test} from 'node:test';import assert from 'node:assert/strict';
import {createEconomy,economyYears,validEconomy} from '../../dist/course/economy.js';
import {ENCOUNTERS,encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {netWorth,choiceAvailable} from '../../dist/course/finance.js';
import {newLife,begin,live} from '../../dist/course/sim.js';
// After a downturn, version 2 worlds sometimes stay flat for years; version 1 saves keep the old path.
test('some crashes are followed by a lost decade and old worlds are unchanged',()=>{
 const after=w=>{const out=[];for(let seed=1;seed<=80;seed++){const rows=economyYears({...w(seed)},80);rows.forEach((r,i)=>{if(i>0&&rows[i-1].growth<0&&r.growth>=0)out.push(r.equity);});}return out.reduce((n,x)=>n+x,0)/out.length;};
 const v2=after(seed=>createEconomy(seed)),v1=after(seed=>({...createEconomy(seed),version:1}));
 assert.ok(v2<v1-.01,`${v2} vs ${v1}`);assert.ok(validEconomy({...createEconomy(5),version:1})&&validEconomy(createEconomy(5)));
});
test('debt costs interest and the crisis question appears only for large debt',()=>{
 const e=ENCOUNTERS.find(x=>x.id==='m_debt');assert.ok(e);
 assert.ok(!e.eligible({finance:{debt:100000}})&&e.eligible({finance:{debt:600000}}));
 let base=begin(newLife(3));while(base.age<30){base=live(base);if(base.story?.pending){const o=encounterById(base.story.pending.id).options.filter(o=>choiceAvailable(base,o));base=resolveEncounter(base,o[0].id,.2);}}
 const run=debt=>live({...base,finance:{...base.finance,debt}});
 const cost=f=>f.receipts.filter(r=>r.kind==='period').at(-1).essential,extra=cost(run(400000).finance)-cost(run(0).finance);
 assert.equal(extra,Math.round(400000*.35),'a 400k debt adds its interest to the period costs');
});
