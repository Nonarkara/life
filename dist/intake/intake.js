import {AXES,balanced,transfer,newLife,configureLife,validate} from '../course/sim.js';
import {initSettings,t} from '../course/i18n.js';
import {BAND_REGIONS,REGIONS,COUNTRIES,household} from '../course/regions.js';
let points=balanced(),selected='physique';const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
function node(tag,attrs,text){const el=document.createElementNS(NS,tag);for(const[key,value]of Object.entries(attrs))el.setAttribute(key,value);if(text!==undefined)el.textContent=text;return el;}
function draw(){const root=$('intake-radar');root.replaceChildren();const point=(i,value)=>{const a=-Math.PI/2+i*Math.PI*2/5;return[180+Math.cos(a)*64*value/10,135+Math.sin(a)*64*value/10]};const polygon=value=>AXES.map((a,i)=>point(i,typeof value==='number'?value:value[a.key]).join(',')).join(' ');for(const ring of [2,5,10])root.append(node('polygon',{points:polygon(ring),fill:'none',stroke:'#b4b9a9','stroke-width':1}));root.append(node('polygon',{points:polygon(points),fill:'#f59e0b','fill-opacity':.2,stroke:'#a35d00','stroke-width':2}));AXES.forEach((axis,i)=>{const edge=point(i,10),label=point(i,16);root.append(node('line',{x1:180,y1:135,x2:edge[0],y2:edge[1],stroke:'#b4b9a9'}));const group=node('g',{tabindex:0,role:'button','aria-pressed':String(selected===axis.key),'aria-label':t(axis.label)+' '+points[axis.key]+'/10'});group.append(node('rect',{x:label[0]-42,y:label[1]-18,width:84,height:42,fill:'transparent'}));group.append(node('text',{x:label[0],y:label[1],'text-anchor':'middle'},t(axis.key==='iq'?'IQ':axis.key==='eq'?'EQ':axis.label)));group.append(node('text',{x:label[0],y:label[1]+19,'text-anchor':'middle'},String(points[axis.key])));const choose=()=>{selected=axis.key;draw();root.querySelector(`[aria-pressed="true"]`)?.focus();};group.onclick=choose;group.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};root.append(group);});$('selected-points').textContent=points[selected]+' / 10';$('selected-axis').textContent=AXES.find(a=>a.key===selected).label;$('point-minus').disabled=points[selected]===0;$('point-plus').disabled=points[selected]===10;}
// The birth lottery: show the draw and its odds before the life begins.
const HOUSEHOLD_ODDS={parents:.7,grandmother:.14,grandfather:.08,mothers:.04,fathers:.04};
export function birthOdds(life,options){
 let p=1;const i=life.intake,band=BAND_REGIONS[i.upbringing];
 if(!['female','male','intersex'].includes(options.sex))p*=1/3;
 if(!BAND_REGIONS[options.upbringing])p*=1/3;
 if(!Object.hasOwn(COUNTRIES,options.country))p*=i.country==='th'?.75*(1/band.length):.25/4;else if(options.country==='th')p*=1/band.length;
 p*=HOUSEHOLD_ODDS[life.birth.household]??1;
 return Math.max(1,Math.round(1/p));
}
let drawn=null,lastOptions={};
function draw_life(options){const seed=Math.floor(Math.random()*2147483646)+1;const life=configureLife(newLife(seed),options);if(!validate(life))throw Error('Invalid starting conditions');return life;}
function card(life){
 const b=life.birth,sex={female:'Female',male:'Male',intersex:'Intersex variation'}[life.intake.sex],band={constrained:'Limited household resources',middle:'Middle household resources',comfortable:'Comfortable household resources'}[life.intake.upbringing];
 const facts=[['Place',t(b.place)],['Household',t(b.home)],['Raised by',t(household(b).text)],['Body profile',t(sex)],['Upbringing',t(band)]];
 $('birth-facts').replaceChildren(...facts.flatMap(([k,v])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=t(k);dd.textContent=v;return [dt,dd];}));
 $('birth-odds').textContent=t('In this game, about 1 in {n} lives begin like this.').replace('{n}',birthOdds(life,lastOptions).toLocaleString('en'));
 $('birth-shared').textContent='';
}
function enter(options){try{lastOptions=options;drawn=draw_life(options);card(drawn);$('birth-card').showModal();}catch{$('intake-error').textContent='This browser could not save the session. Allow local storage, then try again.';}}
$('birth-begin').onclick=()=>{try{localStorage.setItem('life-course-v2',JSON.stringify(drawn));location.href='../course/';}catch{$('birth-card').close();$('intake-error').textContent='This browser could not save the session. Allow local storage, then try again.';}};
$('birth-again').onclick=()=>{drawn=draw_life(lastOptions);card(drawn);};
$('birth-share').onclick=async()=>{const text=t('I was born in {place}, into {home}. About 1 in {n} lives begin like this.').replace('{place}',t(drawn.birth.place)).replace('{home}',t(drawn.birth.home)).replace('{n}',birthOdds(drawn,lastOptions).toLocaleString('en'))+' life.nonarkara.org';try{if(navigator.share){await navigator.share({title:'Life2.0',text,url:'https://life.nonarkara.org/'});}else{await navigator.clipboard.writeText(text);$('birth-shared').textContent=t('Copied. Paste it anywhere.');}}catch{}};
$('random-life').onclick=()=>enter({});$('intake-form').onsubmit=e=>{e.preventDefault();enter({sex:$('body-profile').value,upbringing:$('upbringing').value,country:$('country').value,attributes:points});};$('point-minus').onclick=()=>{points=transfer(points,selected,-1);draw();};$('point-plus').onclick=()=>{points=transfer(points,selected,1);draw();};
try{const saved=JSON.parse(localStorage.getItem('life-course-v2'));if(validate(saved)&&saved.stage!=='recap'){$('continue-life').hidden=false;$('continue-life').textContent=t('Your last life is waiting: age {n}, {place} →').replace('{n}',saved.age).replace('{place}',t(saved.birth.place));}}catch{}
// Name the real birthplaces behind each upbringing, so the choice means something.
function band(){const v=$('upbringing').value,ids=BAND_REGIONS[v];$('band-note').textContent=ids?t('Born in')+': '+ids.map(id=>t(REGIONS[id].place)).join(' · '):t('Sets family support, school and where you are born.');}
$('upbringing').addEventListener('change',band);
window.addEventListener('life-preferences',()=>{draw();band();});initSettings();draw();band();
