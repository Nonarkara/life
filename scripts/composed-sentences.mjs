// The sentences the product assembles from pieces. Under the old engine a piece
// that the dictionary did not know left English inside a Thai sentence; now the
// whole sentence stands in English. This lists every composed sentence and says
// which language it reads in, so nothing changes quietly.
import { translate } from '../dist/course/i18n.js';
import { REGIONS, HOUSEHOLDS } from '../dist/course/regions.js';

const LANGUAGES = ['th', 'zh-CN', 'ja', 'ko'];
const home = REGIONS['nakhon-si-thammarat'].home;
const place = REGIONS['nakhon-si-thammarat'].place;
const who = HOUSEHOLDS.grandmother.text;

const composed = [
  ['birth narrative', `Born into ${home} in ${place}. Raised by ${who}. Live one life: from ten, spend ten points every five years and face its decisions; at the end, see where you went, what it cost and what it taught, then live again in the same world.`],
  ['birth card, first ten years', `Born into ${home} in ${place}. Raised by ${who}. For the first ten years, watch your world grow. The first choices come at 10.`],
  ['birth card, plain', `Born into ${home} in ${place}.`],
  ['birth card, short', `Born into ${home} in ${place}. Raised by ${who}.`],
  ['console society', `Born into ${home} · ${place}`],
  ['recorded event', `Born into ${home}`],
  ['childhood event', `Childhood: family, school and the world you inherited. The field is full of frogs tonight, and the torch is yours if you want it.`],
  ['previous life', 'Your previous life in this scenario reached 65, with ฿120,000 remaining.'],
  ['the plan ahead', 'Set your effort for ages 10–15.'],
  ['questions count', 'Questions · 2'],
  ['answer count', 'Answer 2 questions →'],
  ['the year strip', 'Age 1981 · The Year the Region Changed'],
  ['the view', 'Age 1: a close view of the family around a baby in a cradle.'],
  ['the year place', 'Age 2: Chumphon. the ferries cross to kawthaung.'],
  ['scenario year', 'Scenario year 1985 · age 30'],
  ['moved to', 'Moved to Chumphon at 35'],
  ['committed effort', 'Committed effort until age 35: Health 3/10 · Skill 2/10'],
  ['last time you chose', 'Last time you chose “Continue school”.'],
  ['set index', 'SET 1985–1990'],
];

for (const [name, source] of composed) {
  const row = [];
  for (const language of LANGUAGES) {
    const shown = translate(source, language);
    const english = shown === source;
    row.push(`${language}:${english ? 'ENGLISH' : 'translated'}`);
  }
  const anyEnglish = row.some(r => r.endsWith('ENGLISH'));
  console.log(`${anyEnglish ? '!! ' : '   '}${name.padEnd(26)} ${row.join('  ')}`);
  if (anyEnglish) console.log(`      ${source.slice(0, 110)}`);
}
