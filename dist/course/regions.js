// Places a life can begin in or move to. Pay and cost factors are authored game
// tuning, not wage or price statistics. Every region reuses the shared world
// coordinates; institutions are metaphorical neighbours, not a real map.
const THAI=['#7c5036','#9b6a48','#b5855f','#c99a70','#d8ad84','#e4c09a','#a87754'];
const WIDE=['#5a3a26','#7c5036','#9b6a48','#b5855f','#d2a47c','#e6c3a0','#f0d5bd'];
export const REGIONS={
 'samut-prakan':{country:'TH',place:'Samut Prakan',home:'a market-stall household',bands:['middle'],style:'market',sign:'th',pay:1,cost:1,skin:THAI,hair:['#1f2622','#2a2620'],look:{ground:'#849573',water:'#5b7f80',wall:'#e5d9b9',floor:'#a58d69',roof:'#99634f'}},
 'nakhon-sawan':{country:'TH',place:'Nakhon Sawan',home:'a farming household',bands:[],style:'market',sign:'th',pay:.9,cost:.85,skin:THAI,hair:['#1f2622'],look:{ground:'#8a9a6c',water:'#5b7f80',wall:'#e1d3ad',floor:'#a08560',roof:'#9a6a48'}},
 'khlong-toei':{country:'TH',place:'Khlong Toei, Bangkok',home:'a household in a riverside community',bands:['constrained'],style:'slum',sign:'th',pay:1.05,cost:.8,skin:THAI,hair:['#1f2622','#2a2620'],look:{ground:'#8b8676',water:'#4f6d68',wall:'#8e9ca0',floor:'#8a7457',roof:'#7d8a8c'}},
 'isan-village':{country:'TH',place:'Ban Non Sawang, Khon Kaen',home:'a rice-farming household',bands:['constrained'],style:'village',sign:'th',pay:.75,cost:.7,skin:THAI,hair:['#1f2622'],look:{ground:'#9aa86a',water:'#6a8a7f',wall:'#a5825a',floor:'#8f6e48',roof:'#7a6a55'}},
 'bang-na':{country:'TH',place:'Bang Na, Bangkok',home:'a household in an apartment block',bands:['middle'],style:'condo',sign:'th',pay:1.15,cost:1.2,skin:THAI,hair:['#1f2622','#2a2620','#3a2c22'],look:{ground:'#9a9a8c',water:'#5b7a80',wall:'#d9d6cc',floor:'#b9ab92',roof:'#8f948f'}},
 'pak-phanang':{country:'TH',place:'Pak Phanang, Nakhon Si Thammarat',home:'a fishing household',bands:['middle'],style:'coast',sign:'th',pay:.85,cost:.8,skin:THAI,hair:['#1f2622'],look:{ground:'#c2b48a',water:'#3f7f8a',wall:'#9fb7b5',floor:'#9c8262',roof:'#a45b45'}},
 'sukhumvit':{country:'TH',place:'Sukhumvit, Bangkok',home:'a household in a large walled house',bands:['comfortable'],style:'villa',sign:'th',pay:1.3,cost:1.6,skin:THAI,hair:['#1f2622','#2a2620','#3a2c22'],look:{ground:'#7f9a68',water:'#5b7f86',wall:'#f1ece0',floor:'#c9b28c',roof:'#5f6a6a'}},
 singapore:{country:'SG',place:'Toa Payoh, Singapore',home:'',bands:[],adult:true,style:'tower',sign:'en',pay:2.2,cost:2.6,skin:WIDE,hair:['#1f2622','#3a2c22','#5a4030'],look:{ground:'#7d9a72',water:'#4f7f8c',wall:'#e8e2d4',floor:'#bcae96',roof:'#8a9a98'}},
 tokyo:{country:'JP',place:'Nerima, Tokyo',home:'',bands:[],adult:true,style:'tokyo',sign:'ja',climate:'cool',pay:2.4,cost:2.8,skin:['#d9b48f','#e6c3a0','#c9a07a','#f0d5bd'],hair:['#1f2622','#2a2620','#4a3a2c'],look:{ground:'#9a9a88',water:'#4f6f80',wall:'#ddd8cc',floor:'#b8a88c',roof:'#4f5a5e'}},
 boston:{country:'US',place:'Somerville, Massachusetts',home:'',bands:[],adult:true,style:'newengland',sign:'en',climate:'cold',pay:2.6,cost:3,skin:WIDE,hair:['#1f2622','#5a4030','#8a6a48','#c8a46a','#a04a2a'],look:{ground:'#e9edef',water:'#5f7a88',wall:'#d7dde0',floor:'#b59a78',roof:'#f4f6f7'}},
 london:{country:'GB',place:'Walthamstow, London',home:'',bands:[],adult:true,style:'brick',sign:'en',climate:'cool',pay:2.5,cost:3,skin:WIDE,hair:['#1f2622','#5a4030','#8a6a48','#c8a46a','#a04a2a'],look:{ground:'#7a8f6a',water:'#5a6f78',wall:'#9a5a46',floor:'#a88f70',roof:'#4d5254'}}
};
export const BAND_REGIONS={constrained:['khlong-toei','isan-village'],middle:['bang-na','pak-phanang','samut-prakan'],comfortable:['sukhumvit']};
export const MOVE_TARGETS=Object.keys(REGIONS).filter(id=>id!=='nakhon-sawan');
export const regionIdFor=birth=>Object.hasOwn(REGIONS,birth?.region)?birth.region:birth?.place==='Nakhon Sawan'?'nakhon-sawan':'samut-prakan';
// The one answer to "where is this life at this age": the birth region until the
// latest recorded move whose effective age is at or before `age`.
export const childhoodAway=(birth,age)=>{const c=birth?.childhood;return !!c&&Object.hasOwn(REGIONS,c.region)&&age>=c.from&&age<c.to;};
export function regionAt(state,age=state.age){
 let id=childhoodAway(state.birth,age)?state.birth.childhood.region:regionIdFor(state.birth);
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
