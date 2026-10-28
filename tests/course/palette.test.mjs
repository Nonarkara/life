import test from 'node:test';
import assert from 'node:assert/strict';
import { PALETTES, MOOD_ORDER, paletteFor, applyPalette, canvasWorld, HOUSE } from '../../dist/course/palettes.js';

test('the palette library holds two or three dozen whole colour sets', () => {
  assert.ok(PALETTES.length >= 24 && PALETTES.length <= 36, 'palette count: ' + PALETTES.length);
  for (const palette of PALETTES) {
    for (const key of ['name', 'paper', 'ink', 'muted', 'accent', 'line', 'mood']) assert.ok(palette[key], key + ' in ' + palette.name);
    for (const role of ['sky', 'ground', 'sand', 'land', 'grass', 'water', 'waterLight', 'road', 'edge', 'wall', 'shade', 'roof', 'roofLight', 'wood', 'leaf', 'lightleaf']) {
      assert.match(palette.world[role], /^#[0-9a-f]{6}$/i, role + ' in ' + palette.name);
    }
  }
  const names = PALETTES.map(p => p.name);
  assert.equal(new Set(names).size, names.length, 'every palette is named on its own');
});

test('the mood picks the family and the chapter walks through it', () => {
  const at = (mood, age) => paletteFor({ history: [] }, age, mood);
  for (const mood of MOOD_ORDER) {
    const first = at(mood, 10);
    assert.equal(first.mood, mood);
    assert.equal(at(mood, 15).name !== first.name, true, 'the chapter moves the palette');
    assert.notEqual(at(mood, 40).name, at(mood, 15).name, 'a later chapter is a different palette');
  }
  // A hard year and a bright year are never the same scheme.
  assert.notEqual(at('bright', 30).name, at('difficult', 30).name);
  // And the chapter keeps moving rather than settling.
  const seen = new Set();
  for (let age = 10; age <= 80; age += 5) seen.add(at('steady', age).name);
  assert.ok(seen.size >= 8, 'a life is never stuck in one scheme: ' + seen.size);
});

test('the interface keeps the house colours in every chord; the life colours the world and its stage band', () => {
  const stages = new Set();
  for (const palette of PALETTES) {
    const root = { style: { setProperty(name, value) { this[name] = value; } }, dataset: {} };
    applyPalette(palette, root);
    for (const [name, value] of Object.entries(HOUSE)) assert.equal(root.style[name], value, palette.name + ' ' + name);
    assert.equal(root.dataset.palette, palette.name);
    stages.add(root.style['--stage']);
  }
  assert.ok(stages.size > 8, 'the stage band still follows the life');
  const palette = PALETTES.find(p => p.mood === 'steady');
  const world = canvasWorld(palette);
  assert.equal(world.land, palette.world.land);
  assert.equal(world.amber, palette.accent, 'the canvas uses the palette accent');
});
