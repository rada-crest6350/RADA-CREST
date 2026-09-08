// Safe Supabase Client Initialization (Guaranteed never to be null)
(function() {
    const DEFAULT_URL = 'https://ynpsnkvrjhaxdynmurzj.supabase.co';
    const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHNua3ZyamhheGR5bm11cnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNTc5NjAsImV4cCI6MjEwMTgzMzk2MH0.I3xFYthE0JNfGnD6N1BaNBybSq7m0G6MRILzq3NXihg';

    const sbUrl = (window.SUPABASE_URL && !window.SUPABASE_URL.includes("PASTE_")) 
                    ? window.SUPABASE_URL 
                    : DEFAULT_URL;

    const sbKey = (window.SUPABASE_ANON_KEY && !window.SUPABASE_ANON_KEY.includes("PASTE_")) 
                    ? window.SUPABASE_ANON_KEY 
                    : DEFAULT_ANON_KEY;

    if (window.supabase && typeof window.supabase.createClient === 'function') {
        window.supabaseClient = window.supabase.createClient(sbUrl, sbKey);
    } else {
        console.error("Supabase script failed to load.");
    }
})();

// Global safety alias
if (typeof supabaseClient === 'undefined' && window.supabaseClient) {
    var supabaseClient = window.supabaseClient;
}
