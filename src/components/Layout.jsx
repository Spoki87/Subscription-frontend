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
          fontSize: '14px',
          fontWeight: 500,
          color: active ? 'var(--orange)' : 'var(--text-dim)',
          textDecoration: 'none',
          padding: '6px 12px',
          borderRadius: '6px',
          background: active ? 'var(--orange-dim)' : 'transparent',
          transition: 'color 0.15s, background 0.15s',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface-2)' } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent' } }}
      >
        {label}
      </Link>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
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
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '-0.01em' }}>Sub</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Tracker</span>
          </Link>

          {user && (
            <div className="nav-links">
              {navLink('/dashboard', 'Subskrypcje')}
              {navLink('/reports', 'Raporty')}
              {navLink('/profile', 'Profil')}
              <button
                onClick={handleLogout}
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
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-dim)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent' }}
              >
                Wyloguj
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}
