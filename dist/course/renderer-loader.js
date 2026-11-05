// Import only after a scene actually needs 3D. A held/paused world receives one
// redraw notification when the request settles; failure unlocks its Canvas fallback.
export function createRendererLoader(load,changed,warn=error=>console.warn('Life 3D unavailable; using Canvas.',error)){
 let status='idle',module=null;
 return {
  get pending(){return status==='loading';},
  request(){
   if(status==='idle'){
    status='loading';
    Promise.resolve().then(load).then(value=>{
     if(typeof value?.drawScene3D!=='function')throw new Error('Invalid Life renderer');
     module=value;status='ready';
    }).catch(error=>{status='failed';warn(error);}).finally(changed);
   }
   return module;
  }
 };
}
