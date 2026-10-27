import test from 'node:test';import assert from 'node:assert/strict';
import {cacheTranslations} from '../../dist/course/translation-cache.js';
import {translate} from '../../dist/course/i18n.js';
test('repeated translated animation text does not rerun matching, and languages stay independent',()=>{
 let lookups=0;const cached=cacheTranslations((text,lang)=>{lookups++;return lang+':'+text;},3);
 for(let i=0;i<1000;i++)assert.equal(cached('Age 55','th'),'th:Age 55');assert.equal(lookups,1);
 assert.equal(cached('Age 55','ja'),'ja:Age 55');assert.equal(lookups,2);
 cached('Age 60','th');cached('Age 65','th');cached('Age 55','th');assert.equal(lookups,5,'oldest cached entry was evicted');
});
test('cached real templates retain numbers, specific wording and language reversibility',()=>{
 for(const lang of ['th','zh-CN','ja','ko']){
  const a=translate('Physical health changed by about 12 points in that period.',lang);
  assert.notEqual(a,'Physical health changed by about 12 points in that period.');assert.ok(a.includes('12'));
  for(let i=0;i<20;i++)assert.equal(translate('Physical health changed by about 12 points in that period.',lang),a);
 }
 assert.equal(translate('Age 55','en'),'Age 55');assert.equal(translate('', 'th'),'');
});
