// Annual historical events keyed to cohort birth year.
// Calendar year = birthYear + age. Each event fires once per world at its year
// unless prevented by a player's earlier choice flag.
// Authored game design, not historical prediction.
// Event data is added incrementally (Pieces 2-3); this file holds the engine.
import {birthYearOf} from './thai-history.js';

export const ERA_EVENTS = new Map();

// 1949 cohort events (birth year 1949; calendar year = 1949 + age).
// Prevention flags: armyGeneral (refuses coup), monkShelter (shelters hunted).
ERA_EVENTS.set('era_1957_coup', {
  year: 1957, label: 'The Sarit coup', cohort: 1949,
  prompt: 'Field Marshal Sarit seizes power in a coup. Martial law follows. Your school learns to salute the new portrait.',
  health: -2, wellbeing: -4, cash: -2000,
  eligible: (known) => known.armyGeneral !== true,
  flag: 'coup1957',
});
ERA_EVENTS.set('era_1958_martial_law', {
  year: 1958, label: 'Martial law', cohort: 1949,
  prompt: 'Political parties are banned. Newspapers are censored. Your father whispers politics behind closed doors.',
  health: 0, wellbeing: -2, cash: 0,
  eligible: () => true,
});
ERA_EVENTS.set('era_1963_sarit_dies', {
  year: 1963, label: 'Sarit dies', cohort: 1949,
  prompt: 'The strongman is gone. Thanom takes over. US bases expand; the war in Vietnam comes closer to home.',
  health: 0, wellbeing: -1, cash: 0,
  eligible: () => true,
});
ERA_EVENTS.set('era_1965_insurgency', {
  year: 1965, label: 'Communist insurgency', cohort: 1949,
  prompt: 'Red rebels operate in the northeast. The army burns villages it suspects of sympathy. Your neighbours disappear one by one.',
  health: -3, wellbeing: -5, cash: -1000,
  eligible: (known) => known.monkShelter !== true,
  flag: 'insurgency1965',
});
ERA_EVENTS.set('era_1968_bases_close', {
  year: 1968, label: 'US bases close', cohort: 1949,
  prompt: 'American troops withdraw from Vietnam. The Thai bases empty overnight. The town that lived on dollars goes quiet.',
  health: 0, wellbeing: -2, cash: -3000,
  eligible: () => true,
});

// 1981 cohort events. Prevention flag: studentLeader (organises against the coup).
ERA_EVENTS.set('era_1981_april_coup', {
  year: 1981, label: 'April coup attempt', cohort: 1981,
  prompt: 'You are born as young officers try to overthrow Prem. Tanks roll past your street; your mother keeps you inside.',
  health: -1, wellbeing: -2, cash: 0,
  eligible: () => true,
});
ERA_EVENTS.set('era_1985_boom', {
  year: 1985, label: 'The boom begins', cohort: 1981,
  prompt: 'The economy takes off. Bangkok builds skyscrapers; your province gets its first paved road.',
  health: 0, wellbeing: 2, cash: 2000,
  eligible: () => true,
});
ERA_EVENTS.set('era_1987_amnesty', {
  year: 1987, label: 'Communist insurgency ends', cohort: 1981,
  prompt: 'The government declares amnesty. The jungle fighters come down from the mountains. Some of your relatives were never seen again.',
  health: -2, wellbeing: -3, cash: 0,
  eligible: () => true,
});
ERA_EVENTS.set('era_1991_suchinda_coup', {
  year: 1991, label: 'Suchinda coup', cohort: 1981,
  prompt: 'Suchinda overthrows Chatichai. The military is back in power. Your school cancels classes for a week.',
  health: -2, wellbeing: -4, cash: -1000,
  eligible: (known) => known.studentLeader !== true,
  flag: 'coup1991',
});
ERA_EVENTS.set('era_1992_black_may', {
  year: 1992, label: 'Black May', cohort: 1981,
  prompt: 'Protesters fill the streets of Bangkok. The army fires. Hundreds die. You must choose: join them, or keep your head down.',
  health: -4, wellbeing: -6, cash: -2000,
  eligible: (known) => known.studentLeader !== true,
  flag: 'blackmay1992',
});
ERA_EVENTS.set('era_1997_asian_crisis', {
  year: 1997, label: 'Asian Financial Crisis', cohort: 1981,
  prompt: 'The baht collapses. Factories close. Your father loses his job. The boom is over.',
  health: -3, wellbeing: -5, cash: -6000,
  eligible: () => true,
});

// 2000 cohort events. Prevention flags: protestLeader (stood against crackdowns), armyGeneral (refuses coup).
ERA_EVENTS.set('era_2001_thaksin', {
  year: 2001, label: 'Thaksin elected', cohort: 2000,
  prompt: 'Your first year is a landslide victory. Your parents argue about him at the dinner table before you can speak.',
  health: 0, wellbeing: 1, cash: 0,
  eligible: () => true,
});
ERA_EVENTS.set('era_2006_coup', {
  year: 2006, label: 'Coup against Thaksin', cohort: 2000,
  prompt: 'The army overthrows the elected government while the PM is at the UN. Tanks are on every corner. School is cancelled for a month.',
  health: -2, wellbeing: -4, cash: -1500,
  eligible: (known) => known.armyGeneral !== true,
  flag: 'coup2006',
});
ERA_EVENTS.set('era_2010_red_shirt', {
  year: 2010, label: 'Red shirt crackdown', cohort: 2000,
  prompt: 'Protesters occupy central Bangkok for two months. The army clears them with live fire. Ninety-one die.',
  health: -4, wellbeing: -6, cash: -2500,
  eligible: (known) => known.protestLeader !== true,
  flag: 'redshirt2010',
});
ERA_EVENTS.set('era_2014_coup', {
  year: 2014, label: 'Coup against Yingluck', cohort: 2000,
  prompt: 'The army takes over again. A new constitution is written by generals. You learn to be careful what you say online.',
  health: -2, wellbeing: -4, cash: -1500,
  eligible: (known) => known.protestLeader !== true,
  flag: 'coup2014',
});
ERA_EVENTS.set('era_2016_king_dies', {
  year: 2016, label: 'The King dies', cohort: 2000,
  prompt: 'Bhumibol passes after seventy years on the throne. The country wears black for a year. You wear it too.',
  health: -3, wellbeing: -5, cash: 0,
  eligible: () => true,
});
ERA_EVENTS.set('era_2020_youth_protests', {
  year: 2020, label: 'Youth protests', cohort: 2000,
  prompt: 'Students demand monarchy reform. The government responds with lèse-majesté charges. Your generation is watching.',
  health: -2, wellbeing: -3, cash: -1000,
  eligible: (known) => known.protestLeader !== true,
  flag: 'youth2020',
});

// Annual events for a five-year period. Returns {records, health, wellbeing, cash, fired}
// in the same shape as periodLifeEvents, so it merges into the history row.
// `fired` is the full list of era event ids that have fired for this life.
export function eraAnnualEvents(state, from, to, random) {
  const result = { records: [], health: 0, wellbeing: 0, cash: 0, fired: [] };
  const by = birthYearOf(state);
  if (by === null) return result;
  const fired = new Set(state.story?.eraFired ?? []);
  const known = { ...state.story?.flags };
  for (let age = from + 1; age <= to; age++) {
    const year = by + age;
    for (const [id, e] of ERA_EVENTS) {
      if (e.year !== year) continue;
      if (fired.has(id)) continue;
      if (e.cohort && e.cohort !== by) continue;
      if (!e.eligible(known, state)) continue;
      if (result.records.some(r => r.id === id)) continue;
      const text = e.text
        .replaceAll('{friend}', state.story?.people?.friend ?? 'your friend')
        .replaceAll('{partner}', state.story?.people?.partner ?? 'your partner');
      const r = {
        origin: 'era',
        id,
        type: 'era',
        age,
        year,
        title: e.label,
        text,
        health: e.health ?? 0,
        wellbeing: e.wellbeing ?? 0,
        cash: e.cash ?? 0,
        ...(e.flag ? { flag: e.flag } : {}),
      };
      result.records.push(r);
      result.health += r.health;
      result.wellbeing += r.wellbeing;
      result.cash += r.cash;
      fired.add(id);
      if (e.flag) known[e.flag] = age;
    }
  }
  result.fired = Array.from(fired);
  return result;
}
