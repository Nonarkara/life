// Which of a played life's sentences are still English in another language.
// An event is served when the dictionary holds it whole, or when the keys it
// contains cover every sentence of it. This is what the engine does, measured
// rather than guessed.
import { newLife, configureLife, begin, live } from '../dist/course/sim.js';
import { pendingPivots, applyPivot, openOptions } from '../dist/course/pivots.js';
import { encounterById, resolveEncounter } from '../dist/course/encounters.js';
import { choiceAvailable } from '../dist/course/finance.js';
import { pendingChildChoice, nextChildAge, chooseChild, acknowledgeChild } from '../dist/course/childhood-choices.js';
import { translate } from '../dist/course/i18n.js';
const packs = {};
for (const lang of ['th','zh-CN','ja','ko']) packs[lang] = (await import(`../dist/course/translations-${lang}.js`)).default;
const LANGS = ['th','zh-CN','ja','ko'];
const keys = LANGS.map(l => [...packs[l].keys()].filter(k => !k.includes('{')).sort((a,b)=>b.length-a.length));
const events = new Map();
for (let seed = 1; seed <= 60; seed++) {
  let s = begin(configureLife(newLife(seed), { class: 'middle_class', region: 'samut-prakan', sex: 'female', birthYear: 1981 }));
  for (let age = nextChildAge(s); age < 10; age = nextChildAge(s)) {
    const q = pendingChildChoice(s, age); if (!q?.options.length) break;
    s = acknowledgeChild(chooseChild(s, age, q.options[0].id));
  }
  let guard = 0;
  while (s.stage === 'review' && s.age < 80 && guard++ < 30) {
    for (const p of pendingPivots(s)) { const open = openOptions(p, s); if (open[0]) s = applyPivot(s, p, open[0].id); }
    if (s.story?.pending) { const e = encounterById(s.story.pending.id); const open = e.options.filter(o => choiceAvailable(s, o)); s = resolveEncounter(s, (open[0] ?? e.options[0]).id, .3); }
    s = { ...s, pendingAlternatives: [] };
    const next = live(s); if (next.age <= s.age) break; s = next;
    for (const row of s.history) {
      if (row.event) events.set(row.event, (events.get(row.event) ?? 0) + 1);
      for (const e of row.events ?? []) if (e.text) events.set(e.text, (events.get(e.text) ?? 0) + 1);
    }
  }
}
// The minimal set of sentences the dictionary still cannot serve.
const need = new Map();
let unservedEvents = 0;
for (const [event, seen] of events) {
  if (translate(event, 'th') !== event) continue;
  unservedEvents++;
  if (process.env.SHOW) console.log('  UNSERVED:', JSON.stringify(event));
  // What the engine's fallback leaves behind: it puts back every key it finds
  // in the event, longest first. What is left is what no key covers.
  let rest = event;
  for (const list of keys) for (const key of list) if (rest.includes(key)) rest = rest.split(key).join('\uE000');
  for (const part of rest.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 2)) {
    need.set(part.replace(/\uE000/g, '').trim(), (need.get(part.replace(/\uE000/g, '').trim()) ?? 0) + seen);
  }
}
const ranked = [...need].sort((a,b)=>b[1]-a[1]);
console.log(`${events.size} distinct event strings · ${unservedEvents} not served · ${ranked.length} sentences still English`);
for (const [s, n] of ranked) console.log(`  ${String(n).padStart(5)}  ${JSON.stringify(s)}`);
