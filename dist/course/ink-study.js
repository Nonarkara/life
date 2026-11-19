import {createInkActor} from './ink-gait.js';
import {createInkSequence,inkIdentity,inkToe} from './ink-sequence.js';
import {initSettings,preferences,t} from './i18n.js';
const $=id=>document.getElementById(id),ns='http://www.w3.org/2000/svg',person=inkIdentity({seed:31415,sex:'female'}),actor=createInkActor(person);
const make=(tag,attrs,parent)=>{const n=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);parent.append(n);return n;};
const asset=p=>{const u=new URL(p,import.meta.url);u.search=new URL(import.meta.url).search;return u.href;},ink=$('ink-yard'),painted=$('painted-yard');
for(const svg of [ink,painted])make('image',{href:asset('anime/plates/school.webp'),width:1760,height:747},svg);
const old=make('image',{},painted),contacts=make('g',{visibility:'hidden'},ink),floor=747*.86;
ink.insertBefore(actor.root,contacts);
make('path',{d:`M400 ${floor}H1000`,stroke:'#253e36','stroke-width':1,fill:'none'},contacts);
const dots=[0,1].map(()=>make('circle',{r:3,fill:'#a35d00'},contacts));
let ready=false;
let age=10,sequence=createInkSequence({age,profile:person}),time=0,playing=false,raf=0,last=null,action=null;
const reduced=()=>preferences.motion||matchMedia('(prefers-reduced-motion: reduce)').matches;
const images={child:{walk:'child-run.webp',stand:'child-stand.webp'},adult:{walk:'player-a-walk-a.webp',stand:'player-a-stand-a.webp'}};
function render(){
 const frame=sequence.sample(time),h=frame.ground-(frame.ankleY-(frame.shape.thigh+frame.shape.shin)*.983-frame.shape.torso-12-frame.shape.head),target=747*.38*(age<13?.78:460/400),scale=target/h,origin=500,dx=origin+(frame.x-40)*scale;
 actor.root.setAttribute('transform',`translate(${dx} ${floor-120*scale}) scale(${scale})`);actor.update(frame);
 for(let i=0;i<2;i++){const toe=inkToe(frame,i);dots[i].setAttribute('cx',origin+(toe[0]-40)*scale);dots[i].setAttribute('cy',floor+(toe[1]-120)*scale);}
 const kind=age<13?'child':'adult',pose=frame.action==='walk'?'walk':'stand',height=747*.38*(age<13?.78*(pose==='walk'?390/400:1):460/400),width=height*(kind==='child'?(pose==='walk'?279/390:137/400):(pose==='walk'?203/460:130/460));
 const oldSource=asset('anime/sprites/'+images[kind][pose]);if(old.getAttribute('href')!==oldSource)old.setAttribute('href',oldSource);old.setAttribute('x',origin+frame.x*scale-width/2);old.setAttribute('y',floor-height);old.setAttribute('width',width);old.setAttribute('height',height);old.setAttribute('preserveAspectRatio','xMidYMax meet');
 $('study-time').max=sequence.duration;$('study-time').value=time;$('study-seconds').textContent=time.toFixed(1)+' s';
 if(action!==frame.action){action=frame.action;$('study-phase').textContent=t({walk:'Walk in',turn:'Turn toward the reader',wave:'Wave',finished:'Finished'}[action]);}
}
function stop(){playing=false;last=null;cancelAnimationFrame(raf);raf=0;$('study-play').textContent=t('Play');}
function tick(now){if(!playing||document.hidden||reduced()){stop();return;}if(last!==null)time=Math.min(sequence.duration,time+Math.min(.05,(now-last)/1000));last=now;render();if(time>=sequence.duration){stop();return;}raf=requestAnimationFrame(tick);}
function play(){if(reduced()||!ready)return;if(time>=sequence.duration)time=0;playing=true;last=null;$('study-play').textContent=t('Pause');raf=requestAnimationFrame(tick);}
function seek(next){stop();time=Math.max(0,Math.min(sequence.duration,Number(next)||0));render();}
function setAge(next){stop();age=Number(next)===35?35:10;sequence=createInkSequence({age,profile:person});time=0;action=null;$('study-age').value=age;render();}
$('study-play').onclick=()=>playing?stop():play();$('study-reset').onclick=()=>{seek(0);play();};$('study-time').oninput=e=>seek(e.target.value);$('study-age').onchange=e=>setAge(e.target.value);
$('study-compare').checked=innerWidth>=800;$('painted-panel').hidden=!$('study-compare').checked;$('study-compare').onchange=e=>{stop();$('painted-panel').hidden=!e.target.checked;};$('study-contacts').onchange=e=>{stop();contacts.setAttribute('visibility',e.target.checked?'visible':'hidden');};
const settings=()=>{stop();$('study-reduced').hidden=!reduced();$('study-play').disabled=reduced()||!ready;$('study-reset').disabled=reduced()||!ready;action=null;render();};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);window.addEventListener('life-settings-open',stop);window.addEventListener('life-preferences',settings);matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',settings);
initSettings();settings();
const background=new Image();background.onload=()=>{ready=true;ink.dataset.ready='true';settings();};background.onerror=()=>{stop();$('study-error').textContent=t('The schoolyard image could not load.');};background.src=asset('anime/plates/school.webp');
// Read-only study controls for deterministic captures and contact/performance probes.
globalThis.inkStudy={seek,setAge,get time(){return time;},get playing(){return playing;},get frame(){return actor.frame;},get sequence(){return sequence;},get actor(){return actor;}};
