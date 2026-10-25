import {drawScene3D} from './scene3d.js';
import {drawWorld} from './world.js';
import {recordedCommute} from './biography.js';
import {routine,routineContext} from './routines.js';
import {initSettings,t,preferences} from './i18n.js';
const canvas=document.getElementById('study-world'),ageInput=document.getElementById('study-age'),branch=document.getElementById('study-branch'),moment=document.getElementById('study-time'),toggle=document.getElementById('study-motion');
let running=false,time=1,last=0,dirty=true;
// Explicit authored fixtures. This route never reads/writes the game's save key.
function fixture(age){const city=branch.value==='city',finance={housing:city?'far':'family',workplace:city?'city':'local',locationSince:25,purchases:[{age:20,key:'book'}]};return {age,stage:'review',health:85,wellbeing:65,cash:18000,finance,profiles:[{profile:{aim:'balance'}}],history:[{age:0,health:90,wellbeing:65,cash:18000},{age:15,from:10,pathway:'school',health:90,wellbeing:68,cash:18000},...(age>=25?[{age:35,from:25,pathway:'work',finance,health:85,wellbeing:65,cash:18000}]:[])],story:{seen:[],flags:{}}};}
function paint(){const age=Number(ageInput.value),state=fixture(age),activity=routine('player',age,time,'balance',routineContext(state,age));canvas.setAttribute('aria-label',t('Age {n}'.replace('{n}',age))+': '+t(activity.action));if(!drawScene3D(canvas,state,age,time,'world',{homeFrame:true}))drawWorld(canvas,state,age,time,'world');document.getElementById('study-note').textContent=age<6?t('Your family home'):age<20?t('The red school case stays with you when you move.'):t(branch.value==='city'?'Your rental home':'Family home')+' · '+t(activity.action)+' · '+t('Commute: {value} min / day'.replace('{value}',recordedCommute(state,age,'work')));}
for(const input of [ageInput,branch,moment])input.onchange=()=>{time=Number(moment.value);running=false;toggle.setAttribute('aria-pressed','false');dirty=true;};
const stop=()=>{running=false;toggle.setAttribute('aria-pressed','false');};
toggle.onclick=()=>{if(preferences.motion||matchMedia('(prefers-reduced-motion: reduce)').matches){stop();return;}running=!running;toggle.setAttribute('aria-pressed',String(running));};
window.addEventListener('resize',()=>dirty=true);window.addEventListener('life-preferences',()=>{stop();dirty=true;});window.addEventListener('life-fonts-loaded',()=>dirty=true);window.addEventListener('life-settings-open',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
initSettings();function tick(now){const dt=last?Math.min(.1,(now-last)/1000):0;last=now;if(running){time+=dt;dirty=true;}if(dirty){paint();dirty=false;}requestAnimationFrame(tick);}requestAnimationFrame(tick);
