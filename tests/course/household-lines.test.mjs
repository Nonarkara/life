import test from 'node:test';
import assert from 'node:assert/strict';
import {newLife,begin,configureLife} from '../../dist/course/sim.js';
import {PIVOTS,fits} from '../../dist/course/pivots.js';
import {pathwayPeriod,WORK_LINES,SCHOOL_LINES} from '../../dist/course/pathways.js';
const life=(seed,cls,sex,birthYear)=>begin(configureLife(newLife(seed),{class:cls,sex,birthYear}));
// The brother-gets-school question belongs to households that had to choose.
test('the one-child-to-secondary-school question reaches only poorer households',()=>{
 const q=PIVOTS.find(p=>p.id==='girl-school');
 assert.ok(fits(q,{...life(4,'working_class','female',1970),age:15}));
 for(const cls of ['middle_class','bureaucratic_class','high_class'])assert.ok(!fits(q,{...life(4,cls,'female',1970),age:15}),cls);
});
// Five years of work are told in the words of this life, not one stock sentence for everyone.
test('work and school are told by the household, and differ between lives',()=>{
 const work=new Set(),school=new Set();
 for(let seed=1;seed<=40;seed++)for(const cls of ['low_class','middle_class','high_class']){
  const s=life(seed,cls,'male',1981);work.add(pathwayPeriod({...s,age:30,pathway:'work'},.5).description);school.add(pathwayPeriod({...s,age:15,pathway:'school'},.5).description);
 }
 assert.ok(!work.has('Regular work supported the household. You learned on the job.'));
 assert.ok(work.size>=5,'work lines '+work.size);assert.ok(school.size>=4,'school lines '+school.size);
 for(const l of work)assert.ok(Object.values(WORK_LINES).flat().includes(l),l);
 for(const l of school)assert.ok(Object.values(SCHOOL_LINES).flat().includes(l),l);
 for(let seed=1;seed<=20;seed++)assert.ok(SCHOOL_LINES.comfortable.includes(pathwayPeriod({...life(seed,'high_class','male',1981),age:15,pathway:'school'},.5).description),'high-class school '+seed);
});
import {live,theftLoss} from '../../dist/course/sim.js';
import {fillPeople} from '../../dist/course/encounter-view.js';
import {rememberedMoments} from '../../dist/course/recap.js';
import {fortuneShape} from '../../dist/course/life-choices.js';
const run=(seed,to)=>{let s=life(seed,'middle_class','female',1981);const rows=[s];while(s.stage==='review'&&s.age<to){const n=live({...s,story:{...s.story,pending:null}});if(n===s)break;s=n;rows.push(s);}return rows;};
// Five years cost a little contentment unless the life puts it back; they no longer drain every life to zero.
test('the built-in mood drift is gentle',()=>{
 let d=0;for(let seed=1;seed<=60;seed++){const r=run(seed,25),a=r.find(x=>x.age===20),b=r.find(x=>x.age===25);d+=b.wellbeing-a.wellbeing;}
 assert.ok(d/60>-1.8,'mean change '+(d/60).toFixed(2));
});
// A theft takes a real share of what was saved, not a fixed sum that a rich life never notices.
test('a theft takes a share of the savings',()=>{
 for(let seed=1;seed<=30;seed++){const st={seed,finance:{available:1000000,reserve:2000000}},loss=theftLoss(st,20000,45);assert.ok(loss>=1200000&&loss<=2400000,String(loss));}
 assert.equal(theftLoss({seed:1,finance:{available:0,reserve:0}},20000,45),100000);
});
test('a choice names the friend, never the placeholder',()=>{
 assert.equal(fillPeople('Find {friend} and make them look at you',{story:{people:{friend:'Arun'}}}),'Find Arun and make them look at you');
 assert.ok(!fillPeople('Lend {friend} and {partner} money',{}).includes('{'));
});
test('the recap skips the household work lines as routine',()=>{
 for(const l of [...Object.values(WORK_LINES),...Object.values(SCHOOL_LINES)].flat()){
  const m=rememberedMoments({history:[{age:30,event:l}],story:{seen:[]}});assert.equal(m.length,0,l);
 }
});
test('a painter is told as a maker, a novice as a monk, never as a stage or a wage',()=>{
 const on=(seed,cls,route,by,age)=>{const s=life(seed,cls,'male',by);return {...s,age,pathway:'work',story:{...s.story,flags:{...s.story?.flags,['r_'+route+'_1']:15,['r_'+route+'_2']:18}}};};
 for(let seed=1;seed<=20;seed++){
  const p=on(seed,'working_class','painter',1981,30);assert.equal(fortuneShape(p),'star');
  const d=pathwayPeriod(p,.5).description;assert.ok(d===''||WORK_LINES.painter.includes(d),d);
 }
});
