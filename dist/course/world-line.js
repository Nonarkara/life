// What the world says above the picture: the year, the place, and what the papers
// said that year. One event is told once: when the year's own event is already on
// the childhood strip, the papers stay quiet, and a life with no birth year is
// never given a year it did not live in.
export function worldLine({year=null,place='',headline=null,told=false,t=line=>line}){
 const parts=year===null?[t('Scenario calendar · timeless'),t(place)]:[String(year),t(place)];
 if(year!==null&&!told&&headline)parts.push(t(headline));
 return parts.filter(part=>part!==''&&part!==null&&part!==undefined).join(' · ');
}
