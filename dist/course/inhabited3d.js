import * as T from 'three';
import {roomRecord} from './biography.js';
export function createInhabitedRooms({scene,box,round}){
 const roots=new Map(),markRoot=[];
 // Put study evidence against a wall, never in the exit aisle.
 for(const [x,z]of [[3,3],[-10,3],[17,3],[25,10]]){
  const g=new T.Group();scene.add(g);const key=x===3?'family':x===-10?'far':x===17?'nearLocal':'nearCity';roots.set(key,g);
  // Repaired floor and a worn threshold join domestic and public space.
  box(x+.12,z+.13,.17,.4,.5,.012,'#99866c',g);
  box(x+.12,z+3.43,.04,1.1,.22,.1,'#9a9d8c',g);
  box(x+.12,z+3.44,.145,1.1,.025,.006,'#c4c0a7',g);
  box(x+.12,z+.105,.26,.63,.012,.36,'#c7bda2',g);
  box(x+.14,z+.12,.6,.45,.18,.03,'#8c795e',g);
  // Quiet switchboard and wall wiring at the back of a lived room.
  box(x+.25,z+.09,.9,.1,.03,.14,'#d6d0b8',g);
  box(x+.3,z+.09,1.04,.02,.02,.5,'#8c9385',g);
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
 const buyerNotes=new T.Group();scene.add(buyerNotes);
 for(let i=0;i<3;i++)box(i*.015,i*.01,i*.004,.22,.16,.009,'#d8c9a6',buyerNotes);
 box(.02,.13,.015,.17,.014,.004,'#667b76',buyerNotes);
 // Height marks stay at the childhood wall. No future marks are pre-displayed.
 for(let i=0;i<7;i++){scene.add(markRoot[i]=new T.Group());box(3.09,4.6,.4+i*.1,.02,.1,.012,'#7f6a50',markRoot[i]);}
 return {schoolCase,books,roots,update(state,age,lift=0){
  const r=roomRecord(state,age),[x,z]=r.home.base,up=r.home.id==='family'?lift:0;roots.get('family').position.y=lift;markRoot.forEach(m=>m.position.y=lift);
  for(const[id,g]of roots)g.visible=id==='family'||id===r.home.id;
  schoolCase.visible=r.possessions.length>0;schoolCase.position.set(x+3.12,.16+up,z+2.2);
  books.visible=r.books>0;books.position.set(x+3.08,.655+up,z+.67);books.children.forEach((c,i)=>c.visible=i<Math.min(6,r.books));
  comic.visible=r.comics>0;comic.position.set(x+3.12,.42+up,z+2.2);
  work.visible=r.workspace;work.position.set(x+3.12,.655+up,z+.95);
  memory.visible=r.remembered;memory.position.set(x+.2,.63+up,z+.15);
  recovery.visible=r.recovering;recovery.position.set(x+1.45,.16+up,z+.5);
  buyerNotes.visible=r.buyerNotes;buyerNotes.position.set(x+.2,.635+up,z+.32);
  markRoot.forEach((m,i)=>m.visible=age>=6+i*2);
 }};
}
