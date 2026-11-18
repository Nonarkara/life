// Read-only: opening an archived album never changes the active life or its rewards.
import {t} from './i18n.js';
export function archivedAlbumView(album){
 const box=document.createElement('details');box.className='life-album';
 const summary=document.createElement('summary');summary.textContent=t('What you kept from this life');box.append(summary);
 // Separate complete phrases so a language pack arriving after intake renders
 // can translate each receipt without splitting its placeholders at a middle dot.
 const line=(...parts)=>{const p=document.createElement('p');for(const [i,text]of parts.entries()){if(i)p.append(document.createTextNode(' · '));const span=document.createElement('span');span.textContent=text;p.append(span);}box.append(p);};
 if(!album){line(t('This older life has no saved album.'));return box;}
 if(!album.entries.length&&!album.notes.length)line(t('Nothing recorded yet.'));
 for(const entry of album.entries){
  const date=entry.from===entry.to?t('Age {n}').replace('{n}',entry.from):entry.from+'–'+entry.to;
  const parts=[date,t(entry.label)];if(entry.days!==undefined)parts.push(t('Time: {days} d · Spent: {cash}').replace('{days}',entry.days).replace('{cash}','฿'+Math.round(entry.cost).toLocaleString('en')));line(...parts);
 }
 if(album.notes.length){
  const heading=document.createElement('h3');heading.textContent=t('What this life taught · {n} field notes').replace('{n}',album.notes.length);box.append(heading);
  for(const note of album.notes)line(t('Age {n}').replace('{n}',note.age),t(note.title),t(note.text));
 }
 return box;
}
