// The town you are about to be born into, every house open. Kept out of the form's own bundle:
// three.js loads only if someone asks to see the town.
import {drawScene3D} from '../course/scene3d.js';
import {newLife,begin,configureLife} from '../course/sim.js';
const AGE=8;
export function townPicker(canvas,onPins){
 let raf=0,life=null,start=0;
 const frame=now=>{if(!life)return;const ok=drawScene3D(canvas,life,AGE,(now-start)/1000+10,'world',{pick:onPins});if(!ok){onPins(null);return;}raf=requestAnimationFrame(frame);};
 return {show(birthYear){life={...begin(configureLife(newLife(4242),{birthYear,class:'middle_class',region:'samut-prakan',sex:'female'})),age:AGE};start=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);},hide(){life=null;cancelAnimationFrame(raf);}};
}
