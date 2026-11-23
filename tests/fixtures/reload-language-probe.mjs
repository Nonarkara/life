// Measures what a non-English player downloads on a plain reload with a stored
// language preference, and whether that language actually renders.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

const base = (process.env.BASE || 'http://127.0.0.1:4219') + '/';
const b = await chromium.launch();
for (const lang of ['th', 'ja']) {
  const ctx = await b.newContext();
  await ctx.addInitScript(lang_ => {
    localStorage.setItem('life-preferences-v1', JSON.stringify({ language: lang_, size: 'standard', motion: false, stage: 'hybrid', palette: 'auto', v: 3 }));
  }, lang);
  const page = await ctx.newPage();
  const fetched = [];
  page.on('request', r => { const u = r.url(); if (u.includes('/course/') && /translat|copy\.js/.test(u)) fetched.push(u.split('/course/')[1]); });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const state = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    thaiVisible: /[ก-๛]/.test(document.body.innerText.slice(0, 4000)),
    sample: document.body.innerText.slice(0, 120).replace(/\n/g, ' | ')
  }));
  const bytes = await ctx.request.get(base + 'build.json').then(r => r.text()).catch(() => 'n/a');
  console.log(JSON.stringify({ lang, ...state, translationRequests: fetched, build: bytes }, null, 1));
  assert.equal(state.lang, lang, 'the stored language must be the page language after a reload');
  if (lang === 'th') assert.ok(state.thaiVisible, 'Thai text must render');
  await ctx.close();
}
await b.close();
