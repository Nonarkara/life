#!/usr/bin/env node
// Stage a character spec for the SpriteCast pipeline.
//
// This script used to write a receipt claiming a five-step pipeline had run —
// "3d-guide, render, style-redraw, fit-verify, anchor-shadow-bake" — while
// doing none of it. The result was a receipt that asserted work nobody did.
//
// It now does exactly one thing: validate and stage the spec, and say plainly
// in the receipt that no sprite assets were produced. The build writes the
// receipt that ships, and it says the same thing.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REQUIRED = ['id', 'name'];

function main() {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error('Usage: node scripts/generate-character.mjs <spec.json>');
    process.exit(1);
  }
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));
  const missing = REQUIRED.filter(key => !spec[key]);
  if (missing.length) {
    console.error('Spec validation failed: missing', missing.join(', '));
    process.exit(1);
  }
  const outDir = join('review/characters', spec.id);
  mkdirSync(outDir, { recursive: true });
  const rig = spec.rig_glb ? resolve('src/characters', spec.rig_glb) : null;
  const design = spec.design ? resolve('src/characters', spec.design) : null;
  const sources = { rig_glb: rig ? existsSync(rig) : false, design: design ? existsSync(design) : false };
  const receipt = {
    id: spec.id,
    generatedAt: new Date().toISOString(),
    pipeline: 'spritecast',
    steps: ['spec-validate'],
    status: 'spec-only',
    mshCompliant: false,
    msh: spec.msh ?? {},
    sources,
    note: 'Spec staged. No sprite assets were produced: the rigs are static, so the game poses the 3D models procedurally at runtime. Run charpipe.py render → finish → pack to generate sprite strips, per-frame shadows and character.json.',
    outputDir: outDir
  };
  writeFileSync(join(outDir, 'receipt.json'), JSON.stringify(receipt, null, 2));
  writeFileSync(join(outDir, 'spec.json'), JSON.stringify(spec, null, 2));
  console.log('Spec staged:', spec.id, '→', outDir, '| rig', sources.rig_glb ? 'found' : 'NOT FOUND', '| design', sources.design ? 'found' : 'NOT FOUND');
}

main();
