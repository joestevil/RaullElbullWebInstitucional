'use client'

import { useAuth } from '@/components/AuthProvider'
import { tienePermiso, puedeCrud, esAdmin, esSuperAdmin, etiquetaNivel, colorNivel } from '@/utils/permissions'
import type { Recurso, Accion } from '@/utils/permissions'

/**
 * Hook que expone las funciones de permisos ya ligadas al perfil
 * del usuario autenticado. No necesitas pasar nivel_jerarquia manualmente.
 */
export function usePermissions() {
  const { profile } = useAuth()
  const nivel = profile?.cargo?.nivel_jerarquia ?? 4

  return {
    /** Nivel de jerarquía actual */
    nivel,

    /** ¿Tiene permiso para una acción específica sobre un recurso? */
    puede: (recurso: Recurso, accion: Accion) => tienePermiso(nivel, recurso, accion),

    /** ¿Puede hacer CRUD (crear/editar/eliminar) sobre un recurso? */
    puedeCrud: (recurso: Recurso) => puedeCrud(nivel, recurso),

    /** ¿Es admin (nivel 0 o 1)? */
    esAdmin: esAdmin(nivel),

    /** ¿Es super admin (nivel 0)? */
    esSuperAdmin: esSuperAdmin(nivel),

    /** Etiqueta legible del nivel (e.g. "Super Admin", "Manager") */
    etiqueta: etiquetaNivel(nivel),

    /** Color del badge de jerarquía */
    color: colorNivel(nivel),
  }
}
