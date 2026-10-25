import {choiceAvailable} from '../../dist/course/finance.js';
import {test} from 'node:test';import assert from 'node:assert/strict';
import {LESSONS,consequencesDue} from '../../dist/course/lessons.js';
import {ENCOUNTERS,encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {newLife,configureLife,begin,live,validate} from '../../dist/course/sim.js';
import {eventsFor} from '../../dist/course/events.js';
// Like a player, take the first option this life can afford.
const settle=s=>s.story?.pending?resolveEncounter(s,encounterById(s.story.pending.id).options.find(o=>choiceAvailable(s,o)).id,.2):s;
const to=(s,age)=>{while(s.age<age&&s.stage==='review')s=settle(live(settle(s)));return settle(s);};
test('every blog lesson is a playable decision with a source, a free first option and its own id',()=>{assert.ok(LESSONS.length>=23);for(const l of LESSONS){assert.ok(ENCOUNTERS.includes(l));assert.match(l.source,/^https:\/\/nonharvard\.wordpress\.com\//);assert.ok(l.lesson.length>20);assert.ok((l.options[0].cash??0)>=0,l.id);assert.ok(l.min>=18&&l.max<=70);for(const o of l.options)for(const c of o.later)assert.ok((c.after>=5||c.at>l.max)&&c.text,l.id+'/'+o.id);}assert.equal(new Set(ENCOUNTERS.map(e=>e.id)).size,ENCOUNTERS.length);});
test('the gravest choices stop time',()=>{for(const id of ['l_pension','l_funeral','l_early_family','l_borrow','l_bond','l_phd','l_boss','l_bottom'])assert.equal(LESSONS.find(l=>l.id===id).stop,true,id);});
test('a past choice returns once, in the period it falls due, on the timeline and in the costs',()=>{
 let s=live(to(begin(configureLife(newLife(21),{upbringing:'middle'})),20));assert.ok(!s.story.seen.some(e=>e.id==='l_less'));
 s={...s,story:{...s.story,pending:{id:'l_less',age:25,candidates:['l_less']}}};s=resolveEncounter(s,'upgrade',.2);assert.equal(s.story.seen.at(-1).id,'l_less');assert.ok(validate(s));
 assert.equal(consequencesDue(s,25,34).length,0);assert.equal(consequencesDue(s,30,35).length,1);assert.equal(consequencesDue(s,35,40).length,0);
 const next=to(s,35);const row=next.history.find(r=>r.age===35);assert.ok(row.consequences?.some(c=>c.lesson==='l_less'));assert.match(row.event,/Fixed costs locked in/);assert.ok(eventsFor(row).some(e=>e.type==='consequence'));
 const receipt=next.finance.receipts.find(r=>r.kind==='period'&&r.age===35);assert.ok(receipt.essential>=70000,'the consequence shows on the balance sheet');assert.ok(validate(JSON.parse(JSON.stringify(next))));
});
test('conditions decide which consequence happens: a trip saved for comes too late if the parent has died',()=>{const l=LESSONS.find(x=>x.id==='l_parent_trip'),later=l.options.find(o=>o.id==='later').later;for(const seed of [1,2,3,4,5,6])assert.equal(later.filter(c=>c.when({seed})).length,1);assert.match(later.find(c=>c.when({seed:3})).text,/never happened/);assert.match(later.find(c=>c.when({seed:1})).text,/took your parent/);});
test('complete lives with lessons stay valid and every returned consequence is recorded once',()=>{for(let seed=1;seed<=40;seed++){let s=to(begin(configureLife(newLife(seed))),80);assert.ok(validate(JSON.parse(JSON.stringify(s))),'seed '+seed);const all=s.history.flatMap(r=>r.consequences??[]);assert.equal(new Set(all.map(c=>c.lesson+c.choice+c.age+c.text)).size,all.length);}});
