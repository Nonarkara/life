// Minimalist procedural acoustic foley (CC0-1.0). Zero external audio files,
// zero network requests, respects reduced-motion and user sound preference.
const SFX_KEY='life-sfx-v1';
let ctx=null;

export function isSfxEnabled(storage=globalThis.localStorage){
 try{
  const saved=storage?.getItem(SFX_KEY);
  if(saved==='off')return false;
  if(saved==='on')return true;
 }catch{}
 return true;
}

export function setSfxEnabled(on,storage=globalThis.localStorage){
 try{storage?.setItem(SFX_KEY,on?'on':'off');}catch{}
}

function getContext(win=globalThis.window){
 const Audio=win?.AudioContext??win?.webkitAudioContext;
 if(!Audio)return null;
 if(!ctx||ctx.state==='closed'){
  try{ctx=new Audio();}catch{return null;}
 }
 if(ctx.state==='suspended'){ctx.resume().catch(()=>{});}
 return ctx;
}

function tone(c,freq,start,dur,gainPeak,type='triangle'){
 const osc=c.createOscillator(),g=c.createGain();
 osc.type=type;
 osc.frequency.setValueAtTime(freq,start);
 g.gain.setValueAtTime(0.0001,start);
 g.gain.linearRampToValueAtTime(gainPeak,start+0.008);
 g.gain.exponentialRampToValueAtTime(0.0001,start+dur);
 osc.connect(g);g.connect(c.destination);
 osc.start(start);osc.stop(start+dur+0.01);
}

function paperBrush(c,start,dur=0.055,peak=0.035){
 const len=Math.max(64,Math.floor(c.sampleRate*dur));
 const buf=c.createBuffer(1,len,c.sampleRate),ch=buf.getChannelData(0);
 let last=0;
 for(let i=0;i<len;i++){
  const white=Math.random()*2-1;
  last=(last+0.08*white)/1.08;
  const env=Math.sin(Math.PI*i/len);
  ch[i]=last*env*3.2;
 }
 const src=c.createBufferSource(),flt=c.createBiquadFilter(),g=c.createGain();
 flt.type='bandpass';flt.frequency.value=1450;flt.Q.value=1.2;
 g.gain.value=peak;
 src.buffer=buf;src.connect(flt);flt.connect(g);g.connect(c.destination);
 src.start(start);
}

export function playSfx(kind,{window:win=globalThis.window,document:doc=globalThis.document,storage=globalThis.localStorage}={}){
 if(!isSfxEnabled(storage)||doc?.hidden)return false;
 const c=getContext(win);
 if(!c)return false;
 const now=c.currentTime;
 try{
  if(kind==='card'){
   paperBrush(c,now,0.06,0.04);
   tone(c,392,now+0.015,0.075,0.032,'triangle');
  }else if(kind==='choose'){
   tone(c,523.25,now,0.055,0.03,'sine');
   tone(c,659.25,now+0.018,0.065,0.022,'triangle');
  }else if(kind==='advance'){
   paperBrush(c,now,0.045,0.025);
   tone(c,440,now,0.11,0.032,'triangle');
   tone(c,659.25,now+0.055,0.16,0.028,'sine');
  }else if(kind==='shock'){
   tone(c,196,now,0.26,0.042,'triangle');
   tone(c,293.66,now+0.04,0.28,0.026,'sine');
  }else if(kind==='ending'){
   tone(c,261.63,now,0.55,0.035,'sine');
   tone(c,329.63,now+0.08,0.55,0.03,'sine');
   tone(c,392.00,now+0.16,0.65,0.028,'triangle');
  }else{
   return false;
  }
  return true;
 }catch{return false;}
}
