import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { childhoodChapter } from '../../dist/course/childhood.js';
import { translate } from '../../dist/course/i18n.js';

test('every childhood chapter carries a line about the body and the mind', () => {
  const state = { birth: { childhood: null } };
  for (const age of [0, 1, 2, 3, 5, 6, 8, 9]) {
    const chapter = childhoodChapter(state, age);
    assert.ok(chapter.biology && chapter.biology.length > 40, `age ${age} has no developmental line`);
    assert.ok(chapter.decision && chapter.title, `age ${age} has no family circumstance`);
  }
});

test('the developmental lines are translated in all four languages', () => {
  const state = { birth: { childhood: null } };
  for (const age of [0, 1, 2, 3, 5, 6, 8, 9]) {
    const chapter = childhoodChapter(state, age);
    for (const language of ['th', 'zh-CN', 'ja', 'ko']) {
      const translated = translate(chapter.biology, language);
      assert.notEqual(translated, chapter.biology, `age ${age} biology is untranslated in ${language}`);
      assert.ok(!translated.includes('�'), `age ${age} biology is corrupted in ${language}`);
    }
  }
});

test('the biological register names its sources and its limits', () => {
  const bible = readFileSync(new URL('../../research/biology.md', import.meta.url), 'utf8');
  assert.ok(bible.includes('Dobelli'), 'the supplied book is not registered');
  assert.ok(bible.includes('Pinker'), 'the named book is not registered');
  assert.ok(bible.includes('not yet read'), 'a book that was not read must be marked as such');
  assert.ok(/Not claimed/i.test(bible), 'the register must state what it does not claim');
});

test('the childhood watch is short enough to be watched', async () => {
  const { readFileSync: read } = await import('node:fs');
  const game = read(new URL('../../dist/course/game.js', import.meta.url), 'utf8');
  const { childYearSeconds } = await import('../../dist/course/childhood-choices.js');
  assert.ok(game.includes('childYearSeconds(age)'), 'the tested pacing must drive the actual clock');
  assert.equal([0,1,2,3,4].reduce((total, age) => total + childYearSeconds(age), 0), 50);
  assert.ok(childYearSeconds(5) <= 5, 'later childhood remains short enough to watch');
});

test('grandparent and reunion chapters retain the developmental note',()=>{
 const s={birth:{childhood:{from:2,to:7}}};
 for(const age of [2,7])assert.ok(childhoodChapter(s,age).biology);
});
