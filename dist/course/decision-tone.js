import {SCENARIO_PALETTES,EVENT_PALETTES} from './palette-scenes.js';
import {PALETTES,contrastRatio} from './palettes.js';
// Tone is editorial metadata, never a diagnosis or inferred from a money/health
// score. An emergency has no timer: the same stopped clock protects every reader.
const byPlate=new Map(PALETTES.map(p=>[p.plate,p]));
const ids=text=>new Set(text.split(' '));
const pressured=ids('treatment class_family_business class_debt class_ambition class_overtime class_connections class_expectations class_family_pressure class_support_pressure class_housing_pressure class_family_time class_posting_pressure class_name_pressure class_heirloom class_photo class_water_offering class_lantern class_record class_name_plaque th_bangkok_accounting th_bank_merger bully flood_help hard_marriage l_bottom l_borrow l_boss m_debt m_leverage m_crash m_vanished child-roof child-sponsor college-cost stall-paper flood-repair flood-move parent-ill share-offer');
const hopeful=ids('friend love commitment parenthood mentor friend_late dog l_friends l_kind m_pet project_return');
const somber=ids('remember remember_mother l_funeral m_grandparent');
export const DECISION_TONES={
 urgent:'Urgent moment · time is paused',
 pressured:'Under pressure · time is paused',
 reflective:'Take your time · time is paused',
 hopeful:'An opening · time is paused',
 somber:'A difficult moment · time is paused'
};
export function decisionTone({scenario,event,result=false}={}){
 let tone=scenario?.tone;
 if(!Object.hasOwn(DECISION_TONES,tone)){
  const id=scenario?.id;
  tone=event?(event.origin==='crisis'?'somber':['asthma','asthmaAgain','river'].includes(event.id)?'urgent':event.type==='loss'?'somber':(event.health??0)<0||event.type==='fired'||event.type==='heartbreak'?'pressured':'hopeful'):
   somber.has(id)?'somber':pressured.has(id)?'pressured':hopeful.has(id)?'hopeful':'reflective';
 }
 // A receipt acknowledges what was done; it must not imply the emergency is
 // still demanding another answer. The recorded effects remain the evidence.
 return result&&tone==='urgent'?'pressured':tone;
}
const EDITORIAL_TONES={
 reflective:{paper:'#f6f1e4',ink:'#192e2c',muted:'#455852',accent:'#9a5400'},
 hopeful:{paper:'#faf6eb',ink:'#183029',muted:'#425951',accent:'#8a4f00'},
 pressured:{paper:'#eef0eb',ink:'#1b2a29',muted:'#465755',accent:'#9a3b18'},
 somber:{paper:'#192726',ink:'#f3ede0',muted:'#c8c4b7',accent:'#f0a846'},
 urgent:{paper:'#142120',ink:'#f8f4eb',muted:'#ced2c8',accent:'#f4a23a'}
};
function readable(fg,bg){if(contrastRatio(fg,bg)>=4.5)return fg;return contrastRatio('#ffffff',bg)>contrastRatio('#000000',bg)?'#ffffff':'#000000';}
export function decisionPresentation(input={}){
 const tone=decisionTone(input),id=input.scenario?.id;
 const rule=SCENARIO_PALETTES[id],pair=rule?.plates??EVENT_PALETTES[input.event?.type];
 const plate=pair?.[rule?.opening??(tone==='hopeful'?1:0)]??(tone==='hopeful'?147:tone==='reflective'?152:139);
 const spec=EDITORIAL_TONES[tone]??EDITORIAL_TONES.reflective;
 const paper=spec.paper,ink=readable(spec.ink,paper),muted=readable(spec.muted,paper),accent=readable(spec.accent,paper);
 return {tone,plate,label:input.result?'Choice recorded · time is paused':DECISION_TONES[tone],
  tokens:{'--paper':paper,'--ink':ink,'--muted':muted,'--line':ink+'38','--amber':accent,'--accent-ink':accent}};
}
