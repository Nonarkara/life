// Deterministic, specific family details (named parents/guardians, occupations,
// and siblings) derived from a life's seed, class, and household without mutating save state.
import {rand} from './rand.js';
import {t} from './i18n.js';
import {household} from './regions.js';

const FATHER_NAMES=['Somchai','Prasert','Wichai','Somsak','Narong','Boonmee','Anan','Kittisak','Thaworn','Preecha'];
const MOTHER_NAMES=['Malee','Suda','Wilai','Ratana','Nonglak','Chanthira','Yupin','Sunee','Kanya','Somporn'];
const SIBLING_NAMES=['Ploy','Ton','Fah','Beam','Khao','Nok','Bank','Pim','Mek','Dao'];

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
  const job=pick(jobs.filter(job=>!usedJobs.has(job)),'fam-'+slot+'-job');
  usedNames.add(name);usedJobs.add(job);
  return {name,job,role:person.role,elder:!!person.elder};
 });
}

export function familyRecord(life){
 if(!life?.birth)return null;
 const seed=life.seed||1;
 const guardians=familyGuardians(life).map(({name,job,role})=>
  `${name} · ${t(role[0].toUpperCase()+role.slice(1))} · ${t(job)}`).join(' / ');

 const sibCount=Math.floor(rand(seed,0,'fam-sib-n')*4);
 let siblingsText;
 if(sibCount===0){
  siblingsText=t('Only child');
 }else{
  const used=new Set();
  const list=[];
  for(let i=0;i<sibCount;i++){
   let name=SIBLING_NAMES[Math.floor(rand(seed,i+1,'fam-sib-name')*SIBLING_NAMES.length)];
   while(used.has(name))name=SIBLING_NAMES[(SIBLING_NAMES.indexOf(name)+1)%SIBLING_NAMES.length];
   used.add(name);
   const role=rand(seed,i+1,'fam-sib-role')<.5
    ?(rand(seed,i+1,'fam-sib-sex')<.5?t('older brother'):t('older sister'))
    :(rand(seed,i+1,'fam-sib-sex')<.5?t('younger brother'):t('younger sister'));
   list.push(`${name} (${role})`);
  }
  siblingsText=list.join(' · ');
 }

 return {guardians,siblingsText,sibCount};
}
