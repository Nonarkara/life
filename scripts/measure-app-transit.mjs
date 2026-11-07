// Drive the real game into a scene and measure the person the renderer draws.
//
// The complaint was that the scale is too small. This plays the actual app —
// the same build the owner sees — reaches the moment in question, and measures
// the drawn figure against the band that holds it.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { newLife, configureLife, begin, live, validate } from '../dist/course/sim.js';
import { resolveEncounter, encounterById } from '../dist/course/encounters.js';

const reviewDir = resolve(process.env.LIFE_REVIEW || 'review/scale');
mkdirSync(reviewDir, { recursive: true });
const BASE = (process.env.LIFE_BASE || 'http://127.0.0.1:4219').replace(/\/$/, '');
const AGE = Number(process.env.LIFE_AGE || 30);

const settle = s => {
  if (!s.story?.pending) return s;
  const enc = encounterById(s.story.pending.id);
  return resolveEncounter(s, enc.options[0].id, 0.5);
};
let life = begin(configureLife(newLife(11), { upbringing: 'middle', region: 'bang-na' }));
let guard = 0;
while (life.age < AGE && guard++ < 600) life = settle(live(settle(life)));
life = settle(life);
console.log('life age', life.age, 'stage', life.stage, 'valid', validate(life));

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
      } else if (data.method === 'Page.screencastFrame') {
        this.send('Page.screencastFrameAck', { sessionId: data.params.sessionId }).catch(() => {});
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
  async screenshot(path, clip) {
    const params = { format: 'png' };
    if (clip) params.clip = { ...clip, scale: 1 };
    const shot = await this.send('Page.captureScreenshot', params);
    writeFileSync(path, Buffer.from(shot.data, 'base64'));
  }
}

// The person is found by their own colours, inside the column the renderer
// puts them in. The paintings hold ochre and olive too, so the search is
// limited to where the player actually stands.
const PROBE = `(() => {
  const canvas = document.getElementById('world');
  if (!canvas) return { error: 'no canvas' };
  const ctx = canvas.getContext('2d');
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const specs = { shirt: [214, 176, 80, 34], trousers: [104, 108, 62, 30], skin: [228, 194, 162, 22] };
  const boxes = {};
  for (const [name, s] of Object.entries(specs)) {
    let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1, count = 0;
    const x0 = Math.floor(width * 0.30), x1 = Math.ceil(width * 0.58);
    for (let y = 0; y < height; y++) for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 8) continue;
      if (Math.abs(data[i] - s[0]) > s[2] || Math.abs(data[i + 1] - s[1]) > s[2] || Math.abs(data[i + 2] - s[3]) > s[2]) continue;
      count++;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    boxes[name] = count ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, count } : null;
  }
  const rect = canvas.getBoundingClientRect();
  return {
    canvas: { backingW: canvas.width, backingH: canvas.height, cssW: Math.round(rect.width), cssH: Math.round(rect.height), top: Math.round(rect.top), left: Math.round(rect.left) },
    dpr: devicePixelRatio,
    boxes,
    bandHeightCss: Math.round(rect.height),
    location: document.getElementById('location')?.textContent?.trim() ?? '',
    caption: document.getElementById('scene-caption')?.textContent?.trim() ?? '',
    age: document.getElementById('age')?.textContent?.trim() ?? '',
  };
})()`;

const tmpDir = mkdtempSync(join(tmpdir(), 'chrome-app-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9457', '--user-data-dir=' + tmpDir,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-background-networking', '--hide-scrollbars',
]);

try {
  let version;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { const res = await fetch('http://127.0.0.1:9457/json/version'); if (res.ok) { version = await res.json(); break; } } catch {}
  }
  if (!version) throw new Error('chrome not available');
  const targets = await (await fetch('http://127.0.0.1:9457/json/list')).json();
  const target = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDP(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 20, everyNthFrame: 1 });

  const sizes = process.env.LIFE_SIZES
    ? process.env.LIFE_SIZES.split(',').map(spec => { const [w, h] = spec.split('x').map(Number); return [w, h, `${w}x${h}`]; })
    : [[1440, 900, 'desktop'], [1342, 961, 'wide'], [390, 844, 'phone']];

  for (const [width, height, name] of sizes) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
    // Headless reports a reduced-motion preference; the game then jumps to the
    // end of the year instead of playing the day, and the day is what is asked for.
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await client.send('Page.navigate', { url: BASE + '/course/' });
    await new Promise(r => setTimeout(r, 1200));
    await client.evaluate(`(() => { localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(life))}); return true; })()`);
    await client.send('Page.navigate', { url: BASE + '/course/' });
    await new Promise(r => setTimeout(r, 2500));

    // Commit the plan. A review may ask a question first: answer it, set the
    // decision aside, commit again.
    for (let i = 0; i < 14; i++) {
      const hasOption = await client.evaluate(`!!document.querySelector('.pivot-option')`);
      if (hasOption) {
        await client.evaluate(`document.querySelector('.pivot-option')?.click(); true`);
        await new Promise(r => setTimeout(r, 350));
        const pager = await client.evaluate(`!!document.querySelector('.decision-pager')`);
        if (pager) {
          await client.evaluate(`document.querySelector('.decision-pager')?.click(); true`);
          await new Promise(r => setTimeout(r, 450));
        }
        const aside = await client.evaluate(`!!document.querySelector('.decision-set-aside')`);
        if (aside) {
          await client.evaluate(`document.querySelector('.decision-set-aside')?.click(); true`);
          await new Promise(r => setTimeout(r, 450));
        }
        continue;
      }
      const hidden = await client.evaluate(`document.getElementById('commit')?.hidden ?? true`);
      if (hidden) break;
      await client.evaluate(`document.getElementById('commit')?.click(); true`);
      await new Promise(r => setTimeout(r, 900));
    }

    let report = null;
    for (let i = 0; i < 120; i++) {
      await new Promise(r => setTimeout(r, 250));
      const probe = await client.evaluate(PROBE);
      if (probe?.location && /transit|on the way/i.test(probe.location)) { report = probe; break; }
    }
    if (!report) {
      report = await client.evaluate(PROBE);
      report.note = 'never reached transit';
    }
    console.log(name, JSON.stringify(report));
    const clip = report.canvas ? { x: report.canvas.left, y: report.canvas.top, width: report.canvas.cssW, height: report.canvas.cssH } : null;
    if (clip) await client.screenshot(join(reviewDir, `app-${name}.png`), clip);
  }
  const errors = client.logs.filter(line => /error|EXCEPTION/i.test(line));
  console.log('console errors:', errors.length ? errors.slice(0, 5) : 'none');
} finally {
  chrome.kill();
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
}
