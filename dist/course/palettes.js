// Thirty palettes, taken from the game's own colour vocabulary: the Wada
// screen reconstructions the art was drawn from, the soi interior chord, and
// the house scheme the console has always been printed in.
//
// A palette is a whole set, never a single tint: the paper the console is
// printed on, the ink, the accent the controls are marked in, the rule lines,
// and the world the stage is painted in. The life chooses between them. The
// mood picks the family, so a hard year changes the colour of the world, and
// the five-year chapter walks through the family, so a life is never stuck in
// one scheme for eighty years.

// The world roles the stage paints with. Every one of them is named in the
// art direction and in the 3D scene.
const CHORDS=[
 {name:'Lotus',paper:'#f4f0e6',ink:'#192e2c',muted:'#52635b',accent:'#f59e0b',line:'#b4b9a9',
  world:{sky:'#6f8783',ground:'#5b7f80',sand:'#b5a789',land:'#849573',grass:'#9caf73',water:'#507e82',waterLight:'#7dabad',road:'#c8bba1',edge:'#a59375',wall:'#eed7aa',shade:'#c4aa80',roof:'#a15f49',roofLight:'#bb7b57',wood:'#6b5740',leaf:'#476b48',lightleaf:'#668651'}},
 {name:'Medici',paper:'#f2e6c2',ink:'#1d3a5c',muted:'#5a6b7d',accent:'#e2603a',line:'#c9bfa0',
  world:{sky:'#7c93a8',ground:'#54708c',sand:'#c6b795',land:'#93956f',grass:'#a8a874',water:'#4a6c8c',waterLight:'#7d9cb8',road:'#cfc2a4',edge:'#a89a7c',wall:'#f0ddaa',shade:'#c9ab7e',roof:'#c0563a',roofLight:'#d47d5c',wood:'#6f5539',leaf:'#4a6b4a',lightleaf:'#6d8a58'}},
 {name:'Benzol',paper:'#f6efd2',ink:'#24503c',muted:'#5d6f52',accent:'#c8324b',line:'#c3c39a',
  world:{sky:'#87a08c',ground:'#5d8069',sand:'#c2b58b',land:'#8fa468',grass:'#aec072',water:'#4f7a72',waterLight:'#82ab9c',road:'#d2c69f',edge:'#a9a077',wall:'#f2e0a6',shade:'#cbb183',roof:'#b4553f',roofLight:'#cd7a55',wood:'#6a5738',leaf:'#4c7343',lightleaf:'#72964f'}},
 {name:'Lincoln',paper:'#eee6d0',ink:'#3c3a24',muted:'#6d6a4c',accent:'#c98a4b',line:'#bdb694',
  world:{sky:'#8a9182',ground:'#666f5c',sand:'#b8ab88',land:'#828c5f',grass:'#9aa36c',water:'#5b6f63',waterLight:'#8aa191',road:'#c6bda1',edge:'#a2987c',wall:'#eddcb0',shade:'#c0a883',roof:'#9a6a4c',roofLight:'#b98a67',wood:'#6d563b',leaf:'#526a40',lightleaf:'#76874f'}},
 {name:'Plaster',paper:'#f2e8d2',ink:'#30494e',muted:'#6a7a78',accent:'#bd5038',line:'#b7b3a2',
  world:{sky:'#80959a',ground:'#55777c',sand:'#d9c9a6',land:'#93966f',grass:'#a8ab7c',water:'#4a6f78',waterLight:'#7fa3a8',road:'#d0c4a8',edge:'#a89b7f',wall:'#f5e4b4',shade:'#cbb894',roof:'#a86a4a',roofLight:'#c08a63',wood:'#a38354',leaf:'#546f55',lightleaf:'#74907a'}},
 {name:'Moss',paper:'#eef0e2',ink:'#23331f',muted:'#5c6a4e',accent:'#7c9a3c',line:'#b3bb9c',
  world:{sky:'#8b9c8e',ground:'#5d7362',sand:'#b9b193',land:'#78885a',grass:'#93a367',water:'#4c6f6b',waterLight:'#7f9f98',road:'#c4c2a1',edge:'#9a9c7d',wall:'#e9e0bd',shade:'#bdb894',roof:'#8f6247',roofLight:'#a87f5d',wood:'#655239',leaf:'#44613c',lightleaf:'#668050'}},
 {name:'Clay',paper:'#f6e9d6',ink:'#4a2a1e',muted:'#7d5f4a',accent:'#c2603a',line:'#cdb79a',
  world:{sky:'#a08d84',ground:'#7a5f4d',sand:'#d3bb92',land:'#a08a5e',grass:'#b2a06b',water:'#6b6a5c',waterLight:'#9a9880',road:'#d8c39c',edge:'#b09b7b',wall:'#f0d9b0',shade:'#c9a984',roof:'#b0553c',roofLight:'#c67a57',wood:'#7b5a3d',leaf:'#6b6a41',lightleaf:'#8b8a56'}},
 {name:'Indigo',paper:'#eceaf3',ink:'#23284a',muted:'#5a5f7d',accent:'#b08a2e',line:'#b3b2c4',
  world:{sky:'#7d87a8',ground:'#4d567d',sand:'#bcb6a4',land:'#7d8467',grass:'#939a76',water:'#44558c',waterLight:'#7484b4',road:'#c2bfb4',edge:'#98979f',wall:'#e8e2cf',shade:'#b9b4ad',roof:'#5b5f86',roofLight:'#7a7ea3',wood:'#5f4f42',leaf:'#4c5b52',lightleaf:'#6d7c6a'}},
 {name:'Slate',paper:'#eef1f2',ink:'#26313a',muted:'#5c6b74',accent:'#3f7f8c',line:'#adb9bf',
  world:{sky:'#849aa6',ground:'#4e6570',sand:'#b4b3a8',land:'#7d8478',grass:'#8f9782',water:'#48636f',waterLight:'#7d97a1',road:'#b9bcb8',edge:'#8f9698',wall:'#e4e2d8',shade:'#b2b4ad',roof:'#5e6a70',roofLight:'#7d878c',wood:'#5c5147',leaf:'#4f6152',lightleaf:'#6d7f6c'}},
 {name:'Plum',paper:'#f1e9ee',ink:'#33202e',muted:'#6d5666',accent:'#8c4a6b',line:'#bfaebc',
  world:{sky:'#948a9c',ground:'#655668',sand:'#c2b4a8',land:'#8a7f6b',grass:'#9b9376',water:'#5b5468',waterLight:'#8a8098',road:'#c6bcb6',edge:'#a1969c',wall:'#ebe0d8',shade:'#c2b1ae',roof:'#6e4a5c',roofLight:'#8d6a79',wood:'#65504a',leaf:'#566048',lightleaf:'#788061'}},
];

// A mood is a family of chords, not a family of single tints. A hard year
// darkens and cools the world; a bright year lifts and warms it. The paper the
// console is printed on stays the paper: the instrument does not change tone.
const MOODS={
 steady:{},
 bright:{land:'#a8b57e',grass:'#c3cd8c',water:'#4f8490',waterLight:'#8ec4c0',roof:'#b65363',roofLight:'#d78080',leaf:'#3f7a5f',lightleaf:'#7fae7c',accent:'#e08a12',sky:'#86a49f'},
 difficult:{land:'#6d7359',grass:'#8b9170',water:'#4f5f6c',waterLight:'#7e8f99',roof:'#8a6a57',roofLight:'#a5836c',leaf:'#4a553d',lightleaf:'#79846a',accent:'#b8730a',sky:'#77807e'},
};

export const PALETTES=Object.keys(MOODS).flatMap(mood=>CHORDS.map(chord=>({
 ...chord,...MOODS[mood],mood,name:chord.name+(mood==='steady'?'':' · '+mood),
 world:{...chord.world,...MOODS[mood].world},
})));

export const MOOD_ORDER=['steady','bright','difficult'];

// The family the mood chooses, and the chord the chapter walks to. A life
// changes colour every five years and changes family when its mood turns.
export function paletteFor(state,age,mood,pinned='auto'){
 if(pinned&&pinned!=='auto'){const chosen=PALETTES.find(p=>p.name===pinned);if(chosen)return chosen;}
 const family=PALETTES.filter(p=>p.mood===mood);
 if(!family.length)return PALETTES[0];
 const chapter=Math.max(0,Math.floor((age-10)/5));
 return family[chapter%family.length];
}

// UI accents need readable contrast even when the authored material colour is pale.
export function contrastRatio(a,b){
 const light=hex=>{const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 const x=light(a),y=light(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
function readableAccent(accent,background){
 const end=contrastRatio('#ffffff',background)>contrastRatio('#000000',background)?'#ffffff':'#000000';
 for(let step=0;step<=100;step++){const candidate=mix(accent,end,step/100);if(contrastRatio(candidate,background)>=4.5)return candidate;}
 return end;
}

// Two colours mixed, so the dark instrument surface and the stage band are
// made of the same palette rather than pasted on top of it.
function mix(a,b,weight=.5){
 const parse=hex=>{const h=hex.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16));};
 const [r1,g1,b1]=parse(a),[r2,g2,b2]=parse(b);
 const channel=(x,y)=>Math.round(x+(y-x)*weight);
 return '#'+[channel(r1,r2),channel(g1,g2),channel(b1,b2)].map(v=>v.toString(16).padStart(2,'0')).join('');
}

// The console is printed in the palette: the paper, the ink, the accent the
// controls are marked in, the rule lines, and the dark instrument surfaces the
// life deck and the world band are cut from.
export function applyPalette(palette,root=typeof document!=='undefined'?document.documentElement:null){
 if(!root)return;
 const set=(name,value)=>root.style.setProperty(name,value);
 set('--paper',palette.paper);set('--ink',palette.ink);set('--muted',palette.muted);
 set('--amber',palette.accent);set('--line',palette.line);
 set('--stage',mix(palette.ink,palette.world?.sky??palette.ink,.18));
 const deck=mix(palette.ink,'#000000',.25);set('--deck',deck);
 set('--deck-accent',readableAccent(palette.accent,deck));set('--accent-ink',readableAccent(palette.accent,palette.paper));
 set('--deck-line',mix(palette.ink,palette.muted,.75));
 set('--deck-text',mix(palette.paper,palette.world?.sand??palette.paper,.2));
 set('--deck-muted',mix(palette.paper,palette.muted,.35));
 root.dataset.palette=palette.name;
 root.style.colorScheme='light';
}

// The palette in force. The console, the painted canvas and the 3D scene all
// read it. Painted illustrations retain their authored colour.
let current=null;
export function setPalette(palette){current=palette;applyPalette(palette);return current;}
export function currentPalette(){return current;}
// The world colours the 2D canvas paints with, plus its ink and paper.
export function canvasWorld(palette=current){
 if(!palette)return null;
 return {...palette.world,ink:palette.ink,paper:palette.paper,amber:palette.accent};
}
