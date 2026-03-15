import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/userApi'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
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
      await register(form.username, form.email, form.password)
      navigate('/register/confirm', { state: { email: form.email } })
    } catch (err) {
      const data = err.response?.data
      const msg =
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors[0] : null) ||
        'Wystąpił błąd. Spróbuj ponownie.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-dim)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '8px',
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
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Sub</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Tracker</span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {'>'} system.auth.register
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '32px' }}>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--orange), transparent)', margin: '-32px -32px 28px' }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Nazwa użytkownika</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                minLength={6}
                maxLength={20}
                className="input-field"
                placeholder="min. 6 znaków"
              />
            </div>
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
              <label style={labelStyle}>Hasło</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                maxLength={20}
                autoComplete="new-password"
                className="input-field"
                placeholder="6–20 znaków"
              />
            </div>

            {error && (
              <div className="alert-error">{'[ERR] '}{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', marginTop: '4px' }}
            >
              {loading ? '[ Rejestracja... ]' : '[ Zarejestruj się ]'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
          {'// '} Masz już konto?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--orange)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  )
}
