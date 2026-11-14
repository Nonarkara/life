import {of,at,sex,all,o,scene,POOR,withMother,withFather} from './wave1-encounters.js';
import {rand} from './rand.js';
import {regionGroup,homeRegion} from './regions.js';
import {birthYearOf} from './thai-history.js';
// A scene tied to a dated place waits for that year.
const from=y=>s=>{const b=birthYearOf(s);return b!==null&&b+s.age>=y;};
// The game keeps a life's class, not its trade. Where a province's record names more than one way of
// living for a class, or the trade is one family's among many, a life belongs to it by a fixed share.
const share=(key,p)=>s=>rand(s.seed,0,'trade-'+key)<p;
// Regional scenes (THAILAND-77-PLAN.md phase 5). Each comes from a livelihood that a household record in
// research/provinces/<region>.json names, and fires only in the provinces whose record names it (the
// seasonal move to Bangkok is the one the Isan records give as a regional pattern). Wave-1 grammar: one
// small object, a cost carried by a named person, no verdict, no year. No native reader has checked them.
const inRegion=g=>s=>regionGroup(homeRegion(s.birth,s.age))===g;

export const REGION_ENCOUNTERS=[
 // North: Chiang Mai's silverwork and Lamphun's longan orchards.
 scene('north_silver','school',10,14,all(at('chiang-mai'),of('working_class'),withFather),'Silver bowls by the old city gate',
  'Your father hammers patterns into silver bowls for the shops by the old city gate. He wants you at his bench after school. Your teacher wants you in the library.',[
  o('bench','Sit at his bench',{skills:{craft:1}},'You learned to hold the small hammer still. Your homework waited until dark.'),
  o('library','Go to the library',{skills:{iq:1},wellbeing:-1},'You read until the library closed. Your father worked the bench alone.'),
  o('both','Do both and sleep less',{health:-1,skills:{craft:1,iq:1}},'You did both for a year. Your mother made you rice soup at midnight.')]),
 scene('north_longan','family',12,18,all(at('lamphun'),POOR),'The longan scale in August',
  'In August the longan trees are heavy and every hand in the village picks. The pickers are paid by the kilo at the scale. Your exams are the same week.',[
  o('pick','Pick with your aunt',{skills:{physique:1},cash:2000},'Your hands were sticky for a week. Your aunt paid you by the kilo.'),
  o('study','Stay home and study',{skills:{iq:1}},'You passed the exams. Your aunt hired a neighbour\'s son instead.'),
  o('dawn','Pick at first light and study after',{health:-1,skills:{drive:1}},'You picked from first light and studied after lunch. You fell asleep on the bus to the exam.')]),
 // Isan: ikat silk woven at home, and the seasonal move to Bangkok for higher wages.
 scene('isan_loom','family',8,13,all(at('amnat-charoen','kalasin','maha-sarakham','nakhon-phanom','roi-et','surin'),POOR,withMother),'The silk on your mother\'s loom',
  'Your mother weaves silk under the house in the dry season. The pattern is tied into the thread before it is dyed. She asks if you want to learn it.',[
  o('learn','Learn to tie the pattern',{skills:{craft:1,eq:1}},'Your fingers learned the knots before your head did. Your mother checked every one.'),
  o('play','Run off with your cousins',{wellbeing:1},'You spent the dry season at the pond. Your mother kept weaving.'),
  o('sell','Carry her cloth to the market',{skills:{eq:1},cash:500},'You sat with the cloth at the market. A woman from town bought two lengths.')]),
 scene('isan_bus','work',17,24,all(inRegion('isan'),POOR,withFather),'A seat on the bus after the harvest',
  'After the harvest your cousin is taking the bus to Bangkok to work until planting. There is a job for one more at the same place. Your father\'s back is bad this year.',[
  o('stay','Stay and help your father',{skills:{physique:1}},'You stayed and mended the barn roof. Your cousin sent money back in an envelope.'),
  o('go','Go with your cousin until planting',{cash:15000,health:-1,flag:'seasonalWork'},'You slept six to a room and sent money home every month. You came back for planting.'),
  o('alone','Let your cousin go alone',{wellbeing:-1,skills:{eq:1}},'Your cousin went alone. Your father mended the roof with one hand on his back.')]),
 // East: shifts on the industrial coast, and the durian orchards.
 scene('east_shift','work',18,30,all(at('chonburi','rayong','prachinburi','chachoengsao'),of('working_class'),withMother,s=>!(at('rayong')(s)&&share('samet',.35)(s))),'The time card at the industrial park',
  'The plant runs three shifts and the supervisor asks if you want nights. Night pays more. Your mother\'s stall opens at six, and she counts on you to carry the crates.',[
  o('day','Keep the day shift',{wellbeing:1},'You kept days and carried the crates at six. Your time card filled with the same hours every week.'),
  o('night','Take the night shift',{cash:20000,health:-1},'You punched your card at ten every night. Your mother carried the crates alone, and the extra money went into a savings book.'),
  o('train','Ask to train on the machines',{skills:{iq:1,drive:1}},'You learned the panel in three months. The supervisor stopped calling you by your number.')]),
 scene('east_durian','family',10,16,all(at('chanthaburi','trat'),withFather),'The stick at the durian orchard',
  'In durian season your father works the orchard from before dawn. He knocks each fruit with a short stick and listens. He needs someone to sort the fruit as he calls it.',[
  o('sort','Sort the fruit with him',{skills:{eq:1}},'You learned to hear a ripe one under the stick. Your father let you weigh and price one load.'),
  o('beach','Go to the beach with your friends',{wellbeing:1},'You came home sunburnt. Your father had sorted the fruit by lamp light.'),
  o('books','Keep the books for the buyers',{skills:{iq:1},wellbeing:-1},'You wrote every kilo in a school notebook. The buyer checked your sums and found nothing.')]),
 // West: Phetchaburi's palm sugar and Bang Saphan's rattan weaving group.
 scene('west_palm','family',9,14,all(at('phetchaburi'),POOR,withFather),'Palm sap before sunrise',
  'Your father climbs the sugar palms before sunrise to bring down the sap. It has to be boiled the same morning or it turns sour. Someone has to keep the fire.',[
  o('fire','Keep the fire',{skills:{physique:1}},'You stirred the pan until the sap set into palm sugar. Your clothes smelled of smoke at school.'),
  o('sleep','Stay in bed',{wellbeing:1},'You slept. Your grandmother kept the fire, and her cough was worse that year.'),
  o('climb','Ask to learn to climb',{skills:{drive:1},health:-1},'Your father let you climb the short tree first. You scraped both knees on the bamboo ladder.')]),
 scene('west_rattan','work',25,45,all(at('prachuap-khiri-khan'),of('working_class','low_class')),'The weaving group needs one more',
  'The village weaving group makes black and white rattan baskets and runs a few small shops. Your neighbour, who keeps its books, asks you to join. The pay comes when the baskets sell.',[
  o('decline','Keep your own work',{},'You kept your own work. Your neighbour asked someone from the next village.'),
  o('join','Join the group',{skills:{craft:1,eq:1},wellbeing:1},'You learned the pattern in a month. Your baskets sold at the group\'s shop.'),
  o('shop','Run one of the shops',{skills:{eq:1,drive:1},cash:-3000},'You paid your share of the rent and sat behind the counter. Your aunt took over your work at home.')]),
 // South: rubber tapped before dawn, and Trang's Sino-Thai coffee shop.
 scene('south_rubber','family',11,16,all(at('krabi','phang-nga','phatthalung','trang','surat-thani','ranong'),POOR,withMother),'The latex in the cups',
  'Your mother taps the rubber trees in the dark before dawn, when the latex runs best. She cuts each tree and the latex drips into a cup below the cut. She asks you to come and collect the latex before school.',[
  o('collect','Collect the latex with her',{skills:{physique:1,eq:1}},'You carried the buckets with a head torch. You were never late for school, only tired.'),
  o('sleep','Stay in bed',{wellbeing:1},'You slept until it was light. Your mother carried every bucket herself.'),
  o('cut','Ask to learn the cut',{skills:{craft:1},health:-1},'You cut too deep the first week and she showed you again. By the end of the year your line was straight.')]),
 scene('south_kopi','work',20,35,all(at('trang'),of('middle_class','working_class')),'The coffee shop on the corner',
  'Your uncle has run the coffee shop on the corner for thirty years, with dim sum in the morning. His hands shake now. He asks if you will take over the early shift.',[
  o('no','Tell him no, kindly',{},'You said no. He kept the early shift himself and closed an hour sooner.'),
  o('take','Take the early shift',{skills:{eq:1,drive:1},health:-1},'You learned to pull the coffee through the cloth sock. The regulars told you it was almost right.'),
  o('buy','Buy the shop from him',{cash:-60000,skills:{drive:1},wellbeing:1},'You paid him in instalments. He still came every morning and sat at the corner table.')]),
 // Central: Ayutthaya's boat noodles, and the salt pans of the Gulf shore.
 scene('central_noodles','family',10,16,all(at('ayutthaya'),of('middle_class','working_class'),withMother),'Boat noodles at the landing',
  'Your family sells boat noodles at the landing, in small bowls, many to a customer. On weekends the queue reaches the road. Your mother asks you to wash bowls instead of going to tutoring.',[
  o('wash','Wash the bowls',{skills:{eq:1}},'You washed bowls from ten until three. Some tables ate twelve bowls each.'),
  o('tutor','Go to tutoring',{skills:{iq:1},wellbeing:-1},'You went to tutoring. Your mother hired a neighbour\'s girl for the weekends.'),
  o('cook','Ask to work the pot',{skills:{craft:1,drive:1},health:-1},'You burned your wrist the first week. By the summer you could make the broth alone.')]),
 scene('central_salt','family',12,18,all(at('samut-sakhon','samut-songkhram','phetchaburi'),POOR,withFather,withMother),'Salt in the dry months',
  'In the dry months your family floods the pans with sea water and lets the sun do the rest. When the salt forms it has to be raked and carried in before any rain. Rain is coming tomorrow.',[
  o('rake','Rake with your father',{skills:{physique:1}},'You raked until dark and carried baskets to the shed. When the rain came at midnight, the salt was already in.'),
  o('school','Go to school as usual',{skills:{iq:1},wellbeing:-1},'You went to school. Your father and uncle raked half the pans before the rain.'),
  o('help','Ask the neighbours to help, and cook for them',{skills:{eq:1},cash:-500},'Six neighbours came. Your mother cooked for all of them and nobody went home before it was in.')]),
 // Second set. North: Lampang's ceramics works and Nan's hospital.
 scene('north_kiln','work',16,18,all(at('lampang'),of('working_class'),share('kiln',.5)),'Bowls on the kiln racks',
  'The ceramics works takes on young hands to stack bowls on the racks for the kiln. The pay is by the rack. Your cousin, who works there, says the kiln room stays hot all night.',[
  o('school','Stay at school',{skills:{iq:1}},'You stayed at school. Your cousin took the rack that would have been yours.'),
  o('stack','Take the job',{cash:12000,health:-1,skills:{physique:1}},'You stacked racks until your forearms were brown with glaze dust. The money paid for a new stove at home.'),
  o('glaze','Ask to learn the glazing',{skills:{craft:1,drive:1},wellbeing:-1},'The glazer let you dip the plain bowls first. By the end of the year you were trusted with the good ones.')]),
 scene('north_ward','work',22,35,all(at('nan'),of('bureaucratic_class'),withMother,from(2000)),'The ward register',
  'You keep the register on a ward at the provincial hospital. A clerk\'s post has opened in Bangkok at higher pay. Your mother lives two streets from the hospital.',[
  o('stay','Stay on the ward',{wellbeing:1},'You stayed. Your mother brought you lunch in a tiffin tin on Fridays.'),
  o('go','Take the post in Bangkok',{cash:30000,wellbeing:-1},'You went. Your mother learned to use the phone you sent her.'),
  o('course','Stay, and train in medical records',{skills:{iq:1,drive:1},health:-1},'You studied after every shift. The head nurse on nights let you sit with her charts.')]),
 // Isan: Surin's Kuy elephant families and Nakhon Phanom's khene makers.
 scene('isan_elephant','family',10,16,all(at('surin'),of('low_class'),withFather,share('elephant',.3)),'The elephant at the forest edge',
  'Your family keeps an elephant, as Kuy families in the north of Surin have for generations. Your father walks her to the forest edge to feed at dawn. He asks you to learn her commands.',[
  o('learn','Learn her commands',{skills:{eq:1,physique:1}},'She listened to your father first and to you second. One morning she listened only to you.'),
  o('school','Go to school instead',{skills:{iq:1},wellbeing:-1},'You went to school. Your father walked her to the forest alone.'),
  o('grass','Cut grass for her before school',{health:-1,skills:{drive:1}},'You cut grass before every school day. Your arms grew before the rest of you.')]),
 scene('isan_khene','family',12,18,all(at('nakhon-phanom'),of('working_class'),withFather,share('khene',.3)),'Six khene before the end of the rains',
  'Your father makes khene, the bamboo mouth organs, by hand. Each reed has to be tuned by ear against the one beside it. A band from town wants six by the end of the rains.',[
  o('tune','Tune the reeds with him',{skills:{craft:1,eq:1}},'You learned to hear when two reeds were close but not yet the same. Your father finished the sixth at dawn.'),
  o('play','Play in the band instead',{wellbeing:1,skills:{eq:1}},'You played at three temple fairs. Your father tuned the last reeds alone.'),
  o('study','Keep to your schoolwork',{skills:{iq:1}},'You kept to your books. Your father worked by lamp light to finish on time.')]),
 // East: the border market at Rong Kluea and a family on Ko Samet.
 scene('east_clothes','work',15,30,all(at('sa-kaeo'),of('low_class'),from(1991)),'The bale at Rong Kluea market',
  'Your aunt\'s stall at Rong Kluea market sells second-hand clothes by the bale and by the piece. On market mornings the carts come through the border gate as soon as it opens. She asks you to sort a new bale before the buyers arrive.',[
  o('sort','Sort the bale with her',{skills:{eq:1}},'You sorted shirts from trousers by torch light. Your aunt sold the best pieces by nine.'),
  o('sleep','Sleep until the market opens',{wellbeing:1},'You slept. Your aunt sorted the bale alone and opened late.'),
  o('price','Price the pieces yourself',{skills:{iq:1,drive:1},wellbeing:-1},'You priced every piece in a notebook. Your aunt changed half your prices and kept the notebook.')]),
 scene('east_samet','family',25,45,all(at('rayong'),of('working_class'),share('samet',.35),from(1985)),'The papers in the biscuit tin',
  'Your family\'s house is in Na Dan on Ko Samet, where many families have never held a full title to the land. A resort wants the plot beside yours. Your uncle keeps the old papers in a biscuit tin.',[
  o('wait','Wait and see',{},'You waited. Your uncle kept the tin under his bed.'),
  o('lawyer','Pay someone to look at the papers',{cash:-15000,skills:{drive:1}},'A man from across the water read every page. He said they might count.'),
  o('rooms','Rent your spare rooms to visitors',{cash:8000,skills:{eq:1},wellbeing:-1},'You rented two rooms to visitors. Your uncle moved his tin to the kitchen.')]),
 // West: Kanchanaburi's sugar mill and Damnoen Saduak's sampan vendors.
 scene('west_mill','work',18,30,all(at('kanchanaburi'),of('working_class'),withMother),'Cane trucks at the sugar mill',
  'In the crushing season the sugar mill runs day and night and the cane trucks queue down the road. The mill pays extra for the night crew. Your mother says the dust gets into your chest.',[
  o('day','Stay on the day crew',{wellbeing:1},'You stayed on days. Your mother stopped mentioning the dust.'),
  o('night','Join the night crew',{cash:18000,health:-1},'You worked nights until the last truck. Your mother boiled herbs for your cough.'),
  o('boiler','Ask to learn the boilers',{skills:{iq:1,drive:1}},'The boiler man taught you the gauges one season at a time.')]),
 scene('west_sampan','family',10,16,all(at('ratchaburi'),of('low_class'),withMother,share('sampan',.6),from(1981)),'Paddling the sampan',
  'Your mother sells fruit from a small wooden sampan on the canals, in a blue shirt and a straw hat. The market is busiest from seven to nine. She asks you to paddle while she sells.',[
  o('paddle','Paddle for her',{skills:{physique:1}},'You learned to hold the boat still in a crowd of boats. Your mother sold out by nine.'),
  o('school','Go to school',{skills:{iq:1},wellbeing:-1},'You went to school. Your mother paddled and sold at once, and sold less.'),
  o('sell','Sell while she paddles',{skills:{eq:1},cash:300},'You called out the prices. A visitor bought a whole bunch of bananas because you smiled.')]),
 // South: Pattani's fishing harbour and Ranong's estuary port.
 scene('south_harbour','work',14,20,all(at('pattani'),of('low_class'),withFather,withMother,s=>sex(s)==='male'),'One short on the crew',
  'Your father\'s boat goes out before dawn from the harbour. The crew is one short this season. Your mother wants you to finish school.',[
  o('school','Finish school',{skills:{iq:1}},'You finished school. Your father took a neighbour\'s son on the crew.'),
  o('crew','Go out on the boat',{cash:9000,health:-1,skills:{physique:1}},'You learned to sleep on the deck between hauls. Your mother kept your school uniform folded.'),
  o('nets','Mend the nets ashore',{skills:{craft:1}},'You mended nets on the harbour wall. Your father said your knots held better than his.')]),
 scene('south_port','work',20,35,all(at('ranong'),of('working_class')),'The ferry to Kawthaung',
  'At the Pak Chan estuary the ferries cross to Kawthaung all day. The port needs hands to load fishing boats at night. Your neighbour, who runs a ferry, offers you the morning crossings instead.',[
  o('keep','Keep your own work',{},'You kept your own work. Your neighbour found another hand for the mornings.'),
  o('night','Load boats at night',{cash:14000,health:-1},'You loaded ice and crates until the tide turned. You slept through the day.'),
  o('ferry','Take the morning crossings',{skills:{eq:1},cash:6000},'You learned the river\'s mud banks by heart. Your neighbour let you take the boat out alone by the end of the year.')]),
 // Central: Ko Kret's earthenware and Ang Thong's court dolls.
 scene('central_pottery','family',10,16,all(at('nonthaburi'),of('working_class'),withMother,share('pottery',.3),from(1985)),'Pots drying in the shade',
  'Your mother throws earthenware pots on a wheel on Ko Kret. They dry in rows in the shade before they go into the kiln. She asks you to carve the pattern round the necks.',[
  o('carve','Carve the pattern',{skills:{craft:1}},'Your first necks were crooked. Your mother sold them anyway, cheaper.'),
  o('river','Swim in the river with your friends',{wellbeing:1},'You swam until dark. Your mother carved every neck herself.'),
  o('landing','Sell at the boat landing',{skills:{eq:1},cash:400},'You sold small pots to visitors off the boats. You learned to say the price in three languages.')]),
 scene('central_dolls','family',12,18,all(at('ang-thong'),of('working_class'),share('dolls',.2),from(1976)),'Two hundred dolls by the end of the month',
  'Your aunt makes small moulded clay dolls of village life and paints them by hand. An order has come in for two hundred by the end of the month. She asks you to paint the faces.',[
  o('paint','Paint the faces',{skills:{craft:1,eq:1}},'Your first faces looked surprised. By the fortieth they looked calm.'),
  o('school','Keep to your schoolwork',{skills:{iq:1}},'You kept to your books. Your aunt painted until her eyes watered.'),
  o('pack','Count and pack the order',{skills:{iq:1},wellbeing:-1},'You wrapped every doll in newspaper and counted twice. Not one arrived broken.')])
];
