'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin, Eye, CalendarDays, Users } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type EventType = 'LEC' | 'TEAM DAY' | 'LCM' | 'REUNIÓN DE ÁREA' | 'ITM'

interface CalEvent {
  day:       number
  month:     number
  year:      number
  title:     string
  type:      EventType
  time:      string
  location?: string
  confirmed?: boolean
  color:     string // dot color
}

interface Birthday {
  name:    string
  dateStr: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EVENTS: CalEvent[] = [
  { day: 2,  month: 9, year: 2024, title: 'Taller de Liderazgo', type: 'LEC',           time: '6:00 PM - 8:00 PM', location: 'Virtual',                  color: '#F59E0B' },
  { day: 3,  month: 9, year: 2024, title: 'Team Meeting',        type: 'TEAM DAY',       time: '5:00 PM - 7:00 PM', location: 'Sala Principal',            color: '#8B5CF6' },
  { day: 9,  month: 9, year: 2024, title: 'LEC Session',         type: 'LEC',            time: '6:00 PM - 8:00 PM', location: 'Virtual',                   color: '#EF4444' },
  { day: 10, month: 9, year: 2024, title: 'Cultura Bull Day',    type: 'TEAM DAY',       time: '5:00 PM',           location: 'Oficina BULLS',             color: '#06B6D4' },
  { day: 15, month: 9, year: 2024, title: 'Reunión de Área C&V', type: 'REUNIÓN DE ÁREA',time: '6:00 PM - 8:00 PM', location: 'Oficina 3B, Facultad de Negocios', confirmed: true, color: '#EF4444' },
  { day: 17, month: 9, year: 2024, title: 'ITM General',        type: 'ITM',            time: '7:00 PM',           location: 'Auditorio',                 color: '#F59E0B' },
  { day: 18, month: 9, year: 2024, title: 'Taller de Liderazgo', type: 'LEC',           time: '6:00 PM - 8:00 PM', location: 'Virtual',                   color: '#EF4444' },
  { day: 20, month: 9, year: 2024, title: 'Team Meeting',        type: 'TEAM DAY',       time: '5:00 PM',           location: 'Sala Principal',            color: '#06B6D4' },
  { day: 21, month: 9, year: 2024, title: 'Reunión',            type: 'LCM',            time: '6:00 PM',           location: 'Facultad de Derecho',       color: '#F59E0B' },
  { day: 22, month: 9, year: 2024, title: 'Día de la Cultura Bull', type: 'TEAM DAY',   time: '6:00 PM - 3:00 PM', location: 'Oficina BULLS',             color: '#EF4444' },
  { day: 25, month: 9, year: 2024, title: 'Reunión de LCM',     type: 'LCM',            time: '7:00 PM',           location: 'Facultad de Derecho',       color: '#8B5CF6' },
]

const BIRTHDAYS: Birthday[] = [
  { name: 'Maria Garcia',  dateStr: 'Cumpleaños: 14 Oct' },
  { name: 'Juan Perez',    dateStr: 'Cumpleaños: 20 Oct' },
  { name: 'Pedro Rodriguez', dateStr: 'Cumpleaños: 28 Oct' },
]

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS   = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

const TYPE_COLORS: Record<EventType, { bg: string; text: string }> = {
  'LEC':            { bg: '#FEE2E2', text: '#991B1B' },
  'TEAM DAY':       { bg: '#EDE9FE', text: '#5B21B6' },
  'LCM':            { bg: '#DBEAFE', text: '#1E40AF' },
  'REUNIÓN DE ÁREA':{ bg: '#FEF3C7', text: '#92400E' },
  'ITM':            { bg: '#D1FAE5', text: '#065F46' },
}

// ─── Calendar Grid ────────────────────────────────────────────────────────────

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const totalDays = new Date(year, month + 1, 0).getDate()
  const prevDays  = new Date(year, month, 0).getDate()
  // Monday-first: convert Sun(0) → 6, Mon(1) → 0
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1)

  const cells: { day: number; month: 'prev' | 'curr' | 'next' }[] = []
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: prevDays - i, month: 'prev' })
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d, month: 'curr' })
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, month: 'next' })
  return cells
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: EventType }) {
  const c = TYPE_COLORS[type]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: c.bg, color: c.text, fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
      {type}
    </span>
  )
}

function TodayCard({ event }: { event: CalEvent }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1.5px solid #E5E7EB', padding: '14px 16px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: '15px', color: '#111827', marginBottom: '6px' }}>{event.title}</p>
          <TypeBadge type={event.type} />
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563', fontSize: '13px' }}>
              <Clock size={13} color="#9CA3AF" />
              {event.time}
            </div>
            {event.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563', fontSize: '13px' }}>
                <MapPin size={13} color="#9CA3AF" />
                {event.location}
              </div>
            )}
          </div>
        </div>
        {event.confirmed && (
          <div style={{ flexShrink: 0, border: '2px solid #16A34A', borderRadius: '8px', padding: '4px 8px', textAlign: 'center', opacity: 0.85 }}>
            <p style={{ color: '#16A34A', fontWeight: 700, fontSize: '10px' }}>Confirmada</p>
            <p style={{ color: '#6B7280', fontSize: '9px' }}>15/10 - 6:05 PM</p>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F3F4F6' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#374151' }}>
          <Eye size={13} />
          Ver Detalles
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
          <span style={{ color: '#6B7280' }}>Asistencia:</span>
          <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
            Confirmada
          </span>
        </div>
      </div>
    </div>
  )
}

function UpcomingCard({ event }: { event: CalEvent }) {
  const monthAbbr = MONTHS[event.month].slice(0, 3)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      {/* Date chip */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '36px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{monthAbbr}</span>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A1A', lineHeight: 1 }}>{event.day}</span>
      </div>
      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#111827' }}>{event.title}</span>
          <TypeBadge type={event.type} />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#6B7280' }}>
            <CalendarDays size={11} color="#9CA3AF" />{event.time.split(' ').slice(0,1).join(' ')} {event.time}
          </span>
          {event.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#6B7280' }}>
              <MapPin size={11} color="#9CA3AF" />{event.location}
            </span>
          )}
        </div>
      </div>
      {/* Button */}
      <button style={{ flexShrink: 0, padding: '6px 10px', borderRadius: '8px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
        Marcar Asistencia
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventosPage() {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const cells      = getCalendarDays(viewYear, viewMonth)
  const todayEvent = EVENTS.find(e => e.day === today.getDate() && e.month === today.getMonth() && e.year === today.getFullYear())
    ?? EVENTS.find(e => e.month === viewMonth && e.confirmed)
    ?? EVENTS[0]

  const upcomingEvents = EVENTS
    .filter(e => e.month === viewMonth && e.day > 15)
    .sort((a, b) => a.day - b.day)
    .slice(0, 4)

  const eventsOnDay = (day: number) => EVENTS.filter(e => e.day === day && e.month === viewMonth)

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
      {/* ── Page Title ── */}
      <h1 style={{ fontWeight: 900, fontSize: '36px', color: '#111827', marginBottom: '24px', letterSpacing: '-0.03em' }}>
        EVENTOS
      </h1>

      {/* ── Two-column layout ── */}
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
                  {/* Event dots */}
                  <div style={{ display: 'flex', gap: '2px', marginTop: '3px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {dots.slice(0, 3).map((ev, di) => (
                      <span key={di} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isToday ? 'rgba(255,255,255,0.8)' : ev.color }} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right: Today + Upcoming + Birthdays ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>

          {/* Today's event */}
          <div className="card-frictionless" style={{ padding: '16px 20px' }}>
            <h2 style={{ fontWeight: 800, fontSize: '15px', color: '#111827', marginBottom: '12px', letterSpacing: '-0.01em' }}>
              EVENTO DE HOY{' '}
              <span style={{ color: '#CC0000' }}>
                ({today.getDate()} {MONTHS[today.getMonth()]})
              </span>
            </h2>
            {todayEvent ? <TodayCard event={todayEvent} /> : (
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
                ? upcomingEvents.map((e, i) => <UpcomingCard key={i} event={e} />)
                : <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Sin próximos eventos este mes.</p>
              }
            </div>
          </div>

          {/* Birthdays */}
          <div className="card-frictionless" style={{ padding: '16px 20px' }}>
            <h2 style={{ fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: '12px' }}>
              🎉 Cumpleaños del Mes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {BIRTHDAYS.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🎂</span>
                  <p style={{ fontSize: '13px', color: '#374151' }}>
                    <strong>{b.name}</strong>
                    <span style={{ color: '#9CA3AF' }}> | {b.dateStr}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
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
