import test from 'node:test';
import assert from 'node:assert/strict';
import {INTERIORS,SCHOOL_SEAT,inInterior,wallEdges} from '../../dist/course/interior-layout.js';
import {routine,routineContext,samplePath} from '../../dist/course/routines.js';

test('pilot plans carry the actual routes through the thresholds without crossing walls or furniture',()=>{
 for(const room of Object.values(INTERIORS)){
  for(const [x,z,w,d] of room.furniture)for(const [wx,wz,ww,wd] of wallEdges(room)){
   assert.ok(x+w<=wx+.001||x>=wx+ww-.001||z+d<=wz+.001||z>=wz+wd-.001,room.label+' furniture crosses a wall');
  }
  assert.ok(room.path.some(point=>point===room.door));
  assert.ok(room.door[0]>room.opening[0]&&room.door[0]<room.opening[1]);
  for(let step=0;step<=200;step++){
   const {x,y}=samplePath(room.path,step/200);
   for(const rect of [...wallEdges(room),...room.furniture]){
    assert.ok(!inInterior(rect,x,y),room.label+' route crosses a solid');
   }
  }
 }
 const state={age:15,birth:{region:'yaowarat',household:'parents'},history:[]};
 const context=routineContext(state);
 const door=routine('player',15,17.61,'balance',context);
 assert.ok(door.moving&&Math.hypot(door.x-INTERIORS.school.door[0],door.y-INTERIORS.school.door[1])<.025);
 const home=routine('player',12,46.3,'balance',routineContext({...state,age:12}));
 assert.ok(home.moving&&Math.hypot(home.x-INTERIORS.home.door[0],home.y-INTERIORS.home.door[1])<.025);
 const seated=routine('player',15,24,'balance',context);
 assert.equal(seated.pose,'study');
 assert.deepEqual([seated.x,seated.y],SCHOOL_SEAT);
});
