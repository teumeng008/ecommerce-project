import apiClient from '../api/client';

export const userService = {
  getMe: () => apiClient.get('/users/me').then((res) => res.data),
  updateMe: (payload) => apiClient.put('/users/me', payload).then((res) => res.data),
  changePassword: (payload) => apiClient.put('/users/me/password', payload).then((res) => res.data),
};
