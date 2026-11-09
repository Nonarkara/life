// Pure and dependency-free, so modules the simulation itself imports can use it without a cycle.
export function rand(seed,age,domain){let h=2166136261;for(const c of `${seed}/${age}/${domain}`){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h+=h<<13;h^=h>>>7;h+=h<<3;h^=h>>>17;h+=h<<5;return(h>>>0)/4294967296;}
