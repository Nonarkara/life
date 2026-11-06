// Authored background pressures. No demographic odds, inherited ability bonuses,
// forced tragedies or hidden mortality modifiers. Existing encounter machinery
// owns the pause, affordability, actual account flow, recorded choice and replay.
// Priority 2: authored story beats (recovery, teachers, loss) go first; the
// offerEncounter urgency rule raises these as their window closes, so a class
// pressure cannot quietly starve through years 25–55.
const choice=(id,label,effects,outcome)=>({id,label,...effects,outcome});
const context=(key,id,title,prompt,options,eligible=()=>true)=>({id,category:'family',min:25,max:55,priority:2,urgent:true,title,prompt,eligible:s=>(s.intake?.class??s.birth?.class)===key&&eligible(s),options});
export const CLASS_ENCOUNTERS=[
 context('high_class','class_family_business','The family wants a rescue','Your family asks you to put your own money into its business. Helping would leave less for your own plans.',[
  choice('help','Contribute ฿6,000',{cash:-6000,wellbeing:2,skills:{eq:1}},'You contributed part of your own funds. Your other plans now have less room.'),
  choice('review','Ask to see the accounts first',{skills:{iq:1},wellbeing:-1},'You asked for accounts before committing. The conversation was uncomfortable; your money stayed available.')]),
 context('low_class','class_debt','Money is narrowing your choices','Every baht has to stretch further than it should. A small unexpected cost could leave even less for food, travel and study.',[
  choice('plan','Ask for help making a plan',{skills:{iq:1,eq:1},wellbeing:1},'You made a plan and asked for help. The pressure did not lift, but you could see the next few months more clearly.'),
  choice('rest','Protect time to rest',{health:2,wellbeing:1},'You protected some rest. The money did not change, but exhaustion did not get all your time.')]),
 context('middle_class','class_ambition','A plan bigger than your buffer','A course could help with a change of direction. You can pay now, or practice with what you already have.',[
  choice('course','Pay ฿3,000 for the course',{cash:-3000,skills:{craft:2,iq:1}},'You paid for structured practice. It improved your skills, without promising a better job.'),
  choice('practice','Practice with what you have',{skills:{craft:1},wellbeing:1},'You practiced without a new expense. Progress was smaller, and the buffer stayed intact.')]),
 context('working_class','class_overtime','Another shift, or an evening of your own?','Extra work would bring money now. Rest and time with other people are also becoming scarce.',[
  choice('shift','Take the extra shift',{cash:2500,health:-2,wellbeing:-1},'The extra shift paid. It also used the time and energy you could have spent recovering.'),
  choice('rest','Keep the evening free',{health:2,wellbeing:2},'You kept the evening free. You recovered some energy and received no extra pay.')],s=>s.pathway==='work'||s.pathway==='vocational'),
 context('bureaucratic_class','class_connections','A relative offers an introduction','A family connection offers to introduce you to someone in your field. An introduction is a chance, not a job.',[
  choice('meet','Go to the meeting',{cash:-500,skills:{eq:2}},'You paid for the trip and practiced making your case. No position was guaranteed.'),
  choice('own','Prepare an application yourself',{skills:{iq:1,drive:1}},'You prepared your own application. The result still depended on the opening and the people choosing.')]),
 context('royal_associated','class_expectations','The family name comes with expectations','A family gathering matters to your relatives. Attending takes money and time you had planned to use elsewhere.',[
  choice('attend','Attend and contribute ฿2,000',{cash:-2000,wellbeing:2,skills:{eq:1}},'You attended and contributed. The family had your company, and your own plans had less money.'),
  choice('decline','Decline and keep your commitments',{wellbeing:-1,skills:{drive:1}},'You kept your commitments and declined. The conversation was difficult, but the choice was yours.')])
];
