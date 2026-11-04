import {SCENARIO_PALETTES,EVENT_PALETTES} from './palette-scenes.js';
import {PALETTES,contrastRatio} from './palettes.js';
// Tone is editorial metadata, never a diagnosis or inferred from a money/health
// score. An emergency has no timer: the same stopped clock protects every reader.
const byPlate=new Map(PALETTES.map(p=>[p.plate,p]));
const ids=text=>new Set(text.split(' '));
const pressured=ids('treatment class_family_business class_debt class_ambition class_overtime class_expectations bully flood_help hard_marriage l_bottom l_borrow l_boss m_debt m_leverage m_crash m_vanished child-roof child-sponsor college-cost stall-paper flood-repair flood-move parent-ill share-offer');
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
  tone=event?(['asthma','asthmaAgain','river'].includes(event.id)?'urgent':event.type==='loss'?'somber':(event.health??0)<0||event.type==='fired'||event.type==='heartbreak'?'pressured':'hopeful'):
   somber.has(id)?'somber':pressured.has(id)?'pressured':hopeful.has(id)?'hopeful':'reflective';
 }
 // A receipt acknowledges what was done; it must not imply the emergency is
 // still demanding another answer. The recorded effects remain the evidence.
 return result&&tone==='urgent'?'pressured':tone;
}
function readable(fg,bg){if(contrastRatio(fg,bg)>=4.5)return fg;return contrastRatio('#ffffff',bg)>contrastRatio('#000000',bg)?'#ffffff':'#000000';}
export function decisionPresentation(input={}){
 const tone=decisionTone(input),id=input.scenario?.id;
 const rule=SCENARIO_PALETTES[id],pair=rule?.plates??EVENT_PALETTES[input.event?.type];
 const plate=pair?.[rule?.opening??(tone==='hopeful'?1:0)]??(tone==='hopeful'?147:tone==='reflective'?152:139);
 const palette=byPlate.get(plate),dark=tone==='urgent'||tone==='somber'||tone==='pressured';
 const paper=dark?palette.ink:palette.paper,ink=readable(dark?palette.paper:palette.ink,paper);
 const accent=readable(palette.accent,paper);
 return {tone,plate,label:input.result?'Choice recorded · time is paused':DECISION_TONES[tone],
  tokens:{'--paper':paper,'--ink':ink,'--muted':ink,'--line':ink+'55','--amber':accent,'--accent-ink':accent}};
}
