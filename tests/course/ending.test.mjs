import test from 'node:test';import assert from 'node:assert/strict';
import {growthWindows} from '../../dist/course/ending.js';import {translate} from '../../dist/course/i18n.js';
test('growth comparison uses change per elapsed year, keeps health divergence and never invents an S curve',()=>{
 const rows=[{age:0,cash:0,health:90,wellbeing:60},{age:10,cash:100,health:95,wellbeing:65},{age:15,cash:180,health:70,wellbeing:60},{age:20,cash:190,health:65,wellbeing:62}];const before=JSON.stringify(rows),out=growthWindows(rows);
 assert.equal(out.fastest.from,10);assert.equal(out.fastest.to,15);assert.equal(out.fastest.health,-25);assert.equal(out.fastest.rate,16);assert.equal(out.slowed.from,15);assert.equal(JSON.stringify(rows),before);
 assert.equal(growthWindows([{age:0,cash:0},{age:10,cash:-100}]).fastest,null);assert.equal(growthWindows([]).fastest,null);
});
test('ending explanations and computed values translate in all four languages',()=>{
 for(const language of ['th','zh-CN','ja','ko'])for(const phrase of ['Look at age','Detailed comparisons','Cash grew fastest at ages 20–25.','Physical health changed by -4 points in that period.','Cash growth slowed at ages 25–30.','Physical health changed by about -4.2 points in that period.'])assert.notEqual(translate(phrase,language),phrase);
});

test('specific qualified health-change templates win over the older generic value template',()=>{
 for(const language of ['th','zh-CN','ja','ko']){const text=translate('Physical health changed by about -4.2 points in that period.',language);assert.ok(!text.includes('about'),text);assert.ok(text.includes('-4.2'));}
});
