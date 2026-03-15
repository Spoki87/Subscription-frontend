import axiosClient from './axiosClient'

export const register = (username, email, password) =>
  axiosClient.post('/api/user/register', { username, email, password })

export const confirmEmail = (token) =>
  axiosClient.get('/api/user/confirm', { params: { token } })

export const changePassword = (currentPassword, newPassword) =>
  axiosClient.post('/api/user/change-password', { currentPassword, newPassword })

export const changeCurrency = (currency) =>
  axiosClient.patch('/api/user/currency', { currency })

export const resetPassword = (email) =>
  axiosClient.post('/api/user/reset-password', { email })

export const setNewPassword = (token, newPassword) =>
  axiosClient.post('/api/user/set-new-password', { token, newPassword })
