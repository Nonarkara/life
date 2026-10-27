import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(new URL('../review/deck-release/'+name,import.meta.url)));
const {cases,languages}=read('geometry.json'),proof=read('geometry-proof.json');
for(const v of [...cases,...languages]){
 assert.equal(v.pageW,v.w,`${v.name??v.locale}: horizontal overflow`);
 assert.equal(v.pageH,v.h,`${v.name??v.locale}: page overflow`);
 assert.equal(v.panels.length,6);
 assert.equal(v.boardVisible,false,'Detailed You board must not duplicate the cockpit');
 assert.ok(v.action.h>=32,'Main action too small');
 assert.ok(v.action.bottom<=v.h,'Main action offscreen');
 if(v.w>=1024){assert.equal(v.columns.split(' ').length,2);assert.ok(v.deck.bottom<=v.panel.bottom,'Six panels must fit the laptop task pane');}
 else {assert.ok(v.panels[0].name.includes('deck-set'),'Phone decision must precede monitoring');assert.ok(v.edit.bottom<=v.panel.bottom,'Complete first decision group must fit');}
}
assert.ok(proof.current.deck.bottom<=proof.current.panel.bottom);
assert.ok(proof.negative.deck.bottom>proof.negative.panel.bottom,'Restored 310px dock must fail the same gate');
assert.equal(proof.current.w,proof.negative.w);
assert.equal(proof.current.h,proof.negative.h);
console.log('Geometry: five viewport/text cases, four language cases, and restored failure verified.');
