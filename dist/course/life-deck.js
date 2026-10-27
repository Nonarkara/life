// The life console: one instrument surface, divided into labelled panels by function,
// the way a flight deck is. Every control says what it changes. The panels are
// LIFE COURSE, STATUS, SET POINTS, LIFE DIRECTION, MONEY and IKIGAI. The one action,
// living the next five years, stays on the action bar below, so it is never repeated here.
// The deck draws and calls the actions it is given; game.js keeps every rule.
const AIM_KEYS=[['balance','Balance'],['sport','Sport'],['art','Art'],['security','Security'],['connection','Connection']];
const METRICS=[['health','Health'],['wellbeing','Mood'],['worth','Wealth']];
let selected=0,metric='health';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const key=(text,label,onClick,{disabled=false,pressed=null,cls='deck-key'}={})=>{const b=el('button',cls,text);b.type='button';b.setAttribute('aria-label',label);b.disabled=disabled;if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));b.onclick=onClick;b.dataset.deck=label;return b;};
const panel=(title,cls='')=>{const p=el('section','deck-panel '+cls);p.append(el('h3','deck-placard',title));return p;};
const rows=items=>{const dl=el('dl','deck-rows');for(const [label,value] of items)dl.append(el('dt','',label),el('dd','',value));return dl;};

// Health and mood are out of 100; wealth is scaled to the life's own highest net worth.
const worthOf=f=>f?(f.available??0)+(f.reserve??0)-(f.debt??0)+Object.values(f.holdings??{}).reduce((n,h)=>n+(h.value??0),0):undefined;
// Seventeen columns, one per five years from 0 to 80, eight dots tall.
function hill(state){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 136 56');svg.setAttribute('class','deck-hill');svg.setAttribute('role','img');
 const value=r=>metric==='worth'?worthOf(r.finance):r[metric];
 const top=metric==='worth'?Math.max(1,...(state.history??[]).map(r=>value(r)??0)):100;
 const known=new Map((state.history??[]).filter(r=>value(r)!==undefined).map(r=>[r.age,Math.max(0,value(r))/top*100]));
 const now=Math.min(16,Math.floor(state.age/5));
 for(let c=0;c<17;c++){const h=known.get(c*5),on=h===undefined?0:Math.max(1,Math.round(h/12.5));
  for(let r=0;r<8;r++){const dot=document.createElementNS(svg.namespaceURI,'rect');dot.setAttribute('x',c*8+1);dot.setAttribute('y',48-r*5.5);dot.setAttribute('width',5);dot.setAttribute('height',4);dot.setAttribute('class',r<on?'on':'off');svg.append(dot);}}
 const mark=document.createElementNS(svg.namespaceURI,'path');mark.setAttribute('d',`M${now*8+1} 0h5l-2.5 3z`);mark.setAttribute('class','mark');svg.append(mark);
 svg.setAttribute('aria-label',METRICS.find(m=>m[0]===metric)[1]+' in each five-year chapter, age 0 to 80, now '+state.age);return svg;
}

export function drawDeck(root,state,args){
 const {channels,aim,setAim,notice,status,money,ikigai}=args;
 const focused=document.activeElement?.dataset?.deck;
 selected=Math.min(selected,channels.length-1);const ch=channels[selected];
 root.replaceChildren();root.className='life-deck';root.setAttribute('role','group');root.setAttribute('aria-label','Life console');
 if(notice)root.append(el('p','deck-notice',notice));

 const course=panel('Life course','deck-course');
 const show=el('div','deck-show');show.append(el('span','deck-label','Show'));
 for(const [k,label] of METRICS)show.append(key(label,'Show '+label,()=>{metric=k;drawDeck(root,state,args);},{pressed:metric===k,cls:'deck-toggle'}));
 const axis=el('div','deck-axis');for(const a of ['0','20','40','60','80'])axis.append(el('span','',a));
 course.append(hill(state),axis,show);

 const stat=panel('Status','deck-status');stat.append(rows(status));

 // SET POINTS: choose the channel, then change its value. The result is shown beside it.
 const set=panel('Set points','deck-set');
 const channel=el('div','deck-line');channel.append(el('span','deck-label','Channel'),
  key('◀','Previous channel',()=>{selected=(selected-1+channels.length)%channels.length;drawDeck(root,state,args);}),
  el('b','deck-channel',ch.label),el('span','deck-count',(selected+1)+'/'+channels.length),
  key('▶','Next channel',()=>{selected=(selected+1)%channels.length;drawDeck(root,state,args);}));
 const value=el('div','deck-line');const out=el('output','deck-value',ch.value);out.setAttribute('aria-live','polite');
 value.append(el('span','deck-label','Value'),key('−','Lower '+ch.label,()=>ch.step(-1),{disabled:!ch.can(-1)}),out,key('+','Raise '+ch.label,()=>ch.step(1),{disabled:!ch.can(1)}),el('span','deck-result',ch.detail+' '+ch.detailLabel.toLowerCase()));
 set.append(channel,value);

 const direction=panel('Life direction','deck-direction');const keys=el('div','deck-keys');
 for(const [k,label] of AIM_KEYS){const b=key(label,'Life direction: '+label,()=>setAim(k),{pressed:aim===k,cls:'deck-key deck-aim'});b.prepend(el('i','deck-light'));keys.append(b);}
 direction.append(keys);

 root.append(course,stat,set,direction);

 if(money){const m=panel('Money each month','deck-money');const bar=el('div','deck-bar');bar.setAttribute('aria-hidden','true');const total=money.bar.reduce((n,[,v])=>n+v,0)||1;
  for(const [label,v,accent] of money.bar){const seg=el('span',accent?'accent':'');seg.style.flexGrow=String(v/total);bar.append(seg);}
  m.append(bar,rows(money.items));root.append(m);}
 if(ikigai){const g=panel('Ikigai '+ikigai.score,'deck-ikigai');const list=el('div','deck-meters');
  for(const [label,v] of ikigai.parts){const row=el('div','deck-meter');const track=el('span','deck-track');const fill=el('span','deck-fill');fill.style.width=(v??0)+'%';track.append(fill);row.append(el('span','',label),track,el('b','',v===null?'—':String(v)));list.append(row);}
  g.append(list);root.append(g);}

 if(focused){const again=root.querySelector(`[data-deck="${CSS.escape(focused)}"]`);(again&&!again.disabled?again:root.querySelector('.deck-set .deck-key'))?.focus({preventScroll:true});}
}
