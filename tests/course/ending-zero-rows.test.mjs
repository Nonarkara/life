import test from 'node:test';import assert from 'node:assert/strict';
import {withoutZeroClauses} from '../../dist/course/ending.js';import {translate} from '../../dist/course/i18n.js';
// A row that says zero takes space and says nothing. The ending must not
// print "Road stops +0 · Goals +0 · Titles +0 · Balance +0" beside a score.
test('a clause whose own count is zero is dropped from the line',()=>{
 const template='Experiences +{cards} · Road stops +{road} · Goals +{goals} · Titles +{titles} · Balance +{balance}';
 const counts=[['cards',26],['road',0],['goals',0],['titles',0],['balance',0]];
 const out=withoutZeroClauses(template,counts);
 assert.equal(out,'Experiences +{cards}');
 assert.ok(!out.includes('+0'));
 assert.ok(!out.includes('Road stops'));
});
test('every clause survives when every count is real',()=>{
 const template='Experiences +{cards} · Road stops +{road}';
 assert.equal(withoutZeroClauses(template,[['cards',3],['road',2]]),template);
});
test('a line whose every clause is zero disappears entirely',()=>{
 const template='Almanac: {r}/{tr} callings · {s}/{ts} road stops · {n} field notes';
 const counts=[['r',0],['s',0],['n',0]];
 assert.equal(withoutZeroClauses(template,counts),'');
});
test('a denominator never keeps a clause alive when its count is zero',()=>{
 const template='Almanac: {r}/{tr} callings · {s}/{ts} road stops · {n} field notes';
 assert.equal(withoutZeroClauses(template,[['r',0],['s',2],['n',0]]),'{s}/{ts} road stops');
});
test('the same rule holds in every language, where the clauses differ',()=>{
 for(const language of ['th','zh-CN','ja','ko']){
  const template=translate('Experiences +{cards} · Road stops +{road} · Goals +{goals} · Titles +{titles} · Balance +{balance}',language);
  const out=withoutZeroClauses(template,[['cards',26],['road',0],['goals',0],['titles',0],['balance',0]]);
  assert.ok(!out.includes('+0'),language+': '+out);
  assert.ok(out.includes('{cards}'),language+': '+out);
 }
});
