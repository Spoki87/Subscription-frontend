import { useState, useEffect, useCallback } from 'react'
import { getSubscriptions, deleteSubscription } from '../api/subscriptionApi'
import Layout from '../components/Layout'
import SubscriptionModal from '../components/SubscriptionModal'

function formatPrice(price, currency = 'PLN') {
  return Number(price).toLocaleString('pl-PL', { style: 'currency', currency })
}

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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
          {sub.name}
        </h3>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--orange)', whiteSpace: 'nowrap', display: 'block' }}>
            {formatPrice(sub.convertedPrice ?? sub.price, sub.displayCurrency ?? sub.currency ?? 'PLN')}
          </span>
          {sub.currency && sub.displayCurrency && sub.currency !== sub.displayCurrency && (
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
              {formatPrice(sub.price, sub.currency)}
            </span>
          )}
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

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getSubscriptions()
      setSubscriptions(data.data || [])
    } catch {
      setError('Nie udało się pobrać danych.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSubscriptions() }, [fetchSubscriptions])

  const handleEdit = (sub) => { setEditTarget(sub); setModalOpen(true) }
  const handleNew = () => { setEditTarget(null); setModalOpen(true) }
  const handleModalClose = () => { setModalOpen(false); setEditTarget(null) }
  const handleSaved = () => { handleModalClose(); fetchSubscriptions() }

  const handleDelete = async (id) => {
    try {
      await deleteSubscription(id)
      setDeleteConfirm(null)
      fetchSubscriptions()
    } catch {
      setError('Nie udało się usunąć subskrypcji.')
      setDeleteConfirm(null)
    }
  }

  const displayCurrency = subscriptions[0]?.displayCurrency ?? subscriptions[0]?.currency ?? 'PLN'
  const totalMonthly = subscriptions.reduce((sum, s) => sum + Number(s.convertedPrice ?? s.price), 0)

  return (
    <Layout>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            Subskrypcje
          </h1>
          {subscriptions.length > 0 && (
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>
              {subscriptions.length} {subscriptions.length === 1 ? 'rekord' : 'rekordów'} &middot; suma miesięczna:{' '}
              <span style={{ color: 'var(--orange)', fontWeight: 600 }}>{formatPrice(totalMonthly, displayCurrency)}</span>
            </p>
          )}
        </div>
        <button onClick={handleNew} className="btn-primary dashboard-add-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Dodaj subskrypcję
        </button>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-dim)' }}>Ładowanie...</span>
        </div>
      ) : subscriptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--orange-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
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

      {modalOpen && (
        <SubscriptionModal subscription={editTarget} onClose={handleModalClose} onSaved={handleSaved} />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box delete-confirm-box" style={{ maxWidth: '380px', borderTop: '3px solid var(--danger)' }}>
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--danger-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>Usuń subskrypcję</h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                Czy na pewno chcesz usunąć <strong style={{ color: 'var(--text)' }}>{deleteConfirm.name}</strong>? Tej operacji nie można cofnąć.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setDeleteConfirm(null)} className="btn-ghost" style={{ flex: 1 }}>
                  Anuluj
                </button>
                <button onClick={() => handleDelete(deleteConfirm.id)} className="btn-danger" style={{ flex: 1 }}>
                  Usuń
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
