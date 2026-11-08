// MSH audit on rendered pixels. Playwright is not a project dependency: point PLAYWRIGHT_FROM at a folder that has it.
// node scripts/msh-audit.mjs <outdir> [stages]   BASE=http://localhost:4220  UI_LANG=th
// node scripts/msh-audit.mjs --check <geometry.json>   re-applies the budgets to saved measurements
import {createRequire} from 'node:module';import fs from 'node:fs';
// Budgets are a ratchet: lower them as screens compact, never raise them.
const BUDGET={chromeShare:{review15:.22,review40:.22},maxFonts:8,maxBoxToText:12,minReadingUse:.6};
function failures(res){
 const bad=[];
 for(const[k,m]of Object.entries(res)){
  const stage=k.split('-')[0];
  if(m.errs?.length)bad.push(k+': page error '+m.errs[0]);
  if(m.vw<721&&BUDGET.chromeShare[stage]&&m.chromeBand/m.vh>BUDGET.chromeShare[stage])bad.push(k+': chrome '+Math.round(m.chromeBand/m.vh*100)+'% of the screen');
  if(m.fontSizes.length>BUDGET.maxFonts)bad.push(k+': '+m.fontSizes.length+' type sizes');
  for(const f of m.fat)if(f.ax>BUDGET.maxBoxToText)bad.push(k+': "'+f.t+'" box is '+f.ax+'x its text');
  if(m.ageContrast!==null&&m.ageContrast!==undefined&&m.ageContrast<4.5)bad.push(k+': age label contrast '+m.ageContrast);
  if(m.overlap.length)bad.push(k+': overlap '+JSON.stringify(m.overlap[0]));
  if(stage==='recap'&&m.vw>=1100&&m.readingUse<BUDGET.minReadingUse)bad.push(k+': reading uses '+Math.round(m.readingUse*100)+'% of its width');
 }
 return bad;
}
if(process.argv[2]==='--check'){const bad=failures(JSON.parse(fs.readFileSync(process.argv[3])));console.log(bad.join('\n')||'BUDGETS_PASS');process.exit(bad.length?1:0);}
const require=createRequire((process.env.PLAYWRIGHT_FROM??'/Users/nonarkara/Projects/palette')+'/');const {chromium}=require('playwright');
const out=process.argv[2];fs.mkdirSync(out,{recursive:true});const only=process.argv[3];
const BASE=process.env.BASE??'http://localhost:4220',UI=process.env.UI_LANG??'en';
const SIZES=process.env.SIZES?process.env.SIZES.split(',').map(s=>s.split('x').map(Number)):[[390,844],[1440,900],[1280,720]];
// build a saved state in-page
const build=async(page,stage)=>page.evaluate(async stage=>{
 const v=new URL(document.querySelector('script[src*=boot]').src).search;const I=m=>import('/course/'+m+'.js'+v);
 const [{newLife,begin,live},{encounterById,resolveEncounter},{choiceAvailable},{pendingPivots,applyPivot,openOptions}]=await Promise.all(['sim','encounters','finance','pivots'].map(I));
 const seed=11*7919;let s=newLife(seed);
 if(stage==='childhood')return {...s,progressAge:6.05,childhood:{origin:{cash:s.cash,health:s.health,wellbeing:s.wellbeing},choices:[],startsAt:6}};
 if(stage==='birth')return {...s,progressAge:2.5};
 s=begin(s);
 const target={review15:15,review40:40,question:20,encounter:25}[stage]??99;
 while(s.stage==='review'&&s.age<target){s=live(s);if(s.stage!=='review')break;if(s.age>=target&&stage!=='review15'&&stage!=='review40')break;
  for(const p of pendingPivots(s)){if(stage==='question'&&s.age>=target)break;const o=openOptions(p,s)[0];if(o)s=applyPivot(s,p,o.id);}
  const ps=s.story?.pending;if(ps&&!(stage==='encounter'&&s.age>=target)){s=resolveEncounter(s,encounterById(ps.id).options.find(o=>choiceAvailable(s,o)).id,.2);}}
 if(stage==='encounter'){if(!s.story.pending){let g=0;while(!s.story.pending&&g++<8&&s.stage==='review'){for(const p of pendingPivots(s)){const o=openOptions(p,s)[0];if(o)s=applyPivot(s,p,o.id);}s=live(s);}}for(const p of pendingPivots(s)){const o=openOptions(p,s)[0];if(o)s=applyPivot(s,p,o.id);}}
 if(stage==='review15'||stage==='review40'){for(const p of pendingPivots(s)){const o=openOptions(p,s)[0];if(o)s=applyPivot(s,p,o.id);}if(s.story?.pending)s=resolveEncounter(s,encounterById(s.story.pending.id).options.find(o=>choiceAvailable(s,o)).id,.2);}
 if(stage==='question'&&s.story?.pending)s={...s,story:{...s.story,pending:null}};
 return s;
},stage);
const measure=()=>{
 const vis=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>0&&r.height>0&&c.visibility!=='hidden'&&c.display!=='none'&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
 const R=r=>[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)];
 const textRect=e=>{const g=document.createRange();g.selectNodeContents(e);const r=g.getBoundingClientRect();return r;};
 const controls=[...document.querySelectorAll('button,a,select,summary,input[type=number],[role=button]')].filter(vis).filter(e=>!e.closest('svg'));
 const fat=controls.map(e=>{const b=e.getBoundingClientRect(),t=textRect(e);if(!t.width||!(e.innerText||'').trim())return null;return {t:(e.innerText||'').trim().slice(0,28),box:[Math.round(b.width),Math.round(b.height)],text:[Math.round(t.width),Math.round(t.height)],ax:+((b.width*b.height)/(t.width*t.height)).toFixed(1)};}).filter(Boolean).sort((a,b)=>b.ax-a.ax).slice(0,8);
 const small=controls.map(e=>({t:(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,20),h:Math.round(e.getBoundingClientRect().height),w:Math.round(e.getBoundingClientRect().width)})).filter(c=>c.h<32||c.w<24).slice(0,8);
 const scrollers=[document.scrollingElement,...document.querySelectorAll('*')].filter(e=>{const c=getComputedStyle(e);return e===document.scrollingElement||(/(auto|scroll)/.test(c.overflowY)&&vis(e));}).filter(e=>e.scrollHeight>e.clientHeight+2).map(e=>({e:e.id||e.className||e.tagName,client:e.clientHeight,scroll:e.scrollHeight,screens:+(e.scrollHeight/e.clientHeight).toFixed(2)})).slice(0,5);
 const chrome=[...document.querySelectorAll('header,nav,.console-nav,.life-header,#transport,.transport,.age-bar,footer')].filter(vis).map(e=>({e:(e.id||e.className||e.tagName).toString().slice(0,30),r:R(e.getBoundingClientRect())}));
 const canvas=[...document.querySelectorAll('canvas')].filter(vis).map(e=>R(e.getBoundingClientRect())).slice(0,3);
 const blocks=[...document.querySelectorAll('h1,h2,p,dd,li,button,canvas,label')].filter(vis).filter(e=>!e.closest('summary'));
 const overlap=[];for(let i=0;i<blocks.length;i++)for(let j=i+1;j<blocks.length;j++){const a=blocks[i],b=blocks[j];if(a.contains(b)||b.contains(a))continue;if(getComputedStyle(a).position==='static'&&getComputedStyle(b).position==='static'&&a.tagName!=='CANVAS'&&b.tagName!=='CANVAS')continue;const x=a.getBoundingClientRect(),y=b.getBoundingClientRect(),w=Math.min(x.right,y.right)-Math.max(x.left,y.left),h=Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top);if(w>6&&h>6&&a.tagName!=='CANVAS'&&b.tagName!=='CANVAS')overlap.push([(a.innerText||'').slice(0,18),(b.innerText||'').slice(0,18)]);if(overlap.length>5)break;}
 const fontSizes=[...new Set([...document.querySelectorAll('body *')].filter(vis).filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.nodeValue.trim())).map(e=>parseFloat(getComputedStyle(e).fontSize)))].sort((a,b)=>a-b);
 const bands=[...document.querySelectorAll('body>header,.world-head,.console-nav,.console-actions,.personal-console .tabs')].filter(vis).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.top),Math.round(r.bottom)];}).sort((a,b)=>a[0]-b[0]);let chromeBand=0,end=-1;for(const[a,b]of bands){if(b<=end)continue;chromeBand+=b-Math.max(a,end);end=b;}
 const lr=document.querySelector('.life-reading'),readingUse=lr?[...lr.children].reduce((n,c)=>Math.max(n,c.getBoundingClientRect().right),0)/(lr.parentElement.getBoundingClientRect().right):null;
 const lum=c=>{const v=c.match(/[\d.]+/g).slice(0,3).map(n=>{n/=255;return n<=.03928?n/12.92:((n+.055)/1.055)**2.4;});return .2126*v[0]+.7152*v[1]+.0722*v[2];};
 const ageEl=document.getElementById('age'),head=ageEl?.closest('.world-head');let ageContrast=null;if(ageEl&&vis(ageEl)&&head){const a=lum(getComputedStyle(ageEl).color),b=lum(getComputedStyle(head).backgroundColor);ageContrast=+((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(2);}
 const h1=document.querySelector('h1');
 return {ageContrast,chromeBand,readingUse,vw:innerWidth,vh:innerHeight,page:[document.scrollingElement.scrollWidth,document.scrollingElement.scrollHeight],chrome,canvas,h1:h1&&vis(h1)?R(h1.getBoundingClientRect()):null,fat,small,scrollers,overlap,fontSizes,bodyClass:document.body.className};
};
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const stages=['landing','intake','birth','childhood','review15','question','encounter','review40','recap'];
const res={};
for(const stage of stages){if(only&&!only.split(',').includes(stage))continue;
 for(const [w,h] of SIZES){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.addInitScript(language=>{try{localStorage.setItem('life-preferences-v1',JSON.stringify({language,size:'normal',motion:false,stage:'painted',v:2}));}catch{}},UI);
  if(stage==='landing')await page.goto(BASE+'/start/');else if(stage==='intake')await page.goto(BASE+'/intake/');
  else{await page.goto(BASE+'/course/');await page.waitForTimeout(600);
   let st;if(stage==='recap'){st=await page.evaluate(async()=>{const v=new URL(document.querySelector('script[src*=boot]').src).search;const I=m=>import('/course/'+m+'.js'+v);const [{newLife,begin,live},{encounterById,resolveEncounter},{choiceAvailable},{pendingPivots,applyPivot,openOptions}]=await Promise.all(['sim','encounters','finance','pivots'].map(I));let s=begin(newLife(3*7919));while(s.stage==='review'&&s.age<80){s=live(s);if(s.stage!=='review')break;for(const p of pendingPivots(s)){const os=openOptions(p,s);const o=os[3%os.length];if(o)s=applyPivot(s,p,o.id);}const ps=s.story?.pending;if(ps){const os=encounterById(ps.id).options.filter(o=>choiceAvailable(s,o));s=resolveEncounter(s,os[3%os.length].id,.2);}}return s;});}
   else st=await build(page,stage);
   await page.evaluate(s=>localStorage.setItem('life-course-v2',JSON.stringify(s)),st);
   await page.goto(BASE+'/course/');await page.waitForTimeout(stage==='birth'||stage==='childhood'?2500:2000);}
  await page.waitForTimeout(800);
  const m=await page.evaluate(measure);m.errs=errs;
  await page.screenshot({path:`${out}/${stage}-${w}.png`});
  res[stage+'-'+w]=m;await ctx.close();
 }}
await b.close();fs.writeFileSync(out+'/geometry.json',JSON.stringify(res,null,1));
for(const[k,m]of Object.entries(res))console.log(k,'chrome',m.chromeBand,'canvas',JSON.stringify(m.canvas),'scroll',JSON.stringify(m.scrollers.map(s=>[String(s.e).slice(0,18),s.screens])),'fonts',m.fontSizes.length,'fat',JSON.stringify(m.fat.slice(0,2).map(f=>[f.t,f.ax])));
const bad=failures(res);console.log(bad.join('\n')||'BUDGETS_PASS');process.exit(bad.length?1:0);
