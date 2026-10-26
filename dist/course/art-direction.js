import * as T from 'three';
// Palette/data/colors.json plate241: Red Orange / Dark Medici Blue /
// Pale Lemon Yellow / Isabella Color. These are screen reconstructions, not ink.
export const SOI_CHORD={plaster:'#d9c9a6',light:'#f5e4b4',shutter:'#55777c',wood:'#a38354',case:'#bd5038',ink:'#30494e'};
const roles=new Map([
 ['#c3b79e',SOI_CHORD.plaster],['#e5d9b9',SOI_CHORD.plaster],['#d7caab','#b8bca9'],
 ['#657974',SOI_CHORD.shutter],['#566f6b',SOI_CHORD.shutter],['#6c7d77',SOI_CHORD.shutter],
 ['#78918a','#73918d'],['#829a92','#73918d'],['#985c46',SOI_CHORD.case],
 ['#a99773',SOI_CHORD.wood],['#dbcfad',SOI_CHORD.plaster],['#c8bda1',SOI_CHORD.plaster],
 ['#e7dfcc',SOI_CHORD.light],['#eee7d6',SOI_CHORD.light],['#8f8f7c','#839494']
]);
let ramp;
export function lightRamp(){
 // Two hard bands, like a painted cel: light and one shadow, nothing in between.
 if(!ramp){ramp=new T.DataTexture(new Uint8Array([156,156,156,255,255,255,255,255]),2,1,T.RGBAFormat);ramp.minFilter=T.NearestFilter;ramp.magFilter=T.NearestFilter;ramp.generateMipmaps=false;ramp.needsUpdate=true;}
 return ramp;
}
// People are drawn; the world is a quieter painted set behind them. World colours
// lean toward the paper tone so the moving figures carry the eye.
const PAPER=new T.Color('#efe7d2');
// A painted brush grain: soft directional strokes that make a flat cel colour feel
// laid down by hand. Values stay near white, so the colour itself never shifts much.
let grain;
export function paintGrain(){
 if(grain||typeof document==='undefined')return grain;
 const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,128,128);
 let seed=7;const r=()=>(seed=(seed*16807)%2147483647)/2147483647;
 for(let i=0;i<260;i++){const x=r()*128,y=r()*128,l=6+r()*16,a=-.5+r()*.3;g.strokeStyle=`rgba(40,40,40,${.035+r()*.05})`;g.lineWidth=1+r()*2.2;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}
 grain=new T.CanvasTexture(c);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(2,2);grain.colorSpace=T.SRGBColorSpace;return grain;
}
// Wada combination 300 (Palette data): Grenadine Pink, Cream Yellow, Turquoise Green,
// Calamine Blue. The world is pulled toward it, so it reads light and whimsical and
// stays quieter than the drawn people moving through it.
export const WORLD_CHORD=['#f48067','#fdbf68','#b5decc','#78cdd0'].map(h=>new T.Color(h));
export function tint(color,amount=.32){const hsl={};color.getHSL(hsl);let best=WORLD_CHORD[0],d=1e9;for(const c of WORLD_CHORD){const o={};c.getHSL(o);const dh=Math.min(Math.abs(o.h-hsl.h),1-Math.abs(o.h-hsl.h));const k=dh*3+Math.abs(o.l-hsl.l);if(k<d){d=k;best=c;}}color.lerp(best,hsl.s<.08?amount*.35:amount).lerp(PAPER,.12);return color;}
export function illustratedMaterial(color,{character=false}={}){const chosen=roles.get(color)??color;if(character)return new T.MeshToonMaterial({color:chosen,gradientMap:lightRamp(),map:paintGrain()??null});const m=new T.MeshLambertMaterial({color:chosen});tint(m.color);return m;}
// An ink line around a drawn figure: the back faces of each part, pushed out along
// their normals and filled flat. It reads as a 2D outline at any camera angle.
const INK=new T.MeshBasicMaterial({color:'#2a2622',side:T.BackSide});
INK.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed += normal * 0.03;');};
export function inkOutline(root){const parts=[];root.traverse(o=>{if(o.isMesh&&!o.userData.ink)parts.push(o);});for(const o of parts){const line=new T.Mesh(o.geometry,INK);line.userData.ink=true;line.castShadow=false;line.receiveShadow=false;o.add(line);}}

// Drawn faces, painted onto the head itself: a wrap-around texture whose front (u=0.25 on a
// three.js sphere) carries the features, so a face still reads in profile. White ground,
// so the skin colour multiplies through untouched. One texture per expression.
const faces=new Map();
export function faceTexture(expression='calm',{lashes=false,elder=false}={}){
 const key=[expression,lashes,elder].join('/');if(faces.has(key))return faces.get(key);if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,512,256);g.lineCap='round';g.lineJoin='round';
 const X=128,ink='#2a2622';
 g.fillStyle='rgba(244,128,103,.42)';for(const dx of [-40,40]){g.beginPath();g.ellipse(X+dx,146,13,8,0,0,Math.PI*2);g.fill();}
 g.fillStyle=ink;g.strokeStyle=ink;
 for(const dx of [-22,22]){const x=X+dx;
  if(expression==='closed'){g.lineWidth=5;g.beginPath();g.arc(x,118,9,Math.PI*.15,Math.PI*.85);g.stroke();}
  else{g.beginPath();g.ellipse(x,118,6.5,expression==='smile'?7:9,0,0,Math.PI*2);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(x+2.2,114.5,2.2,0,Math.PI*2);g.fill();g.fillStyle=ink;}
  if(lashes&&expression!=='closed'){g.lineWidth=2.5;g.beginPath();g.moveTo(x+(dx<0?-6:6),111);g.lineTo(x+(dx<0?-11:11),106);g.stroke();}
  g.lineWidth=5;g.beginPath();const tilt=expression==='focus'?(dx<0?3:-3):0;g.moveTo(x-9,103-tilt);g.quadraticCurveTo(x,96,x+9,103+tilt);g.stroke();
 }
 g.lineWidth=3;g.beginPath();g.moveTo(X,126);g.lineTo(X-4,136);g.lineTo(X+1,137);g.stroke();
 g.lineWidth=5;g.beginPath();
 if(expression==='smile')g.arc(X,142,11,Math.PI*.15,Math.PI*.85);else if(expression==='focus'){g.moveTo(X-7,152);g.lineTo(X+7,151);}else if(expression==='closed')g.arc(X,148,6,Math.PI*.2,Math.PI*.8);else{g.moveTo(X-8,150);g.quadraticCurveTo(X,155,X+8,150);}
 g.stroke();
 if(elder){g.lineWidth=2;for(const dx of [-34,34]){g.beginPath();g.moveTo(X+dx,112);g.lineTo(X+dx+(dx<0?-5:5),118);g.stroke();}}
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;faces.set(key,t);return t;
}
