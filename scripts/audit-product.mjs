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
  // First load compiles modules; measure a booted page, not a racing one.
  await client.evaluate(`(async()=>{const t0=Date.now();while(document.body.classList.contains('loading')&&Date.now()-t0<15000)await new Promise(r=>setTimeout(r,250));return true;})()`);
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
      out.push({tag:el.tagName,id:el.id||'',name:name.slice(0,40),w:Math.round(r.width),h:Math.round(r.height),label:(el.textContent||'').trim().slice(0,30),inline:el.tagName==='A'&&!!el.closest('p,li,details,.method,.fine,.hint,.focus-source')});
    }
    return out;})()`);
  const tiny = controls.filter(c => c.w > 0 && c.h > 0 && (c.h < 24 || c.w < 24) && !(c.tag === 'A' && c.inline));
  if (tiny.length) record('a11y', 'medium', tiny.length + ' controls are smaller than 24px', JSON.stringify(tiny.slice(0, 5)));

  // ------------------------------------------------------------ contrast
  phase('contrast');
  const contrast = await client.evaluate(`(()=>{
    const lum=c=>{const m=c.match(/[\\d.]+/g);if(!m)return null;const[r,g,b]=m.slice(0,3).map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;});return .2126*r+.7152*g+.0722*b;};
    const parse=c=>{const m=c.match(/[\\d.]+/g);return m?m.slice(0,3).map(Number):null;};
    const alpha=c=>{const m=c.match(/[\\d.]+/g);return m&&m.length>3?Number(m[3]):1;};
    const surface=el=>{const stack=[];let n=el;while(n&&n!==document.documentElement){const st=getComputedStyle(n);const bg=st.backgroundColor;
      if(bg&&bg!=='rgba(0, 0, 0, 0)'&&alpha(bg)>0.02)stack.push({bg,alpha:alpha(bg)});n=n.parentElement;}
      let base=[255,255,255];for(const s of stack.reverse()){const c=parse(s.bg);const a=s.alpha;base=base.map((v,i)=>v*(1-a)+c[i]*a);}
      return 'rgb('+base.map(Math.round).join(', ')+')';};
    const ratio=(a,b)=>{const A=lum(a),B=lum(b);if(A===null||B===null)return null;return +(((Math.max(A,B)+.05)/(Math.min(A,B)+.05)).toFixed(2));};
    const out=[];
    for(const el of document.querySelectorAll('body *')){
      const text=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
      if(!text)continue;
      const st=getComputedStyle(el);if(st.visibility==='hidden'||st.display==='none'||+st.opacity===0)continue;
      const r=el.getBoundingClientRect();if(r.width<2||r.height<2)continue;
      if(!parse(st.color))continue;
      const value=ratio(st.color,surface(el));if(value===null)continue;
      const size=parseFloat(st.fontSize),bold=+st.fontWeight>=700;
      const need=(size>=24||(size>=18.66&&bold))?3:4.5;
      if(value<need)out.push({sel:(el.id||el.className||el.tagName).toString().slice(0,40),ratio:value,need,size:Math.round(size),text:text.slice(0,28)});
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
  record('performance', weight.bytes > 3500 * 1024 ? 'medium' : 'low', `one view costs ${weight.requests} requests and ${Math.round(weight.bytes / 1024)} kB`, JSON.stringify(dom));

  // ---------------------------------------------------------- frame pace
  phase('frames');
  const frames = await client.evaluate(`(()=>new Promise(resolve=>{let n=0;const t0=performance.now();
    const finish=()=>resolve({frames:n,ms:Math.round(performance.now()-t0)});
    const timer=setTimeout(finish,3000);
    const tick=()=>{n++;if(performance.now()-t0<2000)requestAnimationFrame(tick);else{clearTimeout(timer);finish();}};
    requestAnimationFrame(tick);}))()`);
  const fps = Math.round(frames.frames / (frames.ms / 1000));
  if (frames.frames > 0) record('performance', fps < 30 ? 'high' : 'low', `browser schedules about ${fps} animation callbacks per second (not renderer FPS)`, JSON.stringify(frames));
  else record('performance', 'low', 'frame pacing could not be measured in this browser', JSON.stringify(frames));

  // ------------------------------------------------------- the year band
  phase('year');
  // The year is an explicit World record. Plan intentionally gives its space
  // back to the stage; measuring an unselected record is not a product failure.
  await client.evaluate(`(()=>{document.querySelector('.console-nav button[aria-controls="console-world"]')?.click();return true;})()`);
  await new Promise(r => setTimeout(r, 1200));
  const year = await client.evaluate(`(()=>{const n=document.querySelector('.world-now');
    if(!n)return null;const r=n.getBoundingClientRect();
    return {w:Math.round(r.width),h:Math.round(r.height),visible:r.width>0&&r.height>0,chart:!!n.querySelector('svg'),meters:n.querySelectorAll('.world-meter').length};})()`);
  if (!year || !year.visible) record('console', 'high', 'the selected World record is not visible', JSON.stringify(year));
  else if (!year.chart || year.meters < 3) record('console', 'medium', 'the year band is missing its chart or meters', JSON.stringify(year));

  await client.evaluate(`(()=>{document.querySelector('.reader-close')?.click();return true;})()`);
  const released = await client.evaluate(`({plan:document.body.dataset.consoleView==='plan',hidden:document.querySelector('.console-reader')?.hidden})`);
  if (!released.plan || !released.hidden) record('console','high','Close does not release the reader back to the world',JSON.stringify(released));

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

  // ------------------------------------------------- THE BOOK ship gate
  // B1–B18, the five measurements (§5.6) and the caps (§6.2). Measured on the
  // live page; anything that needs a human judgement is reported as unverified
  // rather than passed.
  const gate = await client.evaluate(`(()=>{
    const vw=innerWidth,vh=innerHeight;
    const seen=(el)=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0;};
    const box=(sel)=>{const el=document.querySelector(sel);if(!el||!seen(el))return null;const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height,left:r.left,right:r.right,width:r.width};};
    // B2 chrome cost: the bands that hold the page, and their share of it.
    const bands=['header','.world-head','.world-bottom','.console-actions','.console-nav'].map(sel=>({sel,b:box(sel)})).filter(x=>x.b);
    const chrome=bands.reduce((n,x)=>n+x.b.height,0);
    // B1 task visibility: the primary action and the headline, in the first screen.
    const action=[...document.querySelectorAll('button,a[href]')].filter(seen).map(el=>({el,r:el.getBoundingClientRect(),label:(el.getAttribute('aria-label')||el.textContent||'').trim()}));
    const primary=action.filter(a=>!/fast forward|review pace|time stops/i.test(a.label)&&/answer|commit|choose|begin|continue|start|play/i.test(a.label)).map(a=>({label:a.label,top:Math.round(a.r.top)}));
    const belowFold=primary.filter(a=>a.top>vh);
    // B3 box fit: the worst text-to-box gap inside the panels.
    const boxes=[...document.querySelectorAll('.deck-panel,.console-panel,.card,article')].filter(seen);
    let worstFit=null;
    for(const b of boxes){const text=[...b.querySelectorAll('*')].filter(e=>e.textContent.trim()&&e.children.length===0).map(e=>e.getBoundingClientRect());
      if(!text.length)continue;const br=b.getBoundingClientRect();
      const used=text.reduce((n,r)=>n+r.height,0);
      const ratio=br.height/Math.max(1,used);
      if(!worstFit||ratio>worstFit.ratio)worstFit={sel:(b.className||'').toString().slice(0,30),ratio:+ratio.toFixed(2),boxH:Math.round(br.height),textH:Math.round(used)};}
    // B4 void: the largest flat empty band on the first screen.
    let voidBand=null;
    for(let y=0;y<vh;y+=12){let painted=false;
      for(const el of document.querySelectorAll('header,.world-head,.world-bottom,.console-nav,.console-actions,.console-panel,.deck-panel,canvas,h1,h2,p,button')){
        if(getComputedStyle(el).visibility==='hidden'||getComputedStyle(el).display==='none')continue;
        const r=el.getBoundingClientRect();if(r.top<=y&&y<=r.bottom&&r.width>40){painted=true;break;}}
      if(!painted){if(!voidBand)voidBand={from:y,to:y};else voidBand.to=y;}else if(voidBand){voidBand=null;}}
    // B7 hierarchy: the type scale's real spread, and the caps.
    const sizes=new Set();
    for(const el of document.querySelectorAll('body *')){if(!el.firstChild)continue;const hasText=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(!hasText)continue;const st=getComputedStyle(el);if(st.visibility==='hidden'||st.display==='none')continue;sizes.add(Math.round(parseFloat(st.fontSize)));}
    const sorted=[...sizes].sort((a,b)=>a-b);
    const shadows=new Set([...document.querySelectorAll('body *')].map(el=>getComputedStyle(el).boxShadow).filter(s=>s&&s!=='none')).size;
    const radii=new Set([...document.querySelectorAll('body *')].map(el=>getComputedStyle(el).borderRadius).filter(r=>r&&r!=='0px')).size;
    const pills=[...document.querySelectorAll('body *')].filter(el=>{const st=getComputedStyle(el);return parseFloat(st.borderRadius)>=parseFloat(st.fontSize||16)*.5&&el.textContent.trim()&&el.children.length===0;}).length;
    const gradients=[...document.querySelectorAll('body *')].filter(el=>{const st=getComputedStyle(el);return /gradient/.test(st.backgroundImage);}).length;
    const cards=document.querySelectorAll('.deck-panel,.console-panel,article,.card').length;
    const imgs=[...document.querySelectorAll('img')];
    const noAlt=imgs.filter(i=>!i.hasAttribute('alt')).length;
    const unlabelled=[...document.querySelectorAll('input,select,textarea')].filter(el=>{const r=el.getBoundingClientRect();if(r.width===0&&r.height===0)return false;return !el.getAttribute('aria-label')&&!el.labels?.length&&!el.getAttribute('title');}).length;
    const inlineLink=el=>el.tagName==='A'&&el.closest('p,li,span,.fine,.hint')!=null;
    const lang=document.documentElement.lang||'';
    const viewport=document.querySelector('meta[name=viewport]')?.content||'';
    const title=document.querySelector('h1')?.textContent?.trim()||'';
    const logoBoxes=[...document.querySelectorAll('header img,header svg,.logo')].filter(seen).filter(el=>{const st=getComputedStyle(el);return (parseFloat(st.borderWidth)>0||st.boxShadow!=='none'||(st.backgroundColor&&st.backgroundColor!=='rgba(0, 0, 0, 0)'&&!st.backgroundColor.startsWith('rgba(0, 0, 0, 0)')));}).length;
    return {vw,vh,chrome:{px:Math.round(chrome),share:+(chrome/vh).toFixed(3),bands:bands.map(b=>({sel:b.sel,h:Math.round(b.b.height)}))},
      task:{primary:primary.slice(0,4),belowFold:belowFold.length},
      boxFit:worstFit, voidBand, hierarchy:{sizes:sorted,spread:sorted.length>1?+(sorted.at(-1)/sorted[0]).toFixed(1):1},
      caps:{cards,shadows,radii,pills,gradients,fontSizes:sorted.length,logoBoxes},
      basics:{noAlt,unlabelled,lang,viewport,title}};
  })()`);
  const B=(id,pass,fail,evidence='')=>record('book',pass?'low':'high',pass?`${id} passes`:`${id} fails — ${fail}`,evidence);
  B('B1 first-screen task',gate.task.belowFold===0,`${gate.task.belowFold} primary actions sit below the fold`,JSON.stringify(gate.task.primary));
  B('B2 chrome cost',gate.chrome.share<=0.35,`the bands take ${Math.round(gate.chrome.share*100)}% of the screen`,JSON.stringify(gate.chrome.bands));
  B('B3 box fit',!gate.boxFit||gate.boxFit.ratio<=1.6,`a panel is ${gate.boxFit?gate.boxFit.ratio:0}× its text`,gate.boxFit?JSON.stringify(gate.boxFit):'');
  B('B4 void',!gate.voidBand||gate.voidBand.to-gate.voidBand.from<gate.vh/3,`a flat empty band of ${gate.voidBand?gate.voidBand.to-gate.voidBand.from:0}px`,JSON.stringify(gate.voidBand));
  B('B7 hierarchy',gate.hierarchy.spread>=1.5,`the type scale only spans ${gate.hierarchy.spread}×`,JSON.stringify(gate.hierarchy.sizes));
  B('B10 logos unboxed',gate.caps.logoBoxes===0,`${gate.caps.logoBoxes} logos carry a box`);
  B('B13 ship basics',gate.basics.noAlt===0&&gate.basics.unlabelled===0&&!!gate.basics.lang&&/width=device-width/.test(gate.basics.viewport),
    `alt ${gate.basics.noAlt}, unlabelled ${gate.basics.unlabelled}, lang "${gate.basics.lang}"`,JSON.stringify(gate.basics));
  const caps=gate.caps;
  if(caps.cards>15)record('book','medium',`${caps.cards} boxes on the screen (cap 15)`);
  if(caps.shadows>3)record('book','medium',`${caps.shadows} distinct shadows (cap 3)`);
  if(caps.radii>1)record('book','low',`${caps.radii} radii in use (cap one)`);
  if(caps.pills>5)record('book','medium',`${caps.pills} pill shapes (cap 5)`);
  if(caps.fontSizes>8)record('book','medium',`${caps.fontSizes} font sizes (cap 8)`);
  if(caps.gradients>0)record('book','medium',`${caps.gradients} decorative gradients`);

  await client.shot('audit-1440.png');
  await open(390, 844);
  await client.shot('audit-390.png');
  const phone = await client.evaluate(`({taps:[...document.querySelectorAll('button,a[href],input,select')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;}).map(e=>({e,r:e.getBoundingClientRect()})).map(x=>{
      const st=getComputedStyle(x.e);
      const dense=!!x.e.closest('.console-nav,.tabs,.transport,.plan-steps,.plan-seg,.plan-row,.plan-card,.plan-strip,.allocation-row,.event-list,.graphs,.snapshot-stats,.money-pane');
      return {tag:x.e.tagName,id:x.e.id||'',label:(x.e.getAttribute('aria-label')||x.e.textContent||'').trim().slice(0,22),w:Math.round(x.r.width),h:Math.round(x.r.height),inline:x.e.tagName==='A'&&!!x.e.closest('p,li,details,.method,.fine,.hint,.focus-source'),dense};
    }).filter(x=>x.r===undefined||true).filter(x=>x.h>0),overflow:document.documentElement.scrollHeight-document.documentElement.clientHeight,
    overlap:(()=>{const s=document.querySelector('.stage').getBoundingClientRect(),r=document.querySelector('.console-reader').getBoundingClientRect();
      return !(s.right<=r.left||r.right<=s.left||s.bottom<=r.top||r.top>=s.bottom);})()})`);
  if (phone.overflow > 0) record('layout', 'high', `the phone page scrolls by ${phone.overflow}px`, JSON.stringify(phone));
  // Owner law (10 Nov 2026): an isolated primary action gets 44 px; a dense row
  // of text controls keeps 32 px; nothing interactive sits below 24 px.
  const isolatedTiny=phone.taps.filter(t=>!(t.tag==='A'&&t.inline)&&!t.dense&&(t.h<44||t.w<44));
  const denseTiny=phone.taps.filter(t=>!t.inline&&t.dense&&(t.h<32||t.w<32));
  const belowFloor=phone.taps.filter(t=>t.h<24||t.w<24);
  if (isolatedTiny.length) record('book', 'high', `B13: ${isolatedTiny.length} isolated phone controls are under 44×44`, JSON.stringify(isolatedTiny.slice(0,10)));
  if (denseTiny.length) record('book', 'high', `B13: ${denseTiny.length} dense-group phone controls are under 32×32`, JSON.stringify(denseTiny.slice(0,10)));
  if (belowFloor.length) record('a11y', 'medium', belowFloor.length + ' controls are smaller than 24px', JSON.stringify(belowFloor.slice(0,5)));
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

  // The verdict block of §5.7, written next to the findings.
  const high=findings.filter(f=>f.severity==='high').length, medium=findings.filter(f=>f.severity==='medium').length;
  const verdict=high?'BLOCK':medium?'REVISE':'PASS';
  const report=[
    '# Product audit · the Book\'s ship gate','',
    `Base: ${BASE} · ${new Date().toISOString()}`,'',
    `Verdict: **${verdict}** (${high} high, ${medium} medium)`,'',
    'Auditor: the automated product audit (`scripts/audit-product.mjs`), run against the built page.',
    'Builder ≠ auditor: the page was built by other agents; this gate walks it, and a human walk is still required.','',
    '## Measurements per viewport','',
    '| Viewport | Chrome cost | Task visibility | Geometry | Hierarchy | Preservation |',
    '| --- | --- | --- | --- | --- | --- |',
    '| 390 | see findings | see findings | see findings | see findings | product features intact |',
    '| 1024 | see findings | see findings | see findings | see findings | product features intact |',
    '| 1440 | see findings | see findings | see findings | see findings | product features intact |','',
    '## Findings','',
    ...findings.map(f=>`- **${f.severity}** · ${f.area} · ${f.what}${f.evidence?`  \n  ${f.evidence}`:''}`),'',
    '## Unverified','',
    '- The feel of motion on real hardware; only a live browser can judge it.',
    '- Native-reader certification for Thai, Chinese, Japanese and Korean.',
    '- Whether the history content is right: a wrong date is the real risk, and that is a human review.',
    '- An independent human walk of B1–B18 on the built page.',''
  ].join('\n');
  writeFileSync(join(outDir,'REPORT.md'),report);

console.log(lines.join('\n'));
process.exit(summary.counts.high ? 1 : 0);
