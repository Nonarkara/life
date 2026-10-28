import fs from 'node:fs';import assert from 'node:assert/strict';
const dir=new URL('../review/palette-scenes/',import.meta.url),read=name=>JSON.parse(fs.readFileSync(new URL(name,dir)));
const r=read('rendered.json');assert.equal(r.cases.length,15);assert.deepEqual(r.logs,[]);
for(const c of r.cases){const[w,h]={phone:[390,844],tablet:[1024,768],desktop:[1440,900]}[c.size];assert.equal(c.w,w);assert.equal(c.h,h);assert.equal(c.pageW,w);assert.equal(c.pageH,h);assert.ok(c.action.bottom<=h);if(w<1280)assert.ok(c.canvas.height>c.reader.height);}
const pairs=read('contrast.json');assert.equal(pairs.length,30);for(const p of pairs)for(const [role,ratio]of Object.entries(p.ratios))assert.ok(ratio>=4.5,p.plate+' '+role);
const native=read('settings-native.json');assert.equal(native.settings.pickerCount,0);assert.equal(native.settings.controls,3);for(const c of native.native){assert.equal(c.w,390);assert.equal(c.h,844);assert.equal(c.pageW,c.w);assert.equal(c.pageH,c.h);assert.ok(c.action.bottom<=c.h);}
const actual=read('actual-decisions.json');assert.deepEqual(actual.logs,[]);assert.ok(new Set(actual.steps.map(s=>s.palette)).size>=4);assert.equal(actual.steps.at(-1).palette,actual.steps.at(-2).palette);
const life=read('recorded-life.json');assert.ok(life.changes>=20);assert.ok(life.unique>=20);
console.log('PASS: 30 contrast sets, 15 exact scene viewports, Thai settings/task, actual decision transitions and seeded life trace.');
