import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { changePassword } from '../api/userApi'
import Layout from '../components/Layout'

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-dim)',
  marginBottom: '6px',
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', marginBottom: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
      </div>
      <div style={{ padding: '24px' }}>
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
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>Profil</h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>Zarządzaj ustawieniami konta</p>
        </div>

        {/* Account info */}
        <SectionCard title="Informacje o koncie">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Rola', value: user?.role || '—' },
              { label: 'Status', value: 'Aktywny' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                <p style={{ margin: '0 0 3px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Change password */}
        <SectionCard title="Zmień hasło">
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

            {error && <div className="alert-error">{error}</div>}
            {success && <div className="alert-success">{success}</div>}

            <div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Zapisywanie...' : 'Zapisz nowe hasło'}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </Layout>
  )
}
