export const furniture=[{id:'bed',x:3.3,y:3.5,w:1.15,d:1.7},{id:'cradle',x:4.6,y:4.6,w:1.1,d:.9},{id:'desk',x:6,y:3.6,w:.7,d:.9},{id:'chair',x:6.1,y:4.7,w:.5,d:.5}];
// Houses the town adds as a life goes on: [from age, x, y, width, depth, height].
export const townGrowth=[[25,4.6,11.4,2,1.6,1.3],[35,10.2,13,2.2,1.5,1.5],[45,13.8,9.4,1.6,2,1.7],[55,-2.2,11.6,1.8,1.6,1.4]];
export const routes={mother:{x:5,y:6.25,w:.25,d:.25},father:{x:6.75,y:5.4,w:.1,d:.35}};
export function walk(t,r){const perimeter=2*(r.w+r.d);let n=((t%perimeter)+perimeter)%perimeter;if(n<r.w)return[r.x+n,r.y];n-=r.w;if(n<r.d)return[r.x+r.w,r.y+n];n-=r.d;if(n<r.w)return[r.x+r.w-n,r.y+r.d];n-=r.w;return[r.x,r.y+r.d-n];}
export function blocked([x,y],r=.12){return furniture.some(f=>x+r>f.x&&x-r<f.x+f.w&&y+r>f.y&&y-r<f.y+f.d);}
