import {cacheTranslations} from './translation-cache.js';
import {kinLine} from './kin.js';
export const languages={en:'English',th:'ไทย','zh-CN':'简体中文',ja:'日本語',ko:'한국어'};
const order=['th','zh-CN','ja','ko'];
let dictionary=new Map();
let phrasesLoaded=false;

// All five languages are loaded from translations.js at startup.
// Per-language packs (translations-th.js, etc.) exist in dist/course/ for
// future fine-grained lazy loading; the initial chunk still carries the full
// dictionary so tests and synchronous lookups work.
async function ensureDictionary(){
  if(phrasesLoaded) return;
  const {phrases}=await import('./translations.js');
  dictionary=new Map(phrases.map(row=>[row[0],row.slice(1)]));
  phrasesLoaded=true;
}
if(typeof window==='undefined'){
  await ensureDictionary();
}
const cachedTranslation=cacheTranslations(translateUncached);
export function translate(input,language='en'){
  // Until the dictionary has arrived nothing is looked up, so an English miss is never cached as the answer.
  if(language==='en'||!order.includes(language)||!input||!phrasesLoaded)return input;
  return cachedTranslation(String(input),language);
}
function translateUncached(input,language='en'){
  if(language==='en'||!order.includes(language)||!input)return input;
  const source=String(input),index=order.indexOf(language),direct=dictionary.get(source);if(direct)return direct[index];
  for(const[key,values]of [...dictionary].filter(([key])=>key.includes('{')).sort((a,b)=>b[0].replace(/\{\w+\}/g,'').length-a[0].replace(/\{\w+\}/g,'').length)){const names=[];const pattern=key.split(/(\{\w+\})/).map(part=>/^\{/.test(part)?(names.push(part.slice(1,-1)),/^\{(n|a|b)\}$/.test(part)?'([0-9]+)':'(.+?)'):part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('');const match=source.match(new RegExp('^'+pattern+'$'));if(match){let result=values[index];names.forEach((name,i)=>{result=result.replaceAll('{'+name+'}',translate(match[i+1],language));});return result;}}
  // Generated recap/captions join individually authored phrases and numbers.
  let result=source;
  // Named story sentences also occur inside longer life-record paragraphs.
  for(const[key,values]of dictionary){if(!/\{(?:friend|partner)\}/.test(key))continue;const names=[];const pattern=key.split(/(\{(?:friend|partner)\})/).map(part=>/^\{/.test(part)?(names.push(part.slice(1,-1)),'([A-Za-z]+)'):part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('');result=result.replace(new RegExp(pattern,'g'),(...match)=>{let out=values[index];names.forEach((name,i)=>{out=out.replaceAll('{'+name+'}',translate(match[i+1],language));});return out;});}
  for(const[key,values]of [...dictionary].filter(([key])=>!key.includes('{')&&key.length>2).sort((a,b)=>b[0].length-a[0].length)){if(result.includes(key))result=result.replaceAll(key,values[index]);}return result;
}
export let preferences={language:'en',size:'standard',motion:false,stage:'hybrid',palette:'auto'};
if(typeof localStorage!=='undefined')try{const p=JSON.parse(localStorage.getItem('life-preferences-v1'));if(p){if(languages[p.language])preferences.language=p.language;if(['standard','large','extra'].includes(p.size))preferences.size=p.size;preferences.motion=p.motion===true;if(p.stage==='isometric')preferences.stage='isometric';}}catch{}
// What a caller is about to show: the translation, retold for this life's household. Text that is
// translated before it reaches the page (the ending, the share card) is covered here, not only in localise.
export const t=text=>kinLine(text,translate(text,preferences.language),preferences.language,x=>translate(x,preferences.language));
// A visitor who comes back with a saved language gets it at load, not only after changing Settings.
if(typeof window!=='undefined'&&preferences.language!=='en')ensureDictionary().then(()=>{if(document.body)localise();}).catch(()=>{});
const textSources=new WeakMap(),attributeSources=new WeakMap();let queued=false;
export function localise(root=document.body){
  document.documentElement.lang=preferences.language;if(!document.documentElement.dataset.originalTitle)document.documentElement.dataset.originalTitle=document.title;document.title=t(document.documentElement.dataset.originalTitle);document.documentElement.dataset.textSize=preferences.size;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){if(node.parentElement?.closest('script,style,[data-native]'))continue;const raw=node.nodeValue;if(!raw.trim())continue;let record=textSources.get(node);if(!record||raw!==record.last)record={source:raw,last:raw};const src=record.source.trim(),next=record.source.replace(src,t(src));if(raw!==next)node.nodeValue=next;record.last=next;textSources.set(node,record);}
  for(const el of root.querySelectorAll('[aria-label],[title],[placeholder]')){let records=attributeSources.get(el)??{};for(const attr of ['aria-label','title','placeholder']){if(!el.hasAttribute(attr))continue;const raw=el.getAttribute(attr);let record=records[attr];if(!record||raw!==record.last)record={source:raw,last:raw};const next=t(record.source);if(next!==raw)el.setAttribute(attr,next);record.last=next;records[attr]=record;}attributeSources.set(el,records);}
}
export function applyPreferences(p){preferences={...preferences,...p};if(!languages[preferences.language])preferences.language='en';if(!['hybrid','isometric'].includes(preferences.stage))preferences.stage='hybrid';preferences.palette='auto';try{localStorage.setItem('life-preferences-v1',JSON.stringify({...preferences,v:3}));}catch{}if(preferences.language!=='en'&&!phrasesLoaded){ensureDictionary().then(()=>localise()).catch(()=>{});}else{localise();}window.dispatchEvent(new CustomEvent('life-preferences'));}
export function initSettings(){
  const dialog=document.createElement('dialog');dialog.id='settings-dialog';dialog.setAttribute('aria-label','Settings');dialog.innerHTML=`<form method="dialog"><div class="settings-head"><h2>Settings</h2><button type="submit">Close</button></div><label for="setting-language">Language</label><select id="setting-language" data-native>${Object.entries(languages).map(([key,name])=>`<option value="${key}">${name}</option>`).join('')}</select><label for="setting-size">Text size</label><select id="setting-size"><option value="standard">Standard</option><option value="large">Large</option><option value="extra">Extra large</option></select><label for="setting-stage">World</label><select id="setting-stage"><option value="hybrid">Diorama with line-drawn moments</option><option value="isometric">Isometric diorama</option></select><label class="motion-setting"><input type="checkbox" id="setting-motion"> <span>Reduce motion</span></label><p class="fine">Saved on this device.</p></form>`;document.body.append(dialog);
  const lang=dialog.querySelector('#setting-language'),size=dialog.querySelector('#setting-size'),motion=dialog.querySelector('#setting-motion'),stage=dialog.querySelector('#setting-stage');lang.value=preferences.language;size.value=preferences.size;motion.checked=preferences.motion;stage.value=preferences.stage;
  lang.onchange=()=>applyPreferences({language:lang.value});size.onchange=()=>applyPreferences({size:size.value});motion.onchange=()=>applyPreferences({motion:motion.checked});stage.onchange=()=>applyPreferences({stage:stage.value});
  document.querySelectorAll('[data-settings]').forEach(button=>button.addEventListener('click',()=>{dialog.showModal();window.dispatchEvent(new CustomEvent('life-settings-open'));}));
  localise();new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;localise();});}}).observe(document.body,{childList:true,subtree:true,characterData:true});
}
