// Prove two pictures on a real browser: the childhood that names another child
// shows that child, and the classroom shows a student sitting in the painted
// classroom without a desk of her own. Lives are built and validated in node,
// then the browser opens them.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { newLife, configureLife, begin, live, validate } from '../dist/course/sim.js';
import { applyPivot, pendingPivots, openOptions } from '../dist/course/pivots.js';
import { encounterById, resolveEncounter } from '../dist/course/encounters.js';
import { choiceAvailable } from '../dist/course/finance.js';
import { childSpine, pendingChildChoice, CHILD_CHOICES } from '../dist/course/childhood-choices.js';

const reviewDir = resolve(process.env.LIFE_REVIEW || 'review/truth');
mkdirSync(reviewDir, { recursive: true });

const settle = s => {
  let t = s;
  for (const p of pendingPivots(t)) t = applyPivot(t, p, openOptions(p, t)[0].id);
  const ps = t.story?.pending;
  if (ps) {
    const enc = encounterById(ps.id);
    t = resolveEncounter(t, enc.options.find(o => choiceAvailable(t, o)).id, .3);
  }
  return t;
};

// Life A: a nine-year-old who made room for another child.
const base = configureLife(newLife(77), { class: 'middle_class', region: 'samut-prakan', sex: 'female', birthYear: 1981 });
// Every beat of this childhood is answered, so no question is waiting on screen:
// age 7 is the answer that puts another child in the room.
const spine = childSpine({ ...base, childhood: { startsAt: 6, choices: [] } });
const choices = spine.map(age => {
  const q = CHILD_CHOICES.find(q => q.age === age);
  const o = age === 7 ? q.options.find(o => o.id === 'invite') : q.options[0];
  return { age, choice: o.id, note: o.note };
});
console.log('childhood spine', spine.join('-'), '| choices', choices.map(c => c.age + ':' + c.choice).join(' '));
const companion = {
  ...base,
  stage: 'birth',
  age: 9,
  progressAge: 9,
  childhood: {
    origin: { cash: base.cash, health: base.health, wellbeing: base.wellbeing },
    choices,
    startsAt: 6
  }
};
console.log('companion life valid:', validate(companion));

// Life B: a fifteen-year-old who answered "Continue school" at the station.
let student = begin(configureLife(newLife(3), { class: 'middle_class', region: 'samut-prakan', sex: 'female', birthYear: 1981 }));
let guard = 0;
while (student.age < 15 && guard++ < 40) {
  student = settle(student);
  const next = live(student);
  if (next === student) break;
  student = next;
}
// No question may be waiting on screen: a pending encounter would hold the clock
// and the school hours would never arrive.
student = settle(student);
for (const p of pendingPivots(student)) {
  const wanted = p.id === 'school-apprentice' ? 'school' : openOptions(p, student)[0].id;
  console.log('pivot at', p.station, p.id, '->', wanted);
  student = applyPivot(student, p, wanted);
}
student = { ...student, pathway: 'school' };
console.log('student life valid:', validate(student), 'age', student.age, 'pathway', student.pathway);

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
        this.logs.push('console ' + data.params.type + ': ' + data.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 200));
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
  async shot(path) {
    const shot = await this.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(path, Buffer.from(shot.data, 'base64'));
  }
}

const BASE = (process.env.LIFE_BASE || 'http://127.0.0.1:4219').replace(/\/$/, '');
const server = spawn('python3', ['scripts/serve.py'], { stdio: 'ignore' });
const tmpDir = mkdtempSync(join(tmpdir(), 'chrome-truth-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9345', '--user-data-dir=' + tmpDir,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-background-networking', '--hide-scrollbars', '--window-size=1440,900',
]);
const wait = ms => new Promise(r => setTimeout(r, ms));

try {
  let version;
  for (let i = 0; i < 40; i++) { await wait(250); try { const res = await fetch('http://127.0.0.1:9345/json/version'); if (res.ok) { version = await res.json(); break; } } catch {} }
  let ready = false;
  for (let i = 0; i < 40; i++) { try { const res = await fetch(BASE + '/build.json'); if (res.ok) { ready = true; break; } } catch {} await wait(250); }
  if (!ready) throw new Error('preview server not available');
  if (!version) throw new Error('chrome not available');
  const targets = await (await fetch('http://127.0.0.1:9345/json/list')).json();
  const target = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDP(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });

  const plans = [
    { life: companion, file: 'companion', width: 1440, height: 900, want: /home|family|rest/i, name: 'the other child is in the room' },
    { life: companion, file: 'companion', width: 390, height: 844, want: /home|family|rest/i, name: 'the other child is in the room' },
    { life: student, file: 'classroom', width: 1440, height: 900, want: /study path|tension/i, name: 'the student sits in the classroom' },
    { life: student, file: 'classroom', width: 390, height: 844, want: /study path|tension/i, name: 'the student sits in the classroom' },
  ];

  for (const plan of plans) {
    await client.send('Emulation.setDeviceMetricsOverride', { width: plan.width, height: plan.height, deviceScaleFactor: 1, mobile: plan.width < 500 });
    await client.send('Page.navigate', { url: BASE + '/build.json' });
    await wait(800);
    await client.evaluate(`localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(plan.life))}); true`);
    await client.send('Page.navigate', { url: BASE + '/course/' });
    await wait(2500);
    // The life must be the one we built: a fresh birth means the save was not read.
    for (let tries = 0; tries < 4; tries++) {
      const age = await client.evaluate(`document.getElementById('age')?.textContent ?? ''`);
      if (age.includes('Age ' + plan.life.age)) break;
      await client.evaluate(`localStorage.setItem('life-course-v2', ${JSON.stringify(JSON.stringify(plan.life))}); true`);
      await client.send('Page.reload');
      await wait(2500);
    }
    let caption = '';
    for (let i = 0; i < 70; i++) {
      await wait(900);
      caption = await client.evaluate(`document.getElementById('scene-caption')?.textContent?.trim() ?? ''`);
      if (plan.want.test(caption)) break;
    }
    const info = await client.evaluate(`(()=>({caption:document.getElementById('scene-caption')?.textContent?.trim()??'',headline:document.getElementById('world-headline')?.textContent?.trim()??'',age:document.getElementById('age')?.textContent??'',bar:Math.round(document.getElementById('childhood-memory')?.getBoundingClientRect().height??0)}))()`);
    const file = join(reviewDir, `truth-${plan.file}-${plan.width}.png`);
    await client.shot(file);
    console.log(plan.name, plan.width, JSON.stringify(info), '->', file);
  }
  const errors = client.logs.filter(l => /EXCEPTION|error/i.test(l));
  console.log('console errors:', errors.length ? errors.slice(0, 8) : 'none');
} finally {
  chrome.kill();
  server?.kill();
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
}
