import apiClient from '../api/client';

export const cartService = {
  getCart: () => apiClient.get('/cart').then((res) => res.data),
  addItem: (productId, quantity = 1) =>
    apiClient.post(`/cart/items/${productId}`, { quantity }).then((res) => res.data),
  updateItem: (productId, quantity) =>
    apiClient.put(`/cart/items/${productId}`, { quantity }).then((res) => res.data),
  removeItem: (productId) => apiClient.delete(`/cart/items/${productId}`).then((res) => res.data),
  clearCart: () => apiClient.delete('/cart').then((res) => res.data),
};
