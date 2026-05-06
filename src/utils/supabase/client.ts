import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Safety check para que el build funcione con valores placeholder
  if (!supabaseUrl || !supabaseUrl.startsWith('http') || !supabaseKey || supabaseKey === 'your-supabase-anon-key') {
    return null
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
