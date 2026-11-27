// The sentences the closing screens are made of, in every language.
// The recap, the roads you did not take, the life you did not choose: these
// are assembled by the product from pieces, so a dictionary test cannot see
// them. Here they are rendered, and read, exactly as the player reads them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../dist/course/i18n.js';

const LANGUAGES = ['th', 'zh-CN', 'ja', 'ko'];
// Latin a target language keeps on purpose: the house, the world, a figure.
const LATIN_ALLOWED = /^(?:Life2\.0|IQ|EQ|USD|GDP|WHO|IMF|BTS|SET|Natural|Earth|OCEAN|Manchester|Chelsea|Arsenal|MMU|฿|%|[0-9.,–-]+)$/;
const latinWords = text => [...String(text).matchAll(/[A-Za-z][A-Za-z0-9.'’-]*/g)]
  .map(m => m[0])
  .filter(w => !LATIN_ALLOWED.test(w));

// The same sentences the product builds, with the values a life holds.
const CLOSING = [
  // The life you did not choose.
  'Same birth, same world, same shocks. The other life spends every station in the default shape and takes no story decision, so the difference you see below is yours.',
  'At 65, your choices moved money by 126,055 ฿, health by +2 and wellbeing by -29 against that other life.',
  'By 65, your choices moved money by 126,055 ฿, health by +2 and wellbeing by -29 against that other life.',
  // The roads you did not take.
  'The roads you did not take',
  'At every question, each other answer was lived to the end of those five years. Same seed, same world, same luck: the only difference is the answer.',
  'instead of Accept, and keep the promise — money +0 ฿, health +0, wellbeing +1 by age 15.',
  'instead of Work the stall with your mother after school — money -14,000 ฿, health -3, wellbeing +2 by age 20.',
  'Age 30: Ask the teacher about a scholarship',
  // The ending record.
  'Chapter focus: Learn',
  'Most effort: Physique (2/10).',
  'You chose: Accept, and keep the promise',
  'At 60 you could have lived 24 months without income.',
  'Age 85: Physical health 85 / 100',
  // The console and economy labels.
  'Spendable remainder: 30%',
  'Pay ×2 · living costs ×1 here. Authored game tuning, not wage or price data.',
  'Rent ฿12,000 + travel ฿3,000 / month · 45 min / day',
  'Each bar runs from the centre line; the widest bar on this scale is ±30 %.',
  'Totals for ages 40–45',
  'Work income effect: ฿4,000',
  'Your holdings changed: -฿1,200',
  'Contraction years in that chapter: 2',
  'Economic record begins at age 20.',
  'Source: 65 annual observations; 4 contraction spells. This does not establish a cycle.',
  'This saved life joins the economy at age 20. Earlier records stay unchanged.',
  'Family income · ฿120,000 / year · game scenario',
  'Realized after fees: ฿1,500',
  'Unrealized: -฿200',
  'A cash reserve can meet a near-term expense. Investments can lose value, and fees reduce what you keep.',
  'Use Invest to hold a bond or equity fund; its value can fall.',
];

test('the closing sentences read in the chosen language, never half in one language and half in another', () => {
  for (const language of LANGUAGES) {
    for (const source of CLOSING) {
      const shown = translate(source, language);
      assert.notEqual(shown, source, `${language}: not translated — ${source.slice(0, 70)}`);
      assert.deepEqual(latinWords(shown), [], `${language}: keeps English — ${shown.slice(0, 120)}`);
    }
  }
});

test('a closing sentence that the dictionary cannot serve keeps its own voice in English rather than a half-translation', () => {
  // An invented sentence: no pack holds it. The engine must refuse to invent a
  // translation and must hand back the sentence as written.
  const invented = 'A sentence nobody wrote for any language at all.';
  for (const language of LANGUAGES) {
    const shown = translate(invented, language);
    assert.equal(shown, invented, `${language}: invented a translation`);
  }
});
