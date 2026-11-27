// The dictionary guard, as a gate. Every translation the product asks for must
// be one the four packs can serve, and every string written straight to the
// screen must be routed through the dictionary or be in all four packs.
//
// A sentence the dictionary cannot serve is English inside another language.
// The sweep in scripts/sweep-recap-th.mjs sees that on the screen; this gate
// sees it in the source, before it ships.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

test('every translation the product asks for is one the packs can serve', () => {
  let output = '';
  let failed = false;
  try {
    output = execFileSync(process.execPath, [resolve('scripts/i18n-guard.mjs')], { encoding: 'utf8' });
  } catch (error) {
    failed = true;
    output = (error.stdout ?? '') + (error.stderr ?? '');
  }
  assert.equal(failed, false, `the dictionary guard found leaks:\n${output}`);
  assert.match(output, /0 that the dictionary cannot serve/);
});
