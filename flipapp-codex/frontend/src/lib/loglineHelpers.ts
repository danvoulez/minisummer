import { supabase } from './supabaseClient'

export async function fetchLogs() {
  const { data } = await supabase.from('logline').select('*').limit(50)
  return data
}
