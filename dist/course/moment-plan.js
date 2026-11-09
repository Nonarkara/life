// Which moments open in 3D, and what that place looks like in this life.
// Pure data, no three.js, so the game can decide without loading the renderer.
import {rand} from './sim.js';
import {birthYearOf} from './thai-history.js';
import {region,regionAt} from './regions.js';
const AT={temple:'h_film_van h_nang_talung temple-boy',soi:'h_transistor h_1976_names girl-school b_net_cafe b_top_up',airfield:'h_airbase go-abroad',avenue:'h_1973_leaflet h_1973_truck h_1976_campus h_1992 b_ramkhamhaeng',village:'h_rice_at_night h_1980_return h_saudi h_garment h_road',gate:'h_1997_closed',water:'h_2011_flood flood_help flood-repair flood-move',table:'h_1973_radio h_1996_boom h_2010_table h_2020_glass gifted-child empty-house take-in',fork:'three-roads'};
export const MOMENT_SETS=Object.fromEntries(Object.entries(AT).flatMap(([set,ids])=>ids.split(' ').map(id=>[id,set])));
export const bigMoment=id=>typeof id==='string'&&Object.hasOwn(MOMENT_SETS,id);
const AT_NIGHT=new Set(['h_film_van','h_nang_talung','h_rice_at_night','h_1992','h_1973_radio','h_2020_glass']);
const NOW=2026;
// Young lives happen among other young people. Places where a group of them would actually be.
const AMONG_YOUTH=new Set(['soi','temple','avenue','village','gate']);
export const youthsAround=(age,set)=>age>=12&&age<30&&AMONG_YOUTH.has(set)?6:0;
// The Digital Valley figures wear today's clothes, so they appear as they are only once those clothes exist.
export const youthsInOwnClothes=year=>year>=1995;
export function momentPlan(state,id){
 const by=birthYearOf(state),year=by===null?NOW:by+state.age,r=k=>rand(state.seed,state.age,'moment:'+id+':'+k),place=region(regionAt(state,state.age)),pick=(k,list)=>list[Math.floor(r(k)*list.length)];
 // A storey is 3.2 m and a person is 1.7 m in every set: scale comes from the world, not the camera.
 const rows=Array.from({length:6},(_,i)=>({width:4+r('w'+i)*1.6,storeys:year<1960?2:year<1985?2+Math.floor(r('s'+i)*2):2+Math.floor(r('s'+i)*4),wall:pick('wall'+i,['#d9c9a6','#c9b58c','#b8bca9','#d6b48f','#a9b7ab','#e0d3b8']),awning:pick('awn'+i,['#bd5038','#55777c','#c98a3c','#6f7f55','#8a5a48'])}));
 return {set:MOMENT_SETS[id],year,night:AT_NIGHT.has(id),side:r('side')<.5?-1:1,rows,trees:3+Math.floor(r('trees')*6),crowd:40+Math.floor(r('crowd')*50),cars:year>=1958?Math.floor(r('cars')*(year>=1990?5:3)):0,poles:year>=1955,skyline:year>=1985,tower:year>=1985?12+Math.floor(r('tower')*(year>=2005?34:16)):0,camera:(r('camera')-.5)*2.4,sky:pick('sky',['#a9c3bd','#c6bfa0','#b6c7c4','#d2b596']),ground:place?.look?.ground??'#849573',water:place?.look?.water??'#5b7f80',wall:place?.look?.wall??'#e5d9b9',floor:place?.look?.floor??'#a08560',roof:pick('roof',['#a15f49','#8a4d3c','#6d7468','#b9764f'])};
}
// What people wore. Authored from general Thai dress history, not from any one person:
// the indigo mo hom and pha khao ma of farmers, the pha sin, the white-shirt school and
// university uniform, khaki for government service.
export function outfitFor(state,key,sex,age,year,{player=key==='player',place:given}={}){
 const cls=state.intake?.class??state.birth?.class,place=given??region(regionAt(state,state.age)),abroad=!!place?.country&&place.country!=='TH',rural=place?.style==='village'||place?.style==='coast',rich=['high_class'].includes(cls),poor=['low_class','working_class'].includes(cls),r=k=>rand(state.seed,age>=40?1:0,'outfit:'+key+':'+k),pick=(k,list)=>list[Math.floor(r(k)*list.length)],female=sex==='female'||sex!=='male'&&r('presents')<.5;
 const shoe=rich||!poor&&!rural?'shoes':'sandals',base={female,collar:false,pocket:false,mohom:false,blouseNeck:false,tucked:false,sleeve:'short',skirt:null,legs:'trousers',band:null,scarf:false,feet:shoe,trim:'#efe9d8'};
 const sin=()=>({skirt:'sin',bottom:pick('sin',['#7a3f3a','#3f5a50','#5a4a6a','#8a6a2f','#355068']),band:pick('band',['#c9a24a','#b5482f','#d7c9a0'])});
 const blouse=()=>({top:pick('blouse',['#e8ddc4','#d6c0a8','#c9d2c2','#d9c3c0','#bcc9c9']),blouseNeck:true,trim:'#f2ecdc'});
 const knee=()=>({skirt:'knee',bottom:pick('sk',['#3f5a50','#5a4a6a','#35405a','#7a5a3f'])});
 const mansShirt=()=>({top:pick('sh',rich?['#f2eee2','#d9e2e6','#e6dcc4']:['#e6dcc4','#b9c6bf','#c7b8a2','#d8c7a4']),collar:true,pocket:true,tucked:rich||year<1990,bottom:pick('tr',['#3f3a34','#4b4f4a','#5a4e3c']),legs:year>=1970&&year<1980?'flare':'trousers'});
 if(age<6)return {...base,top:pick('play',['#e6dcc4','#c9d2c2','#d9c3c0']),legs:'shorts',bottom:'#6a6a5c',feet:'bare'};
 if(abroad){const cold=place.climate==='cold'||place.climate==='cool',coatC=pick('coat',['#2f3a40','#5a3a3a','#3f5a7a','#6a5a4a','#4f5f4a']),warm=cold?{coat:true,top:coatC,tucked:false,collar:false,pocket:false,neckScarf:pick('nsc',['#a5533f','#d8b25a','#3f6f8a','#e6e0cf']),hat:place.climate==='cold'&&r('kn')<.6?'knit':undefined,sleeve:'long'}:{};return female?{...base,...blouse(),...knee(),sleeve:'long',feet:'shoes',...warm}:{...base,...mansShirt(),sleeve:'long',feet:'shoes',...warm};}
 if(age<18)return {...base,top:'#f4f0e4',collar:true,pocket:!female,tucked:true,trim:'#f4f0e4',...(female?{skirt:'knee',bottom:'#2b3a55'}:{legs:'shorts',bottom:year<1980?'#8c7a58':'#2b3a55'}),feet:rural&&poor&&year<1975?'bare':'canvas'};
 if(player&&age<25&&(state.pathway==='college'||state.major))return {...base,top:'#f6f3ea',collar:true,tucked:true,trim:'#f6f3ea',feet:'shoes',...(female?{skirt:'knee',bottom:'#1f2228'}:{bottom:'#1f2228',legs:year>=1968&&year<1980?'flare':'trousers'})};
 // Khaki is government service, which a bureaucrat's child often entered and not always.
 if(player&&cls==='bureaucratic_class'&&age>=25&&age<60&&r('service')<(year<2000?.6:.35))return {...base,top:'#a89a6c',collar:true,pocket:true,tucked:true,trim:'#958860',feet:'shoes',...(female?{skirt:'knee',bottom:'#8d8259'}:{bottom:'#8d8259'})};
 // Farm and fishing clothes outlast the century.
 if(rural&&!rich&&(year<1995||r('farm-now')<.6)){if(female)return {...base,...blouse(),...sin(),feet:year<1960?'bare':'sandals'};if(poor||r('farm-class')<.5)return {...base,top:'#2f3d5c',mohom:true,trim:'#46567a',bottom:pick('farm',['#2f3d5c','#4a4438']),legs:pick('legs',['shorts','trousers']),scarf:true,feet:year<1960?'bare':'sandals'};}
 if(female&&age>=45&&year<1995&&!rich)return {...base,...blouse(),...sin(),feet:'sandals'};
 if(year>=1995&&!rich){const casual=pick('casual',[0,1,2]);return {...base,top:female?pick('tee',['#c98a7a','#e6dcc4','#6f8799','#b9c6bf','#d6b45a','#7f6f9a']):pick('tee',['#4d6a7a','#c9c0a8','#8a5a48','#e8e4d8','#3f5a50','#a5533f','#27323a']),collar:casual===0,stripes:r('st')<.22?pick('st2',['#efe9d8','#2f3d4c']):undefined,bottom:casual===2||female?pick('jn',['#3a4a63','#2f3a4c','#4f5a6b']):pick('tr2',['#5a5448','#39424c','#6b6252']),legs:casual===2&&r('sh')<.4?'shorts':'trousers',feet:casual===2?'canvas':year>=2005&&r('sn')<.5?'canvas':shoe};}
 if(rich&&age>=25&&r('suit')<.5)return female?{...base,top:pick('jk',['#e9e2d2','#b9c6cf','#d8c3c0']),collar:true,trim:'#f2ecdc',sleeve:'long',skirt:'knee',bottom:pick('sk2',['#2f3d4c','#5a4a3f']),feet:'shoes'}:{...base,top:pick('suit',['#39424c','#4b4f4a','#5a5048']),collar:true,trim:'#f2eee2',tucked:true,sleeve:'long',bottom:pick('suit2',['#39424c','#4b4f4a']),feet:'shoes'};
 if(female&&year>=1970&&year<1980&&age<40&&r('flares')<.3)return {...base,...blouse(),bottom:pick('fl',['#35405a','#5a4a6a']),legs:'flare'};
 if(female)return {...base,...blouse(),...knee()};
 return {...base,...mansShirt(),sleeve:rich?'long':'short'};
}
// Who is about the street in this year: same bank of clothes, never the player's own.
export function neighbourOutfit(state,key,sex,year,place){
 const r=k=>rand(state.seed,0,key+':'+k),pick=(k,l)=>l[Math.floor(r(k)*l.length)];
 const out=outfitFor(state,key,sex,25+Math.floor(r('age')*40),year,{player:false,place});
 if(place.style==='market'&&r('ap')<.35)return {...out,apron:pick('ac',['#e8e2d2','#5a7a8a','#a5533f'])};
 if((place.style==='village'||place.style==='coast')&&year<1995&&r('hat')<.5)return {...out,hat:'ngob'};
 if(year>=1990&&r('cap')<.2)return {...out,hat:'cap',hatColor:pick('cc',['#3f5a70','#7a2f2a','#e6e0cf'])};
 return out;
}
export const monkRobe={female:false,top:'#c9792a',bottom:'#c9792a',trim:'#c9792a',robe:true,sleeve:'cap',legs:'trousers',feet:'bare',skirt:null,collar:false,pocket:false,mohom:false,blouseNeck:false,tucked:false,band:null,scarf:false};
// Hair is the first thing that tells two people apart at the size the diorama draws them.
export function hairFor(state,key,sex,age,elder){
 const r=k=>rand(state.seed,0,'hair:'+key+':'+k),pick=(k,l)=>l[Math.floor(r(k)*l.length)],base=pick('hue',['#1f1c19','#26211c','#2e2720','#191715','#3a2f26']);
 const female=sex==='female'||sex!=='male'&&r('pres')<.5;
 const style=age<4?'crop':age<12?(female?pick('kid',['bob','fringe','ponytail']):pick('kid',['crop','short'])):female?(elder?pick('old',['perm','bun','bob']):pick('adult',['long','bob','ponytail','bun','fringe','perm','side'])):(elder?pick('oldm',['short','crop','bald','side']):pick('adultm',['short','crop','side','short']));
 return {style,color:base,grey:pick('grey',['#b9b8b0','#9a9a93','#d4d2c8'])};
}
