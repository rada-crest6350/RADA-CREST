const supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

function sbReady(){
  return window.SUPABASE_URL &&
    !window.SUPABASE_URL.includes("PASTE_") &&
    window.SUPABASE_ANON_KEY &&
    !window.SUPABASE_ANON_KEY.includes("PASTE_");
}
