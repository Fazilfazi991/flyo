import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';

let db;
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'flyo-chat-test-'));
const [visitorA,visitorB,visitorC,agent,otherAgent,outsider]=Array.from({length:6},randomUUID);
const cid=randomUUID(),initial=randomUUID();
const lead={name:'Test Traveller',phone:'+971 50 000 0000',email:'traveller@example.invalid',destination:'Bangkok',category:'Tour package enquiry',message:'Please share travel options.',consent:true,package_id:'thailand-bangkok-pattaya-group-package',package_name:'Thailand Holiday Special Group Package',package_url:'https://example.invalid/packages/thailand-bangkok-pattaya-group-package/',source_url:'https://example.invalid/packages/',message_id:initial};
async function asUser(id,fn,role='authenticated'){
  return db.transaction(async tx=>{
    await tx.exec(`set local role ${role}`);
    await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[id||'']);
    return fn(tx);
  });
}
async function cmd(user,action,conversation=null,payload={}){
  return asUser(user,async tx=>(await tx.query('select public.flyo_chat_command($1,$2,$3::jsonb) result',[action,conversation,JSON.stringify(payload)])).rows[0].result);
}
before(async()=>{
  db=new PGlite(directory);
  await db.exec(`create role anon nologin;create role authenticated nologin;create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to anon,authenticated;`);
  await db.exec(fs.readFileSync('supabase/flyo-admin-schema.sql','utf8').replace('create extension if not exists pgcrypto;',''));
  await db.exec('grant all on all tables in schema public to anon,authenticated');
  await db.exec(fs.readFileSync('supabase/live-chat.sql','utf8'));
  for(const user of [visitorA,visitorB,visitorC,agent,otherAgent,outsider])await db.query('insert into auth.users values($1)',[user]);
  await db.query("insert into public.flyo_staff(user_id,display_name,role) values($1,'Travel specialist','agent'),($2,'Administrator','admin')",[agent,otherAgent]);
});
after(async()=>{await db.close();assert.equal(path.dirname(path.resolve(directory)),path.resolve(os.tmpdir()));assert.ok(path.basename(directory).startsWith('flyo-chat-test-'));fs.rmSync(directory,{recursive:true,force:true});});

test('an offline enquiry persists contact and package details, once across retries',async()=>{
  assert.equal((await cmd(visitorA,'availability')).online,false);
  const first=await cmd(visitorA,'start',cid,lead),retry=await cmd(visitorA,'start',cid,lead);
  assert.equal(first.id,retry.id);
  const inbox=await cmd(agent,'inbox');assert.equal(inbox.length,1);assert.equal(inbox[0].lead.phone,lead.phone);
  assert.equal(inbox[0].lead.package_url,lead.package_url);assert.ok(inbox[0].lead.consent_at);assert.equal(inbox[0].unread,1);
  assert.equal((await db.query('select count(*) n from public.flyo_enquiries')).rows[0].n,1);
});
test('staff replies are durable and message retries do not duplicate',async()=>{
  const id=randomUUID();
  const one=await cmd(agent,'send',cid,{message_id:id,body:'We can help with your trip.'});
  const two=await cmd(agent,'send',cid,{message_id:id,body:'We can help with your trip.'});assert.equal(one.id,two.id);
  const thread=await asUser(visitorA,tx=>tx.query('select * from public.flyo_messages where conversation_id=$1 order by created_at,id',[cid]));
  assert.equal(thread.rows.length,2);assert.equal(thread.rows[1].sender_role,'staff');assert.equal(thread.rows[1].body,'We can help with your trip.');
});
test('customers cannot read others’ messages or contact data, call the inbox, or grant themselves staff',async()=>{
  assert.equal((await asUser(visitorB,tx=>tx.query('select * from public.flyo_messages where conversation_id=$1',[cid]))).rows.length,0);
  assert.equal((await asUser(visitorB,tx=>tx.query('select * from public.flyo_enquiries'))).rows.length,0);
  assert.equal((await asUser(visitorA,tx=>tx.query('select * from public.flyo_enquiries'))).rows.length,0);
  await assert.rejects(()=>cmd(visitorB,'send',cid,{message_id:randomUUID(),body:'Intrusion'}),/Conversation unavailable/);
  await assert.rejects(()=>cmd(visitorB,'inbox'),/Staff only/);
  await assert.rejects(()=>asUser(visitorB,tx=>tx.query("insert into public.flyo_staff(user_id,display_name) values($1,'Unauthorized')",[visitorB])),/permission denied/);
  await assert.rejects(()=>asUser(visitorA,tx=>tx.query("update public.flyo_conversations set status='active' where id=$1",[cid])),/permission denied/);
  await assert.rejects(()=>cmd(outsider,'presence',null,{status:'online'}),/Staff only/);
  assert.equal(await cmd(outsider,'profile'),null);
});
test('visitor Auth cannot gain the existing CMS permissions',async()=>{
  await assert.rejects(()=>asUser(visitorA,tx=>tx.query("insert into public.flyo_packages(slug,title) values('unauthorized','Intrusion')")),/row-level security/);
  await assert.rejects(()=>asUser(agent,tx=>tx.query("insert into public.flyo_packages(slug,title) values('unauthorized','Intrusion')")),/row-level security/);
  await asUser(otherAgent,tx=>tx.query("insert into public.flyo_packages(slug,title) values('authorized-draft','Authorized draft')"));
  assert.equal((await asUser(visitorA,tx=>tx.query("select * from public.flyo_packages where slug='authorized-draft'"))).rows.length,0);
});
test('unread counters and genuine staff availability are based on acknowledgements and heartbeats',async()=>{
  const thread=await asUser(visitorA,tx=>tx.query('select * from public.flyo_messages where conversation_id=$1 order by created_at',[cid]));
  await cmd(agent,'read',cid,{message_id:thread.rows.at(-1).id});assert.equal((await cmd(agent,'inbox'))[0].unread,0);
  assert.equal((await cmd(otherAgent,'inbox'))[0].unread,1);
  await cmd(visitorA,'read',cid,{message_id:thread.rows.at(-1).id});
  const receipt=(await asUser(visitorA,tx=>tx.query('select visitor_read_at from public.flyo_conversations where id=$1',[cid]))).rows[0];
  assert.ok(new Date(receipt.visitor_read_at)>=new Date(thread.rows.at(-1).created_at));
  await cmd(agent,'presence',null,{status:'online'});assert.equal((await cmd(visitorA,'availability')).online,true);
  await db.query("update public.flyo_staff set heartbeat_at=now()-interval '2 minutes' where user_id=$1",[agent]);
  assert.equal((await cmd(visitorA,'availability')).online,false);
});
test('server validation rejects missing consent, invalid phone numbers, empty and overlong messages',async()=>{
  for(const patch of [{consent:false},{phone:'() -- -'},{phone:''},{name:'X'},{email:'invalid'},{message:''},{message:'x'.repeat(4001)}]){
    await assert.rejects(()=>cmd(visitorB,'start',randomUUID(),{...lead,...patch,message_id:randomUUID()}));
  }
  await assert.rejects(()=>cmd(visitorA,'send',cid,{message_id:randomUUID(),body:'  '}),/1–4000/);
  await assert.rejects(()=>cmd(visitorA,'send',cid,{message_id:randomUUID(),body:'x'.repeat(4001)}),/1–4000/);
  await assert.rejects(()=>cmd(visitorA,'status',cid,{status:'resolved'}),/Forbidden/);
  await assert.rejects(()=>asUser(null,tx=>tx.query("select public.flyo_chat_command('profile')")),/Sign in required/);
  await assert.rejects(()=>asUser(null,tx=>tx.query("select public.flyo_chat_command('profile')"),'anon'),/permission denied/);
});
test('a package selected during an existing chat is saved atomically with the message',async()=>{
  const body='<img src=x onerror=alert(1)> Please quote Japan.';
  const message=await cmd(visitorA,'send',cid,{message_id:randomUUID(),body,package:{package_id:'japan-tokyo-osaka',package_name:'Japan Land Package – Tokyo & Osaka',package_url:'https://example.invalid/packages/japan-tokyo-osaka/'}});
  assert.equal(message.body,body);assert.equal(message.package_context.package_id,'japan-tokyo-osaka');
  const inbox=await cmd(agent,'inbox',null,{search:'japan'});assert.equal(inbox.length,1);assert.equal(inbox[0].lead.package_slug,'japan-tokyo-osaka');assert.equal(inbox[0].unread,1);
});
test('resolved conversations reject new messages until a staff member reopens them',async()=>{
  await cmd(agent,'status',cid,{status:'resolved'});
  await assert.rejects(()=>cmd(visitorA,'send',cid,{message_id:randomUUID(),body:'new message'}),/Conversation ended/);
  await cmd(agent,'status',cid,{status:'active'});await cmd(visitorA,'send',cid,{message_id:randomUUID(),body:'Thank you'});
});
test('database rate limits cap new enquiries and rapid sends',async()=>{
  const ids=[];
  for(let i=0;i<3;i++){const id=randomUUID();ids.push(id);await cmd(visitorC,'start',id,{...lead,message_id:randomUUID()});}
  await assert.rejects(()=>cmd(visitorC,'start',randomUUID(),{...lead,message_id:randomUUID()}),/Too many enquiries/);
  for(let i=0;i<27;i++)await cmd(visitorC,'send',ids[0],{message_id:randomUUID(),body:`Rate test ${i}`});
  await assert.rejects(()=>cmd(visitorC,'send',ids[0],{message_id:randomUUID(),body:'Rate exceeded'}),/Please wait a minute/);
});
test('removing staff access takes effect immediately',async()=>{
  await db.query('update public.flyo_staff set enabled=false where user_id=$1',[agent]);
  await assert.rejects(()=>cmd(agent,'inbox'),/Staff only/);
  assert.equal((await asUser(agent,tx=>tx.query('select * from public.flyo_enquiries'))).rows.length,0);
  await assert.rejects(()=>cmd(agent,'send',cid,{message_id:randomUUID(),body:'No longer authorized'}),/Conversation unavailable/);
});
test('history and enquiry records survive closing and reopening the actual local Postgres database',async()=>{
  await db.close();db=new PGlite(directory);
  const thread=await asUser(visitorA,tx=>tx.query('select * from public.flyo_messages where conversation_id=$1',[cid]));assert.ok(thread.rows.length>=4);
  assert.equal((await cmd(otherAgent,'inbox',null,{search:'Japan'})).length,1);
});
