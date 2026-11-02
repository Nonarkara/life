// A painted street is finite. Pan inside it rather than tile unmatched edges.
export function travelFrame(width,height,imageWidth,imageHeight,progress,returning=false){
 // Twelve percent overscan gives the camera travel without exposing an edge.
 const scale=Math.max(width/imageWidth,height/imageHeight)*1.12,drawWidth=imageWidth*scale,drawHeight=imageHeight*scale;
 const p=Math.max(0,Math.min(1,progress??0));
 return {x:-(drawWidth-width)*(returning?1-p:p),y:height-drawHeight,drawWidth,drawHeight};
}
// Keep a source-space floor anchor visible on a narrow screen. Scenery and
// figures use this same transform; never clamp the person independently.
export function anchoredPlateFrame(width,height,imageWidth,imageHeight,focus=.5){
 const scale=Math.max(width/imageWidth,height/imageHeight),drawWidth=imageWidth*scale,drawHeight=imageHeight*scale;
 const x=Math.max(width-drawWidth,Math.min(0,width/2-Math.max(0,Math.min(1,focus))*drawWidth));
 return {x,y:height-drawHeight,drawWidth,drawHeight};
}
