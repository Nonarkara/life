import test from 'node:test';
import assert from 'node:assert/strict';
import {ROUTE_DATA} from '../../dist/course/route-data.js';
import {ROUTE_ENCOUNTERS} from '../../dist/course/life-routes.js';
import {phrases} from '../../dist/course/translations.js';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
const strings=ROUTE_DATA.flatMap(r=>r.scenes.flatMap(s=>[s.title,s.prompt,s.rehearse,...s.options.flatMap(o=>[o.label,o.outcome,...(o.later??[]).map(l=>l.text)])])).filter(Boolean);
test('every route line is really translated into all four languages',()=>{
 const rows=new Map(phrases.map(r=>[r[0],r]));
 for(const en of strings){const row=rows.get(en);assert.ok(row,'no translation row: '+en);
  for(let i=1;i<=4;i++){assert.ok(row[i]&&row[i]!==en,'untranslated ['+i+']: '+en);assert.ok(!row[i].includes(en.slice(0,24))||en.length<24,'placeholder ['+i+']: '+en);}}
 assert.equal(phrases.filter(r=>r.slice(1).some(x=>/^\[(แปล|翻译|翻訳|번역)\]/.test(x??''))).length,0);
});
test('route notes cite nothing that is not on the page',()=>{
 for(const en of strings)assert.doesNotMatch(en,/\[S\d|repo |needs a source/,en);
});
test('a scene dated to a real event opens only in the station that holds it, and a life outside it steps over',()=>{
 const scene=id=>ROUTE_ENCOUNTERS.find(e=>e.id===id);
 const life=(cls,sex,birthYear,route,age,flags)=>{for(let i=1;i<4000;i++){const s=begin(configureLife(newLife(i*13),{class:cls,sex,birthYear}));
   const at={...s,age,story:{...s.story,flags:{...s.story?.flags,...flags}}};if(scene('r_'+route+'_1').eligible({...at,age:scene('r_'+route+'_1').min}))return at;}assert.fail('no '+route+' life');};
 // 1997: a teacher born in 1970 is 25-30 when the baht goes; one born in 1949 is not, and still reaches the next scene.
 assert.equal(scene('r_kharatchakan_2').eligible(life('bureaucratic_class','female',1970,'kharatchakan',30,{r_kharatchakan_1:25})),true);
 const old=life('bureaucratic_class','female',1949,'kharatchakan',30,{r_kharatchakan_1:25});
 assert.equal(scene('r_kharatchakan_2').eligible(old),false);
 assert.equal(scene('r_kharatchakan_3').eligible({...old,age:35}),true);
 // 2011: the flooded estate is met at 30 by an heir born in 1981 and never by one born in 1990.
 assert.equal(scene('r_soi_compound_3').eligible(life('high_class','male',1981,'soi_compound',30,{r_soi_compound_2:25})),true);
 const young=life('high_class','male',1990,'soi_compound',25,{r_soi_compound_2:20});
 assert.equal(scene('r_soi_compound_3').eligible(young),false);
 assert.equal(scene('r_soi_compound_4').eligible({...young,age:45}),true);
 // An answer that left the route still ends it.
 assert.equal(scene('r_soi_compound_4').eligible({...life('high_class','male',1990,'soi_compound',45,{})}),false);
});
