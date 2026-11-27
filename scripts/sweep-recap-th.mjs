// The recap: the screen the player reaches at the end of a life, read in Thai.
// The earlier sweep stopped at the review stage. The ending screen, the console
// panes and the closing sentences are where the last English was still sitting.
//
//   BASE=https://life.nonarkara.org node scripts/sweep-recap-th.mjs
import { createRequire } from 'node:module';
import { newLife, configureLife, begin, live } from '../dist/course/sim.js';
import { pendingPivots, applyPivot, openOptions } from '../dist/course/pivots.js';
import { stationAlternatives } from '../dist/course/alternatives.js';
import { encounterById, resolveEncounter } from '../dist/course/encounters.js';
import { choiceAvailable } from '../dist/course/finance.js';
import { pendingChildChoice, nextChildAge, chooseChild, acknowledgeChild } from '../dist/course/childhood-choices.js';
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? '/Users/nonarkara/Projects/palette') + '/');
const { chromium } = require('playwright');

// A whole life, answered the way the game asks a player to answer it, so the
// closing screen has the same shape a real run has.
function playLife(seed) {
  let s = begin(configureLife(newLife(seed), { class: 'middle_class', region: 'samut-prakan', sex: 'female', birthYear: 1981 }));
  for (let age = nextChildAge(s); age < 10; age = nextChildAge(s)) {
    const q = pendingChildChoice(s, age);
    if (!q?.options.length) break;
    s = acknowledgeChild(chooseChild(s, age, q.options[0].id));
  }
  let guard = 0;
  while (s.stage === 'review' && s.age < 80 && guard++ < 40) {
    for (const p of pendingPivots(s)) { const open = openOptions(p, s); if (open[0]) s = applyPivot(s, p, open[0].id); }
    if (s.story?.pending) {
      const e = encounterById(s.story.pending.id);
      const open = e.options.filter(o => choiceAvailable(s, o));
      s = resolveEncounter(s, (open[0] ?? e.options[0]).id, .3);
    }
    s = { ...s, pendingAlternatives: stationAlternatives(s) };
    const next = live(s);
    if (next.age <= s.age) break;
    s = next;
  }
  return s;
}

const life = playLife(3);
console.log('life: age', life.age, '| stage', life.stage, '| history', life.history.length);

const BASE = (process.env.BASE || 'https://life.nonarkara.org').replace(/\/$/, '');
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.addInitScript(() => { try { localStorage.setItem('life-preferences-v1', JSON.stringify({ language: 'th', size: 'standard', motion: false, stage: 'hybrid', v: 3 })); } catch {} });
await page.goto(BASE + '/build.json', { waitUntil: 'load' });
await page.evaluate(`localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(life))}); true`);
await page.goto(BASE + '/course/', { waitUntil: 'load' });
await page.waitForTimeout(7000);

// Latin the engine keeps on purpose: its own list, so the sweep does not cry
// wolf over a club, a brand or a name.
const { LATIN_KEPT } = await import('../dist/course/i18n.js');
const KEPT = [...LATIN_KEPT].join('|');
const ALLOWED = new RegExp(`^(?:${KEPT}|Life2\\.0|3D|USD|GDP|IQ|EQ|WHO|IMF|BTS|SET|Natural|Earth|฿|%|[0-9.,–-]+)$`, 'i');
const readPage = () => page.evaluate(({ allowedSrc, keptSrc }) => {
  const ALLOWED = new RegExp(allowedSrc, 'i');
  const KEPT = new Set(keptSrc.split('|'));
  const hits = [];
  const seen = new Set();
  const check = (text, where) => {
    const s = String(text || '').trim();
    if (!s) return;
    const words = s.match(/[A-Za-z][A-Za-z0-9.'’-]*/g) || [];
    const bad = words.filter(w => !ALLOWED.test(w) && !KEPT.has(w.toLowerCase()) && w.length > 1);
    if (bad.length && !seen.has(s)) { seen.add(s); hits.push({ where, words: bad.join(' '), text: s.slice(0, 170) }); }
  };
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    if (n.parentElement?.closest('script,style,[data-native]')) continue;
    if (!n.parentElement?.offsetParent) continue;
    // A citation names its source in the language it was published in.
    if (n.parentElement?.closest('.research-source')) continue;
    check(n.nodeValue, 'text');
  }
  for (const el of document.querySelectorAll('[aria-label],[title],[placeholder]')) {
    if (!el.offsetParent) continue;
    check(el.getAttribute('aria-label'), 'aria-label');
    check(el.getAttribute('title'), 'title');
    check(el.getAttribute('placeholder'), 'placeholder');
  }
  return hits;
}, { allowedSrc: ALLOWED.source, keptSrc: KEPT });

const hits = await readPage();
console.log('\n--- recap as it lands ---');
console.log('English left:', hits.length);
for (const h of hits.slice(0, 25)) console.log(`  [${h.where}] ${h.words} :: ${h.text}`);

// Every console section, every disclosure, opened in turn.
const tabs = await page.evaluate(() => [...document.querySelectorAll('.console-nav button')].map(b => b.textContent.trim()));
console.log('\nconsole sections:', tabs.join(' | '));
for (const tab of tabs) {
  await page.evaluate(label => {
    const b = [...document.querySelectorAll('.console-nav button')].find(x => x.textContent.trim() === label);
    b?.click();
  }, tab);
  await page.waitForTimeout(1200);
  await page.evaluate(() => { for (const d of document.querySelectorAll('details')) d.open = true; });
  await page.waitForTimeout(600);
  const more = await readPage();
  if (more.length) {
    console.log(`\n--- section "${tab}" — ${more.length} English`);
    for (const h of more.slice(0, 25)) console.log(`  [${h.where}] ${h.words} :: ${h.text}`);
  }
}

// The closing tools: growing world, detailed comparisons.
for (const label of ['Growing world', 'Detailed comparisons']) {
  const clicked = await page.evaluate(text => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === text);
    if (!b) return false; b.click(); return true;
  }, label);
  if (!clicked) continue;
  await page.waitForTimeout(1500);
  await page.evaluate(() => { for (const d of document.querySelectorAll('details')) d.open = true; });
  await page.waitForTimeout(600);
  const more = await readPage();
  if (more.length) {
    console.log(`\n--- after "${label}" — ${more.length} English`);
    for (const h of more.slice(0, 25)) console.log(`  [${h.where}] ${h.words} :: ${h.text}`);
  }
}

console.log('\npage errors:', errors.length ? errors.slice(0, 3) : 'none');
await page.screenshot({ path: process.env.SHOT || '/tmp/life-th/review/audit/recap-th-1440.png', fullPage: false });
await browser.close();
