import {THAI_ENCOUNTERS} from '../course/thai-encounters.js';
import {thaiStudyLife} from './thai-life-state.js';
import {renderEncounterChoices} from '../course/encounter-view.js';
import {resolveEncounter} from '../course/encounters.js';
import {initDecisionStage} from '../course/decision-stage.js';
import {drawWorld} from '../course/world.js';
import {initConsole} from '../course/console.js';
import {initPersonalConsole} from '../course/personal-console.js';
import {initSettings,localise,t} from '../course/i18n.js';
import {setPalette,paletteFor} from '../course/palettes.js';
const $=id=>document.getElementById(id),pick=document.createElement('select');pick.setAttribute('aria-label','Review Thai decision');
for(const e of THAI_ENCOUNTERS){const o=document.createElement('option');o.value=e.id;o.textContent=e.title;pick.append(o);}
const header=document.querySelector('header');header.append(pick);pick.style.cssText='font:inherit;font-size:12px;max-width:40vw';
document.body.classList.remove('loading');document.body.classList.add('is-review');$('load-state').remove();$('reset').hidden=true;$('transport').hidden=true;
let state,scene,result=false;
const consoleUI=initConsole({getState:()=>state,change:next=>{state=next;render();}}),personal=initPersonalConsole({getState:()=>state});
const stage=initDecisionStage({onDismiss:()=>{}});
function render(){
 if(document.getElementById('settings-dialog')?.open)return;
 document.body.classList.add('is-review');$('age').textContent=t('Age {n}').replace('{n}',state.age);$('location').textContent=state.birth.place;
 $('scene-caption').textContent='Study · no saved life is read or changed';setPalette(paletteFor(state,state.age));
 $('title').textContent=scene.title;$('narrative').textContent=scene.prompt;$('narrative').hidden=false;$('encounter').hidden=false;
 consoleUI.render();personal.render();drawWorld($('world'),state,state.age,49,'world',{animating:false});
 if(result){showReceipt();return;}
 renderEncounterChoices($('encounter'),state,scene,{onChoose:choice=>{
  const next=resolveEncounter(state,choice.id,.2);if(next===state)return;state=next;result=true;
  showReceipt();
 }});
 stage.show([$ ('title'),$('narrative'),$('encounter')],{key:scene.id,label:'title',scenario:scene,result});localise();
}
function showReceipt(){
 const record=state.story.seen.at(-1),choice=scene.options.find(o=>o.id===record.choice);
 $('title').textContent=choice.label;$('narrative').textContent=record.outcome;$('encounter').replaceChildren();
 const again=document.createElement('button');again.textContent='Continue →';again.onclick=()=>load();$('encounter').append(again);
 stage.show([$ ('title'),$('narrative'),$('encounter')],{key:'result:'+scene.id,label:'title',scenario:scene,result:true});localise();
}
$('commit').textContent='Open decision';$('commit').onclick=render;

function load(){stage.hide();scene=THAI_ENCOUNTERS.find(e=>e.id===pick.value);state=thaiStudyLife(scene.id);result=false;render();}
pick.onchange=load;window.addEventListener('resize',()=>drawWorld($('world'),state,state.age,49,'world',{animating:false}));window.addEventListener('life-stage-art',()=>drawWorld($('world'),state,state.age,49,'world',{animating:false}));window.addEventListener('life-preferences',render);initSettings();document.getElementById('settings-dialog').addEventListener('close',render);load();
