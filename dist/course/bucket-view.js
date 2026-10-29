import {BUCKET_LIST,BUCKET_DAYS,projectedBucketEffect,bucketReason,planBucket,addCustomBucket} from './bucket-list.js';
import {choiceSymbol,choiceSymbolKey} from './choice-symbols.js';
import {t,localise} from './i18n.js';
const baht=n=>'฿'+Math.round(n).toLocaleString('en');
export function initBucketView({getState,getAge,change}){
 let query='',year=null,mode='explore',notice='';
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 function render(root){
  const s=getState(),earliest=Math.max(6,Math.floor(getAge())),latest=s.stage==='birth'?10:Math.min(80,s.age+5);
  if(year===null||year<earliest||year>latest)year=Math.min(latest,earliest);
  root.replaceChildren();root.classList.add('bucket-pane');
  const head=el('div',undefined,'bucket-tools'),search=el('input');search.type='search';search.placeholder='Search activities';search.setAttribute('aria-label','Search activities');search.value=query;
  const when=el('select');when.setAttribute('aria-label','Activity year');for(let age=earliest;age<=latest;age++){const option=el('option',t('Age {n}').replace('{n}',age));option.value=age;when.append(option);}when.value=year;
  head.append(search,when);root.append(head);
  const nav=el('nav',undefined,'bucket-tabs');nav.setAttribute('aria-label','Bucket-list views');for(const[key,label]of [['explore','Explore'],['plans','Your list'],['custom','Add your own']]){const b=el('button',label);b.type='button';b.setAttribute('aria-pressed',String(mode===key));b.onclick=()=>{mode=key;render(root);};nav.append(b);}root.append(nav);
  const all=[...(s.bucket?.planned??[]),...(s.bucket?.done??[])],days=BUCKET_DAYS-all.filter(a=>a.age===year).reduce((n,a)=>n+a.days,0);
  const status=el('p',t('{money} spendable · {n} days free at age {age}').replace('{money}',baht(s.finance?.available??0)).replace('{n}',days).replace('{age}',year),'bucket-budget');root.append(status);const rule=el('details');rule.className='bucket-rule';rule.append(el('summary','How time and effects work'),el('p','Thirty free days are available each year beyond your routine. Repeated activities have diminishing returns within a chapter. A puppy also brings ongoing care costs.'));root.append(rule);
  if(notice){const n=el('p',notice,'bucket-notice');n.setAttribute('role','status');root.append(n);}
  const body=el('div',undefined,'bucket-results');root.append(body);
  function draw(){
   body.replaceChildren();
   if(mode==='plans'){
    for(const [heading,records]of [['Planned',s.bucket?.planned??[]],['Completed',s.bucket?.done??[]]]){body.append(el('h3',heading));for(const r of records){const row=el('p',undefined,'bucket-record');row.append(el('strong',r.label),el('small',t('Age {n}').replace('{n}',r.age)+' · '+baht(r.cost)+' · '+r.days+' '+t('days')));body.append(row);}if(!records.length)body.append(el('p','Nothing here yet.'));}
    return;
   }
   if(mode==='custom'){
    const form=el('form',undefined,'bucket-custom');
    const field=(name,type,value)=>{const label=el('label',name),input=el('input');input.type=type;input.required=true;if(type==='text')input.maxLength=80;else{input.min=type==='number'&&name==='Days'?1:0;input.max=name==='Days'?30:1000000;}input.value=value;label.append(input);form.append(label);return input;};
    const title=field('Activity','text',''),cost=field('Cost in baht','number','0'),time=field('Days','number','1'),purpose=el('label','Purpose'),kind=el('select');
    for(const[k,label]of [['rest','Rest'],['learn','Learn'],['connect','Connect'],['help','Help'],['train','Train'],['make','Make']]){const o=el('option',label);o.value=k;kind.append(o);}purpose.append(kind);form.append(purpose);
    form.append(el('p','Custom activities use a small, fixed game effect for the purpose you choose.','console-note'));
    const save=el('button','Save activity');save.type='submit';form.append(save);form.onsubmit=event=>{event.preventDefault();const next=addCustomBucket(getState(),{title:title.value,cost:Number(cost.value),days:Number(time.value),kind:kind.value});if(next===getState()){notice='Check the title, cost and days.';render(root);return;}mode='explore';query=title.value;notice='Activity saved. Book it when you are ready.';change(next);};body.append(form);return;
   }
   const entries=[...Object.entries(BUCKET_LIST),...(s.bucket?.custom??[]).map(e=>[e.key,e])];let count=0;
   for(const[key,e]of entries){const text=(key+' '+(key==='puppy'?'dog pet สุนัข 반려견 개 ':key==='holiday'?'vacation travel trip ':key==='coffee'?'social meet cafe ':'')+t(e.label)+' '+e.label+' '+(e.health?t('Health'):'')+' '+(e.wellbeing?t('Mood'):'')+' '+Object.keys(e.skills).map(t).join(' ')).toLocaleLowerCase();if(query&&!text.includes(query.toLocaleLowerCase()))continue;if(!query&&e.minAge>year)continue;count++;
    const button=el('button',undefined,'bucket-action');button.type='button';const label=el('span',e.label);if(key.startsWith('custom-'))label.dataset.native='';const detail=el('small',baht(e.cost)+' · '+e.days+' '+t('days'));
    const expected=projectedBucketEffect(s,key),effects=[];if(expected.health)effects.push(t('Health')+' +'+expected.health);if(expected.wellbeing)effects.push(t('Mood')+' +'+expected.wellbeing);for(const[k,v]of Object.entries(expected.skills).filter(([,v])=>v))effects.push(t({iq:'IQ',eq:'EQ',craft:'Creativity',physique:'Physique',drive:'Drive'}[k])+' +'+v);
    detail.append(document.createTextNode(' · '+(effects.length?effects.join(' · '):t('Experience only'))));const reason=bucketReason(s,key,year);button.disabled=!!reason||year<earliest;if(reason)detail.append(document.createTextNode(' · '+t(reason)));
    button.append(choiceSymbol(choiceSymbolKey({effects:e})),label,detail);button.onclick=()=>{if(year<Math.floor(getAge())){notice='Choose a current or future year.';render(root);return;}const next=planBucket(getState(),key,year);if(next===getState())return;notice='Cost reserved. Effects enter the next life record.';change(next);};body.append(button);
   }
   if(!count)body.append(el('p','No matching activities. Try another word or add your own.'));
  }
  search.oninput=()=>{query=search.value;notice='';draw();localise(body);};when.onchange=()=>{year=Number(when.value);render(root);};draw();localise(root);
 }
 return {render};
}
