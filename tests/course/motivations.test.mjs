import test from 'node:test';import assert from 'node:assert/strict';
import {newLife,begin,live as liveAll,sanitiseProfile,validate,rand} from '../../dist/course/sim.js';
import {offerEncounter,resolveEncounter} from '../../dist/course/encounters.js';
// The authored story without the blog and money lessons, with the same seeded roll.
const live=s=>{const n=liveAll(s);if(!/^[lm]_/.test(n.story?.pending?.id??''))return n;return offerEncounter({...n,story:{...n.story,pending:null}},rand(n.seed,n.age,'encounter'),e=>!/^[lm]_/.test(e.id));};

import {FOCUSES,FOCUS_HINTS,focusEvidence} from '../../dist/course/motivations.js';
import {translate} from '../../dist/course/i18n.js';
test('legacy profiles remain valid and unknown focus cannot masquerade as a saved focus',()=>{
 const old=begin(newLife(1));assert.ok(validate(old));assert.equal(sanitiseProfile(old.profile,20).focus,undefined);
 assert.equal(validate({...old,profile:{...old.profile,focus:'genius'}}),false);
 assert.ok(validate({...old,profile:{...old.profile,focus:'none'}}));
});
test('focus records intention without granting resources, skills or innate attributes',()=>{
 const s=begin(newLife(1)),plain=live(s);
 for(const focus of Object.keys(FOCUSES)){
  const next=live({...s,profile:{...s.profile,focus}});assert.ok(validate(next));
  for(const key of ['cash','health','wellbeing','skills','attributes','finance'])assert.deepEqual(next[key],plain[key]);
  assert.equal(next.history.at(-1).profile.focus,focus);
 }
});
test('evidence uses the recorded chapter focus, not a subsequently edited intention',()=>{
 const s=live({...begin(newLife(1)),profile:{...newLife(1).profile,focus:'growth'}});
 const changed={...s,profile:{...s.profile,focus:'security'}};
 assert.equal(focusEvidence(changed).focus,'growth');assert.match(focusEvidence(s).text,/2 game points/);
});
test('social evidence records actual shared choices, with no credit for an unanswered invitation',()=>{
 const pending=live({...begin(newLife(1)),profile:{...newLife(1).profile,focus:'connection'}});
 assert.match(focusEvidence(pending).text,/: 0\./);
 const shared=resolveEncounter(pending,'together',.1);assert.match(focusEvidence(shared).text,/: 1\./);
 assert.match(focusEvidence(resolveEncounter(pending,'home',.1)).text,/: 0\./);
});
test('security evidence refuses to invent pre-account wealth',()=>{
 const s=live({...begin(newLife(1)),profile:{...newLife(1).profile,focus:'security'}});
 assert.match(focusEvidence(s).text,/No comparable/);
 assert.equal(focusEvidence(begin(newLife(1))),null);
});
test('each focus and evidence phrase has all four native-language mappings',()=>{
 const texts=[...Object.values(FOCUSES),...Object.values(FOCUS_HINTS),'What matters most in this chapter?','No particular focus','Chapter focus','Last chapter','About these six needs','Personal net worth changed by ฿123.','New routes or projects recorded: 2.','Public work or mentoring moments: 1.','Shared moments recorded: 1.','Reasoning practice gained: 5 game points.','Helping or teaching moments: 0.'];
 for(const language of ['th','zh-CN','ja','ko'])for(const text of texts)assert.notEqual(translate(text,language),text,language+': '+text);
});
