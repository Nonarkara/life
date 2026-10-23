// History is the evidence. Never insert a milestone that did not happen.
export const EVENT_TYPES={flood:{label:'Flood damage',category:'cash',symbol:'wave'},loss:{label:'Family bereavement',category:'wellbeing',symbol:'diamond'},work:{label:'Work interruption',category:'cash',symbol:'square'},commission:{label:'Extra work',category:'cash',symbol:'square'},illness:{label:'Health setback',category:'health',symbol:'cross'},school:{label:'Leaving school',category:'wellbeing',symbol:'triangle'},retirement:{label:'Retirement',category:'wellbeing',symbol:'triangle'},dengue:{label:'Dengue fever',category:'health',symbol:'cross'},fired:{label:'Job loss',category:'cash',symbol:'square'},married:{label:'Marriage',category:'wellbeing',symbol:'diamond'},pregnant:{label:'Pregnancy',category:'health',symbol:'cross'}};
export function eventsFor(row){
 if(Array.isArray(row.events))return row.events.filter(e=>e&&EVENT_TYPES[e.type]).map(e=>({...e,age:row.age,...EVENT_TYPES[e.type]}));
 const text=row.event??'',types=[];
 if(text.includes('Floodwater'))types.push('flood');if(/father dies|mother dies/.test(text))types.push('loss');if(text.includes('work interruption'))types.push('work');if(text.includes('commission'))types.push('commission');if(text.includes('health setback'))types.push('illness');if(text.includes('Leaving school'))types.push('school');if(text.includes('Work slows'))types.push('retirement');
 return types.map(type=>({type,age:row.age,...EVENT_TYPES[type]}));
}
export function lifeMood(state){const previous=state.history.at(-2),latest=state.history.at(-1);if(!previous||!latest)return 'steady';const change=latest.wellbeing-previous.wellbeing;return change<=-2||latest.health-previous.health<=-8||latest.cash-previous.cash<=-10000?'difficult':change>0&&latest.cash>=previous.cash||latest.cash-previous.cash>=8000?'bright':'steady';}
export const MOOD_CHORDS={
 steady:{land:'#7d9764',grass:'#9caf73',water:'#507e82',waterLight:'#7dabad',roof:'#a15f49',roofLight:'#bb7b57',leaf:'#476b48',lightleaf:'#668651'},
 bright:{land:'#6ca78c',grass:'#d4c57c',water:'#507e82',waterLight:'#9ac8bd',roof:'#b65363',roofLight:'#d78080',leaf:'#326f61',lightleaf:'#8abb8a'},
 difficult:{land:'#777d59',grass:'#a6aa83',water:'#566c7c',waterLight:'#8fa5ad',roof:'#96745f',roofLight:'#b08d76',leaf:'#505c3f',lightleaf:'#84906b'}
};

// Relationship provenance, not a claim that device values reproduce printed ink.
export const MOOD_SOURCES={bright:'Wada 122: Benzol Green / Cream Yellow / Carmine',difficult:'Wada 121: Lincoln Green / Ochraceous Salmon / Brown',steady:'Owner-approved existing material palette'};
