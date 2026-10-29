import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ENCOUNTERS, encounterById, eligibleEncounters, resolveEncounter } from '../../dist/course/encounters.js';
import { translate } from '../../dist/course/i18n.js';
import { newLife, configureLife, begin, live } from '../../dist/course/sim.js';

const DOCUMENTED = ['geo_arbitrage', 'gap_year', 'geo_expiry'];

test('the documented lives are playable encounters with real options', () => {
  for (const id of DOCUMENTED) {
    const encounter = encounterById(id);
    assert.ok(encounter, id + ' is missing');
    assert.ok(encounter.title && encounter.prompt, id + ' has no title or prompt');
    assert.ok(encounter.options.length >= 3, id + ' needs at least three ways out');
    for (const option of encounter.options) {
      assert.ok(option.label && option.outcome, id + '/' + option.id + ' is silent');
    }
  }
});

test('every string of a documented encounter is translated in all four languages', () => {
  for (const id of DOCUMENTED) {
    const encounter = encounterById(id);
    const strings = [encounter.title, encounter.prompt, ...encounter.options.flatMap(o => [o.label, o.outcome])];
    for (const language of ['th', 'zh-CN', 'ja', 'ko']) {
      for (const text of strings) {
        const translated = translate(text, language);
        assert.notEqual(translated, text, `${id}: "${text.slice(0, 40)}" is untranslated in ${language}`);
      }
    }
  }
});

test('the geo-arbitrage arrangement carries its documented three-year clock', () => {
  const state = { age: 22, stage: 'review', history: [{ age: 20, event: 'An ordinary five years.', health: 80, wellbeing: 70, skills: { iq: 3, craft: 3, eq: 3, physique: 3, drive: 3 }, events: [] }], effort: { iq: 3, craft: 3, eq: 3, physique: 3, drive: 3 }, wellbeing: 70, finance: null, story: { seen: [], flags: {}, people: { friend: 'Mali', partner: 'Arun' } } };
  const moved = resolveEncounter({ ...state, story: { ...state.story, pending: { id: 'geo_arbitrage', age: 22, candidates: ['geo_arbitrage'] } } }, 'move', 0.5);
  assert.equal(moved.story.flags.geo, 22, 'the move is recorded with its year');
  // The clock is documented, so it must arrive as a decision, not as a fade.
  const sooner = { ...moved, age: 24 };
  assert.ok(!eligibleEncounters(sooner).some(e => e.id === 'geo_expiry'), 'the clock is not due a day early');
  const due = { ...moved, age: 22 + 3 };
  assert.ok(eligibleEncounters(due).some(e => e.id === 'geo_expiry'), 'the clock arrives three years on');
});

test('the register names its sources accurately and says what it could not verify', () => {
  const register = readFileSync(new URL('../../research/lives.md', import.meta.url), 'utf8');
  for (const needle of ['Information Systems Journal', 'Jiwasiddi', 'Business Insider', 'Harvard Business Review', 'NPR', 'fictional', 'Not verified', 'composite']) {
    assert.ok(register.includes(needle), 'the register does not say ' + needle);
  }
  // Attributions the first draft got wrong, checked against the sources on 29 October 2026.
  for (const retracted of ['Maimunah', 'KUNC', 'pedaily', 'Cambridge, Massachusetts']) {
    assert.ok(!register.includes(retracted), 'the register brings back a retracted attribution: ' + retracted);
  }
});

test('the game does not state, as fact, a duration its sources do not support', () => {
  const text = [encounterById('geo_arbitrage'), encounterById('geo_expiry')].flatMap(e => [e.prompt, ...e.options.map(o => o.outcome)]).join(' ');
  assert.ok(!/about three years|Three years is about/i.test(text), 'a three-year lifetime is stated as fact');
});

test('a full life can meet the documented circumstances and still finish', () => {
  let state = begin(configureLife(newLife(11), { upbringing: 'middle', region: 'bang-na' }));
  const settle = s => {
    if (!s.story?.pending) return s;
    const encounter = encounterById(s.story.pending.id);
    return resolveEncounter(s, encounter.options[0].id, 0.5);
  };
  for (let i = 0; i < 40 && state.age < 80; i++) {
    state = settle(state);
    if (state.stage !== 'review') break;
    state = live(state);
  }
  assert.ok(state.age >= 30, 'the life advanced: ' + state.age);
});
