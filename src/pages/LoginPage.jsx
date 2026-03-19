import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { resendConfirmation } from '../api/userApi'

const ERROR_MESSAGES = {
  'User is disabled': 'Konto nie zostało jeszcze aktywowane.',
  'Account is not active': 'Konto nie zostało jeszcze aktywowane.',
  'Bad credentials': 'Nieprawidłowy email lub hasło.',
  'User not found': 'Nieprawidłowy email lub hasło.',
  'Account is locked': 'Konto zostało zablokowane.',
  'Too many requests': 'Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.',
  'Internal Server Error': 'Nieprawidłowy email lub hasło.',
}

const HTTP_STATUS_MESSAGES = {
  400: 'Nieprawidłowy email lub hasło.',
  401: 'Nieprawidłowy email lub hasło.',
  403: 'Nieprawidłowy email lub hasło.',
  500: 'Nieprawidłowy email lub hasło.',
}

function translateError(message, status) {
  if (message) {
    for (const [key, pl] of Object.entries(ERROR_MESSAGES)) {
      if (message.includes(key)) return pl
    }
  }
  if (status && HTTP_STATUS_MESSAGES[status]) return HTTP_STATUS_MESSAGES[status]
  return 'Nieprawidłowy email lub hasło.'
}

const INACTIVE_KEYWORDS = ['disabled', 'not active', 'inactive', 'nie aktywn', 'not activated']

function isInactiveError(message) {
  if (!message) return false
  return INACTIVE_KEYWORDS.some((kw) => message.toLowerCase().includes(kw))
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-dim)',
  marginBottom: '6px',
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setShowResend(false)
    setResendMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowResend(false)
    setResendMessage('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const rawMessage = err.response?.data?.message || ''
      const status = err.response?.status
      setError(translateError(rawMessage, status))
      if (isInactiveError(rawMessage)) {
        setShowResend(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setResendMessage('')
    try {
      await resendConfirmation(form.email)
      setResendMessage('Link aktywacyjny został wysłany na podany adres email.')
      setShowResend(false)
    } catch (err) {
      const raw = err.response?.data?.message || ''
      setResendMessage(translateError(raw) || 'Nie udało się wysłać emaila. Spróbuj ponownie.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginBottom: '8px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '-0.02em' }}>Sub</span>
            <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Tracker</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>Zaloguj się do swojego konta</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', padding: '32px' }}>
          <div style={{ height: '3px', background: 'var(--orange)', borderRadius: '3px 3px 0 0', margin: '-32px -32px 28px' }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="input-field"
                placeholder="adres@email.com"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={labelStyle}>Hasło</label>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--text-dim)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--orange)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
                >
                  Zapomniałeś hasła?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div>
                <div className="alert-error">{error}</div>
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      padding: '9px',
                      background: 'transparent',
                      border: '1.5px solid var(--orange)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--orange)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: resendLoading ? 'not-allowed' : 'pointer',
                      opacity: resendLoading ? 0.6 : 1,
                    }}
                  >
                    {resendLoading ? 'Wysyłanie...' : 'Wyślij ponownie link aktywacyjny'}
                  </button>
                )}
              </div>
            )}

            {resendMessage && (
              <div className={resendMessage.includes('wysłany') ? 'alert-success' : 'alert-error'}>
                {resendMessage}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '4px' }}>
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-dim)' }}>
          Nie masz konta?{' '}
          <Link to="/register" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            Zarejestruj się
          </Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <Link
            to="/demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-dim)',
              textDecoration: 'none',
              padding: '8px 20px',
              borderRadius: 'var(--radius)',
              border: '1.5px solid var(--border)',
              background: 'var(--surface)',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Wypróbuj bez rejestracji
          </Link>
        </div>
      </div>
    </div>
  )
}
