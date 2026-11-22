import test from 'node:test';
import assert from 'node:assert/strict';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {LEAGUE,LEAGUE_PIVOTS,leaguesDue,leagueFits} from '../../dist/course/league-bets.js';
import {pendingPivots,applyPivot,openOptions,pivotById} from '../../dist/course/pivots.js';
import {newLife,configureLife,begin,live} from '../../dist/course/sim.js';
import {phrases} from '../../dist/course/translations.js';

test('the table is the real record: known champions and outsiders',()=>{
 assert.equal(LEAGUE[2015][0],'Leicester City');assert.equal(LEAGUE[1988][0],'Arsenal');assert.equal(LEAGUE[1994][0],'Blackburn Rovers');assert.equal(LEAGUE[2024][0],'Liverpool');
 for(let y=1980;y<=2024;y++)assert.equal(new Set(LEAGUE[y]).size,3,String(y));
});
test('a bet pays only when the real champion matches, and pays once',()=>{
 const f=(y,p)=>({['lg'+y]:40,['lg'+y+'p']:p,['lg'+y+'a']:10000});
 assert.equal(leaguesDue(f(2015,4),40).length,0);assert.equal(leaguesDue(f(2015,4),50).length,0);
 assert.deepEqual(leaguesDue(f(2015,4),45).map(b=>b.gain),[50000]);
 assert.deepEqual(leaguesDue(f(2015,1),45).map(b=>b.gain),[-10000]);
 assert.deepEqual(leaguesDue(f(1988,2),45).map(b=>b.gain),[-10000]);
 assert.deepEqual(leaguesDue(f(1994,2),45).map(b=>b.gain),[20000]);assert.deepEqual(leaguesDue(f(1994,4),45).map(b=>b.gain),[-10000]);
 assert.equal(leaguesDue({},45).length,0);
});
test('every option id in a scene is unique and the outside pick stakes money',()=>{
 for(const p of LEAGUE_PIVOTS)assert.equal(new Set(p.options.map(o=>o.id)).size,p.options.length,p.id);
 let s=begin(configureLife(newLife(2*7919),{birthYear:1955}));
 const p=LEAGUE_PIVOTS.find(x=>x.id==='lg-1990-35');s={...s,age:35,stage:'review',pivots:[]};
 const r=applyPivot(s,p,'out');assert.equal(r.pivotFlags.lg1990p,4);assert.ok(r.pivotFlags.lg1990a>0);assert.equal(applyPivot(s,p,'stay').pivotFlags?.lg1990p,undefined);
});
test('a scene only fits a season inside the next five years of a person alive for it',()=>{
 const p=LEAGUE_PIVOTS.find(x=>x.id==='lg-1995-40');
 assert.ok(leagueFits(p,50000,1955));assert.ok(!leagueFits(p,50000,1950));assert.ok(!leagueFits(p,50000,1960));assert.ok(!leagueFits(p,100,1955));assert.ok(!leagueFits(p,50000,null));
});
test('lives meet it, answering stakes a tenth, and every text is translated',()=>{
 let met=0;
 for(let seed=1;seed<=80;seed++){let s=begin(configureLife(newLife(seed*7919),{birthYear:1955}));
  while(s.stage==='review'&&s.age<70){s=live(s);if(s.stage!=='review')break;
   for(const p of pendingPivots(s)){const os=openOptions(p,s);if(p.league){met++;assert.ok(pivotById(p.id));
   const noBet=applyPivot(s,p,'stay');
   assert.ok(!pendingPivots(noBet).some(p=>p.league),'passing must close the league question for this station');
   s=applyPivot(s,p,'c2');
   assert.ok(!pendingPivots(s).some(p=>p.league),'betting must close the league question for this station');assert.ok(s.pivotFlags['lg'+p.league+'a']>=0);assert.equal(s.pivotFlags['lg'+p.league+'p'],2);}
  else if(os.length)s=applyPivot(s,p,os[(seed+s.age)%os.length].id);}
   const ps=s.story?.pending;if(ps){const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,os[seed%os.length].id,.05);}
  }}
 assert.ok(met>=5,'met '+met);
 const have=new Set(phrases.map(r=>r[0]));
 for(const p of LEAGUE_PIVOTS.filter(p=>p.station===40))for(const t of [p.prompt,...p.options.flatMap(o=>[o.label,o.note,o.cost])])assert.ok(have.has(t),t);
});
