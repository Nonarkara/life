import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,statSync} from 'node:fs';
import {MODEL_FOR} from '../../dist/course/character-anime.js';

test('every anime model the cast can pick ships with its texture and credit', () => {
  for (const id of Object.values(MODEL_FOR)) {
    assert.ok(statSync(`dist/course/anime/cast/visitor-${id}.glb`).size > 1e6, id);
    assert.ok(existsSync(`dist/course/anime/cast/${id}-original.webp`), id);
  }
  assert.match(readFileSync('dist/course/anime/cast/CREDITS.txt', 'utf8'), /pixiv Inc\. \/ VRoid Project/);
});

test('procedural figures expose the rig the anime cast follows', async () => {
  const {readFileSync} = await import('node:fs');
  assert.match(readFileSync('dist/course/character3d.js', 'utf8'), /rig:\{body,head,legs,arms,bodyParts,look\}/);
});
