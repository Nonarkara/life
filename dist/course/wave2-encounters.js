import {of,at,sex,withMother,withFather,child,all,o,scene,RICH,NOT_RICH,POOR} from './wave1-encounters.js';
import {regionAt} from './regions.js';
import {birthYearOf} from './thai-history.js';
// Content wave 2 (REBUILD-STRATEGY.md step 3). Aimed at the thinnest stretches of the deck:
// the school years (10-19) and old age (60-80), plus middle and civil-service households.
// Same grammar as wave 1: one small object, a cost carried by a named person, no verdict, no year.
const together=s=>{const f=s.story?.flags??{};return (f.married??f.committed??f.apart)!==undefined&&f.separated===undefined;};
const married=s=>{const f=s.story?.flags??{};return f.married!==undefined&&f.separated===undefined;},single=s=>!together(s);
const parent=s=>s.story?.flags?.parent!==undefined;
const old=s=>s.age>=60;

export const WAVE2_ENCOUNTERS=[
 // School years
 {...scene('w2_uniform','school',10,14,all(POOR,withMother),'Your cousin\'s name on the shirt',
  'Your school shirt was your cousin\'s. Their name is still stitched above the pocket in blue thread. The teacher reads it out at roll call.',[
  o('wear','Wear it as it is',{wellbeing:-1,skills:{eq:1}},'You answered to both names for a term. Then the teacher stopped noticing.'),
  o('unpick','Unpick the name at night',{skills:{craft:1}},'You unpicked it with your mother\'s needle. The holes stayed in the cloth all year.'),
  o('new','Ask for a new shirt',{cash:-300,wellbeing:1},'Your mother bought one. She wore her own sandals another year.')]),child:true},
 scene('w2_temple_boy','school',12,15,all(of('low_class'),at('isan-village','nakhon-sawan','pak-phanang'),s=>sex(s)==='male'),'A mat at the temple in town',
  'The secondary school is in town, too far to walk. The abbot there takes village boys who sweep the grounds and carry the monks\' bowls at dawn.',[
  o('go','Go and live at the temple',{wellbeing:-1,skills:{drive:1,eq:1},flag:'templeBoy'},'You slept on a mat under the eaves. You learned to wake before the bell.'),
  o('stay','Stay home and help on the land',{skills:{physique:1}},'You stayed. Another boy from the village took the mat.'),
  o('bus','Ride the morning truck to town',{cash:-2000,health:-1},'You rode the truck every morning, standing at the back with the vegetables.')]),
 scene('w2_one_place','school',14,16,all(POOR,s=>sex(s)==='female',withMother,withFather),'Money for one of you',
  'There is money for one child to stay at school past fifteen. Your brother\'s marks are worse than yours. Nobody has said which of you it will be.',[
  o('ask','Ask your father to decide on marks',{skills:{drive:1},wellbeing:-1},'He looked at both report cards for a long time. It was the first argument you ever won.'),
  o('yield','Let your brother have it',{wellbeing:-2,skills:{eq:1}},'Your brother went on. He sent money home every month for twenty years.'),
  o('work','Work evenings to pay your own way',{health:-2,skills:{drive:1},flag:'selfPaid'},'You washed dishes at a noodle shop until ten every night. You passed.')]),
 scene('w2_tutor','study',14,18,of('middle_class','bureaucratic_class'),'The tutoring school above the shophouse',
  'Everyone in your class goes to the tutoring school after school and on Saturdays. Your parents have the money. You have not had a free afternoon in a year.',[
  o('skip','Skip Saturdays and say nothing',{wellbeing:2},'You spent Saturdays at the river with a book that was not on any syllabus.'),
  o('go','Go to every class',{cash:-8000,wellbeing:-2,skills:{iq:1}},'Your marks went up. A year later you could not remember the syllabus.'),
  o('teach','Ask to study alone, and prove it works',{skills:{drive:1,iq:1}},'Your parents gave you one term. You kept to it, mostly.')]),
 scene('w2_car_block','school',12,17,of('high_class'),'Drop me at the corner',
  'You ask the driver to stop a block before the school gate, so your friends do not see the car. He knows why. He has a son your age.',[
  o('corner','Walk the last block',{wellbeing:1},'You walked the block every morning. The driver waited until you turned the corner.'),
  o('gate','Get out at the gate like before',{wellbeing:-1},'You got out at the gate. One friend stopped waiting for you there.'),
  o('bus','Take the public bus instead',{health:-1,skills:{eq:1}},'You took the bus. You learned which seat was in the shade at four o\'clock.')]),
 scene('w2_bullied','connection',11,16,()=>true,'The boy at the back of the bus',
  'Every afternoon the older boys take the same boy\'s lunch money on the bus. Nobody looks. You are sitting two rows in front.',[
  o('look','Look out of the window like the others',{wellbeing:-2},'You looked out of the window. Years later you still knew his name.'),
  o('sit','Go and sit next to him',{skills:{eq:1},wellbeing:1},'You sat next to him. The older boys found someone else, and once, you.'),
  o('teacher','Tell a teacher',{skills:{drive:1}},'The teacher moved the older boys to another bus. Nobody knew it was you, except him.')]),
 scene('w2_letter','connection',13,18,()=>true,'A folded note in your desk',
  'There is a note folded very small in your desk. It is not signed. The handwriting is careful, as if it was written twice.',[
  o('keep','Keep it and say nothing',{wellbeing:1},'You kept it in a book. Twenty years later it fell out, and you still did not know.'),
  o('find','Find out who wrote it',{skills:{eq:1},wellbeing:1},'It took a week. You sat with them at lunch for the rest of the term.'),
  o('show','Show it to your friends',{wellbeing:-1},'Your friends laughed. Someone in the back row stopped looking up.')]),
 scene('w2_cows','family',10,15,all(at('isan-village','nakhon-sawan'),NOT_RICH,withFather),'The cows before school',
  'Before school you walk the family\'s cows out to the field, and after school you bring them back. Your homework is done after dark at the kitchen table, or not at all.',[
  o('both','Do both, and sleep less',{health:-1,skills:{physique:1,drive:1}},'You did both. You could fall asleep anywhere for the rest of your life.'),
  o('cousin','Pay your cousin to walk them twice a week',{cash:-200,skills:{iq:1}},'Your cousin took your coins and the cows. Your marks went up by one line.'),
  o('ask','Ask your father to sell one',{wellbeing:-1},'He did not sell one. He did start walking them himself on Mondays.')]),
 // One school-years scene for each town birthplace. Tutoring schools filled Siam Square from the 1970s; drawn from 1975.
 {...scene('w2_ponies','family',10,15,all(at('hua-hin'),withMother,s=>(birthYearOf(s)??1981)+s.age>=1970),'Walking the ponies home',
  'In the school holidays, the man who hires out ponies on the beach pays a few coins to anyone who will lead them home at dusk. Your mother says the sand is not a job.',[
  o('lead','Lead them home',{cash:100,skills:{physique:1}},'You led two ponies home every evening. Your mother stopped mentioning the sand.'),
  o('ride','Ask for a ride instead of coins',{wellbeing:1},'He let you ride the old grey one to the end of the beach and back. You never asked for coins again.'),
  o('stay','Stay home as she asks',{skills:{iq:1}},'You stayed home and read. From the window you watched the ponies go past without you.')]),child:true},
 {...scene('w2_lake_rice','family',10,15,all(at('udon-thani'),NOT_RICH),'Nong Prajak after school',
  'After school everyone goes to Nong Prajak, the lake in the middle of town. Your aunt sells grilled sticky rice by the water and wants you behind the grill until dark.',[
  o('grill','Stand behind the grill',{cash:80,skills:{craft:1}},'You learned to turn forty sticks at once. Your aunt paid you in rice, and on Fridays in coins.'),
  o('walk','Walk round the lake with your friends',{wellbeing:1,skills:{eq:1}},'You walked the lake until the lights came on. Your aunt found another child to help.'),
  o('study','Do your homework at her table',{skills:{iq:1}},'You did your homework between customers. The pages smelled of smoke.')]),child:true},
 scene('w2_siam_tutor','school',14,18,all(at('pathum-wan'),withFather,s=>(birthYearOf(s)??1981)+s.age>=1975),'Tutoring in Siam Square',
  'The tutoring schools above the shops in Siam Square are full every Saturday. Your father says the fee is a month of his overtime.',[
  o('enrol','Enrol',{cash:-300,skills:{iq:1}},'Your father worked the overtime. You sat at the back and copied every board.'),
  o('notes','Copy a friend\'s notes',{skills:{iq:1,eq:1},wellbeing:-1},'You copied her notes on Sunday nights. She wanted your lunch money in return.'),
  o('alone','Study on your own',{skills:{drive:1}},'You studied at the kitchen table. Your father kept his overtime and bought a fan.')]),
 scene('w2_stall_shift','work',10,15,all(of('working_class','middle_class'),at('samut-prakan','khlong-toei','bang-na'),withMother,withFather),'Minding the stall at five',
  'At five every evening you mind your parents\' stall so they can eat. Your friends are at the football ground across the road.',[
  o('mind','Mind the stall',{skills:{craft:1,eq:1}},'You learned to count change without looking. Customers asked for you by name.'),
  o('ball','Run off to play, and come back quickly',{wellbeing:2,flag:'leftStall'},'You came back twenty minutes late. Your father said nothing, which was worse.'),
  o('both','Bring your friends to the stall',{wellbeing:1},'Your friends ate half the stock. Your mother charged their mothers.')]),
 scene('w2_entrance','study',15,19,all(NOT_RICH,withMother,withFather),'The first line on the form',
  'The university form asks for your first choice. Your parents want medicine or law. You want something they would have to look up.',[
  o('theirs','Write their choice first',{wellbeing:-2,skills:{iq:1}},'You wrote their choice. On the morning of the results your mother bought sweets for the whole soi.'),
  o('yours','Write your own choice first',{wellbeing:1,skills:{drive:1},flag:'ownPath'},'You wrote your own. Your father read the form twice and signed it.'),
  o('none','Leave it blank this year and work',{cash:4000,wellbeing:-1},'You worked a year. The form waited in a drawer.')]),

 // Working age, middle and civil-service households
 scene('w2_civil_exam','work',21,30,all(of('working_class','middle_class','bureaucratic_class'),withFather),'Your father wants you in the civil service',
  'Your father wants you to sit the civil service exam. The salary is small, he says, but the pension is for life and the hospital is free.',[
  o('sit','Sit the exam',{skills:{iq:1},wellbeing:-1,flag:'civilService'},'You passed in the third year. Your father framed the letter.'),
  o('private','Stay in the private job',{cash:12000,wellbeing:1},'You stayed. Your father asked about the exam every New Year, then stopped.'),
  o('both','Sit it, and decide when the result comes',{skills:{iq:1},flag:'civilService'},'You passed. You held the letter for a week before you said anything.')]),
 scene('w2_commute','work',25,50,all(NOT_RICH,s=>['bang-na','samut-prakan'].includes(regionAt(s))),'Two hours each way',
  'The office moved to the other side of the city. It is two hours each way. You leave in the dark and come home in the dark.',[
  o('keep','Keep the job and the room',{health:-2,wellbeing:-2,skills:{drive:1}},'You learned to sleep standing up on the bus. You saw your street in daylight on Sundays.'),
  o('move','Rent a smaller room near the office',{cash:-18000,wellbeing:1},'The room was half the size. You had your evenings back.'),
  o('quit','Find work closer to home',{cash:-6000,wellbeing:2},'The new job paid less. You started cooking dinner again.')]),
 scene('w2_sinsod','family',22,38,all(NOT_RICH,s=>sex(s)==='male',s=>s.story?.flags?.committed!==undefined&&s.story?.flags?.married===undefined),'The bride price',
  'The two families are sitting down to agree the sin sod. Your aunt has a figure in mind. Your partner\'s uncle has a different one.',[
  o('small','Ask both sides for a small, quiet sum',{wellbeing:1,skills:{eq:1}},'The sum was small. Your aunt told everyone it had been larger.'),
  o('show','Agree a large sum, returned after the wedding',{cash:-5000,wellbeing:1},'The money sat on the tray for the photographs, then went back into a bank. The monks and the tent cost five thousand.'),
  o('loan','Borrow to meet the full figure',{cash:-60000,wellbeing:-2,flag:'weddingDebt'},'The wedding was the one people talked about. The repayments took four years.')]),
 scene('w2_mother_in_law','family',28,50,married,'Your partner\'s mother moves in',
  'Your partner\'s mother is moving in. She brings her own rice cooker, her own pillow and her opinions about your kitchen.',[
  o('kitchen','Let her run the kitchen',{wellbeing:-1,skills:{eq:1}},'She ran the kitchen. You ate better than you had in years, and said so once.'),
  o('rules','Agree on rules on the first day',{skills:{drive:1}},'The rules lasted until the first argument about salt. After that, mostly.'),
  o('room','Rent her a room nearby',{cash:-24000,wellbeing:1},'She lived three doors away and came every evening anyway.')]),
 scene('w2_night_shift','work',20,40,of('low_class','working_class'),'The night line pays more',
  'The factory pays a third more for the night line. Your body does not like it. Your rent does.',[
  o('day','Stay on days',{wellbeing:1},'You stayed on days. The rent was paid late twice that year.'),
  o('night','Take the night line',{cash:9000,health:-3},'You worked nights for two years. You stopped knowing what time breakfast was.'),
  o('swap','Take nights one month in three',{cash:3000,health:-1},'You swapped with a friend. You both slept badly, but less often.')]),
 scene('w2_checkup','health',40,60,of('middle_class','bureaucratic_class','high_class'),'A number in red on the form',
  'The office health check comes back with one number printed in red. The doctor says sugar, and less rice, and walking.',[
  o('walk','Walk every evening',{health:3,wellbeing:1},'You walked to the temple and back every evening. The number came down, slowly.'),
  o('pills','Take the pills and change nothing',{cash:-3000,health:1},'You took the pills. The number came down a little and stayed red.'),
  o('ignore','Put the form in a drawer',{health:-2},'You put it in a drawer. The next year there were two numbers in red.')]),
 scene('w2_soi_sold','family',45,72,all(RICH,at('sukhumvit')),'The neighbours have sold',
  'The family next door has sold their house to a developer. The tower will be thirty floors. The man from the company has left his card in your gate.',[
  o('stay','Keep the house',{wellbeing:1},'You kept it. For two years the pile drivers started at seven.'),
  o('sell','Call the number on the card',{wellbeing:-2,flag:'soldHouse'},'You sold, and moved to a flat with a view of the tower. The mango tree your grandfather planted was cut down the first week.'),
  o('wait','Wait for a better offer',{wellbeing:-1},'The offer went up once. Then the company bought the house on the other side instead.')]),

 // Old age
 scene('w2_grandchild_left','family',50,75,all(POOR,child(18,40)),'Your grandchild arrives on the bus',
  'Your child brings your grandchild home on the bus and goes back to the city for work. The child is two. You are not young any more.',[
  o('raise','Raise the child',{health:-2,wellbeing:2,flag:'raisingGrandchild'},'You raised the child. At school they wrote your name on the form where it said parent.'),
  o('money','Ask your child to send more money',{wellbeing:-1,skills:{drive:1}},'The money came every month, a little late. So did the phone calls.'),
  o('back','Send the child back to the city',{wellbeing:-3},'The child went back. The house was very quiet, and you hated it.')]),
 scene('w2_fall','health',65,80,old,'The bathroom floor',
  'You slipped on the wet bathroom floor. Nothing is broken. You lay there for some time before you could get up.',[
  o('tell','Tell someone',{wellbeing:-1,skills:{eq:1}},'You told the neighbours. Their son came that weekend and fixed a rail to the wall.'),
  o('hide','Say nothing',{health:-2},'You said nothing. You washed sitting down from then on.'),
  o('rail','Buy a rubber mat and a rail yourself',{cash:-1200,health:1},'You fitted them yourself. You were proud of that for a long time.')]),
 scene('w2_alms','family',60,80,all(old,s=>!(s.story?.seen??[]).some(x=>x.id==='th_alms_round'&&x.choice==='sleep')),'The alms bowl at dawn',
  'Every dawn for forty years you have waited at the gate with rice for the monks. This year your knees will not let you kneel.',[
  o('stand','Stand to give, and do not kneel',{wellbeing:1},'You gave standing. The young monk bent lower so you would not have to reach.'),
  o('child','Ask the neighbour\'s child to give with you',{wellbeing:2,skills:{eq:1}},'The child yawned at the gate every morning, and came every morning.'),
  o('kneel','Kneel anyway',{health:-2,wellbeing:1},'You knelt. It took longer each month to get up.')]),
 scene('w2_will','family',62,80,all(old,parent),'Who gets the house',
  'Your child expects the house. Your niece has looked after you for six years. You have not written anything down.',[
  o('talk','Call everyone together and say it out loud',{wellbeing:-1,skills:{eq:1}},'There were tears and one door slammed. By New Year they were all at your table.'),
  o('write','Write it down and tell nobody',{cash:-3000},'You wrote it down and had it registered at the district office.'),
  o('leave','Leave it for them to settle',{wellbeing:1},'You left it. You told yourself they were good children, and mostly they were.')]),
 scene('w2_glasses','health',55,72,NOT_RICH,'The lottery numbers are blurred',
  'You can no longer read the lottery numbers in the newspaper. The glasses at the market cost a hundred baht. The clinic costs much more.',[
  o('market','Buy the market glasses',{wellbeing:1},'They worked for the numbers. The world beyond your arm stayed soft.'),
  o('clinic','Go to the eye clinic',{cash:-2500,health:1},'The doctor found a cloud in one eye. Later it was fixed, and the leaves on the trees came back.'),
  o('ask','Ask the neighbour\'s child to read them out',{skills:{eq:1}},'The child read them out every fortnight, and sometimes the horoscopes too.')]),
 scene('w2_reunion','connection',55,72,()=>true,'Forty years since school',
  'Your class is meeting for the first time in forty years. The one who used to copy your homework now owns three hotels.',[
  o('go','Go, in your good shirt',{wellbeing:2},'You went. The hotel owner remembered the homework, and paid for dinner.'),
  o('skip','Stay home',{wellbeing:-1},'You stayed home. Someone posted the photo, and you looked for faces for an hour.'),
  o('host','Offer to organise the next one',{cash:-2000,wellbeing:2,skills:{eq:1}},'You organised the next one. Fewer came each year, and the ones who came stayed later.')]),
 scene('w2_teeth','health',62,80,all(old,NOT_RICH),'The new teeth',
  'Your back teeth are gone and rice is hard to chew. A full set from the clinic costs more than a month of what you live on.',[
  o('soft','Eat soft food',{health:-1},'You ate rice porridge and steamed fish. You missed grilled pork more than you said.'),
  o('clinic','Get the full set',{cash:-8000,health:2,wellbeing:2},'They hurt for a month. Then you bit into a guava for the first time in years.'),
  o('village','Go to the cheaper dentist in the next town',{cash:-2500,health:1},'They did not fit well. You took them out to eat, and put them in for photographs.')]),
 scene('w2_single_old','connection',60,80,all(old,single,s=>s.story?.flags?.parent===undefined),'Who will take you to the hospital',
  'You have no children and no partner. At the clinic, the form asks for the name of someone to call.',[
  o('niece','Write your niece\'s name',{skills:{eq:1}},'You wrote her name, then called her that evening to say so. She came the next Sunday.'),
  o('friend','Write a friend\'s name, and offer to be theirs',{wellbeing:2},'You wrote each other\'s names. You visited each other\'s wards twice.'),
  o('blank','Leave it blank',{wellbeing:-2},'You left it blank. The nurse wrote "temple" in pencil.')])
];
