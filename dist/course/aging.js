// The painted sheets have a child, a young adult and an elder; nobody between. So the adult is
// aged by the one thing that ages without new drawing: the hair goes grey, a little more each
// year from forty. Only thick dark masses near the top of the figure change; eyes, brows and
// shoes are thin or low, and stay as drawn.
export const greyLevel=age=>age<40?0:Math.min(4,1+Math.floor((age-40)/6));
const MIX=[0,.18,.36,.55,.72];
// pixels: RGBA bytes, width w, height h. Returns a count of recoloured pixels.
export function greyHair(pixels,w,h,level){
 const t=MIX[level]??0;if(!t)return 0;
 let top=h,bottom=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(pixels[(y*w+x)*4+3]>40){if(y<top)top=y;bottom=y;}
 const limit=top+(bottom-top)*.22,dark=new Uint8Array(w*h);
 for(let y=top;y<limit;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
  if(pixels[i+3]>200&&Math.max(r,g,b)<95&&Math.max(r,g,b)-Math.min(r,g,b)<40)dark[y*w+x]=1;}
 // a pixel counts as hair only if most of its neighbourhood is dark too (thick mass, not a feature)
 const R=4,sum=new Int32Array((w+1)*(h+1));
 for(let y=0;y<h;y++){let row=0;for(let x=0;x<w;x++){row+=dark[y*w+x];sum[(y+1)*(w+1)+x+1]=sum[y*(w+1)+x+1]+row;}}
 const box=(x,y)=>{const x0=Math.max(0,x-R),x1=Math.min(w,x+R+1),y0=Math.max(0,y-R),y1=Math.min(h,y+R+1);return (sum[y1*(w+1)+x1]-sum[y0*(w+1)+x1]-sum[y1*(w+1)+x0]+sum[y0*(w+1)+x0])/((x1-x0)*(y1-y0));};
 let n=0;
 for(let y=top;y<limit;y++)for(let x=0;x<w;x++)if(dark[y*w+x]&&box(x,y)>.7){const i=(y*w+x)*4,streak=((x*7+y*13)%5)/5*.12;
  for(let c=0;c<3;c++)pixels[i+c]=Math.round(pixels[i+c]*(1-t)+(176+c)*t+streak*40);n++;}
 return n;
}
const cache=new Map();
// A same-size canvas that stands in for the sprite image (it carries naturalWidth/Height).
export function agedImage(image,age){
 const level=greyLevel(age);if(!level||!image?.complete||!image.naturalWidth||typeof document==='undefined')return image;
 const key=image.src+'#'+level;if(cache.has(key))return cache.get(key);
 try{const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);
  const data=g.getImageData(0,0,c.width,c.height);greyHair(data.data,c.width,c.height,level);g.putImageData(data,0,0);
  c.naturalWidth=c.width;c.naturalHeight=c.height;c.complete=true;c.key=key;cache.set(key,c);return c;}catch{return image;}
}
// The painter drew one outfit for the player: a mustard shirt and olive trousers in every pose.
// A life wears its own clothes, so those two bands are repainted in the colours the 3D figure
// wears this year, keeping the painter's shading. Skin is less saturated than the shirt and
// is left alone. Returns a count of recoloured pixels.
const hex=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
export function redress(pixels,top,bottom,w=0){
 const T=hex(top),B=hex(bottom),n=pixels.length/4,hit=new Uint8Array(n),hsv=i=>{const r=pixels[i],g=pixels[i+1],b=pixels[i+2],mx=Math.max(r,g,b),d=mx-Math.min(r,g,b);return [d?60*(mx===r?((g-b)/d+6)%6:mx===g?(b-r)/d+2:(r-g)/d+4):-1,mx?d/mx:0,mx/255];};
 // ponytail: fixed hue bands measured on the shipped sheets; a new sheet in other colours needs new bands.
 for(let p=0;p<n;p++){const i=p*4;if(pixels[i+3]<40)continue;const [h,s,v]=hsv(i);
  hit[p]=h>=0&&h<=50&&s>=.56&&(h>=33&&v>=.35||h>=20&&(v>=.65||s>=.72&&v>=.42))?1:h>=40&&h<=95&&s>=.15&&s<.56&&v>=.22&&v<=.62?2:0;}
 // The painter's lit shade inside a band lifts the value and drops the saturation, so it misses
 // both windows above and survives as a gold fleck. Grow three pixels out of each hit — but only
 // inside that cloth's own colour family: skin sits at hue <=33, pale wood and the apron sit
 // above the blue ceilings, so neither can enter (measured: 8975 stray flecks -> 447).
 if(w){const hgt=n/w;
  for(let r=0;r<3;r++){const add=[];
   for(let p=0;p<n;p++){if(hit[p]||pixels[p*4+3]<40)continue;
    const x=p%w,y=(p/w)|0;let k=0;
    for(let dy=-1;dy<=1&&!k;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx<0||xx>=w||yy<0||yy>=hgt)continue;const q=yy*w+xx;if(hit[q]){k=hit[q];break;}}
    if(!k)continue;const [h,s,v]=hsv(p*4);
    if(h<15||s<.28||v<.3||v>.93)continue;
    if(k===1?(h<34||h>55||pixels[p*4+2]>110):(h<40||h>75||pixels[p*4+2]>120))continue;
    add.push([p,k]);}
   for(const [p,k] of add)hit[p]=k;}}
 // Edge pixels between cloth and its ink line are darker than either band: take them from a
 // repainted neighbour — one pass, and only inside that neighbour's family, so a shoe, an apron
 // or an easel leg beside the sleeve is not dragged in with a second pass (1584 fewer than before).
 if(w){const add=[];
  for(let p=0;p<n;p++){if(hit[p]||pixels[p*4+3]<40)continue;const [h,s,v]=hsv(p*4);if(h<10||h>95||s<.3||v>=.65)continue;
   const x=p%w,k=(x>0&&hit[p-1])||(x<w-1&&hit[p+1])||hit[p-w]||hit[p+w];
   if(!k)continue;
   if(k===1&&h>55)continue;if(k===2&&h<38)continue;
   add.push([p,k]);}
  for(const [p,k] of add)hit[p]=k;}
 let count=0;
 for(let p=0;p<n;p++){if(!hit[p])continue;const i=p*4,v=Math.max(pixels[i],pixels[i+1],pixels[i+2])/255,[C,ref]=hit[p]===1?[T,.85]:[B,.5];
  for(let c=0;c<3;c++)pixels[i+c]=Math.min(255,Math.round(C[c]*v/ref));count++;}
 return count;
}
const dressed=new Map();
export function redressedImage(image,top,bottom){
 if(!top||!bottom||!image?.naturalWidth||typeof document==='undefined')return image;
 const key=(image.src??image.key)+'#'+top+bottom;if(dressed.has(key))return dressed.get(key);
 try{const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);
  const data=g.getImageData(0,0,c.width,c.height);redress(data.data,top,bottom,c.width);g.putImageData(data,0,0);
  c.naturalWidth=c.width;c.naturalHeight=c.height;c.complete=true;dressed.set(key,c);return c;}catch{return image;}
}
