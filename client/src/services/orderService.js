import apiClient from '../api/client';

export const orderService = {
  checkout: (payload) => apiClient.post('/orders/checkout', payload).then((res) => res.data),
  getOrders: () => apiClient.get('/orders').then((res) => res.data),
  getOrderById: (id) => apiClient.get(`/orders/${id}`).then((res) => res.data),
};
