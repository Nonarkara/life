import {test} from 'node:test';import assert from 'node:assert/strict';
import {choiceAvailable} from '../../dist/course/finance.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {newLife,configureLife,begin,live,validate} from '../../dist/course/sim.js';
const lives=lean=>{const out=[];for(let seed=1;seed<=60;seed++){let s=begin(configureLife(newLife(seed),{})),at=null;
 while(s.age<80&&s.stage==='review'){if(lean)s={...s,effort:{physique:6,iq:0,eq:2,craft:0,drive:2}};s=live(s);if(s.story?.pending){const e=encounterById(s.story.pending.id);s=resolveEncounter(s,e.options.filter(o=>choiceAvailable(s,o))[0].id,.2);}if(s.age===70&&!s.death)at=s;}
 assert.ok(validate(s));if(at)out.push(at);}return out;};
const mean=a=>a.reduce((n,x)=>n+x,0)/a.length;
// Old age has a shape: a trained body lasts longer, and a failing body takes mood with it.
test('training protects the body and late mood follows health',()=>{
 const plain=lives(false),trained=lives(true);
 assert.ok(mean(trained.map(s=>s.health))>mean(plain.map(s=>s.health))+5);
 const sick=plain.filter(s=>s.health<30),well=plain.filter(s=>s.health>=50);
 assert.ok(sick.length>2&&well.length>2);assert.ok(mean(sick.map(s=>s.wellbeing))<mean(well.map(s=>s.wellbeing))-3);
});
