// Sweep a real life in Thai: open the course with a life already at the review
// stage and read every word the page shows. Anything in English that is not a
// name, a figure or an acronym is a sentence the dictionary did not finish.
import { createRequire } from 'node:module';
import { newLife, configureLife, begin, live, validate } from '../dist/course/sim.js';
import { applyPivot, pendingPivots, openOptions } from '../dist/course/pivots.js';
import { encounterById, resolveEncounter } from '../dist/course/encounters.js';
import { choiceAvailable } from '../dist/course/finance.js';
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? '/Users/nonarkara/Projects/palette') + '/');
const { chromium } = require('playwright');

const settle = s => {
  let t = s;
  for (const p of pendingPivots(t)) t = applyPivot(t, p, openOptions(p, t)[0].id);
  const ps = t.story?.pending;
  if (ps) {
    const enc = encounterById(ps.id);
    t = resolveEncounter(t, enc.options.find(o => choiceAvailable(t, o)).id, .3);
  }
  return t;
};

let life = begin(configureLife(newLife(3), { class: 'middle_class', region: 'samut-prakan', sex: 'female', birthYear: 1981 }));
let guard = 0;
while (life.age < 15 && guard++ < 40) {
  life = settle(life);
  const next = live(life);
  if (next === life) break;
  life = next;
}
life = settle(life);
for (const p of pendingPivots(life)) {
  const wanted = p.id === 'school-apprentice' ? 'school' : openOptions(p, life)[0].id;
  life = applyPivot(life, p, wanted);
}
life = { ...life, pathway: 'school' };
console.log('life valid:', validate(life), '| age', life.age, '| stage', life.stage);

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
await page.waitForTimeout(6000);
const found = await page.evaluate(() => {
  const ALLOWED = /^(Life2\.0|3D|USD|GDP|IQ|EQ|WHO|IMF|BTS|SET|Natural|Earth|SIMS|Plan|CC0|MRT|US|AP|AM|CC|EV|UTC|SEC|MM|QR|USB|TV|CV|PNG|HIV|AIDS|VHS|PCL|ACES)$/i;
  const hits = [];
  const seen = new Set();
  const check = (text, where) => {
    const s = String(text || '').trim();
    if (!s) return;
    const words = s.match(/[A-Za-z][A-Za-z0-9.'’-]*/g) || [];
    const bad = words.filter(w => !ALLOWED.test(w) && w.length > 1);
    if (bad.length && !seen.has(s)) { seen.add(s); hits.push({ where, words: bad.join(' '), text: s.slice(0, 160) }); }
  };
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    if (n.parentElement?.closest('script,style,[data-native]')) continue;
    if (!n.parentElement?.offsetParent) continue;
    check(n.nodeValue, 'text');
  }
  for (const el of document.querySelectorAll('[aria-label],[title],[placeholder]')) {
    if (!el.offsetParent) continue;
    check(el.getAttribute('aria-label'), 'aria-label');
    check(el.getAttribute('title'), 'title');
    check(el.getAttribute('placeholder'), 'placeholder');
  }
  return hits;
});
console.log('English left in the Thai page:', found.length);
for (const f of found.slice(0, 30)) console.log(`  [${f.where}] ${f.words} :: ${f.text}`);
console.log('page errors:', errors.length ? errors.slice(0, 3) : 'none');
await page.screenshot({ path: process.env.SHOT || '/tmp/life-th/review/thai/after/review-1440.png' });
await browser.close();
