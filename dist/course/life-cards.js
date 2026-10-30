// The life card: two portrait photos, a front and a back, like a baseball card.
// Everything is drawn from the saved record (no invented praise, no verdict on a good life),
// on a fixed grid so nothing can overlap: every block owns its rows and text is clipped by
// measuring, never by guessing.
import {t} from './i18n.js';
import {ikigai} from './ikigai.js';
import {netWorth} from './finance.js';
import {PATHWAYS} from './pathways.js';
import {encodeBirth} from './birthcode.js';

const W=1080,H=1512,M=60,IN=W-2*M,PAPER='#f4f0e6',INK='#192e2c',DECK='#0a0e14',AMBER='#f59e0b',MUTED='#55645c',RULE='#b4b9a9';
const SANS='"Jost","Prompt","Noto Sans SC","Noto Sans JP","Noto Sans KR",sans-serif',MONO='"JetBrains Mono",ui-monospace,monospace';
const money=n=>{const a=Math.abs(n),s=n<0?'−':'';return s+'฿'+(a>=1e6?(a/1e6).toFixed(a>=1e7?0:1)+'M':a>=1e3?Math.round(a/1e3)+'k':Math.round(a));};
const seg=typeof Intl!=='undefined'&&Intl.Segmenter?new Intl.Segmenter(undefined,{granularity:'word'}):null;

// Wrap to a width and a line count; the last line ends in an ellipsis rather than overflowing.
function lines(g,text,width,max){
 const parts=seg?[...seg.segment(text)].map(s=>s.segment):text.match(/\S+\s*|\s+/g)??[],out=[];let line='';
 for(const p of parts){if(g.measureText(line+p).width<=width||!line||/^[.,;:!?…。、！？)”"'’]+$/.test(p))line+=p;else{out.push(line.trimEnd());line=p.trimStart();}}
 if(line)out.push(line.trimEnd());
 if(out.length>max){out.length=max;let l=out[max-1];while(l&&g.measureText(l+'…').width>width)l=l.slice(0,-1);out[max-1]=l.trimEnd()+'…';}
 return out;
}
function paragraph(g,text,x,y,width,max,lh){const ls=lines(g,text,width,max);ls.forEach((l,i)=>g.fillText(l,x,y+i*lh));return y+ls.length*lh;}
function sheet(label,right){
 const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.textBaseline='alphabetic';
 g.fillStyle=PAPER;g.fillRect(0,0,W,H);
 g.fillStyle=DECK;g.fillRect(0,0,W,84);g.fillRect(0,H-72,W,72);
 g.fillStyle=PAPER;g.font='600 34px '+SANS;g.fillText('Life2.0',M,55);
 g.font='20px '+MONO;g.textAlign='right';g.fillText(right,W-M,53);g.textAlign='left';
 g.fillStyle=PAPER;g.font='20px '+MONO;g.fillText('LIFE.NONARKARA.ORG',M,H-28);
 g.textAlign='right';g.fillText(label,W-M,H-28);g.textAlign='left';
 return {c,g};
}
const micro=(g,text,x,y,color=MUTED)=>{g.fillStyle=color;g.font='20px '+MONO;g.fillText(text.toUpperCase(),x,y);};
const hair=(g,y,x0=M,x1=W-M,color=RULE,w=2)=>{g.fillStyle=color;g.fillRect(x0,y,x1-x0,w);};
const blob=c=>new Promise(r=>c.toBlob(r,'image/png'));

function front(state,words){
 const code=encodeBirth(state)??'',{c,g}=sheet(t('Life record').toUpperCase(),code?'№ '+code:'');
 // 1 · identity: where, what kind of home
 g.fillStyle=INK;g.font='600 56px '+SANS;let y=paragraph(g,t(state.birth.place),M,176,IN,2,64);
 g.fillStyle=MUTED;g.font='28px '+SANS;y=paragraph(g,t(state.birth.home??''),M,y+4,IN,1,36);
 hair(g,y+24,M,W-M,INK,4);
 // 2 · hero: years lived, and how it ended
 const top=y+24+4;g.fillStyle=INK;g.font='600 220px '+SANS;g.fillText(String(state.age),M,top+190);
 const hx=M+g.measureText(String(state.age)).width+36;micro(g,t('Years lived'),hx,top+84);
 g.fillStyle=INK;g.font='28px '+SANS;paragraph(g,state.death?t(state.death.cause):t('A full life, to the last chapter.'),hx,top+130,W-M-hx,3,38);
 // 3 · the curve: health and mood across a fixed 0–80 axis, so an early end shows as an early end
 const cy=top+270,ch=300,cw=IN;micro(g,t('Health'),M,cy);g.fillStyle=INK;g.fillRect(M+150,cy-12,36,5);micro(g,t('Mood'),M+230,cy);g.fillStyle=AMBER;g.fillRect(M+300,cy-12,36,5);
 const by=cy+24,x=a=>M+a/80*cw,yy=v=>by+ch-v/100*ch;
 for(const v of [0,25,50,75,100])hair(g,yy(v)-1,M,W-M,v===0?INK:RULE,v===0?3:1);
 for(let a=0;a<=80;a+=20){micro(g,String(a),Math.min(x(a),W-M-30),by+ch+30);}
 const pts=(state.history??[]).filter(r=>r.age<=state.age).map(r=>[r.age,r.health,r.wellbeing]);if(!pts.length||pts.at(-1)[0]<state.age)pts.push([state.age,state.health,state.wellbeing]);
 for(const [i,color] of [[1,INK],[2,AMBER]]){g.strokeStyle=color;g.lineWidth=5;g.lineJoin='round';g.beginPath();pts.forEach((p,k)=>k?g.lineTo(x(p[0]),yy(p[i])):g.moveTo(x(p[0]),yy(p[i])));g.stroke();}
 g.fillStyle=INK;g.fillRect(x(state.age)-3,by,6,ch);
 for(const e of state.story?.seen??[]){g.fillStyle=INK;g.fillRect(x(e.age)-5,by+ch+4,10,10);}
 // 4 · three numbers
 const sy=by+ch+86;hair(g,sy,M,W-M,INK,3);const col=IN/3,wealth=netWorth(state.finance);
 [[t('Health'),Math.round(state.health)+''],[t('Mood'),Math.round(state.wellbeing)+''],[t('Net worth'),money(wealth)]].forEach(([l,v],i)=>{const cx=M+i*col;micro(g,l,cx,sy+40);g.fillStyle=INK;g.font='600 60px '+SANS;g.fillText(v,cx,sy+112);});
 // 5 · ikigai: one score, four readings
 const iy=sy+150,k=ikigai(state);hair(g,iy,M,W-M,RULE,2);micro(g,'Ikigai',M,iy+40);g.fillStyle=INK;g.font='600 110px '+SANS;g.fillText(k?String(k.score):'—',M,iy+150);
 const bx=M+250,bw=W-M-bx;[['love','What you love'],['good','What you became good at'],['world','What the world got from you'],['paid','What sustained you']].forEach(([key,label],i)=>{const by2=iy+34+i*34,v=k?.parts[key];g.fillStyle=MUTED;g.font='20px '+SANS;g.textAlign='left';g.fillText(t(label),bx,by2+14);g.fillStyle=RULE;g.fillRect(bx+330,by2,bw-330-60,12);g.fillStyle=INK;g.fillRect(bx+330,by2,(bw-330-60)*(v??0)/100,12);g.fillStyle=INK;g.textAlign='right';g.fillText(v==null?'—':String(v),W-M,by2+14);g.textAlign='left';});
 // 6 · a line in the owner's own words
 if(words){g.fillStyle=INK;g.font='italic 30px '+SANS;paragraph(g,'“'+words+'”',M,iy+210,IN,2,40);}
 return c;
}

function back(state){
 const code=encodeBirth(state)??'',{c,g}=sheet(t('The record').toUpperCase(),code?'№ '+code:'');
 // 1 · by the decade, the way a card prints a career line
 micro(g,t('By the decade'),M,150);const cols=[M,M+150,M+330,M+510,M+730];['Age','Health','Mood','Net worth','Route'].forEach((h,i)=>micro(g,t(h),cols[i],196));
 hair(g,212,M,W-M,INK,3);
 const rows=(state.history??[]).filter(r=>r.age>=20&&r.age%10===0&&r.age<=state.age);
 if(!rows.length||rows.at(-1).age<state.age)rows.push({age:state.age,health:state.health,wellbeing:state.wellbeing,finance:state.finance,pathway:null,last:true});
 const shown=rows.slice(-8);shown.forEach((r,i)=>{const ry=262+i*50;g.fillStyle=INK;g.font='600 30px '+SANS;g.fillText(String(r.age),cols[0],ry);g.font='30px '+SANS;g.fillText(String(Math.round(r.health)),cols[1],ry);g.fillText(String(Math.round(r.wellbeing)),cols[2],ry);g.fillText(r.finance?money(netWorth(r.finance)):'—',cols[3],ry);g.fillStyle=MUTED;g.font='24px '+SANS;g.fillText(r.pathway&&PATHWAYS[r.pathway]?t(PATHWAYS[r.pathway].label):'',cols[4],ry);hair(g,ry+14,M,W-M,RULE,1);});
 // 2 · the moments that moved the numbers most
 const my=262+shown.length*50+30;hair(g,my,M,W-M,INK,3);micro(g,t('What moved it'),M,my+44);
 // rarer turns are the ones worth keeping on a card
 const RARE=new Set(['geo_arbitrage','gap_year','l_luck','m_debt','l_phd','l_bottom','l_early_family','geo_expiry']);
 const moved=e=>Math.abs(e.effects?.wellbeing??0)*3+Math.abs(e.effects?.health??0)*3+Math.abs(e.effects?.cash??0)/20000+(RARE.has(e.id)?4:0);
 const top=[...(state.story?.seen??[])].filter(e=>e.outcome).sort((a,b)=>moved(b)-moved(a)).slice(0,7).sort((a,b)=>a.age-b.age);
 // the starting shape owns the last band; moments fill the space above it, as many as fit whole
 const sy=H-72-250;let ry=my+92;let drawn=0;
 for(const e of top){g.font='28px '+SANS;const ls=lines(g,t(e.outcome),IN-110,3);const need=ls.length*36+30;if(ry+need>sy-20)break;g.fillStyle=INK;g.font='600 30px '+SANS;g.fillText(String(e.age),M,ry);g.fillStyle=INK;g.font='28px '+SANS;ls.forEach((l,i)=>g.fillText(l,M+110,ry+i*36));ry+=need;drawn++;}
 if(!drawn){g.fillStyle=MUTED;g.font='28px '+SANS;g.fillText(t('No single event stands out.'),M,my+100);}
 // 3 · what this person started with
 hair(g,sy,M,W-M,INK,3);micro(g,t('Starting shape'),M,sy+44);
 const axes=[['physique','Physique'],['iq','IQ'],['eq','EQ'],['craft','Creativity'],['drive','Drive']],aw=IN/5;
 axes.forEach(([k,l],i)=>{const ax=M+i*aw,v=state.attributes?.[k]??0;micro(g,t(l),ax,sy+90);g.fillStyle=RULE;g.fillRect(ax,sy+108,aw-24,12);g.fillStyle=INK;g.fillRect(ax,sy+108,(aw-24)*v/10,12);g.fillStyle=INK;g.font='600 30px '+SANS;g.fillText(v+' / 10',ax,sy+160);});
 return c;
}

// -> [front, back] as PNG blobs.
export async function lifeCards(state,words=''){
 try{await Promise.all(['600 40px Jost','30px Jost','20px "JetBrains Mono"'].map(f=>document.fonts?.load(f)));}catch{}
 return Promise.all([blob(front(state,words)),blob(back(state))]);
}
