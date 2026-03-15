import { useState, useEffect } from 'react'
import { createSubscription, updateSubscription } from '../api/subscriptionApi'

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
    <div className="modal-overlay">
      <div className="modal-box">
        {/* Top accent bar */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--orange), transparent)' }} />

        <div style={{ padding: '28px' }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--orange)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {isEdit ? '// EDIT_RECORD' : '// NEW_RECORD'}
              </span>
              <h2 style={{ margin: '4px 0 0', fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'white', letterSpacing: '0.04em' }}>
                {isEdit ? 'Edytuj subskrypcję' : 'Nowa subskrypcja'}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '18px',
                lineHeight: 1,
                padding: '4px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Nazwa *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                required
                className="input-field"
                placeholder="np. Netflix"
              />
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
                style={{ resize: 'none', fontFamily: 'var(--font-mono)' }}
                placeholder="Opcjonalny opis..."
              />
            </div>
            <div>
              <label style={labelStyle}>Cena (PLN) *</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
                className="input-field"
                placeholder="0.00"
              />
            </div>

            {error && (
              <div className="alert-error">{'[ERR] '}{error}</div>
            )}

            <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost"
                style={{ flex: 1 }}
              >
                [ Anuluj ]
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                {loading ? '[ ... ]' : isEdit ? '[ Zapisz ]' : '[ Dodaj ]'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
