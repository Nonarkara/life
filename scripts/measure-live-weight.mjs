// What a visitor actually downloads: the live weight of one ordinary view.
// Usage: LIFE_BASE=https://life.nonarkara.org node scripts/measure-live-weight.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { newLife, configureLife, begin, live } from '../dist/course/sim.js';
import { resolveEncounter, encounterById } from '../dist/course/encounters.js';

const BASE = (process.env.LIFE_BASE || 'http://127.0.0.1:4219').replace(/\/$/, '');
const REMOTE = !BASE.includes('127.0.0.1');
const reviewDir = resolve(process.env.LIFE_REVIEW || 'review/weight');
mkdirSync(reviewDir, { recursive: true });

const settle = s => {
  if (!s.story?.pending) return s;
  const enc = encounterById(s.story.pending.id);
  return resolveEncounter(s, enc.options[0].id, 0.5);
};
let life = begin(configureLife(newLife(11), { upbringing: 'middle', region: 'bang-na' }));
while (life.age < 30 && life.stage === 'review') life = settle(live(settle(life)));
life = settle(life);

class CDP {
  constructor(url) { this.url = url; this.id = 1; this.pending = new Map(); this.bytes = new Map(); }
  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => { this.ws.onopen = resolve; this.ws.onerror = reject; });
    this.ws.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.id && this.pending.has(data.id)) {
        const { resolve: ok, reject: no } = this.pending.get(data.id);
        this.pending.delete(data.id);
        data.error ? no(new Error(data.error.message)) : ok(data.result);
      } else if (data.method === 'Network.loadingFinished') {
        const size = this.bytes.get(data.params.requestId) ?? 0;
        this.bytes.set(data.params.requestId, size);
        this.sizes.set(data.params.requestId, data.params.encodedDataLength);
      }
    };
  }
  send(method, params = {}) {
    const id = this.id++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  async evaluate(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  }
}

const server = REMOTE ? null : spawn('python3', ['scripts/serve.py'], { stdio: 'ignore' });
const profile = mkdtempSync(join(tmpdir(), 'life-weight-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9471', `--user-data-dir=${profile}`,
  '--no-first-run', '--window-size=1440,900',
]);
try {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { const res = await fetch('http://127.0.0.1:9471/json/version'); if (res.ok) break; } catch {}
  }
  const targets = await (await fetch('http://127.0.0.1:9471/json/list')).json();
  const client = new CDP((targets.find(t => t.type === 'page') || targets[0]).webSocketDebuggerUrl);
  client.sizes = new Map();
  await client.connect();
  await client.send('Page.enable'); await client.send('Runtime.enable'); await client.send('Network.enable');
  await client.send('Page.navigate', { url: BASE + '/build.json' });
  await new Promise(r => setTimeout(r, 800));
  await client.evaluate(`localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(life))}); true`);
  client.sizes.clear();
  await client.send('Page.navigate', { url: BASE + '/course/' });
  await new Promise(r => setTimeout(r, 6000));
  const requests = [];
  for (const [id, size] of client.sizes) requests.push(size);
  const total = requests.reduce((a, b) => a + b, 0);
  const report = await client.evaluate(`(() => ({
    build: document.querySelector('script[type=module]')?.src || null,
    age: document.getElementById('age')?.textContent,
    transport: [...document.querySelectorAll('.transport-key')].map(k => k.getAttribute('aria-label')),
    stageBox: (() => { const r = document.querySelector('.stage')?.getBoundingClientRect(); return r ? { w: Math.round(r.width), h: Math.round(r.height) } : null; })(),
    readerBox: (() => { const r = document.querySelector('.console-reader')?.getBoundingClientRect(); return r ? { w: Math.round(r.width), h: Math.round(r.height) } : null; })(),
    pageOverflow: document.documentElement.scrollHeight - document.documentElement.clientHeight,
  }))()`);
  console.log('live weight for one ordinary review view:');
  console.log('  requests   ', requests.length);
  console.log('  transferred', (total / 1024).toFixed(0) + ' kB');
  console.log('  view       ', JSON.stringify(report));
  const shot = await client.send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(reviewDir, 'live-weight-1440.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved', join(reviewDir, 'live-weight-1440.png'));
} finally {
  chrome.kill(); server?.kill();
  await new Promise(r => setTimeout(r, 300));
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
