// Fictional relationship branches. The seeded gates are game tuning.
import {rand} from './rand.js';

const readyToPropose=s=>typeof s.story.flags.dating==='number'&&s.age-s.story.flags.dating>=5;
export const proposesFirst=s=>!!s.intake?.class&&rand(s.seed,0,'proposal-direction')<.5;
const answerYes=s=>rand(s.seed,0,'proposal-answer')<.7;

export const RELATIONSHIP_FORKS=[
 {id:'teen_boundaries',category:'connection',min:15,max:15,priority:1,
  eligible:s=>!!s.intake?.class&&rand(s.seed,0,'teen-relationship')<.48,
  title:'Are you ready to go further?',
  prompt:'{partner} asks if you want to have sex. You had rehearsed the answer on the bus. Now you can only remember the bus number.',
  options:[
   {id:'wait',label:'Say you want to wait',flag:'teenWaited',wellbeing:1,outcome:'You asked for more time. The two of you sat together until the last bus came.'},
   {id:'talk',label:'Say you want to talk about boundaries and protection first',flag:'teenTalked',skills:{eq:1},outcome:'You talked through what each of you wanted. It got less awkward once you both stopped pretending it was easy.'},
   {id:'yes',label:'Say yes if you both feel ready',flag:'teenReady',outcome:'Before you parted, you agreed either of you could still change your mind.'}
  ]},
 {id:'teen_parenthood',category:'family',min:20,max:20,priority:-2,
  eligible:s=>typeof s.story.flags.teenReady==='number'&&['male','female'].includes(s.intake?.sex)&&rand(s.seed,0,'teen-care-story')<.2,
  title:'Who will make time for the baby?',
  prompt:'The baby arrived before either of you expected to be a parent. {partner} asks you to make a plan before school and work start again.',
  options:[
   {id:'share',label:'Take a regular turn caring for the baby',wellbeing:2,flag:'parent',outcome:'You took a regular shift with the baby. You and {partner} had to rearrange school, work and sleep.'},
   {id:'separate',label:'Live separately and arrange support',cash:-2000,flag:'parent',outcome:'You lived apart and arranged help. Paying for things and being there turned out to be two different promises.'},
   {id:'away',label:'Leave the arrangements to your family for now',wellbeing:-4,flag:'careDeferred',outcome:'Your family carried the care. They kept your place at the table, and the conversation you owed them.'}
  ]},
 {id:'care_returns',category:'family',min:25,max:30,priority:-2,
  eligible:s=>typeof s.story.flags.careDeferred==='number'&&s.story.flags.careDeferred<s.age,
  title:'Will you show up this time?',
  prompt:'The family cannot cover every afternoon anymore. {partner} asks which days you can collect your child.',
  options:[
   {id:'show',label:'Commit to two afternoons a week',flag:'parent',wellbeing:2,outcome:'You put pickup days on the calendar. At first your child checked the gate twice.'},
   {id:'call',label:'Arrange other care and keep calling',wellbeing:-2,outcome:'Someone else did the pickup. You learned about the new school shoes over the phone.'}
  ]},
 {id:'proposal_first',category:'connection',min:30,max:50,priority:1,
  eligible:s=>readyToPropose(s)&&proposesFirst(s),
  title:'Ask {partner} to marry you?',
  prompt:'You brought the ring. Now {partner} is telling you about a job in another province and you are trying to pay attention.',
  options:[
   {id:'ask',label:'Ask them to marry you',outcome:'{partner} said no. You took the long way home and had to think about what came next.',variant:s=>answerYes(s)
    ?{flag:'committed',wellbeing:4,outcome:'{partner} said yes. Then you talked about whose work would have to move.'}
    :{flag:'proposalTurnedDown',wellbeing:-4,outcome:'{partner} said no. You took the long way home and had to think about what came next.'}},
   {id:'wait',label:'Talk about the job first',flag:'proposalDeferred',wellbeing:1,outcome:'You put the ring away and asked about the job. It was the first time the two of you had talked plainly about moving.'}
  ]},
 {id:'proposal_wedding',category:'connection',min:35,max:55,priority:-2,
  eligible:s=>s.story.seen.some(e=>e.id==='proposal_first'&&e.choice==='ask'&&e.age<s.age)&&typeof s.story.flags.committed==='number'&&s.story.flags.married===undefined,
  title:'Hold a wedding or keep saving?',
  prompt:'{partner} brings home a wedding estimate. You had been saving that money for a place of your own.',
  options:[
   {id:'marry',label:'Hold a small wedding',cash:-6000,flag:'married',marker:'married',wellbeing:3,outcome:'You and {partner} married, with a small gathering of people close to you.'},
   {id:'save',label:'Keep your commitment without a wedding',wellbeing:2,outcome:'You and {partner} chose a shared life without a wedding.'}
  ]}
];

export function encounterChoice(choice,state){
 return choice?.variant&&state?{...choice,...choice.variant(state)}:choice;
}
