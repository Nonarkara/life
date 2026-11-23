// Replay memory & echoes (inspired by Ken Grimwood's Replay):
// 1. Earned foreknowledge: when replaying a birth, remember major shocks you already lived through in this chapter.
// 2. Branch tradeoffs ("what this branch left behind"): milestones that existed in the prior run of this birth but not here.
// 3. Echoes of this birth: side-by-side gallery of all completed lives sharing the exact same birth code.
import {encodeBirth} from './birthcode.js';
import {encounterById} from './encounters.js';
import {PATHWAYS} from './pathways.js';
import {albumSummary} from './album-summary.js';
import {lifeId} from './lives.js';
import {recordedLeagueWinner} from './league-bets.js';

const birthYearOf=state=>{
 const y=state?.intake?.birthYear??state?.birth?.birthYear;
 return Number.isInteger(y)?y:null;
};

const WORLD_PATTERNS=[
 {test:/Floodwater/i,kind:'flood',label:'Floodwater reached the family home'},
 {test:/father.*dies|dad.*dies/i,kind:'father',label:'Your father passed away in this chapter'},
 {test:/mother.*dies|mom.*dies/i,kind:'mother',label:'Your mother passed away in this chapter'},
 {test:/takes your savings/i,kind:'theft',label:'Someone you trusted took your savings'},
 {test:/accident leaves you/i,kind:'accident',label:'An accident put you out of work'},
 {test:/unexpected windfall/i,kind:'windfall',label:'An unexpected windfall arrived'}
];

export function foreknowledgeForChapter(state){
 const prev=state?.previous;
 if(!prev||!Array.isArray(prev.history)||state.stage!=='review')return null;
 const from=state.age;
 const prevRow=prev.history.find(r=>r.from===from)||prev.history.find(r=>r.age===from+5);
 if(!prevRow)return null;
 const to=prevRow.age??from+5;
 const by=birthYearOf(state);
 const items=[];
 const contractions=prevRow.economy?.contractions??[];
 if(contractions.length){
  const a=contractions[0];
  items.push({kind:'downturn',age:a,year:by!==null?by+a:null,label:'A downturn hit'});
 }
 const ev=typeof prevRow.event==='string'?prevRow.event:'';
 for(const pat of WORLD_PATTERNS){
  if(pat.test.test(ev)){items.push({kind:pat.kind,age:to,year:by!==null?by+to:null,label:pat.label});break;}
 }
 const harms=['accident','illness','dengue','fired','loss','heartbreak'];
 const shock=(prevRow.events??[]).filter(e=>e.origin==='life'&&harms.includes(e.type)&&e.age>from&&e.age<=to)
  .sort((a,b)=>a.age-b.age)[0];
 if(items.length<2&&shock)items.push({kind:'event',age:shock.age,year:by===null?null:by+shock.age,label:shock.title});
 if(items.length<2&&Array.isArray(prev.story?.seen)){
  const seen=prev.story.seen.find(e=>e.age===to&&encounterById(e.id)?.title);
  if(seen)items.push({kind:'scene',age:to,year:by!==null?by+to:null,label:encounterById(seen.id).title});
 }
 return items.length?{from,to,items}:null;
}

export function formatForeknowledge(cue,t=s=>s){
 if(!cue||!cue.items?.length)return '';
 const parts=cue.items.map(item=>{
  if(item.kind==='downturn'){
   return item.year
    ?t('A downturn hit at age {a} ({y})').replace('{a}',item.age).replace('{y}',item.year)
    :t('A downturn hit at age {a}').replace('{a}',item.age);
  }
  return item.kind==='event'?t('{event} at age {a}').replace('{event}',t(item.label)).replace('{a}',item.age):t(item.label);
 });
 return t('Remembered from your last life ({from}–{to}): {events}.')
  .replace('{from}',cue.from)
  .replace('{to}',cue.to)
  .replace('{events}',parts.join(' · '));
}

// The prior life can have seen the result without ever placing a bet.
export function rememberedLeagueWinner(state,pivot){
 if(pivot?.station!==state?.age||!pivot?.league)return null;
 for(const row of state.previous?.history??[]){
  if(row.age<=pivot.station)continue;
  const winner=recordedLeagueWinner(pivot.league,row.event);
  if(winner)return winner;
 }
 return null;
}

function collectFlags(life){
 const records=[...(life?.history??[]).flatMap(r=>r.pivots??[]),...(life?.pivots??[])];
 const flags=Object.assign({},...records.map(p=>p.flags),life?.story?.flags,life?.pivotFlags);
 for(const p of records){
  if(p.pivot==='partner-choice'&&['family','your-own'].includes(p.choice))flags.married??=p.station;
  if(p.pivot==='buy-house'&&['buy','share'].includes(p.choice))flags.ownsHouse??=true;
 }
 if(life?.story?.seen?.some(e=>e.id==='teen_parenthood'))flags.parent??=life.story.seen.find(e=>e.id==='teen_parenthood').age??20;
 return flags;
}

function primaryCalling(life){
 const counts=new Map();
 for(const r of life?.history??[]){
  if(r.from>=15&&r.from<60&&PATHWAYS[r.pathway]?.label){
   counts.set(r.pathway,(counts.get(r.pathway)??0)+1);
  }
 }
 let best=null,max=0;
 for(const [k,n] of counts){if(n>max){best=k;max=n;}}
 return best?PATHWAYS[best].label:null;
}

function hasHome(life){
 return !!life?.finance?.purchases?.some(p=>p.key==='house');
}

export function extractMilestones(life){
 const flags=collectFlags(life);
 return {
  partner:flags.married!==undefined||flags.committed!==undefined,
  child:flags.parent!==undefined,
  home:!!(flags.ownsHouse||flags.sharedHouse)||hasHome(life),
  calling:primaryCalling(life),
  age:life?.age??0
 };
}

export function branchTradeoffs(state){
 const prev=state?.previous;
 if(!prev||!Array.isArray(prev.history))return null;
 const a=extractMilestones(prev),b=extractMilestones(state);
 const lost=[],gained=[];
 if(a.partner&&!b.partner)lost.push('a partner');
 if(!a.partner&&b.partner)gained.push('a partner');
 if(a.child&&!b.child)lost.push('a child');
 if(!a.child&&b.child)gained.push('a child');
 if(a.home&&!b.home)lost.push('a home of your own');
 if(!a.home&&b.home)gained.push('a home of your own');
 if(a.calling&&a.calling!==b.calling)lost.push(a.calling);
 if(b.calling&&b.calling!==a.calling)gained.push(b.calling);
 const yearsGap=b.age-a.age;
 if(!lost.length&&!gained.length)return null;
 return {lost,gained,yearsGap};
}

export function sameBirthEchoes(lives,state,{limit=6}={}){
 if(!Array.isArray(lives)||!state)return [];
 const code=encodeBirth(state);
 if(!code)return [];
 const matching=lives.filter(e=>e&&e.code===code);
 if(matching.length<2)return [];
 const chronological=[...matching].sort((a,b)=>a.at-b.at);
 const runNum=new Map(chronological.map((e,i)=>[e.id,i+1]));
 const curId=lifeId(state);
 const newest=chronological.slice().reverse(),current=newest.find(e=>e.id===curId);
 const visible=newest.slice(0,limit);
 if(current&&limit>0&&!visible.includes(current))visible[limit-1]=current;
 return visible.map(e=>{
   const sum=albumSummary(e.album);
   const topPeriod=sum.periods.slice().sort((x,y)=>(y.to-y.from)-(x.to-x.from))[0]??null;
   return {
    id:e.id,
    runNumber:runNum.get(e.id)??1,
    current:e.id===curId,
    age:e.age,
    ended:!!e.ended,
    ikigai:Number.isFinite(e.ikigai)?e.ikigai:null,
    calling:topPeriod?.label??null,
    words:e.words||'',
    at:e.at
   };
  });
}
