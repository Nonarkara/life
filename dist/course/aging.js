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
  c.naturalWidth=c.width;c.naturalHeight=c.height;c.complete=true;cache.set(key,c);return c;}catch{return image;}
}
