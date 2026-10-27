import test from 'node:test';
import assert from 'node:assert/strict';
import { faqs, faqSource } from '../data/faqs.js';
import { searchFaqs } from '../faq/search.mjs';
import { validateLead, pageContext, chronological } from '../chat/core.mjs';
test('FAQ dataset contains all 36 Option 2 questions across the requested categories',()=>{
  assert.equal(faqSource.option,2);assert.equal(faqs.length,36);assert.equal(new Set(faqs.map(f=>f.id)).size,36);
  assert.equal(new Set(faqs.map(f=>f.category)).size,8);
  assert.ok(faqs.every(f=>f.question&&f.answer));assert.ok(!JSON.stringify(faqs).includes('[Edit'));
  assert.ok(!JSON.stringify(faqs).includes('50 594 5077'));
  assert.match(faqs[35].answer,/04 369 4626/);assert.match(faqs[35].answer,/50 535 7300/);
});
test('keyword search matches questions and answers, combines words, and respects categories',()=>{
  assert.ok(searchFaqs(faqs,'visa').length>=3);assert.equal(searchFaqs(faqs,'SIC')[0].id,5);
  assert.ok(searchFaqs(faqs,'visa approval').some(item=>item.id===9));
  assert.equal(searchFaqs(faqs,'','Payments').length,5);
  assert.equal(searchFaqs(faqs,'qwerty-no-answer').length,0);
  assert.ok(searchFaqs(faqs,'AIRLINE').length>0);
});
test('customer validation requires a real contact number and explicit consent',()=>{
  const values={name:'Traveller',phone:'+971 50 000 0000',message:'Hello Flyo',category:'General enquiry',consent:true};
  assert.equal(validateLead(values),values);
  for(const patch of [{phone:''},{phone:'( ) ---'},{email:'invalid'},{consent:false},{message:''}])assert.throws(()=>validateLead({...values,...patch}));
});
test('context excludes arbitrary query strings and only collects permitted campaign fields',()=>{
  const context=pageContext({href:'https://example.invalid/packages/japan-tokyo-osaka?passport=secret&utm_source=newsletter#booking'},'Japan',{package_id:'japan-tokyo-osaka',package_name:'Japan',package_url:'https://example.invalid/packages/japan-tokyo-osaka',private:'do not capture'});
  assert.equal(context.source_url,'https://example.invalid/packages/japan-tokyo-osaka');
  assert.deepEqual(context.campaign,{utm_source:'newsletter'});assert.ok(!JSON.stringify(context).includes('secret'));assert.equal(context.private,undefined);
});
test('history merges reconnect snapshots without duplicate messages and orders ties consistently',()=>{
  const a={id:'a',created_at:'2026-10-26T10:00:00.000Z'},b={id:'b',created_at:'2026-10-26T10:00:00.000Z'};
  assert.deepEqual(chronological([b,a,b]),[a,b]);
});
