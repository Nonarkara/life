import test from 'node:test';import assert from 'node:assert/strict';
import {initDecisionStage} from '../../dist/course/decision-stage.js';
// Minimal DOM tree for the reparenting contract, not a layout substitute.
class Node{
 constructor(tag){this.tagName=tag;this.children=[];this.parentElement=null;this.dataset={};this.style={setProperty(){}};this.attrs={};this.open=false;this.disabled=false;this.scrollTop=0;const set=new Set();this.classList={add:x=>set.add(x),remove:x=>set.delete(x),toggle:(x,v)=>v?set.add(x):set.delete(x)};}
 get isConnected(){return this===document.body||!!this.parentElement?.isConnected;}
 remove(){const p=this.parentElement;if(p)p.children.splice(p.children.indexOf(this),1);this.parentElement=null;}
 append(...nodes){for(const n of nodes){n.remove();n.parentElement=this;this.children.push(n);}}
 replaceChildren(...nodes){for(const n of [...this.children])n.remove();this.append(...nodes);}
 before(n){const p=this.parentElement;n.remove();n.parentElement=p;p.children.splice(p.children.indexOf(this),0,n);}
 after(n){const p=this.parentElement;n.remove();n.parentElement=p;p.children.splice(p.children.indexOf(this)+1,0,n);}
 contains(node){return node===this||this.children.some(c=>c.contains(node));}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(){}
 showModal(){this.open=true;}
 close(){this.open=false;}
 focus(){document.activeElement=this;}
 querySelector(){return walk(this).find(n=>n.tagName==='button'&&!n.disabled);}
}
const walk=n=>n.children.flatMap(c=>[c,...walk(c)]);
function setup(){const old=globalThis.document;globalThis.document={body:new Node('body'),createElement:tag=>new Node(tag),createComment:()=>new Node('comment'),getElementById:id=>walk(document.body).find(n=>n.id===id)};return ()=>{globalThis.document=old;};}
test('a removed outcome receipt stays removed when the stage restores real controls',()=>{
 const cleanup=setup();try{
  const home=new Node('main'),title=new Node('h1'),receipt=new Node('section'),question=new Node('section');title.id='title';receipt.id='choice-result';question.id='questions';home.append(title,receipt,question);document.body.append(home);
  const stage=initDecisionStage({onDismiss(){}});stage.show([title,receipt],{key:'result',label:'title',result:true});
  const dialog=walk(document.body).find(n=>n.tagName==='dialog');assert.ok(dialog.contains(title));assert.ok(dialog.contains(receipt));
  receipt.remove();stage.show([question],{key:'next',label:'questions'});
  assert.equal(document.body.contains(receipt),false,'the former restore loop resurrected this removed receipt');assert.equal(title.parentElement,home);assert.ok(dialog.contains(question));
  stage.hide();assert.equal(question.parentElement,home);assert.equal(dialog.open,false);
 }finally{cleanup();}
});
test('RPG reading pages keep the same live choice nodes and reset at a new question',()=>{
 const cleanup=setup();try{
  const home=new Node('main'),questions=new Node('section'),button=new Node('button');questions.id='questions';questions.append(button);home.append(questions);document.body.append(home);
  const stage=initDecisionStage({onDismiss(){}});stage.show([questions],{key:'one',label:'questions'});const dialog=walk(document.body).find(n=>n.tagName==='dialog'),pager=dialog.children.at(-1);
  assert.equal(dialog.dataset.readingStage,'context');assert.equal(dialog.dataset.hasChoices,'true');pager.onclick();assert.equal(dialog.dataset.readingStage,'choices');assert.equal(document.activeElement,button);
  stage.show([questions],{key:'one',label:'questions'});assert.equal(dialog.dataset.readingStage,'choices');
  stage.show([questions],{key:'two',label:'questions'});assert.equal(dialog.dataset.readingStage,'context');assert.equal(questions.children[0],button);stage.hide();assert.equal(questions.parentElement,home);
 }finally{cleanup();}
});
