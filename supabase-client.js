function sbReady() {
  return Boolean(
    window.supabase &&
    window.SUPABASE_URL &&
    !window.SUPABASE_URL.includes("PASTE_") &&
    window.SUPABASE_ANON_KEY &&
    !window.SUPABASE_ANON_KEY.includes("PASTE_")
  );
}

const supabaseClient = sbReady()
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
  : null;
