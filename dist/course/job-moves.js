// Four real moments when a new job was on offer, with the real record behind each.
// Facts: en.wikipedia.org/wiki/Economy_of_Thailand (real GDP growth, 1980–2025) and en.wikipedia.org/wiki/Tourism_in_Thailand (international arrivals).
// The pay change is authored game tuning (a share of five years' pay), not a measured wage series, and not advice.
const JOBS=[
 {year:1987,known:1995,pay:.12,th:'ปี 2530 โรงงานรอบกรุงเทพฯ กำลังรับคน ค่าแรงดีกว่าทำนาหรือทำร้านเล็กๆ ญาติที่ออกจากหมู่บ้านไปส่งเงินกลับบ้าน',zh:'1987年，曼谷周边的工厂在招人，工资比务农或守小店高。离乡的表哥往家里寄钱。',ja:'1987年、バンコク周辺の工場が人を募集していて、賃金は農作業や小さな店よりいい。村を出たいとこが仕送りをしてくる。',ko:'1987년, 방콕 주변 공장들이 사람을 뽑고, 임금은 농사나 작은 가게보다 낫다. 고향을 떠난 사촌이 돈을 부쳐 온다.',
  prompt:'In 1987, factories around Bangkok are hiring, and the wages beat the farm or the small shop. A cousin who left the village sends money home.',label:'Take the factory job',lth:'รับงานโรงงาน',lzh:'去工厂上班',lja:'工場の仕事に就く',lko:'공장 일을 맡는다',
  after:'From 1987 to 1995 the economy grew by 8% or more every year, and by 13.3% at its fastest. The move paid.',ath:'ตั้งแต่ปี 2530 ถึง 2538 เศรษฐกิจโตไม่ต่ำกว่า 8% ทุกปี และโตสูงสุด 13.3% การย้ายครั้งนี้คุ้ม',azh:'1987至1995年，经济每年增长都不低于8%，最快一年达13.3%。这一步走对了。',aja:'1987年から1995年まで、経済は毎年8%以上成長し、最も速い年は13.3%だった。この転職は報われた。',ako:'1987년부터 1995년까지 경제는 해마다 8% 이상 성장했고, 가장 빠른 해에는 13.3%였다. 이 이직은 보상받았다.'},
 {year:1996,known:1998,pay:-.15,th:'ปี 2539 บริษัทเงินทุนเสนอเงินเดือนมากกว่าเดิมเกือบหนึ่งในสาม',zh:'1996年，一家财务公司开价，比你现在的薪水高出近三分之一。',ja:'1996年、ある金融会社が今より三割近く高い給料で誘ってくる。',ko:'1996년, 한 금융회사가 지금보다 3분의 1 가까이 높은 급여를 제안한다.',
  prompt:'In 1996, a finance company offers you almost a third more pay to join.',label:'Take the finance job',lth:'รับงานบริษัทเงินทุน',lzh:'去财务公司',lja:'金融会社に移る',lko:'금융회사로 옮긴다',
  after:'In 1997 the baht was floated. The economy shrank by 2.8% in 1997 and 7.6% in 1998, and the government closed 56 financial institutions. The move cost you.',ath:'ปี 2540 ค่าเงินบาทถูกปล่อยลอยตัว เศรษฐกิจหดตัว 2.8% ในปี 2540 และ 7.6% ในปี 2541 และรัฐบาลสั่งปิดสถาบันการเงิน 56 แห่ง การย้ายครั้งนี้เสียหาย',azh:'1997年泰铢实行浮动汇率。经济1997年萎缩2.8%，1998年萎缩7.6%，政府关闭了56家金融机构。这一步走错了。',aja:'1997年にバーツは変動相場制に移った。経済は1997年に2.8%、1998年に7.6%縮み、政府は56の金融機関を閉鎖した。この転職は裏目に出た。',ako:'1997년 바트는 변동환율제로 넘어갔다. 경제는 1997년 2.8%, 1998년 7.6% 줄었고, 정부는 금융기관 56곳을 폐쇄했다. 이 이직은 손해로 돌아왔다.'},
 {year:2010,known:2015,pay:.12,th:'ปี 2553 โรงแรม บริษัททัวร์ และสายการบินกำลังรับคน ปีนี้มีนักท่องเที่ยวต่างชาติราว 16 ล้านคน',zh:'2010年，酒店、旅行社和航空公司都在招人。今年来了约1600万外国游客。',ja:'2010年、ホテルも旅行会社も航空会社も人を募集している。今年は外国人観光客が約1600万人来た。',ko:'2010년, 호텔, 여행사, 항공사가 사람을 뽑고 있다. 올해 외국인 방문객이 약 1,600만 명 왔다.',
  prompt:'In 2010, hotels, tour companies and airlines are hiring. About 16 million foreign visitors came this year.',label:'Take the tourism job',lth:'รับงานท่องเที่ยว',lzh:'去旅游业工作',lja:'観光の仕事に就く',lko:'관광 일을 맡는다',
  after:'Visitors rose from about 16 million in 2010 to about 30 million in 2015. The move paid.',ath:'นักท่องเที่ยวเพิ่มจากราว 16 ล้านคนในปี 2553 เป็นราว 30 ล้านคนในปี 2558 การย้ายครั้งนี้คุ้ม',azh:'游客从2010年约1600万人增至2015年约3000万人。这一步走对了。',aja:'訪問者は2010年の約1600万人から2015年の約3000万人に増えた。この転職は報われた。',ako:'방문객은 2010년 약 1,600만 명에서 2015년 약 3,000만 명으로 늘었다. 이 이직은 보상받았다.'},
 {year:2019,known:2024,pay:-.2,th:'ปี 2562 กลุ่มโรงแรมเสนองานให้คุณ ปีนี้มีนักท่องเที่ยวเกือบ 40 ล้านคน',zh:'2019年，一家酒店集团向你开出工作。今年来了近4000万游客。',ja:'2019年、あるホテルグループが仕事を提示してきた。今年は訪問者が4000万人近く来た。',ko:'2019년, 한 호텔 그룹이 일자리를 제안한다. 올해 방문객이 4,000만 명 가까이 왔다.',
  prompt:'In 2019, a hotel group offers you a job. Almost 40 million visitors came this year.',label:'Take the tourism job',lth:'รับงานท่องเที่ยว',lzh:'去旅游业工作',lja:'観光の仕事に就く',lko:'관광 일을 맡는다',
  after:'Visitors fell to 6.7 million in 2020 and to 0.4 million in 2021, and were back to 35.5 million only in 2024. The move cost you.',ath:'นักท่องเที่ยวลดเหลือ 6.7 ล้านคนในปี 2563 และ 0.4 ล้านคนในปี 2564 และกลับมาอยู่ที่ 35.5 ล้านคนในปี 2567 การย้ายครั้งนี้เสียหาย',azh:'游客2020年降至670万人，2021年降至40万人，直到2024年才回到3550万人。这一步走错了。',aja:'訪問者は2020年に670万人、2021年に40万人まで落ち、2024年にようやく3550万人に戻った。この転職は裏目に出た。',ako:'방문객은 2020년 670만 명, 2021년 40만 명으로 떨어졌고 2024년에야 3,550만 명으로 돌아왔다. 이 이직은 손해로 돌아왔다.'}
];
const CONTEXT='This is the whole record so far. Nobody can show you next year.',STAY='Stay where you are'/* already translated elsewhere */,STAY_COST='If the new job does well, you will hear about it.',MOVE_COST='If the whole sector turns, your pay turns with it.';
const MIN_AGE=20,thY=y=>y+543;
export const JOB_STATIONS=[20,25,30,35,40,45];
const moveNote=m=>`You took the new job in ${m.year}.`,stayNote=m=>`You stayed in your own work in ${m.year}.`;
export const JOB_PIVOTS=JOBS.flatMap(m=>JOB_STATIONS.map(station=>({id:`job-${m.year}-${station}`,station,job:m.year,prompt:m.prompt,context:CONTEXT,options:[
 {id:'stay',label:STAY,cost:STAY_COST,effects:{},flags:{['job'+m.year+'o']:station},note:stayNote(m)},
 {id:'move',label:m.label,cost:MOVE_COST,effects:{},flags:{['job'+m.year]:station},note:moveNote(m)}]})));
export const jobFits=(pivot,birthYear)=>{const m=JOBS.find(x=>x.year===pivot.job);return !!m&&birthYear!==null&&pivot.station>=MIN_AGE&&birthYear+pivot.station<=m.year&&m.year<birthYear+pivot.station+5;};
// Pays at the first review at or after year+5, so the line only tells what the player could by then know.
// The first review whose year reaches the last year the line mentions.
const dueAt=(m,s,birthYear)=>{let f=s+5;while(birthYear+f<m.known)f+=5;return f;};
// The road not taken is told at the same review, with no money moved: "you will hear about it" is kept.
const V={en:[' The move paid.',' The move cost you.'],th:[' การย้ายครั้งนี้คุ้ม',' การย้ายครั้งนี้เสียหาย'],zh:['这一步走对了。','这一步走错了。'],ja:['この転職は報われた。','この転職は裏目に出た。'],ko:[' 이 이직은 보상받았다.',' 이 이직은 손해로 돌아왔다.']};
const MISS={en:[' Had you moved, it would have paid.',' Had you moved, it would have cost you.'],th:[' ถ้าย้ายไป คุณจะได้ผลดี',' ถ้าย้ายไป คุณจะเสียหาย'],zh:['要是去了，这一步本会走对。','要是去了，这一步本会走错。'],ja:['もし移っていれば、報われていた。','もし移っていれば、裏目に出ていた。'],ko:[' 옮겼다면 보상받았을 것이다.',' 옮겼다면 손해를 봤을 것이다.']};
const missLine=(text,l)=>{for(const i of [0,1])if(text.endsWith(V[l][i]))return text.slice(0,-V[l][i].length)+MISS[l][i];throw new Error('job line without a verdict: '+text);};
export const jobsDue=(flags,from,monthlyPay,birthYear)=>birthYear===null?[]:JOBS.flatMap(m=>{const s=flags?.['job'+m.year],o=flags?.['job'+m.year+'o'];
 return Number.isInteger(s)&&from===dueAt(m,s,birthYear)?[{year:m.year,gain:Math.round(m.pay*monthlyPay*60),text:m.after}]:Number.isInteger(o)&&from===dueAt(m,o,birthYear)?[{year:m.year,gain:0,missed:true,text:missLine(m.after,'en')}]:[];});
export const JOB_PHRASES=[
 [STAY_COST,'ถ้างานใหม่ไปได้ดี จะมีคนมาเล่าให้ฟัง','新工作要是干得好，会有人告诉你的。','新しい仕事がうまくいけば、誰かが教えてくれる。','새 일이 잘 풀리면 누군가 말해 줄 것이다.'],
 [MOVE_COST,'ถ้าทั้งภาคส่วนเปลี่ยนทิศ ค่าจ้างคุณก็เปลี่ยนตาม','整个行业转向时，你的薪水也跟着转。','業界全体が転じれば、あなたの給料も一緒に転じる。','업종 전체가 돌아서면 당신의 급여도 함께 돌아선다.'],
 ...JOBS.flatMap(m=>[
  [m.prompt,m.th,m.zh,m.ja,m.ko],[m.label,m.lth,m.lzh,m.lja,m.lko],[m.after,m.ath,m.azh,m.aja,m.ako],
  [missLine(m.after,'en'),missLine(m.ath,'th'),missLine(m.azh,'zh'),missLine(m.aja,'ja'),missLine(m.ako,'ko')],
  [moveNote(m),`ปี ${thY(m.year)} คุณรับงานใหม่`,`${m.year}年，你换了新工作。`,`${m.year}年、新しい仕事に就いた。`,`${m.year}년, 새 일을 맡았다.`],
  [stayNote(m),`ปี ${thY(m.year)} คุณทำงานเดิมต่อ`,`${m.year}年，你留在了原来的行当。`,`${m.year}年、今の仕事に残った。`,`${m.year}년, 하던 일에 남았다.`]])
].filter((r,i,a)=>a.findIndex(x=>x[0]===r[0])===i);
