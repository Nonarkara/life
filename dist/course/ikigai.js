// Ikigai as four readings of the recorded life, and their overlap. An authored game
// proxy, not Ikigai-9 or a psychological measure. Starting attributes (what you were
// born good at) are deliberately excluded: only practice, care and follow-through count.
import {purpose} from './purpose.js';
const AIM_AXES={sport:['physique'],art:['craft'],security:['iq','drive'],connection:['eq'],balance:['physique','iq','eq','craft']};
const HELP=new Set(['help','visit','call','teach','materials','walk','raise','join']);
const CARE_IDS=new Set(['flood_help','friend_care','mentor','child_school','parenthood','remember']);
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
export function ikigai(state){
 const rows=(state.history??[]).filter(r=>r.from!==undefined&&r.from>=10&&r.effort);
 if(!rows.length)return null;
 const share=r=>{const axes=AIM_AXES[r.profile?.aim]??AIM_AXES.balance;return axes.reduce((n,k)=>n+(r.effort[k]??0),0)/10/(axes.length===4?.8:1);};
 const seen=state.story?.seen??[];
 const projects=seen.filter(e=>(e.id==='project'&&e.choice==='start')||e.id==='project_return').length;
 const follow=purpose(state);
 // What you love: effort placed where your chosen direction points, kept up, made into something.
 const love=clamp(100*(.55*Math.min(1,rows.reduce((n,r)=>n+share(r),0)/rows.length)+.25*(follow.eligible?follow.met/follow.eligible:.5)+.2*Math.min(1,projects/2)));
 // What you are good at: practice accumulated on the axes you love, not inborn attributes.
 const axes=AIM_AXES[rows.at(-1).profile?.aim]??AIM_AXES.balance;
 const practiced=rows.reduce((n,r)=>n+axes.reduce((m,k)=>m+(r.effort[k]??0),0),0)/axes.length;
 const good=clamp(100*Math.min(1,practiced/(rows.length*(axes.length===4?2.5:4))));
 // What the world gets from you: recorded acts of help, care, teaching and raising others.
 const acts=seen.filter(e=>CARE_IDS.has(e.id)&&HELP.has(e.choice)).length;
 // Before 30 a life may simply not have met a chance to give; that is unmeasured, not zero.
 const world=acts===0&&(state.age??0)<30?null:clamp(100*Math.min(1,acts/4));
 // What sustains you: the share of chapters in which income covered living costs. Enough, not wealth.
 const periods=(state.finance?.receipts??[]).filter(r=>r.kind==='period'&&r.age>20);
 const sustained=periods.length?periods.filter(r=>r.income>=r.essential).length/periods.length:(state.cash>=0?1:0);
 const paid=clamp(100*sustained);
 const parts={love,good,world,paid};
 // Overlap: a geometric mean, so maxing one reading cannot carry the others.
 const measured=Object.values(parts).filter(v=>v!==null);
 const score=clamp(Math.pow(measured.reduce((n,v)=>n*Math.max(1,v),1),1/measured.length));
 const both=(a,b)=>a===null||b===null?null:Math.min(a,b);
 const overlaps={passion:both(love,good),mission:both(love,world),vocation:both(world,paid),profession:both(good,paid)};
 return {version:'four-readings-1',score,parts,overlaps,chapters:rows.length};
}
