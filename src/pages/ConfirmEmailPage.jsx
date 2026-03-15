import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { confirmEmail } from '../api/userApi'

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('pending')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) { setStatus('waiting'); return }
    confirmEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Nieprawidłowy lub wygasły token.')
        setStatus('error')
      })
  }, [token])

  const cardBase = {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-md)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
  }

  const renderContent = () => {
    if (status === 'pending') {
      return (
        <div style={cardBase}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--orange-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-dim)', margin: 0 }}>Weryfikacja tokena...</p>
        </div>
      )
    }

    if (status === 'waiting') {
      return (
        <div style={{ ...cardBase, borderTop: '3px solid var(--orange)' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--orange-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>Sprawdź skrzynkę email</h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
            Wysłaliśmy link aktywacyjny na Twój adres email.<br />
            Kliknij go, aby potwierdzić konto.
          </p>
          <Link to="/login" style={{ display: 'inline-block', marginTop: '28px', fontSize: '14px', color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            Wróć do logowania
          </Link>
        </div>
      )
    }

    if (status === 'success') {
      return (
        <div style={{ ...cardBase, borderTop: '3px solid var(--orange)' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--orange-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>Konto aktywowane</h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>Możesz teraz zalogować się do aplikacji.</p>
          <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '28px', textDecoration: 'none' }}>
            Przejdź do logowania
          </Link>
        </div>
      )
    }

    return (
      <div style={{ ...cardBase, borderTop: '3px solid var(--danger)' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--danger-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>Weryfikacja nieudana</h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>{message}</p>
        <Link to="/register" style={{ display: 'inline-block', marginTop: '28px', fontSize: '14px', color: 'var(--danger)', fontWeight: 600, textDecoration: 'none' }}
          onMouseEnter={e => e.target.style.textDecoration = 'underline'}
          onMouseLeave={e => e.target.style.textDecoration = 'none'}
        >
          Zarejestruj się ponownie
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      {renderContent()}
    </div>
  )
}
