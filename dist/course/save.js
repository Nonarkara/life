// Reading the saved life. A save the game cannot open is never destroyed: it is copied
// aside before a new life starts, so an update that tightens validation, or a half-written
// save, cannot silently erase someone's life with the next autosave.
export const SAVE_KEY='life-course-v2',BACKUP_KEY='life-course-v2-unreadable';
// -> {life, storage, unreadable}: `life` is a valid saved life or null; `storage` says the
// browser let us read at all; `unreadable` says there was a save and it could not be opened.
// A retired birth class opens as high class, so no earlier life is lost.
export function retireClass(life){for(const part of [life?.intake,life?.birth])if(part?.class==='royal_associated')part.class='high_class';return life;}
export function readSave(storage,validate){
 if(!storage)return {life:null,storage:false,unreadable:false,raw:null};
 let raw;
 try{raw=storage.getItem(SAVE_KEY);}catch{return {life:null,storage:false,unreadable:false,raw:null};}
 if(raw===null)return {life:null,storage:true,unreadable:false,raw};
 try{const life=retireClass(JSON.parse(raw));if(validate(life))return {life,storage:true,unreadable:false,raw};}catch{}
 let backedUp=false;
 try{
  if(storage.getItem(BACKUP_KEY)===null)storage.setItem(BACKUP_KEY,raw);
  backedUp=storage.getItem(BACKUP_KEY)===raw;
 }catch{}
 return {life:null,storage:true,unreadable:true,raw,backedUp};
}

// One open page owns its last observed value. Compare before writing so a stale
// page cannot silently replace progress from a tab that saved in the meantime.
export function saveSession(storage,validate){
 const initial=readSave(storage,validate);
 let expected=initial.raw,unreadable=initial.unreadable;
 const write=(life,archive)=>{
  if(!initial.storage)return 'unavailable';
  try{
   if(storage.getItem(SAVE_KEY)!==expected)return 'changed';
   if(unreadable&&(!archive||!initial.backedUp||storage.getItem(BACKUP_KEY)!==expected))return 'unreadable';
   const next=JSON.stringify(life);
   if(next===expected)return 'saved';
   if(!validate(life))return 'invalid';
   if(archive&&initial.life&&!archive(initial.life))return 'archive';
   if(storage.getItem(SAVE_KEY)!==expected)return 'changed';
   storage.setItem(SAVE_KEY,next);
   expected=next;
   unreadable=false;
   return 'saved';
  }catch{return 'unavailable';}
 };
 return {initial,write};
}
