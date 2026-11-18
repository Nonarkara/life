import {t} from './i18n.js';
import {albumSummary} from './album-summary.js';
import {archivedAlbumView} from './album-view.js';
import {encodeBirth,decodeBirth,birthURL} from './birthcode.js';
import {turningPointURL} from './turning-points.js';
import {THAI_PROVINCES} from './thailand-birth-map.js';
import {birthProvince} from './birth-opening.js';
const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=t(text);if(cls)el.className=cls;return el;};
const appendParts=(el,parts)=>parts.forEach((part,i)=>{if(i)el.append(document.createTextNode(' · '));el.append(node('span',part));});
export function matchingTurn(entry,turns){return turns.find(point=>point.state.age<=entry.age&&encodeBirth(point.state)===entry.code)??null;}
function locator(birth){
 const figure=node('figure',undefined,'notebook-locator'),svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),province=birth?birthProvince(birth):null;
 const frame=province?(()=>{const[x,y,r,b]=province[2];return[x-12,y-12,r-x+24,b-y+24].join(' ');})():'-10 -9 224 310';svg.setAttribute('viewBox',frame);svg.setAttribute('fill-rule','evenodd');svg.setAttribute('role','img');svg.setAttribute('aria-label',t(birth?'Birthplace':'Thailand'));
 for(const row of THAI_PROVINCES){const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',row[1]);path.setAttribute('class',row===province?'birth-province':'province');const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=row[0];path.append(title);svg.append(path);}
 const credit=node('a',birth?'Present-day · Natural Earth':'Present-day locator · Natural Earth');credit.href='https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/';const caption=node('figcaption');caption.append(credit);figure.append(svg,caption);return figure;
}
export function emptyNotebook(){const section=node('section',undefined,'unlived-notebook');section.append(locator(null),node('h2','Where you begin'),node('p','Your birthplace is drawn next.'));return section;}
export function rememberedLife(entry,turns=[]){
 const section=node('section',undefined,'remembered-life'),birth=decodeBirth(entry.code),summary=albumSummary(entry.album),turn=matchingTurn(entry,turns);
 const head=node('div',undefined,'remembered-head'),identity=node('div',undefined,'remembered-identity');
 identity.append(node('p','Your last life began in','notebook-caption'),node('h2',entry.place));
 const era=node('p',undefined,'remembered-era'),born=birth?.intake?.birthYear??birth?.birth?.birthYear;
 appendParts(era,[...(Number.isInteger(born)?[String(born)+'–'+(born+entry.age)]:[]),t('Age {n}').replace('{n}',entry.age)]);identity.append(era);
 if(entry.words){const words=document.createElement('blockquote');words.dataset.native='';words.textContent='“'+entry.words+'”';identity.append(words);}
 head.append(identity);if(birth&&birthProvince(birth))head.append(locator(birth));section.append(head);
 const fork=node('div',undefined,'remembered-fork');
 if(turn){const saved=node('p',undefined,'notebook-caption');appendParts(saved,[t('Saved for this birth'),t('Age {n}').replace('{n}',turn.state.age)]);fork.append(saved,node('h3',turn.title));const answer=node('p',undefined,'prior-answer');appendParts(answer,[t('First saved choice'),t(turn.answer)]);fork.append(answer);const again=node('a','Choose again','fork-again');again.href=turningPointURL(turn.id);fork.append(again);}
 else{const again=node('a','Live this birth again','fork-again');again.href=birth?birthURL({...birth,...(entry.dailyDay?{dailyDay:entry.dailyDay}:{})}):'?birth='+encodeURIComponent(entry.code);fork.append(again);}
 section.append(fork);
 if(summary.notes.length){const note=summary.notes[0],detail=node('details',undefined,'remembered-note'),excerpt=node('p',note.text,'note-excerpt');excerpt.setAttribute('aria-hidden','true');detail.append(node('summary','Read field note'),node('p',note.text));section.append(node('p','A field note from this life','notebook-caption'),node('h3',note.title,'note-title'),excerpt,detail);}
 const collection=node('div',undefined,'remembered-collection');
 if(summary.periods.length){const row=node('p');for(const [i,e]of summary.periods.slice(0,2).entries()){if(i)row.append(document.createTextNode(' · '));row.append(node('span',e.label),document.createTextNode(' '+e.from+'–'+e.to));}collection.append(row);}
 if(summary.activities.length){const e=summary.activities[0],row=node('p');appendParts(row,[t(e.label==='Spend a day at the library'?'Library days':e.label),t('×{n} · {days} d').replace('{n}',e.count).replace('{days}',e.days)]);collection.append(row);}
 if(summary.journeys.length){const row=node('p');appendParts(row,[t('{n} moments along the way').replace('{n}',summary.journeys.length),t(summary.journeys[0].label)]);collection.append(row);}
 if(collection.children.length){section.append(node('p','Collected along the way','notebook-caption'),collection);}
 const full=archivedAlbumView(entry.album);full.querySelector('summary').textContent=t('Full life record');section.append(full);return section;
}
