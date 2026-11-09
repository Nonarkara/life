// The diorama's building block: every static surface of a place goes into one
// typed-array batch and leaves as one mesh, one draw call. Colour is per vertex, so a
// whole house is one matte material. Windows carry a `glow` value the night switches on.
import * as T from 'three';

// World units against real metres. A person is 1.65 m; a storey is 3 m.
export const METRE=.645;
export const m=n=>n*METRE;

const linear=new Map(),scratch=new T.Color();
function rgb(hex){let c=linear.get(hex);if(!c){scratch.set(hex);c=[scratch.r,scratch.g,scratch.b];linear.set(hex,c);}return c;}
const FACES=[
 // nx,ny,nz, then four corners as unit offsets (x,y,z)
 [0,1,0,[0,1,1,1,1,1,1,1,0,0,1,0]],
 [0,0,1,[0,0,1,1,0,1,1,1,1,0,1,1]],
 [0,0,-1,[1,0,0,0,0,0,0,1,0,1,1,0]],
 [1,0,0,[1,0,1,1,0,0,1,1,0,1,1,1]],
 [-1,0,0,[0,0,0,0,0,1,0,1,1,0,1,0]]
];
const a=new T.Vector3(),b=new T.Vector3(),n=new T.Vector3();
export function createBatch(){
 const P=[],N=[],C=[],G=[],I=[];
 let count=0;
 function vert(x,y,z,nx,ny,nz,c,g){P.push(x,y,z);N.push(nx,ny,nz);C.push(c[0],c[1],c[2]);G.push(g);return count++;}
 function quad(p0,p1,p2,p3,nor,c,g=0){const i=vert(...p0,...nor,c,g);vert(...p1,...nor,c,g);vert(...p2,...nor,c,g);vert(...p3,...nor,c,g);I.push(i,i+1,i+2,i,i+2,i+3);}
 // x,z is the plan corner, y the base: the same argument order the older world used.
 function box(x,z,y,w,d,h,color,glow=0){
  const c=rgb(color);
  for(const [nx,ny,nz,o] of FACES){
   const v=[];for(let k=0;k<4;k++)v.push([x+o[k*3]*w,y+o[k*3+1]*h,z+o[k*3+2]*d]);
   quad(v[0],v[1],v[2],v[3],[nx,ny,nz],c,glow);
  }
 }
 // A square-section bar from one point to another: wires, fronds, rafters, ladders.
 function beam(ax,ay,az,bx,by,bz,w,h,color){
  const c=rgb(color);a.set(bx-ax,by-ay,bz-az);const len=a.length();if(len<1e-5)return;a.divideScalar(len);
  b.set(Math.abs(a.y)>.95?1:0,Math.abs(a.y)>.95?0:1,0);n.crossVectors(a,b).normalize();b.crossVectors(n,a).normalize();
  const side=[n.x*w/2,n.y*w/2,n.z*w/2],up=[b.x*h/2,b.y*h/2,b.z*h/2],at=(p,s,u)=>[p[0]+side[0]*s+up[0]*u,p[1]+side[1]*s+up[1]*u,p[2]+side[2]*s+up[2]*u],A=[ax,ay,az],B=[bx,by,bz];
  quad(at(A,-1,1),at(A,1,1),at(B,1,1),at(B,-1,1),[b.x,b.y,b.z],c);
  quad(at(A,1,-1),at(A,-1,-1),at(B,-1,-1),at(B,1,-1),[-b.x,-b.y,-b.z],c);
  quad(at(A,1,1),at(A,1,-1),at(B,1,-1),at(B,1,1),[n.x,n.y,n.z],c);
  quad(at(A,-1,-1),at(A,-1,1),at(B,-1,1),at(B,-1,-1),[-n.x,-n.y,-n.z],c);
 }
 // A pitched roof over the rectangle; the ridge runs along the longer side unless told.
 function gable(x,z,y,w,d,rise,color,{over=.1,along=w>=d?'x':'z',gableColor}={}){
  const c=rgb(color),e=rgb(gableColor??color),X0=x-over,X1=x+w+over,Z0=z-over,Z1=z+d+over,top=y+rise;
  if(along==='x'){
   const mid=z+d/2,slope=Math.hypot(rise,d/2+over),ny=(d/2+over)/slope,nz=rise/slope;
   quad([X0,top,mid],[X0,y,Z1],[X1,y,Z1],[X1,top,mid],[0,ny,nz],c);
   quad([X1,top,mid],[X1,y,Z0],[X0,y,Z0],[X0,top,mid],[0,ny,-nz],c);
   tri([x,y,z],[x,y,z+d],[x,top,mid],[-1,0,0],e);tri([x+w,y,z+d],[x+w,y,z],[x+w,top,mid],[1,0,0],e);
  }else{
   const mid=x+w/2,slope=Math.hypot(rise,w/2+over),ny=(w/2+over)/slope,nx=rise/slope;
   quad([mid,top,Z1],[X1,y,Z1],[X1,y,Z0],[mid,top,Z0],[nx,ny,0],c);
   quad([mid,top,Z0],[X0,y,Z0],[X0,y,Z1],[mid,top,Z1],[-nx,ny,0],c);
   tri([x,y,z+d],[x+w,y,z+d],[mid,top,z+d],[0,0,1],e);tri([x+w,y,z],[x,y,z],[mid,top,z],[0,0,-1],e);
  }
 }
 function tri(p0,p1,p2,nor,c){const i=vert(...p0,...nor,c,0);vert(...p1,...nor,c,0);vert(...p2,...nor,c,0);I.push(i,i+1,i+2);}
 // A hipped roof: four slopes up to a short ridge. Used for the temple-free town houses.
 function hip(x,z,y,w,d,rise,color,over=.1){
  const c=rgb(color),X0=x-over,X1=x+w+over,Z0=z-over,Z1=z+d+over,top=y+rise,inset=Math.min(w,d)/2+over,A=[X0+inset,top,z+d/2],B=[X1-inset,top,z+d/2];
  const face=(p,q,r,s)=>{a.set(q[0]-p[0],q[1]-p[1],q[2]-p[2]);b.set(s[0]-p[0],s[1]-p[1],s[2]-p[2]);n.crossVectors(a,b).normalize();quad(p,q,r,s,[n.x,n.y,n.z],c);};
  face([X0,y,Z1],[X1,y,Z1],B,A);face([X1,y,Z0],[X0,y,Z0],A,B);
  const f3=(p,q,r)=>{a.set(q[0]-p[0],q[1]-p[1],q[2]-p[2]);b.set(r[0]-p[0],r[1]-p[1],r[2]-p[2]);n.crossVectors(a,b).normalize();tri(p,q,r,[n.x,n.y,n.z],c);};
  f3([X0,y,Z0],[X0,y,Z1],A);f3([X1,y,Z1],[X1,y,Z0],B);
 }
 function cylinder(x,z,y,r0,r1,h,color,sides=8,cap=true){
  const c=rgb(color),slope=(r0-r1)/Math.max(h,.0001),ny=slope/Math.hypot(slope,1),nr=1/Math.hypot(slope,1);
  for(let i=0;i<sides;i++){
   const a0=i/sides*Math.PI*2,a1=(i+1)/sides*Math.PI*2,s0=Math.sin(a0),c0=Math.cos(a0),s1=Math.sin(a1),c1=Math.cos(a1);
   const j=vert(x+s0*r0,y,z+c0*r0,s0*nr,ny,c0*nr,c,0);vert(x+s1*r0,y,z+c1*r0,s1*nr,ny,c1*nr,c,0);vert(x+s1*r1,y+h,z+c1*r1,s1*nr,ny,c1*nr,c,0);vert(x+s0*r1,y+h,z+c0*r1,s0*nr,ny,c0*nr,c,0);I.push(j,j+1,j+2,j,j+2,j+3);
   if(cap&&r1>0){const t=vert(x,y+h,z,0,1,0,c,0);vert(x+s0*r1,y+h,z+c0*r1,0,1,0,c,0);vert(x+s1*r1,y+h,z+c1*r1,0,1,0,c,0);I.push(t,t+1,t+2);}
  }
 }
 function ball(x,y,z,rx,ry=rx,rz=rx,color='#888888',seg=7){
  const c=rgb(color),rows=Math.max(3,seg-2),start=count;
  for(let j=0;j<=rows;j++){const v=j/rows*Math.PI,sv=Math.sin(v),cv=Math.cos(v);for(let i=0;i<=seg;i++){const u=i/seg*Math.PI*2,nx=sv*Math.sin(u),nz=sv*Math.cos(u);vert(x+nx*rx,y+cv*ry,z+nz*rz,nx,cv,nz,c,0);}}
  for(let j=0;j<rows;j++)for(let i=0;i<seg;i++){const p=start+j*(seg+1)+i,q=p+seg+1;I.push(p,q,p+1,q,q+1,p+1);}
 }
 // A flat ring, lying down: wheels seen from above read as a dark disc.
 function disc(x,z,y,r,color,sides=12){const c=rgb(color),t=vert(x,y,z,0,1,0,c,0);for(let i=0;i<=sides;i++){const u=i/sides*Math.PI*2;vert(x+Math.sin(u)*r,y,z+Math.cos(u)*r,0,1,0,c,0);}for(let i=0;i<sides;i++)I.push(t,t+1+i,t+2+i);}
 // A plan polygon lying flat, for water and land that are not rectangles.
 function polygon(points,y,color){const c=rgb(color),shape=new T.Shape(points.map(([x,z])=>new T.Vector2(x,z))),tris=T.ShapeUtils.triangulateShape(shape.getPoints(),[]),ring=shape.getPoints();const base=count;for(const p of ring)vert(p.x,y,p.y,0,1,0,c,0);for(const [i,j,k] of tris){const area=(ring[j].x-ring[i].x)*(ring[k].y-ring[i].y)-(ring[j].y-ring[i].y)*(ring[k].x-ring[i].x);if(area<0)I.push(base+i,base+j,base+k);else I.push(base+i,base+k,base+j);}}
 return {box,beam,gable,hip,cylinder,ball,disc,polygon,get size(){return count;},
  geometry(){
   if(!count)return null;
   const g=new T.BufferGeometry();
   g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('normal',new T.Float32BufferAttribute(N,3));g.setAttribute('color',new T.Float32BufferAttribute(C,3));g.setAttribute('glow',new T.Float32BufferAttribute(G,1));
   g.setIndex(count>65535?new T.BufferAttribute(new Uint32Array(I),1):new T.BufferAttribute(new Uint16Array(I),1));
   g.computeBoundingSphere();g.computeBoundingBox();return g;
  }
 };
}
// Windows glow through one shared number, so the whole town lights up from a single write.
export const nightGlow={value:0};
export const glowColor={value:new T.Color('#ffc27a')};
function withGlow(shader){
 shader.uniforms.uNight=nightGlow;shader.uniforms.uGlow=glowColor;
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float glow;varying float vGlow;').replace('#include <begin_vertex>','#include <begin_vertex>\nvGlow=glow;');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float vGlow;uniform float uNight;uniform vec3 uGlow;').replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=uGlow*vGlow*uNight;');
}
// One material per batch because a cutaway fades one building, never the town. Programs are shared.
export function worldMaterial(){const material=new T.MeshLambertMaterial({vertexColors:true});material.onBeforeCompile=withGlow;material.customProgramCacheKey=()=>'diorama-world';return material;}
// Bake a batch into `parent` and hand back the mesh.
export function bake(batch,parent,{cast=true,receive=true}={}){const geometry=batch.geometry();if(!geometry)return null;const mesh=new T.Mesh(geometry,worldMaterial());mesh.castShadow=cast;mesh.receiveShadow=receive;mesh.matrixAutoUpdate=false;parent.add(mesh);return mesh;}
