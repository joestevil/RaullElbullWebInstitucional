'use client'

// ─── Data ─────────────────────────────────────────────────────────────────────

const WEEKLY_DATA = [
  { week: 'Sem 01', value: 60 },
  { week: 'Sem 02', value: 85 },
  { week: 'Sem 03', value: 80 },
  { week: 'Sem 04', value: 100 },
  { week: 'Sem 05', value: 90 },
]

const PODIO = [
  { rank: 1, name: 'Andrea Araujo',   score: 100, area: 'Marketing' },
  { rank: 2, name: 'William Cuzca',   score: 95,  area: 'Marketing' },
  { rank: 3, name: 'Rossina Fernández', score: 88, area: 'Marketing' },
  { rank: 4, name: 'Percy Castillo',  score: 82,  area: 'Marketing' },
  { rank: 5, name: 'Manuel Muñoz',    score: 75,  area: 'Marketing' },
]

const LEGEND_ITEMS = [
  { range: '0% – 50%',   label: 'No cumple sus objetivos',         color: '#EF4444', bg: '#FEF2F2' },
  { range: '51% – 79%',  label: 'Está cerca de cumplir sus objetivos', color: '#F59E0B', bg: '#FFFBEB' },
  { range: '80% – 100%', label: 'Alcanza sus objetivos',            color: '#22C55E', bg: '#F0FDF4' },
  { range: '100%+',      label: 'Sobrepasa sus objetivos',          color: '#3B82F6', bg: '#EFF6FF' },
]

const CURRENT_WEEK_PCT = 90

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPerformanceColor(pct: number) {
  if (pct > 100) return '#3B82F6'
  if (pct >= 80)  return '#22C55E'
  if (pct >= 51)  return '#F59E0B'
  return '#EF4444'
}

function getMedalEmoji(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────

function PerformanceChart() {
  const W = 580
  const H = 240
  const padL = 52, padR = 20, padT = 20, padB = 44
  const iW = W - padL - padR
  const iH = H - padT - padB
  const maxY = 120

  // Grid lines
  const gridYs = [0, 20, 40, 60, 80, 100, 120]

  // Points
  const pts = WEEKLY_DATA.map((d, i) => ({
    x: padL + (i / (WEEKLY_DATA.length - 1)) * iW,
    y: padT + iH - (d.value / maxY) * iH,
    value: d.value,
    week: d.week,
  }))

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const fillD = `${pathD} L${pts[pts.length - 1].x},${padT + iH} L${pts[0].x},${padT + iH} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#CC0000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#CC0000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#CC0000" />
          <stop offset="100%" stopColor="#FF4444" />
        </linearGradient>
      </defs>

      {/* Grid lines + Y labels */}
      {gridYs.map(y => {
        const cy = padT + iH - (y / maxY) * iH
        return (
          <g key={y}>
            <line x1={padL} y1={cy} x2={padL + iW} y2={cy}
              stroke={y === 0 ? '#9CA3AF' : '#F3F4F6'} strokeWidth={y === 0 ? 1.5 : 1} />
            <text x={padL - 8} y={cy + 4} textAnchor="end"
              style={{ fontSize: '10px', fill: '#9CA3AF', fontFamily: 'Inter,system-ui,sans-serif' }}>
              {y}%
            </text>
          </g>
        )
      })}

      {/* X labels */}
      {pts.map(p => (
        <text key={p.week} x={p.x} y={H - 8} textAnchor="middle"
          style={{ fontSize: '11px', fill: '#6B7280', fontFamily: 'Inter,system-ui,sans-serif' }}>
          {p.week}
        </text>
      ))}

      {/* Fill area */}
      <path d={fillD} fill="url(#chartFill)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="url(#lineFill)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#CC0000" strokeWidth="2.5" />
          <text x={p.x} y={p.y - 10} textAnchor="middle"
            style={{ fontSize: '10px', fontWeight: 700, fill: '#CC0000', fontFamily: 'Inter,system-ui,sans-serif' }}>
            {p.value}%
          </text>
        </g>
      ))}
    </svg>
  )
}

// ─── Circular Progress ────────────────────────────────────────────────────────

function CircularProgress({ pct, size = 90 }: { pct: number; size?: number }) {
  const r = (size / 2) - 8
  const circ = 2 * Math.PI * r
  const dash = (Math.min(pct, 100) / 100) * circ
  const color = getPerformanceColor(pct)
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="7" />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ fontWeight: 900, fontSize: `${size * 0.18}px`, color: '#111827', lineHeight: 1 }}>{pct}%</span>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProgresoPage() {
  const weekColor = getPerformanceColor(CURRENT_WEEK_PCT)

  return (
    <div className="responsive-page">
      {/* Title */}
      <h1 style={{ fontWeight: 900, fontSize: '34px', color: '#111827', marginBottom: '24px', letterSpacing: '-0.03em' }}>
        MI PROGRESO
      </h1>

      {/* ── Top row: Chart + Podio ── */}
      <div className="progreso-layout" style={{ marginBottom: '20px' }}>

        {/* Chart card */}
        <div className="card-frictionless" style={{ padding: '24px', minWidth: 0 }}>
          <h2 style={{ fontWeight: 700, fontSize: '16px', color: '#CC0000', marginBottom: '16px', textAlign: 'center' }}>
            📈 Performance por semana
          </h2>
          <PerformanceChart />

          {/* Bottom info row */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '20px', flexWrap: 'wrap' }}>

            {/* Legend */}
            <div style={{ flex: 1, minWidth: '220px', backgroundColor: '#1A1A1A', borderRadius: '14px', padding: '14px 16px' }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', marginBottom: '10px', textAlign: 'center' }}>
                CALIFICACIONES
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {LEGEND_ITEMS.map(item => (
                  <div key={item.range} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '12px', borderRadius: '4px', backgroundColor: item.color, flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>
                      <strong style={{ color: 'white' }}>{item.range}</strong> — {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current week */}
            <div
              style={{
                background:   `linear-gradient(135deg, #CC0000, #8B0000)`,
                borderRadius: '14px',
                padding:      '16px 20px',
                display:      'flex',
                flexDirection: 'column',
                alignItems:   'center',
                justifyContent: 'center',
                gap:          '6px',
                minWidth:     '140px',
                boxShadow:    '0 4px 16px rgba(180,0,0,0.3)',
              }}
            >
              <p style={{ color: 'rgba(255,210,210,0.9)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em' }}>SEMANA ACTUAL</p>
              <p style={{ color: 'white', fontWeight: 900, fontSize: '38px', lineHeight: 1 }}>{CURRENT_WEEK_PCT}%</p>
              <span style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: '999px',
              }}>
                {CURRENT_WEEK_PCT >= 100 ? '🚀 Sobrepasa' : CURRENT_WEEK_PCT >= 80 ? '✅ Alcanza' : CURRENT_WEEK_PCT >= 51 ? '⚠️ Cerca' : '❌ No cumple'}
              </span>
            </div>
          </div>
        </div>

        {/* Podio */}
        <div className="card-frictionless" style={{ padding: '24px', minWidth: 0 }}>
          <h2 style={{ fontWeight: 800, fontSize: '16px', color: '#111827', marginBottom: '4px', letterSpacing: '0.04em' }}>
            🏆 TU PODIO EN EL MES
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '18px' }}>Ranking de tu área — {PODIO[0]?.area}</p>

          {/* Top 3 visual podium */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '10px', marginBottom: '20px' }}>
            {/* 2nd */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '22px' }}>🥈</span>
              <div style={{ width: '70px', height: '60px', backgroundColor: '#E5E7EB', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 900, fontSize: '20px', color: '#6B7280' }}>2</span>
              </div>
              <p style={{ fontSize: '10px', fontWeight: 600, color: '#374151', textAlign: 'center', maxWidth: '70px', lineHeight: 1.2 }}>{PODIO[1]?.name.split(' ')[0]}</p>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280' }}>{PODIO[1]?.score}%</span>
            </div>
            {/* 1st */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '26px' }}>🥇</span>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #CC0000, #8B0000)', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(180,0,0,0.3)' }}>
                <span style={{ fontWeight: 900, fontSize: '28px', color: 'white' }}>1</span>
              </div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#111827', textAlign: 'center', maxWidth: '80px', lineHeight: 1.2 }}>{PODIO[0]?.name.split(' ')[0]}</p>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#CC0000' }}>{PODIO[0]?.score}%</span>
            </div>
            {/* 3rd */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '20px' }}>🥉</span>
              <div style={{ width: '70px', height: '44px', backgroundColor: '#FEF3C7', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 900, fontSize: '18px', color: '#92400E' }}>3</span>
              </div>
              <p style={{ fontSize: '10px', fontWeight: 600, color: '#374151', textAlign: 'center', maxWidth: '70px', lineHeight: 1.2 }}>{PODIO[2]?.name.split(' ')[0]}</p>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400E' }}>{PODIO[2]?.score}%</span>
            </div>
          </div>

          {/* Full ranking list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {PODIO.map((p) => {
              const isMe = p.rank === 2 // William Cuzca = current user
              return (
                <div key={p.rank} style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             '10px',
                  padding:         '8px 12px',
                  borderRadius:    '10px',
                  backgroundColor: isMe ? '#FFF5F5' : '#FAFAFA',
                  border:          isMe ? '1.5px solid #FECACA' : '1px solid #F3F4F6',
                }}>
                  <span style={{ fontSize: '16px', flexShrink: 0, width: '24px', textAlign: 'center' }}>{getMedalEmoji(p.rank)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: isMe ? 700 : 500, fontSize: '13px', color: isMe ? '#CC0000' : '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name} {isMe && '(Tú)'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '50px', height: '6px', borderRadius: '999px', backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(p.score, 100)}%`, backgroundColor: getPerformanceColor(p.score), borderRadius: '999px' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '12px', color: getPerformanceColor(p.score), minWidth: '34px', textAlign: 'right' }}>{p.score}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Stats summary ── */}
      <div className="progreso-stats" style={{ marginBottom: '8px' }}>
        {[
          { label: 'Promedio del mes', value: '87%', icon: '📊', color: '#6366F1' },
          { label: 'Mejor semana',     value: '100%', icon: '🔥', color: '#F97316' },
          { label: 'Eventos asistidos', value: '8/10', icon: '✅', color: '#22C55E' },
          { label: 'Posición en área',  value: '#2',   icon: '🏆', color: '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} className="card-frictionless" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>{stat.label}</p>
              <p style={{ color: '#111827', fontWeight: 800, fontSize: '20px', lineHeight: 1.1 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
