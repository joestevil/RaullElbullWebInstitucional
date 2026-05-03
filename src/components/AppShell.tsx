'use client'

import { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import { Menu } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  // track screen size
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [mobileOpen, setMobileOpen] = useState(false)

  const getSize = useCallback(() => {
    const w = window.innerWidth
    if (w < 768) return 'mobile'
    if (w < 1024) return 'tablet'
    return 'desktop'
  }, [])

  useEffect(() => {
    const update = () => setScreenSize(getSize())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [getSize])

  // Close mobile drawer on resize up
  useEffect(() => {
    if (screenSize !== 'mobile') setMobileOpen(false)
  }, [screenSize])

  const isMobile = screenSize === 'mobile'
  const isTablet = screenSize === 'tablet'

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>

      {/* ── Mobile overlay backdrop ── */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 40,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <div
        style={{
          // Desktop / Tablet: static in flow
          // Mobile: fixed drawer that slides in from left
          ...(isMobile
            ? {
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 50,
                transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
              }
            : {
                position: 'relative',
                flexShrink: 0,
              }),
        }}
      >
        <Sidebar
          forceCollapsed={isTablet}
          onClose={isMobile ? () => setMobileOpen(false) : undefined}
        />
      </div>

      {/* ── Main content area ── */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#F0F2F5',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* ── Mobile top bar ── */}
        {isMobile && (
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#CC0000',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: 'rgba(255,255,255,0.18)',
                border: 'none',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Menu size={20} color="white" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="BULLS" style={{ width: '30px', height: '30px', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }} />
              <div>
                <p style={{ color: 'white', fontWeight: 800, fontSize: '13px', lineHeight: 1 }}>BULLS</p>
                <p style={{ color: 'rgba(255,220,220,0.9)', fontSize: '10px', lineHeight: 1.2 }}>AIESEC en Chiclayo</p>
              </div>
            </div>
          </header>
        )}

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
