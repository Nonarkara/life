import {TRAITS,personality,capacities} from './personality.js';
import {purpose} from './purpose.js';
import {FOCUSES} from './motivations.js';
export function initPersonalConsole({getState,isMoving=()=>false}){
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
 document.body.classList.add('personal-console');
 const last=document.getElementById('last-event'),latest=el('details',undefined,'latest-event');latest.append(el('summary','Latest event'));last.before(latest);latest.append(last);
 const board=el('section',undefined,'personal-board');board.setAttribute('aria-label','Personal dashboard');
 const panels={},phone=matchMedia('(max-width:720px)');
 for(const [id,title]of [['ocean','OCEAN'],['condition','Condition'],['goals','Five-year goals']]){
  const section=el('section',undefined,'personal-instrument');section.id='instrument-'+id;section.setAttribute('aria-label',title);panels[id]=section;
 }
 board.append(...Object.values(panels));const main=document.querySelector('main');main.append(board);
 function heading(panel,title,caption){const h=el('div',undefined,'instrument-heading');h.append(el('h2',title));if(caption)h.append(el('small',caption));panel.append(h);}
 heading(panels.ocean,'OCEAN','Personality · game indices');const traits=el('div',undefined,'ocean-rows');panels.ocean.append(traits,el('p','Thin mark: your starting record.','instrument-key'));
 heading(panels.condition,'Condition');const recordedAt=el('small');panels.condition.querySelector('.instrument-heading').append(recordedAt);const conditions=el('div',undefined,'condition-grid'),live=el('div');live.id='condition-live';const capacitiesEl=el('div',undefined,'capacity-instruments');conditions.append(live,capacitiesEl);panels.condition.append(conditions);const hud=document.querySelector('.life-hud');if(hud)live.append(hud);
 const purposeDetails=el('details',undefined,'purpose-notes');purposeDetails.append(el('summary','About Ikigai in this game'),el('p','Recorded follow-through toward a chosen priority. This game proxy is not a psychological test or a measure of your real purpose. Chapters without an eligible opportunity are not graded.'));
 panels.condition.append(purposeDetails);
 heading(panels.goals,'Five-year goals');const period=el('strong',undefined,'goal-period'),fields=el('div',undefined,'goal-fields'),goalNotes=el('details',undefined,'goal-notes');goalNotes.append(el('summary','Goal notes'));panels.goals.append(period,fields,goalNotes);
 // Phones give the world the screen: the board becomes the reader's You tab.
 const youPane=document.getElementById('console-you'),youButton=document.querySelector('[aria-controls=console-you]'),planButton=document.querySelector('[aria-controls=console-plan]');
 const leaveYou=()=>{if(youButton?.getAttribute('aria-pressed')==='true')planButton?.click();};
 function place(){if(phone.matches&&youPane)youPane.append(board);else{main.append(board);leaveYou();}}phone.addEventListener('change',place);place();
 function render(){
  const s=getState(),moving=isMoving(),review=s.stage==='review'&&!moving&&!s.story?.pending;document.body.classList.toggle('is-review',review);latest.hidden=last.hidden||!last.textContent.trim();board.hidden=s.stage==='birth'||s.stage==='recap';if(youButton){youButton.hidden=board.hidden;if(board.hidden)leaveYou();}
  const p=personality(s);traits.replaceChildren();
  TRAITS.forEach(([key,label],i)=>{const row=el('div',undefined,'ocean-row'),name=el('span'),letter=el('b','OCEAN'[i]);name.append(letter,document.createTextNode(label));const track=el('div',undefined,'ocean-track');track.setAttribute('role','img');track.setAttribute('aria-label',`${label}: ${p.current[key]} / 100; starting ${p.initial[key]}.`);const fill=el('span'),start=el('i');fill.style.width=p.current[key]+'%';start.style.left=p.initial[key]+'%';track.append(fill,start);row.append(name,track,el('output',String(p.current[key])));traits.append(row);});
  recordedAt.textContent='Recorded at age '+s.age;const c=capacities(s),meaning=purpose(s);capacitiesEl.replaceChildren();
  for(const [label,value]of [['Reasoning · IQ',c.reasoning],['Emotional skills · EQ',c.emotionalSkills]]){const row=el('div',undefined,'capacity-instrument');row.append(el('span',label),el('strong',value+' / 100'));const bar=el('span',undefined,'condition-track'),fill=el('i');fill.style.width=value+'%';bar.append(fill);row.append(bar);capacitiesEl.append(row);}
  const meaningRow=el('div',undefined,'purpose-instrument');meaningRow.append(el('span','Ikigai'),el('strong',meaning.eligible?meaning.met+' / '+meaning.eligible:'—'),el('small',meaning.eligible?'Game proxy · eligible chapters':'Not yet recorded'));capacitiesEl.append(meaningRow);
  let facts=purposeDetails.querySelector('.purpose-facts');if(!facts){facts=el('div',undefined,'purpose-facts');purposeDetails.append(facts);}facts.replaceChildren();
  for(const r of meaning.records.slice(-3)){const line=el('p',`${r.from}–${r.to} · ${FOCUSES[r.focus]} · ${r.met?'Recorded':'No matching action recorded'}`);facts.append(line);}
  const feedback=document.getElementById('focus-feedback');if(feedback&&!feedback.hidden)purposeDetails.append(feedback);
  period.textContent=s.stage==='review'?'Ages '+s.age+'–'+Math.min(80,s.age+5):'Current chapter';
  const profile=document.getElementById('profile'),source=profile?.querySelector('.focus-source'),hint=source?.previousElementSibling;
  const goalFields=['profile-aim','profile-focus'].map(id=>document.getElementById(id)?.closest('.profile-field')).filter(Boolean);
  if(goalFields.length){fields.replaceChildren(...goalFields);goalNotes.replaceChildren(el('summary','Goal notes'));if(hint?.tagName==='P')goalNotes.append(hint);if(source)goalNotes.append(source);}
  for(const input of fields.querySelectorAll('select'))input.disabled=!review;
  if(!fields.children.length)fields.append(el('p','Goals open at your next review.','instrument-key'));
  const title=document.getElementById('title');if(review)title.textContent=document.getElementById('tab-priorities')?.getAttribute('aria-pressed')==='true'?'Practice':'Life choices';
  const focus=document.getElementById('focus-feedback');if(focus?.parentElement===document.querySelector('#editor')?.parentElement)focus.hidden=true;
  document.getElementById('stage-count').hidden=review;
 }
 return {render};
}
