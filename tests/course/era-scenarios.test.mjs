import test from 'node:test';import assert from 'node:assert/strict';
import {ERA_SCENARIOS,ERA_ENCOUNTERS,SHIPPED_SCENARIOS,PENDING_SCENARIOS,SOURCE_MEANING,sourceLabel,eraScenariosFor,calendarYear} from '../../dist/course/era-scenarios.js';
import {ENCOUNTERS,encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {newLife,begin,live,validate,configureLife} from '../../dist/course/sim.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {phrases} from '../../dist/course/translations.js';

const dict=new Map(phrases.map(r=>[r[0],r]));

test('every scene carries its source key and what the key means',()=>{
 for(const scene of ERA_SCENARIOS){
  assert.ok(['R','S','I'].includes(scene.source),scene.id);
  assert.ok(SOURCE_MEANING[scene.source],scene.id);
  assert.ok(scene.sourceNote&&scene.sourceNote.length>4,scene.id);
  assert.ok(sourceLabel(scene.sourceNote).length>4,scene.id);
 }
});

test('a scene has an era window, an age window and a small object',()=>{
 for(const scene of ERA_SCENARIOS){
  assert.ok(scene.era&&Number.isInteger(scene.era.from)&&Number.isInteger(scene.era.to)&&scene.era.from<=scene.era.to,scene.id);
  assert.ok(scene.era.basis&&['stated','rural','approx'].includes(scene.era.basis),scene.id);
  assert.ok(scene.ages&&scene.ages[0]<=scene.ages[1],scene.id);
  assert.ok(scene.object&&scene.object.length>3,scene.id);
 }
});

test('every option names a cost on a person and never a moral',()=>{
 for(const scene of ERA_SCENARIOS){
  assert.ok(scene.options.length>=2&&scene.options.length<=4,scene.id);
  for(const option of scene.options){
   assert.ok(option.cost&&option.cost.length>10,scene.id+'/'+option.id);
   // The cost is on somebody, not a verdict on the player.
   assert.ok(!/should|must|wrong|right|good|bad|obligation/i.test(option.cost),scene.id+'/'+option.id);
   assert.ok(option.outcome&&option.outcome.length>10,scene.id+'/'+option.id);
  }
 }
});

test('no scene is offered twice and no id is duplicated',()=>{
 const ids=ERA_SCENARIOS.map(s=>s.id);
 assert.equal(new Set(ids).size,ids.length);
 const shipped=ERA_ENCOUNTERS.map(e=>e.id);
 assert.equal(new Set(shipped).size,shipped.length);
});

test('the shipped set and the pending set partition the bank',()=>{
 const all=ERA_SCENARIOS.map(s=>s.id).sort();
 assert.deepEqual([...SHIPPED_SCENARIOS,...PENDING_SCENARIOS].sort(),all);
 assert.equal(new Set([...SHIPPED_SCENARIOS,...PENDING_SCENARIOS]).size,all.length);
 // An inferred scene is never shipped: it needs its source checked first.
 for(const scene of ERA_SCENARIOS)if(scene.source==='I')assert.ok(!SHIPPED_SCENARIOS.includes(scene.id),scene.id);
});

test('every shipped scene has copy in all five languages',()=>{
 for(const id of SHIPPED_SCENARIOS){
  const scene=ERA_SCENARIOS.find(s=>s.id===id);
  const texts=[scene.title,scene.prompt,scene.context,sourceLabel(scene.sourceNote),
   ...scene.options.flatMap(o=>[o.label,o.cost,o.outcome])];
  for(const text of texts){
   const row=dict.get(text);
   assert.ok(row,id+': missing '+text);
   assert.equal(row.length,5,id);
   assert.ok(row.every(x=>String(x).trim()),id+': '+text);
  }
 }
});

test('a scene is only offered in the years it belongs to',()=>{
 const state={...newLife(7),intake:{sex:'female',class:'middle',country:'TH',birthYear:1949,attributes:{}},birth:{...newLife(7).birth,birthYear:1949}};
 // 1949 + 20 = 1969, inside the window of the scenes that were written for it.
 const offerable=eraScenariosFor({...state,age:20,story:{seen:[]}},20);
 assert.ok(offerable.length>0,'a 1949 life should meet a scene in 1969');
 for(const scene of offerable)assert.ok(1969>=scene.era.from&&1969<=scene.era.to,scene.id);
 // A 1981 life in 1969 could not have been there, and the era check keeps it out.
 const born1981={...state,intake:{...state.intake,birthYear:1981},birth:{...state.birth,birthYear:1981}};
 assert.equal(eraScenariosFor({...born1981,age:20,story:{seen:[]}},20).length,0);
});

test('a scene is not offered twice, and its echo returns decades later',()=>{
 const state={...newLife(3),intake:{sex:'female',class:'middle',country:'TH',birthYear:1949,attributes:{}},birth:{...newLife(3).birth,birthYear:1949}};
 const first=eraScenariosFor({...state,age:30,story:{seen:[]}},30);
 assert.ok(first.length>0);
 const seen={seen:[{id:first[0].id,age:30,choice:first[0].options[0].id,outcome:'x',effects:{cash:0,health:0,wellbeing:0,skills:{}}}]};
 assert.ok(!eraScenariosFor({...state,age:30,story:seen},30).some(s=>s.id===first[0].id));
 // The echo: two scenes carry a later consequence that returns in another shape.
 const echoed=ERA_SCENARIOS.filter(s=>s.options.some(o=>(o.later??[]).length));
 assert.ok(echoed.length>=2,'the bank asks for echoes across decades');
 for(const scene of echoed)for(const option of scene.options)for(const later of option.later??[]){
  assert.ok(later.after>=10,'the echo returns decades later, not next year');
  assert.ok(later.text&&later.text.length>10,scene.id);
 }
});

test('an era scene resolves like any other encounter and keeps the record',()=>{
 const scene=ERA_ENCOUNTERS.find(e=>e.id==='sc_letter_home');
 const entry=encounterById(scene.id);
 assert.equal(entry.id,scene.id);
 // Walk real lives until the scene is offered, so the record is a real one.
 let found=null;
 for(let seed=1;seed<=40&&!found;seed++){
  let s=begin(configureLife(newLife(seed),{birthYear:1949}));
  for(let step=0;step<16&&s.stage!=='recap'&&!found;step++){
   const pending=s.story?.pending;
   if(!pending){s=live(s);continue;}
   const options=encounterById(pending.id).options.filter(o=>choiceAvailable(s,o));
   const next=resolveEncounter(s,options[0]?.id,.5);
   if(pending.id===scene.id)found=next;
   s=next;
  }
 }
 assert.ok(found,'the scene should be offered to a 1949 life in its years');
 assert.equal(found.story.seen.at(-1).id,scene.id);
 assert.ok(found.story.seen.at(-1).outcome.length>5);
 assert.ok(validate(found),'the resolved life must still validate');
});

test('the scene is offered in the years it belongs to, and the offerer knows it',()=>{
 // A 1949 life meets these in 1969 and the 1981 cohort does not.
 const base=newLife(5);
 const life1949={...base,intake:{sex:'female',class:'middle',country:'th',birthYear:1949,attributes:base.attributes},birth:{...base.birth,birthYear:1949},story:{seen:[]}};
 const life1981={...base,intake:{sex:'female',class:'middle',country:'th',birthYear:1981,attributes:base.attributes},birth:{...base.birth,birthYear:1981},story:{seen:[]}};
 const in1969=ERA_ENCOUNTERS.filter(e=>e.eligible({...life1949,age:20})).map(e=>e.id);
 const also1969=ERA_ENCOUNTERS.filter(e=>e.eligible({...life1981,age:20})).map(e=>e.id);
 assert.ok(in1969.length>0,'a 1949 life in 1969 meets a scene');
 assert.deepEqual(also1969,[],'a 1981 life was not there in 1969');
 // And the same scene is reachable later, when the years suit it.
 const in1989=ERA_ENCOUNTERS.filter(e=>e.eligible({...life1949,age:40})).map(e=>e.id);
 assert.ok(in1989.length>0,'the same life meets a scene in 1989');
});

test('the disclosure names the source and its key, and no source means no cameo',()=>{
 for(const scene of ERA_ENCOUNTERS){
  assert.ok(scene.sourceKey,'a scenario must say where it came from');
  assert.ok(scene.lesson&&scene.lesson.length>20);
  assert.ok(scene.sourceNote);
  // No scene may name a living or real person.
  assert.ok(!/\bMitr\b|\bking\b|\bQueen\b|ประเทศในพระบาทสมเด็จ/.test(scene.prompt+' '+scene.title),scene.id);
 }
});
