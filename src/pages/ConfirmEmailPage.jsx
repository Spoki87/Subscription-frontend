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

  const cardStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
  }

  const titleStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '16px',
    fontWeight: 700,
    color: 'white',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '12px',
  }

  const subStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-dim)',
    lineHeight: 1.7,
  }

  const iconStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '32px',
    color: 'var(--orange)',
    marginBottom: '20px',
  }

  const renderContent = () => {
    if (status === 'pending') {
      return (
        <div style={cardStyle}>
          <div style={{ ...iconStyle }}>[ ... ]</div>
          <p style={subStyle}>Weryfikacja tokena...</p>
        </div>
      )
    }
    if (status === 'waiting') {
      return (
        <div style={cardStyle}>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--orange), transparent)', margin: '-40px -32px 32px' }} />
          <div style={iconStyle}>[ @ ]</div>
          <p style={titleStyle}>Sprawdź skrzynkę</p>
          <p style={subStyle}>
            Wysłaliśmy link aktywacyjny na Twój adres email.<br />
            Kliknij go, aby potwierdzić konto.
          </p>
          <Link
            to="/login"
            style={{ display: 'inline-block', marginTop: '28px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--orange)', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            {'>'} Wróć do logowania
          </Link>
        </div>
      )
    }
    if (status === 'success') {
      return (
        <div style={{ ...cardStyle, borderColor: 'rgba(255,102,0,0.3)' }}>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--orange), transparent)', margin: '-40px -32px 32px' }} />
          <div style={iconStyle}>[ OK ]</div>
          <p style={titleStyle}>Konto aktywowane</p>
          <p style={subStyle}>Możesz teraz zalogować się do systemu.</p>
          <Link
            to="/login"
            className="btn-primary"
            style={{ display: 'inline-block', marginTop: '28px', textDecoration: 'none' }}
          >
            [ Przejdź do logowania ]
          </Link>
        </div>
      )
    }
    return (
      <div style={{ ...cardStyle, borderColor: 'rgba(255,68,68,0.3)' }}>
        <div style={{ height: '2px', background: 'linear-gradient(90deg, #ff4444, transparent)', margin: '-40px -32px 32px' }} />
        <div style={{ ...iconStyle, color: '#ff4444' }}>[ X ]</div>
        <p style={titleStyle}>Weryfikacja nieudana</p>
        <p style={subStyle}>{message}</p>
        <Link
          to="/register"
          style={{ display: 'inline-block', marginTop: '28px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ff4444', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          {'>'} Zarejestruj się ponownie
        </Link>
      </div>
    )
  }

  return (
    <div
      className="grid-bg scanlines"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      {renderContent()}
    </div>
  )
}
