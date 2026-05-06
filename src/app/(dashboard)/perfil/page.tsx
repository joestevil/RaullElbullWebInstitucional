'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { getMyProfile, getMyAsistencias, updateMyProfile } from '@/app/actions/data'
import type { UsuarioPerfil } from '@/app/actions/data'

// ─── Circular progress SVG ────────────────────────────────────────────────────

function CircularProgress({ pct }: { pct: number }) {
  const r = 32
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }}>
      <svg width="76" height="76" viewBox="0 0 76 76" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="38" cy="38" r={r} fill="none" stroke="#E5E7EB" strokeWidth="7" />
        <circle
          cx="38" cy="38" r={r} fill="none"
          stroke="#CC0000" strokeWidth="7"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontWeight: 800, fontSize: '14px', color: '#1A1A1A' }}>{pct}%</span>
      </div>
    </div>
  )
}

// ─── Section header badge ─────────────────────────────────────────────────────

function SectionBadge({ label }: { label: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: '10px', padding: '4px 14px', marginBottom: '16px' }}>
      <span style={{ fontWeight: 800, fontSize: '13px', color: '#1A1A1A', letterSpacing: '0.04em' }}>{label}</span>
    </div>
  )
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', border: '1.5px solid #E5E7EB', borderRadius: '12px', padding: '8px 14px', minWidth: '180px' }}>
      <span style={{ backgroundColor: '#111827', color: 'white', fontWeight: 800, fontSize: '16px', borderRadius: '8px', padding: '2px 10px', flexShrink: 0 }}>{value}</span>
      <span style={{ color: '#374151', fontSize: '13.5px', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '2px' }}>{label}</p>
      <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.5 }}>{value}</p>
    </div>
  )
}

// ─── Achievement badge ────────────────────────────────────────────────────────

interface Achievement {
  id:     string
  emoji:  string
  label:  string
  unlocked: boolean
  desc?:  string
}

function AchievementCard({ a }: { a: Achievement }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius:    '14px',
        backgroundColor: a.unlocked ? '#1A1A1A' : '#F3F4F6',
        border:          a.unlocked ? 'none' : '1.5px solid #E5E7EB',
        padding:         '12px 8px',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             '6px',
        cursor:          'default',
        minHeight:       '90px',
        position:        'relative',
        overflow:        'hidden',
        transition:      'transform 0.15s',
        transform:       a.unlocked && hover ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      {!a.unlocked && a.desc && hover ? (
        <p style={{ fontSize: '10px', color: '#4B5563', textAlign: 'center', lineHeight: 1.4, padding: '0 4px' }}>{a.desc}</p>
      ) : (
        <>
          <span style={{ fontSize: '22px' }}>{a.emoji}</span>
          <p style={{ fontSize: '11px', fontWeight: 700, color: a.unlocked ? 'white' : '#9CA3AF', textAlign: 'center', lineHeight: 1.3 }}>{a.label}</p>
        </>
      )}
    </div>
  )
}

// ─── Achievements mock (gamificación — se integrará con tabla logro_gamificacion) ─

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'primeros',    emoji: '🎯', label: 'Primeros pasos',       unlocked: false },
  { id: 'interaccion', emoji: '💬', label: 'Gran interacción',     unlocked: false, desc: 'Asiste al primer evento de interacción.' },
  { id: 'elemento',    emoji: '⚡', label: 'Gran elemento',        unlocked: false },
  { id: 'experiencia', emoji: '🌍', label: 'La mejor experiencia', unlocked: false },
  { id: 'meta',        emoji: '⭐', label: 'Meta cumplida',        unlocked: false },
  { id: 'balla',       emoji: '🎱', label: 'La balla es muy baja', unlocked: false },
  { id: 'fire',        emoji: '🔥', label: 'On fire',              unlocked: false },
  { id: 'veterano',    emoji: '🏆', label: 'Todo un veterano',     unlocked: false },
]

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const { profile: authProfile, refreshProfile } = useAuth()
  const [fullProfile, setFullProfile] = useState<UsuarioPerfil | null>(null)
  const [eventosAsistidos, setEventosAsistidos] = useState(0)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [profileData, asistencias] = await Promise.all([
        getMyProfile(),
        getMyAsistencias(),
      ])
      setFullProfile(profileData)
      setEventosAsistidos(asistencias.length)
      setLoading(false)
    }
    load()
  }, [])

  if (loading || !fullProfile) {
    return (
      <div className="responsive-page">
        <h1 style={{ fontWeight: 700, fontSize: '26px', color: '#111827', marginBottom: '20px' }}>Mi Perfil</h1>
        <div className="card-frictionless" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  const p = fullProfile
  const fullName = `${p.nombres} ${p.apellidos}`
  const initials = `${p.nombres.charAt(0)}${p.apellidos.charAt(0)}`.toUpperCase()
  const cargoLabel = p.cargo?.nombre_cargo || 'Miembro'
  const areaLabel = p.area?.nombre || 'Sin área'

  // Antigüedad
  let antiguedad = '—'
  if (p.fecha_ingreso) {
    const diff = Math.floor((Date.now() - new Date(p.fecha_ingreso).getTime()) / (1000 * 60 * 60 * 24 * 30))
    antiguedad = diff > 0 ? `${diff}m` : '< 1m'
  }

  // Profile completeness
  const fields = [p.nombres, p.apellidos, p.correo, p.telefono, p.universidad, p.carrera, p.ciclo_academico, p.linkedin_url, p.instagram_url, p.foto_perfil_url]
  const filled = fields.filter(f => f && String(f).trim()).length
  const completionPct = Math.round((filled / fields.length) * 100)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await updateMyProfile(formData)
    if (result.success) {
      setSaveMsg('✅ Perfil actualizado')
      setEditing(false)
      // Refresh data
      const updated = await getMyProfile()
      if (updated) setFullProfile(updated)
      await refreshProfile()
      setTimeout(() => setSaveMsg(null), 3000)
    } else {
      setSaveMsg(`❌ ${result.error}`)
      setTimeout(() => setSaveMsg(null), 3000)
    }
  }

  return (
    <div className="responsive-page">
      {/* ── Page title ── */}
      <h1 style={{ fontWeight: 700, fontSize: '26px', color: '#111827', marginBottom: '20px' }}>Mi Perfil</h1>

      {/* Save message */}
      {saveMsg && (
        <div style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: saveMsg.startsWith('✅') ? '#DCFCE7' : '#FEE2E2', marginBottom: '16px', fontSize: '13px', fontWeight: 600, color: saveMsg.startsWith('✅') ? '#15803D' : '#991B1B' }}>
          {saveMsg}
        </div>
      )}

      {/* ── Header card ── */}
      <div className="card-frictionless" style={{ padding: '20px 24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>

          {/* Avatar initials */}
          <div style={{ flexShrink: 0, width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {p.foto_perfil_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.foto_perfil_url} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'white', fontWeight: 900, fontSize: '26px', letterSpacing: '1px' }}>{initials}</span>
            )}
          </div>

          {/* Name + tags */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{ fontWeight: 900, fontSize: '20px', color: '#111827', marginBottom: '2px', letterSpacing: '-0.01em' }}>
              {fullName.toUpperCase()}
            </p>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '10px' }}>Área de {areaLabel}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {p.carrera && (
                <span style={{ border: '1.5px solid #CC0000', color: '#CC0000', fontSize: '12px', fontWeight: 600, padding: '3px 12px', borderRadius: '999px' }}>{p.carrera}</span>
              )}
              <span style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', fontSize: '12px', fontWeight: 700, padding: '3px 12px', borderRadius: '999px' }}>{cargoLabel}</span>
              {p.es_miembro_activo && (
                <span style={{ border: '1.5px solid #16A34A', color: '#16A34A', fontSize: '12px', fontWeight: 600, padding: '3px 12px', borderRadius: '999px' }}>Member Activo</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
            <StatChip value={eventosAsistidos} label="Eventos asistidos" />
            <StatChip value={antiguedad}       label="Antigüedad" />
          </div>
        </div>
      </div>

      {/* ── Personal + Contact row ── */}
      <div className="profile-grid" style={{ marginBottom: '16px' }}>

        {/* Información personal */}
        <div className="card-frictionless" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionBadge label="INFORMACIÓN PERSONAL" />
            <button
              onClick={() => setEditing(!editing)}
              style={{ padding: '4px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: editing ? '#FEE2E2' : '#F9FAFB', color: editing ? '#B91C1C' : '#374151', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              {editing ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <EditField label="Teléfono" name="telefono" defaultValue={p.telefono || ''} />
              <EditField label="Universidad" name="universidad" defaultValue={p.universidad || ''} />
              <EditField label="Carrera" name="carrera" defaultValue={p.carrera || ''} />
              <EditField label="Ciclo académico" name="ciclo_academico" defaultValue={p.ciclo_academico || ''} />
              <EditField label="LinkedIn URL" name="linkedin_url" defaultValue={p.linkedin_url || ''} />
              <EditField label="Instagram URL" name="instagram_url" defaultValue={p.instagram_url || ''} />
              <button
                type="submit"
                style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#CC0000', color: 'white', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', marginTop: '4px' }}
              >
                Guardar cambios
              </button>
            </form>
          ) : (
            <>
              <InfoField label="Nombre Completo"    value={fullName} />
              <InfoField label="Universidad"        value={p.universidad || '—'} />
              <InfoField label="Carrera"            value={p.carrera || '—'} />
              <InfoField label="Ciclo académico"    value={p.ciclo_academico || '—'} />
            </>
          )}
        </div>

        {/* Contacto y Redes */}
        <div className="card-frictionless" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SectionBadge label="CONTACTO Y REDES" />

          <InfoField label="Correo" value={p.correo} />
          {p.telefono && <InfoField label="Teléfono" value={p.telefono} />}

          <div>
            <p style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '10px' }}>Redes sociales</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {p.linkedin_url && (
                <a href={p.linkedin_url.startsWith('http') ? p.linkedin_url : `https://linkedin.com/in/${p.linkedin_url}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '2px solid #0A66C2', color: '#0A66C2', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {p.instagram_url && (
                <a href={p.instagram_url.startsWith('http') ? p.instagram_url : `https://instagram.com/${p.instagram_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '2px solid #E1306C', color: '#E1306C', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E1306C">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              )}
              {!p.linkedin_url && !p.instagram_url && (
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Sin redes configuradas. Edita tu perfil para agregar.</p>
              )}
            </div>
          </div>

          {/* AIESEC progress */}
          <div>
            <p style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '12px' }}>Progreso en AIESEC</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <CircularProgress pct={completionPct} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>Perfil completado</p>
                <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                  {completionPct < 100 ? 'Completa tus datos para llegar al 100%' : '¡Perfil completo!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Logros + Actividad ── */}
      <div className="profile-grid" style={{ marginBottom: '24px' }}>

        {/* Logros */}
        <div className="card-frictionless" style={{ padding: '20px 24px' }}>
          <SectionBadge label="LOGROS" />
          <div className="achievements-grid">
            {DEFAULT_ACHIEVEMENTS.map(a => <AchievementCard key={a.id} a={a} />)}
          </div>
        </div>

        {/* Actividad */}
        <div className="card-frictionless" style={{ padding: '20px 24px' }}>
          <SectionBadge label="ACTIVIDAD RECIENTE" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>Eventos asistidos</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{eventosAsistidos} evento(s) registrado(s)</p>
            </div>
            <div style={{ height: '1px', backgroundColor: '#F3F4F6' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>Miembro desde</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{p.fecha_ingreso || 'Sin fecha de ingreso'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Edit field helper ────────────────────────────────────────────────────────

function EditField({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontWeight: 600, fontSize: '12px', color: '#374151', marginBottom: '4px' }}>{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '10px',
          border: '1.5px solid #D1D5DB',
          fontSize: '13px',
          outline: 'none',
          backgroundColor: '#FAFAFA',
        }}
        onFocus={e => { e.target.style.borderColor = '#CC0000'; e.target.style.boxShadow = '0 0 0 3px rgba(204,0,0,0.1)' }}
        onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none' }}
      />
    </div>
  )
}
