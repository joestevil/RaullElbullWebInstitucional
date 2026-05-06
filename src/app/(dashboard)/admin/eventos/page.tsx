'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, CalendarPlus, Clock, MapPin } from 'lucide-react'
import { usePermissions } from '@/hooks/usePermissions'
import { getEventos } from '@/app/actions/data'
import { crearEvento, editarEvento, eliminarEvento, getAreas } from '@/app/actions/admin'
import type { EventoDB } from '@/app/actions/data'
import type { AreaOption } from '@/app/actions/admin'

// ─── Modal de formulario ──────────────────────────────────────────────────────

function EventoModal({
  evento,
  areas,
  onClose,
  onSaved,
}: {
  evento?: EventoDB | null
  areas: AreaOption[]
  onClose: () => void
  onSaved: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!evento

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = isEdit ? await editarEvento(evento!.id_evento, fd) : await crearEvento(fd)
    if (result.error) { setError(result.error); setLoading(false) }
    else { onSaved(); onClose() }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 800, fontSize: '18px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarPlus size={20} color="#CC0000" />
            {isEdit ? 'Editar Evento' : 'Crear Evento'}
          </h2>
          <button onClick={onClose} style={closeBtnStyle}><X size={16} /></button>
        </div>

        {error && <div style={errorStyle}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field label="Título *" name="titulo" defaultValue={evento?.titulo} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Fecha inicio *" name="fecha_hora_inicio" type="datetime-local"
              defaultValue={evento?.fecha_hora_inicio ? new Date(evento.fecha_hora_inicio).toISOString().slice(0, 16) : ''} required />
            <Field label="Fecha fin" name="fecha_hora_fin" type="datetime-local"
              defaultValue={evento?.fecha_hora_fin ? new Date(evento.fecha_hora_fin).toISOString().slice(0, 16) : ''} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Lugar" name="lugar" defaultValue={evento?.lugar ?? ''} placeholder="Ej: Oficina 3B" />
            <SelectField label="Modalidad" name="modalidad" defaultValue={evento?.modalidad ?? ''} options={['Virtual', 'Presencial', 'Híbrido']} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <SelectField label="Tipo de evento" name="tipo_evento" defaultValue={evento?.tipo_evento ?? ''} options={['LEC', 'LCM', 'ITM', 'TEAM DAY', 'REUNIÓN DE ÁREA']} />
            <div>
              <label style={labelStyle}>Área</label>
              <select name="id_area" defaultValue={evento?.id_area ?? ''} style={inputStyle}>
                <option value="">Sin área</option>
                {areas.map(a => <option key={a.id_area} value={a.id_area}>{a.nombre}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear evento'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminEventosPage() {
  const perms = usePermissions()
  const router = useRouter()
  const [eventos, setEventos] = useState<EventoDB[]>([])
  const [areas, setAreas] = useState<AreaOption[]>([])
  const [loading, setLoading] = useState(true)
  const [modalEvento, setModalEvento] = useState<EventoDB | null | undefined>(undefined) // undefined = cerrado, null = nuevo
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const didLoad = useRef(false)

  useEffect(() => {
    if (didLoad.current) return
    didLoad.current = true
    loadData()
  }, [])

  async function loadData() {
    const [ev, ar] = await Promise.all([getEventos(), getAreas()])
    setEventos(ev)
    setAreas(ar)
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    const result = await eliminarEvento(id)
    if (result.error) alert(result.error)
    else { setDeleteId(null); loadData() }
  }

  if (!perms.puedeCrud('eventos')) return null

  return (
    <div className="responsive-page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: '30px', color: '#111827', letterSpacing: '-0.03em' }}>
            Gestionar Eventos
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>Crear, editar y eliminar eventos del comité</p>
        </div>
        {perms.puede('eventos', 'crear') && (
          <button onClick={() => setModalEvento(null)} style={primaryBtnStyle}>
            <Plus size={16} /> Nuevo Evento
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card-frictionless" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Cargando eventos...</div>
        ) : eventos.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>No hay eventos creados aún.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1.5px solid #E5E7EB' }}>
                  <th style={thStyle}>Título</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Modalidad</th>
                  <th style={thStyle}>Lugar</th>
                  <th style={thStyle}>Área</th>
                  <th style={{ ...thStyle, textAlign: 'center', width: '100px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map(ev => {
                  const date = new Date(ev.fecha_hora_inicio)
                  const dateStr = date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
                  const timeStr = date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true })

                  return (
                    <tr key={ev.id_evento} style={{ borderBottom: '1px solid #F3F4F6' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 600, color: '#111827' }}>{ev.titulo}</span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4B5563' }}>
                          <Clock size={12} color="#9CA3AF" />
                          {dateStr} · {timeStr}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        {ev.tipo_evento && <span style={chipStyle}>{ev.tipo_evento}</span>}
                      </td>
                      <td style={tdStyle}>
                        {ev.modalidad && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280' }}><MapPin size={12} />{ev.modalidad}</span>}
                      </td>
                      <td style={tdStyle}><span style={{ color: '#6B7280' }}>{ev.lugar || '—'}</span></td>
                      <td style={tdStyle}><span style={{ color: '#6B7280' }}>{ev.area?.nombre || '—'}</span></td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                          {perms.puede('eventos', 'editar') && (
                            <button onClick={() => setModalEvento(ev)} style={iconBtnStyle('#3B82F6')} title="Editar">
                              <Pencil size={14} />
                            </button>
                          )}
                          {perms.puede('eventos', 'eliminar') && (
                            deleteId === ev.id_evento ? (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => handleDelete(ev.id_evento)} style={iconBtnStyle('#EF4444')} title="Confirmar">✓</button>
                                <button onClick={() => setDeleteId(null)} style={iconBtnStyle('#6B7280')} title="Cancelar">✕</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteId(ev.id_evento)} style={iconBtnStyle('#EF4444')} title="Eliminar">
                                <Trash2 size={14} />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalEvento !== undefined && (
        <EventoModal
          evento={modalEvento}
          areas={areas}
          onClose={() => setModalEvento(undefined)}
          onSaved={loadData}
        />
      )}
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Field({ label, name, type = 'text', defaultValue, required, placeholder }: {
  label: string; name: string; type?: string; defaultValue?: string | null; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input name={name} type={type} defaultValue={defaultValue ?? ''} required={required} placeholder={placeholder} style={inputStyle}
        onFocus={e => { e.target.style.borderColor = '#CC0000'; e.target.style.boxShadow = '0 0 0 3px rgba(204,0,0,0.08)' }}
        onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none' }} />
    </div>
  )
}

function SelectField({ label, name, defaultValue, options }: {
  label: string; name: string; defaultValue?: string; options: string[]
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select name={name} defaultValue={defaultValue} style={inputStyle}>
        <option value="">Seleccionar...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: '12px', color: '#374151', marginBottom: '4px' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #D1D5DB', fontSize: '13px', outline: 'none', backgroundColor: '#FAFAFA', transition: 'border-color 0.2s, box-shadow 0.2s' }

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', fontWeight: 700, fontSize: '11px', color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' as const }
const tdStyle: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }
const chipStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', color: '#991B1B', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }

const primaryBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '12px', backgroundColor: '#CC0000', color: 'white', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(204,0,0,0.25)' }
const submitBtnStyle = (loading: boolean): React.CSSProperties => ({ width: '100%', padding: '11px', borderRadius: '10px', backgroundColor: loading ? '#E5A0A0' : '#CC0000', color: 'white', fontWeight: 700, fontSize: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' })
const closeBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }
const iconBtnStyle = (color: string): React.CSSProperties => ({ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: `${color}12`, border: `1px solid ${color}30`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color, transition: 'background 0.15s' })

const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(4px)' }
const modalStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }
const errorStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: '#991B1B', fontWeight: 500 }
