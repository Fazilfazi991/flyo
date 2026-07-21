export const SUPABASE_URL = "https://jlsdgouhesdgzdrmyqhw.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsc2Rnb3VoZXNkZ3pkcm15cWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTA4NTUsImV4cCI6MjA5OTE4Njg1NX0.42NwObcOXOwwTJa22F25fhK8kN4e9RrrJad23CrGL40";

let clientPromise;

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const getSupabaseClient = async () => {
  if (!isSupabaseConfigured()) return null;
  if (!clientPromise) {
    clientPromise = import("https://esm.sh/@supabase/supabase-js@2").then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      })
    );
  }
  return clientPromise;
};
