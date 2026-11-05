// The live 3D scenes, keyed by their canvas. Kept in its own module so the
// painted world can reach the 3D canvas without importing the renderer: the
// renderer and its three.js library are a separate, later chunk.
export const scenes=new WeakMap();

export function showPaintedCanvas(original){
 const entry=scenes.get(original);if(entry&&entry!==false)entry.canvas.hidden=true;
 original.hidden=false;
}
