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
// A 1949 child is not born beside a 1980s industrial estate or a 1970s apartment block.
test('an early birth gets the household that stood there',()=>{
 const home=(region,cls,y)=>configureLife(newLife(5),{class:cls,birthYear:y,region}).birth.home;
 assert.equal(home('rayong','working_class',1949),'a fishing household on the Rayong coast');
 assert.equal(home('rayong','working_class',1981),'a household near the industrial estate');
 assert.equal(home('bang-na','middle_class',1955),'a household in a wooden house by the Bang Na canals');
 assert.equal(home('bang-na','middle_class',1975),'a household in a wooden house by the Bang Na canals');
 assert.equal(home('bang-na','middle_class',1981),'a household in an apartment block');
 assert.equal(home('rayong','working_class',1975),'a fishing household on the Rayong coast');
});
import {blogFits} from '../../dist/course/life-routes.js';
// A farm child is not handed a thesis, a client or a flight home: writer-life scenes need the ground they stand on.
test('scenes from a degree, an office or abroad reach only lives that have them',()=>{
 const at=cls=>({...life(9,cls,'female',1981),age:30});
 assert.ok(!blogFits(at('low_class'),'n1_grandparent'));assert.ok(!blogFits(at('low_class'),'n1_project'));assert.ok(!blogFits(at('low_class'),'n2_bad_boss'));
 const local=at('working_class');local.story={...local.story,flags:{...local.story.flags,r_far_scholar_1:20}};assert.ok(!blogFits(local,'n1_grandparent'),'a local university is not abroad');
 assert.ok(blogFits(at('middle_class'),'n2_bad_boss'));assert.ok(blogFits(at('high_class'),'n1_grandparent'));
 const grad=at('low_class');grad.history=[...grad.history,{age:25,pathway:'college'}];assert.ok(blogFits(grad,'n1_project'));
 assert.ok(blogFits(at('low_class'),'n1_horn'));
});
