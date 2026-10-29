// Reading the saved life. A save the game cannot open is never destroyed: it is copied
// aside before a new life starts, so an update that tightens validation, or a half-written
// save, cannot silently erase someone's life with the next autosave.
export const SAVE_KEY='life-course-v2',BACKUP_KEY='life-course-v2-unreadable';
// -> {life, storage, unreadable}: `life` is a valid saved life or null; `storage` says the
// browser let us read at all; `unreadable` says there was a save and it could not be opened.
export function readSave(storage,validate){
 let raw;
 try{raw=storage?.getItem(SAVE_KEY);}catch{return {life:null,storage:false,unreadable:false};}
 if(storage==null)return {life:null,storage:false,unreadable:false};
 if(!raw)return {life:null,storage:true,unreadable:false};
 try{const life=JSON.parse(raw);if(validate(life))return {life,storage:true,unreadable:false};}catch{}
 try{storage.setItem(BACKUP_KEY,raw);}catch{}
 return {life:null,storage:true,unreadable:true};
}
