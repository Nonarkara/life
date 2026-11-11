import {AXES,balanced,transfer,validate,CLASS_TIERS,CLASS_KEYS} from '../course/sim.js';
import {CLASS_WEIGHTS} from '../course/backgrounds.js';
import {HISTORICAL_COHORTS} from '../course/thai-history.js';
import {initSettings,t} from '../course/i18n.js';
import {REGIONS,BAND_REGIONS,CLASS_REGIONS,COUNTRIES,household} from '../course/regions.js';
import {retireClass} from '../course/save.js';
import {RUNGS,birthRung} from '../course/housing-ladder.js';
import {encodeBirth,decodeBirth,dailyLife,dayOf,birthURL,dailyDateFor} from '../course/birthcode.js';
import {drawBirth} from '../course/birth-draw.js';
import {readLives} from '../course/lives.js';
import {deliverShare,copyShare} from '../course/share-result.js';
let points=balanced(),selected='physique',shareRevision=0;const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
function node(tag,attrs,text){const el=document.createElementNS(NS,tag);for(const[key,value]of Object.entries(attrs))el.setAttribute(key,value);if(text!==undefined)el.textContent=text;return el;}
function draw(){const root=$('intake-radar');root.replaceChildren();const point=(i,value)=>{const a=-Math.PI/2+i*Math.PI*2/5;return[180+Math.cos(a)*64*value/10,135+Math.sin(a)*64*value/10]};const polygon=value=>AXES.map((a,i)=>point(i,typeof value==='number'?value:value[a.key]).join(',')).join(' ');for(const ring of [2,5,10])root.append(node('polygon',{points:polygon(ring),fill:'none',stroke:'#b4b9a9','stroke-width':1}));root.append(node('polygon',{points:polygon(points),fill:'#f59e0b','fill-opacity':.2,stroke:'#a35d00','stroke-width':2}));AXES.forEach((axis,i)=>{const edge=point(i,10),label=point(i,16);root.append(node('line',{x1:180,y1:135,x2:edge[0],y2:edge[1],stroke:'#b4b9a9'}));const group=node('g',{tabindex:0,role:'button','aria-pressed':String(selected===axis.key),'aria-label':t(axis.label)+' '+points[axis.key]+'/10'});group.append(node('rect',{x:label[0]-42,y:label[1]-18,width:84,height:42,fill:'transparent'}));group.append(node('text',{x:label[0],y:label[1],'text-anchor':'middle'},t(axis.key==='iq'?'IQ':axis.key==='eq'?'EQ':axis.label)));group.append(node('text',{x:label[0],y:label[1]+19,'text-anchor':'middle'},String(points[axis.key])));const choose=()=>{selected=axis.key;draw();root.querySelector(`[aria-pressed="true"]`)?.focus();};group.onclick=choose;group.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};root.append(group);});$('selected-points').textContent=points[selected]+' / 10';$('selected-axis').textContent=AXES.find(a=>a.key===selected).label;$('point-minus').disabled=points[selected]===0;$('point-plus').disabled=points[selected]===10;}
// The birth lottery: show the draw and its odds before the life begins.
const HOUSEHOLD_ODDS={parents:.7,grandmother:.14,grandfather:.08,mothers:.04,fathers:.04};
export function birthOdds(life,options){
 let p=1;const i=life.intake,cls=i.class;
 if(!cls){const band=BAND_REGIONS[i.upbringing];if(!['female','male','intersex'].includes(options.sex))p*=1/3;if(!BAND_REGIONS[options.upbringing])p*=1/3;if(!Object.hasOwn(COUNTRIES,options.country))p*=i.country==='th'?.75/band.length:.25/4;else if(options.country==='th')p*=1/band.length;return Math.max(1,Math.round(1/(p*(HOUSEHOLD_ODDS[life.birth.household]??1))));}
 if(!['female','male','intersex'].includes(options.sex))p*=1/3;
 if(!CLASS_KEYS.includes(options.class))p*=CLASS_WEIGHTS[cls];
 if(!options.region)p*=1/CLASS_REGIONS[cls].length;
 if(!options.raised)p*=HOUSEHOLD_ODDS[life.birth.household]??1;
 return Math.max(1,Math.round(1/p));
}
let drawn=null,lastOptions={},varied=false,previous=null;
function savedLife(){
 try{const life=retireClass(JSON.parse(localStorage.getItem('life-course-v2')));return validate(life)?life:null;}
 catch{return null;}
}
const showBirthOdds=()=>!varied&&lastOptions.birthYear!=='historical';
function card(life){
 const b=life.birth,sex={female:'Female',male:'Male',intersex:'Intersex variation'}[life.intake.sex],cls=CLASS_TIERS[life.intake.class],cohort=HISTORICAL_COHORTS[life.intake.birthYear];
 const facts=[['Place',t(b.place)],['Home',t(RUNGS[birthRung(life)].label)],['Household',t(b.home)],['Raised by',t(household(b).text)],['Body profile',t(sex)],...(cohort?[['Historical era',t(cohort.label)]]:[]),[cls?'Birth class':'Upbringing',t(cls?.label??({constrained:'Limited household resources',middle:'Middle household resources',comfortable:'Comfortable household resources'}[life.intake.upbringing]))]];
 $('birth-facts').replaceChildren(...facts.flatMap(([k,v])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=t(k);dd.textContent=v;return [dt,dd];}));
 if(cls?.note){const note=document.createElement('dd');note.className='fine';note.textContent=t(cls.note);$('birth-facts').append(note);}
 if(cohort?.note){const note=document.createElement('dd');note.className='fine';note.textContent=t(cohort.note);$('birth-facts').append(note);}
 $('birth-odds').hidden=!showBirthOdds();
 $('birth-odds').textContent=t('In this game, about 1 in {n} lives begin like this.').replace('{n}',birthOdds(life,lastOptions).toLocaleString('en'));
 shareRevision++;$('birth-shared').textContent='';$('birth-shared').hidden=true;birthManual.hidden=true;$('birth-share').disabled=false;birthCopy.disabled=false;
}
function enter(options,fresh=false){try{lastOptions=options;varied=fresh;previous=fresh?savedLife():null;drawn=drawBirth(options,{previous,varied});card(drawn);$('birth-card').showModal();$('birth-card').scrollTop=0;}catch{$('intake-error').textContent=t('Try again');}}
$('birth-begin').onclick=()=>{try{localStorage.setItem('life-course-v2',JSON.stringify(drawn));location.href='../course/';}catch{$('birth-card').close();$('intake-error').textContent='This browser could not save the session. Allow local storage, then try again.';}};
$('birth-again').onclick=()=>{try{drawn=drawBirth(lastOptions,{previous,varied});card(drawn);}catch{$('birth-shared').hidden=false;$('birth-shared').textContent=t('Try again');}};
// The link carries the whole birth (seed and conditions): whoever opens it is born into the same
// family and place with the same luck, and chooses for themselves.
export const birthLink=life=>birthURL(life);
const birthCopy=document.createElement('button');birthCopy.type='button';birthCopy.className='quiet';birthCopy.textContent=t('Copy birth link');$('birth-share').after(birthCopy);
const birthManual=document.createElement('textarea');birthManual.readOnly=true;birthManual.hidden=true;birthManual.rows=3;birthManual.setAttribute('aria-label',t('Birth text and link'));$('birth-shared').after(birthManual);
const shareBirth=async copyOnly=>{
 const action=copyOnly?birthCopy:$('birth-share'),revision=shareRevision,life=drawn;
 const payload={title:'Life2.0',url:birthLink(life),text:copyOnly?'':!showBirthOdds()?t('Same birth, your choices:'):t('In Life2.0, I was born in {place}, into {home}. About 1 in {n} game births begin like this.').replace('{place}',t(life.birth.place)).replace('{home}',t(life.birth.home)).replace('{n}',birthOdds(life,lastOptions).toLocaleString('en'))+' '+t('Same birth, your choices:')};
 if(!payload.url)return;action.disabled=true;birthManual.hidden=true;const status=$('birth-shared');status.hidden=false;status.textContent=t('Preparing share…');
 const showManual=()=>{if(revision!==shareRevision)return;birthManual.value=(payload.text+' '+payload.url).trim();birthManual.hidden=false;};
 try{const outcome=await(copyOnly?copyShare:deliverShare)(payload,navigator,{onWaiting:()=>{if(revision===shareRevision){status.textContent=t('Still waiting for sharing. You can copy the text below.');showManual();}}});
  if(revision!==shareRevision)return;status.textContent=t({copied:'Copied. Paste it anywhere.',shared:'Passed to your device’s sharing system.',cancelled:'Sharing cancelled.',manual:'Sharing was unavailable. Select and copy the text below.',unavailable:'This birth cannot be shared.'}[outcome]);if(outcome==='manual'){showManual();birthManual.focus();birthManual.select();}
 }finally{if(revision===shareRevision)action.disabled=false;}
};
$('birth-share').onclick=()=>shareBirth(false);birthCopy.onclick=()=>shareBirth(true);
function submitted(){const era=$('birth-era')?.value,home=$('birth-class').value,raised=$('raised-by').value;enter({sex:$('body-profile').value,class:home==='street'?'low_class':home,...(home==='street'?{street:true}:{}),...(raised!=='random'?{raised}:{}),birthYear:era===''?'historical':era,attributes:points});}
// The town at birth: every house open, and the label on a house is the way in.
const RUNG_CLASS=['street','low_class','working_class','middle_class','bureaucratic_class','high_class'],PIN_LABEL=['Pavement','Squat','Room','Shophouse','Yard','Villa'];
const pickDialog=$('town-pick'),pinBox=$('pick-pins');let picker=null,pins=[];
function closePick(){picker?.hide();if(pickDialog.open)pickDialog.close();}
function drawPins(){pinBox.classList.add('pick-list');pinBox.replaceChildren(...RUNG_CLASS.map((value,rung)=>({value,rung})).reverse().map(({value,rung})=>{const b=document.createElement('button');b.type='button';b.className='pin';b.dataset.rung=rung;b.textContent=t(PIN_LABEL[rung]);b.setAttribute('aria-label',t(RUNGS[rung].label));b.onclick=()=>{$('birth-class').value=value;classNote();closePick();submitted();};return b;}));pins=[...pinBox.children];}
// No positions means no 3D on this device: the labels stay as a plain list and still work.
function placePins(where){if(!where){pinBox.classList.add('pick-list');pins.forEach(b=>{b.style.left=b.style.top='';});return;}pinBox.classList.remove('pick-list');const stage=pinBox.getBoundingClientRect(),placed=[];for(const {rung,x,y} of [...where].sort((a,b)=>b.y-a.y)){const b=pins.find(p=>Number(p.dataset.rung)===rung),W=b.offsetWidth,H=b.offsetHeight,left=Math.max(W/2+4,Math.min(stage.width-W/2-4,x));let top=y;for(const o of placed)if(Math.abs(o.left-left)<(o.W+W)/2+4&&top>o.top-o.H-4&&top<o.top+H+4)top=o.top-o.H-4;placed.push({left,top,W,H});b.style.left=left+'px';b.style.top=Math.max(H+4,top)+'px';}}
$('pick-close').onclick=closePick;pickDialog.addEventListener('cancel',()=>picker?.hide());
$('see-town').onclick=async()=>{drawPins();pickDialog.showModal();try{if(!picker){const {townPicker}=await import(new URL('town-pick.js',import.meta.url).href);picker=townPicker($('pick-world'),placePins);}if(!pickDialog.open)return;const era=Number($('birth-era').value);picker.show(era||1981);}catch(error){console.warn('The 3D town could not open; showing the list.',error);placePins(null);}};
$('random-life').onclick=()=>{const year=Number($('birth-era').value);enter(year?{birthYear:year}:$('birth-era').value==='random'?{birthYear:'random'}:{},true);};$('intake-form').onsubmit=e=>{e.preventDefault();const era=$('birth-era')?.value;submitted();};$('point-minus').onclick=()=>{points=transfer(points,selected,-1);draw();};$('point-plus').onclick=()=>{points=transfer(points,selected,1);draw();};
try{const saved=retireClass(JSON.parse(localStorage.getItem('life-course-v2')));if(validate(saved)&&saved.stage!=='recap'){$('continue-life').hidden=false;$('continue-life').textContent=t('Your last life is waiting: age {n}, {place} →').replace('{n}',saved.age).replace('{place}',t(saved.birth.place));}}catch{}
function eraNote(){const era=$('birth-era')?.value,cohort=HISTORICAL_COHORTS[Number(era)];if($('era-note'))$('era-note').textContent=cohort?t(cohort.note):t('Watch Thailand transform from 1949 canals and 16mm cinema to the 1997 crisis, Skytrain and cashless 2020s streets.');}
function classNote(){const v=$('birth-class').value==='street'?'low_class':$('birth-class').value,cls=CLASS_TIERS[v];$('class-note').textContent=cls?t(cls.note):t('The condition you are born into sets family resources and pressures, not your intelligence or destiny.');$('class-regions').textContent=(CLASS_REGIONS[v]??[]).map(id=>REGIONS[id]?.place).join(' · ')||t('Any Thai region.');eraNote();}
$('birth-class').addEventListener('change',classNote);$('birth-era')?.addEventListener('change',eraNote);
// The lives already lived, each with a way to live the same birth again.
function archive(){
 const lives=readLives(localStorage),box=$('lives'),list=$('lives-list');
 box.hidden=!lives.length;if(!lives.length)return;
 $('lives-summary').textContent=t('Lives you have lived')+' · '+lives.length;
 list.replaceChildren(...lives.slice(0,6).map(e=>{
  const li=document.createElement('li'),place=document.createElement('b'),meta=document.createElement('span'),again=document.createElement('a');
  place.textContent=t(e.place);meta.textContent=t('Age {n}').replace('{n}',e.age)+(e.words?' · “'+e.words+'”':'');
  const replayBirth=decodeBirth(e.code);again.href=replayBirth?birthURL({...replayBirth,...(e.dailyDay?{dailyDay:e.dailyDay}:{})}):'?birth='+encodeURIComponent(e.code);again.textContent=t('Live this birth again');li.append(place,meta,again);return li;}));
}
// A link someone sent, or today's shared birth, opens straight onto its card.
function invited(){
 const asked=new URLSearchParams(location.search).get('birth');if(!asked){if(new URLSearchParams(location.search).get('next')==='1')enter({},true);return;}
 const daily=asked==='daily',day=dayOf(),life=daily?{...dailyLife(day),dailyDay:day}:decodeBirth(asked);
 if(life&&!daily){const claimed=new URLSearchParams(location.search).get('day');if(claimed&&dailyDateFor({...life,dailyDay:claimed}))life.dailyDay=claimed;}
 if(!life){$('intake-error').textContent=t('That birth link could not be read. Start a new life below.');return;}
 try{const them=new URLSearchParams(location.search).get('them');if(them&&/^[0-9a-z.:,-]{1,1500}$/.test(them))localStorage.setItem('life-them',JSON.stringify({code:encodeBirth(life),them}));}catch{}
 lastOptions={};drawn=life;card(life);
 $('birth-title').textContent=t(daily?'Today’s life':'A life was sent to you');
 $('birth-again').hidden=true;$('birth-card').showModal();
}
window.addEventListener('life-preferences',()=>{draw();classNote();eraNote();archive();});initSettings();draw();classNote();eraNote();archive();invited();
