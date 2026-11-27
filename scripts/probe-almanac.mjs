// Does the Almanac drawer exist, does it open, and does the life it links to
// actually start? A link that promises a canonical life and lands on a random
// one is worse than no link.
import { createRequire } from 'node:module';
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? '/Users/nonarkara/Projects/palette') + '/');
const { chromium } = require('playwright');
const BASE = (process.env.BASE || 'https://life.nonarkara.org').replace(/\/$/, '');
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(BASE + '/intake/', { waitUntil: 'load' });
await page.waitForTimeout(4500);
const drawer = await page.evaluate(() => {
  const d = document.querySelector('details.almanac-drawer');
  if (!d) return { present: false };
  const r = d.getBoundingClientRect();
  return {
    present: true, open: d.open, summary: d.querySelector('summary')?.innerText?.trim(),
    top: Math.round(r.top), height: Math.round(r.height),
    links: [...d.querySelectorAll('a')].map(a => ({ text: a.innerText.trim().slice(0, 40), href: a.getAttribute('href') })).slice(0, 4),
    linkCount: d.querySelectorAll('a').length,
    locked: d.querySelectorAll('.is-locked').length,
    unlocked: d.querySelectorAll('.is-unlocked').length,
  };
});
console.log('drawer closed:', JSON.stringify(drawer));
// Open it and measure what it costs the first screen.
const opened = await page.evaluate(() => {
  const d = document.querySelector('details.almanac-drawer');
  d.open = true;
  const r = d.getBoundingClientRect();
  return { height: Math.round(r.height), top: Math.round(r.top), scroll: Math.round(document.documentElement.scrollHeight) };
});
console.log('drawer open:', JSON.stringify(opened));
await page.screenshot({ path: '/tmp/life-th/review/audit/almanac-open-390.png' });
await page.evaluate(() => { document.querySelector('details.almanac-drawer').open = false; });
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/life-th/review/audit/almanac-closed-390.png' });
console.log('page errors:', errors.length ? errors.slice(0, 3) : 'none');
await ctx.close();

// The link the drawer offers: does it start the life it names?
const link = drawer.links?.[0]?.href;
if (link) {
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p2 = await ctx2.newPage();
  const errs2 = [];
  p2.on('pageerror', e => errs2.push(e.message));
  const url = new URL(link, BASE + '/intake/');
  await p2.goto(url.href, { waitUntil: 'load' });
  await p2.waitForTimeout(4000);
  console.log('linked life:', url.href, '=>', JSON.stringify(await p2.evaluate(() => ({
    title: document.querySelector('#birth-title')?.innerText?.trim(),
    card: document.querySelector('#birth-card')?.innerText?.trim().slice(0, 120),
    hidden: document.querySelector('#birth-card')?.hidden,
  }))));
  console.log('linked life errors:', errs2.length ? errs2.slice(0, 2) : 'none');
  await ctx2.close();
}
await browser.close();
