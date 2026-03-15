import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword, setNewPassword } from '../api/userApi'

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-dim)',
  marginBottom: '6px',
}

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  const [form, setForm] = useState({ token: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    setSending(true)
    setSendError('')
    try {
      await resetPassword()
      setSent(true)
    } catch (err) {
      setSendError(err.response?.data?.message || 'Nie udało się wysłać emaila.')
    } finally {
      setSending(false)
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) { setError('Hasła nie są identyczne.'); return }
    setLoading(true)
    setError('')
    try {
      await setNewPassword(form.token, form.newPassword)
      setSuccess('Hasło zostało ustawione. Możesz się zalogować.')
      setForm({ token: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Nie udało się ustawić hasła.')
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
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>Resetowanie hasła</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', padding: '32px' }}>
          <div style={{ height: '3px', background: 'var(--orange)', borderRadius: '3px 3px 0 0', margin: '-32px -32px 28px' }} />

          {!sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                Wyślemy na Twój adres email link do ustawienia nowego hasła.
              </p>
              {sendError && <div className="alert-error">{sendError}</div>}
              <button onClick={handleSend} disabled={sending} className="btn-primary" style={{ width: '100%' }}>
                {sending ? 'Wysyłanie...' : 'Wyślij link resetujący'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="alert-success">Email z kodem został wysłany. Sprawdź skrzynkę.</div>
              <div>
                <label style={labelStyle}>Token z emaila</label>
                <input name="token" value={form.token} onChange={handleChange} required className="input-field" placeholder="Wklej token..." />
              </div>
              <div>
                <label style={labelStyle}>Nowe hasło</label>
                <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required minLength={6} maxLength={20} className="input-field" placeholder="6–20 znaków" />
              </div>
              <div>
                <label style={labelStyle}>Potwierdź hasło</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className="input-field" placeholder="••••••••" />
              </div>
              {error && <div className="alert-error">{error}</div>}
              {success && <div className="alert-success">{success}</div>}
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
                {loading ? 'Zapisywanie...' : 'Ustaw nowe hasło'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-dim)' }}>
          <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            Wróć do logowania
          </Link>
        </p>
      </div>
    </div>
  )
}
