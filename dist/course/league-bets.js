// English top-flight seasons, with the real top three of each (en.wikipedia.org/wiki/List_of_English_football_champions).
// Key = the year the season began. A bet is placed before the season; it pays at the next review.
// Stakes and multiples are authored game tuning, not bookmaker odds, and not advice.
export const LEAGUE={
 1980:["Aston Villa", "Ipswich Town", "Arsenal"],
 1981:["Liverpool", "Ipswich Town", "Manchester United"],
 1982:["Liverpool", "Watford", "Manchester United"],
 1983:["Liverpool", "Southampton", "Nottingham Forest"],
 1984:["Everton", "Liverpool", "Tottenham Hotspur"],
 1985:["Liverpool", "Everton", "West Ham United"],
 1986:["Everton", "Liverpool", "Tottenham Hotspur"],
 1987:["Liverpool", "Manchester United", "Nottingham Forest"],
 1988:["Arsenal", "Liverpool", "Nottingham Forest"],
 1989:["Liverpool", "Aston Villa", "Tottenham Hotspur"],
 1990:["Arsenal", "Liverpool", "Crystal Palace"],
 1991:["Leeds United", "Manchester United", "Sheffield Wednesday"],
 1992:["Manchester United", "Aston Villa", "Norwich City"],
 1993:["Manchester United", "Blackburn Rovers", "Newcastle United"],
 1994:["Blackburn Rovers", "Manchester United", "Nottingham Forest"],
 1995:["Manchester United", "Newcastle United", "Liverpool"],
 1996:["Manchester United", "Newcastle United", "Arsenal"],
 1997:["Arsenal", "Manchester United", "Liverpool"],
 1998:["Manchester United", "Arsenal", "Chelsea"],
 1999:["Manchester United", "Arsenal", "Leeds United"],
 2000:["Manchester United", "Arsenal", "Liverpool"],
 2001:["Arsenal", "Liverpool", "Manchester United"],
 2002:["Manchester United", "Arsenal", "Newcastle United"],
 2003:["Arsenal", "Chelsea", "Manchester United"],
 2004:["Chelsea", "Arsenal", "Manchester United"],
 2005:["Chelsea", "Manchester United", "Liverpool"],
 2006:["Manchester United", "Chelsea", "Liverpool"],
 2007:["Manchester United", "Chelsea", "Arsenal"],
 2008:["Manchester United", "Liverpool", "Chelsea"],
 2009:["Chelsea", "Manchester United", "Arsenal"],
 2010:["Manchester United", "Chelsea", "Manchester City"],
 2011:["Manchester City", "Manchester United", "Arsenal"],
 2012:["Manchester United", "Manchester City", "Chelsea"],
 2013:["Manchester City", "Liverpool", "Chelsea"],
 2014:["Chelsea", "Manchester City", "Arsenal"],
 2015:["Leicester City", "Arsenal", "Tottenham Hotspur"],
 2016:["Chelsea", "Tottenham Hotspur", "Manchester City"],
 2017:["Manchester City", "Manchester United", "Tottenham Hotspur"],
 2018:["Manchester City", "Liverpool", "Chelsea"],
 2019:["Liverpool", "Manchester City", "Manchester United"],
 2020:["Manchester City", "Manchester United", "Liverpool"],
 2021:["Manchester City", "Liverpool", "Chelsea"],
 2022:["Manchester City", "Arsenal", "Manchester United"],
 2023:["Manchester City", "Arsenal", "Liverpool"],
 2024:["Liverpool", "Arsenal", "Manchester City"]
};
const MIN_SAVINGS=5000,FIRST=1981,LAST=2024,MULT={c1:.8,c2:2,c3:3,out:5};
export const LEAGUE_STATIONS=[20,25,30,35,40,45,50,55,60,65,70,75];
const season=y=>`${y}–${String((y+1)%100).padStart(2,'0')}`;
const PICKS=['c1','c2','c3','out'];
const OUT_LABEL='Stay out of it',OUT_COST='Nothing changes. The money stays where it is.',IN_COST='If it does not come in, a tenth of your savings is gone.',OUTSIDE='Back a club outside last year’s top three';
const prompt=y=>{const[a,b,c]=LEAGUE[y-1];return `Before the ${season(y)} season. Last year ${a} finished first, ${b} second, ${c} third. Someone at work is collecting bets on the English league.`};
const label=(y,k)=>k==='out'?OUTSIDE:k==='c1'?`Back ${LEAGUE[y-1][0]} again`:`Back ${LEAGUE[y-1][PICKS.indexOf(k)]}`;
const inNote=(y,k)=>`You put a tenth of your savings on ${k==='out'?'a club outside last year’s top three':LEAGUE[y-1][PICKS.indexOf(k)]} for ${season(y)}.`,outNote=y=>`You did not bet on the ${season(y)} season.`;
const wins=(y,k)=>k==='out'?!LEAGUE[y-1].includes(LEAGUE[y][0]):LEAGUE[y][0]===LEAGUE[y-1][PICKS.indexOf(k)];
const after=(y,win)=>`${LEAGUE[y][0]} won the ${season(y)} league. ${win?'Your bet came in, and paid back more than you staked.':'Your bet did not come in. The tenth you staked is gone.'}`;
export const LEAGUE_PIVOTS=Array.from({length:LAST-FIRST+1},(_,i)=>FIRST+i).flatMap(y=>LEAGUE_STATIONS.map(station=>({id:`lg-${y}-${station}`,station,league:y,prompt:prompt(y),context:'The table up to now is all there is. Nobody can show you this season.',options:[
 {id:'stay',label:OUT_LABEL,cost:OUT_COST,effects:{},flags:{['lg'+y+'o']:station},note:outNote(y)},
 ...PICKS.map(k=>({id:k,label:label(y,k),cost:IN_COST,effects:{},flags:{['lg'+y]:station,['lg'+y+'p']:PICKS.indexOf(k)+1},tenthStake:'lg'+y+'a',note:inNote(y,k)}))]})));
export const leagueFits=(pivot,savings,birthYear)=>birthYear!==null&&pivot.league>=FIRST&&pivot.league<=LAST&&birthYear+pivot.station<=pivot.league&&pivot.league<birthYear+pivot.station+5&&savings>=MIN_SAVINGS;
// Staying out is recorded too: the review shows who won, with no money moved.
const MISS='You had stayed out of it.',MISS_T={th:(c,y)=>`${c} เป็นแชมป์ลีก ${season(y)} คุณไม่ได้แทง`,zh:(c,y)=>`${c}夺得${season(y)}赛季联赛冠军。你没有下注。`,ja:(c,y)=>`${c}が${season(y)}シーズンのリーグを制した。あなたは賭けなかった。`,ko:(c,y)=>`${season(y)} 시즌 리그 우승은 ${c}. 당신은 걸지 않았다.`};
const missed=y=>`${LEAGUE[y][0]} won the ${season(y)} league. ${MISS}`;
export const leaguesDue=(flags,from)=>{const out=[];for(let y=FIRST;y<=LAST;y++){if(flags?.['lg'+y+'o']+5===from&&!flags['lg'+y+'p'])out.push({year:y,win:null,gain:0,text:missed(y)});const k=PICKS[(flags?.['lg'+y+'p']??0)-1];if(!k||flags['lg'+y]+5!==from)continue;const stake=flags['lg'+y+'a']??0,win=wins(y,k);out.push({year:y,win,gain:win?Math.round(stake*MULT[k]):-stake,text:after(y,win)});}return out;};
const T={
 th:{prompt:(y,a,b,c)=>`ก่อนฤดูกาล ${season(y)} ฤดูกาลที่แล้ว ${a} จบที่หนึ่ง ${b} ที่สอง ${c} ที่สาม คนที่ทำงานกำลังรับแทงบอลลีกอังกฤษ`,back:n=>`แทง ${n}`,again:n=>`แทง ${n} อีกครั้ง`,outside:'แทงทีมนอกสามอันดับแรกของปีที่แล้ว',inN:(y,n)=>`คุณเอาเงินเก็บหนึ่งในสิบแทง ${n} ในฤดูกาล ${season(y)}`,inO:y=>`คุณเอาเงินเก็บหนึ่งในสิบแทงทีมนอกสามอันดับแรกของปีที่แล้ว ในฤดูกาล ${season(y)}`,outN:y=>`คุณไม่ได้แทงบอลฤดูกาล ${season(y)}`,after:(y,w)=>`${LEAGUE[y][0]} เป็นแชมป์ลีก ${season(y)} ${w?'เดิมพันของคุณเข้า และได้คืนมากกว่าที่ลงไป':'เดิมพันของคุณไม่เข้า เงินหนึ่งในสิบที่ลงไปหายไปแล้ว'}`},
 zh:{prompt:(y,a,b,c)=>`${season(y)}赛季开始前。去年${a}第一，${b}第二，${c}第三。单位里有人在收英格兰顶级联赛的赌注。`,back:n=>`押${n}`,again:n=>`再押${n}`,outside:'押去年前三名之外的球队',inN:(y,n)=>`${season(y)}赛季，你拿十分之一的积蓄押了${n}。`,inO:y=>`${season(y)}赛季，你拿十分之一的积蓄押了去年前三名之外的球队。`,outN:y=>`${season(y)}赛季，你没有下注。`,after:(y,w)=>`${LEAGUE[y][0]}夺得${season(y)}赛季联赛冠军。${w?'你的赌注押中了，拿回的比押下的多。':'你的赌注没有押中。押下的十分之一没了。'}`},
 ja:{prompt:(y,a,b,c)=>`${season(y)}シーズンの前。昨季は${a}が一位、${b}が二位、${c}が三位だった。職場の誰かがイングランドのリーグの賭けを集めている。`,back:n=>`${n}に賭ける`,again:n=>`もう一度${n}に賭ける`,outside:'昨季の上位三つの外のクラブに賭ける',inN:(y,n)=>`${season(y)}シーズン、貯金の十分の一を${n}に賭けた。`,inO:y=>`${season(y)}シーズン、貯金の十分の一を昨季の上位三つの外のクラブに賭けた。`,outN:y=>`${season(y)}シーズンには賭けなかった。`,after:(y,w)=>`${LEAGUE[y][0]}が${season(y)}シーズンのリーグを制した。${w?'あなたの賭けは当たり、賭けた額より多く戻ってきた。':'あなたの賭けは外れた。賭けた十分の一は消えた。'}`},
 ko:{prompt:(y,a,b,c)=>`${season(y)} 시즌 전. 지난해에는 1위는 ${a}, 2위는 ${b}, 3위는 ${c}였다. 직장의 누군가가 잉글랜드 리그에 거는 돈을 걷고 있다.`,back:n=>`${n}에 건다`,again:n=>`${n}에 다시 건다`,outside:'작년 상위 세 팀 밖의 팀에 건다',inN:(y,n)=>`${season(y)} 시즌, 저축의 십분의 일을 ${n}에 걸었다.`,inO:y=>`${season(y)} 시즌, 저축의 십분의 일을 작년 상위 세 팀 밖의 팀에 걸었다.`,outN:y=>`${season(y)} 시즌에는 걸지 않았다.`,after:(y,w)=>`${season(y)} 시즌 리그 우승은 ${LEAGUE[y][0]}. ${w?'당신의 내기는 맞았고, 건 돈보다 더 많이 돌아왔다.':'당신의 내기는 빗나갔다. 건 십분의 일은 사라졌다.'}`}
};
const L=['th','zh','ja','ko'],row=(en,f)=>[en,...L.map(l=>f(T[l]))];
const SEEN=new Set(),once=rows=>rows.filter(r=>!SEEN.has(r[0])&&SEEN.add(r[0])); // a club's label recurs across seasons; the dictionary wants each English line once
export const LEAGUE_PHRASES=once([
 [OUT_LABEL,'ไม่แทง','不下注','賭けない','걸지 않는다'],
 [OUT_COST,'ไม่มีอะไรเปลี่ยน เงินยังอยู่ที่เดิม','什么都不会变。钱还在原处。','何も変わらない。金はそのままだ。','달라지는 것은 없다. 돈은 그대로 있다.'],
 [IN_COST,'ถ้าไม่เข้า เงินเก็บหนึ่งในสิบก็หายไป','押不中的话，十分之一的积蓄就没了。','外れれば、貯金の十分の一が消える。','맞지 않으면 저축의 십분의 일이 사라진다.'],
 [OUTSIDE,...L.map(l=>T[l].outside)],
 ['The table up to now is all there is. Nobody can show you this season.','ตารางจนถึงตอนนี้คือทั้งหมดที่มี ไม่มีใครบอกฤดูกาลนี้ได้','到目前为止的积分榜就是全部。这个赛季，谁也给不了你看。','今までの順位表がすべてだ。このシーズンを見せられる人はいない。','지금까지의 순위표가 전부다. 이번 시즌을 보여 줄 수 있는 사람은 없다.'],
 ...Array.from({length:LAST-FIRST+1},(_,i)=>FIRST+i).flatMap(y=>{const[a,b,c]=LEAGUE[y-1];return[
  row(prompt(y),t=>t.prompt(y,a,b,c)),row(outNote(y),t=>t.outN(y)),
  ...[a,b,c].map((n,i)=>row(label(y,PICKS[i]),t=>(i?t.back:t.again)(n))),
  ...[a,b,c].map((n,i)=>row(inNote(y,PICKS[i]),t=>t.inN(y,n))),
  row(inNote(y,'out'),t=>t.inO(y)),row(after(y,true),t=>t.after(y,true)),row(after(y,false),t=>t.after(y,false)),
  [missed(y),...L.map(l=>MISS_T[l](LEAGUE[y][0],y))]];})
]);
