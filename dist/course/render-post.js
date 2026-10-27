// The finishing pass for the 3D world: soft contact shading where things meet the
// ground (ambient occlusion), a quiet glow on lamps and windows at night, and a
// tilt-shift focus band that reads as a miniature set. All of it is Three.js's own
// addons; nothing is downloaded at run time.
// A governor watches frame time and sheds the expensive steps on a slow device, so a
// cheap phone keeps the world moving instead of keeping the effects.
import * as T from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {GTAOPass} from 'three/examples/jsm/postprocessing/GTAOPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';

// Blur grows away from a horizontal band, as a lens tilted toward a model would see it.
const TiltShift={
 uniforms:{tDiffuse:{value:null},resolution:{value:new T.Vector2(1,1)},focus:{value:.52},band:{value:.22},amount:{value:1.6}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 resolution;uniform float focus,band,amount;varying vec2 vUv;
 void main(){float d=max(0.,abs(vUv.y-focus)-band)/(1.-band);float r=amount*smoothstep(0.,1.,d)*2.2;
 vec4 c=texture2D(tDiffuse,vUv);if(r<.05){gl_FragColor=c;return;}
 vec2 px=r/resolution;vec4 s=c;
 s+=texture2D(tDiffuse,vUv+vec2(px.x,0.));s+=texture2D(tDiffuse,vUv-vec2(px.x,0.));
 s+=texture2D(tDiffuse,vUv+vec2(0.,px.y));s+=texture2D(tDiffuse,vUv-vec2(0.,px.y));
 s+=texture2D(tDiffuse,vUv+px*.7);s+=texture2D(tDiffuse,vUv-px*.7);
 s+=texture2D(tDiffuse,vUv+vec2(px.x,-px.y)*.7);s+=texture2D(tDiffuse,vUv+vec2(-px.x,px.y)*.7);
 gl_FragColor=s/9.;}`
};

export function createPost(renderer,scene,camera){
 const target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:2});
 const composer=new EffectComposer(renderer,target);
 const ao=new GTAOPass(scene,camera,1,1);ao.blendIntensity=.85;ao.updateGtaoMaterial({radius:.45,distanceExponent:1.4,thickness:1.2,scale:1,samples:12});ao.updatePdMaterial({samples:12,rings:2,radius:6});
 const bloom=new UnrealBloomPass(new T.Vector2(1,1),.32,.55,.86);
 const tilt=new ShaderPass(TiltShift);
 composer.addPass(new RenderPass(scene,camera));composer.addPass(ao);composer.addPass(bloom);composer.addPass(new OutputPass());composer.addPass(tilt);
 // Tier 2: everything. Tier 1: no occlusion (the most expensive step). Tier 0: colour pass only, so colours never jump.
 let tier=2,frames=0,spent=0,last=0,windows=0,calm=0;
 const apply=()=>{ao.enabled=tier>=2;bloom.enabled=tier>=1;tilt.enabled=tier>=1;};
 return {
  setSize(w,h,ratio){composer.setPixelRatio(ratio);composer.setSize(w,h);tilt.uniforms.resolution.value.set(w*ratio,h*ratio);},
  // Night lamps glow; daylight keeps the bloom threshold out of reach of plaster and paper.
  setNight(night){bloom.strength=night?.55:.18;bloom.threshold=night?.72:.92;},
  // Frame-to-frame time includes the GPU, which is what a slow phone runs out of. The first
  // window (shader compiles) is ignored; a struggling device steps down, a recovered one steps back up.
  render(){
   const now=performance.now();if(last)spent+=Math.min(100,now-last);last=now;
   if(++frames===90){const avg=spent/89;if(windows++>0){if(avg>24&&tier>0){tier--;apply();}else if(avg<15&&tier<2&&++calm>=3){tier++;apply();calm=0;}}frames=0;spent=0;}
   composer.render();
  },
  get tier(){return tier;},
  dispose(){for(const pass of composer.passes)pass.dispose?.();composer.dispose?.();target.dispose();}
 };
}
