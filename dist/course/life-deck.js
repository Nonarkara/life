// The life console, laid out like a treadmill deck that people already know how to use.
// Program keys on either side choose a life direction. The display shows the life course
// as a dot-matrix hill (health in each five-year chapter), with health and net worth
// beside it and three large readouts below. On the round pad, ◀ ▶ choose a channel,
// ▲ ▼ change it, and the centre key lives the next five years.
// The deck draws and calls the actions it is given; game.js keeps every rule.
const AIM_KEYS=[['balance','Balance'],['sport','Sport'],['art','Art'],['security','Security'],['connection','Connection']];
let selected=0;
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const key=(text,label,onClick,{disabled=false,pressed=null,cls='deck-key'}={})=>{const b=el('button',cls,text);b.type='button';b.setAttribute('aria-label',label);b.disabled=disabled;if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));b.onclick=onClick;b.dataset.deck=label;return b;};

// Seventeen columns, one per five years from 0 to 80; eight dots tall, lit up to the health recorded then.
function hill(state){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 136 52');svg.setAttribute('class','deck-hill');svg.setAttribute('role','img');
 const rows=new Map((state.history??[]).map(r=>[r.age,r.health]));let lit=0;
 for(let c=0;c<17;c++){const age=c*5,h=rows.get(age),on=h===undefined?0:Math.max(1,Math.round(h/12.5));if(h!==undefined)lit=c;
  for(let r=0;r<8;r++){const dot=document.createElementNS(svg.namespaceURI,'rect');dot.setAttribute('x',c*8+1);dot.setAttribute('y',44-r*5.5);dot.setAttribute('width',5);dot.setAttribute('height',4);dot.setAttribute('class',r<on?'on':'off');svg.append(dot);}}
 const mark=document.createElementNS(svg.namespaceURI,'path');mark.setAttribute('d',`M${lit*8+1} 0h5l-2.5 3z`);mark.setAttribute('class','mark');svg.append(mark);
 svg.setAttribute('aria-label','Health in each five-year chapter, up to age '+state.age);return svg;
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
 const rightKeys=side(AIM_KEYS.slice(3));if(waiting)rightKeys.append(key('Questions · '+waiting,'Questions · '+waiting,openQuestions));
 controls.append(side(AIM_KEYS.slice(0,3)),pad,rightKeys);
 root.append(screen,controls);
 if(focused){const again=root.querySelector(`[data-deck="${CSS.escape(focused)}"]`);(again&&!again.disabled?again:root.querySelector('.deck-go'))?.focus({preventScroll:true});}
}
