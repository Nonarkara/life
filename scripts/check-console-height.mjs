import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../review/console-height/'+n,import.meta.url)));
const before=read('before.json').cases.find(c=>c.name==='desktop'),{cases,fallback}=read('geometry.json'),desktop=cases.find(c=>c.name==='desktop');
assert.ok(desktop.deck.h<=before.deck.h*.8,'instrument row must be at least20% shorter');
assert.ok(before.h-before.world.bottom-desktop.lowerHeight>=40,'recovered lower chrome must expand the world');
for(const c of cases){assert.equal(c.pageW,c.w,c.name);assert.equal(c.pageH,c.h,c.name);assert.equal(c.actionCount,1,c.name);assert.ok(c.action.h>=32&&c.action.bottom<=c.h,c.name);assert.ok(c.gain.bottom<=c.plan.bottom+1,c.name+' gain visible');if(c.w>=1280){assert.equal(c.integrated,true);assert.equal(c.actionHost,'deck-action-slot');assert.equal(c.footer.display,'none');assert.ok(Math.abs(c.deck.bottom-c.h)<1,'bar reaches the bottom edge');}else assert.equal(c.integrated,false);}
assert.equal(fallback.integrated,false);assert.equal(fallback.actionCount,1);assert.ok(fallback.action.bottom<=fallback.h);
for(const c of read('action-focus.json')){assert.equal(c.focus,'commit');assert.equal(c.actionCount,1);}
const proof=read('restored-proof.json');assert.ok(proof.current.deck.h<=before.deck.h*.8);assert.ok(proof.restored.deck.h>before.deck.h*.8,'restored prose/selector/footer must fail');assert.ok(proof.restored.lowerHeight>proof.current.lowerHeight+40);
console.log(JSON.stringify({pass:true,barBefore:before.deck.h,barAfter:desktop.deck.h,worldGain:desktop.world.h-before.world.h,lowerReduction:before.h-before.world.bottom-desktop.lowerHeight,cases:cases.length}));
