import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword, setNewPassword } from '../api/userApi'

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--text-dim)',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '8px',
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
    <div
      className="grid-bg scanlines"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Sub</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Tracker</span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {'>'} auth.reset_password
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '32px' }}>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--orange), transparent)', margin: '-32px -32px 28px' }} />

          {!sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.7 }}>
                {'// '} Wyślemy na Twój email link do ustawienia nowego hasła.
              </p>
              {sendError && <div className="alert-error">{'[ERR] '}{sendError}</div>}
              <button onClick={handleSend} disabled={sending} className="btn-primary" style={{ width: '100%' }}>
                {sending ? '[ Wysyłam... ]' : '[ Wyślij kod na email ]'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="alert-success">{'[OK] '} Email z kodem został wysłany.</div>
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
              {error && <div className="alert-error">{'[ERR] '}{error}</div>}
              {success && <div className="alert-success">{'[OK] '}{success}</div>}
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
                {loading ? '[ ... ]' : '[ Ustaw nowe hasło ]'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
          {'// '}
          <Link
            to="/login"
            style={{ color: 'var(--orange)', textDecoration: 'none' }}
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
