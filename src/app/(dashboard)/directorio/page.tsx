'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { getDirectorio } from '@/app/actions/data'
import type { UsuarioDirectorio } from '@/app/actions/data'
import { useAuth } from '@/components/AuthProvider'

// ─── Person Card ─────────────────────────────────────────────────────────────

function PersonCard({
  person,
  onSelect,
  small = false,
}: {
  person: UsuarioDirectorio
  onSelect: (p: UsuarioDirectorio) => void
  small?: boolean
}) {
  const roleLabel = person.cargo?.nombre_cargo || 'Miembro'
  const nameLabel = `${person.nombres} ${person.apellidos}`

  return (
    <div
      onClick={() => onSelect(person)}
      style={{
        cursor:    'pointer',
        minWidth:  small ? '130px' : '160px',
        maxWidth:  small ? '180px' : '220px',
        userSelect: 'none',
        transition: 'transform 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* Role header */}
      <div style={{ backgroundColor: '#CC0000', borderRadius: '999px', padding: small ? '4px 12px' : '5px 14px', textAlign: 'center', boxShadow: '0 2px 8px rgba(180,0,0,0.3)' }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: small ? '10px' : '12px', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {roleLabel}
        </p>
      </div>
      {/* Name body */}
      <div style={{ backgroundColor: 'white', border: '1.5px solid #E5E7EB', borderRadius: '12px', padding: small ? '6px 10px' : '8px 12px', marginTop: '4px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <p style={{ color: '#1A1A1A', fontWeight: 600, fontSize: small ? '11px' : '13px', lineHeight: 1.3 }}>
          {nameLabel}
        </p>
      </div>
    </div>
  )
}

// ─── Vertical connector ───────────────────────────────────────────────────────

function Connector({ height = 20 }: { height?: number }) {
  return <div style={{ width: '2px', height: `${height}px`, backgroundColor: '#D1D5DB', margin: '0 auto' }} />
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ person, onClose }: { person: UsuarioDirectorio; onClose: () => void }) {
  const fullName = `${person.nombres} ${person.apellidos}`
  const roleLabel = person.cargo?.nombre_cargo || 'Miembro'
  const areaLabel = person.area?.nombre || 'Sin área'

  return (
    <div
      style={{
        width:           '260px',
        minWidth:        '260px',
        backgroundColor: 'white',
        borderLeft:      '1.5px solid #E5E7EB',
        display:         'flex',
        flexDirection:   'column',
        height:          '100%',
        boxShadow:       '-4px 0 20px rgba(0,0,0,0.07)',
        animation:       'slideInRight 0.22s ease',
        overflow:        'hidden auto',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '12px 16px 0', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '13px', fontWeight: 600 }}
      >
        <ChevronLeft size={16} /> Volver
      </button>

      {/* Area name */}
      <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: '22px', color: '#1A1A1A', padding: '12px 20px 4px', letterSpacing: '-0.01em' }}>
        {areaLabel.toUpperCase()}
      </h2>

      {/* Photo */}
      <div style={{ margin: '12px 20px', backgroundColor: '#F9FAFB', border: '2px solid #E5E7EB', borderRadius: '12px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {person.foto_perfil_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={person.foto_perfil_url} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#FEE2E2', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#CC0000" style={{ width: '34px', height: '34px', opacity: 0.5 }}>
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em' }}>FOTO</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <InfoRow label="CARGO"   value={roleLabel} />
        <InfoRow label="NOMBRE"  value={fullName} />
        {person.telefono && <InfoRow label="NÚMERO"  value={person.telefono} />}
        {person.correo && <InfoRow label="CORREO"  value={person.correo} />}
      </div>

      {/* Social buttons */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
        {person.linkedin_url && (
          <a
            href={person.linkedin_url.startsWith('http') ? person.linkedin_url : `https://linkedin.com/in/${person.linkedin_url}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', border: '2px solid #0A66C2', color: '#0A66C2', fontWeight: 700, fontSize: '14px', textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF6FF')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            LinkedIn
          </a>
        )}
        {person.instagram_url && (
          <a
            href={person.instagram_url.startsWith('http') ? person.instagram_url : `https://instagram.com/${person.instagram_url.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', border: '2px solid #E1306C', color: '#E1306C', fontWeight: 700, fontSize: '14px', textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF0F5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Instagram
          </a>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontWeight: 800, fontSize: '11px', color: '#1A1A1A', letterSpacing: '0.06em', marginBottom: '2px' }}>{label}:</p>
      <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.4 }}>{value}</p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DirectorioPage() {
  const [selected, setSelected] = useState<UsuarioDirectorio | null>(null)
  const [miembros, setMiembros] = useState<UsuarioDirectorio[]>([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  useEffect(() => {
    async function load() {
      const data = await getDirectorio()
      setMiembros(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleSelect = (person: UsuarioDirectorio) => {
    setSelected(person)
  }

  // Separar por nivel jerárquico
  const lcp = miembros.find(m => m.cargo?.nivel_jerarquia === 1)         // LCP
  const lcvps = miembros.filter(m => m.cargo?.nivel_jerarquia === 2)     // LCVPs
  const tls = miembros.filter(m => m.cargo?.nivel_jerarquia === 3)       // Team Leaders
  const members = miembros.filter(m => !m.cargo || m.cargo.nivel_jerarquia >= 4) // Miembros regulares

  // Mi área
  const myArea = profile?.area?.nombre
  const myAreaMembers = miembros.filter(m => m.area?.nombre === myArea && m.id_usuario !== profile?.id_usuario)

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '100%' }}>
      {/* ── Main org chart ── */}
      <div
        style={{
          flex:       1,
          overflowY:  'auto',
          padding:    '32px 36px',
          background: '#F0F2F5',
          minWidth:   0,
        }}
      >
        <h1 style={{ fontWeight: 900, fontSize: '36px', color: '#111827', marginBottom: '24px', letterSpacing: '-0.03em', textAlign: 'center' }}>
          DIRECTORIO
        </h1>

        {loading ? (
          <div className="card-frictionless" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Cargando directorio...</p>
          </div>
        ) : (
          <>
            {/* LCP */}
            {lcp && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <PersonCard person={lcp} onSelect={handleSelect} />
                </div>
                <Connector height={24} />
              </>
            )}

            {/* ÁREAS section */}
            {lcvps.length > 0 && (
              <>
                <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '26px', color: '#1A1A1A', margin: '8px 0 20px', letterSpacing: '-0.02em' }}>ÁREAS</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {lcvps.map(a => (
                    <PersonCard key={a.id_usuario} person={a} onSelect={handleSelect} />
                  ))}
                </div>
              </>
            )}

            {/* MI ÁREA section */}
            {myArea && (
              <>
                <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '26px', color: '#1A1A1A', margin: '0 0 20px', letterSpacing: '-0.02em' }}>MI ÁREA — {myArea.toUpperCase()}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {myAreaMembers.map(m => (
                    <PersonCard key={m.id_usuario} person={m} onSelect={handleSelect} small />
                  ))}
                  {myAreaMembers.length === 0 && (
                    <p style={{ color: '#9CA3AF', fontSize: '13px' }}>No hay otros miembros en tu área.</p>
                  )}
                </div>
              </>
            )}

            {/* Todos los demás */}
            {tls.length > 0 && (
              <>
                <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '20px', color: '#6B7280', margin: '0 0 16px', letterSpacing: '-0.01em' }}>TEAM LEADERS</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {tls.map(m => (
                    <PersonCard key={m.id_usuario} person={m} onSelect={handleSelect} small />
                  ))}
                </div>
              </>
            )}

            {members.length > 0 && (
              <>
                <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '20px', color: '#6B7280', margin: '0 0 16px', letterSpacing: '-0.01em' }}>MIEMBROS</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {members.map(m => (
                    <PersonCard key={m.id_usuario} person={m} onSelect={handleSelect} small />
                  ))}
                </div>
              </>
            )}

            {miembros.length === 0 && (
              <div className="card-frictionless" style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>No hay miembros en el directorio aún.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Detail panel ── */}
      {selected && (
        <DetailPanel person={selected} onClose={() => setSelected(null)} />
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
