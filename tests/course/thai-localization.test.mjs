import test from 'node:test';
import assert from 'node:assert/strict';
import {REGIONS} from '../../dist/course/regions.js';
import {translate,preferences} from '../../dist/course/i18n.js';
import {familyRecord,familyGuardians} from '../../dist/course/family-record.js';
import {newLife,configureLife} from '../../dist/course/sim.js';

test('every Thailand province birthplace and regional household translates cleanly into all four languages',()=>{
 for(const [id,region] of Object.entries(REGIONS)){
  if(region.country!=='TH')continue;
  for(const lang of ['th','zh-CN','ja','ko']){
   const place=translate(region.place,lang);
   assert.notEqual(place,region.place,`${id}.place "${region.place}" untranslated in ${lang}`);
   if(lang==='th')assert.doesNotMatch(place,/[A-Za-z]/,`${id}.place leaked Latin in Thai: ${place}`);
   if(region.home){
    const home=translate(region.home,lang);
    assert.notEqual(home,region.home,`${id}.home "${region.home}" untranslated in ${lang}`);
    if(lang==='th')assert.doesNotMatch(home,/[A-Za-z]/,`${id}.home leaked Latin in Thai: ${home}`);
   }
  }
 }
});

test('Thai family record uses Thai-script names and gender-matched occupations',()=>{
 const prevLang=preferences.language;
 try{
  preferences.language='th';
  for(let seed=1;seed<=30;seed++){
   const life=configureLife(newLife(seed),{class:'low_class',sex:'female',birthYear:1985});
   for(const g of familyGuardians(life)){
    if(g.role==='father')assert.notEqual(g.job,'seamstress','father should roll tailor, not seamstress');
   }
   const rec=familyRecord(life);
   assert.ok(/[\u0E00-\u0E7F]/.test(rec.guardians),`guardians should contain Thai script: ${rec.guardians}`);
   assert.doesNotMatch(rec.guardians,/[A-Za-z]/,`Thai guardians should not leak Latin names: ${rec.guardians}`);
   assert.doesNotMatch(rec.siblingsText,/[A-Za-z]/,`Thai siblings should not leak Latin names: ${rec.siblingsText}`);
  }
 }finally{
  preferences.language=prevLang;
 }
});
