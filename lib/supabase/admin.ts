import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabaseAdminEnv } from './env'

/**
 * Server-only admin client that bypasses Row Level Security.
 * NEVER expose this on the client side.
 * Used exclusively for admin operations (e.g. reading all transactions).
 */
export function createAdminClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseAdminEnv()

  return createSupabaseClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
