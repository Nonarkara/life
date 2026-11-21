// Is the childhood dead rectangle a software-rasteriser artefact?
// Renders the same beat under different GL backends and reports which
// renderer actually answered, so the answer is about the pixels, not the flag.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire((process.env.PLAYWRIGHT_FROM ?? '/Users/nonarkara/Projects/palette') + '/');
const { chromium } = require('playwright');

const BASE = (process.env.BASE || 'https://life.nonarkara.org').replace(/\/$/, '');
const OUT = 'review/gpu';
fs.mkdirSync(OUT, { recursive: true });

const CONFIGS = [
  { name: 'default', args: [] },
  { name: 'angle-metal', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan,Metal'] },
  { name: 'swiftshader', args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] },
];

const seed = async page => {
  await page.goto(BASE + '/course/', { waitUntil: 'load' });
  const st = await page.evaluate(async () => {
    const v = new URL(document.querySelector('script[src*=boot]').src).search;
    const { newLife } = await import('/course/sim.js' + v);
    const s = newLife(11 * 7919);
    return { ...s, progressAge: 6.05, childhood: { origin: { cash: s.cash, health: s.health, wellbeing: s.wellbeing }, choices: [], startsAt: 6 } };
  });
  await page.evaluate(s => localStorage.setItem('life-course-v2', JSON.stringify(s)), st);
  await page.goto(BASE + '/course/', { waitUntil: 'load' });
  await page.waitForTimeout(4000);
};

for (const config of CONFIGS) {
  const browser = await chromium.launch({ args: config.args });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await seed(page);
  const info = await page.evaluate(() => {
    const c = document.querySelector('canvas.world-renderer');
    if (!c) return { error: 'no canvas' };
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return { error: 'no gl' };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      canvas: [c.width, c.height],
      client: [c.clientWidth, c.clientHeight],
    };
  });
  await page.screenshot({ path: `${OUT}/childhood-${config.name}.png` });
  console.log(config.name, JSON.stringify(info), 'errors:', errors.length ? errors.slice(0, 3) : 'none');
  await browser.close();
}
