
import {newLife,begin} from '../course/sim.js';
import {deckFinance,deckBaht} from '../course/deck-model.js';
import {drawDeck} from '../course/life-deck.js';
const f={available:0,reserve:0,debt:5000,holdings:{},housing:'near',budget:{save:20,fun:10,learn:10}};
const state={...begin(newLife(17)),age:20,pathway:'college',intake:{upbringing:'constrained'},health:0,wellbeing:0,finance:f,history:[{age:15,health:0,wellbeing:0,finance:{...f,debt:1000}},{age:20,health:0,wellbeing:0,finance:f}]};
const plan=deckFinance(state);
drawDeck(document.querySelector('#edge-deck'),state,{channels:[{label:'Physique',value:'2',detail:'+2',detailLabel:'By age 25',can:()=>false,step(){}}],aim:'balance',setAim(){},aimDescription:'Read-only fixture',status:[['Health','0 / 100'],['Mood','0 / 100'],['Net worth',deckBaht(plan.worth)],['Cash runway','0 months'],['Debt',deckBaht(plan.debt)]],money:plan,ikigai:{score:0,parts:[['Love',0],['Good at',0],['Gives',null],['Sustains',0]]}});
