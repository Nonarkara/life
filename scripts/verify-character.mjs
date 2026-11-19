#!/usr/bin/env node
// Verify a character against what the build actually produced.
//
// The old version read review/characters/<id>/receipt.json — a file another
// agent wrote by hand, claiming status "completed" and mshCompliant true for
// a pipeline that never ran. A receipt that asserts work nobody did is worse
// than no receipt: it makes the build look finished.
//
// This reads the receipt the build wrote (out/course/characters/<id>), the
// authored spec (src/characters), and the files on disk, and fails when the
// receipt claims more than the files prove.
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve('.');
const SRC = join(ROOT, 'src', 'characters');
const OUT = process.env.CHAR_OUT || join(ROOT, 'out', 'course', 'characters');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function findSpec(id) {
  const direct = join(SRC, id + '.json');
  if (existsSync(direct)) return direct;
  if (existsSync(join(SRC, id, 'spec.json'))) return join(SRC, id, 'spec.json');
  return null;
}

function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: node scripts/verify-character.mjs <id>');
    process.exit(1);
  }
  const specPath = findSpec(id);
  const receiptPath = join(OUT, id, 'receipt.json');
  if (!specPath || !existsSync(receiptPath)) {
    console.error('Missing authored spec or built receipt for', id);
    process.exit(1);
  }
  const spec = readJson(specPath);
  const receipt = readJson(receiptPath);

  const rigPath = spec.rig_glb ? resolve(SRC, spec.rig_glb) : null;
  const designPath = spec.design ? resolve(SRC, spec.design) : null;
  const spriteDir = join(OUT, id);
  // What a finished sprite cast would leave on disk. None of it exists yet:
  // the rigs are static, so the game poses the 3D models at runtime instead.
  const spriteAssets = ['character.json', 'walk', 'idle'].filter(name => existsSync(join(spriteDir, name)));

  const checks = {
    specPresent: !!spec.id,
    receiptPresent: !!receipt.id,
    receiptMatchesSpec: receipt.id === spec.id,
    rigPresent: !!rigPath && existsSync(rigPath),
    designPresent: !!designPath && existsSync(designPath),
    // A receipt may only claim completion when the artefacts are on disk.
    completionHonest: receipt.status === 'completed' ? spriteAssets.length > 0 : true,
    mshHonest: receipt.mshCompliant === true ? spriteAssets.length > 0 : true,
  };
  const passed = Object.values(checks).every(Boolean);
  console.log('Verification for', id, passed ? 'PASS' : 'FAIL');
  console.log(JSON.stringify({
    checks,
    receipt: { status: receipt.status, mshCompliant: receipt.mshCompliant, steps: receipt.steps },
    spriteAssets,
    note: receipt.note,
  }, null, 2));
  if (!spriteAssets.length) {
    console.log('The sprite pipeline has not run: no sprite strips or character.json exist.');
    console.log('The game uses the static 3D rigs, posed procedurally at runtime.');
  }
  process.exit(passed ? 0 : 1);
}

main();
