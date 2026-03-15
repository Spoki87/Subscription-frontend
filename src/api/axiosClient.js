import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

// Endpointy auth — nie powinny wyzwalać mechanizmu odświeżania tokena
const SKIP_REFRESH = ['/api/auth/login', '/api/auth/refresh', '/api/user/register', '/api/user/reset-password']

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const isSkipped = SKIP_REFRESH.some((ep) => original.url?.includes(ep))

    if ((status === 401 || status === 403) && !original._retry && !isSkipped) {
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        original._retry = true
        try {
          const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken })
          const { accessToken, refreshToken: newRefresh } = data.data
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefresh)
          original.headers.Authorization = `Bearer ${accessToken}`
          return axiosClient(original)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return
        }
      }

      if (status === 401) {
        window.location.href = '/login'
        return
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
