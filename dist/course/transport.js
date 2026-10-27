// The transport: a cassette deck's three keys — Play, Pause and Fast Forward.
// The fast-forward key is drawn with a thicker arrow the faster it runs, so the
// speed is read from the shape of the key and never from a number printed on it.
// A deck runs at one speed at a time; the key you press is the one that changed.

const SPEEDS = [2, 3, 10, 20];
const STROKES = [1.5, 2.4, 3.4, 4.6];
const NS = 'http://www.w3.org/2000/svg';

const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
const svg = (tag, attrs) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
};

function icon(viewBox) { const s = svg('svg', { viewBox, 'aria-hidden': 'true', focusable: 'false' }); return s; }

export function initTransport({ getPaused, setPaused, getSpeed, setSpeed }) {
  const root = document.getElementById('transport');
  if (!root) return { render() {} };

  const play = el('button', 'transport-key transport-play');
  const pause = el('button', 'transport-key transport-pause');
  const fast = el('button', 'transport-key transport-fast');
  for (const b of [play, pause, fast]) { b.type = 'button'; b.append(icon('0 0 18 14')); }

  const playGlyph = play.querySelector('svg');
  playGlyph.append(svg('path', { d: 'M5 2 L14 7 L5 12 Z' }));

  const pauseGlyph = pause.querySelector('svg');
  pauseGlyph.append(svg('rect', { x: '4.6', y: '2', width: '3.4', height: '10' }));
  pauseGlyph.append(svg('rect', { x: '10', y: '2', width: '3.4', height: '10' }));

  const fastGlyph = fast.querySelector('svg');
  const chevronA = svg('path', { d: 'M3 2.5 L8.5 7 L3 11.5' });
  const chevronB = svg('path', { d: 'M9.5 2.5 L15 7 L9.5 11.5' });
  fastGlyph.append(chevronA, chevronB);

  play.setAttribute('aria-label', 'Play');
  pause.setAttribute('aria-label', 'Pause');
  play.onclick = () => { setPaused(false); render(); };
  pause.onclick = () => { setPaused(true); render(); };
  fast.onclick = () => {
    const next = (SPEEDS.indexOf(getSpeed()) + 1) % SPEEDS.length;
    setSpeed(SPEEDS[next]);
    setPaused(false); // a fast-forward key rolls the tape
    render();
  };

  root.append(play, pause, fast);

  function render() {
    const paused = getPaused(), speed = getSpeed();
    const level = Math.max(0, SPEEDS.indexOf(speed));
    play.setAttribute('aria-pressed', String(!paused));
    pause.setAttribute('aria-pressed', String(paused));
    const label = 'Fast forward · ' + speed + ' times faster';
    fast.setAttribute('aria-label', label);
    fast.title = label;
    const stroke = STROKES[level];
    for (const c of [chevronA, chevronB]) {
      c.setAttribute('stroke', 'currentColor');
      c.setAttribute('fill', 'none');
      c.setAttribute('stroke-width', String(stroke));
      c.setAttribute('stroke-linecap', 'round');
      c.setAttribute('stroke-linejoin', 'round');
    }
    root.dataset.speed = String(speed);
  }

  render();
  return { render };
}
