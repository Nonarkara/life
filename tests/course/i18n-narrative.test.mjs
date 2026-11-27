// The story a life tells, in every language.
// A played life assembles its sentences from moments, the country's years and
// the people who go. Those sentences are read as one piece, so a sentence the
// dictionary cannot serve leaves the whole record in English. This plays lives
// and checks the record the player would read.
import test from 'node:test';
import assert from 'node:assert/strict';
import { newLife, configureLife, begin, live } from '../../dist/course/sim.js';
import { pendingPivots, applyPivot, openOptions } from '../../dist/course/pivots.js';
import { encounterById, resolveEncounter } from '../../dist/course/encounters.js';
import { choiceAvailable } from '../../dist/course/finance.js';
import { pendingChildChoice, nextChildAge, chooseChild, acknowledgeChild } from '../../dist/course/childhood-choices.js';
import { translate, LATIN_KEPT } from '../../dist/course/i18n.js';

const LANGUAGES = ['th', 'zh-CN', 'ja', 'ko'];
// Latin a target language keeps on purpose: the engine decides which words
// those are, and the test must not keep a second list of its own.
const LATIN_ALLOWED = /^(?:฿|%|[0-9.,–-]+)$/;
const latinWords = text => [...String(text).matchAll(/[A-Za-z][A-Za-z0-9.'’-]*/g)]
  .map(m => m[0].replace(/[.'’-]+$/, ''))
  .filter(w => w.length > 1 && !LATIN_ALLOWED.test(w) && !LATIN_KEPT.has(w.toLowerCase()));

// A whole life, answered the way the game asks a player to answer it.
function playLife(seed) {
  let s = begin(configureLife(newLife(seed), { class: 'middle_class', region: 'samut-prakan', sex: 'female', birthYear: 1981 }));
  for (let age = nextChildAge(s); age < 10; age = nextChildAge(s)) {
    const q = pendingChildChoice(s, age);
    if (!q?.options.length) break;
    s = acknowledgeChild(chooseChild(s, age, q.options[0].id));
  }
  let guard = 0;
  while (s.stage === 'review' && s.age < 80 && guard++ < 30) {
    for (const p of pendingPivots(s)) { const open = openOptions(p, s); if (open[0]) s = applyPivot(s, p, open[0].id); }
    if (s.story?.pending) {
      const e = encounterById(s.story.pending.id);
      const open = e.options.filter(o => choiceAvailable(s, o));
      s = resolveEncounter(s, (open[0] ?? e.options[0]).id, .3);
    }
    s = { ...s, pendingAlternatives: [] };
    const next = live(s);
    if (next.age <= s.age) break;
    s = next;
  }
  return s;
}

test('every record a played life shows reads in the chosen language', () => {
  const sentences = new Set();
  for (let seed = 1; seed <= 40; seed++) {
    const s = playLife(seed);
    // The record is read as one piece: the event the chapter produced, and the
    // events the country made in the same years.
    for (const row of s.history) {
      if (row.event) sentences.add(row.event);
      for (const e of row.events ?? []) if (e.text) sentences.add(e.text);
    }
  }
  assert.ok(sentences.size > 200, `the lives produced too few sentences to judge: ${sentences.size}`);
  for (const language of LANGUAGES) {
    for (const sentence of sentences) {
      if (!sentence) continue;
      const shown = translate(sentence, language);
      assert.notEqual(shown, sentence, `${language}: not translated — ${sentence.slice(0, 90)}`);
      assert.deepEqual(latinWords(shown), [], `${language}: keeps English — ${shown.slice(0, 120)}`);
    }
  }
});
