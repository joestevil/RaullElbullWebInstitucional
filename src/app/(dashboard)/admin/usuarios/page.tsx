'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, X, Users, UserX, Search, ShieldCheck } from 'lucide-react'
import { usePermissions } from '@/hooks/usePermissions'
import { editarUsuario, desactivarUsuario, getUsuariosAdmin, getAreas, getCargos } from '@/app/actions/admin'
import type { AreaOption, CargoOption } from '@/app/actions/admin'
import { colorNivel, etiquetaNivel } from '@/utils/permissions'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface UsuarioAdmin {
  id_usuario: number; nombres: string; apellidos: string; correo: string
  telefono: string | null; universidad: string | null; carrera: string | null
  ciclo_academico: string | null; es_miembro_activo: boolean; foto_perfil_url: string | null
  id_area: number | null; id_cargo: number | null
  area: { nombre: string } | null
  cargo: { nombre_cargo: string; nivel_jerarquia: number } | null
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function UsuarioModal({
  usuario, areas, cargos, onClose, onSaved,
}: {
  usuario: UsuarioAdmin; areas: AreaOption[]; cargos: CargoOption[]
  onClose: () => void; onSaved: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await editarUsuario(usuario.id_usuario, fd)
    if (result.error) { setError(result.error); setLoading(false) }
    else { onSaved(); onClose() }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 800, fontSize: '18px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#CC0000" />
            Editar Usuario
          </h2>
          <button onClick={onClose} style={closeBtnStyle}><X size={16} /></button>
        </div>

        {error && <div style={errorStyle}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Nombres" name="nombres" defaultValue={usuario.nombres} />
            <Field label="Apellidos" name="apellidos" defaultValue={usuario.apellidos} />
          </div>
          <Field label="Correo" name="correo" type="email" defaultValue={usuario.correo} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Teléfono" name="telefono" defaultValue={usuario.telefono ?? ''} />
            <Field label="Universidad" name="universidad" defaultValue={usuario.universidad ?? ''} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Carrera" name="carrera" defaultValue={usuario.carrera ?? ''} />
            <Field label="Ciclo académico" name="ciclo_academico" defaultValue={usuario.ciclo_academico ?? ''} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Área</label>
              <select name="id_area" defaultValue={usuario.id_area ?? ''} style={inputStyle}>
                <option value="">Sin área</option>
                {areas.map(a => <option key={a.id_area} value={a.id_area}>{a.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Cargo</label>
              <select name="id_cargo" defaultValue={usuario.id_cargo ?? ''} style={inputStyle}>
                <option value="">Sin cargo</option>
                {cargos.map(c => <option key={c.id_cargo} value={c.id_cargo}>{c.nombre_cargo} (Nivel {c.nivel_jerarquia})</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Estado</label>
            <select name="es_miembro_activo" defaultValue={String(usuario.es_miembro_activo)} style={inputStyle}>
              <option value="true">Miembro Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminUsuariosPage() {
  const perms = usePermissions()
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [areas, setAreas] = useState<AreaOption[]>([])
  const [cargos, setCargos] = useState<CargoOption[]>([])
  const [loading, setLoading] = useState(true)
  const [editUser, setEditUser] = useState<UsuarioAdmin | null>(null)
  const [search, setSearch] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [deactivateId, setDeactivateId] = useState<number | null>(null)

  const didLoad = useRef(false)

  useEffect(() => {
    if (didLoad.current) return
    didLoad.current = true
    loadData()
  }, [])

  async function loadData() {
    const [us, ar, ca] = await Promise.all([getUsuariosAdmin(), getAreas(), getCargos()])
    setUsuarios(us as unknown as UsuarioAdmin[])
    setAreas(ar); setCargos(ca)
    setLoading(false)
  }

  const handleDeactivate = async (id: number) => {
    const result = await desactivarUsuario(id)
    if (result.error) alert(result.error)
    else { setDeactivateId(null); loadData() }
  }

  // Filtrado
  const filtered = usuarios.filter(u => {
    const matchSearch = `${u.nombres} ${u.apellidos} ${u.correo}`.toLowerCase().includes(search.toLowerCase())
    const matchArea = !filterArea || String(u.id_area) === filterArea
    return matchSearch && matchArea
  })

  const activos = filtered.filter(u => u.es_miembro_activo)
  const inactivos = filtered.filter(u => !u.es_miembro_activo)

  if (!perms.puedeCrud('usuarios')) return null

  return (
    <div className="responsive-page">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '30px', color: '#111827', letterSpacing: '-0.03em' }}>
          Gestionar Usuarios
        </h1>
        <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>
          Asignar áreas, cargos y permisos a los miembros del comité
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: usuarios.length, color: '#6366F1' },
          { label: 'Activos', value: usuarios.filter(u => u.es_miembro_activo).length, color: '#22C55E' },
          { label: 'Inactivos', value: usuarios.filter(u => !u.es_miembro_activo).length, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="card-frictionless" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '120px' }}>
            <div style={{ width: '8px', height: '36px', borderRadius: '4px', backgroundColor: s.color }} />
            <div>
              <p style={{ fontWeight: 900, fontSize: '22px', color: '#111827', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: '#6B7280' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-frictionless" style={{ padding: '14px 18px', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o correo..."
            style={{ ...inputStyle, paddingLeft: '34px' }} />
        </div>
        <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: '150px' }}>
          <option value="">Todas las áreas</option>
          {areas.map(a => <option key={a.id_area} value={a.id_area}>{a.nombre}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card-frictionless" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Cargando usuarios...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1.5px solid #E5E7EB' }}>
                  <th style={thStyle}>Miembro</th>
                  <th style={thStyle}>Área</th>
                  <th style={thStyle}>Cargo</th>
                  <th style={thStyle}>Nivel</th>
                  <th style={thStyle}>Estado</th>
                  <th style={{ ...thStyle, textAlign: 'center', width: '100px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {[...activos, ...inactivos].map(u => {
                  const nivel = u.cargo?.nivel_jerarquia ?? 4
                  const nColor = colorNivel(nivel)
                  const initials = `${u.nombres.charAt(0)}${u.apellidos.charAt(0)}`.toUpperCase()

                  return (
                    <tr key={u.id_usuario} style={{ borderBottom: '1px solid #F3F4F6', opacity: u.es_miembro_activo ? 1 : 0.5 }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 800, color: '#CC0000' }}>
                            {initials}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: '#111827' }}>{u.nombres} {u.apellidos}</p>
                            <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{u.correo}</p>
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}><span style={{ color: '#6B7280' }}>{u.area?.nombre || '—'}</span></td>
                      <td style={tdStyle}><span style={{ color: '#374151', fontWeight: 500 }}>{u.cargo?.nombre_cargo || '—'}</span></td>
                      <td style={tdStyle}>
                        <span style={{ backgroundColor: nColor.bg, color: nColor.text, padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>
                          {etiquetaNivel(nivel)}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: u.es_miembro_activo ? '#22C55E' : '#EF4444', display: 'inline-block', marginRight: '6px' }} />
                        <span style={{ fontSize: '12px', color: u.es_miembro_activo ? '#15803D' : '#991B1B' }}>
                          {u.es_miembro_activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                          <button onClick={() => setEditUser(u)} style={iconBtnStyle('#3B82F6')} title="Editar">
                            <Pencil size={14} />
                          </button>
                          {u.es_miembro_activo && perms.puede('usuarios', 'eliminar') && (
                            deactivateId === u.id_usuario ? (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => handleDeactivate(u.id_usuario)} style={iconBtnStyle('#EF4444')} title="Confirmar">✓</button>
                                <button onClick={() => setDeactivateId(null)} style={iconBtnStyle('#6B7280')} title="Cancelar">✕</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeactivateId(u.id_usuario)} style={iconBtnStyle('#EF4444')} title="Desactivar">
                                <UserX size={14} />
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

      {/* Leyenda de niveles */}
      <div className="card-frictionless" style={{ padding: '16px 20px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldCheck size={16} color="#CC0000" />
          <h3 style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>Niveles de Jerarquía</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[0, 1, 2, 3, 4, 5].map(n => {
            const c = colorNivel(n)
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <span style={{ backgroundColor: c.bg, color: c.text, padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>{n}</span>
                <span style={{ fontSize: '11px', color: '#374151' }}>{etiquetaNivel(n)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <UsuarioModal usuario={editUser} areas={areas} cargos={cargos}
          onClose={() => setEditUser(null)} onSaved={loadData} />
      )}
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function Field({ label, name, type = 'text', defaultValue, placeholder }: {
  label: string; name: string; type?: string; defaultValue?: string; placeholder?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input name={name} type={type} defaultValue={defaultValue ?? ''} placeholder={placeholder} style={inputStyle}
        onFocus={e => { e.target.style.borderColor = '#CC0000'; e.target.style.boxShadow = '0 0 0 3px rgba(204,0,0,0.08)' }}
        onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none' }} />
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: '12px', color: '#374151', marginBottom: '4px' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #D1D5DB', fontSize: '13px', outline: 'none', backgroundColor: '#FAFAFA', transition: 'border-color 0.2s, box-shadow 0.2s' }
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', fontWeight: 700, fontSize: '11px', color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' as const }
const tdStyle: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }
const submitBtnStyle = (loading: boolean): React.CSSProperties => ({ width: '100%', padding: '11px', borderRadius: '10px', backgroundColor: loading ? '#E5A0A0' : '#CC0000', color: 'white', fontWeight: 700, fontSize: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' })
const closeBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }
const iconBtnStyle = (color: string): React.CSSProperties => ({ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: `${color}12`, border: `1px solid ${color}30`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color, transition: 'background 0.15s' })
const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(4px)' }
const modalStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }
const errorStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: '#991B1B', fontWeight: 500 }
