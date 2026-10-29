// Original line drawings: the action, not a predicted reward or moral ranking.
export const SYMBOL_PATHS={
 book:'M4 7 Q10 4 16 8 Q22 4 28 7 V26 Q22 23 16 27 Q10 23 4 26 Z M16 8 V27 M8 11 L12 12 M20 12 L24 11',
 tools:'M5 4 L13 12 M4 7 L7 4 M20 4 A7 7 0 0 0 18 15 L7 26 L4 23 L15 12 A7 7 0 0 0 26 5 L22 9 L18 6 Z M19 20 L26 27 M22 17 L29 24',
 agreement:'M8 3 H21 L26 8 V28 H8 Z M21 3 V9 H26 M12 14 H21 M12 18 H19 M12 23 L15 25 L22 21',
 money:'M4 12 H28 V27 H4 Z M4 17 H28 M20 20 H28 V24 H20 Z M8 12 V6 H23 V12 M12 9 H19',
 home:'M3 15 L16 4 L29 15 M7 13 V28 H25 V13 M13 28 V19 H19 V28',
 care:'M6 14 V8 H11 V3 H21 V8 H26 V18 H21 M11 14 H6 M3 23 L9 19 L15 20 L17 23 H24 L29 20 M3 23 L11 28 H23 L29 24',
 people:'M10 13 A5 5 0 1 0 10 3 A5 5 0 1 0 10 13 M23 14 A4 4 0 1 0 23 6 A4 4 0 1 0 23 14 M2 28 V22 Q10 13 18 22 V28 M20 19 Q25 16 29 23 V28',
 travel:'M3 25 L12 17 L18 21 L29 8 M21 8 H29 V16 M4 5 H13 V11 H4 Z M8 11 V20',
 water:'M16 3 Q5 15 5 20 A11 9 0 0 0 27 20 Q27 15 16 3 Z M10 22 Q15 26 22 21',
 bicycle:'M8 28 A6 6 0 1 0 8 16 A6 6 0 1 0 8 28 M24 28 A6 6 0 1 0 24 16 A6 6 0 1 0 24 28 M8 22 L13 11 L24 22 H8 M12 11 H21 L24 22 M10 7 H16 M20 6 H24 L26 10',
 clock:'M16 29 A13 13 0 1 0 16 3 A13 13 0 1 0 16 29 M16 8 V17 L23 21',
 heart:'M16 28 L4 16 C-3 5 10 -1 16 10 C22 -1 35 5 28 16 Z',
 shield:'M16 3 L28 8 V18 Q27 25 16 30 Q5 25 4 18 V8 Z M10 16 L14 21 L23 11',
 work:'M3 10 H29 V28 H3 Z M10 10 V4 H22 V10 M3 18 H29 M14 16 H18 V21 H14 Z',
 art:'M4 27 L7 20 L22 5 Q26 2 29 6 L12 23 Z M7 20 L12 23 M20 7 L25 12 M4 27 L12 23',
 tree:'M16 29 V16 M11 29 H21 M6 17 Q0 10 9 8 Q9 -1 19 4 Q30 1 29 12 Q33 22 22 22 Q15 28 11 20 Q5 25 6 17',
 split:'M16 29 V16 M16 16 L6 6 M16 16 L26 6 M3 12 V3 H12 M20 3 H29 V12'
};
export const STATION_SYMBOLS={
 'child-roof':['tools','book','agreement'],'child-sponsor':['agreement','shield','agreement'],'child-water-bike':['bicycle','water','tools'],
 'school-apprentice':['book','tools','clock'],'school-leave':['travel','book','money'],'school-fall-climb':['shield','art','work'],
 'college-cost':['book','agreement','work','clock'],'stall-paper':['agreement','shield','home'],'city-pay':['travel','home','agreement'],
 'partner-choice':['people','heart','clock'],'flood-repair':['tools','money','split'],'flood-move':['travel','home'],
 'year-abroad':['travel','home','clock'],'partner-business':['work','money','shield'],'promotion-away':['travel','home','agreement'],
 'parent-ill':['care','people','money'],'share-offer':['work','money','split'],'buy-house':['home','money','people'],
 'child-city':['travel','home','clock'],'leave':['travel','work'],'father-tools':['tools','money','split'],
 'stall-takeover':['work','shield','people'],'stay-on':['work','clock','book'],'nephew':['book','people'],
 'treatment':['care','money','people'],'house-travel':['travel','home'],'empty-house':['money','home','people'],
 'take-in':['home','care','shield'],'legacy':['money','home','tools'],'remembered':['money','book','home']
};
export function choiceSymbolKey(option,{pivot}={}){
 if(pivot){const index=pivot.options.findIndex(o=>o.id===option.id);if(STATION_SYMBOLS[pivot.id]?.[index])return STATION_SYMBOLS[pivot.id][index];}
 const skills=option.skills??option.effects?.skills??{};
 if(skills.iq>0)return 'book';if(skills.craft>0)return 'art';if(skills.eq>0)return 'people';
 if((option.health??option.effects?.health??0)>0)return 'care';
 if(option.cash||option.effects?.cash||option.funds)return 'money';
 if(option.flags&&Object.keys(option.flags).some(k=>/friend|partner|married|care/.test(k)))return 'people';
 return 'split'; // An authored fork whose consequence is qualitative.
}
export function choiceSymbol(key){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
 svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.classList.add('choice-symbol');svg.dataset.symbol=key;
 path.setAttribute('d',SYMBOL_PATHS[key]??SYMBOL_PATHS.split);svg.append(path);return svg;
}
