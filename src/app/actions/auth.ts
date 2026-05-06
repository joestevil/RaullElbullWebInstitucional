'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AuthResult {
  error?: string
  success?: boolean
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nombres = formData.get('nombres') as string
  const apellidos = formData.get('apellidos') as string

  if (!email || !password || !nombres || !apellidos) {
    return { error: 'Todos los campos son obligatorios.' }
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        // CRÍTICO: el trigger handle_new_user() lee estos metadatos
        // para poblar la tabla pública 'usuario'
        nombres,
        apellidos,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signIn(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email y contraseña son obligatorios.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
