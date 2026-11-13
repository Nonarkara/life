import {regionIdFor,regionAt,homeRegion} from './regions.js';
// Content wave 1 (REBUILD-STRATEGY.md step 3). Original scenes written to the grammar in
// ERA-SCENARIO-BANK.md: one small object, a cost carried by a named person, no verdict.
// None is tied to a calendar year, so none states a historical fact. Each is gated to the
// lives it could happen to, so a life only meets the scenes its circumstances allow.
const cls=s=>s.intake?.class??s.birth?.class;
const of=(...k)=>s=>k.includes(cls(s));
const at=(...r)=>s=>r.includes(homeRegion(s.birth,s.age));
const sex=s=>s.intake?.sex??s.birth?.sex;
const happened=re=>s=>(s.history??[]).some(r=>re.test(r.event??''));
// "grandmother dies" must not read as a mother's death.
const motherGone=happened(/(?<!grand)mother dies/),fatherGone=happened(/(?<!grand)father dies/);
const hh=s=>s.birth?.household??'parents';
const withMother=s=>['parents','mothers'].includes(hh(s))&&!motherGone(s),withFather=s=>['parents','fathers'].includes(hh(s))&&!fatherGone(s);
const away=s=>regionAt(s)!==homeRegion(s.birth,s.age);
const child=(lo,hi)=>s=>{const f=s.story?.flags??{};return f.parent!==undefined&&f.childLost===undefined&&s.age-f.parent>=lo&&s.age-f.parent<=hi;};
const all=(...f)=>s=>f.every(g=>g(s));
const o=(id,label,effects,outcome)=>({id,label,...effects,outcome});
// House rule the engine and tests rely on: the first option costs nothing, so no life is ever stuck.
const scene=(id,category,min,max,eligible,title,prompt,options)=>({id,category,min,max,priority:2,eligible,title,prompt,options:[...options.filter(x=>!(x.cash<0)).slice(0,1),...options.filter((x,i,a)=>x!==a.find(y=>!(y.cash<0)))]});
const RICH=of('high_class'),NOT_RICH=of('low_class','working_class','middle_class'),POOR=of('low_class','working_class');
export {cls,of,at,sex,happened,motherGone,fatherGone,withMother,withFather,away,child,all,o,scene,RICH,NOT_RICH,POOR};

export const WAVE1_ENCOUNTERS=[
 // Households with money and a name
 scene('w1_nanny','family',25,45,RICH,'Her slippers by the back door',
  'The woman who raised you is going home to her village for good. Her plastic slippers are still by the back door. You do not know the names of her own children.',[
  o('roof','Pay for a new roof on her house',{cash:-40000,wellbeing:3,flag:'nanny'},'You paid for the roof. She sent a photo of it, with her grandchildren standing under it.'),
  o('visit','Promise to visit once a year, and go',{wellbeing:2,skills:{eq:1},flag:'nanny'},'You went the first year. She cooked for you as if you were still eight.'),
  o('envelope','Give her an envelope and let her go',{cash:-5000},'You gave her an envelope at the gate. The slippers stayed by the door for a month.')]),
 scene('w1_inheritance','family',45,65,all(RICH,fatherGone),'The house went to your sister',
  'Your father left the land in three pieces. Your sister has the house you grew up in. Your old room still has your height marked on the door frame.',[
  o('accept','Accept it and keep the peace',{wellbeing:1,skills:{eq:1}},'You let it go. At New Year she set a place for you at the old table.'),
  o('buy','Offer to buy the room back from her',{wellbeing:2},'She sold you nothing, but she gave you the door frame. It leans against your wall now.'),
  o('contest','Ask a lawyer to look at the will',{cash:-30000,wellbeing:-3,flag:'contested'},'The lawyer found nothing wrong. You and your sister spoke through other people for two years.')]),
 scene('w1_board','work',25,40,of('high_class'),'A chair at the long table',
  'Your uncle offers you a seat on the family company board. You have never read a balance sheet. Everyone at the table has known you since you were a baby.',[
  o('take','Take the seat',{cash:60000,wellbeing:-2,skills:{iq:1}},'You signed papers you half understood. The fee arrived every quarter, and so did the phone calls.'),
  o('learn','Take it after a year of learning the business',{wellbeing:-1,skills:{iq:1}},'You spent a year in the accounts office first. At the table later, you asked the questions no one else did.'),
  o('decline','Decline and keep your own work',{wellbeing:2,skills:{drive:1}},'You said no. Your uncle did not raise it again, and did not forget it either.')]),
 scene('w1_match','connection',24,34,of('high_class','bureaucratic_class'),'Dinner with a suitable family',
  'The two mothers have arranged a dinner. The other family\'s child keeps checking the door. Your mother has bought you a new shirt for it.',[
  o('try','Go, and try to like them',{wellbeing:1,skills:{eq:1}},'You talked about the food, then about your mothers. It was a better evening than either of you expected.'),
  o('polite','Go, be polite, and say no afterwards',{wellbeing:-1},'You were polite. Your mother stopped mentioning it after a week, which was worse.'),
  o('refuse','Refuse to go',{wellbeing:-2,skills:{drive:1}},'You did not go. The new shirt hung in your wardrobe for years.')]),
 scene('w1_transfer','work',28,50,all(of('bureaucratic_class'),withFather),'The transfer order',
  'A transfer order sends you to a province six hundred kilometres away. Your father served out there once, and came home a different man.',[
  o('alone','Go alone and come home at weekends',{cash:-12000,wellbeing:-2,flag:'transferred'},'You took the night bus every Friday. You learned the names of the drivers.'),
  o('family','Take the whole family with you',{cash:-25000,wellbeing:1,flag:'transferred'},'The children changed schools. In the end they cried when you were sent back.'),
  o('favour','Ask a senior to have the order changed',{skills:{eq:1},wellbeing:1,flag:'owesFavour'},'The order was changed. Three years later, the senior asked for something back.')]),
 scene('w1_envelope','work',30,55,of('bureaucratic_class'),'An envelope for the tea fund',
  'A contractor leaves an envelope on your desk "for the office tea fund". It is thick. The rent is due on Monday.',[
  o('return','Hand it back to him privately',{wellbeing:1,skills:{drive:1}},'You handed it back. He smiled as if it had been a misunderstanding. The rent was paid late.'),
  o('fund','Put it in the shared fund and say nothing',{wellbeing:-2},'It went into the fund. For a month the office ate better, and nobody looked at you differently.'),
  o('keep','Keep it, this once',{cash:20000,wellbeing:-2,flag:'tookEnvelope'},'The rent was paid. You never spent the rest, and you never threw the envelope away.')]),
 scene('w1_driver','family',50,72,of('high_class'),'The man who drove you to school',
  'Your family\'s driver of forty years is in hospital. He drove you to school every morning and never once told your parents where you really went after school.',[
  o('pay','Pay the whole bill',{cash:-60000,wellbeing:3},'You paid. His wife pressed a bag of mangoes into your arms at the ward door.'),
  o('share','Pay half and ask your siblings for the rest',{cash:-30000,skills:{eq:1},wellbeing:1},'Your brother paid his share. Your sister said she would, and then did not.'),
  o('visit','Visit him every Sunday',{wellbeing:2,skills:{eq:1}},'You sat with him on Sundays. He told you stories about your father you had never heard.')]),

 // The regions and the working households
 scene('w1_grandma_raised','family',22,48,all(POOR,at('isan-village','nakhon-sawan'),child(2,10),withMother,away),'On the phone, she calls her grandmother "Mother"',
  'You work in Bangkok. Your child lives in the village with your mother. On the phone your child calls their grandmother "Mother", and calls you by your nickname.',[
  o('home','Go home and earn less',{cash:-30000,wellbeing:3,flag:'wentHome'},'You went home. The money was thin. By the second month you were not called by your nickname any more.'),
  o('send','Stay and send more each month',{wellbeing:-3,skills:{drive:1}},'You sent more. Your child came to the phone less often, because there was always someone to play with.'),
  o('bring','Bring your child to your room in the city',{cash:-20000,wellbeing:1,skills:{eq:1}},'Your child came, missed the chickens and their grandmother, and said so every night.')]),
 scene('w1_boat_engine','work',20,55,all(at('pak-phanang'),withFather),'The engine on the longtail',
  'The engine on the family boat has died. Fixing it will cost a month of catches. Your father is sitting on the jetty looking at it.',[
  o('buyer','Borrow from the fish buyer',{wellbeing:-1,flag:'owesBuyer'},'The buyer lent the money. From then on he set the price before you landed.'),
  o('trawler','Take a job on a trawler for a season',{health:-4,wellbeing:-1,skills:{physique:1}},'You worked on the big boat for four months. You came home thinner, with enough to fix the engine.'),
  o('gold','Sell your mother\'s gold chain',{wellbeing:-2},'She took the chain off without a word. The engine started on the second pull.')]),
 scene('w1_gold','money',25,55,all(POOR,withMother),'One baht of gold',
  'Your mother keeps a one-baht gold necklace for emergencies. The school fees are due. The pawnshop is at the end of the soi.',[
  o('pawn','Pawn the necklace',{wellbeing:-1,flag:'pawned'},'You pawned it. Every month you paid the interest, and every month you meant to get it back.'),
  o('lender','Borrow from the man who lends by the day',{wellbeing:-3,flag:'dailyLender'},'He lent it. His collector came every evening on a motorbike.'),
  o('wait','Ask the school for another month',{skills:{eq:1},wellbeing:-1},'The teacher gave you a month. She did not ask why.')]),
 scene('w1_tickets','family',30,75,all(NOT_RICH,fatherGone,withMother),'Two tickets in his shirt pocket',
  'In your father\'s shirt pocket you find two lottery tickets with the same number. The number is your birthday.',[
  o('keep','Keep buying that number every fortnight',{cash:-2400,wellbeing:2,flag:'fatherNumber'},'You bought the number every fortnight. It never won. You kept buying it anyway.'),
  o('frame','Keep the tickets and stop there',{wellbeing:1},'You put the tickets in the drawer with his watch.'),
  o('mother','Give them to your mother',{skills:{eq:1},wellbeing:2},'Your mother looked at the number for a long time, then laughed for the first time that week.')]),
 scene('w1_vest','work',20,45,all(POOR,at('khlong-toei','samut-prakan')),'The orange vest',
  'A place at the motorbike-taxi stand at the corner is for sale, with its numbered vest. The man selling it has a bad back. He wants cash.',[
  o('buy','Buy the vest',{cash:-25000,health:-2,flag:'vest'},'You bought it. You learned every soi within four kilometres, and every pothole in them.'),
  o('rent','Rent a vest by the day from the stand owner',{cash:-3000,wellbeing:-1},'You rented by the day. Half of what you earned went back to the owner.'),
  o('factory','Take the factory shift instead',{cash:5000,wellbeing:-1,skills:{craft:1}},'You took the factory job. The hours were long, and the pay came on the same day each month.')]),
 scene('w1_scale','family',14,25,all(of('working_class','middle_class'),at('samut-prakan'),withMother),'The scale is fifty grams heavy',
  'You notice your mother\'s market scale reads fifty grams heavy. The regular customers do not know. Your school fees come out of that stall.',[
  o('tell','Tell her you noticed',{skills:{eq:1},wellbeing:-1},'She looked at you for a long moment. The next morning the scale was right.'),
  o('fix','Fix the scale yourself before dawn',{skills:{craft:1}},'You fixed it before she woke. She never mentioned it, and neither did you.'),
  o('nothing','Say nothing',{wellbeing:-2},'You said nothing. You stopped helping at the stall on weekends.')]),
 scene('w1_ordain','family',19,26,all(s=>sex(s)==='male',withMother),'Your mother wants you ordained',
  'Your mother wants you to be ordained as a monk before you settle down. Your boss says your job will not wait three months.',[
  o('three','Ordain for the full three months',{cash:-15000,wellbeing:3,skills:{eq:1},flag:'ordained'},'You lost the job. On the morning your head was shaved, your mother cried in the front row.'),
  o('short','Ordain for fifteen days',{cash:-4000,wellbeing:2,flag:'ordained'},'Fifteen days was enough to learn how early the morning starts.'),
  o('later','Promise to do it later',{wellbeing:-1},'You promised later. Your mother kept the saffron cloth she had bought, folded in a drawer.')]),
 scene('w1_daughter','family',30,52,all(NOT_RICH,s=>sex(s)==='female',withMother),'You are the one who is expected',
  'Your parents are getting old. Your brothers have families of their own. Everyone assumes, without anyone saying it, that you will be the one to move home.',[
  o('move','Move home',{cash:-20000,wellbeing:-1,skills:{eq:1},flag:'carer'},'You moved home. Your brothers called on Sundays and asked how everyone was.'),
  o('pay','Stay where you are and pay for help',{cash:-36000,wellbeing:-1},'You paid for a carer. Your mother asked for you by name every evening.'),
  o('share','Call a family meeting and ask your brothers to share',{skills:{eq:1,drive:1}},'In the end your youngest brother took two days a week.')]),
 scene('w1_rice','family',22,55,all(at('isan-village','nakhon-sawan'),withFather,away),'Fifteen kilos of rice on the bus',
  'Every month your father sends a fifteen-kilo sack of rice from the village on the bus. You can buy rice at the corner shop for less than the fare.',[
  o('stop','Tell him he does not need to',{wellbeing:-1},'He stopped. On the phone he sounded older.'),
  o('accept','Keep collecting it from the bus station',{wellbeing:2},'You kept collecting it. Your neighbours ate well, and your father asked if the rice was good this year.'),
  o('send','Collect it, and send money back on the same bus',{cash:-6000,wellbeing:2,skills:{eq:1}},'The rice came one way and the money went the other. Neither of you mentioned it.')]),
 scene('w1_fire','connection',18,45,at('khlong-toei'),'The family next door',
  'The house next door burned down in the night. Five people have nowhere to sleep. You have one room.',[
  o('share','Let them sleep in your room',{health:-2,wellbeing:2,skills:{eq:1},flag:'shelteredNeighbours'},'They slept on your floor for six weeks. The grandmother cooked for everyone.'),
  o('money','Give them money for a room',{cash:-4000,wellbeing:1},'You gave what you could. They found a room two sois away.'),
  o('help','Help them clear the site',{health:-1,skills:{physique:1}},'You spent three days moving burnt boards. Their son came to say thank you every time he saw you.')]),

 // Any household, any region: illness, death, small money
 scene('w1_chanting','family',35,72,happened(/(?<!grand)(father|mother) dies/),'Who hosts which night',
  'The funeral chanting runs seven nights. Each night has a host who pays for the monks and the food. The family is dividing the nights.',[
  o('host','Host a night',{cash:-15000,wellbeing:2},'You hosted the fourth night. People you had not seen in twenty years came and ate.'),
  o('kitchen','Work in the kitchen every night',{health:-2,wellbeing:2,skills:{eq:1}},'You washed dishes for seven nights. Your aunts stopped treating you like a child.'),
  o('sit','Come each night and sit at the front',{wellbeing:1},'You sat at the front every night. On the last night you understood a few of the words.')]),
 scene('w1_ward_chair','family',40,70,s=>withMother(s)&&((s.history??[]).some(r=>/illness|setback|hospital/i.test(r.event??''))||s.age>=50),'A plastic chair beside the bed',
  'Your mother is in a public ward. Someone in the family has to sleep beside her on a plastic chair each night.',[
  o('most','Take most of the nights yourself',{health:-4,wellbeing:1,skills:{eq:1}},'You slept on the chair for three weeks. You and the woman in the next bed became friends.'),
  o('carer','Pay a carer for the nights',{cash:-9000},'The carer was kind. Your mother called her by your name.'),
  o('rota','Make a rota with your siblings',{skills:{eq:1},wellbeing:-1},'The rota worked for a week. After that it was mostly you and one cousin.')]),
 scene('w1_shoes','family',33,62,child(6,15),'The shoes everyone has',
  'Your child wants the school shoes that every other child has. They cost three times the plain ones. Your child has not asked for anything else all year.',[
  o('buy','Buy the shoes',{cash:-1500,wellbeing:2},'Your child polished them every evening for a month.'),
  o('plain','Buy the plain ones',{wellbeing:-1},'Your child wore them without complaint. You noticed they always sat with their feet under the bench.'),
  o('half','Pay half, and let your child save for the rest',{cash:-750,skills:{eq:1}},'It took your child four months. The shoes lasted two years.')]),
 scene('w1_loan','connection',30,60,s=>s.story?.flags?.friend!==undefined,'A friend asks to borrow money',
  '{friend} asks to borrow thirty thousand baht for their mother\'s operation. They bring the hospital estimate, folded in four.',[
  o('lend','Lend it',{cash:-30000,wellbeing:1,flag:'lentFriend'},'You lent it. {friend} paid back twelve thousand over three years, then stopped.'),
  o('give','Give a smaller amount, and do not ask for it back',{cash:-8000,wellbeing:2},'You gave what you could spare. {friend} never mentioned it. Neither did you.'),
  o('no','Say you cannot',{wellbeing:-2},'You said no. {friend} said they understood, and came to fewer dinners after that.')]),
 scene('w1_songkran','family',20,50,all(NOT_RICH,away,s=>withMother(s)||withFather(s)),'Going home for Songkran',
  'Songkran is coming. Going home means two days on crowded buses. Your employer pays double for anyone who works through the holiday.',[
  o('home','Go home',{cash:-3000,wellbeing:3},'You poured water over your parents\' hands. Your mother said you looked tired.'),
  o('work','Work through it for double pay',{cash:6000,wellbeing:-2},'You worked through. Your mother sent a photo of the family with an empty space at the end.'),
  o('call','Work, and send money for the temple offering',{cash:3000,wellbeing:-1},'You sent money for the offering. Your mother said the monks chanted your name.')]),
 scene('w1_first_pay','money',18,25,all(NOT_RICH,withMother),'Your first salary',
  'Your first salary is in an envelope. In your family, the first salary goes to your mother.',[
  o('all','Give her all of it',{cash:-9000,wellbeing:3},'She took it with both hands. Months later you found she had put it in a bank book in your name.'),
  o('half','Give her half',{cash:-4500,wellbeing:2},'She smiled and counted it twice.'),
  o('keep','Keep it for something you need',{wellbeing:-1,skills:{drive:1}},'You bought what you needed. Your mother told the neighbours you had a good job.')])
];
