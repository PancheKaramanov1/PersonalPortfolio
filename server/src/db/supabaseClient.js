import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient(config) {
  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    return null;
  }
  return createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false },
  });
}
