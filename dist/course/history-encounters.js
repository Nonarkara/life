// History a person has to live through, for lives with a birth year. Each scene is offered at the
// five-year station whose window holds its year. Situations are original; dated facts are from
// ERA-EVENTS-AND-BUDDHISM.md (bbc) or the source named beside the scene. Nobody royal, no named perpetrators.
import {rand} from './rand.js';
import {birthYearOf} from './thai-history.js';
import {REGIONS,regionAt,regionIdFor} from './regions.js';
const F=s=>({...s.pivotFlags,...s.story?.flags});
const cal=s=>{const y=birthYearOf(s);return y===null?null:y+s.age;};
const ageIn=(s,y)=>birthYearOf(s)===null?-1:y-birthYearOf(s);
const inWindow=y=>s=>{const c=cal(s);return c!==null&&c<=y&&y<c+5;};
const aged=(y,lo,hi)=>s=>{const a=ageIn(s,y);return a>=lo&&a<=hi;};
const CITY=['khlong-toei','bang-na','sukhumvit','samut-prakan','pathum-wan','yaowarat'],region=s=>(F(s).emigrated===s.age?regionIdFor(s.birth):regionAt(s,s.age-1))??s.birth?.region;
// A scene already on the table at this station stays valid: the move counts from the next one.
const city=s=>CITY.includes(region(s))||F(s).wentBangkok<s.age,country=s=>!city(s),isan=s=>['isan-village','udon-thani'].includes(region(s))||!!REGIONS[region(s)]?.isan;
const cls=s=>s.intake?.class??s.birth?.class,rich=s=>['high_class'].includes(cls(s)),poor=s=>!rich(s);
const male=s=>(s.intake?.sex??s.birth?.sex)==='male',female=s=>(s.intake?.sex??s.birth?.sex)==='female';
const flag=k=>s=>F(s)[k]!==undefined,no=k=>s=>F(s)[k]===undefined;
const farm=s=>/rice-farming/.test(s.birth?.home??''),hasCar=s=>cls(s)!=='low_class';
const all=(...t)=>s=>t.every(f=>f(s));
const o=(id,label,fx,outcome)=>({id,label,...fx,outcome});
const scene=(id,year,category,tests,title,prompt,options)=>({id,year,category,min:10,max:80,priority:0,eligible:all(inWindow(year),s=>!(F(s).emigrated<s.age),...tests),title,prompt,options});

export const HISTORY_ENCOUNTERS=[
 // The golden years, 1960s
 scene('h_nang_talung',1965,'connection',[aged(1965,12,19),s=>region(s)==='pak-phanang'],'Nang talung at the temple fair',
  'A nang talung troupe has put up a white screen at the temple fair. One man does every voice, and the clown has just said something about the headman. Your mother says be home before midnight.',[
  o('home','Go home before midnight',{skills:{eq:1}},'You walked home in the dark and could hear the drums from the road.'),
  o('stay','Stay to the end',{wellbeing:3},'You stayed. You could do the clown for weeks. Your mother did not speak to you until Sunday.'),
  o('help','Offer to carry the puppets for the troupe',{cash:200,skills:{craft:1}},'You carried the hide puppets for three nights and learned how a thing is made to look alive.')]),
 scene('h_film_van',1965,'connection',[aged(1965,12,19),country,s=>region(s)!=='pak-phanang'],'The film on the temple wall',
  'A van has come to the temple with a projector. The voices are done live by two people behind the screen. Your mother says be home before the second reel.',[
  o('home','Go home before the second reel',{skills:{eq:1}},'You walked home in the dark and heard the crowd laugh from three fields away.'),
  o('stay','Stay to the end',{wellbeing:3},'You stayed. You could do both voices for weeks. Your mother did not speak to you until Sunday.'),
  o('help','Offer to carry the reels for the van',{cash:200,skills:{craft:1}},'You carried reels for three nights and learned how a thing is made to look like magic.')]),
 scene('h_transistor',1965,'connection',[aged(1965,12,19),city],'The transistor radio',
  'Your cousin has a transistor radio from the shop near the bases, and a song on it in a language neither of you speaks. Everyone on the soi wants to sit on your step.',[
  o('listen','Sit with them and listen',{wellbeing:2},'You learned the song by its sounds. You still do not know what it means.'),
  o('save','Save up for your own',{cash:-400,skills:{drive:1}},'It took seven months of errands. You slept with it under the pillow.'),
  o('band','Find three friends and a borrowed guitar',{wellbeing:3,skills:{craft:1}},'You played badly at a wedding and were paid in food. It was the best year you had.')]),
 scene('h_airbase',1966,'work',[aged(1966,15,40),poor,country],'The airfield',
  'Americans are paying for a runway near the town. A week on the crew pays what a month of rice does. Your cousin came home with a refrigerator.',[
  o('stay','Stay on the land',{skills:{eq:1}},'You stayed. The planes went over at the same hour every morning, and the buffalo stopped looking up.'),
  o('crew','Join the crew',{cash:9000,health:-3,skills:{physique:1}},'You were paid in a colour of money the village had not seen. Your back never quite forgave the concrete.'),
  o('stall','Open a noodle stall outside the gate',{cash:-1500,wellbeing:1,skills:{drive:1},later:[{after:10,cash:12000,text:'The stall had paid for a shophouse before the planes stopped coming.'}]},'You learned to count in English.')]),
 // October 1973
 scene('h_1973_leaflet',1973,'connection',[aged(1973,17,40),city],'October 1973',
  'A friend pushes a paper into your hand asking for a constitution. People have been arrested for handing out this paper. By the end of the week there are more people in the street than you have ever seen.',[
  o('room','Stay in your room with the radio',{wellbeing:-2},'You heard it on the radio. You have told it since as if you had been there.'),
  o('water','Carry water to the crowd',{wellbeing:3,skills:{eq:1},flag:'marched',risk:.02,deathCause:'You went out with water in October 1973 and did not come home.'},'You carried water for two days and went home with someone else\'s blood on your shirt.'),
  o('front','Walk at the front',{wellbeing:4,health:-3,skills:{drive:1},flag:'marched',risk:.08,deathCause:'You walked at the front in October 1973 and were shot in the road.'},'You walked at the front. The people on either side of you were different by evening.')]),
 scene('h_1973_radio',1973,'family',[aged(1973,20,70),country],'The radio plays only music',
  'A boy from your street is studying in Bangkok and has not written. For two days the radio has said almost nothing, which is how you know.',[
  o('wait','Wait, and keep the radio on',{wellbeing:-2},'A letter came in November. He did not say where he had been, and you did not ask.'),
  o('bus','Take the bus and look for him',{cash:-600,wellbeing:1,skills:{eq:1}},'You walked from hospital to hospital with his school photograph. You found him eating noodles.'),
  o('temple','Go to the temple and ask nobody anything',{wellbeing:1},'You sat with the other mothers. Nobody said why any of you had come.')]),
 scene('h_1973_truck',1973,'work',[aged(1973,20,30),male,poor,country],'The truck to Bangkok',
  'You are doing your service. They have put your unit on trucks and not said where. A sergeant from your own province hands out extra bullets and will not look up.',[
  o('truck','Stay in the truck and do as you are told',{wellbeing:-5},'You stood where they put you. You have never told anyone which street.'),
  o('sick','Say your stomach is bad and fall out',{wellbeing:-1,skills:{eq:1}},'You spent the week in the latrine block. The others came back quiet and did not call you anything.'),
  o('high','Go, and fire over their heads',{wellbeing:-3,skills:{drive:1}},'You fired at the sky. You will never be sure about where it came down.')]),
 // October 1976, the forest, the village at night
 scene('h_1976_campus',1976,'connection',[aged(1976,18,40),flag('marched')],'The first week of October 1976',
  'Your friends are sleeping at the university. The army radio has started calling them traitors by name. You have a box of books under the bed with your handwriting in them.',[
  o('away','Stay away from the university',{wellbeing:-4},'You stayed away. In the morning you counted who was left, and you have never stopped counting.'),
  o('burn','Burn the books in the yard',{wellbeing:-3,flag:'burnedBooks'},'They took a long time to burn. You stirred the ash into the drain.'),
  o('food','Take food to the gate',{wellbeing:1,risk:.15,deathCause:'You took food to the university gate on the morning of 6 October 1976. Nobody found out what happened to you for a long time.'},'You left the food at the gate at dusk. You went home for one night\'s sleep, and that is why you are alive.'),
  o('inside','Stay inside the university with your friends',{health:-8,wellbeing:-14,skills:{eq:2},flag:'forest',risk:.3,deathCause:'You stayed inside the university on the morning of 6 October 1976.'},'You got over the wall in somebody else\'s shoes. The person you came with did not. That week you left for the forest with a false name.'),
  o('forest','Leave for the forest with the others',{cash:-3000,health:-6,wellbeing:2,skills:{physique:2,eq:1},flag:'forest'},'You went in the back of a truck with a false name. The first thing they taught you was how to sleep sitting up.')]),
 scene('h_1976_names',1976,'connection',[aged(1976,20,70),no('marched'),city],'A list of names',
  'A neighbour with a scarf and a clipboard is writing down who on the soi reads what. He has been kind to you. He asks about the student who rents a room near yours.',[
  o('nothing','Say you know nothing',{wellbeing:-1},'He wrote something down anyway. The student left in the night and paid the rent first.'),
  o('warn','Warn the student',{wellbeing:2,skills:{eq:1},risk:.01,deathCause:'Somebody wrote your name down in 1976.'},'You pushed a note under the door. You never found out what became of them.'),
  o('tell','Tell him what you know',{wellbeing:-6},'He thanked you. He still greets you at the market. You still answer.')]),
 scene('h_rice_at_night',1975,'family',[aged(1975,20,70),country,no('marched')],'Rice at night',
  'Men come after dark and ask for rice, politely. In the morning an officer comes and asks, politely, who came.',[
  o('silent','Say you sleep early',{wellbeing:-2},'You said you sleep early. Both sides seemed to accept it. You stopped sleeping.'),
  o('feed','Keep giving the rice',{cash:-800,wellbeing:1,risk:.04,deathCause:'Soldiers came to the village for the people who had given rice.'},'You left a sack by the bamboo. Some mornings it was someone you grew up with who had taken it.'),
  o('tell','Tell the officer',{cash:500,wellbeing:-6},'The officer was pleased. Your neighbours stopped asking you to their ordinations.')]),
 scene('h_forest_end',1980,'family',[flag('forest'),s=>rand(s.seed,0,'forest-end')>=.35],'The fifth rainy season',
  'You have had malaria twice. The radio from China has gone quiet, the nights are long, and some of the comrades have stopped arguing and started leaving. The government is dropping papers that promise nobody will be punished. A baby is due in your shelter and there is no midwife.',[
  o('down','Walk down under the amnesty',{wellbeing:-4,skills:{eq:1}},'A soldier your own age gave you rice and a form. Your mother did not know you until you spoke.'),
  o('stay','Stay with the comrades',{health:-10,wellbeing:-6,risk:.12,deathCause:'Malaria took you in the forest, under a false name. Your family never got a letter.'},'You stayed until there was nobody left to argue with. You came down alone.'),
  o('baby','Have the baby here',{health:-8,wellbeing:4,skills:{eq:2},flag:'forestChild',risk:.1,deathCause:'There was no doctor for the birth. You are buried near a stream the maps do not name.'},'She was born on a bamboo floor in the rain. Her first name was one you both chose. Her papers say something else.'),
  o('poppy','Take what the hill traders sell for the pain',{health:-14,wellbeing:2,flag:'opium'},'It made the nights shorter. After you came down it took six years to stop.')]),
 scene('h_vietnam',1969,'work',[aged(1969,18,26),male],'The division is asking for men',
  'You drew red. The army wants volunteers for South Vietnam, and the pay is more than your father has ever seen at once. A boy in your intake says the Americans have ice cream.',[
  o('stay','Stay in the barracks at home',{wellbeing:-1},'Two years of polishing things. You still hear about the ones who went.'),
  o('go','Volunteer for Vietnam',{cash:20000,health:-8,wellbeing:-8,skills:{drive:2},risk:.06,deathCause:'You went to Vietnam with the division and came home under a flag.'},'You bought your parents a roof. You do not sit with your back to a door.'),
  o('hills','Go to the hills, against the insurgents',{health:-4,wellbeing:-6,skills:{physique:2},risk:.04,deathCause:'A mine on a path in the Phu Phan hills ended this life.'},'The people on the other side spoke with your grandmother\'s accent.')]),
 scene('h_1980_return',1980,'family',[flag('forest'),s=>rand(s.seed,0,'forest-end')<.35],'Come home',
  'The government says those in the forest can come home and not be tried (Order 66/2523). Your comrades are arguing. Someone at home has sent a photograph of themselves, older, with nothing written on it.',[
  o('home','Walk out and sign the paper',{wellbeing:2,health:2,flag:'cameHome'},'You signed a paper at a district office. The clerk had been at school with you, and neither of you said so.'),
  o('stay','Stay until it is finished',{wellbeing:-3,health:-5,risk:.08,deathCause:'You stayed in the forest after the amnesty. Someone at home kept your place laid at the table.'},'You stayed. There were fewer of you every season, and then it was only an argument about a map.')]),
 // Work abroad, factories, land
 scene('h_saudi',1982,'money',[aged(1982,22,45),male,poor,farm,no('forest')],'The agent from Bangkok',
  'An agent says a man can earn in Saudi Arabia in two years what the farm earns in twelve. His fee is more than the buffalo and the land paper together.',[
  o('stay','Stay',{skills:{eq:1}},'You stayed. The neighbour who went built a house of concrete, and you helped carry the blocks.'),
  o('go','Pawn the land paper and go',{cash:-30000,health:-4,wellbeing:-3,uncertainPay:true,later:[{after:5,cash:150000,text:'The money came home in instalments. When you came back, people spoke to you politely.',when:s=>s.seed%4!==0},{after:5,cash:-20000,wellbeing:-6,text:'The agent\'s office was empty by the time you found out. It took eleven years to get the land paper back.',when:s=>s.seed%4===0}]},'You left in a borrowed jacket. It was forty-six degrees and they gave you a bed in a container.')]),
 scene('h_garment',1985,'work',[aged(1985,15,35),female,poor,country],'The factory bus',
  'A bus comes through from the garment factories at Om Noi. A sewing line pays by the piece, every fortnight, in cash. Your family needs someone for the transplanting.',[
  o('stay','Stay for the transplanting',{wellbeing:-1,skills:{eq:1}},'You stayed that year, and the next. The bus stopped coming to your road.'),
  o('go','Get on the bus',{cash:18000,health:-3,skills:{drive:1}},'You sent home half of every packet. You could sew a collar in your sleep, and you did.')]),
 scene('h_road',1988,'money',[aged(1988,25,70),farm],'The road is coming',
  'A man in good shoes is offering cash for rice land along the line of a road that may or may not be built. Your family has been on this land for three generations. He has offered more than it has ever earned.',[
  o('keep','Keep the land',{wellbeing:1,later:[{after:15,cash:400000,text:'The road came. The land was worth many times what the man had offered.',when:s=>s.seed%2===0},{after:15,wellbeing:-2,text:'The road went through the next district. You still had the land.',when:s=>s.seed%2===1}]},'You told him no at the gate. You walked the edge of the field that evening.'),
  o('sell','Sell it all',{cash:90000,wellbeing:-2},'You signed. Nobody came out of the house.'),
  o('half','Sell the half by the road',{cash:40000},'You drew the line yourself, with string. Someone in the family said it was in the wrong place.')]),
 // May 1992
 scene('h_1992',1992,'connection',[aged(1992,18,65),city,hasCar],'May 1992',
  'They are in the street again, with mobile phones this time. Your office has told everyone to go home. You have a car, and the hospital is across the bridge.',[
  o('home','Go home and lock the gate',{wellbeing:-3},'You watched it later on a foreign channel, because the Thai channels were showing something else.'),
  o('drive','Drive the injured to hospital',{cash:-1000,wellbeing:4,skills:{eq:2},risk:.03,deathCause:'You were driving the injured to hospital in May 1992.'},'You had to have the back seat replaced. The man at the garage did not charge you and did not ask.'),
  o('stand','Stand on Ratchadamnoen',{wellbeing:3,skills:{drive:1},risk:.06,deathCause:'You were standing on Ratchadamnoen in May 1992. Your family is still waiting for a report.'},'You stood there, heavier and slower than the students, and more frightened.')]),
 // 1997: the numbers were on the table. FRBSF 1997, ADB 2000.
 scene('h_1996_boom',1996,'money',[aged(1996,25,75),s=>s.finance],'Everyone is borrowing',
  'Eight years of boom. A man you know can get dollars at half the baht rate, and the baht has not moved in thirteen years. The newspaper also says the country is spending 8% more than it earns, and that the short-term dollar debts are bigger than the reserves. Nobody at dinner has read that part.',[
  o('out','Pay off what you owe and hold cash',{wellbeing:-1,later:[{after:5,cash:60000,wellbeing:3,text:'A few years on you bought what other people had to sell. You did not enjoy it as much as you had expected.'}]},'At dinner they asked if you had stopped believing in the country.'),
  o('condo','Buy a flat off the plan with a dollar loan',{wellbeing:3,later:[{after:5,cash:-180000,wellbeing:-8,text:'The baht went from 25 to the dollar to more than 50. The tower stopped at the eleventh floor. You paid for it for nineteen years.'}]},'You chose the unit with the river view from a model made of foam.'),
  o('notes','Put the savings with the finance company',{wellbeing:1,later:[{after:5,cash:-90000,wellbeing:-6,text:'The finance company\'s doors were shut with a notice on them. You got back a part of it, years later, in paper.'}]},'Twelve per cent. They gave you a calendar.')]),
 scene('h_1997_closed',1997,'work',[aged(1997,25,60),poor,s=>s.finance],'The notice on the gate',
  'The factory gate has a notice on it. The owner has gone to see a bank, and nobody has seen the bank. You have four months of savings, and somewhere up-country that might take you in.',[
  o('wait','Wait near the gate for news',{wellbeing:-4},'Three hundred of you waited for eleven days. Someone brought rice. No one brought wages.'),
  o('home','Go back up-country',{cash:-2000,wellbeing:-2,skills:{physique:1}},'You went back to a field. Your hands remembered, and your back did not.'),
  o('sell','Sell food on the pavement',{cash:4000,skills:{drive:2}},'You sold sandwiches outside the gate where you used to work. Your old foreman bought one and could not meet your eye.')]),
 // After 2000
 scene('h_2010_table',2010,'family',[aged(2010,25,85)],'Two colours at one table',
  'Someone in your family has a red shirt in the wash and someone else a yellow one. It is New Year at one of their houses. A word has already been said about buffaloes.',[
  o('quiet','Serve the food and say nothing',{wellbeing:-1},'You served the food. The family meets on separate days now, and calls it convenience.'),
  o('say','Say what you think',{wellbeing:-3,skills:{drive:1}},'You said it, and you have not been invited since.'),
  o('stop','Ban the subject at this table',{wellbeing:2,skills:{eq:2}},'Nobody spoke for a while. Then someone asked for the fish sauce, and that was the peace.')]),
 scene('h_2011_flood',2011,'family',[aged(2011,20,90),s=>region(s)==='nakhon-sawan'||F(s).wentBangkok!==undefined],'The water stays',
  'The sandbags have held for three weeks and now they have not. The water has reached the second stair and may stay two months. The Buddha image and the photographs have to go up first.',[
  o('stay','Stay upstairs with the house',{health:-3,wellbeing:-2},'You lived upstairs for fifty-one days. A boy came by in a boat with rice and did not want to be thanked.'),
  o('leave','Leave for a relative up-country',{cash:-6000,wellbeing:-1},'You locked a door that was already under water. You still have the key.'),
  o('help','Stay and help the soi',{health:-4,wellbeing:4,skills:{eq:2}},'You learned the names of people you had nodded at for thirty years.')]),
 scene('h_2020_glass',2020,'family',[aged(2020,50,95)],'Through the glass',
  'The virus has closed the temple halls. A funeral you have been waiting to hold will be nine people and a video on someone\'s phone. A child from next door holds up a drawing to the window.',[
  o('video','Watch it on the phone',{wellbeing:-2},'The picture froze at the chanting. You stayed in front of it until the end anyway.'),
  o('go','Go anyway, in a mask',{wellbeing:2,risk:.05,deathCause:'You went to a funeral in 2020 and caught it there.'},'You went. You stood at the back and made merit for two.')]),
];
