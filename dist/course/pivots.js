// The spine of a life: twenty-eight hard questions, two at every five-year
// station from ten to seventy-five.
//
// Every question is a fork with a cost on both sides. None of them is a free
// win, and none of them asks what the player already knows. The answers are
// recorded in the history row, they lock part of the coming five years, and
// some of them are gambles where the same luck is shared with every branch.
//
// These are authored game decisions, not advice about a real life.
import {rand} from './sim.js';

// A station is one of the fourteen five-year reviews a life passes through.
export const STATIONS=[10,15,20,25,30,35,40,45,50,55,60,65,70,75];
export const ERAS={
  childhood:{label:'Childhood',note:'The house decides for you.'},
  school:{label:'Schooling',note:'Your books and your people pull in different directions.'},
  building:{label:'Building',note:'The years when a life takes its shape.'},
  turning:{label:'Turning points',note:'The years when other people need you.'},
  later:{label:'Later years',note:'The years when you answer to yourself.'},
};
const era=station=>station<15?'childhood':station<20?'school':station<40?'building':station<60?'turning':'later';

export const PIVOTS=[
 // ---- station 10: childhood -------------------------------------------------
 {
  id:'child-roof',station:10,
  prompt:'The house needs a new roof and the market stall needs hands. There is only one of you to give.',
  context:'Your mother is at the stall before dawn. The school fee is due on Friday.',
  options:[
   {id:'stall',label:'Work the stall with your mother after school',cost:'Your books slip. The household gets two pairs of hands.',
    effects:{cash:9000,health:-2,wellbeing:1,skills:{drive:1,eq:1}},locks:{drive:2},
    note:'You carried crates at the stall after school.'},
   {id:'books',label:'Keep your books and let the household carry it',cost:'The roof waits another year. Your mother works later.',
    effects:{cash:-1500,wellbeing:-3,skills:{iq:1}},locks:{iq:3},
    note:'You kept your books while the roof waited.'},
   {id:'scholarship',label:'Ask the teacher about a scholarship',cost:'It depends entirely on who is listening.',
    luck:{chance:.45,success:{cash:7000,skills:{iq:1}},failure:{wellbeing:-2}},
    note:'You asked the teacher about a scholarship.'}
  ]
 },
 {
  id:'child-sponsor',station:10,
  prompt:'A man from the next soi offers to pay your school fees for three years of work in his workshop afterwards.',
  context:'He is not a bad man. He is a man who counts.',
  options:[
   {id:'accept',label:'Accept, and keep the promise',cost:'Three years are spoken for before you are fifteen.',
    effects:{cash:4000,skills:{craft:1}},locks:{craft:3},flags:{sponsored:true},
    note:'A workshop owner paid your way, and the years after it were his.'},
   {id:'refuse',label:'Refuse. The debt is yours or no one’s',cost:'The stall stays short-handed for another year.',
    effects:{cash:-2000,wellbeing:-1},
    note:'You turned down the workshop man and kept your freedom.'},
   {id:'terms',label:'Ask him to put the promise in writing',cost:'He may respect the question, or he may not.',
    luck:{chance:.5,success:{cash:12000,skills:{craft:1},flags:{sponsored:true}},failure:{wellbeing:-3,cash:-2000}},
    note:'You asked for the promise in writing.'}
  ]
 },
 // ---- station 15: schooling -------------------------------------------------
 {
  id:'school-apprentice',station:15,
  prompt:'School says continue. The workshop says start now and earn while you learn.',
  context:'Your hands are better than your marks. Your marks are better than your hands.',
  options:[
   {id:'school',label:'Continue school',cost:'Two years of fees and no earnings.',
    effects:{cash:-6000,skills:{iq:1}},locks:{iq:2},pathway:'school',
    note:'You stayed in school when work was offered.'},
   {id:'apprentice',label:'Start the apprenticeship',cost:'The learning is paid in hours, not in pay.',
    effects:{cash:8000,health:-1,skills:{craft:1,physique:1}},locks:{craft:3},pathway:'vocational',
    note:'You took the apprenticeship and learned by doing.'},
   {id:'both',label:'Ask to do the school work in the evenings',cost:'Both, at the price of sleep.',
    effects:{cash:4000,health:-3,wellbeing:-2,skills:{iq:1,craft:1}},locks:{craft:2},
    note:'You did the workshop by day and the books by lamplight.'}
  ]
 },
 {
  id:'school-leave',station:15,
  prompt:'Your friends have a place on a building site in Bangkok for the summer. It pays more than your family needs.',
  context:'The site is in the heat. The money is real.',
  options:[
   {id:'go',label:'Go with them for the summer',cost:'The heat takes something out of you. The money comes in.',
    effects:{cash:12000,health:-4,wellbeing:1,skills:{physique:1,drive:1}},locks:{physique:2},
    note:'You spent a summer on a building site in Bangkok.'},
   {id:'stay',label:'Stay and keep the term',cost:'Your friends moved on without you.',
    effects:{wellbeing:-2,skills:{iq:1}},locks:{iq:2},
    note:'You stayed in school while your friends went to the site.'},
   {id:'send',label:'Send your earnings home and take night classes',cost:'Your body pays first.',
    effects:{cash:9000,health:-5,skills:{iq:1}},locks:{iq:2},
    note:'You worked the site and studied at night.'}
  ]
 },
 // ---- station 20: building --------------------------------------------------
 {
  id:'college-cost',station:20,
  prompt:'College costs more than the family can pay. A loan would follow you for a decade.',
  context:'The figures are clear. What they do not say is what a decade feels like.',
  options:[
   {id:'loan',label:'Take the loan and go',cost:'A decade of your income, decided now.',
    requires:{cash:8000},effects:{cash:-20000,wellbeing:-2,skills:{iq:1}},locks:{iq:3},pathway:'college',
    note:'You took the loan and went.'},
   {id:'work',label:'Start work and pay for it yourself',cost:'The first years of your life are given to a wage.',
    effects:{cash:15000,skills:{drive:1}},locks:{drive:2},pathway:'work',
    note:'You started work and paid your own way.'},
   {id:'half',label:'Study part time while you work',cost:'Everything at once, nothing at full strength.',
    effects:{cash:6000,health:-2,skills:{iq:1,eq:1}},locks:{iq:2},
    note:'You studied in the evenings and worked in the days.'}
  ]
 },
 {
  id:'stall-paper',station:20,
  prompt:'Your mother asks you to put your name on the stall’s paperwork so it can survive this year.',
  context:'The stall is hers and your grandmother’s. After your name, it is half yours.',
  options:[
   {id:'sign',label:'Sign. The stall is the family’s only floor',cost:'Half the stall is yours to keep or to lose.',
    effects:{cash:8000,wellbeing:2},flags:{stallShare:true},locks:{eq:2},
    note:'You put your name on the stall’s paperwork.'},
   {id:'refuse',label:'Refuse. Your life cannot be tied to a stall',cost:'Your mother carries the year alone.',
    effects:{wellbeing:-5,cash:0},flags:{stallRefused:true},
    note:'You refused to sign the stall’s papers.'},
   {id:'buy',label:'Offer to buy the stall outright',cost:'Most of what you have, for a business that never sleeps.',
    effects:{cash:-14000,wellbeing:1,skills:{drive:1}},flags:{stallOwner:true},locks:{drive:3},
    note:'You bought the stall your family had kept for two generations.'}
  ]
 },
 // ---- station 25: building --------------------------------------------------
 {
  id:'city-pay',station:25,
  prompt:'A job in Bangkok pays three times what your work here pays. The work here is the work you love.',
  context:'The offer is real and it is dated. The city is not the same as the room you are in now.',
  options:[
   {id:'take',label:'Take the offer',cost:'The city takes the years you would have spent making things.',
    effects:{cash:25000,wellbeing:-3,skills:{drive:1}},locks:{drive:3},pathway:'work',
    note:'You took the Bangkok offer.'},
   {id:'stay',label:'Stay and build it slowly here',cost:'Slower, smaller, yours.',
    effects:{cash:4000,wellbeing:3,skills:{craft:2}},locks:{craft:3},pathway:'independent',
    note:'You stayed and built your work slowly.'},
   {id:'negotiate',label:'Ask for more money to stay',cost:'The offer may survive the asking, or it may not.',
    luck:{chance:.55,success:{cash:20000,wellbeing:2,skills:{craft:1}},failure:{cash:3000,wellbeing:-4}},
    note:'You asked for more to stay.'}
  ]
 },
 {
  id:'partner-choice',station:25,
  prompt:'There is the person your family approves of, and the person you actually want. You can only have one road.',
  context:'Your mother has already started talking to the first family.',
  options:[
   {id:'family',label:'Take the family’s road',cost:'A safer marriage, and a quieter room.',
    effects:{wellbeing:-2,cash:6000},flags:{married:25},locks:{eq:2},
    note:'You took the road your family had smoothed for you.'},
   {id:'your-own',label:'Choose the person you want',cost:'Your mother is disappointed, and says so for years.',
    effects:{wellbeing:4,skills:{eq:1}},flags:{married:25,defiedFamily:true},
    note:'You chose the person your family did not choose for you.'},
   {id:'wait',label:'Wait a year and decide with more distance',cost:'A year of waiting is not a year of yours.',
    effects:{wellbeing:-1,skills:{iq:1}},
    note:'You waited a year before choosing anyone.'}
  ]
 },
 // ---- station 30: the flood year --------------------------------------------
 {
  id:'flood-repair',station:30,
  prompt:'The flood has taken the roof, the wiring and half the furniture. Repairs cost everything you have.',
  context:'The house is your mother’s and your father’s. It is also where you sleep.',
  options:[
   {id:'repair',label:'Repair the house',cost:'Every baht you had, into a building that is not yours alone.',
    effects:{cash:-30000,wellbeing:2},locks:{eq:2},
    note:'You spent everything you had putting the roof back.'},
   {id:'savings',label:'Keep the money and rebuild your own',cost:'The family finds another way to live.',
    effects:{cash:12000,wellbeing:-4},flags:{leftTheHouse:true},
    note:'You kept your money and let the house go.'},
   {id:'split',label:'Split it: repair half, keep half',cost:'Half a house is still a house to live in.',
    effects:{cash:-12000,wellbeing:-1},
    note:'You repaired half the house and kept half the money.'}
  ]
 },
 {
  id:'flood-move',station:30,
  prompt:'Your father’s cousin has land in the provinces and a house with space. Staying means rebuilding in the same lane.',
  context:'In the provinces nobody knows your name. In the lane everybody does.',
  options:[
   {id:'move',label:'Move the family to the provinces',cost:'Your mother leaves the stall and the neighbourhood.',
    effects:{cash:15000,wellbeing:-5,skills:{craft:1}},flags:{movedProvince:true},locks:{craft:2},
    note:'You moved the family to the provinces after the flood.'},
   {id:'stay',label:'Stay in the lane and rebuild',cost:'You rebuild in the same water that took it.',
    effects:{cash:-10000,wellbeing:3,skills:{drive:1}},
    note:'You stayed in the lane and rebuilt what the flood took.'}
  ]
 },
 // ---- station 35: building --------------------------------------------------
 {
  id:'year-abroad',station:35,
  prompt:'A year of study abroad is offered to you. If it fails, no money comes back.',
  context:'One year away from everyone you have made. The work you have built stays behind.',
  options:[
   {id:'go',label:'Go for the year',cost:'A year away, and the risk that it is a wasted year.',
    effects:{cash:-18000,skills:{iq:2}},locks:{iq:3},
    note:'You spent a year studying abroad.'},
   {id:'stay',label:'Stay and go deeper where you are',cost:'The year passes without the horizon changing.',
    effects:{cash:6000,skills:{craft:1}},locks:{craft:2},
    note:'You stayed and went deeper into your own work.'},
   {id:'half-year',label:'Go for half a year, leave the rest',cost:'Neither the year nor the work gets your full self.',
    effects:{cash:-6000,health:-2,skills:{iq:1,craft:1}},
    note:'You went abroad for half a year and came back early.'}
  ]
 },
 {
  id:'partner-business',station:35,
  prompt:'A friend asks you to put your name and your savings into a small workshop with him.',
  context:'He is good with his hands and careless with money. You are the opposite.',
  options:[
   {id:'join',label:'Put your name and savings in',cost:'Your savings, your name, your friend’s habits.',
    effects:{cash:-20000,skills:{drive:2,craft:1}},flags:{founder:35},locks:{drive:3},
    note:'You put your name and your savings into the workshop.'},
   {id:'lend',label:'Lend the money, keep your name out',cost:'He has your money and none of your risk.',
    effects:{cash:-12000,wellbeing:-1,flags:{lentToFriend:true}},
    note:'You lent your friend the money and kept your name off it.'},
   {id:'decline',label:'Decline',cost:'The friendship cools. The workshop does well anyway.',
    effects:{wellbeing:-2,cash:3000},
    note:'You turned your friend down.'}
  ]
 },
 // ---- station 40: turning ---------------------------------------------------
 {
  id:'promotion-away',station:40,
  prompt:'The promotion comes with relocation. The salary doubles. The family stays where it is.',
  context:'You have a child’s school year and a parent’s bad back to think about.',
  options:[
   {id:'go',label:'Take it',cost:'You commute from another city, or you commute alone.',
    effects:{cash:30000,wellbeing:-4,skills:{drive:1}},locks:{drive:2},
    note:'You took the promotion in another city.'},
   {id:'stay',label:'Refuse and stay',cost:'The ceiling stays where it is.',
    effects:{cash:5000,wellbeing:4,skills:{eq:1}},locks:{eq:3},
    note:'You turned the promotion down and stayed.'},
   {id:'negotiate',label:'Ask whether the work can be done from home',cost:'A question that may end the offer.',
    luck:{chance:.5,success:{cash:22000,wellbeing:2},failure:{cash:4000,wellbeing:-5}},
    note:'You asked if the job could be done from home.'}
  ]
 },
 {
  id:'parent-ill',station:40,
  prompt:'Your mother is ill and the family needs someone home for the months it will take.',
  context:'Your partner is working. Your work is waiting. Someone has to be at the bedside.',
  options:[
   {id:'care',label:'You go home and care for her',cost:'Your own work stops for a while.',
    effects:{cash:-15000,wellbeing:3,skills:{eq:2}},flags:{caredForMother:true},locks:{eq:3},
    note:'You went home to care for your mother.'},
   {id:'split',label:'Share it with your partner',cost:'Neither of you is fully there.',
    effects:{cash:-5000,wellbeing:-1,skills:{eq:1}},
    note:'You shared the caring with your partner.'},
   {id:'pay',label:'Pay for care and stay at work',cost:'Care is bought, not given. She notices.',
    effects:{cash:-10000,wellbeing:-4},
    note:'You paid for the care and stayed at work.'}
  ]
 },
 // ---- station 45: turning ---------------------------------------------------
 {
  id:'share-offer',station:45,
  prompt:'The firm offers you a share of the business: less pay now, and a piece of it later.',
  context:'The offer is in writing. The firm is small. The share is real.',
  options:[
   {id:'accept',label:'Take the share',cost:'Your pay drops now. Your claim grows later.',
    effects:{cash:-8000,wellbeing:1,skills:{drive:1}},flags:{partnered:45},locks:{drive:2},
    note:'You took a share of the firm instead of a raise.'},
   {id:'raise',label:'Take the raise instead',cost:'You own nothing but your hours.',
    effects:{cash:22000,skills:{drive:1}},
    note:'You took the raise and no share.'},
   {id:'both',label:'Ask for a smaller share and a smaller cut',cost:'Less of everything, but not nothing.',
    effects:{cash:8000,flags:{partnered:45}},
    note:'You negotiated a smaller share and a smaller cut.'}
  ]
 },
 {
  id:'buy-house',station:45,
  prompt:'The house your family rents is for sale. The price is a number you can just about reach.',
  context:'Renting keeps the money liquid. Buying keeps the walls.',
  options:[
   {id:'buy',label:'Buy it',cost:'Your savings become bricks and land.',
    requires:{cash:24000},effects:{cash:-30000,wellbeing:4,flags:{ownsHouse:true}},
    note:'You bought the house your family had been renting.'},
   {id:'rent',label:'Keep renting and keep the money',cost:'Another landlord, another decade.',
    effects:{cash:15000,wellbeing:-2},
    note:'You kept renting and kept the money.'},
   {id:'share',label:'Buy it with your mother',cost:'Shared walls, shared costs, shared decisions.',
    effects:{cash:-15000,wellbeing:3,flags:{sharedHouse:true}},
    note:'You bought the house together with your mother.'}
  ]
 },
 // ---- station 50: turning ---------------------------------------------------
 {
  id:'child-city',station:50,
  prompt:'Your child has a place at a school in another city. You could go with them.',
  context:'Your work is here. Their school is there. There is no version where both are easy.',
  options:[
   {id:'move',label:'Move the family with them',cost:'Your work, your network, your routine.',
    effects:{cash:-10000,wellbeing:3,skills:{eq:2}},flags:{movedForChild:true},locks:{eq:2},
    note:'You moved the family for your child’s school.'},
   {id:'stay',label:'Stay and support them from here',cost:'They will be on their own sooner than you would like.',
    effects:{cash:5000,wellbeing:-3},
    note:'You stayed and supported your child from a distance.'},
   {id:'split-year',label:'Split the year between both places',cost:'Neither place is home for long.',
    effects:{cash:-3000,health:-3,wellbeing:-1},
    note:'You split your year between two cities.'}
  ]
 },
 {
  id:'leave',station:50,
  prompt:'You can take six months unpaid to travel with your family, or you can keep the position.',
  context:'Your family will remember one of these. You will remember the other.',
  options:[
   {id:'travel',label:'Take the six months',cost:'Half a year of pay and the chance it matters more than money.',
    effects:{cash:-15000,wellbeing:6,skills:{eq:2}},flags:{tookLeave:true},
    note:'You took six months off and went with your family.'},
   {id:'work',label:'Keep the position',cost:'The family stays at home, and you stay at work.',
    effects:{cash:18000,wellbeing:-3},
    note:'You kept the position and the family stayed home.'}
  ]
 },
 // ---- station 55: the father's death ----------------------------------------
 {
  id:'father-tools',station:55,
  prompt:'Your father is gone. His tools, his debts and his wish that you keep the trade are yours to carry.',
  context:'His wish was not a request, and he was not a man who asked.',
  options:[
   {id:'tools',label:'Take the tools and the trade',cost:'The trade pays slowly and never stops paying.',
    effects:{cash:8000,skills:{craft:2},wellbeing:1},flags:{keptTrade:true},locks:{craft:3},
    note:'You took your father’s tools and kept the trade.'},
   {id:'sell',label:'Sell the tools and clear the debts',cost:'The debts go. The trade goes with them.',
    effects:{cash:16000,wellbeing:-4},flags:{soldTools:true},
    note:'You sold your father’s tools and cleared the debts.'},
   {id:'split',label:'Sell half, keep half',cost:'Enough to live, not enough to be the trade.',
    effects:{cash:10000,skills:{craft:1},wellbeing:-1},
    note:'You sold half the tools and kept half.'}
  ]
 },
 {
  id:'stall-takeover',station:55,
  prompt:'Your mother asks you to take over the stall. She is tired and the stall is hers to give.',
  context:'The stall has a roof over it. Your own work does not.',
  options:[
   {id:'take',label:'Take over the stall',cost:'Your working life becomes a working day and a working night.',
    effects:{cash:10000,skills:{eq:1,drive:1},wellbeing:-1},flags:{ranStall:true},locks:{drive:2},
    note:'You took over the stall from your mother.'},
   {id:'keep-both',label:'Say no and keep your own work',cost:'Your mother runs it alone for longer.',
    effects:{cash:4000,wellbeing:-3,flags:{stallRefused:true}},
    note:'You said no to the stall and kept your own work.'},
   {id:'together',label:'Work it together, part-time',cost:'Neither job gets your full attention.',
    effects:{cash:7000,health:-2,skills:{eq:1},flags:{ranStall:true}},
    note:'You worked the stall alongside your own work.'}
  ]
 },
 // ---- station 60: later -----------------------------------------------------
 {
  id:'stay-on',station:60,
  prompt:'Your employer asks for five more years. They say it kindly. Your back has an opinion.',
  context:'Your body is the thing that has been keeping the promises for everyone else.',
  options:[
   {id:'stay',label:'Stay five more years',cost:'Your body pays the difference.',
    effects:{cash:25000,health:-6,wellbeing:-2},locks:{drive:2},
    note:'You stayed five more years than you meant to.'},
   {id:'stop',label:'Stop, and take what you have',cost:'The money stops and the mornings come back.',
    effects:{cash:3000,wellbeing:6,health:2,flags:{retiredAt:60}},locks:{eq:2},
    note:'You stopped working at sixty.'},
   {id:'teach',label:'Take less work and teach the trade instead',cost:'Half the pay, and a different kind of day.',
    effects:{cash:12000,wellbeing:3,skills:{eq:2,craft:1}},flags:{retiredAt:60},
    note:'You took less work and taught the trade instead.'}
  ]
 },
 {
  id:'nephew',station:60,
  prompt:'Your nephew asks to learn your trade. He is seventeen and good with his hands.',
  context:'Teaching takes the hours you were going to spend on yourself.',
  options:[
   {id:'teach',label:'Teach him',cost:'Your evenings and your patience.',
    effects:{cash:-5000,wellbeing:4,skills:{eq:1,craft:1}},flags:{apprentice:true},locks:{craft:2},
    note:'You took your nephew on as an apprentice.'},
   {id:'refer',label:'Refer him to someone else',cost:'He learns from someone with a full life of their own.',
    effects:{wellbeing:-1,skills:{drive:1}},
    note:'You sent your nephew to someone else to learn.'}
  ]
 },
 // ---- station 65: later -----------------------------------------------------
 {
  id:'treatment',station:65,
  prompt:'A treatment would give you ten good years. It costs most of what you have saved.',
  context:'The doctors are clear. The arithmetic is also clear. They are different kinds of clear.',
  options:[
   {id:'pay',label:'Pay for the treatment',cost:'Most of the savings, for time you would have had anyway.',
    requires:{health:70},effects:{cash:-35000,health:12,wellbeing:3},
    note:'You paid for the treatment.'},
   {id:'keep',label:'Keep the savings',cost:'You keep the money and take the years as they come.',
    effects:{cash:8000,health:-6,wellbeing:-2},
    note:'You kept the savings and declined the treatment.'},
   {id:'family',label:'Ask the family to help carry it',cost:'Your children carry part of it, and you both know it.',
    effects:{cash:-15000,health:8,wellbeing:2,flags:{familyPaid:true}},
    note:'Your family helped carry the cost of the treatment.'}
  ]
 },
 {
  id:'house-travel',station:65,
  prompt:'Your partner wants to sell the house and travel while you are still able. The family is close by.',
  context:'Selling is easy once. The people who would visit are not coming back.',
  options:[
   {id:'sell',label:'Sell the house and go',cost:'The money and the leaving, together.',
    effects:{cash:20000,wellbeing:5,health:-2,flags:{soldHouse:true}},
    note:'You sold the house and travelled while you could.'},
   {id:'keep',label:'Keep the house and the family close',cost:'The walls stay, and the days stay inside them.',
    effects:{wellbeing:3,skills:{eq:1}},
    note:'You kept the house and the family close.'}
  ]
 },
 // ---- station 70: the mother's death -----------------------------------------
 {
  id:'empty-house',station:70,
  prompt:'The house is empty now. Your mother’s things are still in the rooms.',
  context:'Selling clears the rooms and fills an account. Keeping leaves the rooms as they are.',
  options:[
   {id:'sell',label:'Sell it',cost:'Her things go to strangers, and the money goes to your children.',
    effects:{cash:30000,wellbeing:-5},
    note:'You sold the family house after your mother died.'},
   {id:'keep',label:'Keep it',cost:'An empty house with a full mortgage, and the family in it.',
    effects:{cash:-6000,wellbeing:4,flags:{keptHouse:true}},
    note:'You kept the family house and lived in it.'},
   {id:'give',label:'Give it to a niece who has no home',cost:'Your own children get nothing from it.',
    effects:{cash:0,wellbeing:6,skills:{eq:1},flags:{gaveHouse:true}},
    note:'You gave the family house to a niece who had nowhere.'}
  ]
 },
 {
  id:'take-in',station:70,
  prompt:'A relative of yours has no income and nowhere to go. There is a room.',
  context:'They will be in your house for as long as it takes, and they will not forget it.',
  options:[
   {id:'take-in',label:'Take them in',cost:'A room, a share of food, and the household rearranged.',
    effects:{cash:-8000,wellbeing:4,skills:{eq:1}},flags:{tookInRelative:true},
    note:'You took a relative in when they had nowhere to go.'},
   {id:'support',label:'Help them another way',cost:'Money does less than a room, and they know it.',
    effects:{cash:-12000,wellbeing:-3},
    note:'You supported your relative with money instead of a room.'},
   {id:'refuse',label:'Say no',cost:'The door closes, and you know it closes.',
    effects:{wellbeing:-6,skills:{drive:1}},
    note:'You said no when a relative needed a room.'}
  ]
 },
 // ---- station 75: the last station ------------------------------------------
 {
  id:'legacy',station:75,
  prompt:'What do you leave behind: money, the house, or the work of your hands?',
  context:'Your family will argue about this for longer than you will be there to answer.',
  options:[
   {id:'money',label:'Money, and the practical sense it buys',cost:'It is the only inheritance that cannot be argued with.',
    effects:{cash:20000,wellbeing:2},
    note:'You left money behind.'},
   {id:'house',label:'The house, for whoever is still living in it',cost:'The house holds its value; the family holds it too.',
    effects:{cash:-8000,wellbeing:4,flags:{leftHouse:true}},
    note:'You left the house to the family.'},
   {id:'work',label:'The work, and someone to carry it',cost:'A trade only survives if a young person takes it up.',
    effects:{cash:5000,wellbeing:3,skills:{craft:1},flags:{leftTrade:true}},
    note:'You left the trade, and someone young to carry it.'}
  ]
 },
 {
  id:'remembered',station:75,
  prompt:'One question left. What do you want to be remembered for?',
  context:'Nobody has asked you this before. It is not a plan. It is an answer.',
  options:[
   {id:'provider',label:'As the one who provided',cost:'You will be remembered for what you carried.',
    effects:{wellbeing:3,skills:{drive:1}},locks:{drive:2},
    note:'You wanted to be remembered as the one who provided.'},
   {id:'teacher',label:'As the one who taught someone',cost:'A small number of people will say your name for years.',
    effects:{wellbeing:4,skills:{eq:1,craft:1}},locks:{eq:2},
    note:'You wanted to be remembered as the one who taught someone.'},
   {id:'home',label:'As the one who stayed',cost:'You were here. That was the whole of it.',
    effects:{wellbeing:5,skills:{eq:1}},locks:{eq:2},
    note:'You wanted to be remembered as the one who stayed.'}
  ]
 },
];

export const pivotById=id=>PIVOTS.find(p=>p.id===id);
export const pivotsForStation=age=>PIVOTS.filter(p=>p.station===age);
export const pivotCount=PIVOTS.length;

// Some options are only open to a person in that situation.
function available(option,state){
  const need=option.requires??{};
  if(need.cash!==undefined&&state.cash<need.cash)return false;
  if(need.health!==undefined&&state.health<need.health)return false;
  if(need.wellbeing!==undefined&&state.wellbeing<need.wellbeing)return false;
  if(need.age!==undefined&&state.age<need.age)return false;
  if(need.flags&&!Object.entries(need.flags).every(([key,value])=>!!state.story?.flags?.[key]===value))return false;
  return true;
}
export const openOptions=(pivot,state)=>{
 const open=pivot.options.filter(option=>available(option,state));
 // A question with no answer would be a dead end. If the circumstances close
 // every door, the question is asked plainly instead.
 return open.length?open:pivot.options;
};

// The luck of a gamble is shared by every branch of the life: the same seed,
// the same station, the same question.
function resolveLuck(option,state){
  if(!option.luck)return{roll:null};
  const roll=rand(state.seed,state.age,'pivot-'+option.id);
  return{roll,won:roll<option.luck.chance};
}

// Answering a question changes the life: money, body, mind, skills, the record,
// and a commitment that holds for the coming five years.
export function applyPivot(state,pivot,optionId){
  const option=pivot.options.find(o=>o.id===optionId);
  if(!option)return state;
  const luck=resolveLuck(option,state);
  const effects={...(option.effects??{})};
  const skills={...(option.effects?.skills??{})};
  const flags={...(option.flags??{})};
  if(luck.roll!==null){
    const outcome=luck.won?option.luck.success:option.luck.failure;
    for(const[key,value]of Object.entries(outcome??{})){
      if(key==='skills')for(const[axis,gain]of Object.entries(value))skills[axis]=(skills[axis]??0)+gain;
      else if(key==='flags')Object.assign(flags,value);
      else if(key==='cash')effects.cash=(effects.cash??0)+value;
      else if(key==='health')effects.health=(effects.health??0)+value;
      else if(key==='wellbeing')effects.wellbeing=(effects.wellbeing??0)+value;
    }
  }
  const next={
    ...state,
    cash:state.cash+(effects.cash??0),
    health:Math.max(0,Math.min(100,state.health+(effects.health??0))),
    wellbeing:Math.max(0,Math.min(100,state.wellbeing+(effects.wellbeing??0))),
    skills:{...state.skills},
    // The story belongs to the encounters. A question keeps its own flags, so
    // the story's own record stays exactly what the encounters wrote.
    pivotFlags:{...(state.pivotFlags??{})},
  };
  for(const[axis,gain]of Object.entries(skills))next.skills[axis]=(next.skills[axis]??0)+gain;
  for(const[key,value]of Object.entries(flags))next.pivotFlags[key]=value;
  if(option.pathway)next.pathway=option.pathway;
  const record={
    station:state.age,pivot:pivot.id,choice:option.id,note:option.note,
    locks:{...(option.locks??{})},effects,skills,flags,
    pathway:option.pathway,
    before:{cash:state.cash,health:state.health,wellbeing:state.wellbeing,skills:{...state.skills},flags:{...state.story?.flags},pivotFlags:{...(state.pivotFlags??{})},pathway:state.pathway},
    luck:luck.roll===null?undefined:{roll:Number(luck.roll.toFixed(3)),won:luck.won},
  };
  next.pivots=[...(state.pivots??[]),record];
  return next;
}

// The questions a station still asks, and the ones already answered.
export function pendingPivots(state){
  return pivotsForStation(state.age).filter(pivot=>!(state.pivots??[]).some(record=>record.pivot===pivot.id));
}

// The commitment a question made: an axis cannot go below this for five years.
export function locksFor(state){
  const locks={};
  for(const record of state.pivots??[])if(record.station===state.age)for(const[axis,value]of Object.entries(record.locks??{}))locks[axis]=Math.max(locks[axis]??0,value);
  return locks;
}
