'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Target, Info, Compass, Settings2, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Inicio',        iconPng: null,                 LucideIcon: Home,    href: '/'             },
  { label: 'Eventos',       iconPng: '/eventos.png',       LucideIcon: null,    href: '/eventos'      },
  { label: 'Metas / KPIs',  iconPng: null,                 LucideIcon: Target,  href: '/metas'        },
  { label: 'Oportunidades', iconPng: '/oportunidades.png', LucideIcon: Compass, href: '/oportunidades'},
  { label: 'Directorio',    iconPng: '/directorio.png',    LucideIcon: null,    href: '/directorio'   },
  { label: 'Recursos',      iconPng: '/recursos.png',      LucideIcon: null,    href: '/recursos'     },
  { label: 'Mi Progreso',   iconPng: '/progreso.png',      LucideIcon: null,    href: '/progreso'     },
  { label: 'Cultura Bull',  iconPng: null,                 LucideIcon: Info,    href: '/cultura'      },
]

const RED = '#CC0000'

interface SidebarProps {
  userName?:      string
  userRole?:      string
  userAvatar?:    string
  forceCollapsed?: boolean          // tablet: always collapsed
  onClose?:       () => void        // mobile: close drawer button
}

export default function Sidebar({
  userName = 'Joe Villarreal',
  userRole = 'Team leader C&V',
  userAvatar,
  forceCollapsed = false,
  onClose,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Respect forced collapse from parent (tablet mode)
  const isCollapsed = forceCollapsed || collapsed
  const W = isCollapsed ? 72 : 210
  const isMobileDrawer = !!onClose

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
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding:        isCollapsed ? '14px 10px 10px' : '12px 12px 10px',
          gap:            '8px',
        }}
      >
        {/* Logo + text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
          <Image
            src="/logo.png"
            alt="BULLS"
            width={isCollapsed ? 40 : 52}
            height={isCollapsed ? 40 : 52}
            style={{ flexShrink: 0, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.35))', transition: 'width 0.25s, height 0.25s' }}
          />
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: '14px', letterSpacing: '0.06em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                BULLS
              </p>
              <p style={{ color: 'rgba(255,210,210,0.9)', fontSize: '10.5px', lineHeight: 1.2, whiteSpace: 'nowrap', marginTop: '1px' }}>
                AIESEC en Chiclayo
              </p>
            </div>
          )}
        </div>

        {/* Toggle / Close button */}
        {isMobileDrawer ? (
          // Mobile: X to close drawer
          <button
            onClick={onClose}
            style={btnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
          >
            <X size={14} color="white" />
          </button>
        ) : !forceCollapsed ? (
          // Desktop: collapse chevron
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={btnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
            aria-label={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {collapsed
                ? <polyline points="9 18 15 12 9 6" />
                : <polyline points="15 18 9 12 15 6" />}
            </svg>
          </button>
        ) : null}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 12px 6px' }} />

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_ITEMS.map(({ label, iconPng, LucideIcon, href }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={isMobileDrawer ? onClose : undefined}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             '11px',
                padding:         isCollapsed ? '10px 0' : '9px 12px',
                borderRadius:    '12px',
                justifyContent:  isCollapsed ? 'center' : 'flex-start',
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                color:           'white',
                fontWeight:      isActive ? 600 : 400,
                fontSize:        '13.5px',
                textDecoration:  'none',
                transition:      'background-color 0.15s',
                whiteSpace:      'nowrap',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {iconPng ? (
                <Image
                  src={iconPng}
                  alt={label}
                  width={20}
                  height={20}
                  style={{ flexShrink: 0, opacity: isActive ? 1 : 0.85, mixBlendMode: 'screen' }}
                />
              ) : LucideIcon ? (
                <LucideIcon size={20} style={{ flexShrink: 0, color: 'white', opacity: isActive ? 1 : 0.85 }} />
              ) : null}
              {!isCollapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* ── Divider ── */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 12px' }} />

      {/* ── Footer / User Profile ── */}
      <Link
        href="/perfil"
        style={{
          display:         'flex',
          alignItems:      'center',
          gap:             '10px',
          padding:         isCollapsed ? '10px 0 12px' : '10px 12px 12px',
          justifyContent:  isCollapsed ? 'center' : 'flex-start',
          textDecoration:  'none',
          cursor:          'pointer',
          borderRadius:    '12px',
          transition:      'background-color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        {/* Avatar */}
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
              <p style={{ color: 'rgba(255,210,210,0.9)', fontSize: '11px', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userRole}</p>
            </div>
            <button
              style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
            >
              <Settings2 size={15} color="white" />
            </button>
          </>
        )}
      </Link>
    </aside>
  )
}

// Shared button style
const btnStyle: React.CSSProperties = {
  width:           '24px',
  height:          '24px',
  borderRadius:    '50%',
  backgroundColor: 'rgba(255,255,255,0.18)',
  border:          'none',
  cursor:          'pointer',
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  flexShrink:      0,
  transition:      'background-color 0.15s',
}
