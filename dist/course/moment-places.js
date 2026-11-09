// A real place, drawn from today's map, as the first thing you see of a big moment. The names are
// the geocoder's own. Rendered with Location Scout (oyasumi-gamedev); map data © OpenStreetMap contributors.
// Only places whose render actually shows the place. Others wait for a better shot rather than carry a false caption.
export const PLACES={soi:'Yaowarat Road, Bangkok',water:'Ayutthaya Historical Park'};
export const placeFor=(set,regionId)=>set==='soi'&&regionId==='pak-phanang'?{file:'phuket',name:'Phuket Old Town'}:PLACES[set]?{file:set,name:PLACES[set]}:null;
