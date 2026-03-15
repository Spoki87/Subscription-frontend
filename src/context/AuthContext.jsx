import { createContext, useContext, useState, useCallback } from 'react'
import { login as apiLogin, logout as apiLogout } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('accessToken')
    const role = localStorage.getItem('role')
    const currency = localStorage.getItem('currency')
    return token ? { role, currency } : null
  })

  const login = useCallback(async (email, password) => {
    const { data } = await apiLogin(email, password)
    const { accessToken, refreshToken, role } = data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('role', role)
    setUser({ role, currency: localStorage.getItem('currency') })
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      if (refreshToken) await apiLogout(refreshToken)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('role')
      localStorage.removeItem('currency')
      setUser(null)
    }
  }, [])

  const updateCurrency = useCallback((currency) => {
    localStorage.setItem('currency', currency)
    setUser((prev) => prev ? { ...prev, currency } : prev)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCurrency }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
