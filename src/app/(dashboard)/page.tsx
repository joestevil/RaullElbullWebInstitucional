'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, CalendarDays, Target, TrendingUp, Gift, Zap } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { getEventos, getMyAsistencias, getMetasKpi } from '@/app/actions/data'
import type { EventoDB, AsistenciaDB } from '@/app/actions/data'

// ─── Tipos ────────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'LEC':            { bg: '#FEE2E2', text: '#991B1B' },
  'TEAM DAY':       { bg: '#EDE9FE', text: '#5B21B6' },
  'LCM':            { bg: '#DBEAFE', text: '#1E40AF' },
  'REUNIÓN DE ÁREA':{ bg: '#FEF3C7', text: '#92400E' },
  'ITM':            { bg: '#D1FAE5', text: '#065F46' },
}

const TODAY = new Date()
const DAYS_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#CC0000', textDecoration: 'none', whiteSpace: 'nowrap' }}>
      {children} <ChevronRight size={13} />
    </Link>
  )
}

function CardHeader({ title, href, icon }: { title: string; href: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ color: '#CC0000' }}>{icon}</div>
        <h2 style={{ fontWeight: 800, fontSize: '14px', color: '#111827', letterSpacing: '0.02em' }}>{title}</h2>
      </div>
      <SectionLink href={href}>Ver todo</SectionLink>
    </div>
  )
}

function MiniProgressBar({ pct, color = '#CC0000' }: { pct: number; color?: string }) {
  return (
    <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, backgroundColor: color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { profile } = useAuth()
  const [eventos, setEventos] = useState<EventoDB[]>([])
  const [asistencias, setAsistencias] = useState<AsistenciaDB[]>([])
  const [kpis, setKpis] = useState<{ titulo: string; valor_actual: number; valor_objetivo: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [eventosData, asistenciasData, kpisData] = await Promise.all([
        getEventos(),
        getMyAsistencias(),
        getMetasKpi(),
      ])
      setEventos(eventosData)
      setAsistencias(asistenciasData)
      setKpis(kpisData)
      setLoading(false)
    }
    loadData()
  }, [])

  const greeting = TODAY.getHours() < 12 ? 'Buenos días' : TODAY.getHours() < 18 ? 'Buenas tardes' : 'Buenas noches'
  const dateStr = `${DAYS_ES[TODAY.getDay()]}, ${TODAY.getDate()} de ${MONTHS_ES[TODAY.getMonth()]} ${TODAY.getFullYear()}`

  const displayName = profile ? profile.nombres.split(' ')[0] : '...'
  const userRole = profile?.cargo?.nombre_cargo || ''
  const userArea = profile?.area?.nombre || ''

  // Próximos eventos (futuro)
  const now = new Date()
  const upcomingEvents = eventos
    .filter(e => new Date(e.fecha_hora_inicio) >= now)
    .slice(0, 3)

  // Cantidad de eventos asistidos
  const eventosAsistidos = asistencias.length

  // Antigüedad (si hay fecha_ingreso en el perfil no la tenemos aquí directamente, usamos fallback)
  const antiguedad = '—'

  // KPIs formateados
  const kpisFormatted = kpis.slice(0, 3).map(k => ({
    label: k.titulo,
    value: `${k.valor_actual}/${k.valor_objetivo}`,
    icon: '📊',
    progress: k.valor_objetivo > 0 ? Math.round((k.valor_actual / k.valor_objetivo) * 100) : 0,
  }))

  return (
    <div className="responsive-page">

      {/* ── Hero greeting ── */}
      <div
        style={{
          background:   'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)',
          borderRadius: '22px',
          padding:      '28px 32px',
          marginBottom: '24px',
          position:     'relative',
          overflow:     'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-50px', right: '120px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,210,210,0.85)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' }}>
            {dateStr.toUpperCase()}
          </p>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: '28px', letterSpacing: '-0.02em', marginBottom: '4px', lineHeight: 1.1 }}>
            {greeting}, {displayName} 👋
          </h1>
          <p style={{ color: 'rgba(255,230,230,0.9)', fontSize: '14px', fontWeight: 400 }}>
            {userRole}{userArea ? ` · Área de ${userArea}` : ''} · <strong style={{ color: 'white' }}>BULLS CLCH</strong>
          </p>
        </div>
      </div>

      {/* ── Quick stats row ── */}
      <div className="home-stats" style={{ marginBottom: '20px' }}>
        {[
          { value: String(eventosAsistidos), label: 'Eventos asistidos', icon: '✅', color: '#22C55E' },
          { value: '#—',  label: 'Posición en área',  icon: '🏆', color: '#F59E0B' },
          { value: '—', label: 'Performance semana', icon: '📈', color: '#CC0000' },
          { value: antiguedad, label: 'Antigüedad',         icon: '⏱️', color: '#6366F1' },
        ].map(s => (
          <div key={s.label} className="card-frictionless" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '20px', color: '#111827', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content: 2 columns ── */}
      <div className="home-main" style={{ marginBottom: '20px' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>

          {/* Próximos eventos */}
          <div className="card-frictionless" style={{ padding: '20px 22px' }}>
            <CardHeader title="PRÓXIMOS EVENTOS" href="/eventos" icon={<CalendarDays size={16} />} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {loading ? (
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Cargando eventos...</p>
              ) : upcomingEvents.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>No hay próximos eventos.</p>
              ) : (
                upcomingEvents.map((ev) => {
                  const date = new Date(ev.fecha_hora_inicio)
                  const day = String(date.getDate())
                  const month = MONTHS_SHORT[date.getMonth()]
                  const time = date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true })
                  const typeColor = TYPE_COLORS[ev.tipo_evento ?? ''] || { bg: '#F3F4F6', text: '#374151' }

                  return (
                    <div key={ev.id_evento} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', backgroundColor: '#FAFAFA', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
                      {/* Date chip */}
                      <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '36px' }}>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase' }}>{month}</p>
                        <p style={{ fontSize: '20px', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{day}</p>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{ev.titulo}</span>
                          {ev.tipo_evento && (
                            <span style={{ padding: '1px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, backgroundColor: typeColor.bg, color: typeColor.text }}>
                              {ev.tipo_evento}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#6B7280' }}>{ev.modalidad || 'Sin definir'} · {time}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* KPIs rápidos */}
          <div className="card-frictionless" style={{ padding: '20px 22px' }}>
            <CardHeader title="METAS / KPIs" href="/metas" icon={<Target size={16} />} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {loading ? (
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Cargando metas...</p>
              ) : kpisFormatted.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Sin metas definidas.</p>
              ) : (
                kpisFormatted.map(kpi => (
                  <div key={kpi.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{kpi.icon} {kpi.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#CC0000' }}>{kpi.value}</span>
                    </div>
                    <MiniProgressBar pct={kpi.progress} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>

          {/* Mi Progreso */}
          <div className="card-frictionless" style={{ padding: '20px 22px' }}>
            <CardHeader title="MI PROGRESO" href="/progreso" icon={<TrendingUp size={16} />} />

            {/* Week score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
              <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
                <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#F3F4F6" strokeWidth="7" />
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#CC0000" strokeWidth="7"
                    strokeDasharray={`${(0 / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: '14px', color: '#111827' }}>—</span>
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>Semana actual</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Datos pendientes</p>
              </div>
            </div>

            {/* Ranking position */}
            <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>🏆</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>Ranking de área</p>
                <p style={{ fontSize: '11px', color: '#6B7280' }}>
                  {userArea ? `Área de ${userArea}` : 'Sin área asignada'}
                </p>
              </div>
            </div>
          </div>

          {/* Cumpleaños + Oportunidades */}
          <div className="card-frictionless" style={{ padding: '20px 22px' }}>
            <CardHeader title="CUMPLEAÑOS DEL MES" href="/directorio" icon={<Gift size={16} />} />
            <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
              Próximamente desde la base de datos.
            </p>
          </div>

          {/* IXP Banner */}
          <Link href="/oportunidades" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background:   'linear-gradient(135deg, #FF6B35, #FF8C00)',
                borderRadius: '16px',
                padding:      '18px 20px',
                display:      'flex',
                alignItems:   'center',
                gap:          '14px',
                cursor:       'pointer',
                boxShadow:    '0 4px 16px rgba(255,100,0,0.25)',
                transition:   'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,100,0,0.35)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,100,0,0.25)' }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={22} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: 800, fontSize: '14px' }}>¡Toma tu IXP!</p>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', lineHeight: 1.4 }}>50% de descuento por ser MEMBER. Intercambios disponibles →</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Quick nav to other sections ── */}
      <div className="card-frictionless" style={{ padding: '18px 22px' }}>
        <h2 style={{ fontWeight: 700, fontSize: '13px', color: '#9CA3AF', letterSpacing: '0.06em', marginBottom: '14px' }}>ACCESO RÁPIDO</h2>
        <div className="home-quicknav">
          {[
            { href: '/directorio',    label: 'Directorio',     icon: '👥', desc: 'Contacta a tu equipo' },
            { href: '/recursos',      label: 'Recursos',       icon: '📁', desc: 'Materiales del comité' },
            { href: '/cultura',       label: 'Cultura Bull',   icon: '🔴', desc: 'Valores y normas' },
            { href: '/oportunidades', label: 'Oportunidades',  icon: '🌍', desc: 'Intercambios y roles' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'background-color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{item.label}</p>
                  <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
