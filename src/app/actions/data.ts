'use server'

import { createClient } from '@/utils/supabase/server'

// ─── Tipos de datos ──────────────────────────────────────────────────────────

export interface UsuarioPerfil {
  id_usuario:       number
  id_auth:          string
  nombres:          string
  apellidos:        string
  correo:           string
  telefono:         string | null
  fecha_nacimiento: string | null
  fecha_ingreso:    string | null
  universidad:      string | null
  carrera:          string | null
  ciclo_academico:  string | null
  linkedin_url:     string | null
  instagram_url:    string | null
  foto_perfil_url:  string | null
  es_miembro_activo: boolean
  id_area:          number | null
  id_cargo:         number | null
  id_lider_directo: number | null
  // Joins
  area:  { nombre: string } | null
  cargo: { nombre_cargo: string; nivel_jerarquia: number } | null
}

export interface EventoDB {
  id_evento:         number
  titulo:            string
  fecha_hora_inicio: string
  fecha_hora_fin:    string | null
  lugar:             string | null
  modalidad:         string | null
  tipo_evento:       string | null
  id_area:           number | null
  area:              { nombre: string } | null
}

export interface AsistenciaDB {
  id_asistencia: number
  id_usuario:    number
  id_evento:     number
  estado:        string | null
  fecha_registro: string
}

export interface UsuarioDirectorio {
  id_usuario:       number
  nombres:          string
  apellidos:        string
  correo:           string
  telefono:         string | null
  linkedin_url:     string | null
  instagram_url:    string | null
  foto_perfil_url:  string | null
  es_miembro_activo: boolean
  area:  { nombre: string } | null
  cargo: { nombre_cargo: string; nivel_jerarquia: number } | null
}

// ─── Obtener perfil del usuario logueado ─────────────────────────────────────

export async function getMyProfile(): Promise<UsuarioPerfil | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('usuario')
    .select(`
      *,
      area ( nombre ),
      cargo ( nombre_cargo, nivel_jerarquia )
    `)
    .eq('id_auth', user.id)
    .single()

  if (error || !data) {
    console.error('Error fetching profile:', error?.message)
    return null
  }

  return data as unknown as UsuarioPerfil
}

// ─── Obtener todos los eventos ───────────────────────────────────────────────

export async function getEventos(): Promise<EventoDB[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('evento')
    .select(`
      *,
      area ( nombre )
    `)
    .order('fecha_hora_inicio', { ascending: true })

  if (error) {
    console.error('Error fetching eventos:', error.message)
    return []
  }

  return (data ?? []) as unknown as EventoDB[]
}

// ─── Obtener asistencias del usuario logueado ────────────────────────────────

export async function getMyAsistencias(): Promise<AsistenciaDB[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Primero obtenemos el id_usuario del usuario logueado
  const { data: usuario } = await supabase
    .from('usuario')
    .select('id_usuario')
    .eq('id_auth', user.id)
    .single()

  if (!usuario) return []

  const { data, error } = await supabase
    .from('asistencia')
    .select('*')
    .eq('id_usuario', usuario.id_usuario)

  if (error) {
    console.error('Error fetching asistencias:', error.message)
    return []
  }

  return (data ?? []) as AsistenciaDB[]
}

// ─── Registrar asistencia a un evento ────────────────────────────────────────

export async function registrarAsistencia(idEvento: number): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: usuario } = await supabase
    .from('usuario')
    .select('id_usuario')
    .eq('id_auth', user.id)
    .single()

  if (!usuario) return { error: 'Usuario no encontrado.' }

  // Verificar si ya está registrado
  const { data: existing } = await supabase
    .from('asistencia')
    .select('id_asistencia')
    .eq('id_usuario', usuario.id_usuario)
    .eq('id_evento', idEvento)
    .maybeSingle()

  if (existing) {
    return { error: 'Ya estás registrado en este evento.' }
  }

  const { error } = await supabase
    .from('asistencia')
    .insert({
      id_usuario: usuario.id_usuario,
      id_evento: idEvento,
      estado: 'Registrada',
    })

  if (error) {
    console.error('Error registering attendance:', error.message)
    return { error: error.message }
  }

  return { success: true }
}

// ─── Obtener directorio (todos los usuarios) ────────────────────────────────

export async function getDirectorio(): Promise<UsuarioDirectorio[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('usuario')
    .select(`
      id_usuario,
      nombres,
      apellidos,
      correo,
      telefono,
      linkedin_url,
      instagram_url,
      foto_perfil_url,
      es_miembro_activo,
      area ( nombre ),
      cargo ( nombre_cargo, nivel_jerarquia )
    `)
    .eq('es_miembro_activo', true)
    .order('id_usuario', { ascending: true })

  if (error) {
    console.error('Error fetching directorio:', error.message)
    return []
  }

  return (data ?? []) as unknown as UsuarioDirectorio[]
}

// ─── Obtener KPIs / Metas ───────────────────────────────────────────────────

export async function getMetasKpi() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('meta_kpi')
    .select(`
      *,
      area ( nombre )
    `)
    .order('id_meta', { ascending: true })

  if (error) {
    console.error('Error fetching metas:', error.message)
    return []
  }

  return data ?? []
}

// ─── Actualizar perfil propio ────────────────────────────────────────────────

export async function updateMyProfile(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const updates: Record<string, string | null> = {}

  const fields = ['telefono', 'universidad', 'carrera', 'ciclo_academico', 'linkedin_url', 'instagram_url'] as const
  for (const field of fields) {
    const value = formData.get(field)
    if (value !== null) {
      updates[field] = value as string || null
    }
  }

  const { error } = await supabase
    .from('usuario')
    .update(updates)
    .eq('id_auth', user.id)

  if (error) {
    console.error('Error updating profile:', error.message)
    return { error: error.message }
  }

  return { success: true }
}
