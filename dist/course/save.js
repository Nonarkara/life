// Reading the saved life. A save the game cannot open is never destroyed: it is copied
// aside before a new life starts, so an update that tightens validation, or a half-written
// save, cannot silently erase someone's life with the next autosave.
export const SAVE_KEY='life-course-v2',BACKUP_KEY='life-course-v2-unreadable';
// -> {life, storage, unreadable}: `life` is a valid saved life or null; `storage` says the
// browser let us read at all; `unreadable` says there was a save and it could not be opened.
// A retired birth class opens as high class, so no earlier life is lost.
export function retireClass(life){for(const part of [life?.intake,life?.birth])if(part?.class==='royal_associated')part.class='high_class';return life;}
export function readSave(storage,validate){
 let raw;
 try{raw=storage?.getItem(SAVE_KEY);}catch{return {life:null,storage:false,unreadable:false};}
 if(storage==null)return {life:null,storage:false,unreadable:false};
 if(!raw)return {life:null,storage:true,unreadable:false};
 try{const life=retireClass(JSON.parse(raw));if(validate(life))return {life,storage:true,unreadable:false};}catch{}
 try{storage.setItem(BACKUP_KEY,raw);}catch{}
 return {life:null,storage:true,unreadable:true};
}
