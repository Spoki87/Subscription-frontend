import axiosClient from './axiosClient'

export const register = (username, email, password) =>
  axiosClient.post('/api/user/register', { username, email, password })

export const confirmEmail = (token) =>
  axiosClient.get('/api/user/confirm', { params: { token } })

export const changePassword = (oldPassword, newPassword) =>
  axiosClient.post('/api/user/change-password', { oldPassword, newPassword })

export const resetPassword = () =>
  axiosClient.post('/api/user/reset-password')

export const setNewPassword = (token, newPassword) =>
  axiosClient.post('/api/user/set-new-password', { token, newPassword })
