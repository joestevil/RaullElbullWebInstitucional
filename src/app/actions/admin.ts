'use server'

import { createClient } from '@/utils/supabase/server'
import { tienePermiso } from '@/utils/permissions'
import type { Recurso, Accion } from '@/utils/permissions'

// ─── Helper: obtener nivel de jerarquía del usuario logueado ──────────────────

async function getNivelJerarquia(): Promise<{ nivel: number; idUsuario: number } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('usuario')
    .select('id_usuario, cargo ( nivel_jerarquia )')
    .eq('id_auth', user.id)
    .single()

  if (!data) return null

  const cargo = data.cargo as unknown as { nivel_jerarquia: number } | null
  return {
    nivel: cargo?.nivel_jerarquia ?? 4,
    idUsuario: data.id_usuario,
  }
}

/** Verificar permiso en el servidor (seguro, no depende del cliente) */
async function verificarPermiso(recurso: Recurso, accion: Accion): Promise<{ ok: boolean; nivel: number; idUsuario: number }> {
  const info = await getNivelJerarquia()
  if (!info) return { ok: false, nivel: 4, idUsuario: 0 }
  return {
    ok: tienePermiso(info.nivel, recurso, accion),
    nivel: info.nivel,
    idUsuario: info.idUsuario,
  }
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ActionResult {
  error?: string
  success?: boolean
}

export interface AreaOption {
  id_area: number
  nombre:  string
}

export interface CargoOption {
  id_cargo:          number
  nombre_cargo:      string
  nivel_jerarquia:   number
}

// ─── AREAS y CARGOS (opciones para formularios) ──────────────────────────────

export async function getAreas(): Promise<AreaOption[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('area').select('id_area, nombre').order('nombre')
  return (data ?? []) as AreaOption[]
}

export async function getCargos(): Promise<CargoOption[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('cargo').select('id_cargo, nombre_cargo, nivel_jerarquia').order('nivel_jerarquia')
  return (data ?? []) as CargoOption[]
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRUD DE EVENTOS
// ═══════════════════════════════════════════════════════════════════════════════

export async function crearEvento(formData: FormData): Promise<ActionResult> {
  const { ok } = await verificarPermiso('eventos', 'crear')
  if (!ok) return { error: 'No tienes permisos para crear eventos.' }

  const supabase = await createClient()

  const titulo           = formData.get('titulo') as string
  const fecha_hora_inicio = formData.get('fecha_hora_inicio') as string
  const fecha_hora_fin   = (formData.get('fecha_hora_fin') as string) || null
  const lugar            = (formData.get('lugar') as string) || null
  const modalidad        = (formData.get('modalidad') as string) || null
  const tipo_evento      = (formData.get('tipo_evento') as string) || null
  const id_area          = formData.get('id_area') ? Number(formData.get('id_area')) : null

  if (!titulo || !fecha_hora_inicio) return { error: 'Título y fecha de inicio son obligatorios.' }

  const { error } = await supabase.from('evento').insert({
    titulo, fecha_hora_inicio, fecha_hora_fin, lugar, modalidad, tipo_evento, id_area,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function editarEvento(idEvento: number, formData: FormData): Promise<ActionResult> {
  const { ok } = await verificarPermiso('eventos', 'editar')
  if (!ok) return { error: 'No tienes permisos para editar eventos.' }

  const supabase = await createClient()

  const updates: Record<string, unknown> = {}
  const fields = ['titulo', 'fecha_hora_inicio', 'fecha_hora_fin', 'lugar', 'modalidad', 'tipo_evento'] as const
  for (const f of fields) {
    const val = formData.get(f)
    if (val !== null) updates[f] = (val as string) || null
  }
  const idArea = formData.get('id_area')
  if (idArea !== null) updates.id_area = idArea ? Number(idArea) : null

  const { error } = await supabase.from('evento').update(updates).eq('id_evento', idEvento)
  if (error) return { error: error.message }
  return { success: true }
}

export async function eliminarEvento(idEvento: number): Promise<ActionResult> {
  const { ok } = await verificarPermiso('eventos', 'eliminar')
  if (!ok) return { error: 'No tienes permisos para eliminar eventos.' }

  const supabase = await createClient()
  const { error } = await supabase.from('evento').delete().eq('id_evento', idEvento)
  if (error) return { error: error.message }
  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRUD DE USUARIOS
// ═══════════════════════════════════════════════════════════════════════════════

export async function editarUsuario(idUsuario: number, formData: FormData): Promise<ActionResult> {
  const { ok } = await verificarPermiso('usuarios', 'editar')
  if (!ok) return { error: 'No tienes permisos para editar usuarios.' }

  const supabase = await createClient()

  const updates: Record<string, unknown> = {}
  const stringFields = ['nombres', 'apellidos', 'correo', 'telefono', 'universidad', 'carrera', 'ciclo_academico'] as const
  for (const f of stringFields) {
    const val = formData.get(f)
    if (val !== null) updates[f] = (val as string) || null
  }

  const idArea = formData.get('id_area')
  if (idArea !== null) updates.id_area = idArea ? Number(idArea) : null

  const idCargo = formData.get('id_cargo')
  if (idCargo !== null) updates.id_cargo = idCargo ? Number(idCargo) : null

  const activo = formData.get('es_miembro_activo')
  if (activo !== null) updates.es_miembro_activo = activo === 'true'

  const { error } = await supabase.from('usuario').update(updates).eq('id_usuario', idUsuario)
  if (error) return { error: error.message }
  return { success: true }
}

export async function desactivarUsuario(idUsuario: number): Promise<ActionResult> {
  const { ok } = await verificarPermiso('usuarios', 'eliminar')
  if (!ok) return { error: 'No tienes permisos para desactivar usuarios.' }

  const supabase = await createClient()
  const { error } = await supabase.from('usuario').update({ es_miembro_activo: false }).eq('id_usuario', idUsuario)
  if (error) return { error: error.message }
  return { success: true }
}

/** Obtener TODOS los usuarios (incluyendo inactivos) — solo para admins */
export async function getUsuariosAdmin() {
  const { ok } = await verificarPermiso('usuarios', 'editar')
  if (!ok) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('usuario')
    .select(`
      id_usuario, nombres, apellidos, correo, telefono,
      universidad, carrera, ciclo_academico,
      es_miembro_activo, foto_perfil_url,
      id_area, id_cargo,
      area ( nombre ),
      cargo ( nombre_cargo, nivel_jerarquia )
    `)
    .order('id_usuario', { ascending: true })

  if (error) return []
  return data ?? []
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRUD DE TAREAS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getTareas() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tarea')
    .select(`
      *,
      usuario:id_usuario_asignado ( id_usuario, nombres, apellidos )
    `)
    .order('fecha_limite', { ascending: true, nullsFirst: false })

  if (error) return []
  return data ?? []
}

export async function crearTarea(formData: FormData): Promise<ActionResult> {
  const { ok } = await verificarPermiso('tareas', 'crear')
  if (!ok) return { error: 'No tienes permisos para crear tareas.' }

  const supabase = await createClient()

  const titulo        = formData.get('titulo') as string
  const descripcion   = (formData.get('descripcion') as string) || null
  const estado        = (formData.get('estado') as string) || 'Pendiente'
  const fecha_limite  = (formData.get('fecha_limite') as string) || null
  const id_usuario_asignado = formData.get('id_usuario_asignado') ? Number(formData.get('id_usuario_asignado')) : null

  if (!titulo) return { error: 'El título es obligatorio.' }

  const { error } = await supabase.from('tarea').insert({
    titulo, descripcion, estado, fecha_limite, id_usuario_asignado,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function editarTarea(idTarea: number, formData: FormData): Promise<ActionResult> {
  const { ok } = await verificarPermiso('tareas', 'editar')
  if (!ok) return { error: 'No tienes permisos para editar tareas.' }

  const supabase = await createClient()

  const updates: Record<string, unknown> = {}
  for (const f of ['titulo', 'descripcion', 'estado', 'fecha_limite'] as const) {
    const val = formData.get(f)
    if (val !== null) updates[f] = (val as string) || null
  }
  const idUser = formData.get('id_usuario_asignado')
  if (idUser !== null) updates.id_usuario_asignado = idUser ? Number(idUser) : null

  const { error } = await supabase.from('tarea').update(updates).eq('id_tarea', idTarea)
  if (error) return { error: error.message }
  return { success: true }
}

export async function eliminarTarea(idTarea: number): Promise<ActionResult> {
  const { ok } = await verificarPermiso('tareas', 'eliminar')
  if (!ok) return { error: 'No tienes permisos para eliminar tareas.' }

  const supabase = await createClient()
  const { error } = await supabase.from('tarea').delete().eq('id_tarea', idTarea)
  if (error) return { error: error.message }
  return { success: true }
}
