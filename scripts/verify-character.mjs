#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: node scripts/verify-character.mjs <id>');
    process.exit(1);
  }
  const dir = join('review/characters', id);
  const receiptPath = join(dir, 'receipt.json');
  const specPath = join(dir, 'spec.json');
  if (!existsSync(receiptPath) || !existsSync(specPath)) {
    console.error('Missing receipt or spec for', id);
    process.exit(1);
  }
  const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));
  const checks = {
    specPresent: !!spec.id,
    receiptPresent: !!receipt.id,
    mshCompliant: receipt.mshCompliant === true,
    stepsComplete: Array.isArray(receipt.steps) && receipt.steps.length === 5
  };
  const passed = Object.values(checks).every(Boolean);
  console.log('Verification for', id, passed ? 'PASS' : 'FAIL');
  console.log(JSON.stringify(checks, null, 2));
  process.exit(passed ? 0 : 1);
}

main();
