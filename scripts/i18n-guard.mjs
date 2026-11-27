// The dictionary guard. Rules that can fail.
//
//   1. A t() whose whole argument is one literal must be a key in all four packs.
//   2. A t() whose argument is a sentence the product builds by joining must
//      have a template of the same shape in all four packs: the call's literal
//      parts must run in order through the template's literal parts.
//   3. A t() that chooses between values must have every literal it can show
//      in all four packs.
//   4. A string written straight to the screen (textContent, aria-label,
//      title, placeholder, a heading) must be routed through t() or be a key
//      in all four packs.
//
// A call the dictionary cannot serve is a sentence the reader sees in English
// inside another language.
//
//   node scripts/i18n-guard.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { LATIN_KEPT } from '../dist/course/i18n.js';
import { phrases } from '../dist/course/translations.js';

const LANGS = ['th', 'zh-CN', 'ja', 'ko'];
const packs = {};
for (const lang of LANGS) packs[lang] = (await import(`../dist/course/translations-${lang}.js`)).default;
// A phrase whose translation is the phrase itself needs no translation, and
// the packs leave those out. They still count as served.
const identity = new Set(phrases.filter(row => Array.isArray(row) && row.every(c => c === row[0])).map(row => row[0]));
const inAll = s => LANGS.every(l => packs[l].has(s)) || identity.has(s);
const kept = s => {
  const words = String(s).match(/[A-Za-z][A-Za-z0-9.'’-]*/g) ?? [];
  return words.length > 0 && words.every(w => LATIN_KEPT.has(w.toLowerCase()));
};

const dirs = ['dist/course', 'dist/intake'];
const files = [];
for (const dir of dirs) for (const name of readdirSync(dir)) if (name.endsWith('.js')) files.push(join(dir, name));

const literalsOf = key => key.split(/\{[^}]*\}/g);
function templateServes(lang, callParts) {
  for (const key of packs[lang].keys()) {
    if (!key.includes('{')) continue;
    const parts = literalsOf(key);
    let at = 0;
    const serves = callParts.every(part => {
      const found = parts.indexOf(part, at);
      if (found < 0) return false;
      at = found + 1;
      return true;
    });
    if (serves) return key;
  }
  return null;
}

// Read one argument, starting at its opening parenthesis.
// Returns the argument's own text and the positions of the operators that
// split it at its own depth: '+' joins, '?' and ':' choose.
function readArgument(source, openIndex) {
  let depth = 1, quote = null, text = '';
  const plus = [], question = [], colon = [];
  for (let i = openIndex + 1; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      if (c === '\\') { text += c + (source[++i] ?? ''); continue; }
      if (c === quote) { quote = null; text += c; continue; }
      text += c; continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; text += c; continue; }
    if (c === '(' || c === '[' || c === '{') { depth++; text += c; continue; }
    if (c === ')' || c === ']' || c === '}') { depth--; if (depth === 0) return { text, plus, question, colon }; text += c; continue; }
    if (depth === 1) {
      const at = i - openIndex - 1;
      if (c === '+') plus.push(at);
      if (c === '?') question.push(at);
      if (c === ':') colon.push(at);
    }
    text += c;
  }
  return null;
}

// The literal fragments of a concatenation: the parts of it that are strings.
// A string inside a nested call is that call's business, not the sentence's.
function concatLiterals(text, plus) {
  const parts = [];
  let start = 0;
  for (const at of plus) { parts.push(text.slice(start, at)); start = at + 1; }
  parts.push(text.slice(start));
  return parts.map(part => {
    const trimmed = part.trim();
    const literal = /^'((?:[^'\\]|\\.)*)'$/.exec(trimmed) ?? /^"((?:[^"\\]|\\.)*)"$/.exec(trimmed);
    return literal ? literal[1].replace(/\\'/g, "'") : null;
  }).filter(part => part !== null);
}

// The head literal of an expression argument: the string it starts with.
function headLiteral(text) {
  const first = text.search(/[('"`]/);
  const paren = text.indexOf('(');
  const limit = paren >= 0 ? paren : text.length;
  const m = /^\s*'((?:[^'\\]|\\.)*)'/.exec(text.slice(0, limit));
  return m ? m[1].replace(/\\'/g, "'") : null;
}

// The quoted strings of a piece of argument text.
function quotedStrings(text) {
  const out = [];
  const re = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(text))) out.push((m[1] ?? m[2]).replace(/\\'/g, "'"));
  return out;
}

// The '+' positions of a piece of text, at its own depth.
function plusIn(text) {
  const out = [];
  let depth = 0, quote = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) { if (c === '\\') { i++; continue; } if (c === quote) quote = null; continue; }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') depth--;
    else if (c === '+' && depth === 0) out.push(i);
  }
  return out;
}

const failures = [];
let calls = 0;
const check = (file, line, rule, what, missing) => failures.push({ rule, file, line, what, missing });

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');
  const lineOf = index => source.slice(0, index).split('\n').length;

  for (const m of source.matchAll(/\bt\(/g)) {
    const arg = readArgument(source, m.index + 1);
    if (!arg) continue;
    calls++;
    const line = lineOf(m.index);
    const text = arg.text.trim();
    const whole = /^'((?:[^'\\]|\\.)*)'$/.exec(text) ?? /^"((?:[^"\\]|\\.)*)"$/.exec(text);
    // Rule 1: one whole literal.
    if (whole) {
      const literal = whole[1].replace(/\\'/g, "'");
      if (!inAll(literal) && !kept(literal)) check(file, line, 1, literal);
      continue;
    }
    // Rule 3: a choice between values. Each branch is checked on its own.
    if (arg.question.length) {
      const branches = [];
      let start = 0;
      const cuts = [...arg.question, ...arg.colon].sort((a, b) => a - b);
      for (const cut of cuts) { branches.push(arg.text.slice(start, cut)); start = cut + 1; }
      branches.push(arg.text.slice(start));
      for (const branch of branches) {
        const trimmed = branch.trim();
        if (!trimmed) continue;
        const literal = /^'((?:[^'\\]|\\.)*)'$/.exec(trimmed);
        if (literal) {
          const value = literal[1].replace(/\\'/g, "'");
          if (value.length && !inAll(value) && !kept(value) && !/^[a-z][a-z0-9-]*$/.test(value)) check(file, line, 3, value);
          continue;
        }
        // A branch that is a sentence the product builds.
        const pieces = concatLiterals(trimmed, plusIn(trimmed));
        if (pieces.length && trimmed.includes('+')) {
          const missing = LANGS.filter(lang => !templateServes(lang, pieces));
          if (missing.length) check(file, line, 2, pieces.join(' | '), missing);
        }
      }
      continue;
    }
    // Rule 2: a sentence the product builds by joining.
    if (arg.plus.length) {
      const pieces = concatLiterals(text, arg.plus);
      if (pieces.length) {
        const missing = LANGS.filter(lang => !templateServes(lang, pieces));
        if (missing.length) check(file, line, 2, pieces.join(' | '), missing);
      }
      continue;
    }
    // A call whose value decides: every literal it can show must be a key.
    const head = headLiteral(text);
    if (head && head.length && !inAll(head) && !kept(head) && !/^[a-z][a-z0-9-]*$/.test(head)) check(file, line, 3, head);
  }

  // Rule 4: a string written straight to the screen is routed or is in the packs.
  const direct = [
    /\btextContent\s*=\s*'((?:[^'\\]|\\.)*)'/g,
    /\.setAttribute\(\s*'(?:aria-label|title|placeholder|alt)'\s*,\s*'((?:[^'\\]|\\.)*)'/g,
    /\b(?:el|element)\(\s*'[a-z0-9]+'\s*,\s*'((?:[^'\\]|\\.)*)'/g,
    /\bsvg\(\s*'text'\s*,\s*\{[^}]*\}\s*,\s*'((?:[^'\\]|\\.)*)'/g,
  ];
  for (const pattern of direct) {
    for (const m of source.matchAll(pattern)) {
      const literal = m[1].replace(/\\'/g, "'").trim();
      if (!/[A-Za-z]{3,}/.test(literal)) continue;
      if (source[m.index + m[0].length] === '[') continue; // an indexed literal is a letter, not a sentence
      if (literal.split(/\s+/).every(token => /^[a-z][a-z0-9-]*$/.test(token))) continue; // class names, not words
      if (kept(literal)) continue; // Latin the language keeps on purpose
      const line = lines[lineOf(m.index) - 1] ?? '';
      const at = line.indexOf(m[1]);
      const prefix = at >= 0 ? line.slice(0, at) : line;
      if (/(^|[^A-Za-z0-9_$])t\([^()]*$/.test(prefix)) continue; // routed through t()
      if (inAll(literal)) continue;
      check(file, lineOf(m.index), 4, literal);
    }
  }
}

for (const f of failures) console.log(`  rule ${f.rule} ${f.file}:${f.line}  ${JSON.stringify(f.what.slice(0, 96))}${f.missing ? '  missing in ' + f.missing.join(',') : ''}`);
console.log(`\n${calls} translation calls checked · ${failures.length} that the dictionary cannot serve`);
process.exit(failures.length ? 1 : 0);
