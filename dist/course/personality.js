import {rand,clamp,AXES,newLife,configureLife,begin,live} from './sim.js';
export const TRAITS=[['openness','Openness'],['conscientiousness','Conscientiousness'],['extraversion','Extraversion'],['agreeableness','Agreeableness'],['neuroticism','Emotional sensitivity']];
export function personality(state){
 const initial=Object.fromEntries(TRAITS.map(([key])=>[key,Math.round(25+rand(state.seed,0,'trait-'+key)*50)]));const current={...initial};
 for(const row of state.history.filter(r=>r.from!==undefined)){const e=row.effort;current.openness+=e.craft*.25+e.iq*.1-.5;current.conscientiousness+=e.drive*.2-.35;current.extraversion+=e.eq*.15-.3;current.agreeableness+=e.eq*.1-.2;current.neuroticism+=(row.cash<0?.8:-.2)+(row.health<45?.5:0);}
 for(const key of Object.keys(current))current[key]=Math.round(clamp(current[key]));return {initial,current};
}
export function capacities(state){const trained=state.skills,base=state.attributes,age=state.age;const aging=Math.max(0,age-45)*.45;return {strength:Math.round(clamp(22+base.physique*5+trained.physique*.65-aging)),athleticism:Math.round(clamp(18+base.physique*3+trained.physique*.9-aging*.8)),reasoning:Math.round(clamp(25+base.iq*4+trained.iq*.7)),emotionalSkills:Math.round(clamp(25+base.eq*4+trained.eq*.7)),empathy:Math.round(clamp(personality(state).current.agreeableness*.6+base.eq*3+trained.eq*.25))};}
const cohorts=new Map();
export function comparison(state){
 const key=JSON.stringify([state.seed,state.intake??null,state.attributes]);if(!cohorts.has(key)){const paths=[];for(let i=0;i<32;i++){let s=state.intake?configureLife(newLife(state.seed),state.intake):newLife(state.seed);s={...s,attributes:{...state.attributes},effort:{...state.attributes}};s=begin(s);for(let age=10;age<80&&s.stage==='review';age+=5){const effort=Object.fromEntries(AXES.map(a=>[a.key,0]));for(let n=0;n<10;n++)effort[AXES[Math.floor(rand(i+1,age*10+n,'cohort')*AXES.length)].key]++;s=live({...s,effort});}paths.push(s.history);}cohorts.set(key,paths);}
 const paths=cohorts.get(key),rows=paths.flatMap(path=>path.filter(row=>row.age===state.age));return {count:rows.length,total:32,health:mean(rows,'health'),wellbeing:mean(rows,'wellbeing'),cash:mean(rows,'cash')};
}
function mean(rows,key){return rows.length?rows.reduce((sum,row)=>sum+row[key],0)/rows.length:null;}

export function capacityHistory(state){let skills=Object.fromEntries(AXES.map(a=>[a.key,0]));return state.history.map(row=>{if(row.from!==undefined)for(const axis of AXES)skills[axis.key]+=row.effort[axis.key]+(axis.key==='iq'?(row.pathwayLearning??0):0);return {age:row.age,...capacities({...state,age:row.age,skills:{...skills},history:state.history.filter(r=>r.age<=row.age)})};});}
