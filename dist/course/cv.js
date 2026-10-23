import {PURCHASES} from './finance.js';
// A projection of completed game records, never an invented qualification.
const routes={school:['education','School education'],college:['education','College studies'],vocational:['work','Paid apprenticeship'],independent:['work','Independent work'],work:['work','Salaried work']};
export function buildCV(state){
 const entries=[];
 for(const row of state.history){
  if(row.from===undefined||!routes[row.pathway]||row.from>=60)continue;
  const [kind,label]=routes[row.pathway],previous=entries.at(-1),evidence={type:'period',age:row.age,route:row.pathway};
  if(previous&&previous.route===row.pathway&&previous.to===row.from){previous.to=row.age;previous.evidence.push(evidence);}
  else entries.push({id:'route:'+row.from+':'+row.pathway,kind,label,route:row.pathway,from:row.from,to:row.age,evidence:[evidence]});
 }
 for(const event of state.story?.seen??[]){
  const labels={project:'Creative project begun',project_return:'Work shared publicly',commitment:event.choice==='marry'?'Marriage':'Partnership commitment',parenthood:'Parenthood',mentor:'Mentoring'};
  const accepted=event.id==='project'&&event.choice==='start'||event.id==='project_return'&&event.choice==='show'||event.id==='commitment'||event.id==='parenthood'&&event.choice==='raise'||event.id==='mentor'&&event.choice==='teach';
  if(accepted)entries.push({id:'event:'+event.id,kind:['project','project_return'].includes(event.id)?'projects':'milestones',label:labels[event.id],from:event.age,to:event.age,evidence:[{type:'encounter',id:event.id,age:event.age,choice:event.choice}]});
 }
 for(const purchase of state.finance?.purchases??[])if(purchase.key==='class'&&state.finance.receipts?.some(r=>r.id==='purchase:'+purchase.age+':class'&&r.kind==='purchase'&&r.age===purchase.age&&r.expense===PURCHASES.class.cost&&r.income===0&&r.change===-PURCHASES.class.cost))entries.push({id:'class:'+purchase.age,kind:'education',label:'Short class attended',from:purchase.age,to:purchase.age,evidence:[{type:'purchase',key:'class',age:purchase.age}]});
 return entries.sort((a,b)=>a.from-b.from||a.to-b.to);
}
