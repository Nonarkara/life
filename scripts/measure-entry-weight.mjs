// What a first-time visitor downloads before they see anything: the entry view
// of the surfaces a stranger lands on. Measured as transferred bytes, with the
// files named, because "the entry is heavy" is not a finding.
// Usage: BASE=http://127.0.0.1:4219 node scripts/measure-entry-weight.mjs
import { createRequire } from 'node:module';
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? '/Users/nonarkara/Projects/palette') + '/');
const { chromium } = require('playwright');

const BASE = (process.env.BASE || 'http://127.0.0.1:4219').replace(/\/$/, '');
const PATHS = (process.env.PATHS || '/intake/,/course/').split(',');

const browser = await chromium.launch();
try {
  for (const path of PATHS) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const rows = [];
    page.on('response', async r => {
      const url = r.url();
      if (!url.startsWith(BASE)) return;
      let size = 0;
      try { size = (await r.body()).length; } catch { size = 0; }
      rows.push({ url: url.slice(BASE.length), size });
    });
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(6000);
    const rowsByUrl = new Map();
    for (const r of rows) rowsByUrl.set(r.url, Math.max(rowsByUrl.get(r.url) ?? 0, r.size));
    const sorted = [...rowsByUrl].sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((a, b) => a + b[1], 0);
    console.log(`${path}  ${sorted.length} files  ${Math.round(total / 1024)} kB`);
    for (const [url, size] of sorted.slice(0, 8)) console.log(`   ${String(Math.round(size / 1024)).padStart(6)} kB  ${url}`);
    await context.close();
  }
} finally {
  await browser.close();
}
