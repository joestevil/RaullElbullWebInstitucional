'use client'

import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Person {
  id:       string
  role:     string
  name:     string
  area:     string
  phone?:   string
  email?:   string
  linkedin?: string
  instagram?: string
  photo?:   string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

// User's area (in production this comes from auth session)
const USER_AREA = 'Marketing'

const LCP: Person = {
  id: 'lcp', role: 'LCP', name: 'Jaaziel Samamé', area: 'Presidencia',
  phone: '987654321', email: 'jaaziel@aiesec.net',
}

const AREAS: Person[] = [
  { id: 'finanzas',  role: 'LCVP Finanzas y Legalidades', name: 'Estrella Barboza',  area: 'Finanzas y Legalidades', phone: '912345678', email: 'estrella@aiesec.net' },
  { id: 'ogv',       role: 'LCVP oGV',                    name: 'Fátima Bravo',      area: 'Outgoing global volunteer', phone: '923456789', email: 'fatima@aiesec.net' },
  { id: 'marketing', role: 'LCVP Marketing',               name: 'María Díaz',        area: 'Marketing',              phone: '934567890', email: 'maria@aiesec.net', linkedin: 'maria-diaz', instagram: '@maria.diaz' },
  { id: 'mxp',       role: 'LCVP MXP',                    name: 'Diego Medina',      area: 'MXP',                    phone: '945678901', email: 'diego@aiesec.net' },
  { id: 'igv',       role: 'LCVP iGV',                    name: 'William Guerra',    area: 'Incoming Global Volunteer', phone: '956789012', email: 'william.g@aiesec.net' },
]

const MY_AREA_MEMBERS: Person[] = [
  { id: 'tl-ogv',       role: 'TL oGV',                         name: 'William Mikhayl Cuzca Cajo', area: 'Marketing', phone: '971225490', email: 'wcuzcacajo@gmail.com',    linkedin: 'william-cuzca', instagram: '@william.cuzca' },
  { id: 'tl-partners',  role: 'TL Partners',                    name: 'Claudia Chafloque',          area: 'Marketing', phone: '962345678', email: 'claudia@aiesec.net' },
  { id: 'atv-member',   role: 'Attraction Volunteer y Talent Member', name: 'Andrea Araujo',         area: 'Marketing', phone: '953456789', email: 'andrea@aiesec.net' },
  { id: 'opt-member',   role: 'Optimization Volunteer y Talent Member', name: 'Rossina Fernández',  area: 'Marketing', phone: '944567890', email: 'rossina@aiesec.net' },
  { id: 'member-ur',    role: 'Member UR',                      name: 'Percy Castillo',             area: 'Marketing', phone: '935678901', email: 'percy@aiesec.net' },
  { id: 'member-er-1',  role: 'Member ER',                      name: 'Manuel Muñoz',               area: 'Marketing', phone: '926789012', email: 'manuel@aiesec.net' },
  { id: 'member-er-2',  role: 'Member ER',                      name: 'Silvana Alvarado',           area: 'Marketing', phone: '917890123', email: 'silvana@aiesec.net' },
]

// ─── Person Card (org chart node) ────────────────────────────────────────────

function PersonCard({
  person,
  onSelect,
  small = false,
}: {
  person: Person
  onSelect: (p: Person) => void
  small?: boolean
}) {
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
          {person.role}
        </p>
      </div>
      {/* Name body */}
      <div style={{ backgroundColor: 'white', border: '1.5px solid #E5E7EB', borderRadius: '12px', padding: small ? '6px 10px' : '8px 12px', marginTop: '4px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <p style={{ color: '#1A1A1A', fontWeight: 600, fontSize: small ? '11px' : '13px', lineHeight: 1.3 }}>
          {person.name}
        </p>
      </div>
    </div>
  )
}

// ─── Vertical connector ───────────────────────────────────────────────────────

function Connector({ height = 20 }: { height?: number }) {
  return <div style={{ width: '2px', height: `${height}px`, backgroundColor: '#D1D5DB', margin: '0 auto' }} />
}

function HLine({ width }: { width: string }) {
  return <div style={{ height: '2px', width, backgroundColor: '#D1D5DB' }} />
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ person, onClose }: { person: Person; onClose: () => void }) {
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
        {person.area.toUpperCase()}
      </h2>

      {/* Photo */}
      <div style={{ margin: '12px 20px', backgroundColor: '#F9FAFB', border: '2px solid #E5E7EB', borderRadius: '12px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {person.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={person.photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
        <InfoRow label="CARGO"   value={person.role} />
        <InfoRow label="NOMBRE"  value={person.name} />
        {person.phone && <InfoRow label="NUMERO"  value={person.phone} />}
        {person.email && <InfoRow label="CORREO"  value={person.email} />}
      </div>

      {/* Social buttons */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
        {person.linkedin && (
          <a
            href={`https://linkedin.com/in/${person.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', border: '2px solid #0A66C2', color: '#0A66C2', fontWeight: 700, fontSize: '14px', textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF6FF')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        )}
        {person.instagram && (
          <a
            href={`https://instagram.com/${person.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', border: '2px solid #E1306C', color: '#E1306C', fontWeight: 700, fontSize: '14px', textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF0F5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#E1306C">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
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
  const [selected, setSelected] = useState<Person | null>(null)

  // Only allow selecting if person is in user's area OR is LCP
  const handleSelect = (person: Person) => {
    if (person.area === USER_AREA || person.area === 'Presidencia') {
      setSelected(person)
    } else {
      setSelected(person) // show anyway but could restrict here
    }
  }

  const myArea = AREAS.find(a => a.area === USER_AREA)
  const myAreaMembers = MY_AREA_MEMBERS

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
        {/* LCP */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <PersonCard person={LCP} onSelect={handleSelect} />
        </div>
        <Connector height={24} />

        {/* ÁREAS section */}
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '26px', color: '#1A1A1A', margin: '8px 0 20px', letterSpacing: '-0.02em' }}>ÁREAS</h2>

        {/* Row 1: 3 areas */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {AREAS.slice(0, 3).map(a => (
            <PersonCard key={a.id} person={a} onSelect={handleSelect} />
          ))}
        </div>

        {/* Row 2: 2 areas */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {AREAS.slice(3).map(a => (
            <PersonCard key={a.id} person={a} onSelect={handleSelect} />
          ))}
        </div>

        {/* MI ÁREA section */}
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '26px', color: '#1A1A1A', margin: '0 0 20px', letterSpacing: '-0.02em' }}>MI ÁREA</h2>

        {/* LCVP of my area */}
        {myArea && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <PersonCard person={{ ...myArea, role: `LCVP ${myArea.area}` }} onSelect={handleSelect} />
          </div>
        )}
        <Connector height={20} />

        {/* Horizontal branch: TL oGV + TL Partners */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {myAreaMembers.filter(m => m.role.startsWith('TL')).map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
              <PersonCard person={m} onSelect={handleSelect} />
              <Connector height={16} />
              {/* Sub-members */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {myAreaMembers
                  .filter(sub => {
                    if (m.role === 'TL oGV') return ['Attraction Volunteer y Talent Member', 'Optimization Volunteer y Talent Member'].includes(sub.role)
                    if (m.role === 'TL Partners') return sub.role.startsWith('Member')
                    return false
                  })
                  .map(sub => (
                    <PersonCard key={sub.id} person={sub} onSelect={handleSelect} small />
                  ))}
              </div>
            </div>
          ))}
        </div>
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
