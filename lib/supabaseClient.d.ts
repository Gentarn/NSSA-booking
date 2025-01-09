import { SupabaseClient } from '@supabase/supabase-js'

declare module '../../lib/supabaseClient' {
  const supabase: SupabaseClient
  export default supabase
}
