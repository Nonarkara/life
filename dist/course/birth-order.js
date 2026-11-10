// Who else was in the house. Derived from the seed and the era, so saves and links need no new field.
// Authored game rules, not demographic data.
import {rand} from './rand.js';
import {birthYearOf} from './thai-history.js';
const LOST={1949:.22,1955:.18,1970:.1,1975:.08,1981:.05,1990:.04};
export function siblingsOf(state){
 const y=birthYearOf(state)??1981,r=rand(state.seed,0,'sibs'),o=rand(state.seed,0,'sibs-order');
 const total=y<=1955?2+Math.floor(r*5):y<=1975?(r<.15?1:r<.5?2:r<.8?3:4):y<=1990?(r<.25?1:r<.7?2:r<.92?3:4):(r<.3?1:r<.75?2:r<.95?3:4);
 const order=1+Math.floor(o*total);
 return {total,order,lostBefore:rand(state.seed,0,'sibs-lost')<(LOST[y]??.03)};
}
export const orderLabel=({total,order})=>total===1?['Only child']:order===1?['Eldest of {n}',total]:order===total?['Youngest of {n}',total]:['Child number {k} of {n}',total,order];
