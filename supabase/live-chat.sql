-- Apply AFTER flyo-admin-schema.sql. Transactional, additive migration.
-- Bootstrap staff explicitly after applying; never trust user-editable metadata.
begin;
alter function public.set_updated_at() set search_path = '';
create schema if not exists flyo_private;
revoke all on schema flyo_private from public;
grant usage on schema flyo_private to authenticated;

create table public.flyo_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(display_name) between 1 and 100),
  role text not null default 'agent' check (role in ('admin','editor','agent')),
  enabled boolean not null default true,
  availability text not null default 'offline' check (availability in ('online','away','offline')),
  heartbeat_at timestamptz
);
create function flyo_private.is_staff(cms boolean default false) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(select 1 from public.flyo_staff
    where user_id = (select auth.uid()) and enabled and (not cms or role in ('admin','editor')));
$$;
revoke all on function flyo_private.is_staff(boolean) from public, anon;
grant execute on function flyo_private.is_staff(boolean) to authenticated;

alter table public.flyo_enquiries
  add column destination text,
  add column category text,
  add column budget text,
  add column source_url text,
  add column page_title text,
  add column package_url text,
  add column campaign jsonb not null default '{}',
  add column consent_at timestamptz,
  add column consent_version text;

create table public.flyo_conversations (
  id uuid primary key,
  visitor_id uuid not null references auth.users(id),
  enquiry_id uuid not null unique references public.flyo_enquiries(id) on delete cascade,
  status text not null default 'waiting' check (status in ('waiting','active','resolved','closed')),
  visitor_read_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index flyo_conversations_visitor on public.flyo_conversations(visitor_id,created_at desc);
create index flyo_conversations_inbox on public.flyo_conversations(status,updated_at desc);
create table public.flyo_messages (
  id uuid primary key,
  conversation_id uuid not null references public.flyo_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id),
  sender_role text not null check (sender_role in ('visitor','staff')),
  package_context jsonb,
  body text not null check (length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default clock_timestamp()
);
create index flyo_messages_history on public.flyo_messages(conversation_id,created_at,id);
create index flyo_messages_rate on public.flyo_messages(sender_id,created_at);
create table public.flyo_chat_reads (
  conversation_id uuid references public.flyo_conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key(conversation_id,user_id)
);
create table public.flyo_chat_typing (
  conversation_id uuid references public.flyo_conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('visitor','staff')),
  expires_at timestamptz not null,
  primary key(conversation_id,user_id)
);
create index flyo_chat_reads_user on public.flyo_chat_reads(user_id);
create index flyo_chat_typing_user on public.flyo_chat_typing(user_id);
create function flyo_private.can_chat(cid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(select 1 from public.flyo_conversations c
    where c.id = cid and (c.visitor_id = (select auth.uid()) or flyo_private.is_staff()));
$$;
revoke all on function flyo_private.can_chat(uuid) from public,anon;
grant execute on function flyo_private.can_chat(uuid) to authenticated;

-- Existing policies granted CMS access to ALL authenticated users. Replace only
-- the named policies from the existing schema before enabling anonymous Auth.
do $$ declare t text; label text; begin
  foreach t in array array['packages','settings','countries','experiences','enquiries','media'] loop
    label := 'Authenticated admins can manage ' || t;
    execute format('drop policy if exists %I on public.%I',label,'flyo_'||t);
    execute format('create policy %I on public.%I for all to authenticated using ((select flyo_private.is_staff(%L))) with check ((select flyo_private.is_staff(%L)))',
      label,'flyo_'||t,t <> 'enquiries',t <> 'enquiries');
  end loop;
end $$;
drop policy if exists "Anyone can create enquiries" on public.flyo_enquiries;

alter table public.flyo_staff enable row level security;
alter table public.flyo_conversations enable row level security;
alter table public.flyo_messages enable row level security;
alter table public.flyo_chat_reads enable row level security;
alter table public.flyo_chat_typing enable row level security;
create policy staff_read on public.flyo_staff for select to authenticated using ((select flyo_private.is_staff()));
create policy conversation_read on public.flyo_conversations for select to authenticated
  using (visitor_id = (select auth.uid()) or (select flyo_private.is_staff()));
create policy message_read on public.flyo_messages for select to authenticated using (flyo_private.can_chat(conversation_id));
create policy receipt_read on public.flyo_chat_reads for select to authenticated using (user_id = (select auth.uid()) and (select flyo_private.is_staff()));
create policy typing_read on public.flyo_chat_typing for select to authenticated using (flyo_private.can_chat(conversation_id));
revoke all on public.flyo_staff, public.flyo_conversations,public.flyo_messages,public.flyo_chat_reads,public.flyo_chat_typing from anon,authenticated;
grant select on public.flyo_staff, public.flyo_conversations,public.flyo_messages,public.flyo_chat_reads,public.flyo_chat_typing to authenticated;
grant select on public.flyo_enquiries to authenticated;

-- Writes are atomic commands. Private definer is necessary to write protected
-- lead/contact fields without exposing them to visitors. Every branch validates
-- the authenticated caller, ownership/role, and bounded input.
create function flyo_private.chat_command(action text, cid uuid, payload jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid(); staff boolean; c public.flyo_conversations;
  eid uuid; mid uuid; content text; result jsonb; seen timestamptz;
begin
  if uid is null then raise exception 'Sign in required' using errcode='42501'; end if;
  staff := flyo_private.is_staff();
  if payload is null or jsonb_typeof(payload) <> 'object' or octet_length(payload::text) > 20000 then
    raise exception 'Invalid request'; end if;
  if action = 'availability' then
    return jsonb_build_object('online',exists(select 1 from public.flyo_staff where enabled
      and availability='online' and heartbeat_at > now()-interval '75 seconds'));
  end if;
  if action = 'profile' then
    return (select to_jsonb(s) from public.flyo_staff s where user_id=uid and enabled);
  end if;
  if action = 'inbox' then
    if not staff then raise exception 'Staff only' using errcode='42501'; end if;
    if length(coalesce(payload->>'search','')) > 100 then raise exception 'Search too long'; end if;
    return coalesce((select jsonb_agg(item order by updated_at desc,id) from (
      select convo.updated_at,convo.id,jsonb_build_object('conversation',to_jsonb(convo),'lead',to_jsonb(e),
        'unread',(select count(*) from public.flyo_messages m where m.conversation_id=convo.id and m.sender_role='visitor' and m.created_at>coalesce(r.read_at,'-infinity'::timestamptz)),
        'preview',(select m.body from public.flyo_messages m where m.conversation_id=convo.id order by m.created_at desc,m.id desc limit 1)) item
      from public.flyo_conversations convo join public.flyo_enquiries e on e.id=convo.enquiry_id
      left join public.flyo_chat_reads r on r.conversation_id=convo.id and r.user_id=uid
      where (coalesce(payload->>'status','all')='all' or convo.status=payload->>'status') and
        (coalesce(payload->>'search','')='' or concat_ws(' ',convo.id::text,e.id::text,e.customer_name,e.phone,e.email,e.package_title,e.destination) ilike '%'||(payload->>'search')||'%')
      order by convo.updated_at desc,convo.id
      limit least(100,greatest(1,coalesce((payload->>'limit')::integer,50)))
      offset greatest(0,coalesce((payload->>'offset')::integer,0))
    ) page),'[]'::jsonb);
  end if;
  if action = 'presence' then
    if not staff then raise exception 'Staff only' using errcode='42501'; end if;
    if payload->>'status' not in ('online','away','offline') or payload->>'status' is null then raise exception 'Invalid availability'; end if;
    update public.flyo_staff set availability=payload->>'status',heartbeat_at=now() where user_id=uid;
    return '{}'::jsonb;
  end if;
  if action = 'start' then
    -- Serialize per visitor to enforce limits even across tabs.
    perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
    select * into c from public.flyo_conversations where id=cid;
    if found then
      if c.visitor_id <> uid then raise exception 'Forbidden' using errcode='42501'; end if;
      return to_jsonb(c);
    end if;
    if staff then raise exception 'Use a separate visitor browser session'; end if;
    if (select count(*) from public.flyo_conversations where visitor_id=uid and created_at>now()-interval '1 hour') >= 3 then
      raise exception 'Too many enquiries. Please try again later.'; end if;
    if length(btrim(coalesce(payload->>'name',''))) not between 2 and 100
      or length(coalesce(payload->>'phone',''))>40 or length(coalesce(payload->>'email',''))>254
      or length(regexp_replace(coalesce(payload->>'phone',''),'[^0-9]','','g')) not between 7 and 15
      or (coalesce(payload->>'email','') <> '' and payload->>'email' !~ '^[^ @]+@[^ @]+\.[^ @]+$')
      or coalesce(payload->>'phone','') !~ '^\+?[0-9 ()-]{7,40}$'
      or payload->>'consent' is distinct from 'true' then raise exception 'Provide a name, valid contact details and consent'; end if;
    if length(coalesce(payload->>'destination',''))>160 or length(coalesce(payload->>'package_name',''))>200
      or length(coalesce(payload->>'package_id',''))>160 or length(coalesce(payload->>'source_url',''))>1500
      or length(coalesce(payload->>'package_url',''))>1500 or length(coalesce(payload->>'page_title',''))>250
      or length(coalesce(payload->>'travel_date',''))>50 or length(coalesce(payload->>'travellers',''))>40
      or length(coalesce(payload->>'budget',''))>100 then raise exception 'Enquiry details too long'; end if;
    if coalesce(payload->>'travellers','') <> '' and (payload->>'travellers' !~ '^[1-9][0-9]{0,2}$') then raise exception 'Travellers must be between 1 and 999'; end if;
    if payload->>'category' is null or payload->>'category' not in ('Tour package enquiry','International holiday','Domestic holiday','Honeymoon package','Family vacation','Group travel','Custom travel itinerary','Existing booking support','General enquiry') then raise exception 'Invalid enquiry type'; end if;
    content := btrim(payload->>'message');
    if content is null or length(content) not between 1 and 4000 then raise exception 'Message must be 1–4000 characters'; end if;
    insert into public.flyo_enquiries(customer_name,phone,email,package_slug,package_title,travel_date,travellers,message,destination,category,budget,source_url,page_title,package_url,campaign,consent_at,consent_version)
      values(btrim(payload->>'name'),payload->>'phone',payload->>'email',payload->>'package_id',payload->>'package_name',payload->>'travel_date',payload->>'travellers',content,payload->>'destination',payload->>'category',payload->>'budget',payload->>'source_url',payload->>'page_title',payload->>'package_url',coalesce(payload->'campaign','{}'),now(),'2026-10-26') returning id into eid;
    insert into public.flyo_conversations(id,visitor_id,enquiry_id) values(cid,uid,eid) returning * into c;
    insert into public.flyo_messages(id,conversation_id,sender_id,sender_role,body,package_context)
      values((payload->>'message_id')::uuid,cid,uid,'visitor',content,
        case when nullif(payload->>'package_id','') is not null then jsonb_build_object('package_id',payload->>'package_id','package_name',payload->>'package_name','package_url',payload->>'package_url') else null end);
    return to_jsonb(c);
  end if;
  if cid is null then raise exception 'Conversation required'; end if;
  select * into c from public.flyo_conversations where id=cid for update;
  if not found or (c.visitor_id <> uid and not staff) then raise exception 'Conversation unavailable' using errcode='42501'; end if;
  if action = 'send' then
    mid := (payload->>'message_id')::uuid;
    if mid is null then raise exception 'Message ID required'; end if;
    content := btrim(payload->>'body');
    if content is null or length(content) not between 1 and 4000 then raise exception 'Message must be 1–4000 characters'; end if;
      select to_jsonb(m) into result from public.flyo_messages m where id=mid and conversation_id=cid and sender_id=uid;
      if result is not null then return result; end if;
      if c.status in ('closed','resolved') then raise exception 'Conversation ended. Reopen or start a new enquiry.'; end if;
      perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
      if (select count(*) from public.flyo_messages where sender_id=uid and created_at>now()-interval '1 minute') >= 30 then raise exception 'Please wait a minute before sending more messages'; end if;
      if payload ? 'package' then
        if staff or jsonb_typeof(payload->'package') <> 'object' or octet_length((payload->'package')::text)>2500
          or length(coalesce(payload#>>'{package,package_id}','')) not between 1 and 160
          or length(coalesce(payload#>>'{package,package_name}','')) not between 1 and 200
          or length(coalesce(payload#>>'{package,package_url}',''))>1500
          or length(coalesce(payload#>>'{package,destination}',''))>160 then raise exception 'Invalid package context'; end if;
        update public.flyo_enquiries set package_slug=payload#>>'{package,package_id}',package_title=payload#>>'{package,package_name}',
          package_url=payload#>>'{package,package_url}',destination=coalesce(payload#>>'{package,destination}',destination) where id=c.enquiry_id;
      end if;
      insert into public.flyo_messages(id,conversation_id,sender_id,sender_role,body,package_context)
        values(mid,cid,uid,case when staff then 'staff' else 'visitor' end,content,payload->'package') returning to_jsonb(flyo_messages.*) into result;
      update public.flyo_conversations set updated_at=clock_timestamp(),status=case when staff then 'active' else status end where id=cid;
    return result;
  elsif action='read' then
    -- The acknowledgement is capped at the newest message actually rendered by
    -- this client, so concurrent incoming messages cannot be marked read early.
    select created_at into seen from public.flyo_messages where id=(payload->>'message_id')::uuid and conversation_id=cid;
    if seen is not null then
      if staff then
        insert into public.flyo_chat_reads values(cid,uid,seen)
          on conflict(conversation_id,user_id) do update set read_at=greatest(flyo_chat_reads.read_at,excluded.read_at);
      else
        update public.flyo_conversations set visitor_read_at=greatest(visitor_read_at,seen) where id=cid;
      end if;
    end if;
  elsif action='typing' then
    insert into public.flyo_chat_typing values(cid,uid,case when staff then 'staff' else 'visitor' end,
      case when payload->>'typing'='true' then now()+interval '6 seconds' else now() end)
      on conflict(conversation_id,user_id) do update set expires_at=excluded.expires_at
        where flyo_chat_typing.expires_at < now()+interval '4 seconds' or payload->>'typing'='false';
  elsif action='status' then
    if staff then
      if payload->>'status' is null or payload->>'status' not in ('waiting','active','resolved','closed') then raise exception 'Invalid status'; end if;
    elsif payload->>'status' is distinct from 'closed' then raise exception 'Forbidden' using errcode='42501'; end if;
    update public.flyo_conversations set status=payload->>'status',updated_at=clock_timestamp() where id=cid;
  else raise exception 'Unknown action';
  end if;
  return '{}'::jsonb;
end $$;
revoke all on function flyo_private.chat_command(text,uuid,jsonb) from public,anon;
grant execute on function flyo_private.chat_command(text,uuid,jsonb) to authenticated;
create function public.flyo_chat_command(action text,cid uuid default null,payload jsonb default '{}') returns jsonb
language sql security invoker set search_path = '' as $$ select flyo_private.chat_command(action,cid,payload); $$;
revoke all on function public.flyo_chat_command(text,uuid,jsonb) from public,anon;
grant execute on function public.flyo_chat_command(text,uuid,jsonb) to authenticated;

-- Realtime honors each table's SELECT policy. No public broadcast channels.
do $$ declare t text; begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime') then
    foreach t in array array['flyo_conversations','flyo_messages','flyo_chat_typing','flyo_chat_reads'] loop
      if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then
        execute format('alter publication supabase_realtime add table public.%I',t);
      end if;
    end loop;
  end if;
end $$;
commit;
