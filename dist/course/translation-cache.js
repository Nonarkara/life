// The dictionary is fixed for one built module graph. Repeated animation captions
// and DOM scans reuse results; dynamic ages/amounts cannot grow memory forever.
export function cacheTranslations(lookup,limit=4096){
 const values=new Map();
 return (text,language)=>{
  const key=JSON.stringify([language,text]);
  if(values.has(key)){const value=values.get(key);values.delete(key);values.set(key,value);return value;}
  const value=lookup(text,language);
  if(values.size>=limit)values.delete(values.keys().next().value);
  values.set(key,value);return value;
 };
}
