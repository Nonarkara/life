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
assign('d_job d_organ d_limb d_loved d_killed d_betray d_sue d_evict d_attack d_partner d_temper d_rumour d_lend d_boss d_rich d_father s_loan s_title s_chamoy s_forex s_1997 s_bike s_fluke s_hiv s_skip s_abroad s_pills s_tsunami s_flood s_rice s_scam s_alone h_forest_end h_vietnam',{sad:true});
assign('th_curfew th_buyer_bill th_dry_season th_bangkok_accounting th_bank_merger parent-language coast-boat village-buffalo girl-school temple-boy go-abroad gifted-child',{sad:true});
assign('th_harvest_transport th_unpaid_placement th_first_love_regret');
assign('class_family_business class_debt class_ambition class_overtime class_connections class_expectations',{sad:true});
assign('class_family_pressure class_support_pressure class_housing_pressure class_family_time class_posting_pressure class_name_pressure class_heirloom class_photo class_water_offering class_lantern class_record class_name_plaque',{sad:true});
assign('th_spirit_offering th_stray_cat th_midnight_cart th_mitr_cameo th_vhs_modem th_midlife_frugality th_alms_round th_lantern_night th_neighborhood_song',{joy:true});
assign('w1_nanny w1_inheritance w1_envelope w1_driver w1_grandma_raised w1_boat_engine w1_gold w1_tickets w1_daughter w1_chanting w1_ward_chair w1_loan',{sad:true});
assign('w2_uniform w2_one_place w2_bullied w2_night_shift w2_checkup w2_soi_sold w2_grandchild_left w2_fall w2_teeth w2_single_old',{sad:true});
assign('w2_temple_boy w2_tutor w2_car_block w2_letter w2_cows w2_stall_shift w2_entrance w2_civil_exam w2_commute w2_sinsod w2_mother_in_law w2_alms w2_will w2_glasses w2_reunion');
assign('w1_board w1_match w1_transfer w1_vest w1_scale w1_ordain w1_rice w1_fire w1_shoes w1_songkran w1_first_pay');
assign('h_1973_leaflet h_1973_radio h_1973_truck h_1976_campus h_1976_names h_rice_at_night h_1997_closed h_2011_flood h_2020_glass',{sad:true});
assign('h_film_van h_nang_talung h_transistor h_airbase h_1980_return h_saudi h_garment h_road h_1992 h_1996_boom h_2010_table three-roads');
assign('friend love commitment parenthood project_return child_school mentor friend_late dog l_friends l_kind m_pet',{joy:true});
assign('after_hospital bully flood_help remember remember_mother hard_marriage l_funeral l_injury l_bottom m_crash m_vanished m_grandparent',{sad:true});
assign('geo_arbitrage gap_year geo_expiry health_rest project friend_care mismatch crossroads l_pension l_raise l_parent_trip l_carpet l_early_family l_shortcut l_borrow l_bond l_phd l_habits l_basket l_boss l_defined l_compare l_less l_plan l_fail l_luck l_shop m_runway m_kits m_funds m_leverage m_house m_debt m_offer m_insure m_unfair m_flat m_child m_passive');
assign('child-roof child-sponsor child-water-bike school-apprentice school-leave school-fall-climb college-cost stall-paper city-pay partner-choice flood-repair flood-move year-abroad partner-business promotion-away parent-ill share-offer buy-house child-city leave father-tools stall-takeover stay-on nephew treatment house-travel empty-house take-in legacy remembered');
assign('h_samlor b_ddt h_talumphuk b_left_behind b_ice_cream b_lady_bangkok b_tech_shirt b_draft_south b_bar_cousin b_sister_money b_microscope b_land_paper b_loan_shark b_chit h_oil_share b_street_clear b_slum_fire b_korea h_toy_fire b_dam h_mud b_brother_home b_dialysis h_tsunami b_south_teacher b_south_market b_officer_call b_customer_service b_mule b_mother_fell b_no_card b_inflation_savings b_inflation_wage b_slump_list b_slump_owner b_slump_home b_dollar_debt b_dear_credit h_covid_stall h_covid_home b_funeral_society b_whose_name',{sad:true});
assign('b_tv_window b_chinese_school b_net_cafe b_top_up b_driver_son b_one_more_year b_ramkhamhaeng b_draft b_ordain b_nurses b_midwife b_german_husband b_overtime_sheet b_land_title b_teacher_coop b_taxi_lease b_district_fee b_taiwan b_israel b_black_tiger b_rubber b_beach_plot b_rice_pledge b_village_fund b_vote_envelope b_thirty_baht b_good_morning b_rider b_cheap_leap b_cheap_shophouse b_cheap_condo_flip b_export_windfall b_boom_broker b_boom_poach b_first_car b_condo_bts b_compound b_boarding b_transfer_envelope b_old_robe b_white_robe b_allowance');
// The literature-grounded scenario bank. The scenes that price a life or open
// one get the sad pair; the ones that open a way get the brighter pair.
assign('sc_not_worth_that sc_drug_list sc_midwife',{sad:true});
assign('sc_letter_home sc_girl_cooled',{joy:true});
export const EVENT_PALETTES={
 accident:[139,211],bucket:[202,166],friendship:[221,147],heartbreak:[221,232],consequence:[211,171],market:[216,189],economy:[155,221],connection:[139,147],project:[157,168],recovery:[202,166],flood:[139,207],loss:[221,232],work:[145,190],commission:[151,189],illness:[139,211],school:[167,170],retirement:[229,203],dengue:[139,145],fired:[155,216],married:[147,166],pregnant:[171,173]
};
export const QUIET_PLATES=quiet;
