import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { newLife, configureLife, begin, live, validate } from '../dist/course/sim.js';
import { setRegion } from '../dist/course/finance.js';
import { resolveEncounter, encounterById } from '../dist/course/encounters.js';

// Output directory
const reviewDir = resolve('review/world-overhaul');
mkdirSync(reviewDir, { recursive: true });

// CDP client over native WebSocket
class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.logs = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { res, rej } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) rej(new Error(data.error.message));
          else res(data.result);
        } else if (data.method) {
          if (data.method === 'Runtime.consoleAPICalled') {
            this.logs.push(data.params);
          } else if (data.method === 'Runtime.exceptionThrown') {
            this.logs.push({ type: 'error', text: data.params.exceptionDetails?.text || 'Exception' });
          }
        }
      };
    });
  }

  async send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { res: resolve, rej: reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
    }
    return res.result?.value;
  }

  async screenshot(path) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    writeFileSync(path, buf);
    return buf.length;
  }

  close() {
    this.ws?.close();
  }
}

// Generate real validated lives
const settle = s => {
  if (!s.story?.pending) return s;
  const enc = encounterById(s.story.pending.id);
  const choice = s.story.pending.id === 'dog' ? 'adopt' : enc.options[0].id;
  return resolveEncounter(s, choice, 0.5);
};
const to = (s, age) => {
  while (s.age < age && s.stage === 'review') {
    s = settle(s);
    s = live(settle(s));
  }
  return settle(s);
};

console.log('Generating validated test lives...');
let lifeBase = to(begin(configureLife(newLife(11), { upbringing: 'middle', region: 'bang-na' })), 20);
lifeBase = setRegion(lifeBase, 'boston');
const dogLife = to(lifeBase, 30);
console.log('dogLife valid:', validate(dogLife), 'age:', dogLife.age, 'dog flag:', dogLife.story?.flags?.dog);

let recapLife = setRegion(dogLife, 'london');
recapLife = to(recapLife, 40);
recapLife = setRegion(recapLife, 'bang-na');
recapLife = to(recapLife, 80);
console.log('recapLife valid:', validate(recapLife), 'stage:', recapLife.stage, 'age:', recapLife.age);

async function runVerification() {
  const tmpDir = mkdtempSync(join(tmpdir(), 'chrome-life-verify-'));
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + tmpDir,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-background-networking',
    '--window-size=1440,900'
  ]);

  try {
    let version;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch('http://127.0.0.1:9222/json/version');
        if (res.ok) { version = await res.json(); break; }
      } catch (e) {}
    }
    if (!version) throw new Error('Chrome remote debugging port not available');

    const targetsRes = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await targetsRes.json();
    const target = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(target.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log('\n--- 1. Testing Phone Viewport (390x844) on https://life.nonarkara.org/course/ ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await client.send('Page.navigate', { url: 'https://life.nonarkara.org/course/' });
    await new Promise(r => setTimeout(r, 2000));

    // Inject dogLife (age 30 review) into localStorage
    await client.evaluate(`
      (() => {
        localStorage.setItem('life-course-v2', JSON.stringify(${JSON.stringify(dogLife)}));
        location.reload();
      })()
    `);
    await new Promise(r => setTimeout(r, 2500));

    // Measure world height share and header on phone
    const phoneMetrics = await client.evaluate(`
      (() => {
        const stage = document.querySelector('.stage');
        const world = document.querySelector('.world-renderer') || document.getElementById('world');
        const header = document.querySelector('header');
        const stageRect = stage ? stage.getBoundingClientRect() : null;
        const worldRect = world ? world.getBoundingClientRect() : null;
        const headerRect = header ? header.getBoundingClientRect() : null;
        const vh = window.innerHeight;
        const stageShare = stageRect ? (stageRect.height / vh) : 0;
        const worldShare = worldRect ? (worldRect.height / vh) : 0;
        return {
          windowHeight: vh,
          stageHeight: stageRect ? Math.round(stageRect.height) : 0,
          worldHeight: worldRect ? Math.round(worldRect.height) : 0,
          stageSharePercent: Number((stageShare * 100).toFixed(1)),
          worldSharePercent: Number((worldShare * 100).toFixed(1)),
          headerHeight: headerRect ? Math.round(headerRect.height) : 0,
          headerSingleLine: headerRect ? headerRect.height <= 50 : false,
          ageText: document.getElementById('age')?.textContent
        };
      })()
    `);
    console.log('Phone Layout Metrics at Age 30:', JSON.stringify(phoneMetrics, null, 2));

    // Switch to Thai and check single-line header with enlarged text
    await client.evaluate(`
      (() => {
        const select = document.getElementById('setting-language');
        if (select) {
          select.value = 'th';
          select.dispatchEvent(new Event('change'));
        }
        const textSelect = document.getElementById('setting-text-size');
        if (textSelect) {
          textSelect.value = 'extra';
          textSelect.dispatchEvent(new Event('change'));
        }
      })()
    `);
    await new Promise(r => setTimeout(r, 800));

    const thaiPhoneHeader = await client.evaluate(`
      (() => {
        const header = document.querySelector('header');
        const rect = header ? header.getBoundingClientRect() : null;
        const buttons = Array.from(header.querySelectorAll('button')).map(b => b.textContent.trim());
        return {
          headerHeight: rect ? Math.round(rect.height) : 0,
          singleLine: rect ? rect.height <= 52 : false,
          buttons,
          ageText: document.getElementById('age')?.textContent
        };
      })()
    `);
    console.log('Thai Phone Header (Enlarged Text):', JSON.stringify(thaiPhoneHeader, null, 2));

    await client.screenshot(join(reviewDir, 'live-phone-thai-390.png'));
    console.log('Saved', join(reviewDir, 'live-phone-thai-390.png'));

    console.log('\n--- 2. Testing 3D Dog Adoption at Age 30 ---');
    const dogSceneState = await client.evaluate(`
      (() => {
        const world = document.querySelector('.world-renderer');
        return {
          hasWorldRenderer: !!world,
          worldWidth: world ? world.width : 0,
          worldHeight: world ? world.height : 0,
          ageText: document.getElementById('age')?.textContent
        };
      })()
    `);
    console.log('Dog Scene State:', JSON.stringify(dogSceneState, null, 2));

    await client.screenshot(join(reviewDir, 'live-dog-390.png'));
    console.log('Saved', join(reviewDir, 'live-dog-390.png'));

    // Desktop 1440x900 view of 3D dog
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 1000));
    await client.screenshot(join(reviewDir, 'live-dog-1440.png'));
    console.log('Saved', join(reviewDir, 'live-dog-1440.png'));

    console.log('\n--- 3. Testing Owner Reference Life: Ending Route Map & Ikigai ---');
    // Inject completed multi-region life at recap
    await client.evaluate(`
      (() => {
        localStorage.setItem('life-course-v2', JSON.stringify(${JSON.stringify(recapLife)}));
        location.reload();
      })()
    `);
    await new Promise(r => setTimeout(r, 2500));

    const recapDetails = await client.evaluate(`
      (() => {
        const routeCanvas = document.querySelector('.ending-route canvas');
        const ikigaiSec = document.querySelector('.ending-ikigai');
        return {
          routeCanvasFound: !!routeCanvas,
          routeAriaLabel: routeCanvas?.getAttribute('aria-label'),
          routeCanvasWidth: routeCanvas?.width,
          routeCanvasHeight: routeCanvas?.height,
          ikigaiTitle: ikigaiSec?.querySelector('h2')?.textContent,
          recapVisible: !document.getElementById('recap')?.hidden
        };
      })()
    `);
    console.log('Recap & Route Map Details:', JSON.stringify(recapDetails, null, 2));

    // Desktop 1440x900 recap
    await client.screenshot(join(reviewDir, 'live-recap-route-1440.png'));
    console.log('Saved', join(reviewDir, 'live-recap-route-1440.png'));

    // Tablet 1024x768 recap
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 768,
      deviceScaleFactor: 2,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 1000));
    await client.screenshot(join(reviewDir, 'live-recap-route-1024.png'));
    console.log('Saved', join(reviewDir, 'live-recap-route-1024.png'));

    // Phone 390x844 recap
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));
    await client.screenshot(join(reviewDir, 'live-recap-route-390.png'));
    console.log('Saved', join(reviewDir, 'live-recap-route-390.png'));

    console.log('\n--- 4. Console Logs & Errors ---');
    const errors = client.logs.filter(l => l.type === 'error' || l.level === 'error');
    console.log('Errors count:', errors.length);
    if (errors.length) {
      console.log('Errors:', errors);
    } else {
      console.log('Zero runtime errors or exceptions detected!');
    }

    client.close();
  } finally {
    chrome.kill();
    await new Promise(r => setTimeout(r, 500));
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
