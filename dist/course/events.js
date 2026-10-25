import {netWorth} from './finance.js';
// History is the evidence. Never insert a milestone that did not happen.
export const EVENT_TYPES={consequence:{label:'A past choice returns',category:'wellbeing',symbol:'diamond'},market:{label:'Investment repricing',category:'cash',symbol:'square'},economy:{label:'Economic contraction',category:'cash',symbol:'square'},connection:{label:'A relationship changes',category:'wellbeing',symbol:'diamond'},project:{label:'A project takes a turn',category:'cash',symbol:'square'},recovery:{label:'Making room for recovery',category:'health',symbol:'cross'},flood:{label:'Flood damage',category:'cash',symbol:'wave'},loss:{label:'Family bereavement',category:'wellbeing',symbol:'diamond'},work:{label:'Work interruption',category:'cash',symbol:'square'},commission:{label:'Extra work',category:'cash',symbol:'square'},illness:{label:'Health setback',category:'health',symbol:'cross'},school:{label:'Leaving school',category:'wellbeing',symbol:'triangle'},retirement:{label:'Retirement',category:'wellbeing',symbol:'triangle'},dengue:{label:'Dengue fever',category:'health',symbol:'cross'},fired:{label:'Job loss',category:'cash',symbol:'square'},married:{label:'Marriage',category:'wellbeing',symbol:'diamond'},pregnant:{label:'Pregnancy',category:'health',symbol:'cross'}};
export function eventsFor(row){
 const recorded=Array.isArray(row.events)?row.events.filter(e=>e&&EVENT_TYPES[e.type]):[];
 const text=row.event??'',types=[];
 if(row.economy?.contractions?.length)types.push('economy');if(row.economy?.marketChange)types.push('market');
 if(text.includes('Floodwater'))types.push('flood');if(/(father|mother|grandmother) dies/.test(text))types.push('loss');if(text.includes('work interruption'))types.push('work');if(text.includes('commission'))types.push('commission');if(text.includes('health setback'))types.push('illness');if(text.includes('Leaving school'))types.push('school');if(text.includes('Work slows'))types.push('retirement');
 return [...recorded,...types.filter(type=>!recorded.some(e=>e.type===type)).map(type=>({type}))].map(e=>({...e,age:row.age,...EVENT_TYPES[e.type]}));
}
export function eventsForAccount(row,account){return eventsFor(row).filter(e=>e.category==='cash'&&(account==='household'?(!row.finance||e.type==='flood'):!!row.finance&&e.type!=='flood'));}
export function lifeMood(state){const previous=state.history.at(-2),latest=state.history.at(-1);if(!previous||!latest)return 'steady';const before=previous.finance&&latest.finance?netWorth(previous.finance):previous.cash,after=previous.finance&&latest.finance?netWorth(latest.finance):latest.cash,change=latest.wellbeing-previous.wellbeing;return change<=-2||latest.health-previous.health<=-8||after-before<=-10000?'difficult':change>0&&after>=before||after-before>=8000?'bright':'steady';}
export function lifeMoodAt(state,age){return lifeMood({...state,history:state.history.filter(row=>row.age<=age)});}
export const MOOD_CHORDS={
 steady:{land:'#c8bb98',grass:'#879a81',water:'#547076',waterLight:'#a0bdba',roof:'#b6674e',roofLight:'#cb8d69',leaf:'#426b68',lightleaf:'#79978b'},
 bright:{land:'#6ca78c',grass:'#d4c57c',water:'#507e82',waterLight:'#9ac8bd',roof:'#b65363',roofLight:'#d78080',leaf:'#326f61',lightleaf:'#8abb8a'},
 difficult:{land:'#777d59',grass:'#a6aa83',water:'#566c7c',waterLight:'#8fa5ad',roof:'#96745f',roofLight:'#b08d76',leaf:'#505c3f',lightleaf:'#84906b'}
};

// Relationship provenance, not a claim that device values reproduce printed ink.
export const MOOD_SOURCES={bright:'Wada 122: Benzol Green / Cream Yellow / Carmine',difficult:'Wada 121: Lincoln Green / Ochraceous Salmon / Brown',steady:'Wada 241: Red Orange / Dark Medici Blue / Pale Lemon Yellow / Isabella Color; screen reconstruction'};
