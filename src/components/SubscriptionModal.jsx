import { useState, useEffect } from 'react'
import { createSubscription, updateSubscription } from '../api/subscriptionApi'

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-dim)',
  marginBottom: '6px',
}

export default function SubscriptionModal({ subscription, onClose, onSaved }) {
  const isEdit = Boolean(subscription)
  const [form, setForm] = useState({ name: '', description: '', price: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (subscription) {
      setForm({
        name: subscription.name || '',
        description: subscription.description || '',
        price: subscription.price != null ? String(subscription.price) : '',
      })
    }
  }, [subscription])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: parseFloat(form.price),
      }
      if (isEdit) {
        await updateSubscription(subscription.id, payload)
      } else {
        await createSubscription(payload)
      }
      onSaved()
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Wystąpił błąd. Spróbuj ponownie.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ borderTop: '3px solid var(--orange)' }}>
        <div style={{ padding: '24px 28px' }}>
          {/* Title row */}
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
              <label style={labelStyle}>Cena miesięczna (PLN) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} min="0.01" step="0.01" required className="input-field" placeholder="0.00" />
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
              <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>
                Anuluj
              </button>
              <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
                {loading ? 'Zapisywanie...' : isEdit ? 'Zapisz zmiany' : 'Dodaj'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
