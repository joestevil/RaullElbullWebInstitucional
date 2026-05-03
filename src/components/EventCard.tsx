'use client'

import { useState } from 'react'

interface EventCardProps {
  day: string
  month: string
  title: string
  modality: string
  time: string
  registered: boolean
  onRegister?: () => void
}

export function EventCard({
  day,
  month,
  title,
  modality,
  time,
  registered,
  onRegister,
}: EventCardProps) {
  const [isRegistered, setIsRegistered] = useState(registered)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (isRegistered) return
    setLoading(true)
    setIsRegistered(true) // Optimistic UI update
    try {
      await onRegister?.()
    } catch {
      setIsRegistered(false) // Revert on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '14px',
        padding:    '12px 4px',
        flexWrap:   'wrap',
      }}
    >
      {/* Date box */}
      <div
        style={{
          flexShrink: 0,
          width: '64px',
          height: '64px',
          backgroundColor: '#CC0000',
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(204,0,0,0.25)',
        }}
      >
        <span style={{ color: 'white', fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>{day}</span>
        <span style={{ color: 'white', fontWeight: 500, fontSize: '12px', marginTop: '2px' }}>{month}</span>
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, color: '#1A1A1A', fontSize: '15px', lineHeight: 1.2 }}>{title}</p>
        <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '3px' }}>
          {modality} - {time}
        </p>
      </div>

      {/* Status button */}
      <div style={{ flexShrink: 0 }}>
        {isRegistered ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Inscrito
          </span>
        ) : (
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.backgroundColor = '#FECACA') }}
            onMouseLeave={(e) => { (e.currentTarget.style.backgroundColor = '#FEE2E2') }}
          >
            {loading ? '...' : 'Regístrate'}
          </button>
        )}
      </div>
    </div>
  )
}
