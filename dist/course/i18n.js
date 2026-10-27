import {phrases} from './translations.js';
import {cacheTranslations} from './translation-cache.js';
export const languages={en:'English',th:'ไทย','zh-CN':'简体中文',ja:'日本語',ko:'한국어'};
export const dictionary=new Map(phrases.map(row=>[row[0],row.slice(1)]));
const order=['th','zh-CN','ja','ko'];
const cachedTranslation=cacheTranslations(translateUncached);
export function translate(input,language='en'){
 if(language==='en'||!order.includes(language)||!input)return input;
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
export let preferences={language:'en',size:'standard',motion:false,stage:'hybrid'};
if(typeof localStorage!=='undefined')try{const p=JSON.parse(localStorage.getItem('life-preferences-v1'));if(p){if(languages[p.language])preferences.language=p.language;if(['standard','large','extra'].includes(p.size))preferences.size=p.size;preferences.motion=p.motion===true;if(['hybrid','painted','isometric'].includes(p.stage))preferences.stage=p.stage;}}catch{}
export const t=text=>translate(text,preferences.language);
const textSources=new WeakMap(),attributeSources=new WeakMap();let queued=false;
export function localise(root=document.body){
 document.documentElement.lang=preferences.language;if(!document.documentElement.dataset.originalTitle)document.documentElement.dataset.originalTitle=document.title;document.title=t(document.documentElement.dataset.originalTitle);document.documentElement.dataset.textSize=preferences.size;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){if(node.parentElement?.closest('script,style,[data-native]'))continue;const raw=node.nodeValue;if(!raw.trim())continue;let record=textSources.get(node);if(!record||raw!==record.last)record={source:raw,last:raw};const next=record.source.replace(record.source.trim(),t(record.source.trim()));if(raw!==next)node.nodeValue=next;record.last=next;textSources.set(node,record);}
 for(const el of root.querySelectorAll('[aria-label],[title],[placeholder]')){let records=attributeSources.get(el)??{};for(const attr of ['aria-label','title','placeholder']){if(!el.hasAttribute(attr))continue;const raw=el.getAttribute(attr);let record=records[attr];if(!record||raw!==record.last)record={source:raw,last:raw};const next=t(record.source);if(next!==raw)el.setAttribute(attr,next);record.last=next;records[attr]=record;}attributeSources.set(el,records);}
}
export function applyPreferences(p){preferences={...preferences,...p};if(!languages[preferences.language])preferences.language='en';if(!['hybrid','painted','isometric'].includes(preferences.stage))preferences.stage='hybrid';try{localStorage.setItem('life-preferences-v1',JSON.stringify(preferences));}catch{}localise();window.dispatchEvent(new CustomEvent('life-preferences'));}
export function initSettings(){
 const dialog=document.createElement('dialog');dialog.id='settings-dialog';dialog.innerHTML=`<form method="dialog"><div class="settings-head"><h2>Settings</h2><button type="submit">Close</button></div><label for="setting-language">Language</label><select id="setting-language" data-native>${Object.entries(languages).map(([key,name])=>`<option value="${key}">${name}</option>`).join('')}</select><label for="setting-size">Text size</label><select id="setting-size"><option value="standard">Standard</option><option value="large">Large</option><option value="extra">Extra large</option></select><label for="setting-stage">World</label><select id="setting-stage"><option value="hybrid">Hybrid · world and moments</option><option value="painted">Painted stage</option><option value="isometric">Isometric diorama</option></select><label class="motion-setting"><input type="checkbox" id="setting-motion"> <span>Reduce motion</span></label><p class="fine">Saved on this device.</p></form>`;document.body.append(dialog);
 const lang=dialog.querySelector('#setting-language'),size=dialog.querySelector('#setting-size'),motion=dialog.querySelector('#setting-motion'),stage=dialog.querySelector('#setting-stage');lang.value=preferences.language;size.value=preferences.size;motion.checked=preferences.motion;stage.value=preferences.stage;
 lang.onchange=()=>applyPreferences({language:lang.value});size.onchange=()=>applyPreferences({size:size.value});motion.onchange=()=>applyPreferences({motion:motion.checked});stage.onchange=()=>applyPreferences({stage:stage.value});
 document.querySelectorAll('[data-settings]').forEach(button=>button.addEventListener('click',()=>{dialog.showModal();window.dispatchEvent(new CustomEvent('life-settings-open'));}));
 localise();new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;localise();});}}).observe(document.body,{childList:true,subtree:true,characterData:true});
}
