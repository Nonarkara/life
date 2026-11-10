// Mid-period drama: small dramas that fire BETWEEN five-year stations.
// They fire at ages 13, 18, 23, 28, 33, 38, 43, 48, 53, 58, 63, 68, 73, 78
// and offer small but meaningful choices keyed to the life's actual state
// (class, region, health, wealth, wellbeing, flags, age).
// Authored game design, not demographic forecasts.

import {rand} from './rand.js';
import {regionAt} from './regions.js';
import {birthYearOf} from './thai-history.js';

const option=(id,label,effects,outcome)=>({id,label,...effects,outcome});

export const MID_ENCOUNTERS=[
  // ---- age 13: childhood -------------------------------------------------
  {
   id:'mid-friend-moves',min:12,max:14,title:'Your friend is leaving',
   prompt:'Your closest friend is moving to another province. They ask if you want to keep writing letters.',
   eligible:s=>s.story?.flags?.friend!==undefined,
   options:[
    option('write','Write to them','You kept writing. The friendship survived the distance.',{wellbeing:1,skills:{eq:1}}),
    option('letgo','Let it go','You stopped writing. The friendship faded.',{wellbeing:-1,skills:{iq:1}}),
    option('visit','Visit them once before they go','You spent your savings on one last trip together.',{cash:-1500,wellbeing:2,skills:{eq:1}})
   ]
  },
  {
   id:'mid-parents-argue',min:12,max:14,title:'The shouting at night',
   prompt:'Your parents are fighting again. They ask you to take sides.',
   eligible:s=>s.intake?.class!=='high_class',
   options:[
    option('mother','Side with your mother','You lived with her choice. Your father kept his distance.',{wellbeing:-1,skills:{eq:1}}),
    option('father','Side with your father','You lived with his choice. Your mother spoke less.',{wellbeing:-1,skills:{eq:1}}),
    option('stay','Stay out of it','You stayed quiet. The house felt smaller.',{wellbeing:-2,skills:{iq:1}})
   ]
  },
  {
   id:'mid-first-job',min:12,max:14,title:'Your first paid work',
   prompt:'A neighbour offers you small errands after school. It pays, but it takes time from your studies.',
   eligible:s=>s.intake?.class!=='high_class',
   options:[
    option('take','Take the work','You earned your own money. Your homework suffered.',{cash:3000,wellbeing:1,skills:{drive:1}}),
    option('decline','Decline and study','You kept your books. The money stayed with your family.',{wellbeing:-1,skills:{iq:1}}),
    option('ask','Ask your parents first','They said yes, but only on weekends.',{cash:1500,wellbeing:0,skills:{eq:1}})
   ]
  },
  // ---- age 18: young adult -------------------------------------------------
  {
   id:'mid-first-love',min:17,max:19,title:'Your first real love',
   prompt:'Someone you care about wants to be more than friends. Your family has other plans.',
   eligible:s=>s.story?.flags?.schoolCrush!==undefined||s.story?.flags?.dating!==undefined||s.age>=18,
   options:[
    option('yes','Say yes to them','You chose love over expectation.',{wellbeing:3,skills:{eq:1}}),
    option('no','Say no and obey','You obeyed your family. You wondered what might have been.',{wellbeing:-2,skills:{iq:1}}),
    option('wait','Ask for time','You asked for a year. They gave you six months.',{wellbeing:0,skills:{iq:1}})
   ]
  },
  {
   id:'mid-first-job2',min:17,max:19,title:'Your first real job offer',
   prompt:'A job offer arrives. It pays well but means leaving home.',
   eligible:s=>s.age>=17,
   options:[
    option('take','Take the job','You left home. Your family missed you.',{cash:8000,wellbeing:-1,skills:{drive:1}}),
    option('stay','Stay at home','You stayed close. The money was smaller.',{cash:3000,wellbeing:1}),
    option('negotiate','Ask for more before you go','They said no. You went anyway.',{cash:6000,wellbeing:0,skills:{drive:1}})
   ]
  },
  {
   id:'mid-risk',min:17,max:19,title:'A dangerous offer',
   prompt:'Someone offers you quick money for work they cannot explain.',
   eligible:s=>s.intake?.class!=='high_class'&&s.cash<15000,
   options:[
    option('take','Take the work','You got the money. You never saw them again.',{cash:15000,wellbeing:-3,health:-2}),
    option('decline','Walk away','You stayed clean. The money stayed with them.',{wellbeing:-1,skills:{iq:1}}),
    option('ask','Ask what it is','They never answered. You walked away.',{wellbeing:0,skills:{iq:1}})
   ]
  },
  // ---- age 23: early adulthood -----------------------------------------------
  {
   id:'mid-job-loss',min:22,max:24,title:'The layoff',
   prompt:'Your workplace is closing. They offer you a severance or a transfer.',
   eligible:s=>s.pathway==='work'||s.pathway==='vocational',
   options:[
    option('severance','Take the severance','You took the money. The job search was long.',{cash:20000,wellbeing:-3}),
    option('transfer','Accept the transfer','You moved to a new city. Your routine changed.',{cash:5000,wellbeing:-1,skills:{drive:1}}),
    option('retrain','Use it to retrain','You spent the money on skills. The income was gone.',{cash:-8000,skills:{craft:2,iq:1},wellbeing:1})
   ]
  },
  {
   id:'mid-relationship',min:22,max:24,title:'The relationship test',
   prompt:'Your partner wants to move in together. Your parents say wait.',
   eligible:s=>s.story?.flags?.dating!==undefined,
   options:[
    option('move','Move in together','You chose your partner. Your family was quiet for months.',{wellbeing:4,cash:-3000,skills:{eq:1}}),
    option('wait','Wait as they asked','You waited. The relationship cooled.',{wellbeing:-2,skills:{iq:1}}),
    option('end','End it','You ended it. Your family was relieved.',{wellbeing:-3,skills:{iq:1}})
   ]
  },
  {
   id:'mid-health-scare',min:22,max:24,title:'The health scare',
   prompt:'A routine check finds something wrong. The doctor wants to run tests.',
   eligible:s=>s.health<70||s.state?.flags?.smoke==='yes',
   options:[
    option('test','Take the tests','It cost money, but you knew.',{cash:-8000,health:2,wellbeing:-1}),
    option('wait','Wait and see','You waited. It got worse before it got better.',{health:-4,wellbeing:-4}),
    option('ignore','Ignore it','You carried on. Your body kept the score.',{health:-3,wellbeing:-2})
   ]
  },
  // ---- age 28: mid-adulthood -------------------------------------------------
  {
   id:'mid-debt',min:27,max:29,title:'The debt comes due',
   prompt:'A loan you took years ago is demanding repayment. You do not have the full amount.',
   eligible:s=>s.cash<20000||s.finance?.debt>0,
   options:[
    option('pay','Pay what you can','You paid most of it. The rest still hangs.',{cash:-10000,wellbeing:-2}),
    option('negotiate','Ask for more time','They gave you six months. The interest grew.',{wellbeing:-3,cash:-3000}),
    option('ignore','Avoid them','They stopped calling. The debt grew.',{cash:-2000,wellbeing:-1})
   ]
  },
  {
   id:'mid-promotion',min:27,max:29,title:'The promotion offer',
   prompt:'A promotion is offered. It means more responsibility and less time at home.',
   eligible:s=>s.pathway==='work'||s.pathway==='vocational',
   options:[
    option('take','Take the promotion','You took it. Your evenings belonged to work.',{cash:15000,wellbeing:-2,skills:{drive:1}}),
    option('decline','Decline and stay','You stayed where you were. The money stayed small.',{cash:4000,wellbeing:1}),
    option('negotiate','Ask for more time','They said no. You took it anyway.',{cash:10000,wellbeing:-1,skills:{drive:1}})
   ]
  },
  {
   id:'mid-family-crisis',min:27,max:29,title:'Family emergency',
   prompt:'A relative is in trouble. They ask for help you are not sure you can give.',
   eligible:s=>s.story?.flags?.parent!==undefined||s.story?.flags?.friend!==undefined,
   options:[
    option('help','Help them','You gave what you had. It was not enough.',{cash:-15000,wellbeing:-1,skills:{eq:1}}),
    option('refuse','Say no','You kept your money. They never asked again.',{cash:5000,wellbeing:-4}),
    option('partial','Help what you can','You gave a little. It was not enough, but it was something.',{cash:-5000,wellbeing:-1,skills:{eq:1}})
   ]
  },
  // ---- age 33: midlife -------------------------------------------------------
  {
   id:'mid-career-crossroads',min:32,max:34,title:'The career crossroads',
   prompt:'Your work has plateaued. An offer comes from a different field entirely.',
   eligible:s=>s.age>=32,
   options:[
    option('switch','Switch fields','You started over. The pay dropped at first.',{cash:-10000,skills:{craft:1,iq:1},wellbeing:-1}),
    option('stay','Stay and fight for it','You stayed. The years passed.',{cash:8000,wellbeing:-1}),
    option('own','Start your own thing','You used your savings. It was risky.',{cash:-25000,skills:{drive:1},wellbeing:2})
   ]
  },
  {
   id:'mid-marriage',min:32,max:34,title:'The marriage question',
   prompt:'Your relationship has gone quiet. A counselor suggests a hard conversation.',
   eligible:s=>s.story?.flags?.married!==undefined||s.story?.flags?.dating!==undefined,
   options:[
    option('talk','Have the conversation','It was hard. You understood each other again.',{wellbeing:3,skills:{eq:1}}),
    option('avoid','Avoid the topic','You avoided it. The silence grew.',{wellbeing:-3}),
    option('end','End it','You ended it. The house felt empty.',{wellbeing:-5,skills:{drive:1}})
   ]
  },
  {
   id:'mid-health-warning',min:32,max:34,title:'The health warning',
   prompt:'Your doctor says your habits are catching up with you. Change now or pay later.',
   eligible:s=>s.health<60||s.profile?.smoke==='yes'||s.profile?.drink==='social',
   options:[
    option('change','Change your habits','You stopped the worst of it. Your body thanked you.',{health:4,wellbeing:1,skills:{drive:1}}),
    option('reduce','Cut back a little','You reduced it. The damage slowed.',{health:1,wellbeing:0}),
    option('ignore','Ignore it','You kept going. The body kept the score.',{health:-3,wellbeing:-1})
   ]
  },
  // ---- age 38: midlife crisis -----------------------------------------------
  {
   id:'mid-midlife',min:37,max:39,title:'The midlife question',
   prompt:'You look at your life and wonder if this is all there is.',
   eligible:s=>s.age>=37,
   options:[
    option('change','Make a big change','You quit, moved, or started over. It cost everything.',{cash:-30000,wellbeing:3,skills:{drive:1}}),
    option('deepen','Go deeper where you are','You doubled down on what you had.',{cash:5000,wellbeing:1,skills:{craft:1}}),
    option('wait','Wait and see','You did nothing. The year passed.',{wellbeing:-1})
   ]
  },
  {
   id:'mid-loss',min:37,max:39,title:'The unexpected loss',
   prompt:'Someone close to you dies suddenly. There was no warning.',
   eligible:s=>s.story?.flags?.friend!==undefined||s.story?.flags?.dating!==undefined,
   options:[
    option('grieve','Take time to grieve','You stopped for a while. The work waited.',{wellbeing:-4,skills:{eq:1}}),
    option('work','Throw yourself into work','You worked to forget. It did not work.',{cash:10000,wellbeing:-5}),
    option('family','Lean on your family','You held each other. It helped, but the hole remained.',{wellbeing:-2,skills:{eq:1}})
   ]
  },
  {
   id:'mid-opportunity',min:37,max:39,title:'The unexpected opportunity',
   prompt:'A former colleague offers you a stake in something new. It is risky.',
   eligible:s=>s.cash>30000&&s.pathway!==undefined,
   options:[
    option('invest','Invest in it','You put your money in. It was risky.',{cash:-20000,skills:{drive:1},wellbeing:-1}),
    option('decline','Decline and stay','You stayed safe. You wondered what if.',{cash:5000,wellbeing:-1}),
    option('partner','Ask to be a partner','You asked for more than they offered. They said no.',{cash:-5000,wellbeing:-2,skills:{drive:1}})
   ]
  },
  // ---- age 43: pre-retirement planning ---------------------------------------
  {
   id:'mid-health-crisis',min:42,max:44,title:'The health crisis',
   prompt:'A serious diagnosis. The treatment is expensive and the recovery is long.',
   eligible:s=>s.health<50||s.age>=42,
   options:[
    option('treat','Get the treatment','You spent your savings. You lived.',{cash:-40000,health:8,wellbeing:-2}),
    option('manage','Manage it at home','You saved the money. Your health declined.',{cash:-5000,health:-6,wellbeing:-4}),
    option('ignore','Ignore it','You kept working until you could not.',{health:-10,wellbeing:-6,cash:20000})
   ]
  },
  {
   id:'mid-empty-nest',min:42,max:44,title:'The empty nest',
   prompt:'Your child has left home. The house is quiet.',
   eligible:s=>s.story?.flags?.parent!==undefined,
   options:[
    option('travel','Travel with your partner','You saw places you had only read about.',{cash:-25000,wellbeing:4,skills:{eq:1}}),
    option('focus','Focus on your work','You threw yourself into your career.',{cash:15000,wellbeing:-1,skills:{drive:1}}),
    option('downsize','Downsize the house','You sold the big house and bought a small one.',{cash:30000,wellbeing:1,skills:{eq:1}})
   ]
  },
  {
   id:'mid-career-end',min:42,max:44,title:'The career ends',
   prompt:'Your industry is changing. Your skills are no longer what they want.',
   eligible:s=>s.pathway==='work'||s.pathway==='vocational',
   options:[
    option('retrain','Retrain for something new','You went back to school. It was humbling.',{cash:-20000,skills:{iq:2,craft:1},wellbeing:-1}),
    option('stay','Stay until they let you go','You stayed until the end.',{cash:30000,wellbeing:-2}),
    option('own','Start your own thing','You used your savings to start small.',{cash:-40000,skills:{drive:1},wellbeing:2})
   ]
  },
  // ---- age 48: approaching retirement ---------------------------------------
  {
   id:'mid-retirement-plan',min:47,max:49,title:'The retirement question',
   prompt:'You can retire early with less money, or work longer for more.',
   eligible:s=>s.age>=47,
   options:[
    option('retire','Retire early','You stopped working. The money was tight.',{cash:-15000,wellbeing:2,flags:{retiredAt:48}}),
    option('work','Work five more years','You kept going. The money grew.',{cash:40000,wellbeing:-2,health:-2}),
    option('half','Work half-time','You balanced work and life.',{cash:10000,wellbeing:1,skills:{eq:1}})
   ]
  },
  {
   id:'mid-health-warning2',min:47,max:49,title:'The body says stop',
   prompt:'Your body is telling you to slow down. Your work is not listening.',
   eligible:s=>s.health<60||s.age>=47,
   options:[
    option('slow','Slow down','You cut your hours. The money dropped.',{cash:-15000,health:4,wellbeing:2}),
    option('push','Push through','You kept going. Your body remembered.',{cash:20000,health:-8,wellbeing:-4}),
    option('change','Change your work','You found something lighter. It paid less.',{cash:-10000,health:2,wellbeing:1})
   ]
  },
  {
   id:'mid-legacy',min:47,max:49,title:'What you leave behind',
   prompt:'You are thinking about what remains after you.',
   eligible:s=>s.age>=47,
   options:[
    option('give','Give to your children','You gave them your savings.',{cash:-50000,wellbeing:3,skills:{eq:1}}),
    option('keep','Keep it for yourself','You kept it. You would need it.',{cash:20000,wellbeing:-1}),
    option('community','Give to your community','You gave it to a cause you believed in.',{cash:-25000,wellbeing:4,skills:{eq:1}})
   ]
  },
  // ---- age 53: late midlife -------------------------------------------------
  {
   id:'mid-health-crisis2',min:52,max:54,title:'The second health crisis',
   prompt:'Another health scare. This one is harder to ignore.',
   eligible:s=>s.health<55||s.age>=52,
   options:[
    option('treat','Get the treatment','You paid for the best care. It worked.',{cash:-50000,health:10,wellbeing:-2}),
    option('manage','Manage it at home','You saved money. Your health faded.',{cash:-10000,health:-8,wellbeing:-5}),
    option('ignore','Ignore it','You worked until you collapsed.',{health:-12,wellbeing:-8,cash:30000})
   ]
  },
  {
   id:'mid-family-drama',min:52,max:54,title:'The family conflict',
   prompt:'Your adult child asks for money. Your partner says no.',
   eligible:s=>s.story?.flags?.parent!==undefined,
   options:[
    option('give','Give them the money','You gave it. Your partner was angry.',{cash:-30000,wellbeing:-2,skills:{eq:1}}),
    option('refuse','Say no','You said no. Your child was hurt.',{cash:10000,wellbeing:-3}),
    option('split','Split the difference','You gave half. Everyone was unhappy.',{cash:-15000,wellbeing:-1})
   ]
  },
  {
   id:'mid-opportunity2',min:52,max:54,title:'The late opportunity',
   prompt:'A friend offers you a chance to invest in something new.',
   eligible:s=>s.cash>50000&&s.pathway!==undefined,
   options:[
    option('invest','Invest in it','You put your money in. It paid off.',{cash:-40000,skills:{drive:1},wellbeing:1}),
    option('decline','Decline and stay','You stayed safe. You wondered what if.',{cash:10000,wellbeing:-1}),
    option('learn','Learn about it first','You spent time learning. You did not invest.',{cash:-5000,skills:{iq:1},wellbeing:0})
   ]
  },
  // ---- age 58: elder years begin --------------------------------------------
  {
   id:'mid-health-crisis3',min:57,max:59,title:'The body fails',
   prompt:'Your body does not do what it used to. The doctor says to rest.',
   eligible:s=>s.health<55||s.age>=57,
   options:[
    option('rest','Rest and recover','You stopped working. Your health improved.',{cash:-30000,health:6,wellbeing:1}),
    option('work','Keep working','You kept working until you could not.',{cash:25000,health:-10,wellbeing:-6}),
    option('change','Change your work','You found something lighter. It paid less.',{cash:-15000,health:3,wellbeing:1})
   ]
  },
  {
   id:'mid-loss2',min:57,max:59,title:'Another loss',
   prompt:'Another person close to you is gone. The world feels smaller.',
   eligible:s=>s.story?.flags?.friend!==undefined||s.story?.flags?.married!==undefined,
   options:[
    option('grieve','Take time to grieve','You stopped for a while. The world kept going.',{wellbeing:-5,skills:{eq:1}}),
    option('work','Work through it','You worked to forget. It did not work.',{cash:20000,wellbeing:-6}),
    option('family','Lean on your family','You held each other. The hole remained.',{wellbeing:-3,skills:{eq:1}})
   ]
  },
  {
   id:'mid-legacy2',min:57,max:59,title:'What remains',
   prompt:'You are thinking about what you leave behind.',
   eligible:s=>s.age>=57,
   options:[
    option('give','Give to your children','You gave them your savings.',{cash:-60000,wellbeing:3,skills:{eq:1}}),
    option('keep','Keep it for yourself','You kept it. You might need it.',{cash:30000,wellbeing:-1}),
    option('community','Give to your community','You gave it to a cause you believed in.',{cash:-40000,wellbeing:4,skills:{eq:1}})
   ]
  },
  // ---- age 63: elder years --------------------------------------------------
  {
   id:'mid-health-crisis4',min:62,max:64,title:'The final health crisis',
   prompt:'A serious illness. The doctors say there is little more to do.',
   eligible:s=>s.health<50||s.age>=62,
   options:[
    option('treat','Get the treatment','You spent everything. You lived a while longer.',{cash:-60000,health:6,wellbeing:-2}),
    option('comfort','Choose comfort','You chose comfort over cure.',{cash:-10000,health:-5,wellbeing:-1}),
    option('ignore','Ignore it','You lived as you always had.',{health:-15,wellbeing:-6,cash:40000})
   ]
  },
  {
   id:'mid-reflection',min:62,max:64,title:'The final reflection',
   prompt:'You look back on your life. What matters now?',
   eligible:s=>s.age>=62,
   options:[
    option('family','Think of your family','You thought of them. You loved them.',{wellbeing:3,skills:{eq:1}}),
    option('work','Think of your work','You thought of what you built. It was enough.',{wellbeing:2,skills:{drive:1}}),
    option('self','Think of yourself','You thought of what you wanted. It was too late.',{wellbeing:-1,skills:{iq:1}})
   ]
  },
  {
   id:'mid-final-opportunity',min:62,max:64,title:'One last thing',
   prompt:'Someone offers you one last chance to do something you always wanted.',
   eligible:s=>s.cash>20000,
   options:[
    option('do','Do it','You spent your savings on one last thing.',{cash:-40000,wellbeing:4}),
    option('save','Save it','You kept your money. You wondered what if.',{cash:15000,wellbeing:-1}),
    option('give','Give it to someone else','You gave your chance to someone who needed it more.',{cash:-25000,wellbeing:3,skills:{eq:1}})
   ]
  },
  // ---- age 68+: final years -------------------------------------------------
  {
   id:'mid-health-crisis5',min:67,max:69,title:'The body gives out',
   prompt:'Your body is failing. There is no more treatment.',
   eligible:s=>s.health<45||s.age>=67,
   options:[
    option('rest','Rest at home','You stayed home. Your family cared for you.',{cash:-20000,health:-2,wellbeing:1}),
    option('fight','Fight it','You fought until the end.',{cash:-50000,health:-10,wellbeing:-8}),
    option('accept','Accept it','You accepted it. You made peace.',{cash:-10000,health:-8,wellbeing:2})
   ]
  },
  {
   id:'mid-loss3',min:67,max:69,title:'The last goodbye',
   prompt:'Someone you love is leaving. There is no more time.',
   eligible:s=>s.story?.flags?.married!==undefined||s.story?.flags?.parent!==undefined,
   options:[
    option('be-there','Be there','You stayed with them until the end.',{wellbeing:-4,skills:{eq:1}}),
    option('avoid','Avoid it','You could not face it. You regretted it.',{wellbeing:-6}),
    option('remember','Remember them','You told their stories. They lived on.',{wellbeing:-2,skills:{iq:1}})
   ]
  },
  {
   id:'mid-final-meaning',min:67,max:69,title:'What mattered',
   prompt:'You look back. What mattered most?',
   eligible:s=>s.age>=67,
   options:[
    option('family','Your family','You thought of them. They were everything.',{wellbeing:4,skills:{eq:1}}),
    option('work','Your work','You thought of what you built. It mattered.',{wellbeing:2,skills:{drive:1}}),
    option('self','Yourself','You thought of what you wanted. It was too late.',{wellbeing:-1,skills:{iq:1}})
   ]
  },
  // ---- age 73+: final years -------------------------------------------------
  {
   id:'mid-health-crisis6',min:72,max:74,title:'The final illness',
   prompt:'You are very sick. There is no more treatment.',
   eligible:s=>s.health<40||s.age>=72,
   options:[
    option('rest','Rest at home','You stayed home. Your family cared for you.',{cash:-15000,health:-3,wellbeing:0}),
    option('fight','Fight it','You fought until you could not.',{cash:-60000,health:-15,wellbeing:-10}),
    option('accept','Accept it','You accepted it. You made peace.',{cash:-10000,health:-8,wellbeing:1})
   ]
  },
  {
   id:'mid-loss4',min:72,max:74,title:'The last of them',
   prompt:'The last of your generation is gone. You are the elder now.',
   eligible:s=>s.age>=72,
   options:[
    option('remember','Remember them','You told their stories. They lived on.',{wellbeing:-2,skills:{iq:1}}),
    option('forget','Try to forget','You tried. You could not.',{wellbeing:-4}),
    option('live','Live for them','You lived your life for those who could not.',{wellbeing:2,skills:{eq:1}})
   ]
  },
  {
   id:'mid-final-reflection',min:72,max:74,title:'What mattered most',
   prompt:'You look back on your whole life. What mattered?',
   eligible:s=>s.age>=72,
   options:[
    option('family','Your family','You thought of them. You loved them.',{wellbeing:5,skills:{eq:1}}),
    option('work','Your work','You thought of what you built. It was enough.',{wellbeing:3,skills:{drive:1}}),
    option('self','Yourself','You thought of what you wanted. It was too late.',{wellbeing:-2,skills:{iq:1}})
   ]
  }
];