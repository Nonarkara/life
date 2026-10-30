// A slow earlier drawing must never replace the image for the current caption.
export function cardPreparation(make,onChange){
 let revision=0,state={status:'idle',file:null};
 const set=value=>{state=value;onChange(state);};
 return {get state(){return state;},invalidate(){revision++;set({status:'idle',file:null});},async prepare(words){const request=++revision;set({status:'preparing',file:null});try{const file=await make(words);if(request!==revision)return;set({status:'ready',file});}catch{if(request===revision)set({status:'failed',file:null});}}};
}
