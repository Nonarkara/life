// Deterministic, specific family details (named parents/guardians, occupations,
// and siblings) derived from a life's seed, class, and household without mutating save state.
import {rand} from './rand.js';
import {t,preferences} from './i18n.js';
import {household} from './regions.js';

const FATHER_NAMES=['Somchai','Prasert','Wichai','Somsak','Narong','Boonmee','Anan','Kittisak','Thaworn','Preecha'];
const MOTHER_NAMES=['Malee','Suda','Wilai','Ratana','Nonglak','Chanthira','Yupin','Sunee','Kanya','Somporn'];
const BROTHER_NAMES=['Ton','Beam','Bank','Mek','Art','Nont','Golf','Oak'];
const SISTER_NAMES=['Ploy','Fah','Khao','Nok','Pim','Dao','May','Mint'];
const THAI_NAMES={
 Somchai:'สมชาย',Prasert:'ประเสริฐ',Wichai:'วิชัย',Somsak:'สมศักดิ์',Narong:'ณรงค์',
 Boonmee:'บุญมี',Anan:'อนันต์',Kittisak:'กิตติศักดิ์',Thaworn:'ถาวร',Preecha:'ปรีชา',
 Malee:'มาลี',Suda:'สุดา',Wilai:'วิไล',Ratana:'รัตนา',Nonglak:'นงลักษณ์',
 Chanthira:'จันทิรา',Yupin:'ยุพิน',Sunee:'สุนีย์',Kanya:'กัญญา',Somporn:'สมพร',
 Ton:'ต้น',Beam:'บีม',Bank:'แบงก์',Mek:'เมฆ',Art:'อาร์ต',Nont:'นนท์',Golf:'กอล์ฟ',Oak:'โอ๊ค',
 Ploy:'พลอย',Fah:'ฟ้า',Khao:'ข้าว',Nok:'นก',Pim:'พิม',Dao:'ดาว',May:'เมย์',Mint:'มิ้นท์'
};
const localName=name=>preferences.language==='th'?(THAI_NAMES[name]??name):name;

const OCCUPATIONS={
 low_class:['rice farmer','day labourer','canal boatman','street vendor','seamstress','market porter'],
 working_class:['bus driver','mechanic','noodle-stall cook','factory worker','market tailor','site foreman'],
 middle_class:['shopkeeper','bank clerk','schoolteacher','bookkeeper','clinic nurse','hardware merchant'],
 bureaucratic_class:['district clerk','provincial teacher','civil engineer','customs officer','pharmacist','postmaster'],
 high_class:['rice-mill owner','textile exporter','clinic director','timber merchant','property developer','shipping partner']
};

export function familyGuardians(life){
 if(!life?.birth)return [];
 const seed=life.seed||1;
 const cls=life.intake?.class??life.birth.class??'working_class';
 const jobs=OCCUPATIONS[cls]??OCCUPATIONS.working_class;
 const {father,mother}=household(life.birth);
 const pick=(list,salt)=>list[Math.floor(rand(seed,0,salt)*list.length)];
 const usedNames=new Set(),usedJobs=new Set();
 return [father,mother].map((person,index)=>{
  const slot=index?'m':'f';
  const names=person.sex==='male'?FATHER_NAMES:MOTHER_NAMES;
  const name=pick(names.filter(name=>!usedNames.has(name)),'fam-'+slot+'-name');
  let job=pick(jobs.filter(job=>!usedJobs.has(job)),'fam-'+slot+'-job');
  usedNames.add(name);usedJobs.add(job);
  if(job==='seamstress'&&person.sex==='male')job='tailor';
  return {name,job,role:person.role,elder:!!person.elder};
 });
}

export function familyRecord(life){
 if(!life?.birth)return null;
 const seed=life.seed||1;
 const guardians=familyGuardians(life).map(({name,job,role})=>
  `${localName(name)} · ${t(role[0].toUpperCase()+role.slice(1))} · ${t(job)}`).join(' / ');

 const sibCount=Math.floor(rand(seed,0,'fam-sib-n')*4);
 let siblingsText;
 if(sibCount===0){
  siblingsText=t('Only child');
 }else{
  const used=new Set();
  const list=[];
  for(let i=0;i<sibCount;i++){
   const isMale=rand(seed,i+1,'fam-sib-sex')<.5;
   const pool=isMale?BROTHER_NAMES:SISTER_NAMES;
   let name=pool[Math.floor(rand(seed,i+1,'fam-sib-name')*pool.length)];
   while(used.has(name))name=pool[(pool.indexOf(name)+1)%pool.length];
   used.add(name);
   const role=rand(seed,i+1,'fam-sib-role')<.5
    ?(isMale?t('older brother'):t('older sister'))
    :(isMale?t('younger brother'):t('younger sister'));
   list.push(`${localName(name)} (${role})`);
  }
  siblingsText=list.join(' · ');
 }

 return {guardians,siblingsText,sibCount};
}
