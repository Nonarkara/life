import test from 'node:test';
import assert from 'node:assert/strict';
import {foreknowledgeForChapter,formatForeknowledge,branchTradeoffs,sameBirthEchoes,rememberedLeagueWinner,extractMilestones} from '../../dist/course/replay-echoes.js';
import {newLife,configureLife,begin,live,replay} from '../../dist/course/sim.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {recordLife,lifeId} from '../../dist/course/lives.js';
import {encodeBirth} from '../../dist/course/birthcode.js';

function playToEnd(state,effort){
 let s=effort?{...state,effort}:state;
 for(let guard=0;guard<120&&s.stage!=='recap';guard++){
  if(s.story?.pending){
   const sc=encounterById(s.story.pending.id);
   const opt=sc?.options?.[0];
   s=opt?resolveEncounter(s,opt.id,0.5):{...s,story:{...s.story,pending:null}};
   continue;
  }
  const pivots=pendingPivots(s);
  if(pivots.length){
   const p=pivots[0],opts=openOptions(p,s);
   s=opts.length?applyPivot(s,p,opts[0].id):s;
   continue;
  }
  const next=live(effort?{...s,effort}:s);
  if(next===s)break;
  s=next;
 }
 return s;
}

function memoryStorage(){
 const map=new Map();
 return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
}

test('foreknowledgeForChapter stays silent on first life and quiet chapters',()=>{
 const first={stage:'review',age:25,birth:{birthYear:1970},previous:null};
 assert.equal(foreknowledgeForChapter(first),null);
 const quiet={stage:'review',age:25,birth:{birthYear:1970},previous:{history:[{from:25,age:30,event:'An ordinary five years.',economy:{contractions:[]}}]}};
 assert.equal(foreknowledgeForChapter(quiet),null);
});

test('foreknowledgeForChapter recalls contractions with calendar year and major shocks',()=>{
 const state={
  stage:'review',age:25,intake:{birthYear:1970},birth:{birthYear:1970},
  previous:{
   history:[
    {from:25,age:30,event:'Floodwater damages the family home. Repairs take money and time.',economy:{contractions:[27]}}
   ],
   story:{seen:[]}
  }
 };
 const cue=foreknowledgeForChapter(state);
 assert.ok(cue);
 assert.equal(cue.from,25);
 assert.equal(cue.to,30);
 assert.equal(cue.items.length,2);
 assert.equal(cue.items[0].kind,'downturn');
 assert.equal(cue.items[0].year,1997);
 assert.equal(cue.items[1].kind,'flood');
 const text=formatForeknowledge(cue);
 assert.match(text,/25–30/);
 assert.match(text,/1997/);
 assert.match(text,/Floodwater/);
});

test('branchTradeoffs surfaces what this branch left behind and what it found instead',()=>{
 const prev={
  age:75,
  story:{flags:{married:25,parent:28},seen:[]},
  finance:{purchases:[{key:'house',age:35,cost:300000,hours:0}]},
  history:[{from:20,age:25,pathway:'college'},{from:25,age:30,pathway:'college'}]
 };
 const curr={
  age:80,
  story:{flags:{},seen:[]},
  finance:{purchases:[]},
  history:[{from:20,age:25,pathway:'work'},{from:25,age:30,pathway:'work'}],
  previous:prev
 };
 const diff=branchTradeoffs(curr);
 assert.ok(diff);
 assert.ok(diff.lost.includes('a partner'));
 assert.ok(diff.lost.includes('a child'));
 assert.ok(diff.lost.includes('a home of your own'));
 assert.equal(diff.yearsGap,5);
 assert.ok(diff.gained.length>=1);
});

test('sameBirthEchoes groups 2+ runs of the same birth and ignores other births',()=>{
 const storage=memoryStorage();
 const intake={sex:'female',class:'working_class',birthYear:1985,attributes:{physique:2,iq:2,eq:2,craft:2,drive:2}};
 const s1=playToEnd(begin(configureLife(newLife(4242),intake)));
 assert.equal(s1.stage,'recap');
 assert.ok(encodeBirth(s1),'configured birth has a birth code');
 const lives1=recordLife(storage,s1,{ikigai:64,now:1000});
 // Single run of this birth -> empty gallery (no clutter on first run)
 assert.deepEqual(sameBirthEchoes(lives1,s1),[]);

 // Different birth should not inflate same-birth echoes
 const other=playToEnd(begin(configureLife(newLife(9999),intake)));
 assert.equal(other.stage,'recap');
 recordLife(storage,other,{ikigai:52,now:1500});
 assert.deepEqual(sameBirthEchoes(recordLife(storage,s1,{ikigai:64,now:1000}),s1),[]);

 // Replay exact same birth with a different effort allocation
 const s2=playToEnd(begin(replay(s1)),{physique:0,iq:6,eq:2,craft:1,drive:1});
 assert.equal(s2.stage,'recap');
 assert.equal(encodeBirth(s1),encodeBirth(s2));
 assert.notEqual(lifeId(s1),lifeId(s2));
 const lives2=recordLife(storage,s2,{ikigai:71,now:2000});
 const echoes=sameBirthEchoes(lives2,s2);
 assert.equal(echoes.length,2);
 assert.equal(echoes[0].current,true);
 assert.equal(echoes[0].runNumber,2);
 assert.equal(echoes[0].ikigai,71);
 assert.equal(echoes[1].current,false);
 assert.equal(echoes[1].runNumber,1);
 assert.equal(echoes[1].ikigai,64);
 const later=lives2[0];
 const crowded=[...lives2,...[3,4,5,6,7].map(n=>({...later,id:'different-run-'+n,at:n*1000}))];
 const olderEnding=sameBirthEchoes(crowded,s1);
 assert.equal(olderEnding.length,6);
 assert.ok(olderEnding.some(r=>r.current&&r.runNumber===1),'an older ending includes itself in the visible gallery');
});


test('a wait is not a marriage, a plot of land is not a home, and a recorded shared purchase is',()=>{
 const life={history:[{pivots:[{pivot:'partner-choice',choice:'wait',station:25,flags:{}}]}],finance:{purchases:[{key:'land'}]}};
 assert.equal(extractMilestones(life).partner,false);
 assert.equal(extractMilestones(life).home,false);
 life.history[0].pivots.push({pivot:'buy-house',choice:'share',flags:{sharedHouse:true}});
 assert.equal(extractMilestones(life).home,true);
});

test('a learned league result survives replay even when the player stayed out',()=>{
 const pivot={league:2015,station:40};
 const state={age:40,previous:{history:[{from:40,age:45,event:'You put a tenth of your savings on a club outside last year’s top three for 2015–16.'}]}};
 assert.equal(rememberedLeagueWinner(state,pivot),null);
 state.previous.history.push({from:45,age:50,event:'Leicester City won the 2015–16 league. Your bet came in, and paid back more than you staked.'});
 assert.equal(rememberedLeagueWinner(state,pivot),'Leicester City');
 assert.equal(rememberedLeagueWinner(state,{...pivot,league:2016}),null);
 assert.equal(rememberedLeagueWinner({...state,previous:null},pivot),null);
 state.previous.history.at(-1).event='Leicester City won the 2015–16 league. You had stayed out of it.';
 assert.equal(rememberedLeagueWinner(state,pivot),'Leicester City');
});
