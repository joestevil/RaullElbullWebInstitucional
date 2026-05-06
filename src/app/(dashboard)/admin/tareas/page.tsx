'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, ListTodo, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { usePermissions } from '@/hooks/usePermissions'
import { getTareas, crearTarea, editarTarea, eliminarTarea } from '@/app/actions/admin'
import { getDirectorio } from '@/app/actions/data'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface TareaDB {
  id_tarea: number; titulo: string; descripcion: string | null
  estado: string | null; fecha_limite: string | null
  id_usuario_asignado: number | null
  usuario: { id_usuario: number; nombres: string; apellidos: string } | null
}

interface MiembroOption { id_usuario: number; nombres: string; apellidos: string }

const ESTADOS = ['Pendiente', 'En progreso', 'Completada', 'Cancelada']
const ESTADO_STYLES: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  'Pendiente':     { bg: '#FEF3C7', text: '#92400E', icon: Clock },
  'En progreso':   { bg: '#DBEAFE', text: '#1E40AF', icon: AlertCircle },
  'Completada':    { bg: '#DCFCE7', text: '#15803D', icon: CheckCircle2 },
  'Cancelada':     { bg: '#F3F4F6', text: '#6B7280', icon: X },
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function TareaModal({
  tarea, miembros, onClose, onSaved,
}: {
  tarea?: TareaDB | null; miembros: MiembroOption[]
  onClose: () => void; onSaved: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!tarea

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const fd = new FormData(e.currentTarget)
    const result = isEdit ? await editarTarea(tarea!.id_tarea, fd) : await crearTarea(fd)
    if (result.error) { setError(result.error); setLoading(false) }
    else { onSaved(); onClose() }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 800, fontSize: '18px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ListTodo size={20} color="#CC0000" />
            {isEdit ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button onClick={onClose} style={closeBtnStyle}><X size={16} /></button>
        </div>

        {error && <div style={errorStyle}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field label="Título *" name="titulo" defaultValue={tarea?.titulo} required />
          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea name="descripcion" defaultValue={tarea?.descripcion ?? ''} rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              onFocus={e => { e.target.style.borderColor = '#CC0000'; e.target.style.boxShadow = '0 0 0 3px rgba(204,0,0,0.08)' }}
              onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Estado</label>
              <select name="estado" defaultValue={tarea?.estado ?? 'Pendiente'} style={inputStyle}>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <Field label="Fecha límite" name="fecha_limite" type="datetime-local"
              defaultValue={tarea?.fecha_limite ? new Date(tarea.fecha_limite).toISOString().slice(0, 16) : ''} />
          </div>
          <div>
            <label style={labelStyle}>Asignar a</label>
            <select name="id_usuario_asignado" defaultValue={tarea?.id_usuario_asignado ?? ''} style={inputStyle}>
              <option value="">Sin asignar</option>
              {miembros.map(m => <option key={m.id_usuario} value={m.id_usuario}>{m.nombres} {m.apellidos}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear tarea'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminTareasPage() {
  const perms = usePermissions()
  const router = useRouter()
  const [tareas, setTareas] = useState<TareaDB[]>([])
  const [miembros, setMiembros] = useState<MiembroOption[]>([])
  const [loading, setLoading] = useState(true)
  const [modalTarea, setModalTarea] = useState<TareaDB | null | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [filterEstado, setFilterEstado] = useState('')

  const didLoad = useRef(false)

  useEffect(() => {
    if (didLoad.current) return
    didLoad.current = true
    loadData()
  }, [])

  async function loadData() {
    const [tareasData, miembrosData] = await Promise.all([getTareas(), getDirectorio()])
    setTareas(tareasData as unknown as TareaDB[])
    setMiembros(miembrosData.map(m => ({ id_usuario: m.id_usuario, nombres: m.nombres, apellidos: m.apellidos })))
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    const result = await eliminarTarea(id)
    if (result.error) alert(result.error)
    else { setDeleteId(null); loadData() }
  }

  const filtered = filterEstado ? tareas.filter(t => t.estado === filterEstado) : tareas

  // Stats
  const totalTareas = tareas.length
  const completadas = tareas.filter(t => t.estado === 'Completada').length
  const pendientes = tareas.filter(t => t.estado === 'Pendiente').length
  const enProgreso = tareas.filter(t => t.estado === 'En progreso').length

  if (!perms.puedeCrud('tareas')) return null

  return (
    <div className="responsive-page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: '30px', color: '#111827', letterSpacing: '-0.03em' }}>Gestionar Tareas</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>Crear, asignar y gestionar tareas del equipo</p>
        </div>
        {perms.puede('tareas', 'crear') && (
          <button onClick={() => setModalTarea(null)} style={primaryBtnStyle}>
            <Plus size={16} /> Nueva Tarea
          </button>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: totalTareas, color: '#6366F1', emoji: '📋' },
          { label: 'Pendientes', value: pendientes, color: '#F59E0B', emoji: '⏳' },
          { label: 'En progreso', value: enProgreso, color: '#3B82F6', emoji: '🔄' },
          { label: 'Completadas', value: completadas, color: '#22C55E', emoji: '✅' },
        ].map(s => (
          <div key={s.label} className="card-frictionless" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 140px', minWidth: '130px' }}>
            <span style={{ fontSize: '22px' }}>{s.emoji}</span>
            <div>
              <p style={{ fontWeight: 900, fontSize: '22px', color: '#111827', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: '#6B7280' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card-frictionless" style={{ padding: '12px 18px', marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => setFilterEstado('')} style={filterBtnStyle(!filterEstado)}>Todas</button>
        {ESTADOS.map(e => (
          <button key={e} onClick={() => setFilterEstado(e)} style={filterBtnStyle(filterEstado === e)}>{e}</button>
        ))}
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="card-frictionless" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Cargando tareas...</div>
      ) : filtered.length === 0 ? (
        <div className="card-frictionless" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>No hay tareas {filterEstado ? `con estado "${filterEstado}"` : 'creadas aún'}.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {filtered.map(t => {
            const st = ESTADO_STYLES[t.estado ?? 'Pendiente'] || ESTADO_STYLES['Pendiente']
            const IconComp = st.icon
            const isOverdue = t.fecha_limite && new Date(t.fecha_limite) < new Date() && t.estado !== 'Completada' && t.estado !== 'Cancelada'

            return (
              <div key={t.id_tarea} className="card-frictionless" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: `4px solid ${st.text}`, position: 'relative' }}>
                {/* Estado badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ backgroundColor: st.bg, color: st.text, padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconComp size={12} /> {t.estado}
                  </span>
                  {isOverdue && (
                    <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>⏰ Vencida</span>
                  )}
                </div>

                {/* Title + desc */}
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#111827', lineHeight: 1.3 }}>{t.titulo}</h3>
                {t.descripcion && <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.descripcion}</p>}

                {/* Assignee + Date */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #F3F4F6' }}>
                  <div>
                    {t.usuario ? (
                      <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>👤 {t.usuario.nombres} {t.usuario.apellidos}</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>Sin asignar</span>
                    )}
                  </div>
                  {t.fecha_limite && (
                    <span style={{ fontSize: '11px', color: isOverdue ? '#991B1B' : '#6B7280', fontWeight: 500 }}>
                      📅 {new Date(t.fecha_limite).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  {perms.puede('tareas', 'editar') && (
                    <button onClick={() => setModalTarea(t)} style={{ ...iconBtnStyle('#3B82F6'), flex: 1, borderRadius: '8px', fontSize: '11px', gap: '4px' }}>
                      <Pencil size={12} /> Editar
                    </button>
                  )}
                  {perms.puede('tareas', 'eliminar') && (
                    deleteId === t.id_tarea ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleDelete(t.id_tarea)} style={iconBtnStyle('#EF4444')}>✓</button>
                        <button onClick={() => setDeleteId(null)} style={iconBtnStyle('#6B7280')}>✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(t.id_tarea)} style={iconBtnStyle('#EF4444')}>
                        <Trash2 size={12} />
                      </button>
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalTarea !== undefined && (
        <TareaModal tarea={modalTarea} miembros={miembros}
          onClose={() => setModalTarea(undefined)} onSaved={loadData} />
      )}
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────────────────────

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



const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: '12px', color: '#374151', marginBottom: '4px' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #D1D5DB', fontSize: '13px', outline: 'none', backgroundColor: '#FAFAFA', transition: 'border-color 0.2s, box-shadow 0.2s' }
const primaryBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '12px', backgroundColor: '#CC0000', color: 'white', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(204,0,0,0.25)' }
const submitBtnStyle = (loading: boolean): React.CSSProperties => ({ width: '100%', padding: '11px', borderRadius: '10px', backgroundColor: loading ? '#E5A0A0' : '#CC0000', color: 'white', fontWeight: 700, fontSize: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' })
const closeBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }
const iconBtnStyle = (color: string): React.CSSProperties => ({ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: `${color}12`, border: `1px solid ${color}30`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color, transition: 'background 0.15s' })
const filterBtnStyle = (active: boolean): React.CSSProperties => ({ padding: '6px 14px', borderRadius: '999px', border: active ? '1.5px solid #CC0000' : '1.5px solid #E5E7EB', backgroundColor: active ? '#FEE2E2' : 'white', color: active ? '#CC0000' : '#6B7280', fontWeight: 600, fontSize: '12px', cursor: 'pointer' })
const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(4px)' }
const modalStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }
const errorStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: '#991B1B', fontWeight: 500 }
