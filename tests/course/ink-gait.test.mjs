import test from 'node:test';
import assert from 'node:assert/strict';
import {gait,spring,pendulum,openLimbPaths,thaiRigSVG} from '../../dist/course/ink-gait.js';

test('gait solver plants stance foot at exact travel speed without NaN across walk, shuffle, and run',()=>{
 for(const kind of ['walk','shuffle','run']){
  const g=gait({kind});
  assert.ok(g.speed>0&&Number.isFinite(g.speed),kind+' speed finite');
  for(let i=0;i<20;i++){
   const p=g.pose(i/20,1);
   assert.ok(Number.isFinite(p.hip[0])&&Number.isFinite(p.hip[1]),kind+' hip finite');
   for(const ft of p.feet){
    assert.ok(Number.isFinite(ft.ankle[0])&&Number.isFinite(ft.ankle[1]),kind+' ankle finite');
    assert.ok(Number.isFinite(ft.knee[0])&&Number.isFinite(ft.knee[1]),kind+' knee finite');
   }
  }
 }
 // Verify planted foot slides back by exact speed*dt in stance phase
 const w=gait({kind:'walk'});
 const dt=0.1;
 const p0=w.pose(0.1,1),p1=w.pose(0.1+dt/w.period,1);
 assert.equal(p0.feet[0].stance,true);
 assert.equal(p1.feet[0].stance,true);
 const dx=p0.feet[0].ankle[0]-p1.feet[0].ankle[0];
 assert.ok(Math.abs(dx-w.speed*dt)<0.05,`planted foot drift ${dx} vs speed*dt ${w.speed*dt}`);
});

test('spring, pendulum, openLimbPaths, and parametric Thai rig render valid finite SVG across ages',()=>{
 const sp=spring(40,6,0),pd=pendulum(10,1.1,0);
 assert.ok(Number.isFinite(sp.step(5,0.016)));
 assert.ok(Number.isFinite(pd.step(1.2,0.016)));
 const limb=openLimbPaths([[40,70],[42,95],[44,118]],3.6);
 assert.ok(limb.fill.startsWith('M')&&limb.stroke.startsWith('M')&&!limb.fill.includes('NaN'));
 const p=gait({kind:'walk'}).pose(0.25,1);
 for(const age of ['child','adult','elder']){
  for(const sex of ['female','male']){
   const svg=thaiRigSVG(p,{age,sex,wave:age==='child'?0.4:0,bagSwing:1.1});
   assert.ok(svg.startsWith('<g>')&&svg.endsWith('</g>')&&!svg.includes('NaN'),age+' '+sex+' rig valid');
  }
 }
});
