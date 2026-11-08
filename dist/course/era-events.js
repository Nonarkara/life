// Annual historical events keyed to cohort birth year.
// Calendar year = birthYear + age. Each event fires once per world at its year
// unless prevented by a player's earlier choice flag.
// Authored game design, not historical prediction.
// Event data is added incrementally (Pieces 2-3); this file holds the engine.
import {birthYearOf} from './thai-history.js';

export const ERA_EVENTS = new Map();

// History happens to everyone alive that year. Sources: ERA-EVENTS-AND-BUDDHISM.md (bbc); 1976 bases, Order 66/2523 and 2011 from Wikipedia and Bangkok Post.
ERA_EVENTS.set('era_1957_the_sarit_coup',{year:1957,label:'The Sarit coup',prompt:'Field Marshal Sarit seizes power. Schools learn to salute a new portrait.',health:0,wellbeing:-2,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1958_martial_law',{year:1958,label:'Martial law',prompt:'Political parties are banned. Newspapers are censored. People talk politics behind closed doors.',health:0,wellbeing:-1,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1963_sarit_dies',{year:1963,label:'Sarit dies',prompt:'The strongman is gone. Another field marshal takes over.',health:0,wellbeing:0,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1965_american_airbases',{year:1965,label:'American airbases',prompt:'American planes begin flying from Thai airbases. Towns that lived on rice start to live on dollars.',health:0,wellbeing:0,cash:1000,eligible:()=>true});
ERA_EVENTS.set('era_1967_communist_insurgency',{year:1967,label:'Communist insurgency',prompt:'The fighting in the northeast spreads. Villagers learn not to ask where a neighbour has gone.',health:-1,wellbeing:-3,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1973_october_1973',{year:1973,label:'October 1973',prompt:'Students fill the streets of Bangkok. Soldiers fire. The field marshals leave the country, and for a while anything can be printed.',health:0,wellbeing:1,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1976_october_1976',{year:1976,label:'October 1976',prompt:'Police, soldiers and mobs attack students at Thammasat University. That evening the army takes power again.',health:0,wellbeing:-4,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1976_the_bases_close',{year:1976,label:'The bases close',prompt:'The American airbases close. The towns that lived on dollars go quiet.',health:0,wellbeing:-1,cash:-2000,eligible:()=>true});
ERA_EVENTS.set('era_1980_amnesty',{year:1980,label:'Amnesty',prompt:'The government offers amnesty. People walk out of the forests. Some families are still waiting.',health:0,wellbeing:1,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1981_april_coup_attempt',{year:1981,label:'April coup attempt',prompt:'Young officers try to overthrow the government. Tanks stand in Bangkok for three days.',health:0,wellbeing:-1,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1987_the_boom_begins',{year:1987,label:'The boom begins',prompt:'The economy takes off. Bangkok builds towers. A paved road reaches another province.',health:0,wellbeing:1,cash:2000,eligible:()=>true});
ERA_EVENTS.set('era_1991_the_coup_of_1991',{year:1991,label:'The coup of 1991',prompt:'The army overthrows the elected government. Soldiers stand at the intersections.',health:0,wellbeing:-2,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1992_may_1992',{year:1992,label:'May 1992',prompt:'Crowds fill Bangkok against the general who took power. The army fires. Families are still asking where some of them went.',health:0,wellbeing:-3,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_1997_the_baht_falls',{year:1997,label:'The baht falls',prompt:'The baht collapses. Factories close. Finance companies shut their doors. People you know lose everything.',health:-1,wellbeing:-4,cash:-8000,eligible:()=>true});
ERA_EVENTS.set('era_2001_a_landslide',{year:2001,label:'A landslide',prompt:'A new party wins by a landslide. Families begin to argue about it at dinner.',health:0,wellbeing:0,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_2004_the_tsunami',{year:2004,label:'The tsunami',prompt:'A tsunami strikes the Andaman coast. Thousands die. Everyone knows someone who knows someone.',health:0,wellbeing:-2,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_2006_the_coup_of_2006',{year:2006,label:'The coup of 2006',prompt:'The army overthrows the elected government while the prime minister is abroad. People take photographs with the tanks.',health:0,wellbeing:-2,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_2010_bangkok_burns',{year:2010,label:'Bangkok burns',prompt:'Protesters occupy central Bangkok for two months. Troops clear them. Ninety-one die.',health:0,wellbeing:-3,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_2011_the_great_flood',{year:2011,label:'The great flood',prompt:'The flood covers the central plains and reaches the edge of Bangkok. In some streets the water stays two months.',health:-1,wellbeing:-3,cash:-3000,eligible:()=>true});
ERA_EVENTS.set('era_2014_the_coup_of_2014',{year:2014,label:'The coup of 2014',prompt:'The army takes over again. People learn to be careful what they say online.',health:0,wellbeing:-2,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_2016_a_year_in_black',{year:2016,label:'A year in black',prompt:'The radio goes quiet. The country wears black for a year. You wear it too.',health:0,wellbeing:-3,cash:0,eligible:()=>true});
ERA_EVENTS.set('era_2020_the_virus',{year:2020,label:'The virus',prompt:'A new virus closes the borders. Funerals are small. Visits happen through glass.',health:-1,wellbeing:-3,cash:-2000,eligible:()=>true});

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
      if (!e.eligible(known, state)) continue;
      if (result.records.some(r => r.id === id)) continue;
      const text = e.prompt
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
