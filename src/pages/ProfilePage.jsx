import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { changePassword, changeCurrency } from '../api/userApi'
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

function SettingRow({ label, value, onEdit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{value}</p>
      </div>
      <button onClick={onEdit} className="btn-ghost" style={{ fontSize: '13px', padding: '7px 14px' }}>
        Zmień
      </button>
    </div>
  )
}

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) { setError('Nowe hasła nie są identyczne.'); return }
    setLoading(true)
    try {
      await changePassword(form.currentPassword, form.newPassword)
      setSuccess('Hasło zostało zmienione.')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Nie udało się zmienić hasła.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ borderTop: '3px solid var(--orange)', maxWidth: '420px' }}>
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>Zmień hasło</h2>
              <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-dim)' }}>Zaktualizuj hasło do konta</p>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '6px', borderRadius: '6px', lineHeight: 1, fontSize: '20px', transition: 'color 0.15s, background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface-2)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent' }}
            >×</button>
          </div>

          {success ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-dim, rgba(34,197,94,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success, #22c55e)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: '0 0 20px', fontSize: '14px', color: 'var(--text)' }}>{success}</p>
              <button onClick={onClose} className="btn-primary">Zamknij</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Obecne hasło</label>
                <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} required className="input-field" placeholder="••••••••" autoComplete="current-password" />
              </div>
              <div style={{ height: '1px', background: 'var(--border)' }} />
              <div>
                <label style={labelStyle}>Nowe hasło</label>
                <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required minLength={6} className="input-field" placeholder="min. 6 znaków" autoComplete="new-password" />
              </div>
              <div>
                <label style={labelStyle}>Potwierdź nowe hasło</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className="input-field" placeholder="••••••••" autoComplete="new-password" />
              </div>
              {error && <div className="alert-error">{error}</div>}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
                <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Anuluj</button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
                  {loading ? 'Zapisywanie...' : 'Zapisz hasło'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function ChangeCurrencyModal({ currentCurrency, onClose, onSaved }) {
  const [selected, setSelected] = useState(currentCurrency || 'PLN')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await changeCurrency(selected)
      onSaved(data.data.currency)
    } catch (err) {
      setError(err.response?.data?.message || 'Nie udało się zmienić waluty.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ borderTop: '3px solid var(--orange)', maxWidth: '420px' }}>
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>Zmień walutę</h2>
              <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-dim)' }}>Wybierz walutę wyświetlania cen</p>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '6px', borderRadius: '6px', lineHeight: 1, fontSize: '20px', transition: 'color 0.15s, background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface-2)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent' }}
            >×</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { value: 'PLN', symbol: 'zł', name: 'Złoty polski' },
                { value: 'USD', symbol: '$', name: 'Dolar amerykański' },
                { value: 'EUR', symbol: '€', name: 'Euro' },
              ].map(({ value, symbol, name }) => {
                const active = selected === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setSelected(value); setError('') }}
                    style={{
                      padding: '14px 12px',
                      borderRadius: 'var(--radius)',
                      border: `1.5px solid ${active ? 'var(--orange)' : 'var(--border)'}`,
                      background: active ? 'var(--orange-dim)' : 'var(--surface-2)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: '20px', fontWeight: 700, color: active ? 'var(--orange)' : 'var(--text)', marginBottom: '4px' }}>{symbol}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: active ? 'var(--orange)' : 'var(--text)' }}>{value}</div>
                    <div style={{ fontSize: '11px', color: active ? 'var(--orange)' : 'var(--text-dim)', marginTop: '2px' }}>{name}</div>
                  </button>
                )
              })}
            </div>
            {error && <div className="alert-error">{error}</div>}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Anuluj</button>
              <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
                {loading ? 'Zapisywanie...' : 'Zapisz walutę'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateCurrency } = useAuth()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false)

  const handleCurrencySaved = (currency) => {
    updateCurrency(currency)
    setCurrencyModalOpen(false)
  }

  return (
    <Layout>
      <div className="profile-section" style={{ maxWidth: '560px' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>Profil</h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>Zarządzaj ustawieniami konta</p>
        </div>

        <SectionCard title="Informacje o koncie">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Rola', value: user?.role || '—' },
              { label: 'Waluta', value: user?.currency || '—' },
              { label: 'Status', value: 'Aktywny' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                <p style={{ margin: '0 0 3px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Ustawienia konta">
          <div style={{ marginTop: '-14px' }}>
            <SettingRow
              label="Waluta wyświetlania"
              value={user?.currency || 'PLN'}
              onEdit={() => setCurrencyModalOpen(true)}
            />
            <div style={{ paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Hasło</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>••••••••</p>
              </div>
              <button onClick={() => setPasswordModalOpen(true)} className="btn-ghost" style={{ fontSize: '13px', padding: '7px 14px' }}>
                Zmień
              </button>
            </div>
          </div>
        </SectionCard>

      </div>

      {passwordModalOpen && (
        <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} />
      )}

      {currencyModalOpen && (
        <ChangeCurrencyModal
          currentCurrency={user?.currency || 'PLN'}
          onClose={() => setCurrencyModalOpen(false)}
          onSaved={handleCurrencySaved}
        />
      )}
    </Layout>
  )
}
