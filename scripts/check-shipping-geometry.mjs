// Consume browser-observed rectangles. Capturing the real UI remains mandatory.
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const root=new URL('../review/shipping-oct27/',import.meta.url),cases=JSON.parse(readFileSync(new URL('geometry.json',root)));
const expected={'phone-default':[390,844],'tablet-default':[1024,768],'desktop-default':[1440,900],'working-viewport':[1280,720],'working-expanded':[1280,720],'phone-thai-extra':[390,844],'breakpoint-720':[720,844],'breakpoint-721':[721,844]};
for(const [name,[w,h]]of Object.entries(expected)){
 const c=cases.find(c=>c.case===name);assert.ok(c,`missing ${name}`);assert.equal(c.w,w);assert.equal(c.h,h);assert.equal(c.pageW,w);assert.equal(c.pageH,h);
 assert.ok(c.action.y>=0&&c.action.bottom<=h&&c.action.h>=32,`${name}: primary action visible`);
 assert.equal(c.rowHeights.length,5);assert.ok(c.rowHeights.every(v=>v>=28),`${name}: readable control rows`);
 if(name==='phone-default'){assert.ok(c.projection.bottom<=c.panel.bottom,'complete forecast above scrolling edge');assert.ok(c.action.y-c.projection.bottom<=24,'forecast and action stay together');}
 if(['tablet-default','desktop-default','working-viewport','breakpoint-721'].includes(name)){assert.ok(c.reader.w<=310,'plan dock width fits content');assert.ok(c.projection.bottom<=c.panel.bottom,'default forecast visible');}
}
const proof=JSON.parse(readFileSync(new URL('geometry-falsification.json',root)));
const gate=c=>c.projection.bottom<=c.panel.bottom&&c.action.y>=c.projection.bottom&&c.pageW===c.w;
assert.equal(gate(proof.current),true);assert.equal(gate(proof.prior),false,'restored prior repeated band must fail');
console.log('BUDGETS_PASS: 8 observed cases; prior failure rejected. Taste, animation and hardware performance require separate review.');
