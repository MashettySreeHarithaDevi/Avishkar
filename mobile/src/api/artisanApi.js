import apiClient from './client';

export const createArtisanProfile = async (
  profileData
) => {

  const response =
    await apiClient.post(
      '/artisans',
      profileData
    );

  return response.data;
};


export const getMyArtisanProfile =
  async () => {

    const response =
      await apiClient.get(
        '/artisans/me'
      );

    return response.data;
  };