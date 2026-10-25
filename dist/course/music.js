// Life: Small Hours. Original score/synthesis dedicated to CC0-1.0.
// No samples, network requests, game-clock changes or autoplay.
const KEY='life-music-v1';
const moods={steady:[48,55,60,64],bright:[48,55,62,67],difficult:[45,52,60,64]};
export function createScore({sampleRate=22050,mood='steady'}={}){
 if(!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>96000)throw new RangeError('Invalid audio sample rate');
 const seconds=32,data=new Float32Array(sampleRate*seconds),chord=moods[mood]??moods.steady;
 // Eight spacious phrases; common intervals, newly authored sequence and timbre.
 const melody=[12,7,4,9,7,2,4,0];
 function note(midi,start,length,level,pad=false){
  const hz=440*2**((midi-69)/12),first=Math.floor(start*sampleRate),count=Math.floor(length*sampleRate);
  for(let n=0;n<count&&first+n<data.length;n++){
   const t=n/sampleRate,fade=Math.min(1,t/(pad?.7:.035),(length-t)/(pad?.9:.8));
   const tone=Math.sin(2*Math.PI*hz*t)+.15*Math.sin(2*Math.PI*hz*2*t);
   data[first+n]+=tone*level*Math.max(0,fade)*(pad?1:Math.exp(-t*1.15));
  }
 }
 for(let p=0;p<8;p++){
  for(const midi of chord)note(midi+(p>=4?2:0),p*4,3.9,.018,true);
  note(chord[0]+melody[p]+12,p*4+.65,2.7,.055);
 }
 // Silence at the wrap avoids discontinuity without an audio scheduling timer.
 for(let i=0;i<data.length;i++)data[i]*=Math.min(1,i/(sampleRate*.05),(data.length-1-i)/(sampleRate*.05));
 return {data,sampleRate,seconds};
}

export function initMusic({getMood=()=> 'steady',mount,document:doc=globalThis.document,window:win=globalThis.window,storage}={}){
 if(!doc)return null;
 const button=doc.createElement('button');button.type='button';button.id='music-toggle';
 const Audio=win?.AudioContext??win?.webkitAudioContext;
 let context=null,source=null,gain=null,playing=false,destroyed=false,busy=false,currentMood=null,preferred=false;
 try{storage??=globalThis.localStorage;preferred=storage?.getItem(KEY)==='on';}catch{/* Storage can be unavailable in a private browser. */}
 function label(text){button.textContent=text;button.setAttribute('aria-label',text);button.setAttribute('aria-pressed',String(playing));}
 function remember(value){preferred=value;try{storage?.setItem(KEY,value?'on':'off');}catch{/* Audio still works without persistence. */}}
 function stop(){if(source){source.stop();source.disconnect();source=null;}}
 function load(){
  const mood=getMood();if(source&&mood===currentMood)return;
  stop();const score=createScore({mood}),buffer=context.createBuffer(1,score.data.length,score.sampleRate);buffer.copyToChannel(score.data,0);
  source=context.createBufferSource();source.buffer=buffer;source.loop=true;source.connect(gain);source.start();currentMood=mood;
 }
 async function mute({persist=true}={}){
  playing=false;if(persist)remember(false);label(Audio?'Music':'Music unavailable');
  if(gain)gain.gain.setValueAtTime(0,context.currentTime);
  if(context&&context.state!=='closed')try{await context.suspend();}catch{/* Browser interruption already silences the context. */}
 }
 async function toggle(){
  if(destroyed||busy||!Audio)return;
  if(playing){await mute();return;}
  busy=true;
  try{
   // This function is called only by the button's click/user gesture.
   if(!context){context=new Audio();gain=context.createGain();gain.gain.value=0;gain.connect(context.destination);}
   await context.resume();
   if(destroyed||doc.hidden){await mute({persist:false});return;}
   load();gain.gain.setValueAtTime(0,context.currentTime);gain.gain.linearRampToValueAtTime(.7,context.currentTime+.3);
   playing=true;remember(true);label('Mute');
  }catch{playing=false;label('Music unavailable');}
  finally{busy=false;}
 }
 const hidden=()=>{if(doc.hidden)void mute({persist:false});};
 button.addEventListener('click',toggle);doc.addEventListener('visibilitychange',hidden);
 label(Audio?'Music':'Music unavailable');button.disabled=!Audio;
 (mount??doc.querySelector('header>div'))?.append(button);
 return {
  button,get playing(){return playing;},get preferred(){return preferred;},mute,
  updateMood(){if(playing&&!doc.hidden)load();},
  async destroy(){destroyed=true;button.removeEventListener('click',toggle);doc.removeEventListener('visibilitychange',hidden);await mute({persist:false});stop();if(context&&context.state!=='closed')try{await context.close();}catch{/* No further audio is scheduled. */}button.remove();}
 };
}
