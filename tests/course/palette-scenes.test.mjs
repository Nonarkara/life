import test from 'node:test';import assert from 'node:assert/strict';
import {PALETTES,paletteFor,paletteCue,applyPalette,contrastRatio} from '../../dist/course/palettes.js';
import {SCENARIO_PALETTES,EVENT_PALETTES} from '../../dist/course/palette-scenes.js';
import {ENCOUNTERS,resolveEncounter,encounterById} from '../../dist/course/encounters.js';
import {PIVOTS,pendingPivots,openOptions,applyPivot} from '../../dist/course/pivots.js';
import {newLife,begin,live,validate} from '../../dist/course/sim.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {EVENT_TYPES} from '../../dist/course/events.js';

test('every scenario and event type has one or two documented combinations',()=>{
 assert.deepEqual(Object.keys(SCENARIO_PALETTES).sort(),[...ENCOUNTERS,...PIVOTS].map(s=>s.id).sort());
 assert.deepEqual(Object.keys(EVENT_PALETTES).sort(),Object.keys(EVENT_TYPES).sort());
 const plates=new Set(PALETTES.map(p=>p.plate));
 for(const rule of [...Object.values(SCENARIO_PALETTES).map(r=>r.plates),...Object.values(EVENT_PALETTES)]){assert.ok(rule.length>=1&&rule.length<=2);for(const plate of rule)assert.ok(plates.has(plate),String(plate));}
});
test('actual foreground roles remain readable in every chord',()=>{
 let oldStageFailures=0;
 for(const p of PALETTES){const tokens={},root={style:{setProperty:(k,v)=>tokens[k]=v},dataset:{}};applyPalette(p,root);
  for(const [fg,bg]of [['--ink','--paper'],['--muted','--paper'],['--deck-text','--deck'],['--deck-muted','--deck'],['--deck-accent','--deck'],['--accent-ink','--paper'],['--stage-text','--stage'],['--stage-accent','--stage']])assert.ok(contrastRatio(tokens[fg],tokens[bg])>=4.5,p.name+' '+fg+'/'+bg);
  if(contrastRatio(p.accent,tokens['--stage'])<3)oldStageFailures++;
  for(const c of p.colors)assert.ok(contrastRatio(p.ink,p.paper)>=contrastRatio(c.hex,p.paper));
 }
 assert.ok(oldStageFailures>0,'raw stage accent fails the old rule');
});
test('loss and illness are dark; marriage and recovery have brighter readings',()=>{
 for(const type of ['loss','illness','dengue','flood','fired'])assert.equal(paletteFor({age:30,history:[{age:30,events:[{type}]}]},30).mood,'difficult',type);
 assert.equal(paletteFor({age:30,history:[{age:30,events:[{type:'married'}]}]},30).mood,'bright');
 assert.equal(paletteFor({age:30,history:[{age:30,events:[{type:'recovery'}]}]},30).mood,'bright');
});
test('a cheerful opportunity cannot override a critically low condition',()=>{
 const s={age:35,health:15,wellbeing:70,history:[{age:35}],story:{pending:{id:'love',age:35}}};
 assert.equal(paletteFor(s,35).mood,'difficult');
 assert.equal(paletteCue(s,35).reason,'critical-health');
});
test('replaying an earlier age cannot reveal a future incident palette',()=>{
 const before={age:10,history:[{age:10,wellbeing:65,health:90,cash:8000}]};
 const future={...before,age:55,death:{cause:'illness'},history:[...before.history,{age:55,events:[{type:'loss'}]}],story:{pending:{id:'remember',age:55}},pivots:[{station:55,pivot:'father-tools',effects:{wellbeing:-4}}]};
 assert.equal(paletteFor(future,10),paletteFor(before,10));assert.equal(paletteCue(future,55).reason,'death');
});
test('committing a period retains the recorded question palette while travelling',()=>{
 let s=begin(newLife(31));for(const p of pendingPivots(s))s=applyPivot(s,p,openOptions(p,s)[0].id);
 const before=paletteCue(s,10),next=live(s);
 assert.equal(paletteCue(next,10.01).plate,before.plate);
 assert.equal(paletteCue(next,10.01).reason,before.reason);
 assert.equal(paletteCue(next,5).reason,'chapter:steady');
});
test('a real seeded life changes palettes through choices and incidents, without a timer',()=>{
 const walk=()=>{let s=begin(newLife(31));const sequence=[];const record=()=>sequence.push({age:s.age,...paletteCue(s,s.age)});record();
 for(let station=0;station<15&&s.stage!=='recap';station++){
  if(s.story?.pending){record();const e=encounterById(s.story.pending.id),o=e.options.find(o=>choiceAvailable(s,o));s=resolveEncounter(s,o.id,.2);record();}
  for(const p of pendingPivots(s)){const o=openOptions(p,s)[0];s=applyPivot(s,p,o.id);record();}
  const next=live(s);assert.notEqual(next,s);s=next;assert.ok(validate(s));record();
 }
 return sequence;};const sequence=walk();
 const changes=sequence.filter((cue,i)=>i&&cue.plate!==sequence[i-1].plate).length;
 assert.ok(changes>=20,'recorded changes: '+changes);
 assert.deepEqual(walk(),sequence,'same recorded life produces the same palette sequence');
});
