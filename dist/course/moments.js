import {regionIdFor} from './regions.js';
// REBUILD-STRATEGY.md step 4: a five-year chapter with no event still had a life in it.
// One small, undated moment is drawn per quiet chapter, by age and place. Nothing here
// names a year or a technology, so it holds for a life born in 1949 or in 2000.
const BANDS=[
 [15,24,['A friend taught you to ride a motorbike in the temple car park.','You learned every word of one song and sang it badly for a year.','Most evenings ended at the same noodle stall.','You fell asleep on the bus home so often the driver knew your stop.','You and two friends swore you would never be like your parents.']],
 [25,44,['The rains came late two years running, and early the third.','You learned which neighbour to ask for ice, and which for advice.','A cousin married. You lent your good shirt and never got it back.','You moved the bed to the other wall, and the room felt new for a month.','A cat came for scraps and stayed three years.','Your knees began to tell you about the weather.']],
 [45,64,['You started going to bed earlier, and getting up before the birds.','Your old classmates began to appear in the funeral notices.','You planted chillies in paint tins along the wall.','Children at the market began to call you by the word for an older relative.','You went to the temple more often than you had planned to.']],
 [65,80,['The mornings were long and the afternoons were short.','You told the same story twice to the same grandchild, and they let you.','Your hands remembered work your mind had put down.','Visitors came less often, and stayed longer.']]
];
const PLACES={
 'isan-village':['The rice was planted, the rice was cut, and the granary was never quite full.','The village got a new road, and the young people used it to leave.'],
 'nakhon-sawan':['The rice was planted, the rice was cut, and the granary was never quite full.','The river rose each year to the same mark on the post.'],
 'khlong-toei':['The landlord raised the rent twice. The canal smelled the same.','Every evening the lane filled with radios and frying garlic.'],
 'pak-phanang':['The monsoon kept the boats in for a month each year.','You learned to read the sky before the radio did.'],
 'samut-prakan':['The stall opened at four every morning, holidays included.'],
 'bang-na':['The trip home took longer every year.'],
 sukhumvit:['The house stayed the same while the street outside became something else.']
};
const pick=(seed,age,list)=>{let h=2166136261;for(const c of `${seed}/${age}/moment`){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return list[(h>>>0)%list.length];};
export const MOMENT_TEXTS=[...new Set([...BANDS.flatMap(b=>b[2]),...Object.values(PLACES).flat()])];
export function momentFor(state,age){
 const band=BANDS.find(([lo,hi])=>age>=lo&&age<=hi)?.[2]??BANDS[0][2];
 const place=age>=18?PLACES[regionIdFor(state.birth)]??[]:[];
 return pick(state.seed,age,[...band,...place]);
}
