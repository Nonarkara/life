import fs from 'node:fs';import assert from 'node:assert/strict';
const rows=JSON.parse(fs.readFileSync(process.argv[2]??new URL('./geometry.json',import.meta.url),'utf8'));
for(const r of rows){assert.ok(r.pageH<=r.h+1&&r.pageW<=r.w+1,'page overflow at '+r.w);assert.ok(r.action.bottom<=r.h+1&&r.action.top>=0,'advance outside viewport at '+r.w);if(r.w<1280){const height=r.h*(r.w>r.h?1/5:1/3);assert.ok(Math.abs(r.dock.height-height)<1,'RPG budget at '+r.w);assert.ok(Math.abs(r.dock.bottom-r.h)<1,'dock misses bottom at '+r.w);assert.ok(r.world.height>r.dock.height,'world must remain dominant at '+r.w);}}
console.log('Measured RPG geometry passes for '+rows.length+' viewports.');
