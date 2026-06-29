import apiClient from '../api/client';

export const adminService = {
  getAllUsers: () => apiClient.get('/admin/users').then((res) => res.data),
  updateUserRole: (userId, role) => apiClient.put(`/admin/users/${userId}/role`, { role }).then((res) => res.data),
  getAllProducts: () => apiClient.get('/admin/products').then((res) => res.data),
  createProduct: (payload) => apiClient.post('/product', payload).then((res) => res.data),
  updateProduct: (productId, payload) => apiClient.put(`/product/${productId}`, payload).then((res) => res.data),
  deleteProduct: (productId) => apiClient.delete(`/product/${productId}`),
};
