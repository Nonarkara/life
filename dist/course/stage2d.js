// The painted stage: hand-drawn cel plates, drawn figures, and cuts between them.
//
// This replaces the isometric diorama as the world's face without touching the
// simulation. The routine still decides who is where and what they are doing;
// this module only decides how that moment is drawn. It never spends money,
// awards skill, or advances time.
import {routine,routineContext,routineCaption} from './routines.js';
import {flagsOf} from './sim.js';
import {regionAt,REGIONS} from './regions.js';
import {preferences,t} from './i18n.js';
import {prepareStageArt,stageImage,platePath,spritePath} from './anime-assets.js';

// A set is one painted plate and the places people stand on it. `ground` is the
// fraction of the plate's height where feet meet the floor; `scale` is the
// figure's height as a fraction of the plate, so people sit inside the paint
// rather than on top of it.
const SETS={
  home:{plate:'home-day',night:'home-night',ground:.78,scale:.30,span:[3,7]},
  hospital:{plate:'hospital',ground:.82,scale:.26,span:[3,7]},
  bedroom:{plate:'bedroom-day',night:'bedroom-night',ground:.86,scale:.28,span:[3,7]},
  street:{plate:'town',night:'street-night',ground:.86,scale:.24,span:[6.5,13]},
  court:{plate:'beat-court',ground:.86,scale:.24,span:[8,13]},
  school:{plate:'school',ground:.86,scale:.22,span:[8,13]},
  work:{plate:'work',ground:.86,scale:.23,span:[9,14]},
  shop:{plate:'shop',ground:.86,scale:.23,span:[9,14]},
  site:{plate:'site',ground:.86,scale:.23,span:[9,14]},
  abroad:{plate:'abroad',ground:.84,scale:.22,span:[9,14]},
  garden:{plate:'garden',ground:.86,scale:.23,span:[4,9]},
  stall:{plate:'stall',ground:.88,scale:.23,span:[6,9]},
  travel:{plate:'street-day',night:'street-day',ground:.88,scale:.26,span:[0,1]},
};

// Every cycle is two drawings played on twos: the way limited animation works.
const ROLES={
  player:{
    walk:[['player','walk-a'],['player','walk-b']],
    stand:[['player','stand-a'],['player','stand-b']],
    sit:[['player-b','sit-read'],['player-b','sit-read']],
    desk:[['player-b','sit-desk'],['player-b','sit-desk']],
    paint:[['player-b','stand-paint'],['player-b','stand-paint']],
    kneel:[['player-b','kneel'],['player-b','kneel']],
    crouch:[['player-b','sit-read'],['player-b','sit-read']],
    punch:[['player-c','punch'],['player-c','punch']],
    dodge:[['player-c','dodge'],['player-c','dodge']],
    cheer:[['player-c','cheer'],['player-c','cheer']],
    lie:[['player-c','lie'],['player-c','lie']],
    ride:[['player-bike','ride'],['player-bike','ride-b']],
    push:[['player-bike','push'],['player-bike','push']],
    write:[['player-b','sit-desk'],['player-b','sit-desk']],
  },
  child:{
    walk:[['child','run'],['child','stand']],
    stand:[['child','stand'],['child','stand']],
    sit:[['child','sit'],['child','sit']],
    crouch:[['child','crouch'],['child','crouch']],
    read:[['child-b','read'],['child-b','read']],
    write:[['child-b','write'],['child-b','write']],
    ride:[['child-b','ride'],['child-b','ride-b']],
  },
  elder:{
    walk:[['elder','walk-stick'],['elder','stand']],
    stand:[['elder','stand'],['elder','stand']],
    sit:[['elder','sit'],['elder','sit']],
    kneel:[['elder','kneel'],['elder','kneel']],
  },
  mother:{
    walk:[['mother','basket'],['mother','stand']],
    stand:[['mother','stand'],['mother','stand']],
    crouch:[['mother','crouch'],['mother','crouch']],
    cook:[['mother','cook'],['mother','cook']],
    basket:[['mother','basket'],['mother','basket']],
  },
  father:{
    walk:[['father','walk'],['father','stand']],
    stand:[['father','stand'],['father','stand']],
    sit:[['father','sit-desk'],['father','sit-desk']],
    tool:[['father','tool'],['father','tool']],
  },
  friend:{
    walk:[['friend','walk'],['friend','stand']],
    stand:[['friend','stand'],['friend','stand']],
    sit:[['friend','sit'],['friend','sit']],
    wave:[['friend','wave'],['friend','wave']],
    ride:[['friend-b','ride'],['friend-b','ride-b']],
    push:[['friend-b','push'],['friend-b','push']],
    fold:[['friend-b','fold'],['friend-b','fold']],
  },
  partner:{
    walk:[['partner','walk'],['partner','stand']],
    stand:[['partner','stand'],['partner','stand']],
    sit:[['partner','sit'],['partner','sit']],
    wave:[['partner','wave'],['partner','wave']],
  },
  rival:{
    wind:[['rival','wind'],['rival','wind']],
    hit:[['rival','hit'],['rival','hit']],
    stagger:[['rival','stagger'],['rival','stagger']],
    guard:[['rival','guard'],['rival','guard']],
  },
};

function sheetFor(actor,age){
  if(actor==='mother')return 'mother';
  if(actor==='father')return 'father';
  if(actor==='friend')return 'friend';
  if(actor==='partner')return 'partner';
  if(actor==='rival')return 'rival';
  return age<13?'child':age>=60?'elder':'player';
}

// A moment of play reduced to one of the drawings the artist made.
function roleFor(actor,age,pose,moving,set){
  if(actor==='mother'){
    if(pose==='cook')return 'cook';
    if(pose==='care'||pose==='floor')return 'crouch';
    if(pose==='trade'||pose==='work')return 'basket';
    return 'stand';
  }
  if(actor==='father'){
    if(pose==='work'||pose==='trade')return set==='work'?'sit':'tool';
    if(pose==='study')return 'sit';
    return 'stand';
  }
  // A bicycle is its own drawing: the pose wins over the motion.
  if(pose==='ride')return 'ride';
  if(pose==='push')return 'push';
  if(moving)return 'walk';
  if(pose==='punch')return 'punch';
  if(pose==='dodge')return 'dodge';
  if(pose==='cheer')return 'cheer';
  if(pose==='lie')return 'lie';
  if(pose==='fold')return 'fold';
  if(pose==='guard')return 'guard';
  if(pose==='write')return 'write';
  if(pose==='read')return 'sit';
  if(pose==='draw'||pose==='craft')return 'paint';
  if(pose==='garden')return 'kneel';
  if(pose==='care'||pose==='floor')return 'crouch';
  if(pose==='study')return set==='home'?'sit':'desk';
  if(pose==='work')return 'desk';
  if(pose==='eat')return 'stand';
  if(pose==='rest'||pose==='recover')return 'sit';
  if(pose==='play')return age<13?'crouch':'sit';
  return 'stand';
}

// Where the player is, as one of the painted sets.
function setFor(action,moving){
  if(moving)return 'travel';
  const text=action??'';
  if(/school|college/i.test(text))return 'school';
  if(/Learning a trade/i.test(text))return 'shop';
  if(/^At work/i.test(text))return 'work';
  if(/stall/i.test(text))return 'stall';
  if(/garden/i.test(text))return 'garden';
  if(/Training/i.test(text))return 'court';
  if(/outside/i.test(text))return 'street';
  // The quiet half of the day happens in the bedroom: reading, resting,
  // homework, and the body that is being repaired.
  if(/rug|lamp|homework|Recovering|rest/i.test(text))return 'bedroom';
  return 'home';
}

// Where people stand in a drawing: spread so nobody shares a spot, and clear
// of the bed in the family home.
function slotsFor(set,count){
 const home={1:[.58],2:[.48,.7],3:[.46,.63,.8],4:[.42,.56,.7,.86]}[count]??spread(count);
 return set==='home'?home:spread(count);
}
function spread(count){
 return {1:[.5],2:[.34,.66],3:[.27,.5,.73],4:[.22,.42,.6,.8],5:[.18,.35,.5,.65,.82]}[count]??[.5];
}

const DRAMATIC=/dies|flood|setback|interrupt|crisis|illness/i;

// A beat is a lived moment with its own drawing: the plate, the people who
// are in it, and one effect. A beat can only be drawn if the life records
// that moment happened, so the stage never invents a life.
const BEATS={
  // Two bicycles and one road: the years of the friendship.
  bikes:{plate:'beat-lane',ground:.80,scale:.30,effect:'speed',
    actors:[{id:'player',pose:'ride',x:.34},{id:'friend',pose:'ride',x:.64}]},
  // The first evening that belongs to somebody else.
  love:{plate:'beat-bridge',ground:.80,scale:.26,effect:'heart',
    actors:[{id:'player',pose:'stand',x:.38},{id:'partner',pose:'wave',x:.58}]},
  // A fist fight behind the shophouses.
  fight:{plate:'beat-alley',ground:.86,scale:.34,effect:'impact',
    actors:[{id:'player',pose:'punch',x:.38},{id:'rival',pose:'guard',x:.62}]},
  // The classroom, and the boy who does not let up.
  bully:{plate:'beat-classroom',ground:.86,scale:.27,effect:'shadow',
    actors:[{id:'player',pose:'crouch',x:.40},{id:'rival',pose:'guard',x:.62}]},
  // The report card, good or bad.
  grades:{plate:'beat-classroom',ground:.86,scale:.24,effect:'sun',
    actors:[{id:'player',pose:'write',x:.46}]},
  // The report card that did not come back well.
  'grades-bad':{plate:'beat-classroom',ground:.86,scale:.24,effect:'grey',
    actors:[{id:'player',pose:'write',x:.46}]},
  // The bed, and the body that is being repaired.
  bed:{plate:'beat-room',ground:.74,scale:.30,
    actors:[{id:'player',pose:'lie',x:.26,anchor:{x:.26,y:.55}}]},
};

// The choices in the twenty-eight questions that decide whether a life kept
// its books. They are what a report card is made of.
const GRADE_CHOICES={
  'child-roof':{studied:['books','scholarship'],worked:['stall']},
  'school-apprentice':{studied:['school','both'],worked:['apprentice']},
  'school-leave':{studied:['stay','send'],worked:['go']},
  'college-cost':{studied:['loan','half'],worked:['work']},
};

// The report card beat, read out of the questions that were answered.
function gradeBeat(state,age){
  for(const record of state.pivots??[]){
    const map=GRADE_CHOICES[record.pivot];
    if(!map||age<record.station||age>=record.station+5)continue;
    if(map.studied.includes(record.choice))return 'grades';
    if(map.worked.includes(record.choice))return 'grades-bad';
  }
  return null;
}

// Which moment the life is living right now. The routine decides when the
// day is quiet enough for that moment to be the thing on screen.
export function beatFor(state,age,player={}){
  const seen=state.story?.seen??[];
  const flags=flagsOf(state);
  const action=player.action??'';
  const phase=player.phase??'';
  const moving=!!player.moving;
  // Being at school is not the same as walking to it.
  const inClass=!moving&&/school|college/i.test(action);
  const spoken=id=>{
    const entry=seen.filter(s=>s.id===id).at(-1);
    return entry&&age>=entry.age&&age<=entry.age+1?entry:null;
  };
  if(spoken('fight')&&(moving||/outside|home/i.test(action)))return 'fight';
  // The fight that came out of the bullying.
  if(flags.foughtBack!==undefined&&age>=flags.foughtBack&&age<=flags.foughtBack+1&&(moving||/outside|home/i.test(action)))return 'fight';
  if(spoken('bully')&&inClass)return 'bully';
  if(inClass){const report=gradeBeat(state,age);if(report)return report;}
  if(spoken('love')&&(phase==='Evening'||phase==='Coming home'))return 'love';
  // Bikes belong to the teenage years and to the way to school.
  if(flags.friend!==undefined&&age>=flags.friend&&age<=Math.min(flags.friend+6,20)&&moving&&phase==='On the way')return 'bikes';
  // A body that is being repaired lies down in the evening.
  if(/health setback/i.test(state.history?.at(-1)?.event??'')&&(phase==='Evening'||phase==='Coming home'))return 'bed';
  return null;
}

// Exported for the tests: the drawn world must follow the routine, not taste.
export {SETS,ROLES,setFor,roleFor,sheetFor,BEATS};

export function drawStage2D(canvas,state,age,time,mode,view={}){
  if(mode!=='world')return false;
  let entry=stages.get(canvas);
  if(entry===false)return false;
  if(!entry){
    entry=createStage(canvas);
    stages.set(canvas,entry);
    prepareStageArt().catch(error=>{console.warn('Stage art unavailable; keeping the previous world.',error);stages.set(canvas,false);});
  }
  try{entry.update(state,age,time,view);return true;}
  catch(error){console.warn('Stage interrupted; keeping the previous world.',error);stages.set(canvas,false);return false;}
}

const stages=new WeakMap();

function createStage(canvas){
  const buffer=document.createElement('canvas');
  const frame=document.createElement('canvas');
  let width=0,height=0,set='',setChangedAt=0,lastPeriod=-1,impact=0,caption='',hasFrame=false,waiting=false;
  const reduced=()=>preferences.motion||matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if(w<2||h<2)return false;
    const dpr=Math.min(devicePixelRatio||1,2);
    const pw=Math.round(w*dpr),ph=Math.round(h*dpr);
    if(pw!==width||ph!==height){width=pw;height=ph;canvas.width=pw;canvas.height=ph;buffer.width=pw;buffer.height=ph;frame.width=pw;frame.height=ph;hasFrame=false;}
    return true;
  }

  // A plate fills the frame from the floor up: the ground line stays part of
  // the painting, and the ceiling may be cut away.
  function drawPlate(target,key,offset=0){
    const path=platePath(key);
    if(!path)return null;
    const image=stageImage(path);
    if(!image||!image.complete||!image.naturalWidth)return null;
    const scale=Math.max(width/image.naturalWidth,height/image.naturalHeight);
    const drawWidth=image.naturalWidth*scale,drawHeight=image.naturalHeight*scale;
    const x=(width-drawWidth)/2+offset,y=height-drawHeight;
    target.drawImage(image,x,y,drawWidth,drawHeight);
    return {x,y,drawWidth,drawHeight};
  }

  function drawFigure(target,actor,age,activity,set,groundY,plateHeight,clock,xOverride,options={}){
    const role=roleFor(actor,age,activity.pose,activity.moving,set);
    const table=ROLES[sheetFor(actor,age)]?.[role]??ROLES[sheetFor(actor,age)]?.stand;
    if(!table)return null;
    const step=activity.moving?Math.floor(clock*10):Math.floor(clock*2.5);
    const [sheet,frame]=table[step%table.length];
    const path=spritePath(sheet,frame);
    const image=path?stageImage(path):null;
    if(!image||!image.complete||!image.naturalWidth)return null;
    const scale=options.scale??SETS[set]?.scale??.25;
    // A body that lies down is thinner than a body that stands.
    const flat=options.flat===true;
    const figureHeight=plateHeight*scale*(flat?.55:1)*(actor==='player'?(age<13?.78:age>=60?.95:1):.95);
    const figureWidth=figureHeight*(image.naturalWidth/image.naturalHeight);
    const span=SETS[set]?.span??[0,1];
    const norm=span[1]>span[0]?Math.max(-.1,Math.min(1.1,(activity.x??span[0])-span[0])/(span[1]-span[0])):.5;
    const x=xOverride??width*.08+norm*(width*.84);
    const bob=activity.moving?-Math.abs(Math.sin(clock*10))*(figureHeight*.02):0;
    const breathe=activity.moving?1:1+Math.sin(clock*2.2)*.006;
    target.save();
    target.globalAlpha=.26;
    target.fillStyle='#241d16';
    target.beginPath();
    target.ellipse(x,groundY,figureWidth*.2,figureHeight*.035,0,0,Math.PI*2);
    target.fill();
    target.globalAlpha=1;
    target.translate(x,groundY+bob);
    if(activity.moving)target.rotate(Math.sin(clock*10)*.02);
    target.scale(figureWidth/image.naturalWidth,figureHeight*breathe/image.naturalHeight);
    // The drawing stands on the ground line: its feet sit on it, centred above it.
    target.drawImage(image,-image.naturalWidth/2,-image.naturalHeight,image.naturalWidth,image.naturalHeight);
    target.restore();
    return {x,width:figureWidth};
  }

  // The journey is its own drawing: the street scrolls and the lines streak.
  function drawTravel(target,clock,activity,age){
    const path=platePath(SETS.travel.plate);
    const image=path?stageImage(path):null;
    if(!image||!image.complete||!image.naturalWidth)return null;
    const scale=Math.max(width/image.naturalWidth,height/image.naturalHeight);
    const drawWidth=image.naturalWidth*scale,drawHeight=image.naturalHeight*scale;
    const offset=reduced()?0:-((clock*240)%drawWidth);
    const x=(width-drawWidth)/2+offset,y=height-drawHeight;
    // The street is drawn twice, so the journey can run without an edge.
    target.drawImage(image,x,y,drawWidth,drawHeight);
    target.drawImage(image,x+drawWidth,y,drawWidth,drawHeight);
    // Where the two copies meet, a soft shadow falls, the way it does between
    // two buildings in a narrow street.
    const join=x+drawWidth;
    if(join>0&&join<width){
      const band=width*.07;
      target.save();
      const shade=target.createLinearGradient(join-band,0,join+band,0);
      shade.addColorStop(0,'rgba(18,16,12,0)');
      shade.addColorStop(.5,'rgba(18,16,12,.5)');
      shade.addColorStop(1,'rgba(18,16,12,0)');
      target.fillStyle=shade;
      target.fillRect(join-band,0,band*2,height);
      target.restore();
    }
    const speed=reduced()?0:clock*10;
    target.save();
    target.globalAlpha=.42;
    target.strokeStyle='#f6efe0';
    target.lineWidth=Math.max(2,height*.006);
    for(let i=0;i<26;i++){
      const y2=height*(.05+((i*.137+speed*.05)%1)*.88);
      const length=height*(.08+((i*.31)%1)*.46);
      const x2=((i*.213-speed*.13)%1.2-0.1)*width;
      target.beginPath();
      target.moveTo(x2,y2);
      target.lineTo(x2+length,y2);
      target.stroke();
    }
    target.restore();
    return {x,y,drawWidth,drawHeight};
  }

  function drawRain(target,clock){
    if(reduced())return;
    target.save();
    target.strokeStyle='rgba(226,236,236,.45)';
    target.lineWidth=Math.max(1,height*.003);
    for(let i=0;i<90;i++){
      const x=((i*.137+clock*.35)%1.2-0.1)*width;
      const y=((i*.211+clock*1.6)%1.1-0.05)*height;
      target.beginPath();
      target.moveTo(x,y);
      target.lineTo(x-height*.012,y+height*.05);
      target.stroke();
    }
    target.restore();
  }

  // A cut, the way film changes scene: a white frame, then a diagonal wipe.
  // The new drawing is revealed by the diagonal; the old one stays where the
  // wipe has not reached yet. Nothing is painted over the picture.
  function wipeClip(target,progress){
    const edge=-height+progress*(width+height);
    target.beginPath();
    target.moveTo(-width*2,0);
    target.lineTo(edge,0);
    target.lineTo(edge-height,height);
    target.lineTo(-width*2,height);
    target.closePath();
  }

  // One effect per moment: the road rushing, a heart, a blow, a shadow.
  function drawEffect(target,clock,effect,groundY){
    if(!effect)return;
    if(effect==='speed'){
      target.save();
      target.globalAlpha=.4;
      target.strokeStyle='#f6efe0';
      target.lineWidth=Math.max(2,height*.005);
      for(let i=0;i<20;i++){
        const y2=height*(.12+((i*.173+clock*.05)%1)*.66);
        const length=height*(.1+((i*.37)%1)*.5);
        const x2=((i*.213-clock*.11)%1.3-.15)*width;
        target.beginPath();
        target.moveTo(x2,y2);
        target.lineTo(x2+length,y2);
        target.stroke();
      }
      target.restore();
      return;
    }
    if(effect==='heart'){
      // The heart of the picture: a drawn heart, the way a 1990s game drew it.
      const beat=1+Math.sin(clock*4)*.06;
      const size=height*.09*beat;
      const x=width*.485,y=groundY-height*.38;
      target.save();
      target.translate(x,y);
      target.beginPath();
      target.moveTo(0,size*.55);
      target.bezierCurveTo(-size*1.25,-size*.15,-size*.62,-size*1.1,0,-size*.4);
      target.bezierCurveTo(size*.62,-size*1.1,size*1.25,-size*.15,0,size*.55);
      target.closePath();
      target.fillStyle='#d8493f';
      target.strokeStyle='#f6efe0';
      target.lineWidth=Math.max(2,size*.09);
      target.fill();
      target.stroke();
      target.restore();
      return;
    }
    if(effect==='impact'){
      target.save();
      target.globalAlpha=.7;
      target.strokeStyle='#f6efe0';
      target.lineWidth=Math.max(2,height*.005);
      for(let i=0;i<28;i++){
        const angle=i/28*Math.PI*2+.2;
        const inner=height*(.14+((i*.19)%1)*.12);
        const outer=height*(.55+((i*.13)%1)*.6);
        target.beginPath();
        target.moveTo(width*.48+Math.cos(angle)*inner,groundY-height*.2+Math.sin(angle)*inner);
        target.lineTo(width*.48+Math.cos(angle)*outer,groundY-height*.2+Math.sin(angle)*outer);
        target.stroke();
      }
      target.restore();
      return;
    }
    if(effect==='shadow'){
      // A shadow falls over the room, and the light goes out of it.
      target.save();
      const shade=target.createLinearGradient(0,0,0,height);
      shade.addColorStop(0,'rgba(12,10,16,.72)');
      shade.addColorStop(.55,'rgba(12,10,16,.22)');
      shade.addColorStop(1,'rgba(12,10,16,0)');
      target.fillStyle=shade;
      target.fillRect(0,0,width,height);
      target.restore();
      return;
    }
    if(effect==='sun'){
      // The good light of a morning that went well.
      target.save();
      target.globalCompositeOperation='lighter';
      const glow=target.createRadialGradient(width*.68,height*.3,height*.05,width*.68,height*.3,height*.9);
      glow.addColorStop(0,'rgba(255,214,140,.34)');
      glow.addColorStop(1,'rgba(255,214,140,0)');
      target.fillStyle=glow;
      target.fillRect(0,0,width,height);
      target.restore();
      return;
    }
    if(effect==='grey'){
      // The light that goes out of a bad report.
      target.save();
      target.fillStyle='rgba(86,92,108,.34)';
      target.fillRect(0,0,width,height);
      target.restore();
    }
  }

  function update(state,age,time,view={}){
    if(!resize())return;
    const life=routineContext(state,age);
    const goal=state.profiles.at(-1)?.profile.aim??'balance';
    const player=routine('player',age,time,goal,life);
    let next=setFor(player.action,player.moving);
    // The show opens in a hospital, on one baby.
    if(age<2)next='hospital';
    // The world is wide: a life can leave the country, and a trade can be built
    // on a site rather than behind a desk.
    const region=regionAt(state,age);
    if(REGIONS[region]?.country!=='TH'&&(next==='work'||next==='travel'))next='abroad';
    if(next==='work'&&(state.pathway==='vocational'||['engineering','architecture'].includes(state.major)))next='site';
    if(next!==set){set=next;setChangedAt=time;}
    const stage=SETS[set];
    const night=player.phase==='Evening'||player.phase==='Coming home';
    const plateKey=night&&stage.night?stage.night:stage.plate;
    const clock=reduced()?0:time;

    const ctx=canvas.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle='#12100c';
    ctx.fillRect(0,0,width,height);

    // Draw into a buffer so a cut can wipe from one drawing into the next.
    const paint=buffer.getContext('2d');
    paint.setTransform(1,0,0,1,0,0);
    paint.clearRect(0,0,width,height);
    let drawn,groundY;
    // A lived moment can take the frame: the stage shows the moment itself.
    const beat=beatFor(state,age,player);
    const moment=beat?BEATS[beat]:null;
    if(moment&&platePath(moment.plate)){
      drawn=drawPlate(paint,moment.plate);
      groundY=drawn?drawn.y+drawn.drawHeight*moment.ground:height*.84;
      if(drawn){
        for(const actor of moment.actors){
          const activity={pose:actor.pose,x:actor.x,moving:/ride|push/.test(actor.pose)};
          const anchor=actor.anchor?{x:drawn.x+actor.anchor.x*drawn.drawWidth,y:drawn.y+actor.anchor.y*drawn.drawHeight}:null;
          drawFigure(paint,actor.id,age,activity,beat,anchor?anchor.y:groundY,drawn.drawHeight,clock,
            anchor?anchor.x:width*.08+actor.x*(width*.84),{scale:moment.scale,flat:!!anchor});
        }
        drawEffect(paint,clock,moment.effect,groundY);
      }
    }else if(set==='travel'){
      drawn=drawTravel(paint,clock,player,age);
      groundY=drawn?drawn.y+drawn.drawHeight*SETS.travel.ground:height*.86;
      if(drawn)drawFigure(paint,'player',age,player,'travel',groundY,drawn.drawHeight,clock,width*.44);
    }else{
      drawn=drawPlate(paint,plateKey);
      groundY=drawn?drawn.y+drawn.drawHeight*stage.ground:height*.84;
    }
    if(!drawn){
      // The art is still on its way. The frame says so instead of showing a hole.
      if(!waiting){waiting=true;console.warn('The stage is waiting for its art.',plateKey??'plate');}
      paint.fillStyle='#1b1712';
      paint.fillRect(0,0,width,height);
      ctx.drawImage(buffer,0,0);
      return;
    }
    waiting=false;

    // The flood is weather, not a scene change. It only rains in a life where
    // the floodwater is actually recorded.
    const floodRow=state.history?.find(row=>/Floodwater/i.test(row.event??'')||(row.events??[]).some(event=>event?.type==='flood'));
    const outdoors=set==='street'||set==='garden'||set==='travel';
    if(outdoors&&floodRow&&age>=floodRow.age&&age<floodRow.age+6)drawRain(paint,clock);

    // Everyone who belongs in this drawing stands in it, spaced so that no two
    // people stand on the same spot, in the order the routine puts them.
    if(set!=='travel'&&!moment){
      const flags=flagsOf(state);
      const present=[{id:'player',activity:player}];
      if(set==='home'){
        for(const id of ['mother','father']){
          if(id==='mother'&&age>=70)continue;
          if(id==='father'&&age>=55)continue;
          const activity=routine(id,age,time,goal,life);
          if(setFor(activity.action,activity.moving)!=='home')continue;
          present.push({id,activity});
        }
      }
      // The people who came into the life are in the frame when they belong there.
      const partnerKnown=flags.dating!==undefined||flags.married!==undefined||flags.committed!==undefined;
      if(partnerKnown&&(set==='home'||set==='bedroom'))present.push({id:'partner',activity:{pose:'stand',x:7,moving:false}});
      const friendKnown=flags.friend!==undefined;
      if(friendKnown&&(set==='street'||set==='court'))present.push({id:'friend',activity:{pose:'stand',x:13,moving:false}});
      present.sort((a,b)=>(a.activity.x??0)-(b.activity.x??0));
      const slots=slotsFor(set,present.length);
      present.forEach((actor,index)=>{actor.slot=slots[index];});
      for(const actor of present){
        drawFigure(paint,actor.id,age,actor.activity,set,groundY,drawn.drawHeight,clock,width*.08+actor.slot*(width*.84));
      }
    }

    // A hard moment gets a drawn frame: a white flash, then radial lines.
    const period=state.history?.find(row=>row.from!==undefined&&age>=row.from&&age<row.age);
    if(period&&DRAMATIC.test(period.event??'')){
      const index=state.history.indexOf(period);
      if(index!==lastPeriod){lastPeriod=index;impact=reduced()?0:.55;}
    }
    if(impact>0){
      impact-=reduced()?.55:.016;
      const strength=Math.max(0,impact/.55);
      paint.save();
      paint.globalAlpha=strength*.8;
      paint.fillStyle='#f6efe0';
      paint.fillRect(0,0,width,height);
      paint.globalAlpha=strength*.75;
      paint.strokeStyle='#12100c';
      paint.lineWidth=Math.max(2,height*.004);
      for(let i=0;i<40;i++){
        const angle=i/40*Math.PI*2;
        const inner=height*(.18+((i*.17)%1)*.1);
        paint.beginPath();
        paint.moveTo(width/2+Math.cos(angle)*inner,height*.5+Math.sin(angle)*inner);
        paint.lineTo(width/2+Math.cos(angle)*height*1.3,height*.5+Math.sin(angle)*height*1.3);
        paint.stroke();
      }
      paint.restore();
    }

    // The cut: the new drawing is revealed by a diagonal, the old one waits
    // where the wipe has not reached. A white frame flashes first.
    const since=time-setChangedAt;
    const cutting=!reduced()&&since<.42&&hasFrame;
    const out=frame.getContext('2d');
    out.setTransform(1,0,0,1,0,0);
    if(cutting){
      out.save();
      wipeClip(out,since/.42);
      out.drawImage(buffer,0,0);
      out.restore();
      out.save();
      out.globalAlpha=Math.max(0,1-(since/.42)*2.4);
      out.fillStyle='#f6efe0';
      out.fillRect(0,0,width,height);
      out.restore();
    }else{
      out.clearRect(0,0,width,height);
      out.drawImage(buffer,0,0);
    }
    ctx.drawImage(frame,0,0);
    hasFrame=true;

    const line=routineCaption(age,time,goal,life);
    if(line!==caption){caption=line;canvas.setAttribute('aria-label',line);}
  }

  return {update};
}
