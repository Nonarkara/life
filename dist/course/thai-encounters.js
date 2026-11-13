import {region,regionAt,regionIdFor,homeRegion} from './regions.js';
// Researched circumstances, fictional people and authored game effects. These
// are choices, not predictions of political events, harvests or class destiny.
const thai=s=>region(regionAt(s)).country==='TH';
const farm=s=>thai(s)&&['isan-village','nakhon-sawan'].includes(homeRegion(s.birth,s.age));
// Simple seeded hash for easter-egg rarity, kept local to avoid a circular
// import (sim.js → encounters.js → this file).
const easterRand=(seed,age,domain)=>{let h=2166136261;for(const c of `${seed}/${age}/${domain}`){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h+=h<<13;h^=h>>>7;h+=h<<3;h^=h>>>17;h+=h<<5;return(h>>>0)/4294967296;};
const easter=(s,id)=>thai(s)&&!!(s.intake?.class??s.birth?.class)&&(s.age<35||easterRand(s.seed,s.age,id)<.35);
const option=(id,label,symbol,effects,outcome,later=[])=>({id,label,symbol,...effects,outcome,later});
const base={min:20,max:55,priority:2};
const ruralSource='https://www.worldbank.org/en/country/thailand/publication/thailand-rural-income-diagnostic-challenges-and-opportunities-for-rural-farmers';
export const THAI_ENCOUNTERS=[
 {...base,id:'th_curfew',category:'work',tone:'urgent',eligible:s=>thai(s)&&['work','vocational','independent'].includes(s.pathway),
  title:'A curfew changes tonight',
  prompt:'Fictional chapter, informed by 2014: a coup has been announced and a curfew begins tonight. Your evening plans must change. How will you get home?',
  lesson:'Political disruption reaches ordinary journeys, work and family plans. This chapter is not a forecast.',
  source:'https://thailand.embassy.gov.au/bkok/PR2014_Military_Coup.html',sourceTitle:'Australian Embassy · 23 May 2014',options:[
   option('early','Pay ฿300 to leave earlier','travel',{cash:-300,wellbeing:1},'You paid for an earlier trip and reached home before the curfew. The expense came from your own buffer.'),
   option('shift','Ask to change your hours','clock',{skills:{eq:1},wellbeing:-1},'You arranged different hours. Tonight was manageable, but the conversation and changed plans took energy.'),
   option('share','Arrange a shared trip home','people',{skills:{eq:1}},'You coordinated a shared trip before the curfew. Other people had to change their plans too.') ]},
 {...base,id:'th_buyer_bill',category:'family',tone:'pressured',max:40,eligible:farm,
  title:'The buyer also holds the bill',
  prompt:'Your rice-farming family asks for help. The buyer who supplied inputs on credit wants payment before the next harvest. What can you contribute?',
  lesson:'When credit and crop sales are tied together, a family may have less room to choose. This family bill is not your personal debt.',
  source:'https://www.nso.go.th/public/e-book/Census_Survey/Agricultural-Census-2566/52/',sourceTitle:'NSO · Agricultural Census 2023',options:[
   option('contribute','Contribute ฿1,200 to the bill','money',{cash:-1200,wellbeing:2},'You contributed ฿1,200 from your own money. It helped with the bill; it did not clear the family obligation.'),
   option('compare','Spend ฿300 comparing cooperative terms','travel',{cash:-300,skills:{iq:1,eq:1}},'You paid for the trip and compared written terms. Another lender or buyer was not guaranteed to accept the family.'),
   option('read','Keep your buffer and help read the bill','agreement',{skills:{iq:1},wellbeing:-1},'You checked the amounts with your family and kept your own buffer. The bill still needed a way to be paid.') ]},
 {...base,id:'th_harvest_transport',category:'family',tone:'reflective',eligible:farm,
  title:'One truck, two offers',
  prompt:'Your rice-farming family can use its usual buyer or share a truck to reach another market. Transport costs money before anyone knows the sale price.',
  lesson:'Reaching another market can widen choices, but travel costs and uncertainty do not disappear.',
  source:ruralSource,sourceTitle:'World Bank · Thailand Rural Income Diagnostic',options:[
   option('truck','Contribute ฿500 to shared transport','travel',{cash:-500,skills:{eq:1,craft:1}},'You helped pay for the shared truck and learned how the trip was organised. A better sale price was not promised.'),
   option('terms','Compare weights and written offers first','agreement',{skills:{iq:1},wellbeing:-1},'You helped compare the weights and written offers. It took patience; the family had not yet changed buyers.'),
   option('usual','Keep the usual arrangement this season','clock',{wellbeing:1},'The family kept its usual arrangement for this season. You avoided a new travel expense, without testing the other market.') ]},
 {...base,id:'th_dry_season',category:'family',tone:'pressured',max:50,eligible:farm,
  title:'The water does not reach every field',
  prompt:'Water is short this season. Your rice-farming family and its neighbours are deciding what they can plant. They ask whether you can help.',
  lesson:'Water access and weather constrain a harvest. A careful choice cannot guarantee rain or income.',
  source:ruralSource,sourceTitle:'World Bank · Thailand Rural Income Diagnostic',options:[
   option('water','Contribute ฿800 to shared water costs','water',{cash:-800,wellbeing:2},'You contributed to shared water costs. The family had some support, but the harvest remained uncertain.'),
   option('trial','Help plan a small lower-water trial','book',{skills:{craft:1,iq:1},wellbeing:-1},'You helped compare a small lower-water trial with the usual crop. Learning and planning took energy; neither guaranteed a harvest.'),
   option('limits','Protect your own commitments this time','shield',{wellbeing:1},'You explained what you could manage and kept your commitments. The family still had to work within the water available.') ]},
 {...base,id:'th_unpaid_placement',category:'work',tone:'reflective',max:30,
  eligible:s=>thai(s)&&['school','college','vocational'].includes(s.pathway??s.history?.at(-1)?.pathway),
  title:'The opportunity does not pay yet',
  prompt:'A short placement offers experience but no pay. Travel costs ฿2,000. A paid local task is also available. Which fits the life you can afford now?',
  lesson:'The same opportunity can cost very different shares of two people’s buffers. Neither route guarantees a later job.',
  source:'https://www.worldbank.org/en/country/thailand/publication/bridging-the-gap-inequality-and-jobs-in-thailand',sourceTitle:'World Bank · Bridging the Gap',options:[
   option('placement','Pay ฿2,000 for the placement','work',{cash:-2000,skills:{craft:1}},'You paid for travel and completed the placement. You gained practice, without a promise of a job.',[{after:5,skills:{craft:1},text:'Five years later, you still use a skill first practised during that placement.'}]),
   option('paid','Take the local task for ฿1,200','money',{cash:1200,skills:{drive:1}},'You completed the local task and earned ฿1,200. You protected your buffer and missed this placement.'),
   option('ask','Ask about support or different hours','agreement',{skills:{eq:1},wellbeing:-1},'You asked about travel support and flexible hours. Negotiating took energy; neither funding nor a place was promised.') ]},
 {...base,id:'th_bangkok_accounting',category:'study',tone:'pressured',min:35,max:55,priority:2,urgent:false,
  eligible:s=>easter(s,'th_bangkok_accounting')&&['school','college','vocational','work'].includes(s.pathway??s.history?.at(-1)?.pathway),
  title:'Night classes across from the hospital',
  prompt:'You work daytime accounts at a hospital to pay your own way through evening degree classes in Bangkok. If you falter, your younger siblings in the provinces will not be allowed to follow.',
  lesson:'When you are the first in the family to study in the city, your persistence opens or closes the road for those behind you.',
  source:'https://nonharvard.wordpress.com/2025/04/17/day-121-how-i-never-paid-a-penny-for-my-education/',sourceTitle:'Non Harvard · Day 121: Never Paid a Penny',options:[
   option('night_degree','Keep the hospital job and finish the five-year evening degree','book',{skills:{iq:2,drive:1},health:-1},'You balanced ledgers by day and studied by night for five years. Your younger siblings soon followed you to Bangkok schools.',[{after:10,wellbeing:3,skills:{eq:1},text:'Ten years later, the siblings who followed you to Bangkok had built careers of their own.'}]),
   option('certificate','Stop at the technical certificate and send ฿1,200 home now','money',{cash:1200,skills:{craft:1},wellbeing:1},'You took a full-time accounting post with your certificate and helped the household immediately.'),
   option('pace','Drop one course a term so your health holds','clock',{health:1,skills:{iq:1}},'You slowed your degree pace so your body could recover between shifts.') ]},
 {...base,id:'th_bank_merger',category:'work',tone:'pressured',min:40,max:60,priority:2,urgent:false,
  eligible:s=>easter(s,'th_bank_merger')&&['work','vocational','independent'].includes(s.pathway),
  title:'The merger list at the bank',
  prompt:'An economic crisis forces your bank to merge. After years of spotless manual ledger work, your post is marked redundant while a less qualified colleague with quiet connections stays.',
  lesson:'Credentials and diligence do not always outrank networks when institutions shrink; keep your self-worth separate from a title.',
  source:'https://nonharvard.wordpress.com/2018/08/14/day-86-the-anti-fragile-manifesto/',sourceTitle:'Non Harvard · Day 86: The Anti-Fragile Manifesto',options:[
   option('severance','Take the ฿2,500 severance package and leave with your head high','money',{cash:2500,wellbeing:1,skills:{eq:1}},'You took the severance and walked out cleanly. The title was gone, not your competence.'),
   option('audit_independent','Advise family businesses independently for ฿1,200','work',{cash:1200,wellbeing:2,skills:{iq:1,craft:1}},'Owners who trusted your books hired you directly. You answered to your own standards again.'),
   option('contest','Appeal the redundancy through the formal review board','agreement',{wellbeing:-1,skills:{drive:1}},'You placed the record on file. The merger decision stood, but nobody could rewrite your track record.') ]},
  // Easter eggs: rare, seed-conditioned moments that reward replay and attention.
  // They sit in the background band so they never displace authored story beats.
  {...base,id:'th_spirit_offering',category:'family',tone:'reflective',min:35,max:75,priority:2,urgent:false,
   eligible:s=>easter(s,'th_spirit_offering'),
   title:'The spirit house waiting',prompt:'An offering sits at the spirit house by your gate, untended for days. Who will you leave it for?',lesson:'Small rituals carry meaning no ledger can record.',source:'https://nonharvard.wordpress.com/2015/11/25/day-39-on-time/',sourceTitle:'Non Harvard · Day 39: On Time',options:[
   option('leave','Leave flowers and water','people',{wellbeing:2,skills:{eq:1}},'You left an offering. The spirit house feels tended again, and so do you.'),
   option('pass','Walk past without stopping','shield',{wellbeing:-1},'You walked past. The house stood empty, as did something in you.')]},
  {...base,id:'th_stray_cat',category:'connection',tone:'reflective',min:35,max:60,priority:2,urgent:false,
   eligible:s=>easter(s,'th_stray_cat'),
   title:'The cat at the gate',prompt:'A stray cat has been waiting at your gate every morning. It does not ask, only watches.',lesson:'Some companions ask for nothing and still change your days.',source:'https://nonharvard.wordpress.com/2018/07/25/day-75-12-rules-for-life/',sourceTitle:'Non Harvard · Day 75: 12 Rules for Life',options:[
   option('feed','Set out food for it','people',{wellbeing:1},'You fed the cat. It began to meet you at the gate each morning.'),
   option('ignore','Close the gate and go on','shield',{wellbeing:-1},'You closed the gate. The cat was gone the next morning.')]},
  {...base,id:'th_midnight_cart',category:'work',tone:'reflective',min:35,max:70,priority:2,urgent:false,
   eligible:s=>easter(s,'th_midnight_cart')&&s.pathway==='work',
   title:'The noodle cart after midnight',prompt:'The cart is still open when everything else has closed. The cook asks why you are still awake.',lesson:'Late hours reveal thoughts the day keeps quiet.',source:'https://nonharvard.wordpress.com/2018/10/06/day-98-what-i-know-for-sure/',sourceTitle:'Non Harvard · Day 98: What I Know for Sure',options:[
   option('sit','Sit and eat with the cook','people',{wellbeing:2,skills:{eq:1}},'You sat with the cook. Stories passed between bowls of noodles, and the night felt smaller.'),
   option('go','Buy a bowl and go home','clock',{wellbeing:1},'You took your food and left. The cook nodded, as if they expected nothing else.')]},
  {...base,id:'th_mitr_cameo',category:'connection',tone:'reflective',min:35,max:65,priority:2,urgent:false,
   eligible:s=>easter(s,'th_mitr_cameo'),
   title:'A film crew by the cinema marquee',
   prompt:'A crowd gathers outside a Bangkok theatre where a crew is filming. Leading man Mitr Chaibancha steps into the afternoon light and nods toward the street before the cameras roll.',
   lesson:'A fleeting glimpse of a shared cultural icon anchors the memory of an entire decade.',
   source:'https://nonharvard.wordpress.com/2015/10/29/day-32-what-makes-life-worth-living/',sourceTitle:'Non Harvard · Day 32: What Makes Life Worth Living',options:[
   option('watch','Stay at the edge of the crowd and watch the take','art',{wellbeing:2,skills:{craft:1}},'You stood with the crowd and watched the scene unfold. Decades later, old film posters still bring back that afternoon.'),
   option('walk','Smile at the marquee and keep walking to your appointment','clock',{wellbeing:1,skills:{drive:1}},'You caught the moment in passing and kept your appointment on time.')]},
  {...base,id:'th_first_love_regret',category:'connection',tone:'reflective',min:35,max:65,priority:2,urgent:false,
   eligible:s=>easter(s,'th_first_love_regret'),
   title:'News of someone from your hometown',
   prompt:'You hear news of your first love from back home—the person you once let go because a provincial match seemed too small for your ambitions. They have quietly built a thriving life.',
   lesson:'Looking down on a humble beginning can blind you to who a person is becoming.',
   source:'https://nonharvard.wordpress.com/2015/11/08/day-35-worst-mistakes-people-make-in-their-20s/',sourceTitle:'Non Harvard · Day 35: Worst Mistakes in Your 20s',options:[
   option('wish_well','Send warm congratulations and let the past rest','people',{wellbeing:2,skills:{eq:1}},'You wished them well without reopening old wounds. Gratitude softened the regret.'),
   option('reflect','Sit with the regret and examine what you valued then','book',{wellbeing:-1,skills:{iq:1,eq:1}},'You faced how status calculations once narrowed your heart, and resolved not to repeat the mistake.')]},
  {...base,id:'th_vhs_modem',category:'study',tone:'reflective',min:35,max:60,priority:2,urgent:false,
   eligible:s=>easter(s,'th_vhs_modem'),
   title:'One phone line and a dial-up modem',
   prompt:'Mosquitoes rise at seven in the lane after an afternoon of homework and black-market VHS tapes. At home, plugging the US Robotics modem into the single family landline ties up the whole house.',
   lesson:'Every generation meets the wider world through imperfect tools that reward curiosity.',
   source:'https://nonharvard.wordpress.com/2015/10/19/day-28-who-ive-become-an-outli/',sourceTitle:'Non Harvard · Day 28: Who I Have Become',options:[
   option('dial_in','Wait until late night and dial into the world outside','book',{skills:{iq:2,craft:1},wellbeing:1},'Through static and a slow handshake tone, you read pages from universities across the ocean without waiting for anyone’s permission.'),
   option('lane_friends','Leave the phone line free and stay with friends in the lane','people',{wellbeing:2,skills:{eq:1}},'You traded the screen for one more evening of neighbourhood games and shared homework before the traffic cleared.')]},
  {...base,id:'th_midlife_frugality',category:'money',tone:'reflective',min:40,max:65,priority:2,urgent:false,
   eligible:s=>easter(s,'th_midlife_frugality'),
   title:'What you were saving the money for',
   prompt:'You grew up warned never to wish beyond your station and to save every baht. At midlife, with half your years behind you and your mother tending the small routines of home, you have enough.',
   lesson:'Frugality builds the runway, but hoarding past midlife trades away the years you worked hard to earn.',
   source:'https://nonharvard.wordpress.com/2018/10/06/day-98-what-i-know-for-sure/',sourceTitle:'Non Harvard · Day 98: What I Know for Sure',options:[
   option('guard_time','Guard your time for curiosity and the people at home','clock',{wellbeing:3,skills:{eq:1,craft:1}},'You stopped taking work just for the fee and spent the saved hours on what made you and your household genuinely happy.'),
   option('spend_joy','Spend ฿1,800 on something you denied yourself for years','heart',{cash:-1800,wellbeing:2},'You bought what you had postponed since youth and shared the comfort with the people waiting for you at home.'),
   option('keep_frugal','Keep the old frugal habits and save ฿900 more','shield',{cash:900,wellbeing:-1},'You kept the old discipline intact. The balance grew, though the days felt much the same.')]},
  // More rare, seed-conditioned moments that carry nostalgia and symbolism.
  {...base,id:'th_alms_round',category:'family',tone:'reflective',min:35,max:70,priority:2,urgent:false,
    eligible:s=>easter(s,'th_alms_round'),
    title:'The morning alms round',
    prompt:'Monks in saffron robes walk the lane before sunrise, carrying their bowls. You can prepare food and offer it, or let the morning pass.',
    lesson:'Giving without expecting return changes the giver more than the receiver.',
    source:'https://nonharvard.wordpress.com/2015/11/25/day-39-on-time/',sourceTitle:'Non Harvard · Day 39: On Time',options:[
    option('offer','Prepare food and offer it','people',{wellbeing:2,skills:{eq:1}},'You offered food at dawn. The monks accepted in silence, and the day began differently.'),
    option('sleep','Let the morning pass','shield',{wellbeing:-1},'You stayed in bed. The alms round went by, and you missed its quiet.')]},
  {...base,id:'th_lantern_night',category:'connection',tone:'reflective',min:35,max:75,priority:2,urgent:false,
    eligible:s=>easter(s,'th_lantern_night'),
    title:'The lantern night',
    prompt:'Paper lanterns rise above the river, each one carrying a wish someone could not speak aloud. You can write one, or watch the others go.',
    lesson:'Some things can only be said when they are sent into the dark and out of reach.',
    source:'https://nonharvard.wordpress.com/2018/07/25/day-75-12-rules-for-life/',sourceTitle:'Non Harvard · Day 75: 12 Rules for Life',options:[
    option('write','Write your wish on a lantern','people',{wellbeing:2,skills:{eq:1}},'You wrote your wish and sent it upward. The lantern joined the others, and something inside you felt lighter.'),
    option('watch','Watch the lanterns without writing one','shield',{wellbeing:1},'You watched them rise. The wishes belonged to other people, and the night stayed beautiful.')]},
  {...base,id:'th_neighborhood_song',category:'connection',tone:'reflective',min:35,max:60,priority:2,urgent:false,
    eligible:s=>easter(s,'th_neighborhood_song'),
    title:'A song from the radio next door',
    prompt:'A neighbour’s radio plays an old Thai song you have not heard since childhood. The melody brings back a whole street you had almost forgotten.',
    lesson:'Music carries time better than memory does.',
    source:'https://nonharvard.wordpress.com/2015/10/29/day-32-what-makes-life-worth-living/',sourceTitle:'Non Harvard · Day 32: What Makes Life Worth Living',options:[
    option('listen','Stand and listen until the song ends','art',{wellbeing:2,skills:{craft:1}},'You listened. The song ended, but the street it remembered stayed with you for days.'),
    option('go','Close the window and keep working','clock',{wellbeing:-1,skills:{drive:1}},'You closed the window. The song finished without you, and the street stayed forgotten.')]}
];
