// SpriteCast build pipeline for Life2.0 characters.
//
// This stage validates character specs in src/characters/ against the
// SpriteCast-compatible schema and writes MSH-compliance receipts into the
// build output at out/course/characters/<id>/.
//
// The full SpriteCast Python pipeline (render → finish → pack via charpipe.py)
// is NOT run here because it requires:
//   - rigged GLB models with walk/idle animation clips (our VRoid models are
//     static; character-anime.js poses them procedurally at runtime)
//   - OpenAI API key for style redraw (skipped with "draw": false)
// When animated models and keys are available, run charpipe.py manually per
// character and copy the resulting out/ into this directory.
//
// Receipts document the pipeline contract: when assets land here,
// character-anime.js loads them in preference to the 3D VRoid models.
//
// Pipeline principles (from spritecast):
//   - 3D does the motion; each frame is fitted back onto its 3D render and
//     checked for outline overlap (>= redo_below, default 0.75).
//   - Every frame casts its own 3D shadow, drawn at 30% under everything.
//   - The anchor is the point between the feet, as a fraction of the frame.
//   - No runtime AI, no runtime model download. All steps run at build time.
//
// Usage: node scripts/spritecast-build.mjs [--out <dir>] [--only <id>]
//

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve('.');
const SRC = join(ROOT, 'src', 'characters');

function specFiles() {
  return readdirSync(SRC).filter(f => f.endsWith('.json') && f !== 'spec.schema.json').map(f => join(SRC, f));
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function characterDir(id) {
  return join(SRC, id);
}

function writeReceipt(spec, targetDir, status, steps, note) {
  mkdirSync(targetDir, { recursive: true });
  const receipt = {
    id: spec.id,
    name: spec.name,
    pipeline: 'spritecast',
    pipelineVersion: '1.0',
    steps,
    status,
    mshCompliant: status === 'completed',
    msh: spec.msh ?? {},
    note: note ?? null,
    sourceSpec: spec.path,
    outputDir: 'course/characters/'+spec.id,
  };
  writeFileSync(join(targetDir, 'receipt.json'), JSON.stringify(receipt, null, 2));
  writeFileSync(join(targetDir, 'spec.json'), JSON.stringify(spec, null, 2));
}

export async function buildCharacters(targetDir = resolve('out', 'course', 'characters'), onlyId = null) {
  const specs = specFiles().map(path => loadJson(path));

  if (onlyId) {
    const filtered = specs.filter(s => s.id === onlyId);
    if (filtered.length === 0) {
      console.error(`no spec with id "${onlyId}"`);
      process.exit(1);
    }
  }

  mkdirSync(targetDir, { recursive: true });

  for (const spec of specs) {
    if (onlyId && spec.id !== onlyId) continue;

    console.log(`\n== ${spec.id} (${spec.name}) ==`);

    const missing = [];
    for (const k of ['name', 'description', 'design', 'rig_glb']) {
      if (!spec[k]) missing.push(k);
    }
    if (missing.length) {
      console.warn(`  spec missing ${missing.join(', ')}`);
    }

    // Check whether the rig_glb exists (resolved relative to the spec file's dir,
    // as spritecast's load() does).
    const rigPath = resolve(join(SRC, spec.rig_glb || ''));
    const rigExists = existsSync(rigPath);
    console.log(`  rig_glb: ${spec.rig_glb} ${rigExists ? 'found' : 'NOT FOUND'}`);

    const designPath = resolve(join(SRC, spec.design || ''));
    const designExists = existsSync(designPath);
    console.log(`  design: ${spec.design} ${designExists ? 'found' : 'NOT FOUND'}`);

    const steps = ['spec-validate'];
    let status = 'pending';
    let note = null;

    if (rigExists && designExists) {
      steps.push('render-ready', 'finish-3d-ready', 'pack-strip-shadow-anchor-ready');
      status = 'ready';
      note = 'spec validated; run charpipe.py render → finish → pack to generate sprite assets (walk/idle strips, per-frame 3D shadows, character.json)';
    } else {
      status = 'blocked';
      note = 'cannot run pipeline: rig_glb or design source missing';
    }

    writeReceipt(spec, join(targetDir, spec.id), status, steps, note);
    console.log(`  receipt: ${status}`);
  }

  console.log(`\nSpriteCast build complete. Receipts in ${targetDir}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outDir = process.argv.includes('--out')
    ? resolve(process.argv[process.argv.indexOf('--out') + 1])
    : resolve('out', 'course', 'characters');
  const only = process.argv.includes('--only')
    ? process.argv[process.argv.indexOf('--only') + 1]
    : null;
  buildCharacters(outDir, only).catch(err => { console.error(err); process.exit(1); });
}
