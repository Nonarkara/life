import test from 'node:test';
import assert from 'node:assert/strict';
import {resetProfileFields} from '../../dist/course/profile-editor.js';
import {PALETTES,applyPalette,contrastRatio,paletteFor} from '../../dist/course/palettes.js';
import {translate} from '../../dist/course/i18n.js';

test('repeated profile rebuilds preserve comparison, radar and disclosure state',()=>{
 class Node{constructor(){this.children=[];}prepend(n){this.children.unshift(n);}replaceChildren(...nodes){this.children=nodes;}querySelector(id){return this.children.find(n=>'#'+n.id===id)??null;}}
 const before=globalThis.document;globalThis.document={createElement:()=>new Node()};
 try{
  const editor=new Node(),comparison={id:'shape-comparison',open:true,radar:{id:'radar'}};editor.children.push(comparison);
  const fields=resetProfileFields(editor);fields.children.push({id:'profile-aim'});
  assert.equal(resetProfileFields(editor),fields);assert.equal(fields.children.length,0);
  assert.equal(editor.children.length,2);assert.equal(editor.querySelector('#shape-comparison'),comparison);assert.equal(comparison.open,true);assert.equal(comparison.radar.id,'radar');
 }finally{globalThis.document=before;}
});
test('every system-selected chord has readable UI accent text while preserving world colours',()=>{
 let oldFailure=0;
 for(const p of PALETTES){
  const tokens={},root={style:{setProperty:(k,v)=>tokens[k]=v},dataset:{}};applyPalette(p,root);
  assert.ok(contrastRatio(tokens['--deck-accent'],tokens['--deck'])>=4.5,p.name+' deck gain/focus');
  assert.ok(contrastRatio(tokens['--accent-ink'],tokens['--paper'])>=4.5,p.name+' settings selection');
  assert.equal(tokens['--amber'],'#f59e0b','one house amber in every chord');
  if(contrastRatio(p.accent,tokens['--deck'])<4.5)oldFailure++;
  assert.equal(paletteFor({},50,'difficult',p.name),paletteFor({},50,'difficult'),'old pin cannot override life');
 }
 assert.ok(oldFailure>0,'the inherited accent must fail the contrast gate');
 assert.equal(paletteFor({},15,'bright','not-a-palette'),paletteFor({},15,'bright','auto'));
});
test('palette settings explanation and controls have native copy',()=>{
 for(const lang of ['th','zh-CN','ja','ko']){const text='Colours follow the events and mood of this life. Painted illustrations retain their authored colours.';assert.notEqual(translate(text,lang),text,lang+': '+text);}
});

test('world exposure shows whole-chapter money and styles negative returns without printing class names',async()=>{
 const {renderWorldNow}=await import('../../dist/course/economy-view.js');
 const {newLife}=await import('../../dist/course/sim.js');
 class Node{constructor(tag){this.tag=tag;this.children=[];this.style={};this.attrs={};this.classList={add:n=>this.className=n};}append(...n){this.children.push(...n);}replaceChildren(...n){this.children=n;}setAttribute(k,v){this.attrs[k]=v;}}
 const before=globalThis.document;globalThis.document={createElement:tag=>new Node(tag),createElementNS:(_,tag)=>new Node(tag)};
 const all=n=>[n,...n.children.flatMap(all)];
 try{
  let negatives=0;
  for(let age=15;age<=80;age+=5){
   const root=new Node('div'),s={...newLife(17),age,history:[{age,economy:{from:age-5,to:age,incomeAdjustment:53749,marketChange:37942,contractions:[]}}]};
   renderWorldNow(root,s);const nodes=all(root),text=nodes.map(n=>n.textContent??'').join(' ');
   assert.ok(text.includes('Totals for ages '+(age-5)+'–'+age));assert.ok(text.includes('+฿53,749'));assert.ok(!text.includes('/ month'));assert.ok(!nodes.some(n=>n.textContent==='negative'));
   negatives+=nodes.filter(n=>n.tag==='i'&&n.className==='negative').length;
  }
  assert.ok(negatives>0,'negative actual scenario observations must be styled');
 }finally{globalThis.document=before;}
});
