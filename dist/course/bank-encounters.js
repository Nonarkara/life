// The databank: what ordinary Thai people faced, spread over ages, places, classes and decades.
// Situations are original composites. Dated facts are public record; macro scenes read the pinned
// World Bank series in world-series.js. Nobody royal, no named perpetrators, no real private people.
// Every gate reads only what cannot change at this station, so an answered question cannot void the scene on the table.
import {birthYearOf} from './thai-history.js';
import {REGIONS,regionAt} from './regions.js';
import {conditions} from './world-series.js';
const F=s=>({...s.pivotFlags,...s.story?.flags});
const cal=s=>{const y=birthYearOf(s);return y===null?null:y+s.age;};
const yearsAhead=s=>{const c=cal(s);return c===null?[]:[c,c+1,c+2,c+3,c+4];};
const placeOf=s=>regionAt(s,s.age-1);
const had=k=>s=>typeof F(s)[k]==='number'&&F(s)[k]<s.age;
const at=(...ids)=>s=>ids.includes(placeOf(s));
const CITY=['khlong-toei','bang-na','sukhumvit','samut-prakan'];
const city=s=>CITY.includes(placeOf(s))||F(s).wentBangkok<s.age,country=s=>!city(s);
const cls=s=>s.intake?.class??s.birth?.class;
const of=(...c)=>s=>c.includes(cls(s));
const rich=of('high_class','royal_associated'),notRich=s=>!rich(s);
const poor=s=>!['middle_class','bureaucratic_class','high_class','royal_associated'].includes(cls(s));
const middling=of('middle_class','bureaucratic_class'),office=of('bureaucratic_class','middle_class','high_class');
const male=s=>(s.intake?.sex??s.birth?.sex)==='male',female=s=>(s.intake?.sex??s.birth?.sex)==='female';
const farm=s=>/rice-farming/.test(s.birth?.home??'');
const route=s=>s.history?.at(-1)?.pathway;
const college=s=>route(s)==='college';
const even=s=>s.seed%2===0;
const owner=of('middle_class','high_class','royal_associated');
const parent=s=>had('parent')(s);
const motherAlive=s=>!(s.history??[]).some(r=>/(?<!grand)mother dies/.test(r.event??''));
// A window on the calendar. The bank is for lives with a birth year; older lives replay exactly as they were.
const era=(from,until)=>s=>{const c=cal(s);return c!==null&&c>=from&&(until===undefined||c<=until);};
const year=y=>s=>{const c=cal(s);return c!==null&&c<=y&&y<c+5;};
const macroIs=key=>s=>yearsAhead(s).some(y=>conditions(y)[key]);
const all=(...t)=>s=>t.every(f=>f(s));
const stillHere=s=>cal(s)!==null&&!(F(s).emigrated<s.age)&&REGIONS[placeOf(s)]?.country==='TH';
const o=(id,label,fx,outcome)=>({id,label,...fx,outcome});
const scene=(id,category,min,max,tests,title,prompt,options,extra={})=>({id,category,min,max,bank:true,...extra,eligible:all(stillHere,...tests,...(extra.macro?[macroIs(extra.macro)]:[])),title,prompt,options});
const child=(id,category,tests,title,prompt,options,extra={})=>scene(id,category,10,10,tests,title,prompt,options,{child:true,...extra});
// Consequences that turn on what the real economy did after the choice.
const seenAt=(s,id)=>s.story?.seen?.find(e=>e.id===id)?.age;
const hit=(id,key,span)=>s=>{const y=birthYearOf(s),a=seenAt(s,id);if(y===null||a===undefined)return false;for(let c=y+a;c<=y+a+span;c++)if(conditions(c)[key])return true;return false;};
const missed=(id,key,span)=>s=>!hit(id,key,span)(s);
const lot=n=>s=>s.seed%n===0,elseLot=n=>s=>s.seed%n!==0;

export const BANK_ENCOUNTERS=[
 // Age ten. The 1950s reach a 1949 life only here.
 child('h_samlor','family',[year(1959),city,poor],'The last samlor',
  "The government has said there will be no more pedal samlors in Bangkok. Your father has pedalled one for nine years and still owes on the chain.",[
  o('school','Go to school as usual',{skills:{iq:1}},"You went to school. He sold it to a man from up-country and came home on foot."),
  o('shine','Shine shoes at the bus stop after school',{cash:150,skills:{drive:1}},"You made four baht the first week and gave your mother three."),
  o('ride','Ask him for one last ride',{wellbeing:2},"He took you round the block at dusk with the bell going.")],{year:1959}),
 child('b_ddt','health',[era(1959,1966),country],'The men with the tanks',
  "Men with tanks on their backs are spraying every house for malaria. They ask who has had fever. Your sister has, and your mother has told you not to say so.",[
  o('quiet','Say nobody has',{wellbeing:-1},"The man wrote a nought in his book. Your sister had the fever again at the next new moon."),
  o('tell','Point at your sister',{health:1,skills:{eq:1}},"They gave her small white pills. Your mother did not speak at supper."),
  o('carry','Carry the bucket for the men',{cash:50,skills:{physique:1}},"You carried it to the end of the village. The geckos fell off the walls that week, and then the cats died.")]),
 child('b_tv_window','connection',[era(1959,1963),city],'The box in the shop window',
  "The radio shop has put a television in its window, and by six o'clock the pavement is full. You are supposed to be fetching ice.",[
  o('ice','Fetch the ice',{skills:{drive:1}},"You fetched the ice. Your mother looked at the clock and found nothing to say."),
  o('watch','Stand at the back and watch',{wellbeing:2},"The ice was water by the time you got home. You could still describe the man's tie.")]),
 child('h_talumphuk','family',[year(1962),at('pak-phanang')],'The wind at Talumphuk',
  "The sky went yellow in the afternoon. By dark the sea is in the road at Laem Talumphuk and your uncle has stopped talking about the boats. Your grandmother will not leave the house.",[
  o('temple','Run with the others to the temple',{wellbeing:-2,skills:{physique:1}},"You ran with your cousin on your back. In the morning the road had a boat on it."),
  o('stay','Stay and hold on to your grandmother',{health:-3,skills:{eq:1},later:[{after:20,wellbeing:1,text:"Your grandmother told the story of that night at every funeral. In her version you were taller."}]},"The two of you stood on the rice bin until the water went down. She never mentioned it to your mother.")],{year:1962}),
 child('b_chinese_school','school',[era(1959,1966),city,notRich,even],'Hours of Chinese',
  "The Chinese school on your road has been told to cut its Chinese lessons again. Your grandfather wants you there anyway. The Thai school is cheaper, and the teacher has started saying your surname slowly.",[
  o('thai','Go to the Thai school',{skills:{iq:1},wellbeing:-1},"You learned to say your surname the way the teacher said it. Your grandfather called you by a different name at home."),
  o('chinese','Go to your grandfather\'s school',{cash:-200,skills:{eq:1}},"You learned forty characters a term and the abacus. The inspector came on Tuesdays, and on Tuesdays you did Thai.")]),
 child('b_left_behind','family',[era(1975,2025),country,poor],'One child on the bus',
  "Your parents are going to Bangkok for work. There is room for one child in the room they have found. Your grandmother says she can manage the rest.",[
  o('stay','Stay with your grandmother',{wellbeing:-2,skills:{eq:1},later:[{after:10,wellbeing:-2,text:"Your mother came home at Songkran for years. One year you called her auntie by mistake, and neither of you laughed."}]},"You stood at the bus stop with the bag of sticky rice they had forgotten."),
  o('go','Go with them',{wellbeing:-1,skills:{drive:1}},"You slept under the sewing table. You could tell the time by the bus outside.")]),
 child('b_ice_cream','work',[era(1965,1995),poor],'The second cart',
  "There is not enough at home for everyone. The ice-cream man needs a child to push his second cart during school hours.",[
  o('school','Stay in school',{wellbeing:-1,skills:{iq:1}},"You stayed. Your younger brother ate at the neighbour's three days a week."),
  o('cart','Push the cart',{cash:400,skills:{physique:1,drive:1}},"You went past your own school at ten o'clock every morning. The class waved."),
  o('half','Go mornings and push it afternoons',{cash:150,health:-1},"You fell asleep in arithmetic. The teacher let you.")]),
 child('b_net_cafe','school',[era(1998,2012)],'Fifteen baht an hour',
  "The shop behind the school charges fifteen baht an hour and your lunch money is twenty. There are boys in there who have not been home since Friday.",[
  o('lunch','Eat your lunch',{health:1},"You ate your lunch and heard about it from the others afterwards."),
  o('play','Go without lunch',{wellbeing:2,health:-1,skills:{craft:1}},"You found out you could change the code in a game. You told nobody at home what code was.")]),
 child('b_top_up','family',[era(2012)],'Your mother\'s phone',
  "Your mother lets you use her phone for homework. A game has asked for ninety-nine baht and the button is right there. That is her top-up for the week.",[
  o('close','Close the game',{skills:{drive:1}},"You closed it. You opened it again the next night, and closed it again."),
  o('press','Press the button',{wellbeing:1,cash:-99},"Her phone stopped working at the market on Thursday. She walked back to ask the price.")]),
 child('b_driver_son','connection',[era(1965,2025),rich],'The driver\'s son',
  "The driver's son is your age and quicker at sums than you are. Your mother has noticed you playing together and has said nothing yet.",[
  o('carry','Keep playing with him',{wellbeing:2,skills:{eq:1}},"He beat you at chess under the carport until the year he stopped coming."),
  o('stop','Stop before she says something',{wellbeing:-1},"You watched him wash the car from the upstairs window. He did not look up."),
  o('books','Lend him your school books',{skills:{eq:1,iq:1}},"He gave them back with the sums done in pencil, and rubbed out.")]),

 // Fifteen to twenty-five
 scene('b_lady_bangkok','work',15,15,[era(1962,1992),female,poor,country],'The lady from Bangkok',
  "A lady from Bangkok wants a girl to mind her children. She will pay your father a year in advance. Your teacher has said you could go on, if someone paid.",[
  o('stay','Stay and help at home',{wellbeing:-1,skills:{eq:1}},"The lady took your cousin. Your father did not mention the money again."),
  o('go','Go with the lady',{cash:6000,wellbeing:-3,skills:{drive:1},later:[{after:10,cash:8000,text:"You were still sending money home. The children you raised had stopped writing to you."}]},"You slept on the floor by the baby. You learned which spoon went where in one afternoon."),
  o('ask','Ask your teacher to speak to your father',{wellbeing:1,skills:{iq:1}},"She came on her bicycle and sat on the step for an hour. He gave her water.")]),
 scene('b_one_more_year','school',15,15,[era(1965,2000),poor],'One more year',
  "Your form teacher has come to the house to say you should stay on. Your father has given her a chair. He has not said anything, and the fees are due on Monday.",[
  o('leave','Leave school and find work',{cash:9000,skills:{physique:1}},"You left at the end of the month. The teacher kept your name in her book for another term."),
  o('stay','Stay on, and work nights',{cash:-1500,health:-2,skills:{iq:2}},"You did your homework by the light of the noodle shop. The owner put the bill on the wall.")]),
 scene('b_tech_shirt','school',15,20,[era(1980,2018),male,city],'The shirt with the name on it',
  "Your technical college is at war with the one across the canal. Nobody remembers why. On the bus, the shirt is enough.",[
  o('jacket','Wear a jacket over it',{wellbeing:-1},"You sat on the bus sweating in April. Two stops later a boy got on and looked at your shoes."),
  o('join','Go with them on Friday',{health:-6,wellbeing:1,skills:{physique:1},later:[{after:15,wellbeing:-2,text:"A man at a car park knew your face. He had a scar through one eyebrow, and he nodded."}]},"Someone threw a thing made from a water pipe. You were on the ground and then you were at the clinic."),
  o('transfer','Ask to transfer to another college',{cash:-3000,skills:{craft:1}},"You lost a term. At the new place they used the same textbook, with someone else's name in yours.")]),
 scene('b_ramkhamhaeng','school',20,25,[era(1971,2002),city,notRich],'The open university',
  "Ramkhamhaeng takes anyone who finished high school, and a term costs less than your room. People listen to lectures from the stairs. You work until six.",[
  o('work','Keep working and save',{cash:12000},"You kept working. The prospectus stayed under the telephone."),
  o('enrol','Enrol and study at night',{cash:-4000,health:-2,skills:{iq:3},later:[{after:10,cash:60000,text:"The degree moved you up a pay grade. You still have the bus pass in the frame with it."}]},"You sat the exams in a hall the size of a bus depot. It took seven years, and you passed in the rain.")]),
 scene('b_draft','work',20,20,[era(1955),male],'Red card, black card',
  "Next April you stand in the line at the district office and put your hand in the box. Red is two years. Black is home. A man at the district says there are ways.",[
  o('draw','Stand in the line and draw',{wellbeing:-1,later:[{after:5,health:2,skills:{physique:1},wellbeing:-1,text:"You had drawn red. Two years in Lop Buri, and a haircut you still recognise in photographs.",when:lot(3)},{after:5,wellbeing:2,text:"You had drawn black. Your mother gave a meal to the monks and you got drunk behind the district office.",when:elseLot(3)}]},"The box was warmer inside than you expected."),
  o('volunteer','Volunteer and shorten the term',{wellbeing:-2,skills:{physique:2,drive:1}},"You signed up ahead of the line and got six months off. You learned to fold a blanket so it could stand."),
  o('pay','Pay the man at the district',{cash:-15000,wellbeing:-1},"Your name moved to another page. Your friend from the next house went instead, and you helped carry his bag.")]),
 scene('b_draft_south','work',20,25,[era(2004,2020),male,poor],'Your batch is going south',
  "You drew red, and your batch has been told Narathiwat. A cousin knows a colonel who can move a name. He wants a month of your father's income.",[
  o('go','Go with your batch',{cash:6000,wellbeing:-3,skills:{physique:2},risk:.03,deathCause:"You went south with your batch. A roadside bomb on a rubber track ended this life."},"You guarded a school. The teachers arrived in a pickup with you on the back of it, and left the same way."),
  o('name','Have the name moved',{cash:-18000,wellbeing:-2},"You spent the two years in Sakon Nakhon. A boy from your intake sent you one photograph."),
  o('sick','Report your bad knee and hope',{wellbeing:-1},"The doctor pressed it twice and sent you back to the line.")]),
 scene('b_ordain','family',20,30,[era(1955),male,motherAlive],'One rains retreat',
  "Your mother has been waiting for this since you were born. Three months in robes, and she believes she can hold on to the hem. Your job will not wait three months.",[
  o('week','Ordain for seven days',{wellbeing:1},"You shaved on a Friday. She made the same curry she would have made for three months."),
  o('rains','Ordain for the whole rains',{cash:-14000,wellbeing:4,skills:{eq:2},flag:'ordained'},"You lost the job. On the last morning she could not stop touching your sleeve."),
  o('not','Tell her you cannot',{cash:4000,wellbeing:-3},"She said it did not matter and folded the white cloth back into the cupboard.")]),
 scene('b_nurses','work',20,25,[era(1966,1980),female,college],'Nurses for Ohio',
  "American hospitals want Thai nurses. A recruiter has come to your college with forms and a photograph of snow. Your mother needs someone to take her to the clinic in the mornings.",[
  o('stay','Stay and work at the provincial hospital',{wellbeing:1,skills:{eq:1}},"You stayed. The ward had two thermometers and you knew where both of them were."),
  o('go','Sign the form and go',{cash:30000,wellbeing:-3,skills:{iq:2},later:[{after:20,cash:200000,wellbeing:-1,text:"You sent the money for your mother's house. You saw it finished in a photograph."}]},"You arrived in January in the shoes you had. The head nurse could not say your name and gave you another.")]),
 scene('b_midwife','health',20,35,[era(1960,1985),female,country],'The midwife or the clinic',
  "Your sister's first has started at night and her husband is away. The midwife is two houses away. The health centre is an hour on the back of a motorcycle, and the road is wet. You are the one who has to say.",[
  o('midwife','Send for the midwife',{wellbeing:1,skills:{eq:1}},"She came with her bamboo knife and lit the charcoal. Your sister lay by the fire for a week because your mother said so."),
  o('clinic','Go to the health centre',{cash:-400,skills:{eq:1}},"Your sister was sick twice on the way. The nurse wrote the time in a book and it was the wrong time.")]),
 scene('b_bar_cousin','work',20,30,[era(1968,2000),female,poor,country],'What your cousin came home with',
  "Your cousin is back from Pattaya with the deposit for her mother's house. She says the bar needs someone to serve drinks at first. She does not say what comes after, and you do not ask in front of her mother.",[
  o('stay','Stay and take the harvest wage',{wellbeing:-1},"You stayed and cut rice for the headman. Your cousin's mother got a concrete floor."),
  o('go','Go back with her',{cash:45000,health:-4,wellbeing:-5,later:[{after:10,health:-20,wellbeing:-6,text:"A clinic in Chon Buri gave you a folded paper. You kept it in the rice tin.",when:lot(4)},{after:10,cash:60000,wellbeing:-2,text:"You paid for your brother's college and the land paper. In the village you had been working at a hotel for ten years.",when:elseLot(4)}]},"You learned to say hello in four languages. You sent money on the first and fifteenth."),
  o('laundry','Go, and look for work in a hotel laundry',{cash:12000,health:-1,skills:{drive:1}},"You folded sheets in a basement in the heat. The pay was a quarter of hers, and you counted it on the bus.")]),
 scene('b_sister_money','family',25,45,[era(1975,2005),poor],'The money from your sister',
  "Your older sister works in Patpong. The family says she works at a hotel. Her money roofed the house and put your brother through college, and she is coming home for Songkran.",[
  o('nothing','Say nothing, as usual',{wellbeing:-1},"She sat at the end of the mat. Your father asked about the hotel."),
  o('thank','Thank her in front of everyone',{wellbeing:1,skills:{eq:2}},"The room went quiet. She kept peeling the same mango."),
  o('home','Ask her to come home and stay',{cash:-12000,wellbeing:1},"She laughed and asked what she would do here. She left you the phone number of a different hotel.")]),
 scene('b_german_husband','connection',30,45,[era(1995,2022),female,at('isan-village')],'A husband in Germany',
  "Three houses in the village have concrete walls and a satellite dish paid for by husbands in Germany. A woman in Udon arranges introductions, and she has asked for your photograph.",[
  o('stay','Say no and stay',{wellbeing:1},"You went on selling at the market. The dishes all faced the same way."),
  o('send','Send the photograph',{cash:-8000,wellbeing:1,skills:{eq:1},flag:'farangHusband',later:[{after:5,cash:150000,wellbeing:-2,text:"You sent money home from Essen. Your mother answered the phone in a voice you did not know.",when:elseLot(3)},{after:5,cash:-30000,wellbeing:-6,text:"He kept your passport in a drawer. A Thai woman at the temple in Essen gave you her spare room.",when:lot(3)}]},"He came in November with a dictionary. Your mother cooked and he ate everything, and then he was ill.")]),
 scene('b_microscope','work',20,45,[era(1985,2005),female,poor],'Under the microscope',
  "The electronics plant pays better than sewing and has air conditioning. You sit at a microscope for ten hours. Three women on your line have started getting headaches they do not talk about.",[
  o('stay','Keep your place on the line',{cash:15000,health:-5,later:[{after:15,health:-6,text:"An eye doctor in Lamphun asked what you used to do. He wrote it down without looking up."}]},"You could solder in your sleep. You stopped being able to read the price on the bus."),
  o('ask','Ask the supervisor about the solvent',{wellbeing:1,skills:{eq:1,drive:1}},"He said it was safe and moved you to the night shift."),
  o('quit','Leave and go back to sewing',{cash:4000,wellbeing:1},"The pay fell by a third. You kept the plant's blue coat to wear in the rain.")]),
 scene('b_overtime_sheet','work',20,45,[era(1973,1998),poor,at('samut-prakan','khlong-toei')],'The overtime sheet',
  "The union is asking people on your line to refuse Sunday overtime until the rate is paid. The foreman has a list. Your rent is due, and your mother's medicine.",[
  o('sign','Sign the Sunday sheet',{cash:3000,wellbeing:-2},"You worked Sunday. The woman beside you worked it too and neither of you looked up."),
  o('refuse','Refuse with the others',{cash:-2500,wellbeing:3,skills:{drive:1},later:[{after:5,cash:12000,text:"The rate went up the following year. You were on the list for transfers.",when:elseLot(2)},{after:5,cash:-15000,wellbeing:-3,text:"Your contract was not renewed. The man at the gate had been told your name.",when:lot(2)}]},"Forty of you stood outside the gate and it rained. Someone had brought one umbrella.")]),

 // Land, credit, debt
 scene('b_land_paper','money',30,60,[era(1965,1995),farm,country],'The land paper at the rice shop',
  "The rice merchant has held your land paper since the drought. The interest is written on a page you cannot quite read. He says you can have it back at harvest, or he can keep the field and forget the rest.",[
  o('pay','Sell the harvest and pay what you can',{cash:-9000,wellbeing:-2},"You paid what he said you owed. He gave you back the paper with a corner gone."),
  o('leave','Let him have the field',{cash:6000,wellbeing:-6,later:[{after:10,wellbeing:-3,text:"You worked that field for wages. You knew where the low corner flooded, and he did not ask."}]},"You put your thumb on the page. Your brother walked out to the edge of the field and stayed there."),
  o('read','Take the page to the teacher to read',{wellbeing:1,skills:{iq:1}},"She found a sum that was wrong, and he corrected it by forty baht. He bought from your neighbour after that.")]),
 scene('b_land_title','money',25,55,[era(1984,2005),country],'The men with the measuring chain',
  "The titling team is in the district. Your side of the boundary has been a ditch and a mango tree for forty years. Your neighbour has already moved the marker, and he is your mother's cousin.",[
  o('let','Let the marker stand',{wellbeing:-2,skills:{eq:1}},"You lost a strip the width of a door. The mango tree stayed where it was, on his side."),
  o('fight','Stand in the ditch and argue it',{cash:-3000,wellbeing:-3,skills:{drive:1},later:[{after:15,cash:80000,text:"The title showed the old line. A road came through and the strip was worth a car. He did not come to the funeral."}]},"The surveyor wrote it down in pencil. Nobody spoke at the next ordination."),
  o('split','Split the difference at the tree',{wellbeing:1},"You drew it down the middle of the mango. You each picked from your own side, and watched.")]),
 scene('b_loan_shark','money',25,50,[era(1960),poor],'Twenty per cent a month',
  "The school fees and the hospital bill came in the same week. The man on the motorcycle lends at twenty per cent a month, collected daily. The bank wants a land paper you do not have.",[
  o('sell','Sell the motorbike instead',{cash:6000,wellbeing:-2},"You walked to work. It took fifty minutes, and you knew every dog."),
  o('borrow','Borrow from him',{cash:20000,wellbeing:-2,later:[{after:5,cash:-70000,wellbeing:-7,health:-3,text:"You had paid back the sum three times and still owed it. He sat outside your stall where the customers could see him."}]},"He wrote your name on a card and looked at your front door for a while."),
  o('temple','Ask the abbot to speak to the hospital',{wellbeing:1,skills:{eq:1}},"The bill came down by a third. The abbot wrote the rest in a notebook and did not mention it again.")]),
 scene('b_chit','money',30,55,[era(1960),of('working_class','middle_class','low_class')],'The woman who runs the share',
  "Twenty market women each put in two thousand a month and bid for the pot. You have been in it six years. This month the woman who runs it has not opened her shop, and you hold the second-largest bid.",[
  o('wait','Wait and say nothing yet',{wellbeing:-3,cash:-20000},"The shutter stayed down. By Friday someone had written on it in chalk."),
  o('house','Go to her house with the others',{wellbeing:-1,skills:{drive:1},later:[{after:5,cash:12000,text:"She paid it back at three hundred a week for years. She brought it herself and would not sit down."}]},"She was on the floor with her mother and a bag packed. She said the name of a person who owed her."),
  o('police','Go to the police',{cash:-1500,wellbeing:-2},"The sergeant's wife was in the same share. He took the statement very carefully.")]),
 scene('h_oil_share','money',25,60,[year(1984)],'Six and a half per cent a month',
  "A woman in Bangkok takes deposits for oil tankers and pays six and a half per cent a month, on the day. Generals' wives are in it. Your sister-in-law has already bought a pickup with the interest.",[
  o('no','Keep your money where it is',{wellbeing:-1},"Your sister-in-law asked at every meal what you were afraid of."),
  o('some','Put in a small amount',{cash:-20000,later:[{after:5,cash:8000,wellbeing:-1,text:"The fund collapsed. The court listed thousands of depositors, and you got back a few baht in the hundred."}]},"The first month's interest came in an envelope with your name typed on it."),
  o('all','Put in the land money',{cash:-120000,wellbeing:2,later:[{after:5,cash:12000,wellbeing:-9,text:"She was arrested and the tankers were never found. Your receipt was still in the Buddha cabinet."}]},"You took the bus to Bangkok with it in your waistband, and held on to the rail with one hand.")],{year:1984}),
 scene('b_teacher_coop','money',30,50,[era(1975),of('bureaucratic_class')],'The teachers\' co-operative',
  "The teachers' co-operative will lend you eight times your salary against your signature and two colleagues'. Everyone in the staff room has done it. The pension is a long way off, and you have promised your sister to see her girl through a private college.",[
  o('no','Do not sign',{wellbeing:-1},"The girl went to the provincial college. Two colleagues asked you to sign for them instead."),
  o('sign','Sign and borrow',{cash:80000,wellbeing:1,later:[{after:15,cash:-160000,wellbeing:-4,text:"The deduction came off before the pay reached you. On the first of the month you had four hundred baht."}]},"She went to the private college. They took it out of your salary at source, before you saw it.")]),

 // Work and moving
 scene('b_taxi_lease','work',25,50,[era(1992,2015),city,male],'Six hundred a day',
  "The garage rents you a meter taxi at six hundred a day. Or you can sign for one on finance and own it in five years, if nothing happens to it or to you.",[
  o('rent','Rent by the day',{cash:6000,health:-2},"You paid the garage before you bought your first meal. You slept in the car at the Mo Chit rank."),
  o('finance','Sign for your own',{cash:-30000,skills:{drive:1},later:[{after:5,cash:220000,wellbeing:3,text:"The last payment was on a Tuesday. You drove to the temple and they put a garland on the mirror.",when:elseLot(3)},{after:5,cash:-120000,wellbeing:-6,text:"A truck on the Bang Na road took the front off it. The finance company took the rest.",when:lot(3)}]},"You put your mother's name and your lottery numbers on the sun visor.")]),
 scene('b_street_clear','work',30,65,[era(2014,2018),city,poor],'The yellow line on the pavement',
  "The city has painted a line on the pavement and given your soi thirty days. You have sold khao man kai on this corner for nineteen years. There is a new food court, with a deposit.",[
  o('wait','Stay until they make you move',{wellbeing:-3},"They came at six with a truck and a list. An officer you had fed for years held your cart steady."),
  o('court','Pay the deposit for the food court',{cash:-25000,skills:{drive:1},later:[{after:5,cash:-20000,wellbeing:-3,text:"The office workers kept walking to the corner, and the corner was empty. You stayed with the food court until the lease ran out."}]},"You got a number on a stall and a card reader. Your regulars had no idea which floor."),
  o('soi','Move into the soi behind',{cash:-1500,wellbeing:-1},"You moved forty metres. Half your customers found you, and you could tell which half.")]),
 scene('b_district_fee','work',25,55,[era(1980,2012),city,poor],'The man from the district',
  "The officer comes on the fifth for the fee that has no receipt. This month it has doubled. The woman at the next stall says she will stop paying if you do.",[
  o('pay','Pay him',{cash:-1500,wellbeing:-1},"He folded it into his top pocket and asked after your mother."),
  o('stop','Stop paying, with her',{wellbeing:2,skills:{drive:1},later:[{after:5,cash:-14000,wellbeing:-3,text:"Your stall was the only one on the list at the next clear-up. The woman next to you still had hers."}]},"He looked at you both for some time and went away."),
  o('less','Pay half and say business is bad',{cash:-700,skills:{eq:1}},"He took it. He had a daughter at college too, it turned out.")]),
 scene('b_slum_fire','family',25,60,[era(1975,2010),at('khlong-toei')],'Fire in the community',
  "The fire started at two in the morning and took ninety houses. By noon there are men measuring. The port wants the land, the district has offered plots an hour and a half away, and people are already rebuilding.",[
  o('rebuild','Rebuild where you were',{cash:-12000,wellbeing:1,skills:{physique:1}},"You had a roof of tin by the weekend. The men with the tape came back and went around you."),
  o('plot','Take the plot out of town',{cash:-4000,wellbeing:-3,later:[{after:10,cash:90000,text:"The plot had a paper with your name on it. It was the first thing in the family that did."}]},"You had land, and two buses to work. You left at four in the morning."),
  o('stand','Join the committee and stand at the gate',{wellbeing:2,skills:{eq:2,drive:1}},"You spoke through a loudhailer for the first time. You had never heard your own voice.")]),
 scene('b_taiwan','money',25,45,[era(1990,2010),poor],'Three years in Taichung',
  "An agent offers a factory contract in Taiwan. The fee is two years of what you earn here, and the bank will lend it against your parents' land. Your mother has started to forget where she put things.",[
  o('stay','Stay',{wellbeing:1,skills:{eq:1}},"You took her to the clinic on Thursdays. A neighbour's new house went up behind the clinic."),
  o('go','Borrow the fee and go',{cash:-90000,health:-3,wellbeing:-3,later:[{after:5,cash:420000,wellbeing:1,text:"You paid off the land and built two rooms. Your mother called you by your brother's name.",when:elseLot(4)},{after:5,cash:-60000,wellbeing:-7,text:"The factory closed in the second year. You owed more than when you had left.",when:lot(4)}]},"You worked twelve-hour nights on plastic chairs. On Sundays forty of you ate som tam behind the dormitory.")]),
 scene('b_korea','money',25,45,[era(2012,2023),poor],'Little ghosts',
  "A tour to Korea costs less than the agent's fee for a proper visa. People overstay and call themselves little ghosts. A cousin says an onion farm pays five times what a Thai factory does, and there are no days off and no papers.",[
  o('stay','Stay and take the factory wage',{wellbeing:1},"You stayed. Your cousin's posts stopped in February, and came back in Thai from a different number."),
  o('go','Book the tour and stay on',{cash:-25000,health:-4,wellbeing:-3,later:[{after:5,cash:380000,wellbeing:-3,text:"Immigration took you from a greenhouse at dawn. The money had already gone home, in pieces, through a woman in Ansan."}]},"You got through the airport on your third try. You slept in a vinyl house with a heater and a dog.")]),
 scene('b_israel','money',25,40,[era(2012,2023),male,poor,at('isan-village')],'Greenhouses in the Arava',
  "The official scheme will send men from your district to pick peppers in Israel for five years. The fee is small, the money is real, and every house with a new roof has a son there.",[
  o('stay','Stay on the farm',{wellbeing:1},"You stayed. There were fewer men at every funeral."),
  o('go','Sign up',{cash:-30000,health:-3,skills:{physique:1},later:[{after:5,cash:520000,wellbeing:2,text:"You came back and built a house with a second floor nobody slept on."}]},"The heat was dry, which was new. You learned the Hebrew for faster.")]),
 scene('h_toy_fire','work',20,50,[year(1993),poor],'After the toy factory',
  "A toy factory in Nakhon Pathom has burned with its doors locked, and nearly two hundred people are dead, most of them women. Your own factory has one staircase. The fire exit has boxes against it.",[
  o('work','Keep your head down',{wellbeing:-2},"You counted the steps to the stairs every morning. There were sixty-one."),
  o('move','Move the boxes on your break',{wellbeing:1,skills:{drive:1}},"The foreman had them put back. You moved them again, and then he left them."),
  o('quit','Leave and find ground-floor work',{cash:-5000,wellbeing:2},"You took a job in a noodle shop with a door at each end.")],{year:1993}),

 // Region and water
 scene('b_dam','family',25,60,[era(1985,1996),country,farm],'The dam',
  "They are building a dam downstream. The compensation depends on a paper most people on your stretch of river never had. A man from Bangkok is holding a meeting at the temple, and so is the man from the electricity authority.",[
  o('sign','Sign and take the money',{cash:40000,wellbeing:-4,later:[{after:10,wellbeing:-3,text:"The relocation plot was stony. The fish you had caught stopped coming up the river."}]},"You got a house in a straight line with the others. The tap worked for a while."),
  o('hold','Hold out with the protesters',{cash:-3000,wellbeing:2,skills:{eq:2,drive:1},later:[{after:10,cash:60000,text:"The government paid more, after years of sitting on the pavement. You had aged at the same rate as the concrete."}]},"You spent four months camped outside Government House with a pot and a mat.")]),
 scene('b_black_tiger','money',25,55,[era(1985,1994),at('pak-phanang')],'Black tiger',
  "The neighbour has dug up his rice land for tiger prawns and bought a pickup in one season. The bank will lend for the ponds and the aerators. The water would have to come in from the sea.",[
  o('rice','Keep growing rice',{wellbeing:-1,later:[{after:10,wellbeing:1,cash:-6000,text:"Your well had turned salt by then, from next door. You still had a field and you still grew rice on it."}]},"The neighbour's aerators ran all night. You could hear them from your bed."),
  o('dig','Borrow and dig ponds',{cash:-80000,skills:{drive:2},later:[{after:5,cash:420000,wellbeing:4,text:"You had two good years, and you bought gold.",when:elseLot(2)},{after:10,cash:-280000,wellbeing:-8,text:"The disease came through the canal in one week. The ponds went on sitting there, and nothing would grow in that ground."}]},"You threw the first feed yourself. The bank's man came to look, and took his shoes off.")]),
 scene('b_rubber','money',35,70,[era(2009,2012),at('pak-phanang')],'Rubber at a hundred and eighty',
  "Rubber is at a hundred and eighty baht a kilo, and tappers are buying new pickups on credit. The government is encouraging more planting. Your orchards are old, and the man at the bank knows your name now.",[
  o('hold','Tap what you have and save it',{cash:30000,wellbeing:1},"You put it in the co-op. Your nephew asked what you were saving it for."),
  o('borrow','Borrow, clear the old trees and plant more',{cash:-200000,skills:{drive:1},later:[{after:5,cash:-180000,wellbeing:-7,text:"Rubber fell below fifty. You tapped at night for what would not pay the cup."}]},"The new saplings stood in rows. It would be seven years before they gave anything."),
  o('car','Buy the pickup on finance',{cash:-40000,wellbeing:3,later:[{after:5,cash:-90000,wellbeing:-4,text:"The finance company came on a Sunday when you were at the temple."}]},"You drove it to the market to buy a bag of ice.")]),
 scene('h_mud','family',25,70,[year(1988),at('pak-phanang')],'The logs in the village',
  "Days of rain, and then the hill behind Phipun came down with every log that had been cut on it. Your aunt's family lives there. People say a ban on logging is coming.",[
  o('wait','Wait for news on the radio',{wellbeing:-2},"They read out names for nine days. You knew two of them from a wedding."),
  o('send','Send money and rice',{cash:-5000,wellbeing:-1},"The rice arrived by boat. Her son wrote that the logs had numbers painted on them."),
  o('go','Go and dig',{cash:-1000,health:-4,wellbeing:2,skills:{physique:1}},"You dug for eleven days. You found a sewing machine, a buffalo and her uncle.")],{year:1988}),
 scene('b_beach_plot','money',30,65,[era(1985,2000),at('pak-phanang','samut-prakan','bang-na')],'The plot on Samui',
  "Your aunt left you a coconut plot on Samui that has never made anything. A man from a hotel group has offered to buy it. The boat is full of backpackers now, and your aunt's neighbours say to wait.",[
  o('keep','Keep it and wait',{wellbeing:-1,later:[{after:15,cash:900000,wellbeing:2,text:"The airport changed everything. You sold one rai and could not believe the number.",when:elseLot(3)},{after:15,wellbeing:-3,text:"A company had a paper for your plot. It was a better paper than yours.",when:lot(3)}]},"You paid the land tax in cash at a window. It was about the price of a meal."),
  o('sell','Sell it now',{cash:180000,wellbeing:1},"You signed in an air-conditioned office. The man gave you a pen with the hotel's name on it.")]),
 scene('b_rice_pledge','money',30,70,[era(2009,2013),farm,country],'Fifteen thousand a ton',
  "The government will buy all your paddy at fifteen thousand a ton, far above the market. Everyone has signed up. The mill gives you a receipt, and the money is supposed to follow.",[
  o('market','Sell to the trader at market price',{cash:30000,wellbeing:-1},"He paid in cash and looked pleased. Your neighbours asked if you could count."),
  o('pledge','Pledge it all',{cash:20000,wellbeing:3,later:[{after:5,cash:-60000,wellbeing:-5,text:"The last crop's money did not come. You kept the receipts in a plastic bag and went to Bangkok with them, and slept on the road."}]},"The first payment went straight to your account. You bought a pump, on credit.")]),
 scene('b_village_fund','money',30,60,[era(2001,2006),country],'A million for the village',
  "Every village is getting a million baht to lend at low interest. The committee has met under the headman's house. Twenty thousand is available to you, and nobody can say for how long.",[
  o('no','Leave it for someone who needs it',{wellbeing:1},"The headman's nephew got your share."),
  o('pig','Borrow and raise pigs',{cash:-8000,skills:{craft:1,drive:1},later:[{after:5,cash:45000,text:"You sold two litters a year and paid it on time. The committee used your name as an example."}]},"You built the pen behind the house and your niece named the first one."),
  o('phone','Borrow and buy a phone and a motorcycle',{cash:12000,wellbeing:3,later:[{after:5,cash:-30000,wellbeing:-3,text:"You borrowed from the man on the motorcycle to repay the fund, and from the fund to repay him."}]},"You drove it round the village twice with the phone in your shirt pocket.")]),
 scene('b_vote_envelope','connection',25,70,[era(1969,2023),country],'An envelope before polling day',
  "The canvasser has been to every house with an envelope and your number on a slip. He is your cousin. The other side's man came on Tuesday.",[
  o('both','Take both and vote as you like',{cash:1000,wellbeing:1},"You marked the paper in the booth. You thought it was none of his business, and he thought it was."),
  o('refuse','Hand it back',{wellbeing:1,skills:{drive:1}},"He looked at the envelope for a while. Your road was the last one to be mended."),
  o('take','Take it and vote his way',{cash:500,wellbeing:-1},"Your man won by ninety votes. His posters stayed on the tree for two years.")]),

 // Illness and the tsunami
 scene('b_brother_home','family',25,50,[era(1990,2000)],'Your brother comes home',
  "Your brother has come home from driving trucks, thin, with sores he covers with a long-sleeved shirt in April. The market has stopped buying your mother's sweets.",[
  o('back','Keep him in the back room',{wellbeing:-3},"You told people it was his liver. You carried the bowl out after dark."),
  o('open','Sit with him out front',{cash:-6000,wellbeing:2,skills:{eq:2}},"He sat on the step in the sun. Three people crossed the road, and one old woman brought bananas."),
  o('temple','Take him to the temple hospice in Lop Buri',{cash:-3000,wellbeing:-2},"The monks took him without asking a thing. There were rows of beds, and you went every month, then less.")]),
 scene('b_thirty_baht','health',40,75,[era(2001,2008),motherAlive],'Thirty baht',
  "You have a new card and it says thirty baht. Your mother's eyes have been white for three years. The district hospital starts giving out queue numbers at five in the morning, and the private clinic can see her on Tuesday.",[
  o('queue','Take her for a queue number',{wellbeing:2,skills:{eq:1}},"You sat on a bench from five until two. They did the first eye in October, and she told you what colour your shirt was."),
  o('clinic','Pay the private clinic',{cash:-28000,wellbeing:2},"It took forty minutes. She asked how much and you said thirty baht."),
  o('wait','Wait until after the harvest',{wellbeing:-2},"She had stopped asking. She knew the house by the corners.")]),
 scene('b_dialysis','health',55,75,[era(2008)],'The bag four times a day',
  "The doctor says your kidneys are going. The card pays for bags of fluid you change yourself, four times a day, in a clean room. You do not have a clean room. There is a machine at a private centre, at a price.",[
  o('home','Clear a corner and change the bags at home',{health:3,wellbeing:-1,skills:{eq:1}},"Your nephew put up a curtain and painted the wall. The boxes came on a truck and filled the front room."),
  o('machine','Pay for the machine, three times a week',{cash:-180000,health:5,wellbeing:-1},"You knew the others on the row by their shoes. One pair stopped coming in the rains."),
  o('none','Decide against it',{health:-14,wellbeing:1},"You told the doctor no. He wrote it down and gave you something for the itching.")]),
 scene('h_tsunami','family',20,70,[year(2004)],'Khao Lak',
  "It is the day after Christmas, and the radio is saying something about the sea. Your cousin works at a resort at Khao Lak. Her phone rings and nobody answers it.",[
  o('wait','Keep calling and stay by the radio',{wellbeing:-4},"The list on the board at the district office changed every day. You read it every day."),
  o('go','Take the bus down and look for her',{cash:-4000,wellbeing:-2,skills:{eq:1},later:[{after:5,wellbeing:-2,text:"You still cannot eat prawns. Her mother sends you a card every December."}]},"You walked along rows at Wat Yan Yao with her photograph and a cloth over your nose."),
  o('help','Go and carry for the volunteers',{cash:-2000,health:-4,wellbeing:1,skills:{eq:2}},"They gave you gloves and a number. You worked next to a Swedish dentist for nine days and never asked his name.")],{year:2004}),
 scene('b_south_teacher','work',25,50,[era(2004,2018),middling],'A posting in Yala',
  "There is a teaching vacancy in Yala with a danger allowance and an armed escort to the school gate. Two teachers from that district have been shot this year. A clerk in the education office has mentioned another school, and a sum.",[
  o('decline','Decline and stay where you are',{wellbeing:-1},"You stayed. There was no promotion in that round or in the next."),
  o('go','Take the post',{cash:30000,wellbeing:1,skills:{eq:2},risk:.02,deathCause:"You took the post in Yala. A motorcycle slowed beside the school pickup on a morning in the rains."},"The children stood up when you came in. The escort sat at the back with his rifle and copied the alphabet."),
  o('pay','Pay the clerk',{cash:-60000,wellbeing:-3},"You got a school in Songkhla. A colleague asked how, and you talked about the weather.")]),
 scene('b_south_market','work',30,60,[era(2005,2015),at('pak-phanang')],'The Tuesday run to Pattani',
  "You have driven dried fish to the market in Pattani every Tuesday for twenty years. Last month a bomb went off by the stall next to yours. Your buyer there has known you since before his children were born.",[
  o('stop','Stop going',{cash:-18000,wellbeing:-2},"He rang once in the Ramadan month. You did not know what to say about the weather either."),
  o('go','Keep going on Tuesdays',{cash:12000,wellbeing:-1,skills:{drive:1},risk:.01,deathCause:"You kept going on Tuesdays. It was the second bomb that killed people, the one that waited."},"You changed the day and parked in a different place. He came out with tea, like before."),
  o('meet','Meet him halfway at Hat Yai',{cash:2000,wellbeing:1,skills:{eq:1}},"You met at a petrol station. His boy had grown, and he sat in the truck.")]),

 // Phones, gigs, scams
 scene('b_good_morning','connection',55,75,[era(2013)],'Pictures of lotus flowers',
  "Your grandchild has put LINE on your phone. There is a family group, and a picture of a lotus every morning. A friend has sent news that lemon water cures cancer, and your sister-in-law has stopped her pills.",[
  o('send','Send the lotus back and leave it',{wellbeing:2},"Your phone filled up by April. The girl at the shop deleted your grandchildren by accident and you got them back."),
  o('ring','Ring your sister-in-law',{wellbeing:1,skills:{eq:1}},"She told you she had read it on the Internet. You went on Sunday and looked in the pill box."),
  o('forward','Forward it to everyone, just in case',{wellbeing:1},"Eleven people replied with a thumb and a lotus.")]),
 scene('b_officer_call','money',55,75,[era(2012)],'The officer on the telephone',
  "A man says he is from the Department of Special Investigation. Your name is on a drug case and your account is going to be frozen. He is very polite. Do not hang up, he says, and do not tell your family.",[
  o('hang','Hang up',{wellbeing:1},"He rang back four times. You put the phone in the rice cooker, which was off."),
  o('son','Keep him waiting and ring your nephew',{wellbeing:1,skills:{eq:1}},"Your nephew told you to do nothing. You felt foolish all evening and made him a chicken soup."),
  o('send','Move the money to the account he gives you',{cash:-180000,wellbeing:-8,later:[{after:5,wellbeing:-2,text:"You still answer the phone with your name, and then stop."}]},"You took the bus to the bank and told the girl it was for your niece. She looked at you for a moment.")]),
 scene('b_customer_service','work',20,30,[era(2020)],'Customer service, fifty thousand',
  "An advertisement offers customer service work near Mae Sot at fifty thousand a month, with a room. No experience needed. A van will collect you. Your rent is three weeks late.",[
  o('no','Do not go',{wellbeing:-1},"You stayed on your friend's floor. The advertisement was still there in March, at sixty thousand."),
  o('go','Get in the van',{cash:-6000,health:-10,wellbeing:-12,later:[{after:5,wellbeing:-4,text:"You do not like the sound of a phone ringing in another room."}]},"They crossed the river at night and took your phone. A man gave you a script and a list of old people in Thailand."),
  o('check','Ring the number at the labour office first',{wellbeing:1,skills:{iq:1}},"The woman told you the name of the building. She asked if you knew anyone who had already gone.")]),
 scene('b_mule','money',20,35,[era(2018),poor],'Rent out your account',
  "A man in a group chat will pay two thousand baht to borrow a bank account and an ATM card for a month. Nothing to do. Your motorbike payment is due on Friday.",[
  o('no','Leave it',{wellbeing:-1},"You borrowed from your aunt, and she told the whole family."),
  o('rent','Hand over the card',{cash:2000,wellbeing:-1,later:[{after:5,cash:-60000,wellbeing:-6,text:"The police letter came to your mother's house. A pensioner in Lampang had sent four hundred thousand through your name."}]},"You met him outside a 7-Eleven. He checked the PIN on his phone and thanked you.")]),
 scene('b_rider','work',20,50,[era(2018),city,notRich],'The box on the back',
  "The app is signing up anyone with a motorbike. There is no boss and no sick pay. The bonus runs out if you stop, and you are on your feet at a warehouse for less.",[
  o('warehouse','Stay at the warehouse',{wellbeing:-1,skills:{physique:1}},"You stayed. Your friends on bikes sent you screenshots of Friday."),
  o('ride','Sign up and ride',{cash:15000,health:-3,skills:{drive:1},later:[{after:5,cash:-40000,health:-8,wellbeing:-3,text:"A car door opened on Lat Phrao. The app sent a message about your acceptance rate.",when:lot(3)},{after:5,cash:-8000,wellbeing:-2,text:"The rate per trip had come down twice. You had stopped reading the messages.",when:elseLot(3)}]},"You learned which condo guards would let you up. You ate in the shade of the box."),
  o('both','Keep the warehouse and ride at night',{cash:9000,health:-5},"You slept in the two hours between. In the rain it paid double.")]),
 scene('b_mother_fell','family',40,60,[era(2005),motherAlive],'Your mother has fallen',
  "A neighbour rings to say your mother has fallen in the bathroom again. She says she is fine. It is a night bus away and you have used your leave, and your brother says it is your turn.",[
  o('ring','Ring her and ask the neighbour to look in',{wellbeing:-2},"She said she was fine. The neighbour said she had seen worse."),
  o('send','Send money for someone to look in on her',{cash:-6000,wellbeing:-2},"A girl from the next village came twice a week. Your mother told you she was very good and did not say her name."),
  o('bring','Bring her to live with you in the city',{cash:-12000,wellbeing:-1,skills:{eq:1},later:[{after:5,wellbeing:-3,text:"She sat at the window of a building where nobody knew her. She asked when she could go home."}]},"She brought her own pillow and a jar of pla ra the neighbours complained about."),
  o('quit','Leave your job and go home',{cash:-60000,wellbeing:2,skills:{eq:2},flag:'caredForParent',later:[{after:10,cash:-60000,text:"You were fifty and the job adverts stopped at forty-five."}]},"You put a rail in the bathroom. You learned how she liked the rice.")]),
 scene('b_no_card','connection',35,65,[era(2000),office,at('samut-prakan','bang-na','sukhumvit')],'The woman with no card',
  "The woman from Myanmar who cleans for you has a child with fever and no papers. The registration round closed last month. The hospital will ask, and a policeman has been round the back lane.",[
  o('clinic','Tell her about the volunteer clinic behind the market',{wellbeing:-1},"She went on her day off. She came to work the next morning and did the windows."),
  o('money','Give her money and let her manage',{cash:-2000,wellbeing:-1},"She came to work the next day and did not mention it."),
  o('hospital','Take them to hospital yourself',{cash:-9000,wellbeing:2,skills:{eq:1}},"The clerk asked your relationship to the patient. You stood there for some time."),
  o('register','Pay to register her at the next round',{cash:-14000,wellbeing:1,later:[{after:5,wellbeing:1,text:"Her son came top of the class at the temple school. She brought you the report to read to her."}]},"You signed as employer. She now has a pink card she keeps in a plastic bag inside another plastic bag.")]),

 // Twelve and more that read the real economy
 scene('b_cheap_leap','work',30,50,[notRich],'Cheap money and a safe desk',
  "Banks are lending cheaper than they have in years, and the government is telling people to invest. You have a secure post, low pay and a pension at the end of it. A friend with a shop lease needs a partner by the end of the month.",[
  o('stay','Keep the post',{wellbeing:-1,later:[{after:10,cash:120000,text:"The post paid the same on the first of every month. Your friend's shop had a new sign."}]},"You told him no over coffee. The next morning you signed the attendance book at the usual time."),
  o('leap','Resign, borrow and go in with him',{cash:-60000,skills:{drive:2},flag:'founder',pathway:'independent',later:[{after:10,cash:-300000,wellbeing:-8,text:"The bad years came before the loan was paid. The bank's man counted your stock with a torch.",when:hit('b_cheap_leap','slump',10)},{after:10,cash:450000,wellbeing:5,text:"Interest stayed low long enough. You bought the unit next door and left the old sign up.",when:missed('b_cheap_leap','slump',10)}]},"You cleared your desk into a rice sack. The bank gave you a calendar."),
  o('side','Keep the post and give him your weekends',{cash:-15000,health:-2,skills:{craft:1},later:[{after:10,cash:90000,text:"The shop paid for a car. You were asleep in most of the photographs."}]},"You took inventory on Sundays and ate your rice at the counter.")],{macro:'cheapCredit'}),
 scene('b_cheap_shophouse','money',35,60,[],'A shophouse at this rate',
  "The bank's new rate is the lowest anyone at the market can remember. The two-storey shophouse you have rented for eleven years is for sale. The owner's son wants the money quickly.",[
  o('rent','Go on renting',{wellbeing:-1},"The new owner kept you on and put the rent up by a tenth, then by another."),
  o('buy','Buy it on a floating rate',{cash:-120000,wellbeing:3,later:[{after:10,cash:-200000,wellbeing:-6,text:"The rate floated up. You let the upstairs to two nurses and slept in the shop.",when:hit('b_cheap_shophouse','dearCredit',10)},{after:10,cash:600000,wellbeing:4,text:"You made the last payment early. The paper is under the spirit shelf.",when:missed('b_cheap_shophouse','dearCredit',10)}]},"You had the door repainted the same colour.")],{macro:'cheapCredit'}),
 scene('b_cheap_condo_flip','money',25,45,[city,office],'Deposit on a tower',
  "Money is cheap and the sales office is full. You can put down a deposit on a unit not yet built and sell the contract before the tower is finished. Everyone in your office knows someone who has.",[
  o('no','Leave it to the others',{wellbeing:-1},"Three people from accounts drove new cars to work."),
  o('flip','Put down a deposit',{cash:-80000,wellbeing:2,later:[{after:5,cash:-120000,wellbeing:-6,text:"Nobody was buying contracts now. The tower had a crane on it and a tree growing out of the seventh floor.",when:hit('b_cheap_condo_flip','slump',5)},{after:5,cash:200000,wellbeing:3,text:"You sold the contract to a dentist from Korat and never saw the room.",when:missed('b_cheap_condo_flip','slump',5)}]},"The model of the tower had little people on it, and one of them had a dog.")],{macro:'cheapCredit'}),
 scene('b_inflation_savings','money',25,65,[],'What the savings book buys',
  "Prices have gone up by about a tenth in a year. The savings book pays less than that. The woman at the gold shop has a queue, and your brother says to buy rice while it is still this price.",[
  o('keep','Leave it in the savings book',{wellbeing:-2,later:[{after:5,wellbeing:-1,text:"The number in the book had gone up, and bought less rice."}]},"The teller stamped the page and the ink was the same colour as ever."),
  o('gold','Buy gold',{cash:-30000,later:[{after:5,cash:52000,wellbeing:1,text:"You took two baht-weight back to the same shop. The woman remembered your mother."}]},"She weighed it in front of you and wrapped it in a page of the newspaper."),
  o('rice','Buy sacks of rice and sugar',{cash:-6000,wellbeing:1},"You stacked them under the bed and on the stairs. Rats found the sugar first.")],{macro:'inflation'}),
 scene('b_inflation_wage','work',20,50,[poor],'The price of rice this week',
  "The price of rice has moved twice this month, and your wage has not moved since last year. Someone at work is collecting names to go and see the owner.",[
  o('quiet','Keep quiet and take a second job',{cash:5000,health:-3},"You loaded trucks after dark. Your hands would not close properly in the morning."),
  o('names','Put your name down',{wellbeing:2,skills:{drive:1,eq:1},later:[{after:5,cash:18000,text:"The owner gave four baht a day. It was more than he had said he could.",when:elseLot(2)},{after:5,cash:-12000,wellbeing:-3,text:"He found out who had the list. You found your card missing from the rack.",when:lot(2)}]},"You wrote it carefully. It was the first form you had ever filled in for yourself.")],{macro:'inflation'}),
 scene('b_slump_list','work',25,60,[notRich,s=>route(s)!=='independent'],'The list on the noticeboard',
  "The economy has stopped. The company is asking for voluntary departures with four months' pay. After Friday it will stop asking.",[
  o('stay','Stay and hope',{wellbeing:-3,later:[{after:5,cash:-30000,text:"You were on the second list, at one month's pay.",when:lot(2)},{after:5,wellbeing:1,text:"You were kept. Half the desks had been sold.",when:elseLot(2)}]},"You took your lunch at your desk so you would be seen there."),
  o('take','Take the four months',{cash:70000,wellbeing:-4,skills:{drive:1}},"You signed and shook hands. Someone from personnel carried your plant to the lift."),
  o('cut','Offer to take a pay cut',{cash:-18000,wellbeing:-2,skills:{eq:1}},"The manager thanked you and wrote it down, and you never heard what he wrote.")],{macro:'slump'}),
 scene('b_slump_owner','work',40,70,[owner],'Thirty names',
  "Your orders have gone to nothing. You can let thirty people go this month, or sell the house and pay them until something changes. Your head of accounts started with your father.",[
  o('cut','Let the thirty go',{cash:90000,wellbeing:-5},"You did it yourself, one at a time, in the room with the fan. One of them thanked you."),
  o('house','Sell the house and keep them on',{cash:-400000,wellbeing:1,skills:{eq:2},later:[{after:10,cash:300000,wellbeing:3,text:"Orders came back, and so did all but four of them.",when:elseLot(2)},{after:10,cash:-200000,wellbeing:-6,text:"The orders never came. You paid the last month out of your mother's gold.",when:lot(2)}]},"You moved your family above the warehouse. Your mother asked about the garden.")],{macro:'slump'}),
 scene('b_slump_home','family',45,70,[],'Your nephew has come to stay',
  "Your nephew has lost his job in the bad year and come to you with a suitcase and a motorbike still on payments. He is thirty and sleeps until ten. Your own savings are for your eyes and your teeth.",[
  o('no','Tell him to look harder',{wellbeing:-2},"He left for a friend's in Rayong. His mattress stayed against the wall."),
  o('pay','Pay the motorbike and feed him',{cash:-30000,wellbeing:1},"You put the extra egg on his rice without saying anything."),
  o('shop','Put him to work at something',{cash:-10000,skills:{eq:1},later:[{after:5,cash:30000,wellbeing:2,text:"He had made a small business of the fish sauce. He put your face on the label without asking."}]},"You set him up at a table outside. He was bad at it for a while.")],{macro:'slump'}),
 scene('b_dollar_debt','money',30,65,[owner],'The loan in dollars',
  "Your firm borrowed in dollars because it was cheaper. The baht has just fallen hard, and the same debt is suddenly much bigger. A foreign group has offered to buy your half at a price that is an insult.",[
  o('hold','Refuse and try to hold on',{wellbeing:-4,later:[{after:5,cash:-500000,wellbeing:-6,text:"The court appointed a planner. He was younger than your shoes."}]},"You sat with the bankers in a room with no window, and each of you ordered coffee."),
  o('sell','Sell at the insulting price',{cash:400000,wellbeing:-5},"You signed in English. Your father's portrait came home in the back of a taxi."),
  o('talk','Go to the creditors first and ask for time',{wellbeing:-1,skills:{eq:2},later:[{after:5,cash:150000,wellbeing:2,text:"They extended, because you had come before they sent for you. You paid it off in baht that were worth less."}]},"You flew to Singapore economy class and carried your own file.")],{macro:'bahtFell'}),
 scene('b_export_windfall','money',30,60,[country],'Paid in dollars',
  "The baht has fallen and the buyers pay in dollars. For the first time in years your crop or your catch is worth more than the fuel to bring it in. Your nephew has come back from Bangkok with no job.",[
  o('save','Bank it and say nothing',{cash:40000,wellbeing:1},"You took the bus to the bank in Sunday clothes."),
  o('nephew','Buy a second boat or a tractor and take him on',{cash:-30000,skills:{drive:1,eq:1},later:[{after:10,cash:150000,text:"It paid for itself and your nephew stayed. He still does not know how to fix it."}]},"You painted his name on the side in smaller letters than yours."),
  o('debt','Clear the debt at the co-op',{cash:-20000,wellbeing:4},"The clerk wrote zero and showed it to you.")],{macro:'bahtFell'}),
 scene('b_boom_broker','money',30,65,[country],'The broker in the good shoes',
  "The economy is running faster than anyone has seen. A broker from Bangkok is buying up land along every road for people he does not name. Your neighbour got a price that bought his son a pickup.",[
  o('keep','Keep it',{wellbeing:1},"He left his card under a rock on your gatepost. It rained on it."),
  o('sell','Sell',{cash:150000,wellbeing:-1,later:[{after:10,wellbeing:-3,text:"You were renting a house in the district town. Nothing had been built on your field but a sign."}]},"You had never held a cheque, and you held it with two hands.")],{macro:'boom'}),
 scene('b_boom_poach','work',20,35,[s=>college(s)||office(s)],'Another offer',
  "Every firm in town needs someone who can read a balance sheet. Your phone has rung twice this month. The pay is half as much again, and your present boss gave you your first chance.",[
  o('stay','Stay with your boss',{wellbeing:2,skills:{eq:1}},"He raised you by a tenth and took you out for a duck."),
  o('jump','Take the money',{cash:45000,skills:{drive:1},later:[{after:5,wellbeing:-3,cash:-30000,text:"Last in, first out. The guard at the new firm asked for your pass back at the lift.",when:hit('b_boom_poach','slump',6)}]},"You left a tin of biscuits on his desk and did not stay for it.")],{macro:'boom'}),
 scene('b_dear_credit','money',30,55,[notRich],'The rate goes up',
  "The bank has written to say your rate has gone up again. The instalment is now more than the room you could rent instead. Your cousin wants to buy, but at a price lower than what you owe.",[
  o('hold','Hold on and cut everything else',{wellbeing:-3,health:-1},"You stopped the newspaper and the Sunday meal. You kept the receipts in order."),
  o('sell','Sell to your cousin at a loss',{cash:-50000,wellbeing:1},"You handed the keys over at his mother's table and went on eating."),
  o('lodger','Take in lodgers',{cash:12000,wellbeing:-2,skills:{eq:1}},"Two students from Trang had the front room. You learned to knock.")],{macro:'dearCredit'}),

 // The 2020s and the last decades
 scene('h_covid_stall','work',20,70,[year(2020),poor],'Five thousand baht',
  "The market has been closed by order. The government is giving five thousand baht a month to people who can prove on a website that they have lost work. You have a phone with a cracked screen and a stall with no receipts.",[
  o('wait','Wait for the market to open',{wellbeing:-3},"You went every day to look at the shutter. A boy from the district office came and took your temperature."),
  o('apply','Get a neighbour\'s child to apply for you',{cash:15000,wellbeing:1,skills:{eq:1}},"It said verify, and then it said verify again, and then in June it was there."),
  o('sell','Cook at home and sell by delivery',{cash:8000,health:-1,skills:{drive:1}},"You learned to take a picture of an omelette. A rider sat on your step and ate one.")],{year:2020}),
 scene('h_covid_home','family',25,50,[year(2021),notRich,motherAlive],'A room in the city or a bed at home',
  "Your workplace has closed for a third time and the wave has reached your floor. Your parents are in their seventies and unvaccinated. You could go home. You could also be the one who brings it.",[
  o('stay','Stay in the room',{wellbeing:-4},"You had food left on the handle by a boy you never met."),
  o('home','Test and go home',{cash:-3000,wellbeing:1},"You spent fourteen days in a hut in the rice field. Your mother left the food at the bund and waved."),
  o('send','Send them money and the oximeter',{cash:-6000,wellbeing:-1,skills:{eq:1}},"Your father held it up to the camera, on the wrong finger.")],{year:2021}),
 scene('b_first_car','money',25,45,[era(2010,2012)],'The first car',
  "The government will give back up to a hundred thousand baht of tax on your first car. The showroom has a waiting list. You make twenty-two thousand a month and take the bus.",[
  o('bus','Keep taking the bus',{wellbeing:-1},"You stood on the 511 and read the posters for it."),
  o('buy','Sign for the car',{cash:-60000,wellbeing:4,later:[{after:5,cash:-120000,wellbeing:-5,text:"Your payment was more than the car was worth. A man came for it on a flatbed during your lunch."}]},"You had a monk bless it and put a sticker on the bumper.")]),
 scene('b_condo_bts','money',25,45,[era(2005,2019),middling,city],'Four hundred metres from the BTS',
  "A studio of twenty-eight square metres is four hundred metres from the station, and the bank will lend you all of it for thirty years. The commute now takes you three hours a day. Your parents have a house with room for you.",[
  o('home','Stay with your parents',{wellbeing:-1},"You left at five thirty. Your mother had put the rice in a box."),
  o('buy','Sign for thirty years',{cash:-200000,wellbeing:3,later:[{after:15,cash:200000,text:"The building was tired and so were you, but nobody could ask you to leave it."}]},"You could touch both walls if you were not holding anything.")]),
 scene('b_compound','family',45,70,[era(1988),rich,at('sukhumvit')],'The offer for the compound',
  "A developer has offered for your family's compound more than anyone in the family has ever earned. Your aunt has lived in the back house since before the road was paved. Your brothers have stopped returning each other's calls.",[
  o('keep','Refuse, for now',{wellbeing:-1,later:[{after:10,wellbeing:-3,text:"The towers went up on three sides. The garden gets sun from eleven to one."}]},"The man left a fruit basket for your aunt, and she gave it to the driver."),
  o('sell','Sell and divide it',{cash:6000000,wellbeing:-4},"The bulldozer started with the mango trees. Your aunt asked to be driven round the block instead."),
  o('tower','Keep a share in the tower',{cash:1500000,wellbeing:-2,skills:{drive:1}},"Your name went on a brass plate in the lobby and your aunt got the fourth floor, with a lift she would not use.")]),
 scene('b_boarding','family',40,55,[era(1980),rich,parent],'A school in England',
  "The other parents are sending their sons and daughters to boarding school in England at thirteen. It costs what a teacher earns in ten years. Your child has said nothing either way, which is what your child does.",[
  o('home','Keep them at the school here',{wellbeing:1},"They had the same friends until they were forty. You met at weddings."),
  o('send','Send them',{cash:-2500000,wellbeing:-2,skills:{iq:1},later:[{after:15,wellbeing:-3,text:"They came home with a good job and an accent. They pass you the fish sauce as if you had asked for it in another language."}]},"You left them at a gate in the rain with a trunk and a jar of chilli paste the matron took away.")]),
 scene('b_transfer_envelope','work',30,50,[era(1965),of('bureaucratic_class')],'The envelope for the transfer',
  "You have been six years in a district four hours from your family. The transfer list comes out in March, and a colleague says the head of personnel appreciates being remembered. He names a figure.",[
  o('wait','Wait your turn',{wellbeing:-2},"The list came out. You read it twice, in case."),
  o('pay','Remember him',{cash:-40000,wellbeing:-3,later:[{after:10,cash:-20000,wellbeing:-1,text:"A junior asked you how the system worked. You told him what it would cost."}]},"You left it in a box of mangosteens. You were home by May."),
  o('family','Move your family to the district instead',{cash:-10000,wellbeing:2,skills:{eq:1}},"You sat on the committee at the village school. The house had a good well.")]),

 // Old age
 scene('b_old_robe','connection',60,75,[era(1960),male],'The robe at sixty',
  "The temple needs someone who can read the accounts. You are too old to learn the chanting quickly. Your family says the house is yours and they would rather you were in it.",[
  o('stay','Stay in the house',{wellbeing:-1},"You fed the birds. Someone moved your chair."),
  o('robe','Ordain and stay',{wellbeing:4,cash:-3000,skills:{eq:2}},"The novices corrected your Pali and called you grandfather. Your knees told you what time it was.")]),
 scene('b_white_robe','connection',60,75,[era(1960),female],'White robes',
  "You have looked after everyone you were going to look after. The nuns at the wat by the river sleep on boards and answer to no one. Your niece is expecting and has already asked what you will do about the baby.",[
  o('baby','Stay and raise the baby',{wellbeing:1,health:-2},"You carried the baby round the same yard where you had carried her mother."),
  o('white','Shave your head and go to the wat',{wellbeing:4,skills:{eq:2}},"The first week your scalp burned. Your niece's little girl came and looked at you through the fence.")]),
 scene('b_allowance','money',60,75,[era(2012),poor],'Six hundred a month',
  "The sub-district office will pay you six hundred baht a month for being old. It has to be registered in person, and it comes into a bank account you would have to open. Your grandson says he can hold the card.",[
  o('self','Go and open the account yourself',{wellbeing:2,skills:{drive:1}},"You put your thumb on the pad and they said press softer."),
  o('grandson','Give him the card',{wellbeing:1},"He brought you some of it, on some months."),
  o('none','Leave it, you have managed this long',{wellbeing:-1},"The headman asked twice. You said it was for people who needed it.")]),
 scene('b_funeral_society','money',65,75,[era(1975),notRich],'The funeral society',
  "The funeral society takes twenty baht from each member whenever a member dies, and pays your family a lump sum. Your friends are dying faster than they used to, and the deductions now exceed what you spend on food.",[
  o('quit','Quit the society',{cash:6000,wellbeing:-2},"You saved the deductions in a tin and thought about the tin."),
  o('stay','Keep paying',{cash:-5000,wellbeing:1,later:[{after:10,cash:40000,text:"It paid for the monks, the ice and the whole of the tent."}]},"The man brought the book round. You signed it for three people on your lane who could no longer hold the pen.")]),
 scene('b_whose_name','family',70,75,[],'Whose name goes on the land',
  "Your niece nursed you and has no paper for it. Your brother's son lives in Chon Buri and has the family name and a loan. The land office closes at half past three. You can still write your own name.",[
  o('leave','Leave it and let them settle it',{wellbeing:-3,later:[{after:5,wellbeing:-2,text:"They settled it at the funeral, in the car park."}]},"You went home and did not go back."),
  o('niece','Put it in your niece\'s name',{wellbeing:2,skills:{drive:1}},"The clerk read it out twice. She was outside, minding the bicycle."),
  o('half','Divide it evenly and tell them both',{wellbeing:1,skills:{eq:1}},"He rang from Chon Buri. She said nothing and cut your toenails.")])
];
