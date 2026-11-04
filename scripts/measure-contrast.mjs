// Measure the real colour pairs of the interface: what the player reads, on what
// surface, and whether the ratio holds. Driven by the same journey the product
// audit uses, so a number here is a number on the page.
//
//   node scripts/measure-contrast.mjs            # the local preview
//   LIFE_BASE=https://life.nonarkara.org node scripts/measure-contrast.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { newLife, configureLife, begin, live } from '../dist/course/sim.js';
import { resolveEncounter, encounterById } from '../dist/course/encounters.js';

const BASE = (process.env.LIFE_BASE || 'http://127.0.0.1:4219').replace(/\/$/, '');
const settle = s => {
  if (!s.story?.pending) return s;
  const enc = encounterById(s.story.pending.id);
  return resolveEncounter(s, enc.options[0].id, 0.5);
};
let life = begin(configureLife(newLife(11), { upbringing: 'middle', region: 'bang-na' }));
while (life.age < 30 && life.stage === 'review') life = settle(live(settle(life)));
life = settle(life);

class CDP {
  constructor(url) { this.url = url; this.id = 1; this.pending = new Map(); }
  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((ok, no) => { this.ws.onopen = ok; this.ws.onerror = no; });
    this.ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && this.pending.has(d.id)) {
        const { resolve: ok, reject: no } = this.pending.get(d.id);
        this.pending.delete(d.id);
        d.error ? no(new Error(d.error.message)) : ok(d.result);
      }
    };
  }
  send(method, params = {}) {
    const id = this.id++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((ok, no) => this.pending.set(id, { resolve: ok, reject: no }));
  }
  async evaluate(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  }
}

const browser = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9531', '--window-size=1440,900',
  '--user-data-dir=' + mkdtempSync(join(tmpdir(), 'contrast-')), '--no-first-run',
]);
try {
  for (let i = 0; i < 80; i++) {
    await new Promise(r => setTimeout(r, 250));
    try { const r = await fetch('http://127.0.0.1:9531/json/version'); if (r.ok) break; } catch {}
  }
  const targets = await (await fetch('http://127.0.0.1:9531/json/list')).json();
  const client = new CDP((targets.find(t => t.type === 'page') || targets[0]).webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable'); await client.send('Runtime.enable');
  await client.send('Page.navigate', { url: BASE + '/intake/' });
  await new Promise(r => setTimeout(r, 800));
  await client.evaluate(`localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(life))}); true`);
  await client.send('Page.navigate', { url: BASE + '/course/' });
  await new Promise(r => setTimeout(r, 7000));
  const report = await client.evaluate(`(()=>{
    const lum=c=>{const m=c.match(/[\\d.]+/g);if(!m)return null;const[r,g,b]=m.slice(0,3).map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;});return .2126*r+.7152*g+.0722*b;};
    const parse=c=>{const m=c.match(/[\\d.]+/g);return m?m.slice(0,3).map(Number):null;};
    const alpha=c=>{const m=c.match(/[\\d.]+/g);return m&&m.length>3?Number(m[3]):1;};
    // The surface a reader actually sees: the nearest ancestor that paints, and
    // what shows through the rest.
    const surface=el=>{const stack=[];let n=el;while(n&&n!==document.documentElement){const st=getComputedStyle(n);const bg=st.backgroundColor;if(bg&&bg!=='rgba(0, 0, 0, 0)'&&alpha(bg)>0.02)stack.push({bg,alpha:alpha(bg),tag:n.tagName,cls:n.className});n=n.parentElement;}
      let base=[255,255,255];for(const s of stack.reverse()){const c=parse(s.bg);const a=s.alpha;base=base.map((v,i)=>v*(1-a)+c[i]*a);}
      return {rgb:base,css:'rgb('+base.map(Math.round).join(', ')+')',stack:stack.map(s=>s.tag+'.'+String(s.cls).split(' ')[0]+'@'+s.alpha).slice(0,3)};};
    const ratio=(a,b)=>{const A=lum(a),B=lum(b);if(A===null||B===null)return null;return +(((Math.max(A,B)+.05)/(Math.min(A,B)+.05)).toFixed(2));};
    const out=[];
    for(const el of document.querySelectorAll('body *')){
      const text=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
      if(!text)continue;
      const st=getComputedStyle(el);if(st.visibility==='hidden'||st.display==='none'||+st.opacity===0)continue;
      const r=el.getBoundingClientRect();if(r.width<2||r.height<2)continue;
      const fg=parse(st.color);if(!fg)continue;
      const s=surface(el);
      const value=ratio(st.color,s.css);
      if(value===null)continue;
      const size=parseFloat(st.fontSize),bold=+st.fontWeight>=700;
      const need=(size>=24||(size>=18.66&&bold))?3:4.5;
      if(value<need)out.push({sel:(el.id||el.className||el.tagName).toString().slice(0,32),text:text.slice(0,34),color:st.color,on:s.css,stack:s.stack,ratio:value,need,size:Math.round(size)});
    }
    return {palette:document.documentElement.dataset.palette,failures:out.sort((a,b)=>a.ratio-b.ratio)};
  })()`);
  console.log('palette:', report.palette, '· failing pairs:', report.failures.length);
  for (const f of report.failures.slice(0, 14)) {
    console.log(`  ${f.ratio}:1 (needs ${f.need}) ${f.sel} ${f.size}px "${f.text}"`);
    console.log(`      ${f.color} on ${f.on} via ${f.stack.join(' ← ')}`);
  }
} finally {
  browser.kill();
}
