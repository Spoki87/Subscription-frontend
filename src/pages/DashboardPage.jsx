import { useState, useEffect, useCallback } from 'react'
import { getSubscriptions, deleteSubscription } from '../api/subscriptionApi'
import Layout from '../components/Layout'
import SubscriptionModal from '../components/SubscriptionModal'

function formatPrice(price) {
  return Number(price).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })
}

function SubscriptionCard({ sub, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--border-orange)' : 'var(--border)'}`,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 0 20px rgba(255,102,0,0.08)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top left corner accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '3px',
        height: '100%',
        background: hovered ? 'var(--orange)' : 'transparent',
        transition: 'background 0.2s',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <h3 style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          fontWeight: 700,
          color: 'white',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {sub.name}
        </h3>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--orange)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
        }}>
          {formatPrice(sub.price)}
        </span>
      </div>

      {sub.description && (
        <p style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
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

      <div style={{
        display: 'flex',
        gap: '8px',
        paddingTop: '8px',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
      }}>
        <button
          onClick={() => onEdit(sub)}
          className="btn-ghost"
          style={{ flex: 1, padding: '8px', fontSize: '11px' }}
        >
          [ Edit ]
        </button>
        <button
          onClick={() => onDelete(sub)}
          className="btn-danger"
          style={{ flex: 1, padding: '8px', fontSize: '11px' }}
        >
          [ Del ]
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

  const totalMonthly = subscriptions.reduce((sum, s) => sum + Number(s.price), 0)

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--orange)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {'>'} records.subscriptions
          </p>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>
            Subskrypcje
          </h1>
          {subscriptions.length > 0 && (
            <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
              {subscriptions.length} rekordów &nbsp;|&nbsp; suma:{' '}
              <span style={{ color: 'var(--orange)' }}>{formatPrice(totalMonthly)}</span>
              <span style={{ color: 'var(--text-dim)' }}> /mies.</span>
            </p>
          )}
        </div>
        <button onClick={handleNew} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          + Dodaj
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--orange), transparent)', marginBottom: '28px', opacity: 0.4 }} />

      {error && (
        <div className="alert-error" style={{ marginBottom: '20px' }}>
          {'[ERR] '}{error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--orange)', letterSpacing: '0.1em' }}>
            Loading...
          </span>
        </div>
      ) : subscriptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            {'// '} Brak rekordów w bazie danych.
          </p>
          <button
            onClick={handleNew}
            style={{
              marginTop: '20px',
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--orange)',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textDecoration: 'underline',
            }}
          >
            {'>'} Dodaj pierwszą subskrypcję
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              sub={sub}
              onEdit={handleEdit}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <SubscriptionModal
          subscription={editTarget}
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}

      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          padding: '24px',
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid rgba(255,68,68,0.35)',
            width: '100%',
            maxWidth: '380px',
            boxShadow: '0 0 40px rgba(255,68,68,0.1)',
          }}>
            <div style={{ height: '2px', background: 'linear-gradient(90deg, #ff4444, transparent)' }} />
            <div style={{ padding: '28px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ff4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                // CONFIRM_DELETE
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'white', marginBottom: '6px' }}>
                Usunąć subskrypcję?
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '24px' }}>
                <span style={{ color: 'var(--orange)' }}>{deleteConfirm.name}</span> zostanie trwale usunięta.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setDeleteConfirm(null)} className="btn-ghost" style={{ flex: 1 }}>
                  [ Anuluj ]
                </button>
                <button onClick={() => handleDelete(deleteConfirm.id)} className="btn-danger" style={{ flex: 1 }}>
                  [ Usuń ]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
