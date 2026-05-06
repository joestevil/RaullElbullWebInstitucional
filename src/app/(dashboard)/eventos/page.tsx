'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin, Eye, CalendarDays } from 'lucide-react'
import { getEventos, getMyAsistencias, registrarAsistencia } from '@/app/actions/data'
import type { EventoDB, AsistenciaDB } from '@/app/actions/data'

// ─── Constantes ──────────────────────────────────────────────────────────────

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS   = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'LEC':            { bg: '#FEE2E2', text: '#991B1B' },
  'TEAM DAY':       { bg: '#EDE9FE', text: '#5B21B6' },
  'LCM':            { bg: '#DBEAFE', text: '#1E40AF' },
  'REUNIÓN DE ÁREA':{ bg: '#FEF3C7', text: '#92400E' },
  'ITM':            { bg: '#D1FAE5', text: '#065F46' },
}

// ─── Calendar helpers ────────────────────────────────────────────────────────

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const prevDays  = new Date(year, month, 0).getDate()
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1)

  const cells: { day: number; month: 'prev' | 'curr' | 'next' }[] = []
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: prevDays - i, month: 'prev' })
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d, month: 'curr' })
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, month: 'next' })
  return cells
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] || { bg: '#F3F4F6', text: '#374151' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: c.bg, color: c.text, fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
      {type}
    </span>
  )
}

function TodayCard({ event, isRegistered, onRegister }: { event: EventoDB; isRegistered: boolean; onRegister: () => void }) {
  const date = new Date(event.fecha_hora_inicio)
  const time = date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true })

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1.5px solid #E5E7EB', padding: '14px 16px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: '15px', color: '#111827', marginBottom: '6px' }}>{event.titulo}</p>
          {event.tipo_evento && <TypeBadge type={event.tipo_evento} />}
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563', fontSize: '13px' }}>
              <Clock size={13} color="#9CA3AF" />
              {time}
            </div>
            {event.lugar && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563', fontSize: '13px' }}>
                <MapPin size={13} color="#9CA3AF" />
                {event.lugar}
              </div>
            )}
          </div>
        </div>
        {isRegistered && (
          <div style={{ flexShrink: 0, border: '2px solid #16A34A', borderRadius: '8px', padding: '4px 8px', textAlign: 'center', opacity: 0.85 }}>
            <p style={{ color: '#16A34A', fontWeight: 700, fontSize: '10px' }}>Inscrito ✓</p>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F3F4F6' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#374151' }}>
          <Eye size={13} />
          Ver Detalles
        </button>
        {!isRegistered ? (
          <button
            onClick={onRegister}
            style={{ padding: '6px 14px', borderRadius: '999px', backgroundColor: '#FEE2E2', color: '#B91C1C', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
          >
            Marcar Asistencia
          </button>
        ) : (
          <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
            Confirmada
          </span>
        )}
      </div>
    </div>
  )
}

function UpcomingCard({ event, isRegistered, onRegister }: { event: EventoDB; isRegistered: boolean; onRegister: () => void }) {
  const date = new Date(event.fecha_hora_inicio)
  const monthAbbr = MONTHS[date.getMonth()].slice(0, 3)
  const time = date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '36px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{monthAbbr}</span>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A1A', lineHeight: 1 }}>{date.getDate()}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#111827' }}>{event.titulo}</span>
          {event.tipo_evento && <TypeBadge type={event.tipo_evento} />}
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#6B7280' }}>
            <CalendarDays size={11} color="#9CA3AF" />{time}
          </span>
          {event.lugar && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#6B7280' }}>
              <MapPin size={11} color="#9CA3AF" />{event.lugar}
            </span>
          )}
        </div>
      </div>
      {!isRegistered ? (
        <button
          onClick={onRegister}
          style={{ flexShrink: 0, padding: '6px 10px', borderRadius: '8px', backgroundColor: '#FEE2E2', border: '1px solid #FECACA', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600, color: '#B91C1C', whiteSpace: 'nowrap' }}
        >
          Marcar Asistencia
        </button>
      ) : (
        <span style={{ flexShrink: 0, padding: '6px 10px', borderRadius: '8px', backgroundColor: '#DCFCE7', fontSize: '11.5px', fontWeight: 700, color: '#15803D', whiteSpace: 'nowrap' }}>
          Inscrito ✓
        </span>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventosPage() {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [eventos, setEventos] = useState<EventoDB[]>([])
  const [asistencias, setAsistencias] = useState<AsistenciaDB[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [eventosData, asistenciasData] = await Promise.all([
        getEventos(),
        getMyAsistencias(),
      ])
      setEventos(eventosData)
      setAsistencias(asistenciasData)
      setLoading(false)
    }
    loadData()
  }, [])

  const cells = getCalendarDays(viewYear, viewMonth)

  const isRegisteredForEvent = (idEvento: number) =>
    asistencias.some(a => a.id_evento === idEvento)

  const handleRegister = async (idEvento: number) => {
    const result = await registrarAsistencia(idEvento)
    if (result.success) {
      // Refresh asistencias
      const updated = await getMyAsistencias()
      setAsistencias(updated)
    } else if (result.error) {
      alert(result.error)
    }
  }

  // Eventos del mes actual
  const eventosDelMes = eventos.filter(e => {
    const d = new Date(e.fecha_hora_inicio)
    return d.getMonth() === viewMonth && d.getFullYear() === viewYear
  })

  // Evento de hoy
  const todayEvent = eventosDelMes.find(e => {
    const d = new Date(e.fecha_hora_inicio)
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  }) ?? eventosDelMes[0]

  // Próximos eventos
  const upcomingEvents = eventosDelMes
    .filter(e => new Date(e.fecha_hora_inicio) > today)
    .sort((a, b) => new Date(a.fecha_hora_inicio).getTime() - new Date(b.fecha_hora_inicio).getTime())
    .slice(0, 4)

  // Eventos en un día del calendario
  const eventsOnDay = (day: number) =>
    eventosDelMes.filter(e => new Date(e.fecha_hora_inicio).getDate() === day)

  // Colores de dots para el calendario
  const DOT_COLORS = ['#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4']

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="responsive-page" style={{ minHeight: '100%' }}>
      <h1 style={{ fontWeight: 900, fontSize: '36px', color: '#111827', marginBottom: '24px', letterSpacing: '-0.03em' }}>
        EVENTOS
      </h1>

      {loading ? (
        <div className="card-frictionless" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Cargando eventos...</p>
        </div>
      ) : (
        <div className="events-layout">

          {/* ── Left: Calendar ── */}
          <div className="card-frictionless" style={{ padding: '20px 24px', minWidth: 0 }}>
            <h2 style={{ fontWeight: 700, fontSize: '18px', color: '#111827', marginBottom: '16px' }}>
              Calendario del Mes
            </h2>

            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <button onClick={prevMonth} style={navBtnStyle}>
                <ChevronLeft size={14} /> Anterior
              </button>
              <span style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A1A' }}>
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button onClick={nextMonth} style={{ ...navBtnStyle, backgroundColor: '#CC0000', color: 'white', borderColor: '#CC0000' }}>
                Siguiente <ChevronRight size={14} />
              </button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#9CA3AF', padding: '4px 0' }}>{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {cells.map((cell, i) => {
                const isCurr  = cell.month === 'curr'
                const isToday = isCurr && cell.day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
                const dots    = isCurr ? eventsOnDay(cell.day) : []

                return (
                  <div key={i} style={{
                    display:        'flex',
                    flexDirection:  'column',
                    alignItems:     'center',
                    padding:        '6px 2px',
                    borderRadius:   '10px',
                    backgroundColor: isToday ? '#CC0000' : 'transparent',
                    cursor:          isCurr ? 'pointer' : 'default',
                    position:        'relative',
                    minHeight:       '48px',
                  }}>
                    {isToday && (
                      <span style={{ position: 'absolute', top: '-2px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#7F0000', color: 'white', fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', letterSpacing: '0.05em' }}>Hoy</span>
                    )}
                    <span style={{
                      fontSize:   '13px',
                      fontWeight: isToday ? 700 : 400,
                      color:      isToday ? 'white' : isCurr ? '#1A1A1A' : '#D1D5DB',
                      marginTop:  isToday ? '8px' : '2px',
                    }}>
                      {cell.day}
                    </span>
                    <div style={{ display: 'flex', gap: '2px', marginTop: '3px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {dots.slice(0, 3).map((_, di) => (
                        <span key={di} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isToday ? 'rgba(255,255,255,0.8)' : DOT_COLORS[di % DOT_COLORS.length] }} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Right: Today + Upcoming ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>

            {/* Today's event */}
            <div className="card-frictionless" style={{ padding: '16px 20px' }}>
              <h2 style={{ fontWeight: 800, fontSize: '15px', color: '#111827', marginBottom: '12px', letterSpacing: '-0.01em' }}>
                EVENTO DE HOY{' '}
                <span style={{ color: '#CC0000' }}>
                  ({today.getDate()} {MONTHS[today.getMonth()]})
                </span>
              </h2>
              {todayEvent ? (
                <TodayCard
                  event={todayEvent}
                  isRegistered={isRegisteredForEvent(todayEvent.id_evento)}
                  onRegister={() => handleRegister(todayEvent.id_evento)}
                />
              ) : (
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>No hay eventos programados para hoy.</p>
              )}
            </div>

            {/* Upcoming events */}
            <div className="card-frictionless" style={{ padding: '16px 20px' }}>
              <h2 style={{ fontWeight: 800, fontSize: '14px', color: '#111827', marginBottom: '12px', letterSpacing: '0.01em' }}>
                PRÓXIMOS EVENTOS{' '}
                <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: '12px' }}>(Resto del Mes)</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcomingEvents.length > 0
                  ? upcomingEvents.map(e => (
                      <UpcomingCard
                        key={e.id_evento}
                        event={e}
                        isRegistered={isRegisteredForEvent(e.id_evento)}
                        onRegister={() => handleRegister(e.id_evento)}
                      />
                    ))
                  : <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Sin próximos eventos este mes.</p>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const navBtnStyle: React.CSSProperties = {
  display:         'flex',
  alignItems:      'center',
  gap:             '4px',
  padding:         '6px 14px',
  borderRadius:    '999px',
  backgroundColor: 'white',
  border:          '1.5px solid #E5E7EB',
  cursor:          'pointer',
  fontSize:        '13px',
  fontWeight:      600,
  color:           '#374151',
}
