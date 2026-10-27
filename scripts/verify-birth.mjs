// Capture the birth stage: the memory band that opens every life.
// Usage: node scripts/verify-birth.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';

class CDP {
  constructor(url) { this.url = url; this.id = 1; this.pending = new Map(); }
  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => { this.ws.onopen = resolve; this.ws.onerror = reject; });
    this.ws.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.id && this.pending.has(data.id)) {
        const { resolve: ok, reject: no } = this.pending.get(data.id);
        this.pending.delete(data.id);
        data.error ? no(new Error(data.error.message)) : ok(data.result);
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

const server = spawn('python3', ['scripts/serve.py'], { stdio: 'ignore' });
const profile = mkdtempSync(join(tmpdir(), 'life-birth-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9480', `--user-data-dir=${profile}`, '--no-first-run', '--window-size=1440,900',
]);
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { const r = await fetch('http://127.0.0.1:9480/json/version'); if (r.ok) { ready = true; break; } } catch {}
  }
  if (!ready) throw new Error('chrome did not open');
  const targets = await (await fetch('http://127.0.0.1:9480/json/list')).json();
  const client = new CDP((targets.find(t => t.type === 'page') || targets[0]).webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable'); await client.send('Runtime.enable');
  for (const [width, height, name] of [[1440, 900, 'birth-desktop-1440'], [390, 844, 'birth-phone-390']]) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
    await client.send('Page.navigate', { url: 'http://127.0.0.1:4219/course/' });
    await new Promise(r => setTimeout(r, 3500));
    const report = await client.evaluate(`(() => {
      const band = document.getElementById('childhood-memory');
      const r = band?.getBoundingClientRect();
      const kids = [...(band?.children || [])].map(e => ({ id: e.id || e.className, x: Math.round(e.getBoundingClientRect().left - (r ? r.left : 0)), w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height) }));
      return {
        stage: document.getElementById('scene-caption')?.textContent?.trim(),
        band: r ? { w: Math.round(r.width), h: Math.round(r.height) } : null,
        kids,
        pageOverflow: document.documentElement.scrollHeight - document.documentElement.clientHeight,
      };
    })()`);
    console.log(name, JSON.stringify(report));
    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`review/stage/${name}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Saved review/stage/${name}.png`);
  }
} finally {
  chrome.kill(); server.kill(); rmSync(profile, { recursive: true, force: true });
}
