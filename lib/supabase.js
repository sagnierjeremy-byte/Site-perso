// Client Supabase service role pour back-office et endpoints serverless.
// Ne jamais exposer SUPABASE_SERVICE_ROLE_KEY côté client.

import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} manquant dans .env.local`);
  return value;
}

let client = null;

export function getSupabase() {
  if (client) return client;
  client = createClient(
    requireEnv('SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { transport: ws },
    }
  );
  return client;
}

export async function pingSupabase() {
  const supabase = getSupabase();
  const { error } = await supabase.from('broadcasts').select('id', { count: 'exact', head: true });
  if (error) throw new Error(`Supabase ping failed: ${error.message}`);
  return { ok: true };
}
