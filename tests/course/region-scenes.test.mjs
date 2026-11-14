import test from 'node:test';
import assert from 'node:assert/strict';
import {REGION_ENCOUNTERS} from '../../dist/course/region-encounters.js';
import {REGION_PHRASES} from '../../dist/course/region-copy.js';
import {REGIONS,regionGroup} from '../../dist/course/regions.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {translate} from '../../dist/course/i18n.js';
// Every region has scenes of its own, each reaches a life born there and none reaches a life born elsewhere.
const birth=(region,cls,sex='female')=>begin(configureLife(newLife(5),{class:cls,sex,birthYear:1975,region}));
const sample={north:'lamphun',isan:'roi-et',east:'chanthaburi',west:'phetchaburi',south:'trang',central:'ayutthaya'};
test('each region has its own scenes, met only by lives born there',()=>{
 for(const [g,region] of Object.entries(sample)){
  const mine=REGION_ENCOUNTERS.filter(e=>e.id.startsWith(g+'_'));assert.ok(mine.length>=2,g);
  for(const e of mine){
   // A trade held by a share of families needs several lives to show up in.
   const fits=Object.keys(REGIONS).filter(id=>regionGroup(id)===g).some(id=>REGIONS[id].class.some(cls=>['female','male'].some(sex=>Array.from({length:30},(_,i)=>i+1).some(seed=>{const s=begin(configureLife(newLife(seed),{class:cls,sex,birthYear:1975,region:id}));if(s.birth.region!==id)return false;for(let age=e.min;age<=e.max;age++)if(e.eligible({...s,age}))return true;return false;}))));
   assert.ok(fits,e.id+' reaches a life born in '+g);
   const elsewhere=birth('khlong-toei','low_class');for(let age=e.min;age<=e.max;age++)assert.ok(!e.eligible({...elsewhere,age}),e.id+' stays out of Bangkok');
  }
 }
});
test('every line of the regional scenes is translated, and the first choice costs nothing',()=>{
 const keys=new Set(REGION_PHRASES.map(r=>r[0]));assert.ok(REGION_PHRASES.every(r=>r.length===5&&r.every(Boolean)),'five languages on every line');
 for(const e of REGION_ENCOUNTERS){assert.ok(!(e.options[0].cash<0),e.id);
  for(const text of [e.title,e.prompt,...e.options.flatMap(o=>[o.label,o.outcome])])for(const language of ['th','zh-CN','ja','ko'])assert.ok(!/[A-Za-z]{4}/.test(translate(text,language)),language+': '+text);}
});
// Review finding: a record belongs to a province, not a region. The dim sum shop is Trang's, not Yala's;
// Phetchaburi's palm sugar is not Tak's.
test('a province-specific scene stays in its province',()=>{
 const scene=id=>REGION_ENCOUNTERS.find(e=>e.id===id),meets=(id,region)=>REGIONS[region].class.some(cls=>['female','male'].some(sex=>{const s=birth(region,cls,sex);if(s.birth.region!==region)return false;const e=scene(id);for(let age=e.min;age<=e.max;age++)if(e.eligible({...s,age}))return true;return false;}));
 assert.ok(!meets('south_kopi','yala'));assert.ok(!meets('south_kopi','narathiwat'));assert.ok(!meets('west_palm','tak'));assert.ok(!meets('north_silver','lampang'));
 assert.ok(meets('south_kopi','trang'));assert.ok(meets('west_palm','phetchaburi'));
 for(const e of REGION_ENCOUNTERS){const first=e.options[0];assert.ok(!(first.cash<0)&&!(first.health<0)&&!(first.wellbeing<0),e.id+' first choice costs nothing');}
});
// Rong Kluea market opened in its present form in 1991: its scene never comes earlier.
test('the Rong Kluea scene waits for the market',()=>{
 const e=REGION_ENCOUNTERS.find(x=>x.id==='east_clothes'),at=(by,age)=>{const s=begin(configureLife(newLife(5),{class:'low_class',sex:'female',birthYear:by,region:'sa-kaeo'}));return e.eligible({...s,age});};
 assert.ok(!at(1975,15));assert.ok(at(1975,16));
});

// Damnoen Saduak's market began in 1981 and the Bang Sadet doll craft in 1976.
test('the sampan and doll scenes wait for their era',()=>{
 const ok=(id,region,cls,by,age)=>{const e=REGION_ENCOUNTERS.find(x=>x.id===id);return Array.from({length:30},(_,i)=>i+1).some(n=>{const s=begin(configureLife(newLife(n),{class:cls,sex:'female',birthYear:by,region}));return e.eligible({...s,age});});};
 assert.ok(!ok('west_sampan','ratchaburi','low_class',1970,10));assert.ok(ok('west_sampan','ratchaburi','low_class',1970,11));
 assert.ok(!ok('central_dolls','ang-thong','working_class',1955,18));assert.ok(ok('central_dolls','ang-thong','working_class',1970,12));
});
