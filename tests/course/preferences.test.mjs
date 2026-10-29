import test from 'node:test';
import assert from 'node:assert/strict';

// i18n.js reads the stored preference when it loads, so each case imports a fresh copy.
let n=0;
async function fresh(stored){
  let saved=null;
  globalThis.localStorage={getItem:()=>stored,setItem:(_k,v)=>{saved=v;}};
  const module=await import('../../dist/course/i18n.js?preferences='+(++n));
  const result={module,saved:()=>saved};
  delete globalThis.localStorage;
  return result;
}

test('the painted world is the default, and an old stored hybrid was the default, not a choice',async()=>{
  assert.equal((await fresh(null)).module.preferences.stage,'painted');
  assert.equal((await fresh(JSON.stringify({stage:'hybrid'}))).module.preferences.stage,'painted','a stored hybrid without the v:2 mark moves to painted');
});

test('a player who chooses Hybrid or Isometric keeps it',async()=>{
  assert.equal((await fresh(JSON.stringify({stage:'hybrid',v:2}))).module.preferences.stage,'hybrid');
  assert.equal((await fresh(JSON.stringify({stage:'isometric'}))).module.preferences.stage,'isometric');
});

test('choosing a world in Settings is stored with the mark, so it survives the next load',async()=>{
  const {module,saved}=await fresh(null);
  globalThis.localStorage={getItem:()=>null,setItem:(_k,v)=>{globalThis.__stored=v;}};
  try{module.applyPreferences({stage:'hybrid'});}catch{/* localise() needs a page; the preference is stored before it runs */}
  delete globalThis.localStorage;
  const stored=JSON.parse(globalThis.__stored);
  assert.equal(stored.stage,'hybrid');assert.equal(stored.v,2);
  assert.equal(module.preferences.stage,'hybrid','Hybrid is a real choice, not coerced to painted');
  void saved;
});
