// The surfaces this round added — the Almanac, a canonical life, the July 1997
// episode, the Settings dialog — read in Thai. A surface nobody opens in the
// sweep is a surface nobody checks.
import { createRequire } from 'node:module';
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? '/Users/nonarkara/Projects/palette') + '/');
const { chromium } = require('playwright');
const BASE = (process.env.BASE || 'https://life.nonarkara.org').replace(/\/$/, '');

const ALLOWED = /^(Life2\.0|3D|USD|GDP|IQ|EQ|WHO|IMF|BTS|SET|Natural|Earth|SIMS|Plan|CC0|MRT|US|AP|AM|CC|EV|UTC|SEC|MM|QR|USB|TV|CV|PNG|HIV|AIDS|VHS|PCL|ACES|MB|KB|GB)$/i;
const englishIn = text => [...String(text || '').matchAll(/[A-Za-z][A-Za-z0-9.'’-]*/g)].map(m => m[0]).filter(w => !ALLOWED.test(w) && w.length > 1);

const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });

async function look(path, { openAlmanac = false, openSettings = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => { try { localStorage.setItem('life-preferences-v1', JSON.stringify({ language: 'th', size: 'standard', motion: false, stage: 'hybrid', v: 3 })); } catch {} });
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(5000);
  if (openAlmanac) await page.evaluate(() => { const d = document.querySelector('details.almanac-drawer'); if (d) d.open = true; });
  if (openSettings) await page.evaluate(() => { const b = document.querySelector('[data-settings]'); if (b) b.click(); });
  await page.waitForTimeout(1200);
  const out = await page.evaluate(() => {
    const hits = [];
    const seen = new Set();
    const check = (text, where) => {
      const s = String(text || '').trim();
      if (!s || seen.has(s)) return;
      seen.add(s);
      hits.push({ where, text: s.slice(0, 140) });
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
    }
    return { hits, lang: document.documentElement.lang };
  });
  await ctx.close();
  return { ...out, errors };
}

const surfaces = [
  ['intake (almanac open)', '/intake/?lang=th', { openAlmanac: true }],
  ['canonical life 1', '/intake/?player=1&lang=th', {}],
  ['canonical life 9', '/intake/?player=9&lang=th', {}],
  ['settings dialog', '/course/?lang=th', { openSettings: true }],
  ['july 1997 episode', '/course/july-1997.html?lang=th', {}],
];

for (const [name, path, opts] of surfaces) {
  const out = await look(path, opts);
  const bad = out.hits.filter(h => englishIn(h.text).length);
  console.log(`\n=== ${name} (lang=${out.lang}) — ${bad.length} strings with English`);
  for (const b of bad.slice(0, 12)) console.log(`   [${b.where}] ${englishIn(b.text).join(' ')} :: ${b.text.slice(0, 110)}`);
  if (out.errors.length) console.log('   errors:', out.errors.slice(0, 2));
}
await browser.close();
