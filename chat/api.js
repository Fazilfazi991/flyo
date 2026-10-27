import { createClient } from '/vendor/supabase.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, getSupabaseClient } from '/data/supabase-config.js';

export async function chatClient(visitor = false) {
  if (!visitor) return getSupabaseClient();
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: {
    persistSession: true, autoRefreshToken: true, detectSessionInUrl: false,
    // Keep visitors separate from the existing CMS/staff Auth session.
    ...(visitor ? { storageKey: 'flyo-chat-visitor-v1' } : {})
  }, global: { fetch: (url,options={}) => fetch(url,{...options,signal:options.signal ? AbortSignal.any([options.signal,AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000)}) } });
}
export async function command(client, action, cid = null, payload = {}) {
  const { data, error } = await client.rpc('flyo_chat_command',{ action, cid, payload });
  if (error) throw new Error(error.message || 'The chat service could not be reached. Please retry.');
  return data;
}
export async function visitorSession(client) {
  const { data: { session } } = await client.auth.getSession();
  if (session) return session;
  // Anonymous Auth must be enabled on the existing project. No fake local login.
  const { data, error } = await client.auth.signInAnonymously();
  if (error) throw new Error('Live chat is unavailable right now. Please contact Flyo by phone or WhatsApp, or try again later.');
  return data.session;
}
export async function rows(query) {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}
export async function history(client, cid, table = 'flyo_messages') {
  const all = [];
  // Explicit pagination avoids silently truncating long conversations at the
  // Supabase default row cap. Stable ordering includes the id tie-breaker.
  for (let offset = 0; ; offset += 500) {
    const page = await rows(client.from(table).select('*').eq('conversation_id',cid).order('created_at').order('id').range(offset,offset+499));
    all.push(...page);
    if (page.length < 500) return all;
  }
}
export function watch(client, name, tables, reload, connection) {
  let channel = client.channel(name);
  for (const [table,filter] of tables) channel = channel.on('postgres_changes', { event:'*',schema:'public',table,...(filter ? {filter} : {}) },reload);
  channel.subscribe(status => { connection?.(status); if (status === 'SUBSCRIBED') reload(); });
  return () => client.removeChannel(channel);
}
