import * as THREE from 'three';
import {lightRamp} from './art-direction.js';
// Garment-only masks keep the licensed source faces, skin, hair and footwear.
// Rest-position patterns share one shader program across every model and atlas.
const tops=['#bd8334','#3c6353','#a25946','#48697a','#ddd7c6','#6c5277','#455165','#7b7151','#b8c4bb','#7b4549','#334756','#d2ad77','#567573','#a4a27a','#b99c99','#514b43'];
const bottoms=['#303e4c','#78664e','#425546','#66535e','#686c70','#384450','#8a7059','#4c5867','#302f34','#9b917c','#6d7c78','#534b44'];
const patterns=['plain','fine stripe','rugby stripe','pinstripe','gingham','colour panel','contrast sleeves','trimmed collar','diagonal band','dotted knit','two tone','zip & side panels'];
let next=0;
export function visitorWardrobe(index,registered=true){
 const seed=registered?next++:Math.abs(index),top=tops[seed%tops.length],bottom=bottoms[Math.floor(seed/tops.length)%bottoms.length],pattern=(seed%patterns.length+Math.floor(seed/(tops.length*bottoms.length))*5)%patterns.length;
 const trim=tops[(seed*3+7)%tops.length],bottomPattern=Math.floor(seed/3)%3;
 return {id:`${top}/${bottom}/${patterns[pattern]}/${trim}/${bottomPattern}`,top,bottom,pattern,trim,bottomPattern,seed};
}
// A figure's whole outfit, set on a material already built.
export function applyWardrobe(material,w){const u=material.userData.visitorGarments;u.visitorTop.value.set(w.top);u.visitorBottom.value.set(w.bottom);u.visitorTrim.value.set(w.trim);u.visitorPattern.value=w.pattern;u.visitorBottomPattern.value=w.bottomPattern;}
export function makeVisitorMaterial(map,wardrobe){
 const material=new THREE.MeshToonMaterial({map,gradientMap:lightRamp(),alphaTest:.35,side:THREE.DoubleSide});
 const uniforms={visitorTop:{value:new THREE.Color(wardrobe.top)},visitorBottom:{value:new THREE.Color(wardrobe.bottom)},visitorTrim:{value:new THREE.Color(wardrobe.trim)},visitorPattern:{value:wardrobe.pattern},visitorBottomPattern:{value:wardrobe.bottomPattern}};
 material.userData.visitorGarments=uniforms;
 material.onBeforeCompile=shader=>{
  Object.assign(shader.uniforms,uniforms);
  shader.vertexShader='attribute float _garment;\nvarying float visitorGarment;\nvarying vec3 visitorClothPosition;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvisitorGarment = _garment;\nvisitorClothPosition = position;');
  shader.fragmentShader='varying float visitorGarment;\nvarying vec3 visitorClothPosition;\nuniform vec3 visitorTop;\nuniform vec3 visitorBottom;\nuniform vec3 visitorTrim;\nuniform float visitorPattern;\nuniform float visitorBottomPattern;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   if(visitorGarment>.5){
    vec3 p=visitorClothPosition,cloth=visitorGarment<1.5?visitorTop:visitorBottom;
    float shade=dot(diffuseColor.rgb/max(diffuse,vec3(.001)),vec3(.2126,.7152,.0722));
    if(visitorGarment<1.5){
     if(visitorPattern>.5&&visitorPattern<1.5)cloth=mix(cloth,visitorTrim,step(.82,fract(p.y*36.))*.65);
     else if(visitorPattern>1.5&&visitorPattern<2.5)cloth=mix(cloth,visitorTrim,step(.5,fract(p.y*9.)));
     else if(visitorPattern>2.5&&visitorPattern<3.5)cloth=mix(cloth,visitorTrim,step(.9,fract(p.x*42.))*.8);
     else if(visitorPattern>3.5&&visitorPattern<4.5)cloth*=mix(.62,1.05,mod(floor(p.x*36.)+floor(p.y*36.),2.));
     else if(visitorPattern>4.5&&visitorPattern<5.5)cloth=mix(cloth,visitorTrim,step(.02,p.x)*step(.92,p.y)*step(p.y,1.19));
     else if(visitorPattern>5.5&&visitorPattern<6.5)cloth=mix(cloth,visitorTrim,smoothstep(.115,.15,abs(p.x)));
     else if(visitorPattern>6.5&&visitorPattern<7.5)cloth=mix(cloth,visitorTrim,smoothstep(1.25,1.29,p.y)+step(p.y,.84));
     else if(visitorPattern>7.5&&visitorPattern<8.5)cloth=mix(cloth,visitorTrim,step(.72,fract(p.y*4.+p.x*3.)));
     else if(visitorPattern>8.5&&visitorPattern<9.5){vec2 q=fract(p.xy*45.)-.5;cloth=mix(cloth,visitorTrim,(1.-smoothstep(.10,.17,length(q)))*.75);}
     else if(visitorPattern>9.5&&visitorPattern<10.5)cloth=mix(cloth,visitorTrim,step(1.02,p.y));
     else if(visitorPattern>10.5){cloth=mix(cloth,visitorTrim,smoothstep(.09,.13,abs(p.x)));cloth=mix(cloth,vec3(.18),1.-smoothstep(.003,.006,abs(p.x)));}
    }else{
     if(visitorBottomPattern>.5&&visitorBottomPattern<1.5)cloth*=mix(.86,1.,step(.12,fract(p.x*54.)));
     else if(visitorBottomPattern>1.5)cloth=mix(cloth,visitorTrim,step(.145,abs(p.x))*.3);
    }
    diffuseColor.rgb=mix(diffuseColor.rgb,cloth*(.32+shade*.96)*diffuse,.9);
   }`);
 };
 material.customProgramCacheKey=()=> 'life-garment-mask-toon-v1';
 return material;
}
export function setVisitorTopColour(material,colour){
 const top=material?.userData?.visitorGarments?.visitorTop?.value;if(!top?.isColor)return false;top.set(colour);return true;
}
