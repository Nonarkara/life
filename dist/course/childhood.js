// Authored family circumstances, never a demographic forecast.
export function childhoodChapter(state, age) {
 const band=state.intake?.upbringing??'middle';
 const income={constrained:96000,middle:240000,comfortable:600000}[band];
 const chapters=[
  [0,'Your mother’s world becomes yours.','Your family makes room for a newborn. Care comes before any ambition.'],
  [1,'Your first steps.','Your family takes turns caring for you while keeping the household running.'],
  [3,'A world beyond home.','Relatives and neighbours become familiar. Your family chooses who can help with care.'],
  [6,'Your family chooses a school.',band==='constrained'?'The nearby public school keeps travel and school costs within reach.':band==='comfortable'?'Your family can afford a school farther away and activities after class.':'Your family chooses a public school and sets aside money for books and transport.'],
  [9,'You begin to imagine another life.','You hear about people who study, work, make things and take unfamiliar paths. Soon the choices will be yours.']
 ];
 const chapter=chapters.filter(([start])=>age>=start).at(-1)??chapters[0];
 return {income,title:chapter[1],decision:chapter[2]};
}
export const wombMarkup=`<svg viewBox="0 0 320 320" role="img" aria-label="A baby held within the womb"><path d="M160 25C84 25 39 82 47 161C54 241 104 289 160 295C216 289 266 241 273 161C281 82 236 25 160 25Z" fill="#44232b" stroke="#93616a" stroke-width="2"/><path d="M207 212C235 181 237 120 197 91C167 68 126 83 116 108" fill="none" stroke="#bc8a84" stroke-width="3"/><circle cx="140" cy="133" r="34" fill="#d5a68b"/><path d="M154 163C194 150 216 180 202 209C193 228 170 238 145 225L119 206L136 191L157 203L172 196L151 184Z" fill="#d5a68b"/><path d="M162 165L132 176L121 161M177 208L151 231L126 226" fill="none" stroke="#d5a68b" stroke-width="13" stroke-linecap="round"/><path d="M195 183C231 219 110 268 98 196C89 149 70 139 66 155" fill="none" stroke="#93616a" stroke-width="3"/></svg>`;
