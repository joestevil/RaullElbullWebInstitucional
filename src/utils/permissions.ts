// ─── Sistema de Permisos por Jerarquía ────────────────────────────────────────
//
// nivel_jerarquia 0 → Super Admin (LCP):  CRUD total, control absoluto
// nivel_jerarquia 1 → Admin (LCVP):       CRUD usuarios, eventos, tareas, directorio
// nivel_jerarquia 2 → Manager (TL):       CRUD solo de tareas
// nivel_jerarquia 3 → Sub-Manager:        Solo lectura (por definir)
// nivel_jerarquia 4 → Member:             No puede hacer CRUD de nada
// nivel_jerarquia 5 → (Reservado):        Por definir
//
// ──────────────────────────────────────────────────────────────────────────────

export type Recurso = 'usuarios' | 'eventos' | 'tareas' | 'directorio' | 'metas' | 'areas' | 'cargos' | 'configuracion'
export type Accion  = 'crear' | 'editar' | 'eliminar' | 'ver'

/** Matriz de permisos: qué puede hacer cada nivel sobre cada recurso */
const PERMISOS: Record<number, Record<Recurso, Accion[]>> = {
  // 0 — Super Admin (LCP): Todo
  0: {
    usuarios:       ['ver', 'crear', 'editar', 'eliminar'],
    eventos:        ['ver', 'crear', 'editar', 'eliminar'],
    tareas:         ['ver', 'crear', 'editar', 'eliminar'],
    directorio:     ['ver', 'crear', 'editar', 'eliminar'],
    metas:          ['ver', 'crear', 'editar', 'eliminar'],
    areas:          ['ver', 'crear', 'editar', 'eliminar'],
    cargos:         ['ver', 'crear', 'editar', 'eliminar'],
    configuracion:  ['ver', 'crear', 'editar', 'eliminar'],
  },
  // 1 — Admin (LCVP): CRUD de usuarios, eventos, tareas, directorio
  1: {
    usuarios:       ['ver', 'crear', 'editar', 'eliminar'],
    eventos:        ['ver', 'crear', 'editar', 'eliminar'],
    tareas:         ['ver', 'crear', 'editar', 'eliminar'],
    directorio:     ['ver', 'crear', 'editar', 'eliminar'],
    metas:          ['ver', 'crear', 'editar'],
    areas:          ['ver'],
    cargos:         ['ver'],
    configuracion:  ['ver'],
  },
  // 2 — Manager (TL): CRUD solo de tareas
  2: {
    usuarios:       ['ver'],
    eventos:        ['ver'],
    tareas:         ['ver', 'crear', 'editar', 'eliminar'],
    directorio:     ['ver'],
    metas:          ['ver'],
    areas:          ['ver'],
    cargos:         ['ver'],
    configuracion:  [],
  },
  // 3 — Sub-Manager: Solo lectura
  3: {
    usuarios:       ['ver'],
    eventos:        ['ver'],
    tareas:         ['ver'],
    directorio:     ['ver'],
    metas:          ['ver'],
    areas:          ['ver'],
    cargos:         ['ver'],
    configuracion:  [],
  },
  // 4 — Member: Solo lectura, sin CRUD
  4: {
    usuarios:       ['ver'],
    eventos:        ['ver'],
    tareas:         ['ver'],
    directorio:     ['ver'],
    metas:          ['ver'],
    areas:          ['ver'],
    cargos:         ['ver'],
    configuracion:  [],
  },
  // 5 — Reservado: por ahora solo lectura
  5: {
    usuarios:       ['ver'],
    eventos:        ['ver'],
    tareas:         ['ver'],
    directorio:     ['ver'],
    metas:          ['ver'],
    areas:          ['ver'],
    cargos:         ['ver'],
    configuracion:  [],
  },
}

// ─── Funciones de chequeo ─────────────────────────────────────────────────────

/** Verifica si un nivel de jerarquía tiene un permiso específico */
export function tienePermiso(nivelJerarquia: number | null | undefined, recurso: Recurso, accion: Accion): boolean {
  // Si no hay nivel, asumimos member (nivel 4)
  const nivel = nivelJerarquia ?? 4
  const permisos = PERMISOS[nivel] ?? PERMISOS[4]
  return permisos[recurso]?.includes(accion) ?? false
}

/** Verifica si puede hacer CRUD (crear, editar o eliminar) sobre un recurso */
export function puedeCrud(nivelJerarquia: number | null | undefined, recurso: Recurso): boolean {
  return (
    tienePermiso(nivelJerarquia, recurso, 'crear') ||
    tienePermiso(nivelJerarquia, recurso, 'editar') ||
    tienePermiso(nivelJerarquia, recurso, 'eliminar')
  )
}

/** Verifica si es admin (nivel 0 o 1) */
export function esAdmin(nivelJerarquia: number | null | undefined): boolean {
  const nivel = nivelJerarquia ?? 4
  return nivel <= 1
}

/** Verifica si es super admin (nivel 0) */
export function esSuperAdmin(nivelJerarquia: number | null | undefined): boolean {
  const nivel = nivelJerarquia ?? 4
  return nivel === 0
}

/** Obtiene la etiqueta legible del nivel */
export function etiquetaNivel(nivelJerarquia: number | null | undefined): string {
  const nivel = nivelJerarquia ?? 4
  const etiquetas: Record<number, string> = {
    0: 'Super Admin',
    1: 'Administrador',
    2: 'Manager',
    3: 'Sub-Manager',
    4: 'Miembro',
    5: 'Reservado',
  }
  return etiquetas[nivel] ?? 'Miembro'
}

/** Color de badge según nivel */
export function colorNivel(nivelJerarquia: number | null | undefined): { bg: string; text: string } {
  const nivel = nivelJerarquia ?? 4
  const colores: Record<number, { bg: string; text: string }> = {
    0: { bg: '#7C3AED', text: 'white' },     // Púrpura
    1: { bg: '#CC0000', text: 'white' },     // Rojo
    2: { bg: '#F59E0B', text: '#1A1A1A' },   // Ámbar
    3: { bg: '#06B6D4', text: 'white' },     // Cyan
    4: { bg: '#E5E7EB', text: '#374151' },   // Gris
    5: { bg: '#D1D5DB', text: '#6B7280' },   // Gris claro
  }
  return colores[nivel] ?? colores[4]
}
