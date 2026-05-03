import Image from 'next/image'

// ─── Data ─────────────────────────────────────────────────────────────────────

const LOCAL_OPS = [
  { id: 'bullco',       label: 'OC BULLCO',       image: null },
  { id: 'reclutamiento',label: 'OC RECLUTAMIENTO', image: null },
  { id: 'lcp',          label: null,               image: null, tags: ['LCP', 'VP', 'BIG EB'] },
]

const NACIONAL_OPS = [
  { id: 'congress',  label: 'OC CONGRESS',       image: null, tags: [] },
  { id: 'bigmc',     label: 'EST. o BIG MC',      image: null, tags: [] },
  { id: 'mcp',       label: null,                 image: null, tags: ['MCP', 'MCVP'] },
  { id: 'ecb',       label: 'ECB',               image: null, tags: [] },
  { id: 'efb',       label: 'EFB',               image: null, tags: [] },
  { id: 'etica',     label: 'Subcomité de Ética', image: null, tags: [], accent: true },
]

const INTL_OPS = [
  { id: 'icb',  label: 'ICB',  image: null, tags: [] },
  { id: 'gst',  label: 'GST',  image: null, tags: [] },
  { id: 'aivp', label: null,   image: null, tags: ['AIVP', 'PAI'] },
]

const IXP_MEMBERS = [
  { name: 'Tania Chapoñan' },
  { name: 'Luis Torres' },
  { name: 'Ana Ríos' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '22px', color: '#1A1A1A', margin: '28px 0 14px', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  )
}

function OpCard({
  label,
  tags = [],
  image,
  accent = false,
}: {
  label?: string | null
  tags?: string[]
  image?: string | null
  accent?: boolean
}) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius:    '16px',
        border:          '1.5px solid #E5E7EB',
        boxShadow:       '0 2px 8px rgba(0,0,0,0.05)',
        padding:         '20px 16px',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             '10px',
        minHeight:       '130px',
        overflow:        'hidden',
        position:        'relative',
      }}
    >
      {/* Tag stack */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {tags.map((t) => (
            <span key={t} style={{ color: accent ? '#CC0000' : '#CC0000', fontWeight: 700, fontSize: '15px' }}>{t}</span>
          ))}
        </div>
      )}

      {/* Label */}
      {label && (
        <p style={{ color: accent ? '#CC0000' : '#CC0000', fontWeight: 700, fontSize: '15px', textAlign: 'center', lineHeight: 1.3 }}>
          {label}
        </p>
      )}

      {/* Image placeholder */}
      {image && (
        <div style={{ width: '100%', height: '70px', borderRadius: '10px', backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
          <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Empty state decorative line */}
      {!label && tags.length === 0 && !image && (
        <div style={{ width: '40px', height: '3px', borderRadius: '2px', backgroundColor: '#E5E7EB' }} />
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OportunidadesPage() {
  return (
    <div className="responsive-page">
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '34px', color: '#111827', letterSpacing: '-0.03em', flexShrink: 0 }}>
          OPORTUNIDADES
        </h1>
        <p style={{ color: '#CC0000', fontWeight: 500, fontSize: '13.5px', lineHeight: 1.6, maxWidth: '400px', paddingTop: '6px' }}>
          Para completar tu experiencia dentro de AIESEC puedes tomar un intercambio o asumir nuevos roles a nivel nacional e internacional.
        </p>
      </div>

      {/* ── IXP Banner ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '8px' }}>

        {/* Left: IXP info */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius:    '18px',
            border:          '1.5px solid #E5E7EB',
            boxShadow:       '0 2px 10px rgba(0,0,0,0.05)',
            padding:         '20px 24px',
            display:         'flex',
            flexDirection:   'column',
            gap:             '12px',
          }}
        >
          <h3 style={{ color: '#CC0000', fontWeight: 900, fontSize: '28px', textAlign: 'center', letterSpacing: '0.05em' }}>IXP</h3>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <p style={{ color: '#CC0000', fontWeight: 600, fontSize: '13px', lineHeight: 1.6, flex: 1 }}>
              Por ser parte del programa AIESEC MEMBER, tienes un <strong>50% de descuento.</strong>
            </p>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ color: '#374151', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Puedes elegir entre:</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* GV Icon */}
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255,100,0,0.3)' }}>
                  <span style={{ color: 'white', fontSize: '10px', fontWeight: 800 }}>GV</span>
                </div>
                {/* GT Icon */}
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8, #0077B6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,180,216,0.3)' }}>
                  <span style={{ color: 'white', fontSize: '10px', fontWeight: 800 }}>GT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Members IXP */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius:    '18px',
            border:          '1.5px solid #E5E7EB',
            boxShadow:       '0 2px 10px rgba(0,0,0,0.05)',
            padding:         '20px 24px',
          }}
        >
          <h3 style={{ color: '#CC0000', fontWeight: 800, fontSize: '16px', marginBottom: '14px', textAlign: 'center' }}>
            Members que tomaron su IXP
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {IXP_MEMBERS.map((m) => (
              <div key={m.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                {/* Avatar */}
                <div style={{ width: '52px', height: '62px', borderRadius: '10px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#CC0000" style={{ width: '32px', height: '32px', opacity: 0.5 }}>
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                  </svg>
                </div>
                <p style={{ fontSize: '11px', color: '#374151', fontWeight: 500, textAlign: 'center', maxWidth: '70px', lineHeight: 1.2 }}>{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Liderazgo Local ── */}
      <SectionTitle>Liderazgo Local</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '4px' }}>
        {LOCAL_OPS.map((op) => (
          <OpCard key={op.id} label={op.label} tags={op.tags ?? []} image={op.image} />
        ))}
      </div>

      {/* ── Liderazgo Nacional ── */}
      <SectionTitle>Liderazgo Nacional</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '4px' }}>
        {NACIONAL_OPS.map((op) => (
          <OpCard key={op.id} label={op.label} tags={op.tags ?? []} image={op.image} accent={op.accent} />
        ))}
      </div>

      {/* ── Liderazgo Internacional ── */}
      <SectionTitle>Liderazgo Internacional</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
        {INTL_OPS.map((op) => (
          <OpCard key={op.id} label={op.label} tags={op.tags ?? []} image={op.image} />
        ))}
      </div>
    </div>
  )
}
