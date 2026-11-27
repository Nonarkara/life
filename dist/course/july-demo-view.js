import {CRISIS_SOURCE,crisisRecord} from './crisis-chapter.js';
import {preferences,t} from './i18n.js';
import {julyDemoURL} from './july-demo-link.js';

const el=(tag,text)=>Object.assign(document.createElement(tag),{textContent:text??''});
const baht=n=>(n<0?'−':n>0?'+':'')+'฿'+Math.abs(n).toLocaleString('en');

function comparison(first,current){
 const choice=r=>t(r.offer==='move'?'New job':'Old job');
 const promise=r=>r.support==='pay'?baht(-r.householdPayment):t('2 effort points');
 const pay=r=>baht(r.wagePremium+r.wageChange);
 const table=el('table');
 table.className='july-comparison';
 const head=table.createTHead().insertRow();
 for(const label of ['',t('First run'),t('Replay')]){
  const cell=el('th',label);cell.scope='col';head.append(cell);
 }
 const body=table.createTBody();
 for(const [label,value] of [['Job choice',choice],['Pay effect of job choice',pay],['Family promise',promise]]){
  const row=body.insertRow(),labelCell=el('th',t(label));
  labelCell.scope='row';
  row.append(labelCell);
  for(const branch of [first,current])row.insertCell().append(value(branch));
 }
 return table;
}

export function renderJulyDemo(root,state,{blocked,commit,canRewind,rewind,guardian}){
 if(blocked){root.replaceChildren(commit);return;}
 const record=crisisRecord(state);
 const previous=crisisRecord(state.previous);
 const title=el('h2',t(previous&&record?'Two lives in Yaowarat':record?'What happened to your promise?':'You made a promise'));
 title.tabIndex=-1;
 if(!record){
  const support=state.pivots?.find(p=>p.pivot==='job-crisis-support');
  root.replaceChildren(title,el('p',t(support?.note)),commit);
  commit.textContent=t('Live through the chapter →');
  return;
 }

 const reply=el('p');reply.append(guardian+' · ',t(record.promise));
 const source=el('a',t('On 2 July 1997, Thailand floated the baht.'));
 source.href=CRISIS_SOURCE;source.target='_blank';source.rel='noopener';
 const history=el('p');history.append(source);
 const evidence=previous?comparison(previous,record):el('p',t('Pay effect of job choice')+' '+baht(record.wagePremium+record.wageChange)+' · '+
  (record.support==='time'?t('Two effort points for family this chapter.'):t('Household contribution: {cash}').replace('{cash}',baht(record.householdPayment).slice(1))));
 const actions=el('div');actions.className='july-demo-actions';
 if(canRewind(20)){
  const again=el('button',t('Return to the job offer →'));
  again.type='button';again.className=previous?'chapter-watch':'primary';again.onclick=()=>rewind(20);
  actions.append(again);
 }
 if(previous){
  const url=new URL(julyDemoURL('/course/',preferences.language),location.origin).href;
  const share=el('button',t('Copy episode link'));
  const status=el('span');status.setAttribute('role','status');
  share.type='button';share.className='primary';
  share.onclick=async()=>{
   try{await navigator.clipboard.writeText(url);status.textContent=t('Link copied.');}
   catch{
    const field=el('input');field.readOnly=true;field.value=url;field.setAttribute('aria-label',t('Episode link'));
    status.replaceChildren(field);field.focus();field.select();
   }
  };
  actions.prepend(share);actions.append(status);
 }
 const exit=el('a',t('Back to July 1997'));
 exit.href=julyDemoURL('/course/july-1997.html',preferences.language);
 actions.append(exit);
 root.replaceChildren(title,reply,evidence,...(previous?[actions,history]:[history,actions]));
}
