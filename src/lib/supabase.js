import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// null when .env.local is missing, so the UI can show a clear error.
export const supabase = url && anonKey ? createClient(url, anonKey) : null

const notConfigured = () =>
  new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.')

export async function fetchRecentChecks(deviceId) {
  if (!supabase) throw notConfigured()
  const { data, error } = await supabase
    .from('checks')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) throw error
  return data
}

export async function insertCheck(check) {
  if (!supabase) throw notConfigured()
  const { data, error } = await supabase.from('checks').insert(check).select().single()
  if (error) throw error
  return data
}
