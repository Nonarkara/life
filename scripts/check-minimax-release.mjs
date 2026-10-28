import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(new URL('../review/minimax-final/'+name,import.meta.url)));
const {cases,languages}=read('geometry.json');
for(const c of [...cases,...languages]){
 const id=c.name??c.locale;
 assert.ok(c.plan&&c.set&&c.action&&c.deck,id+': gameplay must be loaded');
 assert.equal(c.pageW,c.w,id+': horizontal page bleed');assert.equal(c.pageH,c.h,id+': vertical page bleed');
 assert.equal(c.panels.length,6,id+': retained instrument panels');
 assert.ok(c.set.bottom<=c.plan.bottom+1,id+': complete edit/result/disclosure group must fit');
 assert.ok(c.action.h>=32&&c.action.bottom<=c.h,id+': action must fit');
 assert.ok(c.action.x>=0&&c.action.x+c.action.w<=c.w,id+': action horizontal containment');
 if(c.w<1280){assert.equal(c.nav.selected,'console-plan');assert.equal(c.nav.nearest,'console-plan');assert.equal(c.plan.x,0);}
 else assert.notEqual(c.nav.selected,'console-plan',id+': a hidden Plan tab must not blank the reader');
}
const proof=read('geometry-proof.json');
assert.equal(proof.current.pageH,proof.current.h);assert.ok(proof.current.set.bottom<=proof.current.plan.bottom);
assert.ok(proof.negative.pageH>proof.negative.h);assert.ok(proof.negative.set.bottom>proof.negative.plan.bottom,'restored original geometry must fail the same task gate');
const old=read('navigation-before.json');assert.notEqual(old.nearest,old.selected,'observed inherited navigation must fail');
for(const n of read('navigation-after.json'))assert.equal(n.nearest,n.selected,n.action);
console.log('PASS: five viewport/text cases, four native cases, navigation, and restored geometry failure.');
