import {openRouteView} from '../course/route-view.js';
// Explicit visual fixtures; this module never reads or writes the saved life.
import {newLife,begin,AXES,transfer} from '../course/sim.js';
import {openFinance,setBudget} from '../course/finance.js';
import {deckFinance,deckBaht} from '../course/deck-model.js';
import {drawDeck} from '../course/life-deck.js';
import {initConsole} from '../course/console.js';
import {initPersonalConsole} from '../course/personal-console.js';
import {drawWorld} from '../course/world.js';
import {initSettings} from '../course/i18n.js';
import {setPalette,paletteFor} from '../course/palettes.js';
const $=id=>document.getElementById(id),pick=document.createElement('select');
pick.setAttribute('aria-label','Review life');
for(const [value,label]of [['10','Review: childhood · 10'],['55','Review: adult · 55'],['route','Review: moves and events · 55'],['flood','Review: flood · 30'],['married','Review: marriage · 35'],['loss','Review: bereavement · 55'],['recovery','Review: recovery · 45']]){const option=document.createElement('option');option.value=value;option.textContent=label;pick.append(option);}
const reviewHeader=document.querySelector('header');reviewHeader.style.flexWrap='wrap';pick.style.maxWidth='100%';pick.style.minWidth='0';pick.style.fontSize='calc(12px * var(--reading-scale))';pick.style.padding='2px 18px 2px 0';reviewHeader.append(pick);
document.body.classList.remove('loading');document.body.classList.add('is-review');$('load-state').remove();
let state;
function fixture(age,moves=false){
 let s={...begin(newLife(17)),age,pathway:age>=20?'work':'school',stage:'review',intake:{sex:'female'},health:72,wellbeing:68,original:{physique:2,iq:2,eq:2,craft:2,drive:2}};
 if(age>=15){s=openFinance(s);s.finance={...s.finance,available:15000,reserve:40000};}
 s.history=[0,10,15,20,25,30,35,40,45,50,55].filter(a=>a<=age).map(a=>({age:a,from:Math.max(0,a-5),pathway:a<20?'school':'work',effort:{...s.effort},profile:{...s.profile},health:90-a*.3,wellbeing:60+a*.1,cash:18000,...(a>=15?{finance:{...s.finance}}:{})}));
 if(moves){
  const itinerary=[['bang-na',20],['tokyo',30],['london',40],[s.birth.region,50]];
  for(const row of s.history)if(row.age>=20){const [region,regionSince]=itinerary.filter(([,since])=>since<=row.age).at(-1);row.finance={...row.finance,region,regionSince};}
  s.finance={...s.finance,region:s.birth.region,regionSince:50};
  for(const [age,event]of [[25,'Leaving school'],[40,'Floodwater damages the family home.'],[55,'Work slows']])s.history.find(row=>row.age===age).event=event;
 }
 return s;
}
state=fixture(10);
const consoleUI=initConsole({getState:()=>state,change:s=>{state=s;render();}}),personal=initPersonalConsole({getState:()=>state});
const deck=document.createElement('div');deck.id='life-deck';$('priorities').replaceChildren(deck);
$('editor').hidden=false;$('birth-info').hidden=true;$('save-status').hidden=true;$('commit').hidden=false;$('commit').textContent='Live 5 years →';$('commit').title='Read-only visual fixture; no life advances.';
$('tab-priorities').onclick=()=>{};
function render(){
 setPalette(paletteFor(state,state.age));
 $('age').textContent='Age '+state.age;$('location').textContent='Review fixture';
 const money=deckFinance(state),status=[['Health',state.health+' / 100'],['Mood',state.wellbeing+' / 100']];
 if(money)status.push(['Cash runway',money.runway+' months'],['Funds held',deckBaht(money.holdings)],['Debt',deckBaht(money.debt)]);
 const channels=AXES.map(a=>({label:a.key==='iq'?'IQ':a.key==='eq'?'EQ':a.label,value:String(state.effort[a.key]),detail:'+2',detailLabel:'By age '+(state.age+5),can:d=>transfer(state.effort,a.key,d)!==state.effort,step:d=>{state={...state,effort:transfer(state.effort,a.key,d)};render();}}));
 if(money)for(const [key,label]of [['save','Save'],['fun','Fun'],['learn','Learn']])channels.push({label,value:state.finance.budget[key]+'%',detail:deckBaht(money[{save:'saved',fun:'fun',learn:'learn'}[key]]),detailLabel:'per month',can:d=>setBudget(state,{...state.finance.budget,[key]:state.finance.budget[key]+5*d})!==state,step:d=>{state=setBudget(state,{...state.finance.budget,[key]:state.finance.budget[key]+5*d});render();}});
 drawDeck(deck,state,{channels,status,money,aim:state.profile.aim,setAim:aim=>{state={...state,profile:{...state.profile,aim}};render();},ikigai:state.age>=15?{score:60,parts:[['Love',65],['Good at',70],['Gives',45],['Sustains',60]]}:null});
 consoleUI.render();personal.render();requestAnimationFrame(()=>drawWorld($('world'),state,state.age,25,'world',{animating:false}));$('scene-caption').textContent=drawWorld($('world'),state,state.age,25,'world',{animating:false})?.caption??'Review fixture';
}
$('overview').hidden=false;$('overview').textContent='Life course';$('overview').onclick=()=>openRouteView(state,{trigger:$('overview')});
pick.onchange=()=>{const ages={flood:30,married:35,loss:55,recovery:45};state=fixture(ages[pick.value]??(pick.value==='route'?55:Number(pick.value)),pick.value==='route');if(ages[pick.value])state.history.at(-1).events=[{type:pick.value}];render();};window.addEventListener('resize',render);window.addEventListener('life-stage-art',render);window.addEventListener('life-preferences',render);initSettings();render();
