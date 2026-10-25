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
 if(!ramp){ramp=new T.DataTexture(new Uint8Array([176,176,176,255,220,220,220,255,255,255,255,255]),3,1,T.RGBAFormat);ramp.minFilter=T.NearestFilter;ramp.magFilter=T.NearestFilter;ramp.generateMipmaps=false;ramp.needsUpdate=true;}
 return ramp;
}
export function illustratedMaterial(color,{character=false}={}){const chosen=roles.get(color)??color;return character?new T.MeshToonMaterial({color:chosen,gradientMap:lightRamp()}):new T.MeshLambertMaterial({color:chosen});}
