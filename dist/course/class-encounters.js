// Authored background pressures. No demographic odds, inherited ability bonuses,
// forced tragedies or hidden mortality modifiers. Existing encounter machinery
// owns the pause, affordability, actual account flow, recorded choice and replay.
// Priority 2: authored story beats (recovery, teachers, loss) go first; the
// offerEncounter urgency rule raises these as their window closes, so a class
// pressure cannot quietly starve through years 25–55.
const choice=(id,label,effects,outcome)=>({id,label,...effects,outcome});
const context=(key,id,title,prompt,options,eligible=()=>true,max=55,urgent=true)=>({id,category:'family',min:25,max,priority:2,urgent,title,prompt,eligible:s=>(s.intake?.class??s.birth?.class)===key&&eligible(s),options});
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
 context('high_class','class_expectations','The family name comes with expectations','A family gathering matters to your relatives. Attending takes money and time you had planned to use elsewhere.',[
   choice('attend','Attend and contribute ฿2,000',{cash:-2000,wellbeing:2,skills:{eq:1}},'You attended and contributed. The family had your company, and your own plans had less money.'),
   choice('decline','Decline and keep your commitments',{wellbeing:-1,skills:{drive:1}},'You kept your commitments and declined. The conversation was difficult, but the choice was yours.')]),
 // A second class pressure at the start of adulthood (25–35), so each birth
 // class meets its drama twice in a life — once early, once late — and each
 // hearing leaves a different "had I chosen differently" thread.
 context('high_class','class_family_pressure','The family business calls you back','Your family wants you to take a role in the business. It would mean stability, but less time for your own plans.',[
   choice('join','Join the family business',{cash:15000,wellbeing:-1,skills:{eq:1}},'You joined the family business. Steady income, but your own plans wait.'),
   choice('decline','Forge your own path',{cash:-10000,wellbeing:1,skills:{drive:1}},'You declined and pursued your own path. The family was disappointed, but the choice was yours.'),
 ],()=>true,35,false),
 context('low_class','class_support_pressure','Your family needs help','A relative is in trouble and asks for money you don\'t really have. Saying yes means going without.',[
   choice('decline','Protect your own buffer',{wellbeing:-1,skills:{drive:1}},'You kept your money for yourself. It was the hard choice, but your buffer stays intact.'),
   choice('help','Help what you can',{cash:-3000,wellbeing:2,skills:{eq:1}},'You helped your relative. Money is tighter, but you did what you could.'),
 ],()=>true,35,false),
 context('middle_class','class_housing_pressure','A home of your own?','You could buy a small home now, but it would take most of your savings. Renting keeps your options open.',[
   choice('rent','Keep renting',{wellbeing:1,skills:{iq:1}},'You kept renting. Flexible, but no equity to show for the years.'),
   choice('buy','Buy the home',{cash:-80000,wellbeing:2,skills:{craft:1}},'You bought a home. It\'s yours, but your savings are much smaller now.'),
 ],()=>true,35,false),
 context('working_class','class_family_time','Time with your family','Your child\'s school event is this weekend, but there\'s an extra shift that pays well. Which matters more?',[
   choice('event','Attend the event',{health:1,wellbeing:2},'You attended the event. Your family remembers you were there.'),
   choice('shift','Take the shift',{cash:3000,wellbeing:-1},'You took the shift. The money helped, but you missed the event.'),
 ],()=>true,35,false),
 context('bureaucratic_class','class_posting_pressure','A posting far from home','A promotion requires a posting to another province. Your family would have to move, or you\'d go alone.',[
   choice('move','Accept the posting',{cash:5000,wellbeing:-2,skills:{drive:1}},'You accepted the posting. Your career advances, but your family life is strained.'),
   choice('decline','Decline and stay',{wellbeing:1,skills:{eq:1}},'You declined and stayed with your family. The promotion went to someone else.'),
 ],()=>true,35,false),
 context('high_class','class_name_pressure','The family name','A charity event expects your family\'s presence and a donation. Attending means time and money; declining means gossip.',[
   choice('decline','Send your regrets',{wellbeing:-1,skills:{drive:1}},'You sent your regrets. Some relatives were upset, but your own plans stayed intact.'),
   choice('attend','Attend and donate',{cash:-15000,wellbeing:1,skills:{eq:1}},'You attended and donated. The family name was honored, but your budget took a hit.'),
 ],()=>true,35,false),
 // Symbolic class moments that ask what a life is for, not just what it earns.
 // Each class meets a different version of the same underlying question.
 context('high_class','class_heirloom','The object that belonged to someone','A small jade amulet turns up among your grandparents’ things. It has no market value, but it belonged to the person who started the family business. Keep it, or sell it for something you need?',[
   choice('keep','Keep it with your own things',{wellbeing:1,skills:{eq:1}},'You kept the amulet. It sits where you can see it, and reminds you what the family was built for.'),
   choice('sell','Sell it and use the money',{cash:2000,wellbeing:-1,skills:{drive:1}},'You sold it. The money helped, but something quiet was lost with it.'),
 ],()=>true,35,false),
 context('low_class','class_photo','A photograph from before the move','Your mother finds a photograph of the house your family lived in before the city. The place no longer exists, but the image is clear. Frame it, or put it away?',[
   choice('frame','Frame it and keep it in sight',{wellbeing:2,skills:{eq:1}},'You framed the photograph. The past has a place in your present now.'),
   choice('away','Put it away with other papers',{wellbeing:-1,skills:{drive:1}},'You put it away. The house is gone, and you chose not to carry its image.'),
 ],()=>true,35,false),
 context('middle_class','class_water_offering','Water at the spirit house','A neighbour asks you to help refill the spirit house water bowl before evening. It takes ten minutes and costs nothing, but those ten minutes were planned for your own work.',[
   choice('help','Help refill the bowl',{wellbeing:1,skills:{eq:1}},'You helped. The water was fresh, the spirit house was tended, and the neighbour remembered.'),
   choice('decline','Keep to your own work',{wellbeing:-1,skills:{craft:1}},'You kept to your work. The bowl stayed empty, and the evening felt smaller.'),
 ],()=>true,35,false),
 context('working_class','class_lantern','A lantern at the river','During the festival, people float lanterns down the river carrying what they wish they had done differently. You can buy one, or keep the money.',[
   choice('buy','Buy a lantern and float it',{cash:-800,wellbeing:2,skills:{eq:1}},'You floated a lantern. The wish went with it, and the river took it away.'),
   choice('keep','Keep the money for tomorrow',{cash:800,wellbeing:-1,skills:{drive:1}},'You kept the money. Tomorrow had it, but the river did not.'),
 ],()=>true,35,false),
 context('bureaucratic_class','class_record','The ledger your father kept','You find your father’s old account book. Every expense, every debt, every small kindness recorded by hand. Study it, or let it stay closed?',[
   choice('study','Study the ledger',{skills:{iq:1},wellbeing:-1},'You read every entry. The numbers told a story you had not known, and it changed how you see your own.'),
   choice('close','Leave it closed',{wellbeing:1,skills:{eq:1}},'You left it closed. Some histories are kinder when they stay where they are.'),
 ],()=>true,35,false),
 context('high_class','class_name_plaque','The name on the gate','A new building bears your family’s name. You are asked to speak at the opening, but the speech would praise a history you do not fully believe in.',[
   choice('speak','Speak and accept the honor',{cash:-3000,wellbeing:-1,skills:{eq:1}},'You spoke. The name was honored, but the words left a taste you could not wash out.'),
   choice('decline','Decline and write your own',{wellbeing:1,skills:{drive:1}},'You declined. The building keeps your name, but the words are yours alone.'),
 ],()=>true,35,false)
];
