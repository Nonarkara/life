// Every authored incident has a small, reviewable pair of colour chords.
// First is the pressure/quiet reading; second is the opening/recovery reading.
// These assignments are art direction, not emotional or medical predictions.
const quiet=[152,167,171,192,202,203,210,214,228,229];
const dark=[139,145,155,157,190,207,211,216,221,232];
const bright=[123,141,147,149,151,166,168,170,173,189];
export const SCENARIO_PALETTES={};
function assign(ids,{joy=false,sad=false}={}){
 ids.split(' ').forEach((id,i)=>{SCENARIO_PALETTES[id]={plates:[sad?dark[i%10]:dark[(i+3)%10],sad?dark[(i+1)%10]:bright[(i+2)%10]],opening:joy?1:0};});
}
assign('friend love commitment parenthood project_return child_school mentor friend_late dog l_friends l_kind m_pet',{joy:true});
assign('bully flood_help remember remember_mother hard_marriage l_funeral l_injury l_bottom m_crash m_vanished m_grandparent',{sad:true});
assign('geo_arbitrage gap_year geo_expiry health_rest project friend_care mismatch crossroads l_pension l_raise l_parent_trip l_carpet l_early_family l_shortcut l_borrow l_bond l_phd l_habits l_basket l_boss l_defined l_compare l_less l_plan l_fail l_luck l_shop m_runway m_kits m_funds m_leverage m_house m_offer m_insure m_unfair m_flat m_child m_passive');
assign('child-roof child-sponsor child-water-bike school-apprentice school-leave school-fall-climb college-cost stall-paper city-pay partner-choice flood-repair flood-move year-abroad partner-business promotion-away parent-ill share-offer buy-house child-city leave father-tools stall-takeover stay-on nephew treatment house-travel empty-house take-in legacy remembered');
export const EVENT_PALETTES={
 consequence:[211,171],market:[216,189],economy:[155,221],connection:[139,147],project:[157,168],recovery:[202,166],flood:[139,207],loss:[221,232],work:[145,190],commission:[151,189],illness:[139,211],school:[167,170],retirement:[229,203],dengue:[139,145],fired:[155,216],married:[147,166],pregnant:[171,173]
};
export const QUIET_PLATES=quiet;
