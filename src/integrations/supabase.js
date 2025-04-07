import { createClient } from '@supabase/supabase-js';

// Supabase client initialization with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Fehlende Supabase Umgebungsvariablen. Stelle sicher, dass VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in deiner .env Datei definiert sind.'
  );
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    timeout: 30000, // increased timeout for stable connections
  },
  global: {
    headers: {
      'x-application-name': 'automonet',
    },
  },
});

// Utility to convert Supabase errors to a standardized format
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error);
  
  // Format the error consistently
  return {
    message: error?.message || 'Ein unbekannter Fehler ist aufgetreten',
    code: error?.code || 'unknown_error',
    details: error?.details || null,
    hint: error?.hint || null,
  };
};

// Listen for authentication changes
export const subscribeToAuthChanges = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// Real-time subscription utility
export const createRealtimeSubscription = (table, filter, callback) => {
  const subscription = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        ...filter,
      },
      (payload) => callback(payload)
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};
