// A finite preview owned by the user's action. Construction schedules nothing.
export function createSceneReel({count,draw,changed=()=>{},schedule=setTimeout,cancel=clearTimeout}){
 let index=0,running=false,timer=null;
 const status=()=>({index,running});
 function stop(){running=false;if(timer!==null)cancel(timer);timer=null;changed(status());}
 function next(){timer=null;if(!running)return;index++;draw(index);if(index>=count-1)stop();else timer=schedule(next,1500);}
 function play(){if(running)return;if(index>=count-1){index=0;draw(index);}running=true;changed(status());timer=schedule(next,1500);}
 function step(){stop();index=(index+1)%count;draw(index);}
 return {play,stop,step,status};
}
