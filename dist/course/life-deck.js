import {releaseDeckAction,placeDeckAction} from './deck-action.js';
import {deckInfo} from './deck-info.js';
import {t} from './i18n.js';
import {deckHistory,deckBaht} from './deck-model.js';
// The life console: one instrument surface, divided into labelled panels by function,
// the way a flight deck is. Every control says what it changes. The panels are
// LIFE COURSE, STATUS, SET POINTS, LIFE DIRECTION, MONEY and IKIGAI. The one action,
// living the next five years, stays beside the selected value on wide screens.
// The deck draws and calls the actions it is given; game.js keeps every rule.
const AIM_KEYS=[['balance','Balance'],['sport','Sport'],['art','Art'],['security','Security'],['connection','Connection']];
const METRICS=[['health','Health'],['wellbeing','Mood'],['worth','Wealth']];
let selected=0,metric='health';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e;};
const key=(text,label,onClick,{disabled=false,pressed=null,cls='deck-key'}={})=>{const b=el('button',cls,text);b.type='button';b.setAttribute('aria-label',label);b.disabled=disabled;if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));b.onclick=onClick;b.dataset.deck=label;return b;};
const panel=(title,cls='')=>{const p=el('section','deck-panel '+cls);p.append(el('h3','deck-placard',title));return p;};
const rows=items=>{const dl=el('dl','deck-rows');for(const [label,value] of items)dl.append(el('dt','',label),el('dd','',value));return dl;};

// Recorded chapters only; absent chapters are not invented zeroes or future dots.
function hill(state){
 const data=deckHistory(state,metric),svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 136 56');svg.setAttribute('class','deck-hill');svg.setAttribute('role','img');
 const count=Math.floor(data.age/5)+1,spacing=136/count,known=new Map(data.records.map(r=>[r.age,r.value]));
 for(let c=0;c<count;c++){
  const value=known.get(c*5),group=document.createElementNS(svg.namespaceURI,'g');
  if(value!==undefined){const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=t('Age {n}').replace('{n}',c*5)+': '+(metric==='worth'?deckBaht(value):Number(value.toFixed(1))+' / 100');group.append(title);}
  for(let r=0;r<8;r++){
   const threshold=data.min+(r+.5)/8*data.span;
   const active=value!==undefined&&(value>=0?threshold>=0&&threshold<=value:threshold<0&&threshold>=value);
   const dot=document.createElementNS(svg.namespaceURI,'rect');dot.setAttribute('x',c*spacing+1);dot.setAttribute('y',48-r*5.5);dot.setAttribute('width',Math.min(5,spacing-2));dot.setAttribute('height',4);dot.setAttribute('rx','1.2');
   dot.setAttribute('class',active?(value<0?'on negative':'on'):'off');group.append(dot);
  }
  svg.append(group);
 }
 if(data.min<0){
  const baseline=document.createElementNS(svg.namespaceURI,'line'),y=50-((0-data.min)/data.span*8-.5)*5.5;
  baseline.setAttribute('x1','0');baseline.setAttribute('x2','136');baseline.setAttribute('y1',y);baseline.setAttribute('y2',y);baseline.setAttribute('stroke','var(--deck-muted)');baseline.setAttribute('stroke-width','.6');svg.append(baseline);
 }
 const exact=data.records.map(r=>t('Age {n}').replace('{n}',r.age)+': '+(metric==='worth'?deckBaht(r.value):Number(r.value.toFixed(1))+' / 100')).join('; ');
 svg.setAttribute('aria-label',t(METRICS.find(m=>m[0]===metric)[1])+'. '+exact);
 return {svg,data,exact};
}

export function arrangeDeck(root){
 if(!root)return;
 const names=['set','direction','status','course','money','ikigai'];
 const focused=root.contains?.(document.activeElement)?document.activeElement:null;
 root.append(...names.map(name=>root.querySelector('.deck-'+name)).filter(Boolean));
 focused?.focus({preventScroll:true});
}

export function drawDeck(root,state,args){
 const {channels,aim,setAim,notice,status,money,ikigai,projection,eraLabels={},aimDescription}=args;
 const focused=document.activeElement?.dataset?.deck;
 selected=Math.min(selected,channels.length-1);const ch=channels[selected];
 releaseDeckAction(root);root.replaceChildren();root.className='life-deck';root.setAttribute('role','group');root.setAttribute('aria-label','Life console');
 if(notice)root.append(el('p','deck-notice',notice));

 const course=panel('Life course','deck-course');
 const show=el('div','deck-show');show.setAttribute('role','group');show.setAttribute('aria-label','Life course');
 for(const [k,label] of METRICS)show.append(key(label,'Show '+label,()=>{metric=k;drawDeck(root,state,args);},{pressed:metric===k,cls:'deck-toggle'}));
 const chart=hill(state),axis=el('div','deck-axis');axis.append(el('span','',t('Age {n}').replace('{n}',0)),el('span','',t('Age {n}').replace('{n}',state.age)));
 const scale=el('p','deck-note',metric==='worth'?deckBaht(chart.data.min)+' — '+deckBaht(chart.data.max):'0–100 · eight display bands');
 course.append(chart.svg,axis,show,scale,deckInfo('Recorded values',[chart.exact||t('No recorded values yet.'),'The graphs join five-year snapshots. Markers sit at the recorded review age, not an exact event date.']));

 const stat=panel('Status','deck-status');stat.append(rows(status));
 if(status.some(([label])=>label==='Cash runway'))stat.append(deckInfo('Cash runway',['Cash + reserve ÷ current essentials. Funds excluded.']));

 // SET POINTS: choose the channel, then change its value. The result is shown beside it.
 const set=panel('Set points','deck-set');
 const strip=el('div','deck-strip');strip.setAttribute('role','group');strip.setAttribute('aria-label','Channels');
 channels.forEach((c,idx)=>{
  const chip=el('button','deck-chip'+(idx===selected?' active':''));
  chip.type='button';chip.dataset.deck='Channel '+idx;chip.setAttribute('aria-pressed',String(idx===selected));
  chip.setAttribute('aria-label',c.label+': '+c.value);
  chip.append(el('span','deck-chip-name',c.label),el('b','deck-chip-val',c.value));
  chip.onclick=()=>{selected=idx;drawDeck(root,state,args);};
  strip.append(chip);
 });
 const value=el('div','deck-points');const out=el('output','deck-value',ch.value);out.setAttribute('aria-live','polite');
 const stepper=el('div','deck-stepper');
 stepper.append(key('−','Lower '+ch.label+' by '+(ch.stepAmount??1),()=>ch.step(-1),{disabled:!ch.can(-1)}),out,key('+','Raise '+ch.label+' by '+(ch.stepAmount??1),()=>ch.step(1),{disabled:!ch.can(1)}));
 const valueLabel=el('div','deck-value-label');valueLabel.append(el('b','deck-channel',ch.label),el('span','deck-label',String(ch.value).includes('%')?'Budget %':'Points /10'));
 value.append(valueLabel,stepper,el('span','deck-result',ch.detail+' '+t(ch.detailLabel)));
 const method=['Authored scenario estimate, not a real-life prediction. Includes study budget and scheduled consequences; new choices can change it.',String(ch.value).includes('%')?'Allocations must fit within 100%.':'± transfers a point to or from your largest other priority.'];
 if(projection)method.push(t('Age multipliers')+': '+Object.entries(projection.eraWeights).map(([k,v])=>t(eraLabels[k]??k)+' ×'+v).join(' · '));
 set.append(strip,value,deckInfo('How this projection works',method));
 if(ch.minimum!==undefined)set.append(el('p','deck-note',t('Minimum {n} from your choices').replace('{n}',ch.minimum)));

 const direction=panel('Life direction','deck-direction');const keys=el('div','deck-keys');
 for(const [k,label] of AIM_KEYS){const b=key(label,'Life direction: '+label,()=>setAim(k),{pressed:aim===k,cls:'deck-key deck-aim'});b.prepend(el('i','deck-light'));keys.append(b);}
 direction.append(keys,deckInfo('Life direction',[aimDescription??'','Direction affects wellbeing in this model.']));

 root.append(course,stat,set,direction);

 if(money){const m=panel('Monthly plan','deck-money');m.append(el('p','deck-note','Current plan · baht / month'));const bar=el('div','deck-bar');bar.setAttribute('aria-hidden','true');const total=money.bar.reduce((n,[,v])=>n+v,0)||1;
  for(const [label,v,accent] of money.bar){const seg=el('span',accent?'accent':'');seg.style.flexGrow=String(v/total);bar.append(seg);}
  m.append(bar,rows(money.items));root.append(m);}
 if(ikigai){const g=panel('Ikigai '+ikigai.score,'deck-ikigai');const list=el('div','deck-meters');
  for(const [label,v] of ikigai.parts){const row=el('div','deck-meter');const line=el('div','deck-meter-line');line.append(el('span','',label),el('b','',v===null?'—':String(v)));const track=el('span','deck-track');const fill=el('span','deck-fill');fill.style.width=(v??0)+'%';track.append(fill);row.append(line,track);list.append(row);}
  g.append(list,el('p','deck-index-label','Game index'),deckInfo('About Ikigai in this game',['Authored game indices · not a psychological test.']));root.append(g);}

 arrangeDeck(root);const slot=el('div','deck-action-slot');slot.id='deck-action-slot';value.append(slot);placeDeckAction();
 if(focused){const again=root.querySelector(`[data-deck="${CSS.escape(focused)}"]`);(again&&!again.disabled?again:root.querySelector('.deck-set .deck-key'))?.focus({preventScroll:true});}
}
