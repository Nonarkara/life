import * as T from 'three';
import {REGIONS} from './regions.js';
// The Truman Show's studio floor. A town is one set on a vast floor. When a life moves, the camera rises
// off the set and glides across the floor to the next one; the old set is already under dust sheets.
// Distance is a metaphor, not a map: a hop across Bangkok, a longer glide up-country, a painted sea
// before anywhere overseas. Seen only while travelling; a life at home never sees the floor.
const C=6.5,DIR=new T.Vector3(-Math.SQRT1_2,0,Math.SQRT1_2),BKK=['khlong-toei','bang-na','pathum-wan','sukhumvit','samut-prakan'];
export const hop=(a,b)=>REGIONS[a]?.country!==REGIONS[b]?.country?110:BKK.includes(a)&&BKK.includes(b)?34:62;
export const GLIDE_MS=4200;
const lambert=c=>new T.MeshLambertMaterial({color:c});
// A closed set: the plinth, a dust sheet, and the humps of buildings underneath it.
function closedSet(g,x,z,seed){const s=new T.Group();s.position.set(x,0,z);g.add(s);
 const add=(w,h,d,px,py,pz,c)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),lambert(c));m.position.set(px,py,pz);m.castShadow=m.receiveShadow=true;s.add(m);};
 add(24,1.3,24,0,-.65,0,'#b4ab98');
 let r=seed;const rnd=()=>(r=(r*9301+49297)%233280)/233280;
 for(let i=0;i<7;i++)add(2+rnd()*4,.6+rnd()*(i<2?3.5:1.6),2+rnd()*4,(rnd()-.5)*17,0,(rnd()-.5)*17,'#e8e2d4');
 for(const m of s.children.slice(1))m.position.y=m.geometry.parameters.height/2;
}
export function createStudio(scene){
 const g=new T.Group();g.visible=false;scene.add(g);
 const floor=new T.Mesh(new T.PlaneGeometry(900,900),lambert('#cdc2a6'));floor.rotation.x=-Math.PI/2;floor.position.set(C,-1.32,C);floor.receiveShadow=true;g.add(floor);
 // Studio tape marks every set's place on the floor.
 for(let i=-6;i<=6;i++){const a=new T.Mesh(new T.PlaneGeometry(900,.12),lambert('#bdb294'));a.rotation.x=-Math.PI/2;a.position.set(C,-1.315,C+i*60);g.add(a);const b=a.clone();b.rotation.z=Math.PI/2;b.position.set(C+i*60,-1.315,C);g.add(b);}
 const sea=new T.Mesh(new T.PlaneGeometry(1,900),lambert('#5b7f86'));sea.rotation.x=-Math.PI/2;sea.rotation.z=Math.PI/4;sea.position.y=-1.31;g.add(sea);
 const sets=new T.Group();g.add(sets);
 // ponytail: the horizon is a fixed ring of closed sets; it does not try to be every province.
 for(let i=0;i<9;i++){const a=i/9*Math.PI*2+.4,R=70+(i%3)*28;closedSet(sets,C+Math.cos(a)*R,C+Math.sin(a)*R,i*131+7);}
 const left=new T.Group();g.add(left);
 let travel=null;
 return {
  // Starts a glide from the set the life is leaving; returns false when there is nothing to show.
  leave(from,to){if(!from||from===to)return false;const D=hop(from,to);travel={D,start:performance.now()};
   left.clear();closedSet(left,C+DIR.x*D,C+DIR.z*D,from.length*977);
   sea.visible=D>=hop('sukhumvit','tokyo');sea.scale.x=D*.45;sea.position.set(C+DIR.x*D/2,-1.31,C+DIR.z*D/2);
   g.visible=true;return true;},
  // Where the camera is in the glide: an offset from the new set, and how far it has risen.
  step(now=performance.now()){if(!travel)return null;const p=Math.min(1,(now-travel.start)/GLIDE_MS);
   if(p>=1){travel=null;g.visible=false;left.clear();return null;}
   const e=p*p*(3-2*p),back=travel.D*(1-e);return {dx:DIR.x*back,dz:DIR.z*back,rise:travel.D*.75*Math.sin(Math.PI*p),far:travel.D*2.2};},
  get travelling(){return !!travel;},
  cancel(){travel=null;g.visible=false;left.clear();}
 };
}
