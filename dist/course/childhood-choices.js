// Small choices inside inherited circumstances. These do not allocate DNA or an adult career.
import {birthYearOf} from './thai-history.js';
const option=(id,label,note,effects,symbol)=>({id,label,note,effects,symbol});
export const CHILD_CHOICES=[
 {age:6,title:'Your first small choices',context:'School, play and helping at home all ask for your time.',options:[
  option('school','Keep time for school and play','You practised making room for lessons and play.',{skills:{iq:1},wellbeing:1},'book'),
  option('help','Help at the family stall after school','You helped at the stall. The household gained a little money, and you had less time to play.',{cash:200,wellbeing:-1,skills:{drive:1}},'tools'),
  option('farm','Help sort the rice after school','You helped sort the rice before dark. There was less time to play.',{wellbeing:-1,skills:{drive:1}},'tools'),
  option('chores','Take a turn with the chores','You got the chores done before play. Someone else had a little less to do.',{skills:{drive:1,eq:1}},'home'),
  option('ask','Ask an adult for help with the difficult bits','You asked for help instead of carrying the problem alone.',{skills:{eq:1},wellbeing:1},'people')]},
 {age:7,title:'Someone is left out of the game',context:'A child watches from the edge of the playground.',options:[
  option('invite','Invite them to join','You made room for another child.',{skills:{eq:1},wellbeing:1},'people'),
  option('rules','Teach them the rules first','You practised explaining something you knew.',{skills:{iq:1,eq:1}},'book'),
  option('play','Keep playing with your usual friends','You stayed with the people you already knew.',{wellbeing:1},'heart'),
  option('torch','Go out with the torch','You came home muddy, with enough for a meal.',{cash:100,skills:{physique:1}},'tools'),
  option('story','Stay in with your grandmother','She told the one about the well again.',{skills:{eq:1},wellbeing:1},'people')]},
 {age:8,title:'A free afternoon',context:'There is time for one thing before the family needs you back.',options:[
  option('bike','Practise riding a bicycle','You practised your balance in the lane.',{skills:{physique:1},health:1},'bicycle'),
  option('draw','Draw the things you noticed today','You gave your observations a shape.',{skills:{craft:1},wellbeing:1},'art'),
  option('read','Borrow a book from the library','You found a story beyond your own street.',{skills:{iq:1}},'book'),
  option('share','Buy one and share it','You got half, and your cousin remembered.',{skills:{eq:1},wellbeing:1},'people'),
  option('keep','Buy one and keep it','It was very cold and it was gone very quickly.',{wellbeing:1},'heart'),
  option('coin','Keep the coin','You kept the coin in a tin for a while.',{cash:50,skills:{drive:1}},'money')]},
 {age:9,title:'Learning what matters to you',context:'A harder lesson, a friend and a job at home compete for the same afternoon.',options:[
  option('lesson','Work on the difficult lesson','You practised staying with something difficult.',{skills:{iq:1,drive:1}},'book'),
  option('friend','Make time for your friend','You practised listening to someone else.',{skills:{eq:1},wellbeing:1},'people'),
  option('home','Finish the work at home','You learned to finish something others depended on.',{skills:{drive:1},cash:100},'home'),
  option('carry','Get up and carry it','You walked behind her in the dark with the food getting heavier.',{skills:{eq:1,drive:1}},'home'),
  option('bed','Stay in bed','She went alone. Nobody said anything about it at breakfast.',{wellbeing:1},'heart')]}
];
// A historical childhood asks about the place it is lived in. Options stay on their year's
// question so old saves and records keep their lookups.
const RURAL=['a rice-farming household','a fishing household'],TOWN=['a market-stall household','a household in a riverside community'];
const ALT={
 7:{when:s=>RURAL.includes(s.birth.home),title:'Frogs after the rain',context:'The field is full of frogs tonight, and the torch is yours if you want it.',ids:['torch','story']},
 8:{when:s=>TOWN.includes(s.birth.home),title:'The bell on the soi',context:'The ice-cream cart is coming down the soi. You have one coin, and a younger cousin is looking at it.',ids:['share','keep','coin']},
 9:{when:s=>s.seed%2===0,title:'Before light',context:'Your grandmother wants someone to carry the food to the monks before it is light.',ids:['carry','bed']}
};
const ALT_IDS=Object.values(ALT).flatMap(a=>a.ids);
const shaped=(state,q)=>{const a=ALT[q.age];if(birthYearOf(state)!==null&&a?.when(state))return {...q,title:a.title,context:a.context,options:q.options.filter(o=>a.ids.includes(o.id))};return {...q,options:q.options.filter(o=>!ALT_IDS.includes(o.id))};};
export function pendingChildChoice(state,age){
 if(state.stage!=='birth')return;
 const question=CHILD_CHOICES.find(q=>q.age>=(state.childhood?.startsAt??6)&&q.age<=age&&!(state.childhood?.choices??[]).some(r=>r.age===q.age));
 if(question?.age!==6)return question&&shaped(state,question);
 const home=state.birth.home;
 const work=home==='a market-stall household'?'help':home==='a rice-farming household'?'farm':'chores';
 return {...question,options:question.options.filter(option=>['school',work,'ask'].includes(option.id))};
}
export function nextChildAge(state){return CHILD_CHOICES.find(q=>q.age>=(state.childhood?.startsAt??6)&&!(state.childhood?.choices??[]).some(r=>r.age===q.age))?.age??10;}
export function chooseChild(state,age,id){
 const q=pendingChildChoice(state,age);if(!q||q.age!==age)return state;const o=q.options.find(o=>o.id===id);if(!o)return state;
 const childhood=state.childhood??{origin:{cash:state.cash,health:state.health,wellbeing:state.wellbeing},choices:[]},skills={...state.skills},e=o.effects;
 for(const[k,v]of Object.entries(e.skills??{}))skills[k]+=v;
 return {...state,progressAge:age,cash:state.cash+(e.cash??0),health:Math.max(0,Math.min(100,state.health+(e.health??0))),wellbeing:Math.max(0,Math.min(100,state.wellbeing+(e.wellbeing??0))),skills,childhood:{...childhood,awaiting:age,choices:[...childhood.choices,{age,choice:id,note:o.note}]}};
}
export function skipChildIntro(state){return {...state,childhood:{...(state.childhood??{origin:{cash:state.cash,health:state.health,wellbeing:state.wellbeing},choices:[]}),skipped:true}};}
export function validChildhood(state){const c=state.childhood;if(c===undefined)return true;if(!c||!c.origin||!['cash','health','wellbeing'].every(k=>Number.isFinite(c.origin[k]))||!Array.isArray(c.choices)||c.choices.length>4||c.skipped!==undefined&&typeof c.skipped!=='boolean'||c.startsAt!==undefined&&(!Number.isInteger(c.startsAt)||c.startsAt<6||c.startsAt>10))return false;if(c.awaiting!==undefined&&!c.choices.some(r=>r.age===c.awaiting))return false;return new Set(c.choices.map(r=>r?.age)).size===c.choices.length&&c.choices.every(r=>{const q=CHILD_CHOICES.find(q=>q.age===r?.age),o=q?.options.find(o=>o.id===r.choice);return o&&r.note===o.note&&r.age<=Math.max(state.age,state.progressAge??0);});}
export const CHILD_TUTORIAL=[
 ['One year, one carriage','Your family carries the first years. Watch how the world grows around you. The terminal is not promised.'],
 ['Get to know yourself','You holds your body, mood, skills and personality. These are game values, not test results.'],
 ['Money and time are different resources','Money pays for things. Free days make experiences possible. The bucket list spends both.'],
 ['Read the world around you','World shows the economy and the places that shape your choices. A crisis affects people differently.'],
 ['Choices leave a record','Plan holds your priorities. History keeps the consequences. Important decisions stop time until you choose.']
];

export const childYearSeconds=age=>age<5?10:3.5;

export function acknowledgeChild(state){if(state.childhood?.awaiting===undefined)return state;const {awaiting,...childhood}=state.childhood;return {...state,childhood};}
export function childReceipt(state){const c=state.childhood;if(c?.awaiting===undefined)return null;let health=c.origin.health,wellbeing=c.origin.wellbeing;
 for(const r of c.choices){const o=CHILD_CHOICES.find(q=>q.age===r.age)?.options.find(o=>o.id===r.choice);if(!o)continue;const h=Math.max(0,Math.min(100,health+(o.effects.health??0))),w=Math.max(0,Math.min(100,wellbeing+(o.effects.wellbeing??0)));if(r.age===c.awaiting)return {label:o.label,note:o.note,effects:{...o.effects,health:h-health,wellbeing:w-wellbeing}};health=h;wellbeing=w;}return null;
}
