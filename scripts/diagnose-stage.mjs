// Ask the running page what it managed to load.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

class CDP {
  constructor(url) { this.url = url; this.id = 1; this.pending = new Map(); this.logs = []; }
  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((ok, no) => { this.ws.onopen = ok; this.ws.onerror = no; });
    this.ws.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.id && this.pending.has(data.id)) {
        const { resolve: ok, reject: no } = this.pending.get(data.id);
        this.pending.delete(data.id);
        data.error ? no(new Error(data.error.message)) : ok(data.result);
      } else if (data.method === 'Runtime.consoleAPICalled') {
        this.logs.push(data.params.type + ': ' + data.params.args.map(a => a.value ?? a.description ?? '').join(' '));
      } else if (data.method === 'Runtime.exceptionThrown') {
        this.logs.push('EXCEPTION ' + (data.params.exceptionDetails?.exception?.description ?? ''));
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
    if (result.exceptionDetails) return { error: result.exceptionDetails.text + ' ' + (result.exceptionDetails.exception?.description ?? '') };
    return result.result.value;
  }
}

const server = spawn('python3', ['scripts/serve.py'], { stdio: 'ignore' });
const tmpDir = mkdtempSync(join(tmpdir(), 'chrome-diag-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9334', '--user-data-dir=' + tmpDir,
  '--no-first-run', '--disable-extensions', '--window-size=1440,900',
]);
try {
  let version;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { const res = await fetch('http://127.0.0.1:9334/json/version'); if (res.ok) { version = await res.json(); break; } } catch {}
  }
  const targets = await (await fetch('http://127.0.0.1:9334/json/list')).json();
  const client = new CDP((targets.find(t => t.type === 'page') || targets[0]).webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Page.navigate', { url: 'http://127.0.0.1:4219/course/' });
  await new Promise(r => setTimeout(r, 3000));
  console.log('manifest fetch:', JSON.stringify(await client.evaluate(`
    fetch('course/anime/manifest.json').then(r=>({status:r.status,ok:r.ok,type:r.headers.get('content-type')})).catch(e=>({error:String(e)}))
  `)));
  console.log('plate fetch:', JSON.stringify(await client.evaluate(`
    fetch('course/anime/plates/home-day.webp').then(r=>({status:r.status,type:r.headers.get('content-type')})).catch(e=>({error:String(e)}))
  `)));
  console.log('image load:', JSON.stringify(await client.evaluate(`
    new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({loaded:true,w:img.naturalWidth});img.onerror=()=>resolve({loaded:false});img.src='course/anime/plates/home-day.webp';})
  `)));
  console.log('console:', client.logs.slice(0, 12));
} finally {
  chrome.kill();
  server.kill();
}
