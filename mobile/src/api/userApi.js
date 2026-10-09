import apiClient from './client';

export const getMyProfile = async () => {
  const response = await apiClient.get('/users/me');
  return response.data;
};