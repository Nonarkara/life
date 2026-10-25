import * as T from 'three';
import {roomRecord} from './biography.js';
// Fictional soi vocabulary: shared party walls, upper domestic rooms, a working
// threshold, shaded frontage and service fittings. Details have a use, not a theme.
export function shopfront({box},x,z,w,d,h,parent){
 const upper=1.65,total=Math.max(3.8,h+1.6),front=z+d;
 box(x,z,.12,w,d,total,'#c3b79e',parent);
 // Deep front hall: dark shutter behind a recessed, sheltered trading threshold.
 box(x+.12,front+.012,.15,w-.24,.035,1.48,'#657974',parent);
 for(let a=.18;a<w-.12;a+=.16)box(x+a,front+.055,.17,.018,.015,1.4,'#88918a',parent);
 box(x+.1,front+.07,1.75,w-.2,.04,.14,'#a08e74',parent);
 box(x-.02,front-.06,1.96,w+.04,.65,.07,'#8c9a8c',parent);
 for(const a of [.05,w-.12])box(x+a,front+.45,.04,.045,.045,1.95,'#777666',parent);
 // Inhabited upper floor, not another roof floating over a generic cube.
 const windowW=Math.min(.75,w*.3);
 for(const a of [.23,w-windowW-.23]){
  box(x+a,front+.02,upper+.7,windowW,.035,.95,'#566f6b',parent);
  box(x+a+.03,front+.06,upper+.75,.13,.03,.85,'#b7ad91',parent);
 }
 box(x-.04,front,upper+.45,w+.08,.32,.08,'#a79c82',parent);
 box(x-.04,front+.3,upper+.52,w+.08,.035,.33,'#737b70',parent);
 for(let a=.13;a<w;a+=.25)box(x+a,front+.3,upper+.52,.018,.025,.33,'#737b70',parent);
 // Rainwater pipe, patched plaster and compressor locate daily maintenance.
 box(x+w-.1,front+.07,.15,.035,.035,total-.1,'#81908a',parent);
 box(x+w-.57,front+.07,total-.48,.4,.16,.24,'#a9ad9e',parent);
 for(let a=0;a<4;a++)box(x+w-.53+a*.07,front+.235,total-.44,.018,.01,.16,'#7d8c83',parent);
 box(x+.12,front+.04,.2,.27,.012,.31,'#b1a48c',parent);
 box(x-.04,z-.04,total+.12,w+.08,d+.08,.09,'#8f8f7c',parent);
 box(x-.04,front+.04,total+.21,w+.08,.08,.2,'#b8ac94',parent);
 // Drying cloth is pinned to a balcony rail, away from circulation.
 box(x+w*.4,front+.34,upper+.52,.35,.025,.42,'#a6aa97',parent);
}
export function createInhabitedRooms({scene,box,round}){
 const roots=new Map(),marks=[];
 // Put study evidence against a wall, never in the exit aisle.
 for(const [x,z]of [[3,3],[-10,3],[17,3],[25,10]]){
  const g=new T.Group();scene.add(g);const key=x===3?'family':x===-10?'far':x===17?'nearLocal':'nearCity';roots.set(key,g);
  // Repaired floor and a worn threshold join domestic and public space.
  box(x+.12,z+.13,.17,.4,.5,.012,'#99866c',g);
  box(x+.12,z+3.43,.04,1.1,.22,.1,'#9a9d8c',g);
  box(x+.12,z+3.44,.145,1.1,.025,.006,'#c4c0a7',g);
  box(x+.12,z+.105,.3,.63,.012,.54,'#c7bda2',g);
  box(x+.14,z+.12,.73,.45,.22,.035,'#8c795e',g);
  // Quiet switchboard and wall wiring at the back of a lived room.
  box(x+.25,z+.12,1.25,.12,.04,.18,'#d6d0b8',g);
  box(x+.3,z+.12,1.43,.02,.025,.65,'#8c9385',g);
 }
 // One case object is reparented spatially through life, never cloned per room.
 const schoolCase=new T.Group();scene.add(schoolCase);
 box(0,0,0,.38,.19,.26,'#985c46',schoolCase);box(.015,-.012,.15,.35,.025,.02,'#d2b381',schoolCase);
 for(const x of [.06,.28])box(x,-.015,.07,.025,.025,.11,'#b7a275',schoolCase);
 box(.13,.07,.26,.12,.025,.025,'#625b49',schoolCase);
 const books=new T.Group();scene.add(books);
 for(let i=0;i<6;i++){const g=new T.Group();books.add(g);box(i*.065,0,0,.045,.22,.26-i%2*.04,i%2?'#759085':'#ae8c60',g);}
 const comic=new T.Group();scene.add(comic);box(0,0,0,.25,.22,.035,'#b27d55',comic);box(.03,.02,.036,.17,.16,.003,'#d4c7a4',comic);
 const work=new T.Group();scene.add(work);box(0,0,0,.4,.27,.025,'#586d68',work);box(0,.25,.02,.4,.025,.25,'#586d68',work);
 const memory=new T.Group();scene.add(memory);box(0,0,0,.28,.06,.32,'#8f7856',memory);box(.035,.065,.035,.21,.005,.25,'#d3c6a5',memory);
 const recovery=new T.Group();scene.add(recovery);box(0,0,0,.25,.25,.3,'#b0a084',recovery);round(.12,.12,.36,.045,'#ddd5c2',1,1.5,1,recovery);
 // Height marks stay at the childhood wall. No future marks are pre-displayed.
 for(let i=0;i<7;i++)marks.push(box(3.11,5.45,.55+i*.12,.025,.12,.012,'#9d8366'));
 return {schoolCase,books,roots,update(state,age){
  const r=roomRecord(state,age),[x,z]=r.home.base;
  for(const[id,g]of roots)g.visible=id==='family'||id===r.home.id;
  schoolCase.visible=r.possessions.length>0;schoolCase.position.set(x+3.12,.18,z+2.2);
  books.visible=r.books>0;books.position.set(x+3.08,.88,z+.67);books.children.forEach((c,i)=>c.visible=i<Math.min(6,r.books));
  comic.visible=r.comics>0;comic.position.set(x+3.12,.45,z+2.2);
  work.visible=r.workspace;work.position.set(x+3.12,.88,z+.95);
  memory.visible=r.remembered;memory.position.set(x+.2,.75,z+.15);
  recovery.visible=r.recovering;recovery.position.set(x+1.45,.16,z+.5);
  marks.forEach((m,i)=>m.visible=age>=6+i*2);
 }};
}
