'use client'

// Cultura Bull page — diseño premium con valores AIESEC + cultura BULLS

const VALORES = [
  {
    emoji: '🎯',
    title: 'Excelencia',
    desc:  'Buscamos la mejora continua en todo lo que hacemos, superando expectativas y estableciendo nuevos estándares.',
    color: '#CC0000',
  },
  {
    emoji: '🤝',
    title: 'Integridad',
    desc:  'Actuamos con honestidad, transparencia y coherencia entre nuestras palabras y acciones en todo momento.',
    color: '#F59E0B',
  },
  {
    emoji: '🌍',
    title: 'Diversidad',
    desc:  'Celebramos las diferencias y valoramos cada perspectiva única como fuente de innovación y crecimiento.',
    color: '#10B981',
  },
  {
    emoji: '⚡',
    title: 'Liderazgo',
    desc:  'Desarrollamos líderes que inspiran a otros y generan impacto positivo dentro y fuera de AIESEC.',
    color: '#6366F1',
  },
  {
    emoji: '🔥',
    title: 'Pasión',
    desc:  'Llevamos energía y entusiasmo genuino a cada proyecto, evento y conversación que emprendemos.',
    color: '#F97316',
  },
  {
    emoji: '♻️',
    title: 'Sostenibilidad',
    desc:  'Tomamos decisiones pensando en el impacto a largo plazo para nuestra comunidad y el mundo.',
    color: '#22C55E',
  },
]

const NORMAS = [
  '🕐  Puntualidad y compromiso en cada reunión y evento.',
  '💬  Comunicación activa y respetuosa con todos los miembros.',
  '📱  Responder mensajes del equipo en un máximo de 24 horas.',
  '✅  Cumplir con los entregables acordados en el tiempo establecido.',
  '🙋  Participar activamente en los LEC, ITM y LCM del comité.',
  '🤫  Confidencialidad sobre información interna del comité.',
  '💡  Proponer ideas y soluciones antes de presentar problemas.',
  '🌱  Apoyar el crecimiento de cada miembro del equipo.',
]

const HITOS = [
  { año: '2018', hito: 'Fundación del comité local BULLS en Chiclayo' },
  { año: '2019', hito: 'Primer intercambio internacional completado' },
  { año: '2020', hito: 'Adaptación al formato virtual durante la pandemia' },
  { año: '2021', hito: 'Crecimiento al doble de miembros activos' },
  { año: '2022', hito: 'Reconocimiento nacional como comité destacado' },
  { año: '2023', hito: 'Lanzamiento de la plataforma BULLCO interna' },
  { año: '2024', hito: 'Mayor número de intercambios en la historia del LC' },
]

// ─── Components ───────────────────────────────────────────────────────────────

function ValorCard({ emoji, title, desc, color }: { emoji: string; title: string; desc: string; color: string }) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius:    '18px',
        border:          '1.5px solid #E5E7EB',
        padding:         '22px 20px',
        display:         'flex',
        flexDirection:   'column',
        gap:             '10px',
        boxShadow:       '0 2px 10px rgba(0,0,0,0.05)',
        transition:      'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'
      }}
    >
      {/* Icon */}
      <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
        {emoji}
      </div>
      {/* Title */}
      <p style={{ fontWeight: 800, fontSize: '15px', color: '#111827' }}>{title}</p>
      {/* Accent line */}
      <div style={{ width: '32px', height: '3px', borderRadius: '2px', backgroundColor: color }} />
      {/* Description */}
      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CulturaPage() {
  return (
    <div className="responsive-page">

      {/* ── Hero ── */}
      <div
        style={{
          background:    'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)',
          borderRadius:  '24px',
          padding:       '40px 36px',
          marginBottom:  '28px',
          position:      'relative',
          overflow:      'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="BULLS" style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))', flexShrink: 0 }} />
          <div>
            <p style={{ color: 'rgba(255,210,210,0.9)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '4px' }}>
              AIESEC EN CHICLAYO
            </p>
            <h1 style={{ color: 'white', fontWeight: 900, fontSize: '34px', letterSpacing: '-0.02em', marginBottom: '8px', lineHeight: 1.1 }}>
              CULTURA BULL
            </h1>
            <p style={{ color: 'rgba(255,230,230,0.9)', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px' }}>
              Somos más que un comité — somos una familia que cree en el poder del liderazgo joven para transformar el mundo.
            </p>
          </div>
        </div>
      </div>

      {/* ── Misión + Visión ── */}
      <div className="profile-grid" style={{ marginBottom: '24px' }}>
        <div className="card-frictionless" style={{ padding: '24px', borderLeft: '4px solid #CC0000' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '22px' }}>🚀</span>
            <h2 style={{ fontWeight: 800, fontSize: '16px', color: '#111827', letterSpacing: '0.03em' }}>NUESTRA MISIÓN</h2>
          </div>
          <p style={{ color: '#4B5563', fontSize: '14px', lineHeight: 1.7 }}>
            Desarrollar el potencial de liderazgo de los jóvenes en Chiclayo a través de experiencias prácticas de intercambio internacional, proyectos sociales y roles de liderazgo que generen un impacto positivo en la comunidad.
          </p>
        </div>
        <div className="card-frictionless" style={{ padding: '24px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '22px' }}>🌟</span>
            <h2 style={{ fontWeight: 800, fontSize: '16px', color: '#111827', letterSpacing: '0.03em' }}>NUESTRA VISIÓN</h2>
          </div>
          <p style={{ color: '#4B5563', fontSize: '14px', lineHeight: 1.7 }}>
            Ser el comité local referente de AIESEC Perú, reconocido por su excelencia operativa, cultura de alto desempeño y por producir líderes que dejan huella a nivel nacional e internacional.
          </p>
        </div>
      </div>

      {/* ── Valores ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <h2 style={{ fontWeight: 800, fontSize: '22px', color: '#111827', letterSpacing: '-0.01em' }}>Nuestros Valores</h2>
          <div style={{ flex: 1, height: '2px', backgroundColor: '#E5E7EB', borderRadius: '2px' }} />
        </div>
        <div className="valores-grid">
          {VALORES.map((v) => <ValorCard key={v.title} {...v} />)}
        </div>
      </div>

      {/* ── Normas ── */}
      <div className="profile-grid" style={{ marginBottom: '28px', alignItems: 'start' }}>
        <div className="card-frictionless" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>📋</span>
            <h2 style={{ fontWeight: 800, fontSize: '16px', color: '#111827' }}>NORMAS DE CONVIVENCIA</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {NORMAS.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 12px', backgroundColor: '#FFF8F8', borderRadius: '10px', border: '1px solid #FEE2E2' }}>
                <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>{n}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="card-frictionless" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>📖</span>
            <h2 style={{ fontWeight: 800, fontSize: '16px', color: '#111827' }}>NUESTRA HISTORIA</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {HITOS.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: i < HITOS.length - 1 ? '16px' : '0' }}>
                {/* Line + dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#CC0000', flexShrink: 0, marginTop: '4px' }} />
                  {i < HITOS.length - 1 && <div style={{ width: '2px', flex: 1, backgroundColor: '#FEE2E2', marginTop: '4px' }} />}
                </div>
                {/* Content */}
                <div style={{ paddingBottom: i < HITOS.length - 1 ? '4px' : '0' }}>
                  <span style={{ fontWeight: 800, fontSize: '12px', color: '#CC0000', letterSpacing: '0.05em' }}>{h.año}</span>
                  <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5, marginTop: '2px' }}>{h.hito}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lema ── */}
      <div
        style={{
          textAlign:     'center',
          padding:       '36px 24px',
          marginBottom:  '8px',
          background:    'linear-gradient(135deg, #FFF5F5, #FFFFFF)',
          borderRadius:  '20px',
          border:        '2px dashed #FECACA',
        }}
      >
        <p style={{ color: '#9CA3AF', fontSize: '13px', fontWeight: 600, letterSpacing: '0.12em', marginBottom: '8px' }}>NUESTRO LEMA</p>
        <p style={{ color: '#CC0000', fontWeight: 900, fontSize: '28px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          "Liderar es servir. Servir es crecer."
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '10px' }}>BULLS · AIESEC en Chiclayo · CLCH</p>
      </div>
    </div>
  )
}
