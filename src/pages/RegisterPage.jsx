import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/userApi'

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-dim)',
  marginBottom: '6px',
}

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginBottom: '8px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '-0.02em' }}>Sub</span>
            <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Tracker</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>Utwórz nowe konto</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', padding: '32px' }}>
          <div style={{ height: '3px', background: 'var(--orange)', borderRadius: '3px 3px 0 0', margin: '-32px -32px 28px' }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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

            {error && <div className="alert-error">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '4px' }}>
              {loading ? 'Rejestracja...' : 'Zarejestruj się'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-dim)' }}>
          Masz już konto?{' '}
          <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}
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
