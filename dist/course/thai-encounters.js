import {region,regionAt,regionIdFor} from './regions.js';
// Researched circumstances, fictional people and authored game effects. These
// are choices, not predictions of political events, harvests or class destiny.
const thai=s=>region(regionAt(s)).country==='TH';
const farm=s=>thai(s)&&['isan-village','nakhon-sawan'].includes(regionIdFor(s.birth));
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
   option('ask','Ask about support or different hours','agreement',{skills:{eq:1},wellbeing:-1},'You asked about travel support and flexible hours. Negotiating took energy; neither funding nor a place was promised.') ]}
];
