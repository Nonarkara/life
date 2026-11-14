// Places a life can begin in or move to. Pay and cost factors are authored game
// tuning, not wage or price statistics. Every region reuses the shared world
// coordinates; institutions are metaphorical neighbours, not a real map.
const WIDE=['#5a3a26','#7c5036','#9b6a48','#b5855f','#d2a47c','#e6c3a0','#f0d5bd'];
const THAI=['#7c5036','#9b6a48','#b5855f','#c99a70','#d8ad84','#e4c09a','#a87754'];
export const REGIONS={
 'samut-prakan':{country:'TH',place:'Samut Prakan',home:'a market-stall household',class:['working_class','middle_class'],style:'market',sign:'th',pay:1,cost:1,skin:THAI,hair:['#1f2622','#2a2620'],look:{ground:'#849573',water:'#5b7f80',wall:'#e5d9b9',floor:'#a58d69',roof:'#99634f'}},
 'nakhon-sawan':{country:'TH',place:'Nakhon Sawan',home:'a rice-farming household',class:['low_class','working_class'],style:'village',sign:'th',pay:.9,cost:.85,skin:THAI,hair:['#1f2622'],look:{ground:'#8a9a6c',water:'#5b7f80',wall:'#e1d3ad',floor:'#a08560',roof:'#9a6a48'}},
 'khlong-toei':{country:'TH',place:'Khlong Toei, Bangkok',home:'a household in a riverside community',class:['low_class'],style:'slum',sign:'th',pay:1.05,cost:.8,skin:THAI,hair:['#1f2622','#2a2620'],look:{ground:'#8b8676',water:'#4f6d68',wall:'#8e9ca0',floor:'#8a7457',roof:'#7d8a8c'}},
 'isan-village':{country:'TH',place:'Ban Non Sawang, Khon Kaen',home:'a rice-farming household',class:['low_class','working_class'],style:'village',sign:'th',pay:.75,cost:.7,skin:THAI,hair:['#1f2622'],look:{ground:'#9aa86a',water:'#6a8a7f',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 'bang-na':{country:'TH',place:'Bang Na, Bangkok',home:'a household in an apartment block',class:['middle_class','bureaucratic_class'],style:'condo',sign:'th',pay:1.15,cost:1.2,skin:THAI,hair:['#1f2622','#2a2620','#3a2c22'],look:{ground:'#9a9a8c',water:'#5b7a80',wall:'#d9d6cc',floor:'#b9ab92',roof:'#8f948f'}},
 'pak-phanang':{country:'TH',place:'Pak Phanang, Nakhon Si Thammarat',home:'a fishing household',class:['working_class','middle_class'],style:'coast',sign:'th',pay:.85,cost:.8,skin:THAI,hair:['#1f2622'],look:{ground:'#c2b48a',water:'#3f7f8a',wall:'#9fb7b5',floor:'#9c8262',roof:'#a45b45'}},
 'hua-hin':{country:'TH',place:'Hua Hin, Prachuap Khiri Khan',home:'a household in a wooden bungalow by the sea',class:['bureaucratic_class','middle_class'],style:'beach',sign:'th',pay:.95,cost:1,skin:THAI,hair:['#1f2622','#2a2620'],look:{ground:'#b8ad86',water:'#3f8090',wall:'#c9b48e',floor:'#a88c66',roof:'#8a5a44'}},
 'udon-thani':{country:'TH',place:'Udon Thani',home:'a household in a town shophouse row',class:['working_class','middle_class'],style:'market',sign:'th',pay:.85,cost:.85,skin:THAI,hair:['#1f2622'],look:{ground:'#9c9a72',water:'#4a7a8c',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 'pathum-wan':{country:'TH',place:'Pathum Wan, Bangkok',home:'a household in a Pathum Wan shophouse row',class:['middle_class','working_class'],style:'market',sign:'th',pay:1.15,cost:1.15,skin:THAI,hair:['#1f2622','#2a2620','#3a2c22'],look:{ground:'#8f9282',water:'#56767a',wall:'#e2dccd',floor:'#ad9a7c',roof:'#8a857a'}},
 'sukhumvit':{country:'TH',place:'Sukhumvit, Bangkok',home:'a household in a large walled house',class:['high_class','middle_class'],style:'villa',sign:'th',pay:1.3,cost:1.6,skin:THAI,hair:['#1f2622','#2a2620','#3a2c22'],look:{ground:'#7f9a68',water:'#5b7f86',wall:'#f1ece0',floor:'#c9b28c',roof:'#5f6a6a'}},
 // The North (research/provinces/north.json). Each is the Lanna board plus its own landmark; style
 // decides the routines, so a town reads as 'market' and a valley farm as 'village'.
 'chiang-mai':{country:'TH',place:'Chiang Mai',home:'a craft-workshop household in the old walled city',class:['working_class','middle_class'],style:'market',lanna:true,sign:'th',pay:.9,cost:.9,skin:THAI,hair:['#1f2622','#2a2620'],look:{ground:'#879a6c',water:'#4f7a80',wall:'#d8c8a6',floor:'#9a7c58',roof:'#7d4a36'}},
 'chiang-rai':{country:'TH',place:'Chiang Rai',home:'a farming household on the northern slopes',class:['low_class','working_class'],style:'village',lanna:true,sign:'th',pay:.75,cost:.75,skin:THAI,hair:['#1f2622'],look:{ground:'#83996a',water:'#5a8088',wall:'#a5825a',floor:'#8f6e48',roof:'#7d4a36'}},
 lampang:{country:'TH',place:'Lampang',home:'a household near the ceramics works',class:['working_class'],style:'market',lanna:true,sign:'th',pay:.8,cost:.8,skin:THAI,hair:['#1f2622'],look:{ground:'#94986c',water:'#5b7f80',wall:'#dccab0',floor:'#9f8562',roof:'#86523c'}},
 lamphun:{country:'TH',place:'Lamphun',home:'a longan-orchard household in the Ping valley',class:['working_class','low_class'],style:'village',lanna:true,sign:'th',pay:.75,cost:.75,skin:THAI,hair:['#1f2622'],look:{ground:'#8a9c68',water:'#5b7f80',wall:'#9a7c5a',floor:'#8f6e48',roof:'#7d4a36'}},
 'mae-hong-son':{country:'TH',place:'Mae Hong Son',home:'a mountain-village household',class:['low_class','middle_class'],style:'village',lanna:true,sign:'th',pay:.7,cost:.7,skin:THAI,hair:['#1f2622'],look:{ground:'#7c9466',water:'#4f7a80',wall:'#8f6f4c',floor:'#8a6a46',roof:'#6f5a48'}},
 nan:{country:'TH',place:'Nan',home:'a farming household in the Nan valley',class:['low_class','bureaucratic_class'],style:'village',lanna:true,sign:'th',pay:.75,cost:.75,skin:THAI,hair:['#1f2622'],look:{ground:'#86996a',water:'#5a8088',wall:'#9a7c5a',floor:'#8f6e48',roof:'#7d4a36'}},
 phayao:{country:'TH',place:'Phayao',home:'a farming household by Kwan Phayao',class:['working_class'],style:'village',lanna:true,sign:'th',pay:.75,cost:.75,skin:THAI,hair:['#1f2622'],look:{ground:'#8a9c6c',water:'#4a7a8c',wall:'#a78a66',floor:'#8f6e48',roof:'#7d4a36'}},
 phrae:{country:'TH',place:'Phrae',home:'a household in a Phrae town house',class:['working_class'],style:'market',lanna:true,sign:'th',pay:.8,cost:.8,skin:THAI,hair:['#1f2622'],look:{ground:'#949a6c',water:'#5b7f80',wall:'#d8c8a6',floor:'#9a7c58',roof:'#7d4a36'}},
 uttaradit:{country:'TH',place:'Uttaradit',home:'a durian-orchard household in the Nan valley',class:['working_class'],style:'village',lanna:true,sign:'th',pay:.75,cost:.75,skin:THAI,hair:['#1f2622'],look:{ground:'#879a66',water:'#5a8088',wall:'#9a7c5a',floor:'#8f6e48',roof:'#7d4a36'}},
 // The Northeast (research/provinces/northeast.json). Isan Village (Khon Kaen) and Udon Thani were
 // already births; these are the other provinces, each the Isan board plus its own landmark.
 'amnat-charoen':{country:'TH',place:'Amnat Charoen',home:'a jasmine-rice farming household',class:['low_class', 'working_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#9ea86c',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 'bueng-kan':{country:'TH',place:'Bueng Kan',home:'a rubber-farming household beside the Mekong',class:['low_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#8fa268',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 buriram:{country:'TH',place:'Buriram',home:'a rice-farming household near Buriram town',class:['low_class', 'working_class'],style:'market',isan:true,sign:'th',pay:0.75,cost:0.75,skin:THAI,hair:['#1f2622'],look:{ground:'#a2a46e',water:'#5f8580',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 chaiyaphum:{country:'TH',place:'Chaiyaphum',home:'a farming household on the plateau edge',class:['low_class', 'working_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#97a46a',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 kalasin:{country:'TH',place:'Kalasin',home:'a sticky-rice farming household',class:['low_class', 'working_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#9ca86c',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 'khon-kaen':{country:'TH',place:'Khon Kaen',home:'a university staff household in Khon Kaen city',class:['bureaucratic_class', 'low_class'],style:'market',isan:true,sign:'th',pay:0.85,cost:0.85,skin:THAI,hair:['#1f2622'],look:{ground:'#a0a070',water:'#5f8580',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 loei:{country:'TH',place:'Loei',home:'a highland farming household',class:['low_class', 'working_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#8a9e66',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 'maha-sarakham':{country:'TH',place:'Maha Sarakham',home:'a household among the rice fields and silk looms',class:['low_class', 'working_class', 'bureaucratic_class'],style:'market',isan:true,sign:'th',pay:0.75,cost:0.75,skin:THAI,hair:['#1f2622'],look:{ground:'#a2a66e',water:'#5f8580',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 mukdahan:{country:'TH',place:'Mukdahan',home:'a trading household near the river port',class:['middle_class', 'low_class'],style:'market',isan:true,sign:'th',pay:0.8,cost:0.8,skin:THAI,hair:['#1f2622'],look:{ground:'#9ca06e',water:'#5f8580',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 'nakhon-phanom':{country:'TH',place:'Nakhon Phanom',home:'a weaving household on the Mekong',class:['working_class', 'middle_class'],style:'market',isan:true,sign:'th',pay:0.75,cost:0.75,skin:THAI,hair:['#1f2622'],look:{ground:'#9aa46e',water:'#5f8580',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 'nakhon-ratchasima':{country:'TH',place:'Nakhon Ratchasima',home:'a factory worker\'s household in Khorat',class:['working_class', 'low_class'],style:'market',isan:true,sign:'th',pay:0.85,cost:0.85,skin:THAI,hair:['#1f2622'],look:{ground:'#a2a070',water:'#5f8580',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 'nong-bua-lamphu':{country:'TH',place:'Nong Bua Lamphu',home:'a farming household beside the paddies',class:['low_class', 'bureaucratic_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#98a66a',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 'nong-khai':{country:'TH',place:'Nong Khai',home:'a farming household in the Mekong valley',class:['low_class', 'bureaucratic_class'],style:'market',isan:true,sign:'th',pay:0.75,cost:0.75,skin:THAI,hair:['#1f2622'],look:{ground:'#9aa46c',water:'#5f8580',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 'roi-et':{country:'TH',place:'Roi Et',home:'a rice-farming household on the Chi floodplain',class:['low_class', 'working_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#a0aa6c',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 'sakon-nakhon':{country:'TH',place:'Sakon Nakhon',home:'a rice-and-fish household near Nong Han',class:['low_class', 'middle_class'],style:'market',isan:true,sign:'th',pay:0.75,cost:0.75,skin:THAI,hair:['#1f2622'],look:{ground:'#96a46c',water:'#5f8580',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 sisaket:{country:'TH',place:'Sisaket',home:'a garlic-and-shallot farming household',class:['low_class', 'working_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#a2a86c',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 surin:{country:'TH',place:'Surin',home:'a farming household in a Khmer-speaking village',class:['working_class', 'low_class', 'middle_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#a0a46a',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 'ubon-ratchathani':{country:'TH',place:'Ubon Ratchathani',home:'a rice-farming household near Ubon',class:['low_class', 'working_class', 'middle_class'],style:'market',isan:true,sign:'th',pay:0.8,cost:0.8,skin:THAI,hair:['#1f2622'],look:{ground:'#9ea66c',water:'#5f8580',wall:'#dccfb0',floor:'#9f8562',roof:'#8f6a50'}},
 yasothon:{country:'TH',place:'Yasothon',home:'a rice-farming household in the Chi lowlands',class:['low_class', 'working_class'],style:'village',isan:true,sign:'th',pay:0.7,cost:0.7,skin:THAI,hair:['#1f2622'],look:{ground:'#a0a86c',water:'#5f8580',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 // The East (research/provinces/east.json): the industrial coast, the orchard provinces, the border market.
 chachoengsao:{country:'TH',place:'Chachoengsao',home:'a rice-farming household on the Bang Pakong plain',class:['low_class', 'working_class'],style:'market',east:true,sign:'th',pay:0.85,cost:0.85,skin:THAI,hair:['#1f2622'],look:{ground:'#93a06a',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 chanthaburi:{country:'TH',place:'Chanthaburi',home:'a durian-orchard household',class:['middle_class', 'working_class'],style:'market',east:true,sign:'th',pay:0.9,cost:0.9,skin:THAI,hair:['#1f2622'],look:{ground:'#86a068',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 chonburi:{country:'TH',place:'Laem Chabang, Chonburi',home:'a factory worker\'s household near the industrial parks',class:['working_class', 'low_class'],style:'market',east:true,sign:'th',pay:0.95,cost:0.95,skin:THAI,hair:['#1f2622'],look:{ground:'#9a9c70',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 prachinburi:{country:'TH',place:'Si Maha Phot, Prachinburi',home:'a factory worker\'s household near the industrial park',class:['working_class', 'middle_class'],style:'market',east:true,sign:'th',pay:0.9,cost:0.9,skin:THAI,hair:['#1f2622'],look:{ground:'#94a06a',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 rayong:{country:'TH',place:'Map Ta Phut, Rayong',home:'a household near the industrial estate',class:['working_class', 'low_class'],style:'market',east:true,sign:'th',pay:0.95,cost:0.95,skin:THAI,hair:['#1f2622'],look:{ground:'#98a06c',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 'sa-kaeo':{country:'TH',place:'Aranyaprathet, Sa Kaeo',home:'a trading household near the border market',class:['low_class', 'middle_class'],style:'market',east:true,sign:'th',pay:0.8,cost:0.8,skin:THAI,hair:['#1f2622'],look:{ground:'#a0a26c',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 trat:{country:'TH',place:'Trat',home:'a fruit-orchard household',class:['middle_class', 'working_class', 'low_class'],style:'village',east:true,sign:'th',pay:0.8,cost:0.8,skin:THAI,hair:['#1f2622'],look:{ground:'#84a066',water:'#4f7f8c',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 // The West (research/provinces/west.json): the Myanmar border hills, the rivers and the Gulf shore.
 kanchanaburi:{country:'TH',place:'Kanchanaburi',home:'a sugarcane-and-cassava farming household',class:['low_class', 'working_class'],style:'market',west:true,sign:'th',pay:0.8,cost:0.8,skin:THAI,hair:['#1f2622'],look:{ground:'#8fa068',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 phetchaburi:{country:'TH',place:'Phetchaburi',home:'a palm-sugar household among the sugar palms',class:['low_class', 'working_class', 'middle_class'],style:'market',west:true,sign:'th',pay:0.8,cost:0.8,skin:THAI,hair:['#1f2622'],look:{ground:'#94a06a',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 'prachuap-khiri-khan':{country:'TH',place:'Bang Saphan, Prachuap Khiri Khan',home:'a household in a coconut grove',class:['low_class', 'working_class'],style:'village',west:true,sign:'th',pay:0.75,cost:0.75,skin:THAI,hair:['#1f2622'],look:{ground:'#8ea26a',water:'#4f7f8c',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 ratchaburi:{country:'TH',place:'Damnoen Saduak, Ratchaburi',home:'a canal-side household that sells from a sampan',class:['low_class', 'middle_class'],style:'market',west:true,sign:'th',pay:0.8,cost:0.8,skin:THAI,hair:['#1f2622'],look:{ground:'#8aa06a',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 tak:{country:'TH',place:'Mae Sot, Tak',home:'a household in the border town',class:['low_class', 'middle_class'],style:'market',west:true,sign:'th',pay:0.8,cost:0.8,skin:THAI,hair:['#1f2622'],look:{ground:'#90a06a',water:'#4f7f8c',wall:'#e2dccd',floor:'#9f8562',roof:'#8a7a6a'}},
 singapore:{country:'SG',place:'Toa Payoh, Singapore',home:'a household in a public housing flat',bands:[],adult:true,style:'tower',sign:'en',pay:2.2,cost:2.6,skin:WIDE,hair:['#1f2622','#3a2c22','#5a4030'],look:{ground:'#7d9a72',water:'#4f7f8c',wall:'#e8e2d4',floor:'#bcae96',roof:'#8a9a98'}},
 tokyo:{country:'JP',place:'Nerima, Tokyo',home:'a household in a small Tokyo apartment',bands:[],adult:true,style:'tokyo',sign:'ja',climate:'cool',pay:2.4,cost:2.8,skin:['#d9b48f','#e6c3a0','#c9a07a','#f0d5bd'],hair:['#1f2622','#2a2620','#4a3a2c'],look:{ground:'#9a9a88',water:'#4f6f80',wall:'#ddd8cc',floor:'#b8a88c',roof:'#4f5a5e'}},
 boston:{country:'US',place:'Somerville, Massachusetts',home:'a household in a three-family house',bands:[],adult:true,style:'newengland',sign:'en',climate:'cold',pay:2.6,cost:3,skin:WIDE,hair:['#1f2622','#5a4030','#8a6a48','#c8a46a','#a04a2a'],look:{ground:'#e9edef',water:'#5f7a88',wall:'#d7dde0',floor:'#b59a78',roof:'#f4f6f7'}},
 london:{country:'GB',place:'Walthamstow, London',home:'a household in a terraced house',bands:[],adult:true,style:'brick',sign:'en',climate:'cool',pay:2.5,cost:3,skin:WIDE,hair:['#1f2622','#5a4030','#8a6a48','#c8a46a','#a04a2a'],look:{ground:'#7a8f6a',water:'#5a6f78',wall:'#9a5a46',floor:'#a88f70',roof:'#4d5254'}}
};
// New class intake is Thai; historical places remain for existing lives and links.
export const BAND_REGIONS={constrained:['khlong-toei','isan-village'],middle:['bang-na','pak-phanang','samut-prakan'],comfortable:['sukhumvit']};
// A birth code without a place letter resolves through these lists, so they never change; new
// birthplaces join CLASS_REGIONS and a code names them with a letter (birthcode.js).
export const LEGACY_CLASS_REGIONS={high_class:['sukhumvit'],low_class:['khlong-toei','nakhon-sawan','isan-village'],middle_class:['samut-prakan','bang-na','pak-phanang'],working_class:['khlong-toei','samut-prakan','pak-phanang','nakhon-sawan'],bureaucratic_class:['bang-na','samut-prakan'],};
const LATER={middle_class:['hua-hin','udon-thani','pathum-wan'],working_class:['udon-thani','pathum-wan'],bureaucratic_class:['hua-hin']};
// Every Lanna province joins the classes its research record names.
for(const [id,r] of Object.entries(REGIONS))if(r.lanna||r.isan||r.east||r.west)for(const c of r.class)(LATER[c]??=[]).push(id);
export const CLASS_REGIONS=Object.fromEntries(Object.entries(LEGACY_CLASS_REGIONS).map(([c,l])=>[c,[...l,...(LATER[c]??[])]]));
export const COUNTRIES={th:null,jp:'tokyo',sg:'singapore',gb:'london',us:'boston'};
export const ABROAD_BIRTHS=['tokyo','singapore','london','boston'];
export const MOVE_TARGETS=Object.keys(REGIONS).filter(id=>id!=='nakhon-sawan'&&REGIONS[id].country==='TH');
export const regionIdFor=birth=>Object.hasOwn(REGIONS,birth?.region)?birth.region:birth?.place==='Nakhon Sawan'?'nakhon-sawan':'samut-prakan';
// The one answer to "where is this life at this age": the birth region until the
// latest recorded move whose effective age is at or before `age`.
// Where the family lives at this age: the birthplace until a recorded family move.
export const homeRegion=(birth,age)=>{let id=regionIdFor(birth);for(const m of birth?.moves??[])if(age>=m.age&&Object.hasOwn(REGIONS,m.region))id=m.region;return id;};
export const validMoves=moves=>moves===undefined||Array.isArray(moves)&&moves.length<=2&&moves.every((m,i)=>m&&Object.hasOwn(REGIONS,m.region)&&Number.isInteger(m.age)&&m.age>=1&&m.age<=9&&(i===0||m.age>moves[i-1].age)&&['transfer','suburb','work'].includes(m.why));
export const childhoodAway=(birth,age)=>{const c=birth?.childhood;return !!c&&Object.hasOwn(REGIONS,c.region)&&age>=c.from&&age<c.to;};
export function regionAt(state,age=state.age){
 let id=childhoodAway(state.birth,age)?state.birth.childhood.region:homeRegion(state.birth,age);
 const moves=[...(state.history??[]).map(r=>r.finance),state.finance].filter(f=>f?.region&&Object.hasOwn(REGIONS,f.region)).map(f=>({region:f.region,since:f.regionSince??20}));
 for(const m of moves.sort((a,b)=>a.since-b.since))if(m.since<=age)id=m.region;
 return id;
}
export const region=id=>REGIONS[id]??REGIONS['samut-prakan'];

// Households differ by seed; the composition is stated in the birth record.
export const HOUSEHOLDS={
 parents:{text:'your mother and father',mother:{sex:'female',role:'mother'},father:{sex:'male',role:'father'}},
 grandmother:{text:'your mother and grandmother',mother:{sex:'female',role:'mother'},father:{sex:'female',role:'grandmother',elder:true}},
 grandfather:{text:'your father and grandmother',mother:{sex:'female',role:'grandmother',elder:true},father:{sex:'male',role:'father'}},
 mothers:{text:'your two mothers',mother:{sex:'female',role:'mother'},father:{sex:'female',role:'mother'}},
 fathers:{text:'your two fathers',mother:{sex:'male',role:'father'},father:{sex:'male',role:'father'}}
};
export function householdFor(roll){return roll<.7?'parents':roll<.84?'grandmother':roll<.92?'grandfather':roll<.96?'mothers':'fathers';}
export const household=birth=>HOUSEHOLDS[birth?.household]??HOUSEHOLDS.parents;
// A person's look is a pure function of seed and role, so replays and reloads agree.
export function appearance(rand,seed,key,regionId,{sex='female',elder=false}={}){
 const r=region(regionId),pick=(list,d)=>list[Math.floor(rand(seed,0,key+d)*list.length)];
 const hairStyles=sex==='female'?['long','bun','bob','ponytail']:sex==='male'?['short','crop','short','side']:['bob','crop','short'];
 return {sex,skin:pick(r.skin,'skin'),hair:elder?pick(['#b9b8b0','#8f8f88','#d4d2c8'],'grey'):pick(r.hair,'hair'),hairStyle:pick(hairStyles,'style'),build:.9+rand(seed,0,key+'build')*.25,height:(sex==='male'?1.02:.96)+rand(seed,0,key+'height')*.06-(elder?.04:0),elder};
}
