import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navLink = (path, label) => {
    const active = location.pathname === path
    return (
      <Link
        to={path}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: active ? 'var(--orange)' : 'var(--text-dim)',
          textDecoration: 'none',
          padding: '4px 0',
          borderBottom: active ? '1px solid var(--orange)' : '1px solid transparent',
          transition: 'color 0.15s, border-color 0.15s',
        }}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="grid-bg scanlines" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--orange)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              Sub
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              Tracker
            </span>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--orange)',
              boxShadow: '0 0 8px var(--orange)',
              display: 'inline-block',
            }} />
          </Link>

          {/* Nav links */}
          {user && (
            <div className="nav-links">
              {navLink('/dashboard', 'Subskrypcje')}
              {navLink('/profile', 'Profil')}
              <button
                onClick={handleLogout}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#555',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 0',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = '#ff4444'}
                onMouseLeave={e => e.target.style.color = '#555'}
              >
                Wyloguj
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}
