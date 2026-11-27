import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isSfxEnabled,setSfxEnabled,playSfx} from '../../dist/course/sfx.js';
import {CANONICAL_LIVES} from '../../dist/course/canonical-lives.js';
import {translate} from '../../dist/course/i18n.js';
import {recordAlmanac} from '../../dist/course/almanac.js';
import {newLife,configureLife,begin} from '../../dist/course/sim.js';

function memoryStorage(){
 const map=new Map();
 return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
}

test('procedural sfx respects user toggle and fails gracefully without Web Audio',()=>{
 const store=memoryStorage();
 assert.equal(isSfxEnabled(store),true);
 setSfxEnabled(false,store);
 assert.equal(isSfxEnabled(store),false);
 assert.equal(playSfx('card',{storage:store,window:{}}),false);
 setSfxEnabled(true,store);
 assert.equal(playSfx('card',{storage:store,window:{}}),false,'returns false cleanly when AudioContext is absent');
});

test('all 16 canonical Thai lives translate titles and summaries into all four languages',()=>{
 for(const c of CANONICAL_LIVES){
  for(const lang of ['th','zh-CN','ja','ko']){
   const title=translate(c.title,lang);
   const summary=translate(c.summary,lang);
   assert.notEqual(title,c.title,`canonical slot ${c.slot} title untranslated in ${lang}`);
   assert.notEqual(summary,c.summary,`canonical slot ${c.slot} summary untranslated in ${lang}`);
   if(lang==='th')assert.doesNotMatch(title,/[A-Za-z]/,`canonical slot ${c.slot} title leaked Latin in Thai: ${title}`);
  }
 }
});

test('almanac records unlocked routes and stops cleanly for compendium view',()=>{
 const store=memoryStorage();
 const life={...begin(configureLife(newLife(77),{class:'working_class',sex:'female',birthYear:1981})),stage:'recap',age:65,story:{seen:[{id:'r_luk_thung_1',choice:'stage'}]},stops:[{id:'sea_hua_hin',age:25}]};
 const alm=recordAlmanac(store,life,{score:44,noteIds:['r_luk_thung_1']});
 assert.ok(alm.routes.includes('luk_thung'));
 assert.ok(alm.stops.includes('sea_hua_hin'));
 assert.equal(alm.totalRoutes,26);
 assert.ok(alm.totalStops>=10);
});

test('PWA manifest declares standalone game categories and shortcuts',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../../dist/start/manifest.webmanifest',import.meta.url),'utf8'));
 assert.equal(manifest.display,'standalone');
 assert.ok(Array.isArray(manifest.categories)&&manifest.categories.includes('games'));
 assert.ok(Array.isArray(manifest.shortcuts)&&manifest.shortcuts.length>=3);
});
