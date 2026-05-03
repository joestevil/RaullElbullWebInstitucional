import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseUrl.startsWith('http') || !supabaseKey || supabaseKey === 'your-supabase-anon-key') {
    console.warn('Supabase credentials are not configured. Returning null client.')
    return null
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
