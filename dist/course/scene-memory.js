// The scenes this device has already met, across lives. A new life prefers scenes not met yet,
// so playing again shows more of the bank instead of the same favourites. Kept in this browser only.
const KEY='life-scenes-met-v1';
export function metScenes(){try{const a=JSON.parse(localStorage.getItem(KEY));return new Set(Array.isArray(a)?a.filter(x=>typeof x==='string'):[]);}catch{return new Set();}}
export function rememberScenes(state){const seen=state?.story?.seen;if(!seen?.length)return;try{const met=metScenes(),n=met.size;for(const e of seen)met.add(e.id);if(met.size>n)localStorage.setItem(KEY,JSON.stringify([...met]));}catch{}}
