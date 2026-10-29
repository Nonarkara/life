// Palette's documented chords, assigned to recorded incidents and moods.
import {CHORDS} from './palette-chords.js';
import {SCENARIO_PALETTES,EVENT_PALETTES,QUIET_PLATES} from './palette-scenes.js';
import {eventsFor,lifeMoodAt} from './events.js';
const lightness=hex=>{const v=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
export const MOOD_ORDER=['steady','bright','difficult'];
export const PALETTES=CHORDS.map(chord=>{
 const [dark,accent,light]=[...chord.colors].sort((a,b)=>lightness(a.hex)-lightness(b.hex));
 const ink=dark.hex,paper=light.hex,point=accent.hex,sad=chord.mood==='difficult';
 // Same chord, distinct material roles. No generic green town overrides it.
 const material=(a,b,w)=>mix(a,b,w);
 return {...chord,name:'Wada '+chord.plate,paper,ink,accent:point,muted:readableAccent(mix(ink,paper,.28),paper),line:mix(ink,paper,.65),
 world:{sky:material(ink,paper,sad?.26:.62),ground:material(ink,paper,sad?.25:.55),sand:material(point,paper,.55),land:material(ink,paper,sad?.32:.66),grass:material(point,paper,sad?.18:.5),water:material(ink,point,.32),waterLight:material(ink,paper,.6),road:material(point,paper,.7),edge:material(ink,paper,.38),wall:material(point,paper,.8),shade:material(ink,paper,.48),roof:point,roofLight:material(point,paper,.35),wood:material(ink,point,.3),leaf:material(ink,point,.2),lightleaf:material(ink,paper,.45)}};
});
const byPlate=new Map(PALETTES.map(p=>[p.plate,p]));
function direction(effects={}){
 if((effects.health??0)<=-3||(effects.wellbeing??0)<=-2)return 0;
 if((effects.wellbeing??0)>0||Object.values(effects.skills??{}).some(n=>n>0)||(effects.health??0)>0)return 1;
 return (effects.cash??0)>=0?1:0;
}
// Only evidence available at this age may colour a scene. Old pinned settings
// are deliberately ignored, and no wall-clock carousel fabricates a mood.
export function paletteCue(state={},age=state.age??0,mood,context={}){
 const history=(state.history??[]).filter(r=>r.age<=age),row=history.at(-1);
 if(state.death&&age>=state.age)return {plate:221,reason:'death'};
 const condition=state.age===age?state:row;
 if(condition?.health<25)return {plate:139,reason:'critical-health'};
 if(condition?.wellbeing<25)return {plate:232,reason:'critical-wellbeing'};
 // Year-dated events may live in the destination row while travelling.
 // Reveal their colour only when that year has actually been reached.
 const dated=(state.history??[]).flatMap(r=>r.events??[]).filter(e=>e.origin==='life'&&e.age<=age&&age-e.age<1&&EVENT_PALETTES[e.type]).at(-1);
 if(dated){const gain=(dated.wellbeing??0)>0;return {plate:EVENT_PALETTES[dated.type][gain?1:0],reason:dated.type};}
 const pending=state.story?.pending;
 if(pending&&pending.age<=age&&SCENARIO_PALETTES[pending.id]){const rule=SCENARIO_PALETTES[pending.id];return {plate:rule.plates[rule.opening],reason:pending.id};}
 const question=typeof context==='object'&&SCENARIO_PALETTES[context?.scenario];
 if(question)return {plate:question.plates[question.opening],reason:context.scenario};
 // live() archives answered pivots in the destination row. Their station,
 // rather than the later row age, is when this evidence became available.
 const pivot=[...(state.history??[]).flatMap(r=>r.pivots??[]),...(state.pivots??[])]
  .filter(p=>p.station<=age).sort((a,b)=>a.station-b.station).at(-1);
 if(pivot&&pivot.station===row?.age&&SCENARIO_PALETTES[pivot.pivot])return {plate:SCENARIO_PALETTES[pivot.pivot].plates[direction({...pivot.effects,skills:pivot.skills})],reason:pivot.pivot};
 const story=(state.story?.seen??[]).filter(e=>e.age<=age).at(-1);
 if(story&&story.age===row?.age&&SCENARIO_PALETTES[story.id])return {plate:SCENARIO_PALETTES[story.id].plates[direction(story.effects)],reason:story.id};
 const event=row&&eventsFor(row).find(e=>EVENT_PALETTES[e.type]);
 if(event){const plates=EVENT_PALETTES[event.type];const gain=event.type==='market'?(row.economy?.marketChange??0)>0:['commission','recovery','married','pregnant'].includes(event.type);return {plate:plates[gain?1:0],reason:event.type};}
 const tone=mood??lifeMoodAt({...state,history},age),family=PALETTES.filter(p=>p.mood===tone),chapter=Math.max(0,Math.floor((age-10)/5));
 return {plate:(family.length?family:QUIET_PLATES.map(n=>byPlate.get(n)))[chapter%10].plate,reason:'chapter:'+tone};
}
export function paletteFor(state,age,mood,context){return byPlate.get(paletteCue(state,age,mood,context).plate);}

// UI accents need readable contrast even when the authored material colour is pale.
export function contrastRatio(a,b){
 const light=hex=>{const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 const x=light(a),y=light(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
function readableAccent(accent,background,minimum=4.5){
 const end=contrastRatio('#ffffff',background)>contrastRatio('#000000',background)?'#ffffff':'#000000';
 for(let step=0;step<=100;step++){const candidate=mix(accent,end,step/100);if(contrastRatio(candidate,background)>=minimum)return candidate;}
 return end;
}

// Two colours mixed, so the dark instrument surface and the stage band are
// made of the same palette rather than pasted on top of it.
function mix(a,b,weight=.5){
 const parse=hex=>{const h=hex.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16));};
 const [r1,g1,b1]=parse(a),[r2,g2,b2]=parse(b);
 const channel=(x,y)=>Math.round(x+(y-x)*weight);
 return '#'+[channel(r1,r2),channel(g1,g2),channel(b1,b2)].map(v=>v.toString(16).padStart(2,'0')).join('');
}

// The console is printed in the palette: the paper, the ink, the accent the
// controls are marked in, the rule lines, and the dark instrument surfaces the
// life deck and the world band are cut from.
export const HOUSE={'--paper':'#f4f0e6','--ink':'#192e2c','--muted':'#52635b','--amber':'#f59e0b','--line':'#b4b9a9',
 '--deck':'#0a0e14','--deck-text':'#e6edf3','--deck-muted':'#9aa5ae','--deck-line':'#2a333c','--deck-accent':'#f59e0b','--accent-ink':'#875d2a'};
export function applyPalette(palette,root=typeof document!=='undefined'?document.documentElement:null){
 if(!root)return;
 const set=(name,value)=>root.style.setProperty(name,value);
 // The interface keeps one fixed set of house colours: paper, ink, one amber and the dark
 // instrument surface. A product's controls do not change colour with the story (owner,
 // 29 Oct 2026: the event-painted chrome read as a hobby project). The life's chord colours
 // the world and the stage band that frames it, where the events actually happen.
 for(const [name,value] of Object.entries(HOUSE))set(name,value);
 // The stage band frames the world in the house ink, leaning a little toward the life's sky.
 const stage=mix(HOUSE['--ink'],palette.world?.sky??HOUSE['--ink'],.12);
 set('--stage',stage);
 set('--stage-text',readableAccent(palette.paper,stage));
 set('--stage-accent',readableAccent(HOUSE['--amber'],stage));
 root.dataset.palette=palette.name;
 root.style.colorScheme='light';
}

// The palette in force. The console, the painted canvas and the 3D scene all
// read it. Painted illustrations retain their authored colour.
let current=null;
export function setPalette(palette){if(current===palette)return current;current=palette;applyPalette(palette);return current;}
export function currentPalette(){return current;}
// The world colours the 2D canvas paints with, plus its ink and paper.
export function canvasWorld(palette=current){
 if(!palette)return null;
 return {...palette.world,ink:palette.ink,paper:palette.paper,amber:palette.accent};
}
