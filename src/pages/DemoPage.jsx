import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatPrice(price, currency = 'PLN') {
  return Number(price).toLocaleString('pl-PL', { style: 'currency', currency })
}

function generateId() {
  return Math.random().toString(36).slice(2)
}

// ─── demo data ───────────────────────────────────────────────────────────────

const INITIAL_SUBSCRIPTIONS = [
  { id: '1', name: 'Netflix', description: 'Plan Standard z reklamami', price: 29.99, currency: 'PLN', subscriptionModel: 'MONTHLY' },
  { id: '2', name: 'Spotify', description: 'Plan Premium', price: 23.99, currency: 'PLN', subscriptionModel: 'MONTHLY' },
  { id: '3', name: 'GitHub Copilot', description: 'Licencja indywidualna', price: 399, currency: 'PLN', subscriptionModel: 'YEARLY' },
  { id: '4', name: 'Adobe Creative Cloud', description: 'Photoshop + Illustrator', price: 119.99, currency: 'PLN', subscriptionModel: 'MONTHLY' },
  { id: '5', name: 'ChatGPT Plus', price: 79.99, currency: 'PLN', subscriptionModel: 'MONTHLY' },
]

// ─── label style (shared) ────────────────────────────────────────────────────

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-dim)',
  marginBottom: '6px',
}

// ─── SubscriptionCard ─────────────────────────────────────────────────────────

function SubscriptionCard({ sub, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1.5px solid ${hovered ? 'var(--border-orange)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 4px 20px rgba(249,115,22,0.1)' : 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{sub.name}</h3>
          <span style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: '999px',
            background: sub.subscriptionModel === 'YEARLY' ? 'rgba(99,102,241,0.12)' : 'var(--orange-dim)',
            color: sub.subscriptionModel === 'YEARLY' ? '#818cf8' : 'var(--orange)',
          }}>
            {sub.subscriptionModel === 'YEARLY' ? 'Roczna' : 'Miesięczna'}
          </span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--orange)', whiteSpace: 'nowrap', display: 'block' }}>
            {formatPrice(sub.price, sub.currency)}
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-dim)' }}>
              {sub.subscriptionModel === 'YEARLY' ? '/rok' : '/mies.'}
            </span>
          </span>
        </div>
      </div>

      {sub.description && (
        <p style={{
          margin: 0,
          fontSize: '13px',
          color: 'var(--text-dim)',
          lineHeight: 1.5,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {sub.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <button onClick={() => onEdit(sub)} className="btn-ghost" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>
          Edytuj
        </button>
        <button onClick={() => onDelete(sub)} className="btn-danger" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>
          Usuń
        </button>
      </div>
    </div>
  )
}

// ─── DemoModal ────────────────────────────────────────────────────────────────

function DemoModal({ subscription, onClose, onSaved }) {
  const isEdit = Boolean(subscription)
  const [form, setForm] = useState(
    subscription
      ? { name: subscription.name, description: subscription.description || '', price: String(subscription.price), subscriptionModel: subscription.subscriptionModel }
      : { name: '', description: '', price: '', subscriptionModel: 'MONTHLY' }
  )
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const price = parseFloat(form.price)
    if (!form.name.trim()) { setError('Nazwa jest wymagana.'); return }
    if (isNaN(price) || price <= 0) { setError('Podaj prawidłową cenę.'); return }
    onSaved({
      id: subscription?.id ?? generateId(),
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price,
      currency: 'PLN',
      subscriptionModel: form.subscriptionModel,
    })
  }

  const isMonthly = form.subscriptionModel === 'MONTHLY'

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ borderTop: '3px solid var(--orange)' }}>
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>
                {isEdit ? 'Edytuj subskrypcję' : 'Nowa subskrypcja'}
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-dim)' }}>
                {isEdit ? 'Zaktualizuj dane subskrypcji' : 'Dodaj subskrypcję do listy'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '6px', borderRadius: '6px', lineHeight: 1, transition: 'color 0.15s, background 0.15s', fontSize: '20px' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface-2)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent' }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nazwa *</label>
              <input name="name" value={form.name} onChange={handleChange} maxLength={100} required className="input-field" placeholder="np. Netflix" />
            </div>
            <div>
              <label style={labelStyle}>Opis</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                rows={3}
                className="input-field"
                style={{ resize: 'none' }}
                placeholder="Opcjonalny opis..."
              />
            </div>

            <div>
              <label style={labelStyle}>Model rozliczenia *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[{ value: 'MONTHLY', label: 'Miesięczna' }, { value: 'YEARLY', label: 'Roczna' }].map(({ value, label }) => {
                  const active = form.subscriptionModel === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, subscriptionModel: value }))}
                      style={{
                        flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${active ? 'var(--orange)' : 'var(--border)'}`,
                        background: active ? 'var(--orange-dim)' : 'var(--surface-2)',
                        color: active ? 'var(--orange)' : 'var(--text-dim)',
                        fontWeight: active ? 700 : 500, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label style={labelStyle}>{isMonthly ? 'Cena miesięczna (PLN) *' : 'Cena roczna (PLN) *'}</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} min="0.01" step="0.01" required className="input-field" placeholder="0.00" />
            </div>

            {!isMonthly && form.price && (
              <p style={{ margin: '-8px 0 0', fontSize: '12px', color: 'var(--text-dim)' }}>
                ≈ {(parseFloat(form.price) / 12).toFixed(2)} {form.currency}/mies.
              </p>
            )}

            {error && <div className="alert-error">{error}</div>}

            <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
              <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Anuluj</button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {isEdit ? 'Zapisz zmiany' : 'Dodaj'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── DemoPage ─────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const navigate = useNavigate()
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleNew = () => { setEditTarget(null); setModalOpen(true) }
  const handleEdit = (sub) => { setEditTarget(sub); setModalOpen(true) }
  const handleModalClose = () => { setModalOpen(false); setEditTarget(null) }

  const handleSaved = (sub) => {
    setSubscriptions((prev) =>
      editTarget ? prev.map((s) => (s.id === sub.id ? sub : s)) : [...prev, sub]
    )
    handleModalClose()
  }

  const handleDelete = (id) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
    setDeleteConfirm(null)
  }

  const totalMonthly = subscriptions.reduce((sum, s) => {
    const price = Number(s.price)
    return sum + (s.subscriptionModel === 'YEARLY' ? price / 12 : price)
  }, 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div className="nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '-0.01em' }}>Sub</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Tracker</span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'var(--orange-dim)',
              color: 'var(--orange)',
              letterSpacing: '0.04em',
            }}>
              DEMO
            </span>
          </div>

          <button
            onClick={() => navigate('/login')}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-dim)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface-2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent' }}
          >
            ← Wróć do logowania
          </button>
        </div>
      </nav>

      {/* Demo banner */}
      <div style={{
        background: 'var(--orange-dim)',
        borderBottom: '1px solid rgba(249,115,22,0.2)',
        padding: '10px 24px',
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--orange)',
        fontWeight: 500,
      }}>
        Tryb demo — dane istnieją tylko w tej sesji i znikną po odświeżeniu strony.{' '}
        <Link to="/register" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'underline' }}>
          Zarejestruj się za darmo
        </Link>
        , aby zapisywać swoje subskrypcje.
      </div>

      <main className="layout-main">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
              Subskrypcje
            </h1>
            {subscriptions.length > 0 && (
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>
                {subscriptions.length} {subscriptions.length === 1 ? 'rekord' : 'rekordów'} &middot; suma miesięczna:{' '}
                <span style={{ color: 'var(--orange)', fontWeight: 600 }}>
                  {formatPrice(totalMonthly, 'PLN')}
                </span>
              </p>
            )}
          </div>
          <button onClick={handleNew} className="btn-primary dashboard-add-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Dodaj subskrypcję
          </button>
        </div>

        {subscriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--orange-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px' }}>Brak subskrypcji</p>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: '0 0 20px' }}>Dodaj pierwszą subskrypcję, aby zacząć śledzić wydatki.</p>
            <button onClick={handleNew} className="btn-primary">Dodaj subskrypcję</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} onEdit={handleEdit} onDelete={setDeleteConfirm} />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <DemoModal subscription={editTarget} onClose={handleModalClose} onSaved={handleSaved} />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box delete-confirm-box" style={{ maxWidth: '380px', borderTop: '3px solid var(--danger)' }}>
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--danger-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>Usuń subskrypcję</h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                Czy na pewno chcesz usunąć <strong style={{ color: 'var(--text)' }}>{deleteConfirm.name}</strong>?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setDeleteConfirm(null)} className="btn-ghost" style={{ flex: 1 }}>Anuluj</button>
                <button onClick={() => handleDelete(deleteConfirm.id)} className="btn-danger" style={{ flex: 1 }}>Usuń</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
