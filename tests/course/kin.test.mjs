// A life reads scenes written for a mother and a father as told for the household it has.
import test from 'node:test';import assert from 'node:assert/strict';
import {KIN_SCENES} from '../../dist/course/kin-plan.js';
import {fillKin,kinEntry,kinGated,kinLine,kinLang,HOUSE} from '../../dist/course/kin.js';
import {ENCOUNTERS,offerEncounter,eligibleEncounters} from '../../dist/course/encounters.js';
import {ROUTE_DATA} from '../../dist/course/route-data.js';
import {newLife,begin,live,configureLife,rand,validate,CLASS_KEYS} from '../../dist/course/sim.js';
import {pendingPivots,applyPivot,openOptions} from '../../dist/course/pivots.js';
import {encounterById,resolveEncounter} from '../../dist/course/encounters.js';
import {choiceAvailable} from '../../dist/course/finance.js';
import {translate,t} from '../../dist/course/i18n.js';
import {setKin} from '../../dist/course/kin.js';
import {readFileSync} from 'node:fs';

const HS=['GM','GF','MM','FF'],all=Object.entries(KIN_SCENES).flatMap(([id,sc])=>[...new Set([...Object.keys(sc.strings??{}),...Object.keys(sc.custom??{})])].map(src=>[id,sc,src]));
const plain=tpl=>tpl.replace(/\{([A-Za-z']+)\}/g,(m,k)=>k==='friend'||k==='partner'?m:k==="her's"?'her':k);

test('a father line is retold for each household, with his pronouns',()=>{
 const e={tpl:'Your {father} has brought a radio home and says only {he} may touch it. Ask {him} how it works: it is {his} radio.'};
 assert.equal(fillKin(e,'GM'),'Your grandmother has brought a radio home and says only she may touch it. Ask her how it works: it is her radio.');
 assert.equal(fillKin(e,'MM'),'Your other mother has brought a radio home and says only she may touch it. Ask her how it works: it is her radio.');
 assert.equal(fillKin(e,'GF'),'Your father has brought a radio home and says only he may touch it. Ask him how it works: it is his radio.');
 assert.equal(fillKin(e,'FF'),fillKin(e,'GF'));
});
test('a mother line is retold for each household, and her and her’s are told apart',()=>{
 const e={tpl:'Your {mother} lets you use {her\'s} phone. Tell {her}. {She} did it {herself}; your {parents} know.'};
 assert.equal(fillKin(e,'FF'),'Your other father lets you use his phone. Tell him. He did it himself; your parents know.');
 assert.equal(fillKin(e,'GF'),'Your grandmother lets you use her phone. Tell her. She did it herself; your family know.');
 assert.equal(fillKin(e,'GM'),'Your mother lets you use her phone. Tell her. She did it herself; your family know.');
 assert.equal(fillKin(e,'MM'),'Your mother lets you use her phone. Tell her. She did it herself; your parents know.');
 assert.equal(fillKin({tpl:'x {mother}',custom:{FF:'exact text'}},'FF'),'exact text');
});
test('every template is the authored line with tokens: the parents household is never touched',()=>{
 let n=0;for(const [id,sc] of Object.entries(KIN_SCENES))for(const [src,tpl] of Object.entries(sc.strings??{})){n++;assert.equal(plain(tpl),src,id);assert.ok(/\{(mother|father|parents|she|her|her's|herself|hers|he|him|his|himself)\}/i.test(tpl),id+': '+tpl);}
 assert.ok(n>350,'templates: '+n);
 assert.equal(kinLine('Tell your mother','Tell your mother','en',x=>x,null),'Tell your mother');
});
test('every line in the plan belongs to its scene, and no filled line keeps a token or the missing parent',()=>{
 const strings=new Map(ENCOUNTERS.map(e=>[e.id,JSON.stringify(e)]));
 for(const [id,sc,src] of all){if(strings.has(id))assert.ok(strings.get(id).includes(JSON.stringify(src).slice(1,-1)),id+' has '+src.slice(0,40));
  const e=kinEntry(src);for(const h of HS){if(sc.gate?.includes(h))continue;const out=fillKin(e,h);assert.ok(!/\{(?!friend|partner)[A-Za-z']+\}/.test(out),h+' '+out);
   // Where the line names the player's own parent, the household's missing one is gone.
   if(/\{mother\}/i.test(e.tpl)&&(h==='GF'||h==='FF')&&!e.custom?.[h])assert.ok(!/\byour mother\b/i.test(out),h+' '+out);
   if(/\{father\}/i.test(e.tpl)&&(h==='GM'||h==='MM')&&!e.custom?.[h])assert.ok(!/\byour father\b/i.test(out),h+' '+out);}}
});
test('the second parent of the same sex is always the other one, so the two stay two people',()=>{
 for(const [id,sc,src] of all){const e=kinEntry(src);
  if(!sc.gate?.includes('FF')&&/\{mother\}/i.test(e.tpl)&&!e.custom?.FF)assert.match(fillKin(e,'FF'),/other father/i,id);
  if(!sc.gate?.includes('MM')&&/\{father\}/i.test(e.tpl)&&!e.custom?.MM)assert.match(fillKin(e,'MM'),/other mother/i,id);}
});
test('a stored outcome with a name in it, and a paragraph that joins lines, are retold too',()=>{
 const [id,,src]=all.find(([, ,s])=>/\{partner\}/.test(s)&&/\{parents\}/.test(kinEntry(s).tpl)),named=src.replace('{partner}','Malee');
 assert.equal(kinLine(named,named,'en',x=>x,'GF'),fillKin(kinEntry(src),'GF').replace('{partner}','Malee'),id);
 const a='You promised later. Your mother kept the saffron cloth she had bought, folded in a drawer.',joined='At 25: '+a+' Then the rains came.';
 assert.equal(kinLine(joined,joined,'en',x=>x,'FF'),'At 25: You promised later. Your other father kept the saffron cloth he had bought, folded in a drawer. Then the rains came.');
});
test('the same change is carried into each translation, and look-alike words are left alone',()=>{
 const father={tpl:'Your {father} says only {he} may touch it.',mixed:{}},mother={tpl:'Tell {her}',mixed:{}};
 assert.equal(kinLang('พ่อของคุณเอาวิทยุกลับบ้าน พ่อแม่ไม่ว่าอะไร พ่อค้าก็เห็น','th',father,'GM'),'ยายของคุณเอาวิทยุกลับบ้าน พ่อแม่ไม่ว่าอะไร พ่อค้าก็เห็น');
 assert.equal(kinLang('บอกแม่ที่ริมแม่น้ำ','th',mother,'GF'),'บอกย่าที่ริมแม่น้ำ','Thai repeats the kin word where English says her');
 assert.equal(kinLang('บอกแม่','th',mother,'FF'),'บอกพ่ออีกคน');
 assert.equal(kinLang('你父亲说只有他能碰。姑妈也在。','zh-CN',father,'GM'),'你外婆说只有她能碰。姑妈也在。');
 assert.equal(kinLang('你爸爸说只有他能碰。','zh-CN',father,'MM'),'你另一位母亲说只有她能碰。');
 assert.equal(kinLang('お母さんに言う。祖母は母校にいた。','ja',mother,'FF'),'もう一人の父に言う。祖母は母校にいた。');
 assert.equal(kinLang('아버지가 말했다. 그는 웃었다. 그 집에서.','ko',father,'GM'),'할머니가 말했다. 그녀는 웃었다. 그 집에서.');
 // A line with another woman in it keeps its pronouns: only the English was read word by word.
 assert.equal(kinLang('她说没事。邻居说她见过。','zh-CN',{tpl:'{She} said. The neighbour said she had.',mixed:{mother:true}},'FF'),'她说没事。邻居说她见过。');
 assert.equal(translate('Tell your mother','th')==='Tell your mother',false);
});
// The household is drawn from the seed and checked on load, so lives are played as born.
const play=(seed,cls)=>{let s=begin(configureLife(newLife(seed),{class:cls,sex:'female',birthYear:1981}));const met=[];
 const settle=()=>{for(let n=0;n<12;n++){const list=pendingPivots(s);if(!list.length)break;const q=list[0],open=openOptions(q,s),next=applyPivot(s,q,open[Math.floor(rand(seed,s.age,'k'+q.id)*open.length)].id);if(next===s)break;s=next;}
  if(s.story?.pending){const e=encounterById(s.story.pending.id);met.push(e.id);const open=e.options.filter(o=>choiceAvailable(s,o)),list=open.length?open:e.options;s=resolveEncounter(s,list[Math.floor(rand(seed,s.age,'k'+e.id)*list.length)].id,.5);}};
 settle();for(let g=0;g<30&&s.stage==='review'&&s.age<80;g++){const next=live(s);if(next===s)break;s=next;settle();}return {s,met};};
test('a scene whose premise needs the missing parent is never offered to that household, and saves stay valid',()=>{
 const gated=Object.entries(KIN_SCENES).filter(([,sc])=>sc.gate);assert.ok(gated.length>=5);
 const route=new Set(ROUTE_DATA.flatMap(r=>r.scenes.map(x=>x.id)));for(const [id] of gated)assert.ok(!route.has(id)&&!/^(pivot|child):/.test(id),id+' is a required scene and cannot be withheld');
 assert.equal(kinGated('g_eldest','fathers'),true);assert.equal(kinGated('g_eldest','parents'),false);assert.equal(kinGated('g_eldest',undefined),false);assert.equal(kinGated('class_photo','fathers'),false);
 const seen={},metByParents=new Set();
 for(const cls of CLASS_KEYS)for(let i=1;i<=90;i++){const {s,met}=play(i*7919+CLASS_KEYS.indexOf(cls)*104729,cls),household=s.birth.household;seen[household]=(seen[household]??0)+1;
  assert.equal(validate(JSON.parse(JSON.stringify(s))),true,household);
  for(const id of met){if(household==='parents')metByParents.add(id);else assert.ok(!kinGated(id,household),household+' met '+id);}}
 for(const household of ['parents',...Object.keys(HOUSE)])assert.ok(seen[household]>=5,household+': '+seen[household]);
 assert.ok(gated.some(([id])=>metByParents.has(id)),'the withheld scenes are real ones that a mother-and-father life does meet');
});
test('withholding is at the offer only: a scene already met stays a valid record',()=>{
 const withheld=ENCOUNTERS.find(e=>e.id==='g_eldest');assert.ok(withheld);
 const src=(offerEncounter+'')+(eligibleEncounters+'');assert.ok((offerEncounter+'').includes('kinGated'));assert.ok(!(eligibleEncounters+'').includes('kinGated'));
});

test('where swapping the word was not enough, the line read for that language is used',()=>{
 const src='Your friends ate half the stock. Your mother charged their mothers.',e=kinEntry(src),was=translate(src,'th');
 const now=kinLine(src,was,'th',x=>translate(x,'th'),'GF');
 assert.equal(now,e.customLang.GF.th);assert.notEqual(now,was);assert.notEqual(now,kinLang(was,'th',{...e,customLang:undefined},'GF'),'the other children’s mothers stay mothers');
 let n=0;for(const sc of Object.values(KIN_SCENES))for(const [line,c] of Object.entries(sc.custom??{}))for(const h of Object.keys(c)){if(sc.gate?.includes(h))continue;for(const lang of ['th','zh-CN','ja','ko']){if(translate(line,lang)===line)continue;n++;assert.equal(typeof sc.customLang?.[line]?.[h]?.[lang],'string',lang+' '+h+' '+line.slice(0,40));}}
 assert.ok(n>250,'hand-written lines carried into four languages: '+n);
 for(const sc of Object.values(KIN_SCENES))for(const byH of Object.values(sc.customLang??{}))for(const byL of Object.values(byH))for(const t of Object.values(byL))assert.ok(t.length>0&&!/\{(?!friend|partner)/.test(t));
});

test('text a caller translates itself is retold too, and only while a household is set',()=>{
 try{setKin('fathers');assert.equal(t('Tell your mother'),'Tell your other father');
  assert.equal(t('Brass amulet from your father'),'Brass amulet from your father');
  setKin('mothers');assert.equal(t('Brass amulet from your father'),'Brass amulet from your other mother');
  setKin('grandfather');assert.equal(t('Your mother’s world becomes yours.'),'Your grandmother’s world becomes yours.');
  assert.equal(t('Back with your parents.'),'Back with your father.');
  assert.equal(t('There is no work at home after the harvest, so your family moves to Rayong. Your parents find jobs; you find a new lane to play in.'),'There is no work at home after the harvest, so your family moves to Rayong. Your family find jobs; you find a new lane to play in.');
  setKin('parents');assert.equal(t('Tell your mother'),'Tell your mother');
 }finally{setKin(undefined);}
 assert.equal(t('Tell your mother'),'Tell your mother');
});
test('two fathers or two mothers do not lose the same parent twice',()=>{
 const first='Your father dies. The family has to find a different rhythm. There is nothing to divide.',second='Your father dies. Familiar places carry different memories. There is nothing to divide.';
 assert.equal(kinLine(first,first,'en',x=>x,'FF'),first);
 assert.equal(kinLine(second,second,'en',x=>x,'FF'),'Your other father dies. Familiar places carry different memories. There is nothing to divide.');
 const m='Your mother dies. The family has to find a different rhythm.';assert.equal(kinLine(m,m,'en',x=>x,'MM'),'Your other mother dies. The family has to find a different rhythm.');
 assert.equal(kinLine(m,m,'en',x=>x,'GM'),m);
 for(const lang of ['th','zh-CN','ja','ko'])assert.ok(!/dies/.test(KIN_SCENES.misc.customLang[m].MM[lang]),lang);
});
test('a line the dictionary has not translated is still retold, in English',()=>{
 const src='She calculates so that you will not.';assert.equal(kinLine(src,src,'th',x=>x,'FF'),'He calculates so that you will not.');
});
test('the page, the render loop and the language loader are wired to it',()=>{
 const src=f=>readFileSync(new URL('../../dist/course/'+f,import.meta.url),'utf8');
 assert.ok(src('i18n.js').includes('next=record.source.replace(src,t(src))'),'every text node goes through t');
 assert.ok(src('game.js').includes('function render(){setKin(state.birth?.household);'));
 // A visitor who returns with a saved language gets the pack at load, and no English miss is cached before it arrives.
 assert.ok(src('i18n.js').includes("if(typeof window!=='undefined'&&preferences.language!=='en')"),'the saved language loads at boot');
 assert.match(src('i18n.js'),/loadPack\(preferences.language\)\.then\(\(\)=>\{\s*if\(document.body\)localise\(\);/,'the boot loader localises once the pack lands');
 assert.ok(src('i18n.js').includes('input&&!packs.has(language)?translateUncached(input,language)'),'a pre-pack miss is never cached as the answer');
});

test('a line already retold in English and copied elsewhere on the page is left alone, or translated from its original',()=>{
 const src='Your mother wants you ordained',now='Your grandmother wants you ordained',th=x=>translate(x,'th');
 assert.equal(kinLine(now,now,'en',x=>x,'GF'),now,'not retold twice');
 const shown=kinLine(now,translate(now,'th'),'th',th,'GF');
 assert.equal(shown,kinLine(src,translate(src,'th'),'th',th,'GF'));assert.ok(!/[A-Za-z]{4,}/.test(shown),'no English left: '+shown);
 const file=readFileSync(new URL('../../dist/course/i18n.js',import.meta.url),'utf8');
 assert.ok(file.includes("language!=='en'&&order.includes(language)&&!packs.has(language)?text:kinLine("),'nothing is retold before the language pack has arrived');
});
