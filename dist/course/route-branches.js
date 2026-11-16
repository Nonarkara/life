// These are fictional continuations of recorded choices. A branch uses a named
// answer as its prerequisite so its outcome is reproducible from an older save.
export const ROUTE_BRANCHES={
 olympian_pm:[{
  id:'r_olympian_pm_coach',after:['r_olympian_pm_2','coach'],min:35,max:45,category:'work',art:'ring',
  title:'Tell her to fight hurt?',
  prompt:'The gym may close. Your best boxer has an injured wrist. The promoter will pay to put her in the ring tonight.',
  options:[
   {id:'stop',label:'Call off the fight',wellbeing:1,skills:{eq:2},outcome:'You closed the gym. She found you holding pads in the school courtyard.'},
   {id:'fight',label:'Tell her what the purse would save',wellbeing:-4,outcome:'She fought. When the gym reopened, she did not come back.'}
  ]
 }],
 border_pm:[{
  id:'r_border_pm_bricks',after:['r_border_pm_2','leave'],min:35,max:45,category:'work',art:'wall',
  title:'Sign off on a wall that could fall?',
  prompt:'The contractor wants your name on the school wall you built. You saw the cracks. He owes the crew two weeks’ wages.',
  options:[
   {id:'refuse',label:'Refuse and warn the school',wellbeing:2,outcome:'The children used the rear gate all term. Two of the crew stopped speaking to you.'},
   {id:'sign',label:'Sign and get the crew paid',cash:8000,wellbeing:-4,outcome:'The crew took their pay home. You watched the wall every time it rained.'}
  ]
 }],
 singer_office:[{
  id:'r_singer_office_tape',after:['r_singer_office_1','sing'],min:30,max:40,category:'work',art:'tape',
  title:'Sell the song with your name on it?',
  prompt:'A label offers to buy your old recording. The advance could cover a year’s rent. If you sign, the label decides where your voice goes.',
  options:[
   {id:'keep',label:'Keep the recording rights',wellbeing:2,skills:{drive:2},outcome:'You kept the tape and sang the song yourself. Some nights you could hear the room singing it back.'},
   {id:'sell',label:'Sell the recording rights',cash:50000,wellbeing:-3,outcome:'The rent was paid. You heard yourself in a shop and stood still until the song ended.'}
  ]
 }]
};
