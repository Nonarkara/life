// A painted street is finite. Pan inside it rather than tile unmatched edges.
export function travelFrame(width,height,imageWidth,imageHeight,progress,returning=false){
 // Twelve percent overscan gives the camera travel without exposing an edge.
 const scale=Math.max(width/imageWidth,height/imageHeight)*1.12,drawWidth=imageWidth*scale,drawHeight=imageHeight*scale;
 const p=Math.max(0,Math.min(1,progress??0));
 return {x:-(drawWidth-width)*(returning?1-p:p),y:height-drawHeight,drawWidth,drawHeight};
}
