'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id_usuario:        number
  nombres:           string
  apellidos:         string
  correo:            string
  foto_perfil_url:   string | null
  es_miembro_activo: boolean
  area:              { nombre: string } | null
  cargo:             { nombre_cargo: string; nivel_jerarquia: number } | null
}

interface AuthContextType {
  user:       User | null
  profile:    UserProfile | null
  loading:    boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user:    null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return

    const { data } = await supabase
      .from('usuario')
      .select(`
        id_usuario,
        nombres,
        apellidos,
        correo,
        foto_perfil_url,
        es_miembro_activo,
        area ( nombre ),
        cargo ( nombre_cargo, nivel_jerarquia )
      `)
      .eq('id_auth', userId)
      .single()

    if (data) {
      setProfile(data as unknown as UserProfile)
    }
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      if (currentUser) {
        await fetchProfile(currentUser.id)
      }

      setLoading(false)
    }

    getInitialSession()

    // Escuchar cambios de auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          await fetchProfile(currentUser.id)
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
