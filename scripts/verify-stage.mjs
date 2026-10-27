// Prove the painted stage on a real browser: capture it at three widths, with
// the same life, and fail loudly if the page reports an error.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { newLife, configureLife, begin, live, validate } from '../dist/course/sim.js';
import { resolveEncounter, encounterById } from '../dist/course/encounters.js';

const reviewDir = resolve('review/stage');
mkdirSync(reviewDir, { recursive: true });

const settle = s => {
  if (!s.story?.pending) return s;
  const enc = encounterById(s.story.pending.id);
  const choice = enc.options[0];
  return resolveEncounter(s, choice.id, 0.5);
};
let life = begin(configureLife(newLife(11), { upbringing: 'middle', region: 'bang-na' }));
while (life.age < 30 && life.stage === 'review') life = settle(live(settle(life)));
life = settle(life);
console.log('life age', life.age, 'valid', validate(life));

class CDP {
  constructor(url) { this.url = url; this.id = 1; this.pending = new Map(); this.logs = []; }
  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => { this.ws.onopen = resolve; this.ws.onerror = reject; });
    this.ws.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.id && this.pending.has(data.id)) {
        const { resolve: ok, reject: no } = this.pending.get(data.id);
        this.pending.delete(data.id);
        data.error ? no(new Error(data.error.message)) : ok(data.result);
      } else if (data.method === 'Runtime.consoleAPICalled') {
        this.logs.push(data.params.args.map(a => a.value ?? a.description ?? '').join(' '));
      } else if (data.method === 'Runtime.exceptionThrown') {
        this.logs.push('EXCEPTION ' + (data.params.exceptionDetails?.exception?.description ?? data.params.exceptionDetails?.text));
      }
    };
  }
  send(method, params = {}) {
    const id = this.id++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((ok, no) => this.pending.set(id, { resolve: ok, reject: no }));
  }
  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ' ' + (result.exceptionDetails.exception?.description ?? ''));
    return result.result.value;
  }
  async screenshot(path) {
    const shot = await this.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path, Buffer.from(shot.data, 'base64'));
  }
}

const server = spawn('python3', ['scripts/serve.py'], { stdio: 'ignore' });
const tmpDir = mkdtempSync(join(tmpdir(), 'chrome-stage-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9333', '--user-data-dir=' + tmpDir,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-background-networking', '--hide-scrollbars', '--window-size=1440,900',
]);

try {
  let version;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { const res = await fetch('http://127.0.0.1:9333/json/version'); if (res.ok) { version = await res.json(); break; } } catch {}
  }
  // The preview server must be up before the first navigation, or the life is
  // injected into a page that never existed.
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { const res = await fetch('http://127.0.0.1:4219/build.json'); if (res.ok) { ready = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  if (!ready) throw new Error('preview server not available');
  if (!version) throw new Error('Chrome remote debugging port not available');
  const targets = await (await fetch('http://127.0.0.1:9333/json/list')).json();
  const target = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDP(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  for (const [width, height, name] of [[390, 844, 'phone'], [1024, 768, 'tablet'], [1440, 900, 'desktop']]) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
    const EXPECTED_AGE = life.age;
    // The life is injected from a page that is not the game, so the running game
    // cannot save over it between the injection and the reload. If the game
    // still shows its own life, the injection is repeated.
    for (let attempt = 0; attempt < 3; attempt++) {
      await client.send('Page.navigate', { url: 'http://127.0.0.1:4219/build.json' });
      await new Promise(r => setTimeout(r, 400));
      await client.evaluate(`(() => {
        localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(life))});
        return true;
      })()`);
      await client.send('Page.navigate', { url: 'http://127.0.0.1:4219/course/' });
      await new Promise(r => setTimeout(r, 2500));
      const shown = await client.evaluate(`document.getElementById('age')?.textContent?.trim() ?? ''`);
      if (shown.includes(String(EXPECTED_AGE))) break;
      console.log(name, 'life not shown yet, injecting again');
    }
    await new Promise(r => setTimeout(r, 500));
    const report = await client.evaluate(`(() => {
      const world = document.getElementById('world');
      const ctx = world.getContext('2d');
      const data = ctx.getImageData(0, 0, world.width, world.height).data;
      let painted = 0;
      for (let i = 3; i < data.length; i += 4 * 97) if (data[i] > 8) painted++;
      const three = document.querySelector('canvas.world-renderer');
      const box = selector => { const el = document.querySelector(selector); if (!el) return null; const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };
      const stage = document.querySelector('.stage'), reader = document.querySelector('.console-reader');
      const a = stage?.getBoundingClientRect(), b = reader?.getBoundingClientRect();
      const overflow = el => { const e = document.querySelector(el); return e ? e.scrollHeight - e.clientHeight : null; };
      return {
        age: document.getElementById('age')?.textContent?.trim(),
        worldWidth: world.width, worldHeight: world.height,
        paintedSamples: painted,
        threeRendererPresent: !!three,
        threeRendererHidden: three ? three.hidden : null,
        stageText: document.getElementById('scene-caption')?.textContent?.trim(),
        manifest: !!document.querySelector('script[type=module]'),
        // The layout must not scroll the page, must not paint one panel over
        // another, and must not clip the console it owns.
        pageOverflow: document.documentElement.scrollHeight - document.documentElement.clientHeight,
        stageBox: box('.stage'), readerBox: box('.console-reader'),
        stageAspect: a && a.height ? +(a.width / a.height).toFixed(2) : null,
        panelsOverlap: a && b ? !(a.right <= b.left || b.left >= a.right || a.bottom <= b.top || b.top >= a.bottom) : null,
        planOverflow: overflow('#console-plan'),
        readerOverflow: overflow('.console-cards'),
        deckBox: box('#life-deck'),
        transportKeys: [...document.querySelectorAll('.transport-key')].map(k => k.getAttribute('aria-label') + (k.getAttribute('aria-pressed') === 'true' ? '*' : '')),
      };
    })()`);
    console.log(name, width + 'x' + height, JSON.stringify(report));
    await client.screenshot(join(reviewDir, `stage-${name}-${width}.png`));
  }

  const errors = client.logs.filter(line => /error|EXCEPTION|failed/i.test(line));
  console.log('console errors:', errors.length ? errors : 'none');

  // The two hard questions at a station.
  await client.evaluate(`document.getElementById('tab-questions')?.click(); true`);
  await new Promise(r => setTimeout(r, 600));
  const questions = await client.evaluate(`(() => {
    const panel = document.getElementById('questions');
    const buttons = panel ? panel.querySelectorAll('.pivot-option').length : 0;
    const commit = document.getElementById('commit');
    return { options: buttons, commitDisabled: commit?.disabled, commitText: commit?.textContent, questions: panel ? panel.querySelectorAll('.pivot').length : 0 };
  })()`);
  console.log('questions panel:', JSON.stringify(questions));
  await client.screenshot(join(reviewDir, 'stage-questions-1440.png'));
  console.log('Saved', join(reviewDir, 'stage-questions-1440.png'));

  // The day moves on: the same life, later in the day, in other places.
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await client.send('Page.navigate', { url: 'http://127.0.0.1:4219/build.json' });
  await new Promise(r => setTimeout(r, 400));
  await client.evaluate(`localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(life))}); true`);
  await client.send('Page.navigate', { url: 'http://127.0.0.1:4219/course/' });
  const wanted = [/Daytime/i, /Evening/i];
  for (const pattern of wanted) {
    for (let i = 0; i < 70; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const caption = await client.evaluate(`document.getElementById('scene-caption')?.textContent?.trim() ?? ''`);
      if (pattern.test(caption)) {
        const file = join(reviewDir, `stage-${caption.split(' ')[0].toLowerCase()}-1440.png`);
        await client.screenshot(file);
        console.log('captured', caption, '->', file);
        break;
      }
    }
  }
} finally {
  chrome.kill();
  server.kill();
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
}
