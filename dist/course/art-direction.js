import * as T from 'three';
// Palette/data/colors.json plate241: Red Orange / Dark Medici Blue /
// Pale Lemon Yellow / Isabella Color. These are screen reconstructions, not ink.
export const SOI_CHORD={plaster:'#d9c9a6',light:'#f5e4b4',shutter:'#55777c',wood:'#a38354',case:'#bd5038',ink:'#30494e'};
const roles=new Map([
 ['#c3b79e',SOI_CHORD.plaster],['#e5d9b9',SOI_CHORD.plaster],['#d7caab','#b8bca9'],
 ['#657974',SOI_CHORD.shutter],['#566f6b',SOI_CHORD.shutter],['#6c7d77',SOI_CHORD.shutter],
 ['#78918a','#73918d'],['#829a92','#73918d'],['#985c46',SOI_CHORD.case],
 ['#a99773',SOI_CHORD.wood],['#dbcfad',SOI_CHORD.plaster],['#c8bda1',SOI_CHORD.plaster],
 ['#e7dfcc',SOI_CHORD.light],['#eee7d6',SOI_CHORD.light],['#8f8f7c','#839494']
]);
let ramp;
export function lightRamp(){
 // Two hard bands, like a painted cel: light and one shadow, nothing in between.
 if(!ramp){ramp=new T.DataTexture(new Uint8Array([156,156,156,255,255,255,255,255]),2,1,T.RGBAFormat);ramp.minFilter=T.NearestFilter;ramp.magFilter=T.NearestFilter;ramp.generateMipmaps=false;ramp.needsUpdate=true;}
 return ramp;
}
// People are drawn; the world is a quieter painted set behind them. World colours
// lean toward the paper tone so the moving figures carry the eye.
const PAPER=new T.Color('#efe7d2');
export function illustratedMaterial(color,{character=false}={}){const chosen=roles.get(color)??color;if(character)return new T.MeshToonMaterial({color:chosen,gradientMap:lightRamp()});const m=new T.MeshLambertMaterial({color:chosen});m.color.lerp(PAPER,.2);return m;}
// An ink line around a drawn figure: the back faces of each part, pushed out along
// their normals and filled flat. It reads as a 2D outline at any camera angle.
const INK=new T.MeshBasicMaterial({color:'#25302c',side:T.BackSide});
INK.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed += normal * 0.018;');};
export function inkOutline(root){const parts=[];root.traverse(o=>{if(o.isMesh&&!o.userData.ink)parts.push(o);});for(const o of parts){const line=new T.Mesh(o.geometry,INK);line.userData.ink=true;line.castShadow=false;line.receiveShadow=false;o.add(line);}}
