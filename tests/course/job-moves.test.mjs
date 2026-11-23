import test from 'node:test';
import assert from 'node:assert/strict';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {JOB_PIVOTS,JOB_PHRASES,jobFits,jobsDue} from '../../dist/course/job-moves.js';
import {pendingPivots,applyPivot,openOptions,pivotById} from '../../dist/course/pivots.js';
import {newLife,configureLife,begin,live} from '../../dist/course/sim.js';
import {phrases} from '../../dist/course/translations.js';

test('a move pays only at the first review that can know the record, and pays once',()=>{
 // born 1955, station 30 is 1985: 1987 is inside the window but the record to 1995 is not known at 35 (1990), so it pays at 40 (1995)
 const f={job1987:30};
 assert.equal(jobsDue(f,35,1000,1955).length,0);assert.equal(jobsDue(f,45,1000,1955).length,0);
 assert.deepEqual(jobsDue(f,40,1000,1955).map(b=>b.gain),[7200]);
 // station 35 is 1990 = the move year of a 1990-born-aligned case: year===birth+station pays five years on
 assert.deepEqual(jobsDue({job1996:41},46,1000,1955).map(b=>b.gain),[-9000]);
 assert.deepEqual(jobsDue({job2019:64},69,1000,1955).map(b=>b.gain),[-12000]);
 assert.equal(jobsDue({},40,1000,1955).length,0);assert.equal(jobsDue(f,40,1000,null).length,0);
});
test('a scene fits only a move year in the next five years, at working age',()=>{
 const p=JOB_PIVOTS.find(x=>x.id==='job-1987-30');
 assert.ok(jobFits(p,1955));assert.ok(!jobFits(p,1950));assert.ok(!jobFits(p,1960));assert.ok(!jobFits(p,null));
 for(const q of JOB_PIVOTS)assert.equal(new Set(q.options.map(o=>o.id)).size,2,q.id);
});
test('moving sets the flag, staying records the road not taken',()=>{
 let s=begin(configureLife(newLife(2*7919),{birthYear:1955}));const p=JOB_PIVOTS.find(x=>x.id==='job-1987-30');s={...s,age:30,stage:'review',pivots:[]};
 assert.equal(applyPivot(s,p,'move').pivotFlags.job1987,30);const st=applyPivot(s,p,'stay').pivotFlags;assert.equal(st.job1987,undefined);assert.equal(st.job1987o,30);
});
test('lives meet job offers, one per station, and every text is translated',()=>{
 let met=0;
 for(let seed=1;seed<=80;seed++){let s=begin(configureLife(newLife(seed*7919),{birthYear:1955}));
  while(s.stage==='review'&&s.age<60){s=live(s);if(s.stage!=='review')break;
   for(const p of pendingPivots(s)){const os=openOptions(p,s);if(p.job){met++;assert.ok(pivotById(p.id));s=applyPivot(s,p,'move');assert.ok(!pendingPivots(s).some(q=>q.job),'answering closes the job question');}
   else if(os.length)s=applyPivot(s,p,os[(seed+s.age)%os.length].id);}
   const ps=s.story?.pending;if(ps){const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,os[seed%os.length].id,.05);}
  }}
 assert.ok(met>=5,'met '+met);
 const have=new Set(phrases.map(r=>r[0]));
 for(const p of JOB_PIVOTS.filter(p=>p.station===30))for(const t of [p.prompt,p.context,...p.options.flatMap(o=>[o.label,o.note,o.cost])])assert.ok(have.has(t),t);
 for(const r of JOB_PHRASES)assert.equal(r.length,5);
});
test('turning a job down is told at the same review, with no money moved, in every language',()=>{
 const [a]=jobsDue({job1996o:41},46,1000,1955);assert.equal(a.gain,0);assert.ok(a.missed);assert.match(a.text,/Had you moved, it would have cost you\.$/);
 const [b]=jobsDue({job1987o:30},40,1000,1955);assert.equal(b.gain,0);assert.match(b.text,/Had you moved, it would have paid\.$/);
 assert.equal(jobsDue({job1987o:30},35,1000,1955).length,0);
 const have=new Set(phrases.map(r=>r[0]));for(const t of [a.text,b.text])assert.ok(have.has(t),t);
});
test('a job line waits for the last year it names',()=>{
 // born 1957, station 30 is 1987: 1992 is too early for a line that names 1995
 assert.equal(jobsDue({job1987:30},35,1000,1957).length,0);assert.equal(jobsDue({job1987:30},40,1000,1957).length,1);
});

test('a job outcome recorded under the old timing is not paid again',()=>{
 // A 1949 birth was offered the 1987 move at 35. The old payout ran in
 // 45–50, while the revised rule schedules it for 50–55.
 const flags={job1987:35},paid=jobsDue(flags,50,1000,1949)[0];
 assert.equal(jobsDue(flags,45,1000,1949).length,0);
 const before=begin(configureLife(newLife(7919),{birthYear:1949}));
 const adult={...before,age:50,pivotFlags:flags,story:{...before.story,pending:null}};
 const earlier={...adult,history:[...adult.history,{...adult.history.at(-1),age:50,event:paid.text}]};
 const row=live(earlier).history.at(-1);
 const control=live({...earlier,pivotFlags:{}}).history.at(-1);
 assert.equal(row.age,55);
 assert.equal(row.setback,control.setback);
 assert.ok(!row.event.includes(paid.text));
});
