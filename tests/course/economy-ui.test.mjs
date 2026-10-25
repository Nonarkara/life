import test from 'node:test';import assert from 'node:assert/strict';
import {INVESTMENT_COPY} from '../../dist/course/investment-view.js';
import {ECONOMY_COPY,historicalParallel} from '../../dist/course/economy-view.js';
import {translate} from '../../dist/course/i18n.js';
import {eventsFor,eventsForAccount,lifeMood} from '../../dist/course/events.js';
import {focusEvidence} from '../../dist/course/motivations.js';
test('investment and economy copy has all four language mappings',()=>{
 for(const text of [...INVESTMENT_COPY,...ECONOMY_COPY,'Budget','Invest','Money sections','Trading fee','Household buffer history','Investment repricing','Economic contraction','A shared-world comparison is unavailable for a life that joined the economy later.','Alternate paths keep cash and do not trade funds.'])for(const lang of ['th','zh-CN','ja','ko'])assert.notEqual(translate(text,lang),text,lang+': '+text);
});
test('economic markers require completed actual world evidence and mood counts owned funds',()=>{
 assert.deepEqual(eventsFor({age:25,event:'Ordinary.',economy:{contractions:[23],marketChange:-40}}).map(e=>e.type),['economy','market']);
 assert.deepEqual(eventsFor({age:25,event:'Ordinary.',economy:{contractions:[],marketChange:0}}),[]);
 const row=value=>({health:90,wellbeing:60,cash:18000,finance:{available:200,reserve:0,debt:0,holdings:{bond:{value:0,basis:0},equity:{value,basis:20000}}}});
 assert.equal(lifeMood({history:[row(20000),row(9000)]}),'difficult');
 const s={history:[{age:20,finance:row(20000).finance},{age:25,from:20,finance:row(9000).finance,profile:{focus:'security'}}]};assert.match(focusEvidence(s).text,/-11,000/);
});

test('historical parallels cover only actually observed contraction episodes',()=>{
 assert.equal(historicalParallel([{sourceYear:2009,growth:1}]),null);
 for(const year of [1997,1998,2009,2020]){const fact=historicalParallel([{sourceYear:year,growth:-2}]);assert.ok(fact?.text);assert.ok(fact.href.startsWith('https://'));}
 assert.equal(historicalParallel([{sourceYear:2020,growth:-6},{sourceYear:2009,growth:-.7}]).label,'World Bank · 2020 shock');
});

test('household and personal markers follow the account that actually bears the event',()=>{
 const row={age:30,finance:{available:1000,reserve:0,debt:0},event:'Floodwater damages the family home. A work interruption reduces your personal funds.',economy:{contractions:[28],marketChange:-500}};
 assert.deepEqual(eventsForAccount(row,'household').map(e=>e.type),['flood']);
 assert.deepEqual(eventsForAccount(row,'personal').map(e=>e.type),['economy','market','work']);
 const legacy={age:40,event:'A work interruption reduces the household buffer.'};assert.equal(eventsForAccount(legacy,'household')[0].type,'work');assert.deepEqual(eventsForAccount(legacy,'personal'),[]);
});
