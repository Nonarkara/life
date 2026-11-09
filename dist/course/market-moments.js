// Five real moments in the Thai stock market, with the real record in front of the player.
// Index: SET Index year-end closes, as tabulated at en.wikipedia.org/wiki/SET_Index.
// Stakes are authored game tuning. Payoffs are the real five-year change in the index,
// before dividends: a game rule, not investment advice.
export const SET_CLOSE={1975:84.08,1976:82.7,1977:181.59,1978:257.73,1979:149.4,1980:124.67,1981:106.62,1982:123.5,1983:134.47,1984:142.29,1985:134.95,1986:207.2,1987:284.94,1988:386.73,1989:879.19,1990:612.86,1991:711.36,1992:893.42,1993:1682.85,1994:1360.09,1995:1280.81,1996:831.57,1997:372.69,1998:355.81,1999:481.92,2000:269.19,2001:303.85,2002:356.48,2003:772.15,2004:668.1,2005:713.73,2006:679.84,2007:858.1,2008:449.96,2009:734.54,2010:1032.76,2011:1025.32,2012:1391.93,2013:1298.71,2014:1497.67,2015:1288.02,2016:1542.94,2017:1753.71,2018:1563.88,2019:1579.84,2020:1449.35,2021:1657.62,2022:1668.66,2023:1415.85,2024:1400.21,2025:1259.67};
const MIN_SAVINGS=5000; // ponytail: below this there is nothing to decide.
const idx=y=>Math.round(SET_CLOSE[y]).toLocaleString('en');
const M=[
 {year:1978,high:true,prompt:'The Bangkok stock market has tripled in two years. Someone at your work has bought a motorcycle with the winnings.',th:'ตลาดหุ้นกรุงเทพฯ โตสามเท่าในสองปี คนที่ทำงานเดียวกันถอยมอเตอร์ไซค์ด้วยกำไรจากหุ้น',zh:'曼谷股市两年涨了三倍。单位里有人用赚来的钱买了摩托车。',ja:'バンコクの株式市場は二年で三倍になった。職場の誰かが儲けでオートバイを買った。',ko:'방콕 증시가 2년 만에 세 배가 됐다. 직장의 누군가는 번 돈으로 오토바이를 샀다.'},
 {year:1993,high:true,prompt:'The index has nearly doubled this year. Your barber is giving tips.',th:'ดัชนีเกือบเท่าตัวในปีเดียว ช่างตัดผมเริ่มบอกหุ้น',zh:'指数今年几乎翻了一番。理发师都在荐股。',ja:'指数は今年だけでほぼ二倍になった。床屋まで銘柄を勧めてくる。',ko:'지수가 올해 거의 두 배가 됐다. 이발사까지 종목을 추천한다.'},
 {year:1998,high:false,prompt:'The index has lost almost four-fifths since 1993. The people who talked about shares at dinner have stopped.',th:'ดัชนีหายไปเกือบสี่ในห้านับจากปี 2536 คนที่เคยคุยเรื่องหุ้นบนโต๊ะอาหารเลิกพูดกันแล้ว',zh:'指数比1993年跌去近五分之四。饭桌上谈股票的人都不谈了。',ja:'指数は1993年から五分の四近くを失った。夕食の席で株を語っていた人たちは口を閉ざした。',ko:'지수는 1993년 이후 거의 5분의 4를 잃었다. 저녁 자리에서 주식을 얘기하던 사람들이 입을 닫았다.'},
 {year:2008,high:false,prompt:'Banks are failing in America, and the Bangkok index has almost halved in twelve months.',th:'ธนาคารในอเมริกากำลังล้ม ดัชนีกรุงเทพฯ หายไปเกือบครึ่งในสิบสองเดือน',zh:'美国的银行接连倒闭，曼谷指数十二个月内几乎腰斩。',ja:'アメリカで銀行が倒れ、バンコクの指数は十二か月でほぼ半分になった。',ko:'미국 은행들이 무너지고, 방콕 지수는 열두 달 만에 거의 반토막 났다.'},
 {year:2017,high:true,prompt:'The index has closed the year higher than any December before it. The bank pays almost nothing on savings.',th:'ดัชนีปิดสิ้นปีสูงกว่าทุกเดือนธันวาคมที่ผ่านมา ส่วนเงินฝากแทบไม่ได้ดอกเบี้ย',zh:'指数年底收盘高过此前每一个十二月。银行存款几乎没有利息。',ja:'指数はこれまでのどの十二月よりも高く年を終えた。銀行の預金にはほとんど利息がつかない。',ko:'지수가 역대 어느 12월보다 높게 한 해를 마쳤다. 은행 예금에는 이자가 거의 붙지 않는다.'}
].map(m=>({...m,per100:Math.round(100*SET_CLOSE[m.year+5]/SET_CLOSE[m.year])}));
const CONTEXT='This is the whole record so far. Nobody can show you next year.',IN_COST='If it falls, it falls with your money.',OUT_COST='If it rises, you will hear about it.';
const IN_LABEL='Put half your savings in',inNote=m=>`You put half your savings into the market in ${m.year}.`,outNote=m=>`You kept your money out of the market in ${m.year}.`,afterLine=m=>`By ${m.year+5} the index stood at ${idx(m.year+5)}. Every ฿100 you put in was worth ฿${m.per100}.`;
const OUT='Keep it out';
export const MARKET_STATIONS=[20,25,30,35,40,45,50,55,60,65,70,75];
export const MARKET_PIVOTS=M.flatMap(m=>MARKET_STATIONS.map(station=>({id:`mkt-${m.year}-${station}`,station,market:m.year,prompt:m.prompt,context:CONTEXT,options:[
 {id:'out',label:OUT,cost:OUT_COST,effects:{},note:outNote(m)},
 {id:'in',label:IN_LABEL,cost:IN_COST,effects:{},flags:{['set'+m.year]:station},halfStake:'set'+m.year+'a',note:inNote(m)}]})));
export const marketFits=(pivot,savings,birthYear)=>{const m=M.find(x=>x.year===pivot.market);return !!m&&birthYear!==null&&birthYear+pivot.station<=m.year&&m.year<birthYear+pivot.station+5&&savings>=MIN_SAVINGS;};
export const marketsDue=(flags,from)=>M.filter(m=>flags?.['set'+m.year]+5===from).map(m=>({gain:Math.round((flags['set'+m.year+'a']??0)*(m.per100-100)/100),text:afterLine(m)}));
export const marketMoment=year=>M.find(m=>m.year===year);
const thY=y=>y+543;
export const MARKET_PHRASES=[
 [IN_LABEL,'ลงครึ่งหนึ่งของเงินเก็บ','投入一半积蓄','貯金の半分を入れる','저축의 절반을 넣는다'],
 [CONTEXT,'นี่คือตัวเลขทั้งหมดเท่าที่มี ไม่มีใครบอกปีหน้าได้','这是到目前为止的全部记录。明年的事，谁也给不了你看。','これが今までの記録のすべてだ。来年を見せられる人はいない。','지금까지의 기록 전부다. 내년을 보여 줄 수 있는 사람은 없다.'],
 [IN_COST,'ถ้ามันร่วง เงินก็ร่วงไปด้วย','跌的时候，跌的是你的钱。','下がるときは、あなたの金も一緒に下がる。','떨어지면 당신 돈도 함께 떨어진다.'],
 [OUT_COST,'ถ้ามันขึ้น จะมีคนมาเล่าให้ฟัง','涨的时候，会有人告诉你的。','上がったら、誰かが教えてくれる。','오르면 누군가 말해 줄 것이다.'],
 [OUT,'เก็บไว้ ไม่ลง','不投','手を出さない','넣지 않는다'],
 ...M.flatMap(m=>[
  [m.prompt,m.th,m.zh,m.ja,m.ko],
  [inNote(m),`ปี ${thY(m.year)} คุณเอาเงินเก็บครึ่งหนึ่งลงตลาดหุ้น`,`${m.year}年，你把一半积蓄投进了股市。`,`${m.year}年、貯金の半分を市場に入れた。`,`${m.year}년, 저축의 절반을 시장에 넣었다.`],
  [outNote(m),`ปี ${thY(m.year)} คุณไม่เอาเงินลงตลาดหุ้น`,`${m.year}年，你没有把钱投进股市。`,`${m.year}年、金を市場に入れなかった。`,`${m.year}년, 돈을 시장에 넣지 않았다.`],
  [afterLine(m),`ถึงปี ${thY(m.year+5)} ดัชนีอยู่ที่ ${idx(m.year+5)} ทุก ๆ ฿100 ที่ลงไปมีค่า ฿${m.per100}`,`到${m.year+5}年，指数是${idx(m.year+5)}。你投入的每฿100值฿${m.per100}。`,`${m.year+5}年、指数は${idx(m.year+5)}になった。入れた฿100は฿${m.per100}になっていた。`,`${m.year+5}년, 지수는 ${idx(m.year+5)}이었다. 넣은 ฿100는 ฿${m.per100}가 되어 있었다.`]
 ])
];
export function marketRecord(state){return state.history.flatMap(r=>r.pivots??[]).filter(p=>/^mkt-/.test(p.pivot)).map(p=>{const m=marketMoment(Number(p.pivot.split('-')[1]));return {year:m.year,bought:p.choice==='in',high:m.high,at:SET_CLOSE[m.year],after:SET_CLOSE[m.year+5]};});}
