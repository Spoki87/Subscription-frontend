import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { changePassword, resetPassword, setNewPassword } from '../api/userApi'
import Layout from '../components/Layout'

function SectionCard({ tag, title, children }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      marginBottom: '16px',
      overflow: 'hidden',
    }}>
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

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--text-dim)',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '8px',
}

export default function ProfilePage() {
  const { user } = useAuth()

  const [cpForm, setCpForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [cpError, setCpError] = useState('')
  const [cpSuccess, setCpSuccess] = useState('')
  const [cpLoading, setCpLoading] = useState(false)

  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')

  const [npForm, setNpForm] = useState({ token: '', newPassword: '', confirmPassword: '' })
  const [npError, setNpError] = useState('')
  const [npSuccess, setNpSuccess] = useState('')
  const [npLoading, setNpLoading] = useState(false)

  const handleCpChange = (e) => {
    setCpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setCpError(''); setCpSuccess('')
  }

  const handleCpSubmit = async (e) => {
    e.preventDefault()
    if (cpForm.newPassword !== cpForm.confirmPassword) { setCpError('Nowe hasła nie są identyczne.'); return }
    setCpLoading(true); setCpError(''); setCpSuccess('')
    try {
      await changePassword(cpForm.oldPassword, cpForm.newPassword)
      setCpSuccess('Hasło zostało zmienione.')
      setCpForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setCpError(err.response?.data?.message || 'Nie udało się zmienić hasła.')
    } finally {
      setCpLoading(false)
    }
  }

  const handleResetSend = async () => {
    setResetLoading(true); setResetError('')
    try {
      await resetPassword()
      setResetSent(true)
    } catch (err) {
      setResetError(err.response?.data?.message || 'Nie udało się wysłać emaila.')
    } finally {
      setResetLoading(false)
    }
  }

  const handleNpChange = (e) => {
    setNpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setNpError(''); setNpSuccess('')
  }

  const handleNpSubmit = async (e) => {
    e.preventDefault()
    if (npForm.newPassword !== npForm.confirmPassword) { setNpError('Hasła nie są identyczne.'); return }
    setNpLoading(true); setNpError(''); setNpSuccess('')
    try {
      await setNewPassword(npForm.token, npForm.newPassword)
      setNpSuccess('Hasło zostało ustawione.')
      setNpForm({ token: '', newPassword: '', confirmPassword: '' })
      setResetSent(false)
    } catch (err) {
      setNpError(err.response?.data?.message || 'Nie udało się ustawić hasła.')
    } finally {
      setNpLoading(false)
    }
  }

  return (
    <Layout>
      <div style={{ maxWidth: '560px' }}>
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            background: 'var(--border)',
          }}>
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
        <SectionCard tag="// auth.change_password" title="Zmień hasło">
          <form onSubmit={handleCpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'oldPassword', label: 'Obecne hasło', value: cpForm.oldPassword },
              { name: 'newPassword', label: 'Nowe hasło', value: cpForm.newPassword, min: 6 },
              { name: 'confirmPassword', label: 'Potwierdź nowe hasło', value: cpForm.confirmPassword },
            ].map(({ name, label, value, min }) => (
              <div key={name}>
                <label style={labelStyle}>{label}</label>
                <input
                  name={name}
                  type="password"
                  value={value}
                  onChange={handleCpChange}
                  required
                  minLength={min}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            ))}
            {cpError && <div className="alert-error">{'[ERR] '}{cpError}</div>}
            {cpSuccess && <div className="alert-success">{'[OK] '}{cpSuccess}</div>}
            <div>
              <button type="submit" disabled={cpLoading} className="btn-primary">
                {cpLoading ? '[ ... ]' : '[ Zmień hasło ]'}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* Reset password */}
        <SectionCard tag="// auth.reset_password" title="Reset hasła przez email">
          {!resetSent ? (
            <div>
              <p style={{ margin: '0 0 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                {'// '} Wyślemy na Twój email kod do ustawienia nowego hasła.
              </p>
              {resetError && <div className="alert-error" style={{ marginBottom: '16px' }}>{'[ERR] '}{resetError}</div>}
              <button onClick={handleResetSend} disabled={resetLoading} className="btn-ghost">
                {resetLoading ? '[ Wysyłam... ]' : '[ Wyślij kod ]'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleNpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="alert-success">
                {'[OK] '} Email z kodem został wysłany.
              </div>
              <div>
                <label style={labelStyle}>Token z emaila</label>
                <input
                  name="token"
                  value={npForm.token}
                  onChange={handleNpChange}
                  required
                  className="input-field"
                  placeholder="Wklej token..."
                />
              </div>
              <div>
                <label style={labelStyle}>Nowe hasło</label>
                <input
                  name="newPassword"
                  type="password"
                  value={npForm.newPassword}
                  onChange={handleNpChange}
                  required
                  minLength={6}
                  maxLength={20}
                  className="input-field"
                  placeholder="6–20 znaków"
                />
              </div>
              <div>
                <label style={labelStyle}>Potwierdź hasło</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={npForm.confirmPassword}
                  onChange={handleNpChange}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
              {npError && <div className="alert-error">{'[ERR] '}{npError}</div>}
              {npSuccess && <div className="alert-success">{'[OK] '}{npSuccess}</div>}
              <div>
                <button type="submit" disabled={npLoading} className="btn-primary">
                  {npLoading ? '[ ... ]' : '[ Ustaw nowe hasło ]'}
                </button>
              </div>
            </form>
          )}
        </SectionCard>
      </div>
    </Layout>
  )
}
