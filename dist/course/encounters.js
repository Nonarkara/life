import {sellAll} from './investments.js';
import {choiceAvailable,personalFlow} from './finance.js';
import {mismatched,partnerNature,together} from './life-choices.js';
import {LESSONS} from './lessons.js';
// Authored narrative rules. These effects and eligibility windows are game design,
// not clinical, demographic or financial forecasts.
export const newStory=seed=>({people:{friend:seed%2?'Mali':'Niran',partner:seed%2?'Arun':'Dao'},flags:{},seen:[],pending:null});
const option=(id,label,effects,outcome)=>({id,label,...effects,outcome});
export const ENCOUNTERS=[
 {id:'friend',category:'connection',min:15,max:20,priority:1,title:'An invitation after school',prompt:'{friend} asks you to spend the afternoon together. The work at home can wait, but not disappear.',options:[
  option('join','Make time for a new friend',{cash:-300,wellbeing:3,flag:'friend'},'You and {friend} found time for each other. A friendship began.'),
  option('home','Go home and finish your project',{skills:{craft:1}},'You stayed home and finished something that had been waiting.'),
  option('together','Study together, then take a walk',{skills:{iq:1,eq:1},wellbeing:1,flag:'friend'},'You and {friend} worked through a difficult lesson, then talked on the walk home. Neither part of the afternoon lasted as long as you wanted.'),
  option('crush','Tell your crush you would like to spend time together',{skills:{eq:2},wellbeing:2,flag:'schoolCrush'},'You made room for a school-age crush and practised listening and boundaries. Your unfinished work still needed another afternoon.') ]},
 {id:'bully',category:'connection',min:15,max:20,priority:1,title:'A boy who does not let up',prompt:'An older boy from another class takes your book, then your lunch, then your patience. The corridor is long and the teacher is far away.',options:[
  option('push','Push him back',{health:-5,wellbeing:-3,flag:'foughtBack'},'You hit back. It ended in seconds and cost you for weeks.'),
  option('teacher','Tell a teacher',{wellbeing:-1,skills:{eq:1}},'You told a teacher. It helped less than you hoped and less than you feared.'),
  option('endure','Say nothing and take it',{wellbeing:-4,skills:{iq:1}},'You said nothing and carried it home. It sat with you the whole way.'),
  option('together','Ask someone to walk home with you',{wellbeing:2,skills:{eq:1}},'You asked someone to walk home with you. The corridor was shorter that way.') ]},
 {id:'project',category:'work',min:20,max:45,title:'A small idea needs a beginning',prompt:'There is room for a small creative project. Materials cost money; finding an audience will take time.',eligible:s=>s.effort.craft>=2||s.pathway==='independent',options:[
  option('start','Start with what you have',{cash:-1200,skills:{craft:2},flag:'project'},'You began a project without knowing who would ever see it.'),
  option('save','Keep the idea for another time',{wellbeing:1},'You kept the sketch and protected your household buffer.') ]},
 {id:'love',category:'connection',min:20,max:40,title:'Someone you want to know',prompt:'You and {partner} keep finding reasons to talk. They ask whether you would like to go on a date.',options:[
  option('date','Say yes to a date',{cash:-500,wellbeing:3,flag:'dating'},'You and {partner} began seeing each other.'),
  option('single','Keep this part of life open',{wellbeing:1},'You chose to stay single for now. Other parts of life still mattered.') ]},
 {id:'commitment',category:'connection',min:30,max:50,priority:1,title:'A shared future',prompt:'You and {partner} have been together for years. Both of you are ready to talk about marriage.',eligible:s=>s.story.flags.dating!==undefined&&s.age-s.story.flags.dating>=5,options:[
  option('marry','Hold a small wedding',{cash:-6000,wellbeing:4,flag:'married',marker:'married'},'You and {partner} married, with a small gathering of people close to you.'),
  option('together','Keep your commitment without a wedding',{wellbeing:3,flag:'committed'},'You and {partner} chose a shared life without a wedding.'),
  option('apart','Stay together, each caring for your own parents',{wellbeing:2,flag:'apart'},'You and {partner} stayed committed while each of you looked after your own parents, in two homes.') ]},
 {id:'parenthood',category:'family',min:35,max:50,title:'Room for another person',prompt:'You and {partner} have talked about raising a child. Parenthood would change your household and commitments.',eligible:s=>s.story.flags.married!==undefined||s.story.flags.committed!==undefined,options:[
  option('raise','Begin the path to parenthood',{cash:-4000,wellbeing:3,flag:'parent'},'You and {partner} began raising a child together. Daily routines changed around the child.'),
  option('two','Keep the family as it is',{wellbeing:2},'You chose a life without children of your own. Your home was still a family.') ]},
 {id:'project_return',category:'work',min:30,max:65,title:'The work finds a doorway',prompt:'Years after you started, someone offers a small public space for your work. There is no promise of sales.',eligible:s=>s.story.flags.project!==undefined&&s.age-s.story.flags.project>=10,options:[
  option('show','Share the work',{cash:-1000,wellbeing:3,flag:'exhibited',uncertain:true},'You put the work in front of other people. The response became part of its story.'),
  option('private','Keep making it privately',{skills:{craft:2},wellbeing:2},'You kept making the work for its own sake, away from an audience.') ]},
 {id:'flood_help',category:'family',min:30,max:30,priority:1,title:'After the floodwater',prompt:'The damage is already in your household account. Your neighbours are clearing the shared lane.',options:[
  option('help','Join the clean-up',{wellbeing:3,skills:{eq:1}},'You helped clear the lane. The repairs were still hard, but the neighbours knew one another better.'),
  option('home','Stay with your household',{wellbeing:2},'You stayed close to home and helped your household find its feet again.') ]},
 {id:'friend_care',category:'connection',min:40,max:60,title:'A familiar voice asks for help',prompt:'{friend} is going through a difficult time and asks if you can come over.',eligible:s=>s.story.flags.friend!==undefined,options:[
  option('visit','Go and sit with your friend',{cash:-300,wellbeing:2,flag:'supportedFriend'},'You sat with {friend}. You could not fix everything, but you kept showing up.'),
  option('call','Be honest about your limits and call',{wellbeing:1},'You told {friend} what you could manage and stayed in touch by phone.') ]},
 {id:'child_school',category:'family',min:45,max:65,title:'Your child has a new question',prompt:'Your child is beginning to imagine a future of their own. They ask you to help them try something unfamiliar.',eligible:s=>s.story.flags.parent!==undefined&&s.story.flags.childLost===undefined&&s.age-s.story.flags.parent>=10,options:[
  option('materials','Pay for the materials and learn together',{cash:-2000,wellbeing:3},'You and your child learned something neither of you knew before.'),
  option('walk','Make time to listen and plan together',{wellbeing:2,skills:{eq:1}},'You listened to what your child wanted, then found a first step you could manage together.') ]},
 {id:'health_rest',category:'health',min:40,max:75,priority:1,title:'Give recovery some room',prompt:'A health setback has already interrupted this period. The next step is making room for recovery.',eligible:s=>s.history.at(-1)?.event.includes('health setback'),options:[
  option('support','Pay for practical help while you recover',{cash:-3000,health:4,wellbeing:1},'Practical help gave you room to rest. Recovery became part of the plan.'),
  option('rest','Reduce commitments and accept help',{health:2,wellbeing:1},'You reduced your commitments and let other people help while you rested.') ]},
 {id:'remember',category:'family',min:55,max:70,priority:1,title:'What you want to keep',prompt:'A parent has died. There is no correct way to make this loss fit into your life.',eligible:s=>/father dies|mother dies/.test(s.history.at(-1)?.event??''),options:[
  option('stories','Gather and tell stories',{wellbeing:2,flag:'remembered'},'You gathered stories about your parent. Grief remained, alongside memories of ordinary days.'),
  option('quiet','Keep a quieter remembrance',{wellbeing:2,flag:'remembered'},'You kept a small remembrance in your own way. There was no need to perform your grief.') ]},
 {id:'mentor',category:'work',min:60,max:75,title:'Someone asks how you learned',prompt:'A younger neighbour wants to learn something you have spent years doing.',options:[
  option('teach','Make room to teach',{wellbeing:3,flag:'mentor'},'You passed on something you had learned. A part of your work now belonged to someone else.'),
  option('rest','Protect your own time',{wellbeing:2},'You chose a quieter rhythm. Your years did not need one more achievement.') ]},
 {id:'friend_late',category:'connection',min:65,max:75,title:'The afternoon returns',prompt:'{friend} suggests spending an afternoon together, much as you did when you first met.',eligible:s=>s.story.flags.friend!==undefined,options:[
  option('meet','Meet your old friend',{cash:-200,wellbeing:3},'You and {friend} spent another afternoon together. You remembered how the friendship began.'),
  option('letter','Send a long letter instead',{wellbeing:2},'You wrote to {friend}, remembering the ordinary afternoon when you first became friends.') ]}
];
// The big forks. Each is offered once; consequences unfold over later periods.
ENCOUNTERS.push(
 {id:'mismatch',category:'work',min:25,max:40,priority:1,title:'Is this the work you trained for?',prompt:'Years into your field, the days feel wrong. You can retrain, stay, or leave to build something of your own.',eligible:s=>mismatched(s),options:[
  option('stay','Stay and make it work',{wellbeing:-1},'You stayed. The pay held; the days still felt heavy.'),
  option('switch','Retrain in something closer to you',{cash:-20000,skills:{craft:1,iq:1},flag:'switched'},'You started again in a field that fit you better. It cost time and savings.'),
  option('own','Leave to build your own venture',{cash:-10000,flag:'founder',pathway:'independent'},'You left to build something of your own. The income would be uneven.') ]},
 {id:'hard_marriage',category:'connection',min:35,max:65,priority:1,title:'The home has become hard',prompt:'Life with {partner} has turned into constant conflict and control. What you could not see at the start is clear now.',eligible:s=>together(s)&&partnerNature(s)==='difficult',options:[
  option('endure','Stay for now',{wellbeing:-2},'You stayed. The conflict stayed too.'),
  option('counsel','Try counselling together',{cash:-5000,flag:'counselled'},'You and {partner} went to counselling. Whether it would hold was not yet known.'),
  option('leave','Leave and rebuild on your own',{cash:-20000,wellbeing:-3,flag:'separated'},'You left. The first years alone were costly and quiet, and they were yours.') ]},
 {id:'crossroads',category:'work',min:30,max:50,title:'A crossroads at work',prompt:'Your job is steady but narrow. You could stay, move to another employer, quit to study further, or start your own venture.',eligible:s=>['work','vocational'].includes(s.pathway??s.history.at(-1)?.pathway)&&s.story.flags.founder===undefined,options:[
  option('stay','Stay where you are',{wellbeing:1},'You stayed. Steady work left room for the rest of life.'),
  option('change','Move to another employer',{flag:'changedJob'},'You changed employers. The new pay and colleagues were a gamble.'),
  option('study','Quit to study for a graduate degree',{cash:-60000,skills:{iq:3},flag:'graduate',pathway:'college'},'You quit to study again. You could also choose to study abroad by changing where you live.'),
  option('own','Start your own venture',{cash:-15000,flag:'founder',pathway:'independent'},'You started your own venture. Some years would pay; many would not.') ]},
 {id:'dog',category:'family',min:25,max:60,title:'A dog that needs a home',prompt:'A neighbour has a young dog who needs a home. A dog costs money and time, and gives back every day.',options:[
  option('not','Not now',{},'You let someone else give the dog a home.'),
  option('adopt','Bring the dog home',{cash:-3000,wellbeing:3,flag:'dog'},'You brought the dog home. Mornings now began with a walk.') ]}
);
ENCOUNTERS.push(...LESSONS);
const remembrance=ENCOUNTERS.find(e=>e.id==='remember');remembrance.max=55;
ENCOUNTERS.push({...remembrance,id:'remember_mother',min:70,max:70});
const byId=new Map(ENCOUNTERS.map(e=>[e.id,e]));
export const encounterById=id=>byId.get(id);
export function eligibleEncounters(state){
 if(state.stage!=='review'||state.age<15||!state.story||state.story.pending||state.story.seen.some(e=>e.age===state.age))return [];
 const seen=new Set(state.story.seen.map(e=>e.id));
 return ENCOUNTERS.filter(e=>state.age>=e.min&&state.age<=e.max&&!seen.has(e.id)&&(!e.eligible||e.eligible(state)));
}
export function offerEncounter(state,roll,keep=()=>true){
 const eligible=eligibleEncounters(state).filter(keep);if(!eligible.length)return state;
 const priority=Math.min(...eligible.map(e=>e.priority??2));let pool=eligible.filter(e=>(e.priority??2)===priority);
 const last=state.story.seen.at(-1),fresh=pool.filter(e=>e.category!==byId.get(last?.id)?.category);if(fresh.length)pool=fresh;
 const selected=pool[Math.min(pool.length-1,Math.floor(roll*pool.length))];
 return {...state,story:{...state.story,pending:{id:selected.id,age:state.age,candidates:eligible.map(e=>e.id)}}};
}
export function storyText(text,story){return text.replaceAll('{friend}',story.people.friend).replaceAll('{partner}',story.people.partner);}
export function resolveEncounter(state,choiceId,roll){
 const pending=state.story?.pending,encounter=byId.get(pending?.id),choice=encounter?.options.find(o=>o.id===choiceId);
 if(!choice||!choiceAvailable(state,choice)||state.stage!=='review'||pending.age!==state.age||state.story.seen.some(e=>e.id===pending.id))return state;
 let cash=choice.cash??0;let outcome=choice.outcome;
 if(choice.uncertain){if(roll<.5){cash+=4500;outcome+=' Someone bought a piece of your work.';}else outcome+=' There were no sales this time.';}
 const cap=n=>Math.max(0,Math.min(100,n));
 const effects={cash,health:cap(state.health+(choice.health??0))-state.health,wellbeing:cap(state.wellbeing+(choice.wellbeing??0))-state.wellbeing,skills:choice.skills??{}};
 const flags={...state.story.flags};if(choice.flag)flags[choice.flag]=state.age;
 const seen=[...state.story.seen,{id:pending.id,age:state.age,choice:choice.id,outcome:storyText(outcome,state.story),effects}];
 const funded=state.finance?personalFlow(state,'encounter:'+state.age+':'+pending.id,Math.max(0,choice.cash??0)+(choice.uncertain&&roll<.5?4500:0),Math.max(0,-(choice.cash??0))):state;
 const next={...state,...(choice.pathway?{pathway:choice.pathway}:{}),finance:funded.finance,cash:state.finance?state.cash:state.cash+cash,health:cap(state.health+effects.health),wellbeing:cap(state.wellbeing+effects.wellbeing),skills:{...state.skills},story:{...state.story,flags,seen,pending:null}};
 for(const[key,value]of Object.entries(effects.skills))next.skills[key]+=value;
 const last=state.history.at(-1);
 next.history=[...state.history.slice(0,-1),{...last,...(next.finance?{finance:{...(last.finance??{}),available:next.finance.available,reserve:next.finance.reserve,debt:next.finance.debt}}:{}),cash:next.cash,health:next.health,wellbeing:next.wellbeing,event:last.event+' '+seen.at(-1).outcome,storySkills:{...effects.skills},events:[...(last.events??[]),{type:choice.marker??(encounter.category==='health'?'recovery':encounter.category==='work'?'project':'connection'),encounter:encounter.id}]}];
 return choice.sellAll?sellAll(next):next;
}
export function validStory(story,age,state){
 if(story===undefined)return true;
 if(state&&!Array.isArray(state.history))return false;
 const axes=['physique','iq','eq','craft','drive'];
 const effects=e=>e&&['cash','health','wellbeing'].every(k=>Number.isFinite(e[k]))&&e.skills&&Object.entries(e.skills).every(([k,v])=>axes.includes(k)&&Number.isInteger(v)&&v>=0);
 if(!story||!story.people||!['friend','partner'].every(k=>typeof story.people[k]==='string'&&story.people[k].length<40)||!story.flags||!Array.isArray(story.seen)||story.seen.length>ENCOUNTERS.length)return false;
 if(new Set(story.seen.map(e=>e?.id)).size!==story.seen.length||new Set(story.seen.map(e=>e?.age)).size!==story.seen.length)return false;
 if(!story.seen.every(e=>e&&byId.has(e.id)&&Number.isInteger(e.age)&&e.age>=byId.get(e.id).min&&e.age<=byId.get(e.id).max&&e.age<=age&&byId.get(e.id).options.some(o=>o.id===e.choice)&&typeof e.outcome==='string'&&effects(e.effects)))return false;
 if(state){
  const flags={};let previousAge=-1;
  for(const seen of story.seen){
   if(seen.age<=previousAge)return false;previousAge=seen.age;
   const row=state.history.find(r=>r.age===seen.age);if(!row)return false;
   const prior={...state,age:seen.age,effort:row.effort,pathway:row.pathway,history:state.history.filter(r=>r.age<=seen.age),story:{...story,flags,pending:null}};
   const entry=byId.get(seen.id);if(entry.eligible&&!entry.eligible(prior))return false;
   const flag=entry.options.find(o=>o.id===seen.choice).flag;if(flag)flags[flag]=seen.age;
  }
 }
 const expectedFlags=Object.fromEntries(story.seen.flatMap(e=>{const flag=byId.get(e.id).options.find(o=>o.id===e.choice).flag;return flag?[[flag,e.age]]:[]}));
 if(Object.keys(expectedFlags).length!==Object.keys(story.flags).length||Object.entries(expectedFlags).some(([key,value])=>story.flags[key]!==value))return false;
 if(story.pending===null)return true;
 const pending=story.pending;
 return !!pending&&byId.has(pending.id)&&pending.age===age&&!story.seen.some(e=>e.age===age||e.id===pending.id)&&Array.isArray(pending.candidates)&&pending.candidates.includes(pending.id)&&pending.candidates.every(id=>byId.has(id))&&(!state||eligibleEncounters({...state,story:{...story,pending:null}}).some(e=>e.id===pending.id));
}
