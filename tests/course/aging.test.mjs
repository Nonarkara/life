import {test} from 'node:test';import assert from 'node:assert/strict';
import {greyHair,greyLevel} from '../../dist/course/aging.js';
// A 40x100 figure: a thick dark crown (hair), a pale face, two thin dark eyes,
// two thin dark brows just above the eyes, and dark shoes at the bottom.
const w=40,h=100;
const figure=()=>{const p=new Uint8ClampedArray(w*h*4);
 const set=(x,y,r,g,b)=>{const i=(y*w+x)*4;p[i]=r;p[i+1]=g;p[i+2]=b;p[i+3]=255;};
 for(let y=0;y<h;y++)for(let x=8;x<32;x++)set(x,y,200,170,140); // pale skin
 for(let y=0;y<10;y++)for(let x=8;x<32;x++)set(x,y,25,25,28);   // thick dark crown
 for(let x=14;x<17;x++)set(x,14,20,20,20);for(let x=24;x<27;x++)set(x,14,20,20,20); // eyes
 for(let x=13;x<18;x++)set(x,12,20,20,20);for(let x=23;x<28;x++)set(x,12,20,20,20); // thin brows
 for(let y=94;y<100;y++)for(let x=8;x<32;x++)set(x,y,30,30,30);  // dark shoes
 return p;};
const px=(p,x,y)=>p[(y*w+x)*4];

test('the four greying steps run from forty to fifty-nine',()=>{
  assert.deepEqual([35,39,40,45,46,51,52,57,58,59,60].map(greyLevel),[0,0,1,1,2,2,3,3,4,4,4]);
});

test('level zero recolours nothing',()=>{
  const p=figure();const before=[...p];
  assert.equal(greyHair(p,w,h,0),0);
  assert.deepStrictEqual([...p],before);
});

test('the crown darkens with each step, from the first step at forty',()=>{
  const base=figure();let prev=px(base,20,4);
  assert.ok(prev<40,'the crown starts dark');
  for(const level of [1,2,3,4]){
    const p=figure();greyHair(p,w,h,level);
    const c=px(p,20,4);
    assert.ok(c>prev,`level ${level} crown is greyer than level ${level-1}`);
    assert.ok(c<200,`level ${level} crown is grey, not pale`);
    prev=c;
  }
});

test('eyes, brows and shoes stay as drawn at every level',()=>{
  for(const level of [1,2,3,4]){
    const p=figure();greyHair(p,w,h,level);
    assert.ok(px(p,15,14)<40,`level ${level} left eye untouched`);
    assert.ok(px(p,25,14)<40,`level ${level} right eye untouched`);
    assert.ok(px(p,15,12)<40,`level ${level} left brow untouched`);
    assert.ok(px(p,25,12)<40,`level ${level} right brow untouched`);
    assert.ok(px(p,20,96)<40,`level ${level} shoes untouched`);
  }
});

test('only the top thick dark mass is recoloured, not the face or shoes',()=>{
  const p=figure();greyHair(p,w,h,4);
  const dark=px(figure(),20,4);
  assert.ok(px(p,20,4)>dark,'the crown is recoloured');
  assert.ok(px(p,20,40)>100,'the pale face is not darkened as hair');
  assert.ok(px(p,20,96)<40,'the shoes stay dark');
});

// Adult male and intersex players take the player-suffixed sheet, so the same
// greyHair path that ages the female player also ages them.
test('male and intersex adults use the greyable player sheet',async()=>{
  const {castSheet}=await import('../../dist/course/stage2d.js');
  const male=castSheet({intake:{sex:'male'}},'player','player');
  const intersex=castSheet({intake:{sex:'intersex'}},'player','player');
  const female=castSheet({intake:{sex:'female'}},'player','player');
  assert.equal(male,'player-m');
  assert.equal(intersex,'player-x');
  assert.equal(female,'player');
  assert.ok(/^player/.test(male)&&/^player/.test(intersex)&&/^player/.test(female),'all adult player sheets enter the ageing path');
});
