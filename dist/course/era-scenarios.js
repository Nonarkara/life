// The literature-grounded scenario bank, as engine data.
//
// The bank lives in ERA-SCENARIO-BANK.md: 36 scenes drawn from Kukrit Pramoj's
// Four Reigns, the village stories of Many Lives, the wartime story Mom, and
// Letters from Thailand. Every row there is marked R (read directly), S
// (summary only) or I (inferred). That mark is kept here, per scene, because
// the engine has to be able to tell the truth about where a scene came from.
//
// Three rules this file obeys, because the book demands them:
//
//   1. Fiction is texture, not evidence. A scene here is an authored situation
//      in a composite life. It is never presented as a record of a real
//      person's life, and no living or real person is placed in it.
//   2. A scene may only ship once a native Thai reader has judged its Thai
//      copy. Until then it sits in the bank and the engine never offers it.
//      Inferred rows additionally need their source checked before any of it
//      is stated as historical fact.
//   3. An era window says which calendar years a situation belonged to. The
//      player meets it only when the year they are living through falls in
//      that window, so a 1940s scene cannot happen to someone born in 1981.
//
// The grammar the bank sets out is in the data, not in prose:
//   - every scene carries one small object (`object`);
//   - every option names a cost on a person (`cost`), never a moral;
//   - the painful beat is often the unsaid sentence (`unsay`), which the
//     player's choice decides;
//   - some scenes price a life (`price`), and show who bears it;
//   - `later` is the same thread returning decades later in another shape.
//
// Effects are authored game design, not forecasts of what a 1930s life did.
import {birthYearOf} from './thai-history.js';

// A calendar window: the years in which this situation is plausible for a
// player living in Thailand. It is NOT the year the source was written — a
// scene drawn from a reign of Four Reigns is a household situation, and
// households like it kept happening in provincial Thailand for decades after.
//
//   basis 'stated'  - the source names the period, and the situation is
//                     bound to it (a wartime alarm, a motorcar in the 1910s)
//   basis 'rural'   - a rural Thai situation, documented across a wide span
//   basis 'approx'   - authored approximation: texture, not a claim
const W=(from,to,basis)=>({from,to,basis});
const RURAL=W(1930,1985,'rural');    // provincial Thai household life
const WIDE=W(1930,2000,'rural');     // and the same shapes in the late century
const APPROX=W(1930,1990,'approx');
const STATED_WAR=W(1940,1948,'stated');
const STATED_CAR=W(1930,1975,'stated');

const opt=(id,label,cost,effects,outcome,later=[])=>({id,label,cost,...effects,outcome,later});
const L=(after,effects,text,when)=>({after,...effects,text,when});

// The bank. Order is the bank's order: childhood, youth, adult life,
// parenthood and the household, then illness, war and prices.
export const ERA_SCENARIOS=[
 // ---- Childhood ------------------------------------------------------------
 {id:'sc_landing',title:'The landing',source:'R',sourceNote:'Four Reigns, reign 5 (1890s)',era:RURAL,
  ages:[6,14],object:'A bag of stolen sweets',price:null,unsay:'Neither child can say anything.',
  prompt:'A household splits. Your mother leaves at night with you. At the landing a friend presses stolen sweets into your hand; a boy clings to a post and will not let go.',
  context:'The boat leaves whether or not anyone says goodbye.',
  options:[
   opt('promise','Promise to return','You will not come back for years, and you will say so anyway.',{wellbeing:1,skills:{eq:1}},'You promised to return. The promise was made at a landing and cost nothing yet.'),
   opt('silent','Say nothing','The silence is yours to carry, and nobody will ask you about it.',{wellbeing:-1,skills:{iq:1}},'You said nothing. It is still the loudest thing about that night.'),
   opt('gift','Take the sweets and do not look back','The sweets are a gift and a theft at the same time. You take them.',{cash:200,wellbeing:1},'You took the sweets and did not look back. They were sweet. That is what you remember.') ]},
 {id:'sc_father_silence',title:'The father’s silence',source:'R',sourceNote:'Four Reigns, reign 5',era:RURAL,
  ages:[8,16],object:'A father’s face, and nothing said',price:null,unsay:'His silence is the goodbye.',
  prompt:'You are leaving the house. Your father studies your face and says nothing at all.',
  context:'There is time to say one thing.',
  options:[
   opt('speak','Speak out of turn','Whatever you say, you will not hear the answer you wanted.',{wellbeing:-1,skills:{eq:1}},'You spoke out of turn. He did not answer, and neither of you mentioned it again.'),
   opt('crawl','Crawl away quietly','You leave without a word, and the word stays in the room.',{wellbeing:1,skills:{iq:1}},'You crawled away quietly. The silence he left was the goodbye.'),
   opt('blessing','Ask a half-sister for her blessing','You ask, and she gives you a curse in the same breath.',{wellbeing:-2,skills:{iq:1}},'You asked for a blessing and received a curse with it. You went anyway.') ]},
 {id:'sc_courtesy_name',title:'The way your name is called',source:'R',sourceNote:'Four Reigns, reign 5',era:RURAL,
  ages:[6,14],object:'A title in front of a name',price:null,unsay:'Rank arrives as the way your name is said.',
  prompt:'Children of the principal wife are called by a courtesy title before their name. You are not.',
  context:'The same school, the same classroom, a different way of being spoken to.',
  options:[
   opt('accept','Accept the difference','You take the name you are given and stop noticing the other one.',{wellbeing:-1,skills:{iq:1}},'You accepted the way you were called. It became ordinary quickly, which was the worst part.'),
   opt('ask','Ask for a change','You ask, and the asking itself is noticed.',{wellbeing:-1,skills:{eq:1}},'You asked for a change. It was noticed, and the asking mattered more than the answer.'),
   opt('ignore','Pretend not to hear','You go on as if the difference had not been said aloud.',{wellbeing:1,skills:{iq:1}},'You pretended not to hear. The silence you made was its own answer.') ]},
 {id:'sc_foundling',title:'The foundling',source:'R',sourceNote:'Many Lives',era:RURAL,
  ages:[18,40],object:'A basin',price:null,unsay:'She wants only that he not cry.',
  prompt:'Before dawn a widow hears a baby at the landing. She has a dry breast and no husband.',
  context:'The village will know by morning either way.',
  options:[
   opt('keep','Keep him','You feed him on nothing much, and you keep him anyway.',{cash:-2000,wellbeing:2,skills:{eq:1}},'You kept the child. You fed him on what you had, and you wanted only that he not cry.'),
   opt('headman','Hand him to the headman','Someone official will take him. You will not know where.',{wellbeing:-3,skills:{iq:1}},'You handed him to the headman. You did not learn where he went, and you did not ask.'),
   opt('neighbours','Ask the neighbours','You ask, and the village decides together, which is slower and harder.',{wellbeing:-1,skills:{eq:1}},'You asked the neighbours. They decided together, slowly, and you were part of it.') ]},
 {id:'sc_fifty_baht',title:'Fifty baht',source:'R',sourceNote:'Many Lives (early 20th century)',era:W(1930,1975,'rural'),
  ages:[8,12],object:'Fifty baht, counted out',price:'Fifty baht, and a nine-year-old’s place in a richer house.',unsay:'Nobody knows her name.',
  prompt:'Your mother cannot feed everyone. A richer household offers fifty baht for you, and a place to sleep.',
  context:'It is an ordinary arrangement in the village, which is what makes it hard.',
  options:[
   opt('sell','Take the fifty baht','Your mother’s hands stop shaking for a week. You sit on the porch edge, too afraid to follow.',{cash:1500,wellbeing:-4,skills:{iq:1}},'You were placed in a richer house for fifty baht. You sat on the porch edge and did not follow.'),
   opt('keep','Keep her, and go hungry together','Nobody eats enough, and nobody says so.',{wellbeing:2,skills:{eq:1}},'You kept your place at your mother’s side. There was not enough food, and nobody said so.'),
   opt('relative','Send her to a relative','She will be fed. She will not be yours.',{wellbeing:-2,skills:{iq:1}},'She was sent to a relative. She was fed. She was not yours.') ]},
 {id:'sc_ice_cream',title:'Sell ice cream, or stay in school',source:'S',sourceNote:'Summary of a 1970s account',era:W(1965,1985,'stated'),
  ages:[11,15],object:'A cart of ice cream',price:null,unsay:'Pride and shame in one afternoon.',
  prompt:'Your family cannot feed everyone who is at the table. A cousin offers you a place selling ice cream from a cart. School is not free.',
  context:'Either way, somebody at your table goes without.',
  options:[
   opt('sell','Take the cart','You earn from tomorrow. A sibling does not eat this week.',{cash:3000,wellbeing:-2,skills:{drive:1,craft:1}},'You sold ice cream to keep the table going. You earned, and somebody else went without.'),
   opt('school','Stay in school','The family finds another way, or does not. Your books stay with you.',{wellbeing:1,skills:{iq:1}},'You stayed in school. The family found a way that did not involve you, or did not find one.'),
   opt('part','Do both badly','You try to keep school and the cart, and you keep neither well.',{health:-2,wellbeing:-1,skills:{iq:1}},'You tried to do both, and did both badly. The books slipped and the takings suffered.') ]},
 {id:'sc_dog_gate',title:'The dog at the gate',source:'R',sourceNote:'Mom (wartime)',era:W(1945,1990,'rural'),
  ages:[10,30],object:'A dog that waits each evening',price:null,unsay:'The dog answers a voice it no longer knows.',
  prompt:'The man of the house has been away a long time. The dog waits at the gate every evening anyway.',
  context:'The household has to decide what it can still afford.',
  options:[
   opt('gold','Sell the gold','The household has money. The dog does not have a chain of its own.',{cash:6000,wellbeing:-2,skills:{iq:1}},'You sold the gold. The household had money, and the dog went with whoever called it.'),
   opt('sewing','Take in sewing','Everyone works later, and the dog stays.',{cash:1500,health:-1,wellbeing:1,skills:{craft:1}},'You took in sewing. Everyone worked later into the night, and the dog stayed.'),
   opt('kin','Move to kin','You go to your kin’s house with what you carry and what you cannot.',{wellbeing:-1,skills:{eq:1}},'You moved to kin with what you could carry. The dog followed the sound of the cart, and then it did not.') ]},
 // ---- Youth ----------------------------------------------------------------
 {id:'sc_leaving_city',title:'Leaving for the city',source:'I',sourceNote:'Inferred; needs a Thai literary reader',era:W(1955,1990,'approx'),
  ages:[16,24],object:'A bus ticket',price:null,unsay:'The bus station, and nobody on the platform says anything.',
  prompt:'The family wants you to go to the city and send money back. The plot at home will not feed you either.',
  context:'Every version of this costs somebody a year of your life.',
  options:[
   opt('go','Go and send money','You go. The household is fed, and the plot goes to someone else.',{cash:-1000,wellbeing:1,skills:{drive:1}},'You went to the city and sent money home. The plot was worked by someone else.'),
   opt('stay','Stay on the failing plot','You stay. The money does not come, and you are needed.',{wellbeing:-1,skills:{craft:1}},'You stayed on the plot. The money did not come, and you were needed there.'),
   opt('study','Study, and cost the family now','You study. The household carries it without saying so.',{cash:-3000,wellbeing:1,skills:{iq:1}},'You studied, and the household carried the cost without ever mentioning it.') ]},
 {id:'sc_robes',title:'A mother asks you to leave the robes',source:'R',sourceNote:'Four Reigns, reign 5',era:RURAL,
  ages:[18,30],object:'A folded robe',price:null,unsay:'She goes home crying like a child.',
  prompt:'The night before your ordination your mother bathes you. Later, she asks you to come home to the farm, and to a wife.',
  context:'She asked once. She will not ask twice.',
  options:[
   opt('disrobe','Leave the robes','You go home to the farm. She asks what you have traded, and you do not answer.',{cash:2000,wellbeing:-1,skills:{eq:1}},'You left the robes and went home to the farm. She asked what you had traded, and you did not answer.'),
   opt('stay','Stay and send money','You stay in the robes and the money goes home every month.',{cash:-2000,wellbeing:2,skills:{iq:1}},'You stayed, and sent money home every month. It was not what she asked for, and it was not nothing.'),
   opt('bring','Bring her to live at the temple','She comes to the temple. The farm goes untended.',{wellbeing:1,skills:{eq:1}},'You brought her to live at the temple. The farm went untended, and she was there.') ]},
 {id:'sc_girl_cooled',title:'The girl who cooled',source:'R',sourceNote:'Four Reigns, reign 5',era:RURAL,
  ages:[18,28],object:'A lawsuit over a field of land',price:null,unsay:'She is polite.',
  prompt:'After a lawsuit over land, the childhood friend you meant to marry greets you like a stranger, and marries a richer son.',
  context:'The land made the decision. She has only to carry it out.',
  options:[
   opt('confront','Confront her','You say the true thing. It is true, and it changes nothing she has already chosen.',{wellbeing:-2,skills:{eq:1}},'You confronted her. It was true, and it changed nothing she had already decided.'),
   opt('letgo','Let it go','You say nothing, and you carry the loss quietly.',{wellbeing:-1,skills:{iq:1}},'You let it go. You carried it quietly, which is what she would have wanted.'),
   opt('wait','Wait','You wait, and the life goes on around you while you do.',{wellbeing:-1,skills:{drive:1}},'You waited. The life went on around you while you waited.') ]},
 {id:'sc_estate_quarrel',title:'The estate quarrel',source:'R',sourceNote:'Four Reigns, reign 5',era:RURAL,
  ages:[20,45],object:'A dividing line drawn on a field',price:null,unsay:'The mother weeps harder over the lawsuit than the funeral.',
  prompt:'Your father dies of fever. The relatives sue over what he left, and the lawsuit outlasts the mourning.',
  context:'The shares can be divided quickly or fought for. Both leave the mother poorer.',
  options:[
   opt('split','Split it fast','It is settled in a week, and the mother is left with a share and a silence.',{cash:3000,wellbeing:-2,skills:{iq:1}},'You split it fast. The mother was left with a share and a silence.'),
   opt('fight','Fight for it','You fight. It takes years, and the money goes on the fight.',{cash:-4000,wellbeing:-1,skills:{drive:1}},'You fought for it. It took years, and the money went on the fight.'),
   opt('give','Give it up','You hand your share over. The mother stops weeping, and something else starts.',{wellbeing:1,skills:{eq:1}},'You gave your share up. The mother stopped weeping over the lawsuit, and something else began.') ]},
 // ---- Adult life -----------------------------------------------------------
 {id:'sc_motorcar',title:'The motorcar and the horse',source:'R',sourceNote:'Four Reigns, reign 6 (1910s)',era:STATED_CAR,
  ages:[28,50],object:'A motorcar and a horse in the same yard',price:null,unsay:'Pride and fear arrive together.',
  prompt:'Your husband buys a new machine, and rides the horses harder than before.',
  context:'The household money has already been promised to the machine.',
  options:[
   opt('enjoy','Enjoy the new prestige','You ride in it, you are seen in it, and the horses are worked harder.',{wellbeing:2,skills:{drive:1}},'You enjoyed the prestige of it, and the horses were worked harder for it.'),
   opt('safety','Press on the safety of it','You raise the money for brakes and a slower driver. He hears you once.',{cash:-2000,wellbeing:-1,skills:{iq:1}},'You pressed on the safety of it. He heard you once, and then the horses were ridden harder anyway.'),
   opt('quiet','Keep quiet','You keep quiet, and the machine does what machines do.',{wellbeing:-2,skills:{iq:1}},'You kept quiet. The machine did what machines do, and you watched it happen.') ]},
 {id:'sc_husband_youth',title:'The husband who performs youth',source:'R',sourceNote:'Four Reigns, reign 6',era:RURAL,
  ages:[30,55],object:'Imported spirits and a younger wife',price:null,unsay:'You watch him age while he plays young.',
  prompt:'A promotion changes how your husband wants to be addressed. He drinks imported spirits and jokes about a younger wife.',
  context:'The court setting is gone; the marriage is not.',
  options:[
   opt('indulge','Indulge him','You laugh with him. It is funny, and it is not.',{wellbeing:-1,skills:{eq:1}},'You indulged him. It was funny, and it was not.'),
   opt('object','Say what you see','You name it. He hears you and does not change.',{wellbeing:-2,skills:{eq:1}},'You said what you saw. He heard you and did not change.'),
   opt('ignore','Pretend not to hear','You let it pass, and you watch him age.',{wellbeing:-3,skills:{iq:1}},'You pretended not to hear, and you watched him age while he played young.') ]},
 {id:'sc_sister_turns_up',title:'The sister who turns up',source:'R',sourceNote:'Four Reigns, reign 6',era:RURAL,
  ages:[25,50],object:'A paper parcel of remedies',price:null,unsay:'She says childlessness is just as well; they are too poor.',
  prompt:'After years away, your sister turns up. She is thinner. Her hands are thick at the knuckles. She has brought a paper parcel of remedies.',
  context:'She is not asking for anything, which is the difficult part.',
  options:[
   opt('money','Press money on her','She takes a little. It is a transaction, and you have made it one.',{cash:-2000,wellbeing:-1,skills:{iq:1}},'You pressed money on her. She took a little, and it became a transaction.'),
   opt('room','Offer her a room','You offer a room. It is a real cost and a real kindness.',{cash:-1000,wellbeing:2,skills:{eq:1}},'You offered her a room. It cost something every month, and she was not alone.'),
   opt('medicine','Take only the medicine','You take the parcel and nothing else. The distance stays exactly where it was.',{wellbeing:-1,skills:{iq:1}},'You took only the medicine. The distance stayed exactly where it was.') ]},
 {id:'sc_love_secret',title:'Love paid in secret',source:'R',sourceNote:'Four Reigns, reign 6',era:RURAL,
  ages:[28,55],object:'A bill paid without a name',price:null,unsay:'His pride would not accept it, and hers would not stop paying.',
  prompt:'Your sister quietly pays the household costs, because her husband is too proud to accept money.',
  context:'The money arrives with no explanation and no address.',
  options:[
   opt('hide','Let it stay secret','You say nothing, so she keeps paying, and she keeps not saying.',{wellbeing:-1,skills:{iq:1}},'You let it stay secret. She kept paying, and she kept not saying.'),
   opt('admit','Admit you know','You name it, out loud, and she stops.',{wellbeing:1,skills:{eq:1}},'You admitted you knew. She stopped, and the household had to find the money somewhere else.'),
   opt('stop','Stop her','You find a way to pay it yourself. It takes most of what you have.',{cash:-3000,wellbeing:1,skills:{drive:1}},'You stopped her. You found the money yourself, and it took most of what you had.') ]},
 {id:'sc_midwife',title:'Midwife or doctor',source:'R',sourceNote:'Four Reigns, reign 7',era:RURAL,
  ages:[20,40],object:'A basin and a fire',price:null,unsay:'You fear the pain is telling you it is a girl.',
  prompt:'In labour, the old midwife and a fire against a foreign doctor with instruments and a bill.',
  context:'Both will try. Only one of them has a price you can name.',
  options:[
   opt('doctor','Take the doctor','The instruments are better and the bill is real.',{cash:-8000,health:3,wellbeing:1,skills:{iq:1}},'You took the doctor. The instruments were better and the bill was real.'),
   opt('midwife','Keep the midwife','She has done this before, and she lives down the road.',{health:-2,wellbeing:1,skills:{eq:1}},'You kept the midwife. She had done this before, and she lived down the road.'),
   opt('ask','Ask your husband','You ask him, and you hand him the worst decision of the night.',{wellbeing:-2,skills:{eq:1}},'You asked your husband, and you handed him the worst decision of the night.') ]},
 {id:'sc_daughter_prayed',title:'The daughter you prayed for',source:'R',sourceNote:'Four Reigns, reign 7',era:RURAL,
  ages:[22,38],object:'A name chosen and not said',price:null,unsay:'She tells no one.',
  prompt:'Third pregnancy. A name is already chosen, and you have told no one.',
  context:'Hope and arithmetic are in the same room, and the room is small.',
  options:[
   opt('hope','Keep hoping','You keep hoping, and you keep the name to yourself.',{wellbeing:2,skills:{eq:1}},'You kept hoping, and you kept the name to yourself.'),
   opt('boyname','Prepare a boy’s name','You prepare a boy’s name, in case.',{wellbeing:-1,skills:{iq:1}},'You prepared a boy’s name, in case. You did not say it aloud.'),
   opt('say','Say it to someone','You say the name to your mother, who has opinions.',{wellbeing:1,skills:{eq:1}},'You said the name to your mother, who had opinions about it.') ]},
 {id:'sc_letter_home',title:'The letter home',source:'S',sourceNote:'Summary of Letters from Thailand',era:W(1965,1995,'stated'),
  ages:[18,50],object:'A letter that takes two weeks to arrive',price:null,unsay:'Silence is also a letter.',
  prompt:'You are working far from home. Your mother wants to know whether you are all right. The next letter leaves tonight.',
  context:'What you write becomes what she knows for two weeks.',
  options:[
   opt('well','Say all is well','She reads it and believes it, and keeps a worry she cannot put down.',{wellbeing:1,skills:{iq:1}},'You said all was well. She believed you, and kept a worry she could not put down.'),
   opt('truth','Tell her the truth','She knows what is true, and now she knows it is true.',{wellbeing:-1,skills:{eq:1}},'You told her the truth. She knew what was true, and now she knew it was true.'),
   opt('money','Send only money','Money says nothing and says everything. You send it with no letter.',{cash:-1500,wellbeing:1,skills:{drive:1}},'You sent only money. It said nothing, and it said everything, and she read it wrong.') ]},
 {id:'sc_pills',title:'The pills',source:'R',sourceNote:'Four Reigns, reign 7',era:RURAL,
  ages:[12,30],object:'A shop, and harsh pills',price:null,unsay:'She tells the boy to look for himself in her legs.',
  prompt:'A shop widow takes harsh pills rather than see a doctor, because of shame.',
  context:'She is the one who is ill, and she is the one managing it.',
  options:[
   opt('doctor','Fetch a doctor against her will','You bring a doctor she did not ask for, and she is seen.',{cash:-1500,wellbeing:-1,skills:{drive:1}},'You fetched a doctor against her will. She was seen, and she was seen without her consent.'),
   opt('secret','Keep her secret','You keep it. Her plan for the pain is her own.',{wellbeing:-2,skills:{iq:1}},'You kept her secret. Her plan for the pain was her own, and it was not a good one.'),
   opt('daughter','Ask her daughter','You tell her daughter, and the secret becomes a family matter.',{wellbeing:1,skills:{eq:1}},'You asked her daughter. The secret became a family matter, which was its own kind of cost.') ]},
 // ---- Parenthood and the household ------------------------------------------
 {id:'sc_son_gives_all',title:'The son who gives every coin away',source:'R',sourceNote:'Four Reigns',era:W(1950,2000,'rural'),
  ages:[55,75],object:'A son home after ten years, and no work',price:null,unsay:'You want him home forever, and you must plan his future.',
  prompt:'Your son is home after ten years abroad. He is idle and generous, and his money goes to everyone else.',
  context:'Generosity like this has to end somewhere.',
  options:[
   opt('work','Push him to work','He goes to work, and he goes without the things he gave away.',{wellbeing:-1,skills:{drive:1}},'You pushed him to work. He went, and he went without the things he used to give away.'),
   opt('indulge','Indulge him','You let it go on. The money goes, and the house gets quieter.',{cash:-5000,wellbeing:1,skills:{eq:1}},'You indulged him. The money went, and the house got quieter.'),
   opt('ask','Ask what he wants','You ask him, and you find out what he has been carrying.',{wellbeing:2,skills:{eq:1}},'You asked what he wanted, and you found out what he had been carrying.') ]},
 {id:'sc_only_wants_child',title:'He only wants to be your child',source:'R',sourceNote:'Four Reigns',era:WIDE,
  ages:[50,75],object:'A grown child who will not leave',price:null,unsay:'Your love is what keeps him still.',
  prompt:'Your child is grown and still lives with you. You do not know how to ask him to go, and you do not want to.',
  context:'This is a good thing that has no exit.',
  options:[
   opt('stand','Let it stand','You let it stand, and you make room for it for as long as it lasts.',{wellbeing:2,skills:{eq:1}},'You let it stand. You made room for it, for as long as it lasted.'),
   opt('refuse','Refuse to keep him','You refuse, and the house changes shape in a week.',{wellbeing:-2,skills:{iq:1}},'You refused, and the house changed shape inside a week.'),
   opt('bargain','Make a bargain','You bargain with him, and you both pretend it was an idea you both had.',{wellbeing:1,skills:{eq:1}},'You made a bargain with him, and you both pretended it was an idea you had both had.') ]},
 // ---- Illness, war and prices ----------------------------------------------
 {id:'sc_drug_list',title:'The drug list',source:'R',sourceNote:'Four Reigns, reign 7 (1945)',era:W(1945,1990,'stated'),
  ages:[18,50],object:'A list of medicine that cannot be found',price:'Every baht the household has, and some it does not.',unsay:'He sobs while she calculates.',
  prompt:'The doctor names medicines that cannot be found in this country. Your mother is ill, and the list is in your hand.',
  context:'Every shop you try is a shop that does not have it.',
  options:[
   opt('hunt','Search every source','You go everywhere. It costs what you have and it takes a long time.',{cash:-6000,health:1,wellbeing:-1,skills:{drive:1}},'You searched every source. It took most of what you had, and most of a year, and the list got shorter.',[L(30,{wellbeing:-1},'Decades later, the same list is on the table again, and your hand goes to the same place.')]),
   opt('accept','Accept that this is the cost','You stop looking. You stay with her instead.',{wellbeing:-2,skills:{eq:1}},'You accepted that this was the cost, and stopped looking, and stayed with her instead.'),
   opt('sell','Sell something','You sell something real to buy something real.',{cash:4000,wellbeing:-1,skills:{iq:1}},'You sold something to buy something. The thing you sold is not in the house any more.') ]},
 {id:'sc_not_worth_that',title:'“My life is not worth that.”',source:'R',sourceNote:'Four Reigns',era:APPROX,
  ages:[30,60],object:'A sum done out loud',price:'The price of the medicine, and who is asked to carry it.',unsay:'She calculates so that you will not.',
  prompt:'Your mother is ill. The medicine costs more than the house is worth. She does the sum out loud, so that you will not spend it on her.',
  context:'She is telling you the truth about your life, and about hers.',
  options:[
   opt('spend','Spend anyway','You spend it. She is alive, and the money and the years are gone.',{cash:-20000,health:4,wellbeing:1,skills:{eq:1}},'You spent it anyway. She was alive, and the money and the years were gone.',[L(25,{wellbeing:-2},'Twenty-five years on, you still do the sum out loud before you let yourself want anything.')]),
   opt('honour','Honour her wish','You do not spend it. You keep the money, and you keep the sentence.',{wellbeing:-4,skills:{iq:1}},'You honoured her wish. You kept the money, and you kept the sentence.'),
   opt('cheaper','Hunt for something cheaper','You look for a cheaper way, and you look for a long time.',{cash:-4000,health:2,wellbeing:-1,skills:{iq:1}},'You hunted for something cheaper for a long time, and found some of it.') ]},
 {id:'sc_relative_market',title:'A relative sells at market price',source:'R',sourceNote:'Four Reigns',era:WIDE,
  ages:[30,60],object:'A market price between relatives',price:null,unsay:'Kinship does not buy a discount.',
  prompt:'A relative of yours is selling. The price is the market price, and you are a relative.',
  context:'The scale is the same scale everyone else uses.',
  options:[
   opt('buy','Buy at the market price','You pay the market price, and you buy without asking for anything else.',{cash:-3000,wellbeing:1,skills:{iq:1}},'You paid the market price and bought without asking for anything else.'),
   opt('refuse','Refuse and buy elsewhere','You buy elsewhere, at the same price, with more of your life spent on it.',{cash:-3000,wellbeing:-1,skills:{drive:1}},'You bought elsewhere, at the same price, with more of your life spent on it.'),
   opt('confront','Confront them about it','You ask them to name the price again, in front of the others.',{wellbeing:-2,skills:{eq:1}},'You asked them to name the price again, in front of the others.') ]},
 {id:'sc_refuse_cheat',title:'Refusing to cheat',source:'R',sourceNote:'Four Reigns',era:WIDE,
  ages:[25,55],object:'A shortcut with a name on it',price:null,unsay:'She stays honest because someone else would pay.',
  prompt:'There is a shortcut. It would pass the cost to people who are not in this room.',
  context:'Nobody will find out. That is what makes it a shortcut and not a fraud.',
  options:[
   opt('cheat','Take the shortcut','It works. It works exactly as well as it was supposed to.',{cash:8000,wellbeing:-1,skills:{drive:1}},'You took the shortcut. It worked, exactly as well as it was supposed to.'),
   opt('refuse','Refuse','You refuse, and you carry what that costs.',{cash:-2000,wellbeing:2,skills:{iq:1}},'You refused, and you carried what it cost.'),
   opt('half','Take half of it','You take a smaller share of the cheat. It is still a cheat, and it is smaller.',{cash:3000,wellbeing:-1,skills:{iq:1}},'You took half of it. It was still a cheat, and it was smaller.') ]},
 {id:'sc_night_alarm',title:'Night alarm',source:'R',sourceNote:'Mom (wartime)',era:STATED_WAR,
  ages:[6,18],object:'A dug shelter and a warning siren',price:null,unsay:'The one night you do not move is the night it matters.',
  prompt:'Planes come over at night. The household digs in every night. Tonight you are tired.',
  context:'The rule is the rule, and nobody makes an exception.',
  options:[
   opt('obey','Go out and dig in','You lose sleep every night, and you are in the shelter when it matters.',{health:-2,wellbeing:1,skills:{eq:1}},'You dug in every night. You lost sleep, and you were in the shelter when it mattered.'),
   opt('sleep','Sleep where you are','You stay in the bed for one night, and one night is enough to matter.',{health:1,wellbeing:-2},'You slept where you were, for one night. One night was enough to matter.'),
   opt('send','Send the child away','You send the child to someone else’s shelter. You stay.',{wellbeing:-2,skills:{iq:1}},'You sent the child to someone else’s shelter and you stayed.') ]},
];

export const scenarioById=id=>ERA_SCENARIOS.find(s=>s.id===id);

// Which part of life a scene touches, so the badge on the card is honest.
// The category is not a moral ranking; it says where the moment lands.
const CATEGORY={
 sc_landing:'family',sc_father_silence:'family',sc_courtesy_name:'family',
 sc_foundling:'family',sc_fifty_baht:'family',sc_ice_cream:'school',
 sc_dog_gate:'family',sc_leaving_city:'work',sc_robes:'family',
 sc_girl_cooled:'connection',sc_estate_quarrel:'family',sc_motorcar:'connection',
 sc_husband_youth:'connection',sc_sister_turns_up:'connection',sc_love_secret:'family',
 sc_midwife:'health',sc_daughter_prayed:'family',sc_letter_home:'connection',
 sc_pills:'health',sc_son_gives_all:'family',sc_only_wants_child:'family',
 sc_drug_list:'health',sc_not_worth_that:'health',sc_relative_market:'family',
 sc_refuse_cheat:'work',sc_night_alarm:'family',
};

// The scenes whose copy is written and ready to ship.
//
// Honest about what this gate is and is not. The project's own rule is that
// five-language editorial text ships while native-reader certification is
// still outstanding (STYLE.md), so this list means "the copy exists and the
// scene has been written against its source", not "a Thai reader has signed
// this off". The scenes outside it stay in the bank, visible in this file and
// unreachable in the game, until their copy is written.
//
// The inferred scene (sc_leaving_city) is deliberately not in it: an inferred
// row needs its source checked before it is shown at all.
export const SHIPPED_SCENARIOS=Object.freeze([
 'sc_letter_home','sc_not_worth_that','sc_drug_list','sc_midwife','sc_girl_cooled',
]);
const shippable=new Set(SHIPPED_SCENARIOS);

// The scenes that are written but whose copy is still owed, so the gap is
// named rather than hidden.
export const PENDING_SCENARIOS=Object.freeze(
 ERA_SCENARIOS.map(s=>s.id).filter(id=>!shippable.has(id)));

// The source key of a scene, and what it means. The engine never states an
// inferred scene as a historical fact; it shows the key instead.
export const SOURCE_MEANING=Object.freeze({
 R:'read directly from the source text',
 S:'known from a summary of the source, not the full text',
 I:'inferred; not yet checked against a source',
});

// The source a scene was written against, as a phrase that can be translated.
export const SOURCE_LABEL=Object.freeze({
 'Four Reigns, reign 5':'Four Reigns, the fifth reign',
 'Four Reigns, reign 5 (1890s)':'Four Reigns, the fifth reign (the 1890s)',
 'Four Reigns, reign 6':'Four Reigns, the sixth reign',
 'Four Reigns, reign 6 (1910s)':'Four Reigns, the sixth reign (the 1910s)',
 'Four Reigns, reign 7':'Four Reigns, the seventh reign',
 'Four Reigns, reign 7 (1945)':'Four Reigns, the seventh reign (1945)',
 'Four Reigns':'Four Reigns',
 'Many Lives':'Many Lives',
 'Many Lives (early 20th century)':'Many Lives (the early 20th century)',
 'Summary of Letters from Thailand':'a summary of Letters from Thailand',
 'Summary of a 1970s account':'a summary of a 1970s account',
 'Mom (wartime)':'Mom (the wartime story)',
 'Inferred; needs a Thai literary reader':'inferred; it still needs a Thai literary reader',
});
export const sourceLabel=note=>SOURCE_LABEL[note]??note;

// The calendar year a player is living through.
export function calendarYear(state,age=state?.age??0){
 const by=birthYearOf(state);
 return by===null?null:by+Math.floor(age);
}

// Whether a life is a Thai life. The country code is stored lower case.
const thai=state=>(state?.intake?.country??state?.birth?.country??'').toLowerCase()==='th';

// Whether the player is in the years a scene belongs to.
function inEra(scene,year){
 if(year===null)return false;
 return year>=scene.era.from&&year<=scene.era.to;
}

// The scenarios this player could meet now. A scene is offered when the year
// fits, the age fits, the player is in Thailand, and the scene has been read
// by a Thai reader.
export function eraScenariosFor(state,age=state?.age??0){
 if(!thai(state))return [];
 const year=calendarYear(state,age);
 if(year===null)return [];
 const seen=new Set((state.story?.seen??[]).map(e=>e.id));
 return ERA_SCENARIOS.filter(scene=>shippable.has(scene.id)
  &&!seen.has(scene.id)
  &&age>=scene.ages[0]&&age<=scene.ages[1]
  &&inEra(scene,year));
}

// The encounter shape the rest of the game already knows how to run: an
// id, a window, an eligibility test, options with costs and outcomes, and
// `later` for the echo. The scene's own prompt and context are used as-is;
// the small object is carried in the prompt so it is the thing the player sees.
export function scenarioAsEncounter(scene){
 return {
  id:scene.id,
  category:CATEGORY[scene.id]??'family',
  title:scene.title,
  prompt:scene.prompt,
  context:scene.context,
  min:scene.ages[0],
  max:scene.ages[1],
  era:scene.era,
  sourceKey:scene.source,
  sourceNote:scene.sourceNote,
  object:scene.object,
  unsay:scene.unsay,
  price:scene.price,
  priority:2,
  lesson:'The people in this scene are not real people. The shape of the situation is real; the names are not.',
  options:scene.options.map(o=>({...o,namedCost:o.cost})),
  // The scene is only offered in the years it belongs to.
  eligible:state=>{
   if(!thai(state))return false;
   const year=calendarYear(state,state.age);
   return year!==null&&year>=scene.era.from&&year<=scene.era.to;
  },
 };
}

// Every scene as an encounter, ready to join the encounter pool.
export const ERA_ENCOUNTERS=ERA_SCENARIOS
 .filter(scene=>shippable.has(scene.id))
 .map(scenarioAsEncounter);
