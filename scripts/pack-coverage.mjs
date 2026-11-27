// Every string the product asks to translate, checked against all four packs.
// A literal that the dictionary does not hold is a sentence the reader sees in
// English inside another language — the fault class that hides behind a clean
// dictionary and a green test suite.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dirs = ['dist/course', 'dist/intake'];
const files = [];
for (const dir of dirs) for (const name of readdirSync(dir)) if (name.endsWith('.js')) files.push(join(dir, name));
const packs = {};
for (const lang of ['th', 'zh-CN', 'ja', 'ko']) packs[lang] = (await import(`../dist/course/translations-${lang}.js`)).default;
// A phrase whose translation is the phrase itself needs no translation, and
// the packs leave those out.
const { phrases } = await import('../dist/course/translations.js');
const identity = new Set(phrases.filter(row => Array.isArray(row) && row.every(c => c === row[0])).map(row => row[0]));
const present = (pack, literal) => pack.has(literal) || identity.has(literal);

const seen = new Map();
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  for (const m of source.matchAll(/\bt\(\s*'((?:[^'\\]|\\.)*)'/g)) {
    const literal = m[1].replace(/\\'/g, "'");
    // A call that joins pieces is checked by scripts/i18n-guard.mjs, which
    // looks for the template that serves it.
    if (/^\s*\+/.test(source.slice(m.index + m[0].length, m.index + m[0].length + 40))) continue;
    if (!seen.has(literal)) seen.set(literal, file);
  }
}
let missing = 0;
for (const [literal, file] of seen) {
  const absent = ['th', 'zh-CN', 'ja', 'ko'].filter(lang => !present(packs[lang], literal));
  if (absent.length) {
    missing++;
    console.log(`  missing in ${absent.join(',')}: ${JSON.stringify(literal.slice(0, 90))}  (${file})`);
  }
}
console.log(`\n${seen.size} strings the product translates · ${missing} of them are missing from at least one pack`);
