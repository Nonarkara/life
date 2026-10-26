// Prove the lived moments on a real browser: play a life until the moment
// happens, stop the life there, then capture the stage at the hour of the day
// that moment belongs to.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { newLife, configureLife, begin, live, validate } from '../dist/course/sim.js';
import { resolveEncounter, encounterById } from '../dist/course/encounters.js';

const reviewDir = resolve('review/beats');
mkdirSync(reviewDir, { recursive: true });

// The life is played, not scripted: a moment has to be lived to be drawn.
const wanted = { friend: 'join', love: 'date', bully: 'push', commitment: 'together' };
const settle = s => {
  if (!s.story?.pending) return s;
  const enc = encounterById(s.story.pending.id);
  const choice = enc.options.find(o => o.id === wanted[enc.id]) ?? enc.options[0];
  return resolveEncounter(s, choice.id, 0.5);
};

// Play a life until the moment we want to photograph happens, then stop there.
function lifeAt(moment, seed) {
  let life = begin(configureLife(newLife(seed), { upbringing: 'middle', region: 'bang-na' }));
  let guard = 0;
  while (life.age < 40 && life.stage === 'review' && guard++ < 60) {
    life = live(life);
    const pending = life.story?.pending;
    if (pending && pending.id === moment) return settle(life);
    life = settle(life);
  }
  return null;
}

const plans = [
  { moment: 'love', file: 'love', hours: [['evening', /Evening/i]] },
  { moment: 'bully', file: 'bully', hours: [['daytime', /Daytime/i], ['on the way', /On the way/i]] },
  { moment: 'friend', file: 'bikes', hours: [['on the way', /On the way/i]] },
];
const lives = [];
for (const plan of plans) {
  for (let seed = 11; seed < 120 && !lives.some(l => l.moment === plan.moment); seed++) {
    const life = lifeAt(plan.moment, seed);
    if (life && validate(life)) lives.push({ moment: plan.moment, file: plan.file, hours: plan.hours, life });
  }
}
for (const l of lives) console.log('moment', l.moment, 'at age', l.life.age, 'valid', validate(l.life));

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
const tmpDir = mkdtempSync(join(tmpdir(), 'chrome-beats-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9335', '--user-data-dir=' + tmpDir,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-background-networking', '--hide-scrollbars', '--window-size=1440,900',
]);

// A canvas that was just resized is empty until the next frame is drawn, so
// the picture is only taken when the world has actually been painted.
const measure = `(() => {
  const world = document.getElementById('world');
  const ctx = world.getContext('2d');
  const data = ctx.getImageData(0, 0, world.width, world.height).data;
  let painted = 0;
  for (let i = 0; i < data.length; i += 4 * 37) {
    if (data[i] !== 18 || data[i + 1] !== 16 || data[i + 2] !== 12) painted++;
  }
  return { width: world.width, height: world.height, paintedSamples: painted,
           caption: document.getElementById('scene-caption')?.textContent?.trim() ?? '' };
})()`;

try {
  let version;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { const res = await fetch('http://127.0.0.1:9335/json/version'); if (res.ok) { version = await res.json(); break; } } catch {}
  }
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { const res = await fetch('http://127.0.0.1:4219/build.json'); if (res.ok) { ready = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  if (!ready) throw new Error('preview server not available');
  if (!version) throw new Error('Chrome remote debugging port not available');
  const targets = await (await fetch('http://127.0.0.1:9335/json/list')).json();
  const target = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDP(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  for (const plan of lives) {
    await client.send('Page.navigate', { url: 'http://127.0.0.1:4219/build.json' });
    await new Promise(r => setTimeout(r, 500));
    await client.evaluate(`localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(plan.life))}); true`);
    await client.send('Page.navigate', { url: 'http://127.0.0.1:4219/course/' });
    await new Promise(r => setTimeout(r, 2500));
    for (const [name, pattern] of plan.hours) {
      for (let i = 0; i < 90; i++) {
        await new Promise(r => setTimeout(r, 900));
        const caption = await client.evaluate(`document.getElementById('scene-caption')?.textContent?.trim() ?? ''`);
        if (!pattern.test(caption)) continue;
        // Wait for the world to be painted, then take the picture.
        let info = await client.evaluate(measure);
        for (let wait = 0; wait < 30 && info.paintedSamples < 100; wait++) {
          await new Promise(r => setTimeout(r, 250));
          info = await client.evaluate(measure);
        }
        const file = join(reviewDir, `beat-${plan.file}-${name}-1440.png`);
        await client.screenshot(file);
        console.log(plan.moment, name, JSON.stringify(info), '->', file);
        break;
      }
    }
  }
  const errors = client.logs.filter(line => /error|EXCEPTION|failed/i.test(line));
  console.log('console errors:', errors.length ? errors : 'none');
  const warnings = client.logs.filter(line => /warn|interrupt/i.test(line));
  console.log('console warnings:', warnings.length ? warnings : 'none');
} finally {
  chrome.kill();
  server.kill();
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
}
