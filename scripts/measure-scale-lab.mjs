// Measure the drawn person against the painted band, at the sizes that matter.
//
// The complaint was "the scale is too small". This does not argue about it:
// it draws the real scene at a real size and measures the person that the
// renderer actually put on screen, next to the band that holds them.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const reviewDir = resolve(process.env.LIFE_REVIEW || 'review/scale');
mkdirSync(reviewDir, { recursive: true });
const BASE = (process.env.LIFE_BASE || 'http://127.0.0.1:4219').replace(/\/$/, '');
const SET = process.env.LIFE_SET || 'travel';
const AGE = process.env.LIFE_AGE || '30';

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

const tmpDir = mkdtempSync(join(tmpdir(), 'chrome-scale-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9456', '--user-data-dir=' + tmpDir,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-background-networking', '--hide-scrollbars',
]);

try {
  copyFileSync(resolve('scripts/scale-lab.html'), resolve('out/scale-lab.html'));
  let version;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { const res = await fetch('http://127.0.0.1:9456/json/version'); if (res.ok) { version = await res.json(); break; } } catch {}
  }
  if (!version) throw new Error('chrome not available');
  const targets = await (await fetch('http://127.0.0.1:9456/json/list')).json();
  const target = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDP(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 20, everyNthFrame: 1 });

  const sizes = process.env.LIFE_SIZES
    ? process.env.LIFE_SIZES.split(',').map(spec => { const [w, h] = spec.split('x').map(Number); return [w, h, `${w}x${h}`]; })
    : [[390, 844, 'phone'], [1024, 768, 'tablet'], [1440, 900, 'desktop'], [1342, 961, 'wide']];
  for (const [width, height, name] of sizes) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    const url = `${BASE}/scale-lab.html?w=${width}&h=${height}&age=${AGE}&set=${SET}`;
    await client.send('Page.navigate', { url });
    let result = null;
    for (let i = 0; i < 90; i++) {
      await new Promise(r => setTimeout(r, 300));
      result = await client.evaluate('window.__scale ?? null');
      if (result) break;
    }
    if (!result) { console.log(name, JSON.stringify({ error: 'lab did not answer' })); continue; }
    console.log(name, JSON.stringify(result));
    await client.screenshot(join(reviewDir, `scale-${SET}-${name}.png`));
  }
  const errors = client.logs.filter(line => /error|EXCEPTION/i.test(line));
  console.log('console errors:', errors.length ? errors.slice(0, 5) : 'none');
} finally {
  chrome.kill();
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
}
