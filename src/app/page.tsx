'use client'

import Link from 'next/link'
import { ChevronRight, CalendarDays, Target, TrendingUp, Users, Gift, Zap } from 'lucide-react'

// ─── Data (mock — en producción vendrá de Supabase) ──────────────────────────

const NEXT_EVENTS = [
  { day: '18', month: 'Oct', title: 'Taller de Liderazgo', type: 'LEC',     time: '6:00 PM', modality: 'Virtual' },
  { day: '22', month: 'Oct', title: 'Día de la Cultura Bull', type: 'TEAM DAY', time: '6:00 PM', modality: 'Presencial' },
  { day: '25', month: 'Oct', title: 'Reunión de LCM',       type: 'LCM',     time: '7:00 PM', modality: 'Presencial' },
]

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'LEC':      { bg: '#FEE2E2', text: '#991B1B' },
  'TEAM DAY': { bg: '#EDE9FE', text: '#5B21B6' },
  'LCM':      { bg: '#DBEAFE', text: '#1E40AF' },
}

const KPIS = [
  { label: '% Membresía Activa', value: '80%',  icon: '👥', progress: 80  },
  { label: '# APDs',             value: '5/7',  icon: '📋', progress: 71  },
  { label: '% Meta Financiera',  value: '80%',  icon: '💰', progress: 80  },
]

const BIRTHDAYS_SOON = [
  { name: 'Maria Garcia',  date: '14 Oct' },
  { name: 'Juan Perez',    date: '20 Oct' },
]

const WEEK_PROGRESS = 90
const RANK_POSITION  = 2
const TOTAL_MEMBERS  = 7

const TODAY = new Date()
const DAYS_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

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
  const greeting = TODAY.getHours() < 12 ? 'Buenos días' : TODAY.getHours() < 18 ? 'Buenas tardes' : 'Buenas noches'
  const dateStr = `${DAYS_ES[TODAY.getDay()]}, ${TODAY.getDate()} de ${MONTHS_ES[TODAY.getMonth()]} ${TODAY.getFullYear()}`

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
            {greeting}, Joe 👋
          </h1>
          <p style={{ color: 'rgba(255,230,230,0.9)', fontSize: '14px', fontWeight: 400 }}>
            Team Leader C&V · Área de Marketing · <strong style={{ color: 'white' }}>BULLS CLCH</strong>
          </p>
        </div>
      </div>

      {/* ── Quick stats row ── */}
      <div className="home-stats" style={{ marginBottom: '20px' }}>
        {[
          { value: '8',   label: 'Eventos asistidos', icon: '✅', color: '#22C55E' },
          { value: '#2',  label: 'Posición en área',  icon: '🏆', color: '#F59E0B' },
          { value: '90%', label: 'Performance semana', icon: '📈', color: '#CC0000' },
          { value: '4m',  label: 'Antigüedad',         icon: '⏱️', color: '#6366F1' },
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
              {NEXT_EVENTS.map((ev, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', backgroundColor: '#FAFAFA', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
                  {/* Date chip */}
                  <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '36px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase' }}>{ev.month}</p>
                    <p style={{ fontSize: '20px', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{ev.day}</p>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{ev.title}</span>
                      <span style={{ padding: '1px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, backgroundColor: TYPE_COLORS[ev.type]?.bg, color: TYPE_COLORS[ev.type]?.text }}>
                        {ev.type}
                      </span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#6B7280' }}>{ev.modality} · {ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs rápidos */}
          <div className="card-frictionless" style={{ padding: '20px 22px' }}>
            <CardHeader title="METAS / KPIs" href="/metas" icon={<Target size={16} />} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {KPIS.map(kpi => (
                <div key={kpi.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{kpi.icon} {kpi.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#CC0000' }}>{kpi.value}</span>
                  </div>
                  <MiniProgressBar pct={kpi.progress} />
                </div>
              ))}
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
                    strokeDasharray={`${(WEEK_PROGRESS / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: '14px', color: '#111827' }}>{WEEK_PROGRESS}%</span>
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>Semana actual</p>
                <p style={{ fontSize: '12px', color: '#22C55E', fontWeight: 600 }}>✅ Alcanzando objetivos</p>
                <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>Promedio del mes: 87%</p>
              </div>
            </div>

            {/* Ranking position */}
            <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>🥈</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>Posición #{RANK_POSITION} en tu área</p>
                <p style={{ fontSize: '11px', color: '#6B7280' }}>De {TOTAL_MEMBERS} miembros en Marketing</p>
              </div>
            </div>
          </div>

          {/* Cumpleaños + Oportunidades */}
          <div className="card-frictionless" style={{ padding: '20px 22px' }}>
            <CardHeader title="CUMPLEAÑOS DEL MES" href="/directorio" icon={<Gift size={16} />} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {BIRTHDAYS_SOON.map(b => (
                <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>🎂</span>
                  <p style={{ fontSize: '13px', color: '#374151' }}>
                    <strong>{b.name}</strong>
                    <span style={{ color: '#9CA3AF' }}> — {b.date}</span>
                  </p>
                </div>
              ))}
            </div>
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
