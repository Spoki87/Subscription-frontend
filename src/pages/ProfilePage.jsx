import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { changePassword } from '../api/userApi'
import Layout from '../components/Layout'

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--text-dim)',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '8px',
}

function SectionCard({ tag, title, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', marginBottom: '16px', overflow: 'hidden' }}>
      <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--orange), transparent)' }} />
      <div style={{ padding: '24px' }}>
        <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--orange)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {tag}
        </p>
        <h2 style={{ margin: '0 0 20px', fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'white', letterSpacing: '0.04em' }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()

  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) { setError('Nowe hasła nie są identyczne.'); return }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await changePassword(form.oldPassword, form.newPassword)
      setSuccess('Hasło zostało zmienione.')
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Nie udało się zmienić hasła.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="profile-section" style={{ maxWidth: '560px' }}>
        {/* Page header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--orange)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {'>'} user.settings
          </p>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: 'white' }}>
            Profil
          </h1>
        </div>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--orange), transparent)', marginBottom: '28px', opacity: 0.4 }} />

        {/* Account info */}
        <SectionCard tag="// account.info" title="Informacje o koncie">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Rola', value: user?.role || '—' },
              { label: 'Status', value: 'ACTIVE' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'var(--surface-2)', padding: '14px 16px' }}>
                <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--orange)', letterSpacing: '0.05em' }}>{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Change password */}
        <SectionCard tag="// auth.security" title="Zmień hasło">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Obecne hasło</label>
              <input
                name="oldPassword"
                type="password"
                value={form.oldPassword}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />

            <div>
              <label style={labelStyle}>Nowe hasło</label>
              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="input-field"
                placeholder="min. 6 znaków"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label style={labelStyle}>Potwierdź nowe hasło</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {error && <div className="alert-error">{'[ERR] '}{error}</div>}
            {success && <div className="alert-success">{'[OK] '}{success}</div>}

            <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? '[ ... ]' : '[ Zapisz nowe hasło ]'}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </Layout>
  )
}
