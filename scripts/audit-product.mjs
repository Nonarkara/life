// A product audit, not a screenshot review. Drives the real game in a real
// browser and measures the things a shipping product has to get right:
// accessible names, contrast, keyboard order and focus, resilience when the
// save or the art is broken, the weight of a view, and frame pacing.
//
//   node scripts/audit-product.mjs                 # against the local preview
//   LIFE_BASE=https://life.nonarkara.org node scripts/audit-product.mjs
//
// Writes review/product-audit/REPORT.md and review/product-audit/report.json.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { newLife, configureLife, begin, live } from '../dist/course/sim.js';
import { resolveEncounter, encounterById } from '../dist/course/encounters.js';

const BASE = (process.env.LIFE_BASE || 'http://127.0.0.1:4219').replace(/\/$/, '');
const REMOTE = !BASE.includes('127.0.0.1');
const outDir = resolve('review/product-audit');
mkdirSync(outDir, { recursive: true });

const settle = s => {
  if (!s.story?.pending) return s;
  const enc = encounterById(s.story.pending.id);
  return resolveEncounter(s, enc.options[0].id, 0.5);
};
let life = begin(configureLife(newLife(11), { upbringing: 'middle', region: 'bang-na' }));
while (life.age < 30 && life.stage === 'review') life = settle(live(settle(life)));
life = settle(life);

class CDP {
  constructor(url) { this.url = url; this.id = 1; this.pending = new Map(); this.logs = []; this.requests = new Map(); }
  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((ok, no) => { this.ws.onopen = ok; this.ws.onerror = no; });
    this.ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && this.pending.has(d.id)) {
        const { resolve: ok, reject: no } = this.pending.get(d.id);
        this.pending.delete(d.id);
        d.error ? no(new Error(d.error.message)) : ok(d.result);
      } else if (d.method === 'Runtime.consoleAPICalled') {
        this.logs.push({ kind: d.params.type, text: d.params.args.map(a => a.value ?? a.description ?? '').join(' ') });
      } else if (d.method === 'Runtime.exceptionThrown') {
        this.logs.push({ kind: 'exception', text: d.params.exceptionDetails?.exception?.description ?? d.params.exceptionDetails?.text ?? '' });
      } else if (d.method === 'Network.responseReceived') {
        this.requests.set(d.params.requestId, { url: d.params.response.url, type: d.params.type, status: d.params.response.status });
      } else if (d.method === 'Network.loadingFinished') {
        const entry = this.requests.get(d.params.requestId);
        if (entry) entry.bytes = d.params.encodedDataLength;
      }
    };
  }
  send(method, params = {}) {
    const id = this.id++;
    this.ws.send(JSON.stringify({ id, method, params }));
    const label = method;
    return new Promise((ok, no) => {
      const timer = setTimeout(() => { this.pending.delete(id); no(new Error(label + ' did not answer in 20s')); }, 20000);
      this.pending.set(id, { resolve: v => { clearTimeout(timer); ok(v); }, reject: e => { clearTimeout(timer); no(e); } });
    });
  }
  async evaluate(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description ?? ''));
    return r.result.value;
  }
  async key(key, code, keyCode) {
    for (const type of ['keyDown', 'keyUp']) await this.send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
  }
  async shot(name) {
    const s = await this.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(outDir, name), Buffer.from(s.data, 'base64'));
  }
  close() { this.ws?.close(); }
}

// LIFE_CHROME overrides the browser; Chrome for Testing paints in a headless session where the
// installed Chrome app can sit throttled, which makes every measurement land on the loading screen.
const CHROME = process.env.LIFE_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = spawn(CHROME, [
  '--headless=new', '--remote-debugging-port=9500', '--window-size=1440,900',
  '--user-data-dir=' + mkdtempSync(join(tmpdir(), 'audit-')), '--no-first-run', '--no-default-browser-check',
  // A headless window that nobody can see is throttled: no animation frames, so the world never
  // paints and every measurement lands on the loading screen. Measure a page that is running.
  '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows',
  '--use-gl=angle', '--use-angle=metal', '--ignore-gpu-blocklist',
]);
const findings = [];
const record = (area, severity, what, evidence = '') => findings.push({ area, severity, what, evidence });

try {
  // A dead preview makes every finding an artefact. Say so instead.
  const alive = await fetch(BASE + '/course/', { cache: 'no-store' }).then(r => r.ok).catch(() => false);
  if (!alive) throw new Error('the audited base does not answer: ' + BASE);
  for (let i = 0; i < 80; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { const r = await fetch('http://127.0.0.1:9500/json/version'); if (r.ok) break; } catch {}
  }
  const targets = await (await fetch('http://127.0.0.1:9500/json/list')).json();
  const client = new CDP((targets.find(t => t.type === 'page') || targets[0]).webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable'); await client.send('Runtime.enable'); await client.send('Network.enable');
  await client.send('Accessibility.enable');

  const open = async (width, height, { life: saved = life, preference = null, fresh = false } = {}) => {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
    // The save is written on a real page of this origin: a JSON file is an
    // opaque document and cannot hold storage.
    await client.send('Page.navigate', { url: BASE + '/intake/' });
    await new Promise(r => setTimeout(r, 600));
    const written = await client.evaluate(`(()=>{try{localStorage.clear();}catch(e){}
      ${saved === null ? '' : `localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(saved))});`}
      ${preference ? `localStorage.setItem('life-preferences-v1', ${JSON.stringify(JSON.stringify(preference))});` : ''}
      return true;})()`);
    if (!written) throw new Error('the save could not be written on ' + BASE);
    client.logs.length = 0; client.requests.clear();
    await client.send('Page.navigate', { url: BASE + '/course/' });
    await new Promise(r => setTimeout(r, fresh ? 9000 : 7000));
  };

  const phase=name=>console.error('· '+name);
  // ---------------------------------------------------------------- boot
  phase('boot');
  await open(1440, 900);
  const boot = await client.evaluate(`(()=>({
    title: document.title,
    lang: document.documentElement.lang,
    loading: document.body.classList.contains('loading'),
    hasLoadState: !!document.getElementById('load-state'),
    age: document.getElementById('age')?.textContent?.trim(),
    palette: document.documentElement.dataset.palette,
    stage: document.getElementById('scene-caption')?.textContent?.trim(),
  }))()`);
  if (boot.hasLoadState) record('boot', 'high', 'the boot placeholder is still on the page', JSON.stringify({ ...boot, logs: client.logs.slice(0, 5) }));
  if (!boot.lang) record('boot', 'medium', 'the document language is not set');
  if (boot.loading) record('boot', 'medium', 'the body is still marked loading');

  // -------------------------------------------------- accessible names
  phase('ax-tree');
  const ax = await client.send('Accessibility.getFullAXTree');
  const unnamed = ax.nodes.filter(n => !n.ignored && n.role?.value && ['button', 'link', 'checkbox', 'radio', 'switch', 'textbox', 'combobox', 'slider', 'menuitem'].includes(n.role.value))
    .filter(n => !String(n.name?.value ?? '').trim());
  if (unnamed.length) record('a11y', 'high', unnamed.length + ' interactive elements have no accessible name',
    unnamed.slice(0, 6).map(n => n.role.value + '#' + (n.backendDOMNodeId ?? '')).join(', '));

  const unnamedCanvas = ax.nodes.filter(n => !n.ignored && n.role?.value === 'image' && !String(n.name?.value ?? '').trim());
  if (unnamedCanvas.length) record('a11y', 'medium', unnamedCanvas.length + ' images have no accessible name');

  // Every control must be reachable and must say what it changes.
  phase('controls');
  const controls = await client.evaluate(`(()=>{
    const out=[];
    for(const el of document.querySelectorAll('button,select,input,a[href]')){
      const name=(el.getAttribute('aria-label')||el.textContent||el.title||'').trim();
      const r=el.getBoundingClientRect();
      if(r.width===0&&r.height===0)continue;
      out.push({tag:el.tagName,id:el.id||'',name:name.slice(0,40),w:Math.round(r.width),h:Math.round(r.height),label:(el.textContent||'').trim().slice(0,30)});
    }
    return out;})()`);
  const tiny = controls.filter(c => c.w > 0 && c.h > 0 && (c.h < 24 || c.w < 24));
  if (tiny.length) record('a11y', 'medium', tiny.length + ' controls are smaller than 24px', JSON.stringify(tiny.slice(0, 5)));

  // ------------------------------------------------------------ contrast
  phase('contrast');
  const contrast = await client.evaluate(`(()=>{
    const lum=c=>{const [r,g,b]=c.map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;});return .2126*r+.7152*g+.0722*b;};
    const parse=s=>{const m=s.match(/[\\d.]+/g);return m?m.slice(0,3).map(Number):null;};
    // The background is what is painted directly behind the text: the first opaque layer below it
    // in paint order at that spot, not the nearest ancestor (a control can sit over a dark bar
    // that is not its parent). Falls back to the ancestor chain if the stack is unavailable.
    const opaque=c=>{const p=parse(c);if(!p||/rgba\(0, 0, 0, 0\)/.test(c))return null;const a=c.match(/[\d.]+/g);return !a||a.length<4||Number(a[3])>0.5?p:null;};
    const bgOf=el=>{const r=el.getBoundingClientRect();let stack=[];try{stack=document.elementsFromPoint(Math.min(innerWidth-1,Math.max(0,r.left+2)),Math.min(innerHeight-1,Math.max(0,r.top+2)));}catch(e){}const own=stack.indexOf(el),from=own>=0?own+1:stack.findIndex(n=>n.contains(el));for(const n of from>=0?stack.slice(from):[]){const p=opaque(getComputedStyle(n).backgroundColor);if(p)return p;}let n=el;while(n&&n!==document.documentElement){const p=opaque(getComputedStyle(n).backgroundColor);if(p)return p;n=n.parentElement;}return parse(getComputedStyle(document.documentElement).backgroundColor)||[255,255,255];};
    const out=[];
    for(const el of document.querySelectorAll('body *')){
      if(!el.firstChild)continue;
      const text=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
      if(!text)continue;
      const st=getComputedStyle(el);if(st.visibility==='hidden'||st.display==='none'||+st.opacity===0)continue;
      const fg=parse(st.color);if(!fg)continue;
      const bg=bgOf(el);
      const L1=lum(fg),L2=lum(bg);const ratio=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
      const size=parseFloat(st.fontSize),bold=+st.fontWeight>=700;
      const large=size>=24||(size>=18.66&&bold);
      const need=large?3:4.5;
      if(ratio<need)out.push({sel:(el.id||el.className||el.tagName).toString().slice(0,40),ratio:+ratio.toFixed(2),need,size:Math.round(size),text:text.slice(0,28)});
    }
    return out;})()`);
  const byRatio = [...contrast].sort((a, b) => a.ratio - b.ratio);
  for (const c of byRatio.slice(0, 8)) record('contrast', c.ratio < 3 ? 'high' : 'medium',
    `text at ${c.ratio}:1 (needs ${c.need}:1)`, `${c.sel} · ${c.size}px · "${c.text}"`);

  // ------------------------------------------------------- keyboard order
  phase('keyboard');
  await client.evaluate(`document.body.focus();true`);
  const order = [];
  for (let i = 0; i < 40; i++) {
    await client.key('Tab', 'Tab', 9);
    order.push(await client.evaluate(`(()=>{const a=document.activeElement;if(!a||a===document.body)return null;
      const r=a.getBoundingClientRect();const st=getComputedStyle(a);
      return {tag:a.tagName,id:a.id||'',name:(a.getAttribute('aria-label')||a.textContent||'').trim().slice(0,26),w:Math.round(r.width),h:Math.round(r.height),
        ring:st.outlineStyle!=='none'&&parseFloat(st.outlineWidth)>0||st.boxShadow!=='none'};})()`));
  }
  const noRing = order.filter(o => o && !o.ring);
  if (noRing.length) record('keyboard', 'medium', noRing.length + ' focused controls show no focus indicator', JSON.stringify(noRing.slice(0, 4)));
  const offscreen = order.filter(o => o && (o.w === 0 || o.h === 0));
  if (offscreen.length) record('keyboard', 'low', offscreen.length + ' focused controls have no size', JSON.stringify(offscreen.slice(0, 4)));

  // A dialog must trap and release the focus.
  phase('dialog');
  await client.evaluate(`document.querySelector('[data-settings]')?.click();true`);
  await new Promise(r => setTimeout(r, 600));
  const dialog = await client.evaluate(`(()=>{const d=document.getElementById('settings-dialog');
    return {open:!!d?.open,focus:d?document.activeElement?.id||document.activeElement?.tagName:null,labelled:!!d?.getAttribute('aria-label')||!!d?.querySelector('h2')};})()`);
  if (dialog.open) {
    if (!dialog.labelled) record('a11y', 'low', 'the settings dialog opens without an explicit accessible name', JSON.stringify(dialog));
    await client.key('Escape', 'Escape', 27);
    await new Promise(r => setTimeout(r, 400));
    const closed = await client.evaluate(`!document.getElementById('settings-dialog')?.open`);
    if (!closed) record('keyboard', 'high', 'Escape does not close the settings dialog');
  }

  // -------------------------------------------------------------- weight
  phase('weight');
  const weight = await client.evaluate(`(()=>{const n=performance.getEntriesByType('resource');
    const bytes=n.reduce((a,r)=>a+(r.transferSize||r.encodedBodySize||0),0);
    return {requests:n.length,bytes};})()`);
  const dom = await client.evaluate(`({nodes:document.querySelectorAll('*').length,buttons:document.querySelectorAll('button').length})`);
  record('performance', 'medium', `one view costs ${weight.requests} requests and ${Math.round(weight.bytes / 1024)} kB`, JSON.stringify(dom));

  // ---------------------------------------------------------- frame pace
  phase('frames');
  const frames = await client.evaluate(`(()=>new Promise(resolve=>{let n=0;const t0=performance.now();
    const finish=()=>resolve({frames:n,ms:Math.round(performance.now()-t0)});
    const timer=setTimeout(finish,3000);
    const tick=()=>{n++;if(performance.now()-t0<2000)requestAnimationFrame(tick);else{clearTimeout(timer);finish();}};
    requestAnimationFrame(tick);}))()`);
  const fps = Math.round(frames.frames / (frames.ms / 1000));
  if (frames.frames > 0) record('performance', fps < 30 ? 'high' : 'low', `the animated view runs at about ${fps} frames per second`, JSON.stringify(frames));
  else record('performance', 'low', 'frame pacing could not be measured in this browser', JSON.stringify(frames));

  // ------------------------------------------------------- the year band
  phase('year');
  const year = await client.evaluate(`(()=>{const n=document.querySelector('.world-now');
    if(!n)return null;const r=n.getBoundingClientRect();
    return {w:Math.round(r.width),h:Math.round(r.height),visible:r.width>0&&r.height>0,chart:!!n.querySelector('svg'),meters:n.querySelectorAll('.world-meter').length};})()`);
  if (!year || !year.visible) record('console', 'high', 'the year around you is not on the wide screen', JSON.stringify(year));
  else if (!year.chart || year.meters < 3) record('console', 'medium', 'the year band is missing its chart or meters', JSON.stringify(year));

  // ------------------------------------------------------- resilience
  phase('fresh-visit');
  await open(1440, 900, { life: null, fresh: true });
  const fresh = await client.evaluate(`({age:document.getElementById('age')?.textContent?.trim(),broken:!!document.getElementById('load-state')})`);
  if (fresh.broken) record('resilience', 'high', 'a first-time visit does not reach the game', JSON.stringify(fresh));

  phase('corrupt-save');
  await client.evaluate(`localStorage.setItem('life-course-v2','{not json');true`);
  await client.send('Page.navigate', { url: BASE + '/course/' });
  await new Promise(r => setTimeout(r, 9000));
  const corrupt = await client.evaluate(`({age:document.getElementById('age')?.textContent?.trim(),broken:!!document.getElementById('load-state'),body:document.body.className})`);
  if (corrupt.broken || !corrupt.age) record('resilience', 'high', 'a corrupted save leaves the player with no game', JSON.stringify(corrupt));

  phase('broken-shape');
  await client.evaluate(`localStorage.setItem('life-course-v2',JSON.stringify({stage:'review',age:'x',history:'y'}));true`);
  await client.send('Page.navigate', { url: BASE + '/course/' });
  await new Promise(r => setTimeout(r, 9000));
  const brokenShape = await client.evaluate(`({age:document.getElementById('age')?.textContent?.trim(),broken:!!document.getElementById('load-state')})`);
  if (brokenShape.broken || !brokenShape.age) record('resilience', 'high', 'a save with the wrong shape leaves the player with no game', JSON.stringify(brokenShape));

  // The save must survive a reload exactly.
  phase('save-roundtrip');
  await open(1440, 900);
  const before = await client.evaluate(`localStorage.getItem('life-course-v2')?.length`);
  await client.send('Page.navigate', { url: BASE + '/course/' });
  await new Promise(r => setTimeout(r, 2500));
  const after = await client.evaluate(`localStorage.getItem('life-course-v2')?.length`);
  if (before && after && Math.abs(before - after) > 400) record('state', 'medium', 'the saved life changes size across a reload', before + ' → ' + after);

  // ------------------------------------------------------ console hygiene
  for (const log of client.logs) {
    if (log.kind === 'error' || log.kind === 'exception') record('console', 'high', 'console error', log.text.slice(0, 200));
    else if (log.kind === 'warning') record('console', 'medium', 'console warning', log.text.slice(0, 200));
  }

  phase('shots');
  await client.shot('audit-1440.png');
  await open(390, 844);
  await client.shot('audit-390.png');
  const phone = await client.evaluate(`({overflow:document.documentElement.scrollHeight-document.documentElement.clientHeight,
    overlap:(()=>{const s=document.querySelector('.stage').getBoundingClientRect(),r=document.querySelector('.console-reader').getBoundingClientRect();
      return !(s.right<=r.left||r.right<=s.left||s.bottom<=r.top||r.top>=s.bottom);})()})`);
  if (phone.overflow > 0) record('layout', 'high', `the phone page scrolls by ${phone.overflow}px`, JSON.stringify(phone));
  if (phone.overlap) record('layout', 'high', 'the phone scene and the console overlap', JSON.stringify(phone));

  client.close();
} catch (error) {
  record('audit', 'high', 'the audit itself failed', String(error && error.message || error));
} finally {
  browser.kill();
}

// ------------------------------------------------------------------ report
const order = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => order[a.severity] - order[b.severity]);
const summary = { base: BASE, when: new Date().toISOString(), counts: { high: 0, medium: 0, low: 0 } };
for (const f of findings) summary.counts[f.severity]++;
writeFileSync(join(outDir, 'report.json'), JSON.stringify({ summary, findings }, null, 1));

const lines = [];
lines.push('# Product audit', '', `Base: ${BASE} · ${summary.when}`, '',
  `**${summary.counts.high} high, ${summary.counts.medium} medium, ${summary.counts.low} low.**`, '');
for (const f of findings) lines.push(`- **${f.severity}** · ${f.area} · ${f.what}${f.evidence ? `  \n  ${f.evidence}` : ''}`);
if (!findings.length) lines.push('- Nothing found.');
writeFileSync(join(outDir, 'REPORT.md'), lines.join('\n') + '\n');
console.log(lines.join('\n'));
process.exit(summary.counts.high ? 1 : 0);
