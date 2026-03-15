import axiosClient from './axiosClient'

export const getSubscriptions = (page = 0, size = 100) =>
  axiosClient.get('/api/subscriptions', { params: { page, size } })

export const getSubscription = (id) =>
  axiosClient.get(`/api/subscriptions/${id}`)

export const createSubscription = (data) =>
  axiosClient.post('/api/subscriptions', data)

export const updateSubscription = (id, data) =>
  axiosClient.put(`/api/subscriptions/${id}`, data)

export const deleteSubscription = (id) =>
  axiosClient.delete(`/api/subscriptions/${id}`)
