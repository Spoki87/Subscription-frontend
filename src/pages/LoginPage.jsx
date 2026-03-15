import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Nieprawidłowy email lub hasło.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="grid-bg scanlines"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--orange)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>Sub</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>Tracker</span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {'>'} system.auth.login
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '32px',
        }}>
          {/* Top bar accent */}
          <div style={{
            height: '2px',
            background: 'linear-gradient(90deg, var(--orange), transparent)',
            margin: '-32px -32px 28px',
          }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-dim)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Email
              </label>
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
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-dim)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Hasło
              </label>
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
              <div className="alert-error">
                {'[ERR] '}{error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', marginTop: '4px' }}
            >
              {loading ? '[ Logowanie... ]' : '[ Zaloguj się ]'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
          <Link
            to="/forgot-password"
            style={{ color: 'var(--text-dim)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = 'var(--orange)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
          >
            Zapomniałeś hasła?
          </Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
          {'// '} Nie masz konta?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--orange)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  )
}
