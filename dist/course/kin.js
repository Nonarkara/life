// Scenes were written for a mother and a father. A life born to a grandmother, two mothers or two
// fathers reads the same scenes retold for the people it actually has. kin-plan.js holds, for every
// line that names a parent, a template whose tokens mark the parent's noun and that parent's own
// pronouns (read scene by scene, so another person's he or she is left alone), the households a
// scene must not be offered to, and exact text where a filled template would read wrong.
// The parents household is never touched: its text is the authored text.
import {KIN_SCENES} from './kin-plan.js';
export const HOUSE={grandmother:'GM',grandfather:'GF',mothers:'MM',fathers:'FF'};
// Who stands in each slot, and whether that person is a woman.
const SLOT={
 GM:{mother:['mother',true],father:['grandmother',true]},
 GF:{mother:['grandmother',true],father:['father',false]},
 MM:{mother:['mother',true],father:['mother',true]},
 FF:{mother:['father',false],father:['father',false]}
};
const SHE={she:'she',She:'She',her:'her',"her's":'her',herself:'herself',hers:'hers',he:'she',He:'She',him:'her',his:'her',himself:'herself'};
const HE={she:'he',She:'He',her:'him',"her's":'his',herself:'himself',hers:'his',he:'he',He:'He',him:'him',his:'his',himself:'himself'};
const MOTHER_TOKENS=['mother','Mother','she','She','her',"her's",'herself','hers'],cap=s=>s[0].toUpperCase()+s.slice(1);
// The second parent of the same sex is always "your other mother" or "your other father", in every scene,
// so that across a life the two stay two people: one cannot die in one scene and cook in the next.
const noun=(h,slot)=>{const [role]=SLOT[h][slot];return h==='MM'&&slot==='father'||h==='FF'&&slot==='mother'?'other '+role:role;};
export function fillKin(entry,h){
 if(entry.custom?.[h]!==undefined)return entry.custom[h];
 return entry.tpl.replace(/\{([A-Za-z']+)\}/g,(m,k)=>{
  if(k==='parents')return h==='GM'||h==='GF'?'family':'parents';
  if(k==='mother'||k==='father')return noun(h,k);
  if(k==='Mother'||k==='Father')return cap(noun(h,k.toLowerCase()));
  const slot=MOTHER_TOKENS.includes(k)?'mother':'father',table=SLOT[h][slot][1]?SHE:HE;
  return table[k]??m;
 });
}
// Every authored line that has a template: the exact English string is the key.
const INDEX=new Map(),PEOPLE=[];
// A line that also has someone else's she or he: its translation keeps its pronouns, because only the
// English was read word by word.
const mixedIn=tpl=>{const rest=tpl.replace(/\{[A-Za-z']+\}/g,'');return {mother:/\b(she|her|hers|herself)\b/i.test(rest),father:/\b(he|him|his|himself)\b/i.test(rest)};};
for(const [id,scene] of Object.entries(KIN_SCENES))for(const [src,tpl] of Object.entries(scene.strings??{})){
 const entry={src,tpl,custom:scene.custom?.[src],customLang:scene.customLang?.[src],scene:id,mixed:mixedIn(tpl)};INDEX.set(src,entry);
 // A stored outcome has its {friend} and {partner} already filled with names.
 if(/\{(friend|partner)\}/.test(src))PEOPLE.push([new RegExp('^'+src.split(/(\{(?:friend|partner)\})/).map(p=>/^\{/.test(p)?'([^.,;:!?]+?)':p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('')+'$'),entry,[...src.matchAll(/\{(friend|partner)\}/g)].map(m=>m[0])]);
}
for(const [id,scene] of Object.entries(KIN_SCENES))for(const src of Object.keys(scene.custom??{}))if(!INDEX.has(src))INDEX.set(src,{src,tpl:src,custom:scene.custom[src],customLang:scene.customLang?.[src],scene:id,mixed:{mother:true,father:true}});
export const kinEntry=src=>INDEX.get(src);
export const kinGated=(sceneId,household)=>!!HOUSE[household]&&(KIN_SCENES[sceneId]?.gate??[]).includes(HOUSE[household]);
// What changes for this household in this line: which slots take a new noun, and whether the
// parent's own pronouns change sex. Used to carry the same change into a translation.
export function kinChange(entry,h){
 const out={};
 for(const slot of ['mother','father']){const [role,woman]=SLOT[h][slot],named=new RegExp('\\{'+slot+'\\}','i').test(entry.tpl),said=(slot==='mother'?/\{(she|her|her's|herself|hers)\}/i:/\{(he|him|his|himself)\}/i).test(entry.tpl);
  if(role===slot||!named&&!said)continue;out[slot]={role:noun(h,slot),named,sex:woman!==(slot==='mother')&&said};}
 if(/\{parents\}/.test(entry.tpl)&&(h==='GM'||h==='GF'))out.parents=true;
 return out;
}
// The kin word in each language. Each pattern skips the compounds that only look like it
// (a river, a market woman, an aunt, an alma mater). No native reader has checked these.
const WORDS={
 th:{mother:/(?<!พ่อ)(?<!คุณ)แม่(?!น้ำ|ค้า|บ้าน|ครัว|ชี|ทัพ|เหล็ก|สื่อ|ยาย|เลี้ยง|ม่าย|พิมพ์|มด|กุญแจ)/g,father:/(?<!คุณ)พ่อ(?!แม่|ค้า|ครัว|บ้าน|เลี้ยง|ม่าย|ตา|มด)/g,parents:/พ่อแม่/g,she:/เธอ/g,
  to:{mother:'แม่',father:'พ่อ','other mother':'แม่อีกคน','other father':'พ่ออีกคน',GFgrandmother:'ย่า',GMgrandmother:'ยาย',family:'ครอบครัว'}},
 'zh-CN':{mother:/母亲|妈妈|(?<![姑舅姨大干奶后])妈(?!妈)/g,father:/父亲|爸爸|(?<![干后])爸(?!爸)/g,parents:/父母亲|父母/g,she:/她/g,he:/他(?!们)/g,
  to:{mother:{母亲:'母亲',妈妈:'妈妈',妈:'妈',父亲:'母亲',爸爸:'妈妈',爸:'妈'},father:{父亲:'父亲',爸爸:'爸爸',爸:'爸',母亲:'父亲',妈妈:'爸爸',妈:'爸'},'other mother':'另一位母亲','other father':'另一位父亲',GFgrandmother:'奶奶',GMgrandmother:'外婆',family:'家里人'}},
 ja:{mother:/お母さん|母さん|母親|(?<![祖叔伯義])母(?![校国親語体])/g,father:/お父さん|父さん|父親|(?<![祖叔伯義神])父(?![母親])/g,parents:/両親|(?<![母父両肉])親(?![戚切友族子類])/g,she:/彼女/g,he:/彼(?![女ら氏])/g,
  to:{mother:{お母さん:'お母さん',母さん:'母さん',母親:'母親',母:'母',お父さん:'お母さん',父さん:'母さん',父親:'母親',父:'母'},father:{お父さん:'お父さん',父さん:'父さん',父親:'父親',父:'父',お母さん:'お父さん',母さん:'父さん',母親:'父親',母:'父'},'other mother':'もう一人の母','other father':'もう一人の父',GFgrandmother:'祖母',GMgrandmother:'祖母',family:'家族'}},
 ko:{mother:/(?<!시)어머니|어머님|엄마/g,father:/(?<!시)아버지|아버님|아빠/g,parents:/부모님|부모/g,she:/그녀/g,he:/(?<![가-힣])그(?=[가는의를도]|에게)/g,
  to:{mother:{어머니:'어머니',어머님:'어머님',엄마:'엄마',아버지:'어머니',아버님:'어머님',아빠:'엄마'},father:{아버지:'아버지',아버님:'아버님',아빠:'아빠',어머니:'아버지',어머님:'아버님',엄마:'아빠'},'other mother':'다른 어머니','other father':'다른 아버지',GFgrandmother:'할머니',GMgrandmother:'할머니',family:'가족'}}
};
export function kinLang(text,lang,entry,h){
 const w=WORDS[lang],change=kinChange(entry,h);if(!w)return text;let out=text;
 const word=(role,hit)=>role==='grandmother'?w.to[h+'grandmother']:typeof w.to[role]==='object'?w.to[role][hit]??hit:w.to[role];
 // Both slots are read from the original, so a mother who becomes a father is not then taken for the father.
 const spans=[];
 // Thai, Japanese and Korean often repeat the kin word where English says she or he, so the word is
 // swapped whenever this line is about that parent, named or not.
 for(const slot of ['mother','father']){const c=change[slot];if(!c)continue;for(const m of text.matchAll(w[slot]))spans.push([m.index,m[0].length,word(c.role,m[0])]);}
 // A translation may say "parents" where the English names both: for a grandmother household that word is the family.
 const lost=['mother','father'].some(slot=>change[slot]?.named&&!spans.length);
 if(change.parents||lost&&(h==='GM'||h==='GF'))for(const m of text.matchAll(w.parents))spans.push([m.index,m[0].length,w.to.family]);
 // The parent's own pronoun follows, only where the language has one and the line has no other person of that sex.
 const sexed=['mother','father'].filter(s=>change[s]?.sex);
 if(sexed.length===1&&!entry.mixed?.[sexed[0]]){const from=sexed[0]==='mother'?w.she:w.he,to=sexed[0]==='mother'?{'她':'他','彼女':'彼','그녀':'그','เธอ':'เขา'}:{'他':'她','彼':'彼女','그':'그녀'};if(from)for(const m of text.matchAll(from))if(to[m[0]])spans.push([m.index,m[0].length,to[m[0]]]);}
 spans.sort((a,b)=>b[0]-a[0]);let last=Infinity;
 for(const [i,n,rep] of spans){if(i+n>last)continue;out=out.slice(0,i)+rep+out.slice(i+n);last=i;}
 return out;
}
let current=null;export const setKin=household=>{current=HOUSE[household]??null;};export const kinNow=()=>current;
const done=new Map();
// One displayed line: the authored English and what the game was about to show for it (the same
// line, or its translation). Returns what this household should read.
export function kinLine(src,said,lang,translate=(x)=>x,h=current){
 if(!h||!src)return said;const key=h+'|'+lang+'|'+src+'|'+said;if(done.has(key))return done.get(key);
 // A line the dictionary has not translated (or not yet) is still English: retell it in English.
 if(lang!=='en'&&said===src)lang='en';
 let out=said;const one=(entry,shown)=>lang==='en'?fillKin(entry,h):entry.customLang?.[h]?.[lang]??kinLang(shown,lang,entry,h);
 const exact=INDEX.get(src);
 if(exact)out=one(exact,said);
 else{
  const named=PEOPLE.find(([re])=>re.test(src));
  if(named){const [re,entry,keys]=named,names=src.match(re).slice(1),put=s=>keys.reduce((t,k,i)=>t.replace(k,names[i]),s);out=lang==='en'?put(fillKin(entry,h)):entry.customLang?.[h]?.[lang]!==undefined?put(entry.customLang[h][lang]):kinLang(said,lang,entry,h);}
  // A recap paragraph joins several authored sentences: retell each one it contains.
  else if(/mother|father|parents|\b(s?he|her|him|his)\b/i.test(src))for(const [line,entry] of INDEX){if(line.length<24||!src.includes(line))continue;const was=lang==='en'?line:translate(line),now=one(entry,was);if(was!==now)out=out.replaceAll(was,now);}
 }
 if(done.size>4096)done.clear();done.set(key,out);return out;
}
