// Requested fast-forward is preserved for travel. Reading never races a clock.
export function decisionTempo({stage,moving=false,incident=false,questions=false,outcome=false,speed=2,remaining=Infinity}){
 const review=stage==='review'&&!moving;
 const held=review&&!!(incident||questions||outcome);
 return {held,review,sceneSpeed:held?0:review?Math.min(speed,.5):speed,yearSpeed:moving&&remaining<=1?Math.min(speed,2):speed};
}
