import apiClient from '../api/client';

export const categoryService = {
  getCategories: () => apiClient.get('/categories').then((res) => res.data),
};
