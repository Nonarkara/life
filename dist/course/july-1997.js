import {julyDemoURL} from './july-demo-link.js';
import {initSettings,preferences,selectedLanguageReady,t} from './i18n.js';

const households={
 clerk:{
  name:'Ratana · finance clerk',place:'Bangkok · middle-income household',
  question:'Tell your mother the salary has stopped?',
  scene:'Your finance company suspends operations. At home your mother is measuring the space for the sewing machine you promised her.',
  choices:[
   ['Tell her tonight','By December the corner holds her borrowed machine. She hems a school uniform while you fill in another job application.'],
   ['Keep the promise on credit','By December the machine sits unopened while you look for work. Your mother finally asks why you never let her help choose.']
  ],
  note:'Finance-company closures interrupted salaries as well as investment. A salary loss and a household loan could land together.'
 },
 worker:{
  name:'Prasert · construction worker',place:'Samut Prakan · wage-earning household',
  question:'Wait for your wages or go home?',
  scene:'Work stops on the building site. Your foreman says there may be wages next Friday. Your brother is at the bus station with enough money for one ticket.',
  choices:[
   ['Stay and collect what the crew is owed','By December you have recovered one week’s pay. Your brother leaves your place at dinner empty until you come home.'],
   ['Take the ticket and go home','By December you are cutting rice beside your brother. A letter from the crew arrives. No one has seen the foreman.']
  ],
  note:'Property lending and construction were connected. When financing dried up, workers could lose both their next shift and wages they had already earned.'
 },
 shop:{
  name:'Malee · shopkeeper',place:'Khon Kaen · shop-owning household',
  question:'Keep extending credit to your neighbours?',
  scene:'Your supplier wants cash now. A neighbour who came back from Bangkok puts rice and cooking oil on the counter and asks you to add them to her tab.',
  choices:[
   ['Put it on the tab','By December your stock is down to half a shelf. Your neighbour comes in to settle part of her tab with a sack of rice and asks which shelf to put it on.'],
   ['Ask for cash','By December the shop is still open. Your neighbour buys rice elsewhere. She still waves, but she does it from the far side of the lane.']
  ],
  note:'The crisis travelled through employers, workers and suppliers. A household far from the financial district could feel it through business credit and lost wages.'
 }
};
const root=document.querySelector('#july-story');
let household=null,answer=null;
function element(tag,text){
 const node=document.createElement(tag);
 node.textContent=t(text);
 return node;
}
function button(label,action){
 const node=element('button',label);
 node.type='button';
 node.onclick=()=>{action();render(true);};
 return node;
}
function render(focus=false){
 const current=household&&households[household];
 const title=element('h1',current?(answer===null?current.question:'December 1997'):'July 1997');
 if(current)title.className='july-question';
 const copy=element('p',current?(answer===null?current.scene:current.choices[answer][1]):'Play three Thai households through the same crisis.');
 const actions=document.createElement('div');actions.className='july-actions';
 if(!current){
  const start=element('a','Play the Yaowarat episode →');
  start.className='july-start';
  start.href=julyDemoURL('/course/',preferences.language);
  copy.textContent=t('A finance job pays more. Your family needs you at home.');
  root.replaceChildren(title,copy,start,element('h2','Three short stories'));
  actions.append(...Object.entries(households).map(([id,home])=>{
   const choose=button(home.name,()=>{household=id;answer=null;});
   choose.className='july-story-choice';
   choose.replaceChildren(element('strong',home.name),element('small',home.place));
   return choose;
  }));
 }else if(answer===null){
  actions.append(...current.choices.map(([choice],i)=>button(choice,()=>{answer=i;})));
  actions.append(button('Choose another household',()=>{household=null;}));
 }else{
  actions.append(button('Choose again',()=>{answer=null;}),button('Choose another household',()=>{household=null;answer=null;}));
 }
 const place=current?element('p',current.name):null;
 if(place)place.className='july-person';
 if(current)root.replaceChildren(place,title,copy,actions);else root.append(actions);
 if(current&&answer!==null){
  const note=document.createElement('aside');
  note.append(element('h3','What happened in Thailand'),element('p',current.note));
  root.append(note);
 }
 if(focus){title.tabIndex=-1;title.focus();}
}
initSettings();
window.addEventListener('life-preferences',()=>render());
window.addEventListener('life-language-ready',()=>render());
await selectedLanguageReady().catch(()=>{});
render();
