// Guards from the 15 Nov 2026 playtest: the ending names the scene that really broke the life,
// hardship stays playable, and the five years say what they did.
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {newLife,begin,live,configureLife,rand,brokeNow,CLASS_KEYS} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {translate} from '../../dist/course/i18n.js';
import {lifeArc} from '../../dist/course/life-verdict.js';
import {periodLine,lifeWarning} from '../../dist/course/period-ledger.js';

test('a childhood option does not show its reward before it is chosen',()=>{
 const src=readFileSync(new URL('../../dist/course/childhood-view.js',import.meta.url),'utf8'),options=src.slice(src.indexOf('for(const o of question.options)'));
 assert.ok(!options.slice(0,options.indexOf('options.append(b)')).includes('changes('));
 assert.ok(src.includes("changes(result.effects)"),'the result card still shows what the choice did');
});

test('scenes no longer assume a motorbike, a paid-for house or a family job',()=>{
 const all=['life-tragedies.js','pivots.js','tragedy-copy.js','history-copy.js'].map(f=>readFileSync(new URL('../../dist/course/'+f,import.meta.url),'utf8')).join('\n');
 for(const gone of ['stolen by boat','everything you have ever paid for','still working for your family'])assert.ok(!all.includes(gone),gone);
 for(const line of ['Forty days upstairs. What was left downstairs went out with the water.','You are twenty and the family still counts on you. The people who own the oil press in town have sent an aunt to speak to them about you. Under the rice tin there is a letter from a college in Bangkok.'])
  for(const lang of ['th','zh-CN','ja','ko'])assert.notEqual(translate(line,lang),line,lang+' · '+line.slice(0,30));
});

const play=(seed,cls,birthYear)=>{let s=begin(configureLife(newLife(seed),{class:cls,sex:'male',birthYear}));const steps=[];
 const settle=()=>{for(let n=0;n<12;n++){const list=pendingPivots(s);if(!list.length)break;const q=list[0],open=openOptions(q,s),next=applyPivot(s,q,open[Math.floor(rand(seed,s.age,'t'+q.id)*open.length)].id);if(next===s)break;s=next;}
  if(s.story?.pending){const e=encounterById(s.story.pending.id),open=e.options.filter(o=>choiceAvailable(s,o)),list=open.length?open:e.options;s=resolveEncounter(s,list[Math.floor(rand(seed,s.age,'t'+e.id)*list.length)].id,.5);}};
 settle();for(let g=0;g<30&&s.stage==='review'&&s.age<80;g++){const before=s,next=live(s);if(next===s)break;steps.push([before,next]);s=next;settle();}return {s,steps};};
const lives=[];for(const cls of CLASS_KEYS)for(const by of [1949,1970,1981,1990])for(let i=1;i<=25;i++)lives.push(play(i*7919+by+CLASS_KEYS.indexOf(cls)*104729,cls,by));

test('the twist names a scene met at the low review that cost wellbeing, or nothing',()=>{
 // resolveEncounter writes an answer into the row of the review it was given at.
 const row=(age,wellbeing)=>({age,wellbeing,health:80,cash:1000}),rows=[row(10,70),row(15,70),row(20,70),row(25,30),row(30,30)];
 const seen=(...list)=>({history:rows,story:{seen:list.map(([id,age,wellbeing])=>({id,age,effects:{wellbeing}}))}});
 const arc=lifeArc(seen(['flood',20,-12],['small',25,-5],['funeral',25,-30]),id=>id);
 assert.equal(arc.twist.age,25);assert.equal(arc.twist.what,'funeral');
 assert.equal(lifeArc(seen(['flood',20,-12],['kind',25,3]),id=>id).twist.what,null,'an earlier scene and a kind one are not blamed');
 assert.equal(lifeArc(seen(['slight',25,-2]),id=>id).twist.what,null,'a scratch is not what broke it');
});
test('in played lives the named twist is always a costly scene from the low review',()=>{
 let named=0;for(const {s} of lives){const arc=lifeArc(s,id=>id);if(!arc?.twist?.what)continue;named++;const e=s.story.seen.find(x=>x.id===arc.twist.what);assert.ok(e.age>arc.twist.age-5&&e.age<=arc.twist.age);assert.ok(e.effects.wellbeing<=-4);}
 assert.ok(named>20,'named '+named);
});

test('low wellbeing and no money are warnings with a playable next chapter',()=>{
 let broke=0,low=0;
 for(const {steps} of lives)for(const [before,after] of steps){
  assert.doesNotMatch(after.death?.cause??'',/money reached zero|mind reached zero/);
  const warning=lifeWarning(before)??'';
  if(!after.death&&after.stage==='review'&&brokeNow(before.finance)&&brokeNow(after.finance)){
   assert.match(warning,/owe ฿[\d,]+ and have nothing set aside/);
   broke++;
  }
  if(!after.death&&after.stage==='review'&&after.wellbeing===0&&/wellbeing is almost at zero/.test(warning))low++;
 }
 assert.ok(broke>0,'played through sustained debt');
 assert.ok(low>0,'played through sustained low wellbeing');
});

test('the warning and the ledger are wired to the screen',()=>{
 const src=f=>readFileSync(new URL('../../dist/course/'+f,import.meta.url),'utf8');
 assert.ok(src('life-plan.js').includes("el('p','plan-key plan-warning',warn)"));
 assert.ok(src('game.js').includes("moving?(periodLine(state,travel.to,t)??"));
 assert.ok(src('console.css').includes('.plan-key.plan-warning{'));
});

test('the five years say what they earned, cost and did to the person',()=>{
 let adult=0,child=0;
 for(const {steps} of lives.slice(0,60))for(const [before,after] of steps){if(after.death)continue;const line=periodLine(before,after);
  if(after.finance&&before.age>=20){adult++;assert.match(line,/^Earned −?฿[\d,]+, spent −?฿[\d,]+\./);if(after.finance.debt>0)assert.match(line,/Debt is now ฿[\d,]+\./);}
  if(!before.finance&&after.finance){child++;assert.match(line,/From fifteen the money shown is your own: −?฿[\d,]+\./);}
  if(Math.round(before.wellbeing)!==Math.round(after.wellbeing))assert.match(line,new RegExp('Wellbeing '+Math.round(before.wellbeing)+' → '+Math.round(after.wellbeing)+'\\.'));
 }
 assert.ok(adult>0&&child>0);assert.equal(periodLine(null,null),null);
 const last=lives.find(l=>l.s.death&&l.steps.length).steps.at(-1);assert.equal(periodLine(last[0],last[1]),null,'a stretch that ends the life is not given away');
 assert.equal(translate('Earned {x}, spent {y}.','th'),'ได้เงิน {x} ใช้ไป {y}');
});
