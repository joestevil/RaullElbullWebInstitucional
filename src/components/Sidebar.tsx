'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Target, Info, Compass, Settings2, X, LogOut, ShieldCheck, CalendarPlus, Users, ListTodo } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { usePermissions } from '@/hooks/usePermissions'
import { signOut } from '@/app/actions/auth'

const RED = '#CC0000'

interface SidebarProps {
  forceCollapsed?: boolean
  onClose?:       () => void
}

export default function Sidebar({
  forceCollapsed = false,
  onClose,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { profile } = useAuth()
  const perms = usePermissions()

  // ── Nav items dinámicos basados en permisos ─────────────────────────────────
  const NAV_ITEMS = [
    { label: 'Inicio',        iconPng: null,                 LucideIcon: Home,    href: '/',              show: true },
    { label: 'Eventos',       iconPng: '/eventos.png',       LucideIcon: null,    href: '/eventos',       show: true },
    { label: 'Metas / KPIs',  iconPng: null,                 LucideIcon: Target,  href: '/metas',         show: true },
    { label: 'Oportunidades', iconPng: '/oportunidades.png', LucideIcon: Compass, href: '/oportunidades', show: true },
    { label: 'Directorio',    iconPng: '/directorio.png',    LucideIcon: null,    href: '/directorio',    show: true },
    { label: 'Recursos',      iconPng: '/recursos.png',      LucideIcon: null,    href: '/recursos',      show: true },
    { label: 'Mi Progreso',   iconPng: '/progreso.png',      LucideIcon: null,    href: '/progreso',      show: true },
    { label: 'Cultura Bull',  iconPng: null,                 LucideIcon: Info,    href: '/cultura',       show: true },
  ]

  const ADMIN_ITEMS = [
    { label: 'Gestionar Eventos',   LucideIcon: CalendarPlus, href: '/admin/eventos',   show: perms.puedeCrud('eventos') },
    { label: 'Gestionar Usuarios',  LucideIcon: Users,        href: '/admin/usuarios',  show: perms.puedeCrud('usuarios') },
    { label: 'Gestionar Tareas',    LucideIcon: ListTodo,     href: '/admin/tareas',    show: perms.puedeCrud('tareas') },
  ]

  const visibleAdminItems = ADMIN_ITEMS.filter(i => i.show)

  // Nombre y rol dinámicos
  const userName = profile ? `${profile.nombres} ${profile.apellidos}` : 'Cargando...'
  const userRole = profile?.cargo?.nombre_cargo && profile?.area?.nombre
    ? `${profile.cargo.nombre_cargo} ${profile.area.nombre}`
    : profile?.cargo?.nombre_cargo || 'Miembro'
  const userAvatar = profile?.foto_perfil_url || undefined

  const isCollapsed = forceCollapsed || collapsed
  const W = isCollapsed ? 72 : 220
  const isMobileDrawer = !!onClose

  const handleSignOut = async () => { await signOut() }

  return (
    <aside
      style={{
        width:           `${W}px`,
        minWidth:        `${W}px`,
        backgroundColor: RED,
        display:         'flex',
        flexDirection:   'column',
        height:          '100vh',
        transition:      'width 0.25s ease, min-width 0.25s ease',
        overflow:        'hidden',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        padding: isCollapsed ? '14px 10px 10px' : '12px 12px 10px', gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
          <Image src="/logo.png" alt="BULLS"
            width={isCollapsed ? 40 : 52} height={isCollapsed ? 40 : 52}
            style={{ flexShrink: 0, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.35))', transition: 'width 0.25s, height 0.25s' }}
          />
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: '14px', letterSpacing: '0.06em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>BULLS</p>
              <p style={{ color: 'rgba(255,210,210,0.9)', fontSize: '10.5px', lineHeight: 1.2, whiteSpace: 'nowrap', marginTop: '1px' }}>AIESEC en Chiclayo</p>
            </div>
          )}
        </div>

        {isMobileDrawer ? (
          <button onClick={onClose} style={btnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}>
            <X size={14} color="white" />
          </button>
        ) : !forceCollapsed ? (
          <button onClick={() => setCollapsed(!collapsed)} style={btnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
            aria-label={collapsed ? 'Expandir' : 'Colapsar'}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
            </svg>
          </button>
        ) : null}
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 12px 6px' }} />

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_ITEMS.filter(i => i.show).map(({ label, iconPng, LucideIcon, href }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} onClick={isMobileDrawer ? onClose : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '11px',
                padding: isCollapsed ? '10px 0' : '9px 12px', borderRadius: '12px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white', fontWeight: isActive ? 600 : 400, fontSize: '13.5px',
                textDecoration: 'none', transition: 'background-color 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}>
              {iconPng ? (
                <Image src={iconPng} alt={label} width={20} height={20}
                  style={{ flexShrink: 0, opacity: isActive ? 1 : 0.85, mixBlendMode: 'screen' }} />
              ) : LucideIcon ? (
                <LucideIcon size={20} style={{ flexShrink: 0, color: 'white', opacity: isActive ? 1 : 0.85 }} />
              ) : null}
              {!isCollapsed && <span>{label}</span>}
            </Link>
          )
        })}

        {/* ── Admin section ── */}
        {visibleAdminItems.length > 0 && (
          <>
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '8px 4px 6px' }} />
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 12px 6px' }}>
                <ShieldCheck size={12} style={{ color: 'rgba(255,210,210,0.7)' }} />
                <span style={{ color: 'rgba(255,210,210,0.7)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em' }}>ADMINISTRACIÓN</span>
              </div>
            )}
            {visibleAdminItems.map(({ label, LucideIcon, href }) => {
              const isActive = pathname.startsWith(href)
              return (
                <Link key={href} href={href} onClick={isMobileDrawer ? onClose : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '11px',
                    padding: isCollapsed ? '10px 0' : '9px 12px', borderRadius: '12px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: 'white', fontWeight: isActive ? 600 : 400, fontSize: '13px',
                    textDecoration: 'none', transition: 'background-color 0.15s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}>
                  <LucideIcon size={18} style={{ flexShrink: 0, color: 'rgba(255,255,255,0.9)' }} />
                  {!isCollapsed && <span>{label}</span>}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 12px' }} />

      {/* ── Footer / User Profile ── */}
      <Link href="/perfil" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: isCollapsed ? '10px 0 6px' : '10px 12px 6px',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        textDecoration: 'none', cursor: 'pointer', borderRadius: '12px',
        transition: 'background-color 0.15s',
      }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
        <div style={{ flexShrink: 0 }}>
          {userAvatar ? (
            <Image src={userAvatar} alt={userName} width={34} height={34}
              style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }} />
          ) : (
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style={{ width: '18px', height: '18px', opacity: 0.8 }}>
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '12.5px', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <p style={{ color: 'rgba(255,210,210,0.9)', fontSize: '11px', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userRole}</p>
                {perms.esAdmin && (
                  <span style={{ backgroundColor: perms.color.bg, color: perms.color.text, fontSize: '8px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>
                    {perms.etiqueta.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div
              style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}>
              <Settings2 size={15} color="white" />
            </div>
          </>
        )}
      </Link>

      {/* ── Sign Out ── */}
      <button onClick={handleSignOut} style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: isCollapsed ? '8px 0 12px' : '8px 12px 12px',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        background: 'none', border: 'none', cursor: 'pointer',
        borderRadius: '10px', transition: 'background-color 0.15s', width: '100%',
      }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
        <LogOut size={18} style={{ color: 'rgba(255,200,200,0.8)', flexShrink: 0 }} />
        {!isCollapsed && <span style={{ color: 'rgba(255,200,200,0.8)', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>Cerrar sesión</span>}
      </button>
    </aside>
  )
}

const btnStyle: React.CSSProperties = {
  width: '24px', height: '24px', borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.18)', border: 'none',
  cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.15s',
}
