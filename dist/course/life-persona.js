// The card you carry: who you are, what you hold, what you owe. Worn items as in an old role-playing
// game. The amulet is given, never earned, and its price is the first inequality. Read from the record.
import {rand} from './rand.js';
import {netWorth} from './finance.js';
import {holdingsValue} from './investments.js';
import {rungAt} from './housing-ladder.js';
import {goldValue} from './gold.js';
import {birthYearOf} from './thai-history.js';
const FEMALE=['Malee','Suda','Noi','Lek','Anong','Ploy','Siriporn','Kanya','Nok','Fah'],MALE=['Somchai','Prasert','Wichai','Somsak','Daeng','Anan','Niran','Chai','Tong','Boon'],ANY=['Tong','Lek','Nok','Noi','Fah','Boon'];
export function personaName(s){if(s.personaName)return s.personaName;const sex=s.intake?.sex,list=sex==='female'?FEMALE:sex==='male'?MALE:ANY;return list[Math.floor(rand(s.seed,0,'persona-name')*list.length)];}
export const cleanName=x=>String(x??'').replace(/[<>]/g,'').trim().slice(0,24);
export const setPersonaName=(s,x)=>{const n=cleanName(x);return n?{...s,personaName:n}:s;};
// Authored prices in the order of real Thai amulet markets, not an appraisal.
const AMULET={low_class:{tier:0,label:'Temple-fair clay amulet',value:50},working_class:{tier:1,label:'Brass amulet from your father',value:1500},middle_class:{tier:2,label:'Silver-cased amulet',value:40000},bureaucratic_class:{tier:3,label:'Gold-cased old amulet',value:300000},high_class:{tier:4,label:'A famous old amulet, worth a house',value:8000000}};
export const AMULET_COLOR=['#9a8466','#b08a3c','#b9bcbc','#d9a92e','#f59e0b'];
export function amuletOf(s){const a=AMULET[s.intake?.class]??AMULET.working_class;return rand(s.seed,0,'worn-cross')<.04?{...a,cross:true,label:a.label.replace(/amulet/i,'cross')}:a;}
const bought=(s,k)=>(s.finance?.purchases??[]).find(p=>p.key===k);
export const HOUSE_PRICE=1500000,MORTGAGE=1200000,MORTGAGE_YEARS=20,MORTGAGE_MONTHLY=7000;
export const mortgageLeft=(s,age=s.age)=>{const h=bought(s,'house');return h?Math.round(Math.max(0,MORTGAGE*(1-(age-h.age)/MORTGAGE_YEARS))):0;};
export const mortgageDue=s=>{const h=bought(s,'house');return h&&s.age-h.age<MORTGAGE_YEARS?MORTGAGE_MONTHLY:0;};
export function holdingsOfLife(s){
 const flags={...s.pivotFlags,...s.story?.flags},rung=rungAt(s),own=!!bought(s,'house')||flags.ownsHouse!==undefined;
 return {home:own?'owned':rung===0?'none':rung<=2?'rented':'family',vehicle:bought(s,'car')?'car':bought(s,'motorbike')?'motorbike':null};
}
export function balanceOf(s){
 const f=s.finance,invest=f?holdingsValue(f):0,cash=f?f.available+f.reserve:s.cash??0,house=bought(s,'house')?HOUSE_PRICE:0,gold=goldValue(f,(birthYearOf(s)??1981)+s.age),mortgage=mortgageLeft(s),debt=f?.debt??0,assets=Math.max(0,cash)+invest+house+gold,owed=mortgage+debt;
 return {cash,invest,house,gold,mortgage,debt,assets,owed,worth:(f?netWorth(f):cash)+house+gold-mortgage,share:assets?Math.min(1,owed/assets):owed?1:0};
}
export function natureOf(s){const a=s.age,body=a<13?'Still growing':a<20?'Hormones loud':a<30?'Body at its peak':a<45?'Holding steady':a<60?'Slowing, quietly':'Running on what is left',d=s.effort?.drive??2;return {body,drive:s.wellbeing<35?'Worn thin':d>=4?'Restless':d>=2?'Steady':'Coasting'};}
