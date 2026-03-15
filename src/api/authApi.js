import axiosClient from './axiosClient'

export const login = (email, password) =>
  axiosClient.post('/api/auth/login', { email, password })

export const refresh = (refreshToken) =>
  axiosClient.post('/api/auth/refresh', { refreshToken })

export const logout = (refreshToken) =>
  axiosClient.post('/api/auth/logout', { refreshToken })
