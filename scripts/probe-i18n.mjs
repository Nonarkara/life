// The same life, read in English and in Thai: the English source, the Thai
// rendering, and the pack keys that cover it. A leak is a sentence that keeps
// English words inside Thai text; this prints both halves so the cause can be
// read rather than guessed.
import { createRequire } from 'node:module';
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? '/Users/nonarkara/Projects/palette') + '/');
const { chromium } = require('playwright');

const BASE = (process.env.BASE || 'http://127.0.0.1:4321').replace(/\/$/, '');
const SIZES = [[390, 844], [1440, 900]];

const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const read = async (language, w, h) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(lang => {
    try {
      localStorage.removeItem('life-save-v1');
      localStorage.removeItem('life-life-v1');
      localStorage.setItem('life-preferences-v1', JSON.stringify({ language: lang, size: 'standard', motion: false, stage: 'hybrid', v: 3 }));
    } catch {}
  }, language);
  await page.goto(BASE + '/course/', { waitUntil: 'load' });
  await page.waitForTimeout(4500);
  const out = await page.evaluate(() => {
    const grab = sel => [...document.querySelectorAll(sel)].map(e => (e.innerText || '').trim()).filter(Boolean);
    const mixed = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walk.nextNode())) {
      const s = (n.nodeValue || '').trim();
      if (!s) continue;
      if (n.parentElement?.closest('script,style,[data-native]')) continue;
      if (/[฀-๿]/.test(s) && /[A-Za-z]{2,}/.test(s)) mixed.push(s.slice(0, 160));
    }
    let keys = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); keys[k] = String(localStorage.getItem(k)).slice(0, 200); }
    return {
      lang: document.documentElement.lang,
      narrative: (document.querySelector('#narrative')?.innerText || '').trim(),
      birthInfo: grab('#birth-info dd').slice(0, 6),
      world: (document.querySelector('#world-headline')?.innerText || '').trim(),
      mixed: [...new Set(mixed)],
      storage: keys,
    };
  });
  out.errors = errors.slice(0, 3);
  await ctx.close();
  return out;
};

for (const [w, h] of SIZES) {
  const en = await read('en', w, h);
  const th = await read('th', w, h);
  console.log(`\n======== ${w}x${h} ========`);
  console.log('EN narrative:', en.narrative);
  console.log('TH narrative:', th.narrative);
  console.log('EN birth-info:', JSON.stringify(en.birthInfo));
  console.log('TH birth-info:', JSON.stringify(th.birthInfo));
  console.log('TH world:', th.world);
  console.log('TH mixed strings:', th.mixed.length ? th.mixed : 'none');
  console.log('TH errors:', th.errors);
  console.log('storage keys:', Object.keys(th.storage));
}
await browser.close();
