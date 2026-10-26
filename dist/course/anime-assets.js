// The painted stage art: one manifest, then only the plates and sprite frames a
// life actually needs. Nothing here touches the simulation; it only draws.
const manifestURL=new URL('./anime/manifest.json',import.meta.url);
// Paths in the manifest are written next to the manifest, so they are resolved
// against the art folder and never against the page.
const artBase=new URL('./anime/',import.meta.url);
const images=new Map();
let manifest=null,pending=null;

function loadManifest(){
  if(!pending)pending=fetch(manifestURL,{cache:'no-store'}).then(response=>{
    if(!response.ok)throw new Error('stage art unavailable');
    return response.json();
  }).then(data=>{manifest=data;return data;});
  return pending;
}

export function animeManifest(){return manifest;}

// One image per URL, decoded once and shared by every actor that needs it.
export function stageImage(url){
  if(!url)return null;
  const source=new URL(url,artBase).href;
  if(!images.has(source)){
    const image=new Image();
    image.decoding='async';
    image.src=source;
    images.set(source,image);
  }
  return images.get(source);
}

export function platePath(key){return manifest?.plates?.[key]??null;}
export function spritePath(sheet,frame){return manifest?.sprites?.[sheet]?.[frame]??null;}

// Every path the manifest names is versioned at build time, so a new build of
// the art can never be served from an old cache.
export async function prepareStageArt(){
  try{await loadManifest();}
  catch(error){pending=null;throw error;}
  // The plates are the face of the world: they are fetched straight away.
  for(const path of Object.values(manifest?.plates??{}))stageImage(path);
  return manifest;
}
