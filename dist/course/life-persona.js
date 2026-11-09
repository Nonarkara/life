// The card you carry: who you are, what you hold, what you owe. Worn items as in an old role-playing
// game. The amulet is given, never earned, and its price is the first inequality. Read from the record.
import {rand} from './rand.js';
import {netWorth} from './finance.js';
import {holdingsValue} from './investments.js';
import {rungAt} from './housing-ladder.js';
import {goldValue,goldPrice} from './gold.js';
import {birthYearOf} from './thai-history.js';
const FEMALE=['Malee','Suda','Noi','Lek','Anong','Ploy','Siriporn','Kanya','Nok','Fah'],MALE=['Somchai','Prasert','Wichai','Somsak','Daeng','Anan','Niran','Chai','Tong','Boon'],ANY=['Tong','Lek','Nok','Noi','Fah','Boon'];
export function personaName(s){if(s.personaName)return s.personaName;const sex=s.intake?.sex,list=sex==='female'?FEMALE:sex==='male'?MALE:ANY;return list[Math.floor(rand(s.seed,0,'persona-name')*list.length)];}
export const cleanName=x=>String(x??'').replace(/[<>]/g,'').trim().slice(0,24);
export const setPersonaName=(s,x)=>{const n=cleanName(x);return n?{...s,personaName:n}:s;};
// Authored prices in the order of real Thai amulet markets, not an appraisal.
const AMULET={low_class:{tier:0,label:'Temple-fair clay amulet',value:50},working_class:{tier:1,label:'Brass amulet from your father',value:1500},middle_class:{tier:2,label:'Silver-cased amulet',value:40000},bureaucratic_class:{tier:3,label:'Gold-cased old amulet',value:300000},high_class:{tier:4,label:'A famous old amulet, worth a house',value:8000000}};
export const AMULET_COLOR=['#9a8466','#b08a3c','#b9bcbc','#d9a92e','#f59e0b'];
export function amuletOf(s){const a=AMULET[s.intake?.class]??AMULET.working_class;if(s.birth?.region==='pak-phanang'&&rand(s.seed,0,'faith')<.3)return {...a,label:'Prayer beads from your father',cross:false};return rand(s.seed,0,'worn-cross')<.04?{...a,cross:true,label:a.label.replace(/amulet/i,'cross')}:a;}
const soldAt=(s,k)=>(s.finance?.sold??[]).some(x=>x.key===k);
const bought=(s,k)=>{if(soldAt(s,k))return undefined;const flag=k==='watch'?({...s.pivotFlags,...s.story?.flags}).g_watch:undefined;return (s.finance?.purchases??[]).find(p=>p.key===k)??(typeof flag==='number'?{key:k,age:flag}:undefined);};
export const HOUSE_PRICE=1500000,MORTGAGE=1200000,MORTGAGE_YEARS=20,MORTGAGE_MONTHLY=7000;
export const mortgageLeft=(s,age=s.age)=>{const h=bought(s,'house');return h?Math.round(Math.max(0,MORTGAGE*(1-(age-h.age)/MORTGAGE_YEARS))):0;};
export const mortgageDue=s=>{const h=bought(s,'house');return h&&s.age-h.age<MORTGAGE_YEARS?MORTGAGE_MONTHLY:0;};
export function holdingsOfLife(s){
 const flags={...s.pivotFlags,...s.story?.flags},rung=rungAt(s),own=!!bought(s,'house')||flags.ownsHouse!==undefined;
 return {home:own?'owned':rung===0?'none':rung<=2?'rented':'family',vehicle:bought(s,'car')?'car':bought(s,'motorbike')?'motorbike':null};
}
export function balanceOf(s){
 const f=s.finance,invest=f?holdingsValue(f):0,cash=f?f.available+f.reserve:s.cash??0,things=assetsOf(s).filter(a=>a.key!=='amulet'),val=k=>things.find(a=>a.key===k)?.value??0,house=val('house'),gold=val('gold'),goods=val('land')+val('watch')+val('car')+val('motorbike'),mortgage=mortgageLeft(s),debt=f?.debt??0,assets=Math.max(0,cash)+invest+house+gold+goods,owed=mortgage+debt;
 return {cash,invest,house,gold,mortgage,debt,assets,owed,worth:(f?netWorth(f):cash)+house+gold+goods-mortgage,goods,share:assets?Math.min(1,owed/assets):owed?1:0};
}
// Game estimates of what a thing fetches. A watch is a gamble: some climb, some do not.
const ITEMS={house:{label:'House',base:HOUSE_PRICE,r:()=>.04},land:{label:'Land',base:500000,r:()=>.07},watch:{label:'Rolex',base:350000,r:s=>-.03+rand(s.seed,0,'watch-rate')*.09},car:{label:'Car',base:280000,r:()=>-.12},motorbike:{label:'Motorbike',base:35000,r:()=>-.15}};
export function assetsOf(s){
 const y0=birthYearOf(s)??1981,out=[],span=(from,f)=>{const pts=[];for(let a=from;a<=s.age;a+=Math.max(1,Math.ceil((s.age-from)/12)))pts.push(f(a));pts.push(f(s.age));return pts;};
 for(const [key,it] of Object.entries(ITEMS)){const b=bought(s,key);if(!b)continue;const r=it.r(s),v=a=>Math.round(it.base*(1+r)**(a-b.age));out.push({key,label:it.label,value:v(s.age),paid:it.base,points:span(b.age,v)});}
 if(s.finance?.goldWeight>0){const w=s.finance.goldWeight,v=a=>Math.round(w*goldPrice(y0+a));out.push({key:'gold',label:'Gold',value:v(s.age),points:span(Math.max(20,s.age-20),v)});}
 if(!soldAt(s,'amulet')){const a=amuletOf(s),v=x=>Math.round(a.value*1.03**x);out.push({key:'amulet',label:a.label,value:v(s.age),points:span(0,v),heirloom:true});}
 return out;
}
export function sellAsset(s,key){
 const f=s.finance;if(!f||s.stage!=='review'||s.age<15)return s;const it=assetsOf(s).find(a=>a.key===key);if(!it)return s;const id='sold:'+key+':'+s.age;if(f.receipts.some(r=>r.id===id))return s;
 const owed=key==='house'?mortgageLeft(s):0,cash=Math.max(0,it.value-owed);
 return {...s,wellbeing:Math.max(0,s.wellbeing-(it.heirloom?6:0)),finance:{...f,available:f.available+cash,...(key==='gold'?{goldWeight:0}:{}),sold:key==='gold'?f.sold??[]:[...(f.sold??[]),{key,age:s.age}],receipts:[...f.receipts,{id,age:s.age,kind:'bucket',income:cash,expense:0,change:cash}]}};
}
export function natureOf(s){const a=s.age,body=a<13?'Still growing':a<20?'Hormones loud':a<30?'Body at its peak':a<45?'Holding steady':a<60?'Slowing, quietly':'Running on what is left',d=s.effort?.drive??2;return {body,drive:s.wellbeing<35?'Worn thin':d>=4?'Restless':d>=2?'Steady':'Coasting'};}
