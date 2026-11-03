// The finishing pass for the 3D world: a retro cel look that matches the painted
// scenes. The frame is quantised to a coarse pixel grid, colour is posterised with
// an ordered dither (the way an old palette-limited screen shaded), unshaded edges
// get a one-pixel ink line, and a little film grain keeps the flat colour alive.
// Night lamps keep a quiet glow. All of it is Three.js's own addons.
// A governor watches frame time and sheds the outline on a slow device, so a cheap
// phone keeps the world moving instead of keeping the effect.
import * as T from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';

// ponytail: palette is per-channel levels, not a fixed 16-colour table; swap for a LUT if exact palettes matter.
const Retro={
 uniforms:{tDiffuse:{value:null},resolution:{value:new T.Vector2(1,1)},cell:{value:3},time:{value:0},outline:{value:1},levels:{value:10}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 resolution;uniform float cell,time,outline,levels;varying vec2 vUv;
 float b2(vec2 a){return fract(a.x*.5+a.y*a.y*.75);}
 float b4(vec2 a){return b2(.5*a)*.25+b2(a);}
 float luma(vec3 c){return dot(c,vec3(.299,.587,.114));}
 float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 vec3 at(vec2 g){return texture2D(tDiffuse,(g+.5)*cell/resolution).rgb;}
 void main(){
  vec2 g=floor(vUv*resolution/cell);vec3 c=at(g);
  float l=luma(c),e=0.;
  if(outline>.5){e=max(max(abs(l-luma(at(g+vec2(1.,0.)))),abs(l-luma(at(g+vec2(0.,1.))))),max(abs(l-luma(at(g-vec2(1.,0.)))),abs(l-luma(at(g-vec2(0.,1.))))));}
  // Shadows lean to the ink-teal of the painted plates, lights to warm lemon.
  c=pow(c,vec3(.86));c=mix(vec3(luma(c)),c,1.22);c=mix(c,c*vec3(1.06,.99,.9),.5);
  c=mix(c+(vec3(.2,.3,.32)-c)*.12,c,smoothstep(0.,.5,l));
  float d=b4(g)-.5;c=floor(c*(levels-1.)+.5+d*.38)/(levels-1.);
  float edge=step(.3,e)*(1.-step(.75,l));
  c=mix(c,vec3(.1,.14,.15),edge*.7);
  c+=(hash(g+floor(time*10.))-.5)*.035;
  float v=distance(vUv,vec2(.5));c*=1.-smoothstep(.45,.85,v)*.28;
  gl_FragColor=vec4(c,1.);}`
};

export function createPost(renderer,scene,camera){
 const target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:2});
 const composer=new EffectComposer(renderer,target);
 const bloom=new UnrealBloomPass(new T.Vector2(1,1),.2,.5,.92);
 const retro=new ShaderPass(Retro);
 composer.addPass(new RenderPass(scene,camera));composer.addPass(bloom);composer.addPass(new OutputPass());composer.addPass(retro);
 // Tier 1: everything. Tier 0: no outline and no glow, so colours never jump.
 let tier=1,frames=0,spent=0,last=0,windows=0,calm=0;
 const apply=()=>{bloom.enabled=tier>=1;retro.uniforms.outline.value=tier>=1?1:0;};
 return {
  // One art pixel is about two CSS pixels, whatever the screen density.
  setSize(w,h,ratio){composer.setPixelRatio(ratio);composer.setSize(w,h);retro.uniforms.resolution.value.set(w*ratio,h*ratio);retro.uniforms.cell.value=Math.max(2,Math.round((w<560?1.6:2)*ratio));},
  setNight(night){bloom.strength=night?.5:0;bloom.threshold=night?.72:.99;},
  // Frame-to-frame time includes the GPU, which is what a slow phone runs out of. The first
  // window (shader compiles) is ignored; a struggling device steps down, a recovered one steps back up.
  render(){
   const now=performance.now();if(last)spent+=Math.min(100,now-last);last=now;retro.uniforms.time.value=now/1000;
   if(++frames===90){const avg=spent/89;if(windows++>0){if(avg>24&&tier>0){tier--;apply();}else if(avg<15&&tier<1&&++calm>=3){tier++;apply();calm=0;}}frames=0;spent=0;}
   composer.render();
  },
  get tier(){return tier;},
  dispose(){for(const pass of composer.passes)pass.dispose?.();composer.dispose?.();target.dispose();}
 };
}
