// The life console, laid out like a treadmill deck that people already know how to use.
// Program keys on either side choose a life direction. The display shows the life course
// as a dot-matrix hill (health in each five-year chapter), with health and net worth
// beside it and three large readouts below. On the round pad, ◀ ▶ choose a channel,
// ▲ ▼ change it, and the centre key lives the next five years.
// The deck draws and calls the actions it is given; game.js keeps every rule.
const AIM_KEYS=[['balance','Balance'],['sport','Sport'],['art','Art'],['security','Security'],['connection','Connection']];
let selected=0,metric='health';
const METRICS=[['health','Health'],['wellbeing','Mood'],['worth','Wealth']];
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const key=(text,label,onClick,{disabled=false,pressed=null,cls='deck-key'}={})=>{const b=el('button',cls,text);b.type='button';b.setAttribute('aria-label',label);b.disabled=disabled;if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));b.onclick=onClick;b.dataset.deck=label;return b;};

// Seventeen columns, one per five years from 0 to 80; eight dots tall, lit up to the health recorded then.
// Health and mood are out of 100; wealth is scaled to the life's own highest net worth.
const worthOf=f=>f?(f.available??0)+(f.reserve??0)-(f.debt??0)+Object.values(f.holdings??{}).reduce((n,h)=>n+(h.value??0),0):undefined;
function hill(state){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 136 52');svg.setAttribute('class','deck-hill');svg.setAttribute('role','img');
 const value=r=>metric==='worth'?worthOf(r.finance):r[metric];
 const top=metric==='worth'?Math.max(1,...(state.history??[]).map(r=>value(r)??0)):100;
 const rows=new Map((state.history??[]).filter(r=>value(r)!==undefined).map(r=>[r.age,Math.max(0,value(r))/top*100]));let lit=0;
 for(let c=0;c<17;c++){const age=c*5,h=rows.get(age),on=h===undefined?0:Math.max(1,Math.round(h/12.5));if(rows.has(age)||age<=state.age)lit=age<=state.age?c:lit;
  for(let r=0;r<8;r++){const dot=document.createElementNS(svg.namespaceURI,'rect');dot.setAttribute('x',c*8+1);dot.setAttribute('y',44-r*5.5);dot.setAttribute('width',5);dot.setAttribute('height',4);dot.setAttribute('class',r<on?'on':'off');svg.append(dot);}}
 const mark=document.createElementNS(svg.namespaceURI,'path');mark.setAttribute('d',`M${lit*8+1} 0h5l-2.5 3z`);mark.setAttribute('class','mark');svg.append(mark);
 svg.setAttribute('aria-label',METRICS.find(m=>m[0]===metric)[1]+' in each five-year chapter, up to age '+state.age);return svg;
}

export function drawDeck(root,state,args){
 const {channels,aim,setAim,commit,program,ready,health,worth,openQuestions,waiting}=args;
 const focused=document.activeElement?.dataset?.deck;
 selected=Math.min(selected,channels.length-1);const ch=channels[selected];
 root.replaceChildren();root.className='life-deck';root.setAttribute('role','group');root.setAttribute('aria-label','Life console');
 const screen=el('div','deck-screen');
 screen.append(el('p','deck-program',program));
 const middle=el('div','deck-middle');
 const left=el('div','deck-inset');left.append(el('b','',String(Math.round(health))),el('small','','Health'));
 const right=el('div','deck-inset');right.append(el('b','',worth),el('small','','Net worth'));
 middle.append(left,hill(state),right);screen.append(middle);
 const metrics=el('div','deck-metrics');for(const [k,label] of METRICS)metrics.append(key(label,'Graph '+label,()=>{metric=k;drawDeck(root,state,args);},{pressed:metric===k,cls:'deck-metric'}));screen.append(metrics);
 const readouts=el('div','deck-readouts');readouts.setAttribute('aria-live','polite');
 for(const [value,label] of [[ch.value,ch.label],[String(state.age),'Age'],[ch.detail,ch.detailLabel]]){const r=el('div','deck-readout');r.append(el('b','',value),el('small','',label));readouts.append(r);}
 screen.append(readouts);
 const controls=el('div','deck-controls');
 const side=keys=>{const col=el('div','deck-side');for(const [k,label] of keys)col.append(key(label,label,()=>setAim(k),{pressed:aim===k}));return col;};
 const pad=el('div','deck-pad');
 pad.append(
  key('▲','Raise '+ch.label,()=>ch.step(1),{disabled:!ch.can(1),cls:'deck-arrow up'}),
  key('◀','Previous channel',()=>{selected=(selected-1+channels.length)%channels.length;drawDeck(root,state,args);},{cls:'deck-arrow left'}),
  key('▶',ready?'Live the next five years':program,commit,{cls:'deck-go'}),
  key('▶','Next channel',()=>{selected=(selected+1)%channels.length;drawDeck(root,state,args);},{cls:'deck-arrow right'}),
  key('▼','Lower '+ch.label,()=>ch.step(-1),{disabled:!ch.can(-1),cls:'deck-arrow down'}));
 // Waiting questions already have the action bar and the display line; a third key would repeat them.
 const rightKeys=side(AIM_KEYS.slice(3));
 controls.append(side(AIM_KEYS.slice(0,3)),pad,rightKeys);
 // The instruments: what the display has no room for, laid out as gauges people can read at a glance.
 const instruments=el('div','deck-instruments');
 for(const g of args.instruments??[]){const box=el('section','deck-gauge');box.append(el('h3','',g.title));
  if(g.bar){const bar=el('div','deck-bar');bar.setAttribute('role','img');bar.setAttribute('aria-label',g.bar.map(([l,v])=>l+' '+v).join(', '));const total=g.bar.reduce((n,[,v])=>n+v,0)||1;for(const [label,v,accent] of g.bar){const seg=el('span',accent?'accent':'');seg.style.flexGrow=String(v/total);seg.title=label;bar.append(seg);}box.append(bar);const legend=el('p','deck-legend');legend.textContent=g.bar.map(([l,v])=>l+' '+g.format(v)).join(' · ');box.append(legend);}
  const dl=el('dl');for(const [label,value] of g.items??[]){dl.append(el('dt','',label),el('dd','',value));}box.append(dl);instruments.append(box);}
 root.append(screen,controls,instruments);
 if(focused){const again=root.querySelector(`[data-deck="${CSS.escape(focused)}"]`);(again&&!again.disabled?again:root.querySelector('.deck-go'))?.focus({preventScroll:true});}
}
