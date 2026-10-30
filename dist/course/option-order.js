// The authored first option is usually the free, safe one. Showing it first in every life
// teaches players to always press the top button, so each world shows its own order.
// The order is a pure function of the world and the question; nothing about outcomes changes.
export function inWorldOrder(list,seed,key){
 const a=[...list];let h=2166136261;
 for(const c of seed+':'+key){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}
 for(let i=a.length-1;i>0;i--){h=Math.imul(h^(h>>>15),2246822519)+i>>>0;const j=h%(i+1);[a[i],a[j]]=[a[j],a[i]];}
 return a;
}
