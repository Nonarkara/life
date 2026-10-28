import test from 'node:test';import assert from 'node:assert/strict';
import {releaseDeckAction,placeDeckAction} from '../../dist/course/deck-action.js';
test('the one action survives instrument rebuilds and stays beside the value on narrow screens and returns for non-plan and save-error states',()=>{
 class N{constructor(id){this.id=id;this.children=[];this.hidden=false;}append(n){if(globalThis.document?.activeElement&&n.contains(globalThis.document.activeElement))globalThis.document.activeElement=null;if(n.parentElement)n.parentElement.children=n.parentElement.children.filter(x=>x!==n);this.children.push(n);n.parentElement=this;}replaceChildren(...n){this.children.forEach(c=>c.parentElement=null);this.children=[];n.forEach(x=>this.append(x));}contains(n){return this===n||this.children.some(c=>c.contains(n));}get lastElementChild(){return this.children.at(-1);}}
 const body=new N('body'),tokens=new Set(['is-review','plan-active']);body.classList={contains:k=>tokens.has(k),toggle:(k,v)=>v?tokens.add(k):tokens.delete(k)};
 const root=new N('life-deck'),fallback=new N('fallback'),priorities=new N('priorities'),status=new N('save-status'),action=new N('commit');status.hidden=true;body.append(root);body.append(fallback);body.append(priorities);fallback.append(status);fallback.append(action);
 const all=n=>[n,...n.children.flatMap(all)],oldDocument=globalThis.document,oldMedia=globalThis.matchMedia;let wide=true;
 globalThis.document={body,activeElement:null,getElementById:id=>all(body).find(n=>n.id===id),querySelector:()=>fallback};globalThis.matchMedia=()=>({matches:wide});
 action.focus=()=>{globalThis.document.activeElement=action;};
 try{
  for(let i=0;i<3;i++){
   action.focus();releaseDeckAction(root);root.replaceChildren();const panel=new N('last-panel'),slot=new N('deck-action-slot');panel.append(slot);root.append(panel);placeDeckAction();
   assert.equal(action.parentElement,slot);assert.equal(globalThis.document.activeElement,action);assert.equal(all(body).filter(n=>n.id==='commit').length,1);assert.ok(tokens.has('deck-action-integrated'));
  }
  wide=false;placeDeckAction();assert.equal(action.parentElement,root.lastElementChild.lastElementChild);assert.equal(globalThis.document.activeElement,action);assert.ok(tokens.has('deck-action-integrated'));
  tokens.delete('plan-active');placeDeckAction();assert.equal(action.parentElement,fallback);assert.equal(globalThis.document.activeElement,action);
  tokens.add('plan-active');placeDeckAction();assert.equal(action.parentElement,root.lastElementChild.lastElementChild);
  wide=true;priorities.hidden=true;placeDeckAction();assert.equal(action.parentElement,fallback);
  priorities.hidden=false;status.hidden=false;placeDeckAction();assert.equal(action.parentElement,fallback);
  status.hidden=true;tokens.delete('is-review');placeDeckAction();assert.equal(action.parentElement,fallback);
 }finally{globalThis.document=oldDocument;globalThis.matchMedia=oldMedia;}
});
