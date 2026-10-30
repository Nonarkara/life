import {birthURL,dailyDateFor} from './birthcode.js';
// Pure payload generation keeps the day, translated result and immutable link together.
export function resultShare(state,{score=null,translate=x=>x,origin,now=new Date()}={}){
 const url=birthURL(state,origin,now);if(!url)return null;
 const day=dailyDateFor(state,now),key=day?'Daily life {day} (UTC): reached age {age}. Ikigai {score}/100 (game). Same birth, your choices:':'Reached age {age}. Ikigai {score}/100 (game). Same birth, your choices:';
 const text=translate(key).replace('{day}',day??'').replace('{age}',String(state.age)).replace('{score}',Number.isFinite(score)?String(score):'—');
 return {title:'Life2.0',text,url};
}
// Cancelling a native share never silently copies or downloads something instead.
function deadline(promise,ms){let timer;return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>{const error=new Error('Share operation timed out');error.name='ShareTimeout';reject(error);},ms);})]).finally(()=>clearTimeout(timer));}
export async function deliverShare(payload,api,{timeoutMs=10000,onWaiting}={}){
 if(!payload)return 'unavailable';
 if(typeof api?.share==='function'){
  // A share sheet may legitimately stay open. Show manual text, but keep the
  // native attempt in flight so a second click cannot copy behind that sheet.
  const timer=setTimeout(()=>onWaiting?.(),timeoutMs);
  try{await api.share(payload);return 'shared';}catch(error){if(error?.name==='AbortError')return 'cancelled';if(error?.name==='InvalidStateError')return 'manual';}finally{clearTimeout(timer);}
 }
 return copyShare(payload,api,{timeoutMs});
}

// Explicit copying never opens a native share sheet.
export async function copyShare(payload,api,{timeoutMs=10000}={}){
 if(!payload)return 'unavailable';
 try{if(typeof api?.clipboard?.writeText!=='function')return 'manual';await deadline(api.clipboard.writeText((payload.text?payload.text+' ':'')+payload.url),timeoutMs);return 'copied';}catch{return 'manual';}
}
export function canShareCard(file,api){try{const files=[].concat(file??[]);return files.length>0&&files.every(Boolean)&&typeof api?.share==='function'&&typeof api?.canShare==='function'&&api.canShare({files})===true;}catch{return false;}}
// This runs synchronously from the click up to api.share: the image is already ready.
export async function deliverCard(payload,api,{timeoutMs=10000,onWaiting}={}){
 if(!canShareCard(payload?.files,api))return 'unavailable';
 const timer=setTimeout(()=>onWaiting?.(),timeoutMs);
 try{await api.share(payload);return 'shared';}catch(error){return error?.name==='AbortError'?'cancelled':error?.name==='InvalidStateError'?'busy':'failed';}finally{clearTimeout(timer);}
}
