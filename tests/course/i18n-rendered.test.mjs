import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { REGIONS, HOUSEHOLDS } from '../../dist/course/regions.js';
import { translate } from '../../dist/course/i18n.js';

// The birth card, the console line and the recorded event, exactly as the product
// assembles them. A dictionary test cannot see these: they are made of pieces,
// and the engine decides where the pieces meet. So the sentences themselves are
// checked, in every language, for every province and every household.
const LANGUAGES = ['th', 'zh-CN', 'ja', 'ko'];
const NARRATIVE = 'Live one life: from ten, spend ten points every five years and face its decisions; at the end, see where you went, what it cost and what it taught, then live again in the same world.';
const birth = (home, place, who) => `Born into ${home} in ${place}. Raised by ${who}. ${NARRATIVE}`;
const REGION_IDS = Object.keys(REGIONS).filter(id => REGIONS[id].home && REGIONS[id].place);
const HOUSEHOLD_TEXTS = Object.values(HOUSEHOLDS).map(h => h.text);
// Latin that a target language keeps on purpose: the house name, the world, and
// nothing else. A name in Latin is not an English sentence inside another language.
const LATIN_ALLOWED = /^(?:Life2\.0|3D|USD|GDP|IQ|EQ|WHO|IMF|BTS|SET|Natural|Earth)$/;
const latinWords = text => [...String(text).matchAll(/[A-Za-z][A-Za-z0-9.'’-]*/g)].map(m => m[0]).filter(w => !LATIN_ALLOWED.test(w));

test('the birth card reads in the chosen language for every province and every household', () => {
  for (const language of LANGUAGES) {
    for (const id of REGION_IDS) {
      const { home, place } = REGIONS[id];
      for (const who of HOUSEHOLD_TEXTS) {
        const source = birth(home, place, who);
        const shown = translate(source, language);
        assert.notEqual(shown, source, `${language}: ${id} is not translated`);
        assert.deepEqual(latinWords(shown), [], `${language}: ${id} keeps English — ${shown}`);
      }
    }
  }
});

test('the console line and the recorded event read in the chosen language', () => {
  for (const language of LANGUAGES) {
    for (const id of REGION_IDS) {
      const { home, place } = REGIONS[id];
      const society = `Born into ${home} · ${place}`;
      const event = `Born into ${home}`;
      for (const source of [society, event]) {
        const shown = translate(source, language);
        assert.notEqual(shown, source, `${language}: ${id} is not translated`);
        assert.deepEqual(latinWords(shown), [], `${language}: ${id} keeps English — ${shown}`);
      }
    }
  }
});

test('a household phrase that carries its own "in" is not cut in half', () => {
  // The engine used to fill a template at the first "in" it found, so the household
  // phrase was split and half of it stayed English inside the Thai sentence.
  const source = birth('a trading household in the old city by the temple', 'Nakhon Si Thammarat', 'your mother and father');
  for (const language of LANGUAGES) {
    const shown = translate(source, language);
    assert.notEqual(shown, source, `${language}: the birth card is not translated`);
    assert.deepEqual(latinWords(shown), [], `${language}: the household phrase was cut — ${shown}`);
  }
});

test('the engine never returns a half-translated sentence', () => {
  // A phrase the dictionary does not have must not leave the rest of the sentence
  // in the other language: the reader gets one whole sentence or the other.
  const missing = 'a household nobody translated';
  const source = `Born into ${missing} in Chumphon. Raised by your mother and father.`;
  for (const language of LANGUAGES) {
    const shown = translate(source, language);
    assert.ok(shown === source || latinWords(shown).length === 0, `${language}: half translated — ${shown}`);
  }
});

test('no Thai translation is stitched onto Thai with a Latin word', async () => {
  // Thai writes spaces between words, so a Latin word sitting directly against a
  // Thai one means two languages were stitched together: "a คนงานโรงงาน's household".
  const map = (await import('../../dist/course/translations-th.js')).default;
  const stitched = /[A-Za-z][฀-๿]|[฀-๿][A-Za-z]/;
  for (const [english, value] of map) {
    assert.ok(!stitched.test(String(value)), `stitched — ${english} → ${value}`);
  }
});

test('every label a day can produce is in the dictionary', () => {
  // The labels the routines and the axes print: they are the words a reader sees
  // beside the life, so a day must not show one of them in English.
  const source = readFileSync(new URL('../../dist/course/routines.js', import.meta.url), 'utf8');
  const actions = [...new Set([...source.matchAll(/action:'([^']+)'/g)].map(m => m[1]))];
  assert.ok(actions.length > 10, 'the day has labels to translate');
  const sim = readFileSync(new URL('../../dist/course/sim.js', import.meta.url), 'utf8');
  const labels = [...new Set([...sim.matchAll(/label:'([^']+)'/g)].map(m => m[1]))];
  for (const language of LANGUAGES) {
    for (const phrase of [...actions, ...labels]) {
      const shown = translate(phrase, language);
      assert.notEqual(shown, phrase, `${language}: ${phrase} is not translated`);
      assert.deepEqual(latinWords(shown), [], `${language}: ${phrase} keeps English — ${shown}`);
    }
  }
});
