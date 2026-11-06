// Historical Thai eras, cohorts, milestones and archival artwork (1949–2026+).
//
// Cohorts anchor a life's birth year so players can watch Thailand transform across
// seven decades — from post-war canals, wooden shophouses and Mitr Chaibancha cinema
// marquees, through 1980s lane floodlights, shared family landlines and VHS tapes,
// the 1997 Tom Yum Goong crisis and 1999 Skytrain opening, to the 2011 flood, 2014
// curfew and cashless 2020s streets.
export const COHORT_YEARS=Object.freeze([1949,1970,1981,1990,2000,2026]);
export const DEFAULT_COHORT_YEARS=Object.freeze([1949,1981,2000]);
export const HISTORICAL_COHORTS=Object.freeze({
 1949:{
  year:1949,
  code:'49',
  label:'1949 · Post-war & Canal Era (Mother’s generation)',
  shortLabel:'Born 1949',
  note:'Grow up alongside provincial canals and wooden shophouses, enter Bangkok’s evening colleges in the 1960s, build a manual-ledger career through the 1980s boom, face the 1997 financial crisis at 48, and reach age 77 in 2026.'
 },
 1970:{
  year:1970,
  code:'70',
  label:'1970 · Development Roads & Boom Era',
  shortLabel:'Born 1970',
  note:'Born as highway corridors link the provinces to Bangkok; come of age during the double-digit export boom and face the 1997 crisis in your late twenties.'
 },
 1981:{
  year:1981,
  code:'81',
  label:'1981 · Pre-Skytrain Bangkok (Gen Y)',
  shortLabel:'Born 1981',
  note:'Grow up with potholed soi lanes, afternoon TVB dramas, black-market VHS tapes, one household landline and a US Robotics dial-up modem; turn 16 during the 1997 crisis and reach 45 in 2026.'
 },
 1990:{
  year:1990,
  code:'90',
  label:'1990 · Analog-to-Digital Transition',
  shortLabel:'Born 1990',
  note:'Childhood during the 1997 crisis and the 1999 BTS Skytrain opening; enter adulthood alongside smartphones, the 2011 flood and modern urban transit.'
 },
 2000:{year:2000,code:'00',label:'2000 · A new century',shortLabel:'Born 2000',note:'Reach age 20 in 2020.'},
 2026:{
  year:2026,
  code:'26',
  label:'2026 · Present-Day Scenario',
  shortLabel:'Born 2026',
  note:'Begin in contemporary Thailand with electric rail lines, cashless QR stalls and an aging society.'
 }
});

export function validCohortYear(y){
 return y===undefined||COHORT_YEARS.includes(y);
}

export function birthYearOf(state){
 const y=state?.intake?.birthYear??state?.birth?.birthYear;
 return COHORT_YEARS.includes(y)?y:null;
}

export function calendarYearAt(state,age=state?.age??0){
 const by=birthYearOf(state);
 return by!==null?by+Math.floor(age):null;
}

export const THAI_ERAS=Object.freeze([
 {
  id:'canal-cinema',
  from:1949,
  to:1960,
  eraSpan:'1949–1960',
  title:'Post-war Canals & 16mm Cinema',
  badge:'1950s · Klongs & Cinema',
  transport:'Samlor pedicabs, canal boats and gravel lanes',
  media:'16mm live-dubbed cinema (Mitr Chaibancha) and AM transistor radio',
  urban:'Teak shophouses, open klongs and spirit houses by the gate',
  summary:'Thailand recovers after the war. Canals still carry rice barges into Bangkok, streets are gravel or brick, and crowds gather beneath hand-painted cinema marquees.',
  milestone:'1957–1960: Golden age of 16mm Thai film and the eve of the First National Economic Development Plan.',
  sourceLabel:'NESDC · National Development Plan History',
  sourceHref:'https://www.nesdc.go.th/nesdb_en/ewt_w3c/main.php?filename=develop_issue',
  grade:{sepia:.22,warm:[242,208,150,.11],vignette:.22,grain:.08,scanlines:0},
  palette:{sky:'#c8a878',accent:'#b0472f',ink:'#2b2118',paper:'#f2e6cf'}
 },
 {
  id:'development-roads',
  from:1961,
  to:1975,
  eraSpan:'1961–1975',
  title:'Development Highways & Night Colleges',
  badge:'1960s–70s · Highways & Ledgers',
  transport:'Friendship Highway buses, bicycles and early intercity coaches',
  media:'Film marquees, print dailies and black-and-white television',
  urban:'Technical colleges, hospital accounting offices and expanding shophouse rows',
  summary:'New highways connect provincial towns to Bangkok. First-generation students work daytime shifts in hospitals and offices to fund five-year evening degrees so younger siblings can follow.',
  milestone:'1961–1973: First National Economic Development Plan, provincial migration to Bangkok schools, and the October 1973 student uprising.',
  sourceLabel:'World Bank · Thailand Data',
  sourceHref:'https://data.worldbank.org/country/thailand',
  grade:{sepia:.14,warm:[238,198,136,.09],vignette:.16,grain:.05,scanlines:0},
  palette:{sky:'#bfa57a',accent:'#a35d00',ink:'#26231c',paper:'#f1e8d6'}
 },
 {
  id:'pre-skytrain-soi',
  from:1976,
  to:1986,
  eraSpan:'1976–1986',
  title:'Potholed Sois, Landlines & Afternoon TVB',
  badge:'1980s · Landlines & VHS',
  transport:'Open-window red buses, tuk-tuks and two-stroke motorcycles in gridlock',
  media:'CRT colour TV (The Bund / เจ้าพ่อเซี่ยงไฮ้), VHS rental stalls and one rotary landline',
  urban:'Concrete rowhouses, overhead power-line bundles and dusk mosquito coils',
  summary:'Bangkok industrialises faster than its roads. Parents sit for hours in evening traffic while children do homework at a neighbour’s table until 7 PM and memorise a single seven-digit home telephone number.',
  milestone:'1980–1985: Colour television, VHS tape stalls and manufacturing growth across Greater Bangkok.',
  sourceLabel:'World Bank · Thailand GDP Growth',
  sourceHref:'https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG?locations=TH',
  grade:{sepia:.08,warm:[245,182,108,.08],vignette:.14,grain:.04,scanlines:.06},
  palette:{sky:'#8ea49e',accent:'#c0563f',ink:'#1f2a28',paper:'#f3ede0'}
 },
 {
  id:'boom-modem',
  from:1987,
  to:1996,
  eraSpan:'1987–1996',
  title:'Double-Digit Boom & Dial-Up Modems',
  badge:'1990s · Boom & Dial-Up',
  transport:'Expressway flyovers, air-conditioned buses and family sedans',
  media:'US Robotics 14.4k/28.8k dial-up modems, VCDs and pager numbers',
  urban:'First glass office towers, finance houses and suburban housing estates',
  summary:'GDP growth surges past 10% a year. Finance companies multiply, condominium cranes line the skyline, and plugging in the dial-up modem ties up the entire household’s telephone line.',
  milestone:'1988–1995: Fastest economic expansion in Thai history, rising private credit and early home internet.',
  sourceLabel:'World Bank · Thailand GDP Growth',
  sourceHref:'https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG?locations=TH',
  grade:{sepia:.03,warm:[230,210,175,.05],vignette:.10,grain:.02,scanlines:.05},
  palette:{sky:'#7c9898',accent:'#d97706',ink:'#192e2c',paper:'#f4f0e6'}
 },
 {
  id:'tom-yum-goong',
  from:1997,
  to:2004,
  eraSpan:'1997–2004',
  title:'Tom Yum Goong Crisis & First Skytrain',
  badge:'1997–2004 · Crisis & Skytrain',
  transport:'1999 BTS Skytrain viaducts above Sukhumvit and Silom',
  media:'Early mobile phones, internet cafés and satellite news',
  urban:'Unfinished concrete towers alongside the new elevated rail line',
  summary:'On 2 July 1997 the baht floats; 56 finance houses close and banks merge, testing veteran staff against connected insiders. Two years later, the first BTS Skytrain opens above Bangkok’s traffic.',
  milestone:'1997–1999: Asian Financial Crisis (-7.6% GDP in 1998), bank restructurings, and the December 1999 BTS Skytrain opening.',
  sourceLabel:'Bank of Thailand · 1997 Crisis Lesson',
  sourceHref:'https://www.bot.or.th/en/our-roles/special-measures/Tom-Yum-Kung-lesson.html',
  grade:{sepia:0,warm:[140,165,180,.07],vignette:.14,grain:.02,scanlines:0},
  palette:{sky:'#6d8791',accent:'#a32750',ink:'#192b30',paper:'#eef1f0'}
 },
 {
  id:'flood-smartphones',
  from:2005,
  to:2015,
  eraSpan:'2005–2015',
  title:'Great Flood, Curfews & Smartphones',
  badge:'2005–2015 · Flood & 3G',
  transport:'Airport Rail Link, MRT subways and sandbagged suburban lanes',
  media:'3G smartphones, LINE family groups and live broadcast curfews',
  urban:'High-rise condominiums along rail corridors and floodwalls in 2011',
  summary:'Urban rail expands across the metropolis, but the 2011 Chao Phraya mega-flood and the 2006/2014 military coups interrupt commutes, household budgets and evening plans.',
  milestone:'2011 & 2014: The 2011 Great Flood across central Thailand and the May 2014 coup curfew.',
  sourceLabel:'Australian Embassy · 23 May 2014',
  sourceHref:'https://thailand.embassy.gov.au/bkok/PR2014_Military_Coup.html',
  grade:{sepia:0,warm:[190,210,205,.04],vignette:.08,grain:0,scanlines:0},
  palette:{sky:'#738f8c',accent:'#2b6cb0',ink:'#192e2c',paper:'#f2f4f0'}
 },
 {
  id:'modern-aging',
  from:2016,
  to:2120,
  eraSpan:'2016–2026+',
  title:'Cashless Sois, Pandemic & Aging Home',
  badge:'2020s · QR & Aging Thailand',
  transport:'Multi-line electric rail, EVs and app-hailed motorbike deliveries',
  media:'PromptPay QR codes at every street cart and fibre broadband',
  urban:'Cleaner resurfaced sois, solar roofs and multi-generational homes',
  summary:'Street vendors take instant QR payments and new electric rail lines reach the outer suburbs. After the 2020 pandemic shock, Thailand becomes an aging society where adult children balance midlife autonomy with caring for parents in their seventies.',
  milestone:'2020–2026: Pandemic contraction (-6.1% GDP in 2020), nationwide PromptPay QR adoption, and aging households in 2026.',
  sourceLabel:'World Bank · 2020 Thailand Economic Monitor',
  sourceHref:'https://www.worldbank.org/en/country/thailand/publication/thailand-economic-monitor-june-2020-thailand-in-the-time-of-covid-19',
  grade:{sepia:0,warm:[255,250,240,.02],vignette:.05,grain:0,scanlines:0},
  palette:{sky:'#6f8783',accent:'#f59e0b',ink:'#192e2c',paper:'#f4f0e6'}
 }
].map(Object.freeze));

export function thaiEraForYear(year){
 if(!Number.isFinite(year))return null;
 return THAI_ERAS.find(e=>year>=e.from&&year<=e.to)??THAI_ERAS.at(-1);
}

export function thaiEraForState(state,age=state?.age??0){
 const year=calendarYearAt(state,age);
 if(year===null)return null;
 return {year,era:thaiEraForYear(year),cohort:HISTORICAL_COHORTS[birthYearOf(state)]??null};
}

// Apply subtle archival film / CRT / daylight grading to a 2D canvas when a historical cohort is active.
export function applyEraCanvasGrade(ctx,width,height,state,age=state?.age??0){
 const info=thaiEraForState(state,age);
 if(!info||width<4||height<4)return;
 const {grade}=info.era;
 ctx.save();
 ctx.setTransform(1,0,0,1,0,0);
 if(grade.warm&&grade.warm[3]>0){
  const [r,g,b,a]=grade.warm;
  ctx.fillStyle=`rgba(${r},${g},${b},${a})`;
  ctx.fillRect(0,0,width,height);
 }
 if(grade.scanlines>0){
  ctx.fillStyle=`rgba(18,16,12,${grade.scanlines})`;
  const step=Math.max(3,Math.round(height/110));
  for(let y=0;y<height;y+=step)ctx.fillRect(0,y,width,1);
 }
 if(grade.vignette>0){
  const rad=Math.hypot(width,height)*.55;
  const grad=ctx.createRadialGradient(width/2,height/2,rad*.45,width/2,height/2,rad);
  grad.addColorStop(0,'rgba(24,18,12,0)');
  grad.addColorStop(1,`rgba(24,18,12,${grade.vignette})`);
  ctx.fillStyle=grad;
  ctx.fillRect(0,0,width,height);
 }
 ctx.restore();
}

// Render an inline SVG archival vignette illustrating how Thailand's streetscape,
// transport and media look in the current era.
const NS='http://www.w3.org/2000/svg';
function svgNode(tag,attrs={},text){
 const el=document.createElementNS(NS,tag);
 for(const[k,v]of Object.entries(attrs))el.setAttribute(k,String(v));
 if(text!==undefined)el.textContent=text;
 return el;
}

export function renderEraArtworkSVG(era,year){
 const svg=svgNode('svg',{viewBox:'0 0 320 96',class:'era-artwork',role:'img','aria-label':`${era.eraSpan} · ${era.title}`});
 const {sky,accent,ink,paper}=era.palette;
 svg.append(svgNode('rect',{x:0,y:0,width:320,height:96,fill:paper}));
 svg.append(svgNode('rect',{x:0,y:0,width:320,height:64,fill:sky,'fill-opacity':.32}));
 svg.append(svgNode('rect',{x:0,y:64,width:320,height:32,fill:ink,'fill-opacity':.12}));
 // Subtle horizon grid & sun/moon disc
 svg.append(svgNode('circle',{cx:286,cy:20,r:9,fill:accent,'fill-opacity':.28}));
 svg.append(svgNode('line',{x1:0,y1:64,x2:320,y2:64,stroke:ink,'stroke-width':1.2}));

 if(era.id==='canal-cinema'){
  // Canal water & ripples, wooden stilt house with shutters, sampan boat, and 16mm cinema marquee with film reels
  svg.append(svgNode('rect',{x:0,y:64,width:176,height:32,fill:'#4f7a82','fill-opacity':.38}));
  for(const [x,y,w] of [[12,72,38],[68,75,44],[122,71,36]])svg.append(svgNode('line',{x1:x,y1:y,x2:x+w,y2:y,stroke:ink,'stroke-width':.9,'stroke-opacity':.55}));
  svg.append(svgNode('polygon',{points:'14,70 60,70 68,64 8,64',fill:ink}));
  svg.append(svgNode('rect',{x:26,y:58,width:22,height:6,fill:paper,stroke:ink,'stroke-width':.9}));
  for(const x of [86,108,130])svg.append(svgNode('line',{x1:x,y1:54,x2:x,y2:72,stroke:ink,'stroke-width':1.4}));
  svg.append(svgNode('rect',{x:80,y:28,width:58,height:28,fill:'#d8c29d',stroke:ink,'stroke-width':1.2}));
  for(const x of [88,104,120])svg.append(svgNode('rect',{x,y:34,width:10,height:14,fill:paper,stroke:ink,'stroke-width':.9}));
  svg.append(svgNode('polygon',{points:'74,28 109,12 144,28',fill:accent,stroke:ink,'stroke-width':1}));
  svg.append(svgNode('rect',{x:188,y:18,width:112,height:46,fill:paper,stroke:ink,'stroke-width':1.2}));
  svg.append(svgNode('rect',{x:194,y:23,width:100,height:14,fill:accent}));
  svg.append(svgNode('circle',{cx:204,cy:49,r:6,fill:'none',stroke:ink,'stroke-width':1.1}),svgNode('circle',{cx:220,cy:49,r:6,fill:'none',stroke:ink,'stroke-width':1.1}));
  for(const x of [240,256,272])svg.append(svgNode('rect',{x,y:42,width:10,height:22,fill:ink,'fill-opacity':.75}));
  svg.append(svgNode('text',{x:244,y:33,'text-anchor':'middle',fill:paper,'font-size':7.5,'font-weight':700},'16MM LIVE DUB'));
 }else if(era.id==='development-roads'){
  // Provincial hospital with cross, Friendship Highway intercity bus, and 5-year night college
  svg.append(svgNode('rect',{x:16,y:22,width:72,height:42,fill:paper,stroke:ink,'stroke-width':1.2}));
  for(const x of [24,40,56,70])for(const y of [30,44])svg.append(svgNode('rect',{x,y,width:8,height:8,fill:sky,'fill-opacity':.55,stroke:ink,'stroke-width':.7}));
  svg.append(svgNode('rect',{x:46,y:12,width:12,height:10,fill:paper,stroke:ink,'stroke-width':1}));
  svg.append(svgNode('line',{x1:52,y1:14,x2:52,y2:20,stroke:accent,'stroke-width':2}),svgNode('line',{x1:49,y1:17,x2:55,y2:17,stroke:accent,'stroke-width':2}));
  svg.append(svgNode('rect',{x:104,y:40,width:74,height:22,rx:3,fill:accent,stroke:ink,'stroke-width':1.2}));
  for(let x=110;x<=162;x+=13)svg.append(svgNode('rect',{x,y:44,width:9,height:8,fill:paper,stroke:ink,'stroke-width':.8}));
  svg.append(svgNode('circle',{cx:120,cy:64,r:5,fill:ink}),svgNode('circle',{cx:162,cy:64,r:5,fill:ink}));
  svg.append(svgNode('rect',{x:196,y:16,width:106,height:48,fill:'#e6decb',stroke:ink,'stroke-width':1.2}));
  svg.append(svgNode('polygon',{points:'192,16 249,6 306,16',fill:ink,'fill-opacity':.8}));
  for(let x=206;x<=286;x+=16)for(const y of [24,40])svg.append(svgNode('rect',{x,y,width:10,height:11,fill:'#f59e0b','fill-opacity':.82,stroke:ink,'stroke-width':.7}));
 }else if(era.id==='pre-skytrain-soi'){
  // Tangled overhead soi wires, utility poles, shophouse awnings, CRT TV with antenna & rotary phone
  for(const x of [28,148,278]){
   svg.append(svgNode('line',{x1:x,y1:10,x2:x,y2:64,stroke:ink,'stroke-width':2}));
   svg.append(svgNode('line',{x1:x-8,y1:16,x2:x+8,y2:16,stroke:ink,'stroke-width':1.2}));
  }
  for(const [y1,y2,y3] of [[16,28,18],[20,33,22],[24,38,26]])svg.append(svgNode('path',{d:`M0,${y1} Q88,${y2} 148,${y3} T320,${y1+4}`,fill:'none',stroke:ink,'stroke-width':.9}));
  svg.append(svgNode('rect',{x:44,y:26,width:88,height:38,fill:paper,stroke:ink,'stroke-width':1.2}));
  svg.append(svgNode('polygon',{points:'40,42 136,42 132,34 44,34',fill:accent,'fill-opacity':.85,stroke:ink,'stroke-width':.9}));
  for(const x of [52,76,100])svg.append(svgNode('rect',{x,y:45,width:16,height:19,fill:'#d9d2c2',stroke:ink,'stroke-width':.8}));
  svg.append(svgNode('rect',{x:168,y:30,width:52,height:34,rx:2,fill:ink}));
  svg.append(svgNode('rect',{x:173,y:35,width:34,height:24,rx:1,fill:'#8eb3ad'}));
  svg.append(svgNode('line',{x1:190,y1:30,x2:178,y2:16,stroke:ink,'stroke-width':1.1}),svgNode('line',{x1:196,y1:30,x2:210,y2:16,stroke:ink,'stroke-width':1.1}));
  svg.append(svgNode('rect',{x:232,y:42,width:38,height:22,rx:3,fill:paper,stroke:ink,'stroke-width':1.2}));
  svg.append(svgNode('circle',{cx:251,cy:54,r:6,fill:'none',stroke:ink,'stroke-width':1.1}));
 }else if(era.id==='boom-modem'){
  // High-rise glass curtain-wall towers, tower crane, and US Robotics 28.8k modem with carrier wave
  for(const [bx,by,bw,bh] of [[20,10,44,54],[70,18,38,46],[114,26,32,38]]){
   svg.append(svgNode('rect',{x:bx,y:by,width:bw,height:bh,fill:'#d5dedc',stroke:ink,'stroke-width':1.2}));
   for(let y=by+6;y<60;y+=8)svg.append(svgNode('line',{x1:bx+4,y1:y,x2:bx+bw-4,y2:y,stroke:ink,'stroke-width':.6,'stroke-opacity':.55}));
  }
  svg.append(svgNode('line',{x1:162,y1:64,x2:162,y2:10,stroke:accent,'stroke-width':2.2}),svgNode('line',{x1:138,y1:14,x2:202,y2:14,stroke:accent,'stroke-width':1.8}));
  svg.append(svgNode('line',{x1:162,y1:10,x2:192,y2:14,stroke:accent,'stroke-width':1}),svgNode('line',{x1:188,y1:14,x2:188,y2:28,stroke:ink,'stroke-width':1}));
  svg.append(svgNode('polyline',{points:'204,28 214,18 222,34 230,16 238,32 248,22 260,28',fill:'none',stroke:accent,'stroke-width':1.3}));
  svg.append(svgNode('rect',{x:200,y:42,width:102,height:18,rx:2,fill:ink}));
  for(const [i,col] of ['#22c55e','#22c55e','#f59e0b','#f59e0b','#ef4444'].entries())svg.append(svgNode('circle',{cx:212+i*10,cy:51,r:2.4,fill:col}));
  svg.append(svgNode('text',{x:280,y:54,'text-anchor':'middle',fill:paper,'font-size':7.5,'font-weight':600},'28.8k'));
 }else if(era.id==='tom-yum-goong'){
  // 1997 contraction chart + 1999 Sukhumvit BTS concrete viaduct and 3-car Skytrain
  svg.append(svgNode('rect',{x:14,y:14,width:92,height:44,fill:paper,stroke:ink,'stroke-width':1}));
  svg.append(svgNode('line',{x1:14,y1:36,x2:106,y2:36,stroke:ink,'stroke-width':.6,'stroke-dasharray':'2 2'}));
  svg.append(svgNode('polyline',{points:'18,22 38,20 56,26 72,52 90,46 102,38',fill:'none',stroke:accent,'stroke-width':2.2}));
  svg.append(svgNode('circle',{cx:72,cy:52,r:3,fill:accent}));
  svg.append(svgNode('rect',{x:120,y:36,width:188,height:6,fill:'#8b9496',stroke:ink,'stroke-width':1.1}));
  for(const x of [144,210,276]){
   svg.append(svgNode('rect',{x,y:42,width:10,height:22,fill:'#8b9496',stroke:ink,'stroke-width':1.1}));
   svg.append(svgNode('polygon',{points:`${x-6},42 ${x+16},42 ${x+12},46 ${x-2},46`,fill:'#8b9496',stroke:ink,'stroke-width':.9}));
  }
  svg.append(svgNode('rect',{x:132,y:20,width:162,height:15,rx:4,fill:paper,stroke:ink,'stroke-width':1.2}));
  svg.append(svgNode('rect',{x:136,y:29,width:154,height:3,fill:'#1d4ed8'}));
  for(let x=142;x<=278;x+=16)svg.append(svgNode('rect',{x,y:23,width:10,height:5,fill:sky,'fill-opacity':.7,stroke:ink,'stroke-width':.6}));
 }else if(era.id==='flood-smartphones'){
  // Shophouse row behind sandbag barrier, 2011 floodwater wave crests, and 3G smartphone
  svg.append(svgNode('rect',{x:18,y:18,width:118,height:34,fill:paper,stroke:ink,'stroke-width':1.1}));
  for(let x=26;x<=120;x+=22)svg.append(svgNode('rect',{x,y:24,width:12,height:14,fill:sky,'fill-opacity':.45,stroke:ink,'stroke-width':.8}));
  svg.append(svgNode('rect',{x:0,y:50,width:214,height:14,fill:'#3b7a8c','fill-opacity':.48}));
  svg.append(svgNode('path',{d:'M4,54 Q20,50 36,54 T68,54 T100,54 T132,54 T164,54 T196,54',fill:'none',stroke:ink,'stroke-width':.9}));
  for(let x=16;x<=176;x+=22)for(const [ rowY,dx] of [[46,0],[40,5]])svg.append(svgNode('rect',{x:x+dx,y:rowY,width:20,height:6,rx:2.5,fill:'#c8b48a',stroke:ink,'stroke-width':.9}));
  svg.append(svgNode('rect',{x:236,y:12,width:48,height:48,rx:5,fill:ink}));
  svg.append(svgNode('rect',{x:240,y:17,width:40,height:35,rx:1,fill:'#e2f1ea'}));
  for(const [gx,gy] of [[244,21],[256,21],[268,21],[244,33],[256,33],[268,33]])svg.append(svgNode('rect',{x:gx,y:gy,width:8,height:8,rx:1.5,fill:accent,'fill-opacity':.8}));
  svg.append(svgNode('circle',{cx:260,cy:56,r:2,fill:paper}));
 }else{
  // Modern multi-line electric rail, street cart with PromptPay QR stand, and solar-roofed home
  svg.append(svgNode('rect',{x:10,y:22,width:126,height:5,fill:'#9aa5a4',stroke:ink,'stroke-width':.9}));
  for(const x of [32,96])svg.append(svgNode('rect',{x,y:27,width:7,height:37,fill:'#9aa5a4',stroke:ink,'stroke-width':.9}));
  svg.append(svgNode('rect',{x:18,y:11,width:104,height:11,rx:3,fill:paper,stroke:ink,'stroke-width':1.1}));
  svg.append(svgNode('rect',{x:22,y:18,width:96,height:2.5,fill:accent}));
  svg.append(svgNode('rect',{x:150,y:22,width:44,height:42,rx:3,fill:paper,stroke:ink,'stroke-width':1.2}));
  svg.append(svgNode('rect',{x:154,y:26,width:36,height:8,fill:'#1e3a8a'}));
  svg.append(svgNode('rect',{x:159,y:38,width:26,height:22,fill:ink}));
  for(const [qx,qy] of [[162,41],[176,41],[162,51],[169,46],[176,51]])svg.append(svgNode('rect',{x:qx,y:qy,width:6,height:6,fill:paper}));
  svg.append(svgNode('polygon',{points:'212,34 256,14 300,34',fill:accent,stroke:ink,'stroke-width':1}));
  svg.append(svgNode('polygon',{points:'236,24 254,16 266,28 246,28',fill:'#1e3a8a','fill-opacity':.75,stroke:paper,'stroke-width':.6}));
  svg.append(svgNode('rect',{x:220,y:34,width:72,height:30,fill:paper,stroke:ink,'stroke-width':1.2}));
  for(const x of [228,248,270])svg.append(svgNode('rect',{x,y:40,width:12,height:14,fill:sky,'fill-opacity':.5,stroke:ink,'stroke-width':.8}));
 }

 svg.append(svgNode('text',{x:10,y:84,fill:ink,'font-size':11,'font-weight':600},`${year} · ${era.eraSpan}`));
 return svg;
}
