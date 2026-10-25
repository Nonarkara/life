// Keep an unavailable font service out of the game's startup dependency chain.
// These are the existing families/weights. Screen CSS applies only after load.
(()=>{
 document.fonts?.addEventListener('loadingdone',()=>window.dispatchEvent(new Event('life-fonts-loaded')));
 const sheets=[
  'https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600&family=Noto+Sans+SC:wght@400;600&family=Noto+Sans+JP:wght@400;600&family=Noto+Sans+KR:wght@400;600&display=swap'
 ];
 for(const href of sheets){
  const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.media='print';link.dataset.lifeFonts='';
  link.addEventListener('load',()=>{link.media='all';},{once:true});
  document.head.append(link);
 }
})();
