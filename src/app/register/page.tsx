'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/app/actions/auth'
import { Eye, EyeOff, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await signUp(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.success) {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #1a0000 0%, #3d0000 30%, #CC0000 70%, #ff3333 100%)',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '24px',
          padding: '40px 36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontWeight: 900, fontSize: '24px', color: '#111827', marginBottom: '8px' }}>
            ¡Registro exitoso!
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            Revisa tu correo electrónico para confirmar tu cuenta. Una vez confirmada, podrás iniciar sesión.
          </p>
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              backgroundColor: '#CC0000',
              color: 'white',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(204,0,0,0.3)',
            }}
          >
            Ir al Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(160deg, #1a0000 0%, #3d0000 30%, #CC0000 70%, #ff3333 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative shapes */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)' }} />
      <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '350px', height: '350px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.02)' }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '24px',
        padding: '36px 36px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="BULLS"
            style={{ width: '60px', height: '60px', margin: '0 auto 10px', filter: 'drop-shadow(0 4px 12px rgba(204,0,0,0.3))' }}
          />
          <h1 style={{ fontWeight: 900, fontSize: '24px', color: '#1A1A1A', letterSpacing: '-0.02em' }}>
            Crear cuenta
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>
            Únete a BULLS — AIESEC en Chiclayo
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '16px' }}>⚠️</span>
            <p style={{ color: '#991B1B', fontSize: '13px', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Names row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label htmlFor="nombres" style={labelStyle}>Nombres</label>
              <input id="nombres" name="nombres" type="text" required placeholder="Joe" style={inputStyle}
                onFocus={focusHandler} onBlur={blurHandler}
              />
            </div>
            <div>
              <label htmlFor="apellidos" style={labelStyle}>Apellidos</label>
              <input id="apellidos" name="apellidos" type="text" required placeholder="Villarreal" style={inputStyle}
                onFocus={focusHandler} onBlur={blurHandler}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" style={labelStyle}>Correo electrónico</label>
            <input id="email" name="email" type="email" required placeholder="tu.correo@aiesec.net" style={inputStyle}
              onFocus={focusHandler} onBlur={blurHandler}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" style={labelStyle}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                style={{ ...inputStyle, paddingRight: '42px' }}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              backgroundColor: loading ? '#E5A0A0' : '#CC0000',
              color: 'white',
              fontWeight: 700,
              fontSize: '15px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(204,0,0,0.3)',
              marginTop: '4px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#A30000' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#CC0000' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Registrando...
              </span>
            ) : (
              <>
                <UserPlus size={18} />
                Crear Cuenta
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#6B7280' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" style={{ color: '#CC0000', fontWeight: 700, textDecoration: 'none' }}>
            Inicia sesión
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 700,
  fontSize: '13px',
  color: '#374151',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '12px',
  border: '1.5px solid #D1D5DB',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  backgroundColor: '#FAFAFA',
}

const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = '#CC0000'
  e.target.style.boxShadow = '0 0 0 3px rgba(204,0,0,0.1)'
}

const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = '#D1D5DB'
  e.target.style.boxShadow = 'none'
}
