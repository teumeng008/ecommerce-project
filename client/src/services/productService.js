import apiClient from '../api/client';

export const productService = {
  getProducts: () => apiClient.get('/product').then((res) => res.data),
  getProductById: (id) => apiClient.get(`/product/${id}`).then((res) => res.data),
};
